import { type CallHandler, type ExecutionContext, Injectable, Logger, type NestInterceptor } from '@nestjs/common';

import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly log = new Logger('HTTP');

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = ctx.switchToHttp();
    const req = http.getRequest<{
      method: string;
      url: string;
      headers: Record<string, string | undefined>;
      user?: { id?: string };
    }>();
    const res = http.getResponse<{ statusCode: number }>();
    const start = Date.now();
    const correlationId = req.headers['x-correlation-id'];

    return next.handle().pipe(
      tap({
        next: () => {
          this.log.log({
            method: req.method,
            path: req.url,
            status: res.statusCode,
            durationMs: Date.now() - start,
            userId: req.user?.id ?? null,
            correlationId: correlationId ?? null,
          });
        },
        error: (err: Error) => {
          this.log.error({
            method: req.method,
            path: req.url,
            durationMs: Date.now() - start,
            userId: req.user?.id ?? null,
            correlationId: correlationId ?? null,
            error: err.message,
          });
        },
      }),
    );
  }
}
