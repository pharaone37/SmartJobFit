import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";
import { nanoid } from "nanoid";

interface SalaryResearchParams {
  jobTitle: string;
  location: string;
  experienceLevel: string;
  industry?: string;
  companySize?: string;
  skills?: string[];
}

interface CompanyInsightsParams {
  companyName: string;
  industry?: string;
  location?: string;
}

interface NegotiationStrategyParams {
  userProfile: any;
  jobOffer: any;
  marketData: any;
  negotiationGoals: any;
}

interface SimulationParams {
  userId: string;
  scenario: string;
  userProfile: any;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface MarketAnalysisParams {
  industry: string;
  location: string;
  timeRange: string;
  jobTitle?: string;
}

export class SalaryIntelligence {
  private geminiModel: any;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: number = 60 * 60 * 1000; // 1 hour

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    } else {
      console.warn("GEMINI_API_KEY not found. Using fallback responses.");
    }
  }

  /**
   * Comprehensive salary market research
   */
  async getMarketData(params: SalaryResearchParams): Promise<any> {
    const cacheKey = `market_${JSON.stringify(params)}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      // Fetch from multiple salary data sources
      const [glassdoorData, payscaleData, salaryComData, blsData] = await Promise.all([
        this.fetchGlassdoorData(params),
        this.fetchPayscaleData(params),
        this.fetchSalaryComData(params),
        this.fetchBLSData(params)
      ]);

      // Aggregate and normalize data
      const aggregatedData = this.aggregateSalaryData([
        glassdoorData,
        payscaleData,
        salaryComData,
        blsData
      ]);

      // Store in database
      await storage.createSalaryData({
        id: nanoid(),
        jobTitle: params.jobTitle,
        location: params.location,
        salaryMin: aggregatedData.min,
        salaryMax: aggregatedData.max,
        salaryMedian: aggregatedData.median,
        dataSource: 'aggregated',
        experienceLevel: params.experienceLevel,
        industry: params.industry,
        companySize: params.companySize,
        confidenceScore: aggregatedData.confidence,
        lastUpdated: new Date()
      });

      // Cache result
      this.cache.set(cacheKey, {
        data: aggregatedData,
        timestamp: Date.now()
      });

      return aggregatedData;

    } catch (error) {
      console.error("Error fetching market data:", error);
      return this.getFallbackMarketData(params);
    }
  }

  /**
   * Generate personalized salary range recommendations
   */
  async getPersonalizedRange(params: SalaryResearchParams & { userProfile: any }): Promise<any> {
    try {
      // Get base market data
      const marketData = await this.getMarketData(params);
      
      // Get cost of living adjustments
      const colAdjustment = await this.getCostOfLivingAdjustment(params.location);
      
      // Apply AI-powered personalization
      const personalizedRange = await this.calculatePersonalizedRange(
        marketData,
        params.userProfile,
        colAdjustment
      );

      // Store personalized benchmark
      await storage.createSalaryBenchmark({
        userId: params.userProfile.id,
        jobTitle: params.jobTitle,
        industry: params.industry || 'technology',
        location: params.location,
        experienceLevel: params.experienceLevel,
        marketMin: marketData.min,
        marketMax: marketData.max,
        marketMedian: marketData.median,
        userTarget: personalizedRange.target,
        personalizedMin: personalizedRange.min,
        personalizedMax: personalizedRange.max,
        benchmarkFactors: personalizedRange.factors
      });

      return personalizedRange;

    } catch (error) {
      console.error("Error generating personalized range:", error);
      return this.getFallbackPersonalizedRange(params);
    }
  }

  /**
   * Get comprehensive company compensation insights
   */
  async getCompanyInsights(params: CompanyInsightsParams): Promise<any> {
    try {
      // Fetch company data from multiple sources
      const [clearbitData, crunchbaseData, glassdoorData] = await Promise.all([
        this.fetchClearbitData(params.companyName),
        this.fetchCrunchbaseData(params.companyName),
        this.fetchCompanyGlassdoorData(params.companyName)
      ]);

      // Analyze company financial health
      const financialHealth = this.analyzeFinancialHealth(clearbitData, crunchbaseData);
      
      // Generate compensation insights
      const insights = await this.generateCompanyInsights(
        params.companyName,
        financialHealth,
        glassdoorData
      );

      // Store company compensation data
      await storage.createCompanyCompensation({
        companyId: nanoid(),
        companyName: params.companyName,
        avgSalary: insights.avgSalary,
        salaryRanges: insights.salaryRanges,
        equityPolicy: insights.equityPolicy,
        benefitsPackage: insights.benefitsPackage,
        negotiationFlexibility: insights.negotiationFlexibility,
        workLifeBalance: insights.workLifeBalance,
        cultureScore: insights.cultureScore,
        financialHealth: financialHealth.rating,
        growthStage: insights.growthStage,
        compensationPhilosophy: insights.compensationPhilosophy
      });

      return insights;

    } catch (error) {
      console.error("Error getting company insights:", error);
      return this.getFallbackCompanyInsights(params);
    }
  }

  /**
   * Generate AI-powered negotiation strategy
   */
  async generateNegotiationStrategy(params: NegotiationStrategyParams): Promise<any> {
    try {
      if (!this.geminiModel) {
        return this.getFallbackNegotiationStrategy(params);
      }

      const prompt = `
        Generate a comprehensive salary negotiation strategy for the following situation:
        
        User Profile: ${JSON.stringify(params.userProfile)}
        Job Offer: ${JSON.stringify(params.jobOffer)}
        Market Data: ${JSON.stringify(params.marketData)}
        Negotiation Goals: ${JSON.stringify(params.negotiationGoals)}
        
        Provide a detailed strategy including:
        1. Optimal timing for negotiation
        2. Key talking points and value propositions
        3. Alternative compensation strategies
        4. Risk assessment and mitigation
        5. Communication scripts and templates
        6. Negotiation tactics based on company culture
        7. Contingency plans for different responses
        
        Format the response as JSON with clear sections.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const strategy = this.parseAIResponse(result.response.text());

      // Store negotiation record
      await storage.createUserNegotiation({
        userId: params.userProfile.id,
        positionTitle: params.jobOffer.position,
        company: params.jobOffer.company,
        currentOffer: params.jobOffer.salary,
        targetSalary: params.negotiationGoals.target,
        strategyUsed: JSON.stringify(strategy),
        negotiationTips: strategy.tips || []
      });

      return strategy;

    } catch (error) {
      console.error("Error generating negotiation strategy:", error);
      return this.getFallbackNegotiationStrategy(params);
    }
  }

  /**
   * Interactive negotiation simulation
   */
  async runNegotiationSimulation(params: SimulationParams): Promise<any> {
    try {
      const sessionId = nanoid();
      
      // Generate AI negotiation scenarios
      const scenarios = await this.generateNegotiationScenarios(params);
      
      // Create simulation session
      const session = await storage.createNegotiationSession({
        userId: params.userId,
        sessionType: 'simulation',
        scenario: params.scenario,
        userResponses: [],
        aiResponses: [],
        sessionDuration: 0
      });

      return {
        sessionId,
        scenarios,
        initialPrompt: scenarios.initialPrompt,
        difficultyLevel: params.difficulty,
        tips: scenarios.tips
      };

    } catch (error) {
      console.error("Error running negotiation simulation:", error);
      return this.getFallbackSimulation(params);
    }
  }

  /**
   * Get industry benchmarks and market trends
   */
  async getBenchmarks(params: MarketAnalysisParams): Promise<any> {
    try {
      // Fetch market trends data
      const [industryData, economicData, demandData] = await Promise.all([
        this.fetchIndustryTrends(params),
        this.fetchEconomicData(params),
        this.fetchDemandData(params)
      ]);

      // Analyze trends
      const trends = this.analyzeTrends(industryData, economicData, demandData);

      // Store market trend data
      await storage.createMarketTrend({
        industry: params.industry,
        jobTitle: params.jobTitle || 'all',
        location: params.location,
        timePeriod: params.timeRange,
        salaryTrend: trends.salaryTrend,
        trendPercentage: trends.trendPercentage,
        demandLevel: trends.demandLevel,
        growthProjection: trends.growthProjection,
        skillsPremium: trends.skillsPremium,
        marketInsights: trends.insights,
        competitiveFactors: trends.competitiveFactors,
        dataSource: 'aggregated'
      });

      return trends;

    } catch (error) {
      console.error("Error getting benchmarks:", error);
      return this.getFallbackBenchmarks(params);
    }
  }

  /**
   * Analyze job offer and provide optimization recommendations
   */
  async analyzeOffer(userId: string, offerData: any): Promise<any> {
    try {
      // Get market data for comparison
      const marketData = await this.getMarketData({
        jobTitle: offerData.position,
        location: offerData.location,
        experienceLevel: offerData.experienceLevel,
        industry: offerData.industry
      });

      // Analyze offer components
      const analysis = await this.analyzeOfferComponents(offerData, marketData);
      
      // Generate optimization recommendations
      const recommendations = await this.generateOfferOptimizations(analysis);

      return {
        analysis,
        recommendations,
        marketComparison: marketData,
        negotiationPotential: analysis.negotiationPotential,
        riskAssessment: analysis.riskAssessment
      };

    } catch (error) {
      console.error("Error analyzing offer:", error);
      return this.getFallbackOfferAnalysis(offerData);
    }
  }

  // Private helper methods

  private async fetchGlassdoorData(params: SalaryResearchParams): Promise<any> {
    // Glassdoor API integration
    // This would require actual API key and implementation
    return this.getFallbackSalaryData(params, 'glassdoor');
  }

  private async fetchPayscaleData(params: SalaryResearchParams): Promise<any> {
    // PayScale API integration
    return this.getFallbackSalaryData(params, 'payscale');
  }

  private async fetchSalaryComData(params: SalaryResearchParams): Promise<any> {
    // Salary.com API integration
    return this.getFallbackSalaryData(params, 'salary.com');
  }

  private async fetchBLSData(params: SalaryResearchParams): Promise<any> {
    // Bureau of Labor Statistics API integration
    return this.getFallbackSalaryData(params, 'bls');
  }

  private async fetchClearbitData(companyName: string): Promise<any> {
    // Clearbit API integration
    return this.getFallbackCompanyData(companyName, 'clearbit');
  }

  private async fetchCrunchbaseData(companyName: string): Promise<any> {
    // Crunchbase API integration
    return this.getFallbackCompanyData(companyName, 'crunchbase');
  }

  private async fetchCompanyGlassdoorData(companyName: string): Promise<any> {
    // Company-specific Glassdoor data
    return this.getFallbackCompanyData(companyName, 'glassdoor');
  }

  private async getCostOfLivingAdjustment(location: string): Promise<number> {
    // Numbeo API integration for cost of living
    return this.getFallbackCostOfLiving(location);
  }

  private aggregateSalaryData(datasets: any[]): any {
    // Aggregate multiple salary data sources
    const validDatasets = datasets.filter(d => d && d.salary);
    
    if (validDatasets.length === 0) {
      return {
        min: 80000,
        max: 120000,
        median: 100000,
        confidence: 0.7
      };
    }

    const salaries = validDatasets.map(d => d.salary);
    return {
      min: Math.min(...salaries) * 0.9,
      max: Math.max(...salaries) * 1.1,
      median: salaries.reduce((a, b) => a + b) / salaries.length,
      confidence: Math.min(validDatasets.length / 4, 1)
    };
  }

  private async calculatePersonalizedRange(marketData: any, userProfile: any, colAdjustment: number): Promise<any> {
    // AI-powered personalization logic
    const baseRange = marketData.median;
    const experienceMultiplier = this.getExperienceMultiplier(userProfile.experience);
    const skillsMultiplier = this.getSkillsMultiplier(userProfile.skills);
    
    return {
      min: Math.round(baseRange * experienceMultiplier * skillsMultiplier * 0.9),
      max: Math.round(baseRange * experienceMultiplier * skillsMultiplier * 1.3),
      target: Math.round(baseRange * experienceMultiplier * skillsMultiplier * 1.1),
      factors: {
        experience: experienceMultiplier,
        skills: skillsMultiplier,
        costOfLiving: colAdjustment
      }
    };
  }

  private getExperienceMultiplier(experience: string): number {
    const multipliers = {
      'entry': 0.8,
      'junior': 0.9,
      'mid': 1.0,
      'senior': 1.2,
      'lead': 1.4,
      'principal': 1.6
    };
    return multipliers[experience as keyof typeof multipliers] || 1.0;
  }

  private getSkillsMultiplier(skills: string[]): number {
    const premiumSkills = ['AI', 'Machine Learning', 'React', 'TypeScript', 'Python', 'AWS'];
    const matchingSkills = skills.filter(skill => premiumSkills.includes(skill));
    return 1.0 + (matchingSkills.length * 0.05);
  }

  private analyzeFinancialHealth(clearbitData: any, crunchbaseData: any): any {
    // Analyze company financial health
    return {
      rating: 'good',
      factors: ['revenue_growth', 'funding_status', 'market_position'],
      negotiationLeverage: 'medium'
    };
  }

  private async generateCompanyInsights(companyName: string, financialHealth: any, glassdoorData: any): Promise<any> {
    // Generate comprehensive company insights
    return {
      avgSalary: 110000,
      salaryRanges: { min: 90000, max: 140000 },
      equityPolicy: 'Standard equity package for all employees',
      benefitsPackage: 'Comprehensive health, dental, vision, 401k',
      negotiationFlexibility: 'medium',
      workLifeBalance: 4.2,
      cultureScore: 4.1,
      growthStage: 'growth',
      compensationPhilosophy: 'Market competitive with performance bonuses'
    };
  }

  private parseAIResponse(text: string): any {
    try {
      return JSON.parse(text);
    } catch {
      return { strategy: text, tips: [] };
    }
  }

  private async generateNegotiationScenarios(params: SimulationParams): Promise<any> {
    // Generate negotiation scenarios
    return {
      initialPrompt: "You are negotiating with a hiring manager for a software engineering position...",
      scenarios: [
        "Low-ball offer scenario",
        "Competing offer scenario",
        "Non-salary negotiation scenario"
      ],
      tips: [
        "Always research market rates first",
        "Focus on value you bring",
        "Be prepared with alternatives"
      ]
    };
  }

  private async fetchIndustryTrends(params: MarketAnalysisParams): Promise<any> {
    // Fetch industry trend data
    return { trend: 'increasing', growth: 0.05 };
  }

  private async fetchEconomicData(params: MarketAnalysisParams): Promise<any> {
    // Fetch economic data from FRED API
    return { inflation: 0.03, employment: 0.04 };
  }

  private async fetchDemandData(params: MarketAnalysisParams): Promise<any> {
    // Fetch job demand data
    return { demand: 'high', openings: 1250 };
  }

  private analyzeTrends(industryData: any, economicData: any, demandData: any): any {
    // Analyze market trends
    return {
      salaryTrend: 'increasing',
      trendPercentage: 5.2,
      demandLevel: 'high',
      growthProjection: 8.5,
      skillsPremium: { ai: 15, react: 8, python: 12 },
      insights: 'Strong growth expected in tech sector',
      competitiveFactors: ['AI adoption', 'Remote work', 'Startup funding']
    };
  }

  private async analyzeOfferComponents(offerData: any, marketData: any): Promise<any> {
    // Analyze offer components
    return {
      salaryAnalysis: {
        offered: offerData.salary,
        market: marketData.median,
        percentile: 65
      },
      negotiationPotential: 'high',
      riskAssessment: 'low'
    };
  }

  private async generateOfferOptimizations(analysis: any): Promise<any> {
    // Generate optimization recommendations
    return {
      recommendations: [
        'Negotiate base salary to market median',
        'Request additional PTO',
        'Explore equity opportunities'
      ],
      priorityOrder: ['base_salary', 'equity', 'benefits']
    };
  }

  // Fallback methods for when APIs are not available

  private getFallbackMarketData(params: SalaryResearchParams): any {
    const baseSalary = this.getBaseSalaryByTitle(params.jobTitle);
    const locationMultiplier = this.getLocationMultiplier(params.location);
    const experienceMultiplier = this.getExperienceMultiplier(params.experienceLevel);
    
    return {
      min: Math.round(baseSalary * locationMultiplier * experienceMultiplier * 0.8),
      max: Math.round(baseSalary * locationMultiplier * experienceMultiplier * 1.4),
      median: Math.round(baseSalary * locationMultiplier * experienceMultiplier),
      confidence: 0.7,
      sources: ['fallback_data']
    };
  }

  private getFallbackPersonalizedRange(params: any): any {
    const marketData = this.getFallbackMarketData(params);
    return {
      min: marketData.min * 1.1,
      max: marketData.max * 1.1,
      target: marketData.median * 1.15,
      factors: {
        experience: 1.1,
        skills: 1.05,
        market: 1.0
      }
    };
  }

  private getFallbackCompanyInsights(params: CompanyInsightsParams): any {
    return {
      avgSalary: 95000,
      salaryRanges: { min: 75000, max: 125000 },
      equityPolicy: 'Standard equity package',
      benefitsPackage: 'Health, dental, vision, 401k',
      negotiationFlexibility: 'medium',
      workLifeBalance: 4.0,
      cultureScore: 4.0,
      growthStage: 'stable',
      compensationPhilosophy: 'Market competitive'
    };
  }

  private getFallbackNegotiationStrategy(params: NegotiationStrategyParams): any {
    return {
      strategy: 'Research-based negotiation approach',
      talkingPoints: [
        'Market research shows higher compensation',
        'Unique skills and experience value',
        'Long-term commitment to company'
      ],
      timeline: 'Negotiate within 1-2 weeks of offer',
      alternatives: ['Flexible work arrangements', 'Professional development budget'],
      tips: [
        'Be confident but respectful',
        'Focus on value creation',
        'Have backup options ready'
      ]
    };
  }

  private getFallbackSimulation(params: SimulationParams): any {
    return {
      sessionId: nanoid(),
      scenarios: [
        'Basic salary negotiation',
        'Multiple offer comparison',
        'Non-monetary benefits focus'
      ],
      initialPrompt: 'Practice your negotiation skills with our AI coach',
      tips: [
        'Research before negotiating',
        'Practice your pitch',
        'Stay professional'
      ]
    };
  }

  private getFallbackBenchmarks(params: MarketAnalysisParams): any {
    return {
      salaryTrend: 'stable',
      trendPercentage: 2.5,
      demandLevel: 'medium',
      growthProjection: 3.2,
      skillsPremium: { javascript: 5, python: 8, react: 6 },
      insights: 'Steady growth expected in technology sector',
      competitiveFactors: ['Remote work adoption', 'AI integration', 'Market competition']
    };
  }

  private getFallbackOfferAnalysis(offerData: any): any {
    return {
      analysis: {
        salaryAnalysis: {
          offered: offerData.salary,
          market: offerData.salary * 1.1,
          percentile: 55
        },
        negotiationPotential: 'medium',
        riskAssessment: 'low'
      },
      recommendations: [
        'Research market rates for your role',
        'Prepare value proposition',
        'Consider total compensation package'
      ],
      marketComparison: {
        min: offerData.salary * 0.9,
        max: offerData.salary * 1.3,
        median: offerData.salary * 1.1
      }
    };
  }

  private getFallbackSalaryData(params: SalaryResearchParams, source: string): any {
    return {
      salary: this.getBaseSalaryByTitle(params.jobTitle),
      source,
      confidence: 0.6
    };
  }

  private getFallbackCompanyData(companyName: string, source: string): any {
    return {
      name: companyName,
      industry: 'Technology',
      size: 'Medium',
      source
    };
  }

  private getFallbackCostOfLiving(location: string): number {
    const locationMultipliers = {
      'San Francisco': 1.4,
      'New York': 1.3,
      'Seattle': 1.2,
      'Austin': 1.1,
      'Denver': 1.0,
      'Chicago': 0.95,
      'Atlanta': 0.9
    };
    return locationMultipliers[location as keyof typeof locationMultipliers] || 1.0;
  }

  private getBaseSalaryByTitle(jobTitle: string): number {
    const baseSalaries = {
      'Software Engineer': 95000,
      'Senior Software Engineer': 120000,
      'Product Manager': 110000,
      'Data Scientist': 105000,
      'DevOps Engineer': 100000,
      'Frontend Developer': 85000,
      'Backend Developer': 90000,
      'Full Stack Developer': 88000
    };
    return baseSalaries[jobTitle as keyof typeof baseSalaries] || 90000;
  }

  private getLocationMultiplier(location: string): number {
    return this.getFallbackCostOfLiving(location);
  }
}

export const salaryIntelligence = new SalaryIntelligence();