// eslint-disable-next-line import/order
import '~/infrastructure/instrument';

import 'reflect-metadata';

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import serverlessExpress from '@codegenie/serverless-express';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler } from 'aws-lambda';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';

import { AppModule } from '~/infrastructure/app.module';
import { loadEnv } from '~/infrastructure/config/env';

type LambdaHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

let cachedHandler: LambdaHandler | undefined;

async function bootstrap(): Promise<LambdaHandler> {
  if (cachedHandler) return cachedHandler;

  const env = loadEnv();
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { bufferLogs: true });

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
  app.enableCors({ origin: env.CORS_ALLOWED_ORIGINS, credentials: true });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: env.API_PREFIX.replace(/^v/, '') });
  await app.init();

  cachedHandler = serverlessExpress<APIGatewayProxyEventV2, APIGatewayProxyResultV2>({ app: expressApp });
  return cachedHandler;
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Parameters<LambdaHandler>[2],
): Promise<APIGatewayProxyResultV2 | void> => {
  const h = await bootstrap();
  return h(event, context, callback);
};
