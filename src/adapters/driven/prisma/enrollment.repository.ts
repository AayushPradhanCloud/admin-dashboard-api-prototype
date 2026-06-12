import { Injectable } from '@nestjs/common';

import type { IEnrollmentRepository, PaginatedResult } from '~/core/application/ports/enrollment.repository';
import { Enrollment } from '~/core/domain/enrollment/enrollment.entity';

import { PrismaService } from './prisma.service';

interface EnrollmentRow {
  id: string;
  memberId: string;
  planId: string;
  status: string;
  effectiveDate: Date;
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

@Injectable()
export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Enrollment | null> {
    const row = await (
      this.prisma as unknown as { enrollment: { findFirst: (a: unknown) => Promise<EnrollmentRow | null> } }
    ).enrollment.findFirst({
      where: { id, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async findByMemberAndPlan(memberId: string, planId: string): Promise<Enrollment | null> {
    const row = await (
      this.prisma as unknown as { enrollment: { findFirst: (a: unknown) => Promise<EnrollmentRow | null> } }
    ).enrollment.findFirst({
      where: { memberId, planId, deletedAt: null },
    });
    return row ? this.toDomain(row) : null;
  }

  async paginate(params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
  }): Promise<PaginatedResult<Enrollment>> {
    const skip = (params.page - 1) * params.pageSize;
    const where = {
      deletedAt: null,
      ...(params.search
        ? {
            OR: [
              { memberId: { contains: params.search, mode: 'insensitive' as const } },
              { planId: { contains: params.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const client = this.prisma as unknown as {
      enrollment: {
        findMany: (a: unknown) => Promise<EnrollmentRow[]>;
        count: (a: unknown) => Promise<number>;
      };
    };

    const [rows, total] = await Promise.all([
      client.enrollment.findMany({ where, skip, take: params.pageSize, orderBy: { createdAt: 'desc' } }),
      client.enrollment.count({ where }),
    ]);

    return {
      items: rows.map((r) => this.toDomain(r)),
      total,
      page: params.page,
      pageSize: params.pageSize,
    };
  }

  async save(enrollment: Enrollment): Promise<void> {
    const client = this.prisma as unknown as {
      enrollment: { upsert: (a: unknown) => Promise<unknown> };
    };

    await client.enrollment.upsert({
      where: { id: enrollment.id },
      create: {
        id: enrollment.id,
        memberId: enrollment.memberId,
        planId: enrollment.planId,
        status: enrollment.status,
        effectiveDate: enrollment.effectiveDate,
        source: enrollment.source,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
      },
      update: {
        status: enrollment.status,
        effectiveDate: enrollment.effectiveDate,
        updatedAt: enrollment.updatedAt,
      },
    });
  }

  private toDomain(row: EnrollmentRow): Enrollment {
    return Enrollment.rehydrate({
      id: row.id,
      memberId: row.memberId,
      planId: row.planId,
      status: row.status,
      effectiveDate: row.effectiveDate,
      source: row.source,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
