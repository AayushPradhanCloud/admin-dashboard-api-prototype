import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { StringCodec } from 'nats';

import { NatsClient } from '~/adapters/driven/nats/nats.client';
import { UpsertEnrollmentCommand } from '~/core/application/enrollment/upsert-enrollment.command';
// eslint-disable-next-line boundaries/element-types
import { loadEnv } from '~/infrastructure/config/env';

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
      this.logger.log(`Starting consumer on ${env.NATS_INBOUND_SUBJECT}...`);

      const consumer = await js.consumers.get(env.NATS_STREAM, env.NATS_DURABLE);
      const messages = await consumer.consume();

      // Background loop
      (async () => {
        for await (const msg of messages) {
          try {
            const rawData = this.sc.decode(msg.data);
            const cloudevent = JSON.parse(rawData) as {
              type: string;
              source?: string;
              data: { memberId: string; planId: string; status: string; effectiveDate: string };
            };

            if (cloudevent.type === 'enrollment.member.enrolled') {
              const { data, source } = cloudevent;
              this.logger.debug(`Received enrollment.member.enrolled for member ${data.memberId}`);

              await this.commandBus.execute(
                new UpsertEnrollmentCommand(
                  data.memberId,
                  data.planId,
                  data.status,
                  new Date(data.effectiveDate),
                  source,
                ),
              );
            }

            msg.ack();
          } catch (error) {
            this.logger.error('Failed to process message', error);
            msg.nak();
          }
        }
      })().catch((err) => this.logger.error('Consumer loop failed', err));
    } catch (error) {
      // If consumer does not exist, log error. Production apps might create it dynamically or rely on terraform.
      this.logger.error(
        `Failed to get consumer ${env.NATS_DURABLE} for stream ${env.NATS_STREAM}. Ensure it's created.`,
        error,
      );
    }
  }
}
