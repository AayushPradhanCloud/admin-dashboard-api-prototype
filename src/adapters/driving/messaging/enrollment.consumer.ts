import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { StringCodec } from 'nats';

import { NatsClient } from '~/adapters/driven/nats/nats.client';
import { RecordEnrollmentInitiatedCommand } from '~/core/application/enrollment/record-initiated.command';
import { RecordEnrollmentSubmittedCommand } from '~/core/application/enrollment/record-submitted.command';
// eslint-disable-next-line boundaries/element-types
import { loadEnv } from '~/infrastructure/config/env';

interface CloudEvent<T> {
  type: string;
  source?: string;
  data: T;
}

interface InitiatedData {
  enrollmentId: string;
  planId: string;
  applicantId: string | null;
  initiatedAt: string;
}

interface SubmittedData {
  enrollmentId: string;
  referenceNumber: string;
  applicantId: string | null;
  submittedAt: string;
}

/**
 * Consumes inbound enrollment events published by the benefit-store enrollment API
 * (`enrollment.application.initiated` / `.submitted`) and projects them into our DB.
 * See benefit-store-api/NATS_EVENT_CONTRACT.md.
 */
@Injectable()
export class EnrollmentConsumer implements OnModuleInit {
  private readonly logger = new Logger(EnrollmentConsumer.name);
  private readonly sc = StringCodec();

  constructor(
    private readonly natsClient: NatsClient,
    private readonly commandBus: CommandBus,
  ) {}

  async onModuleInit(): Promise<void> {
    const env = loadEnv();
    const js = this.natsClient.jetstream();

    try {
      this.logger.log(`Starting consumer ${env.NATS_DURABLE} on stream ${env.NATS_STREAM}...`);

      const consumer = await js.consumers.get(env.NATS_STREAM, env.NATS_DURABLE);
      const messages = await consumer.consume();

      // Background loop
      (async () => {
        for await (const msg of messages) {
          try {
            const event = JSON.parse(this.sc.decode(msg.data)) as CloudEvent<unknown>;
            await this.dispatch(event);
            msg.ack();
          } catch (error) {
            this.logger.error('Failed to process message', error);
            msg.nak();
          }
        }
      })().catch((err) => this.logger.error('Consumer loop failed', err));
    } catch (error) {
      this.logger.error(
        `Failed to get consumer ${env.NATS_DURABLE} for stream ${env.NATS_STREAM}. Ensure it's created.`,
        error,
      );
    }
  }

  private async dispatch(event: CloudEvent<unknown>): Promise<void> {
    const env = loadEnv();

    switch (event.type) {
      case env.NATS_SUBJECT_INITIATED: {
        const data = event.data as InitiatedData;
        this.logger.debug(`Received initiated for enrollment ${data.enrollmentId}`);
        await this.commandBus.execute(
          new RecordEnrollmentInitiatedCommand(
            data.enrollmentId,
            data.planId,
            data.applicantId ?? null,
            new Date(data.initiatedAt),
            event.source,
          ),
        );
        break;
      }
      case env.NATS_SUBJECT_SUBMITTED: {
        const data = event.data as SubmittedData;
        this.logger.debug(`Received submitted for enrollment ${data.enrollmentId}`);
        await this.commandBus.execute(
          new RecordEnrollmentSubmittedCommand(
            data.enrollmentId,
            data.referenceNumber,
            data.applicantId ?? null,
            new Date(data.submittedAt),
            event.source,
          ),
        );
        break;
      }
      default:
        // Subjects we publish ourselves (document-received / support-requested) or
        // anything else on the stream — nothing to project, just ack.
        this.logger.debug(`Ignoring event type ${event.type}`);
    }
  }
}
