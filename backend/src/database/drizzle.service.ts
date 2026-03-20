import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/index';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  public db: NodePgDatabase<typeof schema>;
  private pool: Pool;
  private readonly logger = new Logger(DrizzleService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      this.logger.error('DATABASE_URL is missing. Database initialization failed.');
      throw new Error('DATABASE_URL is not configured');
    }

    const maxRetries = 5;
    const baseDelayMs = 1500;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.pool = new Pool({ connectionString });

      try {
        await this.pool.query('SELECT 1');
        this.db = drizzle(this.pool, { schema });
        this.logger.log(`Database connected successfully (attempt ${attempt}/${maxRetries}).`);
        return;
      } catch (error) {
        lastError = error;
        this.logger.error(
          `Database connection failed (attempt ${attempt}/${maxRetries}).`,
          error instanceof Error ? error.stack : String(error),
        );

        await this.pool.end().catch(() => undefined);

        if (attempt < maxRetries) {
          const backoffMs = baseDelayMs * attempt;
          this.logger.warn(`Retrying database connection in ${backoffMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    this.logger.error('Database initialization failed after maximum retries.');
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
