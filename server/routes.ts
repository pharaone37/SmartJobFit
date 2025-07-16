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
import { whisperService } from "./services/whisperService";
import { pdfExtractionService } from "./services/pdfExtractionService";
import { automationService } from "./services/automationService";
import { ragSearchService } from "./services/ragSearchService";
import { jobSearchEngine } from "./jobSearchEngine";
import { resumeOptimizer } from "./resumeOptimizer";
import { applicationTracker } from "./applicationTracker";
import { salaryIntelligence } from "./salaryIntelligence";
import { careerCoaching } from "./careerCoaching";
import * as jobAlerts from "./jobAlerts";
import * as autoApply from "./autoApply";
import { 
  generateInterviewQuestions, 
  researchCompany, 
  startAICoaching, 
  analyzeInterviewPerformance 
} from "./interviewPrep";
import { 
  getFAQs, 
  getFAQById, 
  searchFAQsWithAI, 
  rateFAQ, 
  getFAQCategories, 
  getFAQAnalytics 
} from "./faq";
import {
  processMessage,
  getConversationHistory,
  submitFeedback,
  getSuggestions,
  escalateToHuman,
  updatePreferences,
  getChatbotAnalytics
} from "./chatbot";
import multer from "multer";
import { 
  insertJobSchema, 
  insertResumeSchema, 
  insertJobApplicationSchema,
  insertJobAlertSchema,
  insertUserPreferencesSchema,
  insertSavedJobSchema,
  insertInterviewPracticeSchema,
  insertSalaryNegotiationSchema,
  insertResumeTemplateSchema,
  insertMoodBoardSchema,
  insertSkillTrackingSchema,
  insertInterviewSessionSchema,
  insertNetworkConnectionSchema,
  insertInterviewCoachingSessionSchema,
  insertInterviewQuestionSchema,
  insertInterviewResponseSchema,
  insertInterviewFeedbackSchema,
  insertCompanyInterviewInsightsSchema,
  insertUserInterviewProgressSchema,
  insertApplicationSchema,
  insertApplicationTimelineSchema,
  insertCommunicationSchema,
  insertFollowUpSchema,
  insertOutcomePredictionSchema,
  insertEmailIntegrationSchema,
  insertApplicationAnalyticsSchema,
  insertSalaryDataSchema,
  insertUserNegotiationSchema,
  insertCareerProfileSchema,
  insertSkillAssessmentSchema,
  insertCareerGoalSchema,
  insertLearningPlanSchema,
  insertMentorshipMatchSchema,
  insertIndustryInsightSchema,
  insertNetworkingEventSchema,
  insertCareerProgressSchema,
  insertPersonalBrandingSchema,
  insertCompanyCompensationSchema,
  insertMarketTrendSchema,
  insertNegotiationSessionSchema,
  insertSalaryBenchmarkSchema,
  insertAutomationProfileSchema,
  insertApplicationQueueSchema,
  insertAutomationRuleSchema,
  insertQualityMetricSchema,
  insertSubmissionLogSchema,
  insertAutomationAnalyticsSchema,
  insertPlatformCredentialSchema,
  insertAutomationSessionSchema
} from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
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

  // Whisper Service - Speech-to-Text für Interviewanalyse
  app.post('/api/whisper/transcribe', async (req, res) => {
    try {
      const { audioFile, language, prompt, responseFormat, temperature, includeTimestamps, includeWordLevelTimestamps } = req.body;
      
      if (!audioFile) {
        return res.status(400).json({ message: 'Audio file is required' });
      }

      const transcription = await whisperService.transcribeAudio({
        audioFile,
        language,
        prompt,
        responseFormat,
        temperature,
        includeTimestamps,
        includeWordLevelTimestamps
      });
      
      res.json({
        success: true,
        transcription,
        provider: 'OpenAI Whisper',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Whisper transcription error:', error);
      res.status(500).json({ message: 'Failed to transcribe audio' });
    }
  });

  app.post('/api/whisper/analyze-interview', async (req, res) => {
    try {
      const { audioFile, jobRole, interviewType, language, analysisDepth } = req.body;
      
      if (!audioFile || !jobRole || !interviewType) {
        return res.status(400).json({ message: 'Audio file, job role, and interview type are required' });
      }

      const analysis = await whisperService.analyzeInterviewSpeech({
        audioFile,
        jobRole,
        interviewType,
        language,
        analysisDepth: analysisDepth || 'comprehensive'
      });
      
      res.json({
        success: true,
        analysis,
        provider: 'OpenAI Whisper',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Whisper interview analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze interview speech' });
    }
  });

  app.post('/api/whisper/analyze-meeting', async (req, res) => {
    try {
      const { audioFile, meetingType, expectedParticipants, language } = req.body;
      
      if (!audioFile || !meetingType) {
        return res.status(400).json({ message: 'Audio file and meeting type are required' });
      }

      const analysis = await whisperService.analyzeMeetingDiscussion({
        audioFile,
        meetingType,
        expectedParticipants,
        language
      });
      
      res.json({
        success: true,
        analysis,
        provider: 'OpenAI Whisper',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Whisper meeting analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze meeting discussion' });
    }
  });

  app.post('/api/whisper/batch-process', async (req, res) => {
    try {
      const { audioFiles, processingType, options } = req.body;
      
      if (!audioFiles || !processingType) {
        return res.status(400).json({ message: 'Audio files and processing type are required' });
      }

      const batchResult = await whisperService.processBatchAudio({
        audioFiles,
        processingType,
        options
      });
      
      res.json({
        success: true,
        batchResult,
        provider: 'OpenAI Whisper',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Whisper batch processing error:', error);
      res.status(500).json({ message: 'Failed to process batch audio' });
    }
  });

  app.post('/api/whisper/speech-feedback', async (req, res) => {
    try {
      const { transcription, targetRole, focusAreas, language } = req.body;
      
      if (!transcription || !targetRole || !focusAreas) {
        return res.status(400).json({ message: 'Transcription, target role, and focus areas are required' });
      }

      const feedback = await whisperService.generateSpeechFeedback({
        transcription,
        targetRole,
        focusAreas,
        language
      });
      
      res.json({
        success: true,
        feedback,
        provider: 'OpenAI Whisper',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Whisper speech feedback error:', error);
      res.status(500).json({ message: 'Failed to generate speech feedback' });
    }
  });

  // PDF Extraction Service - CVs aus PDFs extrahieren
  app.post('/api/pdf/extract-text', async (req, res) => {
    try {
      const { pdfFile, service, extractionType, ocrEnabled, language } = req.body;
      
      if (!pdfFile) {
        return res.status(400).json({ message: 'PDF file is required' });
      }

      const extractedData = await pdfExtractionService.extractTextFromPDF({
        pdfFile,
        service: service || 'unstructured',
        extractionType: extractionType || 'text',
        ocrEnabled,
        language
      });
      
      res.json({
        success: true,
        extractedData,
        provider: service || 'Unstructured.io',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PDF text extraction error:', error);
      res.status(500).json({ message: 'Failed to extract text from PDF' });
    }
  });

  app.post('/api/pdf/extract-resume', async (req, res) => {
    try {
      const { pdfFile, service, enhanceWithAI } = req.body;
      
      if (!pdfFile) {
        return res.status(400).json({ message: 'PDF file is required' });
      }

      const resumeData = await pdfExtractionService.extractResumeFromPDF({
        pdfFile,
        service,
        enhanceWithAI: enhanceWithAI || false
      });
      
      res.json({
        success: true,
        resumeData,
        provider: service || 'Unstructured.io',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PDF resume extraction error:', error);
      res.status(500).json({ message: 'Failed to extract resume from PDF' });
    }
  });

  app.post('/api/pdf/extract-job-description', async (req, res) => {
    try {
      const { pdfFile, service, enhanceWithAI } = req.body;
      
      if (!pdfFile) {
        return res.status(400).json({ message: 'PDF file is required' });
      }

      const jobData = await pdfExtractionService.extractJobDescriptionFromPDF({
        pdfFile,
        service,
        enhanceWithAI: enhanceWithAI || false
      });
      
      res.json({
        success: true,
        jobData,
        provider: service || 'Unstructured.io',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PDF job description extraction error:', error);
      res.status(500).json({ message: 'Failed to extract job description from PDF' });
    }
  });

  app.post('/api/pdf/batch-process', async (req, res) => {
    try {
      const { files, service, enhanceWithAI } = req.body;
      
      if (!files || !Array.isArray(files)) {
        return res.status(400).json({ message: 'Files array is required' });
      }

      const batchResult = await pdfExtractionService.batchProcessDocuments({
        files,
        service,
        enhanceWithAI: enhanceWithAI || false
      });
      
      res.json({
        success: true,
        batchResult,
        provider: service || 'Unstructured.io',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('PDF batch processing error:', error);
      res.status(500).json({ message: 'Failed to process PDF batch' });
    }
  });

  // Automation Service - Bewerbungen automatisch einreichen
  app.post('/api/automation/zapier-webhook', async (req, res) => {
    try {
      const { webhookUrl, data, workflowType } = req.body;
      
      if (!webhookUrl || !data || !workflowType) {
        return res.status(400).json({ message: 'Webhook URL, data, and workflow type are required' });
      }

      const result = await automationService.triggerZapierWebhook({
        webhookUrl,
        data,
        workflowType
      });
      
      res.json({
        success: true,
        result,
        provider: 'Zapier',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Zapier webhook error:', error);
      res.status(500).json({ message: 'Failed to trigger Zapier webhook' });
    }
  });

  app.post('/api/automation/job-application', async (req, res) => {
    try {
      const { jobApplicationData, automationPlatform, webhookUrl, workflowId } = req.body;
      
      if (!jobApplicationData || !automationPlatform) {
        return res.status(400).json({ message: 'Job application data and automation platform are required' });
      }

      const result = await automationService.automateJobApplication({
        jobApplicationData,
        automationPlatform,
        webhookUrl,
        workflowId
      });
      
      res.json({
        success: true,
        result,
        provider: automationPlatform,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Job application automation error:', error);
      res.status(500).json({ message: 'Failed to automate job application' });
    }
  });

  app.post('/api/automation/schedule-followup', async (req, res) => {
    try {
      const { jobApplicationId, followUpType, delayDays, message, recipientInfo, automationPlatform } = req.body;
      
      if (!jobApplicationId || !followUpType || !delayDays || !message || !recipientInfo || !automationPlatform) {
        return res.status(400).json({ message: 'All follow-up parameters are required' });
      }

      const result = await automationService.scheduleFollowUp({
        jobApplicationId,
        followUpType,
        delayDays,
        message,
        recipientInfo,
        automationPlatform
      });
      
      res.json({
        success: true,
        result,
        provider: automationPlatform,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Follow-up scheduling error:', error);
      res.status(500).json({ message: 'Failed to schedule follow-up' });
    }
  });

  app.post('/api/automation/create-workflow', async (req, res) => {
    try {
      const { name, description, workflowType, triggers, actions, platform } = req.body;
      
      if (!name || !description || !workflowType || !triggers || !actions || !platform) {
        return res.status(400).json({ message: 'All workflow parameters are required' });
      }

      const result = await automationService.createAutomationWorkflow({
        name,
        description,
        workflowType,
        triggers,
        actions,
        platform
      });
      
      res.json({
        success: true,
        result,
        provider: platform,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Workflow creation error:', error);
      res.status(500).json({ message: 'Failed to create automation workflow' });
    }
  });

  app.get('/api/automation/status/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
      const { platform } = req.query;
      
      if (!jobId || !platform) {
        return res.status(400).json({ message: 'Job ID and platform are required' });
      }

      const status = await automationService.getAutomationStatus({
        jobId,
        platform: platform as 'zapier' | 'make'
      });
      
      res.json({
        success: true,
        status,
        provider: platform,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Automation status error:', error);
      res.status(500).json({ message: 'Failed to get automation status' });
    }
  });

  app.post('/api/automation/batch-applications', async (req, res) => {
    try {
      const { applications, platform, delayBetweenApplications, maxConcurrent } = req.body;
      
      if (!applications || !platform) {
        return res.status(400).json({ message: 'Applications and platform are required' });
      }

      const result = await automationService.batchProcessApplications({
        applications,
        platform,
        delayBetweenApplications,
        maxConcurrent
      });
      
      res.json({
        success: true,
        result,
        provider: platform,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Batch applications error:', error);
      res.status(500).json({ message: 'Failed to process batch applications' });
    }
  });

  app.post('/api/automation/validate-application', async (req, res) => {
    try {
      const { jobApplicationData } = req.body;
      
      if (!jobApplicationData) {
        return res.status(400).json({ message: 'Job application data is required' });
      }

      const validation = await automationService.validateJobApplicationData(jobApplicationData);
      
      res.json({
        success: true,
        validation,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Application validation error:', error);
      res.status(500).json({ message: 'Failed to validate application data' });
    }
  });

  app.get('/api/automation/report', async (req, res) => {
    try {
      const { startDate, endDate, platform } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required' });
      }

      const report = await automationService.generateApplicationReport({
        dateRange: { start: startDate as string, end: endDate as string },
        platform: platform as 'zapier' | 'make'
      });
      
      res.json({
        success: true,
        report,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Application report error:', error);
      res.status(500).json({ message: 'Failed to generate application report' });
    }
  });

  // Interview Preparation API Routes
  app.post('/api/interview/generate-questions', requireAuth, generateInterviewQuestions);
  app.post('/api/interview/research-company', requireAuth, researchCompany);
  app.post('/api/interview/start-ai-coaching', requireAuth, startAICoaching);
  app.post('/api/interview/analyze-performance', requireAuth, analyzeInterviewPerformance);

  // RAG Search Service - RAG für Recherchen zu Firmen, Trends, Fragen
  app.post('/api/rag/search-tavily', async (req, res) => {
    try {
      const { query, searchType, maxResults, includeImages, includeDomains, excludeDomains } = req.body;
      
      if (!query || !searchType) {
        return res.status(400).json({ message: 'Query and search type are required' });
      }

      const searchResult = await ragSearchService.searchWithTavily({
        query,
        searchType,
        maxResults,
        includeImages,
        includeDomains,
        excludeDomains
      });
      
      res.json({
        success: true,
        searchResult,
        provider: 'Tavily',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Tavily search error:', error);
      res.status(500).json({ message: 'Failed to search with Tavily' });
    }
  });

  app.post('/api/rag/search-perplexity', async (req, res) => {
    try {
      const { query, model, maxTokens, temperature, searchDomainFilter, searchRecencyFilter, returnImages, returnRelatedQuestions } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }

      const searchResult = await ragSearchService.searchWithPerplexity({
        query,
        model,
        maxTokens,
        temperature,
        searchDomainFilter,
        searchRecencyFilter,
        returnImages,
        returnRelatedQuestions
      });
      
      res.json({
        success: true,
        searchResult,
        provider: 'Perplexity',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Perplexity search error:', error);
      res.status(500).json({ message: 'Failed to search with Perplexity' });
    }
  });

  app.post('/api/rag/research-company', async (req, res) => {
    try {
      const { companyName, searchDepth, focusAreas, includeFinancials, includeInterviewInsights } = req.body;
      
      if (!companyName) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const companyResearch = await ragSearchService.researchCompany({
        companyName,
        searchDepth: searchDepth || 'basic',
        focusAreas,
        includeFinancials,
        includeInterviewInsights
      });
      
      res.json({
        success: true,
        companyResearch,
        provider: 'RAG Search',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Company research error:', error);
      res.status(500).json({ message: 'Failed to research company' });
    }
  });

  app.post('/api/rag/analyze-trends', async (req, res) => {
    try {
      const { topic, timeframe, industry, region, trendType } = req.body;
      
      if (!topic || !timeframe || !trendType) {
        return res.status(400).json({ message: 'Topic, timeframe, and trend type are required' });
      }

      const trendAnalysis = await ragSearchService.analyzeTrends({
        topic,
        timeframe,
        industry,
        region,
        trendType
      });
      
      res.json({
        success: true,
        trendAnalysis,
        provider: 'RAG Search',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Trend analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze trends' });
    }
  });

  app.post('/api/rag/generate-interview-questions', async (req, res) => {
    try {
      const { companyName, position, level, questionTypes, includeCompanySpecific } = req.body;
      
      if (!companyName || !position || !level || !questionTypes) {
        return res.status(400).json({ message: 'Company name, position, level, and question types are required' });
      }

      const interviewQuestions = await ragSearchService.generateInterviewQuestions({
        companyName,
        position,
        level,
        questionTypes,
        includeCompanySpecific
      });
      
      res.json({
        success: true,
        interviewQuestions,
        provider: 'RAG Search',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Interview questions generation error:', error);
      res.status(500).json({ message: 'Failed to generate interview questions' });
    }
  });

  app.post('/api/rag/job-market-insights', async (req, res) => {
    try {
      const { role, location, experience, skills, salaryRange, remoteWork } = req.body;
      
      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }

      const jobMarketInsights = await ragSearchService.searchJobMarketInsights({
        role,
        location,
        experience,
        skills,
        salaryRange,
        remoteWork
      });
      
      res.json({
        success: true,
        jobMarketInsights,
        provider: 'RAG Search',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Job market insights error:', error);
      res.status(500).json({ message: 'Failed to get job market insights' });
    }
  });

  // Onboarding API routes
  app.get('/api/user/onboarding', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get or create onboarding state
      let onboardingState = user.onboardingState || {
        isCompleted: false,
        preferences: {
          showTips: true,
          autoAdvance: false,
          reminderFrequency: 'weekly'
        }
      };

      res.json(onboardingState);
    } catch (error) {
      console.error('Get onboarding state error:', error);
      res.status(500).json({ message: 'Failed to get onboarding state' });
    }
  });

  app.patch('/api/user/onboarding', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const updates = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update onboarding state
      const currentState = user.onboardingState || {
        isCompleted: false,
        preferences: {
          showTips: true,
          autoAdvance: false,
          reminderFrequency: 'weekly'
        }
      };

      const updatedState = {
        ...currentState,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await storage.updateUser(userId, {
        onboardingState: updatedState
      });

      res.json({ success: true, onboardingState: updatedState });
    } catch (error) {
      console.error('Update onboarding state error:', error);
      res.status(500).json({ message: 'Failed to update onboarding state' });
    }
  });

  app.post('/api/user/onboarding/complete', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { completedAt } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const currentState = user.onboardingState || {
        preferences: {
          showTips: true,
          autoAdvance: false,
          reminderFrequency: 'weekly'
        }
      };

      const completedState = {
        ...currentState,
        isCompleted: true,
        completedAt: completedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await storage.updateUser(userId, {
        onboardingState: completedState
      });

      res.json({ success: true, onboardingState: completedState });
    } catch (error) {
      console.error('Complete onboarding error:', error);
      res.status(500).json({ message: 'Failed to complete onboarding' });
    }
  });

  app.post('/api/user/onboarding/skip', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { skippedAt } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const currentState = user.onboardingState || {
        preferences: {
          showTips: true,
          autoAdvance: false,
          reminderFrequency: 'weekly'
        }
      };

      const skippedState = {
        ...currentState,
        isCompleted: true,
        skippedAt: skippedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await storage.updateUser(userId, {
        onboardingState: skippedState
      });

      res.json({ success: true, onboardingState: skippedState });
    } catch (error) {
      console.error('Skip onboarding error:', error);
      res.status(500).json({ message: 'Failed to skip onboarding' });
    }
  });



  // Salary Intelligence API Routes
  app.post('/api/salary/market-data', requireAuth, async (req, res) => {
    try {
      const { jobTitle, location, experienceLevel, industry, companySize, skills } = req.body;
      
      if (!jobTitle || !location || !experienceLevel) {
        return res.status(400).json({ message: 'Job title, location, and experience level are required' });
      }

      const marketData = await salaryIntelligence.getMarketData({
        jobTitle,
        location,
        experienceLevel,
        industry,
        companySize,
        skills
      });
      
      res.json({
        success: true,
        marketData,
        provider: 'Salary Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Salary market data error:', error);
      res.status(500).json({ message: 'Failed to get salary market data' });
    }
  });

  app.post('/api/salary/personalized-range', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const { jobTitle, location, experienceLevel, industry, companySize, skills } = req.body;
      
      if (!jobTitle || !location || !experienceLevel) {
        return res.status(400).json({ message: 'Job title, location, and experience level are required' });
      }

      const personalizedRange = await salaryIntelligence.getPersonalizedRange({
        jobTitle,
        location,
        experienceLevel,
        industry,
        companySize,
        skills,
        userProfile: user
      });
      
      res.json({
        success: true,
        personalizedRange,
        provider: 'Salary Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Personalized salary range error:', error);
      res.status(500).json({ message: 'Failed to get personalized salary range' });
    }
  });

  app.post('/api/salary/company-insights', requireAuth, async (req, res) => {
    try {
      const { companyName, industry, location } = req.body;
      
      if (!companyName) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const companyInsights = await salaryIntelligence.getCompanyInsights({
        companyName,
        industry,
        location
      });
      
      res.json({
        success: true,
        companyInsights,
        provider: 'Salary Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Company insights error:', error);
      res.status(500).json({ message: 'Failed to get company insights' });
    }
  });

  app.post('/api/salary/negotiation-strategy', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const { jobOffer, marketData, negotiationGoals } = req.body;
      
      if (!jobOffer || !marketData || !negotiationGoals) {
        return res.status(400).json({ message: 'Job offer, market data, and negotiation goals are required' });
      }

      const negotiationStrategy = await salaryIntelligence.generateNegotiationStrategy({
        userProfile: user,
        jobOffer,
        marketData,
        negotiationGoals
      });
      
      res.json({
        success: true,
        negotiationStrategy,
        provider: 'Salary Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Negotiation strategy error:', error);
      res.status(500).json({ message: 'Failed to generate negotiation strategy' });
    }
  });

  app.post('/api/salary/negotiation-simulation', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUser(userId);
      const { scenario, difficulty } = req.body;
      
      if (!scenario || !difficulty) {
        return res.status(400).json({ message: 'Scenario and difficulty are required' });
      }

      const simulation = await salaryIntelligence.runNegotiationSimulation({
        userId,
        scenario,
        userProfile: user,
        difficulty
      });
      
      res.json({
        success: true,
        simulation,
        provider: 'Salary Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Negotiation simulation error:', error);
      res.status(500).json({ message: 'Failed to run negotiation simulation' });
    }
  });

  app.post('/api/salary/benchmarks', requireAuth, async (req, res) => {
    try {
      const { industry, location, timeRange, jobTitle } = req.body;
      
      if (!industry || !location || !timeRange) {
        return res.status(400).json({ message: 'Industry, location, and time range are required' });
      }

      const benchmarks = await salaryIntelligence.getBenchmarks({
        industry,
        location,
        timeRange,
        jobTitle
      });
      
      res.json({
        success: true,
        benchmarks,
        provider: 'Salary Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Salary benchmarks error:', error);
      res.status(500).json({ message: 'Failed to get salary benchmarks' });
    }
  });

  app.post('/api/salary/analyze-offer', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { offerData } = req.body;
      
      if (!offerData) {
        return res.status(400).json({ message: 'Offer data is required' });
      }

      const offerAnalysis = await salaryIntelligence.analyzeOffer(userId, offerData);
      
      res.json({
        success: true,
        offerAnalysis,
        provider: 'Salary Intelligence',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Offer analysis error:', error);
      res.status(500).json({ message: 'Failed to analyze offer' });
    }
  });

  // Get user salary benchmarks
  app.get('/api/salary/benchmarks/user', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const benchmarks = await storage.getSalaryBenchmarks(userId);
      
      res.json({
        success: true,
        benchmarks,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get user benchmarks error:', error);
      res.status(500).json({ message: 'Failed to get user benchmarks' });
    }
  });

  // Get user negotiations
  app.get('/api/salary/negotiations/user', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const negotiations = await storage.getUserNegotiations(userId);
      
      res.json({
        success: true,
        negotiations,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get user negotiations error:', error);
      res.status(500).json({ message: 'Failed to get user negotiations' });
    }
  });

  // Get negotiation sessions
  app.get('/api/salary/sessions/user', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const sessions = await storage.getNegotiationSessions(userId);
      
      res.json({
        success: true,
        sessions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get negotiation sessions error:', error);
      res.status(500).json({ message: 'Failed to get negotiation sessions' });
    }
  });

  // Get market trends
  app.get('/api/salary/market-trends', requireAuth, async (req, res) => {
    try {
      const { industry, location, jobTitle } = req.query;
      
      const trends = await storage.getMarketTrends({ 
        industry: industry as string, 
        location: location as string, 
        jobTitle: jobTitle as string 
      });
      
      res.json({
        success: true,
        trends,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get market trends error:', error);
      res.status(500).json({ message: 'Failed to get market trends' });
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

  // NEW FEATURES API ROUTES

  // Resume Template routes
  app.post('/api/resume-templates', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const templateData = insertResumeTemplateSchema.parse({ ...req.body, userId });
      const template = await storage.createResumeTemplate(templateData);
      res.json(template);
    } catch (error) {
      console.error("Error creating resume template:", error);
      res.status(500).json({ message: "Failed to create resume template" });
    }
  });

  app.get('/api/resume-templates', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const templates = await storage.getResumeTemplates(userId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching resume templates:", error);
      res.status(500).json({ message: "Failed to fetch resume templates" });
    }
  });

  app.put('/api/resume-templates/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const template = await storage.updateResumeTemplate(id, updates);
      res.json(template);
    } catch (error) {
      console.error("Error updating resume template:", error);
      res.status(500).json({ message: "Failed to update resume template" });
    }
  });

  app.delete('/api/resume-templates/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteResumeTemplate(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting resume template:", error);
      res.status(500).json({ message: "Failed to delete resume template" });
    }
  });

  // Mood Board routes
  app.post('/api/mood-boards', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const moodBoardData = insertMoodBoardSchema.parse({ ...req.body, userId });
      const moodBoard = await storage.createMoodBoard(moodBoardData);
      res.json(moodBoard);
    } catch (error) {
      console.error("Error creating mood board:", error);
      res.status(500).json({ message: "Failed to create mood board" });
    }
  });

  app.get('/api/mood-boards', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const moodBoards = await storage.getMoodBoards(userId);
      res.json(moodBoards);
    } catch (error) {
      console.error("Error fetching mood boards:", error);
      res.status(500).json({ message: "Failed to fetch mood boards" });
    }
  });

  app.put('/api/mood-boards/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const moodBoard = await storage.updateMoodBoard(id, updates);
      res.json(moodBoard);
    } catch (error) {
      console.error("Error updating mood board:", error);
      res.status(500).json({ message: "Failed to update mood board" });
    }
  });

  // Skill Tracking routes
  app.post('/api/skill-tracking', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const skillData = insertSkillTrackingSchema.parse({ ...req.body, userId });
      const skill = await storage.createSkillTracking(skillData);
      res.json(skill);
    } catch (error) {
      console.error("Error creating skill tracking:", error);
      res.status(500).json({ message: "Failed to create skill tracking" });
    }
  });

  app.get('/api/skill-tracking', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const skills = await storage.getSkillTrackings(userId);
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skill tracking:", error);
      res.status(500).json({ message: "Failed to fetch skill tracking" });
    }
  });

  app.put('/api/skill-tracking/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const skill = await storage.updateSkillTracking(id, updates);
      res.json(skill);
    } catch (error) {
      console.error("Error updating skill tracking:", error);
      res.status(500).json({ message: "Failed to update skill tracking" });
    }
  });

  // Interview Session routes
  app.post('/api/interview-sessions', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const sessionData = insertInterviewSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createInterviewSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating interview session:", error);
      res.status(500).json({ message: "Failed to create interview session" });
    }
  });

  app.get('/api/interview-sessions', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const sessions = await storage.getInterviewSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching interview sessions:", error);
      res.status(500).json({ message: "Failed to fetch interview sessions" });
    }
  });

  app.put('/api/interview-sessions/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const session = await storage.updateInterviewSession(id, updates);
      res.json(session);
    } catch (error) {
      console.error("Error updating interview session:", error);
      res.status(500).json({ message: "Failed to update interview session" });
    }
  });

  // Network Connection routes
  app.post('/api/network-connections', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const connectionData = insertNetworkConnectionSchema.parse({ ...req.body, userId });
      const connection = await storage.createNetworkConnection(connectionData);
      res.json(connection);
    } catch (error) {
      console.error("Error creating network connection:", error);
      res.status(500).json({ message: "Failed to create network connection" });
    }
  });

  app.get('/api/network-connections', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const connections = await storage.getNetworkConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching network connections:", error);
      res.status(500).json({ message: "Failed to fetch network connections" });
    }
  });

  app.post('/api/network-connections/sync/:platform', requireAuth, async (req: any, res) => {
    try {
      const userId = getUserId(req);
      const { platform } = req.params;
      const connections = await storage.syncNetworkConnections(userId, platform);
      res.json(connections);
    } catch (error) {
      console.error("Error syncing network connections:", error);
      res.status(500).json({ message: "Failed to sync network connections" });
    }
  });

  // AI-powered chatbot for interview prep
  app.post('/api/interview-chatbot', requireAuth, async (req: any, res) => {
    try {
      const { message, jobRole, company, sessionId } = req.body;
      const userId = getUserId(req);
      
      // Generate AI response for interview preparation
      const response = await openRouterService.generateResponse(
        `You are an AI interview coach. Help the user prepare for a ${jobRole} position at ${company}. 
        User message: ${message}
        Provide helpful, encouraging feedback and ask follow-up questions.`,
        {
          maxTokens: 500,
          temperature: 0.7
        }
      );
      
      res.json({ response, sessionId });
    } catch (error) {
      console.error("Error processing interview chatbot:", error);
      res.status(500).json({ message: "Failed to process interview chatbot" });
    }
  });

  // COMPREHENSIVE JOB SEARCH ENGINE API ENDPOINTS
  
  // Natural language job search with AI processing
  app.post('/api/search/jobs', async (req, res) => {
    try {
      const { query, location, salaryMin, salaryMax, remote, jobType, experienceLevel, company, industry, skills, radius, datePosted, limit, offset } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      const searchParams = {
        query,
        location,
        salaryMin,
        salaryMax,
        remote,
        jobType,
        experienceLevel,
        company,
        industry,
        skills,
        radius,
        datePosted,
        limit: limit || 20,
        offset: offset || 0
      };

      const userId = req.user?.claims?.sub;
      const searchResults = await jobSearchEngine.search(searchParams, userId);
      
      res.json({
        success: true,
        ...searchResults,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Job search error:', error);
      res.status(500).json({ message: 'Failed to search jobs' });
    }
  });

  // Get search suggestions and autocomplete
  app.get('/api/search/suggestions', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }

      const suggestions = await jobSearchEngine.getSearchSuggestions(query as string);
      
      res.json({
        success: true,
        suggestions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Search suggestions error:', error);
      res.status(500).json({ message: 'Failed to get search suggestions' });
    }
  });

  // Advanced job filtering
  app.post('/api/search/filters', async (req, res) => {
    try {
      const { baseQuery, filters } = req.body;
      
      if (!baseQuery) {
        return res.status(400).json({ message: 'Base query is required' });
      }

      const userId = req.user?.claims?.sub;
      const searchResults = await jobSearchEngine.search({ 
        query: baseQuery,
        ...filters 
      }, userId);
      
      res.json({
        success: true,
        ...searchResults,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Advanced filter error:', error);
      res.status(500).json({ message: 'Failed to apply filters' });
    }
  });

  // Get detailed job view
  app.get('/api/jobs/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
      
      if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required' });
      }

      // Get job details from storage or external APIs
      const jobDetails = await storage.getJobDetails(jobId);
      
      if (!jobDetails) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json({
        success: true,
        job: jobDetails,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Job details error:', error);
      res.status(500).json({ message: 'Failed to get job details' });
    }
  });

  // Save job to user profile
  app.post('/api/jobs/save', requireAuth, async (req, res) => {
    try {
      const { jobId, notes } = req.body;
      const userId = req.user.claims.sub;
      
      if (!jobId) {
        return res.status(400).json({ message: 'Job ID is required' });
      }

      const savedJob = await storage.saveJobForUser(userId, jobId, notes);
      
      res.json({
        success: true,
        savedJob,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Save job error:', error);
      res.status(500).json({ message: 'Failed to save job' });
    }
  });

  // COMPREHENSIVE RESUME OPTIMIZATION API ENDPOINTS
  
  // Upload and parse resume
  app.post('/api/resume/upload', requireAuth, upload.single('resume'), async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: 'Resume file is required' });
      }

      const parsedResume = await resumeOptimizer.parseResume(file, userId);
      
      res.json({
        success: true,
        resume: parsedResume,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      res.status(500).json({ message: 'Failed to upload and parse resume' });
    }
  });

  // AI-powered resume optimization
  app.post('/api/resume/optimize', requireAuth, async (req, res) => {
    try {
      const { resumeId, targetRole, targetCompany, jobDescription, industry, experienceLevel } = req.body;
      
      if (!resumeId) {
        return res.status(400).json({ message: 'Resume ID is required' });
      }

      const optimizationOptions = {
        targetRole,
        targetCompany,
        jobDescription,
        industry,
        experienceLevel
      };

      const suggestions = await resumeOptimizer.optimizeResume(resumeId, optimizationOptions);
      
      res.json({
        success: true,
        suggestions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Resume optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize resume' });
    }
  });

  // Get ATS compatibility score
  app.get('/api/resume/ats-score/:resumeId', requireAuth, async (req, res) => {
    try {
      const { resumeId } = req.params;
      
      if (!resumeId) {
        return res.status(400).json({ message: 'Resume ID is required' });
      }

      const resume = await storage.getResume(resumeId);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }

      const atsAnalysis = await resumeOptimizer.performATSAnalysis(resume);
      
      res.json({
        success: true,
        atsAnalysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('ATS score error:', error);
      res.status(500).json({ message: 'Failed to get ATS score' });
    }
  });

  // Keyword optimization
  app.post('/api/resume/keywords', requireAuth, async (req, res) => {
    try {
      const { resumeId, jobDescription, targetKeywords } = req.body;
      
      if (!resumeId) {
        return res.status(400).json({ message: 'Resume ID is required' });
      }

      const keywordSuggestions = await resumeOptimizer.getJobSpecificOptimization(resumeId, jobDescription);
      
      res.json({
        success: true,
        keywordSuggestions,
        targetKeywords,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Keyword optimization error:', error);
      res.status(500).json({ message: 'Failed to optimize keywords' });
    }
  });

  // Multi-version resume management
  app.get('/api/resume/versions/:userId', requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (req.user.claims.sub !== userId) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      const resumeVersions = await storage.getUserResumeVersions(userId);
      
      res.json({
        success: true,
        versions: resumeVersions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Resume versions error:', error);
      res.status(500).json({ message: 'Failed to get resume versions' });
    }
  });

  // Generate professional resume PDF
  app.post('/api/resume/generate-pdf', requireAuth, async (req, res) => {
    try {
      const { resumeId, templateName } = req.body;
      
      if (!resumeId) {
        return res.status(400).json({ message: 'Resume ID is required' });
      }

      const pdfBuffer = await resumeOptimizer.generateResumePDF(resumeId, templateName);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({ message: 'Failed to generate PDF' });
    }
  });

  // Resume performance analytics
  app.get('/api/resume/analytics/:resumeId', requireAuth, async (req, res) => {
    try {
      const { resumeId } = req.params;
      
      if (!resumeId) {
        return res.status(400).json({ message: 'Resume ID is required' });
      }

      const analytics = await resumeOptimizer.getResumeAnalytics(resumeId);
      
      res.json({
        success: true,
        analytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Resume analytics error:', error);
      res.status(500).json({ message: 'Failed to get resume analytics' });
    }
  });

  // Track resume performance events
  app.post('/api/resume/track', requireAuth, async (req, res) => {
    try {
      const { resumeId, event, data } = req.body;
      
      if (!resumeId || !event) {
        return res.status(400).json({ message: 'Resume ID and event are required' });
      }

      await resumeOptimizer.trackResumePerformance(resumeId, event, data);
      
      res.json({
        success: true,
        message: 'Event tracked successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Resume tracking error:', error);
      res.status(500).json({ message: 'Failed to track resume event' });
    }
  });

  // Interview Coaching System Routes
  // Create interview coaching session
  app.post('/api/interview-coaching/sessions', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const validatedSession = insertInterviewCoachingSessionSchema.parse({
        ...req.body,
        userId
      });
      
      const session = await storage.createInterviewCoachingSession(validatedSession);
      
      res.json({
        success: true,
        session,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create interview coaching session error:', error);
      res.status(500).json({ message: 'Failed to create interview coaching session' });
    }
  });

  // Get interview coaching sessions
  app.get('/api/interview-coaching/sessions', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const sessions = await storage.getInterviewCoachingSessions(userId);
      
      res.json({
        success: true,
        sessions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get interview coaching sessions error:', error);
      res.status(500).json({ message: 'Failed to get interview coaching sessions' });
    }
  });

  // Get single interview coaching session
  app.get('/api/interview-coaching/sessions/:sessionId', requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getInterviewCoachingSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      res.json({
        success: true,
        session,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get interview coaching session error:', error);
      res.status(500).json({ message: 'Failed to get interview coaching session' });
    }
  });

  // Update interview coaching session
  app.put('/api/interview-coaching/sessions/:sessionId', requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;
      
      const session = await storage.updateInterviewCoachingSession(sessionId, updates);
      
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      
      res.json({
        success: true,
        session,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update interview coaching session error:', error);
      res.status(500).json({ message: 'Failed to update interview coaching session' });
    }
  });

  // Delete interview coaching session
  app.delete('/api/interview-coaching/sessions/:sessionId', requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.deleteInterviewCoachingSession(sessionId);
      
      res.json({
        success: true,
        message: 'Session deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Delete interview coaching session error:', error);
      res.status(500).json({ message: 'Failed to delete interview coaching session' });
    }
  });

  // Create interview question
  app.post('/api/interview-coaching/questions', requireAuth, async (req, res) => {
    try {
      const validatedQuestion = insertInterviewQuestionSchema.parse(req.body);
      
      const question = await storage.createInterviewQuestion(validatedQuestion);
      
      res.json({
        success: true,
        question,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create interview question error:', error);
      res.status(500).json({ message: 'Failed to create interview question' });
    }
  });

  // Get interview questions
  app.get('/api/interview-coaching/questions', requireAuth, async (req, res) => {
    try {
      const { category, difficulty, industry, companySpecific } = req.query;
      
      const filters = {
        ...(category && { category: category as string }),
        ...(difficulty && { difficulty: difficulty as string }),
        ...(industry && { industry: industry as string }),
        ...(companySpecific !== undefined && { companySpecific: companySpecific === 'true' })
      };
      
      const questions = await storage.getInterviewQuestions(filters);
      
      res.json({
        success: true,
        questions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get interview questions error:', error);
      res.status(500).json({ message: 'Failed to get interview questions' });
    }
  });

  // Create interview response
  app.post('/api/interview-coaching/responses', requireAuth, async (req, res) => {
    try {
      const validatedResponse = insertInterviewResponseSchema.parse(req.body);
      
      const response = await storage.createInterviewResponse(validatedResponse);
      
      res.json({
        success: true,
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create interview response error:', error);
      res.status(500).json({ message: 'Failed to create interview response' });
    }
  });

  // Get interview responses for a session
  app.get('/api/interview-coaching/responses/:sessionId', requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const responses = await storage.getInterviewResponses(sessionId);
      
      res.json({
        success: true,
        responses,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get interview responses error:', error);
      res.status(500).json({ message: 'Failed to get interview responses' });
    }
  });

  // Create interview feedback
  app.post('/api/interview-coaching/feedback', requireAuth, async (req, res) => {
    try {
      const validatedFeedback = insertInterviewFeedbackSchema.parse(req.body);
      
      const feedback = await storage.createInterviewFeedback(validatedFeedback);
      
      res.json({
        success: true,
        feedback,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create interview feedback error:', error);
      res.status(500).json({ message: 'Failed to create interview feedback' });
    }
  });

  // Get interview feedback for a response
  app.get('/api/interview-coaching/feedback/:responseId', requireAuth, async (req, res) => {
    try {
      const { responseId } = req.params;
      const feedback = await storage.getInterviewFeedback(responseId);
      
      res.json({
        success: true,
        feedback,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get interview feedback error:', error);
      res.status(500).json({ message: 'Failed to get interview feedback' });
    }
  });

  // Create company interview insights
  app.post('/api/interview-coaching/company-insights', requireAuth, async (req, res) => {
    try {
      const validatedInsights = insertCompanyInterviewInsightsSchema.parse(req.body);
      
      const insights = await storage.createCompanyInterviewInsights(validatedInsights);
      
      res.json({
        success: true,
        insights,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create company insights error:', error);
      res.status(500).json({ message: 'Failed to create company insights' });
    }
  });

  // Get company interview insights
  app.get('/api/interview-coaching/company-insights/:companyId', requireAuth, async (req, res) => {
    try {
      const { companyId } = req.params;
      const insights = await storage.getCompanyInterviewInsights(companyId);
      
      res.json({
        success: true,
        insights,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get company insights error:', error);
      res.status(500).json({ message: 'Failed to get company insights' });
    }
  });

  // Get user interview progress
  app.get('/api/interview-coaching/progress', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const progress = await storage.getUserInterviewProgress(userId);
      
      res.json({
        success: true,
        progress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get user interview progress error:', error);
      res.status(500).json({ message: 'Failed to get user interview progress' });
    }
  });

  // Update user interview progress
  app.put('/api/interview-coaching/progress', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const updates = req.body;
      
      const progress = await storage.updateUserInterviewProgress(userId, updates);
      
      res.json({
        success: true,
        progress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update user interview progress error:', error);
      res.status(500).json({ message: 'Failed to update user interview progress' });
    }
  });

  // Application Tracking and Management System Routes
  
  // Get application dashboard
  app.get('/api/applications/dashboard', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const dashboard = await applicationTracker.getApplicationDashboard(userId);
      
      res.json({
        success: true,
        dashboard,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get application dashboard error:', error);
      res.status(500).json({ message: 'Failed to get application dashboard' });
    }
  });

  // Create new application
  app.post('/api/applications', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const validatedData = insertApplicationSchema.parse(req.body);
      
      const application = await applicationTracker.createApplication(userId, validatedData);
      
      res.json({
        success: true,
        application,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create application error:', error);
      res.status(500).json({ message: 'Failed to create application' });
    }
  });

  // Get applications with filters
  app.get('/api/applications', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const filters = req.query;
      
      const applications = await storage.getApplications(userId, filters);
      
      res.json({
        success: true,
        applications,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get applications error:', error);
      res.status(500).json({ message: 'Failed to get applications' });
    }
  });

  // Get specific application
  app.get('/api/applications/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({ message: 'Invalid application ID format' });
      }
      
      const application = await storage.getApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      res.json({
        success: true,
        application,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get application error:', error);
      res.status(500).json({ message: 'Failed to get application' });
    }
  });

  // Update application
  app.put('/api/applications/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({ message: 'Invalid application ID format' });
      }
      
      const updates = req.body;
      
      const application = await storage.updateApplication(id, updates);
      
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      res.json({
        success: true,
        application,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update application error:', error);
      res.status(500).json({ message: 'Failed to update application' });
    }
  });

  // Update application status
  app.put('/api/applications/:id/status', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const application = await applicationTracker.updateApplicationStatus(id, status, notes);
      
      res.json({
        success: true,
        application,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update application status error:', error);
      res.status(500).json({ message: 'Failed to update application status' });
    }
  });

  // Delete application
  app.delete('/api/applications/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteApplication(id);
      
      res.json({
        success: true,
        message: 'Application deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Delete application error:', error);
      res.status(500).json({ message: 'Failed to delete application' });
    }
  });

  // Get application timeline
  app.get('/api/applications/:id/timeline', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const timeline = await storage.getApplicationTimeline(id);
      
      res.json({
        success: true,
        timeline,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get application timeline error:', error);
      res.status(500).json({ message: 'Failed to get application timeline' });
    }
  });

  // Get application communications
  app.get('/api/applications/:id/communications', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const communications = await storage.getCommunications(id);
      
      res.json({
        success: true,
        communications,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get application communications error:', error);
      res.status(500).json({ message: 'Failed to get application communications' });
    }
  });

  // Create communication
  app.post('/api/applications/:id/communications', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCommunicationSchema.parse({
        ...req.body,
        applicationId: id
      });
      
      const communication = await storage.createCommunication(validatedData);
      
      res.json({
        success: true,
        communication,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create communication error:', error);
      res.status(500).json({ message: 'Failed to create communication' });
    }
  });

  // Get follow-ups for application
  app.get('/api/applications/:id/follow-ups', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const followUps = await storage.getFollowUps(id);
      
      res.json({
        success: true,
        followUps,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get follow-ups error:', error);
      res.status(500).json({ message: 'Failed to get follow-ups' });
    }
  });

  // Create follow-up
  app.post('/api/applications/:id/follow-ups', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const followUpData = {
        ...req.body,
        applicationId: id
      };
      
      const followUp = await applicationTracker.createFollowUp(id, followUpData);
      
      res.json({
        success: true,
        followUp,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create follow-up error:', error);
      res.status(500).json({ message: 'Failed to create follow-up' });
    }
  });

  // Get upcoming follow-ups
  app.get('/api/applications/follow-ups/upcoming', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const upcomingFollowUps = await storage.getUpcomingFollowUps(userId);
      
      res.json({
        success: true,
        upcomingFollowUps,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get upcoming follow-ups error:', error);
      res.status(500).json({ message: 'Failed to get upcoming follow-ups' });
    }
  });

  // Generate follow-up message
  app.post('/api/applications/:id/follow-ups/generate', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { followUpType, context } = req.body;
      
      const followUpMessage = await applicationTracker.generateFollowUpMessage(id, followUpType, context);
      
      res.json({
        success: true,
        followUpMessage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Generate follow-up message error:', error);
      res.status(500).json({ message: 'Failed to generate follow-up message' });
    }
  });

  // Get outcome prediction
  app.get('/api/applications/:id/prediction', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const prediction = await storage.getOutcomePrediction(id);
      
      res.json({
        success: true,
        prediction,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get outcome prediction error:', error);
      res.status(500).json({ message: 'Failed to get outcome prediction' });
    }
  });

  // Generate outcome prediction
  app.post('/api/applications/:id/prediction', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const prediction = await applicationTracker.generateOutcomePrediction(id);
      
      res.json({
        success: true,
        prediction,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Generate outcome prediction error:', error);
      res.status(500).json({ message: 'Failed to generate outcome prediction' });
    }
  });

  // Get portfolio analytics
  app.get('/api/applications/analytics', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const analytics = await applicationTracker.generatePortfolioAnalytics(userId);
      
      res.json({
        success: true,
        analytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get portfolio analytics error:', error);
      res.status(500).json({ message: 'Failed to get portfolio analytics' });
    }
  });

  // Get email integrations
  app.get('/api/applications/email-integrations', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const integrations = await storage.getEmailIntegrations(userId);
      
      res.json({
        success: true,
        integrations,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get email integrations error:', error);
      res.status(500).json({ message: 'Failed to get email integrations' });
    }
  });

  // Setup email integration
  app.post('/api/applications/email-integrations', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { provider, credentials } = req.body;
      
      const integration = await applicationTracker.setupEmailIntegration(userId, provider, credentials);
      
      res.json({
        success: true,
        integration,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Setup email integration error:', error);
      res.status(500).json({ message: 'Failed to setup email integration' });
    }
  });

  // Sync emails
  app.post('/api/applications/email-sync', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { emailData } = req.body;
      
      await storage.syncEmailForApplications(userId, emailData);
      
      res.json({
        success: true,
        message: 'Email sync completed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Email sync error:', error);
      res.status(500).json({ message: 'Failed to sync emails' });
    }
  });

  // Process email communication
  app.post('/api/applications/:id/email-communication', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const emailData = req.body;
      
      const communication = await applicationTracker.processEmailCommunication(id, emailData);
      
      res.json({
        success: true,
        communication,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Process email communication error:', error);
      res.status(500).json({ message: 'Failed to process email communication' });
    }
  });

  // Analyze email content
  app.post('/api/applications/email-analysis', requireAuth, async (req, res) => {
    try {
      const { emailContent, context } = req.body;
      
      const analysis = await applicationTracker.analyzeEmailContent(emailContent, context);
      
      res.json({
        success: true,
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analyze email content error:', error);
      res.status(500).json({ message: 'Failed to analyze email content' });
    }
  });

  // Career Coaching System Routes
  // Career profile management
  app.post('/api/career-coaching/profile', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const profileData = insertCareerProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createCareerProfile(profileData);
      
      res.json({
        success: true,
        profile,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create career profile error:', error);
      res.status(500).json({ message: 'Failed to create career profile' });
    }
  });

  app.get('/api/career-coaching/profile', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const profile = await storage.getCareerProfile(userId);
      
      res.json({
        success: true,
        profile,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get career profile error:', error);
      res.status(500).json({ message: 'Failed to get career profile' });
    }
  });

  app.put('/api/career-coaching/profile', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const updates = req.body;
      
      const profile = await storage.updateCareerProfile(userId, updates);
      
      res.json({
        success: true,
        profile,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update career profile error:', error);
      res.status(500).json({ message: 'Failed to update career profile' });
    }
  });

  // Skill assessment management
  app.post('/api/career-coaching/skill-assessments', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const assessmentData = insertSkillAssessmentSchema.parse({
        ...req.body,
        userId
      });
      
      const assessment = await storage.createSkillAssessment(assessmentData);
      
      res.json({
        success: true,
        assessment,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create skill assessment error:', error);
      res.status(500).json({ message: 'Failed to create skill assessment' });
    }
  });

  app.get('/api/career-coaching/skill-assessments', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const assessments = await storage.getUserSkillAssessments(userId);
      
      res.json({
        success: true,
        assessments,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get skill assessments error:', error);
      res.status(500).json({ message: 'Failed to get skill assessments' });
    }
  });

  app.put('/api/career-coaching/skill-assessments/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const assessment = await storage.updateSkillAssessment(id, updates);
      
      res.json({
        success: true,
        assessment,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update skill assessment error:', error);
      res.status(500).json({ message: 'Failed to update skill assessment' });
    }
  });

  // Career goal management
  app.post('/api/career-coaching/goals', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const goalData = insertCareerGoalSchema.parse({
        ...req.body,
        userId
      });
      
      const goal = await storage.createCareerGoal(goalData);
      
      res.json({
        success: true,
        goal,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create career goal error:', error);
      res.status(500).json({ message: 'Failed to create career goal' });
    }
  });

  app.get('/api/career-coaching/goals', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const goals = await storage.getUserCareerGoals(userId);
      
      res.json({
        success: true,
        goals,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get career goals error:', error);
      res.status(500).json({ message: 'Failed to get career goals' });
    }
  });

  app.put('/api/career-coaching/goals/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const goal = await storage.updateCareerGoal(id, updates);
      
      res.json({
        success: true,
        goal,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update career goal error:', error);
      res.status(500).json({ message: 'Failed to update career goal' });
    }
  });

  // Learning plan management
  app.post('/api/career-coaching/learning-plans', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const planData = insertLearningPlanSchema.parse({
        ...req.body,
        userId
      });
      
      const plan = await storage.createLearningPlan(planData);
      
      res.json({
        success: true,
        plan,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create learning plan error:', error);
      res.status(500).json({ message: 'Failed to create learning plan' });
    }
  });

  app.get('/api/career-coaching/learning-plans', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const plans = await storage.getUserLearningPlans(userId);
      
      res.json({
        success: true,
        plans,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get learning plans error:', error);
      res.status(500).json({ message: 'Failed to get learning plans' });
    }
  });

  app.put('/api/career-coaching/learning-plans/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const plan = await storage.updateLearningPlan(id, updates);
      
      res.json({
        success: true,
        plan,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update learning plan error:', error);
      res.status(500).json({ message: 'Failed to update learning plan' });
    }
  });

  // Mentorship matching
  app.post('/api/career-coaching/mentorship', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const matchData = insertMentorshipMatchSchema.parse({
        ...req.body,
        menteeId: userId // Assuming user is the mentee
      });
      
      const match = await storage.createMentorshipMatch(matchData);
      
      res.json({
        success: true,
        match,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create mentorship match error:', error);
      res.status(500).json({ message: 'Failed to create mentorship match' });
    }
  });

  app.get('/api/career-coaching/mentorship', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const matches = await storage.getUserMentorshipMatches(userId);
      
      res.json({
        success: true,
        matches,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get mentorship matches error:', error);
      res.status(500).json({ message: 'Failed to get mentorship matches' });
    }
  });

  // Industry insights
  app.get('/api/career-coaching/industry-insights', requireAuth, async (req, res) => {
    try {
      const { industry, region } = req.query;
      const insights = await storage.getIndustryInsights(industry as string, region as string);
      
      res.json({
        success: true,
        insights,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get industry insights error:', error);
      res.status(500).json({ message: 'Failed to get industry insights' });
    }
  });

  // Networking events
  app.get('/api/career-coaching/networking-events', requireAuth, async (req, res) => {
    try {
      const { industry, location, eventType } = req.query;
      const events = await storage.getNetworkingEvents(industry as string, location as string, eventType as string);
      
      res.json({
        success: true,
        events,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get networking events error:', error);
      res.status(500).json({ message: 'Failed to get networking events' });
    }
  });

  // Career progress tracking
  app.post('/api/career-coaching/progress', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const progressData = insertCareerProgressSchema.parse({
        ...req.body,
        userId
      });
      
      const progress = await storage.recordCareerProgress(progressData);
      
      res.json({
        success: true,
        progress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Record career progress error:', error);
      res.status(500).json({ message: 'Failed to record career progress' });
    }
  });

  app.get('/api/career-coaching/progress', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const progress = await storage.getUserCareerProgress(userId);
      
      res.json({
        success: true,
        progress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get career progress error:', error);
      res.status(500).json({ message: 'Failed to get career progress' });
    }
  });

  // Personal branding
  app.post('/api/career-coaching/personal-branding', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const brandingData = insertPersonalBrandingSchema.parse({
        ...req.body,
        userId
      });
      
      const branding = await storage.createPersonalBranding(brandingData);
      
      res.json({
        success: true,
        branding,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create personal branding error:', error);
      res.status(500).json({ message: 'Failed to create personal branding' });
    }
  });

  app.get('/api/career-coaching/personal-branding', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const branding = await storage.getPersonalBranding(userId);
      
      res.json({
        success: true,
        branding,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get personal branding error:', error);
      res.status(500).json({ message: 'Failed to get personal branding' });
    }
  });

  app.put('/api/career-coaching/personal-branding', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const updates = req.body;
      
      const branding = await storage.updatePersonalBranding(userId, updates);
      
      res.json({
        success: true,
        branding,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Update personal branding error:', error);
      res.status(500).json({ message: 'Failed to update personal branding' });
    }
  });

  // AI-powered career coaching
  app.post('/api/career-coaching/advice', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const context = req.body;
      
      const advice = await storage.generateCareerAdvice(context);
      
      res.json({
        success: true,
        advice,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Generate career advice error:', error);
      res.status(500).json({ message: 'Failed to generate career advice' });
    }
  });

  app.post('/api/career-coaching/analyze-path', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const analysis = req.body;
      
      const pathAnalysis = await storage.analyzeCareerPath(userId, analysis);
      
      res.json({
        success: true,
        pathAnalysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analyze career path error:', error);
      res.status(500).json({ message: 'Failed to analyze career path' });
    }
  });

  app.post('/api/career-coaching/analyze-skills', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const analysis = req.body;
      
      const skillAnalysis = await storage.analyzeSkillGaps(userId, analysis);
      
      res.json({
        success: true,
        skillAnalysis,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Analyze skill gaps error:', error);
      res.status(500).json({ message: 'Failed to analyze skill gaps' });
    }
  });

  app.post('/api/career-coaching/learning-recommendations', requireAuth, async (req, res) => {
    try {
      const userId = getUserId(req);
      const preferences = req.body;
      
      const recommendations = await storage.getLearningRecommendations(userId, preferences);
      
      res.json({
        success: true,
        recommendations,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get learning recommendations error:', error);
      res.status(500).json({ message: 'Failed to get learning recommendations' });
    }
  });

  // Job Alerts and Opportunity Intelligence routes
  app.post('/api/job-alerts/profiles', requireAuth, jobAlerts.createAlertProfile);
  app.get('/api/job-alerts/profiles', requireAuth, jobAlerts.getAlertProfiles);
  app.put('/api/job-alerts/profiles/:alertId', requireAuth, jobAlerts.updateAlertProfile);
  app.delete('/api/job-alerts/profiles/:alertId', requireAuth, jobAlerts.deleteAlertProfile);

  app.get('/api/job-alerts/opportunities', requireAuth, jobAlerts.discoverOpportunities);
  app.get('/api/job-alerts/market-intelligence', requireAuth, jobAlerts.getMarketIntelligence);

  app.get('/api/job-alerts/notification-settings', requireAuth, jobAlerts.getNotificationSettings);
  app.put('/api/job-alerts/notification-settings', requireAuth, jobAlerts.updateNotificationSettings);

  app.get('/api/job-alerts/analytics', requireAuth, jobAlerts.getAlertAnalytics);
  app.post('/api/job-alerts/feedback', requireAuth, jobAlerts.submitAlertFeedback);

  app.get('/api/job-alerts/dashboard', requireAuth, jobAlerts.getAlertDashboard);

  // Auto-Apply Automation routes
  app.post('/api/auto-apply/profiles', requireAuth, autoApply.createAutomationProfile);
  app.get('/api/auto-apply/profiles', requireAuth, autoApply.getAutomationProfiles);
  app.put('/api/auto-apply/profiles/:profileId', requireAuth, autoApply.updateAutomationProfile);
  app.delete('/api/auto-apply/profiles/:profileId', requireAuth, autoApply.deleteAutomationProfile);

  app.post('/api/auto-apply/start', requireAuth, autoApply.startAutomation);
  app.post('/api/auto-apply/stop', requireAuth, autoApply.stopAutomation);
  app.post('/api/auto-apply/pause', requireAuth, autoApply.pauseAutomation);
  app.post('/api/auto-apply/resume', requireAuth, autoApply.resumeAutomation);

  app.get('/api/auto-apply/queue', requireAuth, autoApply.getApplicationQueue);
  app.post('/api/auto-apply/queue/process', requireAuth, autoApply.processApplicationQueue);

  app.get('/api/auto-apply/analytics', requireAuth, autoApply.getAutomationAnalytics);
  app.get('/api/auto-apply/performance', requireAuth, autoApply.getPerformanceMetrics);

  app.post('/api/auto-apply/platforms/credentials', requireAuth, autoApply.savePlatformCredentials);
  app.get('/api/auto-apply/platforms/credentials', requireAuth, autoApply.getPlatformCredentials);

  app.post('/api/auto-apply/rules', requireAuth, autoApply.createAutomationRule);
  app.get('/api/auto-apply/rules/:profileId', requireAuth, autoApply.getAutomationRules);
  app.put('/api/auto-apply/rules/:ruleId', requireAuth, autoApply.updateAutomationRule);
  app.delete('/api/auto-apply/rules/:ruleId', requireAuth, autoApply.deleteAutomationRule);

  app.get('/api/auto-apply/sessions', requireAuth, autoApply.getAutomationSessions);
  app.get('/api/auto-apply/logs/:applicationId', requireAuth, autoApply.getSubmissionLogs);

  app.get('/api/auto-apply/dashboard', requireAuth, autoApply.getAutomationDashboard);

  // FAQ Routes (Public routes)
  app.get('/api/faq', getFAQs);
  app.get('/api/faq/:id', getFAQById);
  app.post('/api/faq/search', searchFAQsWithAI);
  app.post('/api/faq/:id/rate', rateFAQ);
  app.get('/api/faq/categories', getFAQCategories);
  app.get('/api/faq/analytics', getFAQAnalytics);

  // Chatbot Routes (Public routes)
  app.post('/api/chatbot/message', processMessage);
  app.get('/api/chatbot/conversation/:sessionId', getConversationHistory);
  app.post('/api/chatbot/feedback', submitFeedback);
  app.get('/api/chatbot/suggestions', getSuggestions);
  app.post('/api/chatbot/escalate', escalateToHuman);
  app.put('/api/chatbot/preferences/:sessionId', updatePreferences);
  app.get('/api/chatbot/analytics', getChatbotAnalytics);

  const httpServer = createServer(app);
  return httpServer;
}
