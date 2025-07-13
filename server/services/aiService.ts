import { anthropicService } from './anthropic';
import { openaiService } from './openai';
import type { User, Job, Resume } from "@shared/schema";

export interface JobMatchResult {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keywords: string[];
}

export interface ResumeAnalysis {
  atsScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywords: string[];
  improvements: {
    format: string[];
    content: string[];
    keywords: string[];
  };
}

export interface InterviewAnalysis {
  overallScore: number;
  questionScores: { question: string; score: number; feedback: string }[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export class AIService {
  async matchJobToResume(jobDescription: string, resumeContent: string): Promise<JobMatchResult> {
    try {
      // Use OpenAI for job matching analysis
      const prompt = `
        Analyze the match between this job description and resume content. Provide a detailed analysis.
        
        Job Description:
        ${jobDescription}
        
        Resume Content:
        ${resumeContent}
        
        Please provide a JSON response with:
        {
          "matchScore": number (0-100),
          "strengths": ["strength1", "strength2", ...],
          "gaps": ["gap1", "gap2", ...],
          "recommendations": ["rec1", "rec2", ...],
          "keywords": ["keyword1", "keyword2", ...]
        }
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error matching job to resume:', error);
      return {
        matchScore: 0,
        strengths: [],
        gaps: [],
        recommendations: [],
        keywords: []
      };
    }
  }

  async analyzeResumeForATS(resumeContent: string): Promise<ResumeAnalysis> {
    try {
      // Use Anthropic for resume analysis
      const prompt = `
        Analyze this resume for ATS compatibility and overall quality:
        
        Resume Content:
        ${resumeContent}
        
        Please provide a JSON response with:
        {
          "atsScore": number (0-100),
          "strengths": ["strength1", "strength2", ...],
          "weaknesses": ["weakness1", "weakness2", ...],
          "recommendations": ["rec1", "rec2", ...],
          "keywords": ["keyword1", "keyword2", ...],
          "improvements": {
            "format": ["format improvement 1", ...],
            "content": ["content improvement 1", ...],
            "keywords": ["keyword improvement 1", ...]
          }
        }
      `;

      const message = await anthropicService.anthropic.messages.create({
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-sonnet-4-20250514',
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error('Error analyzing resume for ATS:', error);
      return {
        atsScore: 0,
        strengths: [],
        weaknesses: [],
        recommendations: [],
        keywords: [],
        improvements: {
          format: [],
          content: [],
          keywords: []
        }
      };
    }
  }

  async generateJobDescription(title: string, company: string, requirements: string[]): Promise<string> {
    try {
      const prompt = `
        Generate a comprehensive job description for the following position:
        
        Title: ${title}
        Company: ${company}
        Requirements: ${requirements.join(', ')}
        
        Include:
        - Company overview
        - Role description
        - Key responsibilities
        - Required qualifications
        - Preferred qualifications
        - Benefits and perks
        - Application process
        
        Make it engaging and professional.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating job description:', error);
      return '';
    }
  }

  async analyzeInterviewPerformance(questions: string[], answers: string[]): Promise<InterviewAnalysis> {
    try {
      const prompt = `
        Analyze this interview performance based on the questions and answers provided:
        
        Questions and Answers:
        ${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || 'No answer provided'}`).join('\n\n')}
        
        Please provide a JSON response with:
        {
          "overallScore": number (0-100),
          "questionScores": [
            {"question": "question text", "score": number, "feedback": "detailed feedback"},
            ...
          ],
          "strengths": ["strength1", "strength2", ...],
          "improvements": ["improvement1", "improvement2", ...],
          "recommendations": ["rec1", "rec2", ...]
        }
      `;

      const message = await anthropicService.anthropic.messages.create({
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-sonnet-4-20250514',
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error('Error analyzing interview performance:', error);
      return {
        overallScore: 0,
        questionScores: [],
        strengths: [],
        improvements: [],
        recommendations: []
      };
    }
  }

  async generateCareerAdvice(userProfile: User, jobHistory: string[]): Promise<string[]> {
    try {
      const prompt = `
        Based on this user profile and job history, provide personalized career advice:
        
        User Profile:
        - Name: ${userProfile.firstName} ${userProfile.lastName}
        - Title: ${userProfile.title}
        - Skills: ${userProfile.skills?.join(', ')}
        - Experience: ${userProfile.experience?.join(', ')}
        - Summary: ${userProfile.summary}
        
        Job History:
        ${jobHistory.join('\n')}
        
        Provide 5-7 actionable career advice recommendations as a JSON array of strings.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return result.advice || [];
    } catch (error) {
      console.error('Error generating career advice:', error);
      return [];
    }
  }

  async optimizeJobSearchStrategy(userProfile: User, searchHistory: string[]): Promise<{
    keywords: string[];
    targetCompanies: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `
        Optimize the job search strategy for this user based on their profile and search history:
        
        User Profile:
        - Title: ${userProfile.title}
        - Skills: ${userProfile.skills?.join(', ')}
        - Experience: ${userProfile.experience?.join(', ')}
        
        Search History:
        ${searchHistory.join('\n')}
        
        Please provide a JSON response with:
        {
          "keywords": ["optimized keyword 1", "optimized keyword 2", ...],
          "targetCompanies": ["company 1", "company 2", ...],
          "recommendations": ["recommendation 1", "recommendation 2", ...]
        }
      `;

      const message = await anthropicService.anthropic.messages.create({
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-sonnet-4-20250514',
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error('Error optimizing job search strategy:', error);
      return {
        keywords: [],
        targetCompanies: [],
        recommendations: []
      };
    }
  }

  async generateSkillRecommendations(userProfile: User, targetRole: string): Promise<{
    missingSkills: string[];
    learningPath: string[];
    resources: string[];
  }> {
    try {
      const prompt = `
        Analyze the skill gap for this user targeting the specified role:
        
        Current Skills: ${userProfile.skills?.join(', ')}
        Current Experience: ${userProfile.experience?.join(', ')}
        Target Role: ${targetRole}
        
        Please provide a JSON response with:
        {
          "missingSkills": ["skill 1", "skill 2", ...],
          "learningPath": ["step 1", "step 2", ...],
          "resources": ["resource 1", "resource 2", ...]
        }
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating skill recommendations:', error);
      return {
        missingSkills: [],
        learningPath: [],
        resources: []
      };
    }
  }

  async generateCoverLetter(resumeContent: string, jobDescription: string, jobTitle: string, company: string): Promise<string> {
    const prompt = `
    Generate a personalized cover letter for the following job application:
    
    Job Title: ${jobTitle}
    Company: ${company}
    
    Job Description:
    ${jobDescription}
    
    Resume Content:
    ${resumeContent}
    
    Instructions:
    - Create a professional, personalized cover letter
    - Highlight relevant skills and experience from the resume
    - Show enthusiasm for the role and company
    - Keep it concise (3-4 paragraphs)
    - Use professional but engaging tone
    - Include specific examples from the resume that match job requirements
    `;

    const response = await this.anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    if (response.content && response.content.length > 0 && response.content[0].type === 'text') {
      return response.content[0].text;
    }
    
    throw new Error('Failed to generate cover letter - invalid response format');
  }

  async generateCompanyInsights(company: string, jobTitle: string, jobDescription?: string): Promise<{
    overview: string;
    culture: string;
    opportunities: string;
    challenges: string;
    tips: string[];
  }> {
    const prompt = `
    Provide comprehensive insights about ${company} for a job applicant applying for the position of ${jobTitle}.
    
    ${jobDescription ? `Job Description: ${jobDescription}` : ''}
    
    Please provide insights in the following areas:
    1. Company Overview - Brief history, mission, and current market position
    2. Company Culture - Work environment, values, and employee experience
    3. Growth Opportunities - Career development and advancement potential
    4. Challenges - Current industry challenges and how they might affect the role
    5. Interview Tips - 3-5 specific tips for interviewing at this company
    
    Format your response as JSON with keys: overview, culture, opportunities, challenges, tips (array of strings)
    `;

    const response = await this.anthropic.messages.create({
      model: DEFAULT_MODEL_STR,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    try {
      if (response.content && response.content.length > 0 && response.content[0].type === 'text') {
        return JSON.parse(response.content[0].text);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        overview: "Company insights are being generated...",
        culture: "Loading company culture information...",
        opportunities: "Analyzing growth opportunities...",
        challenges: "Identifying potential challenges...",
        tips: ["Research the company thoroughly", "Prepare specific examples", "Ask thoughtful questions"]
      };
    }
  }
}

export const aiService = new AIService();
