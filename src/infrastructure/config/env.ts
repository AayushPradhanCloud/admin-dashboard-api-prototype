import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

function loadEnvFiles(): void {
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const path = resolve(process.cwd(), file);
    if (existsSync(path)) {
      loadDotenv({ path, override: false, quiet: true });
    }
  }
}

loadEnvFiles();

/**
 * Environment schema (Zod). Validated once at startup; on failure the app exits
 * before listening — fail-fast. This is the ONLY place process.env should be touched.
 */
const EnvSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  SERVICE_NAME: z.string().default('nest-api'),
  APP_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_PREFIX: z.string().default('v1'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Database
  DATABASE_URL: z.string().url(),

  // Keycloak
  KEYCLOAK_BASE_URL: z.string().url(),
  KEYCLOAK_REALM: z.string().min(1),
  KEYCLOAK_CLIENT_ID: z.string().min(1),
  KEYCLOAK_CLIENT_SECRET: z.string().min(1),
  KEYCLOAK_JWKS_URL: z.string().url(),
  KEYCLOAK_ISSUER: z.string().url(),

  // Redis (optional)
  REDIS_URL: z.string().url().optional(),
  CACHE_ENABLED: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),

  // CORS
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default('')
    .transform((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ),

  // Observability
  SENTRY_DSN: z.string().optional(),
  OTEL_ENABLED: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  OTEL_EXPORTER_OTLP_HEADERS: z.string().optional(),

  // Throttling
  THROTTLE_TTL: z.coerce.number().int().positive().default(60),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),

  // Feature flags
  FEATURE_FLAGS_OVERRIDES: z.string().default(''),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cached: AppEnv | undefined;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(source);
  if (!parsed.success) {
    // Print friendly error and exit; the app must not start with bad config.
    const formatted = parsed.error.format();
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment configuration:', JSON.stringify(formatted, null, 2));
    throw new Error('Environment validation failed');
  }
  cached = parsed.data;
  return cached;
}
