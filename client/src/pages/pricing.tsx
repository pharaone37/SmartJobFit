import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Checkout from "@/components/payment/checkout";
import Subscription from "@/components/payment/subscription";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Crown, 
  Shield,
  Users,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/create-subscription");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Created",
        description: "Your subscription has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const plans = [
    {
      id: "free",
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: [
        "5 AI job searches per month",
        "Basic resume optimization",
        "Limited job board access",
        "Email support",
        "Basic analytics"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      icon: Star,
      color: "from-gray-500 to-gray-600"
    },
    {
      id: "professional",
      name: "Professional",
      price: { monthly: 19, annual: 15 },
      description: "For serious job seekers",
      features: [
        "Unlimited AI job searches",
        "Advanced resume optimization",
        "All 15+ job board access",
        "AI interview preparation",
        "Priority support",
        "Analytics dashboard",
        "Job alerts",
        "Application tracking"
      ],
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
      popular: true,
      icon: Zap,
      color: "from-purple-500 to-blue-500"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 39, annual: 31 },
      description: "For career professionals",
      features: [
        "Everything in Professional",
        "Advanced analytics",
        "Salary negotiation coaching",
        "1:1 career coaching",
        "White-glove service",
        "Custom integrations",
        "Priority application queue",
        "Personal job search consultant"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      icon: Crown,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const features = [
    {
      category: "Job Search",
      items: [
        { name: "AI Job Matching", free: true, pro: true, enterprise: true },
        { name: "Job Board Access", free: "Limited", pro: "All 15+", enterprise: "All 15+ Premium" },
        { name: "Saved Searches", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Job Alerts", free: false, pro: true, enterprise: true },
        { name: "Priority Queue", free: false, pro: false, enterprise: true }
      ]
    },
    {
      category: "Resume & Applications",
      items: [
        { name: "Resume Builder", free: "Basic", pro: "Advanced", enterprise: "Premium" },
        { name: "ATS Optimization", free: false, pro: true, enterprise: true },
        { name: "Cover Letter Generator", free: false, pro: true, enterprise: true },
        { name: "Application Tracking", free: "Limited", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Auto-Apply", free: false, pro: "Limited", enterprise: "Unlimited" }
      ]
    },
    {
      category: "Interview Prep",
      items: [
        { name: "Mock Interviews", free: false, pro: true, enterprise: true },
        { name: "Question Database", free: "Limited", pro: "Full Access", enterprise: "Full Access + Custom" },
        { name: "Performance Analytics", free: false, pro: true, enterprise: true },
        { name: "Video Practice", free: false, pro: true, enterprise: true },
        { name: "1:1 Coaching", free: false, pro: false, enterprise: true }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content: "JobMatch AI helped me land my dream job at Google in just 6 weeks. The AI optimization made all the difference.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager", 
      company: "Meta",
      content: "The interview prep feature is incredible. I felt completely prepared and confident during my interviews.",
      rating: 5
    },
    {
      name: "Emily Thompson",
      role: "Data Scientist",
      company: "Netflix",
      content: "The salary negotiation coaching helped me get 30% more than my original offer. Worth every penny!",
      rating: 5
    }
  ];

  const handlePlanSelection = (planId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      return;
    }

    setSelectedPlan(planId);
    if (planId === "professional" || planId === "enterprise") {
      createSubscriptionMutation.mutate();
    }
  };

  const getPrice = (plan: any) => {
    return isAnnual ? plan.price.annual : plan.price.monthly;
  };

  const getSavings = (plan: any) => {
    const monthlyCost = plan.price.monthly * 12;
    const annualCost = plan.price.annual * 12;
    return monthlyCost - annualCost;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Choose Your <span className="text-purple-600">Plan</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Start free, upgrade when you're ready to accelerate your career
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-12">
                <span className={`text-sm ${!isAnnual ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  Monthly
                </span>
                <Switch
                  checked={isAnnual}
                  onCheckedChange={setIsAnnual}
                />
                <span className={`text-sm ${isAnnual ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  Annual
                </span>
                {isAnnual && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Save up to 25%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`card-hover ${plan.popular ? 'border-2 border-purple-500 shadow-purple relative' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          ${getPrice(plan)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      </div>
                      {isAnnual && plan.price.monthly > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Save ${getSavings(plan)} per year
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full ${plan.popular ? 'btn-gradient' : ''}`}
                        variant={plan.buttonVariant}
                        size="lg"
                        onClick={() => handlePlanSelection(plan.id)}
                        disabled={createSubscriptionMutation.isPending}
                      >
                        {createSubscriptionMutation.isPending && selectedPlan === plan.id
                          ? "Processing..."
                          : plan.buttonText
                        }
                      </Button>
                      
                      {user?.subscription === plan.id && (
                        <Badge className="w-full justify-center mt-3" variant="secondary">
                          Current Plan
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Compare All Features</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  See exactly what's included in each plan
                </p>
              </div>

              <Tabs defaultValue="all" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Features</TabsTrigger>
                  <TabsTrigger value="search">Job Search</TabsTrigger>
                  <TabsTrigger value="resume">Resume & Apps</TabsTrigger>
                  <TabsTrigger value="interview">Interview Prep</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-8">
                  {features.map((category, categoryIndex) => (
                    <Card key={categoryIndex}>
                      <CardHeader>
                        <CardTitle>{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold">Feature</th>
                                <th className="text-center py-3 px-4 font-semibold">Free</th>
                                <th className="text-center py-3 px-4 font-semibold">Professional</th>
                                <th className="text-center py-3 px-4 font-semibold">Enterprise</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.items.map((item, itemIndex) => (
                                <tr key={itemIndex} className="border-b border-gray-100 dark:border-gray-700">
                                  <td className="py-3 px-4 text-gray-900 dark:text-white">{item.name}</td>
                                  <td className="py-3 px-4 text-center">
                                    {typeof item.free === 'boolean' ? (
                                      item.free ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                      ) : (
                                        <span className="text-gray-400">—</span>
                                      )
                                    ) : (
                                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.free}</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    {typeof item.pro === 'boolean' ? (
                                      item.pro ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                      ) : (
                                        <span className="text-gray-400">—</span>
                                      )
                                    ) : (
                                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.pro}</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    {typeof item.enterprise === 'boolean' ? (
                                      item.enterprise ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                      ) : (
                                        <span className="text-gray-400">—</span>
                                      )
                                    ) : (
                                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.enterprise}</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Trusted by <span className="text-purple-600">Job Seekers</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  See how our users landed their dream jobs
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-6">"{testimonial.content}"</p>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join thousands of successful job seekers who trust JobMatch AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Components */}
        {selectedPlan && (
          <div className="hidden">
            {selectedPlan === "professional" && <Subscription />}
            {selectedPlan === "enterprise" && <Checkout />}
          </div>
        )}
      </main>
    </div>
  );
}
