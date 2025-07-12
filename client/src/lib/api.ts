import { apiRequest } from "./queryClient";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  requirements?: string;
  skills?: string[];
  jobType?: string;
  experienceLevel?: string;
  source?: string;
  url?: string;
  postedAt?: Date;
  matchScore?: number;
}

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

export interface Resume {
  id: string;
  userId: string;
  name: string;
  content?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  atsScore?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResumeAnalysis {
  atsScore: number;
  keywordOptimization: number;
  impactStatements: number;
  suggestions: string[];
  missingKeywords: string[];
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  status: string;
  matchScore?: number;
  appliedAt?: Date;
  lastUpdated?: Date;
  notes?: string;
  interviewDate?: Date;
  offerAmount?: number;
  job?: Job;
}

export interface InterviewQuestion {
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
}

export interface InterviewFeedback {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  feedback: string;
  improvements: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: Date;
  createdAt?: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  jobTitles?: string[];
  locations?: string[];
  salaryMin?: number;
  salaryMax?: number;
  jobTypes?: string[];
  experienceLevels?: string[];
  skills?: string[];
  emailNotifications?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}

export interface DashboardStats {
  totalApplications: number;
  interviews: number;
  offers: number;
  averageMatchScore: number;
  responseRate: number;
  interviewRate: number;
  weeklyApplications: number[];
  topSkills: string[];
  salaryInsights: {
    min: number;
    max: number;
    average: number;
    marketTrend: string;
  };
}

// Job API
export const jobsApi = {
  search: async (query: string, filters: JobSearchFilters = {}, page = 1, limit = 20): Promise<JobSearchResult> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, v.toString()])
      ),
    });
    
    const response = await apiRequest('GET', `/api/jobs/search?${params}`);
    return response.json();
  },

  getById: async (id: string): Promise<Job> => {
    const response = await apiRequest('GET', `/api/jobs/${id}`);
    return response.json();
  },

  getRecommendations: async (limit = 10): Promise<Job[]> => {
    const response = await apiRequest('GET', `/api/jobs/recommendations?limit=${limit}`);
    return response.json();
  },

  apply: async (jobId: string, resumeId?: string): Promise<void> => {
    await apiRequest('POST', `/api/jobs/${jobId}/apply`, { resumeId });
  },
};

// Resume API
export const resumeApi = {
  getAll: async (): Promise<Resume[]> => {
    const response = await apiRequest('GET', '/api/resumes');
    return response.json();
  },

  getById: async (id: string): Promise<Resume> => {
    const response = await apiRequest('GET', `/api/resumes/${id}`);
    return response.json();
  },

  create: async (resume: Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Resume> => {
    const response = await apiRequest('POST', '/api/resumes', resume);
    return response.json();
  },

  update: async (id: string, resume: Partial<Resume>): Promise<Resume> => {
    const response = await apiRequest('PUT', `/api/resumes/${id}`, resume);
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest('DELETE', `/api/resumes/${id}`);
  },

  analyze: async (id: string, jobDescription?: string): Promise<ResumeAnalysis> => {
    const response = await apiRequest('POST', `/api/resumes/${id}/analyze`, { jobDescription });
    return response.json();
  },

  optimize: async (id: string, jobDescription: string): Promise<Resume> => {
    const response = await apiRequest('POST', `/api/resumes/${id}/optimize`, { jobDescription });
    return response.json();
  },
};

// Application API
export const applicationApi = {
  getAll: async (): Promise<JobApplication[]> => {
    const response = await apiRequest('GET', '/api/applications');
    return response.json();
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest('GET', '/api/applications/stats');
    return response.json();
  },

  updateStatus: async (id: string, status: string, notes?: string): Promise<void> => {
    await apiRequest('PUT', `/api/applications/${id}/status`, { status, notes });
  },
};

// Interview API
export const interviewApi = {
  getSessions: async () => {
    const response = await apiRequest('GET', '/api/interviews/sessions');
    return response.json();
  },

  createSession: async (sessionData: any) => {
    const response = await apiRequest('POST', '/api/interviews/sessions', sessionData);
    return response.json();
  },

  generateQuestions: async (jobDescription: string, resumeContent: string, count = 10): Promise<InterviewQuestion[]> => {
    const response = await apiRequest('POST', '/api/interviews/questions', {
      jobDescription,
      resumeContent,
      count,
    });
    return response.json();
  },

  evaluateResponse: async (question: string, response: string, jobDescription: string): Promise<InterviewFeedback> => {
    const response_api = await apiRequest('POST', '/api/interviews/evaluate', {
      question,
      response,
      jobDescription,
    });
    return response_api.json();
  },
};

// AI API
export const aiApi = {
  matchJob: async (jobDescription: string, resumeContent: string) => {
    const response = await apiRequest('POST', '/api/ai/match-job', {
      jobDescription,
      resumeContent,
    });
    return response.json();
  },

  generateCoverLetter: async (jobDescription: string, resumeContent: string, companyName: string): Promise<string> => {
    const response = await apiRequest('POST', '/api/ai/cover-letter', {
      jobDescription,
      resumeContent,
      companyName,
    });
    const data = await response.json();
    return data.coverLetter;
  },

  generateSalaryNegotiation: async (jobTitle: string, experience: string, location: string, currentOffer?: number) => {
    const response = await apiRequest('POST', '/api/ai/salary-negotiation', {
      jobTitle,
      experience,
      location,
      currentOffer,
    });
    return response.json();
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiRequest('GET', '/api/user/profile');
    return response.json();
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiRequest('PUT', '/api/user/profile', updates);
    return response.json();
  },

  getPreferences: async (): Promise<UserPreferences> => {
    const response = await apiRequest('GET', '/api/user/preferences');
    return response.json();
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const method = preferences.id ? 'PUT' : 'POST';
    const response = await apiRequest(method, '/api/user/preferences', preferences);
    return response.json();
  },
};

// Subscription API
export const subscriptionApi = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiRequest('GET', '/api/subscriptions/plans');
    return response.json();
  },

  createSubscription: async (planId: string): Promise<{ subscriptionId: string; clientSecret: string }> => {
    const response = await apiRequest('POST', '/api/subscriptions/create', { planId });
    return response.json();
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiRequest('GET', '/api/analytics/dashboard');
    return response.json();
  },
};

// Notifications API
export const notificationApi = {
  getAll: async () => {
    const response = await apiRequest('GET', '/api/notifications');
    return response.json();
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiRequest('PUT', `/api/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await apiRequest('PUT', '/api/notifications/read-all');
  },
};
