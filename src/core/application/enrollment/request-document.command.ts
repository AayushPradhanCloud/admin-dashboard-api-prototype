import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';
import { EVENT_PUBLISHER, type IEventPublisher } from '~/core/application/ports/event-publisher.port';
import { EntityNotFoundException } from '~/core/domain/example/exceptions';

/**
 * Admin action: record a received document and publish
 * `enrollment.application.document-received` back to the benefit-store peer.
 */
export class RequestDocumentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly documentType: string,
    public readonly requestedBy: string,
  ) {}
}

/**
 * Handler for {@link RequestDocumentCommand}.
 */
@CommandHandler(RequestDocumentCommand)
export class RequestDocumentCommandHandler implements ICommandHandler<RequestDocumentCommand, void> {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher,
  ) {}

  /**
   * @param command - The document-received command.
   * @returns Nothing.
   */
  async execute(command: RequestDocumentCommand): Promise<void> {
    const enrollment = await this.repo.findById(command.id);
    if (!enrollment) {
      throw new EntityNotFoundException('Enrollment', command.id);
    }

    enrollment.recordDocumentReceived({ documentType: command.documentType });

    await this.repo.save(enrollment);
    await this.publisher.publishAll(enrollment.pullDomainEvents());
  }
}
