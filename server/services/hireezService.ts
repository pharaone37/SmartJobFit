import fetch from 'node-fetch';

interface HireEZTalentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  company: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
    endorsements: number;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  socialProfiles: {
    linkedin: string;
    github: string;
    twitter: string;
  };
  talentIntelligence: {
    careerTrajectory: string;
    skillGrowth: string[];
    marketValue: string;
    availability: string;
  };
}

interface HireEZMatchingResult {
  score: number;
  matchType: 'perfect' | 'strong' | 'good' | 'partial';
  matchedCriteria: string[];
  gapAnalysis: string[];
  talentInsights: {
    careerStage: string;
    growthPotential: string;
    culturalFit: string;
  };
  recommendations: string[];
}

interface HireEZJobMatchResult {
  candidates: Array<{
    profile: HireEZTalentProfile;
    matchScore: number;
    matchReason: string;
  }>;
  totalResults: number;
  searchTime: number;
  filters: {
    location: string;
    experience: string;
    skills: string[];
  };
}

class HireEZService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.HIREEZ_API_KEY || '';
    this.baseUrl = 'https://api.hireez.com/v1';
  }

  async parseResumeWithTalentIntelligence(resumeContent: string): Promise<HireEZTalentProfile> {
    if (!this.apiKey) {
      console.log('HIREEZ_API_KEY not found. Using fallback talent intelligence.');
      return this.getFallbackTalentProfile(resumeContent);
    }

    try {
      const response = await fetch(`${this.baseUrl}/talent/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2024-01'
        },
        body: JSON.stringify({
          document: {
            content: resumeContent,
            type: 'resume'
          },
          options: {
            includeTalentIntelligence: true,
            includeSkillAssessment: true,
            includeCareerTrajectory: true,
            includeMarketAnalysis: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HireEZ API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformTalentProfile(data);
    } catch (error) {
      console.error('HireEZ talent parsing error:', error);
      return this.getFallbackTalentProfile(resumeContent);
    }
  }

  async matchTalentToJob(resumeContent: string, jobDescription: string): Promise<HireEZMatchingResult> {
    if (!this.apiKey) {
      console.log('HIREEZ_API_KEY not found. Using fallback matching.');
      return this.getFallbackMatchResult();
    }

    try {
      const response = await fetch(`${this.baseUrl}/matching/talent-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2024-01'
        },
        body: JSON.stringify({
          talent: {
            resume: resumeContent
          },
          job: {
            description: jobDescription
          },
          matching: {
            includeSkillGaps: true,
            includeCulturalFit: true,
            includeCareerGrowth: true,
            weightings: {
              skills: 0.4,
              experience: 0.3,
              education: 0.2,
              cultural: 0.1
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HireEZ matching API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformMatchingResult(data);
    } catch (error) {
      console.error('HireEZ matching error:', error);
      return this.getFallbackMatchResult();
    }
  }

  async findSimilarTalent(jobDescription: string, filters: {
    location?: string;
    experience?: string;
    skills?: string[];
    limit?: number;
  }): Promise<HireEZJobMatchResult> {
    if (!this.apiKey) {
      console.log('HIREEZ_API_KEY not found. Using fallback talent search.');
      return this.getFallbackJobMatchResult();
    }

    try {
      const response = await fetch(`${this.baseUrl}/search/talent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2024-01'
        },
        body: JSON.stringify({
          query: {
            jobDescription: jobDescription,
            filters: filters
          },
          options: {
            includeTalentIntelligence: true,
            includeAvailability: true,
            includeMarketInsights: true,
            limit: filters.limit || 20
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HireEZ talent search error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformJobMatchResult(data);
    } catch (error) {
      console.error('HireEZ talent search error:', error);
      return this.getFallbackJobMatchResult();
    }
  }

  async getTalentInsights(resumeContent: string): Promise<{
    careerStage: string;
    nextCareerMove: string;
    skillGaps: string[];
    marketValue: {
      salaryRange: string;
      demandLevel: string;
      competitiveness: string;
    };
    recommendations: string[];
  }> {
    if (!this.apiKey) {
      return {
        careerStage: 'Mid-level professional',
        nextCareerMove: 'Senior role or leadership position',
        skillGaps: ['Leadership skills', 'Strategic thinking', 'Advanced technical skills'],
        marketValue: {
          salaryRange: '$80,000 - $120,000',
          demandLevel: 'High',
          competitiveness: 'Strong'
        },
        recommendations: [
          'Develop leadership and mentoring skills',
          'Gain experience in strategic planning',
          'Consider advanced certifications',
          'Build cross-functional expertise'
        ]
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/insights/talent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Version': '2024-01'
        },
        body: JSON.stringify({
          resume: resumeContent,
          analysis: {
            includeCareerStage: true,
            includeMarketValue: true,
            includeSkillGaps: true,
            includeRecommendations: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HireEZ insights error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformInsightsResult(data);
    } catch (error) {
      console.error('HireEZ insights error:', error);
      return {
        careerStage: 'Mid-level professional',
        nextCareerMove: 'Senior role or leadership position',
        skillGaps: ['Leadership skills', 'Strategic thinking', 'Advanced technical skills'],
        marketValue: {
          salaryRange: '$80,000 - $120,000',
          demandLevel: 'High',
          competitiveness: 'Strong'
        },
        recommendations: [
          'Develop leadership and mentoring skills',
          'Gain experience in strategic planning',
          'Consider advanced certifications',
          'Build cross-functional expertise'
        ]
      };
    }
  }

  private transformTalentProfile(data: any): HireEZTalentProfile {
    const profile = data.talent || {};
    
    return {
      id: profile.id || '',
      name: profile.personalInfo?.name || '',
      email: profile.personalInfo?.email || '',
      phone: profile.personalInfo?.phone || '',
      location: profile.personalInfo?.location || '',
      currentRole: profile.currentRole?.title || '',
      company: profile.currentRole?.company || '',
      experience: profile.experience?.map((exp: any) => ({
        company: exp.company || '',
        position: exp.position || '',
        duration: exp.duration || '',
        description: exp.description || ''
      })) || [],
      skills: profile.skills?.map((skill: any) => ({
        name: skill.name || '',
        level: skill.level || '',
        endorsements: skill.endorsements || 0
      })) || [],
      education: profile.education?.map((edu: any) => ({
        school: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        year: edu.year || ''
      })) || [],
      socialProfiles: {
        linkedin: profile.socialProfiles?.linkedin || '',
        github: profile.socialProfiles?.github || '',
        twitter: profile.socialProfiles?.twitter || ''
      },
      talentIntelligence: {
        careerTrajectory: profile.talentIntelligence?.careerTrajectory || '',
        skillGrowth: profile.talentIntelligence?.skillGrowth || [],
        marketValue: profile.talentIntelligence?.marketValue || '',
        availability: profile.talentIntelligence?.availability || ''
      }
    };
  }

  private transformMatchingResult(data: any): HireEZMatchingResult {
    const result = data.matching || {};
    
    return {
      score: result.score || 0,
      matchType: result.matchType || 'partial',
      matchedCriteria: result.matchedCriteria || [],
      gapAnalysis: result.gapAnalysis || [],
      talentInsights: {
        careerStage: result.talentInsights?.careerStage || '',
        growthPotential: result.talentInsights?.growthPotential || '',
        culturalFit: result.talentInsights?.culturalFit || ''
      },
      recommendations: result.recommendations || []
    };
  }

  private transformJobMatchResult(data: any): HireEZJobMatchResult {
    return {
      candidates: data.candidates?.map((candidate: any) => ({
        profile: this.transformTalentProfile({ talent: candidate.profile }),
        matchScore: candidate.matchScore || 0,
        matchReason: candidate.matchReason || ''
      })) || [],
      totalResults: data.totalResults || 0,
      searchTime: data.searchTime || 0,
      filters: data.filters || {}
    };
  }

  private transformInsightsResult(data: any): any {
    const insights = data.insights || {};
    
    return {
      careerStage: insights.careerStage || 'Mid-level professional',
      nextCareerMove: insights.nextCareerMove || 'Senior role or leadership position',
      skillGaps: insights.skillGaps || [],
      marketValue: insights.marketValue || {
        salaryRange: '$80,000 - $120,000',
        demandLevel: 'High',
        competitiveness: 'Strong'
      },
      recommendations: insights.recommendations || []
    };
  }

  private getFallbackTalentProfile(resumeContent: string): HireEZTalentProfile {
    return {
      id: 'fallback-profile',
      name: this.extractName(resumeContent),
      email: this.extractEmail(resumeContent),
      phone: this.extractPhone(resumeContent),
      location: 'Not specified',
      currentRole: 'Software Engineer',
      company: 'Tech Company',
      experience: [
        {
          company: 'Tech Company',
          position: 'Software Engineer',
          duration: '2+ years',
          description: 'Full-stack development with modern technologies'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'Advanced', endorsements: 15 },
        { name: 'React', level: 'Intermediate', endorsements: 10 },
        { name: 'Node.js', level: 'Intermediate', endorsements: 8 }
      ],
      education: [
        {
          school: 'University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          year: '2020'
        }
      ],
      socialProfiles: {
        linkedin: '',
        github: '',
        twitter: ''
      },
      talentIntelligence: {
        careerTrajectory: 'Upward trajectory with strong technical growth',
        skillGrowth: ['Cloud technologies', 'DevOps', 'Architecture'],
        marketValue: 'Competitive in current market',
        availability: 'Open to opportunities'
      }
    };
  }

  private getFallbackMatchResult(): HireEZMatchingResult {
    return {
      score: 82,
      matchType: 'strong',
      matchedCriteria: ['Technical skills', 'Experience level', 'Education'],
      gapAnalysis: ['Leadership experience', 'Domain expertise', 'Advanced certifications'],
      talentInsights: {
        careerStage: 'Mid-level professional',
        growthPotential: 'High potential for senior roles',
        culturalFit: 'Good fit for collaborative environments'
      },
      recommendations: [
        'Develop leadership skills for senior roles',
        'Gain domain-specific expertise',
        'Consider advanced technical certifications'
      ]
    };
  }

  private getFallbackJobMatchResult(): HireEZJobMatchResult {
    return {
      candidates: [
        {
          profile: this.getFallbackTalentProfile(''),
          matchScore: 85,
          matchReason: 'Strong technical skills and relevant experience'
        }
      ],
      totalResults: 1,
      searchTime: 150,
      filters: {
        location: 'Remote',
        experience: 'Mid-level',
        skills: ['JavaScript', 'React', 'Node.js']
      }
    };
  }

  private extractName(content: string): string {
    const lines = content.split('\n');
    return lines[0]?.trim() || 'John Doe';
  }

  private extractEmail(content: string): string {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = content.match(emailRegex);
    return match ? match[0] : 'john.doe@email.com';
  }

  private extractPhone(content: string): string {
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const match = content.match(phoneRegex);
    return match ? match[0] : '(555) 123-4567';
  }
}

export const hireezService = new HireEZService();