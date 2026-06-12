import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

function loadEnvFiles(): void {
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const path = resolve(process.cwd(), file);
    if (existsSync(path)) {
      loadDotenv({ path, override: true, quiet: true });
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
  APP_PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  API_PREFIX: z.string().default('v1'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Database
  DATABASE_URL: z.string().url(),

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

  // NATS — aligned to benefit-store-api/NATS_EVENT_CONTRACT.md
  NATS_URL: z.string().default('nats://localhost:4222'),
  NATS_STREAM: z.string().default('NUERA_ENROLLMENT'),
  NATS_DURABLE: z.string().default('admin-dashboard'),
  // Stream wildcard the dashboard subscribes to (captures every enrollment.application.* event).
  NATS_FILTER_SUBJECT: z.string().default('enrollment.application.*'),
  // Inbound subjects we project into our DB.
  NATS_SUBJECT_INITIATED: z.string().default('enrollment.application.initiated'),
  NATS_SUBJECT_SUBMITTED: z.string().default('enrollment.application.submitted'),
  // Outbound subjects we publish back to the peer (mirror the event types).
  NATS_SUBJECT_DOCUMENT_RECEIVED: z.string().default('enrollment.application.document-received'),
  NATS_SUBJECT_SUPPORT_REQUESTED: z.string().default('enrollment.application.support-requested'),
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
