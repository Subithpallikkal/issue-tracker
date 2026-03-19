"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issues = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const enums_schema_1 = require("./enums.schema");
const issue_enum_1 = require("../../enums/issue.enum");
exports.issues = (0, pg_core_1.pgTable)('issues', {
    uid: (0, pg_core_1.integer)('uid').primaryKey().generatedAlwaysAsIdentity(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    status: (0, enums_schema_1.statusEnum)('status').default(issue_enum_1.IssueStatus.OPEN).notNull(),
    priority: (0, enums_schema_1.priorityEnum)('priority').default(issue_enum_1.IssuePriority.MEDIUM).notNull(),
    aiAnalysis: (0, pg_core_1.text)('ai_analysis'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
//# sourceMappingURL=issues.schema.js.map