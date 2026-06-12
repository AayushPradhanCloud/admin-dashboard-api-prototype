import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';
import { EVENT_PUBLISHER, type IEventPublisher } from '~/core/application/ports/event-publisher.port';

/**
 *
 */
export class UpdateEnrollmentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly planId?: string,
    public readonly status?: string,
    public readonly effectiveDate?: Date,
  ) {}
}

/**
 *
 */
@CommandHandler(UpdateEnrollmentCommand)
export class UpdateEnrollmentCommandHandler implements ICommandHandler<UpdateEnrollmentCommand, void> {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository,
    @Inject(EVENT_PUBLISHER) private readonly publisher: IEventPublisher,
  ) {}

  /**
   *
   * @param command
   */
  async execute(command: UpdateEnrollmentCommand): Promise<void> {
    const enrollment = await this.repo.findById(command.id);
    if (!enrollment) {
      throw new Error('Enrollment not found'); // Should map to NotFoundException in controller or domain error
    }

    enrollment.update({
      ...(command.planId !== undefined && { planId: command.planId }),
      ...(command.status !== undefined && { status: command.status }),
      ...(command.effectiveDate !== undefined && { effectiveDate: command.effectiveDate }),
    });

    await this.repo.save(enrollment);

    const events = enrollment.pullDomainEvents();
    await this.publisher.publishAll(events);
  }
}
