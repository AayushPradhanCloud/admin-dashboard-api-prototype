import { HttpStatus } from '@nestjs/common';

import type { Response } from 'express';

import type { PrismaService } from '~/adapters/driven/prisma/prisma.service';
import { HealthController } from '~/infrastructure/health/health.controller';

describe('HealthController', () => {
  let prisma: { $queryRaw: jest.Mock };
  let controller: HealthController;
  let res: { status: jest.Mock<Response, [number]>; json: jest.Mock<Response, [unknown]> };

  beforeEach(() => {
    prisma = { $queryRaw: jest.fn() };
    controller = new HealthController(prisma as unknown as PrismaService);
    res = {
      status: jest.fn().mockReturnThis() as unknown as jest.Mock<Response, [number]>,
      json: jest.fn().mockReturnThis() as unknown as jest.Mock<Response, [unknown]>,
    };
  });

  it('returns 200 with status healthy when the database is reachable', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

    await controller.liveness(res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    const body = res.json.mock.calls[0]?.[0] as { status: string; checks: { database: boolean } };
    expect(body.status).toBe('healthy');
    expect(body.checks.database).toBe(true);
  });

  it('returns 503 with status unhealthy when the database check throws', async () => {
    prisma.$queryRaw.mockRejectedValueOnce(new Error('connection refused'));

    await controller.liveness(res as unknown as Response);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
    const body = res.json.mock.calls[0]?.[0] as { status: string; checks: { database: boolean } };
    expect(body.status).toBe('unhealthy');
    expect(body.checks.database).toBe(false);
  });
});
