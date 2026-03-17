import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { issues, discussions } from '../database/schema';
import { eq } from 'drizzle-orm';
import { CreateIssueDto, UpdateIssueDto } from '../dto/issue.dto';
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

  async findAll() {
    return this.drizzleService.db.select().from(issues);
  }

  async findOne(uid: string) {
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

  async update(uid: string, updateIssueDto: UpdateIssueDto) {
    const [issue] = await this.drizzleService.db
      .update(issues)
      .set({ ...updateIssueDto, updatedAt: new Date() })
      .where(eq(issues.uid, uid))
      .returning();

    if (!issue) {
      throw new NotFoundException(`Issue with UID ${uid} not found`);
    }

    return issue;
  }

  async analyze(uid: string) {
    const issueWithDiscussions = await this.findOne(uid);
    const discussionTexts = issueWithDiscussions.discussions.map(d => d.content);
    
    const analysis = await this.aiService.analyzeIssue(
      issueWithDiscussions.title,
      issueWithDiscussions.description,
      discussionTexts,
    );

    const [updatedIssue] = await this.drizzleService.db
      .update(issues)
      .set({ aiAnalysis: analysis, updatedAt: new Date() })
      .where(eq(issues.uid, uid))
      .returning();

    return updatedIssue;
  }

  async remove(uid: string) {
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
