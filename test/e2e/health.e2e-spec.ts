import type { Server } from 'node:http';

import { type INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import request from 'supertest';

import { PrismaService } from '~/adapters/driven/prisma/prisma.service';
import { HealthController } from '~/infrastructure/health/health.controller';

interface HealthResponseBody {
  status: string;
  timestamp: string;
  checks: { database: boolean };
}

/**
 * Minimal e2e — bootstraps just the HealthController (with a stubbed PrismaService)
 * to demonstrate the supertest pattern without requiring the full local stack.
 * Extend by importing AppModule once Postgres/NATS are reachable from CI.
 */
describe('Health (e2e)', () => {
  let app: INestApplication;
  let queryRaw: jest.Mock;

  beforeAll(async () => {
    queryRaw = jest.fn();
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: { $queryRaw: queryRaw } }],
    }).compile();
    app = moduleRef.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /v1/health returns 200 with status healthy when the database is reachable', async () => {
    queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
    const res = await request(app.getHttpServer() as Server)
      .get('/v1/health')
      .expect(200);
    const body = res.body as HealthResponseBody;
    expect(body.status).toBe('healthy');
    expect(body.checks.database).toBe(true);
    expect(typeof body.timestamp).toBe('string');
  });

  it('GET /v1/health returns 503 with status unhealthy when the database is unreachable', async () => {
    queryRaw.mockRejectedValueOnce(new Error('connection refused'));
    const res = await request(app.getHttpServer() as Server)
      .get('/v1/health')
      .expect(503);
    const body = res.body as HealthResponseBody;
    expect(body.status).toBe('unhealthy');
    expect(body.checks.database).toBe(false);
  });
});
