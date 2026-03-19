import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { IssuePriority, IssueStatus } from '../enums/issue.enum';

export class CreateIssueDto {
  @ApiProperty({ example: 'Bug in login page' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The login button is not working on mobile devices.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: IssuePriority, default: IssuePriority.MEDIUM })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;
}

export class UpdateIssueDto {
  @ApiProperty({ example: 123 })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @ApiPropertyOptional({ example: 'Bug in login page updated' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: IssueStatus })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @ApiPropertyOptional({ enum: IssuePriority })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;
}

export class DeleteIssueDto {
  @ApiProperty({ example: 123 })
  @IsNumber()
  @IsNotEmpty()
  uid: number;
}

export class AnalyzeIssueDto {
  @ApiProperty({ example: 123 })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  detailed?: boolean;
}
