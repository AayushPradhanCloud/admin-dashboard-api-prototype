import { Inject } from '@nestjs/common';
import { QueryHandler, type IQuery, type IQueryHandler } from '@nestjs/cqrs';

import { RESOURCE_REPOSITORY, type IResourceRepository } from '~/core/application/ports/resource.repository';

/** Query: a read-side request for a paginated, optionally filtered list of resources. */
export class ListResourcesQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly search: string | undefined,
  ) {}
}

/** A page of resources, with pagination metadata. */
export interface ListResourcesResult {
  items: { id: string; name: string; description: string | null; active: boolean }[];
  total: number;
  page: number;
  pageSize: number;
}

/** Handles {@link ListResourcesQuery} by reading a paginated set of resources from the repository. */
@QueryHandler(ListResourcesQuery)
export class ListResourcesQueryHandler implements IQueryHandler<ListResourcesQuery, ListResourcesResult> {
  constructor(@Inject(RESOURCE_REPOSITORY) private readonly repo: IResourceRepository) {}

  /**
   * Retrieves a page of resources, optionally filtered by a search term.
   * @param query - The pagination and search parameters.
   * @returns The matching page of resources and pagination metadata.
   */
  async execute(query: ListResourcesQuery): Promise<ListResourcesResult> {
    const result = await this.repo.paginate({
      page: query.page,
      pageSize: query.pageSize,
      ...(query.search !== undefined ? { search: query.search } : {}),
    });
    return {
      items: result.items.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        active: r.active,
      })),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
