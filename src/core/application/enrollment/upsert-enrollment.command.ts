/* eslint-disable jsdoc/require-returns */
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, type ICommandHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';
import { Enrollment } from '~/core/domain/enrollment/enrollment.entity';

/**
 *
 */
export class UpsertEnrollmentCommand implements ICommand {
  constructor(
    public readonly memberId: string,
    public readonly planId: string,
    public readonly status: string,
    public readonly effectiveDate: Date,
    public readonly source?: string,
  ) {}
}

/**
 *
 */
export interface UpsertEnrollmentResult {
  id: string;
}

/**
 *
 */
@CommandHandler(UpsertEnrollmentCommand)
export class UpsertEnrollmentCommandHandler implements ICommandHandler<
  UpsertEnrollmentCommand,
  UpsertEnrollmentResult
> {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository) {}

  /**
   *
   * @param command
   */
  async execute(command: UpsertEnrollmentCommand): Promise<UpsertEnrollmentResult> {
    let enrollment = await this.repo.findByMemberAndPlan(command.memberId, command.planId);

    if (enrollment) {
      enrollment.update({
        status: command.status,
        effectiveDate: command.effectiveDate,
      });
      // Do not pull events and do not publish them here. We just consume.
      // If we called update(), it adds an event, but we ignore it to avoid echo.
      enrollment.pullDomainEvents(); // Clear them out
    } else {
      enrollment = Enrollment.create({
        memberId: command.memberId,
        planId: command.planId,
        status: command.status,
        effectiveDate: command.effectiveDate,
        source: command.source ?? null,
      });
      enrollment.pullDomainEvents(); // Clear them out just in case
    }

    await this.repo.save(enrollment);

    return { id: enrollment.id };
  }
}
