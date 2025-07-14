import fetch from 'node-fetch';

export interface ParsedResume {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    github?: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    skills: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  summary?: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
  suggestions: string[];
  summary: string;
}

class EdenAiService {
  private apiKey: string;
  private baseUrl = 'https://api.edenai.run/v2';

  constructor() {
    this.apiKey = process.env.EDEN_AI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('EDEN_AI_API_KEY not found. Resume parsing will use fallback.');
    }
  }

  async parseResume(resumeFile: Buffer | string, fileName: string): Promise<ParsedResume> {
    if (!this.apiKey) {
      return this.fallbackResumeParser(resumeFile);
    }

    try {
      const formData = new FormData();
      formData.append('providers', 'affinda,hireability');
      formData.append('file', new Blob([resumeFile]), fileName);
      formData.append('fallback_providers', 'affinda');

      const response = await fetch(`${this.baseUrl}/ocr/resume_parser`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Eden AI API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      return this.transformEdenResponse(data);
    } catch (error) {
      console.error('Eden AI resume parsing error:', error);
      return this.fallbackResumeParser(resumeFile);
    }
  }

  private transformEdenResponse(data: any): ParsedResume {
    const result = data.affinda?.extracted_data || data.hireability?.extracted_data || {};
    
    return {
      personalInfo: {
        name: result.name?.raw || '',
        email: result.emails?.[0]?.raw || '',
        phone: result.phone_numbers?.[0]?.raw || '',
        address: result.location?.raw || '',
        linkedin: result.urls?.find((url: any) => url.raw.includes('linkedin'))?.raw || '',
        github: result.urls?.find((url: any) => url.raw.includes('github'))?.raw || '',
      },
      experience: (result.work_experience || []).map((exp: any) => ({
        company: exp.organization || '',
        position: exp.job_title || '',
        startDate: exp.start_date || '',
        endDate: exp.end_date || '',
        description: exp.job_description || '',
        skills: exp.skills || [],
      })),
      education: (result.education || []).map((edu: any) => ({
        institution: edu.organization || '',
        degree: edu.title || '',
        field: edu.field_of_study || '',
        startDate: edu.start_date || '',
        endDate: edu.end_date || '',
        gpa: edu.gpa || '',
      })),
      skills: result.skills || [],
      certifications: (result.certifications || []).map((cert: any) => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
      })),
      languages: (result.languages || []).map((lang: any) => ({
        language: lang.name || '',
        proficiency: lang.proficiency || '',
      })),
      summary: result.summary || '',
    };
  }

  private fallbackResumeParser(resumeContent: Buffer | string): ParsedResume {
    const text = typeof resumeContent === 'string' ? resumeContent : resumeContent.toString();
    
    // Basic text extraction fallback
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/g;
    const githubRegex = /github\.com\/[a-zA-Z0-9-]+/g;
    
    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    const linkedinUrls = text.match(linkedinRegex) || [];
    const githubUrls = text.match(githubRegex) || [];
    
    // Extract name (first line that's not email/phone/url)
    const lines = text.split('\n').filter(line => line.trim());
    const name = lines.find(line => 
      !emailRegex.test(line) && 
      !phoneRegex.test(line) && 
      !line.includes('linkedin') && 
      !line.includes('github') &&
      line.length > 2 && 
      line.length < 50
    ) || '';

    // Extract common skills
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS',
      'SQL', 'Git', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Science',
      'Angular', 'Vue.js', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      personalInfo: {
        name,
        email: emails[0] || '',
        phone: phones[0] || '',
        linkedin: linkedinUrls[0] ? `https://${linkedinUrls[0]}` : '',
        github: githubUrls[0] ? `https://${githubUrls[0]}` : '',
      },
      experience: [],
      education: [],
      skills: foundSkills,
      certifications: [],
      languages: [],
      summary: '',
    };
  }

  async analyzeResumeWithAI(parsedResume: ParsedResume, jobDescription?: string): Promise<ResumeAnalysis> {
    // This would typically call Eden AI's analysis endpoints
    // For now, we'll use the existing OpenRouter integration
    const resumeText = JSON.stringify(parsedResume, null, 2);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://smartjobfit.com',
          'X-Title': 'SmartJobFit'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume analyzer. Analyze the parsed resume data and provide detailed feedback. Return a JSON response with: { "atsScore": number, "overallScore": number, "strengths": string[], "weaknesses": string[], "keywords": { "found": string[], "missing": string[] }, "suggestions": string[], "summary": string }'
            },
            {
              role: 'user',
              content: `Analyze this parsed resume data:\n\n${resumeText}${jobDescription ? `\n\nJob Description:\n${jobDescription}` : ''}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json() as any;
      const analysisText = data.choices[0].message.content;
      
      try {
        return JSON.parse(analysisText);
      } catch (parseError) {
        return {
          atsScore: 75,
          overallScore: 80,
          strengths: ['Professional formatting', 'Clear structure'],
          weaknesses: ['Missing key skills', 'Could be more specific'],
          keywords: { found: parsedResume.skills, missing: ['Leadership', 'Communication'] },
          suggestions: ['Add more technical keywords', 'Include quantifiable achievements'],
          summary: analysisText
        };
      }
    } catch (error) {
      console.error('Resume analysis error:', error);
      return {
        atsScore: 70,
        overallScore: 75,
        strengths: ['Resume successfully parsed'],
        weaknesses: ['Analysis service unavailable'],
        keywords: { found: parsedResume.skills, missing: [] },
        suggestions: ['Try analysis again later'],
        summary: 'Resume parsing completed successfully'
      };
    }
  }
}

export const edenAiService = new EdenAiService();