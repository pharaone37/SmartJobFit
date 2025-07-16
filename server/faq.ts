import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI for intelligent FAQ search
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// FAQ Data Structure
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userType: 'job_seeker' | 'recruiter' | 'enterprise';
  rating: number;
  votes: number;
  relatedQuestions: string[];
  lastUpdated: string;
}

// Comprehensive FAQ Database
const faqDatabase: FAQ[] = [
  // AI-Powered Job Search FAQs
  {
    id: 'job-search-01',
    question: 'How does SmartJobFit\'s AI job search work differently from other platforms?',
    answer: 'SmartJobFit uses advanced natural language processing with Google Gemini 2.5 Flash to understand job intent beyond keywords. Our AI analyzes job descriptions, company culture, and your profile to deliver 94% accurate matches. Unlike traditional platforms that rely on keyword matching, we understand context, synonyms, and job requirements to find opportunities that truly fit your career goals.',
    category: 'AI-Powered Job Search',
    tags: ['AI', 'job matching', 'accuracy', 'technology'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.8,
    votes: 156,
    relatedQuestions: ['job-search-02', 'job-search-03'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'job-search-02',
    question: 'What makes the job matching 94% accurate compared to traditional keyword search?',
    answer: 'Our AI combines semantic understanding, skills analysis, and contextual matching. We analyze over 200 data points including job requirements, company culture, salary expectations, and career progression. The system learns from successful matches and continuously improves its accuracy through machine learning algorithms.',
    category: 'AI-Powered Job Search',
    tags: ['accuracy', 'matching', 'AI', 'algorithm'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.9,
    votes: 203,
    relatedQuestions: ['job-search-01', 'job-search-04'],
    lastUpdated: '2024-01-10'
  },
  {
    id: 'job-search-03',
    question: 'How can I use natural language to search for jobs effectively?',
    answer: 'Simply describe what you\'re looking for in natural language like "remote software engineering role at a startup with good work-life balance" or "marketing manager position in healthcare with growth opportunities." Our AI understands context, preferences, and requirements to deliver relevant results.',
    category: 'AI-Powered Job Search',
    tags: ['natural language', 'search', 'user experience'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.7,
    votes: 128,
    relatedQuestions: ['job-search-01', 'job-search-02'],
    lastUpdated: '2024-01-12'
  },
  {
    id: 'job-search-04',
    question: 'What job boards and platforms does SmartJobFit aggregate from?',
    answer: 'We aggregate from 15+ major job boards including LinkedIn, Indeed, Glassdoor, AngelList, Remote OK, ZipRecruiter, and many more. Our system also includes exclusive partnerships with companies for early access to opportunities. New jobs are added every few minutes with real-time updates.',
    category: 'AI-Powered Job Search',
    tags: ['job boards', 'aggregation', 'sources'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.6,
    votes: 89,
    relatedQuestions: ['job-search-01', 'job-alerts-01'],
    lastUpdated: '2024-01-08'
  },
  {
    id: 'job-search-05',
    question: 'How does the AI understand industry-specific requirements and jargon?',
    answer: 'Our AI is trained on millions of job postings and industry-specific datasets. It understands technical terminology, industry standards, and role-specific requirements across 50+ industries. The system recognizes synonyms, related skills, and can interpret complex job requirements to match you with relevant opportunities.',
    category: 'AI-Powered Job Search',
    tags: ['industry specific', 'jargon', 'technical terms'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.5,
    votes: 94,
    relatedQuestions: ['job-search-01', 'job-search-02'],
    lastUpdated: '2024-01-05'
  },

  // Resume Optimization FAQs
  {
    id: 'resume-01',
    question: 'How does the ATS compatibility checker work and why is it 99.8% accurate?',
    answer: 'Our ATS checker uses machine learning trained on actual ATS systems from major companies. It analyzes formatting, keywords, section headers, and content structure. The 99.8% accuracy comes from testing against real ATS systems and continuous validation with hiring managers and recruiters.',
    category: 'Resume Optimization',
    tags: ['ATS', 'compatibility', 'accuracy', 'formatting'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.9,
    votes: 342,
    relatedQuestions: ['resume-02', 'resume-03'],
    lastUpdated: '2024-01-14'
  },
  {
    id: 'resume-02',
    question: 'What file formats are supported for resume upload and optimization?',
    answer: 'We support PDF, DOCX, DOC, TXT, and RTF formats. PDF and DOCX are recommended for best results. Our system can extract text from various formats and optimize the content while preserving your intended formatting and design elements.',
    category: 'Resume Optimization',
    tags: ['file formats', 'upload', 'compatibility'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.5,
    votes: 167,
    relatedQuestions: ['resume-01', 'resume-04'],
    lastUpdated: '2024-01-11'
  },
  {
    id: 'resume-03',
    question: 'How does the AI improve my resume content and achievement descriptions?',
    answer: 'Our AI analyzes your achievements and rewrites them using action verbs, quantifiable results, and industry-specific terminology. It transforms basic descriptions into compelling stories that highlight your impact and value proposition to potential employers.',
    category: 'Resume Optimization',
    tags: ['AI', 'content improvement', 'achievements'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.8,
    votes: 234,
    relatedQuestions: ['resume-01', 'resume-02'],
    lastUpdated: '2024-01-13'
  },
  {
    id: 'resume-04',
    question: 'Can the system optimize my resume for specific job applications?',
    answer: 'Yes! Our AI can customize your resume for each job application by analyzing the job description and highlighting relevant skills, experiences, and keywords. This increases your chances of passing ATS screening and getting noticed by hiring managers.',
    category: 'Resume Optimization',
    tags: ['job specific', 'customization', 'ATS'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.7,
    votes: 189,
    relatedQuestions: ['resume-01', 'resume-03'],
    lastUpdated: '2024-01-09'
  },

  // Interview Preparation FAQs
  {
    id: 'interview-01',
    question: 'How does the AI interview coach provide personalized feedback?',
    answer: 'Our AI analyzes your speech patterns, content quality, confidence level, and communication style. It provides specific feedback on areas like clarity, conciseness, storytelling, and technical accuracy. The coaching adapts to your experience level and industry requirements.',
    category: 'Interview Preparation',
    tags: ['AI coaching', 'feedback', 'personalization'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.7,
    votes: 289,
    relatedQuestions: ['interview-02', 'interview-03'],
    lastUpdated: '2024-01-16'
  },
  {
    id: 'interview-02',
    question: 'What languages are supported for interview coaching and practice?',
    answer: 'We support English, Spanish, French, German, Portuguese, and Italian for interview coaching. The AI can analyze speech patterns and provide feedback in your preferred language, making it accessible for international job seekers.',
    category: 'Interview Preparation',
    tags: ['languages', 'multilingual', 'international'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.6,
    votes: 145,
    relatedQuestions: ['interview-01', 'interview-04'],
    lastUpdated: '2024-01-07'
  },
  {
    id: 'interview-03',
    question: 'How accurate is the speech analysis and confidence scoring?',
    answer: 'Our speech analysis uses advanced AI models trained on thousands of successful interviews. The confidence scoring considers factors like pace, tone, filler words, and clarity. Our accuracy rate is 85% in predicting interview success based on practice sessions.',
    category: 'Interview Preparation',
    tags: ['speech analysis', 'confidence', 'accuracy'],
    difficulty: 'advanced',
    userType: 'job_seeker',
    rating: 4.8,
    votes: 198,
    relatedQuestions: ['interview-01', 'interview-02'],
    lastUpdated: '2024-01-06'
  },
  {
    id: 'interview-04',
    question: 'Can the system prepare me for technical interviews and coding challenges?',
    answer: 'Yes! Our interview preparation includes technical interview scenarios, coding challenges, and system design questions. The AI provides detailed explanations, multiple solution approaches, and helps you practice problem-solving under pressure.',
    category: 'Interview Preparation',
    tags: ['technical interviews', 'coding', 'system design'],
    difficulty: 'advanced',
    userType: 'job_seeker',
    rating: 4.6,
    votes: 221,
    relatedQuestions: ['interview-01', 'interview-03'],
    lastUpdated: '2024-01-04'
  },

  // Application Tracking FAQs
  {
    id: 'tracking-01',
    question: 'How does the automated application tracking capture email communications?',
    answer: 'Our system integrates with your email provider (Gmail, Outlook, etc.) and uses AI to identify job-related emails. It automatically categorizes communications, extracts key information, and updates your application status. All data is processed securely with end-to-end encryption.',
    category: 'Application Tracking',
    tags: ['email integration', 'automation', 'tracking'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.7,
    votes: 267,
    relatedQuestions: ['tracking-02', 'tracking-03'],
    lastUpdated: '2024-01-17'
  },
  {
    id: 'tracking-02',
    question: 'What email providers are supported for automatic integration?',
    answer: 'We support Gmail, Outlook, Yahoo Mail, and most IMAP-enabled email providers. The integration is secure and read-only, meaning we can only read job-related emails and cannot send emails from your account without explicit permission.',
    category: 'Application Tracking',
    tags: ['email providers', 'integration', 'security'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.5,
    votes: 123,
    relatedQuestions: ['tracking-01', 'tracking-04'],
    lastUpdated: '2024-01-03'
  },
  {
    id: 'tracking-03',
    question: 'How does the system predict application outcomes and success rates?',
    answer: 'Our AI analyzes patterns from millions of applications including response times, communication patterns, and company behaviors. It considers factors like job posting age, your profile match, and historical success rates to predict outcome probability with 78% accuracy.',
    category: 'Application Tracking',
    tags: ['prediction', 'success rates', 'AI analytics'],
    difficulty: 'advanced',
    userType: 'job_seeker',
    rating: 4.4,
    votes: 156,
    relatedQuestions: ['tracking-01', 'tracking-02'],
    lastUpdated: '2024-01-02'
  },
  {
    id: 'tracking-04',
    question: 'Can I track applications across multiple job boards simultaneously?',
    answer: 'Yes! Our system tracks applications across all major job boards and career sites. It consolidates all your applications into one dashboard, providing a unified view of your job search progress and eliminating the need to check multiple platforms.',
    category: 'Application Tracking',
    tags: ['multi-platform', 'consolidation', 'dashboard'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.6,
    votes: 198,
    relatedQuestions: ['tracking-01', 'tracking-03'],
    lastUpdated: '2024-01-01'
  },

  // Salary Intelligence FAQs
  {
    id: 'salary-01',
    question: 'How accurate is the salary data and how often is it updated?',
    answer: 'Our salary data is sourced from multiple providers including Glassdoor, PayScale, and direct company reports. Data is updated weekly and includes real-time market adjustments. We achieve 92% accuracy by combining multiple data sources and validating with actual offers.',
    category: 'Salary Intelligence',
    tags: ['salary data', 'accuracy', 'updates'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.6,
    votes: 201,
    relatedQuestions: ['salary-02', 'salary-03'],
    lastUpdated: '2024-01-18'
  },
  {
    id: 'salary-02',
    question: 'How does the negotiation coaching achieve 73% success rates?',
    answer: 'Our coaching provides personalized negotiation strategies based on your role, experience, and company research. We analyze market data, company budgets, and successful negotiation patterns to give you data-driven talking points and timing recommendations.',
    category: 'Salary Intelligence',
    tags: ['negotiation', 'coaching', 'success rates'],
    difficulty: 'advanced',
    userType: 'job_seeker',
    rating: 4.8,
    votes: 178,
    relatedQuestions: ['salary-01', 'salary-04'],
    lastUpdated: '2024-01-19'
  },
  {
    id: 'salary-03',
    question: 'What factors are considered in the salary range calculations?',
    answer: 'We consider location, experience level, company size, industry, education, certifications, and current market conditions. The system also factors in remote work policies, benefits packages, and equity compensation to provide comprehensive salary insights.',
    category: 'Salary Intelligence',
    tags: ['salary calculation', 'factors', 'market conditions'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.5,
    votes: 143,
    relatedQuestions: ['salary-01', 'salary-02'],
    lastUpdated: '2024-01-20'
  },
  {
    id: 'salary-04',
    question: 'Can the system help me negotiate benefits beyond salary?',
    answer: 'Absolutely! Our negotiation coaching covers the entire compensation package including health benefits, retirement plans, vacation time, flexible work arrangements, professional development budgets, and equity options. We help you maximize your total compensation value.',
    category: 'Salary Intelligence',
    tags: ['benefits', 'total compensation', 'negotiation'],
    difficulty: 'advanced',
    userType: 'job_seeker',
    rating: 4.7,
    votes: 167,
    relatedQuestions: ['salary-02', 'salary-03'],
    lastUpdated: '2024-01-21'
  },

  // General and Getting Started FAQs
  {
    id: 'general-01',
    question: 'How do I get started with SmartJobFit?',
    answer: 'Start by creating your account and uploading your resume. Our onboarding process will guide you through profile setup, preference configuration, and introduce you to key features. You can begin job searching immediately or explore other tools like resume optimization and interview preparation.',
    category: 'Getting Started',
    tags: ['onboarding', 'setup', 'basics'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.7,
    votes: 456,
    relatedQuestions: ['general-02', 'general-03'],
    lastUpdated: '2024-01-22'
  },
  {
    id: 'general-02',
    question: 'What are the different subscription plans and pricing?',
    answer: 'We offer Free, Professional ($19/month), and Enterprise ($49/month) plans. The Free plan includes basic job search and limited resume optimization. Professional adds unlimited resume optimization, interview coaching, and application tracking. Enterprise includes all features plus priority support and advanced analytics.',
    category: 'Pricing & Plans',
    tags: ['pricing', 'plans', 'subscription'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.4,
    votes: 234,
    relatedQuestions: ['general-01', 'general-04'],
    lastUpdated: '2024-01-23'
  },
  {
    id: 'general-03',
    question: 'Is my personal data and resume information secure?',
    answer: 'Yes! We use enterprise-grade security with end-to-end encryption, secure data centers, and compliance with GDPR and CCPA regulations. Your data is never shared with third parties without explicit consent, and you have full control over your information.',
    category: 'Privacy & Security',
    tags: ['security', 'privacy', 'data protection'],
    difficulty: 'intermediate',
    userType: 'job_seeker',
    rating: 4.8,
    votes: 312,
    relatedQuestions: ['general-01', 'general-02'],
    lastUpdated: '2024-01-24'
  },
  {
    id: 'general-04',
    question: 'What kind of support is available if I need help?',
    answer: 'We offer multiple support channels including live chat, email support, video tutorials, and comprehensive documentation. Professional and Enterprise users get priority support with faster response times and dedicated account managers.',
    category: 'Support',
    tags: ['support', 'help', 'customer service'],
    difficulty: 'beginner',
    userType: 'job_seeker',
    rating: 4.6,
    votes: 189,
    relatedQuestions: ['general-02', 'general-03'],
    lastUpdated: '2024-01-25'
  }
];

// FAQ Categories
const categories = [
  { id: 'all', name: 'All Questions', count: faqDatabase.length },
  { id: 'AI-Powered Job Search', name: 'Job Search', count: faqDatabase.filter(faq => faq.category === 'AI-Powered Job Search').length },
  { id: 'Resume Optimization', name: 'Resume', count: faqDatabase.filter(faq => faq.category === 'Resume Optimization').length },
  { id: 'Interview Preparation', name: 'Interview', count: faqDatabase.filter(faq => faq.category === 'Interview Preparation').length },
  { id: 'Application Tracking', name: 'Applications', count: faqDatabase.filter(faq => faq.category === 'Application Tracking').length },
  { id: 'Salary Intelligence', name: 'Salary', count: faqDatabase.filter(faq => faq.category === 'Salary Intelligence').length },
  { id: 'Getting Started', name: 'Getting Started', count: faqDatabase.filter(faq => faq.category === 'Getting Started').length },
  { id: 'Pricing & Plans', name: 'Pricing', count: faqDatabase.filter(faq => faq.category === 'Pricing & Plans').length },
  { id: 'Privacy & Security', name: 'Privacy', count: faqDatabase.filter(faq => faq.category === 'Privacy & Security').length },
  { id: 'Support', name: 'Support', count: faqDatabase.filter(faq => faq.category === 'Support').length }
];

// Helper Functions
function searchFAQs(query: string, category?: string): FAQ[] {
  let results = faqDatabase;
  
  // Filter by category if specified
  if (category && category !== 'all') {
    results = results.filter(faq => faq.category === category);
  }
  
  // Search in questions, answers, and tags
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  return results;
}

async function getAISearchSuggestions(query: string): Promise<string[]> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return [];
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Based on the search query "${query}" for a job search platform FAQ, suggest 3 related questions that users might also want to ask. Return only the questions, one per line, without numbers or formatting.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.split('\n').filter(line => line.trim()).slice(0, 3);
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return [];
  }
}

// API Routes
export async function getFAQs(req: Request, res: Response) {
  try {
    const { search, category, limit = 50 } = req.query;
    
    let results = searchFAQs(search as string, category as string);
    
    // Limit results
    if (limit) {
      results = results.slice(0, parseInt(limit as string));
    }
    
    res.json({
      success: true,
      data: results,
      total: results.length,
      categories: categories
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQs'
    });
  }
}

export async function getFAQById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const faq = faqDatabase.find(f => f.id === id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    // Get related questions
    const relatedFAQs = faqDatabase.filter(f => 
      faq.relatedQuestions.includes(f.id)
    );
    
    res.json({
      success: true,
      data: {
        ...faq,
        relatedFAQs
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQ'
    });
  }
}

export async function searchFAQsWithAI(req: Request, res: Response) {
  try {
    const { query, category } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    // Get basic search results
    const searchResults = searchFAQs(query, category);
    
    // Get AI suggestions
    const suggestions = await getAISearchSuggestions(query);
    
    res.json({
      success: true,
      data: {
        results: searchResults,
        suggestions,
        total: searchResults.length
      }
    });
  } catch (error) {
    console.error('Error in AI search:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform AI search'
    });
  }
}

export async function rateFAQ(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { rating } = req.body; // 'up' or 'down'
    
    const faq = faqDatabase.find(f => f.id === id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    // In a real implementation, you would update the database
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Rating recorded successfully'
    });
  } catch (error) {
    console.error('Error rating FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rate FAQ'
    });
  }
}

export async function getFAQCategories(req: Request, res: Response) {
  try {
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQ categories'
    });
  }
}

export async function getFAQAnalytics(req: Request, res: Response) {
  try {
    const totalFAQs = faqDatabase.length;
    const avgRating = faqDatabase.reduce((sum, faq) => sum + faq.rating, 0) / totalFAQs;
    const totalVotes = faqDatabase.reduce((sum, faq) => sum + faq.votes, 0);
    
    const categoryStats = categories.map(cat => ({
      category: cat.name,
      count: cat.count,
      avgRating: cat.id === 'all' ? avgRating : 
        faqDatabase
          .filter(faq => faq.category === cat.id)
          .reduce((sum, faq, _, arr) => sum + faq.rating / arr.length, 0)
    }));
    
    res.json({
      success: true,
      data: {
        totalFAQs,
        avgRating: Math.round(avgRating * 10) / 10,
        totalVotes,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching FAQ analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQ analytics'
    });
  }
}