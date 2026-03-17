"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priorityEnum = exports.statusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const issue_enum_1 = require("../../enums/issue.enum");
exports.statusEnum = (0, pg_core_1.pgEnum)('status', [
    issue_enum_1.IssueStatus.OPEN,
    issue_enum_1.IssueStatus.IN_PROGRESS,
    issue_enum_1.IssueStatus.RESOLVED,
    issue_enum_1.IssueStatus.CLOSED,
]);
exports.priorityEnum = (0, pg_core_1.pgEnum)('priority', [
    issue_enum_1.IssuePriority.LOW,
    issue_enum_1.IssuePriority.MEDIUM,
    issue_enum_1.IssuePriority.HIGH,
    issue_enum_1.IssuePriority.URGENT,
]);
//# sourceMappingURL=enums.schema.js.map