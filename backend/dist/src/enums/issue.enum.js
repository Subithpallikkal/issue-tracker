"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuePriority = exports.IssueStatus = void 0;
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["OPEN"] = "OPEN";
    IssueStatus["IN_PROGRESS"] = "IN_PROGRESS";
    IssueStatus["RESOLVED"] = "RESOLVED";
    IssueStatus["CLOSED"] = "CLOSED";
})(IssueStatus || (exports.IssueStatus = IssueStatus = {}));
var IssuePriority;
(function (IssuePriority) {
    IssuePriority["LOW"] = "LOW";
    IssuePriority["MEDIUM"] = "MEDIUM";
    IssuePriority["HIGH"] = "HIGH";
    IssuePriority["URGENT"] = "URGENT";
})(IssuePriority || (exports.IssuePriority = IssuePriority = {}));
//# sourceMappingURL=issue.enum.js.map