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
export interface ListEnrollmentsResult {
  items: {
    id: string;
    memberId: string;
    planId: string;
    status: string;
    effectiveDate: string;
    source: string | null;
  }[];
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
        memberId: r.memberId,
        planId: r.planId,
        status: r.status,
        effectiveDate: r.effectiveDate.toISOString(),
        source: r.source,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
