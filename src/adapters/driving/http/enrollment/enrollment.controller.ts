/* eslint-disable jsdoc/require-returns */
import { Body, Controller, Get, Param, Patch, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '~/common/decorators/roles.decorator';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard';
import { RolesGuard } from '~/common/guards/roles.guard';
import { GetEnrollmentQuery, type GetEnrollmentResult } from '~/core/application/enrollment/get-enrollment.query';
import { ListEnrollmentsQuery, type ListEnrollmentsResult } from '~/core/application/enrollment/list-enrollments.query';
import { UpdateEnrollmentCommand } from '~/core/application/enrollment/update-enrollment.command';

import { EnrollmentResponseDto, ListEnrollmentsQueryDto, UpdateEnrollmentDto } from './enrollment.dto';

/**
 *
 */
@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'enrollments', version: '1' })
export class EnrollmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   *
   * @param query
   */
  @Get()
  @Roles('admin', 'enrollment-manager')
  @ApiOperation({ summary: 'List enrollments (paginated)' })
  list(@Query() query: ListEnrollmentsQueryDto): Promise<ListEnrollmentsResult> {
    return this.queryBus.execute(
      new ListEnrollmentsQuery(query.page ?? 1, query.pageSize ?? 20, query.search, query.status),
    );
  }

  /**
   *
   * @param id
   */
  @Get(':id')
  @Roles('admin', 'enrollment-manager')
  @ApiOperation({ summary: 'Get an enrollment by ID' })
  @ApiResponse({ status: 200, type: EnrollmentResponseDto })
  async get(@Param('id') id: string): Promise<GetEnrollmentResult> {
    const result = await this.queryBus.execute<GetEnrollmentQuery, GetEnrollmentResult | null>(
      new GetEnrollmentQuery(id),
    );

    if (!result) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return result;
  }

  /**
   *
   * @param id
   * @param body
   */
  @Patch(':id')
  @Roles('admin', 'enrollment-manager')
  @ApiOperation({ summary: 'Update an enrollment' })
  async update(@Param('id') id: string, @Body() body: UpdateEnrollmentDto): Promise<void> {
    try {
      await this.commandBus.execute(
        new UpdateEnrollmentCommand(
          id,
          body.planId,
          body.status,
          body.effectiveDate ? new Date(body.effectiveDate) : undefined,
        ),
      );
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'Enrollment not found') {
        throw new NotFoundException(`Enrollment with ID ${id} not found`);
      }
      throw e;
    }
  }
}
