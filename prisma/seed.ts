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
}

main()
  .catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
