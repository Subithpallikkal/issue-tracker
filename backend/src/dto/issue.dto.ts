import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
