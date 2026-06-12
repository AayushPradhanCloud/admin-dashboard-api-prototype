import { Global, Module } from '@nestjs/common';

import { RESOURCE_REPOSITORY } from '~/core/application/ports/resource.repository';

import { PrismaService } from './prisma.service';
import { PrismaResourceRepository } from './resource.repository';

@Global()
@Module({
  providers: [PrismaService, { provide: RESOURCE_REPOSITORY, useClass: PrismaResourceRepository }],
  exports: [PrismaService, RESOURCE_REPOSITORY],
})
export class PrismaModule {}
