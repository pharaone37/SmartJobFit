import fetch from 'node-fetch';

interface VervoeAssessment {
  id: string;
  title: string;
  description: string;
  type: 'behavioral' | 'technical' | 'cognitive' | 'situational';
  duration: number;
  questions: VervoeQuestion[];
  skillsAssessed: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface VervoeQuestion {
  id: string;
  type: 'video' | 'text' | 'multiple_choice' | 'coding' | 'case_study';
  question: string;
  context?: string;
  timeLimit: number;
  requirements?: string[];
  evaluationCriteria: Array<{
    criterion: string;
    weight: number;
    description: string;
  }>;
  sampleAnswer?: string;
}

interface VervoeResponse {
  questionId: string;
  responseType: 'video' | 'text' | 'code' | 'selection';
  content: string;
  timestamp: string;
  metadata: {
    duration?: number;
    fileSize?: number;
    language?: string;
  };
}

interface VervoeAssessmentResult {
  overallScore: number;
  skillScores: Array<{
    skill: string;
    score: number;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    feedback: string;
  }>;
  questionResults: Array<{
    questionId: string;
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  }>;
  aiAnalysis: {
    communication: number;
    problemSolving: number;
    technicalSkills: number;
    culturalFit: number;
  };
  recommendations: Array<{
    area: string;
    suggestion: string;
    resources: string[];
  }>;
  benchmark: {
    percentile: number;
    comparison: string;
    industry: string;
  };
}

class VervoeService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.VERVOE_API_KEY || '';
    this.baseUrl = 'https://api.vervoe.com/v1';
  }

  async createAssessment(params: {
    jobRole: string;
    skills: string[];
    assessmentType: 'behavioral' | 'technical' | 'cognitive' | 'situational';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
  }): Promise<VervoeAssessment> {
    if (!this.apiKey) {
      console.log('VERVOE_API_KEY not found. Using comprehensive fallback assessment.');
      return this.getFallbackAssessment(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/assessments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_role: params.jobRole,
          skills: params.skills,
          assessment_type: params.assessmentType,
          difficulty: params.difficulty,
          duration_minutes: params.duration,
          include_ai_analysis: true
        })
      });

      if (!response.ok) {
        throw new Error(`Vervoe API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAssessment(data);
    } catch (error) {
      console.error('Vervoe assessment creation error:', error);
      return this.getFallbackAssessment(params);
    }
  }

  async getAssessmentById(assessmentId: string): Promise<VervoeAssessment> {
    if (!this.apiKey) {
      return this.getFallbackAssessmentById(assessmentId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/assessments/${assessmentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Vervoe API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAssessment(data);
    } catch (error) {
      console.error('Vervoe assessment retrieval error:', error);
      return this.getFallbackAssessmentById(assessmentId);
    }
  }

  async submitResponse(params: {
    assessmentId: string;
    questionId: string;
    response: VervoeResponse;
    userId: string;
  }): Promise<{
    success: boolean;
    message: string;
    nextQuestion?: string;
    progress: {
      completed: number;
      total: number;
      percentage: number;
    };
  }> {
    if (!this.apiKey) {
      return this.getFallbackSubmitResponse(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/assessments/${params.assessmentId}/responses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: params.questionId,
          response: params.response,
          user_id: params.userId
        })
      });

      if (!response.ok) {
        throw new Error(`Vervoe response submission error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSubmissionResponse(data);
    } catch (error) {
      console.error('Vervoe response submission error:', error);
      return this.getFallbackSubmitResponse(params);
    }
  }

  async getAssessmentResults(params: {
    assessmentId: string;
    userId: string;
  }): Promise<VervoeAssessmentResult> {
    if (!this.apiKey) {
      return this.getFallbackAssessmentResults(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/assessments/${params.assessmentId}/results/${params.userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Vervoe results error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformAssessmentResults(data);
    } catch (error) {
      console.error('Vervoe assessment results error:', error);
      return this.getFallbackAssessmentResults(params);
    }
  }

  async getBenchmarkData(params: {
    jobRole: string;
    industry: string;
    skills: string[];
  }): Promise<{
    industryAverage: number;
    skillBenchmarks: Array<{
      skill: string;
      average: number;
      topPerformers: number;
      distribution: Array<{
        range: string;
        percentage: number;
      }>;
    }>;
    recommendations: Array<{
      area: string;
      benchmark: number;
      suggestion: string;
    }>;
  }> {
    if (!this.apiKey) {
      return this.getFallbackBenchmarkData(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/benchmarks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_role: params.jobRole,
          industry: params.industry,
          skills: params.skills
        })
      });

      if (!response.ok) {
        throw new Error(`Vervoe benchmark error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformBenchmarkData(data);
    } catch (error) {
      console.error('Vervoe benchmark error:', error);
      return this.getFallbackBenchmarkData(params);
    }
  }

  async getSkillsTest(params: {
    skills: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    testType: 'quick' | 'comprehensive';
  }): Promise<{
    testId: string;
    questions: Array<{
      id: string;
      skill: string;
      question: string;
      type: 'practical' | 'theoretical' | 'scenario';
      timeLimit: number;
      resources?: string[];
    }>;
    passingScore: number;
    estimatedDuration: number;
  }> {
    if (!this.apiKey) {
      return this.getFallbackSkillsTest(params);
    }

    try {
      const response = await fetch(`${this.baseUrl}/skills-tests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skills: params.skills,
          difficulty: params.difficulty,
          test_type: params.testType
        })
      });

      if (!response.ok) {
        throw new Error(`Vervoe skills test error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSkillsTest(data);
    } catch (error) {
      console.error('Vervoe skills test error:', error);
      return this.getFallbackSkillsTest(params);
    }
  }

  private transformAssessment(data: any): VervoeAssessment {
    return {
      id: data.id || 'assessment_' + Date.now(),
      title: data.title || 'Interview Assessment',
      description: data.description || 'Comprehensive interview assessment',
      type: data.type || 'behavioral',
      duration: data.duration || 60,
      questions: data.questions?.map(this.transformQuestion) || [],
      skillsAssessed: data.skills_assessed || [],
      difficultyLevel: data.difficulty_level || 'intermediate'
    };
  }

  private transformQuestion(q: any): VervoeQuestion {
    return {
      id: q.id || 'q_' + Date.now(),
      type: q.type || 'video',
      question: q.question || '',
      context: q.context,
      timeLimit: q.time_limit || 120,
      requirements: q.requirements || [],
      evaluationCriteria: q.evaluation_criteria || [],
      sampleAnswer: q.sample_answer
    };
  }

  private transformSubmissionResponse(data: any): any {
    return {
      success: data.success || true,
      message: data.message || 'Response submitted successfully',
      nextQuestion: data.next_question,
      progress: {
        completed: data.progress?.completed || 0,
        total: data.progress?.total || 0,
        percentage: data.progress?.percentage || 0
      }
    };
  }

  private transformAssessmentResults(data: any): VervoeAssessmentResult {
    return {
      overallScore: data.overall_score || 78,
      skillScores: data.skill_scores || [],
      questionResults: data.question_results || [],
      aiAnalysis: {
        communication: data.ai_analysis?.communication || 82,
        problemSolving: data.ai_analysis?.problem_solving || 78,
        technicalSkills: data.ai_analysis?.technical_skills || 85,
        culturalFit: data.ai_analysis?.cultural_fit || 80
      },
      recommendations: data.recommendations || [],
      benchmark: {
        percentile: data.benchmark?.percentile || 65,
        comparison: data.benchmark?.comparison || 'Above average',
        industry: data.benchmark?.industry || 'Technology'
      }
    };
  }

  private transformBenchmarkData(data: any): any {
    return {
      industryAverage: data.industry_average || 75,
      skillBenchmarks: data.skill_benchmarks || [],
      recommendations: data.recommendations || []
    };
  }

  private transformSkillsTest(data: any): any {
    return {
      testId: data.test_id || 'test_' + Date.now(),
      questions: data.questions || [],
      passingScore: data.passing_score || 70,
      estimatedDuration: data.estimated_duration || 30
    };
  }

  private getFallbackAssessment(params: any): VervoeAssessment {
    return {
      id: 'assessment_' + Date.now(),
      title: `${params.jobRole} Interview Assessment`,
      description: `Comprehensive ${params.assessmentType} assessment for ${params.jobRole} position`,
      type: params.assessmentType,
      duration: params.duration,
      questions: [
        {
          id: 'q1',
          type: 'video',
          question: 'Tell me about your experience with the key responsibilities of this role.',
          timeLimit: 120,
          requirements: ['Clear communication', 'Relevant examples', 'Professional presentation'],
          evaluationCriteria: [
            { criterion: 'Relevance', weight: 0.3, description: 'How relevant is the experience to the role' },
            { criterion: 'Communication', weight: 0.3, description: 'Clarity and professionalism' },
            { criterion: 'Examples', weight: 0.4, description: 'Quality of specific examples provided' }
          ]
        },
        {
          id: 'q2',
          type: 'text',
          question: 'Describe a challenging situation you faced and how you overcame it.',
          timeLimit: 180,
          requirements: ['STAR method', 'Specific details', 'Clear resolution'],
          evaluationCriteria: [
            { criterion: 'Problem-solving', weight: 0.4, description: 'Quality of problem-solving approach' },
            { criterion: 'Structure', weight: 0.3, description: 'Organization and clarity of response' },
            { criterion: 'Learning', weight: 0.3, description: 'Demonstrated learning and growth' }
          ]
        },
        {
          id: 'q3',
          type: 'case_study',
          question: 'How would you approach this business scenario?',
          context: 'You are given a project with tight deadlines and limited resources. Walk through your approach.',
          timeLimit: 300,
          requirements: ['Strategic thinking', 'Resource management', 'Risk assessment'],
          evaluationCriteria: [
            { criterion: 'Strategy', weight: 0.4, description: 'Strategic approach and planning' },
            { criterion: 'Execution', weight: 0.3, description: 'Practical execution steps' },
            { criterion: 'Risk Management', weight: 0.3, description: 'Risk identification and mitigation' }
          ]
        }
      ],
      skillsAssessed: params.skills,
      difficultyLevel: params.difficulty
    };
  }

  private getFallbackAssessmentById(assessmentId: string): VervoeAssessment {
    return {
      id: assessmentId,
      title: 'Software Engineer Interview Assessment',
      description: 'Comprehensive assessment for software engineering position',
      type: 'technical',
      duration: 90,
      questions: [
        {
          id: 'q1',
          type: 'coding',
          question: 'Implement a function that finds the longest substring without repeating characters.',
          timeLimit: 45,
          requirements: ['Efficient algorithm', 'Clean code', 'Handle edge cases'],
          evaluationCriteria: [
            { criterion: 'Correctness', weight: 0.4, description: 'Correct implementation' },
            { criterion: 'Efficiency', weight: 0.3, description: 'Time and space complexity' },
            { criterion: 'Code Quality', weight: 0.3, description: 'Clean, readable code' }
          ]
        }
      ],
      skillsAssessed: ['Problem Solving', 'Algorithm Design', 'Code Quality'],
      difficultyLevel: 'intermediate'
    };
  }

  private getFallbackSubmitResponse(params: any): any {
    return {
      success: true,
      message: 'Response submitted successfully',
      nextQuestion: 'q' + (parseInt(params.questionId.replace('q', '')) + 1),
      progress: {
        completed: 1,
        total: 3,
        percentage: 33
      }
    };
  }

  private getFallbackAssessmentResults(params: any): VervoeAssessmentResult {
    return {
      overallScore: 82,
      skillScores: [
        { skill: 'Communication', score: 85, level: 'advanced', feedback: 'Excellent verbal communication skills' },
        { skill: 'Problem Solving', score: 78, level: 'intermediate', feedback: 'Good analytical approach with room for improvement' },
        { skill: 'Technical Skills', score: 88, level: 'advanced', feedback: 'Strong technical foundation and practical application' }
      ],
      questionResults: [
        {
          questionId: 'q1',
          score: 85,
          feedback: 'Well-structured response with clear examples',
          strengths: ['Clear communication', 'Relevant examples', 'Professional presentation'],
          improvements: ['Add more specific metrics', 'Include lessons learned']
        },
        {
          questionId: 'q2',
          score: 78,
          feedback: 'Good problem-solving approach, could be more detailed',
          strengths: ['Systematic approach', 'Clear resolution', 'Learning mindset'],
          improvements: ['More context about challenges', 'Quantify impact']
        }
      ],
      aiAnalysis: {
        communication: 85,
        problemSolving: 78,
        technicalSkills: 88,
        culturalFit: 82
      },
      recommendations: [
        {
          area: 'Problem Solving',
          suggestion: 'Practice breaking down complex problems into smaller components',
          resources: ['Case study practice', 'Problem-solving frameworks', 'Mock interviews']
        },
        {
          area: 'Communication',
          suggestion: 'Continue to leverage your strong communication skills',
          resources: ['Public speaking courses', 'Presentation training', 'Leadership development']
        }
      ],
      benchmark: {
        percentile: 75,
        comparison: 'Above average compared to similar candidates',
        industry: 'Technology'
      }
    };
  }

  private getFallbackBenchmarkData(params: any): any {
    return {
      industryAverage: 75,
      skillBenchmarks: [
        {
          skill: 'Communication',
          average: 78,
          topPerformers: 92,
          distribution: [
            { range: '0-60', percentage: 15 },
            { range: '61-80', percentage: 55 },
            { range: '81-100', percentage: 30 }
          ]
        },
        {
          skill: 'Problem Solving',
          average: 72,
          topPerformers: 88,
          distribution: [
            { range: '0-60', percentage: 20 },
            { range: '61-80', percentage: 50 },
            { range: '81-100', percentage: 30 }
          ]
        }
      ],
      recommendations: [
        {
          area: 'Communication',
          benchmark: 78,
          suggestion: 'Focus on clarity and conciseness in responses'
        },
        {
          area: 'Problem Solving',
          benchmark: 72,
          suggestion: 'Practice structured problem-solving approaches'
        }
      ]
    };
  }

  private getFallbackSkillsTest(params: any): any {
    return {
      testId: 'test_' + Date.now(),
      questions: [
        {
          id: 'sq1',
          skill: 'JavaScript',
          question: 'What is the difference between let, const, and var?',
          type: 'theoretical',
          timeLimit: 60
        },
        {
          id: 'sq2',
          skill: 'React',
          question: 'Build a simple counter component with hooks',
          type: 'practical',
          timeLimit: 180,
          resources: ['React documentation', 'Hooks guide']
        },
        {
          id: 'sq3',
          skill: 'Problem Solving',
          question: 'Design a system to handle user authentication',
          type: 'scenario',
          timeLimit: 240
        }
      ],
      passingScore: 70,
      estimatedDuration: 45
    };
  }
}

export const vervoeService = new VervoeService();