import { Global, Module } from '@nestjs/common';

import { AUTH_CONFIG, type AuthConfig } from '~/common/config/auth-config.token';
import { loadEnv } from '~/infrastructure/config/env';

export const ENV_TOKEN = Symbol('APP_ENV');

@Global()
@Module({
  providers: [
    {
      provide: ENV_TOKEN,
      useFactory: () => loadEnv(),
    },
    {
      provide: AUTH_CONFIG,
      useFactory: (): AuthConfig => {
        const env = loadEnv();
        return {
          jwksUrl: env.KEYCLOAK_JWKS_URL,
          issuer: env.KEYCLOAK_ISSUER,
          clientId: env.KEYCLOAK_CLIENT_ID,
        };
      },
    },
  ],
  exports: [ENV_TOKEN, AUTH_CONFIG],
})
export class ConfigModule {}
