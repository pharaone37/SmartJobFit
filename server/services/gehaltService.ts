import fetch from 'node-fetch';

interface GehaltSalaryData {
  position: string;
  company: string;
  location: string;
  salary: {
    gross: number;
    net: number;
    currency: string;
    period: string;
  };
  benefits: {
    bonus: number;
    vacation: number;
    extras: string[];
  };
  experience: {
    years: number;
    level: string;
  };
  education: string;
  industry: string;
  companySize: string;
  workingHours: number;
  timestamp: string;
  verified: boolean;
}

interface GehaltBenchmarkResult {
  position: string;
  location: string;
  salary: {
    min: number;
    max: number;
    average: number;
    median: number;
    p25: number;
    p75: number;
  };
  byExperience: Array<{
    level: string;
    years: string;
    salary: number;
    count: number;
  }>;
  byEducation: Array<{
    education: string;
    salary: number;
    count: number;
  }>;
  byIndustry: Array<{
    industry: string;
    salary: number;
    count: number;
  }>;
  byCompanySize: Array<{
    size: string;
    salary: number;
    count: number;
  }>;
  trends: {
    yearOverYear: number;
    direction: 'steigend' | 'fallend' | 'stabil';
    factors: string[];
  };
  regional: Array<{
    region: string;
    salary: number;
    costOfLiving: number;
    netValue: number;
  }>;
}

interface GehaltJobMarketData {
  position: string;
  demand: {
    level: 'sehr hoch' | 'hoch' | 'mittel' | 'niedrig';
    score: number;
    trend: string;
  };
  skills: Array<{
    skill: string;
    importance: number;
    salaryImpact: number;
  }>;
  certifications: Array<{
    certification: string;
    salaryBoost: number;
    demand: number;
  }>;
  careerPath: Array<{
    from: string;
    to: string;
    salaryIncrease: number;
    timeframe: string;
  }>;
  locations: Array<{
    city: string;
    state: string;
    salary: number;
    jobCount: number;
    costOfLiving: number;
  }>;
}

class GehaltService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GEHALT_DE_API_KEY || '';
    this.baseUrl = 'https://api.gehalt.de/v1';
  }

  async getSalaryData(params: {
    position: string;
    location?: string;
    experience?: string;
    education?: string;
    industry?: string;
    companySize?: string;
  }): Promise<GehaltSalaryData[]> {
    if (!this.apiKey) {
      console.log('GEHALT_DE_API_KEY not found. Using fallback salary data.');
      return this.getFallbackSalaryData(params);
    }

    try {
      const queryParams = new URLSearchParams({
        position: params.position,
        location: params.location || '',
        experience: params.experience || '',
        education: params.education || '',
        industry: params.industry || '',
        company_size: params.companySize || ''
      });

      const response = await fetch(`${this.baseUrl}/salaries?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'de-DE'
        }
      });

      if (!response.ok) {
        throw new Error(`Gehalt.de API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSalaryData(data);
    } catch (error) {
      console.error('Gehalt.de salary data error:', error);
      return this.getFallbackSalaryData(params);
    }
  }

  async getBenchmarkData(position: string, location: string = 'Deutschland'): Promise<GehaltBenchmarkResult> {
    if (!this.apiKey) {
      console.log('GEHALT_DE_API_KEY not found. Using fallback benchmark data.');
      return this.getFallbackBenchmarkData(position, location);
    }

    try {
      const response = await fetch(`${this.baseUrl}/benchmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'de-DE'
        },
        body: JSON.stringify({
          position: position,
          location: location,
          include_trends: true,
          include_regional: true
        })
      });

      if (!response.ok) {
        throw new Error(`Gehalt.de benchmark error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformBenchmarkData(data);
    } catch (error) {
      console.error('Gehalt.de benchmark error:', error);
      return this.getFallbackBenchmarkData(position, location);
    }
  }

  async getJobMarketData(position: string): Promise<GehaltJobMarketData> {
    if (!this.apiKey) {
      console.log('GEHALT_DE_API_KEY not found. Using fallback job market data.');
      return this.getFallbackJobMarketData(position);
    }

    try {
      const response = await fetch(`${this.baseUrl}/job-market`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'de-DE'
        },
        body: JSON.stringify({
          position: position,
          include_skills: true,
          include_certifications: true,
          include_career_path: true
        })
      });

      if (!response.ok) {
        throw new Error(`Gehalt.de job market error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformJobMarketData(data);
    } catch (error) {
      console.error('Gehalt.de job market error:', error);
      return this.getFallbackJobMarketData(position);
    }
  }

  async getNegotiationAdvice(params: {
    currentSalary: number;
    targetPosition: string;
    experience: number;
    location: string;
    education: string;
    industry: string;
  }): Promise<{
    recommendation: {
      targetSalary: number;
      minSalary: number;
      maxSalary: number;
      confidence: number;
    };
    factors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    negotiationTips: Array<{
      category: string;
      tip: string;
      importance: string;
    }>;
    marketPosition: {
      percentile: number;
      comparison: string;
      advice: string;
    };
  }> {
    if (!this.apiKey) {
      return this.getFallbackNegotiationAdvice(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/negotiation-advice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'de-DE'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Gehalt.de negotiation advice error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformNegotiationAdvice(data);
    } catch (error) {
      console.error('Gehalt.de negotiation advice error:', error);
      return this.getFallbackNegotiationAdvice(params);
    }
  }

  private transformSalaryData(data: any): GehaltSalaryData[] {
    return (data.salaries || []).map((salary: any) => ({
      position: salary.position || '',
      company: salary.company || '',
      location: salary.location || '',
      salary: {
        gross: salary.gross_salary || 0,
        net: salary.net_salary || 0,
        currency: salary.currency || 'EUR',
        period: salary.period || 'annual'
      },
      benefits: {
        bonus: salary.bonus || 0,
        vacation: salary.vacation_days || 0,
        extras: salary.extras || []
      },
      experience: {
        years: salary.years_experience || 0,
        level: salary.experience_level || ''
      },
      education: salary.education || '',
      industry: salary.industry || '',
      companySize: salary.company_size || '',
      workingHours: salary.working_hours || 40,
      timestamp: salary.timestamp || new Date().toISOString(),
      verified: salary.verified || false
    }));
  }

  private transformBenchmarkData(data: any): GehaltBenchmarkResult {
    return {
      position: data.position || '',
      location: data.location || '',
      salary: {
        min: data.salary?.min || 0,
        max: data.salary?.max || 0,
        average: data.salary?.average || 0,
        median: data.salary?.median || 0,
        p25: data.salary?.p25 || 0,
        p75: data.salary?.p75 || 0
      },
      byExperience: data.by_experience || [],
      byEducation: data.by_education || [],
      byIndustry: data.by_industry || [],
      byCompanySize: data.by_company_size || [],
      trends: {
        yearOverYear: data.trends?.year_over_year || 0,
        direction: data.trends?.direction || 'stabil',
        factors: data.trends?.factors || []
      },
      regional: data.regional || []
    };
  }

  private transformJobMarketData(data: any): GehaltJobMarketData {
    return {
      position: data.position || '',
      demand: {
        level: data.demand?.level || 'mittel',
        score: data.demand?.score || 0,
        trend: data.demand?.trend || ''
      },
      skills: data.skills || [],
      certifications: data.certifications || [],
      careerPath: data.career_path || [],
      locations: data.locations || []
    };
  }

  private transformNegotiationAdvice(data: any): any {
    return {
      recommendation: data.recommendation || {
        targetSalary: 0,
        minSalary: 0,
        maxSalary: 0,
        confidence: 0
      },
      factors: data.factors || [],
      negotiationTips: data.negotiation_tips || [],
      marketPosition: data.market_position || {
        percentile: 0,
        comparison: '',
        advice: ''
      }
    };
  }

  private getFallbackSalaryData(params: any): GehaltSalaryData[] {
    return [
      {
        position: 'Software Engineer',
        company: 'SAP',
        location: 'München',
        salary: {
          gross: 75000,
          net: 48000,
          currency: 'EUR',
          period: 'annual'
        },
        benefits: {
          bonus: 8000,
          vacation: 28,
          extras: ['Betriebliche Altersvorsorge', 'Firmenwagen', 'Homeoffice']
        },
        experience: {
          years: 4,
          level: 'Erfahren'
        },
        education: 'Master',
        industry: 'Software',
        companySize: 'Großunternehmen',
        workingHours: 40,
        timestamp: new Date().toISOString(),
        verified: true
      },
      {
        position: 'Software Engineer',
        company: 'BMW',
        location: 'München',
        salary: {
          gross: 68000,
          net: 44000,
          currency: 'EUR',
          period: 'annual'
        },
        benefits: {
          bonus: 5000,
          vacation: 30,
          extras: ['Betriebliche Altersvorsorge', 'Kantine', 'Mitarbeiterrabatt']
        },
        experience: {
          years: 3,
          level: 'Erfahren'
        },
        education: 'Bachelor',
        industry: 'Automotive',
        companySize: 'Großunternehmen',
        workingHours: 40,
        timestamp: new Date().toISOString(),
        verified: true
      }
    ];
  }

  private getFallbackBenchmarkData(position: string, location: string): GehaltBenchmarkResult {
    return {
      position: position,
      location: location,
      salary: {
        min: 45000,
        max: 95000,
        average: 68000,
        median: 65000,
        p25: 55000,
        p75: 78000
      },
      byExperience: [
        { level: 'Berufseinsteiger', years: '0-2', salary: 52000, count: 125 },
        { level: 'Erfahren', years: '3-7', salary: 68000, count: 245 },
        { level: 'Senior', years: '8+', salary: 85000, count: 185 }
      ],
      byEducation: [
        { education: 'Ausbildung', salary: 48000, count: 85 },
        { education: 'Bachelor', salary: 62000, count: 245 },
        { education: 'Master', salary: 72000, count: 185 },
        { education: 'Promotion', salary: 88000, count: 45 }
      ],
      byIndustry: [
        { industry: 'Software', salary: 72000, count: 125 },
        { industry: 'Automotive', salary: 68000, count: 95 },
        { industry: 'Maschinenbau', salary: 65000, count: 85 },
        { industry: 'Beratung', salary: 75000, count: 75 }
      ],
      byCompanySize: [
        { size: 'Startup', salary: 58000, count: 45 },
        { size: 'Mittelstand', salary: 65000, count: 125 },
        { size: 'Großunternehmen', salary: 72000, count: 185 }
      ],
      trends: {
        yearOverYear: 0.035,
        direction: 'steigend',
        factors: ['Digitalisierung', 'Fachkräftemangel', 'Remote-Arbeit']
      },
      regional: [
        { region: 'München', salary: 75000, costOfLiving: 1.25, netValue: 60000 },
        { region: 'Berlin', salary: 68000, costOfLiving: 1.10, netValue: 61800 },
        { region: 'Hamburg', salary: 70000, costOfLiving: 1.15, netValue: 60900 },
        { region: 'Stuttgart', salary: 72000, costOfLiving: 1.20, netValue: 60000 }
      ]
    };
  }

  private getFallbackJobMarketData(position: string): GehaltJobMarketData {
    return {
      position: position,
      demand: {
        level: 'hoch',
        score: 78,
        trend: 'steigend'
      },
      skills: [
        { skill: 'JavaScript', importance: 85, salaryImpact: 8000 },
        { skill: 'Python', importance: 78, salaryImpact: 7000 },
        { skill: 'Cloud Computing', importance: 82, salaryImpact: 12000 },
        { skill: 'DevOps', importance: 75, salaryImpact: 9000 }
      ],
      certifications: [
        { certification: 'AWS Certified', salaryBoost: 15000, demand: 85 },
        { certification: 'Scrum Master', salaryBoost: 8000, demand: 72 },
        { certification: 'PMP', salaryBoost: 12000, demand: 65 }
      ],
      careerPath: [
        { from: 'Junior Developer', to: 'Software Engineer', salaryIncrease: 15000, timeframe: '2-3 Jahre' },
        { from: 'Software Engineer', to: 'Senior Developer', salaryIncrease: 18000, timeframe: '3-5 Jahre' },
        { from: 'Senior Developer', to: 'Team Lead', salaryIncrease: 25000, timeframe: '2-4 Jahre' }
      ],
      locations: [
        { city: 'München', state: 'Bayern', salary: 75000, jobCount: 285, costOfLiving: 1.25 },
        { city: 'Berlin', state: 'Berlin', salary: 68000, jobCount: 425, costOfLiving: 1.10 },
        { city: 'Hamburg', state: 'Hamburg', salary: 70000, jobCount: 185, costOfLiving: 1.15 },
        { city: 'Frankfurt', state: 'Hessen', salary: 78000, jobCount: 165, costOfLiving: 1.30 }
      ]
    };
  }

  private getFallbackNegotiationAdvice(params: any): any {
    return {
      recommendation: {
        targetSalary: Math.round(params.currentSalary * 1.12),
        minSalary: Math.round(params.currentSalary * 1.05),
        maxSalary: Math.round(params.currentSalary * 1.20),
        confidence: 0.82
      },
      factors: [
        { factor: 'Berufserfahrung', impact: 15, description: 'Ihre Erfahrung rechtfertigt eine Gehaltserhöhung' },
        { factor: 'Marktlage', impact: 12, description: 'Hohe Nachfrage nach Ihren Fähigkeiten' },
        { factor: 'Standort', impact: 8, description: 'Ihr Standort hat überdurchschnittliche Gehälter' }
      ],
      negotiationTips: [
        { category: 'Vorbereitung', tip: 'Dokumentieren Sie Ihre Leistungen', importance: 'hoch' },
        { category: 'Timing', tip: 'Wählen Sie den richtigen Zeitpunkt', importance: 'mittel' },
        { category: 'Verhandlung', tip: 'Bleiben Sie professionell und sachlich', importance: 'hoch' }
      ],
      marketPosition: {
        percentile: 68,
        comparison: 'Überdurchschnittlich',
        advice: 'Sie liegen bereits über dem Marktdurchschnitt'
      }
    };
  }
}

export const gehaltService = new GehaltService();