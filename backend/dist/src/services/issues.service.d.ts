import { DrizzleService } from '../database/drizzle.service';
import { CreateIssueDto, UpdateIssueDto } from '../dto/issue.dto';
import { AiService } from './ai.service';
export declare class IssuesService {
    private drizzleService;
    private aiService;
    constructor(drizzleService: DrizzleService, aiService: AiService);
    create(createIssueDto: CreateIssueDto): Promise<{
        uid: string;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        uid: string;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(uid: string): Promise<{
        discussions: {
            uid: string;
            issueUid: string;
            content: string;
            author: string;
            createdAt: Date;
        }[];
        uid: string;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(uid: string, updateIssueDto: UpdateIssueDto): Promise<{
        uid: string;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    analyze(uid: string): Promise<{
        uid: string;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(uid: string): Promise<{
        deleted: boolean;
    }>;
}
