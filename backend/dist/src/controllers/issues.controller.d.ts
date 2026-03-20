import { IssuesService } from '../services/issues.service';
import { CreateIssueDto, UpdateIssueDto, DeleteIssueDto, AnalyzeIssueDto } from '../dto/issue.dto';
export declare class IssuesController {
    private readonly issuesService;
    constructor(issuesService: IssuesService);
    create(createIssueDto: CreateIssueDto): Promise<{
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        uid: number;
        title: string;
        description: string;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    seed(): Promise<{
        seeded: boolean;
        issuesCount: number;
        discussionsCount: number;
    }>;
    findAll(page?: string, limit?: string): Promise<{
        items: {
            uid: number;
            title: string;
            description: string;
            status: import("../enums/issue.enum").IssueStatus;
            priority: import("../enums/issue.enum").IssuePriority;
            aiAnalysis: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(uid: number): Promise<{
        discussions: {
            uid: number;
            issueUid: number;
            content: string;
            author: string;
            createdAt: Date;
        }[];
        uid: number;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(updateIssueDto: UpdateIssueDto): Promise<{
        uid: number;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    analyze(analyzeIssueDto: AnalyzeIssueDto): Promise<{
        uid: number;
        title: string;
        description: string;
        status: import("../enums/issue.enum").IssueStatus;
        priority: import("../enums/issue.enum").IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(deleteIssueDto: DeleteIssueDto): Promise<{
        deleted: boolean;
    }>;
}
