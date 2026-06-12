import {
  CreateResourceCommand,
  CreateResourceCommandHandler,
} from '~/core/application/example/create-resource.command';
import type { IEventPublisher } from '~/core/application/ports/event-publisher.port';
import type { IResourceRepository } from '~/core/application/ports/resource.repository';

describe('CreateResourceCommandHandler', () => {
  let repo: jest.Mocked<IResourceRepository>;
  let publisher: jest.Mocked<IEventPublisher>;
  let handler: CreateResourceCommandHandler;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      paginate: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
      softDelete: jest.fn(),
    };
    publisher = {
      publish: jest.fn().mockResolvedValue(undefined),
      publishAll: jest.fn().mockResolvedValue(undefined),
    };
    handler = new CreateResourceCommandHandler(repo, publisher);
  });

  it('persists the resource and publishes its domain events', async () => {
    const result = await handler.execute(new CreateResourceCommand('Test', 'desc', 'user-1'));

    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(publisher.publishAll).toHaveBeenCalledTimes(1);
    const publishedEvents = publisher.publishAll.mock.calls[0]?.[0] ?? [];
    expect(publishedEvents).toHaveLength(1);
    expect(publishedEvents[0]?.type).toBe('example.resource.created');
    expect(result.name).toBe('Test');
  });

  it('does not publish when persistence fails', async () => {
    repo.save.mockRejectedValueOnce(new Error('db down'));
    await expect(handler.execute(new CreateResourceCommand('Valid Name', null, null))).rejects.toThrow('db down');
    expect(publisher.publishAll).not.toHaveBeenCalled();
  });
});
