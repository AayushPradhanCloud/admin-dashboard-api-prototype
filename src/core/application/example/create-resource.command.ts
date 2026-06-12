import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { EVENT_PUBLISHER, type IEventPublisher } from '~/core/application/ports/event-publisher.port';
import { RESOURCE_REPOSITORY, type IResourceRepository } from '~/core/application/ports/resource.repository';
import { Resource } from '~/core/domain/example/resource.entity';

/**
 * Command: a write-side use-case request. CQRS separates writes (commands) from reads (queries).
 *
 * Flow:
 *   Controller → CommandBus.execute(new CreateResourceCommand(...))
 *     → CreateResourceCommandHandler.execute()
 *       → Resource.create()      (domain enforces invariants)
 *       → repo.save()            (driven adapter)
 *       → eventPublisher.publishAll(domainEvents)  (driven adapter → IEventPublisher port)
 */
export class CreateResourceCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly actorUserId: string | null,
  ) {}
}

/** Result of successfully creating a resource. */
export interface CreateResourceResult {
  id: string;
  name: string;
  description: string | null;
}

/** Handles {@link CreateResourceCommand} by persisting a new resource and publishing its domain events. */
@CommandHandler(CreateResourceCommand)
export class CreateResourceCommandHandler implements ICommandHandler<CreateResourceCommand, CreateResourceResult> {
  constructor(
    @Inject(RESOURCE_REPOSITORY) private readonly repo: IResourceRepository,
    @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher,
  ) {}

  /**
   * Creates and persists a resource, then publishes the resulting domain events.
   * @param command - The create-resource command, with name, description, and actor.
   * @returns The identifiers and attributes of the created resource.
   */
  async execute(command: CreateResourceCommand): Promise<CreateResourceResult> {
    const resource = Resource.create({ name: command.name, description: command.description });
    await this.repo.save(resource);

    const events = resource.pullDomainEvents();
    await this.publisher.publishAll(events);

    return { id: resource.id, name: resource.name, description: resource.description };
  }
}
