import { v4 as uuidv4 } from 'uuid';

import { AggregateRoot } from '~/core/domain/example/aggregate-root.base';
import { ValidationException } from '~/core/domain/example/exceptions';
import { ResourceCreatedEvent } from '~/core/domain/example/resource-events';

/**
 * Resource — a nest example aggregate to demonstrate the hexagonal/DDD pattern.
 *
 * Replace this with your real bounded-context aggregate (Agent, Member, Plan, etc.)
 * when copying the boilerplate. Keep the same shape:
 *   - private state, exposed via readonly getters
 *   - static factory `create()` for new instances (raises a domain event)
 *   - static `rehydrate()` for repos rebuilding from storage (no events)
 *   - all mutators validate invariants and may raise events
 */
export class Resource extends AggregateRoot {
  private constructor(
    id: string,
    private _name: string,
    private _description: string | null,
    private _active: boolean,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {
    super(id);
  }

  // ---------- Factories ----------
  static create(input: { name: string; description?: string | null }): Resource {
    Resource.validateName(input.name);
    const now = new Date();
    const id = uuidv4();
    const resource = new Resource(id, input.name.trim(), input.description?.trim() ?? null, true, now, now);
    resource.addDomainEvent(
      new ResourceCreatedEvent({ resourceId: id, name: resource._name, occurredAt: now.toISOString() }),
    );
    return resource;
  }

  static rehydrate(state: {
    id: string;
    name: string;
    description: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Resource {
    return new Resource(state.id, state.name, state.description, state.active, state.createdAt, state.updatedAt);
  }

  // ---------- Behavior ----------
  rename(name: string): void {
    Resource.validateName(name);
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._active = false;
    this._updatedAt = new Date();
  }

  // ---------- Invariants ----------
  private static validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new ValidationException('Resource name must be at least 2 characters.', { name: ['too short'] });
    }
    if (name.trim().length > 120) {
      throw new ValidationException('Resource name must be at most 120 characters.', { name: ['too long'] });
    }
  }

  // ---------- Getters ----------
  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get active(): boolean {
    return this._active;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
