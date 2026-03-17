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
    async findAll() {
        return this.drizzleService.db.select().from(schema_1.issues);
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
    async update(uid, updateIssueDto) {
        const [issue] = await this.drizzleService.db
            .update(schema_1.issues)
            .set({ ...updateIssueDto, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.issues.uid, uid))
            .returning();
        if (!issue) {
            throw new common_1.NotFoundException(`Issue with UID ${uid} not found`);
        }
        return issue;
    }
    async analyze(uid) {
        const issueWithDiscussions = await this.findOne(uid);
        const discussionTexts = issueWithDiscussions.discussions.map(d => d.content);
        const analysis = await this.aiService.analyzeIssue(issueWithDiscussions.title, issueWithDiscussions.description, discussionTexts);
        const [updatedIssue] = await this.drizzleService.db
            .update(schema_1.issues)
            .set({ aiAnalysis: analysis, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.issues.uid, uid))
            .returning();
        return updatedIssue;
    }
    async remove(uid) {
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