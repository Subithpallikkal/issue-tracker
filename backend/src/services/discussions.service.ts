import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { discussions } from '../database/schema';
import { asc, eq, sql } from 'drizzle-orm';
import { CreateDiscussionDto, UpdateDiscussionDto, DeleteDiscussionDto } from '../dto/discussion.dto';

@Injectable()
export class DiscussionsService {
  constructor(private drizzleService: DrizzleService) {}

  async create(createDiscussionDto: CreateDiscussionDto) {
    const [discussion] = await this.drizzleService.db
      .insert(discussions)
      .values(createDiscussionDto)
      .returning();
    return discussion;
  }

  async findByIssue(issueUid: number, page = 1, limit = 10) {
    const safeLimit = Math.min(Math.max(limit || 10, 1), 100);
    const safePage = Math.max(page || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const [{ count }] = await this.drizzleService.db
      .select({ count: sql<number>`count(*)` })
      .from(discussions)
      .where(eq(discussions.issueUid, issueUid));

    const items = await this.drizzleService.db
      .select()
      .from(discussions)
      .where(eq(discussions.issueUid, issueUid))
      .orderBy(asc(discussions.createdAt))
      .limit(safeLimit)
      .offset(offset);

    return {
      items,
      total: Number(count) || 0,
      page: safePage,
      limit: safeLimit,
    };
  }

  async update(updateDiscussionDto: UpdateDiscussionDto) {
    const { uid, content } = updateDiscussionDto;
    const [discussion] = await this.drizzleService.db
      .update(discussions)
      .set({ content })
      .where(eq(discussions.uid, uid))
      .returning();
    return discussion;
  }

  async remove(deleteDiscussionDto: DeleteDiscussionDto) {
    const { uid } = deleteDiscussionDto;
    await this.drizzleService.db
      .delete(discussions)
      .where(eq(discussions.uid, uid));
    return { deleted: true };
  }
}
