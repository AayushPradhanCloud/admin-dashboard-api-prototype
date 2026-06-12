import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';
import { EVENT_PUBLISHER, type IEventPublisher } from '~/core/application/ports/event-publisher.port';
import { EntityNotFoundException } from '~/core/domain/example/exceptions';

/**
 * Admin action: request support / escalate and publish
 * `enrollment.application.support-requested` back to the benefit-store peer.
 */
export class RequestSupportCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly requestedBy: string,
  ) {}
}

/**
 * Handler for {@link RequestSupportCommand}.
 */
@CommandHandler(RequestSupportCommand)
export class RequestSupportCommandHandler implements ICommandHandler<RequestSupportCommand, void> {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher,
  ) {}

  /**
   * @param command - The support-requested command.
   * @returns Nothing.
   */
  async execute(command: RequestSupportCommand): Promise<void> {
    const enrollment = await this.repo.findById(command.id);
    if (!enrollment) {
      throw new EntityNotFoundException('Enrollment', command.id);
    }

    enrollment.requestSupport({ requestedBy: command.requestedBy, message: command.message });

    await this.repo.save(enrollment);
    await this.publisher.publishAll(enrollment.pullDomainEvents());
  }
}
