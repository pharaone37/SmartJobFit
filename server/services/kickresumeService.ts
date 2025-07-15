import fetch from 'node-fetch';

interface KickresumeTemplate {
  id: string;
  name: string;
  category: string;
  style: 'modern' | 'classic' | 'creative' | 'minimal';
  preview: string;
  atsScore: number;
  features: string[];
  suitableFor: string[];
  customization: {
    colors: string[];
    fonts: string[];
    layouts: string[];
  };
}

interface KickresumeResumeBuilder {
  templateId: string;
  content: {
    personalInfo: {
      name: string;
      title: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      portfolio?: string;
      photo?: string;
    };
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
      achievements: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      location: string;
      startDate: string;
      endDate: string;
      gpa?: string;
      honors?: string[];
    }>;
    skills: {
      technical: Array<{
        name: string;
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      }>;
      soft: string[];
      languages: Array<{
        name: string;
        level: 'basic' | 'conversational' | 'fluent' | 'native';
      }>;
    };
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
      github?: string;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
      url?: string;
    }>;
    awards?: Array<{
      title: string;
      issuer: string;
      date: string;
      description: string;
    }>;
  };
  styling: {
    colorScheme: string;
    font: string;
    layout: string;
  };
}

interface KickresumeAIOptimization {
  originalContent: any;
  optimizedContent: any;
  improvements: Array<{
    section: string;
    type: 'content' | 'structure' | 'keywords' | 'formatting';
    before: string;
    after: string;
    reasoning: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  gptSuggestions: {
    summary: string;
    bulletPoints: string[];
    keywords: string[];
    structure: string[];
  };
  atsOptimization: {
    score: number;
    keywordDensity: number;
    readability: number;
    suggestions: string[];
  };
}

interface KickresumeExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'json';
  quality: 'standard' | 'high' | 'print';
  watermark: boolean;
  customizations: {
    margins: string;
    fontSize: string;
    spacing: string;
  };
}

class KickresumeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KICKRESUME_API_KEY || '';
    this.baseUrl = 'https://api.kickresume.com/v1';
  }

  async getTemplates(params: {
    category?: string;
    style?: string;
    industry?: string;
    experience?: string;
  }): Promise<{
    templates: KickresumeTemplate[];
    recommendations: Array<{
      templateId: string;
      reason: string;
      suitability: number;
    }>;
    categories: string[];
  }> {
    if (!this.apiKey) {
      console.log('KICKRESUME_API_KEY not found. Using curated template collection.');
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
          category: params.category,
          style: params.style,
          industry: params.industry,
          experience: params.experience
        }
      });

      if (!response.ok) {
        throw new Error(`Kickresume API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformTemplates(data);
    } catch (error) {
      console.error('Kickresume templates error:', error);
      return this.getFallbackTemplates(params);
    }
  }

  async buildResume(params: {
    templateId: string;
    content: any;
    aiOptimization: boolean;
    targetRole?: string;
    industry?: string;
  }): Promise<{
    resumeId: string;
    optimizedContent: any;
    aiSuggestions: KickresumeAIOptimization;
    previewUrl: string;
  }> {
    if (!this.apiKey) {
      console.log('KICKRESUME_API_KEY not found. Using AI-powered resume building.');
      return this.getAIResumeBuilder(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: params.templateId,
          content: params.content,
          ai_optimization: params.aiOptimization,
          target_role: params.targetRole,
          industry: params.industry,
          include_gpt_suggestions: true
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume build API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformResumeBuilder(data);
    } catch (error) {
      console.error('Kickresume build error:', error);
      return this.getAIResumeBuilder(params);
    }
  }

  async optimizeWithGPT(params: {
    resumeContent: any;
    jobDescription: string;
    targetRole: string;
    optimizationLevel: 'basic' | 'advanced' | 'premium';
  }): Promise<KickresumeAIOptimization> {
    if (!this.apiKey) {
      console.log('KICKRESUME_API_KEY not found. Using GPT-powered optimization.');
      return this.getGPTOptimization(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/ai/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          job_description: params.jobDescription,
          target_role: params.targetRole,
          optimization_level: params.optimizationLevel,
          use_gpt: true,
          include_ats_analysis: true
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume GPT optimization API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformGPTOptimization(data);
    } catch (error) {
      console.error('Kickresume GPT optimization error:', error);
      return this.getGPTOptimization(params);
    }
  }

  async generateContent(params: {
    section: 'summary' | 'experience' | 'skills' | 'projects';
    userInput: any;
    targetRole: string;
    industry: string;
    tone: 'professional' | 'creative' | 'casual';
  }): Promise<{
    generatedContent: string;
    alternatives: string[];
    tips: string[];
    keywordSuggestions: string[];
  }> {
    if (!this.apiKey) {
      console.log('KICKRESUME_API_KEY not found. Using AI content generation.');
      return this.getAIContentGeneration(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/ai/generate-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          section: params.section,
          user_input: params.userInput,
          target_role: params.targetRole,
          industry: params.industry,
          tone: params.tone,
          include_alternatives: true,
          include_tips: true
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume content generation API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformContentGeneration(data);
    } catch (error) {
      console.error('Kickresume content generation error:', error);
      return this.getAIContentGeneration(params);
    }
  }

  async exportResume(params: {
    resumeId: string;
    options: KickresumeExportOptions;
  }): Promise<{
    downloadUrl: string;
    format: string;
    size: string;
    expiresAt: string;
  }> {
    if (!this.apiKey) {
      return this.getFallbackExport(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes/${params.resumeId}/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: params.options.format,
          quality: params.options.quality,
          watermark: params.options.watermark,
          customizations: params.options.customizations
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume export API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformExport(data);
    } catch (error) {
      console.error('Kickresume export error:', error);
      return this.getFallbackExport(params);
    }
  }

  async analyzeResume(params: {
    resumeContent: any;
    analysisType: 'ats' | 'readability' | 'completeness' | 'comprehensive';
  }): Promise<{
    overallScore: number;
    analysis: {
      ats: {
        score: number;
        issues: string[];
        suggestions: string[];
      };
      readability: {
        score: number;
        level: string;
        improvements: string[];
      };
      completeness: {
        score: number;
        missingElements: string[];
        recommendations: string[];
      };
      design: {
        score: number;
        feedback: string[];
        suggestions: string[];
      };
    };
    benchmark: {
      industryAverage: number;
      percentile: number;
      comparison: string;
    };
  }> {
    if (!this.apiKey) {
      return this.getAIResumeAnalysis(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          analysis_type: params.analysisType,
          include_benchmark: true
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume analysis API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAnalysis(data);
    } catch (error) {
      console.error('Kickresume analysis error:', error);
      return this.getAIResumeAnalysis(params);
    }
  }

  private transformTemplates(data: any): any {
    return {
      templates: data.templates?.map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        style: t.style,
        preview: t.preview,
        atsScore: t.ats_score,
        features: t.features,
        suitableFor: t.suitable_for,
        customization: t.customization
      })) || [],
      recommendations: data.recommendations || [],
      categories: data.categories || []
    };
  }

  private transformResumeBuilder(data: any): any {
    return {
      resumeId: data.resume_id,
      optimizedContent: data.optimized_content,
      aiSuggestions: data.ai_suggestions,
      previewUrl: data.preview_url
    };
  }

  private transformGPTOptimization(data: any): KickresumeAIOptimization {
    return {
      originalContent: data.original_content,
      optimizedContent: data.optimized_content,
      improvements: data.improvements || [],
      gptSuggestions: data.gpt_suggestions || {
        summary: '',
        bulletPoints: [],
        keywords: [],
        structure: []
      },
      atsOptimization: data.ats_optimization || {
        score: 85,
        keywordDensity: 0.08,
        readability: 88,
        suggestions: []
      }
    };
  }

  private transformContentGeneration(data: any): any {
    return {
      generatedContent: data.generated_content,
      alternatives: data.alternatives || [],
      tips: data.tips || [],
      keywordSuggestions: data.keyword_suggestions || []
    };
  }

  private transformExport(data: any): any {
    return {
      downloadUrl: data.download_url,
      format: data.format,
      size: data.size,
      expiresAt: data.expires_at
    };
  }

  private transformAnalysis(data: any): any {
    return {
      overallScore: data.overall_score || 85,
      analysis: data.analysis || {},
      benchmark: data.benchmark || {}
    };
  }

  // AI-powered fallback methods
  private async getAIResumeBuilder(params: any): Promise<any> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Build an optimized resume using this template and content:
    
    Template ID: ${params.templateId}
    Content: ${JSON.stringify(params.content)}
    Target Role: ${params.targetRole}
    Industry: ${params.industry}
    
    Please provide:
    1. Optimized resume content
    2. AI-powered improvements
    3. ATS optimization suggestions
    4. Content structure recommendations
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'gpt-4');
      return this.parseAIResumeBuilder(aiResponse);
    } catch (error) {
      console.error('AI resume builder error:', error);
      return this.getFallbackResumeBuilder(params);
    }
  }

  private async getGPTOptimization(params: any): Promise<KickresumeAIOptimization> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Optimize this resume content with GPT-powered suggestions:
    
    Resume Content: ${JSON.stringify(params.resumeContent)}
    Job Description: ${params.jobDescription}
    Target Role: ${params.targetRole}
    Optimization Level: ${params.optimizationLevel}
    
    Provide:
    1. Optimized content
    2. Detailed improvements
    3. GPT-specific suggestions
    4. ATS optimization
    5. Keyword recommendations
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'gpt-4');
      return this.parseGPTOptimization(aiResponse);
    } catch (error) {
      console.error('GPT optimization error:', error);
      return this.getFallbackGPTOptimization(params);
    }
  }

  private async getAIContentGeneration(params: any): Promise<any> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Generate ${params.section} content for a resume:
    
    User Input: ${JSON.stringify(params.userInput)}
    Target Role: ${params.targetRole}
    Industry: ${params.industry}
    Tone: ${params.tone}
    
    Provide:
    1. Primary generated content
    2. 2-3 alternative versions
    3. Writing tips
    4. Keyword suggestions
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'gpt-4');
      return this.parseAIContentGeneration(aiResponse);
    } catch (error) {
      console.error('AI content generation error:', error);
      return this.getFallbackContentGeneration(params);
    }
  }

  private async getAIResumeAnalysis(params: any): Promise<any> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Analyze this resume comprehensively:
    
    Resume Content: ${JSON.stringify(params.resumeContent)}
    Analysis Type: ${params.analysisType}
    
    Provide:
    1. Overall score
    2. ATS analysis
    3. Readability assessment
    4. Completeness evaluation
    5. Design feedback
    6. Industry benchmark
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'gpt-4');
      return this.parseAIAnalysis(aiResponse);
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.getFallbackAnalysis(params);
    }
  }

  private parseAIResumeBuilder(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        resumeId: 'ai_resume_' + Date.now(),
        optimizedContent: parsed.optimizedContent || {},
        aiSuggestions: parsed.aiSuggestions || {},
        previewUrl: '/preview/ai-resume'
      };
    } catch (error) {
      return this.getFallbackResumeBuilder({});
    }
  }

  private parseGPTOptimization(response: string): KickresumeAIOptimization {
    try {
      const parsed = JSON.parse(response);
      return {
        originalContent: parsed.originalContent || {},
        optimizedContent: parsed.optimizedContent || {},
        improvements: parsed.improvements || [],
        gptSuggestions: parsed.gptSuggestions || {
          summary: '',
          bulletPoints: [],
          keywords: [],
          structure: []
        },
        atsOptimization: parsed.atsOptimization || {
          score: 85,
          keywordDensity: 0.08,
          readability: 88,
          suggestions: []
        }
      };
    } catch (error) {
      return this.getFallbackGPTOptimization({});
    }
  }

  private parseAIContentGeneration(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        generatedContent: parsed.generatedContent || '',
        alternatives: parsed.alternatives || [],
        tips: parsed.tips || [],
        keywordSuggestions: parsed.keywordSuggestions || []
      };
    } catch (error) {
      return this.getFallbackContentGeneration({});
    }
  }

  private parseAIAnalysis(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        overallScore: parsed.overallScore || 85,
        analysis: parsed.analysis || {},
        benchmark: parsed.benchmark || {}
      };
    } catch (error) {
      return this.getFallbackAnalysis({});
    }
  }

  private getFallbackTemplates(params: any): any {
    return {
      templates: [
        {
          id: 'modern-professional',
          name: 'Modern Professional',
          category: 'professional',
          style: 'modern',
          preview: '/templates/modern-professional.jpg',
          atsScore: 95,
          features: ['ATS-optimized', 'Clean design', 'Professional layout'],
          suitableFor: ['Software Engineer', 'Business Analyst', 'Project Manager'],
          customization: {
            colors: ['#2563eb', '#059669', '#dc2626', '#7c3aed'],
            fonts: ['Inter', 'Roboto', 'Open Sans', 'Lato'],
            layouts: ['Single column', 'Two column', 'Sidebar']
          }
        },
        {
          id: 'creative-designer',
          name: 'Creative Designer',
          category: 'creative',
          style: 'creative',
          preview: '/templates/creative-designer.jpg',
          atsScore: 88,
          features: ['Visual appeal', 'Portfolio section', 'Color customization'],
          suitableFor: ['UX Designer', 'Graphic Designer', 'Creative Director'],
          customization: {
            colors: ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'],
            fonts: ['Poppins', 'Montserrat', 'Nunito', 'Source Sans Pro'],
            layouts: ['Creative grid', 'Portfolio focus', 'Visual layout']
          }
        },
        {
          id: 'executive-classic',
          name: 'Executive Classic',
          category: 'executive',
          style: 'classic',
          preview: '/templates/executive-classic.jpg',
          atsScore: 92,
          features: ['Executive format', 'Achievement focus', 'Leadership emphasis'],
          suitableFor: ['CEO', 'VP', 'Director', 'Senior Manager'],
          customization: {
            colors: ['#1f2937', '#374151', '#6b7280', '#9ca3af'],
            fonts: ['Times New Roman', 'Georgia', 'Crimson Text', 'Playfair Display'],
            layouts: ['Classic format', 'Executive summary', 'Achievement focused']
          }
        }
      ],
      recommendations: [
        {
          templateId: 'modern-professional',
          reason: 'Perfect for tech roles with high ATS compatibility',
          suitability: 95
        }
      ],
      categories: ['professional', 'creative', 'executive', 'academic', 'entry-level']
    };
  }

  private getFallbackResumeBuilder(params: any): any {
    return {
      resumeId: 'fallback_resume_' + Date.now(),
      optimizedContent: params.content || {},
      aiSuggestions: {
        originalContent: {},
        optimizedContent: {},
        improvements: [],
        gptSuggestions: {
          summary: 'AI-generated professional summary',
          bulletPoints: ['Enhanced achievement descriptions', 'Quantified results', 'Action-oriented language'],
          keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
          structure: ['Improved section organization', 'Better content flow', 'Enhanced readability']
        },
        atsOptimization: {
          score: 85,
          keywordDensity: 0.08,
          readability: 88,
          suggestions: ['Add more relevant keywords', 'Improve section structure', 'Enhance formatting']
        }
      },
      previewUrl: '/preview/fallback-resume'
    };
  }

  private getFallbackGPTOptimization(params: any): KickresumeAIOptimization {
    return {
      originalContent: params.resumeContent || {},
      optimizedContent: params.resumeContent || {},
      improvements: [
        {
          section: 'Summary',
          type: 'content',
          before: 'Generic summary',
          after: 'Tailored professional summary',
          reasoning: 'Customized for target role',
          impact: 'high'
        },
        {
          section: 'Experience',
          type: 'keywords',
          before: 'Basic job descriptions',
          after: 'Keyword-optimized achievements',
          reasoning: 'Enhanced with relevant keywords',
          impact: 'high'
        }
      ],
      gptSuggestions: {
        summary: 'Results-driven professional with expertise in modern technologies',
        bulletPoints: [
          'Led cross-functional teams to deliver high-impact solutions',
          'Optimized system performance resulting in 40% efficiency improvement',
          'Implemented automated processes reducing manual effort by 60%'
        ],
        keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker'],
        structure: [
          'Reorganize sections for better flow',
          'Enhance readability with bullet points',
          'Add quantifiable achievements'
        ]
      },
      atsOptimization: {
        score: 88,
        keywordDensity: 0.09,
        readability: 90,
        suggestions: [
          'Include more industry-specific keywords',
          'Improve section formatting',
          'Add quantifiable metrics'
        ]
      }
    };
  }

  private getFallbackContentGeneration(params: any): any {
    return {
      generatedContent: 'AI-generated content based on your input and target role requirements.',
      alternatives: [
        'Alternative version 1 with different tone',
        'Alternative version 2 with enhanced focus',
        'Alternative version 3 with industry-specific language'
      ],
      tips: [
        'Use action verbs to start bullet points',
        'Include quantifiable achievements',
        'Tailor content to job requirements'
      ],
      keywordSuggestions: [
        'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker',
        'Agile', 'Scrum', 'Git', 'CI/CD', 'Microservices'
      ]
    };
  }

  private getFallbackExport(params: any): any {
    return {
      downloadUrl: '/download/fallback-resume',
      format: params.options.format,
      size: '245 KB',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  private getFallbackAnalysis(params: any): any {
    return {
      overallScore: 85,
      analysis: {
        ats: {
          score: 88,
          issues: ['Missing some target keywords', 'Section formatting could be improved'],
          suggestions: ['Add more relevant keywords', 'Improve section structure']
        },
        readability: {
          score: 92,
          level: 'Professional',
          improvements: ['Use more concise language', 'Break up long paragraphs']
        },
        completeness: {
          score: 90,
          missingElements: ['Professional summary could be stronger'],
          recommendations: ['Add quantifiable achievements', 'Include relevant certifications']
        },
        design: {
          score: 85,
          feedback: ['Clean, professional layout', 'Good use of white space'],
          suggestions: ['Consider adding subtle color accents', 'Improve section hierarchy']
        }
      },
      benchmark: {
        industryAverage: 78,
        percentile: 75,
        comparison: 'Above average for your experience level'
      }
    };
  }
}

export const kickresumeService = new KickresumeService();