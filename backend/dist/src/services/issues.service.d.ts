import { DrizzleService } from '../database/drizzle.service';
import { CreateIssueDto, UpdateIssueDto, DeleteIssueDto, AnalyzeIssueDto } from '../dto/issue.dto';
import { AiService } from './ai.service';
import { IssuePriority, IssueStatus } from '../enums/issue.enum';
export declare class IssuesService {
    private drizzleService;
    private aiService;
    constructor(drizzleService: DrizzleService, aiService: AiService);
    create(createIssueDto: CreateIssueDto): Promise<{
        uid: number;
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    seed(): Promise<{
        seeded: boolean;
        issuesCount: number;
        discussionsCount: number;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        items: {
            uid: number;
            title: string;
            description: string;
            status: IssueStatus;
            priority: IssuePriority;
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
        status: IssueStatus;
        priority: IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(updateIssueDto: UpdateIssueDto): Promise<{
        uid: number;
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    analyze(analyzeIssueDto: AnalyzeIssueDto): Promise<{
        uid: number;
        title: string;
        description: string;
        status: IssueStatus;
        priority: IssuePriority;
        aiAnalysis: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(deleteIssueDto: DeleteIssueDto): Promise<{
        deleted: boolean;
    }>;
}
