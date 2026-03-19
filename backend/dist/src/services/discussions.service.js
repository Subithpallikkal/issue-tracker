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
exports.DiscussionsService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_service_1 = require("../database/drizzle.service");
const schema_1 = require("../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
let DiscussionsService = class DiscussionsService {
    drizzleService;
    constructor(drizzleService) {
        this.drizzleService = drizzleService;
    }
    async create(createDiscussionDto) {
        const [discussion] = await this.drizzleService.db
            .insert(schema_1.discussions)
            .values(createDiscussionDto)
            .returning();
        return discussion;
    }
    async findByIssue(issueUid, page = 1, limit = 10) {
        const safeLimit = Math.min(Math.max(limit || 10, 1), 100);
        const safePage = Math.max(page || 1, 1);
        const offset = (safePage - 1) * safeLimit;
        const [{ count }] = await this.drizzleService.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.discussions)
            .where((0, drizzle_orm_1.eq)(schema_1.discussions.issueUid, issueUid));
        const items = await this.drizzleService.db
            .select()
            .from(schema_1.discussions)
            .where((0, drizzle_orm_1.eq)(schema_1.discussions.issueUid, issueUid))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.discussions.createdAt))
            .limit(safeLimit)
            .offset(offset);
        return {
            items,
            total: Number(count) || 0,
            page: safePage,
            limit: safeLimit,
        };
    }
    async update(updateDiscussionDto) {
        const { uid, content } = updateDiscussionDto;
        const [discussion] = await this.drizzleService.db
            .update(schema_1.discussions)
            .set({ content })
            .where((0, drizzle_orm_1.eq)(schema_1.discussions.uid, uid))
            .returning();
        return discussion;
    }
    async remove(deleteDiscussionDto) {
        const { uid } = deleteDiscussionDto;
        await this.drizzleService.db
            .delete(schema_1.discussions)
            .where((0, drizzle_orm_1.eq)(schema_1.discussions.uid, uid));
        return { deleted: true };
    }
};
exports.DiscussionsService = DiscussionsService;
exports.DiscussionsService = DiscussionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [drizzle_service_1.DrizzleService])
], DiscussionsService);
//# sourceMappingURL=discussions.service.js.map