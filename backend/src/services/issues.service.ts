import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { issues, discussions } from '../database/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { CreateIssueDto, UpdateIssueDto, DeleteIssueDto, AnalyzeIssueDto } from '../dto/issue.dto';
import { AiService } from './ai.service';
import { IssuePriority, IssueStatus } from '../enums/issue.enum';

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

  async seed() {
    const insertedIssues = await this.drizzleService.db
      .insert(issues)
      .values([
        {
          title: 'Network latency issues in US-East-1',
          description:
            'Several users are reporting 500ms+ latency when accessing the platform from US-East-1 region. Initial traces suggest a bottleneck in the database connection pool.',
          status: IssueStatus.OPEN,
          priority: IssuePriority.URGENT,
        },
        {
          title: 'Fix broken footer links in documentation',
          description:
            'The "Terms of Service" and "Privacy Policy" links in the documentation footer are currently pointing to a non-existent 404 page.',
          status: IssueStatus.IN_PROGRESS,
          priority: IssuePriority.LOW,
        },
        {
          title: 'Implement OAuth2 login with Google',
          description:
            'Add Google OAuth2 support as a new login method. This involves registering the app in the Google Cloud Console and implementing the backend flow.',
          status: IssueStatus.OPEN,
          priority: IssuePriority.HIGH,
        },
        {
          title: 'Memory leak in image processing worker',
          description:
            'The background worker responsible for resizing profile pictures seems to have a memory leak. Heap usage increases continuously over time until the container crashes.',
          status: IssueStatus.OPEN,
          priority: IssuePriority.HIGH,
        },
        {
          title: 'Upgrade dependencies to latest stable versions',
          description:
            'A routine maintenance task to upgrade all project dependencies (NestJS, Next.js, Drizzle) to their latest stable versions for security and performance.',
          status: IssueStatus.RESOLVED,
          priority: IssuePriority.MEDIUM,
        },
        {
          title: 'Inconsistent button styling on mobile',
          description:
            'The "Submit" button in the contact form is missing its gradient when viewed on iOS devices using Safari.',
          status: IssueStatus.OPEN,
          priority: IssuePriority.MEDIUM,
        },
      ])
      .returning();

    const discussionsData = [
      {
        issueUid: insertedIssues[0].uid,
        content:
          'I have started investigating the traces. It seems like the RDS instance is hitting CPU spikes.',
        author: 'Mark Thompson',
      },
      {
        issueUid: insertedIssues[0].uid,
        content:
          'I noticed the same. I will increase the connection pool size to see if it helps.',
        author: 'Sarah Jenkins',
      },
      {
        issueUid: insertedIssues[0].uid,
        content: 'Pool size increased. Monitoring now.',
        author: 'Sarah Jenkins',
      },
      {
        issueUid: insertedIssues[2].uid,
        content:
          'I already have the Google Cloud Console project ready. I can share the client IDs.',
        author: 'Alex Chen',
      },
      {
        issueUid: insertedIssues[3].uid,
        content: 'I suspect the sharp library is not releasing buffers correctly.',
        author: 'Mark Thompson',
      },
    ];

    await this.drizzleService.db.insert(discussions).values(discussionsData);

    return {
      seeded: true,
      issuesCount: insertedIssues.length,
      discussionsCount: discussionsData.length,
    };
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
