import { DrizzleService } from '../database/drizzle.service';
import { CreateDiscussionDto, UpdateDiscussionDto, DeleteDiscussionDto } from '../dto/discussion.dto';
export declare class DiscussionsService {
    private drizzleService;
    constructor(drizzleService: DrizzleService);
    create(createDiscussionDto: CreateDiscussionDto): Promise<{
        uid: number;
        createdAt: Date;
        issueUid: number;
        content: string;
        author: string;
    }>;
    findByIssue(issueUid: number, page?: number, limit?: number): Promise<{
        items: {
            uid: number;
            issueUid: number;
            content: string;
            author: string;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    update(updateDiscussionDto: UpdateDiscussionDto): Promise<{
        uid: number;
        issueUid: number;
        content: string;
        author: string;
        createdAt: Date;
    }>;
    remove(deleteDiscussionDto: DeleteDiscussionDto): Promise<{
        deleted: boolean;
    }>;
}
