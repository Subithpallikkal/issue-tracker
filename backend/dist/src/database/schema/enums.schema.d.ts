import { IssueStatus, IssuePriority } from '../../enums/issue.enum';
export declare const statusEnum: import("drizzle-orm/pg-core").PgEnum<[IssueStatus.OPEN, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED, IssueStatus.CLOSED]>;
export declare const priorityEnum: import("drizzle-orm/pg-core").PgEnum<[IssuePriority.LOW, IssuePriority.MEDIUM, IssuePriority.HIGH, IssuePriority.URGENT]>;
