import { Injectable, type NestMiddleware } from '@nestjs/common';

import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const HEADER = 'x-correlation-id';

/**
 * Reads or generates a correlation ID for each inbound request and exposes it as:
 *   - request header `x-correlation-id`
 *   - response header `x-correlation-id`
 *
 * Downstream code reads it from req.headers and propagates it through outbound calls.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const incoming = req.headers[HEADER];
    const id = (Array.isArray(incoming) ? incoming[0] : incoming) ?? uuidv4();
    req.headers[HEADER] = id;
    res.setHeader(HEADER, id);
    next();
  }
}
