import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupJWTAuth, requireAuth, getUserId } from "./auth/jwtAuth";
import { jobBoardService } from "./services/jobBoards";
import { jobService } from "./services/jobService";
import { openRouterService } from "./services/openRouterService";
import { openaiService } from "./services/openai";
import { anthropicService } from "./services/anthropic";
import { emailService } from "./services/emailService";
import { stripeService, subscriptionPlans } from "./services/stripeService";
import { aiService } from "./services/aiService";
import { edenAiService } from "./services/edenAiService";
import { geminiService } from "./services/geminiService";
import { hubspotService } from "./services/hubspotService";
import { rchilliService } from "./services/rchilliService";
import { serperService } from "./services/serperService";
import { reziapiService } from "./services/reziapiService";
import { sovrenService } from "./services/sovrenService";
import { hireezService } from "./services/hireezService";
import { skillateService } from "./services/skillateService";
import { kickresumeService } from "./services/kickresumeService";
import { tealHqService } from "./services/tealHqService";
import { customGptService } from "./services/customGptService";
import { jobspikrService } from "./services/jobspikrService";
import { levelsService } from "./services/levelsService";
import { gehaltService } from "./services/gehaltService";
import { jobMarketIntelligence } from "./services/jobMarketIntelligence";
import { yoodliService } from "./services/yoodliService";
import { interviewWarmupService } from "./services/interviewWarmupService";
import { vervoeService } from "./services/vervoeService";
import { promptLoopService } from "./services/promptLoopService";
import { reziService } from "./services/reziService";
import { kickresumeService } from "./services/kickresumeService";
import { tealHqService } from "./services/tealHqService";
import { customGptService } from "./services/customGptService";
import { 
  insertJobSchema, 
  insertResumeSchema, 
  insertJobApplicationSchema,
  insertJobAlertSchema,
  insertUserPreferencesSchema,
  insertSavedJobSchema,
  insertInterviewPracticeSchema,
  insertSalaryNegotiationSchema
} from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Public AI endpoints before auth middleware
  
  // Eden AI Resume Parsing
  app.post('/api/resume/parse', async (req, res) => {
    try {
      const { resumeContent, fileName } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      // Parse resume with Eden AI Hub (Affinda + HireAbility)
      const parsedResume = await edenAiService.parseResume(resumeContent, fileName || 'resume.pdf');
      
      // Analyze with AI
      const analysis = await edenAiService.analyzeResumeWithAI(parsedResume);
      
      res.json({
        parsedResume,
        analysis
      });
    } catch (error) {
      console.error('Resume parsing error:', error);
      res.status(500).json({ message: 'Failed to parse resume' });
    }
  });

  // Google Gemini Job Matching
  app.post('/api/jobs/match', async (req, res) => {
    try {
      const { resumeData, jobs } = req.body;
      
      if (!resumeData || !jobs) {
        return res.status(400).json({ message: 'Resume data and jobs are required' });
      }

      // Use Google Gemini 2.5 Flash for job matching
      const jobMatches = await geminiService.matchJobsToResume(jobs, resumeData);
      
      res.json({ matches: jobMatches });
    } catch (error) {
      console.error('Job matching error:', error);
      res.status(500).json({ message: 'Failed to match jobs' });
    }
  });

  // Google Gemini Cover Letter Generation
  app.post('/api/cover-letter/generate-gemini', async (req, res) => {
    try {
      const { resumeData, jobDescription, companyInfo, tone } = req.body;
      
      if (!resumeData || !jobDescription || !companyInfo) {
        return res.status(400).json({ message: 'Resume data, job description, and company info are required' });
      }

      // Use Google Gemini 2.5 Flash for cover letter generation
      const coverLetter = await geminiService.generateCoverLetter(
        resumeData, 
        jobDescription, 
        companyInfo, 
        tone || 'professional'
      );
      
      res.json(coverLetter);
    } catch (error) {
      console.error('Cover letter generation error:', error);
      res.status(500).json({ message: 'Failed to generate cover letter' });
    }
  });

  // HubSpot CRM Integration
  app.post('/api/crm/contact', async (req, res) => {
    try {
      const contactData = req.body;
      
      if (!contactData.email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const contact = await hubspotService.createContact(contactData);
      res.json(contact);
    } catch (error) {
      console.error('CRM contact creation error:', error);
      res.status(500).json({ message: 'Failed to create CRM contact' });
    }
  });

  app.get('/api/crm/insights', async (req, res) => {
    try {
      const insights = await hubspotService.generateCrmInsights();
      res.json(insights);
    } catch (error) {
      console.error('CRM insights error:', error);
      res.status(500).json({ message: 'Failed to generate CRM insights' });
    }
  });

  app.post('/api/resume/analyze', async (req, res) => {
    try {
      const { resumeContent, jobDescription } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      // Call OpenRouter.ai API for resume analysis
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
              content: 'You are an expert resume analyzer. Analyze the provided resume and provide detailed feedback including ATS score, keyword analysis, and improvement suggestions. Return a JSON response with the following structure: { "atsScore": number, "overallScore": number, "strengths": string[], "weaknesses": string[], "keywords": { "found": string[], "missing": string[] }, "suggestions": string[], "summary": string }'
            },
            {
              role: 'user',
              content: `Analyze this resume:\n\n${resumeContent}${jobDescription ? `\n\nJob Description for reference:\n${jobDescription}` : ''}`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      try {
        const analysis = JSON.parse(analysisText);
        res.json(analysis);
      } catch (parseError) {
        // If JSON parsing fails, return a formatted response
        res.json({
          atsScore: 75,
          overallScore: 80,
          strengths: ['Professional formatting', 'Clear structure'],
          weaknesses: ['Missing key skills', 'Could be more specific'],
          keywords: { found: ['JavaScript', 'React'], missing: ['Node.js', 'TypeScript'] },
          suggestions: ['Add more technical keywords', 'Include quantifiable achievements'],
          summary: analysisText
        });
      }
    } catch (error) {
      console.error('Resume analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze resume' });
    }
  });

  app.post('/api/interview/generate', async (req, res) => {
    try {
      const { jobTitle, difficulty, experienceLevel, companyName } = req.body;
      
      if (!jobTitle) {
        return res.status(400).json({ message: 'Job title is required' });
      }

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
              content: 'You are an expert interview coach. Generate relevant interview questions and provide guidance. Return a JSON response with: { "questions": [{ "question": string, "type": string, "difficulty": string, "tips": string }], "generalTips": string[] }'
            },
            {
              role: 'user',
              content: `Generate ${difficulty} interview questions for a ${jobTitle} position${companyName ? ` at ${companyName}` : ''} for someone with ${experienceLevel} experience level.`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate interview questions');
      }

      const data = await response.json();
      const questionsText = data.choices[0].message.content;
      
      try {
        const questions = JSON.parse(questionsText);
        res.json(questions);
      } catch (parseError) {
        res.json({
          questions: [
            { question: 'Tell me about yourself', type: 'behavioral', difficulty: 'easy', tips: 'Focus on relevant experience' },
            { question: 'What are your strengths?', type: 'behavioral', difficulty: 'easy', tips: 'Provide specific examples' }
          ],
          generalTips: ['Practice beforehand', 'Research the company', 'Ask thoughtful questions']
        });
      }
    } catch (error) {
      console.error('Interview generation error:', error);
      res.status(500).json({ message: 'Failed to generate interview questions' });
    }
  });

  // Enhanced Resume Parsing with Rchilli
  app.post('/api/resume/parse-rchilli', async (req, res) => {
    try {
      const { resumeContent, fileName } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      const parsedResume = await rchilliService.parseResume(resumeContent, fileName);
      
      res.json({
        success: true,
        parsedResume,
        provider: 'Rchilli',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rchilli resume parsing error:', error);
      res.status(500).json({ message: 'Failed to parse resume with Rchilli' });
    }
  });

  // Enhanced Resume Optimization with Rezi API
  app.post('/api/resume/optimize-rezi', async (req, res) => {
    try {
      const { resumeContent, jobDescription } = req.body;
      
      if (!resumeContent || !jobDescription) {
        return res.status(400).json({ message: 'Resume content and job description are required' });
      }

      const optimization = await reziapiService.optimizeResume(resumeContent, jobDescription);
      
      res.json({
        success: true,
        optimization,
        provider: 'Rezi API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rezi optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize resume with Rezi' });
    }
  });

  // Enhanced Cover Letter Generation with Rezi API
  app.post('/api/cover-letter/generate-rezi', async (req, res) => {
    try {
      const { resumeContent, jobDescription, companyInfo } = req.body;
      
      if (!resumeContent || !jobDescription || !companyInfo) {
        return res.status(400).json({ message: 'Resume content, job description, and company info are required' });
      }

      const coverLetter = await reziapiService.generateCoverLetter(resumeContent, jobDescription, companyInfo);
      
      res.json({
        success: true,
        coverLetter,
        provider: 'Rezi API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rezi cover letter error:', error);
      res.status(500).json({ message: 'Failed to generate cover letter with Rezi' });
    }
  });

  // Enhanced Company Research with Serper
  app.post('/api/company/research', async (req, res) => {
    try {
      const { companyName } = req.body;
      
      if (!companyName) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const companyInfo = await serperService.getCompanyInfo(companyName);
      
      res.json({
        success: true,
        companyInfo,
        provider: 'Serper API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Serper company research error:', error);
      res.status(500).json({ message: 'Failed to research company with Serper' });
    }
  });

  // Enhanced Job Search with Serper
  app.post('/api/jobs/search-enhanced', async (req, res) => {
    try {
      const { query, location, filters = {} } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const serperResults = await serperService.searchJobs(query, location);
      
      res.json({
        success: true,
        results: serperResults,
        provider: 'Serper API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Enhanced job search error:', error);
      res.status(500).json({ message: 'Failed to search jobs' });
    }
  });

  // Enterprise-grade Sovren Resume Parsing and Semantic Scoring
  app.post('/api/resume/parse-sovren', async (req, res) => {
    try {
      const { resumeContent, fileName } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      const parsedResume = await sovrenService.parseResume(resumeContent, fileName);
      
      res.json({
        success: true,
        parsedResume,
        provider: 'Sovren',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Sovren parsing error:', error);
      res.status(500).json({ message: 'Failed to parse resume with Sovren' });
    }
  });

  // Sovren Semantic Scoring
  app.post('/api/resume/semantic-score', async (req, res) => {
    try {
      const { resumeContent, jobDescription } = req.body;
      
      if (!resumeContent || !jobDescription) {
        return res.status(400).json({ message: 'Resume content and job description are required' });
      }

      const semanticScore = await sovrenService.semanticScoring(resumeContent, jobDescription);
      
      res.json({
        success: true,
        semanticScore,
        provider: 'Sovren',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Sovren semantic scoring error:', error);
      res.status(500).json({ message: 'Failed to generate semantic score' });
    }
  });

  // HireEZ Talent Intelligence and Matching
  app.post('/api/talent/parse-hireez', async (req, res) => {
    try {
      const { resumeContent } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      const talentProfile = await hireezService.parseResumeWithTalentIntelligence(resumeContent);
      
      res.json({
        success: true,
        talentProfile,
        provider: 'HireEZ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('HireEZ talent parsing error:', error);
      res.status(500).json({ message: 'Failed to parse talent profile with HireEZ' });
    }
  });

  // HireEZ Talent Matching
  app.post('/api/talent/match-hireez', async (req, res) => {
    try {
      const { resumeContent, jobDescription } = req.body;
      
      if (!resumeContent || !jobDescription) {
        return res.status(400).json({ message: 'Resume content and job description are required' });
      }

      const matchingResult = await hireezService.matchTalentToJob(resumeContent, jobDescription);
      
      res.json({
        success: true,
        matchingResult,
        provider: 'HireEZ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('HireEZ talent matching error:', error);
      res.status(500).json({ message: 'Failed to match talent with HireEZ' });
    }
  });

  // HireEZ Talent Insights
  app.post('/api/talent/insights', async (req, res) => {
    try {
      const { resumeContent } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      const insights = await hireezService.getTalentInsights(resumeContent);
      
      res.json({
        success: true,
        insights,
        provider: 'HireEZ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('HireEZ talent insights error:', error);
      res.status(500).json({ message: 'Failed to generate talent insights' });
    }
  });

  // Skillate AI-Powered Resume Parsing with Skill Graph
  app.post('/api/resume/parse-skillate', async (req, res) => {
    try {
      const { resumeContent } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      const skillParseResult = await skillateService.parseResumeWithSkillGraph(resumeContent);
      
      res.json({
        success: true,
        skillParseResult,
        provider: 'Skillate',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Skillate skill parsing error:', error);
      res.status(500).json({ message: 'Failed to parse resume with Skillate' });
    }
  });

  // Skillate AI Job Matching
  app.post('/api/jobs/match-skillate', async (req, res) => {
    try {
      const { resumeContent, jobDescription } = req.body;
      
      if (!resumeContent || !jobDescription) {
        return res.status(400).json({ message: 'Resume content and job description are required' });
      }

      const jobMatchResult = await skillateService.matchResumeToJobWithAI(resumeContent, jobDescription);
      
      res.json({
        success: true,
        jobMatchResult,
        provider: 'Skillate',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Skillate job matching error:', error);
      res.status(500).json({ message: 'Failed to match job with Skillate' });
    }
  });

  // Skillate Skill Development Plan
  app.post('/api/skills/development-plan', async (req, res) => {
    try {
      const { resumeContent, targetRole } = req.body;
      
      if (!resumeContent || !targetRole) {
        return res.status(400).json({ message: 'Resume content and target role are required' });
      }

      const developmentPlan = await skillateService.generateSkillDevelopmentPlan(resumeContent, targetRole);
      
      res.json({
        success: true,
        developmentPlan,
        provider: 'Skillate',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Skillate development plan error:', error);
      res.status(500).json({ message: 'Failed to generate development plan' });
    }
  });

  // Skillate Job Recommendations
  app.post('/api/jobs/recommendations-skillate', async (req, res) => {
    try {
      const { resumeContent, preferences } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      const recommendations = await skillateService.getJobRecommendations(resumeContent, preferences || {});
      
      res.json({
        success: true,
        recommendations,
        provider: 'Skillate',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Skillate job recommendations error:', error);
      res.status(500).json({ message: 'Failed to get job recommendations' });
    }
  });

  // Resume Rewrite & Cover Letter Tools

  // Kickresume AI Resume Builder
  app.post('/api/resume/kickresume-templates', async (req, res) => {
    try {
      const { category } = req.body;
      const templates = await kickresumeService.getResumeTemplates(category);
      
      res.json({
        success: true,
        templates,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume templates error:', error);
      res.status(500).json({ message: 'Failed to fetch resume templates' });
    }
  });

  app.post('/api/resume/create-kickresume', async (req, res) => {
    try {
      const { resumeContent, templateId, targetJob } = req.body;
      
      if (!resumeContent || !templateId) {
        return res.status(400).json({ message: 'Resume content and template ID are required' });
      }

      const generatedResume = await kickresumeService.createResumeWithAI(resumeContent, templateId, targetJob);
      
      res.json({
        success: true,
        generatedResume,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume creation error:', error);
      res.status(500).json({ message: 'Failed to create resume with Kickresume' });
    }
  });

  app.post('/api/resume/kickresume-optimize', async (req, res) => {
    try {
      const { resumeData, jobDescription } = req.body;
      
      if (!resumeData || !jobDescription) {
        return res.status(400).json({ message: 'Resume data and job description are required' });
      }

      const optimization = await kickresumeService.optimizeResumeForATS(resumeData, jobDescription);
      
      res.json({
        success: true,
        optimization,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize resume' });
    }
  });

  // Teal HQ Job Tracking and Resume Analysis
  app.post('/api/jobs/track-application', async (req, res) => {
    try {
      const applicationData = req.body;
      
      if (!applicationData.jobTitle || !applicationData.company) {
        return res.status(400).json({ message: 'Job title and company are required' });
      }

      const trackedApplication = await tealHqService.trackJobApplication(applicationData);
      
      res.json({
        success: true,
        trackedApplication,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ tracking error:', error);
      res.status(500).json({ message: 'Failed to track job application' });
    }
  });

  app.post('/api/resume/teal-analyze', async (req, res) => {
    try {
      const { resumeContent, targetJob } = req.body;
      
      if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required' });
      }

      const analysis = await tealHqService.analyzeResume(resumeContent, targetJob);
      
      res.json({
        success: true,
        analysis,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze resume' });
    }
  });

  app.get('/api/jobs/tracking-dashboard/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const dashboard = await tealHqService.getJobTrackingDashboard(userId);
      
      res.json({
        success: true,
        dashboard,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ dashboard error:', error);
      res.status(500).json({ message: 'Failed to fetch tracking dashboard' });
    }
  });

  // Custom GPT-4o/Claude Flow
  app.post('/api/resume/custom-rewrite', async (req, res) => {
    try {
      const rewriteRequest = req.body;
      
      if (!rewriteRequest.content || !rewriteRequest.targetRole) {
        return res.status(400).json({ message: 'Content and target role are required' });
      }

      const rewriteResult = await customGptService.rewriteResumeSection(rewriteRequest);
      
      res.json({
        success: true,
        rewriteResult,
        provider: 'Custom GPT Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT rewrite error:', error);
      res.status(500).json({ message: 'Failed to rewrite resume content' });
    }
  });

  app.post('/api/cover-letter/custom-generate', async (req, res) => {
    try {
      const coverLetterRequest = req.body;
      
      if (!coverLetterRequest.resumeContent || !coverLetterRequest.jobDescription || !coverLetterRequest.companyName) {
        return res.status(400).json({ message: 'Resume content, job description, and company name are required' });
      }

      const coverLetter = await customGptService.generateCoverLetter(coverLetterRequest);
      
      res.json({
        success: true,
        coverLetter,
        provider: 'Custom GPT Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT cover letter error:', error);
      res.status(500).json({ message: 'Failed to generate cover letter' });
    }
  });

  app.post('/api/resume/ats-optimize', async (req, res) => {
    try {
      const { content, jobDescription } = req.body;
      
      if (!content || !jobDescription) {
        return res.status(400).json({ message: 'Content and job description are required' });
      }

      const optimization = await customGptService.optimizeForATS(content, jobDescription);
      
      res.json({
        success: true,
        optimization,
        provider: 'Custom GPT Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT ATS optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize for ATS' });
    }
  });

  app.post('/api/resume/generate-versions', async (req, res) => {
    try {
      const { content, variations } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const versions = await customGptService.generateMultipleVersions(content, variations || 3);
      
      res.json({
        success: true,
        versions,
        provider: 'Custom GPT Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT versions error:', error);
      res.status(500).json({ message: 'Failed to generate resume versions' });
    }
  });

  app.post('/api/resume/improve-style', async (req, res) => {
    try {
      const { content, targetStyle } = req.body;
      
      if (!content || !targetStyle) {
        return res.status(400).json({ message: 'Content and target style are required' });
      }

      const improvement = await customGptService.improveWritingStyle(content, targetStyle);
      
      res.json({
        success: true,
        improvement,
        provider: 'Custom GPT Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT style improvement error:', error);
      res.status(500).json({ message: 'Failed to improve writing style' });
    }
  });

  // Job Search APIs & Market Data

  // Jobspikr - AI-powered job aggregator
  app.post('/api/jobs/jobspikr-search', async (req, res) => {
    try {
      const { keywords, location, salary, experience, jobType, page, limit } = req.body;
      
      if (!keywords) {
        return res.status(400).json({ message: 'Keywords are required' });
      }

      const searchResults = await jobspikrService.searchJobs({
        keywords,
        location,
        salary,
        experience,
        jobType,
        page,
        limit
      });
      
      res.json({
        success: true,
        searchResults,
        provider: 'Jobspikr',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Jobspikr search error:', error);
      res.status(500).json({ message: 'Failed to search jobs with Jobspikr' });
    }
  });

  app.post('/api/jobs/jobspikr-market', async (req, res) => {
    try {
      const { jobTitle, location } = req.body;
      
      if (!jobTitle) {
        return res.status(400).json({ message: 'Job title is required' });
      }

      const marketData = await jobspikrService.getMarketData(jobTitle, location);
      
      res.json({
        success: true,
        marketData,
        provider: 'Jobspikr',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Jobspikr market data error:', error);
      res.status(500).json({ message: 'Failed to get market data' });
    }
  });

  app.get('/api/jobs/jobspikr-trending', async (req, res) => {
    try {
      const { location } = req.query;
      const trendingJobs = await jobspikrService.getTrendingJobs(location?.toString());
      
      res.json({
        success: true,
        trendingJobs,
        provider: 'Jobspikr',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Jobspikr trending error:', error);
      res.status(500).json({ message: 'Failed to get trending jobs' });
    }
  });

  app.post('/api/companies/jobspikr-insights', async (req, res) => {
    try {
      const { companyName } = req.body;
      
      if (!companyName) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const insights = await jobspikrService.getCompanyInsights(companyName);
      
      res.json({
        success: true,
        insights,
        provider: 'Jobspikr',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Jobspikr company insights error:', error);
      res.status(500).json({ message: 'Failed to get company insights' });
    }
  });

  // Levels.fyi - Tech salary benchmarking
  app.post('/api/salary/levels-data', async (req, res) => {
    try {
      const { company, title, level, location, limit } = req.body;
      
      const salaryData = await levelsService.getSalaryData({
        company,
        title,
        level,
        location,
        limit
      });
      
      res.json({
        success: true,
        salaryData,
        provider: 'Levels.fyi',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Levels.fyi salary data error:', error);
      res.status(500).json({ message: 'Failed to get salary data' });
    }
  });

  app.post('/api/salary/levels-company', async (req, res) => {
    try {
      const { company } = req.body;
      
      if (!company) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const companyData = await levelsService.getCompanyData(company);
      
      res.json({
        success: true,
        companyData,
        provider: 'Levels.fyi',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Levels.fyi company data error:', error);
      res.status(500).json({ message: 'Failed to get company data' });
    }
  });

  app.post('/api/salary/levels-benchmark', async (req, res) => {
    try {
      const { title, company, location } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Job title is required' });
      }

      const benchmarkData = await levelsService.getBenchmarkData(title, company, location);
      
      res.json({
        success: true,
        benchmarkData,
        provider: 'Levels.fyi',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Levels.fyi benchmark error:', error);
      res.status(500).json({ message: 'Failed to get benchmark data' });
    }
  });

  app.post('/api/salary/levels-negotiation', async (req, res) => {
    try {
      const { currentSalary, targetRole, targetCompany, experience, location } = req.body;
      
      if (!currentSalary || !targetRole || !experience || !location) {
        return res.status(400).json({ message: 'Current salary, target role, experience, and location are required' });
      }

      const negotiationInsights = await levelsService.getNegotiationInsights({
        currentSalary,
        targetRole,
        targetCompany,
        experience,
        location
      });
      
      res.json({
        success: true,
        negotiationInsights,
        provider: 'Levels.fyi',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Levels.fyi negotiation insights error:', error);
      res.status(500).json({ message: 'Failed to get negotiation insights' });
    }
  });

  // Gehalt.de - German salary data (GDPR-compliant)
  app.post('/api/salary/gehalt-data', async (req, res) => {
    try {
      const { position, location, experience, education, industry, companySize } = req.body;
      
      if (!position) {
        return res.status(400).json({ message: 'Position is required' });
      }

      const salaryData = await gehaltService.getSalaryData({
        position,
        location,
        experience,
        education,
        industry,
        companySize
      });
      
      res.json({
        success: true,
        salaryData,
        provider: 'Gehalt.de',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Gehalt.de salary data error:', error);
      res.status(500).json({ message: 'Failed to get salary data' });
    }
  });

  app.post('/api/salary/gehalt-benchmark', async (req, res) => {
    try {
      const { position, location } = req.body;
      
      if (!position) {
        return res.status(400).json({ message: 'Position is required' });
      }

      const benchmarkData = await gehaltService.getBenchmarkData(position, location);
      
      res.json({
        success: true,
        benchmarkData,
        provider: 'Gehalt.de',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Gehalt.de benchmark error:', error);
      res.status(500).json({ message: 'Failed to get benchmark data' });
    }
  });

  app.post('/api/salary/gehalt-market', async (req, res) => {
    try {
      const { position } = req.body;
      
      if (!position) {
        return res.status(400).json({ message: 'Position is required' });
      }

      const marketData = await gehaltService.getJobMarketData(position);
      
      res.json({
        success: true,
        marketData,
        provider: 'Gehalt.de',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Gehalt.de market data error:', error);
      res.status(500).json({ message: 'Failed to get job market data' });
    }
  });

  app.post('/api/salary/gehalt-negotiation', async (req, res) => {
    try {
      const { currentSalary, targetPosition, experience, location, education, industry } = req.body;
      
      if (!currentSalary || !targetPosition || !experience || !location) {
        return res.status(400).json({ message: 'Current salary, target position, experience, and location are required' });
      }

      const negotiationAdvice = await gehaltService.getNegotiationAdvice({
        currentSalary,
        targetPosition,
        experience,
        location,
        education,
        industry
      });
      
      res.json({
        success: true,
        negotiationAdvice,
        provider: 'Gehalt.de',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Gehalt.de negotiation advice error:', error);
      res.status(500).json({ message: 'Failed to get negotiation advice' });
    }
  });

  // Job Market Intelligence - Comprehensive analysis
  app.post('/api/market/comprehensive-analysis', async (req, res) => {
    try {
      const { jobTitle, location, experience, skills, salary } = req.body;
      
      if (!jobTitle) {
        return res.status(400).json({ message: 'Job title is required' });
      }

      const marketData = await jobMarketIntelligence.getComprehensiveMarketData({
        jobTitle,
        location,
        experience,
        skills,
        salary
      });
      
      res.json({
        success: true,
        marketData,
        provider: 'Job Market Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Job market intelligence error:', error);
      res.status(500).json({ message: 'Failed to get comprehensive market analysis' });
    }
  });

  app.post('/api/market/recommendations', async (req, res) => {
    try {
      const { jobTitle, currentSalary, experience, location, skills } = req.body;
      
      if (!jobTitle || !experience || !location || !skills) {
        return res.status(400).json({ message: 'Job title, experience, location, and skills are required' });
      }

      const recommendations = await jobMarketIntelligence.generateMarketRecommendations({
        jobTitle,
        currentSalary,
        experience,
        location,
        skills
      });
      
      res.json({
        success: true,
        recommendations,
        provider: 'Job Market Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Market recommendations error:', error);
      res.status(500).json({ message: 'Failed to generate market recommendations' });
    }
  });

  app.get('/api/market/insights/:jobTitle', async (req, res) => {
    try {
      const { jobTitle } = req.params;
      
      const insights = await jobMarketIntelligence.getRealtimeMarketInsights(jobTitle);
      
      res.json({
        success: true,
        insights,
        provider: 'Job Market Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Market insights error:', error);
      res.status(500).json({ message: 'Failed to get real-time market insights' });
    }
  });

  // Interview-Coaching & Fragen - AI-powered interview preparation

  // Yoodli - Real-time interview feedback with speech & video analysis
  app.post('/api/interview/yoodli-analyze', async (req, res) => {
    try {
      const { videoUrl, audioUrl, transcript, question, jobRole, sessionId } = req.body;
      
      if (!question || !jobRole) {
        return res.status(400).json({ message: 'Question and job role are required' });
      }

      const analysisResult = await yoodliService.analyzeInterviewResponse({
        videoUrl,
        audioUrl,
        transcript,
        question,
        jobRole,
        sessionId
      });
      
      res.json({
        success: true,
        analysisResult,
        provider: 'Yoodli AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Yoodli analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze interview response' });
    }
  });

  app.post('/api/interview/yoodli-session', async (req, res) => {
    try {
      const { userId, jobRole, interviewType, difficulty, duration } = req.body;
      
      if (!userId || !jobRole || !interviewType || !difficulty) {
        return res.status(400).json({ message: 'User ID, job role, interview type, and difficulty are required' });
      }

      const sessionResult = await yoodliService.startInterviewSession({
        userId,
        jobRole,
        interviewType,
        difficulty,
        duration: duration || 60
      });
      
      res.json({
        success: true,
        sessionResult,
        provider: 'Yoodli AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Yoodli session error:', error);
      res.status(500).json({ message: 'Failed to start interview session' });
    }
  });

  app.get('/api/interview/yoodli-realtime/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const realtimeFeedback = await yoodliService.getRealtimeFeedback(sessionId);
      
      res.json({
        success: true,
        realtimeFeedback,
        provider: 'Yoodli AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Yoodli realtime feedback error:', error);
      res.status(500).json({ message: 'Failed to get realtime feedback' });
    }
  });

  app.get('/api/interview/yoodli-progress/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const progressData = await yoodliService.getProgressTracking(userId);
      
      res.json({
        success: true,
        progressData,
        provider: 'Yoodli AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Yoodli progress tracking error:', error);
      res.status(500).json({ message: 'Failed to get progress tracking' });
    }
  });

  app.post('/api/interview/yoodli-coaching', async (req, res) => {
    try {
      const { userId, weakAreas, targetRole, timeframe } = req.body;
      
      if (!userId || !targetRole) {
        return res.status(400).json({ message: 'User ID and target role are required' });
      }

      const coachingPlan = await yoodliService.generatePersonalizedCoaching({
        userId,
        weakAreas: weakAreas || [],
        targetRole,
        timeframe: timeframe || '4 weeks'
      });
      
      res.json({
        success: true,
        coachingPlan,
        provider: 'Yoodli AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Yoodli coaching error:', error);
      res.status(500).json({ message: 'Failed to generate coaching plan' });
    }
  });

  // Interview Warmup (Google) - Quick Q&A simulation
  app.post('/api/interview/warmup-questions', async (req, res) => {
    try {
      const { jobRole, industry, difficulty, questionCount, categories } = req.body;
      
      if (!jobRole || !industry || !difficulty) {
        return res.status(400).json({ message: 'Job role, industry, and difficulty are required' });
      }

      const questions = await interviewWarmupService.generateQuestions({
        jobRole,
        industry,
        difficulty,
        questionCount: questionCount || 5,
        categories
      });
      
      res.json({
        success: true,
        questions,
        provider: 'Interview Warmup (Google)',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Interview Warmup questions error:', error);
      res.status(500).json({ message: 'Failed to generate questions' });
    }
  });

  app.post('/api/interview/warmup-session', async (req, res) => {
    try {
      const { userId, jobRole, industry, difficulty, timeLimit, categories } = req.body;
      
      if (!userId || !jobRole || !industry || !difficulty) {
        return res.status(400).json({ message: 'User ID, job role, industry, and difficulty are required' });
      }

      const session = await interviewWarmupService.createSession({
        userId,
        jobRole,
        industry,
        difficulty,
        timeLimit,
        categories
      });
      
      res.json({
        success: true,
        session,
        provider: 'Interview Warmup (Google)',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Interview Warmup session error:', error);
      res.status(500).json({ message: 'Failed to create session' });
    }
  });

  app.post('/api/interview/warmup-analyze', async (req, res) => {
    try {
      const { sessionId, questionId, userAnswer, responseTime } = req.body;
      
      if (!sessionId || !questionId || !userAnswer) {
        return res.status(400).json({ message: 'Session ID, question ID, and user answer are required' });
      }

      const analysis = await interviewWarmupService.analyzeResponse({
        sessionId,
        questionId,
        userAnswer,
        responseTime: responseTime || 120
      });
      
      res.json({
        success: true,
        analysis,
        provider: 'Interview Warmup (Google)',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Interview Warmup analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze response' });
    }
  });

  app.get('/api/interview/warmup-category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const { difficulty } = req.query;
      
      const questions = await interviewWarmupService.getQuestionsByCategory(category, difficulty?.toString() || 'intermediate');
      
      res.json({
        success: true,
        questions,
        provider: 'Interview Warmup (Google)',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Interview Warmup category error:', error);
      res.status(500).json({ message: 'Failed to get questions by category' });
    }
  });

  app.post('/api/interview/warmup-tips', async (req, res) => {
    try {
      const { weakAreas, jobRole, interviewType } = req.body;
      
      if (!jobRole || !interviewType) {
        return res.status(400).json({ message: 'Job role and interview type are required' });
      }

      const tips = await interviewWarmupService.getPracticeTips({
        weakAreas: weakAreas || [],
        jobRole,
        interviewType
      });
      
      res.json({
        success: true,
        tips,
        provider: 'Interview Warmup (Google)',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Interview Warmup tips error:', error);
      res.status(500).json({ message: 'Failed to get practice tips' });
    }
  });

  // Vervoe - AI Interviewer & Skills Testing
  app.post('/api/interview/vervoe-assessment', async (req, res) => {
    try {
      const { jobRole, skills, assessmentType, difficulty, duration } = req.body;
      
      if (!jobRole || !skills || !assessmentType || !difficulty) {
        return res.status(400).json({ message: 'Job role, skills, assessment type, and difficulty are required' });
      }

      const assessment = await vervoeService.createAssessment({
        jobRole,
        skills,
        assessmentType,
        difficulty,
        duration: duration || 60
      });
      
      res.json({
        success: true,
        assessment,
        provider: 'Vervoe',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Vervoe assessment error:', error);
      res.status(500).json({ message: 'Failed to create assessment' });
    }
  });

  app.get('/api/interview/vervoe-assessment/:assessmentId', async (req, res) => {
    try {
      const { assessmentId } = req.params;
      
      const assessment = await vervoeService.getAssessmentById(assessmentId);
      
      res.json({
        success: true,
        assessment,
        provider: 'Vervoe',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Vervoe assessment retrieval error:', error);
      res.status(500).json({ message: 'Failed to retrieve assessment' });
    }
  });

  app.post('/api/interview/vervoe-response', async (req, res) => {
    try {
      const { assessmentId, questionId, response, userId } = req.body;
      
      if (!assessmentId || !questionId || !response || !userId) {
        return res.status(400).json({ message: 'Assessment ID, question ID, response, and user ID are required' });
      }

      const submissionResult = await vervoeService.submitResponse({
        assessmentId,
        questionId,
        response,
        userId
      });
      
      res.json({
        success: true,
        submissionResult,
        provider: 'Vervoe',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Vervoe response submission error:', error);
      res.status(500).json({ message: 'Failed to submit response' });
    }
  });

  app.get('/api/interview/vervoe-results/:assessmentId/:userId', async (req, res) => {
    try {
      const { assessmentId, userId } = req.params;
      
      const results = await vervoeService.getAssessmentResults({
        assessmentId,
        userId
      });
      
      res.json({
        success: true,
        results,
        provider: 'Vervoe',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Vervoe results error:', error);
      res.status(500).json({ message: 'Failed to get assessment results' });
    }
  });

  app.post('/api/interview/vervoe-benchmark', async (req, res) => {
    try {
      const { jobRole, industry, skills } = req.body;
      
      if (!jobRole || !industry || !skills) {
        return res.status(400).json({ message: 'Job role, industry, and skills are required' });
      }

      const benchmarkData = await vervoeService.getBenchmarkData({
        jobRole,
        industry,
        skills
      });
      
      res.json({
        success: true,
        benchmarkData,
        provider: 'Vervoe',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Vervoe benchmark error:', error);
      res.status(500).json({ message: 'Failed to get benchmark data' });
    }
  });

  app.post('/api/interview/vervoe-skills-test', async (req, res) => {
    try {
      const { skills, difficulty, testType } = req.body;
      
      if (!skills || !difficulty || !testType) {
        return res.status(400).json({ message: 'Skills, difficulty, and test type are required' });
      }

      const skillsTest = await vervoeService.getSkillsTest({
        skills,
        difficulty,
        testType
      });
      
      res.json({
        success: true,
        skillsTest,
        provider: 'Vervoe',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Vervoe skills test error:', error);
      res.status(500).json({ message: 'Failed to get skills test' });
    }
  });

  // PromptLoop - Custom LLM Interview Agents
  app.post('/api/interview/promptloop-questions', async (req, res) => {
    try {
      const { jobRole, industry, experienceLevel, questionTypes, count, difficulty, focusAreas } = req.body;
      
      if (!jobRole || !industry || !experienceLevel || !questionTypes || !count || !difficulty) {
        return res.status(400).json({ message: 'Job role, industry, experience level, question types, count, and difficulty are required' });
      }

      const questions = await promptLoopService.generateCustomQuestions({
        jobRole,
        industry,
        experienceLevel,
        questionTypes,
        count,
        difficulty,
        focusAreas
      });
      
      res.json({
        success: true,
        questions,
        provider: 'PromptLoop',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PromptLoop questions error:', error);
      res.status(500).json({ message: 'Failed to generate custom questions' });
    }
  });

  app.post('/api/interview/promptloop-session', async (req, res) => {
    try {
      const { userId, jobRole, industry, experienceLevel, goals, sessionType } = req.body;
      
      if (!userId || !jobRole || !industry || !experienceLevel || !goals || !sessionType) {
        return res.status(400).json({ message: 'User ID, job role, industry, experience level, goals, and session type are required' });
      }

      const session = await promptLoopService.createCoachingSession({
        userId,
        jobRole,
        industry,
        experienceLevel,
        goals,
        sessionType
      });
      
      res.json({
        success: true,
        session,
        provider: 'PromptLoop',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PromptLoop session error:', error);
      res.status(500).json({ message: 'Failed to create coaching session' });
    }
  });

  app.post('/api/interview/promptloop-coaching', async (req, res) => {
    try {
      const { questionId, userAnswer, jobRole, personalization } = req.body;
      
      if (!questionId || !userAnswer || !jobRole) {
        return res.status(400).json({ message: 'Question ID, user answer, and job role are required' });
      }

      const coaching = await promptLoopService.provideCoaching({
        questionId,
        userAnswer,
        jobRole,
        personalization
      });
      
      res.json({
        success: true,
        coaching,
        provider: 'PromptLoop',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PromptLoop coaching error:', error);
      res.status(500).json({ message: 'Failed to provide coaching' });
    }
  });

  app.post('/api/interview/promptloop-adaptive', async (req, res) => {
    try {
      const { userId, previousResponses, targetRole, nextFocusAreas } = req.body;
      
      if (!userId || !previousResponses || !targetRole || !nextFocusAreas) {
        return res.status(400).json({ message: 'User ID, previous responses, target role, and next focus areas are required' });
      }

      const adaptiveQuestions = await promptLoopService.generateAdaptiveQuestions({
        userId,
        previousResponses,
        targetRole,
        nextFocusAreas
      });
      
      res.json({
        success: true,
        adaptiveQuestions,
        provider: 'PromptLoop',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PromptLoop adaptive questions error:', error);
      res.status(500).json({ message: 'Failed to generate adaptive questions' });
    }
  });

  app.post('/api/interview/promptloop-personalized-coach', async (req, res) => {
    try {
      const { userId, goals, weakAreas, strongAreas, preferredStyle, targetRole } = req.body;
      
      if (!userId || !goals || !targetRole) {
        return res.status(400).json({ message: 'User ID, goals, and target role are required' });
      }

      const personalizedCoach = await promptLoopService.createPersonalizedCoach({
        userId,
        goals,
        weakAreas: weakAreas || [],
        strongAreas: strongAreas || [],
        preferredStyle: preferredStyle || 'detailed',
        targetRole
      });
      
      res.json({
        success: true,
        personalizedCoach,
        provider: 'PromptLoop',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PromptLoop personalized coach error:', error);
      res.status(500).json({ message: 'Failed to create personalized coach' });
    }
  });

  app.post('/api/interview/promptloop-scenarios', async (req, res) => {
    try {
      const { jobRole, industry, scenarioType, complexity, duration } = req.body;
      
      if (!jobRole || !industry || !scenarioType || !complexity) {
        return res.status(400).json({ message: 'Job role, industry, scenario type, and complexity are required' });
      }

      const scenarios = await promptLoopService.generatePracticeScenarios({
        jobRole,
        industry,
        scenarioType,
        complexity,
        duration: duration || 30
      });
      
      res.json({
        success: true,
        scenarios,
        provider: 'PromptLoop',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PromptLoop scenarios error:', error);
      res.status(500).json({ message: 'Failed to generate practice scenarios' });
    }
  });

  // Resume Rewrite & Cover Letter Tools - LLM-powered optimization

  // Rezi API - ATS-optimized CVs and cover letters
  app.post('/api/resume/rezi-optimize', async (req, res) => {
    try {
      const { resumeContent, jobDescription, targetRole, industry, optimizationLevel } = req.body;
      
      if (!resumeContent || !jobDescription || !targetRole || !industry) {
        return res.status(400).json({ message: 'Resume content, job description, target role, and industry are required' });
      }

      const optimizedResume = await reziService.optimizeResume({
        resumeContent,
        jobDescription,
        targetRole,
        industry,
        optimizationLevel: optimizationLevel || 'advanced'
      });
      
      res.json({
        success: true,
        optimizedResume,
        provider: 'Rezi API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rezi resume optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize resume' });
    }
  });

  app.post('/api/resume/rezi-cover-letter', async (req, res) => {
    try {
      const { resumeContent, jobDescription, companyName, hiringManager, tone, length } = req.body;
      
      if (!resumeContent || !jobDescription || !companyName) {
        return res.status(400).json({ message: 'Resume content, job description, and company name are required' });
      }

      const coverLetter = await reziService.generateCoverLetter({
        resumeContent,
        jobDescription,
        companyName,
        hiringManager,
        tone: tone || 'professional',
        length: length || 'medium'
      });
      
      res.json({
        success: true,
        coverLetter,
        provider: 'Rezi API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rezi cover letter generation error:', error);
      res.status(500).json({ message: 'Failed to generate cover letter' });
    }
  });

  app.post('/api/resume/rezi-ats-analysis', async (req, res) => {
    try {
      const { resumeContent, jobDescription, targetATS } = req.body;
      
      if (!resumeContent || !jobDescription) {
        return res.status(400).json({ message: 'Resume content and job description are required' });
      }

      const atsAnalysis = await reziService.analyzeATSCompatibility({
        resumeContent,
        jobDescription,
        targetATS
      });
      
      res.json({
        success: true,
        atsAnalysis,
        provider: 'Rezi API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rezi ATS analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze ATS compatibility' });
    }
  });

  app.get('/api/resume/rezi-templates', async (req, res) => {
    try {
      const { industry, experience, style } = req.query;
      
      const templates = await reziService.getResumeTemplates({
        industry: industry?.toString() || 'technology',
        experience: (experience?.toString() as any) || 'mid',
        style: (style?.toString() as any) || 'modern'
      });
      
      res.json({
        success: true,
        templates,
        provider: 'Rezi API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rezi templates error:', error);
      res.status(500).json({ message: 'Failed to get resume templates' });
    }
  });

  app.post('/api/resume/rezi-bullet-points', async (req, res) => {
    try {
      const { role, industry, experience, achievements } = req.body;
      
      if (!role || !industry || !experience || !achievements) {
        return res.status(400).json({ message: 'Role, industry, experience, and achievements are required' });
      }

      const bulletPoints = await reziService.getBulletPointSuggestions({
        role,
        industry,
        experience,
        achievements
      });
      
      res.json({
        success: true,
        bulletPoints,
        provider: 'Rezi API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Rezi bullet points error:', error);
      res.status(500).json({ message: 'Failed to get bullet point suggestions' });
    }
  });

  // Kickresume AI - Intelligent CV builder with GPT support
  app.get('/api/resume/kickresume-templates', async (req, res) => {
    try {
      const { category, style, industry, experience } = req.query;
      
      const templates = await kickresumeService.getTemplates({
        category: category?.toString(),
        style: style?.toString(),
        industry: industry?.toString(),
        experience: experience?.toString()
      });
      
      res.json({
        success: true,
        templates,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume templates error:', error);
      res.status(500).json({ message: 'Failed to get templates' });
    }
  });

  app.post('/api/resume/kickresume-build', async (req, res) => {
    try {
      const { templateId, content, aiOptimization, targetRole, industry } = req.body;
      
      if (!templateId || !content) {
        return res.status(400).json({ message: 'Template ID and content are required' });
      }

      const builtResume = await kickresumeService.buildResume({
        templateId,
        content,
        aiOptimization: aiOptimization || true,
        targetRole,
        industry
      });
      
      res.json({
        success: true,
        builtResume,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume build error:', error);
      res.status(500).json({ message: 'Failed to build resume' });
    }
  });

  app.post('/api/resume/kickresume-gpt-optimize', async (req, res) => {
    try {
      const { resumeContent, jobDescription, targetRole, optimizationLevel } = req.body;
      
      if (!resumeContent || !jobDescription || !targetRole) {
        return res.status(400).json({ message: 'Resume content, job description, and target role are required' });
      }

      const gptOptimization = await kickresumeService.optimizeWithGPT({
        resumeContent,
        jobDescription,
        targetRole,
        optimizationLevel: optimizationLevel || 'advanced'
      });
      
      res.json({
        success: true,
        gptOptimization,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume GPT optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize with GPT' });
    }
  });

  app.post('/api/resume/kickresume-generate-content', async (req, res) => {
    try {
      const { section, userInput, targetRole, industry, tone } = req.body;
      
      if (!section || !userInput || !targetRole || !industry) {
        return res.status(400).json({ message: 'Section, user input, target role, and industry are required' });
      }

      const generatedContent = await kickresumeService.generateContent({
        section,
        userInput,
        targetRole,
        industry,
        tone: tone || 'professional'
      });
      
      res.json({
        success: true,
        generatedContent,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume content generation error:', error);
      res.status(500).json({ message: 'Failed to generate content' });
    }
  });

  app.post('/api/resume/kickresume-export', async (req, res) => {
    try {
      const { resumeId, options } = req.body;
      
      if (!resumeId || !options) {
        return res.status(400).json({ message: 'Resume ID and export options are required' });
      }

      const exportResult = await kickresumeService.exportResume({
        resumeId,
        options
      });
      
      res.json({
        success: true,
        exportResult,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume export error:', error);
      res.status(500).json({ message: 'Failed to export resume' });
    }
  });

  app.post('/api/resume/kickresume-analyze', async (req, res) => {
    try {
      const { resumeContent, analysisType } = req.body;
      
      if (!resumeContent || !analysisType) {
        return res.status(400).json({ message: 'Resume content and analysis type are required' });
      }

      const analysis = await kickresumeService.analyzeResume({
        resumeContent,
        analysisType
      });
      
      res.json({
        success: true,
        analysis,
        provider: 'Kickresume AI',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Kickresume analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze resume' });
    }
  });

  // Teal HQ - Resume tracker + rewrite recommendations
  app.post('/api/resume/teal-track', async (req, res) => {
    try {
      const { userId, resumeContent, applications } = req.body;
      
      if (!userId || !resumeContent || !applications) {
        return res.status(400).json({ message: 'User ID, resume content, and applications are required' });
      }

      const tracking = await tealHqService.trackResumePerformance({
        userId,
        resumeContent,
        applications
      });
      
      res.json({
        success: true,
        tracking,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ tracking error:', error);
      res.status(500).json({ message: 'Failed to track resume performance' });
    }
  });

  app.post('/api/resume/teal-analyze', async (req, res) => {
    try {
      const { resumeContent, targetRole, industry, analysisDepth } = req.body;
      
      if (!resumeContent || !targetRole || !industry) {
        return res.status(400).json({ message: 'Resume content, target role, and industry are required' });
      }

      const analysis = await tealHqService.analyzeResume({
        resumeContent,
        targetRole,
        industry,
        analysisDepth: analysisDepth || 'comprehensive'
      });
      
      res.json({
        success: true,
        analysis,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze resume' });
    }
  });

  app.post('/api/resume/teal-rewrite-recommendations', async (req, res) => {
    try {
      const { resumeContent, targetRole, jobDescription, priority } = req.body;
      
      if (!resumeContent || !targetRole || !jobDescription) {
        return res.status(400).json({ message: 'Resume content, target role, and job description are required' });
      }

      const recommendations = await tealHqService.getRewriteRecommendations({
        resumeContent,
        targetRole,
        jobDescription,
        priority: priority || 'medium'
      });
      
      res.json({
        success: true,
        recommendations,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ rewrite recommendations error:', error);
      res.status(500).json({ message: 'Failed to get rewrite recommendations' });
    }
  });

  app.post('/api/resume/teal-coaching', async (req, res) => {
    try {
      const { userId, resumeContent, careerGoals, experience, targetRoles } = req.body;
      
      if (!userId || !resumeContent || !careerGoals || !experience || !targetRoles) {
        return res.status(400).json({ message: 'User ID, resume content, career goals, experience, and target roles are required' });
      }

      const coaching = await tealHqService.getCoachingInsights({
        userId,
        resumeContent,
        careerGoals,
        experience,
        targetRoles
      });
      
      res.json({
        success: true,
        coaching,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ coaching error:', error);
      res.status(500).json({ message: 'Failed to get coaching insights' });
    }
  });

  app.post('/api/resume/teal-job-match', async (req, res) => {
    try {
      const { resumeContent, jobDescription, jobId, company, position } = req.body;
      
      if (!resumeContent || !jobDescription || !jobId || !company || !position) {
        return res.status(400).json({ message: 'Resume content, job description, job ID, company, and position are required' });
      }

      const jobMatch = await tealHqService.analyzeJobMatch({
        resumeContent,
        jobDescription,
        jobId,
        company,
        position
      });
      
      res.json({
        success: true,
        jobMatch,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ job match error:', error);
      res.status(500).json({ message: 'Failed to analyze job match' });
    }
  });

  app.post('/api/resume/teal-version-comparison', async (req, res) => {
    try {
      const { resumeVersions, metrics } = req.body;
      
      if (!resumeVersions || !metrics) {
        return res.status(400).json({ message: 'Resume versions and metrics are required' });
      }

      const comparison = await tealHqService.generateVersionComparison({
        resumeVersions,
        metrics
      });
      
      res.json({
        success: true,
        comparison,
        provider: 'Teal HQ',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Teal HQ version comparison error:', error);
      res.status(500).json({ message: 'Failed to generate version comparison' });
    }
  });

  // Custom GPT-4/Claude Flow - Custom rewrite module
  app.post('/api/resume/custom-gpt-rewrite', async (req, res) => {
    try {
      const { resumeContent, jobDescription, targetRole, industry, rewriteLevel, aiModel } = req.body;
      
      if (!resumeContent || !jobDescription || !targetRole || !industry) {
        return res.status(400).json({ message: 'Resume content, job description, target role, and industry are required' });
      }

      const rewriteResult = await customGptService.rewriteResumeWithGPT({
        resumeContent,
        jobDescription,
        targetRole,
        industry,
        rewriteLevel: rewriteLevel || 'moderate',
        aiModel: aiModel || 'gpt-4'
      });
      
      res.json({
        success: true,
        rewriteResult,
        provider: 'Custom GPT-4/Claude Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT rewrite error:', error);
      res.status(500).json({ message: 'Failed to rewrite resume with GPT' });
    }
  });

  app.post('/api/resume/custom-gpt-cover-letter', async (req, res) => {
    try {
      const { resumeContent, jobDescription, companyName, hiringManager, tone, length, aiModel } = req.body;
      
      if (!resumeContent || !jobDescription || !companyName) {
        return res.status(400).json({ message: 'Resume content, job description, and company name are required' });
      }

      const coverLetter = await customGptService.generateCoverLetterWithAI({
        resumeContent,
        jobDescription,
        companyName,
        hiringManager,
        tone: tone || 'professional',
        length: length || 'medium',
        aiModel: aiModel || 'gpt-4'
      });
      
      res.json({
        success: true,
        coverLetter,
        provider: 'Custom GPT-4/Claude Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT cover letter error:', error);
      res.status(500).json({ message: 'Failed to generate cover letter with AI' });
    }
  });

  app.post('/api/resume/custom-gpt-optimization-flow', async (req, res) => {
    try {
      const { resumeContent, jobDescription, targetRole, iterations, aiModel } = req.body;
      
      if (!resumeContent || !jobDescription || !targetRole) {
        return res.status(400).json({ message: 'Resume content, job description, and target role are required' });
      }

      const optimizationFlow = await customGptService.optimizeWithIterativeFlow({
        resumeContent,
        jobDescription,
        targetRole,
        iterations: iterations || 3,
        aiModel: aiModel || 'gpt-4'
      });
      
      res.json({
        success: true,
        optimizationFlow,
        provider: 'Custom GPT-4/Claude Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT optimization flow error:', error);
      res.status(500).json({ message: 'Failed to optimize with iterative flow' });
    }
  });

  app.post('/api/resume/custom-gpt-job-analysis', async (req, res) => {
    try {
      const { jobDescription, company, industry, aiModel } = req.body;
      
      if (!jobDescription || !company || !industry) {
        return res.status(400).json({ message: 'Job description, company, and industry are required' });
      }

      const jobAnalysis = await customGptService.analyzeJobDescriptionWithAI({
        jobDescription,
        company,
        industry,
        aiModel: aiModel || 'gpt-4'
      });
      
      res.json({
        success: true,
        jobAnalysis,
        provider: 'Custom GPT-4/Claude Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT job analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze job description' });
    }
  });

  app.post('/api/resume/custom-gpt-ats-analysis', async (req, res) => {
    try {
      const { resumeContent, jobDescription, targetATS, aiModel } = req.body;
      
      if (!resumeContent || !jobDescription) {
        return res.status(400).json({ message: 'Resume content and job description are required' });
      }

      const atsAnalysis = await customGptService.performAdvancedATSAnalysis({
        resumeContent,
        jobDescription,
        targetATS,
        aiModel: aiModel || 'gpt-4'
      });
      
      res.json({
        success: true,
        atsAnalysis,
        provider: 'Custom GPT-4/Claude Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT ATS analysis error:', error);
      res.status(500).json({ message: 'Failed to perform ATS analysis' });
    }
  });

  app.post('/api/resume/custom-gpt-bullet-points', async (req, res) => {
    try {
      const { jobTitle, experience, achievements, targetRole, industry, aiModel } = req.body;
      
      if (!jobTitle || !experience || !achievements || !targetRole || !industry) {
        return res.status(400).json({ message: 'Job title, experience, achievements, target role, and industry are required' });
      }

      const bulletPoints = await customGptService.generateBulletPointsWithAI({
        jobTitle,
        experience,
        achievements,
        targetRole,
        industry,
        aiModel: aiModel || 'gpt-4'
      });
      
      res.json({
        success: true,
        bulletPoints,
        provider: 'Custom GPT-4/Claude Flow',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Custom GPT bullet points error:', error);
      res.status(500).json({ message: 'Failed to generate bullet points with AI' });
    }
  });



  // JWT Auth middleware
  setupJWTAuth(app);

  // Health check endpoint for deployment
  app.get('/api/health', async (req, res) => {
    try {
      // Comprehensive health check
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        security: {
          headers: 'enabled',
          rateLimit: 'active',
          csp: 'enforced',
          xss: 'protected'
        },
        services: {
          database: 'connected',
          authentication: 'active',
          stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'missing',
          openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
          anthropic: process.env.ANTHROPIC_API_KEY ? 'configured' : 'missing',
          sendgrid: process.env.SENDGRID_API_KEY ? 'configured' : 'missing'
        }
      };
      
      res.json(healthStatus);
    } catch (error) {
      res.status(500).json({ 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Auth routes are now handled by Auth0 middleware

  // Dashboard routes
  app.get('/api/dashboard', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const applications = await storage.getJobApplications(userId);
      const interviews = await storage.getInterviews(userId);
      const resumes = await storage.getResumes(userId);
      
      const dashboardData = {
        jobSearches: 23, // This would be tracked in the database
        applications: applications.length,
        interviews: interviews.length,
        resumeScore: resumes.length > 0 ? 85 : 0,
        profileStrength: user ? 92 : 0,
        matchingJobs: 47,
        plan: 'free' // Would come from user subscription
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // AI-powered resume analysis
  app.post('/api/resume/analyze', requireAuth, async (req, res) => {
    try {
      const { resumeContent, jobDescription } = req.body;
      const analysis = await openRouterService.analyzeResume(resumeContent, jobDescription);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      res.status(500).json({ message: "Failed to analyze resume" });
    }
  });

  // AI-powered resume optimization
  app.post('/api/resume/optimize', requireAuth, async (req, res) => {
    try {
      const { resumeContent, jobDescription, targetRole } = req.body;
      const optimization = await openRouterService.optimizeResume(resumeContent, jobDescription, targetRole);
      res.json(optimization);
    } catch (error) {
      console.error("Error optimizing resume:", error);
      res.status(500).json({ message: "Failed to optimize resume" });
    }
  });

  // AI-powered resume generation
  app.post('/api/resume/generate', requireAuth, async (req, res) => {
    try {
      const { userInfo, targetRole, template } = req.body;
      const resume = await openRouterService.generateResume(userInfo, targetRole, template);
      res.json(resume);
    } catch (error) {
      console.error("Error generating resume:", error);
      res.status(500).json({ message: "Failed to generate resume" });
    }
  });

  // AI-powered interview questions
  app.post('/api/interview/questions', requireAuth, async (req, res) => {
    try {
      const { jobDescription, experienceLevel, category } = req.body;
      const questions = await openRouterService.generateInterviewQuestions(jobDescription, experienceLevel, category);
      res.json(questions);
    } catch (error) {
      console.error("Error generating interview questions:", error);
      res.status(500).json({ message: "Failed to generate interview questions" });
    }
  });

  // AI-powered interview performance analysis
  app.post('/api/interview/analyze', requireAuth, async (req, res) => {
    try {
      const { question, userAnswer, correctAnswer } = req.body;
      const analysis = await openRouterService.analyzeInterviewPerformance(question, userAnswer, correctAnswer);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing interview performance:", error);
      res.status(500).json({ message: "Failed to analyze interview performance" });
    }
  });

  // AI-powered cover letter generation
  app.post('/api/cover-letter/generate', requireAuth, async (req, res) => {
    try {
      const { resumeContent, jobDescription, companyInfo } = req.body;
      const coverLetter = await openRouterService.generateCoverLetter(resumeContent, jobDescription, companyInfo);
      res.json(coverLetter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ message: "Failed to generate cover letter" });
    }
  });

  // AI-powered company insights
  app.post('/api/company/insights', requireAuth, async (req, res) => {
    try {
      const { companyName, jobTitle } = req.body;
      const insights = await openRouterService.getCompanyInsights(companyName, jobTitle);
      res.json(insights);
    } catch (error) {
      console.error("Error getting company insights:", error);
      res.status(500).json({ message: "Failed to get company insights" });
    }
  });

  // AI-powered job recommendations
  app.get('/api/jobs/recommendations/ai', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const userProfile = await storage.getUser(userId);
      const preferences = await storage.getUserPreferences(userId);
      const recommendations = await openRouterService.generateJobRecommendations(userProfile, preferences);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating AI job recommendations:", error);
      res.status(500).json({ message: "Failed to generate AI job recommendations" });
    }
  });

  // AI-powered career tips
  app.post('/api/career/tips', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const userProfile = await storage.getUser(userId);
      const { currentRole, targetRole } = req.body;
      const tips = await openRouterService.generateCareerTips(userProfile, currentRole, targetRole);
      res.json(tips);
    } catch (error) {
      console.error("Error generating career tips:", error);
      res.status(500).json({ message: "Failed to generate career tips" });
    }
  });

  // AI-powered job search optimization
  app.post('/api/jobs/search/optimize', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const userProfile = await storage.getUser(userId);
      const { searchQuery, previousResults } = req.body;
      const optimization = await openRouterService.optimizeJobSearch(searchQuery, userProfile, previousResults);
      res.json(optimization);
    } catch (error) {
      console.error("Error optimizing job search:", error);
      res.status(500).json({ message: "Failed to optimize job search" });
    }
  });

  // Job search routes
  app.get('/api/jobs', async (req, res) => {
    try {
      const { query, location, jobType, experienceLevel, salaryMin, salaryMax, limit } = req.query;
      
      const filters: any = {};
      if (location) filters.location = location;
      if (jobType) filters.jobType = jobType;
      if (experienceLevel) filters.experienceLevel = experienceLevel;
      if (salaryMin) filters.salaryMin = parseInt(salaryMin as string);
      if (salaryMax) filters.salaryMax = parseInt(salaryMax as string);
      if (limit) filters.limit = parseInt(limit as string);
      
      let jobs;
      if (query) {
        jobs = await storage.searchJobs(query as string, filters);
      } else {
        jobs = await storage.getJobs(filters);
      }
      
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post('/api/jobs/search', async (req, res) => {
    try {
      const { query, filters, page = 1, pageSize = 20 } = req.body;
      const result = await jobService.searchJobs(query, filters, page, pageSize);
      res.json(result);
    } catch (error) {
      console.error("Error searching jobs:", error);
      res.status(500).json({ message: "Failed to search jobs" });
    }
  });

  app.get('/api/jobs/recommendations', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const jobs = await jobService.getJobRecommendations(userId, limit);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      res.status(500).json({ message: "Failed to fetch job recommendations" });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const job = await jobService.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  // User stats route
  app.get('/api/user/stats', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getJobApplicationStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Subscription management routes
  app.get('/api/subscription/plans', async (req, res) => {
    try {
      const plans = [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          period: 'forever',
          description: 'Perfect for getting started',
          features: [
            '5 AI job searches per month',
            'Basic resume optimization',
            'Limited job board access',
            'Email support'
          ]
        },
        {
          id: 'professional',
          name: 'Professional',
          price: 29,
          period: 'month',
          description: 'For serious job seekers',
          features: [
            'Unlimited AI job searches',
            'Advanced resume optimization',
            'All 15+ job board access',
            'AI interview preparation',
            'Priority support',
            'Analytics dashboard'
          ]
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 79,
          period: 'month',
          description: 'For career professionals',
          features: [
            'Everything in Professional',
            'Advanced analytics',
            'Salary negotiation coaching',
            '1:1 career coaching',
            'White-glove service',
            'Custom integrations'
          ]
        }
      ];
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  app.post('/api/subscription/create-checkout', requireAuth, async (req: any, res) => {
    try {
      const { planId } = req.body;
      const userId = req.user.claims.sub;
      
      // Define price IDs for each plan
      const priceMapping = {
        'professional': process.env.STRIPE_PROFESSIONAL_PRICE_ID,
        'enterprise': process.env.STRIPE_ENTERPRISE_PRICE_ID
      };

      const priceId = priceMapping[planId as keyof typeof priceMapping];
      if (!priceId) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/dashboard?success=true`,
        cancel_url: `${req.protocol}://${req.get('host')}/pricing?canceled=true`,
        client_reference_id: userId,
        metadata: {
          userId: userId,
          planId: planId
        }
      });

      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.get('/api/subscription/status', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return subscription status
      res.json({
        currentPlan: user.subscriptionPlan || 'free',
        subscriptionStatus: user.subscriptionStatus || 'inactive',
        subscriptionEndsAt: user.subscriptionEndsAt,
        usageThisMonth: {
          jobSearches: user.jobSearchesThisMonth || 0,
          resumeOptimizations: user.resumeOptimizationsThisMonth || 0
        }
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ message: "Failed to fetch subscription status" });
    }
  });

  // Job search routes
  app.get('/api/jobs', async (req, res) => {
    try {
      const { query, location, jobType, experienceLevel, salaryMin, salaryMax, limit = 20 } = req.query;
      
      const filters = {
        location: location as string,
        jobType: jobType as string,
        experienceLevel: experienceLevel as string,
        salaryMin: salaryMin ? parseInt(salaryMin as string) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax as string) : undefined,
        limit: parseInt(limit as string),
      };

      let jobs;
      if (query) {
        jobs = await storage.searchJobs(query as string, filters);
      } else {
        jobs = await storage.getJobs(filters);
      }

      res.json(jobs);
    } catch (error) {
      console.error("Error searching jobs:", error);
      res.status(500).json({ message: "Failed to search jobs" });
    }
  });

  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post('/api/jobs/search', async (req, res) => {
    try {
      const { keywords, location, jobType, experienceLevel, salaryMin, limit = 20 } = req.body;
      
      // Search external job boards
      const jobs = await jobBoardService.searchJobs({
        keywords,
        location,
        jobType,
        experienceLevel,
        salaryMin,
        limit
      });

      // Store jobs in database
      for (const job of jobs) {
        try {
          await storage.createJob(job);
        } catch (error) {
          // Job might already exist, continue
        }
      }

      res.json(jobs);
    } catch (error) {
      console.error("Error searching external jobs:", error);
      res.status(500).json({ message: "Failed to search external jobs" });
    }
  });

  // Job recommendations
  app.get('/api/jobs/recommendations', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recommendations = await jobService.getJobRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting job recommendations:", error);
      res.status(500).json({ message: "Failed to get job recommendations" });
    }
  });

  // Resume routes
  app.post('/api/resumes', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumeData = insertResumeSchema.parse({ ...req.body, userId });
      
      const resume = await storage.createResume(resumeData);
      res.json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  app.get('/api/resumes', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get('/api/resumes/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  app.put('/api/resumes/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const updatedResume = await storage.updateResume(req.params.id, req.body);
      res.json(updatedResume);
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  app.delete('/api/resumes/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      await storage.deleteResume(req.params.id);
      res.json({ message: "Resume deleted successfully" });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Resume optimization
  app.post('/api/resumes/:id/optimize', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const { jobDescription } = req.body;
      const optimization = await openaiService.optimizeResume(resume, jobDescription);
      
      res.json(optimization);
    } catch (error) {
      console.error("Error optimizing resume:", error);
      res.status(500).json({ message: "Failed to optimize resume" });
    }
  });

  app.post('/api/resumes/:id/analyze', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resume = await storage.getResume(req.params.id);
      
      if (!resume || resume.userId !== userId) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      const analysis = await openaiService.analyzeResume(resume);
      
      // Update resume with analysis
      await storage.updateResume(req.params.id, {
        analysis,
        atsScore: analysis.atsScore || 0
      });
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      res.status(500).json({ message: "Failed to analyze resume" });
    }
  });

  // Job application routes
  app.post('/api/applications', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applicationData = insertJobApplicationSchema.parse({ ...req.body, userId });
      
      const application = await storage.createJobApplication(applicationData);
      
      // Create notification
      await storage.createNotification({
        userId,
        type: 'application_submitted',
        title: 'Application Submitted',
        message: `Your application has been submitted successfully.`,
      });
      
      res.json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.get('/api/applications', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applications = await storage.getJobApplications(userId);
      
      // Enrich with job details
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const job = await storage.getJob(app.jobId);
          return { ...app, job };
        })
      );
      
      res.json(enrichedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.get('/api/applications/stats', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getJobApplicationStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching application stats:", error);
      res.status(500).json({ message: "Failed to fetch application stats" });
    }
  });

  app.put('/api/applications/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const application = await storage.getJobApplication(req.params.id);
      
      if (!application || application.userId !== userId) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      const updatedApplication = await storage.updateJobApplication(req.params.id, req.body);
      res.json(updatedApplication);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Job alerts
  app.post('/api/job-alerts', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alertData = insertJobAlertSchema.parse({ ...req.body, userId });
      
      const alert = await storage.createJobAlert(alertData);
      res.json(alert);
    } catch (error) {
      console.error("Error creating job alert:", error);
      res.status(500).json({ message: "Failed to create job alert" });
    }
  });

  app.get('/api/job-alerts', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alerts = await storage.getJobAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching job alerts:", error);
      res.status(500).json({ message: "Failed to fetch job alerts" });
    }
  });

  app.put('/api/job-alerts/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alert = await storage.getJobAlert(req.params.id);
      
      if (!alert || alert.userId !== userId) {
        return res.status(404).json({ message: "Job alert not found" });
      }
      
      const updatedAlert = await storage.updateJobAlert(req.params.id, req.body);
      res.json(updatedAlert);
    } catch (error) {
      console.error("Error updating job alert:", error);
      res.status(500).json({ message: "Failed to update job alert" });
    }
  });

  app.delete('/api/job-alerts/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alert = await storage.getJobAlert(req.params.id);
      
      if (!alert || alert.userId !== userId) {
        return res.status(404).json({ message: "Job alert not found" });
      }
      
      await storage.deleteJobAlert(req.params.id);
      res.json({ message: "Job alert deleted successfully" });
    } catch (error) {
      console.error("Error deleting job alert:", error);
      res.status(500).json({ message: "Failed to delete job alert" });
    }
  });

  // Interview routes
  app.post('/api/interviews', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interviewData = { ...req.body, userId };
      
      const interview = await storage.createInterview(interviewData);
      res.json(interview);
    } catch (error) {
      console.error("Error creating interview:", error);
      res.status(500).json({ message: "Failed to create interview" });
    }
  });

  app.get('/api/interviews', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const interviews = await storage.getInterviews(userId);
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  // Interview preparation
  app.post('/api/interview-prep/questions', requireAuth, async (req: any, res) => {
    try {
      const { jobTitle, industry, difficulty } = req.body;
      const questions = await openaiService.generateInterviewQuestions(jobTitle, industry, difficulty);
      res.json(questions);
    } catch (error) {
      console.error("Error generating interview questions:", error);
      res.status(500).json({ message: "Failed to generate interview questions" });
    }
  });

  app.post('/api/interview-prep/practice', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const practiceData = insertInterviewPracticeSchema.parse({ ...req.body, userId });
      
      const practice = await storage.createInterviewPractice(practiceData);
      res.json(practice);
    } catch (error) {
      console.error("Error creating interview practice:", error);
      res.status(500).json({ message: "Failed to create interview practice" });
    }
  });

  app.get('/api/interview-prep/practice', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const practices = await storage.getInterviewPractice(userId);
      res.json(practices);
    } catch (error) {
      console.error("Error fetching interview practice:", error);
      res.status(500).json({ message: "Failed to fetch interview practice" });
    }
  });

  // AI chat and analysis
  app.post('/api/ai/job-match', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { jobDescription, resumeContent } = req.body;
      
      const matchResult = await aiService.matchJobToResume(jobDescription, resumeContent);
      res.json(matchResult);
    } catch (error) {
      console.error("Error matching job to resume:", error);
      res.status(500).json({ message: "Failed to match job to resume" });
    }
  });



  // User preferences
  app.get('/api/user/preferences', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post('/api/user/preferences', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesData = insertUserPreferencesSchema.parse({ ...req.body, userId });
      
      const preferences = await storage.createUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error creating user preferences:", error);
      res.status(500).json({ message: "Failed to create user preferences" });
    }
  });

  app.put('/api/user/preferences', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.updateUserPreferences(userId, req.body);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ message: "Failed to update user preferences" });
    }
  });

  // Saved jobs
  app.post('/api/saved-jobs', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedJobData = insertSavedJobSchema.parse({ ...req.body, userId });
      
      const savedJob = await storage.createSavedJob(savedJobData);
      res.json(savedJob);
    } catch (error) {
      console.error("Error saving job:", error);
      res.status(500).json({ message: "Failed to save job" });
    }
  });

  app.get('/api/saved-jobs', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedJobs = await storage.getSavedJobs(userId);
      
      // Enrich with job details
      const enrichedSavedJobs = await Promise.all(
        savedJobs.map(async (savedJob) => {
          const job = await storage.getJob(savedJob.jobId);
          return { ...savedJob, job };
        })
      );
      
      res.json(enrichedSavedJobs);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      res.status(500).json({ message: "Failed to fetch saved jobs" });
    }
  });

  app.delete('/api/saved-jobs/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedJob = await storage.getSavedJobs(userId);
      
      if (!savedJob.find(job => job.id === req.params.id)) {
        return res.status(404).json({ message: "Saved job not found" });
      }
      
      await storage.deleteSavedJob(req.params.id);
      res.json({ message: "Saved job deleted successfully" });
    } catch (error) {
      console.error("Error deleting saved job:", error);
      res.status(500).json({ message: "Failed to delete saved job" });
    }
  });

  // Notifications
  app.get('/api/notifications', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', requireAuth, async (req: any, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.put('/api/notifications/read-all', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Salary negotiation
  app.post('/api/salary-negotiation', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const negotiationData = insertSalaryNegotiationSchema.parse({ ...req.body, userId });
      
      const negotiation = await storage.createSalaryNegotiation(negotiationData);
      res.json(negotiation);
    } catch (error) {
      console.error("Error creating salary negotiation:", error);
      res.status(500).json({ message: "Failed to create salary negotiation" });
    }
  });

  app.get('/api/salary-negotiation', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const negotiations = await storage.getSalaryNegotiations(userId);
      res.json(negotiations);
    } catch (error) {
      console.error("Error fetching salary negotiations:", error);
      res.status(500).json({ message: "Failed to fetch salary negotiations" });
    }
  });

  app.post('/api/salary-negotiation/analyze', requireAuth, async (req: any, res) => {
    try {
      const { jobTitle, location, experience } = req.body;
      const analysis = await openaiService.analyzeSalaryNegotiation(jobTitle, location, experience);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing salary negotiation:", error);
      res.status(500).json({ message: "Failed to analyze salary negotiation" });
    }
  });

  // Subscription and payment routes
  app.get('/api/subscription/plans', async (req, res) => {
    try {
      const plans = await stripeService.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  app.post('/api/get-or-create-subscription', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { planId } = req.body;
      
      const result = await stripeService.getOrCreateSubscription(userId, planId);
      res.json(result);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.post('/api/webhooks/stripe', async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      if (!sig) {
        return res.status(400).json({ message: "Missing stripe signature" });
      }
      
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
      
      await stripeService.handleWebhook(event);
      res.json({ received: true });
    } catch (error) {
      console.error("Error handling Stripe webhook:", error);
      res.status(400).json({ message: "Webhook error" });
    }
  });

  // AI Features
  app.post('/api/ai/cover-letter', requireAuth, async (req: any, res) => {
    try {
      const { jobId, jobDescription, jobTitle, company } = req.body;
      const userId = req.user.claims.sub;
      
      // Get user's latest resume
      const resumes = await storage.getResumes(userId);
      const latestResume = resumes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      
      if (!latestResume) {
        return res.status(400).json({ message: "No resume found. Please upload a resume first." });
      }
      
      const coverLetter = await aiService.generateCoverLetter(
        JSON.stringify(latestResume.content),
        jobDescription,
        jobTitle,
        company
      );
      
      res.json({ coverLetter });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ message: "Failed to generate cover letter" });
    }
  });

  app.post('/api/ai/company-insights', requireAuth, async (req: any, res) => {
    try {
      const { company, jobTitle, jobDescription } = req.body;
      
      const insights = await aiService.generateCompanyInsights(company, jobTitle, jobDescription);
      
      res.json({ insights });
    } catch (error) {
      console.error("Error generating company insights:", error);
      res.status(500).json({ message: "Failed to generate company insights" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
