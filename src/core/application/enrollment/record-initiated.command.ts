import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';
import { Enrollment } from '~/core/domain/enrollment/enrollment.entity';

/**
 * Inbound projection of `enrollment.application.initiated`.
 * Dispatched by the NATS consumer; idempotent upsert keyed on `enrollmentId`.
 * Never publishes (consuming only — avoids echoing the event back).
 */
export class RecordEnrollmentInitiatedCommand implements ICommand {
  constructor(
    public readonly enrollmentId: string,
    public readonly planId: string,
    public readonly applicantId: string | null,
    public readonly initiatedAt: Date,
    public readonly source?: string,
  ) {}
}

/** Result of an inbound enrollment projection: the internal row id. */
export interface RecordEnrollmentResult {
  id: string;
}

/**
 * Handler for {@link RecordEnrollmentInitiatedCommand}.
 */
@CommandHandler(RecordEnrollmentInitiatedCommand)
export class RecordEnrollmentInitiatedCommandHandler implements ICommandHandler<
  RecordEnrollmentInitiatedCommand,
  RecordEnrollmentResult
> {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository) {}

  /**
   * @param command - The inbound initiated command.
   * @returns The internal id of the persisted enrollment.
   */
  async execute(command: RecordEnrollmentInitiatedCommand): Promise<RecordEnrollmentResult> {
    let enrollment = await this.repo.findByEnrollmentId(command.enrollmentId);

    if (enrollment) {
      enrollment.applyInitiated({
        planId: command.planId,
        applicantId: command.applicantId,
        initiatedAt: command.initiatedAt,
      });
    } else {
      enrollment = Enrollment.initiate({
        enrollmentId: command.enrollmentId,
        planId: command.planId,
        applicantId: command.applicantId,
        initiatedAt: command.initiatedAt,
        source: command.source ?? null,
      });
    }

    // Defensive: never emit events for consumed projections.
    enrollment.pullDomainEvents();
    await this.repo.save(enrollment);

    return { id: enrollment.id };
  }
}
