import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';
import { Enrollment } from '~/core/domain/enrollment/enrollment.entity';

import type { RecordEnrollmentResult } from './record-initiated.command';

/**
 * Inbound projection of `enrollment.application.submitted`.
 * Dispatched by the NATS consumer. If the `initiated` event was missed (out-of-order
 * delivery), a minimal row is created first, then marked submitted. Never publishes.
 */
export class RecordEnrollmentSubmittedCommand implements ICommand {
  constructor(
    public readonly enrollmentId: string,
    public readonly referenceNumber: string,
    public readonly applicantId: string | null,
    public readonly submittedAt: Date,
    public readonly source?: string,
  ) {}
}

/**
 * Handler for {@link RecordEnrollmentSubmittedCommand}.
 */
@CommandHandler(RecordEnrollmentSubmittedCommand)
export class RecordEnrollmentSubmittedCommandHandler implements ICommandHandler<
  RecordEnrollmentSubmittedCommand,
  RecordEnrollmentResult
> {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository) {}

  /**
   * @param command - The inbound submitted command.
   * @returns The internal id of the persisted enrollment.
   */
  async execute(command: RecordEnrollmentSubmittedCommand): Promise<RecordEnrollmentResult> {
    let enrollment = await this.repo.findByEnrollmentId(command.enrollmentId);

    if (!enrollment) {
      // Out-of-order: submitted arrived before initiated. Create a placeholder.
      enrollment = Enrollment.initiate({
        enrollmentId: command.enrollmentId,
        planId: 'unknown',
        applicantId: command.applicantId,
        initiatedAt: command.submittedAt,
        source: command.source ?? null,
      });
    }

    enrollment.applySubmitted({
      referenceNumber: command.referenceNumber,
      applicantId: command.applicantId,
      submittedAt: command.submittedAt,
    });

    enrollment.pullDomainEvents();
    await this.repo.save(enrollment);

    return { id: enrollment.id };
  }
}
