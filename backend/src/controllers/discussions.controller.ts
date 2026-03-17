import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiscussionsService } from '../services/discussions.service';
import { CreateDiscussionDto } from '../dto/discussion.dto';

@ApiTags('discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a discussion comment to an issue' })
  create(@Body() createDiscussionDto: CreateDiscussionDto) {
    return this.discussionsService.create(createDiscussionDto);
  }

  @Get('issue/:issueUid')
  @ApiOperation({ summary: 'Get all discussions for a specific issue' })
  findByIssue(@Param('issueUid', ParseUUIDPipe) issueUid: string) {
    return this.discussionsService.findByIssue(issueUid);
  }
}
