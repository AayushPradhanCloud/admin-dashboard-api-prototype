import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';

import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  message: string;
  meta: {
    timestamp: string;
    correlationId: string | null;
  };
}

/**
 * Wraps every controller response in a standard envelope:
 *   { success: true, data, message, meta: { timestamp, correlationId } }
 *
 * Errors are handled separately by AllExceptionsFilter, which emits the failure envelope.
 */
@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, SuccessEnvelope<T>> {
  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<SuccessEnvelope<T>> {
    const req = ctx.switchToHttp().getRequest<{ headers?: Record<string, string | undefined> }>();
    const correlationId = req.headers?.['x-correlation-id'] ?? null;
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data,
        message: 'OK',
        meta: {
          timestamp: new Date().toISOString(),
          correlationId,
        },
      })),
    );
  }
}
