import { v4 as uuidv4 } from 'uuid';

import { DomainEvent } from '~/core/domain/example/domain-event.base';

export interface EnrollmentUpdatedPayload {
  enrollmentId: string;
  memberId: string;
  planId: string;
  status: string;
  effectiveDate: string;
  occurredAt: string;
}

export class EnrollmentUpdatedEvent extends DomainEvent<EnrollmentUpdatedPayload> {
  constructor(payload: EnrollmentUpdatedPayload, correlationId?: string) {
    super(uuidv4(), 'enrollment.member.updated', 'nest/api', payload, correlationId);
  }
}
