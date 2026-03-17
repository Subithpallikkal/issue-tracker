import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './database/drizzle.module';
import { IssuesController } from './controllers/issues.controller';
import { DiscussionsController } from './controllers/discussions.controller';
import { IssuesService } from './services/issues.service';
import { DiscussionsService } from './services/discussions.service';
import { AiService } from './services/ai.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
  ],
  controllers: [
    AppController,
    IssuesController, 
    DiscussionsController
  ],
  providers: [
    AppService,
    IssuesService, 
    DiscussionsService, 
    AiService
  ],
})
export class AppModule {}
