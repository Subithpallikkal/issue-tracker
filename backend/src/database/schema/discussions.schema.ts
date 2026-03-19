import { pgTable, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { issues } from './issues.schema';

export const discussions = pgTable('discussions', {
  uid: integer('uid').primaryKey().generatedAlwaysAsIdentity(),
  issueUid: integer('issue_uid')
    .references(() => issues.uid, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
