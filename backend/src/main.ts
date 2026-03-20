import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptor for response transformation
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS
  const corsOriginEnvRaw = process.env.CORS_ORIGIN;
  const corsOriginEnv = corsOriginEnvRaw?.trim();

  const allowedOrigins = corsOriginEnv
    ? corsOriginEnv
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        // Normalize so `https://example.com/` matches `https://example.com`
        .map((origin) => origin.replace(/\/+$/, ''))
    : [];

  if (allowedOrigins.length) {
    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
    });
  } else {
    // If Render env var isn't set, allow requests from any origin so
    // Vercel -> Render fetch doesn't fail with missing CORS headers.
    app.enableCors({
      origin: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: false,
    });
  }

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Issue Management Platform API')
    .setDescription('API documentation for the minimal issue management platform')
    .setVersion('1.0')
    .addTag('issues')
    .addTag('discussions')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 10000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    'Application failed to start.',
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
});
