import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IssuesService } from '../services/issues.service';
import { CreateIssueDto, UpdateIssueDto } from '../dto/issue.dto';

@ApiTags('issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiResponse({ status: 201, description: 'The issue has been successfully created.' })
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all issues' })
  findAll() {
    return this.issuesService.findAll();
  }

  @Get(':uid')
  @ApiOperation({ summary: 'Get an issue by UID with discussions' })
  findOne(@Param('uid', ParseUUIDPipe) uid: string) {
    return this.issuesService.findOne(uid);
  }

  @Patch(':uid')
  @ApiOperation({ summary: 'Update an issue' })
  update(
    @Param('uid', ParseUUIDPipe) uid: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.update(uid, updateIssueDto);
  }

  @Post(':uid/analyze')
  @ApiOperation({ summary: 'Trigger AI analysis for an issue' })
  analyze(@Param('uid', ParseUUIDPipe) uid: string) {
    return this.issuesService.analyze(uid);
  }

  @Delete(':uid')
  @ApiOperation({ summary: 'Delete an issue' })
  remove(@Param('uid', ParseUUIDPipe) uid: string) {
    return this.issuesService.remove(uid);
  }
}
