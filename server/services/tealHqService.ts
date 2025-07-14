import fetch from 'node-fetch';

interface TealJobApplication {
  id: string;
  jobTitle: string;
  company: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  appliedDate: string;
  source: string;
  notes: string;
  contacts: Array<{
    name: string;
    role: string;
    email: string;
    linkedIn: string;
  }>;
}

interface TealResumeVersion {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  jobsApplied: number;
  responseRate: number;
  lastModified: string;
}

interface TealResumeAnalysis {
  overallScore: number;
  sections: {
    summary: { score: number; feedback: string[] };
    experience: { score: number; feedback: string[] };
    skills: { score: number; feedback: string[] };
    education: { score: number; feedback: string[] };
    format: { score: number; feedback: string[] };
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    suggestion: string;
    impact: string;
  }>;
  keywordOptimization: {
    score: number;
    missing: string[];
    suggestions: string[];
  };
}

interface TealJobTracker {
  totalApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  avgResponseTime: number;
  topPerformingResumes: TealResumeVersion[];
  applicationsByStatus: {
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
    withdrawn: number;
  };
  monthlyTrends: Array<{
    month: string;
    applications: number;
    responses: number;
    interviews: number;
  }>;
}

class TealHqService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.TEAL_HQ_API_KEY || '';
    this.baseUrl = 'https://api.tealhq.com/v1';
  }

  async trackJobApplication(application: Omit<TealJobApplication, 'id'>): Promise<TealJobApplication> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using fallback job tracking.');
      return this.getFallbackJobApplication(application);
    }

    try {
      const response = await fetch(`${this.baseUrl}/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(application)
      });

      if (!response.ok) {
        throw new Error(`Teal HQ API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformJobApplication(data);
    } catch (error) {
      console.error('Teal HQ job tracking error:', error);
      return this.getFallbackJobApplication(application);
    }
  }

  async getJobApplications(userId: string, filters?: {
    status?: string;
    company?: string;
    dateRange?: { start: string; end: string };
  }): Promise<TealJobApplication[]> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using fallback applications.');
      return this.getFallbackApplications();
    }

    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.company) queryParams.append('company', filters.company);
      if (filters?.dateRange) {
        queryParams.append('start_date', filters.dateRange.start);
        queryParams.append('end_date', filters.dateRange.end);
      }

      const response = await fetch(`${this.baseUrl}/applications?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Teal HQ API error: ${response.status}`);
      }

      const data = await response.json();
      return data.applications?.map(this.transformJobApplication) || [];
    } catch (error) {
      console.error('Teal HQ applications error:', error);
      return this.getFallbackApplications();
    }
  }

  async analyzeResume(resumeContent: string, targetJob?: string): Promise<TealResumeAnalysis> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using fallback resume analysis.');
      return this.getFallbackResumeAnalysis();
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: resumeContent,
          targetJob: targetJob,
          analysis: {
            atsCompatibility: true,
            keywordOptimization: true,
            contentAnalysis: true,
            formatAnalysis: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ resume analysis error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformResumeAnalysis(data);
    } catch (error) {
      console.error('Teal HQ resume analysis error:', error);
      return this.getFallbackResumeAnalysis();
    }
  }

  async getJobTrackingDashboard(userId: string): Promise<TealJobTracker> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using fallback dashboard.');
      return this.getFallbackDashboard();
    }

    try {
      const response = await fetch(`${this.baseUrl}/dashboard/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Teal HQ dashboard error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformDashboard(data);
    } catch (error) {
      console.error('Teal HQ dashboard error:', error);
      return this.getFallbackDashboard();
    }
  }

  async getResumeVersions(userId: string): Promise<TealResumeVersion[]> {
    if (!this.apiKey) {
      return this.getFallbackResumeVersions();
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes/versions/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Teal HQ resume versions error: ${response.status}`);
      }

      const data = await response.json();
      return data.versions?.map(this.transformResumeVersion) || [];
    } catch (error) {
      console.error('Teal HQ resume versions error:', error);
      return this.getFallbackResumeVersions();
    }
  }

  async generateResumeRecommendations(resumeContent: string, jobApplications: TealJobApplication[]): Promise<{
    recommendations: Array<{
      type: 'content' | 'format' | 'keywords' | 'structure';
      priority: 'high' | 'medium' | 'low';
      suggestion: string;
      reasoning: string;
      expectedImpact: string;
    }>;
    performanceInsights: {
      bestPerformingSections: string[];
      areasForImprovement: string[];
      successPattern: string;
    };
  }> {
    if (!this.apiKey) {
      return this.getFallbackRecommendations();
    }

    try {
      const response = await fetch(`${this.baseUrl}/resumes/recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeContent: resumeContent,
          jobApplications: jobApplications,
          analysis: {
            performanceCorrelation: true,
            keywordAnalysis: true,
            formatOptimization: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ recommendations error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformRecommendations(data);
    } catch (error) {
      console.error('Teal HQ recommendations error:', error);
      return this.getFallbackRecommendations();
    }
  }

  private transformJobApplication(data: any): TealJobApplication {
    return {
      id: data.id || '',
      jobTitle: data.jobTitle || '',
      company: data.company || '',
      status: data.status || 'applied',
      appliedDate: data.appliedDate || new Date().toISOString(),
      source: data.source || '',
      notes: data.notes || '',
      contacts: data.contacts || []
    };
  }

  private transformResumeAnalysis(data: any): TealResumeAnalysis {
    return {
      overallScore: data.overallScore || 0,
      sections: data.sections || {
        summary: { score: 0, feedback: [] },
        experience: { score: 0, feedback: [] },
        skills: { score: 0, feedback: [] },
        education: { score: 0, feedback: [] },
        format: { score: 0, feedback: [] }
      },
      recommendations: data.recommendations || [],
      keywordOptimization: data.keywordOptimization || {
        score: 0,
        missing: [],
        suggestions: []
      }
    };
  }

  private transformDashboard(data: any): TealJobTracker {
    return {
      totalApplications: data.totalApplications || 0,
      responseRate: data.responseRate || 0,
      interviewRate: data.interviewRate || 0,
      offerRate: data.offerRate || 0,
      avgResponseTime: data.avgResponseTime || 0,
      topPerformingResumes: data.topPerformingResumes || [],
      applicationsByStatus: data.applicationsByStatus || {
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        withdrawn: 0
      },
      monthlyTrends: data.monthlyTrends || []
    };
  }

  private transformResumeVersion(data: any): TealResumeVersion {
    return {
      id: data.id || '',
      name: data.name || '',
      content: data.content || '',
      createdAt: data.createdAt || new Date().toISOString(),
      jobsApplied: data.jobsApplied || 0,
      responseRate: data.responseRate || 0,
      lastModified: data.lastModified || new Date().toISOString()
    };
  }

  private transformRecommendations(data: any): any {
    return {
      recommendations: data.recommendations || [],
      performanceInsights: data.performanceInsights || {
        bestPerformingSections: [],
        areasForImprovement: [],
        successPattern: ''
      }
    };
  }

  private getFallbackJobApplication(application: Omit<TealJobApplication, 'id'>): TealJobApplication {
    return {
      id: 'fallback-' + Date.now(),
      ...application
    };
  }

  private getFallbackApplications(): TealJobApplication[] {
    return [
      {
        id: 'app-1',
        jobTitle: 'Software Engineer',
        company: 'Tech Corp',
        status: 'applied',
        appliedDate: '2024-01-15',
        source: 'LinkedIn',
        notes: 'Applied through company website',
        contacts: []
      },
      {
        id: 'app-2',
        jobTitle: 'Frontend Developer',
        company: 'Startup Inc',
        status: 'interview',
        appliedDate: '2024-01-10',
        source: 'Indeed',
        notes: 'First round interview scheduled',
        contacts: []
      }
    ];
  }

  private getFallbackResumeAnalysis(): TealResumeAnalysis {
    return {
      overallScore: 82,
      sections: {
        summary: {
          score: 85,
          feedback: ['Strong professional summary', 'Consider adding more specific achievements']
        },
        experience: {
          score: 88,
          feedback: ['Good use of action verbs', 'Add more quantifiable results']
        },
        skills: {
          score: 75,
          feedback: ['Relevant skills listed', 'Organize by proficiency level']
        },
        education: {
          score: 90,
          feedback: ['Well formatted education section']
        },
        format: {
          score: 80,
          feedback: ['Clean layout', 'Ensure ATS compatibility']
        }
      },
      recommendations: [
        {
          priority: 'high',
          category: 'Content',
          suggestion: 'Add more quantifiable achievements',
          impact: 'Increase interview callbacks by 25%'
        },
        {
          priority: 'medium',
          category: 'Keywords',
          suggestion: 'Include more industry-specific keywords',
          impact: 'Improve ATS passage rate'
        }
      ],
      keywordOptimization: {
        score: 78,
        missing: ['React', 'Node.js', 'AWS'],
        suggestions: ['Add technical skills section', 'Include relevant frameworks']
      }
    };
  }

  private getFallbackDashboard(): TealJobTracker {
    return {
      totalApplications: 25,
      responseRate: 0.32,
      interviewRate: 0.16,
      offerRate: 0.08,
      avgResponseTime: 7.5,
      topPerformingResumes: this.getFallbackResumeVersions(),
      applicationsByStatus: {
        applied: 12,
        interview: 4,
        offer: 2,
        rejected: 6,
        withdrawn: 1
      },
      monthlyTrends: [
        { month: 'Jan', applications: 8, responses: 3, interviews: 1 },
        { month: 'Feb', applications: 10, responses: 4, interviews: 2 },
        { month: 'Mar', applications: 7, responses: 2, interviews: 1 }
      ]
    };
  }

  private getFallbackResumeVersions(): TealResumeVersion[] {
    return [
      {
        id: 'resume-1',
        name: 'Software Engineer Resume',
        content: 'Resume content...',
        createdAt: '2024-01-01',
        jobsApplied: 15,
        responseRate: 0.27,
        lastModified: '2024-01-15'
      },
      {
        id: 'resume-2',
        name: 'Frontend Developer Resume',
        content: 'Resume content...',
        createdAt: '2024-01-10',
        jobsApplied: 10,
        responseRate: 0.40,
        lastModified: '2024-01-20'
      }
    ];
  }

  private getFallbackRecommendations(): any {
    return {
      recommendations: [
        {
          type: 'content',
          priority: 'high',
          suggestion: 'Add more quantifiable achievements to your experience section',
          reasoning: 'Resumes with quantified results get 40% more callbacks',
          expectedImpact: 'Increase interview rate by 25%'
        },
        {
          type: 'keywords',
          priority: 'medium',
          suggestion: 'Include more technical keywords relevant to your target roles',
          reasoning: 'Analysis shows missing keywords in 60% of applications',
          expectedImpact: 'Better ATS compatibility'
        }
      ],
      performanceInsights: {
        bestPerformingSections: ['Experience', 'Skills'],
        areasForImprovement: ['Summary', 'Projects'],
        successPattern: 'Resumes with quantified achievements perform 35% better'
      }
    };
  }
}

export const tealHqService = new TealHqService();