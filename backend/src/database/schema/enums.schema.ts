import { pgEnum } from 'drizzle-orm/pg-core';
import { IssueStatus, IssuePriority } from '../../enums/issue.enum';

export const statusEnum = pgEnum('status', [
  IssueStatus.OPEN,
  IssueStatus.IN_PROGRESS,
  IssueStatus.RESOLVED,
  IssueStatus.CLOSED,
]);

export const priorityEnum = pgEnum('priority', [
  IssuePriority.LOW,
  IssuePriority.MEDIUM,
  IssuePriority.HIGH,
  IssuePriority.URGENT,
]);
