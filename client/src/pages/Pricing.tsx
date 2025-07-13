import { useState } from "react";
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

  // Use local plans data instead of API call - showing only two tiers to match homepage
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      description: "Perfect for getting started",
      features: [
        "10 job searches per month",
        "Basic resume optimization",
        "Interview practice in English",
        "Access to 5 job platforms",
        "Email support"
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
      price: 29,
      yearlyPrice: 23,
      description: "For serious job seekers",
      features: [
        "Unlimited job searches",
        "Advanced resume optimization",
        "Multi-language interview prep",
        "Access to all 15+ platforms",
        "Priority support",
        "Custom job alerts",
        "Application tracking",
        "Salary negotiation coaching"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
      icon: Star
    }
  ];

  const displayPlans = plans;

  const features = [
    {
      category: "Job Search",
      icon: Target,
      items: [
        { name: "AI-Powered Job Matching", free: false, pro: true },
        { name: "Multi-Board Search", free: "Limited", pro: "15+ Boards" },
        { name: "Custom Job Alerts", free: "1", pro: "Unlimited" },
        { name: "Application Tracking", free: "5 Apps", pro: "Unlimited" },
        { name: "Salary Insights", free: false, pro: true }
      ]
    },
    {
      category: "Resume & Profile",
      icon: FileText,
      items: [
        { name: "Resume Optimization", free: "Basic", pro: "Advanced" },
        { name: "ATS Compatibility Check", free: false, pro: true },
        { name: "Cover Letter Generator", free: false, pro: true },
        { name: "LinkedIn Optimization", free: false, pro: true },
        { name: "Custom Templates", free: "3", pro: "Unlimited" }
      ]
    },
    {
      category: "Interview Preparation",
      icon: Video,
      items: [
        { name: "AI Mock Interviews", free: false, pro: true },
        { name: "Question Bank Access", free: "Limited", pro: "Full Access" },
        { name: "Performance Analytics", free: false, pro: true },
        { name: "Industry-Specific Prep", free: false, pro: true },
        { name: "Video Analysis", free: false, pro: true }
      ]
    },
    {
      category: "Analytics & Insights",
      icon: BarChart3,
      items: [
        { name: "Application Analytics", free: "Basic", pro: "Advanced" },
        { name: "Market Insights", free: false, pro: true },
        { name: "Performance Tracking", free: false, pro: true },
        { name: "Custom Reports", free: false, pro: true },
        { name: "Data Export", free: false, pro: "CSV" }
      ]
    },
    {
      category: "Support & Services",
      icon: Users,
      items: [
        { name: "Email Support", free: true, pro: true },
        { name: "Priority Support", free: false, pro: true },
        { name: "Live Chat Support", free: false, pro: true }
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
      content: "The professional features and career coaching helped me negotiate 25% higher salary. Amazing ROI!",
      avatar: "ER",
      plan: "Professional"
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
    if (value === true) {
      return (
        <div className="flex justify-center items-center">
          <Check className="w-5 h-5 text-green-500" />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex justify-center items-center">
          <span className="text-muted-foreground text-lg">—</span>
        </div>
      );
    }
    return (
      <div className="flex justify-center items-center">
        <span className="text-sm font-medium text-center">{value}</span>
      </div>
    );
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
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


          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features">
            <div className="space-y-12">
              {features.map((category, categoryIndex) => {
                const Icon = category.icon;
                return (
                  <div key={categoryIndex}>
                    <div className="flex items-center mb-6 pb-3 border-b border-gray-200">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                    </div>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b-2 border-gray-200 bg-gray-50">
                            <th className="text-left py-4 pr-6 font-semibold text-gray-900">Feature</th>
                            <th className="text-center py-4 px-4 min-w-[120px] font-semibold text-gray-900">Free</th>
                            <th className="text-center py-4 px-4 min-w-[120px] font-semibold text-gray-900">Professional</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.items.map((item, itemIndex) => (
                            <tr key={itemIndex} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 pr-6 font-medium text-gray-900">{item.name}</td>
                              <td className="py-4 px-4 text-center">{renderFeatureValue(item.free)}</td>
                              <td className="py-4 px-4 text-center">{renderFeatureValue(item.pro)}</td>
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
