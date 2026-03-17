"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discussions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const issues_schema_1 = require("./issues.schema");
exports.discussions = (0, pg_core_1.pgTable)('discussions', {
    uid: (0, pg_core_1.uuid)('uid').defaultRandom().primaryKey(),
    issueUid: (0, pg_core_1.uuid)('issue_uid')
        .references(() => issues_schema_1.issues.uid, { onDelete: 'cascade' })
        .notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    author: (0, pg_core_1.varchar)('author', { length: 100 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
//# sourceMappingURL=discussions.schema.js.map