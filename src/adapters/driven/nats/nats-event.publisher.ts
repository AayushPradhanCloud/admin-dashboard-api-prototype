import { Injectable, Logger } from '@nestjs/common';

import { StringCodec } from 'nats';

import { type IEventPublisher } from '~/core/application/ports/event-publisher.port';
import { DomainEvent } from '~/core/domain/example/domain-event.base';
// eslint-disable-next-line boundaries/element-types
import { loadEnv } from '~/infrastructure/config/env';

import { NatsClient } from './nats.client';

@Injectable()
export class NatsEventPublisher implements IEventPublisher {
  private readonly logger = new Logger(NatsEventPublisher.name);
  private readonly sc = StringCodec();

  constructor(private readonly natsClient: NatsClient) {}

  async publish(event: DomainEvent<unknown>): Promise<void> {
    const env = loadEnv();
    const js = this.natsClient.jetstream();

    try {
      const payload = JSON.stringify(event);
      await js.publish(env.NATS_OUTBOUND_SUBJECT, this.sc.encode(payload));
      this.logger.debug(`Published event ${event.id} to ${env.NATS_OUTBOUND_SUBJECT}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.id}`, error);
      throw error;
    }
  }

  async publishAll(events: DomainEvent<unknown>[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
