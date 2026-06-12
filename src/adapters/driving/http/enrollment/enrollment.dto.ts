import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

/**
 * Body for `POST /enrollments/:id/documents` — records a received document and
 * publishes `enrollment.application.document-received` back to the peer.
 */
export class RequestDocumentDto {
  @ApiProperty({ example: 'proof-of-address' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  documentType!: string;
}

/**
 * Body for `POST /enrollments/:id/support-requests` — escalates and publishes
 * `enrollment.application.support-requested` back to the peer.
 */
export class RequestSupportDto {
  @ApiProperty({ example: 'Applicant cannot complete identity verification.' })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  message!: string;
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

  @ApiPropertyOptional({
    example: 'enr-123',
    description: 'Matches enrollmentId, planId, applicantId or referenceNumber',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'SUBMITTED', enum: ['INITIATED', 'SUBMITTED'] })
  @IsOptional()
  @IsIn(['INITIATED', 'SUBMITTED'])
  status?: string;
}

/**
 *
 */
export class EnrollmentResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() enrollmentId!: string;
  @ApiProperty() planId!: string;
  @ApiProperty({ nullable: true }) applicantId!: string | null;
  @ApiProperty({ enum: ['INITIATED', 'SUBMITTED'] }) status!: string;
  @ApiProperty({ nullable: true }) referenceNumber!: string | null;
  @ApiProperty({ nullable: true }) initiatedAt!: string | null;
  @ApiProperty({ nullable: true }) submittedAt!: string | null;
  @ApiProperty({ nullable: true }) source!: string | null;
}
