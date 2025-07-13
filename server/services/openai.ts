import OpenAI from "openai";
import { User, Job, Resume } from "@shared/schema";

/*
Using OpenRouter for better rate limits and model access.
OpenRouter provides access to multiple AI models including GPT-4o with better pricing.
*/

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://smartjobfit.com",
    "X-Title": "SmartJobFit AI",
  },
});

export class OpenAIService {
  async calculateJobMatchScore(user: User, job: Job): Promise<number> {
    try {
      const prompt = `
        Analyze the job match between the user and job posting. Return a match score from 0-100.
        
        User Profile:
        - Skills: ${user.skills?.join(", ") || "Not specified"}
        - Experience: ${user.experience?.join(", ") || "Not specified"}
        - Title: ${user.title || "Not specified"}
        - Summary: ${user.summary || "Not specified"}
        
        Job Posting:
        - Title: ${job.title}
        - Company: ${job.company}
        - Description: ${job.description}
        - Required Skills: ${job.skills?.join(", ") || "Not specified"}
        - Experience Level: ${job.experienceLevel || "Not specified"}
        
        Consider:
        1. Skills alignment
        2. Experience relevance
        3. Role compatibility
        4. Career progression fit
        
        Return only a JSON object with the match score: {"score": number}
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return Math.max(0, Math.min(100, result.score || 0));
    } catch (error) {
      console.error("Failed to calculate job match score:", error);
      return 0;
    }
  }

  async generateCoverLetter(user: User, job: Job): Promise<string> {
    try {
      const prompt = `
        Generate a professional cover letter for the following job application:
        
        User Profile:
        - Name: ${user.firstName} ${user.lastName}
        - Title: ${user.title || "Professional"}
        - Skills: ${user.skills?.join(", ") || ""}
        - Experience: ${user.experience?.join(", ") || ""}
        - Summary: ${user.summary || ""}
        
        Job Details:
        - Title: ${job.title}
        - Company: ${job.company}
        - Description: ${job.description}
        
        Write a compelling, personalized cover letter that:
        1. Addresses the hiring manager
        2. Highlights relevant skills and experience
        3. Shows enthusiasm for the role
        4. Includes a strong call to action
        5. Keeps it concise (3-4 paragraphs)
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
      return "";
    }
  }

  async optimizeResume(resume: Resume, jobDescription?: string): Promise<any> {
    try {
      const prompt = `
        Optimize the following resume for better ATS compatibility and job matching:
        
        Current Resume Content: ${JSON.stringify(resume.content)}
        ${jobDescription ? `Job Description: ${jobDescription}` : ""}
        
        Provide optimization suggestions including:
        1. ATS compatibility improvements
        2. Keyword optimization
        3. Format enhancements
        4. Content improvements
        5. Overall ATS score (0-100)
        
        Return a JSON object with:
        {
          "optimizedContent": { /* optimized resume structure */ },
          "suggestions": ["suggestion1", "suggestion2", ...],
          "atsScore": number,
          "keywords": ["keyword1", "keyword2", ...],
          "improvements": {
            "strengths": ["strength1", "strength2", ...],
            "weaknesses": ["weakness1", "weakness2", ...],
            "recommendations": ["rec1", "rec2", ...]
          }
        }
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Failed to optimize resume:", error);
      return { optimizedContent: resume.content, suggestions: [], atsScore: 0, keywords: [] };
    }
  }

  async analyzeResume(resume: Resume): Promise<any> {
    try {
      const prompt = `
        Analyze the following resume and provide detailed feedback:
        
        Resume Content: ${JSON.stringify(resume.content)}
        
        Provide analysis including:
        1. Overall assessment
        2. ATS compatibility score (0-100)
        3. Strengths and weaknesses
        4. Specific improvement recommendations
        5. Keyword analysis
        6. Format assessment
        
        Return a JSON object with detailed analysis.
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Failed to analyze resume:", error);
      return { analysis: "Analysis failed", score: 0 };
    }
  }

  async generateInterviewQuestions(jobTitle: string, industry: string, difficulty: string): Promise<any> {
    try {
      const prompt = `
        Generate interview questions for a ${jobTitle} position in the ${industry} industry.
        Difficulty level: ${difficulty}
        
        Create 10 questions covering:
        1. Technical skills (3-4 questions)
        2. Behavioral questions (3-4 questions)
        3. Industry-specific questions (2-3 questions)
        
        For each question, include:
        - The question text
        - Question type (technical, behavioral, industry)
        - Difficulty level (easy, medium, hard)
        - Expected answer points
        - Evaluation criteria
        
        Return a JSON object with the questions array.
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Failed to generate interview questions:", error);
      return { questions: [] };
    }
  }

  async evaluateInterviewAnswers(questions: any, answers: any): Promise<any> {
    try {
      const prompt = `
        Evaluate the following interview answers:
        
        Questions and Answers:
        ${JSON.stringify({ questions, answers })}
        
        Provide evaluation including:
        1. Overall performance score (0-100)
        2. Individual question scores
        3. Strengths and areas for improvement
        4. Specific feedback for each answer
        5. Recommendations for improvement
        
        Return a JSON object with detailed feedback.
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Failed to evaluate interview answers:", error);
      return { overallScore: 0, feedback: "Evaluation failed" };
    }
  }

  async generatePersonalizedRecommendations(user: User): Promise<any[]> {
    try {
      const prompt = `
        Generate personalized career recommendations for the following user:
        
        User Profile:
        - Skills: ${user.skills?.join(", ") || "Not specified"}
        - Experience: ${user.experience?.join(", ") || "Not specified"}
        - Title: ${user.title || "Not specified"}
        - Summary: ${user.summary || "Not specified"}
        
        Generate 5-7 recommendations covering:
        1. Resume optimization
        2. Skill development
        3. Interview preparation
        4. Career advancement
        5. Job search strategy
        
        For each recommendation, include:
        - type: "resume", "skill", "interview", "career", "strategy"
        - title: short descriptive title
        - description: detailed description
        - priority: "high", "medium", "low"
        - actionable steps
        
        Return a JSON array of recommendations.
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.recommendations || [];
    } catch (error) {
      console.error("Failed to generate personalized recommendations:", error);
      return [];
    }
  }

  async analyzeSalaryNegotiation(jobTitle: string, location: string, experience: string): Promise<any> {
    try {
      const prompt = `
        Provide salary negotiation analysis for:
        - Job Title: ${jobTitle}
        - Location: ${location}
        - Experience Level: ${experience}
        
        Include:
        1. Market salary range
        2. Negotiation strategies
        3. Key talking points
        4. Timing recommendations
        5. Alternative compensation options
        
        Return a JSON object with negotiation guidance.
      `;

      const response = await openai.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Failed to analyze salary negotiation:", error);
      return { analysis: "Analysis failed" };
    }
  }
}

export const openaiService = new OpenAIService();
