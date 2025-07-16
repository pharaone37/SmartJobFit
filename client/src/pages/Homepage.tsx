import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
  Crown
} from 'lucide-react';

// Import screenshots
import jobSearchScreenshot from '@/assets/Screenshot 2025-07-16 at 18.29.41_1752684043849.png';
import applicationTrackerScreenshot from '@/assets/Screenshot 2025-07-16 at 18.29.56_1752684043850.png';
import autoApplyScreenshot from '@/assets/Screenshot 2025-07-16 at 18.30.04_1752684043850.png';
import resumeOptimizationScreenshot from '@/assets/Screenshot 2025-07-16 at 18.30.14_1752684043851.png';
import interviewCoachingScreenshot from '@/assets/Screenshot 2025-07-16 at 18.30.23_1752684043851.png';
import salaryIntelligenceScreenshot from '@/assets/Screenshot 2025-07-16 at 18.30.33_1752684043852.png';
import jobAlertsScreenshot from '@/assets/Screenshot 2025-07-16 at 18.31.05_1752684043852.png';
import analyticsScreenshot from '@/assets/Screenshot 2025-07-16 at 18.31.13_1752684043853.png';
import careerCoachingScreenshot from '@/assets/Screenshot 2025-07-16 at 18.32.15_1752684043853.png';

// Hero Section Component
const HeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium">
                🚀 AI-Powered Job Search Revolution
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Find Your Dream Job
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  10x Faster
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                SmartJobFit uses advanced AI to match you with perfect opportunities, 
                optimize your applications, and coach you through interviews. 
                Join 50,000+ professionals who landed their dream jobs.
              </p>
            </div>

            {/* Dynamic Feature Highlight */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Now Featuring: {features[currentFeature]}
                </h3>
              </div>
              <Progress value={(currentFeature + 1) * 11.11} className="h-2 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Experience our latest AI-powered features designed to accelerate your job search
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link to="/register">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Link>
              </Button>
              

            </div>

            {/* Trust Signals */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">50,000+ users</span>
              </div>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">4.9/5 rating</span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Preview */}
          <div className="relative">
            <Card className="bg-white dark:bg-gray-800 shadow-2xl border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live Preview</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-blue-500" />
                    <Input 
                      placeholder="Search for your dream job..."
                      className="border-0 bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { title: "Senior Software Engineer", company: "TechCorp", match: 95, salary: "$140K - $180K" },
                      { title: "Product Manager", company: "InnovateAI", match: 88, salary: "$130K - $170K" },
                      { title: "Data Scientist", company: "DataFlow", match: 82, salary: "$120K - $160K" }
                    ].map((job, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${job.match >= 90 ? 'bg-green-100 text-green-800' : job.match >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {job.match}% match
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{job.salary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature Showcase Component
const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
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
      screenshot: jobSearchScreenshot,
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
      screenshot: resumeOptimizationScreenshot,
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
      screenshot: interviewCoachingScreenshot,
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
      screenshot: applicationTrackerScreenshot,
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
      screenshot: salaryIntelligenceScreenshot,
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
      screenshot: careerCoachingScreenshot,
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
      screenshot: jobAlertsScreenshot,
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
      screenshot: autoApplyScreenshot,
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
      screenshot: analyticsScreenshot,
      demo: {
        metric: "96%",
        label: "Culture accuracy",
        improvement: "Real-time insights"
      }
    }
  ];

  const currentFeature = features[activeFeature];

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
                        onClick={() => window.open(currentFeature.screenshot, '_blank')}
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
    </section>
  );
};

// Success Metrics Component
const SuccessMetrics = () => {
  const metrics = [
    { value: "50,000+", label: "Active Users", growth: "+127% this year" },
    { value: "2.3M+", label: "Jobs Matched", growth: "+89% this quarter" },
    { value: "78%", label: "Interview Success", growth: "+12% improvement" },
    { value: "94%", label: "User Satisfaction", growth: "Industry leading" }
  ];

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
          <Badge className="bg-white/20 text-white px-4 py-2 text-sm font-medium mb-4">
            📊 Success Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join 50,000+ Professionals Who
            <span className="block text-blue-200">
              Found Their Dream Jobs
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our AI-powered platform has helped professionals across the globe achieve their career goals
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-lg font-medium mb-1">{metric.label}</div>
                <div className="text-sm text-blue-200">{metric.growth}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-white mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-blue-200 text-sm">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link to="/register">
              <Trophy className="w-5 h-5 mr-2" />
              Join Success Stories
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
                  <Link to="/register">
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
                  <Link to="/register">
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
                  <strong>50,000+</strong> active users worldwide
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-6 h-6 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  <strong>4.9/5</strong> average user rating
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
            Join thousands of professionals who have already accelerated their careers with SmartJobFit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link to="/register">
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
              <Link to="/login">
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