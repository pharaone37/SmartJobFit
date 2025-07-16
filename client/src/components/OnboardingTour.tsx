import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Play, 
  Pause,
  Search,
  FileText,
  MessageCircle,
  BarChart3,
  Zap,
  Target,
  Users,
  Award,
  Star,
  Lightbulb,
  Settings,
  Rocket,
  BookOpen,
  Clock,
  TrendingUp,
  Shield,
  Globe
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  actionText?: string;
  actionUrl?: string;
  content: {
    headline: string;
    details: string[];
    tips: string[];
    benefit: string;
  };
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userProfile?: any;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SmartJobFit',
    description: 'Your AI-powered career companion',
    icon: Rocket,
    target: 'welcome-card',
    position: 'bottom',
    content: {
      headline: 'Transform your job search with AI',
      details: [
        'Find jobs 10x faster with our intelligent matching',
        'Access 15+ job boards in one unified search',
        'Get personalized career guidance and insights',
        'Track applications and optimize your success'
      ],
      tips: [
        'Complete your profile for better matches',
        'Upload your resume for AI analysis',
        'Set job alerts for your dream roles'
      ],
      benefit: 'Users find their ideal job 94% faster with our AI-powered platform'
    }
  },
  {
    id: 'job-search',
    title: 'AI-Powered Job Search',
    description: 'Search across 15+ job boards with natural language',
    icon: Search,
    target: 'job-search-tab',
    position: 'bottom',
    actionText: 'Try Job Search',
    actionUrl: '/job-search',
    content: {
      headline: 'Find your perfect job match',
      details: [
        'Search using natural language: "Remote marketing roles at startups"',
        'Get 94% accurate matches based on your profile',
        'Access jobs from LinkedIn, Indeed, Glassdoor, and more',
        'Smart deduplication removes duplicate listings'
      ],
      tips: [
        'Use specific keywords for better results',
        'Set location preferences for remote/hybrid roles',
        'Save interesting jobs to your favorites'
      ],
      benefit: 'Our AI understands context, not just keywords'
    }
  },
  {
    id: 'resume-optimization',
    title: 'Resume Optimization',
    description: 'AI analyzes and optimizes your resume for ATS systems',
    icon: FileText,
    target: 'resume-optimizer-tab',
    position: 'bottom',
    actionText: 'Optimize Resume',
    actionUrl: '/resume-optimizer',
    content: {
      headline: 'Beat ATS systems with AI optimization',
      details: [
        'Get ATS compatibility scores and detailed feedback',
        'Receive job-specific keyword suggestions',
        'Optimize for specific roles and companies',
        'Track improvements with before/after comparisons'
      ],
      tips: [
        'Upload your current resume first',
        'Target specific job descriptions',
        'Use suggested keywords naturally'
      ],
      benefit: 'Increase your resume response rate by up to 300%'
    }
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    description: 'AI-powered interview practice and coaching',
    icon: MessageCircle,
    target: 'interview-prep-tab',
    position: 'bottom',
    actionText: 'Start Practice',
    actionUrl: '/interview-prep',
    content: {
      headline: 'Ace your interviews with AI coaching',
      details: [
        'Practice with AI-generated questions for your role',
        'Get real-time feedback on your answers',
        'Learn company-specific interview insights',
        'Track your progress and improvement areas'
      ],
      tips: [
        'Practice regularly for best results',
        'Review feedback after each session',
        'Focus on your weak areas first'
      ],
      benefit: 'Users improve interview performance by 85% after practice'
    }
  },
  {
    id: 'analytics',
    title: 'Career Analytics',
    description: 'Track your job search performance and insights',
    icon: BarChart3,
    target: 'analytics-tab',
    position: 'bottom',
    actionText: 'View Analytics',
    actionUrl: '/analytics',
    content: {
      headline: 'Data-driven career decisions',
      details: [
        'Track application success rates and trends',
        'Analyze which roles get the most responses',
        'Monitor your skill development progress',
        'Get personalized improvement recommendations'
      ],
      tips: [
        'Check analytics weekly for insights',
        'Use data to refine your strategy',
        'Focus on high-performing job types'
      ],
      benefit: 'Make informed decisions with comprehensive career data'
    }
  },
  {
    id: 'automation',
    title: 'AI Automation',
    description: 'Automate job applications and follow-ups',
    icon: Zap,
    target: 'automation-tab',
    position: 'bottom',
    actionText: 'Setup Automation',
    actionUrl: '/automation',
    content: {
      headline: 'Let AI handle repetitive tasks',
      details: [
        'Automatically apply to matching jobs',
        'Generate personalized cover letters',
        'Send follow-up emails at optimal times',
        'Maintain quality with human review options'
      ],
      tips: [
        'Start with manual review enabled',
        'Set clear job criteria for automation',
        'Monitor automation performance regularly'
      ],
      benefit: 'Save 20+ hours per week on job applications'
    }
  },
  {
    id: 'profile-completion',
    title: 'Complete Your Profile',
    description: 'Unlock better matches with a complete profile',
    icon: Users,
    target: 'profile-completion',
    position: 'top',
    actionText: 'Complete Profile',
    actionUrl: '/profile',
    content: {
      headline: 'Better profiles get better matches',
      details: [
        'Add your skills, experience, and preferences',
        'Upload your resume for AI analysis',
        'Set career goals and salary expectations',
        'Connect your professional networks'
      ],
      tips: [
        'Be specific about your skills and experience',
        'Update regularly as you grow',
        'Add portfolio links and certifications'
      ],
      benefit: 'Complete profiles receive 5x more relevant job matches'
    }
  },
  {
    id: 'premium-features',
    title: 'Unlock Premium Features',
    description: 'Get access to advanced AI tools and unlimited usage',
    icon: Award,
    target: 'premium-upgrade',
    position: 'top',
    actionText: 'Upgrade Now',
    actionUrl: '/pricing',
    content: {
      headline: 'Accelerate your career with Premium',
      details: [
        'Unlimited job searches and applications',
        'Advanced AI automation and personalization',
        'Priority support and exclusive features',
        'Detailed analytics and performance insights'
      ],
      tips: [
        'Try free features first to see the value',
        'Cancel anytime with no commitment',
        'Premium users find jobs 3x faster'
      ],
      benefit: 'Premium users have 78% higher success rates'
    }
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ 
  isOpen, 
  onClose, 
  onComplete,
  userProfile 
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showTooltip, setShowTooltip] = useState(false);

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const step = onboardingSteps[currentStep];

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      setShowTooltip(true);
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, step.id]));
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(onboardingSteps.length - 1);
  };

  const handleComplete = async () => {
    try {
      await apiRequest('/api/user/onboarding/complete', {
        method: 'POST',
        body: { completedAt: new Date().toISOString() }
      });
      setCompletedSteps(new Set(onboardingSteps.map(s => s.id)));
      onComplete();
    } catch (error) {
      console.error('Failed to mark onboarding as complete:', error);
      onComplete(); // Complete anyway
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleActionClick = () => {
    if (step.actionUrl) {
      window.location.href = step.actionUrl;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{step.title}</h2>
                  <p className="text-blue-100">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.content.headline}</h3>
                  <ul className="space-y-2">
                    {step.content.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>Pro Tips:</strong>
                    <ul className="mt-1 space-y-1">
                      {step.content.tips.map((tip, index) => (
                        <li key={index} className="text-xs">• {tip}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">Key Benefit</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">{step.content.benefit}</p>
                </div>
              </div>

              {/* Right Column - Visual/Interactive */}
              <div className="space-y-4">
                {/* Feature Preview */}
                <Card className="h-48 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Preview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 w-20 bg-blue-200 dark:bg-blue-800 rounded animate-pulse" />
                        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Button */}
                {step.actionText && (
                  <Button 
                    onClick={handleActionClick}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <step.icon className="h-4 w-4 mr-2" />
                    {step.actionText}
                  </Button>
                )}

                {/* Step Navigator */}
                <div className="grid grid-cols-4 gap-2">
                  {onboardingSteps.slice(0, 8).map((s, index) => (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(index)}
                      className={`p-2 rounded-lg text-xs flex flex-col items-center gap-1 transition-all ${
                        index === currentStep 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                          : completedSteps.has(s.id)
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {completedSteps.has(s.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <s.icon className="h-4 w-4" />
                      )}
                      <span className="truncate w-full">{s.title.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-slate-600 dark:text-slate-400"
                >
                  Skip Tour
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {currentStep === onboardingSteps.length - 1 ? (
                  <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Tour
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTour;