import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Shield, 
  Rocket,
  Users,
  BarChart3,
  Video,
  FileText,
  Target,
  DollarSign,
  Clock,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");

  // Fetch subscription plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ["/api/subscription/plans"],
    retry: false,
  });

  const defaultPlans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      description: "Perfect for getting started",
      features: [
        "5 AI job searches per month",
        "Basic resume optimization",
        "Limited job board access",
        "Email support",
        "Basic analytics"
      ],
      limitations: [
        "Limited to 5 applications tracking",
        "Basic templates only",
        "No priority support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
      icon: Rocket
    },
    {
      id: "professional",
      name: "Professional",
      price: 19,
      yearlyPrice: 15,
      description: "For serious job seekers",
      features: [
        "Unlimited AI job searches",
        "Advanced resume optimization",
        "All 15+ job board access",
        "AI interview preparation",
        "Priority support",
        "Advanced analytics dashboard",
        "Custom job alerts",
        "Application tracking",
        "Cover letter generator",
        "Salary insights"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
      icon: Star
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 39,
      yearlyPrice: 31,
      description: "For career professionals",
      features: [
        "Everything in Professional",
        "Advanced analytics & reporting",
        "Salary negotiation coaching",
        "1:1 career coaching sessions",
        "White-glove service",
        "Custom integrations",
        "API access",
        "Dedicated account manager",
        "Team collaboration tools",
        "Custom branding"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
      icon: Crown
    }
  ];

  const displayPlans = plans || defaultPlans;

  const features = [
    {
      category: "Job Search",
      icon: Target,
      items: [
        { name: "AI-Powered Job Matching", free: false, pro: true, enterprise: true },
        { name: "Multi-Board Search", free: "Limited", pro: "15+ Boards", enterprise: "15+ Boards" },
        { name: "Custom Job Alerts", free: "1", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Application Tracking", free: "5 Apps", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Salary Insights", free: false, pro: true, enterprise: true }
      ]
    },
    {
      category: "Resume & Profile",
      icon: FileText,
      items: [
        { name: "Resume Optimization", free: "Basic", pro: "Advanced", enterprise: "AI-Powered" },
        { name: "ATS Compatibility Check", free: false, pro: true, enterprise: true },
        { name: "Cover Letter Generator", free: false, pro: true, enterprise: true },
        { name: "LinkedIn Optimization", free: false, pro: true, enterprise: true },
        { name: "Custom Templates", free: "3", pro: "Unlimited", enterprise: "Unlimited" }
      ]
    },
    {
      category: "Interview Preparation",
      icon: Video,
      items: [
        { name: "AI Mock Interviews", free: false, pro: true, enterprise: true },
        { name: "Question Bank Access", free: "Limited", pro: "Full Access", enterprise: "Full Access" },
        { name: "Performance Analytics", free: false, pro: true, enterprise: "Advanced" },
        { name: "Industry-Specific Prep", free: false, pro: true, enterprise: true },
        { name: "Video Analysis", free: false, pro: false, enterprise: true }
      ]
    },
    {
      category: "Analytics & Insights",
      icon: BarChart3,
      items: [
        { name: "Application Analytics", free: "Basic", pro: "Advanced", enterprise: "Custom" },
        { name: "Market Insights", free: false, pro: true, enterprise: true },
        { name: "Performance Tracking", free: false, pro: true, enterprise: "Advanced" },
        { name: "Custom Reports", free: false, pro: false, enterprise: true },
        { name: "Data Export", free: false, pro: "CSV", enterprise: "Multiple Formats" }
      ]
    },
    {
      category: "Support & Services",
      icon: Users,
      items: [
        { name: "Email Support", free: true, pro: true, enterprise: true },
        { name: "Priority Support", free: false, pro: true, enterprise: true },
        { name: "Career Coaching", free: false, pro: false, enterprise: "1:1 Sessions" },
        { name: "Dedicated Manager", free: false, pro: false, enterprise: true },
        { name: "Phone Support", free: false, pro: false, enterprise: true }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      content: "JobMatch AI helped me land my dream job in just 3 weeks! The AI resume optimization increased my response rate by 300%.",
      avatar: "SJ",
      plan: "Professional"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "StartupCo",
      content: "The interview prep was incredible. I felt confident and nailed every interview. Worth every penny!",
      avatar: "MC",
      plan: "Professional"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "DesignStudio",
      content: "The enterprise features and career coaching helped me negotiate 25% higher salary. Amazing ROI!",
      avatar: "ER",
      plan: "Enterprise"
    }
  ];

  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "Get 14 days of Professional plan features at no cost. No credit card required to start. Cancel anytime."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing."
    },
    {
      question: "What job boards do you search?",
      answer: "We search 15+ major job boards including LinkedIn, Indeed, Glassdoor, ZipRecruiter, Monster, and many more."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security, SSL encryption, and never share your personal information."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee if you're not completely satisfied with our service."
    },
    {
      question: "How accurate is the AI matching?",
      answer: "Our AI has a 92% accuracy rate in job matching, continuously improving through machine learning and user feedback."
    }
  ];

  const renderFeatureValue = (value: any) => {
    if (value === true) return <Check className="w-4 h-4 text-green-500" />;
    if (value === false) return <span className="text-muted-foreground">—</span>;
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start free, upgrade when you're ready to accelerate your career. 
            All plans include our core AI-powered job search features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">Save 20%</Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans">
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {displayPlans.map((plan, index) => {
                const Icon = plan.icon;
                const currentPrice = isYearly ? plan.yearlyPrice : plan.price;
                
                return (
                  <Card key={index} className={`relative hover:shadow-lg transition-shadow ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${plan.popular ? 'from-purple-500 to-blue-500' : 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="text-4xl font-bold mb-2">
                        ${currentPrice}
                        <span className="text-lg font-normal text-muted-foreground">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      </div>
                      {isYearly && plan.price > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <span className="line-through">${plan.price * 12}/year</span>
                          <span className="text-green-600 ml-2">Save ${(plan.price - plan.yearlyPrice) * 12}</span>
                        </div>
                      )}
                      <p className="text-muted-foreground">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {plan.limitations && (
                        <div className="mb-6 p-3 bg-muted rounded-lg">
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2">LIMITATIONS</h4>
                          <ul className="space-y-1">
                            {plan.limitations.map((limitation, limitIndex) => (
                              <li key={limitIndex} className="text-xs text-muted-foreground flex items-start">
                                <span className="mr-2">•</span>
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <Button 
                        variant={plan.buttonVariant}
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' : ''}`}
                        asChild
                      >
                        {isAuthenticated ? (
                          <Link to={plan.id === 'free' ? '/dashboard' : '/subscribe'}>
                            {plan.buttonText}
                          </Link>
                        ) : (
                          <Link to="/api/login">
                            {plan.buttonText}
                          </Link>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Testimonials */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">
                Loved by <span className="gradient-text">Job Seekers</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                        </div>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {testimonial.plan}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">"{testimonial.content}"</p>
                      <div className="flex mt-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enterprise CTA */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200">
              <CardContent className="p-8 text-center">
                <Crown className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Need something custom?</h3>
                <p className="text-muted-foreground mb-6">
                  Looking for team plans, custom integrations, or enterprise features? 
                  Let's build a solution that fits your organization's needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule a Call
                  </Button>
                  <Button size="lg" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <div className="space-y-12">
              {features.map((category, categoryIndex) => {
                const Icon = category.icon;
                return (
                  <div key={categoryIndex}>
                    <div className="flex items-center mb-6">
                      <Icon className="w-6 h-6 text-purple-500 mr-3" />
                      <h3 className="text-xl font-bold">{category.category}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 pr-6">Feature</th>
                            <th className="text-center py-3 px-4 min-w-[100px]">Free</th>
                            <th className="text-center py-3 px-4 min-w-[100px]">Professional</th>
                            <th className="text-center py-3 px-4 min-w-[100px]">Enterprise</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.items.map((item, itemIndex) => (
                            <tr key={itemIndex} className="border-b last:border-b-0">
                              <td className="py-3 pr-6 font-medium">{item.name}</td>
                              <td className="text-center py-3 px-4">{renderFeatureValue(item.free)}</td>
                              <td className="text-center py-3 px-4">{renderFeatureValue(item.pro)}</td>
                              <td className="text-center py-3 px-4">{renderFeatureValue(item.enterprise)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <MessageSquare className="w-5 h-5 text-purple-500 mr-2" />
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Our team is here to help you find the perfect plan for your needs.
                </p>
                <Button size="lg" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
