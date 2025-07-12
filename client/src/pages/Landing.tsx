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
  BarChart3
} from "lucide-react";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
      price: 19,
      period: "month",
      description: content.pricing.professional.description,
      features: content.pricing.professional.features,
      buttonText: content.pricing.professional.buttonText,
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: content.pricing.enterprise.title,
      price: 49,
      period: "month",
      description: content.pricing.enterprise.description,
      features: content.pricing.enterprise.features,
      buttonText: content.pricing.enterprise.buttonText,
      buttonVariant: "default" as const,
      popular: false
    }
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
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
      <section className="py-20 bg-background">
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
                <div className="text-sm font-medium text-muted-foreground">{platform}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.dashboard.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.dashboard.subtitle}</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Smart Analytics</h3>
                      <p className="text-sm text-muted-foreground">Track your job search progress</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Matching</h3>
                      <p className="text-sm text-muted-foreground">Get matched with perfect jobs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Rocket className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Career Acceleration</h3>
                      <p className="text-sm text-muted-foreground">Land your dream job faster</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Job Match Score</span>
                      <span className="text-sm text-green-600 font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">24</div>
                        <div className="text-xs text-muted-foreground">Applications</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">8</div>
                        <div className="text-xs text-muted-foreground">Interviews</div>
                      </div>
                    </div>
                  </div>
                </div>
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
      <section className="py-20 bg-background">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {content.pricing.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{content.pricing.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}