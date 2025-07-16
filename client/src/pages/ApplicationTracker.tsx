import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Building, MapPin, DollarSign, FileText, Mail, Phone, Users, Lightbulb, BarChart, TrendingUp, Target, RefreshCw, Send, MessageSquare, Bell, CheckCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface Application {
  id: string;
  positionTitle: string;
  companyName: string;
  applicationDate: string;
  status: string;
  source: string;
  priorityScore: number;
  applicationUrl?: string;
  salary?: string;
  location?: string;
  workType?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  lastInteractionDate?: string;
  timeline?: TimelineEvent[];
  communications?: Communication[];
}

interface TimelineEvent {
  id: string;
  eventType: string;
  eventDate: string;
  description: string;
  source: string;
  confidenceScore: number;
}

interface Communication {
  id: string;
  communicationType: string;
  direction: string;
  subject: string;
  content: string;
  fromAddress?: string;
  toAddress?: string;
  timestamp: string;
  sentimentScore?: number;
  priorityLevel: string;
  requiresAction: boolean;
}

interface Analytics {
  stats: {
    totalApplications: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
    recentActivity: any[];
  };
  suggestions: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
    actionItems: string[];
  }>;
  trends: {
    applicationVolume: {
      current: number;
      previous: number;
      change: number;
    };
    responseRate: {
      current: number;
      previous: number;
    };
  };
}

const statusColors = {
  applied: "bg-blue-100 text-blue-800",
  screening: "bg-yellow-100 text-yellow-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
  urgent: "bg-red-600 text-white",
};

export default function ApplicationTracker() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const { data: dashboard, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/applications/dashboard'],
    staleTime: 5 * 60 * 1000,
  });

  // Fetch applications
  const { data: applications, isLoading: isApplicationsLoading } = useQuery({
    queryKey: ['/api/applications'],
    staleTime: 2 * 60 * 1000,
  });

  // Fetch analytics
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['/api/applications/analytics'],
    staleTime: 10 * 60 * 1000,
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      return await apiRequest(`/api/applications/${id}/status`, {
        method: 'PUT',
        body: { status, notes },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/applications/analytics'] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate outcome prediction mutation
  const generatePredictionMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      return await apiRequest(`/api/applications/${applicationId}/prediction`, {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Prediction Generated",
        description: `Success probability: ${Math.round(data.prediction.predictionScore * 100)}%`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (applicationId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: applicationId, status: newStatus });
  };

  const handleGeneratePrediction = (applicationId: string) => {
    generatePredictionMutation.mutate(applicationId);
  };

  if (isDashboardLoading || isApplicationsLoading || isAnalyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-20 sm:pb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Application Tracker</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Mail className="w-4 h-4 mr-2" />
            Sync Emails
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
          <TabsTrigger value="dashboard" className="text-xs sm:text-sm p-2 sm:p-3">Dashboard</TabsTrigger>
          <TabsTrigger value="applications" className="text-xs sm:text-sm p-2 sm:p-3">Applications</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm p-2 sm:p-3">Analytics</TabsTrigger>
          <TabsTrigger value="follow-ups" className="text-xs sm:text-sm p-2 sm:p-3">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {dashboard ? (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboard.stats?.totalApplications || 0}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(dashboard.stats?.responseRate || 0)}%</div>
                    <p className="text-xs text-muted-foreground">+3% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(dashboard.stats?.interviewRate || 0)}%</div>
                    <p className="text-xs text-muted-foreground">+1% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(dashboard.stats?.offerRate || 0)}%</div>
                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.applications?.slice(0, 5).map((app: Application) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold">{app.positionTitle}</h3>
                            <p className="text-sm text-muted-foreground">{app.companyName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                            {app.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedApplication(app)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Follow-ups */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Follow-ups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboard.upcomingFollowUps?.slice(0, 3).map((followUp: any) => (
                      <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{followUp.positionTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              {followUp.companyName} • {format(new Date(followUp.scheduledDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Send
                        </Button>
                      </div>
                    ))}
                    {(!dashboard.upcomingFollowUps || dashboard.upcomingFollowUps.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        No upcoming follow-ups
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Fallback Dashboard */
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Stats - Fallback */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">No applications yet</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0%</div>
                    <p className="text-xs text-muted-foreground">Start applying!</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0%</div>
                    <p className="text-xs text-muted-foreground">No interviews yet</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Offer Rate</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0%</div>
                    <p className="text-xs text-muted-foreground">No offers yet</p>
                  </CardContent>
                </Card>
              </div>

              {/* Getting Started Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Add Your First Application</h3>
                        <p className="text-sm text-muted-foreground">Start tracking your job applications to see your progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Sync Your Emails</h3>
                        <p className="text-sm text-muted-foreground">Automatically track responses and communications</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <BarChart className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">View Analytics</h3>
                        <p className="text-sm text-muted-foreground">Get insights into your application performance</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button className="w-full" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Add Application
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Sync Emails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          {applications?.applications?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {applications?.applications?.map((app: Application) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{app.positionTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {app.companyName}
                        {app.location && (
                          <>
                            <MapPin className="w-4 h-4 ml-3 mr-1" />
                            {app.location}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[app.status as keyof typeof statusColors]}>
                        {app.status}
                      </Badge>
                      <Badge variant="outline" className={priorityColors[app.priorityScore > 70 ? 'high' : app.priorityScore > 40 ? 'medium' : 'low' as keyof typeof priorityColors]}>
                        Priority: {app.priorityScore}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Applied:</span>
                      <span>{format(new Date(app.applicationDate), 'MMM d, yyyy')}</span>
                    </div>
                    
                    {app.salary && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Salary:</span>
                        <span className="font-medium">{app.salary}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Source:</span>
                      <span>{app.source}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, 'screening')}
                        disabled={updateStatusMutation.isPending}
                      >
                        Mark as Screening
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(app.id, 'interview')}
                        disabled={updateStatusMutation.isPending}
                      >
                        Mark as Interview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePrediction(app.id)}
                        disabled={generatePredictionMutation.isPending}
                      >
                        Generate Prediction
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          ) : (
            /* Applications Empty State */
            <div className="space-y-6">
              {/* What You'll See Here */}
              <Card>
                <CardHeader>
                  <CardTitle>What You'll See Here</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Application Details</h3>
                          <p className="text-sm text-muted-foreground">
                            Position titles, company names, application dates, and status tracking
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Badge className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Status Management</h3>
                          <p className="text-sm text-muted-foreground">
                            Track progress from applied to screening, interviews, and offers
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Priority Scoring</h3>
                          <p className="text-sm text-muted-foreground">
                            AI-powered priority scores to help you focus on high-value opportunities
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Smart Actions</h3>
                          <p className="text-sm text-muted-foreground">
                            Quick actions to update status and generate outcome predictions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Search className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">1. Find Jobs</h3>
                        <p className="text-sm text-muted-foreground">
                          Use the Job Search feature to find relevant positions and save interesting opportunities
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Plus className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">2. Add Applications</h3>
                        <p className="text-sm text-muted-foreground">
                          Manually add applications or import from job boards to start tracking
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">3. Track Progress</h3>
                        <p className="text-sm text-muted-foreground">
                          Update application status and set up follow-up reminders
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              {/* Application Pipeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.stats.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={statusColors[status as keyof typeof statusColors]}>
                            {status}
                          </Badge>
                          <span className="text-sm">{count} applications</span>
                        </div>
                        <div className="w-32">
                          <Progress 
                            value={(count / analytics.stats.totalApplications) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(analytics.stats.responseRate)}%</div>
                    <Progress value={analytics.stats.responseRate} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Interview Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(analytics.stats.interviewRate)}%</div>
                    <Progress value={analytics.stats.interviewRate} className="mt-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Offer Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(analytics.stats.offerRate)}%</div>
                    <Progress value={analytics.stats.offerRate} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.suggestions?.map((suggestion, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{suggestion.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {suggestion.description}
                            </p>
                          </div>
                          <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <ul className="mt-3 space-y-1">
                          {suggestion.actionItems?.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-sm text-muted-foreground">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Analytics Empty State */
            <div className="space-y-6">
              {/* What You'll See Here */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Analytics Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Track Your Job Search Performance</h3>
                      <p className="text-muted-foreground mb-6">
                        Get detailed insights and analytics once you start adding applications
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-primary">Key Metrics You'll Track</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Response Rate - How often companies respond to your applications</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Interview Rate - Percentage of applications that lead to interviews</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm">Offer Rate - Applications that result in job offers</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">Application Pipeline - Track progress through each stage</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-primary">Smart Insights</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Target className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Personalized optimization suggestions</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Best times to apply and follow up</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Industry and role-specific benchmarks</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Lightbulb className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">AI-powered improvement recommendations</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Analytics Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sample Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg opacity-60">
                        <div className="text-2xl font-bold text-muted-foreground">--</div>
                        <p className="text-sm text-muted-foreground">Response Rate</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg opacity-60">
                        <div className="text-2xl font-bold text-muted-foreground">--</div>
                        <p className="text-sm text-muted-foreground">Interview Rate</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg opacity-60">
                        <div className="text-2xl font-bold text-muted-foreground">--</div>
                        <p className="text-sm text-muted-foreground">Offer Rate</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        This dashboard will populate with real data as you add applications
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Start */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Get Started with Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">1. Add Applications</h3>
                        <p className="text-sm text-muted-foreground">Start by adding your job applications with company and position details</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <RefreshCw className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">2. Update Status</h3>
                        <p className="text-sm text-muted-foreground">Keep your application status updated as you progress through the hiring process</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">3. Review Insights</h3>
                        <p className="text-sm text-muted-foreground">Get personalized analytics and optimization suggestions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="follow-ups" className="space-y-6">
          {dashboard?.upcomingFollowUps?.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Follow-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.upcomingFollowUps?.map((followUp: any) => (
                    <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{followUp.positionTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            {followUp.companyName} • {format(new Date(followUp.scheduledDate), 'MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Type: {followUp.followUpType}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">
                          Send Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Follow-ups Empty State */
            <div className="space-y-6">
              {/* Main Follow-ups Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Follow-up Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Smart Follow-up System</h3>
                      <p className="text-muted-foreground mb-6">
                        Automated reminders and AI-powered follow-up messages to keep your applications active
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-primary">Follow-up Types</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Thank You Follow-up - Send within 24 hours after application</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Status Update - Check application status after 1-2 weeks</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">Interest Reconfirmation - Follow up after 3-4 weeks</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm">Interview Follow-up - Thank you note after interviews</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-primary">AI-Powered Features</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Personalized message templates</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Optimal timing recommendations</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Company-specific customization</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Automated scheduling and reminders</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Follow-up Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-primary">Timing Guidelines</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="font-medium text-sm">Application Submission</div>
                            <div className="text-xs text-muted-foreground">Send thank you within 24 hours</div>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="font-medium text-sm">First Follow-up</div>
                            <div className="text-xs text-muted-foreground">Wait 1-2 weeks, then check status</div>
                          </div>
                          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="font-medium text-sm">Second Follow-up</div>
                            <div className="text-xs text-muted-foreground">After 3-4 weeks, reconfirm interest</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-primary">Message Tips</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium">Keep it Brief</div>
                              <div className="text-xs text-muted-foreground">2-3 sentences maximum</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium">Add Value</div>
                              <div className="text-xs text-muted-foreground">Include relevant updates or insights</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium">Be Professional</div>
                              <div className="text-xs text-muted-foreground">Use formal tone and proper grammar</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Follow-up Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sample Follow-up Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Thank You Follow-up</h4>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                          "Thank you for considering my application for the [Position] role. I'm excited about the opportunity to contribute to [Company]. I look forward to hearing from you."
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Status Update</h4>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                          "I wanted to follow up on my application for the [Position] role. I remain very interested in the opportunity and would welcome the chance to discuss my qualifications further."
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        AI will customize these templates based on your specific applications and company research
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Get Started */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Get Started with Follow-ups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">1. Add Your Applications</h3>
                        <p className="text-sm text-muted-foreground">
                          Start by adding applications to enable automated follow-up scheduling
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">2. Configure Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          Set your follow-up preferences and customize message templates
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Send className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">3. Let AI Handle the Rest</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders and AI-generated follow-up messages at optimal times
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button className="w-full" size="lg">
                      <FileText className="w-4 h-4 mr-2" />
                      Add Application
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}