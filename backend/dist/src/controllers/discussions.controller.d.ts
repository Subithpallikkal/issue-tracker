import { DiscussionsService } from '../services/discussions.service';
import { CreateDiscussionDto } from '../dto/discussion.dto';
export declare class DiscussionsController {
    private readonly discussionsService;
    constructor(discussionsService: DiscussionsService);
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
