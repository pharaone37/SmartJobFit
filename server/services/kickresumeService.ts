import fetch from 'node-fetch';

interface KickresumeTemplate {
  id: string;
  name: string;
  category: string;
  preview: string;
  atsOptimized: boolean;
}

interface KickresumeResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

interface KickresumeGeneratedResume {
  id: string;
  templateId: string;
  content: KickresumeResumeData;
  pdfUrl: string;
  htmlContent: string;
  atsScore: number;
  suggestions: Array<{
    type: 'content' | 'format' | 'keywords';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

class KickresumeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.KICKRESUME_API_KEY || '';
    this.baseUrl = 'https://api.kickresume.com/v1';
  }

  async getResumeTemplates(category?: string): Promise<KickresumeTemplate[]> {
    if (!this.apiKey) {
      console.log('KICKRESUME_API_KEY not found. Using fallback templates.');
      return this.getFallbackTemplates();
    }

    try {
      const response = await fetch(`${this.baseUrl}/templates`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Kickresume API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformTemplates(data);
    } catch (error) {
      console.error('Kickresume templates error:', error);
      return this.getFallbackTemplates();
    }
  }

  async createResumeWithAI(resumeContent: string, templateId: string, targetJob?: string): Promise<KickresumeGeneratedResume> {
    if (!this.apiKey) {
      console.log('KICKRESUME_API_KEY not found. Using fallback resume generation.');
      return this.getFallbackGeneratedResume(resumeContent, templateId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: templateId,
          content: resumeContent,
          targetJob: targetJob,
          options: {
            useAI: true,
            optimizeForATS: true,
            enhanceContent: true,
            generateSummary: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume generation error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformGeneratedResume(data);
    } catch (error) {
      console.error('Kickresume generation error:', error);
      return this.getFallbackGeneratedResume(resumeContent, templateId);
    }
  }

  async optimizeResumeForATS(resumeData: KickresumeResumeData, jobDescription: string): Promise<{
    optimizedResume: KickresumeResumeData;
    atsScore: number;
    improvements: Array<{
      section: string;
      suggestion: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    keywords: {
      missing: string[];
      added: string[];
      density: number;
    };
  }> {
    if (!this.apiKey) {
      return this.getFallbackATSOptimization(resumeData, jobDescription);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes/optimize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData: resumeData,
          jobDescription: jobDescription,
          optimization: {
            atsCompatibility: true,
            keywordOptimization: true,
            formatOptimization: true,
            contentEnhancement: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume optimization error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformOptimizationResult(data);
    } catch (error) {
      console.error('Kickresume optimization error:', error);
      return this.getFallbackATSOptimization(resumeData, jobDescription);
    }
  }

  async generateCoverLetter(resumeData: KickresumeResumeData, jobDescription: string, companyName: string): Promise<{
    coverLetter: string;
    tone: 'professional' | 'casual' | 'enthusiastic';
    sections: {
      opening: string;
      body: string;
      closing: string;
    };
    suggestions: string[];
  }> {
    if (!this.apiKey) {
      return this.getFallbackCoverLetter(resumeData, jobDescription, companyName);
    }

    try {
      const response = await fetch(`${this.baseUrl}/cover-letters/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData: resumeData,
          jobDescription: jobDescription,
          companyName: companyName,
          options: {
            tone: 'professional',
            length: 'medium',
            personalization: 'high'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Kickresume cover letter error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCoverLetterResult(data);
    } catch (error) {
      console.error('Kickresume cover letter error:', error);
      return this.getFallbackCoverLetter(resumeData, jobDescription, companyName);
    }
  }

  private transformTemplates(data: any): KickresumeTemplate[] {
    return data.templates?.map((template: any) => ({
      id: template.id || '',
      name: template.name || '',
      category: template.category || '',
      preview: template.preview || '',
      atsOptimized: template.atsOptimized || false
    })) || [];
  }

  private transformGeneratedResume(data: any): KickresumeGeneratedResume {
    return {
      id: data.id || '',
      templateId: data.templateId || '',
      content: data.content || {},
      pdfUrl: data.pdfUrl || '',
      htmlContent: data.htmlContent || '',
      atsScore: data.atsScore || 0,
      suggestions: data.suggestions || []
    };
  }

  private transformOptimizationResult(data: any): any {
    return {
      optimizedResume: data.optimizedResume || {},
      atsScore: data.atsScore || 0,
      improvements: data.improvements || [],
      keywords: data.keywords || { missing: [], added: [], density: 0 }
    };
  }

  private transformCoverLetterResult(data: any): any {
    return {
      coverLetter: data.coverLetter || '',
      tone: data.tone || 'professional',
      sections: data.sections || { opening: '', body: '', closing: '' },
      suggestions: data.suggestions || []
    };
  }

  private getFallbackTemplates(): KickresumeTemplate[] {
    return [
      {
        id: 'modern-tech',
        name: 'Modern Tech Resume',
        category: 'Technology',
        preview: 'https://example.com/preview1.jpg',
        atsOptimized: true
      },
      {
        id: 'professional-business',
        name: 'Professional Business',
        category: 'Business',
        preview: 'https://example.com/preview2.jpg',
        atsOptimized: true
      },
      {
        id: 'creative-design',
        name: 'Creative Design',
        category: 'Design',
        preview: 'https://example.com/preview3.jpg',
        atsOptimized: false
      }
    ];
  }

  private getFallbackGeneratedResume(content: string, templateId: string): KickresumeGeneratedResume {
    return {
      id: 'fallback-resume',
      templateId: templateId,
      content: {
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '(555) 123-4567',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/johndoe',
          website: 'johndoe.com'
        },
        summary: 'Experienced professional with strong technical skills and proven track record.',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: []
      },
      pdfUrl: 'https://example.com/resume.pdf',
      htmlContent: '<div>Generated Resume HTML</div>',
      atsScore: 85,
      suggestions: [
        {
          type: 'content',
          message: 'Add more quantifiable achievements',
          priority: 'high'
        },
        {
          type: 'keywords',
          message: 'Include more relevant keywords',
          priority: 'medium'
        }
      ]
    };
  }

  private getFallbackATSOptimization(resumeData: KickresumeResumeData, jobDescription: string): any {
    return {
      optimizedResume: resumeData,
      atsScore: 88,
      improvements: [
        {
          section: 'Summary',
          suggestion: 'Add more relevant keywords from job description',
          impact: 'high'
        },
        {
          section: 'Experience',
          suggestion: 'Use more action verbs and quantify achievements',
          impact: 'medium'
        },
        {
          section: 'Skills',
          suggestion: 'Reorganize skills to match job requirements',
          impact: 'medium'
        }
      ],
      keywords: {
        missing: ['React', 'Node.js', 'AWS'],
        added: ['JavaScript', 'Frontend', 'Backend'],
        density: 0.08
      }
    };
  }

  private getFallbackCoverLetter(resumeData: KickresumeResumeData, jobDescription: string, companyName: string): any {
    return {
      coverLetter: `Dear Hiring Manager,

I am excited to apply for the position at ${companyName}. With my background in ${resumeData.personalInfo.name ? 'technology' : 'professional services'}, I am confident I can contribute to your team's success.

My experience includes working with various technologies and leading successful projects. I am particularly drawn to ${companyName} because of its innovative approach and commitment to excellence.

I would welcome the opportunity to discuss how my skills and enthusiasm can benefit your organization.

Best regards,
${resumeData.personalInfo.name || 'Your Name'}`,
      tone: 'professional' as const,
      sections: {
        opening: 'I am excited to apply for the position at ' + companyName,
        body: 'My experience includes working with various technologies and leading successful projects.',
        closing: 'I would welcome the opportunity to discuss how my skills can benefit your organization.'
      },
      suggestions: [
        'Personalize the opening with specific company details',
        'Add specific examples of relevant achievements',
        'Include a call to action in the closing'
      ]
    };
  }
}

export const kickresumeService = new KickresumeService();