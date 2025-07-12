import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Star, 
  Plus, 
  ArrowRight,
  Building,
  MapPin,
  Clock,
  Users,
  Target,
  FileText,
  Video,
  DollarSign,
  Zap,
  Bell,
  Settings
} from "lucide-react";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

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

  const { data: applicationStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/applications/stats"],
    retry: false,
    enabled: isAuthenticated,
    meta: {
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
      }
    }
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/applications"],
    retry: false,
    enabled: isAuthenticated,
    meta: {
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
      }
    }
  });

  const { data: recommendations } = useQuery({
    queryKey: ["/api/jobs/recommendations"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    retry: false,
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Applications",
      value: applicationStats?.totalApplications || 0,
      icon: Briefcase,
      color: "bg-gradient-to-r from-purple-500 to-blue-500",
      textColor: "text-white"
    },
    {
      title: "Interviews Scheduled",
      value: applicationStats?.interviewCount || 0,
      icon: Calendar,
      color: "bg-white dark:bg-gray-800",
      textColor: "text-green-600"
    },
    {
      title: "Response Rate",
      value: `${applicationStats?.responseRate || 0}%`,
      icon: TrendingUp,
      color: "bg-white dark:bg-gray-800",
      textColor: "text-blue-600"
    },
    {
      title: "Avg. Match Score",
      value: "92%", // This would come from AI analysis
      icon: Star,
      color: "bg-white dark:bg-gray-800",
      textColor: "text-purple-600"
    }
  ];

  const aiRecommendations = [
    {
      type: "resume",
      title: "Optimize Your Resume",
      description: 'Add "React" and "Node.js" to increase match rate by 15%',
      icon: FileText,
      color: "purple",
      action: "Apply Suggestion"
    },
    {
      type: "interview",
      title: "Interview Prep",
      description: "Practice common PM questions for TechCorp interview",
      icon: Video,
      color: "blue",
      action: "Start Practice"
    },
    {
      type: "salary",
      title: "Salary Negotiation",
      description: "Market data shows you can negotiate 20% higher",
      icon: DollarSign,
      color: "green",
      action: "View Analysis"
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "interview":
        return "default";
      case "offer":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview":
        return "text-green-600";
      case "offer":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.firstName || "there"}!
            </h1>
            <p className="text-muted-foreground mt-2">Here's your job search progress</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className={`${stat.color} ${stat.textColor === "text-white" ? "text-white" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${stat.textColor === "text-white" ? "text-purple-100" : "text-muted-foreground"}`}>
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.textColor === "text-white" ? "text-purple-200" : stat.textColor.replace("text-", "text-") + " opacity-60"}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Applications
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((application: any) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{application.job?.title || "Job Title"}</p>
                          <p className="text-sm text-muted-foreground">{application.job?.company || "Company"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadgeVariant(application.status)}>
                          {application.status || "applied"}
                        </Badge>
                        {application.matchScore && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Match: {application.matchScore}%
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications yet</p>
                  <Button className="mt-4" size="sm">
                    Start Applying
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  const colorClasses = {
                    purple: "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/20 dark:to-blue-950/20",
                    blue: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/20 dark:to-indigo-950/20",
                    green: "bg-gradient-to-r from-green-50 to-teal-50 border-green-200 dark:from-green-950/20 dark:to-teal-950/20"
                  };
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${colorClasses[rec.color as keyof typeof colorClasses]}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 bg-${rec.color}-500 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold mb-1">{rec.title}</p>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <Button variant="link" className={`text-${rec.color}-600 p-0 h-auto`}>
                            {rec.action} <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Recommended Jobs
              </span>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.slice(0, 4).map((job: any, index: number) => (
                  <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">{job.title}</h3>
                          <p className="text-muted-foreground mb-2">{job.company}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            {job.salaryMin && (
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                ${job.salaryMin?.toLocaleString()}+
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-semibold text-green-600">
                            {job.matchScore || Math.floor(Math.random() * 20) + 80}% Match
                          </span>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {job.description?.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.slice(0, 3).map((skill: string, skillIndex: number) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No job recommendations available</p>
                <p className="text-sm text-muted-foreground mt-2">Complete your profile to get personalized recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Job Search Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Profile Completeness</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Add skills and experience to reach 100%</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Resume Optimization</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Great! Your resume is well optimized</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Interview Readiness</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Practice more to improve your score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
