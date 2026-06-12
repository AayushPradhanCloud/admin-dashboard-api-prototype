import { Injectable, Logger } from '@nestjs/common';

import type { IEventPublisher } from '~/core/application/ports/event-publisher.port';
import type { DomainEvent } from '~/core/domain/example/domain-event.base';

/**
 * No-op event publisher for development / when no message broker is configured.
 * Logs every event instead of publishing to an external bus.
 * Swap this for a real broker adapter (NATS, SQS, Kafka…) via the IEventPublisher port.
 */
@Injectable()
export class LocalEventPublisher implements IEventPublisher {
  private readonly log = new Logger(LocalEventPublisher.name);

  publish(event: DomainEvent): Promise<void> {
    this.log.debug(`[event] ${event.type} id=${event.id}`);
    return Promise.resolve();
  }

  async publishAll(events: readonly DomainEvent[]): Promise<void> {
    for (const e of events) await this.publish(e);
  }
}
