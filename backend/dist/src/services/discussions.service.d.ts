import { DrizzleService } from '../database/drizzle.service';
import { CreateDiscussionDto } from '../dto/discussion.dto';
export declare class DiscussionsService {
    private drizzleService;
    constructor(drizzleService: DrizzleService);
    create(createDiscussionDto: CreateDiscussionDto): Promise<{
        uid: string;
        createdAt: Date;
        issueUid: string;
        content: string;
        author: string;
    }>;
    findByIssue(issueUid: string): Promise<{
        uid: string;
        issueUid: string;
        content: string;
        author: string;
        createdAt: Date;
    }[]>;
}
