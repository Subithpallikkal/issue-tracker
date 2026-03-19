import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { issues, discussions } from '../database/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { CreateIssueDto, UpdateIssueDto, DeleteIssueDto, AnalyzeIssueDto } from '../dto/issue.dto';
import { AiService } from './ai.service';

@Injectable()
export class IssuesService {
  constructor(
    private drizzleService: DrizzleService,
    private aiService: AiService,
  ) {}

  async create(createIssueDto: CreateIssueDto) {
    const [issue] = await this.drizzleService.db
      .insert(issues)
      .values(createIssueDto)
      .returning();
    return issue;
  }

  async findAll(page = 1, limit = 10) {
    const safeLimit = Math.min(Math.max(limit || 10, 1), 100);
    const safePage = Math.max(page || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const [{ count }] = await this.drizzleService.db
      .select({ count: sql<number>`count(*)` })
      .from(issues);

    const items = await this.drizzleService.db
      .select()
      .from(issues)
      .orderBy(desc(issues.createdAt))
      .limit(safeLimit)
      .offset(offset);

    return {
      items,
      total: Number(count) || 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  async findOne(uid: number) {
    const [issue] = await this.drizzleService.db
      .select()
      .from(issues)
      .where(eq(issues.uid, uid));
    
    if (!issue) {
      throw new NotFoundException(`Issue with UID ${uid} not found`);
    }

    const issueDiscussions = await this.drizzleService.db
      .select()
      .from(discussions)
      .where(eq(discussions.issueUid, uid));

    return { ...issue, discussions: issueDiscussions };
  }

  async update(updateIssueDto: UpdateIssueDto) {
    const { uid, ...updateData } = updateIssueDto;
    const [issue] = await this.drizzleService.db
      .update(issues)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(issues.uid, uid))
      .returning();

    if (!issue) {
      throw new NotFoundException(`Issue with UID ${uid} not found`);
    }

    return issue;
  }

  async analyze(analyzeIssueDto: AnalyzeIssueDto) {
    const { uid, detailed } = analyzeIssueDto;
    const issueWithDiscussions = await this.findOne(uid);
    const discussionTexts = issueWithDiscussions.discussions.map(d => d.content);
    
    const analysis = await this.aiService.analyzeIssue(
      issueWithDiscussions.title,
      issueWithDiscussions.description,
      discussionTexts,
      detailed,
    );

    const [updatedIssue] = await this.drizzleService.db
      .update(issues)
      .set({ aiAnalysis: analysis, updatedAt: new Date() })
      .where(eq(issues.uid, uid))
      .returning();

    return updatedIssue;
  }

  async remove(deleteIssueDto: DeleteIssueDto) {
    const { uid } = deleteIssueDto;
    const [issue] = await this.drizzleService.db
      .delete(issues)
      .where(eq(issues.uid, uid))
      .returning();

    if (!issue) {
      throw new NotFoundException(`Issue with UID ${uid} not found`);
    }

    return { deleted: true };
  }
}
