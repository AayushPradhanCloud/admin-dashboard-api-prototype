import { Injectable, type OnModuleDestroy, type OnModuleInit, Logger } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

/**
 * Prisma client wrapped as a Nest singleton.
 *
 * Adds two cross-cutting behaviors via Prisma client extensions:
 *   1. Soft delete  — `.softDelete(id)` writes `deletedAt`, and SELECTs filter out
 *      deleted rows by default.
 *   2. Audit fields — `createdBy` / `updatedBy` populated from request-scoped context.
 *
 * Request context (correlationId, userId) is propagated via the CorrelationIdMiddleware
 * + a small AsyncLocalStorage helper (see common/middleware/request-context.ts).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });

    // Query performance logging (Prisma events).
    (this as unknown as { $on: (e: string, cb: (ev: unknown) => void) => void }).$on('warn', (ev) => {
      this.log.warn(ev);
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
