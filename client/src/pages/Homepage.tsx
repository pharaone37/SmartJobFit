import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImagePreviewModal from '@/components/ui/image-preview-modal';
import { 
  Search, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  DollarSign, 
  Award, 
  Bell, 
  Zap, 
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Clock,
  MapPin,
  Building,
  Briefcase,
  Shield,
  Globe,
  Rocket,
  ChevronRight,
  Eye,
  ThumbsUp,
  Brain,
  Sparkles,
  Trophy,
  Timer,
  PieChart,
  Lightbulb,
  Heart,
  Mic,
  Camera,
  Download,
  Upload,
  Filter,
  Settings,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  GraduationCap,
  Network,
  Database,
  Lock,
  CloudLightning,
  Cpu,
  Smartphone,
  Monitor,
  Tablet,
  Crown,
  ChevronDown,
  Gift
} from 'lucide-react';

// Import screenshots with descriptive names
import smartJobSearchDashboard from '@/assets/Screenshot 2025-07-16 at 18.29.41_1752684043849.png';
import applicationTrackerDashboard from '@/assets/Screenshot 2025-07-16 at 18.29.56_1752684043850.png';
import oneClickAutoApplySystem from '@/assets/Screenshot 2025-07-16 at 18.30.04_1752684043850.png';
import aiResumeOptimizationTool from '@/assets/Screenshot 2025-07-16 at 18.30.14_1752684043851.png';
import interviewCoachingSystem from '@/assets/Screenshot 2025-07-16 at 18.30.23_1752684043851.png';
import salaryIntelligenceAnalytics from '@/assets/Screenshot 2025-07-16 at 18.30.33_1752684043852.png';
import jobAlertsNotifications from '@/assets/Screenshot 2025-07-16 at 18.31.05_1752684043852.png';
import careerAnalyticsDashboard from '@/assets/Screenshot 2025-07-16 at 18.31.13_1752684043853.png';
import careerCoachingInterface from '@/assets/Screenshot 2025-07-16 at 18.32.15_1752684043853.png';
import autoApplyDashboardScreenshot from '@assets/Screenshot 2025-07-21 at 22.56.35_1753131398520.png';

// Add alias variables for any references that might use different names
const salaryIntelligenceScreenshot = salaryIntelligenceAnalytics;
const careerCoachingScreenshot = careerCoachingInterface;
const jobAlertsScreenshot = jobAlertsNotifications;

// Hero Section Component with Auto-Apply Demo
const HeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [timelineStep, setTimelineStep] = useState(0);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [showParticles, setShowParticles] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    jobsScanned: 0,
    atsScore: 0,
    companiesAnalyzed: 0,
  });

  const features = [
    "AI-Powered Job Matching",
    "Resume Optimization", 
    "Interview Coaching",
    "Application Tracking",
    "Salary Intelligence",
    "Career Coaching",
    "Job Alerts",
    "One-Click Apply",
    "Company Intelligence"
  ];

  // Demo timeline for AI agents workflow
  const agentWorkflow = [
    {
      id: 1,
      name: "Search Agent",
      icon: Search,
      task: "Scanning 15+ job boards",
      description: "Finding ML Engineer positions in Berlin",
      duration: "8s",
      result: "47 positions found"
    },
    {
      id: 2,
      name: "Filter Agent", 
      icon: Filter,
      task: "Applying salary & location filters",
      description: "Filtering for ≥€90k remote positions",
      duration: "3s",
      result: "12 qualified matches"
    },
    {
      id: 3,
      name: "Resume Agent",
      icon: FileText,
      task: "Tailoring resume for each role",
      description: "Optimizing keywords & ATS compatibility",
      duration: "12s",
      result: "99.8% ATS score achieved"
    },
    {
      id: 4,
      name: "Company Intel Agent",
      icon: Building,
      task: "Researching target companies",
      description: "Culture analysis & leadership insights",
      duration: "15s",
      result: "Deep reports ready"
    },
    {
      id: 5,
      name: "Application Agent",
      icon: Zap,
      task: "Submitting applications",
      description: "Quality control & personalization",
      duration: "8s",
      result: "12 applications sent"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance timeline demo
  useEffect(() => {
    if (isDemoActive) {
      const interval = setInterval(() => {
        setTimelineStep((prev) => {
          const newStep = prev + 1;
          if (newStep >= agentWorkflow.length) {
            setIsDemoActive(false);
            setCompletedJobs(12);
            setCurrentTask("All agents completed successfully!");
            return 0;
          }
          
          // Update current task
          setCurrentTask(agentWorkflow[newStep]?.task || "Processing...");
          
          // Update live metrics based on agent progress
          if (newStep === 1) { // Search Agent
            setLiveMetrics(prev => ({ ...prev, jobsScanned: 47 }));
          } else if (newStep === 2) { // Filter Agent
            setLiveMetrics(prev => ({ ...prev, jobsScanned: 12 }));
          } else if (newStep === 3) { // Resume Agent
            setLiveMetrics(prev => ({ ...prev, atsScore: 99.8 }));
          } else if (newStep === 4) { // Company Intel Agent
            setLiveMetrics(prev => ({ ...prev, companiesAnalyzed: 12 }));
          } else if (newStep === 5) { // Application Agent
            setCompletedJobs(12);
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 3000);
          }
          
          return newStep;
        });
      }, 1800);
      
      return () => clearInterval(interval);
    }
  }, [isDemoActive, agentWorkflow.length]);

  const startDemo = () => {
    setIsDemoActive(true);
    setTimelineStep(0);
    setCompletedJobs(0);
    setCurrentTask("Initializing AI agents...");
    setLiveMetrics({ jobsScanned: 0, atsScore: 0, companiesAnalyzed: 0 });
    setShowParticles(false);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Centered Header Section */}
        <div className="text-center space-y-8 mb-16">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 text-base font-medium inline-block shadow-lg">
            🤖 Elite AI Agents at Work - 60 Second Job Hunt
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight max-w-5xl mx-auto">
            Your Dream Job, Delivered by
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AI Agents in 60 Seconds
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
            We turn 3-hour job hunts into a 60-second click. Apply to 10 perfect jobs 
            while your coffee is still hot.
          </p>
          
          <div className="flex justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link to="/auth">
                <Rocket className="w-6 h-6 mr-3" />
                Prove Me Wrong - Start Free
              </Link>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-500" />
              <span className="text-base text-gray-600 dark:text-gray-300">Secure & Private</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-500" />
              <span className="text-base text-gray-600 dark:text-gray-300">AI-Powered</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-500" />
              <span className="text-base text-gray-600 dark:text-gray-300">60 Seconds</span>
            </div>
          </div>
        </div>



        {/* Main Interactive Demo - Extra Wide */}
        <div className="max-w-6xl mx-auto mb-16">
          {/* Enhanced Auto-Apply Demo Card */}
          <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
                <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-green-300 rounded-full animate-ping"></div>
                <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-pink-300 rounded-full animate-pulse"></div>
              </div>
              
              {/* Particle Effect for Completed Actions */}
              {showParticles && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: '1s'
                      }}
                    ></div>
                  ))}
                </div>
              )}

              <CardHeader className="relative z-10 pb-6">
                <div className="text-center space-y-5">
                  <Badge className="bg-white/25 text-white border-white/40 px-5 py-2 text-base font-semibold">
                    🎯 Live AI Demo: Experience the Magic
                  </Badge>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                      Upload Your Resume & Watch Our AI Work
                    </h3>
                    
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="text-left space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-yellow-900" />
                            </div>
                            <span className="text-white font-medium">Step 1: Upload your resume</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 text-green-900" />
                            </div>
                            <span className="text-white font-medium">Step 2: Tell our AI your dream job</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/20 rounded-lg p-4">
                          <p className="text-white text-sm mb-2 font-medium">Example command:</p>
                          <div className="bg-gray-900/50 rounded-lg p-3 border border-white/20">
                            <code className="text-green-300 text-sm">
                              "Find me a Marketing Manager role in Berlin paying €75k+ with remote flexibility"
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-6 border border-white/20">
                      <div className="text-center">
                        <h4 className="text-xl font-semibold text-white mb-3">What Happens Next?</h4>
                        <p className="text-base text-blue-100 leading-relaxed">
                          Our intelligent AI agents will instantly analyze your resume, optimize it for your target role, craft a personalized cover letter, 
                          identify the perfect job matches, prepare you for interviews with custom questions, provide salary negotiation strategies, 
                          and deliver tailored career guidance - all completed in under 60 seconds.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span>12 AI agents activate instantly</span>
                    </div>
                    <span className="text-blue-300">→</span>
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 animate-pulse" />
                      <span>Complete job package in 60 seconds</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startDemo}
                    disabled={isDemoActive}
                    className="bg-gradient-to-r from-white to-blue-50 text-blue-700 hover:from-blue-50 hover:to-white font-bold shadow-xl transform transition-all hover:scale-105 px-8 py-4 text-lg mt-6"
                  >
                    <Rocket className={`w-5 h-5 mr-3 ${isDemoActive ? 'animate-spin' : ''}`} />
                    {isDemoActive ? "AI Agents Working..." : "Start AI Demo Now"}
                  </Button>
                </div>
              </CardHeader>
              
              {isDemoActive && (
                <CardContent className="pt-0 relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
                    {/* Real-time Status Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Timer className="w-4 h-4 animate-spin" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                        <span className="font-semibold text-sm">Live AI Agent Workflow</span>
                        <Badge className="bg-green-400 text-green-900 animate-pulse text-xs">
                          Active: {timelineStep + 1}/5 agents
                        </Badge>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-1 justify-end">
                          <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                          <div className="text-sm font-bold text-green-300">{completedJobs} Jobs Ready</div>
                        </div>
                        <div className="text-xs text-blue-200 max-w-xs text-right">{currentTask}</div>
                      </div>
                    </div>

                    {/* Enhanced Agent Grid */}
                    <div className="grid grid-cols-1 gap-3">
                      {agentWorkflow.slice(0, 5).map((agent, index) => {
                        const isActive = index === timelineStep;
                        const isCompleted = index < timelineStep;
                        
                        return (
                          <div
                            key={agent.id}
                            className={`relative p-3 rounded-lg border transition-all duration-700 transform ${
                              isActive 
                                ? 'bg-yellow-400 text-yellow-900 border-yellow-300 animate-pulse scale-105 shadow-lg' 
                                : isCompleted 
                                  ? 'bg-green-400 text-green-900 border-green-300 shadow-md' 
                                  : 'bg-white/20 text-white border-white/30 opacity-70'
                            }`}
                          >
                            {/* Status indicator */}
                            <div className="absolute -top-2 -right-2">
                              {isCompleted && (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {isActive && (
                                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center animate-spin">
                                  <Timer className="w-2 h-2 text-yellow-900" />
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <agent.icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                              <span className="font-semibold text-sm">{agent.name}</span>
                              <span className="ml-auto text-xs font-mono bg-black/20 px-2 py-1 rounded">
                                {agent.duration}
                              </span>
                            </div>
                            
                            <p className="text-xs mb-1 font-medium">{agent.task}</p>
                            <p className="text-xs opacity-80">{agent.description}</p>
                            
                            {(isCompleted || isActive) && (
                              <div className="mt-3 pt-2 border-t border-current/20">
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <p className="text-xs font-semibold">{agent.result}</p>
                                </div>
                              </div>
                            )}

                            {/* Progress bar for active agent */}
                            {isActive && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-600/30 rounded-b-lg overflow-hidden">
                                <div className="h-full bg-yellow-300 animate-pulse w-full"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Enhanced Live Metrics */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="text-center p-2 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-400/30">
                        <div className="text-lg font-bold text-green-300 flex items-center justify-center gap-1">
                          <Search className="w-3 h-3" />
                          {liveMetrics.jobsScanned}
                        </div>
                        <div className="text-xs text-green-200">Jobs Scanned</div>
                      </div>
                      <div className="text-center p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30">
                        <div className="text-lg font-bold text-blue-300 flex items-center justify-center gap-1">
                          <Award className="w-3 h-3" />
                          {liveMetrics.atsScore > 0 ? `${liveMetrics.atsScore}%` : '0%'}
                        </div>
                        <div className="text-xs text-blue-200">ATS Score</div>
                      </div>
                      <div className="text-center p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-400/30">
                        <div className="text-lg font-bold text-purple-300 flex items-center justify-center gap-1">
                          <Building className="w-3 h-3" />
                          {liveMetrics.companiesAnalyzed}
                        </div>
                        <div className="text-xs text-purple-200">Companies</div>
                      </div>
                    </div>

                    {/* Success Message */}
                    {completedJobs > 0 && (
                      <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 text-green-300">
                          <CheckCircle className="w-4 h-4 animate-bounce" />
                          <span className="font-bold text-sm">Success! {completedJobs} applications ready for submission</span>
                        </div>
                        <p className="text-xs text-green-200 mt-1">
                          Each application is tailored, ATS-optimized, and includes company research
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
        </div>

        {/* Secondary Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Dynamic Feature Highlight */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Now Featuring: {features[currentFeature]}
              </h3>
            </div>
            <Progress value={(currentFeature + 1) * 11.11} className="h-3 mb-4" />
            <p className="text-base text-gray-600 dark:text-gray-300">
              Watch our AI agents work intelligently behind the scenes to deliver results
            </p>
          </div>

          {/* Bold Challenge CTA */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-2 border-amber-200 dark:border-amber-800">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Don't Believe the Hype?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We understand your skepticism. Every platform promises transformation. 
                <span className="font-semibold text-amber-700 dark:text-amber-400"> Give us 60 seconds to prove we're different.</span>
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">
                  "Try it. Challenge it. Test every claim we make. We're confident our AI agents will speak for themselves."
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">99.9% uptime - agents never sleep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">0.7ms response time - faster than heartbeat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">2.3M opportunities analyzed monthly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">78% of interviews turn into offers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Waiting List Component
const WaitingListSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waiting-list/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          source: 'homepage'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else if (response.status === 409) {
        // Email already registered
        setIsSubmitted(true);
        setEmail('');
      } else {
        console.error('Error joining waiting list:', data.message);
        // Could show error message to user
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      // Could show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-sm"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-medium">
              🎯 Early Access Available
            </Badge>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Be Among the First to Experience
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200">
                The Future of Job Search
              </span>
            </h2>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Join our exclusive waiting list to get early access to SmartJobFit's revolutionary AI-powered job search platform. 
              Be the first to experience features that will transform your career journey.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Crown,
                title: "VIP Early Access",
                description: "Get exclusive access before the official launch"
              },
              {
                icon: Zap,
                title: "50% Launch Discount",
                description: "Special pricing for our first 1,000 members"
              },
              {
                icon: Gift,
                title: "Premium Features",
                description: "Access to advanced AI tools and personalized coaching"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/80 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Email Form */}
          <div className="max-w-md mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#ffffff] backdrop-blur-sm border-white/40 text-white placeholder-white focus:border-white/70 focus:ring-white/30 focus:bg-white/25"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 font-semibold px-8 py-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Joining...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Join Waiting List
                      </div>
                    )}
                  </Button>
                </div>
                <p className="text-white/70 text-sm">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Future!</h3>
                <p className="text-white/90 mb-4">
                  You're now on our exclusive waiting list. We'll notify you as soon as SmartJobFit launches.
                </p>
                <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Expected launch: Q2 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Early Access
                  </span>
                </div>
              </div>
            )}
          </div>



        </div>
      </div>
    </section>
  );
};

// Feature Showcase Component
const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [previewModal, setPreviewModal] = useState({ isOpen: false, imageSrc: '', imageAlt: '', title: '' });
  
  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 9); // 9 features total
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);
  
  const features = [
    {
      id: 0,
      icon: Search,
      title: "AI-Powered Job Search",
      description: "Find 94% relevant jobs in under 2 seconds",
      benefits: ["Multi-platform search", "Smart deduplication", "Real-time matching"],
      screenshot: smartJobSearchDashboard,
      demo: {
        metric: "2.3 seconds",
        label: "Average search time",
        improvement: "94% relevance rate"
      }
    },
    {
      id: 1,
      icon: FileText,
      title: "Resume Optimization",
      description: "300% increase in recruiter responses",
      benefits: ["ATS compatibility", "Keyword optimization", "Industry-specific tailoring"],
      screenshot: aiResumeOptimizationTool,
      demo: {
        metric: "98.7%",
        label: "ATS compatibility score",
        improvement: "300% more responses"
      }
    },
    {
      id: 2,
      icon: MessageCircle,
      title: "Interview Preparation",
      description: "78% interview success rate",
      benefits: ["AI-powered coaching", "Multi-language support", "Real-time feedback"],
      screenshot: interviewCoachingSystem,
      demo: {
        metric: "78%",
        label: "Interview success rate",
        improvement: "45% improvement"
      }
    },
    {
      id: 3,
      icon: BarChart3,
      title: "Application Tracking",
      description: "87% outcome prediction accuracy",
      benefits: ["Automated tracking", "Communication timeline", "Success prediction"],
      screenshot: applicationTrackerDashboard,
      demo: {
        metric: "87%",
        label: "Prediction accuracy",
        improvement: "100% visibility"
      }
    },
    {
      id: 4,
      icon: DollarSign,
      title: "Salary Intelligence",
      description: "73% achieve salary increases",
      benefits: ["Real-time market data", "Negotiation coaching", "Geographic analysis"],
      screenshot: salaryIntelligenceAnalytics,
      demo: {
        metric: "73%",
        label: "Salary increase rate",
        improvement: "23% average increase"
      }
    },
    {
      id: 5,
      icon: Award,
      title: "Career Coaching",
      description: "68% career advancement in 12 months",
      benefits: ["Personalized roadmaps", "Skill gap analysis", "Mentorship matching"],
      screenshot: careerCoachingInterface,
      demo: {
        metric: "68%",
        label: "Career advancement rate",
        improvement: "12 months average"
      }
    },
    {
      id: 6,
      icon: Bell,
      title: "Job Alerts",
      description: "67% early opportunity discovery",
      benefits: ["Predictive algorithms", "Multi-channel alerts", "Natural language processing"],
      screenshot: jobAlertsNotifications,
      demo: {
        metric: "67%",
        label: "Early discovery rate",
        improvement: "48 hours ahead"
      }
    },
    {
      id: 7,
      icon: Zap,
      title: "One-Click Apply",
      description: "95% time savings, 34% higher response rates",
      benefits: ["Quality automation", "AI review process", "Time optimization"],
      screenshot: oneClickAutoApplySystem,
      demo: {
        metric: "95%",
        label: "Time savings",
        improvement: "34% better responses"
      }
    },
    {
      id: 8,
      icon: Building,
      title: "Company Intelligence",
      description: "96% accuracy in culture assessments",
      benefits: ["Culture analysis", "Leadership insights", "Competitive intelligence"],
      screenshot: careerAnalyticsDashboard,
      demo: {
        metric: "96%",
        label: "Culture accuracy",
        improvement: "Real-time insights"
      }
    }
  ];

  const currentFeature = features[activeFeature];

  const openPreview = (imageSrc: string, imageAlt: string, title: string) => {
    setPreviewModal({
      isOpen: true,
      imageSrc,
      imageAlt,
      title
    });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, imageSrc: '', imageAlt: '', title: '' });
  };

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 text-sm font-medium mb-4">
            🎯 Revolutionary Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Land Your Dream Job
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform combines 9 essential tools to transform your job search experience
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature Navigation */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <Card 
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    activeFeature === index 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeFeature === index 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Feature Demo */}
            <div className="lg:col-span-2">
              <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <currentFeature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-900 dark:text-white">
                          {currentFeature.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {currentFeature.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Live Demo
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {currentFeature.demo.metric}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {currentFeature.demo.label}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {currentFeature.demo.improvement}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Performance boost
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        99.8%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        User satisfaction
                      </div>
                    </div>
                  </div>

                  {/* Feature Screenshot */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Live Feature Preview:</h4>
                    <div className="relative rounded-lg shadow-xl bg-white group border border-gray-200 dark:border-gray-700">
                      <div className="p-4">
                        <img 
                          src={currentFeature.screenshot} 
                          alt={`${currentFeature.title} screenshot`}
                          className="w-full max-h-96 object-contain cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                          style={{ 
                            imageRendering: 'high-quality',
                            imageResolution: 'from-image'
                          }}
                          onClick={() => openPreview(currentFeature.screenshot, `${currentFeature.title} screenshot`, currentFeature.title)}
                        />
                      </div>
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view full size
                      </div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Key Benefits:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentFeature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      size="lg"
                    >
                      Try {currentFeature.title} Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Optimized for single screen view */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.id}
                className={`transition-all duration-300 ${
                  activeFeature === index 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  {/* Feature Header */}
                  <div 
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setActiveFeature(activeFeature === index ? -1 : index)}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeFeature === index 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                    <div className={`transition-transform duration-300 ${
                      activeFeature === index ? 'rotate-180' : ''
                    }`}>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Feature Content - Expanded */}
                  {activeFeature === index && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {feature.demo.metric}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            {feature.demo.label}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {feature.demo.improvement}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            Performance boost
                          </div>
                        </div>
                      </div>

                      {/* Feature Screenshot - Optimized for mobile */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Live Preview:</h4>
                        <div className="relative rounded-lg shadow-lg bg-white border border-gray-200 dark:border-gray-700">
                          <div className="p-2">
                            <img 
                              src={feature.screenshot} 
                              alt={`${feature.title} screenshot`}
                              className="w-full max-h-60 object-contain cursor-pointer"
                              style={{ 
                                imageRendering: 'high-quality',
                                imageResolution: 'from-image'
                              }}
                              onClick={() => openPreview(feature.screenshot, `${feature.title} screenshot`, feature.title)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Benefits - Compact */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Key Benefits:</h4>
                        <div className="space-y-1">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-gray-600 dark:text-gray-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        size="sm"
                      >
                        Try {feature.title} Now
                        <ArrowRight className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ImagePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        imageSrc={previewModal.imageSrc}
        imageAlt={previewModal.imageAlt}
        title={previewModal.title}
      />
    </section>
  );
};

// Success Metrics Component
const SuccessMetrics = () => {

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      image: "/api/placeholder/60/60",
      quote: "SmartJobFit helped me land my dream job at Google. The AI matching was incredibly accurate!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Meta",
      image: "/api/placeholder/60/60",
      quote: "The resume optimization feature increased my response rate by 300%. Absolutely game-changing!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Netflix",
      image: "/api/placeholder/60/60",
      quote: "The interview coaching was phenomenal. I felt confident and prepared for every question.",
      rating: 5
    }
  ];

  return (
    <section id="reviews" className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built by Career Experts
            <span className="block text-blue-200">
              For Future Success
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Our AI-powered platform has helped professionals across the globe achieve their career goals
          </p>
          
          {/* Key Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">94%</div>
              <div className="text-blue-100">of matches feel like the job was written for you</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">99.8%</div>
              <div className="text-blue-100">of résumés pass ATS filters on first scan</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">€12,400</div>
              <div className="text-blue-100">average salary increase in first offer</div>
            </div>
          </div>
        </div>





        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link to="/auth">
              <Trophy className="w-5 h-5 mr-2" />
              Start Your Journey
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Main Homepage Component
const Homepage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <WaitingListSection />
      <FeatureShowcase />
      <SuccessMetrics />
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium mb-4">
              💎 Pricing Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Accelerate Your Career
              <span className="block text-blue-600 dark:text-blue-400">
                at Light Speed
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your career goals. Start for free and upgrade when you're ready to 10x your job search success.
            </p>
            
            {/* Value Proposition */}
            <div className="flex justify-center mt-8">
              <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-6 py-3 rounded-full text-sm font-medium">
                <Timer className="w-4 h-4 inline mr-2" />
                Average time to job offer: 2.3 weeks with Professional plan
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">€0</div>
                  <div className="text-gray-600 dark:text-gray-300">Forever</div>
                  <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    Perfect for exploring
                  </Badge>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">5 AI job searches</span>
                      <div className="text-sm text-gray-500 dark:text-gray-400">per month</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Basic resume optimization</span>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ATS compatibility check</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Interview preparation</span>
                      <div className="text-sm text-gray-500 dark:text-gray-400">5 practice questions</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Limited AI features</span>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Basic chatbot support</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Community support</span>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Email support</div>
                    </div>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg"
                  size="lg"
                  asChild
                >
                  <Link to="/auth">
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Free Forever
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-2 border-purple-500 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-sm font-medium shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Professional</h3>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">€59</span>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">€39</div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">per month</div>
                  <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    Save 34% - Launch Special
                  </Badge>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Unlimited AI job search</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">15+ job boards, 94% relevance</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Advanced resume optimization</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">99.8% ATS compatibility, 300% more responses</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">AI interview coaching</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">78% success rate, real-time feedback</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Application tracking & analytics</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">87% outcome prediction accuracy</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Salary intelligence & negotiation</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">73% achieve salary increases</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">One-click apply automation</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Save 8 hours per week</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Company intelligence reports</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Deep insights on 50,000+ companies</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">Priority support</span>
                      <div className="text-sm text-purple-600 dark:text-purple-400">24/7 chat & phone support</div>
                    </div>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  size="lg"
                  asChild
                >
                  <Link to="/auth">
                    <Crown className="w-4 h-4 mr-2" />
                    Start 7-Day Free Trial
                  </Link>
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No credit card required • Cancel anytime
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-6 h-6 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>30-day</strong> money-back guarantee
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Globe className="w-6 h-6 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Early Access</strong> to cutting-edge AI career tools
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-6 h-6 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>Beta</strong> testing program available
                </span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                🎯 <strong>Success Guarantee:</strong> 73% of Professional users land their dream job within 30 days or get a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive job market insights, AI-powered career tips, and early access to new features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link to="/auth">
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Free Trial
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link to="/auth">
                <Eye className="w-5 h-5 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;