/* eslint-disable jsdoc/require-returns */
import { Inject } from '@nestjs/common';
import { QueryHandler, type IQuery, type IQueryHandler } from '@nestjs/cqrs';

import { ENROLLMENT_REPOSITORY, type IEnrollmentRepository } from '~/core/application/ports/enrollment.repository';

/**
 *
 */
export class ListEnrollmentsQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly search?: string,
    public readonly status?: string,
  ) {}
}

/**
 *
 */
export interface EnrollmentView {
  id: string;
  enrollmentId: string;
  planId: string;
  applicantId: string | null;
  status: string;
  referenceNumber: string | null;
  initiatedAt: string | null;
  submittedAt: string | null;
  source: string | null;
}

/**
 *
 */
export interface ListEnrollmentsResult {
  items: EnrollmentView[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 *
 */
@QueryHandler(ListEnrollmentsQuery)
export class ListEnrollmentsQueryHandler implements IQueryHandler<ListEnrollmentsQuery, ListEnrollmentsResult> {
  constructor(@Inject(ENROLLMENT_REPOSITORY) private readonly repo: IEnrollmentRepository) {}

  /**
   *
   * @param query
   */
  async execute(query: ListEnrollmentsQuery): Promise<ListEnrollmentsResult> {
    const result = await this.repo.paginate({
      page: query.page,
      pageSize: query.pageSize,
      ...(query.search !== undefined ? { search: query.search } : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
    });

    return {
      items: result.items.map((r) => ({
        id: r.id,
        enrollmentId: r.enrollmentId,
        planId: r.planId,
        applicantId: r.applicantId,
        status: r.status,
        referenceNumber: r.referenceNumber,
        initiatedAt: r.initiatedAt ? r.initiatedAt.toISOString() : null,
        submittedAt: r.submittedAt ? r.submittedAt.toISOString() : null,
        source: r.source,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
