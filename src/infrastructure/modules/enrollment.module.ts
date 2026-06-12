import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { NatsEventPublisher } from '~/adapters/driven/nats/nats-event.publisher';
import { NatsClient } from '~/adapters/driven/nats/nats.client';
import { PrismaEnrollmentRepository } from '~/adapters/driven/prisma/enrollment.repository';
import { PrismaModule } from '~/adapters/driven/prisma/prisma.module';
import { EnrollmentController } from '~/adapters/driving/http/enrollment/enrollment.controller';
import { EnrollmentConsumer } from '~/adapters/driving/messaging/enrollment.consumer';
import { GetEnrollmentQueryHandler } from '~/core/application/enrollment/get-enrollment.query';
import { ListEnrollmentsQueryHandler } from '~/core/application/enrollment/list-enrollments.query';
import { UpdateEnrollmentCommandHandler } from '~/core/application/enrollment/update-enrollment.command';
import { UpsertEnrollmentCommandHandler } from '~/core/application/enrollment/upsert-enrollment.command';
import { ENROLLMENT_REPOSITORY } from '~/core/application/ports/enrollment.repository';
import { EVENT_PUBLISHER } from '~/core/application/ports/event-publisher.port';

const HANDLERS = [
  UpsertEnrollmentCommandHandler,
  UpdateEnrollmentCommandHandler,
  ListEnrollmentsQueryHandler,
  GetEnrollmentQueryHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [EnrollmentController],
  providers: [
    ...HANDLERS,
    NatsClient,
    EnrollmentConsumer,
    { provide: ENROLLMENT_REPOSITORY, useClass: PrismaEnrollmentRepository },
    { provide: EVENT_PUBLISHER, useClass: NatsEventPublisher },
  ],
})
export class EnrollmentModule {}
