import { type MiddlewareConsumer, Module, type NestModule, RequestMethod, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { LoggerModule } from 'nestjs-pino';

import { PrismaModule } from '~/adapters/driven/prisma/prisma.module';
import { LoggingInterceptor } from '~/common/interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from '~/common/interceptors/response-transform.interceptor';
import { CorrelationIdMiddleware } from '~/common/middleware/correlation-id.middleware';
import { SecurityHeadersMiddleware } from '~/common/middleware/security-headers.middleware';
import { ConfigModule } from '~/infrastructure/config/config.module';
import { loadEnv } from '~/infrastructure/config/env';
import { AllExceptionsFilter } from '~/infrastructure/filters/all-exceptions.filter';
import { HealthController } from '~/infrastructure/health/health.controller';
import { ExampleModule } from '~/infrastructure/modules/example.module';

const env = loadEnv();

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: env.LOG_LEVEL,
        autoLogging: false,
        base: { service: env.SERVICE_NAME, env: env.NODE_ENV },
        ...(env.NODE_ENV === 'development'
          ? {
              transport: {
                target: 'pino-pretty',
                options: { singleLine: true, translateTime: 'SYS:HH:MM:ss.l' },
              },
            }
          : {}),
      },
    }),
    ThrottlerModule.forRoot([{ ttl: env.THROTTLE_TTL * 1000, limit: env.THROTTLE_LIMIT }]),
    PrismaModule,
    ExampleModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: (): ValidationPipe =>
        new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CorrelationIdMiddleware, SecurityHeadersMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
