/**
 * Base aggregate root for domain entities.
 *
 * Pure TypeScript. No framework decorators, no ORM annotations. Domain entities
 * own their invariants and emit domain events; persistence is a concern for adapters.
 */
import type { DomainEvent } from '~/core/domain/example/domain-event.base';

export abstract class AggregateRoot {
  private readonly _domainEvents: DomainEvent[] = [];

  protected constructor(public readonly id: string) {}

  /** Append a domain event to be dispatched after a successful persistence transaction. */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /** Read & clear pending events (called by the application layer after `save`). */
  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  equals(other: AggregateRoot | null | undefined): boolean {
    return other instanceof AggregateRoot && other.id === this.id;
  }
}
