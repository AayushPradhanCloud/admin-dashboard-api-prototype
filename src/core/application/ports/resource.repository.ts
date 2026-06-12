import type { Resource } from '~/core/domain/example/resource.entity';

/** A page of items, with pagination metadata. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Outbound port for persisting and querying {@link Resource} aggregates. */
export interface IResourceRepository {
  /**
   * Finds a resource by its identifier.
   * @param id - The resource identifier.
   * @returns The matching resource, or `null` if none exists.
   */
  findById(id: string): Promise<Resource | null>;

  /**
   * Returns a paginated, optionally filtered list of resources.
   * @param params - Pagination parameters and an optional search term.
   * @param params.page - The 1-based page number to retrieve.
   * @param params.pageSize - The number of items per page.
   * @param params.search - An optional case-insensitive search term.
   * @returns The matching page of resources.
   */
  paginate(params: { page: number; pageSize: number; search?: string }): Promise<PaginatedResult<Resource>>;

  /**
   * Persists a resource, creating or updating it as needed.
   * @param resource - The resource aggregate to persist.
   * @returns A promise that resolves once the resource has been saved.
   */
  save(resource: Resource): Promise<void>;

  /**
   * Marks a resource as deleted without removing its row.
   * @param id - The identifier of the resource to soft-delete.
   * @returns A promise that resolves once the resource has been soft-deleted.
   */
  softDelete(id: string): Promise<void>;
}

export const RESOURCE_REPOSITORY = Symbol('IResourceRepository');
