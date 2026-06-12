/* eslint-disable jsdoc/require-returns */
import { Body, Controller, Get, HttpCode, Param, Post, Query, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetEnrollmentQuery, type GetEnrollmentResult } from '~/core/application/enrollment/get-enrollment.query';
import { ListEnrollmentsQuery, type ListEnrollmentsResult } from '~/core/application/enrollment/list-enrollments.query';
import { RequestDocumentCommand } from '~/core/application/enrollment/request-document.command';
import { RequestSupportCommand } from '~/core/application/enrollment/request-support.command';

import {
  EnrollmentResponseDto,
  ListEnrollmentsQueryDto,
  RequestDocumentDto,
  RequestSupportDto,
} from './enrollment.dto';

/**
 * Read API for enrollment applications projected from NATS, plus two write actions
 * that publish integration events back to the benefit-store peer.
 */
@ApiTags('enrollments')
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
  @ApiOperation({ summary: 'List enrollment applications (paginated)' })
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
  @ApiOperation({ summary: 'Get an enrollment application by ID' })
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
   * Record a received document → publishes `enrollment.application.document-received`.
   * @param id
   * @param body
   */
  @Post(':id/documents')
  @HttpCode(202)
  @ApiOperation({ summary: 'Record a received document (publishes document-received to NATS)' })
  async recordDocument(@Param('id') id: string, @Body() body: RequestDocumentDto): Promise<void> {
    await this.commandBus.execute(new RequestDocumentCommand(id, body.documentType, 'system'));
  }

  /**
   * Request support / escalate → publishes `enrollment.application.support-requested`.
   * @param id
   * @param body
   */
  @Post(':id/support-requests')
  @HttpCode(202)
  @ApiOperation({ summary: 'Request support for an enrollment (publishes support-requested to NATS)' })
  async requestSupport(@Param('id') id: string, @Body() body: RequestSupportDto): Promise<void> {
    await this.commandBus.execute(new RequestSupportCommand(id, body.message, 'system'));
  }
}
