import { Global, Module } from '@nestjs/common';

import { loadEnv } from '~/infrastructure/config/env';

export const ENV_TOKEN = Symbol('APP_ENV');

@Global()
@Module({
  providers: [
    {
      provide: ENV_TOKEN,
      useFactory: () => loadEnv(),
    },
  ],
  exports: [ENV_TOKEN],
})
export class ConfigModule {}
