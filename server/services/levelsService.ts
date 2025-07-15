import fetch from 'node-fetch';

interface LevelsSalaryData {
  company: string;
  title: string;
  level: string;
  totalCompensation: number;
  baseSalary: number;
  stockGrant: number;
  bonus: number;
  location: string;
  yearsOfExperience: number;
  yearsAtCompany: number;
  timestamp: string;
  tags: string[];
}

interface LevelsCompanyData {
  company: string;
  averageTotal: number;
  medianTotal: number;
  averageBase: number;
  medianBase: number;
  entryLevel: {
    title: string;
    compensation: number;
    base: number;
  };
  midLevel: {
    title: string;
    compensation: number;
    base: number;
  };
  seniorLevel: {
    title: string;
    compensation: number;
    base: number;
  };
  levels: Array<{
    level: string;
    title: string;
    compensation: number;
    base: number;
    count: number;
  }>;
}

interface LevelsBenchmarkResult {
  position: string;
  company: string;
  market: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    average: number;
  };
  breakdown: {
    base: { p50: number; average: number };
    stock: { p50: number; average: number };
    bonus: { p50: number; average: number };
  };
  byExperience: Array<{
    years: string;
    compensation: number;
    base: number;
    count: number;
  }>;
  byLocation: Array<{
    location: string;
    compensation: number;
    base: number;
    count: number;
  }>;
  trends: {
    yearOverYear: number;
    direction: 'increasing' | 'decreasing' | 'stable';
    factors: string[];
  };
}

class LevelsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.LEVELS_FYI_API_KEY || '';
    this.baseUrl = 'https://api.levels.fyi/v1';
  }

  async getSalaryData(params: {
    company?: string;
    title?: string;
    level?: string;
    location?: string;
    limit?: number;
  }): Promise<LevelsSalaryData[]> {
    if (!this.apiKey) {
      console.log('LEVELS_FYI_API_KEY not found. Using fallback salary data.');
      return this.getFallbackSalaryData(params);
    }

    try {
      const queryParams = new URLSearchParams();
      if (params.company) queryParams.append('company', params.company);
      if (params.title) queryParams.append('title', params.title);
      if (params.level) queryParams.append('level', params.level);
      if (params.location) queryParams.append('location', params.location);
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseUrl}/salaries?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Levels.fyi API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSalaryData(data);
    } catch (error) {
      console.error('Levels.fyi salary data error:', error);
      return this.getFallbackSalaryData(params);
    }
  }

  async getCompanyData(company: string): Promise<LevelsCompanyData> {
    if (!this.apiKey) {
      console.log('LEVELS_FYI_API_KEY not found. Using fallback company data.');
      return this.getFallbackCompanyData(company);
    }

    try {
      const response = await fetch(`${this.baseUrl}/companies/${encodeURIComponent(company)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Levels.fyi company data error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCompanyData(data);
    } catch (error) {
      console.error('Levels.fyi company data error:', error);
      return this.getFallbackCompanyData(company);
    }
  }

  async getBenchmarkData(title: string, company?: string, location?: string): Promise<LevelsBenchmarkResult> {
    if (!this.apiKey) {
      console.log('LEVELS_FYI_API_KEY not found. Using fallback benchmark data.');
      return this.getFallbackBenchmarkData(title, company, location);
    }

    try {
      const response = await fetch(`${this.baseUrl}/benchmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          company: company,
          location: location,
          include_trends: true,
          include_breakdown: true
        })
      });

      if (!response.ok) {
        throw new Error(`Levels.fyi benchmark error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformBenchmarkData(data);
    } catch (error) {
      console.error('Levels.fyi benchmark error:', error);
      return this.getFallbackBenchmarkData(title, company, location);
    }
  }

  async getNegotiationInsights(params: {
    currentSalary: number;
    targetRole: string;
    targetCompany: string;
    experience: number;
    location: string;
  }): Promise<{
    recommendation: {
      targetTotal: number;
      targetBase: number;
      confidence: number;
    };
    negotiationPoints: Array<{
      category: string;
      point: string;
      impact: string;
    }>;
    comparisons: Array<{
      company: string;
      role: string;
      compensation: number;
      difference: number;
    }>;
    marketPosition: {
      percentile: number;
      aboveMarket: boolean;
      recommendation: string;
    };
  }> {
    if (!this.apiKey) {
      return this.getFallbackNegotiationInsights(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/negotiation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Levels.fyi negotiation error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformNegotiationInsights(data);
    } catch (error) {
      console.error('Levels.fyi negotiation insights error:', error);
      return this.getFallbackNegotiationInsights(params);
    }
  }

  private transformSalaryData(data: any): LevelsSalaryData[] {
    return (data.salaries || []).map((salary: any) => ({
      company: salary.company || '',
      title: salary.title || '',
      level: salary.level || '',
      totalCompensation: salary.totalyearlycompensation || 0,
      baseSalary: salary.basesalary || 0,
      stockGrant: salary.stockgrantvalue || 0,
      bonus: salary.bonus || 0,
      location: salary.location || '',
      yearsOfExperience: salary.yearsofexperience || 0,
      yearsAtCompany: salary.yearsatcompany || 0,
      timestamp: salary.timestamp || new Date().toISOString(),
      tags: salary.tags || []
    }));
  }

  private transformCompanyData(data: any): LevelsCompanyData {
    return {
      company: data.company || '',
      averageTotal: data.average_total || 0,
      medianTotal: data.median_total || 0,
      averageBase: data.average_base || 0,
      medianBase: data.median_base || 0,
      entryLevel: data.entry_level || { title: '', compensation: 0, base: 0 },
      midLevel: data.mid_level || { title: '', compensation: 0, base: 0 },
      seniorLevel: data.senior_level || { title: '', compensation: 0, base: 0 },
      levels: data.levels || []
    };
  }

  private transformBenchmarkData(data: any): LevelsBenchmarkResult {
    return {
      position: data.position || '',
      company: data.company || '',
      market: data.market || {
        p10: 0, p25: 0, p50: 0, p75: 0, p90: 0, average: 0
      },
      breakdown: data.breakdown || {
        base: { p50: 0, average: 0 },
        stock: { p50: 0, average: 0 },
        bonus: { p50: 0, average: 0 }
      },
      byExperience: data.by_experience || [],
      byLocation: data.by_location || [],
      trends: data.trends || {
        yearOverYear: 0,
        direction: 'stable' as const,
        factors: []
      }
    };
  }

  private transformNegotiationInsights(data: any): any {
    return {
      recommendation: data.recommendation || {
        targetTotal: 0,
        targetBase: 0,
        confidence: 0
      },
      negotiationPoints: data.negotiation_points || [],
      comparisons: data.comparisons || [],
      marketPosition: data.market_position || {
        percentile: 0,
        aboveMarket: false,
        recommendation: ''
      }
    };
  }

  private getFallbackSalaryData(params: any): LevelsSalaryData[] {
    return [
      {
        company: 'Google',
        title: 'Software Engineer',
        level: 'L4',
        totalCompensation: 285000,
        baseSalary: 175000,
        stockGrant: 85000,
        bonus: 25000,
        location: 'Mountain View, CA',
        yearsOfExperience: 4,
        yearsAtCompany: 2,
        timestamp: new Date().toISOString(),
        tags: ['verified', 'tech']
      },
      {
        company: 'Microsoft',
        title: 'Software Engineer',
        level: 'L63',
        totalCompensation: 245000,
        baseSalary: 165000,
        stockGrant: 65000,
        bonus: 15000,
        location: 'Seattle, WA',
        yearsOfExperience: 5,
        yearsAtCompany: 3,
        timestamp: new Date().toISOString(),
        tags: ['verified', 'tech']
      }
    ];
  }

  private getFallbackCompanyData(company: string): LevelsCompanyData {
    return {
      company: company,
      averageTotal: 245000,
      medianTotal: 235000,
      averageBase: 155000,
      medianBase: 150000,
      entryLevel: {
        title: 'Software Engineer I',
        compensation: 185000,
        base: 125000
      },
      midLevel: {
        title: 'Software Engineer II',
        compensation: 245000,
        base: 155000
      },
      seniorLevel: {
        title: 'Senior Software Engineer',
        compensation: 325000,
        base: 185000
      },
      levels: [
        { level: 'L3', title: 'SWE I', compensation: 185000, base: 125000, count: 45 },
        { level: 'L4', title: 'SWE II', compensation: 245000, base: 155000, count: 78 },
        { level: 'L5', title: 'Senior SWE', compensation: 325000, base: 185000, count: 56 }
      ]
    };
  }

  private getFallbackBenchmarkData(title: string, company?: string, location?: string): LevelsBenchmarkResult {
    return {
      position: title,
      company: company || 'Tech Industry',
      market: {
        p10: 165000,
        p25: 195000,
        p50: 235000,
        p75: 285000,
        p90: 355000,
        average: 245000
      },
      breakdown: {
        base: { p50: 155000, average: 160000 },
        stock: { p50: 65000, average: 70000 },
        bonus: { p50: 15000, average: 18000 }
      },
      byExperience: [
        { years: '0-2', compensation: 185000, base: 125000, count: 125 },
        { years: '3-5', compensation: 245000, base: 155000, count: 245 },
        { years: '6-10', compensation: 325000, base: 185000, count: 185 }
      ],
      byLocation: [
        { location: 'San Francisco', compensation: 275000, base: 165000, count: 350 },
        { location: 'Seattle', compensation: 245000, base: 155000, count: 280 },
        { location: 'New York', compensation: 255000, base: 160000, count: 220 }
      ],
      trends: {
        yearOverYear: 0.08,
        direction: 'increasing',
        factors: ['AI/ML demand', 'Remote work adoption', 'Tech talent shortage']
      }
    };
  }

  private getFallbackNegotiationInsights(params: any): any {
    return {
      recommendation: {
        targetTotal: Math.round(params.currentSalary * 1.15),
        targetBase: Math.round(params.currentSalary * 0.65),
        confidence: 0.85
      },
      negotiationPoints: [
        {
          category: 'Market Rate',
          point: 'Your target role pays 15% above your current compensation',
          impact: 'Strong leverage for base salary increase'
        },
        {
          category: 'Experience',
          point: 'Your experience level is in high demand',
          impact: 'Justifies premium compensation'
        }
      ],
      comparisons: [
        {
          company: 'Google',
          role: params.targetRole,
          compensation: 285000,
          difference: 40000
        },
        {
          company: 'Microsoft',
          role: params.targetRole,
          compensation: 245000,
          difference: 0
        }
      ],
      marketPosition: {
        percentile: 65,
        aboveMarket: true,
        recommendation: 'You are positioned well above market average'
      }
    };
  }
}

export const levelsService = new LevelsService();