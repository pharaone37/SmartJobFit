import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Square, 
  Pause, 
  Settings, 
  BarChart3, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target,
  Brain,
  Zap,
  Filter,
  TrendingUp,
  MessageSquare,
  FileText,
  Award,
  Shield,
  Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AutoApplyProps {
  userId: string;
}

export function AutoApply({ userId }: AutoApplyProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: automationProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['/api/auto-apply/profiles'],
    enabled: !!userId,
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/auto-apply/dashboard'],
    enabled: !!userId,
  });

  const { data: applicationQueue, isLoading: queueLoading } = useQuery({
    queryKey: ['/api/auto-apply/queue'],
    enabled: !!userId,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/auto-apply/analytics'],
    enabled: !!userId,
  });

  // Mutations
  const startAutomation = useMutation({
    mutationFn: async (profileId: string) => {
      return await apiRequest(`/api/auto-apply/start`, 'POST', { profileId });
    },
    onSuccess: () => {
      toast({
        title: "Automation Started",
        description: "Your job application automation is now active!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auto-apply/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start automation",
        variant: "destructive",
      });
    },
  });

  const stopAutomation = useMutation({
    mutationFn: async (profileId: string) => {
      return await apiRequest(`/api/auto-apply/stop`, 'POST', { profileId });
    },
    onSuccess: () => {
      toast({
        title: "Automation Stopped",
        description: "Your job application automation has been stopped.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auto-apply/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to stop automation",
        variant: "destructive",
      });
    },
  });

  const pauseAutomation = useMutation({
    mutationFn: async (profileId: string) => {
      return await apiRequest(`/api/auto-apply/pause`, 'POST', { profileId });
    },
    onSuccess: () => {
      toast({
        title: "Automation Paused",
        description: "Your job application automation has been paused.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auto-apply/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to pause automation",
        variant: "destructive",
      });
    },
  });

  const resumeAutomation = useMutation({
    mutationFn: async (profileId: string) => {
      return await apiRequest(`/api/auto-apply/resume`, 'POST', { profileId });
    },
    onSuccess: () => {
      toast({
        title: "Automation Resumed",
        description: "Your job application automation has been resumed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auto-apply/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resume automation",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'stopped':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'stopped':
        return <Square className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'draft':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (profilesLoading || dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 pb-20 sm:pb-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          <h1 className="text-xl sm:text-3xl font-bold">Auto-Apply AI Agent</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Intelligent job application automation with AI-powered matching and quality control
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-0 h-auto sm:h-10 mb-4 sm:mb-6">
          <TabsTrigger value="dashboard" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Users className="w-4 h-4 sm:w-4 sm:h-4" />
            <span>Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Clock className="w-4 h-4 sm:w-4 sm:h-4" />
            <span>Queue</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
            <Settings className="w-4 h-4 sm:w-4 sm:h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.activeProfiles || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.totalProfiles || 0} total profiles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications Today</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.applicationsToday || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.successRate || 0}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.queueSize || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.processing || 0} processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.qualityScore || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  AI-powered quality metrics
                </p>
              </CardContent>
            </Card>
          </div>

          {automationProfiles && automationProfiles.length > 0 && (
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Active Automation Profiles</h3>
              {automationProfiles.map((profile: any) => (
                <Card key={profile.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(profile.status)}`} />
                        <div>
                          <CardTitle className="text-lg">{profile.name}</CardTitle>
                          <CardDescription>
                            {profile.targetRole} • {profile.platforms?.join(', ')}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getStatusIcon(profile.status)}
                          {profile.status}
                        </Badge>
                        <div className="flex gap-1">
                          {profile.status === 'active' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => pauseAutomation.mutate(profile.id)}
                                disabled={pauseAutomation.isPending}
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => stopAutomation.mutate(profile.id)}
                                disabled={stopAutomation.isPending}
                              >
                                <Square className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {profile.status === 'paused' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resumeAutomation.mutate(profile.id)}
                              disabled={resumeAutomation.isPending}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          {profile.status === 'stopped' && (
                            <Button
                              size="sm"
                              onClick={() => startAutomation.mutate(profile.id)}
                              disabled={startAutomation.isPending}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Applications</div>
                        <div className="text-2xl font-bold">{profile.applicationsCount || 0}</div>
                        <div className="text-xs text-muted-foreground">
                          {profile.successfulApplications || 0} successful
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Match Rate</div>
                        <div className="text-2xl font-bold">{profile.matchRate || 0}%</div>
                        <Progress value={profile.matchRate || 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Last Activity</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.lastActivity ? formatDistanceToNow(new Date(profile.lastActivity), { addSuffix: true }) : 'Never'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {(!automationProfiles || automationProfiles.length === 0) && (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Automation Profiles</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first automation profile to start applying to jobs automatically
                </p>
                <Button onClick={() => setActiveTab('profiles')}>
                  Create Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Profiles</CardTitle>
              <CardDescription>
                Configure AI-powered job application automation profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Profile Management</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage automation profiles for different job types
                </p>
                <Button>
                  <Users className="w-4 h-4 mr-2" />
                  Create New Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Queue</CardTitle>
              <CardDescription>
                Monitor and manage your job application queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {queueLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : applicationQueue && applicationQueue.length > 0 ? (
                <div className="space-y-4">
                  {applicationQueue.map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="font-semibold">{item.jobTitle}</div>
                          <Badge variant="outline">{item.company}</Badge>
                        </div>
                        <Badge className={getApplicationStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {item.location} • {item.jobType}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div>Priority: {item.priority}</div>
                        <div>Match Score: {item.matchScore}%</div>
                        <div>Added: {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Queue Empty</h3>
                  <p className="text-muted-foreground">
                    No applications in queue. Start automation to populate the queue.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Track your automation performance and success metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Total Applications</div>
                    <div className="text-2xl font-bold">{analyticsData?.totalApplications || 0}</div>
                    <div className="text-xs text-muted-foreground">
                      +{analyticsData?.applicationsThisWeek || 0} this week
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Success Rate</div>
                    <div className="text-2xl font-bold">{analyticsData?.successRate || 0}%</div>
                    <Progress value={analyticsData?.successRate || 0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Response Rate</div>
                    <div className="text-2xl font-bold">{analyticsData?.responseRate || 0}%</div>
                    <Progress value={analyticsData?.responseRate || 0} className="h-2" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>
                Configure AI automation parameters and safety controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    AI safety controls ensure high-quality applications and prevent over-automation
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Daily Application Limit</div>
                    <div className="text-2xl font-bold">25</div>
                    <div className="text-xs text-muted-foreground">
                      Prevents over-automation
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Minimum Match Score</div>
                    <div className="text-2xl font-bold">75%</div>
                    <div className="text-xs text-muted-foreground">
                      Quality threshold
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}