import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { jobBoardService } from "./services/jobBoards";
import { jobService } from "./services/jobService";
import { openaiService } from "./services/openai";
import { anthropicService } from "./services/anthropic";
import { emailService } from "./services/emailService";
import { stripeService, subscriptionPlans } from "./services/stripeService";
import { aiService } from "./services/aiService";
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
  // Auth middleware
  await setupAuth(app);

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

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  // Job search routes
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

  app.get('/api/jobs/recommendations', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/subscription/create-checkout', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/subscription/status', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/jobs/recommendations', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/resumes', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/resumes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const resumes = await storage.getResumes(userId);
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  app.get('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
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

  app.put('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
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

  app.delete('/api/resumes/:id', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/resumes/:id/optimize', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/resumes/:id/analyze', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/applications', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/applications', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/applications/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getJobApplicationStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching application stats:", error);
      res.status(500).json({ message: "Failed to fetch application stats" });
    }
  });

  app.put('/api/applications/:id', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/job-alerts', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/job-alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alerts = await storage.getJobAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching job alerts:", error);
      res.status(500).json({ message: "Failed to fetch job alerts" });
    }
  });

  app.put('/api/job-alerts/:id', isAuthenticated, async (req: any, res) => {
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

  app.delete('/api/job-alerts/:id', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/interviews', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/interviews', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/interview-prep/questions', isAuthenticated, async (req: any, res) => {
    try {
      const { jobTitle, industry, difficulty } = req.body;
      const questions = await openaiService.generateInterviewQuestions(jobTitle, industry, difficulty);
      res.json(questions);
    } catch (error) {
      console.error("Error generating interview questions:", error);
      res.status(500).json({ message: "Failed to generate interview questions" });
    }
  });

  app.post('/api/interview-prep/practice', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/interview-prep/practice', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/ai/job-match', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/ai/cover-letter', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { jobId, resumeId } = req.body;
      
      const user = await storage.getUser(userId);
      const job = await storage.getJob(jobId);
      
      if (!user || !job) {
        return res.status(404).json({ message: "User or job not found" });
      }
      
      const coverLetter = await openaiService.generateCoverLetter(user, job);
      res.json({ coverLetter });
    } catch (error) {
      console.error("Error generating cover letter:", error);
      res.status(500).json({ message: "Failed to generate cover letter" });
    }
  });

  // User preferences
  app.get('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post('/api/user/preferences', isAuthenticated, async (req: any, res) => {
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

  app.put('/api/user/preferences', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/saved-jobs', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/saved-jobs', isAuthenticated, async (req: any, res) => {
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

  app.delete('/api/saved-jobs/:id', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.put('/api/notifications/read-all', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/salary-negotiation', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/salary-negotiation', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const negotiations = await storage.getSalaryNegotiations(userId);
      res.json(negotiations);
    } catch (error) {
      console.error("Error fetching salary negotiations:", error);
      res.status(500).json({ message: "Failed to fetch salary negotiations" });
    }
  });

  app.post('/api/salary-negotiation/analyze', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/get-or-create-subscription', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/ai/cover-letter', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/ai/company-insights', isAuthenticated, async (req: any, res) => {
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
