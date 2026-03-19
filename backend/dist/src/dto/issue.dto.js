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
exports.AnalyzeIssueDto = exports.DeleteIssueDto = exports.UpdateIssueDto = exports.CreateIssueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const issue_enum_1 = require("../enums/issue.enum");
class CreateIssueDto {
    title;
    description;
    priority;
}
exports.CreateIssueDto = CreateIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bug in login page' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'The login button is not working on mobile devices.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: issue_enum_1.IssuePriority, default: issue_enum_1.IssuePriority.MEDIUM }),
    (0, class_validator_1.IsEnum)(issue_enum_1.IssuePriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateIssueDto.prototype, "priority", void 0);
class UpdateIssueDto {
    uid;
    title;
    description;
    status;
    priority;
}
exports.UpdateIssueDto = UpdateIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateIssueDto.prototype, "uid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bug in login page updated' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Updated description.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: issue_enum_1.IssueStatus }),
    (0, class_validator_1.IsEnum)(issue_enum_1.IssueStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: issue_enum_1.IssuePriority }),
    (0, class_validator_1.IsEnum)(issue_enum_1.IssuePriority),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIssueDto.prototype, "priority", void 0);
class DeleteIssueDto {
    uid;
}
exports.DeleteIssueDto = DeleteIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], DeleteIssueDto.prototype, "uid", void 0);
class AnalyzeIssueDto {
    uid;
    detailed;
}
exports.AnalyzeIssueDto = AnalyzeIssueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], AnalyzeIssueDto.prototype, "uid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AnalyzeIssueDto.prototype, "detailed", void 0);
//# sourceMappingURL=issue.dto.js.map