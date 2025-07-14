import fetch from 'node-fetch';

export class SerperService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SERPER_API_KEY || '';
    this.baseUrl = 'https://google.serper.dev';
  }

  async searchJobs(query: string, location?: string): Promise<any> {
    if (!this.apiKey) {
      console.log('SERPER_API_KEY not found. Using fallback job search.');
      return this.getFallbackJobSearch(query, location);
    }

    try {
      const searchQuery = location ? `${query} jobs ${location}` : `${query} jobs`;
      
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          q: searchQuery,
          gl: 'us',
          hl: 'en',
          num: 20
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSerperResponse(data, query);
    } catch (error) {
      console.error('Serper search error:', error);
      return this.getFallbackJobSearch(query, location);
    }
  }

  async getCompanyInfo(companyName: string): Promise<any> {
    if (!this.apiKey) {
      return this.getFallbackCompanyInfo(companyName);
    }

    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          q: `${companyName} company information careers culture`,
          gl: 'us',
          hl: 'en',
          num: 10
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCompanyResponse(data, companyName);
    } catch (error) {
      console.error('Serper company info error:', error);
      return this.getFallbackCompanyInfo(companyName);
    }
  }

  private transformSerperResponse(data: any, query: string): any {
    const jobs = (data.organic || []).map((result: any, index: number) => ({
      id: `serper_${index}`,
      title: this.extractJobTitle(result.title, query),
      company: this.extractCompany(result.title, result.snippet),
      location: this.extractLocation(result.snippet),
      description: result.snippet || '',
      url: result.link || '',
      source: 'Google Search',
      salary: this.extractSalary(result.snippet),
      type: 'Full-time',
      posted: 'Recently',
      skills: this.extractSkills(result.snippet)
    }));

    return {
      jobs,
      totalResults: data.searchInformation?.totalResults || jobs.length,
      searchTime: data.searchInformation?.searchTime || 0
    };
  }

  private transformCompanyResponse(data: any, companyName: string): any {
    const results = data.organic || [];
    const snippet = results.map((r: any) => r.snippet).join(' ');
    
    return {
      name: companyName,
      description: snippet.substring(0, 500) + '...',
      industry: this.extractIndustry(snippet),
      size: this.extractCompanySize(snippet),
      website: results[0]?.link || '',
      culture: this.extractCulture(snippet),
      benefits: this.extractBenefits(snippet),
      locations: this.extractLocations(snippet)
    };
  }

  private extractJobTitle(title: string, query: string): string {
    // Extract job title from search result title
    const cleanTitle = title.replace(/\s*-\s*.*$/, '').trim();
    return cleanTitle || query;
  }

  private extractCompany(title: string, snippet: string): string {
    // Try to extract company from title or snippet
    const titleMatch = title.match(/at\s+([^-]+)/i);
    if (titleMatch) return titleMatch[1].trim();
    
    const snippetMatch = snippet.match(/(?:at|for)\s+([A-Z][a-zA-Z\s&]+)/);
    return snippetMatch ? snippetMatch[1].trim() : 'Various Companies';
  }

  private extractLocation(snippet: string): string {
    const locationPattern = /(?:in|at)\s+([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/;
    const match = snippet.match(locationPattern);
    return match ? match[1] : 'Various Locations';
  }

  private extractSalary(snippet: string): string {
    const salaryPattern = /\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*per\s+year)?/;
    const match = snippet.match(salaryPattern);
    return match ? match[0] : 'Competitive';
  }

  private extractSkills(snippet: string): string[] {
    const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'AWS', 'Docker', 'Git'];
    return skillKeywords.filter(skill => 
      snippet.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private extractIndustry(snippet: string): string {
    const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing'];
    const found = industries.find(industry => 
      snippet.toLowerCase().includes(industry.toLowerCase())
    );
    return found || 'Technology';
  }

  private extractCompanySize(snippet: string): string {
    if (snippet.includes('startup') || snippet.includes('small')) return 'Startup (1-50)';
    if (snippet.includes('medium') || snippet.includes('growing')) return 'Medium (51-500)';
    if (snippet.includes('large') || snippet.includes('enterprise')) return 'Large (500+)';
    return 'Unknown';
  }

  private extractCulture(snippet: string): string {
    const cultureKeywords = ['innovative', 'collaborative', 'remote', 'flexible', 'fast-paced'];
    const found = cultureKeywords.filter(keyword => 
      snippet.toLowerCase().includes(keyword)
    );
    return found.length > 0 ? found.join(', ') : 'Professional environment';
  }

  private extractBenefits(snippet: string): string[] {
    const benefitKeywords = ['health insurance', 'remote work', 'flexible hours', 'stock options', 'paid time off'];
    return benefitKeywords.filter(benefit => 
      snippet.toLowerCase().includes(benefit.toLowerCase())
    );
  }

  private extractLocations(snippet: string): string[] {
    const locationPattern = /([A-Z][a-zA-Z\s]+,\s*[A-Z]{2})/g;
    const matches = snippet.match(locationPattern);
    return matches || ['Various Locations'];
  }

  private getFallbackJobSearch(query: string, location?: string): any {
    const fallbackJobs = [
      {
        id: 'fallback_1',
        title: `Senior ${query} Developer`,
        company: 'TechCorp',
        location: location || 'San Francisco, CA',
        description: `Senior ${query} developer position with competitive salary and benefits.`,
        url: 'https://example.com/job1',
        source: 'Fallback Search',
        salary: '$120k - $180k',
        type: 'Full-time',
        posted: 'Recently',
        skills: ['JavaScript', 'React', 'Node.js']
      },
      {
        id: 'fallback_2',
        title: `${query} Engineer`,
        company: 'InnovateCorp',
        location: location || 'New York, NY',
        description: `${query} engineering role in a fast-growing startup environment.`,
        url: 'https://example.com/job2',
        source: 'Fallback Search',
        salary: '$100k - $150k',
        type: 'Full-time',
        posted: 'Recently',
        skills: ['Python', 'AWS', 'Docker']
      }
    ];

    return {
      jobs: fallbackJobs,
      totalResults: fallbackJobs.length,
      searchTime: 0.1
    };
  }

  private getFallbackCompanyInfo(companyName: string): any {
    return {
      name: companyName,
      description: `${companyName} is a leading technology company focused on innovation and growth.`,
      industry: 'Technology',
      size: 'Medium (51-500)',
      website: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      culture: 'Innovative, collaborative, growth-oriented',
      benefits: ['Health insurance', 'Remote work options', 'Professional development'],
      locations: ['San Francisco, CA', 'New York, NY', 'Remote']
    };
  }
}

export const serperService = new SerperService();