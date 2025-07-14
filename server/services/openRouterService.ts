import { OpenAI } from "openai";

// OpenRouter.ai service for AI functions
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export class OpenRouterService {
  // Resume Analysis and Optimization
  async analyzeResume(resumeContent: string, jobDescription?: string): Promise<any> {
    try {
      const prompt = `Analyze this resume and provide a comprehensive assessment:
      
      Resume Content: ${resumeContent}
      ${jobDescription ? `Job Description: ${jobDescription}` : ''}
      
      Return a JSON object with:
      - overallScore: Number (0-100)
      - strengths: Array of strengths
      - weaknesses: Array of areas for improvement
      - recommendations: Array of specific recommendations
      - atsScore: Number (0-100) for ATS compatibility
      - keywordMatches: Array of matched keywords
      - missingKeywords: Array of important missing keywords
      - skillsAnalysis: Object with technical and soft skills
      - experienceLevel: String (entry/mid/senior/executive)
      - industryFit: String assessment
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume');
    }
  }

  // Resume Optimization
  async optimizeResume(resumeContent: string, jobDescription: string, targetRole: string): Promise<any> {
    try {
      const prompt = `Optimize this resume for the target role and job description:
      
      Resume Content: ${resumeContent}
      Job Description: ${jobDescription}
      Target Role: ${targetRole}
      
      Return a JSON object with:
      - optimizedResume: String with improved resume content
      - changes: Array of changes made
      - keywordImprovements: Array of keyword optimizations
      - structureImprovements: Array of structure suggestions
      - contentImprovements: Array of content enhancements
      - atsImprovements: Array of ATS optimization tips
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error optimizing resume:', error);
      throw new Error('Failed to optimize resume');
    }
  }

  // Generate Resume from Scratch
  async generateResume(userInfo: any, targetRole: string, template: string): Promise<any> {
    try {
      const prompt = `Generate a professional resume for the user:
      
      User Information: ${JSON.stringify(userInfo)}
      Target Role: ${targetRole}
      Template Style: ${template}
      
      Return a JSON object with:
      - resumeContent: String with complete resume
      - sections: Object with individual sections (summary, experience, skills, education, etc.)
      - template: String indicating template used
      - tips: Array of tips for improvement
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating resume:', error);
      throw new Error('Failed to generate resume');
    }
  }

  // Interview Preparation
  async generateInterviewQuestions(jobDescription: string, experienceLevel: string, category: string): Promise<any> {
    try {
      const prompt = `Generate interview questions for this role:
      
      Job Description: ${jobDescription}
      Experience Level: ${experienceLevel}
      Category: ${category}
      
      Return a JSON object with:
      - questions: Array of objects with { question, difficulty, category, tips }
      - totalQuestions: Number
      - estimatedTime: Number in minutes
      - preparationTips: Array of preparation suggestions
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error('Failed to generate interview questions');
    }
  }

  // Interview Performance Analysis
  async analyzeInterviewPerformance(question: string, userAnswer: string, correctAnswer?: string): Promise<any> {
    try {
      const prompt = `Analyze this interview response:
      
      Question: ${question}
      User Answer: ${userAnswer}
      ${correctAnswer ? `Expected Answer: ${correctAnswer}` : ''}
      
      Return a JSON object with:
      - score: Number (0-100)
      - feedback: String with detailed feedback
      - strengths: Array of strengths
      - improvements: Array of improvement suggestions
      - keyPoints: Array of key points covered
      - missedPoints: Array of missed opportunities
      - overall: String overall assessment
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error analyzing interview performance:', error);
      throw new Error('Failed to analyze interview performance');
    }
  }

  // Cover Letter Generation
  async generateCoverLetter(resumeContent: string, jobDescription: string, companyInfo: any): Promise<any> {
    try {
      const prompt = `Generate a personalized cover letter:
      
      Resume: ${resumeContent}
      Job Description: ${jobDescription}
      Company Info: ${JSON.stringify(companyInfo)}
      
      Return a JSON object with:
      - coverLetter: String with complete cover letter
      - keyPoints: Array of key points highlighted
      - companySpecific: Array of company-specific mentions
      - callToAction: String with strong closing
      - tips: Array of tips for customization
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter');
    }
  }

  // Company Insights
  async getCompanyInsights(companyName: string, jobTitle: string): Promise<any> {
    try {
      const prompt = `Provide comprehensive company insights:
      
      Company Name: ${companyName}
      Job Title: ${jobTitle}
      
      Return a JSON object with:
      - companyOverview: String with company description
      - culture: String describing company culture
      - values: Array of company values
      - recentNews: Array of recent news/developments
      - benefits: Array of typical benefits
      - interviewProcess: String describing typical interview process
      - salaryRange: Object with min/max salary estimates
      - growthOpportunities: Array of growth opportunities
      - challenges: Array of potential challenges
      - tips: Array of tips for applying/interviewing
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error getting company insights:', error);
      throw new Error('Failed to get company insights');
    }
  }

  // Job Matching and Recommendations
  async generateJobRecommendations(userProfile: any, preferences: any): Promise<any> {
    try {
      const prompt = `Generate personalized job recommendations:
      
      User Profile: ${JSON.stringify(userProfile)}
      Preferences: ${JSON.stringify(preferences)}
      
      Return a JSON object with:
      - recommendations: Array of job recommendations with reasoning
      - skillGaps: Array of skills to develop
      - careerPath: String with career progression suggestions
      - marketInsights: String with market analysis
      - actionItems: Array of specific actions to take
      - learningResources: Array of recommended learning resources
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating job recommendations:', error);
      throw new Error('Failed to generate job recommendations');
    }
  }

  // Career Tips and Advice
  async generateCareerTips(userProfile: any, currentRole: string, targetRole: string): Promise<any> {
    try {
      const prompt = `Generate personalized career tips:
      
      User Profile: ${JSON.stringify(userProfile)}
      Current Role: ${currentRole}
      Target Role: ${targetRole}
      
      Return a JSON object with:
      - tips: Array of actionable career tips
      - skillDevelopment: Array of skills to focus on
      - networking: Array of networking strategies
      - certifications: Array of relevant certifications
      - timeline: String with realistic timeline
      - resources: Array of helpful resources
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error generating career tips:', error);
      throw new Error('Failed to generate career tips');
    }
  }

  // Job Search Optimization
  async optimizeJobSearch(searchQuery: string, userProfile: any, previousResults: any[]): Promise<any> {
    try {
      const prompt = `Optimize job search strategy:
      
      Search Query: ${searchQuery}
      User Profile: ${JSON.stringify(userProfile)}
      Previous Results: ${JSON.stringify(previousResults)}
      
      Return a JSON object with:
      - optimizedQuery: String with better search terms
      - suggestedFilters: Object with recommended filters
      - platforms: Array of best platforms to search
      - timing: String with best times to search
      - strategy: String with search strategy
      - keywords: Array of important keywords to use
      
      Only return valid JSON.`;

      const response = await openrouter.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error optimizing job search:', error);
      throw new Error('Failed to optimize job search');
    }
  }
}

export const openRouterService = new OpenRouterService();