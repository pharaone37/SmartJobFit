import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Building, MapPin, DollarSign, FileText, Mail, Phone, Users, Lightbulb, BarChart } from "lucide-react";
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
          )}
        </TabsContent>

        <TabsContent value="follow-ups" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}