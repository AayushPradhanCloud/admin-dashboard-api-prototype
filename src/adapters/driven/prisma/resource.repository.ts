import { Injectable } from '@nestjs/common';

import type { IResourceRepository, PaginatedResult } from '~/core/application/ports/resource.repository';
import { Resource } from '~/core/domain/example/resource.entity';

import { PrismaService } from './prisma.service';

interface ResourceRow {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Driven adapter implementing IResourceRepository over Prisma + PostgreSQL.
 * Translates between the Prisma row shape and the domain aggregate.
 */
@Injectable()
export class PrismaResourceRepository implements IResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Resource | null> {
    const row = await (
      this.prisma as unknown as { resource: { findFirst: (a: unknown) => Promise<ResourceRow | null> } }
    ).resource.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async paginate(params: { page: number; pageSize: number; search?: string }): Promise<PaginatedResult<Resource>> {
    const skip = (params.page - 1) * params.pageSize;
    const where = {
      deletedAt: null,
      ...(params.search ? { name: { contains: params.search, mode: 'insensitive' as const } } : {}),
    };
    const client = this.prisma as unknown as {
      resource: {
        findMany: (a: unknown) => Promise<ResourceRow[]>;
        count: (a: unknown) => Promise<number>;
      };
    };
    const [rows, total] = await Promise.all([
      client.resource.findMany({ where, skip, take: params.pageSize, orderBy: { createdAt: 'desc' } }),
      client.resource.count({ where }),
    ]);
    return {
      items: rows.map((r) => this.toDomain(r)),
      total,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  async save(resource: Resource): Promise<void> {
    const client = this.prisma as unknown as {
      resource: { upsert: (a: unknown) => Promise<unknown> };
    };
    await client.resource.upsert({
      where: { id: resource.id },
      create: {
        id: resource.id,
        name: resource.name,
        description: resource.description,
        active: resource.active,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
      },
      update: {
        name: resource.name,
        description: resource.description,
        active: resource.active,
        updatedAt: resource.updatedAt,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    const client = this.prisma as unknown as { resource: { update: (a: unknown) => Promise<unknown> } };
    await client.resource.update({ where: { id }, data: { deletedAt: new Date(), active: false } });
  }

  private toDomain(row: ResourceRow): Resource {
    return Resource.rehydrate({
      id: row.id,
      name: row.name,
      description: row.description,
      active: row.active,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
