/* eslint-disable jsdoc/require-returns */
import { Inject } from '@nestjs/common';
import { QueryHandler, type IQuery, type IQueryHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';

import type { EnrollmentView } from './list-enrollments.query';

/**
 *
 */
export class GetEnrollmentQuery implements IQuery {
  constructor(public readonly id: string) {}
}

export type GetEnrollmentResult = EnrollmentView;

/**
 *
 */
@QueryHandler(GetEnrollmentQuery)
export class GetEnrollmentQueryHandler implements IQueryHandler<GetEnrollmentQuery, GetEnrollmentResult | null> {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository) {}

  /**
   *
   * @param query
   */
  async execute(query: GetEnrollmentQuery): Promise<GetEnrollmentResult | null> {
    const enrollment = await this.repo.findById(query.id);
    if (!enrollment) {
      return null;
    }

    return {
      id: enrollment.id,
      enrollmentId: enrollment.enrollmentId,
      planId: enrollment.planId,
      applicantId: enrollment.applicantId,
      status: enrollment.status,
      referenceNumber: enrollment.referenceNumber,
      initiatedAt: enrollment.initiatedAt ? enrollment.initiatedAt.toISOString() : null,
      submittedAt: enrollment.submittedAt ? enrollment.submittedAt.toISOString() : null,
      source: enrollment.source,
    };
  }
}
