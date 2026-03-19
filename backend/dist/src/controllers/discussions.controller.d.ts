import { DiscussionsService } from '../services/discussions.service';
import { CreateDiscussionDto, UpdateDiscussionDto, DeleteDiscussionDto } from '../dto/discussion.dto';
export declare class DiscussionsController {
    private readonly discussionsService;
    constructor(discussionsService: DiscussionsService);
    create(createDiscussionDto: CreateDiscussionDto): Promise<{
        uid: number;
        createdAt: Date;
        issueUid: number;
        content: string;
        author: string;
    }>;
    findByIssue(issueUid: number, page?: string, limit?: string): Promise<{
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
