import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDiscussionDto {
  @ApiProperty({ example: 123 })
  @IsNumber()
  @IsNotEmpty()
  issueUid: number;

  @ApiProperty({ example: 'I am working on a fix for this.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  author: string;
}

export class UpdateDiscussionDto {
  @ApiProperty({ example: 123 })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @ApiProperty({ example: 'Updated comment content.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class DeleteDiscussionDto {
  @ApiProperty({ example: 123 })
  @IsNumber()
  @IsNotEmpty()
  uid: number;
}
