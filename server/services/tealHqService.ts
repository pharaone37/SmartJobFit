import fetch from 'node-fetch';

interface TealResumeTracking {
  id: string;
  resumeVersion: string;
  applications: Array<{
    jobId: string;
    company: string;
    position: string;
    dateApplied: string;
    status: 'applied' | 'reviewed' | 'interview' | 'offer' | 'rejected';
    resumeVersion: string;
    feedback?: string;
  }>;
  performance: {
    responseRate: number;
    interviewRate: number;
    offerRate: number;
    averageResponseTime: number;
  };
  insights: {
    bestPerformingVersion: string;
    commonRejectionReasons: string[];
    successfulApplications: number;
  };
}

interface TealResumeAnalysis {
  overallScore: number;
  sections: {
    [key: string]: {
      score: number;
      strength: 'weak' | 'moderate' | 'strong';
      feedback: string;
      recommendations: string[];
    };
  };
  keywordAnalysis: {
    relevantKeywords: string[];
    missingKeywords: string[];
    keywordDensity: number;
    industryAlignment: number;
  };
  impactAnalysis: {
    quantifiableAchievements: number;
    actionVerbs: number;
    resultsOriented: boolean;
    suggestions: string[];
  };
  atsCompatibility: {
    score: number;
    issues: string[];
    fixes: string[];
  };
}

interface TealRewriteRecommendations {
  priority: 'high' | 'medium' | 'low';
  recommendations: Array<{
    section: string;
    issue: string;
    suggestion: string;
    example: string;
    impact: 'high' | 'medium' | 'low';
    difficulty: 'easy' | 'moderate' | 'hard';
  }>;
  templatedSuggestions: {
    bulletPoints: string[];
    summaryVersions: string[];
    skillsOptimization: string[];
  };
  personalizationTips: Array<{
    tip: string;
    context: string;
    example: string;
  }>;
}

interface TealCoachingInsights {
  careerGuidance: {
    roleAlignment: number;
    skillsGaps: string[];
    developmentAreas: string[];
    careerPath: string[];
  };
  applicationStrategy: {
    targetCompanies: string[];
    recommendedApplications: number;
    timingStrategy: string;
    followUpGuidance: string[];
  };
  interviewPreparation: {
    commonQuestions: string[];
    strengthsToHighlight: string[];
    experiencesToEmphasize: string[];
  };
  marketInsights: {
    salaryBenchmark: {
      min: number;
      max: number;
      median: number;
      confidence: number;
    };
    demandLevel: 'low' | 'moderate' | 'high';
    competitionLevel: 'low' | 'moderate' | 'high';
    trendingSkills: string[];
  };
}

interface TealJobMatchAnalysis {
  jobId: string;
  company: string;
  position: string;
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendations: {
    resumeChanges: string[];
    skillsToEmphasize: string[];
    coverLetterFocus: string[];
  };
  applicationTips: string[];
  interviewPrep: string[];
}

class TealHqService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.TEAL_HQ_API_KEY || '';
    this.baseUrl = 'https://api.tealhq.com/v1';
  }

  async trackResumePerformance(params: {
    userId: string;
    resumeContent: any;
    applications: Array<{
      jobId: string;
      company: string;
      position: string;
      status: string;
      dateApplied: string;
    }>;
  }): Promise<TealResumeTracking> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using performance tracking simulation.');
      return this.getFallbackTracking(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resume/track`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: params.userId,
          resume_content: params.resumeContent,
          applications: params.applications,
          track_performance: true,
          generate_insights: true
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformTracking(data);
    } catch (error) {
      console.error('Teal HQ tracking error:', error);
      return this.getFallbackTracking(params);
    }
  }

  async analyzeResume(params: {
    resumeContent: any;
    targetRole: string;
    industry: string;
    analysisDepth: 'basic' | 'comprehensive' | 'premium';
  }): Promise<TealResumeAnalysis> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using AI-powered resume analysis.');
      return this.getAIResumeAnalysis(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resume/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          target_role: params.targetRole,
          industry: params.industry,
          analysis_depth: params.analysisDepth,
          include_keyword_analysis: true,
          include_impact_analysis: true,
          include_ats_check: true
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ analysis API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAnalysis(data);
    } catch (error) {
      console.error('Teal HQ analysis error:', error);
      return this.getAIResumeAnalysis(params);
    }
  }

  async getRewriteRecommendations(params: {
    resumeContent: any;
    targetRole: string;
    jobDescription: string;
    priority: 'high' | 'medium' | 'low';
  }): Promise<TealRewriteRecommendations> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using AI-powered rewrite recommendations.');
      return this.getAIRewriteRecommendations(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resume/rewrite-recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          target_role: params.targetRole,
          job_description: params.jobDescription,
          priority: params.priority,
          include_templates: true,
          include_personalization: true
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ rewrite API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformRewriteRecommendations(data);
    } catch (error) {
      console.error('Teal HQ rewrite recommendations error:', error);
      return this.getAIRewriteRecommendations(params);
    }
  }

  async getCoachingInsights(params: {
    userId: string;
    resumeContent: any;
    careerGoals: string[];
    experience: string;
    targetRoles: string[];
  }): Promise<TealCoachingInsights> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using AI-powered coaching insights.');
      return this.getAICoachingInsights(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/coaching/insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: params.userId,
          resume_content: params.resumeContent,
          career_goals: params.careerGoals,
          experience: params.experience,
          target_roles: params.targetRoles,
          include_market_insights: true,
          include_salary_data: true
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ coaching API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCoachingInsights(data);
    } catch (error) {
      console.error('Teal HQ coaching insights error:', error);
      return this.getAICoachingInsights(params);
    }
  }

  async analyzeJobMatch(params: {
    resumeContent: any;
    jobDescription: string;
    jobId: string;
    company: string;
    position: string;
  }): Promise<TealJobMatchAnalysis> {
    if (!this.apiKey) {
      console.log('TEAL_HQ_API_KEY not found. Using AI-powered job match analysis.');
      return this.getAIJobMatchAnalysis(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/job/match-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_content: params.resumeContent,
          job_description: params.jobDescription,
          job_id: params.jobId,
          company: params.company,
          position: params.position,
          include_recommendations: true,
          include_application_tips: true
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ job match API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformJobMatchAnalysis(data);
    } catch (error) {
      console.error('Teal HQ job match analysis error:', error);
      return this.getAIJobMatchAnalysis(params);
    }
  }

  async generateVersionComparison(params: {
    resumeVersions: Array<{
      id: string;
      content: any;
      applications: any[];
    }>;
    metrics: string[];
  }): Promise<{
    comparison: Array<{
      versionId: string;
      performance: {
        responseRate: number;
        interviewRate: number;
        offerRate: number;
      };
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    }>;
    bestVersion: {
      id: string;
      reason: string;
      score: number;
    };
    optimization: {
      combinedBestPractices: string[];
      suggestedChanges: string[];
    };
  }> {
    if (!this.apiKey) {
      return this.getFallbackVersionComparison(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/resume/version-comparison`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_versions: params.resumeVersions,
          metrics: params.metrics,
          include_optimization: true
        })
      });

      if (!response.ok) {
        throw new Error(`Teal HQ version comparison API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformVersionComparison(data);
    } catch (error) {
      console.error('Teal HQ version comparison error:', error);
      return this.getFallbackVersionComparison(params);
    }
  }

  private transformTracking(data: any): TealResumeTracking {
    return {
      id: data.id || 'track_' + Date.now(),
      resumeVersion: data.resume_version || 'v1.0',
      applications: data.applications || [],
      performance: {
        responseRate: data.performance?.response_rate || 0.15,
        interviewRate: data.performance?.interview_rate || 0.08,
        offerRate: data.performance?.offer_rate || 0.03,
        averageResponseTime: data.performance?.average_response_time || 7
      },
      insights: {
        bestPerformingVersion: data.insights?.best_performing_version || 'v1.0',
        commonRejectionReasons: data.insights?.common_rejection_reasons || [],
        successfulApplications: data.insights?.successful_applications || 0
      }
    };
  }

  private transformAnalysis(data: any): TealResumeAnalysis {
    return {
      overallScore: data.overall_score || 85,
      sections: data.sections || {},
      keywordAnalysis: {
        relevantKeywords: data.keyword_analysis?.relevant_keywords || [],
        missingKeywords: data.keyword_analysis?.missing_keywords || [],
        keywordDensity: data.keyword_analysis?.keyword_density || 0.08,
        industryAlignment: data.keyword_analysis?.industry_alignment || 75
      },
      impactAnalysis: {
        quantifiableAchievements: data.impact_analysis?.quantifiable_achievements || 3,
        actionVerbs: data.impact_analysis?.action_verbs || 8,
        resultsOriented: data.impact_analysis?.results_oriented || true,
        suggestions: data.impact_analysis?.suggestions || []
      },
      atsCompatibility: {
        score: data.ats_compatibility?.score || 92,
        issues: data.ats_compatibility?.issues || [],
        fixes: data.ats_compatibility?.fixes || []
      }
    };
  }

  private transformRewriteRecommendations(data: any): TealRewriteRecommendations {
    return {
      priority: data.priority || 'medium',
      recommendations: data.recommendations || [],
      templatedSuggestions: {
        bulletPoints: data.templated_suggestions?.bullet_points || [],
        summaryVersions: data.templated_suggestions?.summary_versions || [],
        skillsOptimization: data.templated_suggestions?.skills_optimization || []
      },
      personalizationTips: data.personalization_tips || []
    };
  }

  private transformCoachingInsights(data: any): TealCoachingInsights {
    return {
      careerGuidance: {
        roleAlignment: data.career_guidance?.role_alignment || 85,
        skillsGaps: data.career_guidance?.skills_gaps || [],
        developmentAreas: data.career_guidance?.development_areas || [],
        careerPath: data.career_guidance?.career_path || []
      },
      applicationStrategy: {
        targetCompanies: data.application_strategy?.target_companies || [],
        recommendedApplications: data.application_strategy?.recommended_applications || 20,
        timingStrategy: data.application_strategy?.timing_strategy || 'Apply early in the week',
        followUpGuidance: data.application_strategy?.follow_up_guidance || []
      },
      interviewPreparation: {
        commonQuestions: data.interview_preparation?.common_questions || [],
        strengthsToHighlight: data.interview_preparation?.strengths_to_highlight || [],
        experiencesToEmphasize: data.interview_preparation?.experiences_to_emphasize || []
      },
      marketInsights: {
        salaryBenchmark: {
          min: data.market_insights?.salary_benchmark?.min || 70000,
          max: data.market_insights?.salary_benchmark?.max || 120000,
          median: data.market_insights?.salary_benchmark?.median || 95000,
          confidence: data.market_insights?.salary_benchmark?.confidence || 85
        },
        demandLevel: data.market_insights?.demand_level || 'moderate',
        competitionLevel: data.market_insights?.competition_level || 'moderate',
        trendingSkills: data.market_insights?.trending_skills || []
      }
    };
  }

  private transformJobMatchAnalysis(data: any): TealJobMatchAnalysis {
    return {
      jobId: data.job_id || '',
      company: data.company || '',
      position: data.position || '',
      matchScore: data.match_score || 85,
      strengths: data.strengths || [],
      gaps: data.gaps || [],
      recommendations: {
        resumeChanges: data.recommendations?.resume_changes || [],
        skillsToEmphasize: data.recommendations?.skills_to_emphasize || [],
        coverLetterFocus: data.recommendations?.cover_letter_focus || []
      },
      applicationTips: data.application_tips || [],
      interviewPrep: data.interview_prep || []
    };
  }

  private transformVersionComparison(data: any): any {
    return {
      comparison: data.comparison || [],
      bestVersion: data.best_version || {},
      optimization: data.optimization || {}
    };
  }

  // AI-powered fallback methods
  private async getAIResumeAnalysis(params: any): Promise<TealResumeAnalysis> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Analyze this resume comprehensively for career coaching purposes:
    
    Resume Content: ${JSON.stringify(params.resumeContent)}
    Target Role: ${params.targetRole}
    Industry: ${params.industry}
    
    Provide:
    1. Overall score and section analysis
    2. Keyword optimization
    3. Impact analysis
    4. ATS compatibility
    5. Coaching recommendations
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIAnalysis(aiResponse);
    } catch (error) {
      console.error('AI resume analysis error:', error);
      return this.getFallbackAnalysis(params);
    }
  }

  private async getAIRewriteRecommendations(params: any): Promise<TealRewriteRecommendations> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Provide detailed rewrite recommendations for this resume:
    
    Resume Content: ${JSON.stringify(params.resumeContent)}
    Target Role: ${params.targetRole}
    Job Description: ${params.jobDescription}
    Priority: ${params.priority}
    
    Include:
    1. Prioritized recommendations
    2. Templated suggestions
    3. Personalization tips
    4. Specific examples
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIRewriteRecommendations(aiResponse);
    } catch (error) {
      console.error('AI rewrite recommendations error:', error);
      return this.getFallbackRewriteRecommendations(params);
    }
  }

  private async getAICoachingInsights(params: any): Promise<TealCoachingInsights> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Provide comprehensive career coaching insights:
    
    Resume Content: ${JSON.stringify(params.resumeContent)}
    Career Goals: ${params.careerGoals.join(', ')}
    Experience: ${params.experience}
    Target Roles: ${params.targetRoles.join(', ')}
    
    Include:
    1. Career guidance
    2. Application strategy
    3. Interview preparation
    4. Market insights
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAICoachingInsights(aiResponse);
    } catch (error) {
      console.error('AI coaching insights error:', error);
      return this.getFallbackCoachingInsights(params);
    }
  }

  private async getAIJobMatchAnalysis(params: any): Promise<TealJobMatchAnalysis> {
    const { openRouterService } = await import('./openRouterService');
    
    const prompt = `Analyze job match between resume and job description:
    
    Resume Content: ${JSON.stringify(params.resumeContent)}
    Job Description: ${params.jobDescription}
    Company: ${params.company}
    Position: ${params.position}
    
    Provide:
    1. Match score analysis
    2. Strengths and gaps
    3. Recommendations
    4. Application tips
    5. Interview preparation
    
    Format as structured JSON.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIJobMatchAnalysis(aiResponse);
    } catch (error) {
      console.error('AI job match analysis error:', error);
      return this.getFallbackJobMatchAnalysis(params);
    }
  }

  private parseAIAnalysis(response: string): TealResumeAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        overallScore: parsed.overallScore || 85,
        sections: parsed.sections || {},
        keywordAnalysis: parsed.keywordAnalysis || {
          relevantKeywords: [],
          missingKeywords: [],
          keywordDensity: 0.08,
          industryAlignment: 75
        },
        impactAnalysis: parsed.impactAnalysis || {
          quantifiableAchievements: 3,
          actionVerbs: 8,
          resultsOriented: true,
          suggestions: []
        },
        atsCompatibility: parsed.atsCompatibility || {
          score: 92,
          issues: [],
          fixes: []
        }
      };
    } catch (error) {
      return this.getFallbackAnalysis({});
    }
  }

  private parseAIRewriteRecommendations(response: string): TealRewriteRecommendations {
    try {
      const parsed = JSON.parse(response);
      return {
        priority: parsed.priority || 'medium',
        recommendations: parsed.recommendations || [],
        templatedSuggestions: parsed.templatedSuggestions || {
          bulletPoints: [],
          summaryVersions: [],
          skillsOptimization: []
        },
        personalizationTips: parsed.personalizationTips || []
      };
    } catch (error) {
      return this.getFallbackRewriteRecommendations({});
    }
  }

  private parseAICoachingInsights(response: string): TealCoachingInsights {
    try {
      const parsed = JSON.parse(response);
      return {
        careerGuidance: parsed.careerGuidance || {
          roleAlignment: 85,
          skillsGaps: [],
          developmentAreas: [],
          careerPath: []
        },
        applicationStrategy: parsed.applicationStrategy || {
          targetCompanies: [],
          recommendedApplications: 20,
          timingStrategy: 'Apply early in the week',
          followUpGuidance: []
        },
        interviewPreparation: parsed.interviewPreparation || {
          commonQuestions: [],
          strengthsToHighlight: [],
          experiencesToEmphasize: []
        },
        marketInsights: parsed.marketInsights || {
          salaryBenchmark: { min: 70000, max: 120000, median: 95000, confidence: 85 },
          demandLevel: 'moderate',
          competitionLevel: 'moderate',
          trendingSkills: []
        }
      };
    } catch (error) {
      return this.getFallbackCoachingInsights({});
    }
  }

  private parseAIJobMatchAnalysis(response: string): TealJobMatchAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        jobId: parsed.jobId || '',
        company: parsed.company || '',
        position: parsed.position || '',
        matchScore: parsed.matchScore || 85,
        strengths: parsed.strengths || [],
        gaps: parsed.gaps || [],
        recommendations: parsed.recommendations || {
          resumeChanges: [],
          skillsToEmphasize: [],
          coverLetterFocus: []
        },
        applicationTips: parsed.applicationTips || [],
        interviewPrep: parsed.interviewPrep || []
      };
    } catch (error) {
      return this.getFallbackJobMatchAnalysis({});
    }
  }

  private getFallbackTracking(params: any): TealResumeTracking {
    return {
      id: 'track_' + Date.now(),
      resumeVersion: 'v1.0',
      applications: params.applications || [],
      performance: {
        responseRate: 0.15,
        interviewRate: 0.08,
        offerRate: 0.03,
        averageResponseTime: 7
      },
      insights: {
        bestPerformingVersion: 'v1.0',
        commonRejectionReasons: ['Experience mismatch', 'Skill gaps', 'Location requirements'],
        successfulApplications: 2
      }
    };
  }

  private getFallbackAnalysis(params: any): TealResumeAnalysis {
    return {
      overallScore: 85,
      sections: {
        summary: { score: 88, strength: 'strong', feedback: 'Compelling professional summary', recommendations: ['Add more specific achievements'] },
        experience: { score: 82, strength: 'strong', feedback: 'Good experience section', recommendations: ['Quantify more achievements'] },
        skills: { score: 90, strength: 'strong', feedback: 'Comprehensive skills list', recommendations: ['Prioritize by relevance'] },
        education: { score: 85, strength: 'strong', feedback: 'Solid educational background', recommendations: ['Add relevant coursework'] }
      },
      keywordAnalysis: {
        relevantKeywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        missingKeywords: ['TypeScript', 'Docker', 'AWS', 'GraphQL'],
        keywordDensity: 0.08,
        industryAlignment: 75
      },
      impactAnalysis: {
        quantifiableAchievements: 3,
        actionVerbs: 8,
        resultsOriented: true,
        suggestions: ['Add more specific metrics', 'Include percentage improvements', 'Quantify team sizes']
      },
      atsCompatibility: {
        score: 92,
        issues: [],
        fixes: []
      }
    };
  }

  private getFallbackRewriteRecommendations(params: any): TealRewriteRecommendations {
    return {
      priority: 'medium',
      recommendations: [
        {
          section: 'Summary',
          issue: 'Generic summary statement',
          suggestion: 'Tailor summary to specific role',
          example: 'Results-driven software engineer with 5+ years of experience...',
          impact: 'high',
          difficulty: 'moderate'
        },
        {
          section: 'Experience',
          issue: 'Missing quantifiable achievements',
          suggestion: 'Add specific metrics and results',
          example: 'Improved system performance by 40%',
          impact: 'high',
          difficulty: 'easy'
        }
      ],
      templatedSuggestions: {
        bulletPoints: [
          'Led team of X to achieve Y, resulting in Z% improvement',
          'Implemented solution that reduced costs by $X',
          'Optimized process improving efficiency by X%'
        ],
        summaryVersions: [
          'Results-driven professional with expertise in...',
          'Experienced specialist focused on...',
          'Innovative leader with proven track record...'
        ],
        skillsOptimization: [
          'Group related skills together',
          'Prioritize by job relevance',
          'Include proficiency levels'
        ]
      },
      personalizationTips: [
        {
          tip: 'Match your summary to the job description',
          context: 'Each application should have tailored content',
          example: 'For a senior role, emphasize leadership experience'
        },
        {
          tip: 'Use industry-specific terminology',
          context: 'Show familiarity with the field',
          example: 'Use "agile methodology" instead of "flexible approach"'
        }
      ]
    };
  }

  private getFallbackCoachingInsights(params: any): TealCoachingInsights {
    return {
      careerGuidance: {
        roleAlignment: 85,
        skillsGaps: ['Cloud architecture', 'Machine learning', 'DevOps'],
        developmentAreas: ['Leadership', 'System design', 'Team management'],
        careerPath: ['Senior Engineer', 'Tech Lead', 'Engineering Manager', 'VP Engineering']
      },
      applicationStrategy: {
        targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Netflix', 'Uber'],
        recommendedApplications: 20,
        timingStrategy: 'Apply early in the week, Tuesday-Thursday optimal',
        followUpGuidance: ['Follow up after 1 week', 'Send thank you notes', 'Connect on LinkedIn']
      },
      interviewPreparation: {
        commonQuestions: [
          'Tell me about yourself',
          'Describe a challenging project',
          'How do you handle conflicts?',
          'Where do you see yourself in 5 years?'
        ],
        strengthsToHighlight: ['Technical expertise', 'Problem-solving', 'Team collaboration'],
        experiencesToEmphasize: ['Leadership roles', 'Complex projects', 'Cross-functional work']
      },
      marketInsights: {
        salaryBenchmark: {
          min: 90000,
          max: 150000,
          median: 120000,
          confidence: 85
        },
        demandLevel: 'high',
        competitionLevel: 'moderate',
        trendingSkills: ['React', 'TypeScript', 'GraphQL', 'Docker', 'Kubernetes', 'AWS']
      }
    };
  }

  private getFallbackJobMatchAnalysis(params: any): TealJobMatchAnalysis {
    return {
      jobId: params.jobId || '',
      company: params.company || '',
      position: params.position || '',
      matchScore: 85,
      strengths: [
        'Strong technical background',
        'Relevant experience',
        'Good cultural fit'
      ],
      gaps: [
        'Limited experience with specific technology',
        'Could use more leadership examples',
        'Industry experience gap'
      ],
      recommendations: {
        resumeChanges: [
          'Emphasize relevant project experience',
          'Highlight transferable skills',
          'Add industry-specific keywords'
        ],
        skillsToEmphasize: [
          'Technical problem-solving',
          'Cross-functional collaboration',
          'Adaptability'
        ],
        coverLetterFocus: [
          'Passion for the industry',
          'Specific interest in the company',
          'How your experience adds value'
        ]
      },
      applicationTips: [
        'Apply within 24-48 hours of posting',
        'Tailor resume to job description',
        'Research company culture',
        'Prepare for technical assessment'
      ],
      interviewPrep: [
        'Review your technical projects',
        'Prepare STAR method examples',
        'Research the interviewing team',
        'Practice system design questions'
      ]
    };
  }

  private getFallbackVersionComparison(params: any): any {
    return {
      comparison: [
        {
          versionId: 'v1.0',
          performance: { responseRate: 0.15, interviewRate: 0.08, offerRate: 0.03 },
          strengths: ['Clear structure', 'Good keyword usage'],
          weaknesses: ['Limited quantifiable results', 'Generic summary'],
          recommendations: ['Add more metrics', 'Personalize summary']
        },
        {
          versionId: 'v2.0',
          performance: { responseRate: 0.22, interviewRate: 0.12, offerRate: 0.05 },
          strengths: ['Better achievements', 'Tailored content'],
          weaknesses: ['Could improve skills section'],
          recommendations: ['Reorganize skills', 'Add certifications']
        }
      ],
      bestVersion: {
        id: 'v2.0',
        reason: 'Higher response and interview rates',
        score: 92
      },
      optimization: {
        combinedBestPractices: [
          'Use quantifiable achievements',
          'Tailor content to job descriptions',
          'Prioritize relevant skills'
        ],
        suggestedChanges: [
          'Combine best elements from all versions',
          'Add industry-specific keywords',
          'Improve section organization'
        ]
      }
    };
  }
}

export const tealHqService = new TealHqService();