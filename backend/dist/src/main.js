"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const all_exceptions_filter_1 = require("./exceptions/all-exceptions.filter");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const corsOriginEnvRaw = process.env.CORS_ORIGIN;
    const corsOriginEnv = corsOriginEnvRaw?.trim();
    const allowedOrigins = corsOriginEnv
        ? corsOriginEnv
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean)
            .map((origin) => origin.replace(/\/+$/, ''))
        : [];
    if (allowedOrigins.length) {
        app.enableCors({
            origin: allowedOrigins,
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
            credentials: true,
        });
    }
    else {
        app.enableCors({
            origin: true,
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
            credentials: false,
        });
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Issue Management Platform API')
        .setDescription('API documentation for the minimal issue management platform')
        .setVersion('1.0')
        .addTag('issues')
        .addTag('discussions')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 10000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map