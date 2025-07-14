import { GoogleGenerativeAI } from '@google/generative-ai';

export interface JobMatch {
  jobId: string;
  matchScore: number;
  matchReasons: string[];
  skillsAlignment: {
    matched: string[];
    missing: string[];
    transferable: string[];
  };
  experienceAlignment: {
    relevant: string[];
    gaps: string[];
    transferable: string[];
  };
  recommendations: string[];
  salaryCompatibility: {
    score: number;
    reasoning: string;
  };
}

export interface CoverLetterGeneration {
  coverLetter: string;
  keyPoints: string[];
  companySpecific: string[];
  callToAction: string;
  tips: string[];
  tone: string;
  wordCount: number;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found. Using fallback responses.');
      return;
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async matchJobsToResume(jobs: any[], resumeData: any): Promise<JobMatch[]> {
    if (!this.model) {
      return this.fallbackJobMatching(jobs, resumeData);
    }

    try {
      const prompt = `
        You are an expert job matching AI. Analyze the following resume data and job listings to provide precise job matches.
        
        Resume Data:
        ${JSON.stringify(resumeData, null, 2)}
        
        Job Listings:
        ${JSON.stringify(jobs, null, 2)}
        
        For each job, provide a detailed match analysis. Return a JSON array with this structure:
        [
          {
            "jobId": "string",
            "matchScore": number (0-100),
            "matchReasons": ["reason1", "reason2"],
            "skillsAlignment": {
              "matched": ["skill1", "skill2"],
              "missing": ["skill3", "skill4"],
              "transferable": ["skill5", "skill6"]
            },
            "experienceAlignment": {
              "relevant": ["exp1", "exp2"],
              "gaps": ["gap1", "gap2"],
              "transferable": ["trans1", "trans2"]
            },
            "recommendations": ["rec1", "rec2"],
            "salaryCompatibility": {
              "score": number (0-100),
              "reasoning": "string"
            }
          }
        ]
        
        Focus on:
        - Technical skills alignment
        - Experience relevance
        - Career progression fit
        - Salary expectations
        - Company culture fit
        - Growth potential
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        return this.fallbackJobMatching(jobs, resumeData);
      }
    } catch (error) {
      console.error('Gemini job matching error:', error);
      return this.fallbackJobMatching(jobs, resumeData);
    }
  }

  async generateCoverLetter(
    resumeData: any,
    jobDescription: string,
    companyInfo: any,
    tone: string = 'professional'
  ): Promise<CoverLetterGeneration> {
    if (!this.model) {
      return this.fallbackCoverLetter(resumeData, jobDescription, companyInfo, tone);
    }

    try {
      const prompt = `
        You are an expert cover letter writer. Create a compelling, personalized cover letter using the following information:
        
        Resume Data:
        ${JSON.stringify(resumeData, null, 2)}
        
        Job Description:
        ${jobDescription}
        
        Company Information:
        ${JSON.stringify(companyInfo, null, 2)}
        
        Tone: ${tone}
        
        Requirements:
        - Professional yet engaging tone
        - Highlight relevant experience and skills
        - Show knowledge of the company
        - Include specific achievements
        - Keep it concise (250-400 words)
        - Include a strong call to action
        
        Return a JSON response with this structure:
        {
          "coverLetter": "string (full cover letter text)",
          "keyPoints": ["point1", "point2", "point3"],
          "companySpecific": ["company insight 1", "company insight 2"],
          "callToAction": "string",
          "tips": ["tip1", "tip2", "tip3"],
          "tone": "string",
          "wordCount": number
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        return this.fallbackCoverLetter(resumeData, jobDescription, companyInfo, tone);
      }
    } catch (error) {
      console.error('Gemini cover letter generation error:', error);
      return this.fallbackCoverLetter(resumeData, jobDescription, companyInfo, tone);
    }
  }

  async analyzeJobMarketTrends(industry: string, location: string): Promise<any> {
    if (!this.model) {
      return this.fallbackMarketAnalysis(industry, location);
    }

    try {
      const prompt = `
        Analyze the current job market trends for ${industry} in ${location}. 
        
        Provide comprehensive insights including:
        - Current hiring trends
        - In-demand skills
        - Salary ranges
        - Growth opportunities
        - Market challenges
        - Future outlook
        
        Return a JSON response with detailed market analysis.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        return JSON.parse(text);
      } catch (parseError) {
        return this.fallbackMarketAnalysis(industry, location);
      }
    } catch (error) {
      console.error('Gemini market analysis error:', error);
      return this.fallbackMarketAnalysis(industry, location);
    }
  }

  private fallbackJobMatching(jobs: any[], resumeData: any): JobMatch[] {
    return jobs.slice(0, 5).map((job, index) => ({
      jobId: job.id || `job_${index}`,
      matchScore: 75 + Math.random() * 20,
      matchReasons: [
        'Skills alignment with job requirements',
        'Experience level matches expectations',
        'Industry background relevant'
      ],
      skillsAlignment: {
        matched: ['JavaScript', 'React', 'Node.js'],
        missing: ['AWS', 'Docker'],
        transferable: ['Problem solving', 'Team collaboration']
      },
      experienceAlignment: {
        relevant: ['Software development', 'Web applications'],
        gaps: ['Cloud infrastructure'],
        transferable: ['Project management', 'Client communication']
      },
      recommendations: [
        'Highlight relevant project experience',
        'Consider learning cloud technologies',
        'Emphasize problem-solving abilities'
      ],
      salaryCompatibility: {
        score: 80,
        reasoning: 'Salary range aligns with market standards for this experience level'
      }
    }));
  }

  private fallbackCoverLetter(
    resumeData: any,
    jobDescription: string,
    companyInfo: any,
    tone: string
  ): CoverLetterGeneration {
    const companyName = companyInfo.name || 'the company';
    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${companyName}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

My experience includes developing web applications using modern technologies, which aligns well with your requirements. I have successfully delivered projects that required both technical expertise and collaborative teamwork, skills that I believe would be valuable to your organization.

I am particularly drawn to ${companyName} because of its commitment to innovation and excellence in the industry. I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your continued success.

Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
[Your Name]`;

    return {
      coverLetter,
      keyPoints: [
        'Technical skills alignment',
        'Project experience highlighted',
        'Company knowledge demonstrated'
      ],
      companySpecific: [
        'Innovation focus mentioned',
        'Industry leadership acknowledged'
      ],
      callToAction: 'I look forward to hearing from you soon.',
      tips: [
        'Customize for each application',
        'Research company values',
        'Quantify achievements when possible'
      ],
      tone,
      wordCount: coverLetter.split(' ').length
    };
  }

  private fallbackMarketAnalysis(industry: string, location: string): any {
    return {
      industry,
      location,
      trends: {
        hiring: 'Steady growth expected',
        skills: ['AI/ML', 'Cloud computing', 'Data analysis'],
        salary: 'Competitive market rates',
        growth: 'Positive outlook',
        challenges: 'Skills gap in emerging technologies'
      },
      outlook: 'Favorable for skilled professionals'
    };
  }
}

export const geminiService = new GeminiService();