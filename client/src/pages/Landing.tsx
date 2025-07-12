import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
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
  Award
} from "lucide-react";

export default function Landing() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: Search,
      title: t.landing.features.aiSearch.title,
      description: t.landing.features.aiSearch.description,
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: FileText,
      title: t.landing.features.resumeOptimization.title,
      description: t.landing.features.resumeOptimization.description,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Video,
      title: t.landing.features.interviewPrep.title,
      description: t.landing.features.interviewPrep.description,
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { label: "Faster Job Search", value: "10x", color: "text-purple-600" },
    { label: t.landing.stats.interviews, value: "5x", color: "text-blue-600" },
    { label: t.landing.stats.matches, value: "1M+", color: "text-indigo-600" }
  ];

  const interviewFeatures = [
    {
      icon: Video,
      title: t.landing.interviewFeatures.mockInterviews.title,
      description: t.landing.interviewFeatures.mockInterviews.description,
      features: t.landing.interviewFeatures.mockInterviews.features,
      color: "purple"
    },
    {
      icon: BookOpen,
      title: t.landing.interviewFeatures.questionBank.title,
      description: t.landing.interviewFeatures.questionBank.description,
      features: t.landing.interviewFeatures.questionBank.features,
      color: "blue"
    },
    {
      icon: Target,
      title: t.landing.interviewFeatures.salaryNegotiation.title,
      description: t.landing.interviewFeatures.salaryNegotiation.description,
      features: t.landing.interviewFeatures.salaryNegotiation.features,
      color: "green"
    }
  ];

  const testimonials = t.landing.testimonials.reviews.map((review, index) => ({
    name: review.name,
    role: review.role,
    content: review.content,
    rating: 5,
    avatar: review.name.split(' ').map(n => n[0]).join('')
  }));

  const pricingPlans = [
    {
      name: t.landing.pricing.free.title,
      price: 0,
      period: "month",
      description: t.landing.pricing.free.description,
      features: t.landing.pricing.free.features,
      buttonText: t.landing.pricing.free.buttonText,
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: t.landing.pricing.professional.title,
      price: 29,
      period: "month",
      description: t.landing.pricing.professional.description,
      features: t.landing.pricing.professional.features,
      buttonText: t.landing.pricing.professional.buttonText,
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: t.landing.pricing.enterprise.title,
      price: 79,
      period: "month",
      description: t.landing.pricing.enterprise.description,
      features: t.landing.pricing.enterprise.features,
      buttonText: t.landing.pricing.enterprise.buttonText,
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSearch = () => {
    // This would trigger the AI search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20">
        <div className="container-custom section-padding">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">SmartJobFit</span><br />
              <span className="text-4xl md:text-5xl">{t.landing.heroTitle}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
              {t.landing.heroDescription}
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-2xl mx-auto">
              <div className="relative w-full sm:w-96">
                <Input
                  type="text"
                  placeholder={t.landing.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-6 pr-12 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-500"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              <Button 
                onClick={handleSearch}
                size="lg"
                className="h-14 px-8 rounded-2xl text-lg font-medium hover-lift gradient-bg"
              >
                {t.landing.searchButton}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t.landing.features.title}
            </h2>
            <p className="text-xl text-muted-foreground">{t.landing.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover-lift card-shadow border-0 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t.landing.dashboard.title}
            </h2>
            <p className="text-xl text-muted-foreground">{t.landing.dashboard.subtitle}</p>
          </div>
          
          <Card className="card-shadow border-0">
            <CardContent className="p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div>
                  <h3 className="text-2xl font-bold">Welcome back, Sarah!</h3>
                  <p className="text-muted-foreground">Here's your job search progress</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button className="gradient-bg">
                    <Zap className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="gradient-bg text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Total Applications</p>
                        <p className="text-3xl font-bold">47</p>
                      </div>
                      <Rocket className="w-8 h-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Interviews Scheduled</p>
                        <p className="text-3xl font-bold text-green-600">8</p>
                      </div>
                      <Video className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Response Rate</p>
                        <p className="text-3xl font-bold text-blue-600">67%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Avg. Match Score</p>
                        <p className="text-3xl font-bold text-purple-600">92%</p>
                      </div>
                      <Star className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Recent Applications</h4>
                  <div className="space-y-4">
                    {[
                      { title: "Senior Product Manager", company: "TechCorp Inc.", status: "Interview", match: "94%" },
                      { title: "UX Designer", company: "StartupCo", status: "Under Review", match: "87%" },
                      { title: "Frontend Developer", company: "DevStudio", status: "Applied", match: "91%" }
                    ].map((job, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">{job.title}</p>
                              <p className="text-sm text-muted-foreground">{job.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{job.status}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">Match: {job.match}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">AI Recommendations</h4>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Optimize Your Resume", 
                        description: "Add \"React\" and \"Node.js\" to increase match rate by 15%",
                        icon: FileText,
                        color: "purple"
                      },
                      { 
                        title: "Interview Prep", 
                        description: "Practice common PM questions for TechCorp interview",
                        icon: Video,
                        color: "blue"
                      },
                      { 
                        title: "Salary Negotiation", 
                        description: "Market data shows you can negotiate 20% higher",
                        icon: DollarSign,
                        color: "green"
                      }
                    ].map((rec, index) => {
                      const Icon = rec.icon;
                      return (
                        <Card key={index} className={`p-4 border-${rec.color}-200 bg-gradient-to-r from-${rec.color}-50 to-${rec.color}-50/30`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 bg-${rec.color}-500 rounded-lg flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold mb-1">{rec.title}</p>
                              <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                              <Button variant="link" className={`text-${rec.color}-600 p-0 h-auto`}>
                                Apply Suggestion <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interview Preparation */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t.landing.interviewFeatures.title}
            </h2>
            <p className="text-xl text-muted-foreground">Practice with AI, get real-time feedback, and land your dream job</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {interviewFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                purple: "border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20",
                blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
                green: "border-green-200 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20"
              };
              
              return (
                <Card key={index} className={`hover-lift card-shadow ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color === 'green' ? 'teal' : feature.color === 'blue' ? 'indigo' : 'blue'}-500 rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full bg-gradient-to-r from-${feature.color}-500 to-${feature.color === 'green' ? 'teal' : feature.color === 'blue' ? 'indigo' : 'blue'}-500 hover:from-${feature.color}-600 hover:to-${feature.color === 'green' ? 'teal' : feature.color === 'blue' ? 'indigo' : 'blue'}-600`}>
                      {feature.title === 'AI Mock Interviews' ? 'Start Practice' : 
                       feature.title === 'Question Bank' ? 'Browse Questions' : 'Start Coaching'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t.landing.testimonials.title}
            </h2>
            <p className="text-xl text-muted-foreground">{t.landing.testimonials.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`hover-lift card-shadow ${index === activeTestimonial ? 'ring-2 ring-purple-500' : ''}`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t.landing.pricing.title}
            </h2>
            <p className="text-xl text-muted-foreground">{t.landing.pricing.subtitle}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`hover-lift card-shadow relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-bg text-white px-6 py-2">{t.landing.pricing.mostPopular}</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold mb-2">
                      ${plan.price}<span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full ${plan.popular ? 'gradient-bg hover:opacity-90' : ''}`}
                    asChild
                  >
                    <Link to="/api/login">
                      {plan.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6">{t.landing.hero.title}</h2>
            <p className="text-xl text-purple-100 mb-8">{t.landing.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-purple-600 hover:text-purple-700" asChild>
                <Link to="/api/login">{t.landing.hero.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
