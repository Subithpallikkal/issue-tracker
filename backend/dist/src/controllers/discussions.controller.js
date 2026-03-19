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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscussionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const discussions_service_1 = require("../services/discussions.service");
const discussion_dto_1 = require("../dto/discussion.dto");
let DiscussionsController = class DiscussionsController {
    discussionsService;
    constructor(discussionsService) {
        this.discussionsService = discussionsService;
    }
    create(createDiscussionDto) {
        return this.discussionsService.create(createDiscussionDto);
    }
    findByIssue(issueUid, page, limit) {
        const p = page ? Number(page) : 1;
        const l = limit ? Number(limit) : 10;
        return this.discussionsService.findByIssue(issueUid, p, l);
    }
    update(updateDiscussionDto) {
        return this.discussionsService.update(updateDiscussionDto);
    }
    remove(deleteDiscussionDto) {
        return this.discussionsService.remove(deleteDiscussionDto);
    }
};
exports.DiscussionsController = DiscussionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a discussion comment to an issue' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discussion_dto_1.CreateDiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('get_all_by_issue/:issueUid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all discussions for a specific issue' }),
    __param(0, (0, common_1.Param)('issueUid', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "findByIssue", null);
__decorate([
    (0, common_1.Patch)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a discussion comment' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discussion_dto_1.UpdateDiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a discussion comment' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discussion_dto_1.DeleteDiscussionDto]),
    __metadata("design:returntype", void 0)
], DiscussionsController.prototype, "remove", null);
exports.DiscussionsController = DiscussionsController = __decorate([
    (0, swagger_1.ApiTags)('discussions'),
    (0, common_1.Controller)('discussions'),
    __metadata("design:paramtypes", [discussions_service_1.DiscussionsService])
], DiscussionsController);
//# sourceMappingURL=discussions.controller.js.map