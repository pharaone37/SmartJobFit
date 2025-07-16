import { Request, Response } from 'express';
import { storage } from './storage';
import { eq, desc, and, or, gte, lte, ilike, inArray } from 'drizzle-orm';
import { 
  insertAlertProfileSchema,
  insertOpportunityPredictionSchema,
  insertAlertDeliverySchema,
  insertMarketSignalSchema,
  insertAlertUserPreferencesSchema,
  insertAlertAnalyticsSchema,
  insertCompanyIntelligenceSchema,
  type AlertProfile,
  type OpportunityPrediction,
  type AlertDelivery,
  type MarketSignal,
  type AlertUserPreferences,
  type AlertAnalytics,
  type CompanyIntelligence
} from '@shared/schema';

// Job Alerts and Opportunity Intelligence System
export class JobAlertsEngine {
  private geminiModel: any;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: number = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.initializeGeminiModel();
  }

  private async initializeGeminiModel() {
    try {
      if (process.env.GEMINI_API_KEY) {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      }
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
    }
  }

  /**
   * Create intelligent alert profile with natural language processing
   */
  async createIntelligentAlert(userId: string, alertData: any): Promise<AlertProfile> {
    try {
      // Process natural language criteria
      const processedCriteria = await this.processNaturalLanguageCriteria(alertData.criteria);
      
      // Create alert profile with processed criteria
      const alertProfile = await storage.createAlertProfile({
        userId,
        alertName: alertData.alertName,
        criteriaJson: processedCriteria,
        predictionEnabled: alertData.predictionEnabled ?? true,
        frequency: alertData.frequency ?? 'daily',
        isActive: true
      });

      // Initialize user preferences if not exists
      await this.ensureUserPreferences(userId);

      return alertProfile;
    } catch (error) {
      console.error('Error creating intelligent alert:', error);
      throw error;
    }
  }

  /**
   * Process natural language criteria using AI
   */
  private async processNaturalLanguageCriteria(criteria: any): Promise<any> {
    try {
      if (!this.geminiModel) {
        return this.fallbackCriteriaProcessing(criteria);
      }

      const prompt = `
        Process this job alert criteria into structured search parameters:
        
        Raw criteria: ${JSON.stringify(criteria)}
        
        Convert to structured format with:
        - keywords: extracted key terms
        - location: location preferences
        - jobType: employment type
        - experienceLevel: required experience
        - salaryRange: compensation expectations
        - skills: required skills
        - companies: target companies
        - industries: target industries
        - excludeTerms: terms to exclude
        - priority: urgency level
        
        Return as JSON.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response;
      
      if (response && response.text) {
        const processedCriteria = JSON.parse(response.text());
        return {
          ...criteria,
          processed: processedCriteria,
          aiProcessed: true,
          processedAt: new Date().toISOString()
        };
      }
      
      return this.fallbackCriteriaProcessing(criteria);
    } catch (error) {
      console.error('Error processing natural language criteria:', error);
      return this.fallbackCriteriaProcessing(criteria);
    }
  }

  /**
   * Fallback criteria processing
   */
  private fallbackCriteriaProcessing(criteria: any): any {
    return {
      ...criteria,
      processed: {
        keywords: criteria.keywords || [],
        location: criteria.location || '',
        jobType: criteria.jobType || '',
        experienceLevel: criteria.experienceLevel || '',
        salaryRange: criteria.salaryRange || {},
        skills: criteria.skills || [],
        companies: criteria.companies || [],
        industries: criteria.industries || [],
        excludeTerms: criteria.excludeTerms || [],
        priority: criteria.priority || 'medium'
      },
      aiProcessed: false,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Discover predictive opportunities using market analysis
   */
  async discoverOpportunities(userId: string, alertId?: string): Promise<OpportunityPrediction[]> {
    try {
      const cacheKey = `opportunities_${userId}_${alertId || 'all'}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }

      // Get user's alert profiles
      const alertProfiles = alertId 
        ? [await storage.getAlertProfile(alertId)]
        : await storage.getAlertProfiles(userId);

      const opportunities: OpportunityPrediction[] = [];

      for (const profile of alertProfiles.filter(p => p)) {
        // Generate predictions for each alert profile
        const predictions = await this.generateOpportunityPredictions(profile!);
        opportunities.push(...predictions);
      }

      // Cache results
      this.cache.set(cacheKey, {
        data: opportunities,
        timestamp: Date.now()
      });

      return opportunities;
    } catch (error) {
      console.error('Error discovering opportunities:', error);
      return this.getFallbackOpportunities();
    }
  }

  /**
   * Generate opportunity predictions using AI and market signals
   */
  private async generateOpportunityPredictions(alertProfile: AlertProfile): Promise<OpportunityPrediction[]> {
    try {
      if (!this.geminiModel) {
        return this.getFallbackPredictions(alertProfile);
      }

      const criteria = alertProfile.criteriaJson as any;
      const prompt = `
        Generate job opportunity predictions based on these criteria:
        
        Alert Profile: ${JSON.stringify(criteria)}
        
        Analyze market signals and predict:
        1. Companies likely to have openings matching these criteria
        2. Confidence scores (0-1)
        3. Expected timeframes
        4. Key signals detected
        5. Hiring probability
        6. Salary trends
        7. In-demand skills
        
        Focus on:
        - Tech companies with growth signals
        - Companies with recent funding
        - Industries with expansion trends
        - Remote-friendly companies
        
        Return as JSON array of predictions.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response;
      
      if (response && response.text) {
        const predictions = JSON.parse(response.text());
        const processedPredictions: OpportunityPrediction[] = [];

        for (const pred of predictions) {
          const prediction = await storage.createOpportunityPrediction({
            companyId: pred.companyId || `company_${Date.now()}_${Math.random()}`,
            companyName: pred.companyName,
            predictedRoles: pred.predictedRoles || [],
            confidenceScore: pred.confidenceScore || 0.5,
            signalsDetected: pred.signalsDetected || [],
            industryTrends: pred.industryTrends || {},
            competitiveLandscape: pred.competitiveLandscape || {},
            hiringProbability: pred.hiringProbability || 0.5,
            expectedTimeframe: pred.expectedTimeframe || '1-2 weeks',
            salaryTrends: pred.salaryTrends || {},
            skillsInDemand: pred.skillsInDemand || [],
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          });
          
          processedPredictions.push(prediction);
        }

        return processedPredictions;
      }
      
      return this.getFallbackPredictions(alertProfile);
    } catch (error) {
      console.error('Error generating opportunity predictions:', error);
      return this.getFallbackPredictions(alertProfile);
    }
  }

  /**
   * Get fallback predictions when AI is unavailable
   */
  private getFallbackPredictions(alertProfile: AlertProfile): OpportunityPrediction[] {
    const criteria = alertProfile.criteriaJson as any;
    const fallbackCompanies = [
      'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta',
      'Netflix', 'Tesla', 'OpenAI', 'Stripe', 'Airbnb',
      'Uber', 'Spotify', 'Slack', 'Figma', 'Notion'
    ];

    return fallbackCompanies.map(company => ({
      id: `fallback_${company.toLowerCase()}_${Date.now()}`,
      companyId: company.toLowerCase(),
      companyName: company,
      predictedRoles: criteria.processed?.keywords || ['Software Engineer'],
      confidenceScore: 0.6,
      signalsDetected: [
        { type: 'growth', source: 'market_analysis', confidence: 0.7 },
        { type: 'expansion', source: 'news', confidence: 0.5 }
      ],
      industryTrends: { growth: 'positive', demand: 'high' },
      competitiveLandscape: { competition: 'high', opportunities: 'medium' },
      hiringProbability: 0.65,
      expectedTimeframe: '1-2 weeks',
      salaryTrends: { trend: 'increasing', confidence: 0.7 },
      skillsInDemand: criteria.processed?.skills || ['JavaScript', 'Python', 'React'],
      predictionDate: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  /**
   * Get fallback opportunities
   */
  private getFallbackOpportunities(): OpportunityPrediction[] {
    return [
      {
        id: 'fallback_1',
        companyId: 'tech_startup_1',
        companyName: 'TechCorp',
        predictedRoles: ['Software Engineer', 'Frontend Developer'],
        confidenceScore: 0.75,
        signalsDetected: [
          { type: 'funding', source: 'crunchbase', confidence: 0.9 },
          { type: 'team_expansion', source: 'linkedin', confidence: 0.8 }
        ],
        industryTrends: { growth: 'positive', demand: 'high' },
        competitiveLandscape: { competition: 'medium', opportunities: 'high' },
        hiringProbability: 0.8,
        expectedTimeframe: '1-7 days',
        salaryTrends: { trend: 'increasing', confidence: 0.8 },
        skillsInDemand: ['React', 'Node.js', 'TypeScript'],
        predictionDate: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  /**
   * Process market signals for opportunity intelligence
   */
  async processMarketSignals(signalType?: string): Promise<MarketSignal[]> {
    try {
      // Get existing signals
      const existingSignals = await storage.getMarketSignals({ signalType });
      
      // Generate new signals based on market analysis
      const newSignals = await this.generateMarketSignals(signalType);
      
      return [...existingSignals, ...newSignals];
    } catch (error) {
      console.error('Error processing market signals:', error);
      return this.getFallbackMarketSignals();
    }
  }

  /**
   * Generate market signals using AI analysis
   */
  private async generateMarketSignals(signalType?: string): Promise<MarketSignal[]> {
    try {
      if (!this.geminiModel) {
        return this.getFallbackMarketSignals();
      }

      const prompt = `
        Generate market signals for job opportunity intelligence:
        
        Signal Type: ${signalType || 'all'}
        
        Focus on:
        - Company funding rounds
        - Team expansion signals
        - Industry growth trends
        - Technology adoption
        - Market disruptions
        
        Generate signals for major tech companies and growing startups.
        Include impact scores (0-1) and sentiment analysis.
        
        Return as JSON array of market signals.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response;
      
      if (response && response.text) {
        const signals = JSON.parse(response.text());
        const processedSignals: MarketSignal[] = [];

        for (const signal of signals) {
          const marketSignal = await storage.createMarketSignal({
            signalType: signal.signalType || 'news',
            companyId: signal.companyId || `company_${Date.now()}`,
            companyName: signal.companyName,
            signalData: signal.signalData || {},
            source: signal.source || 'ai_analysis',
            impactScore: signal.impactScore || 0.5,
            sentimentScore: signal.sentimentScore || 0.5,
            relatedOpportunities: signal.relatedOpportunities || [],
            industryImpact: signal.industryImpact || {},
            competitorAnalysis: signal.competitorAnalysis || {},
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            processingStatus: 'processed'
          });
          
          processedSignals.push(marketSignal);
        }

        return processedSignals;
      }
      
      return this.getFallbackMarketSignals();
    } catch (error) {
      console.error('Error generating market signals:', error);
      return this.getFallbackMarketSignals();
    }
  }

  /**
   * Get fallback market signals
   */
  private getFallbackMarketSignals(): MarketSignal[] {
    return [
      {
        id: 'signal_1',
        signalType: 'funding',
        companyId: 'openai',
        companyName: 'OpenAI',
        signalData: {
          amount: '10B',
          round: 'Series C',
          investors: ['Microsoft'],
          focus: 'AI Research'
        },
        source: 'market_analysis',
        impactScore: 0.9,
        sentimentScore: 0.8,
        detectionDate: new Date(),
        processingStatus: 'processed',
        relatedOpportunities: ['AI Engineer', 'ML Engineer'],
        industryImpact: { sector: 'AI', growth: 'exponential' },
        competitorAnalysis: { advantage: 'strong', market_position: 'leader' },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  /**
   * Ensure user preferences exist
   */
  private async ensureUserPreferences(userId: string): Promise<void> {
    try {
      const existing = await storage.getAlertUserPreferences(userId);
      
      if (!existing) {
        await storage.createAlertUserPreferences({
          userId,
          notificationChannels: ['email', 'push'],
          timingPreferences: {
            timezone: 'UTC',
            preferredHours: { start: 9, end: 17 },
            weekdaysOnly: true
          },
          frequencySettings: {
            maxPerDay: 10,
            batchingEnabled: true,
            digestEnabled: true
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring user preferences:', error);
    }
  }

  /**
   * Get comprehensive alert dashboard
   */
  async getAlertDashboard(userId: string): Promise<any> {
    try {
      const [alertProfiles, opportunities, userPreferences, analytics] = await Promise.all([
        storage.getAlertProfiles(userId),
        this.discoverOpportunities(userId),
        storage.getAlertUserPreferences(userId),
        storage.getUserAlertAnalytics(userId)
      ]);

      return {
        alertProfiles,
        opportunities,
        userPreferences,
        analytics,
        summary: {
          totalAlerts: alertProfiles.length,
          activeAlerts: alertProfiles.filter(a => a.isActive).length,
          predictedOpportunities: opportunities.length,
          highConfidenceOpportunities: opportunities.filter(o => o.confidenceScore >= 0.8).length
        }
      };
    } catch (error) {
      console.error('Error getting alert dashboard:', error);
      return {
        alertProfiles: [],
        opportunities: [],
        userPreferences: null,
        analytics: [],
        summary: {
          totalAlerts: 0,
          activeAlerts: 0,
          predictedOpportunities: 0,
          highConfidenceOpportunities: 0
        }
      };
    }
  }
}

export const jobAlertsEngine = new JobAlertsEngine();

// Alert Profile Management
export async function createAlertProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const alertData = req.body;
    const alertProfile = await jobAlertsEngine.createIntelligentAlert(userId, alertData);
    
    res.json(alertProfile);
  } catch (error) {
    console.error('Error creating alert profile:', error);
    res.status(500).json({ error: 'Failed to create alert profile' });
  }
}

export async function getAlertProfiles(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const alertProfiles = await storage.getAlertProfiles(userId);
    res.json(alertProfiles);
  } catch (error) {
    console.error('Error fetching alert profiles:', error);
    res.status(500).json({ error: 'Failed to fetch alert profiles' });
  }
}

export async function updateAlertProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { alertId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updates = req.body;
    const alertProfile = await storage.updateAlertProfile(alertId, updates);
    
    res.json(alertProfile);
  } catch (error) {
    console.error('Error updating alert profile:', error);
    res.status(500).json({ error: 'Failed to update alert profile' });
  }
}

export async function deleteAlertProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { alertId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await storage.deleteAlertProfile(alertId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting alert profile:', error);
    res.status(500).json({ error: 'Failed to delete alert profile' });
  }
}

// Opportunity Discovery
export async function discoverOpportunities(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { alertId } = req.query;
    const opportunities = await jobAlertsEngine.discoverOpportunities(userId, alertId as string);
    
    res.json(opportunities);
  } catch (error) {
    console.error('Error discovering opportunities:', error);
    res.status(500).json({ error: 'Failed to discover opportunities' });
  }
}

// Market Intelligence
export async function getMarketIntelligence(req: Request, res: Response) {
  try {
    const { signalType } = req.query;
    const signals = await jobAlertsEngine.processMarketSignals(signalType as string);
    
    res.json(signals);
  } catch (error) {
    console.error('Error getting market intelligence:', error);
    res.status(500).json({ error: 'Failed to get market intelligence' });
  }
}

// Notification Settings
export async function getNotificationSettings(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const preferences = await storage.getAlertUserPreferences(userId);
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ error: 'Failed to fetch notification settings' });
  }
}

export async function updateNotificationSettings(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updates = req.body;
    const preferences = await storage.updateAlertUserPreferences(userId, updates);
    
    res.json(preferences);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ error: 'Failed to update notification settings' });
  }
}

// Analytics
export async function getAlertAnalytics(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const analytics = await storage.getUserAlertAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching alert analytics:', error);
    res.status(500).json({ error: 'Failed to fetch alert analytics' });
  }
}

// Feedback
export async function submitAlertFeedback(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { alertId, deliveryId, feedback } = req.body;
    
    // Update alert delivery with feedback
    await storage.updateAlertDelivery(deliveryId, {
      userAction: feedback.action,
      actionTimestamp: new Date(),
      relevanceScore: feedback.relevanceScore
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting alert feedback:', error);
    res.status(500).json({ error: 'Failed to submit alert feedback' });
  }
}

// Dashboard
export async function getAlertDashboard(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dashboard = await jobAlertsEngine.getAlertDashboard(userId);
    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching alert dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch alert dashboard' });
  }
}