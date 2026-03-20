import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema/index';
export declare class DrizzleService implements OnModuleInit, OnModuleDestroy {
    private configService;
    db: NodePgDatabase<typeof schema>;
    private pool;
    private readonly logger;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
