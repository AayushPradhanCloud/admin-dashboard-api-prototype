import { v4 as uuidv4 } from 'uuid';

import { DomainEvent } from '~/core/domain/example/domain-event.base';

/**
 * Outbound integration events this service publishes BACK to the benefit-store
 * enrollment API over NATS. Subjects/types and payloads follow
 * `benefit-store-api/NATS_EVENT_CONTRACT.md` (the "Consumed Events" section).
 *
 * `source` is set to this service so the peer can tell who emitted the event.
 */
const SOURCE = 'nuera-admin-api';

/** Payload for `enrollment.application.document-received`. */
export interface DocumentReceivedPayload {
  enrollmentId: string;
  documentType: string;
  receivedAt: string;
}

/** Payload for `enrollment.application.support-requested`. */
export interface SupportRequestedPayload {
  enrollmentId: string;
  requestedBy: string;
  requestedAt: string;
  message: string;
}

/** Raised when an admin records that a document was received for an enrollment. */
export class DocumentReceivedEvent extends DomainEvent<DocumentReceivedPayload> {
  constructor(payload: DocumentReceivedPayload, correlationId?: string) {
    super(uuidv4(), 'enrollment.application.document-received', SOURCE, payload, correlationId);
  }
}

/** Raised when an admin requests support / escalates an enrollment. */
export class SupportRequestedEvent extends DomainEvent<SupportRequestedPayload> {
  constructor(payload: SupportRequestedPayload, correlationId?: string) {
    super(uuidv4(), 'enrollment.application.support-requested', SOURCE, payload, correlationId);
  }
}
