 export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Issue {
  uid: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  aiAnalysis?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Discussion {
  uid: number;
  issueUid: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface IssueWithDiscussions extends Issue {
  discussions: Discussion[];
}

export interface CreateIssueDto {
  title: string;
  description: string;
  priority?: IssuePriority;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
}

export interface CreateDiscussionDto {
  issueUid: number;
  content: string;
  author: string;
}
