import * as Sentry from '@sentry/nestjs';

import { loadEnv } from '~/infrastructure/config/env';

const env = loadEnv();

/**
 * Must be imported before any other module (including `reflect-metadata`) in
 * every entrypoint (main.ts, lambda.ts) so Sentry can instrument Node's core
 * modules before they're required elsewhere. No-op when SENTRY_DSN is unset.
 */
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    release: env.SERVICE_NAME,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });
}
