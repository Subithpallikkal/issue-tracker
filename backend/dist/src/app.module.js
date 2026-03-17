"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const drizzle_module_1 = require("./database/drizzle.module");
const issues_controller_1 = require("./controllers/issues.controller");
const discussions_controller_1 = require("./controllers/discussions.controller");
const issues_service_1 = require("./services/issues.service");
const discussions_service_1 = require("./services/discussions.service");
const ai_service_1 = require("./services/ai.service");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            drizzle_module_1.DrizzleModule,
        ],
        controllers: [
            app_controller_1.AppController,
            issues_controller_1.IssuesController,
            discussions_controller_1.DiscussionsController
        ],
        providers: [
            app_service_1.AppService,
            issues_service_1.IssuesService,
            discussions_service_1.DiscussionsService,
            ai_service_1.AiService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map