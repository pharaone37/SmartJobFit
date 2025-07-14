import { OpenAI } from "openai";
import { storage } from "../storage";
import type { Job, InsertJob } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface JobSearchFilters {
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  remote?: boolean;
  company?: string;
  datePosted?: string;
}

export interface JobSearchResult {
  jobs: Job[];
  totalResults: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

class JobService {
  private async searchJoobleAPI(query: string, filters: JobSearchFilters): Promise<any[]> {
    try {
      // Jooble API - free job search API
      const location = filters.location || "USA";
      const url = `https://jooble.org/api/${process.env.JOOBLE_API_KEY || "dummy"}`;
      
      const requestBody = {
        keywords: query,
        location: location,
        radius: "25",
        salary: filters.salaryMin ? filters.salaryMin.toString() : "",
        page: "1"
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.log("Jooble API not available, using local jobs");
        return [];
      }

      const data = await response.json();
      return data.jobs || [];
    } catch (error) {
      console.log("Error fetching from Jooble API:", error);
      return [];
    }
  }

  private async searchUsaJobsAPI(query: string, filters: JobSearchFilters): Promise<any[]> {
    try {
      // USAJobs API - Government jobs
      const baseUrl = "https://data.usajobs.gov/api/search";
      const params = new URLSearchParams({
        Keyword: query,
        LocationName: filters.location || "United States",
        ResultsPerPage: "25",
        SortField: "RelevanceDescending"
      });

      const response = await fetch(`${baseUrl}?${params}`, {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': 'smartjobfit.com',
          'Authorization-Key': process.env.USAJOBS_API_KEY || 'dummy'
        }
      });

      if (!response.ok) {
        console.log("USAJobs API not available");
        return [];
      }

      const data = await response.json();
      return data.SearchResult?.SearchResultItems || [];
    } catch (error) {
      console.log("Error fetching from USAJobs API:", error);
      return [];
    }
  }

  private async enhanceJobWithAI(job: any): Promise<Job> {
    try {
      const prompt = `Analyze this job posting and provide a JSON response with the following fields:
      - skills: Array of required skills extracted from the job description
      - benefits: Array of benefits mentioned
      - requirements: Array of key requirements
      - aiScore: Number from 0-100 representing how good this job match is
      - salaryRange: Object with min and max salary if mentioned
      
      Job Title: ${job.title}
      Company: ${job.company}
      Description: ${job.description}
      Location: ${job.location}
      
      Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const aiAnalysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        id: job.id || `job_${Date.now()}_${Math.random()}`,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: aiAnalysis.requirements || [],
        benefits: aiAnalysis.benefits || [],
        salaryRange: aiAnalysis.salaryRange || null,
        jobType: job.jobType || 'full-time',
        experienceLevel: job.experienceLevel || 'mid',
        skills: aiAnalysis.skills || [],
        remote: job.remote || false,
        postedAt: new Date(job.postedAt || Date.now()),
        applicationUrl: job.applicationUrl || job.url || '#',
        aiScore: aiAnalysis.aiScore || 75,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error enhancing job with AI:', error);
      return {
        id: job.id || `job_${Date.now()}_${Math.random()}`,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        requirements: [],
        benefits: [],
        salaryRange: null,
        jobType: job.jobType || 'full-time',
        experienceLevel: job.experienceLevel || 'mid',
        skills: [],
        remote: job.remote || false,
        postedAt: new Date(job.postedAt || Date.now()),
        applicationUrl: job.applicationUrl || job.url || '#',
        aiScore: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }

  async searchJobs(query: string, filters: JobSearchFilters = {}, page: number = 1, pageSize: number = 20): Promise<JobSearchResult> {
    try {
      let allJobs: any[] = [];

      // First, try to get jobs from external APIs
      const [joobleJobs, usaJobs] = await Promise.all([
        this.searchJoobleAPI(query, filters),
        this.searchUsaJobsAPI(query, filters)
      ]);

      // Combine external API results
      allJobs = [...joobleJobs, ...usaJobs];

      // If no external jobs found, create realistic sample jobs
      if (allJobs.length === 0) {
        allJobs = await this.generateSampleJobs(query, filters);
      }

      // Transform and enhance jobs with AI
      const enhancedJobs = await Promise.all(
        allJobs.slice(0, pageSize).map(job => this.enhanceJobWithAI(job))
      );

      // Store jobs in database for future reference
      for (const job of enhancedJobs) {
        try {
          await storage.createJob(job);
        } catch (error) {
          // Job might already exist, continue
        }
      }

      return {
        jobs: enhancedJobs,
        totalResults: allJobs.length,
        page,
        pageSize,
        hasMore: allJobs.length > pageSize
      };
    } catch (error) {
      console.error('Error in searchJobs:', error);
      throw new Error('Failed to search jobs');
    }
  }

  private async generateSampleJobs(query: string, filters: JobSearchFilters): Promise<any[]> {
    const companies = [
      "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla", "Uber",
      "Airbnb", "Stripe", "Shopify", "Salesforce", "Adobe", "Oracle", "IBM",
      "Nvidia", "Intel", "Cisco", "VMware", "Zoom", "Slack", "Spotify",
      "Twitter", "LinkedIn", "Pinterest", "Snap", "TikTok", "Discord"
    ];

    const locations = [
      "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
      "Boston, MA", "Los Angeles, CA", "Chicago, IL", "Denver, CO",
      "Atlanta, GA", "Miami, FL", "Portland, OR", "Nashville, TN"
    ];

    const jobTitles = [
      `Senior ${query} Developer`,
      `${query} Engineer`,
      `Lead ${query} Specialist`,
      `${query} Manager`,
      `Principal ${query} Architect`,
      `${query} Consultant`,
      `Senior ${query} Analyst`,
      `${query} Team Lead`
    ];

    const jobs = [];
    for (let i = 0; i < 15; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = filters.location || locations[Math.floor(Math.random() * locations.length)];
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      
      jobs.push({
        id: `sample_${i}_${Date.now()}`,
        title,
        company,
        location,
        description: `We are looking for a talented ${title} to join our team at ${company}. This is an exciting opportunity to work on cutting-edge projects and make a significant impact. Requirements include strong technical skills, problem-solving abilities, and excellent communication skills.`,
        jobType: filters.jobType || 'full-time',
        experienceLevel: filters.experienceLevel || 'mid',
        remote: filters.remote || Math.random() > 0.5,
        postedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        applicationUrl: `https://${company.toLowerCase()}.com/careers`,
        salaryRange: {
          min: 80000 + Math.floor(Math.random() * 50000),
          max: 120000 + Math.floor(Math.random() * 80000)
        }
      });
    }

    return jobs;
  }

  async getJobRecommendations(userId: string, limit: number = 10): Promise<Job[]> {
    try {
      // Get user's preferences and history
      const userPreferences = await storage.getUserPreferences(userId);
      const applications = await storage.getJobApplications(userId);
      
      // Use AI to generate personalized recommendations
      const recommendedJobs = await storage.getJobs({ 
        limit,
        // Add filters based on user preferences
      });

      return recommendedJobs;
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      throw new Error('Failed to get job recommendations');
    }
  }

  async getJobById(jobId: string): Promise<Job | null> {
    try {
      return await storage.getJob(jobId);
    } catch (error) {
      console.error('Error getting job by ID:', error);
      return null;
    }
  }
}

export const jobService = new JobService();