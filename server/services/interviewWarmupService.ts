import fetch from 'node-fetch';

interface InterviewWarmupQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number;
  tips: string[];
  followUp?: string;
  idealAnswer?: {
    structure: string[];
    keyPoints: string[];
    examples: string[];
  };
}

interface InterviewWarmupSession {
  sessionId: string;
  jobRole: string;
  questions: InterviewWarmupQuestion[];
  progress: {
    currentQuestion: number;
    totalQuestions: number;
    completedQuestions: string[];
  };
  settings: {
    enableTimer: boolean;
    showTips: boolean;
    difficulty: string;
  };
}

interface InterviewWarmupResponse {
  questionId: string;
  userAnswer: string;
  analysisResult: {
    score: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      suggestions: string[];
    };
    comparison: {
      idealStructure: string[];
      userStructure: string[];
      gaps: string[];
    };
    nextSteps: string[];
  };
}

class InterviewWarmupService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || '';
    this.baseUrl = 'https://interviewwarmup.googleapis.com/v1';
  }

  async generateQuestions(params: {
    jobRole: string;
    industry: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    questionCount: number;
    categories?: string[];
  }): Promise<InterviewWarmupQuestion[]> {
    if (!this.apiKey) {
      console.log('GOOGLE_API_KEY not found. Using curated question database.');
      return this.getFallbackQuestions(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/questions/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_role: params.jobRole,
          industry: params.industry,
          difficulty: params.difficulty,
          question_count: params.questionCount,
          categories: params.categories || ['behavioral', 'technical', 'situational']
        })
      });

      if (!response.ok) {
        throw new Error(`Interview Warmup API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformQuestions(data.questions);
    } catch (error) {
      console.error('Interview Warmup question generation error:', error);
      return this.getFallbackQuestions(params);
    }
  }

  async createSession(params: {
    userId: string;
    jobRole: string;
    industry: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    timeLimit?: number;
    categories?: string[];
  }): Promise<InterviewWarmupSession> {
    if (!this.apiKey) {
      return this.getFallbackSession(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: params.userId,
          job_role: params.jobRole,
          industry: params.industry,
          difficulty: params.difficulty,
          time_limit: params.timeLimit || 120,
          categories: params.categories || ['behavioral', 'technical', 'situational']
        })
      });

      if (!response.ok) {
        throw new Error(`Interview Warmup session error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSession(data);
    } catch (error) {
      console.error('Interview Warmup session error:', error);
      return this.getFallbackSession(params);
    }
  }

  async analyzeResponse(params: {
    sessionId: string;
    questionId: string;
    userAnswer: string;
    responseTime: number;
  }): Promise<InterviewWarmupResponse> {
    if (!this.apiKey) {
      return this.getFallbackAnalysis(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/sessions/${params.sessionId}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: params.questionId,
          user_answer: params.userAnswer,
          response_time: params.responseTime
        })
      });

      if (!response.ok) {
        throw new Error(`Interview Warmup analysis error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAnalysis(data);
    } catch (error) {
      console.error('Interview Warmup analysis error:', error);
      return this.getFallbackAnalysis(params);
    }
  }

  async getQuestionsByCategory(category: string, difficulty: string): Promise<InterviewWarmupQuestion[]> {
    if (!this.apiKey) {
      return this.getFallbackQuestionsByCategory(category, difficulty);
    }

    try {
      const response = await fetch(`${this.baseUrl}/questions/category/${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          difficulty: difficulty
        }
      });

      if (!response.ok) {
        throw new Error(`Interview Warmup category error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformQuestions(data.questions);
    } catch (error) {
      console.error('Interview Warmup category error:', error);
      return this.getFallbackQuestionsByCategory(category, difficulty);
    }
  }

  async getPracticeTips(params: {
    weakAreas: string[];
    jobRole: string;
    interviewType: string;
  }): Promise<{
    tips: Array<{
      area: string;
      tip: string;
      exercises: string[];
      timeframe: string;
    }>;
    resources: Array<{
      title: string;
      url: string;
      description: string;
    }>;
    practiceSchedule: Array<{
      day: number;
      focus: string;
      activities: string[];
    }>;
  }> {
    if (!this.apiKey) {
      return this.getFallbackPracticeTips(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/tips/personalized`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          weak_areas: params.weakAreas,
          job_role: params.jobRole,
          interview_type: params.interviewType
        })
      });

      if (!response.ok) {
        throw new Error(`Interview Warmup tips error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformPracticeTips(data);
    } catch (error) {
      console.error('Interview Warmup tips error:', error);
      return this.getFallbackPracticeTips(params);
    }
  }

  private transformQuestions(questions: any[]): InterviewWarmupQuestion[] {
    return questions.map(q => ({
      id: q.id || 'q_' + Date.now(),
      question: q.question || '',
      category: q.category || 'behavioral',
      difficulty: q.difficulty || 'intermediate',
      timeLimit: q.time_limit || 120,
      tips: q.tips || [],
      followUp: q.follow_up,
      idealAnswer: q.ideal_answer
    }));
  }

  private transformSession(data: any): InterviewWarmupSession {
    return {
      sessionId: data.session_id || 'session_' + Date.now(),
      jobRole: data.job_role || '',
      questions: this.transformQuestions(data.questions || []),
      progress: {
        currentQuestion: 0,
        totalQuestions: data.questions?.length || 0,
        completedQuestions: []
      },
      settings: {
        enableTimer: data.settings?.enable_timer || true,
        showTips: data.settings?.show_tips || true,
        difficulty: data.settings?.difficulty || 'intermediate'
      }
    };
  }

  private transformAnalysis(data: any): InterviewWarmupResponse {
    return {
      questionId: data.question_id || '',
      userAnswer: data.user_answer || '',
      analysisResult: {
        score: data.analysis_result?.score || 75,
        feedback: {
          strengths: data.analysis_result?.feedback?.strengths || [],
          improvements: data.analysis_result?.feedback?.improvements || [],
          suggestions: data.analysis_result?.feedback?.suggestions || []
        },
        comparison: {
          idealStructure: data.analysis_result?.comparison?.ideal_structure || [],
          userStructure: data.analysis_result?.comparison?.user_structure || [],
          gaps: data.analysis_result?.comparison?.gaps || []
        },
        nextSteps: data.analysis_result?.next_steps || []
      }
    };
  }

  private transformPracticeTips(data: any): any {
    return {
      tips: data.tips || [],
      resources: data.resources || [],
      practiceSchedule: data.practice_schedule || []
    };
  }

  private getFallbackQuestions(params: any): InterviewWarmupQuestion[] {
    const questionDatabase = {
      behavioral: [
        {
          id: 'beh_001',
          question: 'Tell me about a time when you had to work with a difficult team member.',
          category: 'behavioral',
          difficulty: 'intermediate' as const,
          timeLimit: 120,
          tips: [
            'Use the STAR method',
            'Focus on your actions and resolution',
            'Show emotional intelligence'
          ],
          idealAnswer: {
            structure: ['Situation', 'Task', 'Action', 'Result'],
            keyPoints: ['Conflict resolution', 'Communication', 'Teamwork'],
            examples: ['Specific instance', 'Clear actions taken', 'Positive outcome']
          }
        },
        {
          id: 'beh_002',
          question: 'Describe a time when you had to learn something new quickly.',
          category: 'behavioral',
          difficulty: 'beginner' as const,
          timeLimit: 90,
          tips: [
            'Highlight your learning process',
            'Show adaptability',
            'Mention resources you used'
          ],
          idealAnswer: {
            structure: ['Challenge', 'Learning approach', 'Application', 'Outcome'],
            keyPoints: ['Adaptability', 'Resourcefulness', 'Quick learning'],
            examples: ['New technology', 'Study method', 'Successful implementation']
          }
        },
        {
          id: 'beh_003',
          question: 'Tell me about a time when you disagreed with your manager.',
          category: 'behavioral',
          difficulty: 'advanced' as const,
          timeLimit: 150,
          tips: [
            'Show respect for authority',
            'Demonstrate professional disagreement',
            'Focus on constructive outcome'
          ],
          idealAnswer: {
            structure: ['Context', 'Disagreement', 'Approach', 'Resolution'],
            keyPoints: ['Professional communication', 'Constructive feedback', 'Compromise'],
            examples: ['Respectful discussion', 'Data-driven argument', 'Mutual agreement']
          }
        }
      ],
      technical: [
        {
          id: 'tech_001',
          question: 'How would you approach debugging a performance issue in a web application?',
          category: 'technical',
          difficulty: 'intermediate' as const,
          timeLimit: 180,
          tips: [
            'Outline systematic approach',
            'Mention specific tools',
            'Consider different causes'
          ],
          idealAnswer: {
            structure: ['Assessment', 'Investigation', 'Analysis', 'Solution'],
            keyPoints: ['Performance monitoring', 'Debugging tools', 'Optimization'],
            examples: ['Profiling tools', 'Code analysis', 'Performance metrics']
          }
        },
        {
          id: 'tech_002',
          question: 'Explain the concept of database normalization.',
          category: 'technical',
          difficulty: 'beginner' as const,
          timeLimit: 120,
          tips: [
            'Start with basic definition',
            'Explain the benefits',
            'Give simple examples'
          ],
          idealAnswer: {
            structure: ['Definition', 'Purpose', 'Normal forms', 'Benefits'],
            keyPoints: ['Data integrity', 'Reduced redundancy', 'Consistency'],
            examples: ['1NF, 2NF, 3NF', 'Table structure', 'Relationship design']
          }
        }
      ],
      situational: [
        {
          id: 'sit_001',
          question: 'How would you handle a situation where you have multiple high-priority tasks with the same deadline?',
          category: 'situational',
          difficulty: 'intermediate' as const,
          timeLimit: 120,
          tips: [
            'Show prioritization skills',
            'Mention communication',
            'Demonstrate problem-solving'
          ],
          idealAnswer: {
            structure: ['Assessment', 'Prioritization', 'Communication', 'Execution'],
            keyPoints: ['Time management', 'Stakeholder communication', 'Strategic thinking'],
            examples: ['Priority matrix', 'Stakeholder discussion', 'Resource allocation']
          }
        }
      ]
    };

    const allQuestions = [
      ...questionDatabase.behavioral,
      ...questionDatabase.technical,
      ...questionDatabase.situational
    ];

    return allQuestions
      .filter(q => params.difficulty === 'all' || q.difficulty === params.difficulty)
      .slice(0, params.questionCount || 5);
  }

  private getFallbackSession(params: any): InterviewWarmupSession {
    const questions = this.getFallbackQuestions(params);
    
    return {
      sessionId: 'warmup_' + Date.now(),
      jobRole: params.jobRole,
      questions: questions,
      progress: {
        currentQuestion: 0,
        totalQuestions: questions.length,
        completedQuestions: []
      },
      settings: {
        enableTimer: true,
        showTips: true,
        difficulty: params.difficulty
      }
    };
  }

  private getFallbackAnalysis(params: any): InterviewWarmupResponse {
    return {
      questionId: params.questionId,
      userAnswer: params.userAnswer,
      analysisResult: {
        score: 78,
        feedback: {
          strengths: [
            'Clear communication',
            'Structured approach',
            'Relevant examples'
          ],
          improvements: [
            'Add more specific metrics',
            'Include more details about your role',
            'Consider mentioning lessons learned'
          ],
          suggestions: [
            'Use the STAR method for better structure',
            'Prepare 2-3 specific examples for each competency',
            'Practice timing your responses'
          ]
        },
        comparison: {
          idealStructure: ['Situation', 'Task', 'Action', 'Result'],
          userStructure: ['Context', 'Action', 'Outcome'],
          gaps: ['Missing specific task definition', 'Could elaborate on results']
        },
        nextSteps: [
          'Practice with similar questions',
          'Work on providing more specific examples',
          'Focus on quantifiable outcomes'
        ]
      }
    };
  }

  private getFallbackQuestionsByCategory(category: string, difficulty: string): InterviewWarmupQuestion[] {
    const questions = this.getFallbackQuestions({ difficulty, questionCount: 10 });
    return questions.filter(q => q.category === category);
  }

  private getFallbackPracticeTips(params: any): any {
    return {
      tips: [
        {
          area: 'Communication',
          tip: 'Practice speaking clearly and confidently',
          exercises: ['Mirror practice', 'Recording yourself', 'Mock interviews'],
          timeframe: '1-2 weeks'
        },
        {
          area: 'Structure',
          tip: 'Use the STAR method for behavioral questions',
          exercises: ['Write out STAR examples', 'Practice transitions', 'Time your responses'],
          timeframe: '3-5 days'
        },
        {
          area: 'Technical Knowledge',
          tip: 'Review fundamental concepts for your role',
          exercises: ['Technical flashcards', 'Code challenges', 'System design practice'],
          timeframe: '1-2 weeks'
        }
      ],
      resources: [
        {
          title: 'STAR Method Guide',
          url: 'https://example.com/star-method',
          description: 'Comprehensive guide to structuring interview responses'
        },
        {
          title: 'Technical Interview Prep',
          url: 'https://example.com/tech-prep',
          description: 'Resources for technical interview preparation'
        }
      ],
      practiceSchedule: [
        {
          day: 1,
          focus: 'Behavioral Questions',
          activities: ['Practice 3 STAR examples', 'Record responses', 'Review feedback']
        },
        {
          day: 2,
          focus: 'Technical Skills',
          activities: ['Review core concepts', 'Practice coding problems', 'System design']
        },
        {
          day: 3,
          focus: 'Company Research',
          activities: ['Research company culture', 'Prepare questions', 'Practice enthusiasm']
        }
      ]
    };
  }
}

export const interviewWarmupService = new InterviewWarmupService();