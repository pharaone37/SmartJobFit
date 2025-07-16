import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  DollarSign, 
  Award, 
  Bell, 
  Zap, 
  Building,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Star,
  Filter,
  Globe,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Users,
  Shield,
  Settings,
  Phone,
  Mail,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

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
}

const faqData: FAQ[] = [
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
    relatedQuestions: ['job-search-02', 'job-search-03']
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
    relatedQuestions: ['job-search-01', 'job-search-04']
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
    relatedQuestions: ['job-search-01', 'job-search-02']
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
    relatedQuestions: ['job-search-01', 'job-alerts-01']
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
    relatedQuestions: ['resume-02', 'resume-03']
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
    relatedQuestions: ['resume-01', 'resume-04']
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
    relatedQuestions: ['resume-01', 'resume-02']
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
    relatedQuestions: ['interview-02', 'interview-03']
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
    relatedQuestions: ['interview-01', 'interview-04']
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
    relatedQuestions: ['interview-01', 'interview-02']
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
    relatedQuestions: ['tracking-02', 'tracking-03']
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
    relatedQuestions: ['tracking-01', 'tracking-04']
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
    relatedQuestions: ['salary-02', 'salary-03']
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
    relatedQuestions: ['salary-01', 'salary-04']
  },

  // More FAQs for other categories...
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
    relatedQuestions: ['general-02', 'general-03']
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
    relatedQuestions: ['general-01', 'general-04']
  }
];

// FAQ Categories
const categories = [
  { id: 'all', name: 'All Questions', icon: HelpCircle, count: faqData.length },
  { id: 'AI-Powered Job Search', name: 'Job Search', icon: Search, count: faqData.filter(faq => faq.category === 'AI-Powered Job Search').length },
  { id: 'Resume Optimization', name: 'Resume', icon: FileText, count: faqData.filter(faq => faq.category === 'Resume Optimization').length },
  { id: 'Interview Preparation', name: 'Interview', icon: MessageCircle, count: faqData.filter(faq => faq.category === 'Interview Preparation').length },
  { id: 'Application Tracking', name: 'Applications', icon: BarChart3, count: faqData.filter(faq => faq.category === 'Application Tracking').length },
  { id: 'Salary Intelligence', name: 'Salary', icon: DollarSign, count: faqData.filter(faq => faq.category === 'Salary Intelligence').length },
  { id: 'Getting Started', name: 'Getting Started', icon: BookOpen, count: faqData.filter(faq => faq.category === 'Getting Started').length },
  { id: 'Pricing & Plans', name: 'Pricing', icon: Award, count: faqData.filter(faq => faq.category === 'Pricing & Plans').length }
];

// FAQ Search Component
const FAQSearch: React.FC<{ searchTerm: string; onSearchChange: (term: string) => void }> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularQuestions = [
    "How does AI job search work?",
    "ATS compatibility checker",
    "Interview coaching accuracy",
    "Application tracking features",
    "Salary negotiation tips"
  ];

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = faqData
        .filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5)
        .map(faq => faq.question);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search FAQs... (e.g., 'How does AI job search work?')"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              onClick={() => {
                onSearchChange(suggestion);
                setShowSuggestions(false);
              }}
            >
              <div className="flex items-center gap-2">
                <Search className="h-3 w-3 text-gray-400" />
                <span className="text-sm">{suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {searchTerm.length === 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                onClick={() => onSearchChange(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// FAQ Item Component
const FAQItem: React.FC<{ faq: FAQ; isExpanded: boolean; onToggle: () => void }> = ({ 
  faq, 
  isExpanded, 
  onToggle 
}) => {
  const [userRating, setUserRating] = useState<'up' | 'down' | null>(null);

  const handleRating = (rating: 'up' | 'down') => {
    setUserRating(rating);
    // Here you would typically send the rating to your backend
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {faq.question}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {faq.category}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {faq.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{faq.rating}</span>
                <span>({faq.votes} votes)</span>
              </div>
            </div>
          </div>
          <div className="ml-4">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Was this helpful?
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRating('up')}
                        className={userRating === 'up' ? 'bg-green-100 text-green-600' : ''}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Yes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRating('down')}
                        className={userRating === 'down' ? 'bg-red-100 text-red-600' : ''}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        No
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {faq.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

// FAQ Categories Component
const FAQCategories: React.FC<{ 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void 
}> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className="w-full justify-start h-auto py-3 px-4"
            onClick={() => onCategoryChange(category.id)}
          >
            <IconComponent className="h-4 w-4 mr-3" />
            <div className="flex-1 text-left">
              <div className="font-medium">{category.name}</div>
              <div className="text-xs text-gray-500">{category.count} questions</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

// Main FAQ Page Component
const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>(faqData);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  useEffect(() => {
    let filtered = faqData;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredFAQs(filtered);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium mb-4">
            💡 Help Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about SmartJobFit's AI-powered job search platform
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <FAQSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <FAQCategories 
                  selectedCategory={selectedCategory} 
                  onCategoryChange={setSelectedCategory} 
                />
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isExpanded={expandedItems.has(faq.id)}
                    onToggle={() => toggleExpanded(faq.id)}
                  />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No questions found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Try adjusting your search terms or browse different categories
                    </p>
                    <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;