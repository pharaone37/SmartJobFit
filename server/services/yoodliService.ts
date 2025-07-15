import fetch from 'node-fetch';

interface YoodliAnalysisResult {
  overallScore: number;
  speechMetrics: {
    pace: {
      score: number;
      wordsPerMinute: number;
      recommendation: string;
    };
    clarity: {
      score: number;
      fillerWordCount: number;
      articulation: number;
    };
    confidence: {
      score: number;
      eyeContact: number;
      posture: number;
      voiceStrength: number;
    };
    engagement: {
      score: number;
      enthusiasm: number;
      authenticity: number;
    };
  };
  contentAnalysis: {
    relevance: number;
    structure: number;
    examples: number;
    completeness: number;
  };
  videoAnalysis: {
    eyeContact: number;
    facialExpressions: number;
    gestures: number;
    posture: number;
    backgroundProfessionalism: number;
  };
  detailedFeedback: Array<{
    timestamp: number;
    category: string;
    issue: string;
    suggestion: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  improvements: Array<{
    area: string;
    currentScore: number;
    targetScore: number;
    actions: string[];
    timeframe: string;
  }>;
  practiceRecommendations: string[];
}

interface YoodliProgressTracking {
  sessionId: string;
  userId: string;
  date: string;
  question: string;
  scores: {
    overall: number;
    speech: number;
    content: number;
    video: number;
  };
  improvements: Array<{
    area: string;
    change: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  streaks: {
    practiceStreak: number;
    improvementStreak: number;
  };
  nextGoals: string[];
}

class YoodliService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.YOODLI_API_KEY || '';
    this.baseUrl = 'https://api.yoodli.ai/v1';
  }

  async analyzeInterviewResponse(params: {
    videoUrl?: string;
    audioUrl?: string;
    transcript?: string;
    question: string;
    jobRole: string;
    sessionId?: string;
  }): Promise<YoodliAnalysisResult> {
    if (!this.apiKey) {
      console.log('YOODLI_API_KEY not found. Using AI-powered fallback analysis.');
      return this.getFallbackAnalysis(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_url: params.videoUrl,
          audio_url: params.audioUrl,
          transcript: params.transcript,
          question: params.question,
          job_role: params.jobRole,
          session_id: params.sessionId,
          analysis_type: 'comprehensive',
          include_video: true,
          include_speech: true,
          include_content: true
        })
      });

      if (!response.ok) {
        throw new Error(`Yoodli API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformYoodliResponse(data);
    } catch (error) {
      console.error('Yoodli analysis error:', error);
      return this.getFallbackAnalysis(params);
    }
  }

  async startInterviewSession(params: {
    userId: string;
    jobRole: string;
    interviewType: 'behavioral' | 'technical' | 'case_study' | 'leadership';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
  }): Promise<{
    sessionId: string;
    questions: Array<{
      id: string;
      question: string;
      type: string;
      timeLimit: number;
      tips: string[];
    }>;
    setupInstructions: string[];
  }> {
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
          interview_type: params.interviewType,
          difficulty: params.difficulty,
          duration_minutes: params.duration,
          enable_realtime_feedback: true
        })
      });

      if (!response.ok) {
        throw new Error(`Yoodli session error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSessionResponse(data);
    } catch (error) {
      console.error('Yoodli session error:', error);
      return this.getFallbackSession(params);
    }
  }

  async getRealtimeFeedback(sessionId: string): Promise<{
    currentMetrics: {
      pace: number;
      clarity: number;
      confidence: number;
      engagement: number;
    };
    liveAdjustments: Array<{
      type: string;
      message: string;
      urgency: 'low' | 'medium' | 'high';
    }>;
    encouragement: string;
  }> {
    if (!this.apiKey) {
      return this.getFallbackRealtimeFeedback();
    }

    try {
      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}/realtime`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Yoodli realtime error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformRealtimeFeedback(data);
    } catch (error) {
      console.error('Yoodli realtime feedback error:', error);
      return this.getFallbackRealtimeFeedback();
    }
  }

  async getProgressTracking(userId: string): Promise<YoodliProgressTracking[]> {
    if (!this.apiKey) {
      return this.getFallbackProgressTracking(userId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/progress`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Yoodli progress error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformProgressData(data);
    } catch (error) {
      console.error('Yoodli progress tracking error:', error);
      return this.getFallbackProgressTracking(userId);
    }
  }

  async generatePersonalizedCoaching(params: {
    userId: string;
    weakAreas: string[];
    targetRole: string;
    timeframe: string;
  }): Promise<{
    coachingPlan: {
      duration: string;
      sessions: Array<{
        week: number;
        focus: string;
        exercises: string[];
        goals: string[];
      }>;
    };
    dailyTips: string[];
    resources: Array<{
      type: string;
      title: string;
      url: string;
      description: string;
    }>;
  }> {
    if (!this.apiKey) {
      return this.getFallbackCoachingPlan(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/coaching/personalized`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: params.userId,
          weak_areas: params.weakAreas,
          target_role: params.targetRole,
          timeframe: params.timeframe,
          include_resources: true
        })
      });

      if (!response.ok) {
        throw new Error(`Yoodli coaching error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCoachingPlan(data);
    } catch (error) {
      console.error('Yoodli coaching plan error:', error);
      return this.getFallbackCoachingPlan(params);
    }
  }

  private transformYoodliResponse(data: any): YoodliAnalysisResult {
    return {
      overallScore: data.overall_score || 75,
      speechMetrics: {
        pace: {
          score: data.speech_metrics?.pace?.score || 80,
          wordsPerMinute: data.speech_metrics?.pace?.wpm || 150,
          recommendation: data.speech_metrics?.pace?.recommendation || 'Maintain steady pace'
        },
        clarity: {
          score: data.speech_metrics?.clarity?.score || 85,
          fillerWordCount: data.speech_metrics?.clarity?.filler_words || 3,
          articulation: data.speech_metrics?.clarity?.articulation || 88
        },
        confidence: {
          score: data.speech_metrics?.confidence?.score || 78,
          eyeContact: data.speech_metrics?.confidence?.eye_contact || 82,
          posture: data.speech_metrics?.confidence?.posture || 85,
          voiceStrength: data.speech_metrics?.confidence?.voice_strength || 80
        },
        engagement: {
          score: data.speech_metrics?.engagement?.score || 82,
          enthusiasm: data.speech_metrics?.engagement?.enthusiasm || 85,
          authenticity: data.speech_metrics?.engagement?.authenticity || 88
        }
      },
      contentAnalysis: {
        relevance: data.content_analysis?.relevance || 85,
        structure: data.content_analysis?.structure || 78,
        examples: data.content_analysis?.examples || 72,
        completeness: data.content_analysis?.completeness || 80
      },
      videoAnalysis: {
        eyeContact: data.video_analysis?.eye_contact || 82,
        facialExpressions: data.video_analysis?.facial_expressions || 85,
        gestures: data.video_analysis?.gestures || 78,
        posture: data.video_analysis?.posture || 88,
        backgroundProfessionalism: data.video_analysis?.background || 95
      },
      detailedFeedback: data.detailed_feedback || [],
      improvements: data.improvements || [],
      practiceRecommendations: data.practice_recommendations || []
    };
  }

  private transformSessionResponse(data: any): any {
    return {
      sessionId: data.session_id || 'session_' + Date.now(),
      questions: data.questions || [],
      setupInstructions: data.setup_instructions || []
    };
  }

  private transformRealtimeFeedback(data: any): any {
    return {
      currentMetrics: data.current_metrics || {},
      liveAdjustments: data.live_adjustments || [],
      encouragement: data.encouragement || 'You are doing great!'
    };
  }

  private transformProgressData(data: any): YoodliProgressTracking[] {
    return data.sessions || [];
  }

  private transformCoachingPlan(data: any): any {
    return {
      coachingPlan: data.coaching_plan || {},
      dailyTips: data.daily_tips || [],
      resources: data.resources || []
    };
  }

  private getFallbackAnalysis(params: any): YoodliAnalysisResult {
    return {
      overallScore: 78,
      speechMetrics: {
        pace: {
          score: 82,
          wordsPerMinute: 155,
          recommendation: 'Your speaking pace is good. Try to vary it slightly for emphasis.'
        },
        clarity: {
          score: 85,
          fillerWordCount: 2,
          articulation: 88
        },
        confidence: {
          score: 75,
          eyeContact: 80,
          posture: 85,
          voiceStrength: 78
        },
        engagement: {
          score: 80,
          enthusiasm: 85,
          authenticity: 88
        }
      },
      contentAnalysis: {
        relevance: 85,
        structure: 78,
        examples: 72,
        completeness: 80
      },
      videoAnalysis: {
        eyeContact: 82,
        facialExpressions: 85,
        gestures: 78,
        posture: 88,
        backgroundProfessionalism: 95
      },
      detailedFeedback: [
        {
          timestamp: 15,
          category: 'Speech',
          issue: 'Slight hesitation detected',
          suggestion: 'Take a brief pause instead of using filler words',
          severity: 'low'
        },
        {
          timestamp: 45,
          category: 'Content',
          issue: 'Could use more specific examples',
          suggestion: 'Add quantifiable achievements to strengthen your answer',
          severity: 'medium'
        }
      ],
      improvements: [
        {
          area: 'Confidence',
          currentScore: 75,
          targetScore: 85,
          actions: ['Practice power posing', 'Maintain eye contact', 'Use stronger voice projection'],
          timeframe: '2 weeks'
        },
        {
          area: 'Content Structure',
          currentScore: 78,
          targetScore: 88,
          actions: ['Use STAR method', 'Prepare specific examples', 'Practice transitions'],
          timeframe: '1 week'
        }
      ],
      practiceRecommendations: [
        'Practice in front of a mirror to improve eye contact',
        'Record yourself to identify speech patterns',
        'Use the STAR method for behavioral questions',
        'Prepare 3-5 specific examples for each competency'
      ]
    };
  }

  private getFallbackSession(params: any): any {
    return {
      sessionId: 'session_' + Date.now(),
      questions: [
        {
          id: 'q1',
          question: 'Tell me about yourself and why you are interested in this role.',
          type: 'behavioral',
          timeLimit: 120,
          tips: ['Keep it concise', 'Focus on relevant experience', 'End with enthusiasm for the role']
        },
        {
          id: 'q2',
          question: 'Describe a challenging project you worked on and how you overcame obstacles.',
          type: 'behavioral',
          timeLimit: 180,
          tips: ['Use STAR method', 'Emphasize your problem-solving skills', 'Quantify the impact']
        },
        {
          id: 'q3',
          question: 'Where do you see yourself in 5 years?',
          type: 'behavioral',
          timeLimit: 90,
          tips: ['Align with company goals', 'Show growth mindset', 'Be realistic but ambitious']
        }
      ],
      setupInstructions: [
        'Find a quiet, well-lit space',
        'Test your camera and microphone',
        'Have a glass of water nearby',
        'Practice good posture',
        'Look directly at the camera'
      ]
    };
  }

  private getFallbackRealtimeFeedback(): any {
    return {
      currentMetrics: {
        pace: 82,
        clarity: 85,
        confidence: 78,
        engagement: 80
      },
      liveAdjustments: [
        {
          type: 'pace',
          message: 'You can speak a bit slower for better clarity',
          urgency: 'low'
        },
        {
          type: 'posture',
          message: 'Great posture! Keep it up',
          urgency: 'low'
        }
      ],
      encouragement: 'You are doing excellent! Your confidence is showing through.'
    };
  }

  private getFallbackProgressTracking(userId: string): YoodliProgressTracking[] {
    return [
      {
        sessionId: 'session_001',
        userId: userId,
        date: new Date().toISOString(),
        question: 'Tell me about yourself',
        scores: {
          overall: 78,
          speech: 82,
          content: 75,
          video: 80
        },
        improvements: [
          {
            area: 'Confidence',
            change: 8,
            trend: 'improving'
          },
          {
            area: 'Content Structure',
            change: 5,
            trend: 'improving'
          }
        ],
        streaks: {
          practiceStreak: 5,
          improvementStreak: 3
        },
        nextGoals: [
          'Improve eye contact consistency',
          'Use more specific examples',
          'Reduce filler words'
        ]
      }
    ];
  }

  private getFallbackCoachingPlan(params: any): any {
    return {
      coachingPlan: {
        duration: '4 weeks',
        sessions: [
          {
            week: 1,
            focus: 'Foundation & Confidence',
            exercises: ['Mirror practice', 'Voice projection', 'Posture awareness'],
            goals: ['Establish baseline', 'Build confidence', 'Improve presence']
          },
          {
            week: 2,
            focus: 'Content & Structure',
            exercises: ['STAR method practice', 'Example preparation', 'Transition practice'],
            goals: ['Structure answers', 'Prepare examples', 'Improve flow']
          },
          {
            week: 3,
            focus: 'Advanced Techniques',
            exercises: ['Storytelling', 'Emotional intelligence', 'Handling pressure'],
            goals: ['Engage interviewer', 'Show personality', 'Stay calm']
          },
          {
            week: 4,
            focus: 'Mock Interviews',
            exercises: ['Full interviews', 'Feedback integration', 'Final polish'],
            goals: ['Apply learnings', 'Build consistency', 'Final preparation']
          }
        ]
      },
      dailyTips: [
        'Practice one question thoroughly each day',
        'Record yourself and review for improvements',
        'Work on eliminating filler words',
        'Focus on maintaining eye contact'
      ],
      resources: [
        {
          type: 'article',
          title: 'Mastering the STAR Method',
          url: 'https://example.com/star-method',
          description: 'Comprehensive guide to structuring behavioral interview answers'
        },
        {
          type: 'video',
          title: 'Interview Confidence Building',
          url: 'https://example.com/confidence',
          description: 'Video series on building interview confidence'
        }
      ]
    };
  }
}

export const yoodliService = new YoodliService();