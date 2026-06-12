// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding…');

  // Truncate (idempotent local seed).
  await (prisma as unknown as { resource: { deleteMany: () => Promise<unknown> } }).resource.deleteMany();

  const rows = Array.from({ length: 25 }).map(() => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    active: faker.datatype.boolean(0.9),
  }));

  await (prisma as unknown as { resource: { createMany: (a: unknown) => Promise<unknown> } }).resource.createMany({
    data: rows,
  });

  // eslint-disable-next-line no-console
  console.log(`✅ Seeded ${rows.length} resources.`);

  // Enrollment applications normally arrive over NATS from the benefit-store API;
  // seed a few so the dashboard isn't empty without a live broker.
  const enrollmentClient = prisma as unknown as {
    enrollment: {
      deleteMany: () => Promise<unknown>;
      createMany: (a: unknown) => Promise<unknown>;
    };
  };
  await enrollmentClient.enrollment.deleteMany();

  const enrollments = Array.from({ length: 12 }).map((_, i) => {
    const submitted = i % 2 === 0;
    const initiatedAt = faker.date.recent({ days: 14 });
    return {
      enrollmentId: faker.string.uuid(),
      planId: `plan-${faker.number.int({ min: 100, max: 999 })}`,
      applicantId: faker.datatype.boolean(0.8) ? faker.string.uuid() : null,
      status: submitted ? 'SUBMITTED' : 'INITIATED',
      referenceNumber: submitted ? `REF-${faker.string.alphanumeric(8).toUpperCase()}` : null,
      initiatedAt,
      submittedAt: submitted ? faker.date.between({ from: initiatedAt, to: new Date() }) : null,
      source: 'nuera-enrollment-api',
    };
  });

  await enrollmentClient.enrollment.createMany({ data: enrollments });

  // eslint-disable-next-line no-console
  console.log(`✅ Seeded ${enrollments.length} enrollment applications.`);
}

main()
  .catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch(console.error);
  });
