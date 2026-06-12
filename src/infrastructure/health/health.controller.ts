import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';

import { PrismaService } from '~/adapters/driven/prisma/prisma.service';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks: {
    database: boolean;
  };
}

/**
 * Liveness/readiness probe. Returns the structured health payload directly
 * (bypassing the global response envelope) so monitoring tooling can rely on
 * a stable `{ status, timestamp, checks }` shape and HTTP 200/503 status codes.
 */
@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness/readiness probe with database connectivity check' })
  @ApiResponse({ status: 200, description: 'All checks passed' })
  @ApiResponse({ status: 503, description: 'One or more checks failed' })
  async liveness(@Res() res: Response): Promise<void> {
    const databaseHealthy = await this.checkDatabase();
    const result: HealthCheckResult = {
      status: databaseHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: { database: databaseHealthy },
    };
    res.status(databaseHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).json(result);
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
