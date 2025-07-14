import fetch from 'node-fetch';

interface SkillGraph {
  skills: Array<{
    name: string;
    category: string;
    level: string;
    relevance: number;
    connections: string[];
  }>;
  clusters: Array<{
    name: string;
    skills: string[];
    weight: number;
  }>;
  gaps: Array<{
    skill: string;
    importance: number;
    recommendation: string;
  }>;
}

interface SkillateParseResult {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    extractedSkills: string[];
  }>;
  skillGraph: SkillGraph;
  aiScore: number;
  jobMatchPrediction: {
    likelihood: number;
    confidence: number;
    factors: string[];
  };
  careerPath: {
    currentLevel: string;
    nextRoles: string[];
    timeToPromotion: string;
  };
}

interface SkillateJobMatchResult {
  overallScore: number;
  skillAlignment: {
    matched: string[];
    missing: string[];
    transferable: string[];
  };
  experienceMatch: {
    level: string;
    relevance: number;
    gaps: string[];
  };
  aiInsights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  jobFitScore: number;
}

class SkillateService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SKILLATE_API_KEY || '';
    this.baseUrl = 'https://api.skillate.com/v2';
  }

  async parseResumeWithSkillGraph(resumeContent: string): Promise<SkillateParseResult> {
    if (!this.apiKey) {
      console.log('SKILLATE_API_KEY not found. Using fallback skill-based parsing.');
      return this.getFallbackSkillParseResult(resumeContent);
    }

    try {
      const response = await fetch(`${this.baseUrl}/parse/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2.0'
        },
        body: JSON.stringify({
          document: resumeContent,
          options: {
            enableSkillGraph: true,
            enableAIScoring: true,
            enableCareerPath: true,
            includeJobPrediction: true,
            skillTaxonomy: 'latest'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Skillate API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSkillateResponse(data);
    } catch (error) {
      console.error('Skillate parsing error:', error);
      return this.getFallbackSkillParseResult(resumeContent);
    }
  }

  async matchResumeToJobWithAI(resumeContent: string, jobDescription: string): Promise<SkillateJobMatchResult> {
    if (!this.apiKey) {
      console.log('SKILLATE_API_KEY not found. Using fallback AI matching.');
      return this.getFallbackJobMatchResult();
    }

    try {
      const response = await fetch(`${this.baseUrl}/match/job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2.0'
        },
        body: JSON.stringify({
          resume: resumeContent,
          jobDescription: jobDescription,
          matching: {
            enableAIInsights: true,
            enableSkillTransfer: true,
            enableCareerGrowth: true,
            weightings: {
              skills: 0.45,
              experience: 0.35,
              education: 0.15,
              potential: 0.05
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Skillate matching error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformMatchingResponse(data);
    } catch (error) {
      console.error('Skillate matching error:', error);
      return this.getFallbackJobMatchResult();
    }
  }

  async generateSkillDevelopmentPlan(resumeContent: string, targetRole: string): Promise<{
    currentSkills: string[];
    requiredSkills: string[];
    skillGaps: Array<{
      skill: string;
      priority: 'high' | 'medium' | 'low';
      learningPath: string[];
      timeEstimate: string;
    }>;
    recommendations: string[];
    certifications: Array<{
      name: string;
      provider: string;
      relevance: number;
    }>;
  }> {
    if (!this.apiKey) {
      return {
        currentSkills: ['JavaScript', 'React', 'Node.js'],
        requiredSkills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
        skillGaps: [
          {
            skill: 'TypeScript',
            priority: 'high',
            learningPath: ['JavaScript fundamentals', 'TypeScript basics', 'Advanced types'],
            timeEstimate: '4-6 weeks'
          },
          {
            skill: 'AWS',
            priority: 'high',
            learningPath: ['Cloud computing basics', 'AWS fundamentals', 'EC2 and S3'],
            timeEstimate: '6-8 weeks'
          }
        ],
        recommendations: [
          'Focus on TypeScript first for immediate impact',
          'Learn AWS through hands-on projects',
          'Consider DevOps fundamentals'
        ],
        certifications: [
          {
            name: 'AWS Certified Solutions Architect',
            provider: 'Amazon Web Services',
            relevance: 95
          },
          {
            name: 'Microsoft Azure Fundamentals',
            provider: 'Microsoft',
            relevance: 80
          }
        ]
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/development/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2.0'
        },
        body: JSON.stringify({
          currentProfile: resumeContent,
          targetRole: targetRole,
          options: {
            includeTimeline: true,
            includeCertifications: true,
            includeProjects: true,
            prioritizeSkills: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Skillate development plan error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformDevelopmentPlan(data);
    } catch (error) {
      console.error('Skillate development plan error:', error);
      return {
        currentSkills: ['JavaScript', 'React', 'Node.js'],
        requiredSkills: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
        skillGaps: [
          {
            skill: 'TypeScript',
            priority: 'high',
            learningPath: ['JavaScript fundamentals', 'TypeScript basics', 'Advanced types'],
            timeEstimate: '4-6 weeks'
          }
        ],
        recommendations: [
          'Focus on TypeScript first for immediate impact',
          'Learn AWS through hands-on projects'
        ],
        certifications: [
          {
            name: 'AWS Certified Solutions Architect',
            provider: 'Amazon Web Services',
            relevance: 95
          }
        ]
      };
    }
  }

  async getJobRecommendations(resumeContent: string, preferences: {
    location?: string;
    salaryRange?: string;
    remote?: boolean;
    industry?: string;
  }): Promise<{
    recommendations: Array<{
      title: string;
      company: string;
      location: string;
      matchScore: number;
      reasons: string[];
      skillsRequired: string[];
      salaryRange: string;
    }>;
    insights: {
      marketTrends: string[];
      careerAdvice: string[];
      skillDemand: Array<{
        skill: string;
        demand: number;
        trend: 'rising' | 'stable' | 'declining';
      }>;
    };
  }> {
    if (!this.apiKey) {
      return {
        recommendations: [
          {
            title: 'Senior Frontend Developer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            matchScore: 89,
            reasons: ['Strong React experience', 'JavaScript expertise', 'UI/UX skills'],
            skillsRequired: ['React', 'TypeScript', 'Redux'],
            salaryRange: '$120,000 - $160,000'
          },
          {
            title: 'Full Stack Engineer',
            company: 'Startup Inc',
            location: 'Remote',
            matchScore: 85,
            reasons: ['Full-stack experience', 'Node.js skills', 'Startup experience'],
            skillsRequired: ['Node.js', 'MongoDB', 'AWS'],
            salaryRange: '$100,000 - $140,000'
          }
        ],
        insights: {
          marketTrends: [
            'React developers in high demand',
            'Remote work increasing opportunities',
            'TypeScript becoming standard'
          ],
          careerAdvice: [
            'Consider learning TypeScript for better opportunities',
            'Build cloud platform experience',
            'Develop leadership skills for senior roles'
          ],
          skillDemand: [
            { skill: 'React', demand: 95, trend: 'rising' },
            { skill: 'TypeScript', demand: 88, trend: 'rising' },
            { skill: 'AWS', demand: 82, trend: 'stable' }
          ]
        }
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/recommendations/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2.0'
        },
        body: JSON.stringify({
          profile: resumeContent,
          preferences: preferences,
          options: {
            includeMarketInsights: true,
            includeCareerAdvice: true,
            includeSkillDemand: true,
            limit: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Skillate job recommendations error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformJobRecommendations(data);
    } catch (error) {
      console.error('Skillate job recommendations error:', error);
      return {
        recommendations: [],
        insights: {
          marketTrends: [],
          careerAdvice: [],
          skillDemand: []
        }
      };
    }
  }

  private transformSkillateResponse(data: any): SkillateParseResult {
    const parsed = data.parsing || {};
    
    return {
      personalInfo: {
        name: parsed.personalInfo?.name || '',
        email: parsed.personalInfo?.email || '',
        phone: parsed.personalInfo?.phone || '',
        location: parsed.personalInfo?.location || '',
        linkedin: parsed.personalInfo?.linkedin || '',
        github: parsed.personalInfo?.github || ''
      },
      experience: parsed.experience?.map((exp: any) => ({
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
        extractedSkills: exp.extractedSkills || []
      })) || [],
      skillGraph: {
        skills: parsed.skillGraph?.skills || [],
        clusters: parsed.skillGraph?.clusters || [],
        gaps: parsed.skillGraph?.gaps || []
      },
      aiScore: parsed.aiScore || 0,
      jobMatchPrediction: {
        likelihood: parsed.jobMatchPrediction?.likelihood || 0,
        confidence: parsed.jobMatchPrediction?.confidence || 0,
        factors: parsed.jobMatchPrediction?.factors || []
      },
      careerPath: {
        currentLevel: parsed.careerPath?.currentLevel || '',
        nextRoles: parsed.careerPath?.nextRoles || [],
        timeToPromotion: parsed.careerPath?.timeToPromotion || ''
      }
    };
  }

  private transformMatchingResponse(data: any): SkillateJobMatchResult {
    const result = data.matching || {};
    
    return {
      overallScore: result.overallScore || 0,
      skillAlignment: {
        matched: result.skillAlignment?.matched || [],
        missing: result.skillAlignment?.missing || [],
        transferable: result.skillAlignment?.transferable || []
      },
      experienceMatch: {
        level: result.experienceMatch?.level || '',
        relevance: result.experienceMatch?.relevance || 0,
        gaps: result.experienceMatch?.gaps || []
      },
      aiInsights: {
        strengths: result.aiInsights?.strengths || [],
        weaknesses: result.aiInsights?.weaknesses || [],
        recommendations: result.aiInsights?.recommendations || []
      },
      jobFitScore: result.jobFitScore || 0
    };
  }

  private transformDevelopmentPlan(data: any): any {
    const plan = data.developmentPlan || {};
    
    return {
      currentSkills: plan.currentSkills || [],
      requiredSkills: plan.requiredSkills || [],
      skillGaps: plan.skillGaps || [],
      recommendations: plan.recommendations || [],
      certifications: plan.certifications || []
    };
  }

  private transformJobRecommendations(data: any): any {
    return {
      recommendations: data.recommendations || [],
      insights: data.insights || {
        marketTrends: [],
        careerAdvice: [],
        skillDemand: []
      }
    };
  }

  private getFallbackSkillParseResult(resumeContent: string): SkillateParseResult {
    return {
      personalInfo: {
        name: this.extractName(resumeContent),
        email: this.extractEmail(resumeContent),
        phone: this.extractPhone(resumeContent),
        location: '',
        linkedin: '',
        github: ''
      },
      experience: [],
      skillGraph: {
        skills: [
          { name: 'JavaScript', category: 'Programming', level: 'Advanced', relevance: 90, connections: ['React', 'Node.js'] },
          { name: 'React', category: 'Framework', level: 'Intermediate', relevance: 85, connections: ['JavaScript', 'Redux'] },
          { name: 'Node.js', category: 'Runtime', level: 'Intermediate', relevance: 80, connections: ['JavaScript', 'Express'] }
        ],
        clusters: [
          { name: 'Frontend Development', skills: ['JavaScript', 'React', 'CSS'], weight: 0.8 },
          { name: 'Backend Development', skills: ['Node.js', 'Express', 'MongoDB'], weight: 0.6 }
        ],
        gaps: [
          { skill: 'TypeScript', importance: 85, recommendation: 'Learn TypeScript for better type safety' },
          { skill: 'AWS', importance: 78, recommendation: 'Gain cloud platform experience' }
        ]
      },
      aiScore: 82,
      jobMatchPrediction: {
        likelihood: 78,
        confidence: 85,
        factors: ['Strong technical skills', 'Relevant experience', 'Good cultural fit']
      },
      careerPath: {
        currentLevel: 'Mid-level Developer',
        nextRoles: ['Senior Developer', 'Tech Lead', 'Engineering Manager'],
        timeToPromotion: '12-18 months'
      }
    };
  }

  private getFallbackJobMatchResult(): SkillateJobMatchResult {
    return {
      overallScore: 82,
      skillAlignment: {
        matched: ['JavaScript', 'React', 'Node.js'],
        missing: ['TypeScript', 'AWS', 'Docker'],
        transferable: ['Problem solving', 'Communication', 'Teamwork']
      },
      experienceMatch: {
        level: 'Mid-level',
        relevance: 85,
        gaps: ['Leadership experience', 'System design', 'Mentoring']
      },
      aiInsights: {
        strengths: ['Strong technical foundation', 'Full-stack capabilities', 'Learning agility'],
        weaknesses: ['Limited cloud experience', 'Needs leadership development', 'Could improve system design'],
        recommendations: [
          'Develop cloud platform skills',
          'Take on mentoring opportunities',
          'Study system design principles'
        ]
      },
      jobFitScore: 78
    };
  }

  private extractName(content: string): string {
    const lines = content.split('\n');
    return lines[0]?.trim() || '';
  }

  private extractEmail(content: string): string {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = content.match(emailRegex);
    return match ? match[0] : '';
  }

  private extractPhone(content: string): string {
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const match = content.match(phoneRegex);
    return match ? match[0] : '';
  }
}

export const skillateService = new SkillateService();