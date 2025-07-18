import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Download,
  ExternalLink
} from "lucide-react";

interface SubscriptionData {
  id: string;
  status: string;
  planName: string;
  price: number;
  billingPeriod: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  features: string[];
}

export default function Subscription() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: subscription, isLoading, error } = useQuery<SubscriptionData>({
    queryKey: ["/api/subscription"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/subscription");
      return response.json();
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/cancel");
      return response.json();
    },
    onSuccess: () => {
      // Refresh subscription data
      window.location.reload();
    },
  });

  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/subscription/reactivate");
      return response.json();
    },
    onSuccess: () => {
      // Refresh subscription data
      window.location.reload();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have an active subscription. Subscribe to unlock premium features.
          </p>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'canceled':
        return <Badge className="bg-yellow-100 text-yellow-800">Cancelled</Badge>;
      case 'past_due':
        return <Badge className="bg-red-100 text-red-800">Past Due</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="h-6 w-6 text-yellow-500" />
        <h1 className="text-2xl font-bold">Subscription Management</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                {getStatusBadge(subscription.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Plan Name</h4>
                  <p className="text-lg font-semibold">{subscription.planName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Price</h4>
                  <p className="text-lg font-semibold">${subscription.price}/{subscription.billingPeriod}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Current Period</h4>
                  <p className="text-sm">
                    {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Auto-Renewal</h4>
                  <p className="text-sm">
                    {subscription.cancelAtPeriodEnd ? (
                      <span className="text-red-600">Cancelled at period end</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                {subscription.cancelAtPeriodEnd ? (
                  <Button
                    onClick={() => reactivateSubscriptionMutation.mutate()}
                    disabled={reactivateSubscriptionMutation.isPending}
                  >
                    {reactivateSubscriptionMutation.isPending ? "Processing..." : "Reactivate Subscription"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => cancelSubscriptionMutation.mutate()}
                    disabled={cancelSubscriptionMutation.isPending}
                  >
                    {cancelSubscriptionMutation.isPending ? "Processing..." : "Cancel Subscription"}
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <a href="/pricing">Change Plan</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">Next billing date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${subscription.price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subscription.billingPeriod}ly
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Billing Portal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">AI Queries</h4>
                    <p className="text-2xl font-bold text-blue-600">247</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Resumes Optimized</h4>
                    <p className="text-2xl font-bold text-green-600">12</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Job Applications</h4>
                    <p className="text-2xl font-bold text-purple-600">38</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Usage statistics are updated daily and reset at the beginning of each billing period.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}