"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_service_1 = require("../database/drizzle.service");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const ai_service_1 = require("./ai.service");
const issue_enum_1 = require("../enums/issue.enum");
let IssuesService = class IssuesService {
    drizzleService;
    aiService;
    constructor(drizzleService, aiService) {
        this.drizzleService = drizzleService;
        this.aiService = aiService;
    }
    async create(createIssueDto) {
        const [issue] = await this.drizzleService.db
            .insert(schema_1.issues)
            .values(createIssueDto)
            .returning();
        return issue;
    }
    async seed() {
        const insertedIssues = await this.drizzleService.db
            .insert(schema_1.issues)
            .values([
            {
                title: 'Network latency issues in US-East-1',
                description: 'Several users are reporting 500ms+ latency when accessing the platform from US-East-1 region. Initial traces suggest a bottleneck in the database connection pool.',
                status: issue_enum_1.IssueStatus.OPEN,
                priority: issue_enum_1.IssuePriority.URGENT,
            },
            {
                title: 'Fix broken footer links in documentation',
                description: 'The "Terms of Service" and "Privacy Policy" links in the documentation footer are currently pointing to a non-existent 404 page.',
                status: issue_enum_1.IssueStatus.IN_PROGRESS,
                priority: issue_enum_1.IssuePriority.LOW,
            },
            {
                title: 'Implement OAuth2 login with Google',
                description: 'Add Google OAuth2 support as a new login method. This involves registering the app in the Google Cloud Console and implementing the backend flow.',
                status: issue_enum_1.IssueStatus.OPEN,
                priority: issue_enum_1.IssuePriority.HIGH,
            },
            {
                title: 'Memory leak in image processing worker',
                description: 'The background worker responsible for resizing profile pictures seems to have a memory leak. Heap usage increases continuously over time until the container crashes.',
                status: issue_enum_1.IssueStatus.OPEN,
                priority: issue_enum_1.IssuePriority.HIGH,
            },
            {
                title: 'Upgrade dependencies to latest stable versions',
                description: 'A routine maintenance task to upgrade all project dependencies (NestJS, Next.js, Drizzle) to their latest stable versions for security and performance.',
                status: issue_enum_1.IssueStatus.RESOLVED,
                priority: issue_enum_1.IssuePriority.MEDIUM,
            },
            {
                title: 'Inconsistent button styling on mobile',
                description: 'The "Submit" button in the contact form is missing its gradient when viewed on iOS devices using Safari.',
                status: issue_enum_1.IssueStatus.OPEN,
                priority: issue_enum_1.IssuePriority.MEDIUM,
            },
        ])
            .returning();
        const discussionsData = [
            {
                issueUid: insertedIssues[0].uid,
                content: 'I have started investigating the traces. It seems like the RDS instance is hitting CPU spikes.',
                author: 'Mark Thompson',
            },
            {
                issueUid: insertedIssues[0].uid,
                content: 'I noticed the same. I will increase the connection pool size to see if it helps.',
                author: 'Sarah Jenkins',
            },
            {
                issueUid: insertedIssues[0].uid,
                content: 'Pool size increased. Monitoring now.',
                author: 'Sarah Jenkins',
            },
            {
                issueUid: insertedIssues[2].uid,
                content: 'I already have the Google Cloud Console project ready. I can share the client IDs.',
                author: 'Alex Chen',
            },
            {
                issueUid: insertedIssues[3].uid,
                content: 'I suspect the sharp library is not releasing buffers correctly.',
                author: 'Mark Thompson',
            },
        ];
        await this.drizzleService.db.insert(schema_1.discussions).values(discussionsData);
        return {
            seeded: true,
            issuesCount: insertedIssues.length,
            discussionsCount: discussionsData.length,
        };
    }
    async findAll(page = 1, limit = 10) {
        const safeLimit = Math.min(Math.max(limit || 10, 1), 100);
        const safePage = Math.max(page || 1, 1);
        const offset = (safePage - 1) * safeLimit;
        const [{ count }] = await this.drizzleService.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.issues);
        const items = await this.drizzleService.db
            .select()
            .from(schema_1.issues)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.issues.createdAt))
            .limit(safeLimit)
            .offset(offset);
        return {
            items,
            total: Number(count) || 0,
            page: safePage,
            limit: safeLimit,
        };
    }
    async findOne(uid) {
        const [issue] = await this.drizzleService.db
            .select()
            .from(schema_1.issues)
            .where((0, drizzle_orm_1.eq)(schema_1.issues.uid, uid));
        if (!issue) {
            throw new common_1.NotFoundException(`Issue with UID ${uid} not found`);
        }
        const issueDiscussions = await this.drizzleService.db
            .select()
            .from(schema_1.discussions)
            .where((0, drizzle_orm_1.eq)(schema_1.discussions.issueUid, uid));
        return { ...issue, discussions: issueDiscussions };
    }
    async update(updateIssueDto) {
        const { uid, ...updateData } = updateIssueDto;
        const [issue] = await this.drizzleService.db
            .update(schema_1.issues)
            .set({ ...updateData, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.issues.uid, uid))
            .returning();
        if (!issue) {
            throw new common_1.NotFoundException(`Issue with UID ${uid} not found`);
        }
        return issue;
    }
    async analyze(analyzeIssueDto) {
        const { uid, detailed } = analyzeIssueDto;
        const issueWithDiscussions = await this.findOne(uid);
        const discussionTexts = issueWithDiscussions.discussions.map(d => d.content);
        const analysis = await this.aiService.analyzeIssue(issueWithDiscussions.title, issueWithDiscussions.description, discussionTexts, detailed);
        const [updatedIssue] = await this.drizzleService.db
            .update(schema_1.issues)
            .set({ aiAnalysis: analysis, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.issues.uid, uid))
            .returning();
        return updatedIssue;
    }
    async remove(deleteIssueDto) {
        const { uid } = deleteIssueDto;
        const [issue] = await this.drizzleService.db
            .delete(schema_1.issues)
            .where((0, drizzle_orm_1.eq)(schema_1.issues.uid, uid))
            .returning();
        if (!issue) {
            throw new common_1.NotFoundException(`Issue with UID ${uid} not found`);
        }
        return { deleted: true };
    }
};
exports.IssuesService = IssuesService;
exports.IssuesService = IssuesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService,
        ai_service_1.AiService])
], IssuesService);
//# sourceMappingURL=issues.service.js.map