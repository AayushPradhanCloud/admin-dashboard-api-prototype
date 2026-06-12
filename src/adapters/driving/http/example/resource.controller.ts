import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateResourceCommand, type CreateResourceResult } from '~/core/application/example/create-resource.command';
import { ListResourcesQuery, type ListResourcesResult } from '~/core/application/example/list-resources.query';

import { CreateResourceDto, ListResourcesQueryDto, ResourceResponseDto } from './resource.dto';

/**
 * Driving adapter — HTTP. This is the ONLY layer where Swagger decorators live.
 * Controllers MUST NOT contain business logic; they translate HTTP to CQRS messages.
 */
@ApiTags('resources')
@Controller({ path: 'resources', version: '1' })
export class ResourceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Creates a new resource.
   * @param body - Validated request payload (name + optional description).
   * @returns The newly created resource.
   * @throws {ValidationException} If `body` fails DTO validation.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a resource' })
  @ApiResponse({ status: 201, type: ResourceResponseDto })
  create(@Body() body: CreateResourceDto): Promise<CreateResourceResult> {
    return this.commandBus.execute(new CreateResourceCommand(body.name, body.description ?? null, 'system'));
  }

  /**
   * Lists resources with pagination and optional search.
   * @param query - Pagination and search parameters.
   * @returns A page of resources matching the query.
   */
  @Get()
  @ApiOperation({ summary: 'List resources (paginated)' })
  list(@Query() query: ListResourcesQueryDto): Promise<ListResourcesResult> {
    return this.queryBus.execute(new ListResourcesQuery(query.page ?? 1, query.pageSize ?? 20, query.search));
  }
}
