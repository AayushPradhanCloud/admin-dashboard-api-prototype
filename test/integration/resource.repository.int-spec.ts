import { execSync } from 'node:child_process';

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';

import { PrismaService } from '~/adapters/driven/prisma/prisma.service';
import { PrismaResourceRepository } from '~/adapters/driven/prisma/resource.repository';
import { Resource } from '~/core/domain/example/resource.entity';

describe('PrismaResourceRepository (integration)', () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaService;
  let repo: PrismaResourceRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine').start();
    process.env.DATABASE_URL = container.getConnectionUri();

    // Apply migrations against the throwaway DB.
    execSync('pnpm prisma migrate deploy --schema=./prisma/schema', {
      env: process.env,
      stdio: 'inherit',
    });

    prisma = new PrismaService();
    await prisma.onModuleInit();
    repo = new PrismaResourceRepository(prisma);
  }, 120_000);

  afterAll(async () => {
    await prisma.onModuleDestroy();
    await container.stop();
  });

  it('round-trips a Resource through save → findById', async () => {
    const resource = Resource.create({ name: 'IntegrationTest', description: 'created in test' });
    await repo.save(resource);

    const loaded = await repo.findById(resource.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.name).toBe('IntegrationTest');
  });

  it('paginate respects page/pageSize', async () => {
    for (let i = 0; i < 5; i += 1) {
      await repo.save(Resource.create({ name: `Bulk-${i}` }));
    }
    const page = await repo.paginate({ page: 1, pageSize: 3 });
    expect(page.items.length).toBe(3);
    expect(page.total).toBeGreaterThanOrEqual(5);
  });

  it('soft-deleted resources are filtered out of findById', async () => {
    const r = Resource.create({ name: 'Doomed' });
    await repo.save(r);
    await repo.softDelete(r.id);
    expect(await repo.findById(r.id)).toBeNull();
  });
});
