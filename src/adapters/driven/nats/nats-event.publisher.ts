import { Injectable, Logger } from '@nestjs/common';

import { StringCodec } from 'nats';

import { type IEventPublisher } from '~/core/application/ports/event-publisher.port';
import { DomainEvent } from '~/core/domain/example/domain-event.base';

import { NatsClient } from './nats.client';

/**
 * Publishes outbound integration events to NATS using the CloudEvents 1.0 envelope
 * defined in benefit-store-api/NATS_EVENT_CONTRACT.md. The event `type` doubles as
 * the NATS subject (e.g. `enrollment.application.document-received`).
 */
@Injectable()
export class NatsEventPublisher implements IEventPublisher {
  private readonly logger = new Logger(NatsEventPublisher.name);
  private readonly sc = StringCodec();

  constructor(private readonly natsClient: NatsClient) {}

  async publish(event: DomainEvent<unknown>): Promise<void> {
    const js = this.natsClient.jetstream();
    const subject = event.type; // subjects mirror the event type in this contract

    const envelope = {
      specversion: event.specversion,
      id: event.id,
      source: event.source,
      type: event.type,
      datacontenttype: event.datacontenttype,
      time: event.time,
      correlationid: event.correlationId ?? event.id,
      data: event.data,
    };

    try {
      await js.publish(subject, this.sc.encode(JSON.stringify(envelope)));
      this.logger.debug(`Published event ${event.id} to ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.id} to ${subject}`, error);
      throw error;
    }
  }

  async publishAll(events: readonly DomainEvent<unknown>[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
