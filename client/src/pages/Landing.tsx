import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { content } from "@/lib/content";
import { 
  Bot, 
  Search, 
  FileText, 
  Video, 
  TrendingUp, 
  Users, 
  Star, 
  Check, 
  ArrowRight,
  Building,
  MapPin,
  DollarSign,
  Clock,
  BookOpen,
  Target,
  Zap,
  Shield,
  Rocket,
  Heart,
  Award,
  Globe,
  BarChart3,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  SiLinkedin, 
  SiGlassdoor, 
  SiStackoverflow, 
  SiGithub,
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiPaypal,
  SiApple,
  SiGooglepay
} from "react-icons/si";
import dashboardScreenshot from "@assets/Screenshot 2025-07-13 at 01.32.37_1752363160764.png";

// Dashboard Screenshots Data
const dashboardScreenshots = [
  {
    id: 1,
    title: "Overview Dashboard",
    description: "Track your job search progress with AI-powered insights",
    image: dashboardScreenshot,
    features: ["Application tracking", "Interview scheduling", "Performance metrics"]
  },
  {
    id: 2,
    title: "Job Search Filters",
    description: "Advanced filtering across 15+ job boards",
    image: dashboardScreenshot,
    features: ["Smart filters", "Salary ranges", "Remote options"]
  },
  {
    id: 3,
    title: "Resume Analytics",
    description: "AI-powered resume optimization and ATS scoring",
    image: dashboardScreenshot,
    features: ["ATS compliance", "Keyword optimization", "Industry insights"]
  },
  {
    id: 4,
    title: "Interview Preparation",
    description: "Practice interviews with AI coaching",
    image: dashboardScreenshot,
    features: ["Mock interviews", "Voice analysis", "Multi-language support"]
  },
  {
    id: 5,
    title: "Career Analytics",
    description: "Comprehensive career insights and recommendations",
    image: dashboardScreenshot,
    features: ["Success metrics", "Trend analysis", "Career roadmaps"]
  }
];

// Job Platform Logo Component
const JobPlatformLogo = ({ platform }: { platform: string }) => {
  const platformLogos: { [key: string]: JSX.Element } = {
    'LinkedIn': <SiLinkedin className="w-8 h-8 text-blue-700" />,
    'Indeed': <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-sm">I</div>,
    'Glassdoor': <SiGlassdoor className="w-8 h-8 text-green-600" />,
    'ZipRecruiter': <div className="w-8 h-8 bg-blue-500 rounded text-white flex items-center justify-center font-bold text-sm">Z</div>,
    'Monster': <div className="w-8 h-8 bg-purple-600 rounded text-white flex items-center justify-center font-bold text-sm">M</div>,
    'CareerBuilder': <div className="w-8 h-8 bg-orange-500 rounded text-white flex items-center justify-center font-bold text-sm">C</div>,
    'Dice': <div className="w-8 h-8 bg-red-600 rounded text-white flex items-center justify-center font-bold text-sm">D</div>,
    'AngelList': <div className="w-8 h-8 bg-black dark:bg-white rounded text-white dark:text-black flex items-center justify-center font-bold text-sm">A</div>,
    'Stack Overflow': <SiStackoverflow className="w-8 h-8 text-orange-600" />,
    'GitHub Jobs': <SiGithub className="w-8 h-8 text-gray-800 dark:text-white" />,
    'Reed (UK)': <div className="w-8 h-8 bg-red-500 rounded text-white flex items-center justify-center font-bold text-sm">R</div>,
    'Xing (DACH)': <div className="w-8 h-8 bg-green-700 rounded text-white flex items-center justify-center font-bold text-sm">X</div>,
    'Seek (Australia)': <div className="w-8 h-8 bg-pink-600 rounded text-white flex items-center justify-center font-bold text-sm">S</div>,
    'Naukri (India)': <div className="w-8 h-8 bg-blue-800 rounded text-white flex items-center justify-center font-bold text-sm">N</div>,
    'StepStone': <div className="w-8 h-8 bg-orange-600 rounded text-white flex items-center justify-center font-bold text-sm">S</div>
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      {platformLogos[platform] || (
        <div className="w-8 h-8 bg-gray-500 rounded text-white flex items-center justify-center font-bold text-sm">
          {platform.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium text-center">{platform}</span>
    </div>
  );
};

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dashboardScreenshots.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dashboardScreenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dashboardScreenshots.length) % dashboardScreenshots.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const features = [
    {
      icon: Search,
      title: content.features.aiSearch.title,
      description: content.features.aiSearch.description,
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: FileText,
      title: content.features.resumeOptimization.title,
      description: content.features.resumeOptimization.description,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Video,
      title: content.features.interviewPrep.title,
      description: content.features.interviewPrep.description,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: BarChart3,
      title: content.features.analytics.title,
      description: content.features.analytics.description,
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Job Alerts",
      description: "Get notified about relevant opportunities instantly",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: DollarSign,
      title: "Salary Insights",
      description: "Market-based salary data and negotiation tips",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      icon: Users,
      title: "Application Tracking",
      description: "Manage all your job applications in one place",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Clock,
      title: "Interview Scheduling",
      description: "Smart scheduling with calendar integration",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "Career Coaching",
      description: "AI-powered career guidance and recommendations",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  const stats = [
    { label: "Faster Job Search", value: "10x", color: "text-purple-600" },
    { label: content.stats.interviews, value: "5x", color: "text-blue-600" },
    { label: content.stats.matches, value: "95%", color: "text-indigo-600" },
    { label: content.stats.platforms, value: "15+", color: "text-green-600" }
  ];

  const interviewFeatures = [
    {
      icon: Video,
      title: content.interviewFeatures.mockInterviews.title,
      description: content.interviewFeatures.mockInterviews.description,
      features: content.interviewFeatures.mockInterviews.features,
      color: "purple"
    },
    {
      icon: BookOpen,
      title: content.interviewFeatures.questionBank.title,
      description: content.interviewFeatures.questionBank.description,
      features: content.interviewFeatures.questionBank.features,
      color: "blue"
    },
    {
      icon: Target,
      title: content.interviewFeatures.salaryNegotiation.title,
      description: content.interviewFeatures.salaryNegotiation.description,
      features: content.interviewFeatures.salaryNegotiation.features,
      color: "green"
    }
  ];

  const testimonials = content.testimonials.reviews.map((review, index) => ({
    name: review.name,
    role: review.role,
    content: review.content,
    rating: 5,
    avatar: review.name.split(' ').map(n => n[0]).join(''),
    country: review.country,
    flag: review.flag,
    jobs: review.jobs
  }));

  const pricingPlans = [
    {
      name: content.pricing.free.title,
      price: 0,
      period: "month",
      description: content.pricing.free.description,
      features: content.pricing.free.features,
      buttonText: content.pricing.free.buttonText,
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: content.pricing.professional.title,
      price: 29,
      period: "month",
      description: content.pricing.professional.description,
      features: content.pricing.professional.features,
      buttonText: content.pricing.professional.buttonText,
      buttonVariant: "default" as const,
      popular: true
    },

  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Landing Page Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SmartJobFit</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                Features
              </a>
              <a href="#dashboard" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                Dashboard
              </a>
              <a href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                Reviews
              </a>
              <a href="#pricing" className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground">
                Pricing
              </a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Link to="/api/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                <Link to="/api/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white pt-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {content.hero.title}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              {content.hero.subtitle}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl">
                <div className="flex-1">
                  <Input
                    placeholder={content.hero.searchPlaceholder}
                    className="border-0 bg-white/20 text-white placeholder:text-white/60 text-lg h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 h-12"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {content.hero.searchButton}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8">
                <Link to="/api/login" className="flex items-center">
                  {content.hero.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.features.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.features.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.platforms.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.platforms.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {content.platforms.list.map((platform, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <JobPlatformLogo platform={platform} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.dashboard.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.dashboard.subtitle}</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {dashboardScreenshots.map((screenshot, index) => (
                    <div key={screenshot.id} className="w-full flex-shrink-0">
                      <div className="grid md:grid-cols-2 gap-8 p-8">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold mb-3">{screenshot.title}</h3>
                            <p className="text-muted-foreground text-lg mb-6">{screenshot.description}</p>
                          </div>
                          <div className="space-y-4">
                            {screenshot.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg">
                          <img 
                            src={screenshot.image} 
                            alt={screenshot.title}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {dashboardScreenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.interviewFeatures.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Practice interviews in English, Spanish, French, German, Portuguese, or Italian
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {interviewFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.testimonials.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.testimonials.subtitle}</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        <div className="flex items-center gap-1 text-xs">
                          <span>{testimonial.flag}</span>
                          <span>{testimonial.country}</span>
                          <Badge variant="secondary" className="text-xs">{testimonial.jobs}</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm italic">"{testimonial.content}"</p>
                    <div className="flex gap-1 mt-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.pricing.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.pricing.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-shadow relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2">{content.pricing.mostPopular}</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold">
                    ${plan.price}
                    <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' : ''}`}
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Job?</h2>
            <p className="text-xl text-purple-100 mb-8">Join thousands of professionals who've accelerated their careers with SmartJobFit</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8" asChild>
                <Link to="/api/login">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white px-8" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">SmartJobFit</h3>
              <p className="text-gray-300 mb-4">
                AI-powered job search platform helping professionals find their dream jobs 10x faster.
              </p>
              <div className="flex gap-4">
                <a href="#privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li>AI Job Search</li>
                <li>Resume Optimization</li>
                <li>Interview Preparation</li>
                <li>Career Analytics</li>
                <li>Salary Negotiation</li>
                <li>Job Alerts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Secure Payments</h4>
              <div className="flex gap-3 mb-4">
                <SiVisa className="w-8 h-8 text-blue-600" />
                <SiMastercard className="w-8 h-8 text-red-600" />
                <SiAmericanexpress className="w-8 h-8 text-blue-500" />
                <SiPaypal className="w-8 h-8 text-blue-400" />
                <SiApple className="w-8 h-8 text-gray-300" />
                <SiGooglepay className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-gray-400 text-sm">
                All transactions are secure and encrypted. Your payment information is never stored on our servers.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartJobFit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}