import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { issues } from './issues.schema';

export const discussions = pgTable('discussions', {
  uid: uuid('uid').defaultRandom().primaryKey(),
  issueUid: uuid('issue_uid')
    .references(() => issues.uid, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  author: varchar('author', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
