import fetch from 'node-fetch';
import { openRouterService } from './openRouterService';

interface PromptLoopQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'situational' | 'leadership' | 'cultural';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  timeLimit: number;
  followUp?: string;
  context?: string;
  idealAnswer: {
    structure: string[];
    keyPoints: string[];
    examples: string[];
  };
  coachingTips: string[];
}

interface PromptLoopCoachingSession {
  sessionId: string;
  userId: string;
  jobRole: string;
  questions: PromptLoopQuestion[];
  currentQuestion: number;
  responses: Array<{
    questionId: string;
    userAnswer: string;
    feedback: PromptLoopFeedback;
    timestamp: string;
  }>;
  overallProgress: {
    completed: number;
    total: number;
    averageScore: number;
  };
}

interface PromptLoopFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  specificSuggestions: string[];
  nextSteps: string[];
  coachingInsights: {
    communication: number;
    content: number;
    structure: number;
    confidence: number;
  };
  improvedAnswer: string;
}

interface PromptLoopPersonalization {
  userId: string;
  profile: {
    experienceLevel: string;
    targetRole: string;
    industry: string;
    weakAreas: string[];
    strongAreas: string[];
    preferredStyle: string;
  };
  adaptiveSettings: {
    questionDifficulty: 'beginner' | 'intermediate' | 'advanced';
    feedbackStyle: 'concise' | 'detailed' | 'encouraging';
    focusAreas: string[];
  };
}

class PromptLoopService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.PROMPTLOOP_API_KEY || '';
    this.baseUrl = 'https://api.promptloop.com/v1';
  }

  async generateCustomQuestions(params: {
    jobRole: string;
    industry: string;
    experienceLevel: string;
    questionTypes: string[];
    count: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    focusAreas?: string[];
  }): Promise<PromptLoopQuestion[]> {
    if (!this.apiKey) {
      console.log('PROMPTLOOP_API_KEY not found. Using AI-powered question generation.');
      return this.generateQuestionsWithAI(params);
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
          experience_level: params.experienceLevel,
          question_types: params.questionTypes,
          count: params.count,
          difficulty: params.difficulty,
          focus_areas: params.focusAreas || [],
          include_coaching_tips: true,
          include_ideal_answers: true
        })
      });

      if (!response.ok) {
        throw new Error(`PromptLoop API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformQuestions(data.questions);
    } catch (error) {
      console.error('PromptLoop question generation error:', error);
      return this.generateQuestionsWithAI(params);
    }
  }

  async createCoachingSession(params: {
    userId: string;
    jobRole: string;
    industry: string;
    experienceLevel: string;
    goals: string[];
    sessionType: 'practice' | 'assessment' | 'coaching';
  }): Promise<PromptLoopCoachingSession> {
    if (!this.apiKey) {
      return this.createFallbackSession(params);
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
          experience_level: params.experienceLevel,
          goals: params.goals,
          session_type: params.sessionType,
          enable_adaptive_questioning: true,
          enable_personalized_feedback: true
        })
      });

      if (!response.ok) {
        throw new Error(`PromptLoop session error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSession(data);
    } catch (error) {
      console.error('PromptLoop session creation error:', error);
      return this.createFallbackSession(params);
    }
  }

  async provideCoaching(params: {
    questionId: string;
    userAnswer: string;
    jobRole: string;
    personalization?: PromptLoopPersonalization;
  }): Promise<PromptLoopFeedback> {
    if (!this.apiKey) {
      return this.provideAICoaching(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/coaching/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: params.questionId,
          user_answer: params.userAnswer,
          job_role: params.jobRole,
          personalization: params.personalization,
          feedback_type: 'comprehensive',
          include_improved_answer: true
        })
      });

      if (!response.ok) {
        throw new Error(`PromptLoop coaching error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformFeedback(data);
    } catch (error) {
      console.error('PromptLoop coaching error:', error);
      return this.provideAICoaching(params);
    }
  }

  async generateAdaptiveQuestions(params: {
    userId: string;
    previousResponses: Array<{
      questionId: string;
      score: number;
      weakAreas: string[];
    }>;
    targetRole: string;
    nextFocusAreas: string[];
  }): Promise<PromptLoopQuestion[]> {
    if (!this.apiKey) {
      return this.generateAdaptiveQuestionsWithAI(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/questions/adaptive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: params.userId,
          previous_responses: params.previousResponses,
          target_role: params.targetRole,
          next_focus_areas: params.nextFocusAreas,
          adaptive_difficulty: true,
          progressive_complexity: true
        })
      });

      if (!response.ok) {
        throw new Error(`PromptLoop adaptive questions error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformQuestions(data.questions);
    } catch (error) {
      console.error('PromptLoop adaptive questions error:', error);
      return this.generateAdaptiveQuestionsWithAI(params);
    }
  }

  async createPersonalizedCoach(params: {
    userId: string;
    goals: string[];
    weakAreas: string[];
    strongAreas: string[];
    preferredStyle: string;
    targetRole: string;
  }): Promise<{
    coachId: string;
    coachingPlan: {
      phases: Array<{
        phase: number;
        focus: string;
        duration: string;
        objectives: string[];
        activities: string[];
      }>;
      milestones: Array<{
        milestone: string;
        criteria: string[];
        timeline: string;
      }>;
    };
    personalizedTips: string[];
    adaptiveSettings: PromptLoopPersonalization['adaptiveSettings'];
  }> {
    if (!this.apiKey) {
      return this.createFallbackPersonalizedCoach(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/coaches/personalized`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: params.userId,
          goals: params.goals,
          weak_areas: params.weakAreas,
          strong_areas: params.strongAreas,
          preferred_style: params.preferredStyle,
          target_role: params.targetRole,
          create_coaching_plan: true,
          enable_adaptive_feedback: true
        })
      });

      if (!response.ok) {
        throw new Error(`PromptLoop personalized coach error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformPersonalizedCoach(data);
    } catch (error) {
      console.error('PromptLoop personalized coach error:', error);
      return this.createFallbackPersonalizedCoach(params);
    }
  }

  async generatePracticeScenarios(params: {
    jobRole: string;
    industry: string;
    scenarioType: 'crisis' | 'leadership' | 'teamwork' | 'innovation' | 'negotiation';
    complexity: 'simple' | 'moderate' | 'complex';
    duration: number;
  }): Promise<{
    scenarioId: string;
    title: string;
    description: string;
    context: string;
    challenges: string[];
    questions: PromptLoopQuestion[];
    evaluationCriteria: Array<{
      criterion: string;
      weight: number;
      description: string;
    }>;
    expectedOutcomes: string[];
  }> {
    if (!this.apiKey) {
      return this.generateFallbackScenario(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/scenarios/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_role: params.jobRole,
          industry: params.industry,
          scenario_type: params.scenarioType,
          complexity: params.complexity,
          duration_minutes: params.duration,
          include_questions: true,
          include_evaluation: true
        })
      });

      if (!response.ok) {
        throw new Error(`PromptLoop scenario generation error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformScenario(data);
    } catch (error) {
      console.error('PromptLoop scenario generation error:', error);
      return this.generateFallbackScenario(params);
    }
  }

  // AI-powered fallback methods using OpenRouter
  private async generateQuestionsWithAI(params: any): Promise<PromptLoopQuestion[]> {
    const prompt = `Generate ${params.count} interview questions for a ${params.jobRole} position in ${params.industry}. 
    Experience level: ${params.experienceLevel}
    Question types: ${params.questionTypes.join(', ')}
    Difficulty: ${params.difficulty}
    Focus areas: ${params.focusAreas?.join(', ') || 'general'}
    
    For each question, provide:
    1. The question text
    2. Question type and category
    3. Difficulty level
    4. Time limit (in seconds)
    5. Ideal answer structure
    6. Key points to cover
    7. Example responses
    8. Coaching tips
    
    Format as JSON array with proper structure.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      const questions = this.parseAIQuestions(aiResponse);
      return questions;
    } catch (error) {
      console.error('AI question generation error:', error);
      return this.getFallbackQuestions(params);
    }
  }

  private async provideAICoaching(params: any): Promise<PromptLoopFeedback> {
    const prompt = `Provide comprehensive coaching feedback for this interview response:
    
    Question: ${params.questionId}
    User Answer: ${params.userAnswer}
    Job Role: ${params.jobRole}
    
    Analyze the response and provide:
    1. Overall score (0-100)
    2. Specific strengths
    3. Areas for improvement
    4. Specific suggestions
    5. Next steps for practice
    6. Coaching insights for communication, content, structure, confidence
    7. An improved version of the answer
    
    Be constructive, specific, and actionable in your feedback.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIFeedback(aiResponse);
    } catch (error) {
      console.error('AI coaching error:', error);
      return this.getFallbackFeedback(params);
    }
  }

  private async generateAdaptiveQuestionsWithAI(params: any): Promise<PromptLoopQuestion[]> {
    const prompt = `Generate adaptive follow-up interview questions based on previous performance:
    
    User ID: ${params.userId}
    Target Role: ${params.targetRole}
    Previous Performance: ${JSON.stringify(params.previousResponses)}
    Focus Areas: ${params.nextFocusAreas.join(', ')}
    
    Generate 3-5 questions that:
    1. Target identified weak areas
    2. Build on strengths
    3. Increase difficulty appropriately
    4. Are relevant to the target role
    
    Include coaching tips and ideal answers for each question.`;

    try {
      const aiResponse = await openRouterService.generateResponse(prompt, 'claude-3-5-sonnet-20241022');
      return this.parseAIQuestions(aiResponse);
    } catch (error) {
      console.error('AI adaptive questions error:', error);
      return this.getFallbackQuestions(params);
    }
  }

  private parseAIQuestions(aiResponse: string): PromptLoopQuestion[] {
    try {
      const questions = JSON.parse(aiResponse);
      return questions.map((q: any, index: number) => ({
        id: `ai_q_${index + 1}`,
        question: q.question || '',
        type: q.type || 'behavioral',
        difficulty: q.difficulty || 'intermediate',
        category: q.category || 'general',
        timeLimit: q.timeLimit || 120,
        followUp: q.followUp,
        context: q.context,
        idealAnswer: q.idealAnswer || {
          structure: [],
          keyPoints: [],
          examples: []
        },
        coachingTips: q.coachingTips || []
      }));
    } catch (error) {
      console.error('Error parsing AI questions:', error);
      return this.getFallbackQuestions({});
    }
  }

  private parseAIFeedback(aiResponse: string): PromptLoopFeedback {
    try {
      const feedback = JSON.parse(aiResponse);
      return {
        score: feedback.score || 75,
        strengths: feedback.strengths || [],
        improvements: feedback.improvements || [],
        specificSuggestions: feedback.specificSuggestions || [],
        nextSteps: feedback.nextSteps || [],
        coachingInsights: feedback.coachingInsights || {
          communication: 78,
          content: 75,
          structure: 72,
          confidence: 80
        },
        improvedAnswer: feedback.improvedAnswer || ''
      };
    } catch (error) {
      console.error('Error parsing AI feedback:', error);
      return this.getFallbackFeedback({});
    }
  }

  private transformQuestions(questions: any[]): PromptLoopQuestion[] {
    return questions.map(q => ({
      id: q.id || 'q_' + Date.now(),
      question: q.question || '',
      type: q.type || 'behavioral',
      difficulty: q.difficulty || 'intermediate',
      category: q.category || 'general',
      timeLimit: q.time_limit || 120,
      followUp: q.follow_up,
      context: q.context,
      idealAnswer: q.ideal_answer || {
        structure: [],
        keyPoints: [],
        examples: []
      },
      coachingTips: q.coaching_tips || []
    }));
  }

  private transformSession(data: any): PromptLoopCoachingSession {
    return {
      sessionId: data.session_id || 'session_' + Date.now(),
      userId: data.user_id || '',
      jobRole: data.job_role || '',
      questions: this.transformQuestions(data.questions || []),
      currentQuestion: 0,
      responses: [],
      overallProgress: {
        completed: 0,
        total: data.questions?.length || 0,
        averageScore: 0
      }
    };
  }

  private transformFeedback(data: any): PromptLoopFeedback {
    return {
      score: data.score || 75,
      strengths: data.strengths || [],
      improvements: data.improvements || [],
      specificSuggestions: data.specific_suggestions || [],
      nextSteps: data.next_steps || [],
      coachingInsights: data.coaching_insights || {
        communication: 78,
        content: 75,
        structure: 72,
        confidence: 80
      },
      improvedAnswer: data.improved_answer || ''
    };
  }

  private transformPersonalizedCoach(data: any): any {
    return {
      coachId: data.coach_id || 'coach_' + Date.now(),
      coachingPlan: data.coaching_plan || {
        phases: [],
        milestones: []
      },
      personalizedTips: data.personalized_tips || [],
      adaptiveSettings: data.adaptive_settings || {
        questionDifficulty: 'intermediate',
        feedbackStyle: 'detailed',
        focusAreas: []
      }
    };
  }

  private transformScenario(data: any): any {
    return {
      scenarioId: data.scenario_id || 'scenario_' + Date.now(),
      title: data.title || '',
      description: data.description || '',
      context: data.context || '',
      challenges: data.challenges || [],
      questions: this.transformQuestions(data.questions || []),
      evaluationCriteria: data.evaluation_criteria || [],
      expectedOutcomes: data.expected_outcomes || []
    };
  }

  private getFallbackQuestions(params: any): PromptLoopQuestion[] {
    return [
      {
        id: 'pq1',
        question: 'Tell me about a time when you had to lead a team through a challenging situation.',
        type: 'behavioral',
        difficulty: 'intermediate',
        category: 'leadership',
        timeLimit: 180,
        idealAnswer: {
          structure: ['Situation', 'Task', 'Action', 'Result'],
          keyPoints: ['Leadership skills', 'Problem-solving', 'Team dynamics'],
          examples: ['Specific challenge', 'Leadership actions', 'Positive outcome']
        },
        coachingTips: [
          'Use the STAR method for structure',
          'Focus on your specific actions as a leader',
          'Highlight both the process and results'
        ]
      },
      {
        id: 'pq2',
        question: 'How do you handle conflicting priorities and tight deadlines?',
        type: 'situational',
        difficulty: 'intermediate',
        category: 'time-management',
        timeLimit: 120,
        idealAnswer: {
          structure: ['Assessment', 'Prioritization', 'Execution', 'Communication'],
          keyPoints: ['Priority matrix', 'Stakeholder communication', 'Flexibility'],
          examples: ['Specific prioritization method', 'Communication strategy', 'Successful outcome']
        },
        coachingTips: [
          'Explain your prioritization framework',
          'Show how you communicate with stakeholders',
          'Demonstrate flexibility when priorities change'
        ]
      }
    ];
  }

  private createFallbackSession(params: any): PromptLoopCoachingSession {
    return {
      sessionId: 'prompt_session_' + Date.now(),
      userId: params.userId,
      jobRole: params.jobRole,
      questions: this.getFallbackQuestions(params),
      currentQuestion: 0,
      responses: [],
      overallProgress: {
        completed: 0,
        total: 2,
        averageScore: 0
      }
    };
  }

  private getFallbackFeedback(params: any): PromptLoopFeedback {
    return {
      score: 78,
      strengths: [
        'Clear communication',
        'Structured approach',
        'Relevant examples'
      ],
      improvements: [
        'Add more specific details',
        'Quantify results where possible',
        'Include lessons learned'
      ],
      specificSuggestions: [
        'Use the STAR method for better structure',
        'Prepare specific metrics and outcomes',
        'Practice transition phrases between sections'
      ],
      nextSteps: [
        'Practice with similar behavioral questions',
        'Prepare 3-5 detailed examples',
        'Work on confident delivery'
      ],
      coachingInsights: {
        communication: 82,
        content: 75,
        structure: 78,
        confidence: 80
      },
      improvedAnswer: 'Here is an improved version of your answer with better structure and specific examples...'
    };
  }

  private createFallbackPersonalizedCoach(params: any): any {
    return {
      coachId: 'coach_' + Date.now(),
      coachingPlan: {
        phases: [
          {
            phase: 1,
            focus: 'Foundation Building',
            duration: '1 week',
            objectives: ['Establish baseline', 'Identify strengths', 'Address basic concerns'],
            activities: ['Initial assessment', 'Basic question practice', 'Confidence building']
          },
          {
            phase: 2,
            focus: 'Skill Development',
            duration: '2 weeks',
            objectives: ['Improve weak areas', 'Enhance strengths', 'Build consistency'],
            activities: ['Targeted practice', 'Feedback integration', 'Progress tracking']
          },
          {
            phase: 3,
            focus: 'Advanced Preparation',
            duration: '1 week',
            objectives: ['Polish performance', 'Handle complex scenarios', 'Build confidence'],
            activities: ['Mock interviews', 'Scenario practice', 'Final preparation']
          }
        ],
        milestones: [
          {
            milestone: 'Baseline Established',
            criteria: ['Initial assessment complete', 'Weak areas identified', 'Goals set'],
            timeline: 'End of week 1'
          },
          {
            milestone: 'Skills Improved',
            criteria: ['Weak areas addressed', 'Consistent performance', 'Confidence built'],
            timeline: 'End of week 3'
          },
          {
            milestone: 'Interview Ready',
            criteria: ['All areas polished', 'Complex scenarios handled', 'High confidence'],
            timeline: 'End of week 4'
          }
        ]
      },
      personalizedTips: [
        'Focus on storytelling to make your answers more engaging',
        'Use specific metrics to demonstrate your impact',
        'Practice active listening during the interview'
      ],
      adaptiveSettings: {
        questionDifficulty: 'intermediate',
        feedbackStyle: 'detailed',
        focusAreas: params.weakAreas || []
      }
    };
  }

  private generateFallbackScenario(params: any): any {
    return {
      scenarioId: 'scenario_' + Date.now(),
      title: 'Crisis Management Scenario',
      description: 'Navigate a critical business situation requiring immediate action',
      context: 'Your team is facing a major system outage during peak business hours',
      challenges: [
        'Time pressure',
        'Stakeholder communication',
        'Resource coordination',
        'Decision making under pressure'
      ],
      questions: [
        {
          id: 'sq1',
          question: 'What are your immediate priorities in this situation?',
          type: 'situational',
          difficulty: 'advanced',
          category: 'crisis-management',
          timeLimit: 120,
          idealAnswer: {
            structure: ['Assess', 'Prioritize', 'Act', 'Communicate'],
            keyPoints: ['System stability', 'Customer impact', 'Team coordination'],
            examples: ['Incident response plan', 'Communication protocol', 'Recovery strategy']
          },
          coachingTips: [
            'Show systematic thinking',
            'Demonstrate leadership under pressure',
            'Focus on both immediate and long-term actions'
          ]
        }
      ],
      evaluationCriteria: [
        {
          criterion: 'Decision Making',
          weight: 0.3,
          description: 'Quality of decisions under pressure'
        },
        {
          criterion: 'Communication',
          weight: 0.25,
          description: 'Clarity and effectiveness of communication'
        },
        {
          criterion: 'Leadership',
          weight: 0.25,
          description: 'Leadership skills demonstrated'
        },
        {
          criterion: 'Problem Solving',
          weight: 0.2,
          description: 'Systematic approach to problem resolution'
        }
      ],
      expectedOutcomes: [
        'Clear action plan',
        'Effective communication strategy',
        'Leadership demonstration',
        'Crisis resolution approach'
      ]
    };
  }
}

export const promptLoopService = new PromptLoopService();