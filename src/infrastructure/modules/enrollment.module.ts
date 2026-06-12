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
import { RecordEnrollmentInitiatedCommandHandler } from '~/core/application/enrollment/record-initiated.command';
import { RecordEnrollmentSubmittedCommandHandler } from '~/core/application/enrollment/record-submitted.command';
import { RequestDocumentCommandHandler } from '~/core/application/enrollment/request-document.command';
import { RequestSupportCommandHandler } from '~/core/application/enrollment/request-support.command';
import { ENROLLMENT_REPOSITORY } from '~/core/application/ports/enrollment.repository';
import { EVENT_PUBLISHER } from '~/core/application/ports/event-publisher.port';

const HANDLERS = [
  RecordEnrollmentInitiatedCommandHandler,
  RecordEnrollmentSubmittedCommandHandler,
  RequestDocumentCommandHandler,
  RequestSupportCommandHandler,
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
