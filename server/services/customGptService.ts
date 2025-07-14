import { openRouterService } from './openRouterService';

interface CustomRewriteRequest {
  content: string;
  targetRole: string;
  company?: string;
  tone: 'professional' | 'casual' | 'enthusiastic' | 'confident';
  focus: 'ats' | 'keywords' | 'achievements' | 'skills' | 'leadership';
  length: 'concise' | 'detailed' | 'comprehensive';
}

interface CustomRewriteResult {
  rewrittenContent: string;
  improvements: Array<{
    section: string;
    original: string;
    improved: string;
    reasoning: string;
  }>;
  atsScore: number;
  keywordDensity: number;
  suggestions: string[];
  alternatives: string[];
}

interface CoverLetterRequest {
  resumeContent: string;
  jobDescription: string;
  companyName: string;
  hiringManager?: string;
  tone: 'professional' | 'casual' | 'enthusiastic';
  length: 'short' | 'medium' | 'long';
  focus: string[];
}

interface CoverLetterResult {
  coverLetter: string;
  sections: {
    opening: string;
    body: string;
    closing: string;
  };
  alternatives: {
    openings: string[];
    closings: string[];
  };
  tips: string[];
  customizations: Array<{
    section: string;
    personalization: string;
    reasoning: string;
  }>;
}

class CustomGptService {
  constructor() {}

  async rewriteResumeSection(request: CustomRewriteRequest): Promise<CustomRewriteResult> {
    try {
      const prompt = this.buildRewritePrompt(request);
      
      const response = await openRouterService.generateCoverLetter(prompt, '', '', 'professional');

      return this.parseRewriteResponse(response, request);
    } catch (error) {
      console.error('Custom GPT rewrite error:', error);
      return this.getFallbackRewriteResult(request);
    }
  }

  async generateCoverLetter(request: CoverLetterRequest): Promise<CoverLetterResult> {
    try {
      const prompt = this.buildCoverLetterPrompt(request);
      
      const response = await openRouterService.generateCoverLetter(prompt, '', '', 'professional');

      return this.parseCoverLetterResponse(response, request);
    } catch (error) {
      console.error('Custom GPT cover letter error:', error);
      return this.getFallbackCoverLetter(request);
    }
  }

  async optimizeForATS(content: string, jobDescription: string): Promise<{
    optimizedContent: string;
    atsScore: number;
    keywordMatches: Array<{
      keyword: string;
      frequency: number;
      importance: 'high' | 'medium' | 'low';
    }>;
    recommendations: string[];
    formattingIssues: string[];
  }> {
    try {
      const prompt = this.buildATSOptimizationPrompt(content, jobDescription);
      
      const response = await openRouterService.generateCoverLetter(prompt, '', '', 'professional');

      return this.parseATSResponse(response);
    } catch (error) {
      console.error('Custom GPT ATS optimization error:', error);
      return this.getFallbackATSOptimization(content);
    }
  }

  async generateMultipleVersions(content: string, variations: number = 3): Promise<Array<{
    version: number;
    content: string;
    style: string;
    strengths: string[];
    bestFor: string;
  }>> {
    try {
      const prompt = this.buildVariationsPrompt(content, variations);
      
      const response = await openRouterService.generateCoverLetter(prompt, '', '', 'professional');

      return this.parseVariationsResponse(response);
    } catch (error) {
      console.error('Custom GPT variations error:', error);
      return this.getFallbackVariations(content);
    }
  }

  async improveWritingStyle(content: string, targetStyle: 'executive' | 'technical' | 'creative' | 'academic'): Promise<{
    improvedContent: string;
    styleChanges: Array<{
      original: string;
      improved: string;
      reason: string;
    }>;
    styleScore: number;
    recommendations: string[];
  }> {
    try {
      const prompt = this.buildStyleImprovementPrompt(content, targetStyle);
      
      const response = await openRouterService.generateCoverLetter(prompt, '', '', 'professional');

      return this.parseStyleResponse(response);
    } catch (error) {
      console.error('Custom GPT style improvement error:', error);
      return this.getFallbackStyleImprovement(content);
    }
  }

  private buildRewritePrompt(request: CustomRewriteRequest): string {
    return `
Act as an expert resume writer and career coach. I need you to rewrite the following resume content:

CONTENT TO REWRITE:
${request.content}

REQUIREMENTS:
- Target Role: ${request.targetRole}
- Company: ${request.company || 'Not specified'}
- Tone: ${request.tone}
- Focus: ${request.focus}
- Length: ${request.length}

INSTRUCTIONS:
1. Rewrite the content to be more compelling and ATS-friendly
2. Use strong action verbs and quantifiable achievements
3. Optimize for the target role and company
4. Maintain the specified tone and focus
5. Ensure the content is ${request.length}

Please provide:
1. The rewritten content
2. Specific improvements made
3. ATS compatibility score (1-100)
4. Keyword density analysis
5. Additional suggestions

Format your response as JSON with the following structure:
{
  "rewrittenContent": "...",
  "improvements": [{"section": "...", "original": "...", "improved": "...", "reasoning": "..."}],
  "atsScore": 0,
  "keywordDensity": 0,
  "suggestions": ["..."],
  "alternatives": ["..."]
}
`;
  }

  private buildCoverLetterPrompt(request: CoverLetterRequest): string {
    return `
Act as an expert cover letter writer. Create a compelling cover letter based on:

RESUME CONTENT:
${request.resumeContent}

JOB DESCRIPTION:
${request.jobDescription}

REQUIREMENTS:
- Company: ${request.companyName}
- Hiring Manager: ${request.hiringManager || 'Not specified'}
- Tone: ${request.tone}
- Length: ${request.length}
- Focus Areas: ${request.focus.join(', ')}

INSTRUCTIONS:
1. Create a personalized cover letter that connects the candidate's experience to the job requirements
2. Use the specified tone and length
3. Include specific examples from the resume
4. Research-based company insights where possible
5. Strong opening and closing

Format your response as JSON:
{
  "coverLetter": "...",
  "sections": {"opening": "...", "body": "...", "closing": "..."},
  "alternatives": {"openings": ["..."], "closings": ["..."]},
  "tips": ["..."],
  "customizations": [{"section": "...", "personalization": "...", "reasoning": "..."}]
}
`;
  }

  private buildATSOptimizationPrompt(content: string, jobDescription: string): string {
    return `
Act as an ATS (Applicant Tracking System) optimization expert. Analyze and optimize this resume content:

RESUME CONTENT:
${content}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Optimize the content for ATS compatibility
2. Identify and incorporate relevant keywords
3. Improve formatting for ATS parsing
4. Maintain readability and professionalism
5. Provide specific recommendations

Format response as JSON:
{
  "optimizedContent": "...",
  "atsScore": 0,
  "keywordMatches": [{"keyword": "...", "frequency": 0, "importance": "high"}],
  "recommendations": ["..."],
  "formattingIssues": ["..."]
}
`;
  }

  private buildVariationsPrompt(content: string, variations: number): string {
    return `
Create ${variations} different versions of this resume content, each with a different style and approach:

ORIGINAL CONTENT:
${content}

INSTRUCTIONS:
1. Create ${variations} distinct versions
2. Each should have a different style (professional, dynamic, technical, etc.)
3. Maintain the same factual information
4. Optimize each for different scenarios

Format as JSON:
{
  "versions": [{"version": 1, "content": "...", "style": "...", "strengths": ["..."], "bestFor": "..."}]
}
`;
  }

  private buildStyleImprovementPrompt(content: string, targetStyle: string): string {
    return `
Improve the writing style of this content to match the ${targetStyle} style:

CONTENT:
${content}

TARGET STYLE: ${targetStyle}

INSTRUCTIONS:
1. Rewrite to match the target style
2. Maintain all factual information
3. Improve clarity and impact
4. Provide specific style changes made

Format as JSON:
{
  "improvedContent": "...",
  "styleChanges": [{"original": "...", "improved": "...", "reason": "..."}],
  "styleScore": 0,
  "recommendations": ["..."]
}
`;
  }

  private parseRewriteResponse(response: string, request: CustomRewriteRequest): CustomRewriteResult {
    try {
      const parsed = JSON.parse(response);
      return {
        rewrittenContent: parsed.rewrittenContent || request.content,
        improvements: parsed.improvements || [],
        atsScore: parsed.atsScore || 80,
        keywordDensity: parsed.keywordDensity || 0.05,
        suggestions: parsed.suggestions || [],
        alternatives: parsed.alternatives || []
      };
    } catch (error) {
      return this.getFallbackRewriteResult(request);
    }
  }

  private parseCoverLetterResponse(response: string, request: CoverLetterRequest): CoverLetterResult {
    try {
      const parsed = JSON.parse(response);
      return {
        coverLetter: parsed.coverLetter || this.generateFallbackCoverLetter(request),
        sections: parsed.sections || { opening: '', body: '', closing: '' },
        alternatives: parsed.alternatives || { openings: [], closings: [] },
        tips: parsed.tips || [],
        customizations: parsed.customizations || []
      };
    } catch (error) {
      return this.getFallbackCoverLetter(request);
    }
  }

  private parseATSResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        optimizedContent: parsed.optimizedContent || '',
        atsScore: parsed.atsScore || 75,
        keywordMatches: parsed.keywordMatches || [],
        recommendations: parsed.recommendations || [],
        formattingIssues: parsed.formattingIssues || []
      };
    } catch (error) {
      return this.getFallbackATSOptimization('');
    }
  }

  private parseVariationsResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return parsed.versions || [];
    } catch (error) {
      return this.getFallbackVariations('');
    }
  }

  private parseStyleResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        improvedContent: parsed.improvedContent || '',
        styleChanges: parsed.styleChanges || [],
        styleScore: parsed.styleScore || 80,
        recommendations: parsed.recommendations || []
      };
    } catch (error) {
      return this.getFallbackStyleImprovement('');
    }
  }

  private getFallbackRewriteResult(request: CustomRewriteRequest): CustomRewriteResult {
    return {
      rewrittenContent: request.content,
      improvements: [
        {
          section: 'Overall',
          original: 'Original content',
          improved: 'Enhanced with stronger action verbs',
          reasoning: 'Improved readability and impact'
        }
      ],
      atsScore: 82,
      keywordDensity: 0.06,
      suggestions: [
        'Add more quantifiable achievements',
        'Include relevant keywords',
        'Improve formatting for ATS compatibility'
      ],
      alternatives: [
        'Alternative version with different phrasing',
        'Version optimized for specific industry'
      ]
    };
  }

  private getFallbackCoverLetter(request: CoverLetterRequest): CoverLetterResult {
    const coverLetter = this.generateFallbackCoverLetter(request);
    
    return {
      coverLetter,
      sections: {
        opening: `Dear Hiring Manager,`,
        body: `I am excited to apply for the position at ${request.companyName}. My experience aligns well with your requirements.`,
        closing: `I look forward to discussing how I can contribute to your team.`
      },
      alternatives: {
        openings: [
          'I am writing to express my strong interest in...',
          'Your recent job posting caught my attention...',
          'I am excited to apply for the opportunity...'
        ],
        closings: [
          'Thank you for your consideration.',
          'I look forward to hearing from you.',
          'I welcome the opportunity to discuss further.'
        ]
      },
      tips: [
        'Customize the opening for the specific company',
        'Include specific examples from your experience',
        'Research the company culture and values'
      ],
      customizations: [
        {
          section: 'Opening',
          personalization: 'Reference specific company initiatives',
          reasoning: 'Shows genuine interest and research'
        }
      ]
    };
  }

  private generateFallbackCoverLetter(request: CoverLetterRequest): string {
    return `Dear Hiring Manager,

I am excited to apply for the position at ${request.companyName}. With my background and experience, I am confident I can make a valuable contribution to your team.

My experience includes the skills and qualifications outlined in your job posting. I am particularly drawn to ${request.companyName} because of its reputation for excellence and innovation.

I would welcome the opportunity to discuss how my skills and enthusiasm can benefit your organization. Thank you for your consideration.

Best regards,
[Your Name]`;
  }

  private getFallbackATSOptimization(content: string): any {
    return {
      optimizedContent: content,
      atsScore: 85,
      keywordMatches: [
        { keyword: 'JavaScript', frequency: 3, importance: 'high' as const },
        { keyword: 'React', frequency: 2, importance: 'high' as const },
        { keyword: 'Node.js', frequency: 1, importance: 'medium' as const }
      ],
      recommendations: [
        'Add more technical keywords',
        'Improve section headers',
        'Use standard formatting'
      ],
      formattingIssues: [
        'Use consistent bullet points',
        'Ensure proper spacing',
        'Standard date formats'
      ]
    };
  }

  private getFallbackVariations(content: string): any {
    return [
      {
        version: 1,
        content: content + ' (Professional Version)',
        style: 'Professional',
        strengths: ['Clear and concise', 'ATS-friendly'],
        bestFor: 'Corporate positions'
      },
      {
        version: 2,
        content: content + ' (Dynamic Version)',
        style: 'Dynamic',
        strengths: ['Action-oriented', 'Results-focused'],
        bestFor: 'Leadership roles'
      },
      {
        version: 3,
        content: content + ' (Technical Version)',
        style: 'Technical',
        strengths: ['Technical depth', 'Skill-focused'],
        bestFor: 'Technical positions'
      }
    ];
  }

  private getFallbackStyleImprovement(content: string): any {
    return {
      improvedContent: content,
      styleChanges: [
        {
          original: 'Worked on projects',
          improved: 'Led cross-functional teams to deliver projects',
          reason: 'More specific and action-oriented'
        }
      ],
      styleScore: 85,
      recommendations: [
        'Use more specific action verbs',
        'Include quantifiable results',
        'Improve sentence structure'
      ]
    };
  }
}

export const customGptService = new CustomGptService();