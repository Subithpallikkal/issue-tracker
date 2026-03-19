import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private genAI;
    private model;
    constructor(configService: ConfigService);
    analyzeIssue(title: string, description: string, discussions: string[], detailed?: boolean): Promise<any>;
}
