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

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  matchScore?: number;
  appliedAt?: Date;
  lastUpdated?: Date;
  notes?: string;
  interviewDate?: Date;
  offerAmount?: number;
  job?: Job;
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

export interface InterviewQuestion {
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  keywordOptimization: number;
  impactStatements: number;
  suggestions: string[];
  missingKeywords: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
}
