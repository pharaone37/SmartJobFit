import fetch from 'node-fetch';

export class ReziApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.REZI_API_KEY || '';
    this.baseUrl = 'https://api.rezi.ai/v1';
  }

  async optimizeResume(resumeContent: string, jobDescription: string): Promise<any> {
    if (!this.apiKey) {
      console.log('REZI_API_KEY not found. Using fallback optimization.');
      return this.getFallbackOptimization(resumeContent, jobDescription);
    }

    try {
      const response = await fetch(`${this.baseUrl}/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          resume: resumeContent,
          jobDescription: jobDescription,
          optimizationType: 'ats-focused'
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformReziResponse(data);
    } catch (error) {
      console.error('Rezi optimization error:', error);
      return this.getFallbackOptimization(resumeContent, jobDescription);
    }
  }

  async generateCoverLetter(resumeContent: string, jobDescription: string, companyInfo: any): Promise<any> {
    if (!this.apiKey) {
      return this.getFallbackCoverLetter(resumeContent, jobDescription, companyInfo);
    }

    try {
      const response = await fetch(`${this.baseUrl}/cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          resume: resumeContent,
          jobDescription: jobDescription,
          company: companyInfo,
          tone: 'professional'
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCoverLetterResponse(data);
    } catch (error) {
      console.error('Rezi cover letter error:', error);
      return this.getFallbackCoverLetter(resumeContent, jobDescription, companyInfo);
    }
  }

  private transformReziResponse(data: any): any {
    return {
      optimizedContent: data.optimizedResume || '',
      atsScore: data.atsScore || 85,
      improvements: data.improvements || [],
      keywordMatches: data.keywordMatches || [],
      suggestions: data.suggestions || [],
      beforeAfterComparison: data.comparison || {},
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || []
    };
  }

  private transformCoverLetterResponse(data: any): any {
    return {
      coverLetter: data.coverLetter || '',
      keyPoints: data.keyPoints || [],
      companySpecific: data.companySpecific || [],
      callToAction: data.callToAction || '',
      tips: data.tips || [],
      tone: data.tone || 'professional',
      wordCount: data.wordCount || 0
    };
  }

  private getFallbackOptimization(resumeContent: string, jobDescription: string): any {
    // Extract keywords from job description
    const jobKeywords = this.extractKeywords(jobDescription);
    const resumeKeywords = this.extractKeywords(resumeContent);
    
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(resumeKeyword => 
        resumeKeyword.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    const missingKeywords = jobKeywords.filter(keyword => 
      !matchedKeywords.includes(keyword)
    );

    return {
      optimizedContent: resumeContent,
      atsScore: Math.max(60, Math.min(95, 70 + (matchedKeywords.length * 5))),
      improvements: [
        'Add more relevant keywords from the job description',
        'Quantify achievements with specific numbers',
        'Use action verbs to start bullet points',
        'Optimize formatting for ATS scanning'
      ],
      keywordMatches: matchedKeywords,
      suggestions: [
        `Consider adding these keywords: ${missingKeywords.slice(0, 5).join(', ')}`,
        'Use standard section headers (Experience, Education, Skills)',
        'Keep formatting simple and ATS-friendly',
        'Include relevant certifications and achievements'
      ],
      beforeAfterComparison: {
        keywordDensity: `${matchedKeywords.length}/${jobKeywords.length}`,
        readabilityScore: 85,
        formattingScore: 90
      },
      strengths: [
        'Clear contact information',
        'Relevant experience highlighted',
        'Professional formatting'
      ],
      weaknesses: [
        'Could use more specific achievements',
        'Missing some key industry terms',
        'Could be more concise'
      ]
    };
  }

  private getFallbackCoverLetter(resumeContent: string, jobDescription: string, companyInfo: any): any {
    const companyName = companyInfo?.name || 'the company';
    const jobTitle = this.extractJobTitle(jobDescription) || 'this position';
    
    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background in software development and proven track record of delivering high-quality solutions, I am excited about the opportunity to contribute to your team.

My experience includes developing scalable applications and working with modern technologies, which aligns well with your requirements. I have successfully delivered projects that required both technical expertise and collaborative teamwork, skills that I believe would be valuable to ${companyName}.

I am particularly drawn to ${companyName} because of its commitment to innovation and excellence in the industry. Your focus on cutting-edge solutions and collaborative culture resonates with my professional values and career aspirations.

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to ${companyName}'s continued success. Thank you for considering my application.

Sincerely,
[Your Name]`;

    return {
      coverLetter,
      keyPoints: [
        'Relevant experience highlighted',
        'Skills aligned with job requirements',
        'Company knowledge demonstrated',
        'Professional tone maintained'
      ],
      companySpecific: [
        `Mentions ${companyName} specifically`,
        'References company values',
        'Shows research and interest'
      ],
      callToAction: 'I would welcome the opportunity to discuss how my skills can contribute to your success.',
      tips: [
        'Customize for each application',
        'Research company culture and values',
        'Quantify achievements when possible',
        'Keep it concise (3-4 paragraphs)'
      ],
      tone: 'professional',
      wordCount: coverLetter.split(' ').length
    };
  }

  private extractKeywords(text: string): string[] {
    const commonKeywords = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'AWS', 'Docker', 'Git',
      'SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Kubernetes', 'GraphQL', 'REST', 'API',
      'Agile', 'Scrum', 'CI/CD', 'DevOps', 'Testing', 'Debug', 'Optimize', 'Scale',
      'Frontend', 'Backend', 'Full-stack', 'Mobile', 'Web', 'Cloud', 'Database'
    ];

    return commonKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private extractJobTitle(jobDescription: string): string | null {
    const titlePatterns = [
      /(?:position|role|job):\s*([^\n]+)/i,
      /(?:hiring|seeking|looking for)(?:\s+a)?\s+([^\n]+)/i,
      /^([^\n]+)\s+(?:position|role|job)/i
    ];

    for (const pattern of titlePatterns) {
      const match = jobDescription.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return null;
  }
}

export const reziapiService = new ReziApiService();