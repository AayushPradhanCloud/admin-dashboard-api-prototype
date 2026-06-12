import type { Enrollment } from '~/core/domain/enrollment/enrollment.entity';

/** A page of items, with pagination metadata. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Outbound port for persisting and querying {@link Enrollment} aggregates. */
export interface IEnrollmentRepository {
  /**
   * Finds an enrollment by its identifier.
   */
  findById(id: string): Promise<Enrollment | null>;

  /**
   * Finds an enrollment by memberId and planId.
   */
  findByMemberAndPlan(memberId: string, planId: string): Promise<Enrollment | null>;

  /**
   * Returns a paginated, optionally filtered list of enrollments.
   */
  paginate(params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResult<Enrollment>>;

  /**
   * Persists an enrollment, creating or updating it as needed.
   */
  save(enrollment: Enrollment): Promise<void>;
}

export const ENROLLMENT_REPOSITORY = Symbol('IEnrollmentRepository');
