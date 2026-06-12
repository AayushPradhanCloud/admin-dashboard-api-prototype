import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import * as Sentry from '@sentry/nestjs';

import {
  BaseException,
  BusinessRuleException,
  EntityNotFoundException,
  InfrastructureException,
  ValidationException,
} from '~/core/domain/example/exceptions';

interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    correlationId: string | null;
    path: string;
  };
}

/**
 * Single global exception filter that maps:
 *   - Domain exceptions    → 4xx with domain code
 *   - HttpException        → respect its status
 *   - Infrastructure / unknown → 500
 *
 * Never leaks stack traces in production; logs the full error server-side and
 * reports 5xx exceptions to Sentry (no-op if SENTRY_DSN is unset).
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly log = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const res = http.getResponse<{ status: (s: number) => { json: (b: unknown) => void } }>();
    const req = http.getRequest<{ url: string; headers: Record<string, string | undefined> }>();
    const correlationId = req.headers['x-correlation-id'] ?? null;

    const { status, code, message, details } = this.classify(exception);

    if (status >= 500) {
      this.log.error({ message, exception });
      Sentry.captureException(exception);
    } else {
      this.log.warn({ code, message });
    }

    const envelope: ErrorEnvelope = {
      success: false,
      error: { code, message, details },
      meta: {
        timestamp: new Date().toISOString(),
        correlationId,
        path: req.url,
      },
    };

    res.status(status).json(envelope);
  }

  private classify(ex: unknown): { status: number; code: string; message: string; details?: unknown } {
    if (ex instanceof ValidationException) {
      return { status: HttpStatus.BAD_REQUEST, code: ex.code, message: ex.message, details: ex.details };
    }
    if (ex instanceof EntityNotFoundException) {
      return { status: HttpStatus.NOT_FOUND, code: ex.code, message: ex.message };
    }
    if (ex instanceof BusinessRuleException) {
      return { status: HttpStatus.UNPROCESSABLE_ENTITY, code: ex.code, message: ex.message };
    }
    if (ex instanceof InfrastructureException) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, code: ex.code, message: ex.message };
    }
    if (ex instanceof BaseException) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, code: ex.code, message: ex.message };
    }
    if (ex instanceof HttpException) {
      const body = ex.getResponse();
      const status = ex.getStatus();
      const message = typeof body === 'string' ? body : ((body as { message?: string }).message ?? ex.message);
      const details = typeof body === 'object' ? body : undefined;
      return { status, code: `HTTP_${status}`, message, details };
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    };
  }
}
