import { IssuePriority, IssueStatus } from '../enums/issue.enum';
export declare class CreateIssueDto {
    title: string;
    description: string;
    priority?: IssuePriority;
}
export declare class UpdateIssueDto {
    title?: string;
    description?: string;
    status?: IssueStatus;
    priority?: IssuePriority;
}
