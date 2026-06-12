// eslint-disable-next-line import/order
import '~/infrastructure/instrument';

import 'reflect-metadata';

import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from '~/infrastructure/app.module';
import { loadEnv } from '~/infrastructure/config/env';

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Security & perf — see CTS Section 5.6 for the mandated header set.
  // X-XSS-Protection and Permissions-Policy are added by SecurityHeadersMiddleware.
  app.use(
    helmet({
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: false,
    }),
  );
  app.use(compression());
  app.enableCors({
    origin: env.CORS_ALLOWED_ORIGINS.length === 0 ? false : env.CORS_ALLOWED_ORIGINS,
    credentials: true,
  });

  // URL-based versioning: every route lives under /v1
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: env.API_PREFIX.replace(/^v/, '') });

  // Swagger (disabled in production)
  if (env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('nest API')
      .setDescription('nest NestJS boilerplate API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const doc = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, doc, { swaggerOptions: { persistAuthorization: true } });
  }

  app.enableShutdownHooks();
  await app.listen(env.APP_PORT);
  Logger.log(`🚀  ${env.SERVICE_NAME} running on http://localhost:${env.APP_PORT} (${env.NODE_ENV})`, 'Bootstrap');
}

void bootstrap();
