import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../database/drizzle.service';
import { discussions } from '../database/schema';
import { eq } from 'drizzle-orm';
import { CreateDiscussionDto } from '../dto/discussion.dto';

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

  async findByIssue(issueUid: string) {
    return this.drizzleService.db
      .select()
      .from(discussions)
      .where(eq(discussions.issueUid, issueUid));
  }
}
