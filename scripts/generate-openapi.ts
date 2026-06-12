import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '~/infrastructure/app.module';

/**
 * Emits openapi.json to the repo root. Downstream tooling:
 *   - `pnpm postman:generate` turns it into a Postman collection
 *   - the web boilerplate's orval generates a typed TanStack Query client from it
 */
async function generate(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const config = new DocumentBuilder()
    .setTitle('nest API')
    .setDescription('nest NestJS boilerplate API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  const out = path.resolve(process.cwd(), 'openapi.json');
  writeFileSync(out, JSON.stringify(doc, null, 2));
  // eslint-disable-next-line no-console
  console.log(`✅ wrote ${out}`);
  await app.close();
}

generate().catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
