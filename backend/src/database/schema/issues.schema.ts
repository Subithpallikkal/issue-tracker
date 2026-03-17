import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { statusEnum, priorityEnum } from './enums.schema';
import { IssueStatus, IssuePriority } from '../../enums/issue.enum';

export const issues = pgTable('issues', {
  uid: uuid('uid').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: statusEnum('status').default(IssueStatus.OPEN).notNull(),
  priority: priorityEnum('priority').default(IssuePriority.MEDIUM).notNull(),
  aiAnalysis: text('ai_analysis'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
