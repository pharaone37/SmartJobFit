import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";
import { SubscriptionPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: SubscriptionPlan;
  onSelect: (planId: string) => void;
  isPopular?: boolean;
  isLoading?: boolean;
  currentPlan?: string;
}

export function PricingCard({ 
  plan, 
  onSelect, 
  isPopular = false, 
  isLoading = false,
  currentPlan
}: PricingCardProps) {
  const isCurrentPlan = currentPlan === plan.id;
  const isFree = plan.price === 0;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
      isPopular && "border-2 border-primary shadow-lg scale-105"
    )}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 text-sm font-medium">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
        <div className="mb-4">
          <span className="text-4xl font-bold">
            ${plan.price}
          </span>
          <span className="text-muted-foreground">
            /{plan.interval}
          </span>
        </div>
        <CardDescription>
          {isFree && "Perfect for getting started"}
          {plan.id === 'professional' && "For serious job seekers"}
          {plan.id === 'enterprise' && "For career professionals"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={() => onSelect(plan.id)}
          disabled={isLoading || isCurrentPlan}
          className={cn(
            "w-full",
            isPopular && "button-gradient",
            isFree && "bg-gray-100 text-gray-700 hover:bg-gray-200",
            plan.id === 'enterprise' && "bg-gray-900 text-white hover:bg-gray-800"
          )}
        >
          {isLoading ? (
            'Processing...'
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : isFree ? (
            'Get Started'
          ) : plan.id === 'enterprise' ? (
            'Contact Sales'
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Start Free Trial
            </>
          )}
        </Button>

        {!isFree && !isCurrentPlan && (
          <p className="text-xs text-center text-muted-foreground">
            14-day free trial • Cancel anytime
          </p>
        )}
      </CardContent>
    </Card>
  );
}
