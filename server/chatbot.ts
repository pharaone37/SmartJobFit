import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI for conversational intelligence
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Conversation context interface
interface ConversationContext {
  userId: string;
  sessionId: string;
  messages: ChatMessage[];
  userProfile?: any;
  currentFeature?: string;
  lastActivity: Date;
  preferences?: {
    communicationStyle?: 'professional' | 'casual' | 'technical';
    expertiseLevel?: 'beginner' | 'intermediate' | 'advanced';
    preferredLanguage?: string;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestedActions?: string[];
    relatedFeatures?: string[];
  };
}

interface ChatbotResponse {
  message: string;
  confidence: number;
  suggestedActions?: string[];
  relatedFeatures?: string[];
  escalateToHuman?: boolean;
  conversationContext?: any;
}

// In-memory conversation storage (in production, use Redis or database)
const conversations = new Map<string, ConversationContext>();

// Comprehensive knowledge base about SmartJobFit
const knowledgeBase = {
  platform: {
    overview: `SmartJobFit is an AI-powered job search platform that revolutionizes employment journeys through intelligent job matching, resume optimization, and comprehensive career support. Our platform achieves 94% job matching accuracy and helps users find their dream job 10x faster through advanced AI technology.`,
    mission: `To democratize access to career opportunities by providing AI-powered tools that level the playing field for job seekers across all industries and experience levels.`,
    features: [
      'AI-Powered Job Search',
      'Resume Optimization',
      'Interview Preparation',
      'Application Tracking',
      'Salary Intelligence',
      'Career Coaching',
      'Job Alerts',
      'One-Click Apply',
      'Company Intelligence'
    ]
  },
  
  features: {
    'AI-Powered Job Search': {
      description: 'Advanced AI job matching with 94% accuracy using Google Gemini 2.5 Flash',
      benefits: [
        '94% job matching accuracy',
        'Natural language search capabilities',
        'Aggregation from 15+ job boards',
        'Real-time job updates',
        'Intelligent deduplication',
        'Contextual understanding beyond keywords'
      ],
      howItWorks: 'Our AI analyzes job descriptions, company culture, and your profile using over 200 data points to deliver precise matches that align with your career goals.',
      commonQuestions: [
        'How does the AI understand my preferences?',
        'What job boards do you aggregate from?',
        'How often are jobs updated?',
        'Can I use natural language to search?'
      ]
    },
    
    'Resume Optimization': {
      description: 'AI-powered resume analysis and optimization with 99.8% ATS compatibility',
      benefits: [
        '99.8% ATS compatibility rate',
        'AI-powered content enhancement',
        'Keyword optimization',
        'Achievement rewriting',
        'Multi-version management',
        'Performance analytics'
      ],
      howItWorks: 'Our system analyzes your resume against real ATS systems and provides specific improvements for content, formatting, and keyword optimization.',
      commonQuestions: [
        'How accurate is the ATS checker?',
        'What file formats are supported?',
        'Can I optimize for specific jobs?',
        'How does the AI improve my content?'
      ]
    },
    
    'Interview Preparation': {
      description: 'AI coach with 78% success rate and multi-language support',
      benefits: [
        '78% interview success rate',
        'Multi-language support (6 languages)',
        'Company-specific preparation',
        'Speech analysis and feedback',
        'Performance analytics',
        'Confidence building'
      ],
      howItWorks: 'Our AI coach analyzes your responses, speech patterns, and confidence level to provide personalized feedback and improvement strategies.',
      commonQuestions: [
        'What languages are supported?',
        'How accurate is the speech analysis?',
        'Can it help with technical interviews?',
        'How does the AI provide feedback?'
      ]
    },
    
    'Application Tracking': {
      description: 'Automated tracking with 87% outcome prediction accuracy',
      benefits: [
        '87% outcome prediction accuracy',
        'Automated email integration',
        'Status detection and updates',
        'Portfolio analytics',
        'Follow-up automation',
        'Calendar integration'
      ],
      howItWorks: 'The system integrates with your email to automatically track communications and predict application outcomes based on response patterns.',
      commonQuestions: [
        'How does email integration work?',
        'What email providers are supported?',
        'How accurate are the predictions?',
        'Can it track multiple platforms?'
      ]
    },
    
    'Salary Intelligence': {
      description: 'Market data with 95% accuracy and 73% negotiation success rate',
      benefits: [
        '95% salary data accuracy',
        '73% negotiation success rate',
        'Real-time market adjustments',
        'Company-specific insights',
        'Total compensation analysis',
        'Geographic cost adjustments'
      ],
      howItWorks: 'We aggregate data from multiple sources and provide personalized negotiation strategies based on your role, experience, and market conditions.',
      commonQuestions: [
        'How accurate is the salary data?',
        'How often is data updated?',
        'Can it help with benefit negotiations?',
        'What factors are considered?'
      ]
    },
    
    'Career Coaching': {
      description: 'Personalized development with 68% advancement rate',
      benefits: [
        '68% career advancement rate',
        'Personalized development plans',
        'Skill gap analysis',
        'Industry trend insights',
        'Mentorship matching',
        'Career transition support'
      ],
      howItWorks: 'Our AI analyzes your career goals, skills, and market trends to create personalized development plans and match you with relevant opportunities.',
      commonQuestions: [
        'How does career coaching work?',
        'What is the advancement rate?',
        'Can it help with career transitions?',
        'How does mentorship matching work?'
      ]
    },
    
    'Job Alerts': {
      description: 'Predictive alerts with 67% early opportunity identification',
      benefits: [
        '67% early opportunity identification',
        'Natural language alert setup',
        'Multi-channel notifications',
        'Market intelligence integration',
        'Performance analytics',
        'Relevance optimization'
      ],
      howItWorks: 'Our system uses predictive algorithms to identify opportunities before they become widely available and sends personalized alerts.',
      commonQuestions: [
        'How early can alerts identify opportunities?',
        'What notification channels are available?',
        'How do I customize alerts?',
        'Can alerts learn from my preferences?'
      ]
    },
    
    'One-Click Apply': {
      description: 'Automation with 91% quality maintenance',
      benefits: [
        '91% quality maintenance rate',
        'Intelligent personalization',
        'Quality control processes',
        'Human oversight options',
        'Strategic timing optimization',
        'Success rate tracking'
      ],
      howItWorks: 'Our automation engine personalizes each application while maintaining quality through AI-powered customization and human oversight.',
      commonQuestions: [
        'How does automation maintain quality?',
        'Can I review before submission?',
        'What personalization is included?',
        'How does strategic timing work?'
      ]
    },
    
    'Company Intelligence': {
      description: 'Multi-source insights with 96% accuracy',
      benefits: [
        '96% data accuracy',
        'Culture analysis',
        'Leadership assessment',
        'Growth prediction',
        'Competitive intelligence',
        'Real-time monitoring'
      ],
      howItWorks: 'We aggregate data from multiple sources to provide comprehensive company insights including culture, leadership, and growth prospects.',
      commonQuestions: [
        'What data sources are used?',
        'How accurate are the insights?',
        'Can it predict company stability?',
        'How often is data updated?'
      ]
    }
  },
  
  troubleshooting: {
    'login_issues': 'If you\'re having trouble logging in, try resetting your password or clearing your browser cache. You can also try logging in from a different browser or device.',
    'resume_upload': 'We support PDF, DOCX, DOC, TXT, and RTF formats. Make sure your file is under 10MB and doesn\'t contain any corrupted data.',
    'job_search_not_working': 'Try refreshing the page or checking your internet connection. If the issue persists, our job search engine might be undergoing maintenance.',
    'ats_score_low': 'A low ATS score usually indicates missing keywords or formatting issues. Try our resume optimization tool for specific suggestions.',
    'interview_feedback': 'If you\'re not getting expected interview feedback, ensure your microphone is working and you\'re speaking clearly. Try practicing with shorter responses first.'
  },
  
  pricing: {
    free: {
      name: 'Free Plan',
      price: '$0/month',
      features: [
        'Basic job search',
        'Limited resume optimization',
        'Basic interview preparation',
        'Standard support'
      ]
    },
    professional: {
      name: 'Professional Plan',
      price: '$19/month',
      features: [
        'Unlimited job search',
        'Advanced resume optimization',
        'Complete interview coaching',
        'Application tracking',
        'Salary intelligence',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: '$49/month',
      features: [
        'All Professional features',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager',
        'White-label options',
        '24/7 support'
      ]
    }
  }
};

// Intent recognition patterns
const intentPatterns = {
  feature_inquiry: [
    'how does', 'what is', 'tell me about', 'explain', 'describe'
  ],
  troubleshooting: [
    'not working', 'broken', 'error', 'issue', 'problem', 'help'
  ],
  getting_started: [
    'how to start', 'get started', 'begin', 'setup', 'onboarding'
  ],
  pricing: [
    'cost', 'price', 'plan', 'subscription', 'billing', 'payment'
  ],
  comparison: [
    'vs', 'versus', 'compared to', 'difference', 'better than'
  ]
};

// AI Chatbot Service
class SmartJobFitChatbot {
  private model: any;
  private conversationTimeoutMs = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch (error) {
      console.error('Failed to initialize Gemini model:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      if (patterns.some(pattern => lowerMessage.includes(pattern))) {
        return intent;
      }
    }
    
    return 'general_inquiry';
  }

  private getContextualKnowledge(intent: string, message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific feature mentions
    for (const [featureName, featureData] of Object.entries(knowledgeBase.features)) {
      if (lowerMessage.includes(featureName.toLowerCase()) || 
          lowerMessage.includes(featureName.replace(/[- ]/g, '').toLowerCase())) {
        return JSON.stringify({
          feature: featureName,
          data: featureData,
          platform: knowledgeBase.platform
        });
      }
    }
    
    // Check for troubleshooting
    if (intent === 'troubleshooting') {
      return JSON.stringify({
        troubleshooting: knowledgeBase.troubleshooting,
        platform: knowledgeBase.platform
      });
    }
    
    // Check for pricing
    if (intent === 'pricing') {
      return JSON.stringify({
        pricing: knowledgeBase.pricing,
        platform: knowledgeBase.platform
      });
    }
    
    // Default to general platform knowledge
    return JSON.stringify({
      platform: knowledgeBase.platform,
      features: Object.keys(knowledgeBase.features)
    });
  }

  private async generateResponse(message: string, context: ConversationContext): Promise<ChatbotResponse> {
    if (!this.model) {
      return this.getFallbackResponse(message, context);
    }

    try {
      const intent = this.detectIntent(message);
      const knowledge = this.getContextualKnowledge(intent, message);
      
      const systemPrompt = `You are SmartJobFit Assistant, an intelligent chatbot for an AI-powered job search platform. 

Your personality:
- Professional but friendly and approachable
- Knowledgeable about all platform features
- Helpful and solution-oriented
- Concise but thorough in explanations
- Proactive in offering related assistance

Platform Knowledge:
${knowledge}

User Context:
- User ID: ${context.userId}
- Communication Style: ${context.preferences?.communicationStyle || 'professional'}
- Expertise Level: ${context.preferences?.expertiseLevel || 'intermediate'}
- Current Feature: ${context.currentFeature || 'general'}
- Recent Messages: ${context.messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')}

Guidelines:
1. Always stay in character as SmartJobFit Assistant
2. Provide accurate information based on the knowledge base
3. If you don't know something, admit it and offer to escalate
4. Suggest relevant features and actions when appropriate
5. Keep responses concise but comprehensive
6. Use the user's preferred communication style
7. Offer specific next steps or actions when possible

Respond to the user's message with helpful, accurate information about SmartJobFit.`;

      const result = await this.model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Message: ${message}` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });

      const response = await result.response;
      const responseText = response.text();

      // Extract suggested actions and related features
      const suggestedActions = this.extractSuggestedActions(responseText, intent);
      const relatedFeatures = this.extractRelatedFeatures(message, intent);

      return {
        message: responseText,
        confidence: 0.9,
        suggestedActions,
        relatedFeatures,
        escalateToHuman: intent === 'troubleshooting' && message.includes('still not working'),
        conversationContext: {
          intent,
          lastFeature: this.extractFeatureFromMessage(message)
        }
      };

    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.getFallbackResponse(message, context);
    }
  }

  private getFallbackResponse(message: string, context: ConversationContext): ChatbotResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('job search')) {
      return {
        message: "I'd be happy to help you with job search! SmartJobFit's AI-powered job search uses advanced algorithms to match you with relevant opportunities from 15+ job boards. You can search using natural language and get 94% accurate matches. Would you like me to explain how it works or help you get started?",
        confidence: 0.8,
        suggestedActions: ['Learn about job search', 'Start searching for jobs', 'Set up job alerts'],
        relatedFeatures: ['AI-Powered Job Search', 'Job Alerts']
      };
    }
    
    if (lowerMessage.includes('resume')) {
      return {
        message: "Our resume optimization tool can help you create an ATS-friendly resume with 99.8% compatibility. It analyzes your resume content and provides specific suggestions for improvement. Would you like to upload your resume for analysis?",
        confidence: 0.8,
        suggestedActions: ['Upload resume', 'Learn about ATS optimization', 'View resume tips'],
        relatedFeatures: ['Resume Optimization']
      };
    }
    
    if (lowerMessage.includes('interview')) {
      return {
        message: "Our AI interview coach can help you prepare for interviews with personalized feedback and practice sessions. It supports multiple languages and provides speech analysis. Would you like to start practicing?",
        confidence: 0.8,
        suggestedActions: ['Start interview practice', 'Learn about interview prep', 'View success stories'],
        relatedFeatures: ['Interview Preparation']
      };
    }
    
    return {
      message: "I'm here to help you with SmartJobFit! I can assist with job search, resume optimization, interview preparation, application tracking, salary intelligence, and more. What specific area would you like help with?",
      confidence: 0.6,
      suggestedActions: ['Explore features', 'Get started guide', 'Contact support'],
      relatedFeatures: ['AI-Powered Job Search', 'Resume Optimization', 'Interview Preparation']
    };
  }

  private extractSuggestedActions(response: string, intent: string): string[] {
    const actions = [];
    
    switch (intent) {
      case 'feature_inquiry':
        actions.push('Try this feature', 'Learn more', 'View tutorial');
        break;
      case 'troubleshooting':
        actions.push('Try solution', 'Contact support', 'View help docs');
        break;
      case 'getting_started':
        actions.push('Start onboarding', 'Upload resume', 'Explore features');
        break;
      case 'pricing':
        actions.push('View plans', 'Start free trial', 'Contact sales');
        break;
      default:
        actions.push('Learn more', 'Get started', 'Contact support');
    }
    
    return actions;
  }

  private extractRelatedFeatures(message: string, intent: string): string[] {
    const features = [];
    const lowerMessage = message.toLowerCase();
    
    // Check for feature mentions
    for (const featureName of Object.keys(knowledgeBase.features)) {
      if (lowerMessage.includes(featureName.toLowerCase()) || 
          lowerMessage.includes(featureName.replace(/[- ]/g, '').toLowerCase())) {
        features.push(featureName);
      }
    }
    
    // Add related features based on intent
    if (intent === 'getting_started') {
      features.push('AI-Powered Job Search', 'Resume Optimization');
    }
    
    return features.slice(0, 3); // Limit to 3 related features
  }

  private extractFeatureFromMessage(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    
    for (const featureName of Object.keys(knowledgeBase.features)) {
      if (lowerMessage.includes(featureName.toLowerCase()) || 
          lowerMessage.includes(featureName.replace(/[- ]/g, '').toLowerCase())) {
        return featureName;
      }
    }
    
    return null;
  }

  public async processMessage(
    userId: string,
    message: string,
    sessionId?: string,
    userProfile?: any
  ): Promise<{ response: ChatbotResponse; sessionId: string }> {
    
    // Get or create conversation context
    const actualSessionId = sessionId || this.generateSessionId();
    let context = conversations.get(actualSessionId);
    
    if (!context) {
      context = {
        userId,
        sessionId: actualSessionId,
        messages: [],
        userProfile,
        lastActivity: new Date(),
        preferences: {
          communicationStyle: 'professional',
          expertiseLevel: 'intermediate',
          preferredLanguage: 'en'
        }
      };
      conversations.set(actualSessionId, context);
    }
    
    // Update last activity
    context.lastActivity = new Date();
    
    // Add user message to context
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    context.messages.push(userMessage);
    
    // Generate response
    const response = await this.generateResponse(message, context);
    
    // Add assistant response to context
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      metadata: {
        intent: response.conversationContext?.intent,
        confidence: response.confidence,
        suggestedActions: response.suggestedActions,
        relatedFeatures: response.relatedFeatures
      }
    };
    context.messages.push(assistantMessage);
    
    // Update context with response metadata
    if (response.conversationContext) {
      context.currentFeature = response.conversationContext.lastFeature || context.currentFeature;
    }
    
    // Clean up old conversations
    this.cleanupOldConversations();
    
    return { response, sessionId: actualSessionId };
  }

  private cleanupOldConversations() {
    const now = new Date();
    
    for (const [sessionId, context] of conversations.entries()) {
      if (now.getTime() - context.lastActivity.getTime() > this.conversationTimeoutMs) {
        conversations.delete(sessionId);
      }
    }
  }

  public getConversationHistory(sessionId: string): ChatMessage[] {
    const context = conversations.get(sessionId);
    return context ? context.messages : [];
  }

  public updateUserPreferences(sessionId: string, preferences: any) {
    const context = conversations.get(sessionId);
    if (context) {
      context.preferences = { ...context.preferences, ...preferences };
    }
  }
}

// Initialize chatbot service
const chatbotService = new SmartJobFitChatbot();

// API Routes
export async function processMessage(req: Request, res: Response) {
  try {
    const { message, sessionId, userProfile } = req.body;
    const userId = req.user?.id || 'anonymous';
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    const result = await chatbotService.processMessage(
      userId,
      message.trim(),
      sessionId,
      userProfile
    );
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error processing chatbot message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
}

export async function getConversationHistory(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }
    
    const history = chatbotService.getConversationHistory(sessionId);
    
    res.json({
      success: true,
      data: {
        sessionId,
        messages: history,
        total: history.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history'
    });
  }
}

export async function submitFeedback(req: Request, res: Response) {
  try {
    const { sessionId, messageId, rating, feedback } = req.body;
    
    if (!sessionId || !messageId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Session ID, message ID, and rating are required'
      });
    }
    
    // In a real implementation, you would store this in a database
    console.log('Chatbot feedback received:', {
      sessionId,
      messageId,
      rating,
      feedback,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
    
  } catch (error) {
    console.error('Error submitting chatbot feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
}

export async function getSuggestions(req: Request, res: Response) {
  try {
    const { sessionId, currentFeature } = req.query;
    
    // Get proactive suggestions based on context
    const suggestions = [
      {
        type: 'feature_discovery',
        title: 'Try Resume Optimization',
        description: 'Get your resume ATS-ready with 99.8% compatibility',
        action: 'Go to Resume Optimizer',
        href: '/resume-optimizer'
      },
      {
        type: 'tip',
        title: 'Improve Your Job Search',
        description: 'Use natural language to find better job matches',
        action: 'Learn More',
        href: '/job-search-engine'
      },
      {
        type: 'optimization',
        title: 'Practice Interview Skills',
        description: 'Boost your confidence with AI-powered coaching',
        action: 'Start Practice',
        href: '/interview-coach'
      }
    ];
    
    res.json({
      success: true,
      data: suggestions
    });
    
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
}

export async function escalateToHuman(req: Request, res: Response) {
  try {
    const { sessionId, reason, urgency } = req.body;
    
    if (!sessionId || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and reason are required'
      });
    }
    
    // In a real implementation, this would create a support ticket
    const escalationId = `escalation_${Date.now()}`;
    
    console.log('Escalation to human support:', {
      escalationId,
      sessionId,
      reason,
      urgency: urgency || 'medium',
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      data: {
        escalationId,
        message: 'Your request has been escalated to human support. A team member will contact you shortly.',
        estimatedWaitTime: urgency === 'high' ? '5-10 minutes' : '30-60 minutes'
      }
    });
    
  } catch (error) {
    console.error('Error escalating to human support:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to escalate to human support'
    });
  }
}

export async function updatePreferences(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const preferences = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }
    
    chatbotService.updateUserPreferences(sessionId, preferences);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
}

export async function getChatbotAnalytics(req: Request, res: Response) {
  try {
    // In a real implementation, this would fetch analytics from a database
    const analytics = {
      totalConversations: conversations.size,
      activeConversations: Array.from(conversations.values()).filter(
        c => Date.now() - c.lastActivity.getTime() < 5 * 60 * 1000
      ).length,
      averageSessionLength: 8.5,
      topIntents: [
        { intent: 'feature_inquiry', count: 245 },
        { intent: 'getting_started', count: 189 },
        { intent: 'troubleshooting', count: 156 },
        { intent: 'pricing', count: 123 }
      ],
      satisfactionRate: 0.92,
      escalationRate: 0.14,
      responseTime: 1.8
    };
    
    res.json({
      success: true,
      data: analytics
    });
    
  } catch (error) {
    console.error('Error fetching chatbot analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
}