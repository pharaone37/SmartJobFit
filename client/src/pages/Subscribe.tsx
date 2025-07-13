import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Check, 
  Star, 
  Crown, 
  CreditCard, 
  Shield, 
  Zap,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
let stripePromise: Promise<any> | null = null;

try {
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    console.error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
  } else {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
} catch (error) {
  console.error('Failed to load Stripe.js:', error);
}

const SubscribeForm = ({ selectedPlan, isYearly }: { selectedPlan: any; isYearly: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?subscription=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed! Welcome to JobMatch AI Pro.",
      });
    }

    setIsProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Payment Details</h3>
        <PaymentElement />
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Powered by Stripe • SSL Encrypted
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600" 
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Subscribe to {selectedPlan?.name}
          </>
        )}
      </Button>
      
      <p className="text-xs text-center text-muted-foreground">
        By subscribing, you agree to our Terms of Service and Privacy Policy. 
        Cancel anytime from your dashboard.
      </p>
    </form>
  );
};

export default function Subscribe() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedPlanId, setSelectedPlanId] = useState("professional");
  const [isYearly, setIsYearly] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch subscription plans
  const { data: plans } = useQuery({
    queryKey: ["/api/subscription/plans"],
    retry: false,
    enabled: isAuthenticated,
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      return await apiRequest("POST", "/api/get-or-create-subscription", { planId });
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Subscription Failed",
        description: "Could not create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isAuthenticated && selectedPlanId !== "free") {
      createSubscriptionMutation.mutate(selectedPlanId);
    }
  }, [selectedPlanId, isAuthenticated]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const defaultPlans = [
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
      popular: false,
      icon: Crown
    }
  ];

  const displayPlans = plans?.filter((p: any) => p.id !== "free") || defaultPlans;
  const selectedPlan = displayPlans.find((p: any) => p.id === selectedPlanId);
  const currentPrice = isYearly ? selectedPlan?.yearlyPrice : selectedPlan?.price;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/pricing" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
          <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-muted-foreground">
            Join thousands of job seekers who've accelerated their careers with JobMatch AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-500" />
                  Select Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Billing Toggle */}
                <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-lg">
                  <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>
                    Monthly
                  </span>
                  <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                  <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>
                    Yearly
                  </span>
                  <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                </div>

                {/* Plan Options */}
                <div className="space-y-4">
                  {displayPlans.map((plan: any) => {
                    const Icon = plan.icon;
                    const planPrice = isYearly ? plan.yearlyPrice : plan.price;
                    
                    return (
                      <div
                        key={plan.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPlanId === plan.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' : 'hover:border-muted-foreground'
                        }`}
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${plan.popular ? 'from-purple-500 to-blue-500' : 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">{plan.name}</h3>
                                {plan.popular && <Badge variant="default">Popular</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              ${planPrice}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              /{isYearly ? 'year' : 'month'}
                            </div>
                            {isYearly && (
                              <div className="text-xs text-green-600">
                                Save ${(plan.price - plan.yearlyPrice) * 12}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Plan Features */}
                {selectedPlan && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {selectedPlan.features.slice(0, 5).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start text-sm">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                      {selectedPlan.features.length > 5 && (
                        <li className="text-sm text-muted-foreground">
                          + {selectedPlan.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Order Summary */}
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plan</span>
                      <span className="font-medium">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing</span>
                      <span>{isYearly ? 'Yearly' : 'Monthly'}</span>
                    </div>
                    {isYearly && selectedPlan && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${(selectedPlan.price - selectedPlan.yearlyPrice) * 12}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${currentPrice}/{isYearly ? 'year' : 'month'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                {!stripePromise ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="text-red-500 mb-2">Payment system unavailable</div>
                      <p className="text-sm text-muted-foreground">
                        Please try again later or contact support
                      </p>
                    </div>
                  </div>
                ) : !clientSecret ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Setting up payment...</span>
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <SubscribeForm selectedPlan={selectedPlan} isYearly={isYearly} />
                  </Elements>
                )}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-6 h-6 text-green-500 mb-2" />
                    <span className="text-xs font-medium">SSL Encrypted</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CreditCard className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="text-xs font-medium">Secure Payments</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="w-6 h-6 text-purple-500 mb-2" />
                    <span className="text-xs font-medium">Instant Access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Money Back Guarantee */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  30-Day Money Back Guarantee
                </span>
              </div>
              <p className="text-xs text-center text-green-700 dark:text-green-300 mt-1">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
