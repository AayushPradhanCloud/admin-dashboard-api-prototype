import type { Server } from 'node:http';

import { type INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import helmet from 'helmet';
import request from 'supertest';

import { PrismaService } from '~/adapters/driven/prisma/prisma.service';
import { SecurityHeadersMiddleware } from '~/common/middleware/security-headers.middleware';
import { HealthController } from '~/infrastructure/health/health.controller';

/**
 * Asserts that every security header mandated by CTS Section 5.6 is present
 * on a sample response, mirroring the Helmet + SecurityHeadersMiddleware
 * configuration applied in main.ts/lambda.ts.
 */
describe('Security headers (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: { $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]) } },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(
      helmet({
        frameguard: { action: 'deny' },
        hsts: { maxAge: 31536000, includeSubDomains: true },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: false,
      }),
    );
    app.use(new SecurityHeadersMiddleware().use);
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('sets all CTS Section 5.6 security headers on every response', async () => {
    const res = await request(app.getHttpServer() as Server)
      .get('/v1/health')
      .expect(200);

    expect(res.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-xss-protection']).toBe('1; mode=block');
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['permissions-policy']).toBe('geolocation=(), microphone=()');
  });
});
