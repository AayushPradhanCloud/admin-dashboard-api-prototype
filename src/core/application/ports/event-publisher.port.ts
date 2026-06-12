import type { DomainEvent } from '~/core/domain/example/domain-event.base';

/**
 * Outbound port for publishing integration events to a message broker.
 * Implementations live under adapters/driven (e.g. LocalEventPublisher, or a real broker).
 */
export interface IEventPublisher {
  /**
   * Publishes a single domain event.
   * @param event - The domain event to publish.
   * @returns A promise that resolves once the event has been published.
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publishes a batch of domain events, in order.
   * @param events - The domain events to publish.
   * @returns A promise that resolves once all events have been published.
   */
  publishAll(events: readonly DomainEvent[]): Promise<void>;
}

export const EVENT_PUBLISHER = Symbol('IEventPublisher');
