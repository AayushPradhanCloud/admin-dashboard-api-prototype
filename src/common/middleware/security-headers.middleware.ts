import { Injectable, type NestMiddleware } from '@nestjs/common';

import type { NextFunction, Request, Response } from 'express';

/**
 * Headers required by CTS Section 5.6 that Helmet 7 either dropped
 * (`X-XSS-Protection`, replaced by CSP in modern browsers) or never shipped
 * (`Permissions-Policy`, whose syntax changed too often for Helmet to keep a
 * stable API around it). Set explicitly here for literal compliance.
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(_req: Request, res: Response, next: NextFunction): void {
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
    next();
  }
}
