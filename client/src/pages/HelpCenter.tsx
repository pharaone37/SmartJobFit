import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Video,
  FileText,
  Users,
  Settings,
  CreditCard,
  Shield,
  Zap,
  HelpCircle,
  Bot,
  ChevronRight,
  Clock,
  Star,
  Send,
  X,
  Minimize2,
  Maximize2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Phone,
  Mail,
  Globe,
  Smartphone,
  Briefcase,
  Target,
  TrendingUp,
  Award,
  Lock,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  Filter,
  SortAsc,
  Calendar,
  DollarSign,
  BarChart
} from 'lucide-react';

// AI Chatbot Component
function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi! I'm your AI assistant. I can help you with questions about SmartJobFit, billing, technical issues, and more. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    "How do I optimize my resume?",
    "What's included in the Professional plan?",
    "How do I cancel my subscription?",
    "Why aren't I getting job matches?",
    "How does the AI interview prep work?",
    "I need help with billing"
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const newMessage = { 
      id: messages.length + 1, 
      text: message, 
      sender: 'user' as const 
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: botResponse, 
        sender: 'bot' as const 
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (message: string) => {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('resume') || lowercaseMessage.includes('cv')) {
      return "Great question! Our AI resume optimizer analyzes your CV for ATS compatibility and suggests improvements. Go to Dashboard → Resume Optimizer to upload your resume. Our AI will check for keywords, formatting, and structure to help you get more interviews. Would you like me to guide you through the process?";
    } else if (lowercaseMessage.includes('billing') || lowercaseMessage.includes('subscription') || lowercaseMessage.includes('payment')) {
      return "I can help with billing questions! For subscription management, go to Settings → Billing. You can upgrade, downgrade, or cancel anytime. Need help with a specific billing issue? I can transfer you to our billing specialist or help you find the right information.";
    } else if (lowercaseMessage.includes('cancel')) {
      return "To cancel your subscription: 1) Go to Settings → Billing 2) Click 'Manage Subscription' 3) Select 'Cancel Subscription'. You'll keep access until your current billing period ends. No cancellation fees! Need help with the process?";
    } else if (lowercaseMessage.includes('job') && (lowercaseMessage.includes('match') || lowercaseMessage.includes('search'))) {
      return "Our AI job matching uses your skills, preferences, and career goals to find relevant opportunities across 15+ job boards. To improve matches: 1) Complete your profile 2) Upload an updated resume 3) Set your job preferences 4) Use specific keywords in your search. Getting poor matches? I can help troubleshoot!";
    } else if (lowercaseMessage.includes('interview')) {
      return "Our AI Interview Prep feature offers: 1) Mock interviews with industry-specific questions 2) Real-time feedback on your answers 3) Body language and speech analysis 4) Personalized improvement tips. Access it from Dashboard → Interview Prep. Want me to walk you through setting up your first mock interview?";
    } else if (lowercaseMessage.includes('professional') || lowercaseMessage.includes('plan')) {
      return "The Professional plan ($29/month) includes: unlimited AI job searches, advanced resume optimization, access to all 15+ job boards, AI interview preparation, priority support, and analytics dashboard. Want to upgrade? Go to Settings → Billing or I can help you choose the right plan for your needs.";
    } else if (lowercaseMessage.includes('help') || lowercaseMessage.includes('support')) {
      return "I'm here to help! I can assist with: account setup, job searching, resume optimization, interview prep, billing questions, technical issues, and feature explanations. What specific area would you like help with? Or choose from the quick replies below.";
    } else {
      return "I understand you're asking about: \"" + message + "\". Let me help you with that. Could you provide a bit more detail about what specific aspect you'd like to know more about? You can also browse our FAQ section below or try one of the quick reply options.";
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Bot className="w-8 h-8 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border transition-all duration-300 ${
      isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto h-80">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t">
            <div className="flex flex-wrap gap-2">
              {quickReplies.slice(0, 3).map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(reply)}
                  className="text-xs"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                className="flex-1"
              />
              <Button onClick={() => handleSendMessage(inputMessage)} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Comprehensive FAQ data for SEO optimization
  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create my SmartJobFit account?',
          answer: 'Creating your account is simple! Click "Sign Up" on our homepage, enter your email and password, then verify your email address. You can also sign up using your Google or LinkedIn account for faster access. Once verified, you\'ll be guided through setting up your profile with your skills, experience, and job preferences.',
          keywords: ['account creation', 'sign up', 'registration', 'getting started']
        },
        {
          question: 'What should I include in my profile to get better job matches?',
          answer: 'A complete profile significantly improves your job matches. Include: your current job title and experience level, key skills and technologies you use, preferred locations and remote work preferences, salary expectations, and industry preferences. The more detailed your profile, the better our AI can match you with relevant opportunities.',
          keywords: ['profile optimization', 'job matching', 'better matches', 'profile setup']
        },
        {
          question: 'How does SmartJobFit\'s AI job matching work?',
          answer: 'Our AI analyzes your profile, skills, and preferences to find relevant jobs across 15+ major job boards including LinkedIn, Indeed, Glassdoor, and more. It considers factors like your experience level, location preferences, salary expectations, and career goals. The AI learns from your interactions - jobs you save, apply to, or dismiss - to continuously improve recommendations.',
          keywords: ['AI matching', 'job matching algorithm', 'how it works', 'artificial intelligence']
        },
        {
          question: 'Can I use SmartJobFit for free?',
          answer: 'Yes! Our Free plan includes 5 AI job searches per month, basic resume optimization, access to select job boards, and email support. You can upgrade to Professional ($29/month) for unlimited searches and advanced features, or AI Career Coach ($79/month) for comprehensive career guidance and premium support.',
          keywords: ['free plan', 'pricing', 'free trial', 'cost', 'subscription']
        }
      ]
    },
    {
      category: 'Job Search & Matching',
      questions: [
        {
          question: 'Which job boards does SmartJobFit search?',
          answer: 'We search 15+ major job boards including LinkedIn, Indeed, Glassdoor, ZipRecruiter, Monster, CareerBuilder, Dice, AngelList, Stack Overflow Jobs, GitHub Jobs, Reed (UK), Xing (DACH), and Seek (Australia). Professional and AI Career Coach plans include access to all boards, while the Free plan covers select major platforms.',
          keywords: ['job boards', 'job sites', 'where jobs come from', 'sources']
        },
        {
          question: 'Why am I not getting relevant job matches?',
          answer: 'If matches aren\'t relevant, try these steps: 1) Update your profile with current skills and experience, 2) Be more specific in your job preferences, 3) Add relevant keywords to your profile, 4) Upload an updated resume, 5) Adjust your location and salary filters. Our AI improves with more data, so the more complete your profile, the better the matches.',
          keywords: ['poor matches', 'irrelevant jobs', 'bad recommendations', 'improve matching']
        },
        {
          question: 'How can I save jobs for later?',
          answer: 'Click the bookmark icon on any job listing to save it to your "Saved Jobs" section. You can access saved jobs from your dashboard at any time. This also helps our AI learn your preferences to provide better future recommendations. You can organize saved jobs by status: "Interested," "Applied," or "Interview Scheduled."',
          keywords: ['save jobs', 'bookmark jobs', 'saved jobs', 'favorites']
        },
        {
          question: 'Can I set up job alerts?',
          answer: 'Yes! Professional and AI Career Coach subscribers can create custom job alerts. Set criteria like keywords, location, salary range, and company size. You\'ll receive email notifications when new jobs match your criteria. You can create multiple alerts for different types of positions you\'re interested in.',
          keywords: ['job alerts', 'notifications', 'email alerts', 'automatic updates']
        }
      ]
    },
    {
      category: 'Resume & Application',
      questions: [
        {
          question: 'How does the AI resume optimizer work?',
          answer: 'Our AI analyzes your resume for ATS (Applicant Tracking System) compatibility, keyword optimization, and formatting. It checks against job descriptions to suggest relevant keywords, identifies missing skills, recommends improvements to structure and content, and provides an ATS compatibility score. The optimizer works with all major file formats (PDF, Word, TXT).',
          keywords: ['resume optimization', 'ATS optimization', 'resume analysis', 'keyword matching']
        },
        {
          question: 'What is ATS optimization and why is it important?',
          answer: 'ATS (Applicant Tracking System) is software that companies use to scan and filter resumes before human review. About 90% of large companies use ATS. Our optimizer ensures your resume: uses ATS-friendly formatting, includes relevant keywords from job descriptions, follows proper structure and sections, and avoids elements that confuse ATS systems like images or unusual fonts.',
          keywords: ['ATS', 'applicant tracking system', 'resume scanning', 'keyword optimization']
        },
        {
          question: 'Can I create multiple versions of my resume?',
          answer: 'Yes! Professional and AI Career Coach subscribers can create multiple resume versions tailored for different types of positions. For example, one for software engineering roles and another for management positions. Each version can be optimized for specific industries or job types, helping you tailor applications more effectively.',
          keywords: ['multiple resumes', 'resume versions', 'tailored resumes', 'different roles']
        },
        {
          question: 'How do I improve my resume\'s ATS score?',
          answer: 'To improve your ATS score: 1) Use standard section headings (Experience, Education, Skills), 2) Include keywords from job descriptions, 3) Use a clean, simple format without images or tables, 4) Save as PDF or Word format, 5) Include relevant skills and certifications, 6) Use bullet points for accomplishments, 7) Avoid headers/footers with important information.',
          keywords: ['improve ATS score', 'resume tips', 'ATS friendly resume', 'resume formatting']
        }
      ]
    },
    {
      category: 'Interview Preparation',
      questions: [
        {
          question: 'How does AI interview preparation work?',
          answer: 'Our AI interview prep includes: 1) Mock interviews with industry-specific questions, 2) Real-time feedback on your answers, 3) Analysis of speech patterns, pace, and confidence, 4) Personalized improvement suggestions, 5) Practice with common behavioral and technical questions, 6) Recording and playback capabilities to review your performance.',
          keywords: ['interview prep', 'mock interviews', 'AI interview', 'interview practice']
        },
        {
          question: 'What types of interview questions are covered?',
          answer: 'Our database includes: Behavioral questions (teamwork, leadership, problem-solving), Technical questions by industry and role, Company-specific questions for major employers, Situational judgment questions, Industry-specific scenarios, Common questions for different experience levels (entry, mid, senior), and Questions tailored to specific job descriptions.',
          keywords: ['interview questions', 'behavioral questions', 'technical questions', 'question types']
        },
        {
          question: 'Can I practice interviews in different languages?',
          answer: 'Yes! Our AI interview prep supports multiple languages including English, Spanish, French, German, Italian, Portuguese, and more. You can practice interview questions and receive feedback in your preferred language. This is particularly helpful for international job seekers or those applying to multinational companies.',
          keywords: ['multilingual interviews', 'interview languages', 'non-english interviews', 'international']
        },
        {
          question: 'How do I prepare for technical interviews?',
          answer: 'For technical interviews: 1) Practice coding problems on our platform, 2) Review system design questions for your level, 3) Prepare for algorithm and data structure questions, 4) Practice explaining your thought process clearly, 5) Use our whiteboard simulation feature, 6) Review common technical concepts for your field, 7) Practice with industry-specific scenarios.',
          keywords: ['technical interviews', 'coding interviews', 'system design', 'algorithm questions']
        }
      ]
    },
    {
      category: 'Billing & Subscriptions',
      questions: [
        {
          question: 'How do I upgrade my subscription?',
          answer: 'To upgrade: 1) Go to Settings → Billing in your dashboard, 2) Select your desired plan (Professional or AI Career Coach), 3) Enter payment information, 4) Confirm upgrade. Changes take effect immediately, and you\'ll only pay the prorated difference for the current billing period. All premium features become available instantly.',
          keywords: ['upgrade subscription', 'billing', 'premium plans', 'payment']
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel anytime without penalties. Go to Settings → Billing → Manage Subscription → Cancel. You\'ll retain access to premium features until the end of your current billing period. No cancellation fees apply, and you can reactivate your subscription at any time. Your data and saved jobs remain accessible.',
          keywords: ['cancel subscription', 'cancellation', 'billing management', 'refund policy']
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are processed securely through Stripe with bank-level encryption. We don\'t store your payment information on our servers, ensuring maximum security for your financial data.',
          keywords: ['payment methods', 'credit cards', 'PayPal', 'secure payments']
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 7-day money-back guarantee for all new subscriptions. If you\'re not satisfied within the first 7 days, contact our support team for a full refund. After 7 days, you can cancel to avoid future charges, but we don\'t provide refunds for already-used billing periods. Special circumstances are reviewed case-by-case.',
          keywords: ['refunds', 'money back guarantee', 'refund policy', 'satisfaction guarantee']
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'Why is my resume upload failing?',
          answer: 'Resume upload issues are usually caused by: 1) File size over 10MB - compress your file, 2) Unsupported format - use PDF, Word, or TXT, 3) Corrupted file - try re-saving and uploading, 4) Browser issues - try a different browser or clear cache, 5) Poor internet connection - check your connection. If problems persist, contact our support team.',
          keywords: ['resume upload', 'file upload issues', 'technical problems', 'upload error']
        },
        {
          question: 'The job search results aren\'t loading. What should I do?',
          answer: 'If job results aren\'t loading: 1) Check your internet connection, 2) Try refreshing the page, 3) Clear your browser cache and cookies, 4) Try a different browser, 5) Check if you have ad blockers that might interfere, 6) Ensure JavaScript is enabled. If issues continue, it might be temporary server maintenance - try again in a few minutes.',
          keywords: ['job search not working', 'loading issues', 'technical problems', 'search results']
        },
        {
          question: 'How do I reset my password?',
          answer: 'To reset your password: 1) Go to the login page and click "Forgot Password," 2) Enter your email address, 3) Check your email for the reset link, 4) Click the link and create a new password, 5) Use your new password to log in. If you don\'t receive the email, check your spam folder or contact support.',
          keywords: ['password reset', 'forgot password', 'login issues', 'account access']
        },
        {
          question: 'Is my data secure on SmartJobFit?',
          answer: 'Yes, we take security seriously. Your data is protected by: bank-level encryption for all data transmission, secure servers with regular security audits, strict access controls for our team, GDPR compliance for data privacy, regular backups to prevent data loss, and no sharing of personal information with third parties without consent. We\'re SOC 2 Type II certified.',
          keywords: ['data security', 'privacy', 'encryption', 'data protection', 'GDPR']
        }
      ]
    },
    {
      category: 'Career Development',
      questions: [
        {
          question: 'How can SmartJobFit help advance my career?',
          answer: 'SmartJobFit supports career advancement through: AI-powered job matching to find growth opportunities, resume optimization to highlight your achievements, interview prep to improve your success rate, salary negotiation coaching (AI Career Coach plan), skill gap analysis to identify areas for development, and career path recommendations based on your goals and market trends.',
          keywords: ['career advancement', 'career growth', 'professional development', 'career planning']
        },
        {
          question: 'Can I use SmartJobFit for career changes?',
          answer: 'Absolutely! SmartJobFit is excellent for career transitions. We help by: identifying transferable skills from your current role, suggesting relevant jobs in your target industry, providing skill gap analysis for your desired career, offering interview prep for new industries, and connecting you with networking opportunities. Our AI adapts to your career change goals.',
          keywords: ['career change', 'career transition', 'switching careers', 'new industry']
        },
        {
          question: 'How do I negotiate salary using SmartJobFit?',
          answer: 'AI Career Coach subscribers get access to salary negotiation tools: market salary data for your role and location, personalized negotiation strategies, practice scenarios with AI coaching, email templates for salary discussions, timing advice for negotiations, and confidence-building techniques. We also provide industry-specific negotiation tips.',
          keywords: ['salary negotiation', 'salary increase', 'negotiate pay', 'compensation']
        },
        {
          question: 'Can SmartJobFit help with networking?',
          answer: 'Yes! We provide networking support through: identification of key contacts in your industry, LinkedIn optimization tips, networking event recommendations, conversation starters for professional meetings, follow-up message templates, and strategies for building meaningful professional relationships. Our AI helps you network more effectively.',
          keywords: ['networking', 'professional networking', 'career networking', 'LinkedIn']
        }
      ]
    }
  ];

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      articles: [
        { title: 'Creating Your Account', views: '2.3k', time: '3 min read' },
        { title: 'Setting Up Your Profile', views: '1.8k', time: '5 min read' },
        { title: 'Your First Job Search', views: '3.1k', time: '7 min read' },
        { title: 'Understanding AI Matching', views: '1.5k', time: '4 min read' }
      ]
    },
    {
      id: 'resume-optimization',
      title: 'Resume Optimization',
      icon: FileText,
      articles: [
        { title: 'ATS Optimization Basics', views: '4.2k', time: '8 min read' },
        { title: 'Keyword Matching Guide', views: '2.7k', time: '6 min read' },
        { title: 'Resume Templates', views: '3.5k', time: '5 min read' },
        { title: 'Common Resume Mistakes', views: '2.1k', time: '10 min read' }
      ]
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      icon: Video,
      articles: [
        { title: 'AI Mock Interview Guide', views: '3.8k', time: '12 min read' },
        { title: 'Common Interview Questions', views: '5.1k', time: '15 min read' },
        { title: 'Body Language Tips', views: '2.2k', time: '8 min read' },
        { title: 'Technical Interview Prep', views: '1.9k', time: '20 min read' }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Subscriptions',
      icon: CreditCard,
      articles: [
        { title: 'Subscription Plans Explained', views: '1.7k', time: '4 min read' },
        { title: 'Changing Your Plan', views: '980', time: '3 min read' },
        { title: 'Payment Methods', views: '1.2k', time: '2 min read' },
        { title: 'Refund Policy', views: '750', time: '3 min read' }
      ]
    }
  ];

  // Enhanced articles with detailed content
  const enhancedArticles = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      articles: [
        {
          title: 'Complete Guide to Creating Your SmartJobFit Account',
          content: 'Learn how to create your account, verify your email, and set up your initial profile. This comprehensive guide covers all the essential steps to get started with SmartJobFit\'s AI-powered job search platform.',
          views: '2.3k',
          time: '5 min read',
          keywords: ['account setup', 'getting started', 'registration', 'profile creation']
        },
        {
          title: 'Optimizing Your Profile for Maximum Job Matches',
          content: 'Discover how to complete your profile to get the best AI job matches. Learn about the key sections, skills to highlight, and preferences to set for optimal results.',
          views: '1.8k',
          time: '7 min read',
          keywords: ['profile optimization', 'job matching', 'AI matching', 'user profile']
        },
        {
          title: 'Your First AI Job Search: A Step-by-Step Guide',
          content: 'Master your first job search with our AI-powered system. Learn how to use filters, save jobs, and interpret match scores to find your perfect opportunity.',
          views: '3.1k',
          time: '10 min read',
          keywords: ['job search', 'AI search', 'job filters', 'first search']
        },
        {
          title: 'Understanding SmartJobFit\'s AI Matching Algorithm',
          content: 'Deep dive into how our AI analyzes your profile and preferences to match you with relevant opportunities across 15+ job boards.',
          views: '1.5k',
          time: '8 min read',
          keywords: ['AI algorithm', 'job matching', 'machine learning', 'artificial intelligence']
        }
      ]
    },
    {
      id: 'resume-optimization',
      title: 'Resume & Application',
      icon: FileText,
      articles: [
        {
          title: 'Complete ATS Resume Optimization Guide',
          content: 'Master the art of ATS optimization with our comprehensive guide. Learn about keyword density, formatting requirements, and how to score 95%+ on ATS systems.',
          views: '4.2k',
          time: '12 min read',
          keywords: ['ATS optimization', 'resume formatting', 'applicant tracking system', 'keyword optimization']
        },
        {
          title: 'Advanced Keyword Matching Strategies',
          content: 'Learn advanced techniques for keyword matching and optimization. Discover how to research job descriptions and tailor your resume for maximum impact.',
          views: '2.7k',
          time: '9 min read',
          keywords: ['keyword matching', 'job description analysis', 'resume keywords', 'tailored resume']
        },
        {
          title: 'Professional Resume Templates and Examples',
          content: 'Access our collection of ATS-friendly resume templates for different industries and experience levels. See real examples of successful resumes.',
          views: '3.5k',
          time: '6 min read',
          keywords: ['resume templates', 'resume examples', 'professional resume', 'industry-specific resume']
        },
        {
          title: 'Common Resume Mistakes That Kill Your Applications',
          content: 'Avoid the top 20 resume mistakes that prevent you from getting interviews. Learn what recruiters and ATS systems look for.',
          views: '2.1k',
          time: '8 min read',
          keywords: ['resume mistakes', 'resume errors', 'interview callbacks', 'resume tips']
        }
      ]
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      icon: Video,
      articles: [
        {
          title: 'AI Mock Interview Mastery Guide',
          content: 'Complete guide to using SmartJobFit\'s AI interview preparation. Learn how to practice effectively, interpret feedback, and improve your interview performance.',
          views: '3.8k',
          time: '15 min read',
          keywords: ['mock interviews', 'AI interview prep', 'interview practice', 'interview feedback']
        },
        {
          title: 'Top 100 Interview Questions with AI-Powered Answers',
          content: 'Comprehensive collection of the most common interview questions across industries, with AI-generated sample answers and tips for customization.',
          views: '5.1k',
          time: '20 min read',
          keywords: ['interview questions', 'behavioral questions', 'technical questions', 'interview answers']
        },
        {
          title: 'Body Language and Communication in Virtual Interviews',
          content: 'Master virtual interview techniques including body language, voice modulation, and camera positioning for maximum impact.',
          views: '2.2k',
          time: '10 min read',
          keywords: ['virtual interviews', 'body language', 'video interviews', 'communication skills']
        },
        {
          title: 'Technical Interview Preparation by Industry',
          content: 'Industry-specific technical interview preparation covering software engineering, data science, product management, and more.',
          views: '1.9k',
          time: '25 min read',
          keywords: ['technical interviews', 'coding interviews', 'system design', 'technical questions']
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Subscriptions',
      icon: CreditCard,
      articles: [
        {
          title: 'Complete Guide to SmartJobFit Subscription Plans',
          content: 'Detailed comparison of Free, Professional, and AI Career Coach plans. Learn which plan is right for your job search needs.',
          views: '1.7k',
          time: '6 min read',
          keywords: ['subscription plans', 'pricing', 'plan comparison', 'features']
        },
        {
          title: 'How to Upgrade, Downgrade, or Cancel Your Plan',
          content: 'Step-by-step instructions for managing your subscription, including upgrading, downgrading, and cancellation processes.',
          views: '980',
          time: '4 min read',
          keywords: ['subscription management', 'upgrade plan', 'cancel subscription', 'billing management']
        },
        {
          title: 'Payment Methods and Billing Security',
          content: 'Learn about accepted payment methods, security measures, and how to update your billing information safely.',
          views: '1.2k',
          time: '3 min read',
          keywords: ['payment methods', 'billing security', 'payment processing', 'secure payments']
        },
        {
          title: 'Refund Policy and Money-Back Guarantee',
          content: 'Complete information about our 7-day money-back guarantee, refund process, and billing dispute resolution.',
          views: '750',
          time: '4 min read',
          keywords: ['refund policy', 'money back guarantee', 'billing disputes', 'refund process']
        }
      ]
    }
  ];

  // Filter articles based on search query
  const filteredContent = searchQuery 
    ? enhancedArticles.map(category => ({
        ...category,
        articles: category.articles.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(category => category.articles.length > 0)
    : enhancedArticles;

  // Filter FAQ based on search query
  const filteredFAQ = searchQuery
    ? faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(category => category.questions.length > 0)
    : faqData;

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* AI Chatbot */}
      <AIChatbot />
      
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant help with our AI assistant, browse comprehensive guides, and find answers to all your questions
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, FAQ, or ask our AI assistant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="faq" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
          </div>

          {/* FAQ Section - Enhanced for SEO */}
          <TabsContent value="faq" className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find comprehensive answers to common questions about SmartJobFit's AI-powered job search platform
              </p>
            </div>
            
            {filteredFAQ.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <span>{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <p>{faq.answer}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Enhanced Help Articles */}
          <TabsContent value="articles" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Help Articles & Guides</h2>
              <p className="text-muted-foreground">
                Comprehensive guides and tutorials to master SmartJobFit's features
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContent.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.articles.map((article, index) => (
                          <div key={index} className="group p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm group-hover:text-purple-600 transition-colors">
                                  {article.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {article.content}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {article.views} views
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {article.time}
                                  </span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-purple-600 transition-colors ml-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Contact Support - Live Chat Only */}
          <TabsContent value="contact" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Get Support</h2>
              <p className="text-muted-foreground">
                Our AI assistant is available 24/7 to help you with any questions
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">AI Assistant</CardTitle>
                  <CardDescription>
                    Get instant help with our intelligent AI assistant. Available 24/7 to answer questions about:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Account & Profile Setup</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Job Search & Matching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Resume Optimization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Interview Preparation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Billing & Subscriptions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Technical Support</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Look for the purple AI assistant button in the bottom right corner of your screen
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">Online & Ready to Help</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

