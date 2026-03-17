import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(String(apiKey));
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeIssue(title: string, description: string, discussions: string[]) {
    const prompt = `
      Analyze the following issue and its discussions to provide a summary and actionable insights.
      
      Issue Title: ${title}
      Issue Description: ${description}
      
      Discussions:
      ${discussions.join('\n')}
      
      Provide your analysis in the following format:
      1. Summary of the problem
      2. Suggested next steps
      3. Potential risks
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
