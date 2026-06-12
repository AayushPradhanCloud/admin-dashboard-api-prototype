import { v4 as uuidv4 } from 'uuid';

import { AggregateRoot } from '~/core/domain/example/aggregate-root.base';

import { EnrollmentUpdatedEvent } from './enrollment-events';

export class Enrollment extends AggregateRoot {
  private constructor(
    id: string,
    private _memberId: string,
    private _planId: string,
    private _status: string,
    private _effectiveDate: Date,
    private _source: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id);
  }

  // ---------- Factories ----------
  static create(input: {
    memberId: string;
    planId: string;
    status: string;
    effectiveDate: Date;
    source?: string | null;
  }): Enrollment {
    const now = new Date();
    const id = uuidv4();
    const enrollment = new Enrollment(
      id,
      input.memberId,
      input.planId,
      input.status,
      input.effectiveDate,
      input.source ?? null,
      now,
      now,
    );
    // Note: Consumer creates this based on NATS event, so no DomainEvent raised on create to avoid echo
    return enrollment;
  }

  static rehydrate(state: {
    id: string;
    memberId: string;
    planId: string;
    status: string;
    effectiveDate: Date;
    source: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Enrollment {
    return new Enrollment(
      state.id,
      state.memberId,
      state.planId,
      state.status,
      state.effectiveDate,
      state.source,
      state.createdAt,
      state.updatedAt,
    );
  }

  // ---------- Behavior ----------
  update(input: { planId?: string; status?: string; effectiveDate?: Date }): void {
    if (input.planId !== undefined) {
      this._planId = input.planId;
    }
    if (input.status !== undefined) {
      this._status = input.status;
    }
    if (input.effectiveDate !== undefined) {
      this._effectiveDate = input.effectiveDate;
    }

    this._updatedAt = new Date();

    this.addDomainEvent(
      new EnrollmentUpdatedEvent({
        enrollmentId: this.id,
        memberId: this._memberId,
        planId: this._planId,
        status: this._status,
        effectiveDate: this._effectiveDate.toISOString(),
        occurredAt: this._updatedAt.toISOString(),
      }),
    );
  }

  // ---------- Getters ----------
  get memberId(): string {
    return this._memberId;
  }

  get planId(): string {
    return this._planId;
  }

  get status(): string {
    return this._status;
  }

  get effectiveDate(): Date {
    return this._effectiveDate;
  }

  get source(): string | null {
    return this._source;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
