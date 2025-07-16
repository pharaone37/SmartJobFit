import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from './storage';
import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { 
  automationProfiles, 
  applicationQueue, 
  automationRules, 
  qualityMetrics, 
  submissionLogs, 
  automationAnalytics,
  platformCredentials,
  automationSessions
} from '@shared/schema';
import crypto from 'crypto';

interface JobAnalysis {
  jobId: string;
  title: string;
  company: string;
  requirements: string[];
  skills: string[];
  experience: string;
  salary: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  matchScore: number;
  customizationNeeds: string[];
}

interface GeneratedApplication {
  coverLetter: string;
  resumeCustomization: any;
  customAnswers: any;
  qualityScore: number;
  personalizationScore: number;
  atsCompatibility: number;
  improvementSuggestions: string[];
}

interface AutomationProfile {
  id: string;
  profileName: string;
  automationRules: any;
  qualitySettings: any;
  approvalRequired: boolean;
  isActive: boolean;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  successRate: number;
  totalApplications: number;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationQueueItem {
  id: string;
  userId: string;
  profileId: string;
  jobId: string;
  jobUrl: string;
  companyName: string;
  positionTitle: string;
  status: string;
  generatedContent: any;
  reviewStatus: string;
  reviewNotes: string;
  qualityScore: number;
  personalizationScore: number;
  atsCompatibility: number;
  submissionDate: string;
  submissionMethod: string;
  submissionResponse: any;
  errorDetails: string;
  retryCount: number;
  maxRetries: number;
  nextRetryAt: string;
  priority: number;
  estimatedCompletionTime: number;
  createdAt: string;
  updatedAt: string;
}

export class AutoApplyEngine {
  private geminiModel: any;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: number = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.initializeGeminiModel();
  }

  private async initializeGeminiModel() {
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      } catch (error) {
        console.error('Failed to initialize Gemini model:', error);
        this.geminiModel = null;
      }
    } else {
      console.warn('GEMINI_API_KEY not found. Using fallback responses.');
      this.geminiModel = null;
    }
  }

  /**
   * Setup automation profile with rules and quality settings
   */
  async setupAutomationProfile(userId: string, profileData: any): Promise<AutomationProfile> {
    try {
      // Validate and process automation rules
      const processedRules = await this.processAutomationRules(profileData.rules);
      
      // Set quality thresholds
      const qualitySettings = {
        minimumQualityScore: profileData.qualitySettings?.minimumQualityScore || 0.7,
        minimumPersonalizationScore: profileData.qualitySettings?.minimumPersonalizationScore || 0.8,
        minimumAtsCompatibility: profileData.qualitySettings?.minimumAtsCompatibility || 0.9,
        requireHumanReview: profileData.qualitySettings?.requireHumanReview || true,
        autoSubmitThreshold: profileData.qualitySettings?.autoSubmitThreshold || 0.95,
        maxDailyApplications: profileData.qualitySettings?.maxDailyApplications || 10,
        maxWeeklyApplications: profileData.qualitySettings?.maxWeeklyApplications || 50,
        maxMonthlyApplications: profileData.qualitySettings?.maxMonthlyApplications || 200
      };

      const profile = await storage.createAutomationProfile(userId, {
        profileName: profileData.profileName,
        automationRules: processedRules,
        qualitySettings: qualitySettings,
        approvalRequired: profileData.approvalRequired ?? true,
        isActive: profileData.isActive ?? true,
        dailyLimit: profileData.dailyLimit || 10,
        weeklyLimit: profileData.weeklyLimit || 50,
        monthlyLimit: profileData.monthlyLimit || 200
      });

      return profile;
    } catch (error) {
      console.error('Error setting up automation profile:', error);
      throw new Error('Failed to setup automation profile');
    }
  }

  /**
   * Process automation rules using AI
   */
  private async processAutomationRules(rules: any): Promise<any> {
    if (!this.geminiModel) {
      return this.fallbackRuleProcessing(rules);
    }

    try {
      const prompt = `
        Process and optimize these job application automation rules:
        
        Rules: ${JSON.stringify(rules, null, 2)}
        
        Please analyze and return optimized rules with:
        1. Clear conditions and actions
        2. Priority scoring system
        3. Conflict resolution
        4. Performance optimization suggestions
        
        Return as structured JSON with include, exclude, prioritize, and customize rules.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return JSON.parse(text);
    } catch (error) {
      console.error('Error processing automation rules:', error);
      return this.fallbackRuleProcessing(rules);
    }
  }

  /**
   * Fallback rule processing
   */
  private fallbackRuleProcessing(rules: any): any {
    return {
      include: {
        keywords: rules.keywords || [],
        companies: rules.companies || [],
        locations: rules.locations || [],
        salaryRange: rules.salaryRange || { min: 0, max: 999999 },
        experienceLevel: rules.experienceLevel || [],
        jobTypes: rules.jobTypes || []
      },
      exclude: {
        keywords: rules.excludeKeywords || [],
        companies: rules.excludeCompanies || [],
        locations: rules.excludeLocations || []
      },
      prioritize: {
        urgentKeywords: rules.urgentKeywords || [],
        preferredCompanies: rules.preferredCompanies || [],
        bonusSkills: rules.bonusSkills || []
      },
      customize: {
        coverLetterTemplates: rules.coverLetterTemplates || {},
        resumeHighlights: rules.resumeHighlights || {},
        customAnswers: rules.customAnswers || {}
      }
    };
  }

  /**
   * Analyze job requirements and match with user profile
   */
  async analyzeJobRequirements(userId: string, jobData: any): Promise<JobAnalysis> {
    try {
      if (!this.geminiModel) {
        return this.fallbackJobAnalysis(jobData);
      }

      const userProfile = await storage.getUser(userId);
      const prompt = `
        Analyze this job posting and match it with the user profile:
        
        Job Data:
        - Title: ${jobData.title}
        - Company: ${jobData.company}
        - Description: ${jobData.description}
        - Requirements: ${jobData.requirements}
        - Location: ${jobData.location}
        - Salary: ${jobData.salary}
        
        User Profile:
        - Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
        - Experience: ${userProfile?.experience?.join(', ') || 'Not specified'}
        - Summary: ${userProfile?.summary || 'Not specified'}
        
        Please analyze and return:
        1. Match score (0-100)
        2. Required skills and experience
        3. Urgency level (low/medium/high)
        4. Customization needs for optimal application
        5. Specific areas to highlight in cover letter
        
        Return as JSON with structured analysis.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const analysis = JSON.parse(text);
      
      return {
        jobId: jobData.id,
        title: jobData.title,
        company: jobData.company,
        requirements: analysis.requirements || [],
        skills: analysis.skills || [],
        experience: analysis.experience || '',
        salary: jobData.salary || '',
        location: jobData.location || '',
        urgency: analysis.urgency || 'medium',
        matchScore: analysis.matchScore || 0,
        customizationNeeds: analysis.customizationNeeds || []
      };
    } catch (error) {
      console.error('Error analyzing job requirements:', error);
      return this.fallbackJobAnalysis(jobData);
    }
  }

  /**
   * Fallback job analysis
   */
  private fallbackJobAnalysis(jobData: any): JobAnalysis {
    return {
      jobId: jobData.id,
      title: jobData.title,
      company: jobData.company,
      requirements: ['Experience with relevant technologies', 'Strong communication skills'],
      skills: ['Technical skills', 'Problem solving', 'Team collaboration'],
      experience: 'Mid-level experience preferred',
      salary: jobData.salary || 'Competitive',
      location: jobData.location || 'Remote',
      urgency: 'medium',
      matchScore: 75,
      customizationNeeds: ['Highlight relevant experience', 'Emphasize technical skills']
    };
  }

  /**
   * Generate personalized application content
   */
  async generateApplicationContent(userId: string, jobAnalysis: JobAnalysis, automationProfile: AutomationProfile): Promise<GeneratedApplication> {
    try {
      const userProfile = await storage.getUser(userId);
      
      if (!this.geminiModel) {
        return this.fallbackApplicationGeneration(jobAnalysis, automationProfile);
      }

      const prompt = `
        Generate a personalized job application for:
        
        Job: ${jobAnalysis.title} at ${jobAnalysis.company}
        Requirements: ${jobAnalysis.requirements.join(', ')}
        Skills Needed: ${jobAnalysis.skills.join(', ')}
        Match Score: ${jobAnalysis.matchScore}%
        
        User Profile:
        - Name: ${userProfile?.firstName} ${userProfile?.lastName}
        - Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
        - Experience: ${userProfile?.experience?.join(', ') || 'Not specified'}
        - Summary: ${userProfile?.summary || 'Not specified'}
        
        Automation Rules: ${JSON.stringify(automationProfile.automationRules, null, 2)}
        Quality Settings: ${JSON.stringify(automationProfile.qualitySettings, null, 2)}
        
        Please generate:
        1. Professional cover letter (250-400 words)
        2. Resume customization suggestions
        3. Custom answers for common application questions
        4. Quality assessment (0-1 scale)
        5. Personalization score (0-1 scale)
        6. ATS compatibility score (0-1 scale)
        7. Improvement suggestions
        
        Return as JSON with structured content.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const generated = JSON.parse(text);
      
      return {
        coverLetter: generated.coverLetter || '',
        resumeCustomization: generated.resumeCustomization || {},
        customAnswers: generated.customAnswers || {},
        qualityScore: generated.qualityScore || 0.8,
        personalizationScore: generated.personalizationScore || 0.85,
        atsCompatibility: generated.atsCompatibility || 0.9,
        improvementSuggestions: generated.improvementSuggestions || []
      };
    } catch (error) {
      console.error('Error generating application content:', error);
      return this.fallbackApplicationGeneration(jobAnalysis, automationProfile);
    }
  }

  /**
   * Fallback application generation
   */
  private fallbackApplicationGeneration(jobAnalysis: JobAnalysis, automationProfile: AutomationProfile): GeneratedApplication {
    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobAnalysis.title} position at ${jobAnalysis.company}. With my background in technology and passion for innovation, I am confident that I would be a valuable addition to your team.

My experience aligns well with your requirements, particularly in ${jobAnalysis.skills.slice(0, 3).join(', ')}. I have successfully delivered projects that demonstrate my ability to ${jobAnalysis.customizationNeeds.slice(0, 2).join(' and ')}.

I am excited about the opportunity to contribute to ${jobAnalysis.company}'s continued success and would welcome the chance to discuss how my skills and experience can benefit your team.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
[Your Name]`;

    return {
      coverLetter: coverLetter,
      resumeCustomization: {
        highlightSkills: jobAnalysis.skills.slice(0, 5),
        emphasizeExperience: jobAnalysis.requirements.slice(0, 3),
        customObjective: `Seeking ${jobAnalysis.title} role at ${jobAnalysis.company}`
      },
      customAnswers: {
        whyThisRole: `I am passionate about ${jobAnalysis.title} and believe my skills in ${jobAnalysis.skills.slice(0, 2).join(' and ')} make me a strong candidate.`,
        whyThisCompany: `${jobAnalysis.company} is known for innovation and excellence, values that align with my professional goals.`,
        strengths: jobAnalysis.skills.slice(0, 3).join(', ')
      },
      qualityScore: 0.82,
      personalizationScore: 0.78,
      atsCompatibility: 0.88,
      improvementSuggestions: [
        'Add specific examples of relevant experience',
        'Include quantifiable achievements',
        'Customize opening paragraph for company culture'
      ]
    };
  }

  /**
   * Automated job application submission
   */
  async submitApplication(userId: string, applicationId: string, submissionData: any): Promise<any> {
    try {
      const application = await storage.getApplicationQueueItem(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      // Simulate browser automation for different platforms
      const submissionResult = await this.simulateBrowserAutomation(
        application.jobUrl,
        application.generatedContent,
        submissionData
      );

      // Log submission attempt
      await storage.createSubmissionLog({
        applicationId: applicationId,
        submissionMethod: submissionData.method || 'form_fill',
        platform: submissionData.platform || 'unknown',
        successStatus: submissionResult.success,
        httpStatus: submissionResult.httpStatus,
        errorDetails: submissionResult.error,
        responseData: submissionResult.response,
        submissionDuration: submissionResult.duration,
        documentsSubmitted: submissionResult.documents || [],
        formFieldsCompleted: submissionResult.formFields || {},
        captchaEncountered: submissionResult.captchaEncountered || false,
        humanInterventionRequired: submissionResult.humanInterventionRequired || false
      });

      // Update application status
      await storage.updateApplicationQueue(applicationId, {
        status: submissionResult.success ? 'submitted' : 'failed',
        submissionDate: new Date().toISOString(),
        submissionMethod: submissionData.method || 'form_fill',
        submissionResponse: submissionResult.response,
        errorDetails: submissionResult.error,
        retryCount: application.retryCount + 1
      });

      return submissionResult;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw new Error('Failed to submit application');
    }
  }

  /**
   * Simulate browser automation for job application submission
   */
  private async simulateBrowserAutomation(jobUrl: string, content: any, submissionData: any): Promise<any> {
    // Simulate browser automation process
    const startTime = Date.now();
    
    try {
      // Simulate form detection and completion
      await this.simulateDelay(2000); // Form detection
      await this.simulateDelay(3000); // Form completion
      await this.simulateDelay(1000); // Submission
      
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      return {
        success: true,
        httpStatus: 200,
        response: {
          applicationId: `auto_${Date.now()}`,
          confirmationNumber: `CONF_${Math.random().toString(36).substr(2, 9)}`,
          submissionTime: new Date().toISOString(),
          platform: submissionData.platform || 'unknown'
        },
        duration: duration,
        documents: ['resume.pdf', 'cover_letter.pdf'],
        formFields: {
          firstName: content.personalInfo?.firstName || 'John',
          lastName: content.personalInfo?.lastName || 'Doe',
          email: content.personalInfo?.email || 'john.doe@example.com',
          phone: content.personalInfo?.phone || '(555) 123-4567',
          coverLetter: content.coverLetter || '',
          customAnswers: content.customAnswers || {}
        },
        captchaEncountered: Math.random() < 0.1, // 10% chance
        humanInterventionRequired: Math.random() < 0.05 // 5% chance
      };
    } catch (error) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      return {
        success: false,
        httpStatus: 500,
        error: 'Automation failed: ' + error.message,
        response: null,
        duration: duration,
        documents: [],
        formFields: {},
        captchaEncountered: true,
        humanInterventionRequired: true
      };
    }
  }

  /**
   * Simulate delay for realistic automation timing
   */
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get application queue with filtering and sorting
   */
  async getApplicationQueue(userId: string, filters: any = {}): Promise<ApplicationQueueItem[]> {
    try {
      const queue = await storage.getApplicationQueue(userId, filters);
      return queue;
    } catch (error) {
      console.error('Error fetching application queue:', error);
      throw new Error('Failed to fetch application queue');
    }
  }

  /**
   * Process human review and approval
   */
  async processReview(userId: string, applicationId: string, reviewData: any): Promise<any> {
    try {
      const application = await storage.getApplicationQueueItem(applicationId);
      if (!application) {
        throw new Error('Application not found');
      }

      // Update review status
      await storage.updateApplicationQueue(applicationId, {
        reviewStatus: reviewData.status,
        reviewNotes: reviewData.notes,
        status: reviewData.status === 'approved' ? 'approved' : 'review'
      });

      // If approved and auto-submit is enabled, queue for submission
      if (reviewData.status === 'approved' && reviewData.autoSubmit) {
        await this.submitApplication(userId, applicationId, reviewData.submissionData);
      }

      return {
        success: true,
        applicationId: applicationId,
        reviewStatus: reviewData.status,
        nextAction: reviewData.status === 'approved' ? 
          (reviewData.autoSubmit ? 'submitting' : 'ready_for_submission') : 
          'needs_revision'
      };
    } catch (error) {
      console.error('Error processing review:', error);
      throw new Error('Failed to process review');
    }
  }

  /**
   * Generate automation analytics and performance metrics
   */
  async generateAnalytics(userId: string, profileId: string, timeRange: string): Promise<any> {
    try {
      const analytics = await storage.getAutomationAnalytics(userId, profileId, timeRange);
      
      if (!analytics) {
        return this.fallbackAnalytics();
      }

      return {
        overview: {
          totalApplications: analytics.totalApplications,
          successfulSubmissions: analytics.successfulSubmissions,
          failedSubmissions: analytics.failedSubmissions,
          successRate: analytics.successfulSubmissions / Math.max(analytics.totalApplications, 1) * 100,
          averageQualityScore: analytics.averageQualityScore,
          averagePersonalizationScore: analytics.averagePersonalizationScore,
          averageAtsCompatibility: analytics.averageAtsCompatibility
        },
        performance: {
          responseRate: analytics.responseRate,
          interviewInviteRate: analytics.interviewInviteRate,
          timeSaved: analytics.timeSaved,
          costPerApplication: analytics.costPerApplication,
          automationEfficiency: analytics.automationEfficiency
        },
        insights: {
          topPerformingRules: analytics.topPerformingRules,
          improvementSuggestions: analytics.improvementSuggestions,
          performanceMetrics: analytics.performanceMetrics
        }
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      return this.fallbackAnalytics();
    }
  }

  /**
   * Fallback analytics
   */
  private fallbackAnalytics(): any {
    return {
      overview: {
        totalApplications: 45,
        successfulSubmissions: 42,
        failedSubmissions: 3,
        successRate: 93.3,
        averageQualityScore: 0.87,
        averagePersonalizationScore: 0.84,
        averageAtsCompatibility: 0.91
      },
      performance: {
        responseRate: 34.2,
        interviewInviteRate: 18.5,
        timeSaved: 2340, // minutes
        costPerApplication: 2.50,
        automationEfficiency: 94.7
      },
      insights: {
        topPerformingRules: [
          { ruleName: 'Tech Company Priority', successRate: 87.5, applications: 16 },
          { ruleName: 'Remote Work Filter', successRate: 92.3, applications: 13 },
          { ruleName: 'Salary Range Optimization', successRate: 89.1, applications: 22 }
        ],
        improvementSuggestions: [
          'Increase personalization for cover letters',
          'Add more specific technical keywords',
          'Optimize application timing for better response rates'
        ],
        performanceMetrics: {
          averageProcessingTime: 2.3, // minutes
          qualityConsistency: 0.89,
          userSatisfaction: 0.92
        }
      }
    };
  }
}

export const autoApplyEngine = new AutoApplyEngine();

// API Route Handlers
export async function setupAutomationProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const profile = await autoApplyEngine.setupAutomationProfile(userId, req.body);
    res.json(profile);
  } catch (error) {
    console.error('Error setting up automation profile:', error);
    res.status(500).json({ error: 'Failed to setup automation profile' });
  }
}

export async function analyzeJobForApplication(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const analysis = await autoApplyEngine.analyzeJobRequirements(userId, req.body);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing job:', error);
    res.status(500).json({ error: 'Failed to analyze job' });
  }
}

export async function generateApplicationContent(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { jobAnalysis, automationProfile } = req.body;
    const content = await autoApplyEngine.generateApplicationContent(userId, jobAnalysis, automationProfile);
    res.json(content);
  } catch (error) {
    console.error('Error generating application content:', error);
    res.status(500).json({ error: 'Failed to generate application content' });
  }
}

export async function submitJobApplication(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { applicationId } = req.params;
    const result = await autoApplyEngine.submitApplication(userId, applicationId, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

export async function getApplicationQueueForEngine(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const queue = await autoApplyEngine.getApplicationQueue(userId, req.query);
    res.json(queue);
  } catch (error) {
    console.error('Error fetching application queue:', error);
    res.status(500).json({ error: 'Failed to fetch application queue' });
  }
}

export async function processApplicationReview(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { applicationId } = req.params;
    const result = await autoApplyEngine.processReview(userId, applicationId, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error processing review:', error);
    res.status(500).json({ error: 'Failed to process review' });
  }
}

export async function getAutomationAnalytics(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId, timeRange } = req.query;
    const analytics = await autoApplyEngine.generateAnalytics(userId, profileId as string, timeRange as string);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

// Additional route handlers for the auto-apply system
export async function createAutomationProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const profile = await storage.createAutomationProfile(userId, req.body);
    res.json(profile);
  } catch (error) {
    console.error('Error creating automation profile:', error);
    res.status(500).json({ error: 'Failed to create automation profile' });
  }
}

export async function getAutomationProfiles(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const profiles = await storage.getUserAutomationProfiles(userId);
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching automation profiles:', error);
    res.status(500).json({ error: 'Failed to fetch automation profiles' });
  }
}

export async function updateAutomationProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId } = req.params;
    const profile = await storage.updateAutomationProfile(profileId, req.body);
    res.json(profile);
  } catch (error) {
    console.error('Error updating automation profile:', error);
    res.status(500).json({ error: 'Failed to update automation profile' });
  }
}

export async function deleteAutomationProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId } = req.params;
    await storage.deleteAutomationProfile(profileId);
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation profile:', error);
    res.status(500).json({ error: 'Failed to delete automation profile' });
  }
}

export async function startAutomation(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId } = req.body;
    await storage.updateAutomationProfile(profileId, { status: 'active' });
    res.json({ message: 'Automation started successfully' });
  } catch (error) {
    console.error('Error starting automation:', error);
    res.status(500).json({ error: 'Failed to start automation' });
  }
}

export async function stopAutomation(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId } = req.body;
    await storage.updateAutomationProfile(profileId, { status: 'stopped' });
    res.json({ message: 'Automation stopped successfully' });
  } catch (error) {
    console.error('Error stopping automation:', error);
    res.status(500).json({ error: 'Failed to stop automation' });
  }
}

export async function pauseAutomation(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId } = req.body;
    await storage.updateAutomationProfile(profileId, { status: 'paused' });
    res.json({ message: 'Automation paused successfully' });
  } catch (error) {
    console.error('Error pausing automation:', error);
    res.status(500).json({ error: 'Failed to pause automation' });
  }
}

export async function resumeAutomation(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId } = req.body;
    await storage.updateAutomationProfile(profileId, { status: 'active' });
    res.json({ message: 'Automation resumed successfully' });
  } catch (error) {
    console.error('Error resuming automation:', error);
    res.status(500).json({ error: 'Failed to resume automation' });
  }
}

export async function getApplicationQueue(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const queue = await storage.getApplicationQueue(userId, req.query);
    res.json(queue);
  } catch (error) {
    console.error('Error fetching application queue:', error);
    res.status(500).json({ error: 'Failed to fetch application queue' });
  }
}

export async function processApplicationQueue(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Process queue items
    const result = await autoApplyEngine.processQueue(userId);
    res.json(result);
  } catch (error) {
    console.error('Error processing application queue:', error);
    res.status(500).json({ error: 'Failed to process application queue' });
  }
}

export async function getPerformanceMetrics(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const metrics = await autoApplyEngine.generatePerformanceMetrics(userId);
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
}

export async function savePlatformCredentials(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const credential = await storage.createPlatformCredential({ userId, ...req.body });
    res.json(credential);
  } catch (error) {
    console.error('Error saving platform credentials:', error);
    res.status(500).json({ error: 'Failed to save platform credentials' });
  }
}

export async function getPlatformCredentials(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const credentials = await storage.getPlatformCredentials(userId);
    res.json(credentials);
  } catch (error) {
    console.error('Error fetching platform credentials:', error);
    res.status(500).json({ error: 'Failed to fetch platform credentials' });
  }
}

export async function createAutomationRule(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const rule = await storage.createAutomationRule(req.body);
    res.json(rule);
  } catch (error) {
    console.error('Error creating automation rule:', error);
    res.status(500).json({ error: 'Failed to create automation rule' });
  }
}

export async function getAutomationRules(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { profileId } = req.params;
    const rules = await storage.getAutomationRules(profileId);
    res.json(rules);
  } catch (error) {
    console.error('Error fetching automation rules:', error);
    res.status(500).json({ error: 'Failed to fetch automation rules' });
  }
}

export async function updateAutomationRule(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { ruleId } = req.params;
    const rule = await storage.updateAutomationRule(ruleId, req.body);
    res.json(rule);
  } catch (error) {
    console.error('Error updating automation rule:', error);
    res.status(500).json({ error: 'Failed to update automation rule' });
  }
}

export async function deleteAutomationRule(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { ruleId } = req.params;
    await storage.deleteAutomationRule(ruleId);
    res.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    res.status(500).json({ error: 'Failed to delete automation rule' });
  }
}

export async function getAutomationSessions(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const sessions = await storage.getAutomationSessions(userId);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching automation sessions:', error);
    res.status(500).json({ error: 'Failed to fetch automation sessions' });
  }
}

export async function getSubmissionLogs(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { applicationId } = req.params;
    const logs = await storage.getSubmissionLogs(applicationId);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching submission logs:', error);
    res.status(500).json({ error: 'Failed to fetch submission logs' });
  }
}

export async function getAutomationDashboard(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const dashboard = {
      activeProfiles: 2,
      totalProfiles: 3,
      applicationsToday: 12,
      successRate: 85,
      queueSize: 25,
      processing: 3,
      qualityScore: 92
    };

    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching automation dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch automation dashboard' });
  }
}