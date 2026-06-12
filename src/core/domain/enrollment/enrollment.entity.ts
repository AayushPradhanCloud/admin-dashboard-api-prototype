import { v4 as uuidv4 } from 'uuid';

import { AggregateRoot } from '~/core/domain/example/aggregate-root.base';
import { ValidationException } from '~/core/domain/example/exceptions';

import { DocumentReceivedEvent, SupportRequestedEvent } from './enrollment-events';

/**
 * Enrollment application aggregate.
 *
 * Mirrors an enrollment application owned by the benefit-store enrollment API.
 * Rows are created/updated from inbound NATS events
 * (`enrollment.application.initiated` / `.submitted`) and never edited directly —
 * the only mutations a dashboard admin can make raise OUTBOUND integration events
 * (`document-received`, `support-requested`) that are published back to the peer.
 */
export type EnrollmentStatus = 'INITIATED' | 'SUBMITTED';

export class Enrollment extends AggregateRoot {
  private constructor(
    id: string,
    private readonly _enrollmentId: string,
    private _planId: string,
    private _applicantId: string | null,
    private _status: EnrollmentStatus,
    private _referenceNumber: string | null,
    private _initiatedAt: Date | null,
    private _submittedAt: Date | null,
    private _source: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id);
  }

  // ---------- Factories ----------

  /** Builds a fresh aggregate from an inbound `enrollment.application.initiated` event. */
  static initiate(input: {
    enrollmentId: string;
    planId: string;
    applicantId: string | null;
    initiatedAt: Date;
    source?: string | null;
  }): Enrollment {
    const now = new Date();
    // No domain event raised — this originates from a consumed event (avoid echo).
    return new Enrollment(
      uuidv4(),
      input.enrollmentId,
      input.planId,
      input.applicantId,
      'INITIATED',
      null,
      input.initiatedAt,
      null,
      input.source ?? null,
      now,
      now,
    );
  }

  static rehydrate(state: {
    id: string;
    enrollmentId: string;
    planId: string;
    applicantId: string | null;
    status: string;
    referenceNumber: string | null;
    initiatedAt: Date | null;
    submittedAt: Date | null;
    source: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Enrollment {
    return new Enrollment(
      state.id,
      state.enrollmentId,
      state.planId,
      state.applicantId,
      state.status as EnrollmentStatus,
      state.referenceNumber,
      state.initiatedAt,
      state.submittedAt,
      state.source,
      state.createdAt,
      state.updatedAt,
    );
  }

  // ---------- Inbound mutations (from consumed NATS events; no domain events raised) ----------

  /** Re-applies an `initiated` event onto an existing row (idempotent upsert). */
  applyInitiated(input: { planId: string; applicantId: string | null; initiatedAt: Date }): void {
    this._planId = input.planId;
    this._applicantId = input.applicantId;
    this._initiatedAt = input.initiatedAt;
    if (this._status !== 'SUBMITTED') {
      this._status = 'INITIATED';
    }
    this._touch();
  }

  /** Applies an `enrollment.application.submitted` event. */
  applySubmitted(input: { referenceNumber: string; applicantId: string | null; submittedAt: Date }): void {
    this._referenceNumber = input.referenceNumber;
    if (input.applicantId !== null) {
      this._applicantId = input.applicantId;
    }
    this._submittedAt = input.submittedAt;
    this._status = 'SUBMITTED';
    this._touch();
  }

  // ---------- Outbound mutations (admin actions; raise integration events) ----------

  /** Records a received document and raises `document-received` for the peer. */
  recordDocumentReceived(input: { documentType: string; receivedAt?: Date }): void {
    const documentType = input.documentType?.trim();
    if (!documentType) {
      throw new ValidationException('documentType is required');
    }
    const receivedAt = input.receivedAt ?? new Date();
    this._touch();
    this.addDomainEvent(
      new DocumentReceivedEvent({
        enrollmentId: this._enrollmentId,
        documentType,
        receivedAt: receivedAt.toISOString(),
      }),
    );
  }

  /** Requests support / escalates and raises `support-requested` for the peer. */
  requestSupport(input: { requestedBy: string; message: string; requestedAt?: Date }): void {
    const message = input.message?.trim();
    if (!message) {
      throw new ValidationException('message is required');
    }
    const requestedAt = input.requestedAt ?? new Date();
    this._touch();
    this.addDomainEvent(
      new SupportRequestedEvent({
        enrollmentId: this._enrollmentId,
        requestedBy: input.requestedBy,
        requestedAt: requestedAt.toISOString(),
        message,
      }),
    );
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }

  // ---------- Getters ----------
  /** The benefit-store enrollment id (the cross-service correlation key). */
  get enrollmentId(): string {
    return this._enrollmentId;
  }

  get planId(): string {
    return this._planId;
  }

  get applicantId(): string | null {
    return this._applicantId;
  }

  get status(): EnrollmentStatus {
    return this._status;
  }

  get referenceNumber(): string | null {
    return this._referenceNumber;
  }

  get initiatedAt(): Date | null {
    return this._initiatedAt;
  }

  get submittedAt(): Date | null {
    return this._submittedAt;
  }

  get source(): string | null {
    return this._source;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
