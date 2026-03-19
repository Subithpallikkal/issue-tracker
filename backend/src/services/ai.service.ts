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

  async analyzeIssue(title: string, description: string, discussions: string[], detailed = false) {
    const prompt = detailed 
      ? `
        Perform a DETAILED analysis of the following issue and its discussions.
        Provide a comprehensive summary, technical deep dive, next steps, and potential risks.
        
        Issue Title: ${title}
        Issue Description: ${description}
        Discussions: ${discussions.join('\n')}
        
        Format as:
        1. Comprehensive Summary
        2. Technical Deep Dive
        3. Action Plan
        4. Risk Assessment
      `
      : `
        Analyze this issue and discussions. Provide a VERY CONCISE 2-sentence summary.
        Then provide exactly 2 high-impact actionable bullet points.
        
        Issue Title: ${title}
        Issue Description: ${description}
        Discussions: ${discussions.join('\n')}

        Format as:
        1. Brief Summary
        2. Key Actions
      `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}
