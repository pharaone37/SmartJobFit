import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini model for interview coaching
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: string;
  category: string;
  tips: string[];
  expectedAnswer?: string;
  followUpQuestions?: string[];
  companySpecific?: boolean;
  timeLimit?: number;
}

interface CompanyProfile {
  name: string;
  industry: string;
  size: string;
  culture: string[];
  values: string[];
  interviewProcess: string[];
  commonQuestions: string[];
  difficulty: string;
}

interface AICoachingSession {
  id: string;
  type: 'mock' | 'behavioral' | 'technical' | 'case-study' | 'group';
  duration: number;
  questions: InterviewQuestion[];
  performance: any[];
  overallScore: number;
  recommendations: string[];
  nextSteps: string[];
}

// Generate interview questions based on job description and preferences
export async function generateInterviewQuestions(req: Request, res: Response) {
  try {
    const {
      jobDescription,
      experienceLevel,
      category,
      interviewType,
      companyName,
      companyType
    } = req.body;

    if (!jobDescription || !experienceLevel || !category || !interviewType) {
      return res.status(400).json({
        error: 'Missing required fields: jobDescription, experienceLevel, category, interviewType'
      });
    }

    // Use AI to generate contextual questions or fallback to structured examples
    let questions: InterviewQuestion[] = [];
    let preparationTips: string[] = [];
    let companyInsights: any = null;

    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `
          Generate 8-12 interview questions for the following position:
          
          Job Description: ${jobDescription}
          Experience Level: ${experienceLevel}
          Question Category: ${category}
          Interview Type: ${interviewType}
          Company: ${companyName || 'General'}
          Company Type: ${companyType || 'General'}
          
          For each question, provide:
          1. The question text
          2. Difficulty level (easy, medium, hard)
          3. Category (technical, behavioral, situational, leadership, culture)
          4. 3-4 specific tips for answering
          5. Expected answer outline (optional)
          6. Follow-up questions (optional)
          
          Also provide:
          - General preparation tips
          - Company-specific insights (if company provided)
          
          Format as JSON with this structure:
          {
            "questions": [
              {
                "id": "unique_id",
                "question": "question text",
                "difficulty": "easy|medium|hard",
                "category": "category",
                "tips": ["tip1", "tip2", "tip3"],
                "expectedAnswer": "brief outline",
                "followUpQuestions": ["followup1", "followup2"],
                "companySpecific": true/false,
                "timeLimit": 300
              }
            ],
            "preparationTips": ["general tip1", "general tip2"],
            "companyInsights": {
              "culture": ["culture1", "culture2"],
              "values": ["value1", "value2"],
              "interviewProcess": ["step1", "step2"]
            }
          }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse AI response
        const aiResponse = JSON.parse(text);
        questions = aiResponse.questions || [];
        preparationTips = aiResponse.preparationTips || [];
        companyInsights = aiResponse.companyInsights || null;
        
        // Add IDs if missing
        questions = questions.map((q, index) => ({
          ...q,
          id: q.id || `q_${Date.now()}_${index}`
        }));
        
      } else {
        // Fallback to structured examples
        questions = generateFallbackQuestions(category, interviewType, experienceLevel);
        preparationTips = getFallbackPreparationTips(category, interviewType);
      }
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      questions = generateFallbackQuestions(category, interviewType, experienceLevel);
      preparationTips = getFallbackPreparationTips(category, interviewType);
    }

    const response = {
      questions,
      totalQuestions: questions.length,
      estimatedTime: questions.length * 5, // 5 minutes per question
      preparationTips,
      companyInsights
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
}

// Research company for interview preparation
export async function researchCompany(req: Request, res: Response) {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    let companyProfile: CompanyProfile;

    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `
          Research the company "${companyName}" and provide comprehensive interview preparation insights.
          
          Provide information about:
          1. Industry and company size
          2. Company culture and values
          3. Interview process and typical stages
          4. Common interview questions asked
          5. Interview difficulty level
          6. Recent news or developments
          7. Leadership and management style
          8. Work environment and employee satisfaction
          
          Format as JSON:
          {
            "name": "company name",
            "industry": "industry",
            "size": "startup|small|medium|large|enterprise",
            "culture": ["culture aspect 1", "culture aspect 2"],
            "values": ["value 1", "value 2"],
            "interviewProcess": ["stage 1", "stage 2", "stage 3"],
            "commonQuestions": ["question 1", "question 2"],
            "difficulty": "easy|medium|hard"
          }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        companyProfile = JSON.parse(text);
      } else {
        // Fallback company profile
        companyProfile = {
          name: companyName,
          industry: 'Technology',
          size: 'medium',
          culture: ['Innovation-focused', 'Collaborative', 'Fast-paced', 'Growth-oriented'],
          values: ['Customer-first', 'Transparency', 'Excellence', 'Teamwork'],
          interviewProcess: [
            'Initial phone screening (30 min)',
            'Technical assessment or case study',
            'Virtual interview with hiring manager',
            'Final interview with team members',
            'Reference checks and offer'
          ],
          commonQuestions: [
            'Why do you want to work at our company?',
            'Tell me about a challenging project you worked on',
            'How do you handle working under pressure?',
            'Where do you see yourself in 5 years?',
            'What interests you most about this role?'
          ],
          difficulty: 'medium'
        };
      }
    } catch (error) {
      console.error('Company research failed, using fallback:', error);
      companyProfile = {
        name: companyName,
        industry: 'Technology',
        size: 'medium',
        culture: ['Innovation-focused', 'Collaborative', 'Fast-paced'],
        values: ['Customer-first', 'Transparency', 'Excellence'],
        interviewProcess: [
          'Initial phone screening',
          'Technical assessment',
          'Manager interview',
          'Final interview'
        ],
        commonQuestions: [
          'Why do you want to work here?',
          'Tell me about yourself',
          'What are your strengths?'
        ],
        difficulty: 'medium'
      };
    }

    res.json(companyProfile);
  } catch (error) {
    console.error('Error researching company:', error);
    res.status(500).json({ error: 'Failed to research company' });
  }
}

// Start AI coaching session
export async function startAICoaching(req: Request, res: Response) {
  try {
    const { interviewType, jobDescription, experienceLevel, companyProfile } = req.body;

    if (!interviewType || !jobDescription || !experienceLevel) {
      return res.status(400).json({
        error: 'Missing required fields: interviewType, jobDescription, experienceLevel'
      });
    }

    // Generate AI coaching session
    const coachingSession: AICoachingSession = {
      id: `coaching_${Date.now()}`,
      type: interviewType as any,
      duration: 60,
      questions: [],
      performance: [],
      overallScore: 0,
      recommendations: [
        'Practice the STAR method for behavioral questions',
        'Research the company thoroughly before the interview',
        'Prepare specific examples that demonstrate your skills',
        'Practice your elevator pitch and key accomplishments',
        'Prepare thoughtful questions to ask the interviewer'
      ],
      nextSteps: [
        'Complete a mock interview session',
        'Review your answers and improve weak areas',
        'Practice with video recording to improve presentation',
        'Research recent company news and developments',
        'Prepare for technical questions specific to your role'
      ]
    };

    // Customize recommendations based on interview type
    if (interviewType === 'technical') {
      coachingSession.recommendations = [
        'Review fundamental technical concepts for your role',
        'Practice coding problems and system design',
        'Prepare to explain your technical decisions',
        'Study the company\'s technology stack',
        'Practice whiteboarding and problem-solving out loud'
      ];
    } else if (interviewType === 'behavioral') {
      coachingSession.recommendations = [
        'Master the STAR method (Situation, Task, Action, Result)',
        'Prepare 5-7 detailed examples of your accomplishments',
        'Practice storytelling and clear communication',
        'Prepare examples of challenges and how you overcame them',
        'Show leadership and teamwork experiences'
      ];
    }

    res.json(coachingSession);
  } catch (error) {
    console.error('Error starting AI coaching:', error);
    res.status(500).json({ error: 'Failed to start AI coaching session' });
  }
}

// Analyze interview performance
export async function analyzeInterviewPerformance(req: Request, res: Response) {
  try {
    const { question, userAnswer, correctAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({
        error: 'Missing required fields: question, userAnswer'
      });
    }

    let performance: any;

    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `
          Analyze this interview response and provide detailed feedback:
          
          Question: ${question}
          User Answer: ${userAnswer}
          ${correctAnswer ? `Expected Answer: ${correctAnswer}` : ''}
          
          Provide analysis including:
          1. Overall score (0-100)
          2. Detailed feedback
          3. Strengths demonstrated
          4. Areas for improvement
          5. Key points covered
          6. Missed opportunities
          7. Overall assessment
          8. Confidence level (0-100)
          9. Communication score (0-100)
          10. Technical score (0-100)
          11. Cultural fit score (0-100)
          
          Format as JSON:
          {
            "score": 85,
            "feedback": "detailed feedback",
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"],
            "keyPoints": ["point1", "point2"],
            "missedPoints": ["missed1", "missed2"],
            "overall": "overall assessment",
            "confidenceLevel": 80,
            "communicationScore": 90,
            "technicalScore": 85,
            "culturalFitScore": 75
          }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        performance = JSON.parse(text);
      } else {
        // Fallback analysis
        performance = {
          score: 75,
          feedback: 'Good response with clear structure. Consider providing more specific examples and quantifiable results.',
          strengths: ['Clear communication', 'Structured approach', 'Relevant experience'],
          improvements: ['Add more specific examples', 'Include quantifiable results', 'Show more enthusiasm'],
          keyPoints: ['Addressed main question', 'Provided context', 'Showed problem-solving'],
          missedPoints: ['Could have mentioned teamwork', 'Missed opportunity to show leadership'],
          overall: 'Solid response that demonstrates competence. With more specific examples and enthusiasm, this could be an excellent answer.',
          confidenceLevel: 70,
          communicationScore: 80,
          technicalScore: 75,
          culturalFitScore: 70
        };
      }
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      performance = {
        score: 75,
        feedback: 'Your response shows good understanding. Consider adding more specific examples.',
        strengths: ['Clear communication', 'Relevant experience'],
        improvements: ['Add specific examples', 'Show more enthusiasm'],
        keyPoints: ['Addressed the question', 'Provided context'],
        missedPoints: ['Could have been more specific'],
        overall: 'Good response with room for improvement.',
        confidenceLevel: 70,
        communicationScore: 80,
        technicalScore: 75,
        culturalFitScore: 70
      };
    }

    res.json(performance);
  } catch (error) {
    console.error('Error analyzing interview performance:', error);
    res.status(500).json({ error: 'Failed to analyze interview performance' });
  }
}

// Helper function to generate fallback questions
function generateFallbackQuestions(category: string, interviewType: string, experienceLevel: string): InterviewQuestion[] {
  const baseQuestions: InterviewQuestion[] = [
    {
      id: 'q1',
      question: 'Tell me about yourself and your background.',
      difficulty: 'easy',
      category: 'behavioral',
      tips: [
        'Keep it professional and relevant to the job',
        'Follow a chronological structure',
        'Highlight key achievements and skills',
        'End with why you\'re interested in this role'
      ],
      timeLimit: 180
    },
    {
      id: 'q2',
      question: 'Why are you interested in this position?',
      difficulty: 'easy',
      category: 'behavioral',
      tips: [
        'Show you\'ve researched the company',
        'Connect your skills to the role requirements',
        'Demonstrate enthusiasm and motivation',
        'Mention specific aspects that excite you'
      ],
      timeLimit: 120
    },
    {
      id: 'q3',
      question: 'Describe a challenging situation you faced and how you handled it.',
      difficulty: 'medium',
      category: 'behavioral',
      tips: [
        'Use the STAR method (Situation, Task, Action, Result)',
        'Choose a relevant professional example',
        'Focus on your problem-solving process',
        'Highlight the positive outcome'
      ],
      timeLimit: 300
    },
    {
      id: 'q4',
      question: 'What are your greatest strengths?',
      difficulty: 'easy',
      category: 'behavioral',
      tips: [
        'Choose strengths relevant to the job',
        'Provide specific examples',
        'Show how your strengths benefit the team',
        'Be authentic and confident'
      ],
      timeLimit: 120
    },
    {
      id: 'q5',
      question: 'Where do you see yourself in 5 years?',
      difficulty: 'medium',
      category: 'behavioral',
      tips: [
        'Show ambition but be realistic',
        'Align your goals with the company\'s growth',
        'Demonstrate commitment to professional development',
        'Avoid mentioning other companies or roles'
      ],
      timeLimit: 120
    }
  ];

  // Add category-specific questions
  if (category === 'technical') {
    baseQuestions.push({
      id: 'q6',
      question: 'Explain a complex technical concept in simple terms.',
      difficulty: 'hard',
      category: 'technical',
      tips: [
        'Choose a concept you know well',
        'Use analogies and simple language',
        'Check if the interviewer understands',
        'Show your communication skills'
      ],
      timeLimit: 240
    });
  }

  if (category === 'leadership') {
    baseQuestions.push({
      id: 'q7',
      question: 'Describe a time when you had to lead a team through a difficult situation.',
      difficulty: 'hard',
      category: 'leadership',
      tips: [
        'Show your leadership style',
        'Highlight team motivation techniques',
        'Demonstrate conflict resolution',
        'Focus on team success over individual achievement'
      ],
      timeLimit: 300
    });
  }

  return baseQuestions;
}

// Helper function to get fallback preparation tips
function getFallbackPreparationTips(category: string, interviewType: string): string[] {
  const baseTips = [
    'Research the company thoroughly',
    'Practice your elevator pitch',
    'Prepare specific examples using the STAR method',
    'Prepare thoughtful questions to ask the interviewer',
    'Review your resume and be ready to discuss each point'
  ];

  if (category === 'technical') {
    baseTips.push(
      'Review fundamental technical concepts',
      'Practice coding problems',
      'Prepare to explain your technical decisions'
    );
  }

  if (interviewType === 'behavioral') {
    baseTips.push(
      'Prepare 5-7 detailed examples of accomplishments',
      'Practice storytelling and clear communication',
      'Prepare examples of challenges and solutions'
    );
  }

  return baseTips;
}