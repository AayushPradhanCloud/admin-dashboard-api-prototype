import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 *
 */
export class UpdateEnrollmentDto {
  @ApiPropertyOptional({ example: 'plan-123' })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;
}

/**
 *
 */
export class ListEnrollmentsQueryDto {
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

  @ApiPropertyOptional({ example: 'member-123' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;
}

/**
 *
 */
export class EnrollmentResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() memberId!: string;
  @ApiProperty() planId!: string;
  @ApiProperty() status!: string;
  @ApiProperty() effectiveDate!: string;
  @ApiProperty({ nullable: true }) source!: string | null;
}
