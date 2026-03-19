import { IssuePriority, IssueStatus } from '../enums/issue.enum';
export declare class CreateIssueDto {
    title: string;
    description: string;
    priority?: IssuePriority;
}
export declare class UpdateIssueDto {
    uid: number;
    title?: string;
    description?: string;
    status?: IssueStatus;
    priority?: IssuePriority;
}
export declare class DeleteIssueDto {
    uid: number;
}
export declare class AnalyzeIssueDto {
    uid: number;
    detailed?: boolean;
}
