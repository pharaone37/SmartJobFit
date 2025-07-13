import { storage } from '../storage';
import { aiService } from './aiService';
import { Job, InsertJob } from '@shared/schema';

export interface JobSearchFilters {
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  remote?: boolean;
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface JobBoardSource {
  name: string;
  url: string;
  apiKey?: string;
  enabled: boolean;
}

export class JobService {
  private jobBoardSources: JobBoardSource[] = [
    { name: 'Indeed', url: 'https://api.indeed.com', enabled: true },
    { name: 'LinkedIn', url: 'https://api.linkedin.com', enabled: true },
    { name: 'Glassdoor', url: 'https://api.glassdoor.com', enabled: true },
    { name: 'ZipRecruiter', url: 'https://api.ziprecruiter.com', enabled: true },
    { name: 'Monster', url: 'https://api.monster.com', enabled: true },
    { name: 'CareerBuilder', url: 'https://api.careerbuilder.com', enabled: true },
    { name: 'Dice', url: 'https://api.dice.com', enabled: true },
    { name: 'AngelList', url: 'https://api.angel.co', enabled: true },
    { name: 'Stack Overflow', url: 'https://api.stackoverflow.com', enabled: true },
    { name: 'GitHub Jobs', url: 'https://api.github.com', enabled: true },
    { name: 'Reed (UK)', url: 'https://api.reed.co.uk', enabled: true },
    { name: 'Xing (DACH)', url: 'https://api.xing.com', enabled: true },
    { name: 'Seek (AU)', url: 'https://api.seek.com.au', enabled: true },
    { name: 'Naukri (India)', url: 'https://api.naukri.com', enabled: true },
    { name: 'StepStone', url: 'https://api.stepstone.com', enabled: true },
  ];

  async searchJobs(query: string, filters: JobSearchFilters = {}, page: number = 1, pageSize: number = 20): Promise<JobSearchResult> {
    try {
      // Search database first
      const dbJobs = await storage.searchJobs(query, filters);
      
      // If no results in database, get sample jobs as fallback
      const allJobs = dbJobs.length > 0 ? dbJobs : await this.getSampleJobs(query, filters);
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      return {
        jobs: allJobs.slice(startIndex, endIndex),
        total: allJobs.length,
        page,
        hasMore: allJobs.length > endIndex,
      };
    } catch (error) {
      console.error('Search jobs error:', error);
      return {
        jobs: [],
        total: 0,
        page,
        hasMore: false,
      };
    }
  }

  async getJobById(id: string): Promise<Job | undefined> {
    return storage.getJob(id);
  }

  async getJobsWithFilters(filters: JobSearchFilters): Promise<Job[]> {
    try {
      const dbJobs = await storage.getJobs(filters);
      // If no results in database, get sample jobs as fallback
      return dbJobs.length > 0 ? dbJobs : await this.getSampleJobs('', filters);
    } catch (error) {
      console.error('Get jobs with filters error:', error);
      return [];
    }
  }

  async getSampleJobs(query: string = '', filters: JobSearchFilters = {}): Promise<Job[]> {
    const sampleJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        description: 'Join our team to build scalable web applications using React, Node.js, and TypeScript.',
        requirements: 'Bachelor\'s degree in Computer Science, 5+ years of experience with React and Node.js',
        location: 'San Francisco, CA',
        salaryMin: 120000,
        salaryMax: 180000,
        jobType: 'full-time',
        experienceLevel: 'senior',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        source: 'linkedin',
        externalId: 'sample_1',
        url: 'https://linkedin.com/jobs/view/sample_1',
        postedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        description: 'Lead product development for our AI-powered platform.',
        requirements: 'MBA or equivalent experience, 3+ years in product management',
        location: 'New York, NY',
        salaryMin: 110000,
        salaryMax: 160000,
        jobType: 'full-time',
        experienceLevel: 'mid',
        skills: ['Product Management', 'Analytics', 'User Research'],
        source: 'indeed',
        externalId: 'sample_2',
        url: 'https://indeed.com/jobs/view/sample_2',
        postedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
      {
        id: '3',
        title: 'Full Stack Developer',
        company: 'WebCorp',
        description: 'Build modern web applications with React, Python, and PostgreSQL.',
        requirements: 'Bachelor\'s degree in Computer Science, 3+ years full-stack development',
        location: 'Remote',
        salaryMin: 100000,
        salaryMax: 140000,
        jobType: 'full-time',
        experienceLevel: 'mid',
        skills: ['React', 'Python', 'PostgreSQL', 'Docker'],
        source: 'remote',
        externalId: 'sample_3',
        url: 'https://remote.co/jobs/view/sample_3',
        postedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
      {
        id: '4',
        title: 'Data Scientist',
        company: 'DataTech',
        description: 'Analyze large datasets and build ML models for business insights.',
        requirements: 'PhD in Data Science, Statistics, or related field, 4+ years experience',
        location: 'Boston, MA',
        salaryMin: 130000,
        salaryMax: 190000,
        jobType: 'full-time',
        experienceLevel: 'senior',
        skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
        source: 'glassdoor',
        externalId: 'sample_4',
        url: 'https://glassdoor.com/jobs/view/sample_4',
        postedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      },
    ];

    // Apply basic filtering
    return sampleJobs.filter(job => {
      if (query && !job.title.toLowerCase().includes(query.toLowerCase()) && 
          !job.company.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      if (filters.location && job.location !== filters.location) {
        return false;
      }
      if (filters.jobType && job.jobType !== filters.jobType) {
        return false;
      }
      if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) {
        return false;
      }
      return true;
    });
  }

  async getJobRecommendations(userId: string, limit: number = 10): Promise<Job[]> {
    try {
      // For now, return sample data to avoid rate limiting
      const sampleJobs = await this.getSampleJobs();
      return sampleJobs.slice(0, limit);
    } catch (error) {
      console.error('Get job recommendations error:', error);
      return [];
    }
  }

  private async fetchJobsFromExternalSources(query: string, filters: JobSearchFilters): Promise<void> {
    // This would integrate with actual job board APIs
    // For now, we'll create some sample jobs to demonstrate the functionality
    const sampleJobs: InsertJob[] = [
      {
        title: "Senior Product Manager",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salaryMin: 140000,
        salaryMax: 180000,
        description: "Lead product strategy for consumer-facing applications. Drive roadmap execution and cross-functional collaboration. Manage product lifecycle from conception to launch.",
        requirements: "5+ years product management experience, MBA preferred, strong analytical skills, experience with agile methodologies",
        skills: ["Product Management", "Strategy", "Agile", "Analytics", "Leadership"],
        jobType: "full-time",
        experienceLevel: "senior",
        source: "Indeed",
        url: "https://indeed.com/jobs/senior-product-manager-123",
        postedAt: new Date(),
      },
      {
        title: "Frontend Developer",
        company: "StartupCo",
        location: "Remote",
        salaryMin: 90000,
        salaryMax: 130000,
        description: "Build modern web applications using React, TypeScript, and Node.js. Work with design team to implement pixel-perfect UIs.",
        requirements: "3+ years React experience, TypeScript knowledge, strong CSS skills, experience with modern build tools",
        skills: ["React", "TypeScript", "CSS", "JavaScript", "Node.js"],
        jobType: "full-time",
        experienceLevel: "mid",
        source: "LinkedIn",
        url: "https://linkedin.com/jobs/frontend-developer-456",
        postedAt: new Date(),
      },
      {
        title: "UX Designer",
        company: "DesignStudio",
        location: "New York, NY",
        salaryMin: 80000,
        salaryMax: 120000,
        description: "Create user-centered designs for web and mobile applications. Conduct user research and usability testing.",
        requirements: "3+ years UX design experience, proficiency in Figma, strong portfolio, user research experience",
        skills: ["UX Design", "Figma", "User Research", "Prototyping", "Visual Design"],
        jobType: "full-time",
        experienceLevel: "mid",
        source: "Glassdoor",
        url: "https://glassdoor.com/jobs/ux-designer-789",
        postedAt: new Date(),
      },
      {
        title: "Data Scientist",
        company: "DataCorp",
        location: "Seattle, WA",
        salaryMin: 120000,
        salaryMax: 160000,
        description: "Analyze large datasets to extract insights and build predictive models. Work with engineering team to deploy ML models.",
        requirements: "PhD in Statistics/CS or equivalent, Python/R expertise, ML experience, strong statistical background",
        skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Analysis"],
        jobType: "full-time",
        experienceLevel: "senior",
        source: "ZipRecruiter",
        url: "https://ziprecruiter.com/jobs/data-scientist-012",
        postedAt: new Date(),
      },
      {
        title: "DevOps Engineer",
        company: "CloudTech",
        location: "Austin, TX",
        salaryMin: 100000,
        salaryMax: 140000,
        description: "Manage cloud infrastructure and CI/CD pipelines. Implement monitoring and automation solutions.",
        requirements: "4+ years DevOps experience, AWS/Azure knowledge, Docker/Kubernetes expertise, automation scripting",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Monitoring"],
        jobType: "full-time",
        experienceLevel: "senior",
        source: "Monster",
        url: "https://monster.com/jobs/devops-engineer-345",
        postedAt: new Date(),
      },
    ];

    // Filter sample jobs based on query and filters
    const filteredJobs = sampleJobs.filter(job => {
      const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase()) ||
                          job.company.toLowerCase().includes(query.toLowerCase()) ||
                          job.skills?.some(skill => skill.toLowerCase().includes(query.toLowerCase()));
      
      const matchesLocation = !filters.location || 
                             job.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
                             job.location?.toLowerCase().includes('remote');
      
      const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
      const matchesExperience = !filters.experienceLevel || job.experienceLevel === filters.experienceLevel;
      const matchesSalary = (!filters.salaryMin || (job.salaryMin && job.salaryMin >= filters.salaryMin)) &&
                           (!filters.salaryMax || (job.salaryMax && job.salaryMax <= filters.salaryMax));

      return matchesQuery && matchesLocation && matchesJobType && matchesExperience && matchesSalary;
    });

    // Save filtered jobs to database
    for (const job of filteredJobs) {
      try {
        await storage.createJob(job);
      } catch (error) {
        // Job might already exist, skip
        console.warn(`Failed to create job: ${error.message}`);
      }
    }
  }

  async applyToJob(userId: string, jobId: string, resumeId?: string): Promise<void> {
    try {
      // Check if already applied
      const existingApplications = await storage.getJobApplications(userId);
      const alreadyApplied = existingApplications.some(app => app.jobId === jobId);
      
      if (alreadyApplied) {
        throw new Error('Already applied to this job');
      }

      // Get job details
      const job = await storage.getJob(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      // Calculate match score if resume provided
      let matchScore = 0;
      if (resumeId) {
        const resume = await storage.getResume(resumeId);
        if (resume) {
          const matchResult = await aiService.matchJobToResume(
            job.description || '',
            resume.content || ''
          );
          matchScore = matchResult.matchScore;
        }
      }

      // Create application
      await storage.createJobApplication({
        userId,
        jobId,
        status: 'applied',
        matchScore: matchScore.toString(),
      });

      // Create notification
      await storage.createNotification({
        userId,
        type: 'application_submitted',
        title: 'Application Submitted',
        message: `Your application for ${job.title} at ${job.company} has been submitted.`,
      });

    } catch (error) {
      throw new Error(`Failed to apply to job: ${error.message}`);
    }
  }

  async getJobApplications(userId: string): Promise<any[]> {
    try {
      const applications = await storage.getJobApplications(userId);
      
      // Enrich applications with job details
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const job = await storage.getJob(app.jobId);
          return {
            ...app,
            job,
          };
        })
      );

      return enrichedApplications;
    } catch (error) {
      throw new Error(`Failed to get job applications: ${error.message}`);
    }
  }

  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<void> {
    try {
      await storage.updateJobApplication(applicationId, {
        status,
        notes,
      });
    } catch (error) {
      throw new Error(`Failed to update application status: ${error.message}`);
    }
  }

  async getJobApplicationStats(userId: string): Promise<any> {
    return storage.getJobApplicationStats(userId);
  }
}

export const jobService = new JobService();
