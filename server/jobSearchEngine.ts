import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";
import fetch from "node-fetch";
import { z } from "zod";

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Job Search Schema
const JobSearchQuery = z.object({
  query: z.string().min(1),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  remote: z.boolean().optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  skills: z.array(z.string()).optional(),
  radius: z.number().optional(),
  datePosted: z.enum(['today', 'week', 'month', 'any']).optional(),
  limit: z.number().default(20),
  offset: z.number().default(0)
});

// Enhanced Job Interface
interface EnhancedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
  jobType: string;
  experienceLevel: string;
  remote: boolean;
  url: string;
  source: string;
  postedAt: Date;
  benefits?: string[];
  companySize?: string;
  industry?: string;
  matchScore?: number;
  matchReasons?: string[];
  companyLogo?: string;
  applicationDeadline?: Date;
  verified: boolean;
}

// Job Aggregation Sources
const JOB_SOURCES = [
  {
    name: 'Adzuna',
    url: 'https://api.adzuna.com/v1/api/jobs',
    key: process.env.ADZUNA_API_KEY,
    id: process.env.ADZUNA_API_ID
  },
  {
    name: 'JSearch',
    url: 'https://jsearch.p.rapidapi.com/search',
    key: process.env.JSEARCH_API_KEY
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin-jobs-search.p.rapidapi.com/jobs',
    key: process.env.LINKEDIN_API_KEY
  },
  {
    name: 'Indeed',
    url: 'https://indeed-job-search.p.rapidapi.com/search',
    key: process.env.INDEED_API_KEY
  },
  {
    name: 'ZipRecruiter',
    url: 'https://ziprecruiter-jobs-search.p.rapidapi.com/search',
    key: process.env.ZIPRECRUITER_API_KEY
  }
];

export class JobSearchEngine {
  private geminiModel: any;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: number = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  /**
   * Natural language query processing using Gemini
   */
  async processNaturalLanguageQuery(query: string): Promise<any> {
    try {
      const prompt = `
        Parse this job search query and extract structured parameters:
        "${query}"
        
        Return a JSON object with the following structure:
        {
          "processedQuery": "cleaned search terms",
          "location": "extracted location if any",
          "jobType": "full-time|part-time|contract|internship if mentioned",
          "experienceLevel": "entry|mid|senior|executive if mentioned",
          "skills": ["array of skills mentioned"],
          "salaryMin": number if mentioned,
          "salaryMax": number if mentioned,
          "remote": boolean if remote work mentioned,
          "company": "company name if mentioned",
          "industry": "industry if mentioned"
        }
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError);
        return { processedQuery: query };
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return { processedQuery: query };
    }
  }

  /**
   * Aggregate jobs from multiple sources
   */
  async aggregateJobs(searchParams: any): Promise<EnhancedJob[]> {
    const cacheKey = JSON.stringify(searchParams);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    const jobPromises = JOB_SOURCES.map(source => 
      this.fetchJobsFromSource(source, searchParams)
    );

    try {
      const results = await Promise.allSettled(jobPromises);
      const allJobs: EnhancedJob[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allJobs.push(...result.value);
        } else {
          console.error(`Failed to fetch from ${JOB_SOURCES[index].name}:`, result.reason);
        }
      });

      // Remove duplicates and normalize data
      const uniqueJobs = this.deduplicateJobs(allJobs);
      const normalizedJobs = await this.normalizeJobData(uniqueJobs);

      // Cache results
      this.cache.set(cacheKey, {
        data: normalizedJobs,
        timestamp: Date.now()
      });

      return normalizedJobs;
    } catch (error) {
      console.error('Job aggregation error:', error);
      return [];
    }
  }

  /**
   * Fetch jobs from a specific source
   */
  private async fetchJobsFromSource(source: any, params: any): Promise<EnhancedJob[]> {
    if (!source.key) {
      console.warn(`API key not found for ${source.name}`);
      return [];
    }

    try {
      const response = await this.makeAPICall(source, params);
      return this.parseJobResponse(response, source.name);
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return [];
    }
  }

  /**
   * Make API call to job source
   */
  private async makeAPICall(source: any, params: any): Promise<any> {
    const headers: any = {
      'Content-Type': 'application/json',
      'User-Agent': 'SmartJobFit/1.0'
    };

    // Add API key based on source
    if (source.name === 'Adzuna') {
      headers['X-RapidAPI-Key'] = source.key;
    } else {
      headers['X-RapidAPI-Key'] = source.key;
      headers['X-RapidAPI-Host'] = new URL(source.url).hostname;
    }

    const queryParams = this.buildQueryParams(params, source.name);
    const url = `${source.url}?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Build query parameters for different sources
   */
  private buildQueryParams(params: any, sourceName: string): string {
    const query = new URLSearchParams();

    switch (sourceName) {
      case 'Adzuna':
        query.append('app_id', process.env.ADZUNA_API_ID || '');
        query.append('app_key', process.env.ADZUNA_API_KEY || '');
        query.append('results_per_page', '50');
        query.append('what', params.processedQuery || params.query);
        if (params.location) query.append('where', params.location);
        if (params.salaryMin) query.append('salary_min', params.salaryMin.toString());
        if (params.salaryMax) query.append('salary_max', params.salaryMax.toString());
        break;

      case 'JSearch':
        query.append('query', params.processedQuery || params.query);
        query.append('page', '1');
        query.append('num_pages', '3');
        if (params.location) query.append('location', params.location);
        if (params.remote) query.append('remote_jobs_only', 'true');
        break;

      case 'LinkedIn':
        query.append('keywords', params.processedQuery || params.query);
        query.append('locationId', params.location || '92000000');
        query.append('dateSincePosted', 'past24Hours');
        query.append('jobType', params.jobType || 'F');
        query.append('sort', 'mostRecent');
        break;

      case 'Indeed':
        query.append('query', params.processedQuery || params.query);
        query.append('location', params.location || '');
        query.append('radius', params.radius?.toString() || '25');
        query.append('jobType', params.jobType || '');
        query.append('limit', '50');
        break;

      case 'ZipRecruiter':
        query.append('search', params.processedQuery || params.query);
        query.append('location', params.location || '');
        query.append('radius_miles', params.radius?.toString() || '25');
        query.append('days_ago', '7');
        break;

      default:
        query.append('q', params.processedQuery || params.query);
        if (params.location) query.append('location', params.location);
    }

    return query.toString();
  }

  /**
   * Parse job response from different sources
   */
  private parseJobResponse(response: any, sourceName: string): EnhancedJob[] {
    const jobs: EnhancedJob[] = [];

    try {
      let jobData: any[] = [];

      switch (sourceName) {
        case 'Adzuna':
          jobData = response.results || [];
          break;
        case 'JSearch':
          jobData = response.data || [];
          break;
        case 'LinkedIn':
          jobData = response.jobs || [];
          break;
        case 'Indeed':
          jobData = response.results || [];
          break;
        case 'ZipRecruiter':
          jobData = response.jobs || [];
          break;
        default:
          jobData = response.jobs || response.data || [];
      }

      jobData.forEach((job: any) => {
        const enhancedJob = this.mapJobData(job, sourceName);
        if (enhancedJob) {
          jobs.push(enhancedJob);
        }
      });
    } catch (error) {
      console.error(`Error parsing ${sourceName} response:`, error);
    }

    return jobs;
  }

  /**
   * Map job data from different sources to unified format
   */
  private mapJobData(job: any, sourceName: string): EnhancedJob | null {
    try {
      const baseJob: EnhancedJob = {
        id: job.id || job.job_id || `${sourceName}_${Date.now()}_${Math.random()}`,
        title: job.title || job.job_title || '',
        company: job.company || job.employer_name || job.company_name || '',
        location: job.location || job.job_city || job.job_state || '',
        description: job.description || job.job_description || '',
        requirements: this.extractRequirements(job.description || job.job_description || ''),
        skills: this.extractSkills(job.description || job.job_description || ''),
        salaryMin: job.salary_min || job.job_min_salary || undefined,
        salaryMax: job.salary_max || job.job_max_salary || undefined,
        jobType: job.job_type || job.employment_type || 'full-time',
        experienceLevel: this.determineExperienceLevel(job.title || ''),
        remote: job.job_is_remote || job.remote || false,
        url: job.redirect_url || job.job_apply_link || job.url || '',
        source: sourceName,
        postedAt: new Date(job.job_posted_at_datetime_utc || job.posted_at || Date.now()),
        benefits: job.job_benefits || [],
        companySize: job.company_size || undefined,
        industry: job.job_industry || undefined,
        companyLogo: job.employer_logo || job.company_logo || undefined,
        applicationDeadline: job.job_application_deadline ? new Date(job.job_application_deadline) : undefined,
        verified: job.job_is_verified || false
      };

      // Validate required fields
      if (!baseJob.title || !baseJob.company) {
        return null;
      }

      return baseJob;
    } catch (error) {
      console.error('Error mapping job data:', error);
      return null;
    }
  }

  /**
   * Extract requirements from job description
   */
  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const lines = description.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[•·-]\s*/) || trimmed.match(/^\d+\.\s*/)) {
        requirements.push(trimmed.replace(/^[•·-]\s*/, '').replace(/^\d+\.\s*/, ''));
      }
    }
    
    return requirements.slice(0, 10); // Limit to 10 requirements
  }

  /**
   * Extract skills from job description using AI
   */
  private async extractSkills(description: string): Promise<string[]> {
    try {
      const prompt = `
        Extract technical skills and technologies from this job description:
        "${description}"
        
        Return only a JSON array of skills, maximum 15 items:
        ["skill1", "skill2", "skill3"]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const skills = JSON.parse(text);
        return Array.isArray(skills) ? skills.slice(0, 15) : [];
      } catch (parseError) {
        return this.extractSkillsBasic(description);
      }
    } catch (error) {
      return this.extractSkillsBasic(description);
    }
  }

  /**
   * Basic skill extraction fallback
   */
  private extractSkillsBasic(description: string): string[] {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
      'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript', 'MongoDB', 'PostgreSQL',
      'Redis', 'GraphQL', 'REST API', 'Microservices', 'Agile', 'Scrum',
      'Machine Learning', 'Data Science', 'Analytics', 'Leadership', 'Communication'
    ];

    const foundSkills: string[] = [];
    const lowercaseDescription = description.toLowerCase();

    for (const skill of commonSkills) {
      if (lowercaseDescription.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }

    return foundSkills.slice(0, 10);
  }

  /**
   * Determine experience level from job title
   */
  private determineExperienceLevel(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('senior') || lowerTitle.includes('lead') || lowerTitle.includes('principal')) {
      return 'senior';
    } else if (lowerTitle.includes('junior') || lowerTitle.includes('entry') || lowerTitle.includes('intern')) {
      return 'entry';
    } else if (lowerTitle.includes('manager') || lowerTitle.includes('director') || lowerTitle.includes('vp')) {
      return 'executive';
    } else {
      return 'mid';
    }
  }

  /**
   * Remove duplicate jobs
   */
  private deduplicateJobs(jobs: EnhancedJob[]): EnhancedJob[] {
    const seen = new Set<string>();
    const unique: EnhancedJob[] = [];

    for (const job of jobs) {
      const signature = `${job.title.toLowerCase()}_${job.company.toLowerCase()}_${job.location.toLowerCase()}`;
      if (!seen.has(signature)) {
        seen.add(signature);
        unique.push(job);
      }
    }

    return unique;
  }

  /**
   * Normalize job data
   */
  private async normalizeJobData(jobs: EnhancedJob[]): Promise<EnhancedJob[]> {
    return jobs.map(job => ({
      ...job,
      title: this.normalizeTitle(job.title),
      company: this.normalizeCompany(job.company),
      location: this.normalizeLocation(job.location),
      description: this.normalizeDescription(job.description),
      skills: job.skills || []
    }));
  }

  /**
   * Normalize job title
   */
  private normalizeTitle(title: string): string {
    return title.trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s-]/g, '')
      .substring(0, 100);
  }

  /**
   * Normalize company name
   */
  private normalizeCompany(company: string): string {
    return company.trim()
      .replace(/\s+/g, ' ')
      .substring(0, 100);
  }

  /**
   * Normalize location
   */
  private normalizeLocation(location: string): string {
    return location.trim()
      .replace(/\s+/g, ' ')
      .substring(0, 100);
  }

  /**
   * Normalize description
   */
  private normalizeDescription(description: string): string {
    return description.trim()
      .replace(/\s+/g, ' ')
      .substring(0, 2000);
  }

  /**
   * Calculate job match score based on user profile
   */
  async calculateMatchScore(job: EnhancedJob, userProfile: any): Promise<number> {
    try {
      const prompt = `
        Calculate match score (0-100) between this job and user profile:
        
        Job: ${job.title} at ${job.company}
        Requirements: ${job.requirements.slice(0, 5).join(', ')}
        Skills: ${job.skills.slice(0, 10).join(', ')}
        
        User Profile:
        Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
        Experience: ${userProfile.experience || 'Not specified'}
        Location: ${userProfile.location || 'Not specified'}
        
        Return only a number between 0-100 representing the match percentage.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const score = parseInt(text.match(/\d+/)?.[0] || '0');
      return Math.min(Math.max(score, 0), 100);
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 0;
    }
  }

  /**
   * Generate match reasons
   */
  async generateMatchReasons(job: EnhancedJob, userProfile: any): Promise<string[]> {
    try {
      const prompt = `
        Explain why this job matches the user profile (max 3 reasons):
        
        Job: ${job.title} at ${job.company}
        Skills: ${job.skills.slice(0, 10).join(', ')}
        
        User Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
        
        Return a JSON array of short reasons:
        ["reason1", "reason2", "reason3"]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const reasons = JSON.parse(text);
        return Array.isArray(reasons) ? reasons.slice(0, 3) : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('Error generating match reasons:', error);
      return [];
    }
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const prompt = `
        Generate 5 job search suggestions based on this query: "${query}"
        
        Return a JSON array of suggestions:
        ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const suggestions = JSON.parse(text);
        return Array.isArray(suggestions) ? suggestions : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  /**
   * Main search function
   */
  async search(params: any, userId?: string): Promise<{
    jobs: EnhancedJob[];
    totalResults: number;
    searchTime: number;
    suggestions: string[];
  }> {
    const startTime = Date.now();
    
    try {
      // Process natural language query
      const processedParams = await this.processNaturalLanguageQuery(params.query);
      const mergedParams = { ...params, ...processedParams };

      // Get user profile for personalization
      const userProfile = userId ? await storage.getUser(userId) : null;

      // Aggregate jobs from all sources
      const allJobs = await this.aggregateJobs(mergedParams);

      // Calculate match scores if user profile exists
      const jobsWithScores = await Promise.all(
        allJobs.map(async (job) => {
          if (userProfile) {
            const matchScore = await this.calculateMatchScore(job, userProfile);
            const matchReasons = await this.generateMatchReasons(job, userProfile);
            return { ...job, matchScore, matchReasons };
          }
          return job;
        })
      );

      // Sort by match score or relevance
      jobsWithScores.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      // Apply pagination
      const startIndex = params.offset || 0;
      const endIndex = startIndex + (params.limit || 20);
      const paginatedJobs = jobsWithScores.slice(startIndex, endIndex);

      // Get search suggestions
      const suggestions = await this.getSearchSuggestions(params.query);

      // Store search history
      if (userId) {
        await storage.storeSearchHistory(userId, {
          query: params.query,
          filters: mergedParams,
          resultsCount: jobsWithScores.length,
          timestamp: new Date()
        });
      }

      const searchTime = Date.now() - startTime;

      return {
        jobs: paginatedJobs,
        totalResults: jobsWithScores.length,
        searchTime,
        suggestions
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        jobs: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
        suggestions: []
      };
    }
  }
}

export const jobSearchEngine = new JobSearchEngine();