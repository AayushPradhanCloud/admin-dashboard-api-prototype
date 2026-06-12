import { Logger } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { ResourceCreatedEvent } from '~/core/domain/example/resource-events';

/**
 * In-process domain event handler.
 *
 * NestJS's @EventsHandler dispatches synchronously inside the same process.
 * Use this for local side effects (audit log, cache invalidation, etc.).
 * External integrations should publish via the IEventPublisher port.
 */
@EventsHandler(ResourceCreatedEvent)
export class ResourceCreatedHandler implements IEventHandler<ResourceCreatedEvent> {
  private readonly logger = new Logger(ResourceCreatedHandler.name);

  /**
   * Reacts to a {@link ResourceCreatedEvent} raised by the domain layer.
   * @param event - The domain event describing the created resource.
   */
  handle(event: ResourceCreatedEvent): void {
    this.logger.debug(`[domain-event] ${event.type} id=${event.data.resourceId}`);
    // TODO: in real services, write to an audit log, invalidate cache, etc.
  }
}
