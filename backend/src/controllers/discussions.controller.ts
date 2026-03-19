import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiscussionsService } from '../services/discussions.service';
import { CreateDiscussionDto, UpdateDiscussionDto, DeleteDiscussionDto } from '../dto/discussion.dto';

@ApiTags('discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a discussion comment to an issue' })
  create(@Body() createDiscussionDto: CreateDiscussionDto) {
    return this.discussionsService.create(createDiscussionDto);
  }

  @Get('get_all_by_issue/:issueUid')
  @ApiOperation({ summary: 'Get all discussions for a specific issue' })
  findByIssue(
    @Param('issueUid', ParseIntPipe) issueUid: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? Number(page) : 1;
    const l = limit ? Number(limit) : 10;
    return this.discussionsService.findByIssue(issueUid, p, l);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update a discussion comment' })
  update(@Body() updateDiscussionDto: UpdateDiscussionDto) {
    return this.discussionsService.update(updateDiscussionDto);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete a discussion comment' })
  remove(@Body() deleteDiscussionDto: DeleteDiscussionDto) {
    return this.discussionsService.remove(deleteDiscussionDto);
  }
}