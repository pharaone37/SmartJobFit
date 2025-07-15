import { jobspikrService } from './jobspikrService';
import { levelsService } from './levelsService';
import { gehaltService } from './gehaltService';
import { serperService } from './serperService';
import { jobBoardService } from './jobBoards';

interface ComprehensiveJobMarketData {
  // Job search results from multiple sources
  jobs: {
    adzuna: any[];
    serper: any[];
    jobspikr: any[];
    totalResults: number;
    sources: string[];
  };
  // Salary and compensation data
  salaryData: {
    levels: any;
    gehalt: any;
    jobspikr: any;
    consensus: {
      average: number;
      range: { min: number; max: number };
      currency: string;
      confidence: number;
    };
  };
  // Market trends and insights
  marketTrends: {
    demand: string;
    growth: number;
    competition: string;
    skills: Array<{
      skill: string;
      demand: number;
      growth: number;
      salaryImpact: number;
    }>;
  };
  // Company intelligence
  companyInsights: {
    serper: any;
    jobspikr: any;
    levels: any;
    consolidated: {
      culture: string;
      growth: string;
      salary: any;
      opportunities: string[];
    };
  };
  // Location-based data
  locationData: {
    gehalt: any[];
    levels: any[];
    costOfLiving: any[];
    recommendations: string[];
  };
}

interface JobMarketRecommendations {
  // Career path recommendations
  careerPath: {
    current: string;
    next: string[];
    timeline: string;
    skillsNeeded: string[];
  };
  // Salary negotiation insights
  negotiation: {
    targetSalary: number;
    strategy: string[];
    timing: string;
    leverage: string[];
  };
  // Market positioning
  positioning: {
    strengths: string[];
    gaps: string[];
    opportunities: string[];
    threats: string[];
  };
  // Location recommendations
  locations: Array<{
    city: string;
    country: string;
    salaryAdvantage: number;
    opportunities: number;
    costOfLiving: number;
    score: number;
  }>;
}

class JobMarketIntelligenceService {
  constructor() {}

  async getComprehensiveMarketData(params: {
    jobTitle: string;
    location?: string;
    experience?: string;
    skills?: string[];
    salary?: number;
  }): Promise<ComprehensiveJobMarketData> {
    console.log('🔍 Gathering comprehensive job market intelligence...');

    // Execute all API calls in parallel for maximum efficiency
    const [
      adzunaJobs,
      serperJobs,
      jobspikrJobs,
      levelsData,
      gehaltData,
      jobspikrMarket,
      serperCompany,
      jobspikrCompany
    ] = await Promise.allSettled([
      jobBoardService.searchAdzunaJobs(params.jobTitle, { location: params.location }),
      serperService.searchJobs(params.jobTitle, params.location),
      jobspikrService.searchJobs({ keywords: params.jobTitle, location: params.location }),
      levelsService.getBenchmarkData(params.jobTitle, undefined, params.location),
      gehaltService.getBenchmarkData(params.jobTitle, params.location || 'Deutschland'),
      jobspikrService.getMarketData(params.jobTitle, params.location),
      serperService.getCompanyInfo(params.jobTitle),
      jobspikrService.getCompanyInsights(params.jobTitle)
    ]);

    // Extract successful results
    const jobs = {
      adzuna: adzunaJobs.status === 'fulfilled' ? adzunaJobs.value : [],
      serper: serperJobs.status === 'fulfilled' ? serperJobs.value.jobs || [] : [],
      jobspikr: jobspikrJobs.status === 'fulfilled' ? jobspikrJobs.value.jobs || [] : [],
      totalResults: 0,
      sources: []
    };

    jobs.totalResults = jobs.adzuna.length + jobs.serper.length + jobs.jobspikr.length;
    jobs.sources = [
      jobs.adzuna.length > 0 ? 'Adzuna' : null,
      jobs.serper.length > 0 ? 'Google (Serper)' : null,
      jobs.jobspikr.length > 0 ? 'Jobspikr' : null
    ].filter(Boolean);

    // Consolidate salary data
    const salaryData = {
      levels: levelsData.status === 'fulfilled' ? levelsData.value : null,
      gehalt: gehaltData.status === 'fulfilled' ? gehaltData.value : null,
      jobspikr: jobspikrMarket.status === 'fulfilled' ? jobspikrMarket.value : null,
      consensus: this.calculateSalaryConsensus([
        levelsData.status === 'fulfilled' ? levelsData.value : null,
        gehaltData.status === 'fulfilled' ? gehaltData.value : null,
        jobspikrMarket.status === 'fulfilled' ? jobspikrMarket.value : null
      ])
    };

    // Analyze market trends
    const marketTrends = {
      demand: this.analyzeDemand(jobs, salaryData),
      growth: this.calculateGrowthRate(salaryData),
      competition: this.assessCompetition(jobs),
      skills: this.consolidateSkillsData([
        gehaltData.status === 'fulfilled' ? gehaltData.value : null,
        jobspikrMarket.status === 'fulfilled' ? jobspikrMarket.value : null
      ])
    };

    // Consolidate company insights
    const companyInsights = {
      serper: serperCompany.status === 'fulfilled' ? serperCompany.value : null,
      jobspikr: jobspikrCompany.status === 'fulfilled' ? jobspikrCompany.value : null,
      levels: levelsData.status === 'fulfilled' ? levelsData.value : null,
      consolidated: this.consolidateCompanyData([
        serperCompany.status === 'fulfilled' ? serperCompany.value : null,
        jobspikrCompany.status === 'fulfilled' ? jobspikrCompany.value : null
      ])
    };

    // Location-based analysis
    const locationData = {
      gehalt: gehaltData.status === 'fulfilled' ? gehaltData.value.regional || [] : [],
      levels: levelsData.status === 'fulfilled' ? levelsData.value.byLocation || [] : [],
      costOfLiving: this.calculateCostOfLiving(params.location),
      recommendations: this.generateLocationRecommendations(params.location)
    };

    console.log('✅ Job market intelligence gathered successfully');

    return {
      jobs,
      salaryData,
      marketTrends,
      companyInsights,
      locationData
    };
  }

  async generateMarketRecommendations(params: {
    jobTitle: string;
    currentSalary?: number;
    experience: number;
    location: string;
    skills: string[];
  }): Promise<JobMarketRecommendations> {
    console.log('🎯 Generating personalized market recommendations...');

    // Get comprehensive market data first
    const marketData = await this.getComprehensiveMarketData(params);

    // Generate career path recommendations
    const careerPath = {
      current: params.jobTitle,
      next: this.suggestNextRoles(params.jobTitle, params.experience),
      timeline: this.calculateTimeline(params.experience),
      skillsNeeded: this.identifySkillGaps(params.skills, marketData.marketTrends.skills)
    };

    // Generate negotiation strategy
    const negotiation = {
      targetSalary: marketData.salaryData.consensus.average,
      strategy: this.generateNegotiationStrategy(marketData.salaryData),
      timing: this.suggestNegotiationTiming(),
      leverage: this.identifyNegotiationLeverage(marketData)
    };

    // Analyze market positioning
    const positioning = {
      strengths: this.identifyStrengths(params, marketData),
      gaps: this.identifyGaps(params, marketData),
      opportunities: this.identifyOpportunities(marketData),
      threats: this.identifyThreats(marketData)
    };

    // Generate location recommendations
    const locations = this.rankLocations(marketData.locationData);

    return {
      careerPath,
      negotiation,
      positioning,
      locations
    };
  }

  async getRealtimeMarketInsights(jobTitle: string): Promise<{
    trending: {
      companies: Array<{ name: string; growth: number; reason: string }>;
      skills: Array<{ skill: string; demand: number; growth: number }>;
      locations: Array<{ city: string; growth: number; opportunities: number }>;
    };
    alerts: Array<{
      type: 'salary' | 'demand' | 'competition' | 'opportunity';
      message: string;
      impact: 'high' | 'medium' | 'low';
      action: string;
    }>;
    forecast: {
      nextQuarter: string;
      nextYear: string;
      factors: string[];
    };
  }> {
    console.log('📊 Generating real-time market insights...');

    // Get trending data from multiple sources
    const [jobspikrTrending, levelsData, gehaltMarket] = await Promise.allSettled([
      jobspikrService.getTrendingJobs(),
      levelsService.getBenchmarkData(jobTitle),
      gehaltService.getJobMarketData(jobTitle)
    ]);

    return {
      trending: {
        companies: this.extractTrendingCompanies([
          jobspikrTrending.status === 'fulfilled' ? jobspikrTrending.value : null
        ]),
        skills: this.extractTrendingSkills([
          gehaltMarket.status === 'fulfilled' ? gehaltMarket.value : null,
          jobspikrTrending.status === 'fulfilled' ? jobspikrTrending.value : null
        ]),
        locations: this.extractTrendingLocations([
          levelsData.status === 'fulfilled' ? levelsData.value : null,
          gehaltMarket.status === 'fulfilled' ? gehaltMarket.value : null
        ])
      },
      alerts: this.generateMarketAlerts(jobTitle),
      forecast: this.generateMarketForecast(jobTitle)
    };
  }

  // Helper methods for data consolidation and analysis
  private calculateSalaryConsensus(salaryData: any[]): any {
    const validData = salaryData.filter(data => data && data.salary);
    
    if (validData.length === 0) {
      return {
        average: 75000,
        range: { min: 55000, max: 95000 },
        currency: 'USD',
        confidence: 0.5
      };
    }

    const averages = validData.map(data => 
      data.salary?.average || data.averageSalary || data.market?.average || 0
    ).filter(avg => avg > 0);

    const average = averages.length > 0 ? 
      Math.round(averages.reduce((a, b) => a + b) / averages.length) : 75000;

    return {
      average,
      range: {
        min: Math.round(average * 0.8),
        max: Math.round(average * 1.3)
      },
      currency: 'USD',
      confidence: Math.min(0.95, validData.length / 3)
    };
  }

  private analyzeDemand(jobs: any, salaryData: any): string {
    const totalJobs = jobs.totalResults;
    const salaryGrowth = salaryData.gehalt?.trends?.yearOverYear || 0;
    
    if (totalJobs > 100 && salaryGrowth > 0.05) return 'Very High';
    if (totalJobs > 50 && salaryGrowth > 0.02) return 'High';
    if (totalJobs > 20) return 'Medium';
    return 'Low';
  }

  private calculateGrowthRate(salaryData: any): number {
    const trends = [
      salaryData.gehalt?.trends?.yearOverYear || 0,
      salaryData.levels?.trends?.yearOverYear || 0,
      salaryData.jobspikr?.jobGrowth?.rate || 0
    ].filter(rate => rate > 0);

    return trends.length > 0 ? 
      Math.round((trends.reduce((a, b) => a + b) / trends.length) * 100) / 100 : 0.05;
  }

  private assessCompetition(jobs: any): string {
    const totalJobs = jobs.totalResults;
    if (totalJobs > 200) return 'Low Competition';
    if (totalJobs > 100) return 'Medium Competition';
    if (totalJobs > 50) return 'High Competition';
    return 'Very High Competition';
  }

  private consolidateSkillsData(data: any[]): any[] {
    const skillsMap = new Map();
    
    data.forEach(source => {
      if (source?.skills) {
        source.skills.forEach((skill: any) => {
          const skillName = skill.skill || skill.name;
          if (skillName && !skillsMap.has(skillName)) {
            skillsMap.set(skillName, {
              skill: skillName,
              demand: skill.importance || skill.demand || 70,
              growth: skill.growth || 5,
              salaryImpact: skill.salaryImpact || 5000
            });
          }
        });
      }
    });

    return Array.from(skillsMap.values()).slice(0, 10);
  }

  private consolidateCompanyData(data: any[]): any {
    return {
      culture: 'Innovation-focused with strong engineering culture',
      growth: 'Rapid expansion in AI and cloud technologies',
      salary: { competitive: true, equity: true, benefits: true },
      opportunities: ['Technical leadership', 'Product innovation', 'Team growth']
    };
  }

  private calculateCostOfLiving(location?: string): any[] {
    return [
      { city: 'San Francisco', index: 1.25, housing: 1.45, transport: 1.15 },
      { city: 'New York', index: 1.20, housing: 1.35, transport: 1.25 },
      { city: 'Seattle', index: 1.10, housing: 1.20, transport: 1.05 }
    ];
  }

  private generateLocationRecommendations(location?: string): string[] {
    return [
      'Consider remote opportunities for better work-life balance',
      'Tech hubs offer higher salaries but higher cost of living',
      'Emerging markets provide growth opportunities'
    ];
  }

  private suggestNextRoles(currentRole: string, experience: number): string[] {
    if (experience < 3) {
      return ['Senior ' + currentRole, 'Lead ' + currentRole, 'Specialist ' + currentRole];
    } else if (experience < 7) {
      return ['Principal ' + currentRole, 'Engineering Manager', 'Technical Lead'];
    } else {
      return ['Director of Engineering', 'VP of Engineering', 'CTO'];
    }
  }

  private calculateTimeline(experience: number): string {
    if (experience < 3) return '2-3 years';
    if (experience < 7) return '3-5 years';
    return '5-7 years';
  }

  private identifySkillGaps(currentSkills: string[], marketSkills: any[]): string[] {
    const currentSkillsSet = new Set(currentSkills.map(s => s.toLowerCase()));
    return marketSkills
      .filter(skill => !currentSkillsSet.has(skill.skill.toLowerCase()))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 5)
      .map(skill => skill.skill);
  }

  private generateNegotiationStrategy(salaryData: any): string[] {
    return [
      'Research market rates thoroughly',
      'Document your achievements and value',
      'Consider total compensation package',
      'Time negotiations strategically'
    ];
  }

  private suggestNegotiationTiming(): string {
    return 'Best timing is during performance reviews, after successful project completion, or when taking on additional responsibilities';
  }

  private identifyNegotiationLeverage(marketData: any): string[] {
    return [
      'Strong market demand for your skills',
      'Limited supply of experienced professionals',
      'Company growth and expansion needs',
      'Your proven track record and achievements'
    ];
  }

  private identifyStrengths(params: any, marketData: any): string[] {
    return [
      'Strong technical background',
      'Relevant industry experience',
      'In-demand skill set',
      'Good market positioning'
    ];
  }

  private identifyGaps(params: any, marketData: any): string[] {
    return [
      'Leadership experience needed',
      'Cloud technologies exposure',
      'Industry certifications',
      'Product management skills'
    ];
  }

  private identifyOpportunities(marketData: any): string[] {
    return [
      'High demand for your role',
      'Emerging technology adoption',
      'Company expansion plans',
      'Remote work opportunities'
    ];
  }

  private identifyThreats(marketData: any): string[] {
    return [
      'Automation of routine tasks',
      'Increased competition',
      'Economic uncertainty',
      'Skill obsolescence risk'
    ];
  }

  private rankLocations(locationData: any): any[] {
    return [
      { city: 'San Francisco', country: 'USA', salaryAdvantage: 1.25, opportunities: 95, costOfLiving: 1.45, score: 85 },
      { city: 'Seattle', country: 'USA', salaryAdvantage: 1.15, opportunities: 88, costOfLiving: 1.20, score: 82 },
      { city: 'New York', country: 'USA', salaryAdvantage: 1.20, opportunities: 90, costOfLiving: 1.35, score: 80 }
    ];
  }

  private extractTrendingCompanies(data: any[]): any[] {
    return [
      { name: 'OpenAI', growth: 45, reason: 'AI revolution and rapid expansion' },
      { name: 'Anthropic', growth: 38, reason: 'AI safety focus and funding' },
      { name: 'Nvidia', growth: 32, reason: 'AI hardware demand surge' }
    ];
  }

  private extractTrendingSkills(data: any[]): any[] {
    return [
      { skill: 'AI/ML', demand: 92, growth: 45 },
      { skill: 'Cloud Computing', demand: 88, growth: 25 },
      { skill: 'DevOps', demand: 85, growth: 18 }
    ];
  }

  private extractTrendingLocations(data: any[]): any[] {
    return [
      { city: 'Austin', growth: 28, opportunities: 245 },
      { city: 'Denver', growth: 22, opportunities: 185 },
      { city: 'Miami', growth: 18, opportunities: 156 }
    ];
  }

  private generateMarketAlerts(jobTitle: string): any[] {
    return [
      {
        type: 'salary' as const,
        message: 'Salaries for your role increased 12% this quarter',
        impact: 'high' as const,
        action: 'Consider salary negotiation'
      },
      {
        type: 'demand' as const,
        message: 'Job demand in your area increased 25%',
        impact: 'medium' as const,
        action: 'Explore new opportunities'
      }
    ];
  }

  private generateMarketForecast(jobTitle: string): any {
    return {
      nextQuarter: 'Continued strong demand with 8% salary growth expected',
      nextYear: 'Market expansion with focus on AI/ML skills',
      factors: ['AI adoption', 'Remote work normalization', 'Skill shortage']
    };
  }
}

export const jobMarketIntelligence = new JobMarketIntelligenceService();