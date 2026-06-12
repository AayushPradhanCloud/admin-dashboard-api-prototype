import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

/** Request body for creating a resource. */
export class CreateResourceDto {
  @ApiProperty({ example: 'Acme widget', minLength: 2, maxLength: 120 })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiPropertyOptional({ example: 'A short description of the resource.', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;
}

/** Query string parameters accepted by the resource list endpoint. */
export class ListResourcesQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({ example: 'widget' })
  @IsOptional()
  @IsString()
  search?: string;
}

/** Shape of a resource as returned by the API. */
export class ResourceResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ nullable: true }) description!: string | null;
  @ApiProperty() active!: boolean;
}
