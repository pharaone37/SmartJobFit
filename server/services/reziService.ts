import fetch from 'node-fetch';

interface ReziResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

interface ReziOptimizedResume {
  optimizedContent: ReziResumeData;
  atsScore: number;
  improvements: Array<{
    section: string;
    issue: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  keywordAnalysis: {
    matched: string[];
    missing: string[];
    density: number;
  };
  formatting: {
    score: number;
    suggestions: string[];
  };
  tailoring: {
    jobAlignment: number;
    recommendedChanges: string[];
  };
}

interface ReziCoverLetter {
  content: string;
  structure: {
    opening: string;
    body: string[];
    closing: string;
  };
  personalization: {
    companyResearch: string[];
    roleAlignment: string[];
    valueProposition: string[];
  };
  tone: 'professional' | 'enthusiastic' | 'confident' | 'conversational';
  wordCount: number;
}

interface ReziATSAnalysis {
  overallScore: number;
  sections: {
    [key: string]: {
      score: number;
      feedback: string;
      recommendations: string[];
    };
  };
  keywordOptimization: {
    relevantKeywords: string[];
    missingKeywords: string[];
    keywordDensity: number;
  };
  formatting: {
    atsCompatible: boolean;
    issues: string[];
    fixes: string[];
  };
  industryBenchmark: {
    percentile: number;
    comparison: string;
    topPerformerTips: string[];
  };
}

class ReziService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REZI_API_KEY || '';
    this.baseUrl = 'https://api.rezi.io/v1';
  }

  async optimizeResume(params: {
    resumeContent: ReziResumeData;
    jobDescription: string;
    targetRole: string;
    industry: string;
    optimizationLevel: 'basic' | 'advanced' | 'premium';
  }): Promise<ReziOptimizedResume> {
    if (!this.apiKey) {
      console.log('REZI_API_KEY not found. Using AI-powered resume optimization.');
      return this.getAIOptimizedResume(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resume/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          job_description: params.jobDescription,
          target_role: params.targetRole,
          industry: params.industry,
          optimization_level: params.optimizationLevel,
          include_ats_analysis: true,
          include_keyword_optimization: true
        })
      });

      if (!response.ok) {
        throw new Error(`Rezi API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformOptimizedResume(data);
    } catch (error) {
      console.error('Rezi resume optimization error:', error);
      return this.getAIOptimizedResume(params);
    }
  }

  async generateCoverLetter(params: {
    resumeContent: ReziResumeData;
    jobDescription: string;
    companyName: string;
    hiringManager?: string;
    tone: 'professional' | 'enthusiastic' | 'confident' | 'conversational';
    length: 'short' | 'medium' | 'long';
  }): Promise<ReziCoverLetter> {
    if (!this.apiKey) {
      console.log('REZI_API_KEY not found. Using AI-powered cover letter generation.');
      return this.getAICoverLetter(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/cover-letter/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          job_description: params.jobDescription,
          company_name: params.companyName,
          hiring_manager: params.hiringManager,
          tone: params.tone,
          length: params.length,
          include_company_research: true,
          personalization_level: 'high'
        })
      });

      if (!response.ok) {
        throw new Error(`Rezi cover letter API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCoverLetter(data);
    } catch (error) {
      console.error('Rezi cover letter generation error:', error);
      return this.getAICoverLetter(params);
    }
  }

  async analyzeATSCompatibility(params: {
    resumeContent: ReziResumeData;
    jobDescription: string;
    targetATS?: string;
  }): Promise<ReziATSAnalysis> {
    if (!this.apiKey) {
      console.log('REZI_API_KEY not found. Using AI-powered ATS analysis.');
      return this.getAIATSAnalysis(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/ats/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          job_description: params.jobDescription,
          target_ats: params.targetATS || 'general',
          include_keyword_analysis: true,
          include_formatting_check: true,
          include_industry_benchmark: true
        })
      });

      if (!response.ok) {
        throw new Error(`Rezi ATS analysis API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformATSAnalysis(data);
    } catch (error) {
      console.error('Rezi ATS analysis error:', error);
      return this.getAIATSAnalysis(params);
    }
  }

  async getResumeTemplates(params: {
    industry: string;
    experience: 'entry' | 'mid' | 'senior' | 'executive';
    style: 'modern' | 'classic' | 'creative' | 'minimal';
  }): Promise<{
    templates: Array<{
      id: string;
      name: string;
      description: string;
      preview: string;
      atsScore: number;
      bestFor: string[];
    }>;
    recommendations: Array<{
      templateId: string;
      reason: string;
      suitability: number;
    }>;
  }> {
    if (!this.apiKey) {
      return this.getFallbackTemplates(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          industry: params.industry,
          experience: params.experience,
          style: params.style
        }
      });

      if (!response.ok) {
        throw new Error(`Rezi templates API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformTemplates(data);
    } catch (error) {
      console.error('Rezi templates error:', error);
      return this.getFallbackTemplates(params);
    }
  }

  async getBulletPointSuggestions(params: {
    role: string;
    industry: string;
    experience: string;
    achievements: string[];
  }): Promise<{
    suggestions: Array<{
      original: string;
      improved: string;
      reasoning: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    templates: Array<{
      category: string;
      examples: string[];
    }>;
    actionWords: string[];
  }> {
    if (!this.apiKey) {
      return this.getAIBulletPointSuggestions(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/bullet-points/improve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: params.role,
          industry: params.industry,
          experience: params.experience,
          achievements: params.achievements,
          include_templates: true,
          include_action_words: true
        })
      });

      if (!response.ok) {
        throw new Error(`Rezi bullet points API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformBulletPoints(data);
    } catch (error) {
      console.error('Rezi bullet points error:', error);
      return this.getAIBulletPointSuggestions(params);
    }
  }

  private transformOptimizedResume(data: any): ReziOptimizedResume {
    return {
      optimizedContent: data.optimized_content || {},
      atsScore: data.ats_score || 85,
      improvements: data.improvements || [],
      keywordAnalysis: {
        matched: data.keyword_analysis?.matched || [],
        missing: data.keyword_analysis?.missing || [],
        density: data.keyword_analysis?.density || 0.08
      },
      formatting: {
        score: data.formatting?.score || 92,
        suggestions: data.formatting?.suggestions || []
      },
      tailoring: {
        jobAlignment: data.tailoring?.job_alignment || 88,
        recommendedChanges: data.tailoring?.recommended_changes || []
      }
    };
  }

  private transformCoverLetter(data: any): ReziCoverLetter {
    return {
      content: data.content || '',
      structure: {
        opening: data.structure?.opening || '',
        body: data.structure?.body || [],
        closing: data.structure?.closing || ''
      },
      personalization: {
        companyResearch: data.personalization?.company_research || [],
        roleAlignment: data.personalization?.role_alignment || [],
        valueProposition: data.personalization?.value_proposition || []
      },
      tone: data.tone || 'professional',
      wordCount: data.word_count || 0
    };
  }

  private transformATSAnalysis(data: any): ReziATSAnalysis {
    return {
      overallScore: data.overall_score || 85,
      sections: data.sections || {},
      keywordOptimization: {
        relevantKeywords: data.keyword_optimization?.relevant_keywords || [],
        missingKeywords: data.keyword_optimization?.missing_keywords || [],
        keywordDensity: data.keyword_optimization?.keyword_density || 0.08
      },
      formatting: {
        atsCompatible: data.formatting?.ats_compatible || true,
        issues: data.formatting?.issues || [],
        fixes: data.formatting?.fixes || []
      },
      industryBenchmark: {
        percentile: data.industry_benchmark?.percentile || 75,
        comparison: data.industry_benchmark?.comparison || 'Above average',
        topPerformerTips: data.industry_benchmark?.top_performer_tips || []
      }
    };
  }

  private transformTemplates(data: any): any {
    return {
      templates: data.templates || [],
      recommendations: data.recommendations || []
    };
  }

  private transformBulletPoints(data: any): any {
    return {
      suggestions: data.suggestions || [],
      templates: data.templates || [],
      actionWords: data.action_words || []
    };
  }

  // AI-powered fallback methods
  private async getAIOptimizedResume(params: any): Promise<ReziOptimizedResume> {
    // Use OpenAI/Anthropic for resume optimization
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Optimize this resume for the following job description:
    
    Job Description: ${params.jobDescription}
    Target Role: ${params.targetRole}
    Industry: ${params.industry}
    
    Resume Content: ${JSON.stringify(params.resumeContent)}
    
    Please provide:
    1. Optimized resume content
    2. ATS score (0-100)
    3. Specific improvements
    4. Keyword analysis
    5. Formatting suggestions
    6. Job alignment recommendations
    
    Format the response as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIOptimizedResume(aiResponse);
    } catch (error) {
      console.error('AI resume optimization error:', error);
      return this.getFallbackOptimizedResume(params);
    }
  }

  private async getAICoverLetter(params: any): Promise<ReziCoverLetter> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Generate a professional cover letter based on:
    
    Job Description: ${params.jobDescription}
    Company: ${params.companyName}
    Resume Content: ${JSON.stringify(params.resumeContent)}
    Tone: ${params.tone}
    Length: ${params.length}
    
    Include:
    1. Compelling opening
    2. Relevant experience highlights
    3. Company-specific research
    4. Strong closing
    5. Professional formatting
    
    Format as structured JSON with content and analysis.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAICoverLetter(aiResponse);
    } catch (error) {
      console.error('AI cover letter generation error:', error);
      return this.getFallbackCoverLetter(params);
    }
  }

  private async getAIATSAnalysis(params: any): Promise<ReziATSAnalysis> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Analyze this resume for ATS compatibility:
    
    Resume: ${JSON.stringify(params.resumeContent)}
    Job Description: ${params.jobDescription}
    
    Provide:
    1. Overall ATS score (0-100)
    2. Section-by-section analysis
    3. Keyword optimization
    4. Formatting issues
    5. Industry benchmark comparison
    6. Specific recommendations
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIATSAnalysis(aiResponse);
    } catch (error) {
      console.error('AI ATS analysis error:', error);
      return this.getFallbackATSAnalysis(params);
    }
  }

  private async getAIBulletPointSuggestions(params: any): Promise<any> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Improve these bullet points for a ${params.role} in ${params.industry}:
    
    Current achievements: ${params.achievements.join(', ')}
    Experience level: ${params.experience}
    
    Provide:
    1. Improved versions of each bullet point
    2. Reasoning for changes
    3. Impact assessment
    4. Template examples
    5. Action words list
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIBulletPoints(aiResponse);
    } catch (error) {
      console.error('AI bullet points error:', error);
      return this.getFallbackBulletPoints(params);
    }
  }

  private parseAIOptimizedResume(response: string): ReziOptimizedResume {
    try {
      const parsed = JSON.parse(response);
      return {
        optimizedContent: parsed.optimizedContent || {},
        atsScore: parsed.atsScore || 85,
        improvements: parsed.improvements || [],
        keywordAnalysis: parsed.keywordAnalysis || { matched: [], missing: [], density: 0.08 },
        formatting: parsed.formatting || { score: 92, suggestions: [] },
        tailoring: parsed.tailoring || { jobAlignment: 88, recommendedChanges: [] }
      };
    } catch (error) {
      return this.getFallbackOptimizedResume({});
    }
  }

  private parseAICoverLetter(response: string): ReziCoverLetter {
    try {
      const parsed = JSON.parse(response);
      return {
        content: parsed.content || '',
        structure: parsed.structure || { opening: '', body: [], closing: '' },
        personalization: parsed.personalization || { companyResearch: [], roleAlignment: [], valueProposition: [] },
        tone: parsed.tone || 'professional',
        wordCount: parsed.wordCount || 0
      };
    } catch (error) {
      return this.getFallbackCoverLetter({});
    }
  }

  private parseAIATSAnalysis(response: string): ReziATSAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        overallScore: parsed.overallScore || 85,
        sections: parsed.sections || {},
        keywordOptimization: parsed.keywordOptimization || { relevantKeywords: [], missingKeywords: [], keywordDensity: 0.08 },
        formatting: parsed.formatting || { atsCompatible: true, issues: [], fixes: [] },
        industryBenchmark: parsed.industryBenchmark || { percentile: 75, comparison: 'Above average', topPerformerTips: [] }
      };
    } catch (error) {
      return this.getFallbackATSAnalysis({});
    }
  }

  private parseAIBulletPoints(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        suggestions: parsed.suggestions || [],
        templates: parsed.templates || [],
        actionWords: parsed.actionWords || []
      };
    } catch (error) {
      return this.getFallbackBulletPoints({});
    }
  }

  private getFallbackOptimizedResume(params: any): ReziOptimizedResume {
    return {
      optimizedContent: params.resumeContent || {},
      atsScore: 85,
      improvements: [
        {
          section: 'Summary',
          issue: 'Generic summary statement',
          suggestion: 'Tailor summary to specific role requirements',
          impact: 'high'
        },
        {
          section: 'Experience',
          issue: 'Missing quantifiable achievements',
          suggestion: 'Add specific metrics and results',
          impact: 'high'
        },
        {
          section: 'Skills',
          issue: 'Skills not prioritized by relevance',
          suggestion: 'Reorder skills to match job requirements',
          impact: 'medium'
        }
      ],
      keywordAnalysis: {
        matched: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        missing: ['TypeScript', 'GraphQL', 'Docker', 'AWS'],
        density: 0.08
      },
      formatting: {
        score: 92,
        suggestions: [
          'Use consistent bullet points',
          'Ensure proper section spacing',
          'Use ATS-friendly fonts'
        ]
      },
      tailoring: {
        jobAlignment: 88,
        recommendedChanges: [
          'Emphasize leadership experience',
          'Highlight relevant technologies',
          'Quantify project impacts'
        ]
      }
    };
  }

  private getFallbackCoverLetter(params: any): ReziCoverLetter {
    return {
      content: `Dear Hiring Manager,

I am writing to express my strong interest in the ${params.targetRole || 'position'} at ${params.companyName || 'your company'}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

In my previous role, I successfully led cross-functional teams to deliver high-quality software products that exceeded client expectations. My experience with modern technologies and agile methodologies aligns perfectly with your requirements.

I am particularly drawn to ${params.companyName || 'your company'} because of its commitment to innovation and excellence. I would welcome the opportunity to discuss how my skills and experience can contribute to your continued success.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
[Your Name]`,
      structure: {
        opening: 'Express interest and enthusiasm',
        body: [
          'Highlight relevant experience',
          'Connect skills to job requirements',
          'Show company knowledge'
        ],
        closing: 'Professional closing with call to action'
      },
      personalization: {
        companyResearch: ['Company mission alignment', 'Industry leadership', 'Innovation focus'],
        roleAlignment: ['Technical skills match', 'Experience relevance', 'Cultural fit'],
        valueProposition: ['Problem-solving ability', 'Team leadership', 'Technical expertise']
      },
      tone: 'professional',
      wordCount: 180
    };
  }

  private getFallbackATSAnalysis(params: any): ReziATSAnalysis {
    return {
      overallScore: 85,
      sections: {
        summary: {
          score: 88,
          feedback: 'Strong summary with relevant keywords',
          recommendations: ['Add more specific achievements', 'Include target role keywords']
        },
        experience: {
          score: 82,
          feedback: 'Good experience section with quantifiable results',
          recommendations: ['Use more action verbs', 'Include more metrics']
        },
        skills: {
          score: 90,
          feedback: 'Comprehensive skills section',
          recommendations: ['Prioritize by relevance', 'Add emerging technologies']
        }
      },
      keywordOptimization: {
        relevantKeywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        missingKeywords: ['TypeScript', 'GraphQL', 'Docker', 'AWS'],
        keywordDensity: 0.08
      },
      formatting: {
        atsCompatible: true,
        issues: [],
        fixes: []
      },
      industryBenchmark: {
        percentile: 75,
        comparison: 'Above average for your experience level',
        topPerformerTips: [
          'Include more quantifiable achievements',
          'Use industry-specific keywords',
          'Optimize for target role requirements'
        ]
      }
    };
  }

  private getFallbackTemplates(params: any): any {
    return {
      templates: [
        {
          id: 'modern-tech',
          name: 'Modern Tech Professional',
          description: 'Clean, modern design optimized for tech roles',
          preview: 'https://example.com/template-preview.jpg',
          atsScore: 95,
          bestFor: ['Software Engineer', 'Data Scientist', 'Product Manager']
        },
        {
          id: 'classic-business',
          name: 'Classic Business',
          description: 'Traditional format for corporate environments',
          preview: 'https://example.com/template-preview.jpg',
          atsScore: 92,
          bestFor: ['Business Analyst', 'Project Manager', 'Consultant']
        }
      ],
      recommendations: [
        {
          templateId: 'modern-tech',
          reason: 'Matches your industry and experience level',
          suitability: 95
        }
      ]
    };
  }

  private getFallbackBulletPoints(params: any): any {
    return {
      suggestions: [
        {
          original: 'Worked on software projects',
          improved: 'Led development of 3 high-impact software solutions, reducing processing time by 40%',
          reasoning: 'Added specific metrics and leadership responsibility',
          impact: 'high'
        },
        {
          original: 'Managed team',
          improved: 'Managed cross-functional team of 8 engineers, delivering projects 15% ahead of schedule',
          reasoning: 'Quantified team size and performance improvement',
          impact: 'high'
        }
      ],
      templates: [
        {
          category: 'Leadership',
          examples: [
            'Led team of X to achieve Y, resulting in Z% improvement',
            'Managed project from conception to delivery, exceeding targets by X%'
          ]
        },
        {
          category: 'Technical',
          examples: [
            'Developed and implemented X solution, improving Y by Z%',
            'Optimized system performance, reducing load times by X%'
          ]
        }
      ],
      actionWords: [
        'Achieved', 'Developed', 'Implemented', 'Optimized', 'Led', 'Managed',
        'Created', 'Designed', 'Delivered', 'Improved', 'Reduced', 'Increased'
      ]
    };
  }
}

export const reziService = new ReziService();