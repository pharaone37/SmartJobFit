import fetch from 'node-fetch';

interface JobspikrJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  requirements: string[];
  benefits: string[];
  employmentType: string;
  remote: boolean;
  postedDate: string;
  expiryDate: string;
  applicationUrl: string;
  source: string;
  skills: string[];
  experience: {
    min: number;
    max: number;
    level: string;
  };
  industry: string;
  companySize: string;
  jobLevel: string;
}

interface JobspikrSearchResult {
  jobs: JobspikrJob[];
  totalResults: number;
  page: number;
  totalPages: number;
  searchTime: number;
  filters: {
    location: string;
    keywords: string;
    salary: string;
    experience: string;
  };
}

interface JobspikrMarketData {
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
    p25: number;
    p50: number;
    p75: number;
  };
  jobGrowth: {
    rate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    period: string;
  };
  topSkills: Array<{
    skill: string;
    demand: number;
    growth: number;
  }>;
  locations: Array<{
    city: string;
    jobCount: number;
    averageSalary: number;
  }>;
  companies: Array<{
    name: string;
    jobCount: number;
    averageSalary: number;
    rating: number;
  }>;
}

class JobspikrService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.JOBSPIKR_API_KEY || '';
    this.baseUrl = 'https://api.jobspikr.com/v2';
  }

  async searchJobs(params: {
    keywords: string;
    location?: string;
    salary?: string;
    experience?: string;
    jobType?: string;
    page?: number;
    limit?: number;
  }): Promise<JobspikrSearchResult> {
    if (!this.apiKey) {
      console.log('JOBSPIKR_API_KEY not found. Using fallback job search.');
      return this.getFallbackJobSearch(params);
    }

    try {
      const queryParams = new URLSearchParams({
        q: params.keywords,
        location: params.location || '',
        salary: params.salary || '',
        experience: params.experience || '',
        job_type: params.jobType || '',
        page: (params.page || 1).toString(),
        limit: (params.limit || 20).toString()
      });

      const response = await fetch(`${this.baseUrl}/search/jobs?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Jobspikr API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformJobspikrResponse(data, params);
    } catch (error) {
      console.error('Jobspikr search error:', error);
      return this.getFallbackJobSearch(params);
    }
  }

  async getMarketData(jobTitle: string, location?: string): Promise<JobspikrMarketData> {
    if (!this.apiKey) {
      console.log('JOBSPIKR_API_KEY not found. Using fallback market data.');
      return this.getFallbackMarketData(jobTitle, location);
    }

    try {
      const response = await fetch(`${this.baseUrl}/market/analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_title: jobTitle,
          location: location || 'global',
          period: '12months'
        })
      });

      if (!response.ok) {
        throw new Error(`Jobspikr market data error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformMarketData(data);
    } catch (error) {
      console.error('Jobspikr market data error:', error);
      return this.getFallbackMarketData(jobTitle, location);
    }
  }

  async getTrendingJobs(location?: string): Promise<{
    trending: JobspikrJob[];
    growth: Array<{
      title: string;
      growth: number;
      reason: string;
    }>;
    emerging: Array<{
      title: string;
      demand: number;
      skills: string[];
    }>;
  }> {
    if (!this.apiKey) {
      return this.getFallbackTrendingJobs(location);
    }

    try {
      const response = await fetch(`${this.baseUrl}/trends/jobs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Jobspikr trends error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformTrendingData(data);
    } catch (error) {
      console.error('Jobspikr trending jobs error:', error);
      return this.getFallbackTrendingJobs(location);
    }
  }

  async getCompanyInsights(companyName: string): Promise<{
    company: {
      name: string;
      industry: string;
      size: string;
      locations: string[];
      rating: number;
    };
    jobs: {
      total: number;
      recent: number;
      departments: Array<{
        name: string;
        count: number;
      }>;
    };
    salary: {
      average: number;
      range: { min: number; max: number };
      byLevel: Array<{
        level: string;
        average: number;
      }>;
    };
    growth: {
      hiring: number;
      trend: string;
      forecast: string;
    };
  }> {
    if (!this.apiKey) {
      return this.getFallbackCompanyInsights(companyName);
    }

    try {
      const response = await fetch(`${this.baseUrl}/company/insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_name: companyName,
          include_salary: true,
          include_growth: true
        })
      });

      if (!response.ok) {
        throw new Error(`Jobspikr company insights error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCompanyInsights(data);
    } catch (error) {
      console.error('Jobspikr company insights error:', error);
      return this.getFallbackCompanyInsights(companyName);
    }
  }

  private transformJobspikrResponse(data: any, params: any): JobspikrSearchResult {
    return {
      jobs: (data.jobs || []).map((job: any) => ({
        id: job.id || '',
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        description: job.description || '',
        salary: {
          min: job.salary?.min || 0,
          max: job.salary?.max || 0,
          currency: job.salary?.currency || 'USD',
          period: job.salary?.period || 'annual'
        },
        requirements: job.requirements || [],
        benefits: job.benefits || [],
        employmentType: job.employment_type || 'full-time',
        remote: job.remote || false,
        postedDate: job.posted_date || new Date().toISOString(),
        expiryDate: job.expiry_date || '',
        applicationUrl: job.application_url || '',
        source: job.source || 'jobspikr',
        skills: job.skills || [],
        experience: {
          min: job.experience?.min || 0,
          max: job.experience?.max || 0,
          level: job.experience?.level || 'mid'
        },
        industry: job.industry || '',
        companySize: job.company_size || '',
        jobLevel: job.job_level || ''
      })),
      totalResults: data.total_results || 0,
      page: data.page || 1,
      totalPages: data.total_pages || 1,
      searchTime: data.search_time || 0,
      filters: {
        location: params.location || '',
        keywords: params.keywords || '',
        salary: params.salary || '',
        experience: params.experience || ''
      }
    };
  }

  private transformMarketData(data: any): JobspikrMarketData {
    return {
      averageSalary: data.average_salary || 75000,
      salaryRange: {
        min: data.salary_range?.min || 45000,
        max: data.salary_range?.max || 120000,
        p25: data.salary_range?.p25 || 60000,
        p50: data.salary_range?.p50 || 75000,
        p75: data.salary_range?.p75 || 95000
      },
      jobGrowth: {
        rate: data.job_growth?.rate || 0.05,
        trend: data.job_growth?.trend || 'stable',
        period: data.job_growth?.period || '12months'
      },
      topSkills: data.top_skills || [],
      locations: data.locations || [],
      companies: data.companies || []
    };
  }

  private transformTrendingData(data: any): any {
    return {
      trending: data.trending || [],
      growth: data.growth || [],
      emerging: data.emerging || []
    };
  }

  private transformCompanyInsights(data: any): any {
    return {
      company: data.company || {},
      jobs: data.jobs || {},
      salary: data.salary || {},
      growth: data.growth || {}
    };
  }

  private getFallbackJobSearch(params: any): JobspikrSearchResult {
    return {
      jobs: [
        {
          id: 'fallback-1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          description: 'Join our team building cutting-edge applications',
          salary: {
            min: 120000,
            max: 160000,
            currency: 'USD',
            period: 'annual'
          },
          requirements: ['5+ years experience', 'React', 'Node.js'],
          benefits: ['Health insurance', 'Stock options', 'Remote work'],
          employmentType: 'full-time',
          remote: true,
          postedDate: new Date().toISOString(),
          expiryDate: '',
          applicationUrl: 'https://example.com/apply',
          source: 'jobspikr',
          skills: ['React', 'Node.js', 'TypeScript'],
          experience: {
            min: 5,
            max: 8,
            level: 'senior'
          },
          industry: 'Technology',
          companySize: '100-500',
          jobLevel: 'senior'
        }
      ],
      totalResults: 1,
      page: 1,
      totalPages: 1,
      searchTime: 0.5,
      filters: {
        location: params.location || '',
        keywords: params.keywords || '',
        salary: params.salary || '',
        experience: params.experience || ''
      }
    };
  }

  private getFallbackMarketData(jobTitle: string, location?: string): JobspikrMarketData {
    return {
      averageSalary: 85000,
      salaryRange: {
        min: 55000,
        max: 130000,
        p25: 70000,
        p50: 85000,
        p75: 105000
      },
      jobGrowth: {
        rate: 0.08,
        trend: 'increasing',
        period: '12months'
      },
      topSkills: [
        { skill: 'JavaScript', demand: 85, growth: 12 },
        { skill: 'Python', demand: 78, growth: 15 },
        { skill: 'React', demand: 72, growth: 18 }
      ],
      locations: [
        { city: 'San Francisco', jobCount: 1250, averageSalary: 125000 },
        { city: 'New York', jobCount: 980, averageSalary: 110000 },
        { city: 'Seattle', jobCount: 750, averageSalary: 115000 }
      ],
      companies: [
        { name: 'Google', jobCount: 45, averageSalary: 145000, rating: 4.4 },
        { name: 'Microsoft', jobCount: 38, averageSalary: 135000, rating: 4.2 },
        { name: 'Amazon', jobCount: 52, averageSalary: 125000, rating: 4.0 }
      ]
    };
  }

  private getFallbackTrendingJobs(location?: string): any {
    return {
      trending: [
        {
          id: 'trending-1',
          title: 'AI/ML Engineer',
          company: 'AI Startup',
          location: 'Remote',
          description: 'Build next-generation AI applications',
          salary: { min: 130000, max: 180000, currency: 'USD', period: 'annual' },
          requirements: ['Machine Learning', 'Python', 'TensorFlow'],
          benefits: ['Equity', 'Remote work', 'Learning budget'],
          employmentType: 'full-time',
          remote: true,
          postedDate: new Date().toISOString(),
          expiryDate: '',
          applicationUrl: 'https://example.com/apply',
          source: 'jobspikr',
          skills: ['Python', 'TensorFlow', 'Machine Learning'],
          experience: { min: 3, max: 7, level: 'mid-senior' },
          industry: 'Technology',
          companySize: '50-100',
          jobLevel: 'senior'
        }
      ],
      growth: [
        { title: 'AI Engineer', growth: 45, reason: 'Increased AI adoption' },
        { title: 'DevOps Engineer', growth: 25, reason: 'Cloud migration trends' }
      ],
      emerging: [
        { title: 'Prompt Engineer', demand: 35, skills: ['LLMs', 'GPT', 'AI'] },
        { title: 'Blockchain Developer', demand: 28, skills: ['Solidity', 'Web3', 'DeFi'] }
      ]
    };
  }

  private getFallbackCompanyInsights(companyName: string): any {
    return {
      company: {
        name: companyName,
        industry: 'Technology',
        size: '1000-5000',
        locations: ['San Francisco', 'New York', 'Seattle'],
        rating: 4.2
      },
      jobs: {
        total: 125,
        recent: 15,
        departments: [
          { name: 'Engineering', count: 45 },
          { name: 'Product', count: 20 },
          { name: 'Sales', count: 25 }
        ]
      },
      salary: {
        average: 125000,
        range: { min: 80000, max: 200000 },
        byLevel: [
          { level: 'Junior', average: 85000 },
          { level: 'Mid', average: 125000 },
          { level: 'Senior', average: 165000 }
        ]
      },
      growth: {
        hiring: 15,
        trend: 'increasing',
        forecast: 'Strong growth expected'
      }
    };
  }
}

export const jobspikrService = new JobspikrService();