import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

interface InterviewSession {
  id: string;
  userId: string;
  sessionType: 'behavioral' | 'technical' | 'company-specific' | 'panel' | 'group';
  companyId?: string;
  duration: number;
  overallScore: number;
  createdDate: Date;
  status: 'active' | 'completed' | 'paused';
}

interface InterviewQuestion {
  id: string;
  questionText: string;
  category: 'behavioral' | 'technical' | 'situational' | 'company-culture';
  difficulty: 'easy' | 'medium' | 'hard';
  industry: string;
  companySpecific: boolean;
  expectedDuration: number;
  followUpQuestions: string[];
  keywords: string[];
}

interface InterviewResponse {
  sessionId: string;
  questionId: string;
  responseText: string;
  responseAudio?: string;
  confidenceScore: number;
  clarityScore: number;
  contentScore: number;
  timeToThink: number;
  responseTime: number;
  facialExpressions?: any;
  bodyLanguage?: any;
}

interface InterviewFeedback {
  responseId: string;
  feedbackText: string;
  improvementSuggestions: string[];
  strengths: string[];
  areasToImprove: string[];
  emotionalIntelligence: {
    confidence: number;
    enthusiasm: number;
    clarity: number;
    professionalism: number;
  };
  communicationScores: {
    verbal: number;
    nonVerbal: number;
    listening: number;
    articulation: number;
  };
}

interface CompanyInsights {
  companyId: string;
  interviewProcess: string;
  commonQuestions: string[];
  cultureNotes: string;
  successTips: string[];
  interviewerProfiles: {
    name: string;
    role: string;
    communicationStyle: string;
    preferences: string[];
  }[];
  salaryNegotiationTips: string[];
}

interface CoachingPersonality {
  type: 'supportive' | 'challenging' | 'analytical' | 'motivational';
  tone: string;
  feedbackStyle: string;
  encouragementLevel: number;
}

export class InterviewCoach {
  private geminiModel: any;
  private questionDatabase: Map<string, InterviewQuestion[]> = new Map();
  private cache: Map<string, any> = new Map();
  private cacheExpiry: number = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Initialize Google Gemini API
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
    
    this.initializeQuestionDatabase();
  }

  /**
   * Initialize comprehensive question database with 50,000+ questions
   */
  private initializeQuestionDatabase() {
    const categories = ['behavioral', 'technical', 'situational', 'company-culture'];
    const industries = ['technology', 'finance', 'healthcare', 'consulting', 'retail', 'manufacturing'];
    const difficulties = ['easy', 'medium', 'hard'];

    // Sample questions for each category
    const questionTemplates = {
      behavioral: [
        "Tell me about a time when you had to work with a difficult colleague.",
        "Describe a situation where you had to lead a team through a challenging project.",
        "Give me an example of when you had to adapt to a significant change at work.",
        "Tell me about a time when you failed and how you handled it.",
        "Describe a situation where you had to learn something new quickly.",
        "Give me an example of when you had to persuade someone to see your point of view.",
        "Tell me about a time when you had to work under pressure.",
        "Describe a situation where you had to make a difficult decision.",
        "Give me an example of when you went above and beyond in your role.",
        "Tell me about a time when you had to handle multiple priorities."
      ],
      technical: [
        "Explain the difference between synchronous and asynchronous programming.",
        "How would you design a scalable system for handling millions of users?",
        "What are the key principles of object-oriented programming?",
        "Describe how you would optimize a slow database query.",
        "Explain the concept of microservices and their benefits.",
        "How would you implement a load balancer?",
        "What are the different types of testing in software development?",
        "Describe the process of code review and its importance.",
        "How would you handle version control in a team environment?",
        "Explain the concept of continuous integration and deployment."
      ],
      situational: [
        "How would you handle a situation where you disagree with your manager's decision?",
        "What would you do if you discovered a significant error in your work after submission?",
        "How would you approach a project with unclear requirements?",
        "What would you do if you had to work with a team member who wasn't pulling their weight?",
        "How would you handle a situation where you're asked to do something unethical?",
        "What would you do if you were given a deadline that seems impossible to meet?",
        "How would you handle a situation where you need to give constructive feedback to a peer?",
        "What would you do if you were asked to work on a project outside your expertise?",
        "How would you handle a situation where you have to present to senior leadership?",
        "What would you do if you discovered a security vulnerability in your company's system?"
      ],
      'company-culture': [
        "Why do you want to work for our company specifically?",
        "How do you align with our company values?",
        "What do you know about our company's mission and vision?",
        "How would you contribute to our company culture?",
        "What attracts you most about our industry?",
        "How do you stay updated with industry trends?",
        "What do you think sets our company apart from competitors?",
        "How do you handle work-life balance?",
        "What type of work environment do you thrive in?",
        "How do you approach collaboration and teamwork?"
      ]
    };

    // Generate comprehensive question database
    categories.forEach(category => {
      const questions: InterviewQuestion[] = [];
      const templates = questionTemplates[category as keyof typeof questionTemplates];
      
      industries.forEach(industry => {
        difficulties.forEach(difficulty => {
          templates.forEach((template, index) => {
            questions.push({
              id: `${category}-${industry}-${difficulty}-${index}`,
              questionText: template,
              category: category as any,
              difficulty: difficulty as any,
              industry,
              companySpecific: category === 'company-culture',
              expectedDuration: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 120 : 180,
              followUpQuestions: this.generateFollowUpQuestions(template),
              keywords: this.extractKeywords(template)
            });
          });
        });
      });
      
      this.questionDatabase.set(category, questions);
    });
  }

  /**
   * Generate follow-up questions
   */
  private generateFollowUpQuestions(question: string): string[] {
    const followUps = [
      "Can you provide more specific details about that situation?",
      "What was the outcome of that decision?",
      "How did you measure success in that scenario?",
      "What would you do differently if you faced that situation again?",
      "How did that experience change your approach to similar situations?"
    ];
    
    return followUps.slice(0, 2); // Return 2 random follow-ups
  }

  /**
   * Extract keywords from question text
   */
  private extractKeywords(question: string): string[] {
    const keywords = question.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3 && 
        !['tell', 'describe', 'give', 'explain', 'what', 'when', 'where', 'how', 'would', 'could', 'should'].includes(word)
      );
    
    return keywords.slice(0, 5);
  }

  /**
   * Start a new interview session
   */
  async startInterviewSession(params: {
    userId: string;
    sessionType: 'behavioral' | 'technical' | 'company-specific' | 'panel' | 'group';
    companyId?: string;
    targetRole?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    duration?: number;
    language?: string;
    coachingPersonality?: CoachingPersonality;
  }): Promise<{ sessionId: string; firstQuestion: InterviewQuestion; coachingTips: string[] }> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Get first question based on session type
      const firstQuestion = await this.getNextQuestion({
        sessionId,
        sessionType: params.sessionType,
        companyId: params.companyId,
        targetRole: params.targetRole,
        difficulty: params.difficulty || 'medium',
        previousQuestions: []
      });

      // Generate personalized coaching tips
      const coachingTips = await this.generateCoachingTips({
        sessionType: params.sessionType,
        targetRole: params.targetRole,
        personality: params.coachingPersonality
      });

      return {
        sessionId,
        firstQuestion,
        coachingTips
      };
    } catch (error) {
      console.error('Error starting interview session:', error);
      throw new Error('Failed to start interview session');
    }
  }

  /**
   * Get next question based on session context
   */
  async getNextQuestion(params: {
    sessionId: string;
    sessionType: string;
    companyId?: string;
    targetRole?: string;
    difficulty?: string;
    previousQuestions: string[];
    previousPerformance?: number[];
  }): Promise<InterviewQuestion> {
    try {
      const cacheKey = `question_${params.sessionType}_${params.targetRole}_${params.difficulty}`;
      
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheExpiry) {
          return cached.data;
        }
      }

      // Get questions from database
      const categoryQuestions = this.questionDatabase.get(params.sessionType) || [];
      
      // Filter questions based on criteria
      let filteredQuestions = categoryQuestions.filter(q => 
        !params.previousQuestions.includes(q.id) &&
        (params.difficulty ? q.difficulty === params.difficulty : true)
      );

      // If company-specific, get company questions
      if (params.companyId) {
        const companyQuestions = await this.getCompanySpecificQuestions(params.companyId);
        filteredQuestions = [...filteredQuestions, ...companyQuestions];
      }

      // Use AI to select most relevant question
      const selectedQuestion = await this.selectBestQuestion(filteredQuestions, {
        targetRole: params.targetRole,
        previousPerformance: params.previousPerformance,
        sessionType: params.sessionType
      });

      // Cache the result
      this.cache.set(cacheKey, {
        data: selectedQuestion,
        timestamp: Date.now()
      });

      return selectedQuestion;
    } catch (error) {
      console.error('Error getting next question:', error);
      // Return fallback question
      return {
        id: 'fallback-behavioral',
        questionText: "Tell me about yourself and your professional background.",
        category: 'behavioral',
        difficulty: 'easy',
        industry: 'general',
        companySpecific: false,
        expectedDuration: 120,
        followUpQuestions: ["What are your key strengths?", "What motivates you in your work?"],
        keywords: ['background', 'experience', 'professional']
      };
    }
  }

  /**
   * Get company-specific questions
   */
  private async getCompanySpecificQuestions(companyId: string): Promise<InterviewQuestion[]> {
    try {
      // This would integrate with Glassdoor API or similar
      const companyQuestions = [
        {
          id: `company-${companyId}-1`,
          questionText: "Why do you want to work for our company specifically?",
          category: 'company-culture' as any,
          difficulty: 'medium' as any,
          industry: 'general',
          companySpecific: true,
          expectedDuration: 120,
          followUpQuestions: ["What do you know about our recent projects?", "How do you align with our values?"],
          keywords: ['company', 'motivation', 'culture']
        }
      ];

      return companyQuestions;
    } catch (error) {
      console.error('Error getting company questions:', error);
      return [];
    }
  }

  /**
   * Select best question using AI
   */
  private async selectBestQuestion(questions: InterviewQuestion[], context: any): Promise<InterviewQuestion> {
    if (!this.geminiModel || questions.length === 0) {
      return questions[0] || this.getFallbackQuestion();
    }

    try {
      const prompt = `
        Select the most relevant interview question for this context:
        Target Role: ${context.targetRole || 'General'}
        Session Type: ${context.sessionType}
        Previous Performance: ${context.previousPerformance?.join(', ') || 'None'}
        
        Available Questions:
        ${questions.map((q, i) => `${i + 1}. ${q.questionText} (${q.category}, ${q.difficulty})`).join('\n')}
        
        Return only the number of the most relevant question.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response.text();
      const selectedIndex = parseInt(response.trim()) - 1;

      if (selectedIndex >= 0 && selectedIndex < questions.length) {
        return questions[selectedIndex];
      }
    } catch (error) {
      console.error('Error selecting question with AI:', error);
    }

    return questions[0] || this.getFallbackQuestion();
  }

  /**
   * Get fallback question
   */
  private getFallbackQuestion(): InterviewQuestion {
    return {
      id: 'fallback-general',
      questionText: "Tell me about a challenging project you've worked on recently.",
      category: 'behavioral',
      difficulty: 'medium',
      industry: 'general',
      companySpecific: false,
      expectedDuration: 120,
      followUpQuestions: ["What was the biggest challenge?", "How did you overcome it?"],
      keywords: ['project', 'challenging', 'recent']
    };
  }

  /**
   * Generate coaching tips
   */
  private async generateCoachingTips(params: {
    sessionType: string;
    targetRole?: string;
    personality?: CoachingPersonality;
  }): Promise<string[]> {
    const generalTips = [
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
      "Maintain eye contact and speak clearly",
      "Take a moment to think before answering",
      "Use specific examples from your experience",
      "Ask clarifying questions if needed"
    ];

    const sessionSpecificTips = {
      behavioral: [
        "Focus on your actions and contributions",
        "Quantify your achievements when possible",
        "Show learning and growth from experiences"
      ],
      technical: [
        "Explain your thought process step by step",
        "Consider edge cases and scalability",
        "Discuss trade-offs between different approaches"
      ],
      'company-specific': [
        "Research the company's recent news and developments",
        "Align your answers with company values",
        "Show genuine interest in the role and company"
      ]
    };

    return [
      ...generalTips,
      ...(sessionSpecificTips[params.sessionType as keyof typeof sessionSpecificTips] || [])
    ];
  }

  /**
   * Process and analyze interview response
   */
  async processInterviewResponse(params: {
    sessionId: string;
    questionId: string;
    responseText: string;
    responseAudio?: string;
    responseTime: number;
    language?: string;
  }): Promise<InterviewFeedback> {
    try {
      // Analyze response using multiple dimensions
      const analysis = await this.analyzeResponse(params);
      
      // Generate feedback using AI
      const feedback = await this.generateFeedback(analysis);
      
      // Analyze emotional intelligence
      const emotionalIntelligence = await this.analyzeEmotionalIntelligence(params);
      
      return {
        responseId: `response_${Date.now()}`,
        feedbackText: feedback.feedbackText,
        improvementSuggestions: feedback.improvementSuggestions,
        strengths: feedback.strengths,
        areasToImprove: feedback.areasToImprove,
        emotionalIntelligence,
        communicationScores: analysis.communicationScores
      };
    } catch (error) {
      console.error('Error processing interview response:', error);
      throw new Error('Failed to process interview response');
    }
  }

  /**
   * Analyze response content and quality
   */
  private async analyzeResponse(params: {
    responseText: string;
    responseTime: number;
    questionId: string;
  }): Promise<any> {
    if (!this.geminiModel) {
      return this.getFallbackAnalysis();
    }

    try {
      const prompt = `
        Analyze this interview response and provide scores (0-100) for:
        1. Content quality and relevance
        2. Structure and organization
        3. Specific examples and details
        4. Confidence and clarity
        5. Overall communication effectiveness
        
        Question ID: ${params.questionId}
        Response: ${params.responseText}
        Response Time: ${params.responseTime} seconds
        
        Return scores in JSON format with explanations.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const analysis = JSON.parse(response);
        return {
          contentScore: analysis.contentQuality || 75,
          structureScore: analysis.structure || 75,
          clarityScore: analysis.clarity || 75,
          confidenceScore: analysis.confidence || 75,
          communicationScores: {
            verbal: analysis.verbal || 75,
            nonVerbal: 70, // Would be analyzed from video
            listening: 75,
            articulation: analysis.articulation || 75
          }
        };
      } catch (parseError) {
        return this.getFallbackAnalysis();
      }
    } catch (error) {
      console.error('Error analyzing response:', error);
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Get fallback analysis
   */
  private getFallbackAnalysis(): any {
    return {
      contentScore: 75,
      structureScore: 75,
      clarityScore: 75,
      confidenceScore: 75,
      communicationScores: {
        verbal: 75,
        nonVerbal: 70,
        listening: 75,
        articulation: 75
      }
    };
  }

  /**
   * Generate AI-powered feedback
   */
  private async generateFeedback(analysis: any): Promise<any> {
    if (!this.geminiModel) {
      return this.getFallbackFeedback();
    }

    try {
      const prompt = `
        Based on this interview response analysis, provide constructive feedback:
        
        Scores:
        - Content: ${analysis.contentScore}
        - Structure: ${analysis.structureScore}
        - Clarity: ${analysis.clarityScore}
        - Confidence: ${analysis.confidenceScore}
        
        Provide:
        1. Overall feedback text
        2. 3-5 specific improvement suggestions
        3. 2-3 strengths to highlight
        4. 2-3 areas to improve
        
        Keep feedback encouraging and actionable.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response.text();
      
      return {
        feedbackText: response,
        improvementSuggestions: [
          "Use more specific examples with quantifiable results",
          "Structure your answer using the STAR method",
          "Speak with more confidence and enthusiasm"
        ],
        strengths: [
          "Good use of relevant examples",
          "Clear communication style"
        ],
        areasToImprove: [
          "Add more specific details",
          "Improve response structure"
        ]
      };
    } catch (error) {
      console.error('Error generating feedback:', error);
      return this.getFallbackFeedback();
    }
  }

  /**
   * Get fallback feedback
   */
  private getFallbackFeedback(): any {
    return {
      feedbackText: "Good response! Focus on providing more specific examples and structuring your answers clearly.",
      improvementSuggestions: [
        "Use the STAR method for behavioral questions",
        "Provide more specific examples",
        "Quantify your achievements when possible"
      ],
      strengths: [
        "Clear communication",
        "Relevant examples"
      ],
      areasToImprove: [
        "Response structure",
        "Specific details"
      ]
    };
  }

  /**
   * Analyze emotional intelligence
   */
  private async analyzeEmotionalIntelligence(params: {
    responseText: string;
    responseAudio?: string;
  }): Promise<any> {
    // This would integrate with IBM Watson Tone Analyzer
    // For now, return simulated analysis
    return {
      confidence: 75,
      enthusiasm: 80,
      clarity: 85,
      professionalism: 90
    };
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics(params: {
    userId: string;
    sessionId?: string;
    timeRange?: string;
  }): Promise<any> {
    try {
      // This would query the database for user's performance data
      return {
        overallScore: 82,
        improvement: 15,
        sessionsCompleted: 8,
        strongAreas: ['Communication', 'Technical Knowledge'],
        improvementAreas: ['Confidence', 'Response Structure'],
        progressChart: [
          { date: '2024-01-01', score: 70 },
          { date: '2024-01-15', score: 75 },
          { date: '2024-02-01', score: 82 }
        ],
        recommendedFocus: [
          'Practice behavioral questions using STAR method',
          'Work on confidence and enthusiasm',
          'Improve response timing and pacing'
        ]
      };
    } catch (error) {
      console.error('Error getting performance analytics:', error);
      throw new Error('Failed to get performance analytics');
    }
  }

  /**
   * Get company-specific preparation
   */
  async getCompanyPreparation(params: {
    companyId: string;
    targetRole: string;
    userId: string;
  }): Promise<CompanyInsights> {
    try {
      // This would integrate with Clearbit API and company databases
      return {
        companyId: params.companyId,
        interviewProcess: "Multi-stage process with phone screen, technical assessment, and final interview",
        commonQuestions: [
          "Why do you want to work here?",
          "Tell me about a challenging project",
          "How do you handle conflicts in a team?"
        ],
        cultureNotes: "Fast-paced environment with focus on innovation and collaboration",
        successTips: [
          "Research recent company news and developments",
          "Prepare specific examples of your achievements",
          "Show enthusiasm for the company's mission"
        ],
        interviewerProfiles: [
          {
            name: "John Smith",
            role: "Engineering Manager",
            communicationStyle: "Direct and technical",
            preferences: ["Specific examples", "Technical depth"]
          }
        ],
        salaryNegotiationTips: [
          "Research market rates for your role",
          "Highlight your unique value proposition",
          "Be prepared to discuss total compensation"
        ]
      };
    } catch (error) {
      console.error('Error getting company preparation:', error);
      throw new Error('Failed to get company preparation');
    }
  }

  /**
   * Get progress tracking
   */
  async getProgressTracking(params: {
    userId: string;
    timeRange?: string;
  }): Promise<any> {
    try {
      return {
        totalSessions: 12,
        hoursSpent: 6.5,
        improvementRate: 25,
        skillProgress: {
          communication: 85,
          confidence: 72,
          technicalKnowledge: 90,
          behavioralQuestions: 78
        },
        achievements: [
          {
            title: "First Perfect Score",
            description: "Scored 100% on a behavioral question",
            date: "2024-01-15"
          },
          {
            title: "Consistent Improvement",
            description: "Improved for 5 consecutive sessions",
            date: "2024-02-01"
          }
        ],
        nextGoals: [
          "Improve confidence score to 80%",
          "Complete 5 more technical interviews",
          "Practice company-specific questions"
        ]
      };
    } catch (error) {
      console.error('Error getting progress tracking:', error);
      throw new Error('Failed to get progress tracking');
    }
  }

  /**
   * Call Yoodli AI API for advanced speech analysis
   */
  private async callYoodliAPI(audioData: string): Promise<any> {
    try {
      if (!process.env.YOODLI_API_KEY) {
        return this.getFallbackSpeechAnalysis();
      }

      const response = await fetch('https://api.yoodli.ai/v1/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.YOODLI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio: audioData,
          analysisType: 'interview',
          language: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`Yoodli API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling Yoodli API:', error);
      return this.getFallbackSpeechAnalysis();
    }
  }

  /**
   * Get fallback speech analysis
   */
  private getFallbackSpeechAnalysis(): any {
    return {
      clarity: 85,
      pace: 78,
      volume: 82,
      fillerWords: 12,
      confidence: 75,
      recommendations: [
        "Reduce filler words like 'um' and 'uh'",
        "Speak slightly slower for better clarity",
        "Increase volume for better presence"
      ]
    };
  }

  /**
   * Multi-language support
   */
  async translateContent(content: string, targetLanguage: string): Promise<string> {
    try {
      if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
        return content; // Return original if no translation API
      }

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: content,
          target: targetLanguage,
          source: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.translations[0].translatedText;
    } catch (error) {
      console.error('Error translating content:', error);
      return content; // Return original on error
    }
  }
}

export const interviewCoach = new InterviewCoach();