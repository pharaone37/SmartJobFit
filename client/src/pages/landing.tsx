import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Search, 
  FileText, 
  Video, 
  Building, 
  Rocket, 
  Code, 
  Star,
  CheckCircle,
  Plus,
  Calendar,
  BarChart3,
  DollarSign,
  Users,
  Zap,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: <Search className="text-white text-2xl" />,
      title: "Universal Job Search",
      description: "Search across 15+ major job boards simultaneously. LinkedIn, Indeed, Glassdoor, ZipRecruiter, and more.",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: <FileText className="text-white text-2xl" />,
      title: "AI Resume Optimization", 
      description: "ATS-optimized resumes tailored for each job. Instant compatibility scoring and suggestions.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Video className="text-white text-2xl" />,
      title: "Interview Prep AI",
      description: "Practice with AI interviewer. Voice analysis, body language feedback, and personalized coaching.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const testimonials = [
    {
      quote: "JobMatch AI helped me land my dream job in just 3 weeks! The AI resume optimization increased my response rate by 300%.",
      author: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b169?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "The interview prep AI was incredible. I felt confident going into my interviews and nailed every one. Highly recommended!",
      author: "Michael Chen", 
      role: "Software Engineer at StartupCo",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      quote: "Amazing platform! The salary negotiation coaching helped me get 25% more than my initial offer. Worth every penny!",
      author: "Emily Rodriguez",
      role: "UX Designer at DesignStudio", 
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: 0,
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "5 AI job searches per month",
        "Basic resume optimization", 
        "Limited job board access",
        "Email support"
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-gray-100 text-gray-700 hover:bg-gray-200"
    },
    {
      name: "Professional", 
      price: 19,
      period: "/month",
      description: "For serious job seekers",
      features: [
        "Unlimited AI job searches",
        "Advanced resume optimization",
        "All 15+ job board access", 
        "AI interview preparation",
        "Priority support",
        "Analytics dashboard"
      ],
      buttonText: "Start Free Trial",
      buttonStyle: "button-gradient",
      popular: true
    },
    {
      name: "Enterprise",
      price: 39, 
      period: "/month",
      description: "For career professionals",
      features: [
        "Everything in Professional",
        "Advanced analytics",
        "Salary negotiation coaching",
        "1:1 career coaching", 
        "White-glove service",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800"
    }
  ];

  const handleSearch = () => {
    // Navigate to job search with query
    window.location.href = `/jobs?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Find Your Dream Job</span>
                <br />
                <span className="text-4xl md:text-5xl gradient-text">10x Faster with AI</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Search 1M+ jobs from 15+ sources. AI-optimized resumes. Smart matching. One-click applications. 
                The future of job search is here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search job titles or companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-4 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  className="button-gradient px-8 py-4 text-lg font-medium rounded-2xl"
                  onClick={handleSearch}
                >
                  Start AI Search
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">10x</div>
                  <div className="text-sm text-muted-foreground">Faster Job Search</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">5x</div>
                  <div className="text-sm text-muted-foreground">More Interviews</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">1M+</div>
                  <div className="text-sm text-muted-foreground">Job Matches Found</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Why JobMatch AI is <span className="text-primary">Different</span>
              </h2>
              <p className="text-xl text-muted-foreground">Revolutionary AI-powered features that transform your job search</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-8 rounded-2xl card-gradient hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Your Personal Job Search <span className="text-primary">Command Center</span>
              </h2>
              <p className="text-xl text-muted-foreground">Track everything in one beautiful, intelligent dashboard</p>
            </div>
            
            {/* Dashboard Mockup */}
            <Card className="shadow-2xl border border-border">
              <CardContent className="p-8">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                  <div>
                    <h3 className="text-2xl font-bold">Welcome back, Sarah!</h3>
                    <p className="text-muted-foreground">Here's your job search progress</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button className="button-gradient">
                      <Plus className="h-4 w-4 mr-2" />
                      New Application
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <Card className="button-gradient text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Total Applications</p>
                          <p className="text-3xl font-bold">47</p>
                        </div>
                        <FileText className="h-6 w-6 text-purple-200" />
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
                        <Calendar className="h-6 w-6 text-green-400" />
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
                        <BarChart3 className="h-6 w-6 text-blue-400" />
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
                        <Star className="h-6 w-6 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Applications & Recommendations */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Recent Applications</h4>
                    <div className="space-y-4">
                      {[
                        { title: "Senior Product Manager", company: "TechCorp Inc.", status: "Interview", match: "94%" },
                        { title: "UX Designer", company: "StartupCo", status: "Under Review", match: "87%" },
                        { title: "Frontend Developer", company: "DevStudio", status: "Applied", match: "91%" }
                      ].map((app, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <Building className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">{app.title}</p>
                              <p className="text-sm text-muted-foreground">{app.company}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{app.status}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">Match: {app.match}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">AI Recommendations</h4>
                    <div className="space-y-4">
                      <Card className="card-gradient border border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-purple-800">Optimize Your Resume</p>
                            <Zap className="h-4 w-4 text-purple-600" />
                          </div>
                          <p className="text-sm text-purple-700 mb-3">Add "React" and "Node.js" to increase match rate by 15%</p>
                          <Button variant="outline" size="sm" className="text-purple-600">
                            Apply Suggestion →
                          </Button>
                        </CardContent>
                      </Card>
                      <Card className="card-gradient-blue border border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-blue-800">Interview Prep</p>
                            <Video className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="text-sm text-blue-700 mb-3">Practice common PM questions for TechCorp interview</p>
                          <Button variant="outline" size="sm" className="text-blue-600">
                            Start Practice →
                          </Button>
                        </CardContent>
                      </Card>
                      <Card className="card-gradient-green border border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-green-800">Salary Negotiation</p>
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-sm text-green-700 mb-3">Market data shows you can negotiate 20% higher</p>
                          <Button variant="outline" size="sm" className="text-green-600">
                            View Analysis →
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Loved by <span className="text-primary">Job Seekers</span>
              </h2>
              <p className="text-xl text-muted-foreground">See how JobMatch AI has transformed careers worldwide</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="card-gradient border border-purple-200">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Choose Your <span className="text-primary">Plan</span>
              </h2>
              <p className="text-xl text-muted-foreground">Start free, upgrade when you're ready to accelerate your career</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="button-gradient text-white px-6 py-2 text-sm font-medium">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold mb-2">
                      ${plan.price}<span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${plan.buttonStyle}`} asChild>
                      <Link href="/pricing">{plan.buttonText}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Job Search?</h2>
            <p className="text-xl text-purple-100 mb-8">Join 50,000+ job seekers who've already found their dream jobs with JobMatch AI</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 text-lg" asChild>
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
              <Button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 text-lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">JobMatch AI</span>
                </div>
                <p className="text-gray-400 mb-4">The future of job search is here. Find your dream job 10x faster with AI.</p>
                <div className="flex space-x-4">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/jobs" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 JobMatch AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
