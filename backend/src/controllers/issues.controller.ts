import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IssuesService } from '../services/issues.service';
import { CreateIssueDto, UpdateIssueDto, DeleteIssueDto, AnalyzeIssueDto } from '../dto/issue.dto';

@ApiTags('issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post() // Assuming create remains POST /issues
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiResponse({ status: 201, description: 'The issue has been successfully created.' })
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @Get('get_all')
  @ApiOperation({ summary: 'Get all issues' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? Number(page) : 1;
    const l = limit ? Number(limit) : 10;
    return this.issuesService.findAll(p, l);
  }
  @Get('get_by_id/:uid')
  @ApiOperation({ summary: 'Get an issue by UID with discussions' })
  findOne(@Param('uid', ParseIntPipe) uid: number) {
    return this.issuesService.findOne(uid);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update an issue' })
  update(@Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(updateIssueDto);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Trigger AI analysis for an issue' })
  analyze(@Body() analyzeIssueDto: AnalyzeIssueDto) {
    return this.issuesService.analyze(analyzeIssueDto);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete an issue' })
  remove(@Body() deleteIssueDto: DeleteIssueDto) {
    return this.issuesService.remove(deleteIssueDto);
  }
}