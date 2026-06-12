/* eslint-disable jsdoc/require-returns */
import { Inject } from '@nestjs/common';
import { QueryHandler, type IQuery, type IQueryHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';

/**
 *
 */
export class GetEnrollmentQuery implements IQuery {
  constructor(public readonly id: string) {}
}

/**
 *
 */
export interface GetEnrollmentResult {
  id: string;
  memberId: string;
  planId: string;
  status: string;
  effectiveDate: string;
  source: string | null;
}

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
      memberId: enrollment.memberId,
      planId: enrollment.planId,
      status: enrollment.status,
      effectiveDate: enrollment.effectiveDate.toISOString(),
      source: enrollment.source,
    };
  }
}
