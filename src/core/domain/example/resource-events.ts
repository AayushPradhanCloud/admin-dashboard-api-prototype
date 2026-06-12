import { v4 as uuidv4 } from 'uuid';

import { DomainEvent } from '~/core/domain/example/domain-event.base';

export interface ResourceCreatedPayload {
  resourceId: string;
  name: string;
  occurredAt: string;
}

export class ResourceCreatedEvent extends DomainEvent<ResourceCreatedPayload> {
  constructor(payload: ResourceCreatedPayload, correlationId?: string) {
    super(uuidv4(), 'example.resource.created', 'nest/api', payload, correlationId);
  }
}
