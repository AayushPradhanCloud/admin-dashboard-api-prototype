import { ValidationException } from '~/core/domain/example/exceptions';
import { ResourceCreatedEvent } from '~/core/domain/example/resource-events';
import { Resource } from '~/core/domain/example/resource.entity';

describe('Resource (domain)', () => {
  describe('create', () => {
    it('creates a valid resource and raises ResourceCreatedEvent', () => {
      const r = Resource.create({ name: 'Widget A', description: 'demo' });
      expect(r.id).toBeDefined();
      expect(r.name).toBe('Widget A');
      expect(r.active).toBe(true);

      const events = r.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ResourceCreatedEvent);
      expect(events[0]?.type).toBe('example.resource.created');
    });

    it('trims whitespace from the name', () => {
      const r = Resource.create({ name: '  Trim me  ' });
      expect(r.name).toBe('Trim me');
    });

    it('clears pending events after pullDomainEvents()', () => {
      const r = Resource.create({ name: 'Widget B' });
      r.pullDomainEvents();
      expect(r.pullDomainEvents()).toHaveLength(0);
    });

    it.each([
      ['empty', ''],
      ['too short', 'A'],
      ['too long', 'X'.repeat(121)],
    ])('rejects name that is %s', (_label, name) => {
      expect(() => Resource.create({ name })).toThrow(ValidationException);
    });
  });

  describe('mutations', () => {
    it('rename validates and updates timestamp', async () => {
      const r = Resource.create({ name: 'Original' });
      const before = r.updatedAt.getTime();
      await new Promise((res) => {
        setTimeout(res, 5);
      });
      r.rename('Renamed');
      expect(r.name).toBe('Renamed');
      expect(r.updatedAt.getTime()).toBeGreaterThan(before);
    });

    it('deactivate marks inactive', () => {
      const r = Resource.create({ name: 'Active' });
      r.deactivate();
      expect(r.active).toBe(false);
    });
  });
});
