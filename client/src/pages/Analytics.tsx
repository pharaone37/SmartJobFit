import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar,
  DollarSign,
  Clock,
  Star,
  Award,
  Briefcase,
  Eye,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function Analytics() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Sample analytics data (fallback)
  const sampleApplicationStats = {
    totalApplications: 45,
    responseRate: 32,
    interviewRate: 18,
    offerRate: 8,
    avgResponseTime: 7,
    topSkills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    monthlyTrends: [
      { month: "Jan", applications: 12, responses: 4, interviews: 2, offers: 1 },
      { month: "Feb", applications: 15, responses: 5, interviews: 3, offers: 1 },
      { month: "Mar", applications: 18, responses: 7, interviews: 4, offers: 2 }
    ]
  };

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

  // Use static data for now
  const applicationStats = sampleApplicationStats;
  const applications = [];
  const interviewData = [];
  const statsLoading = false;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Applications",
      value: applicationStats?.totalApplications || 0,
      change: "+12%",
      trend: "up",
      icon: Briefcase,
      color: "blue"
    },
    {
      title: "Response Rate",
      value: `${applicationStats?.responseRate || 0}%`,
      change: "+5%",
      trend: "up",
      icon: MessageSquare,
      color: "green"
    },
    {
      title: "Interview Rate",
      value: `${applicationStats?.interviewRate || 0}%`,
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "purple"
    },
    {
      title: "Avg. Match Score",
      value: "87%",
      change: "+3%",
      trend: "up",
      icon: Target,
      color: "orange"
    }
  ];

  const jobSearchInsights = [
    {
      title: "Peak Application Days",
      value: "Tue, Wed",
      description: "Best days for applying to jobs",
      icon: Calendar
    },
    {
      title: "Top Skills in Demand",
      value: "React, Python, AWS",
      description: "Most requested skills in your applications",
      icon: Star
    },
    {
      title: "Avg. Salary Range",
      value: "$85k - $120k",
      description: "Based on your recent applications",
      icon: DollarSign
    },
    {
      title: "Time to Response",
      value: "5.2 days",
      description: "Average time to hear back from employers",
      icon: Clock
    }
  ];

  const applicationsByStatus = [
    { status: "Applied", count: 15, percentage: 60, color: "bg-blue-500" },
    { status: "Under Review", count: 6, percentage: 24, color: "bg-yellow-500" },
    { status: "Interview", count: 3, percentage: 12, color: "bg-green-500" },
    { status: "Rejected", count: 1, percentage: 4, color: "bg-red-500" }
  ];

  const topCompanies = [
    { name: "TechCorp Inc.", applications: 3, response: true },
    { name: "StartupCo", applications: 2, response: true },
    { name: "DataCorp", applications: 2, response: false },
    { name: "DesignStudio", applications: 1, response: true },
    { name: "CloudTech", applications: 1, response: false }
  ];

  const skillsAnalysis = [
    { skill: "React", demand: 95, proficiency: 90 },
    { skill: "Python", demand: 88, proficiency: 85 },
    { skill: "JavaScript", demand: 92, proficiency: 88 },
    { skill: "AWS", demand: 80, proficiency: 70 },
    { skill: "Node.js", demand: 75, proficiency: 82 }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Track your job search progress and optimize your strategy
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{metric.title}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                          <div className="flex items-center mt-1">
                            {metric.trend === "up" ? (
                              <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
                            )}
                            <span className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 bg-${metric.color}-100 dark:bg-${metric.color}-950/20 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Application Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                    Application Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applicationsByStatus.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium">{item.status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{item.count}</span>
                          <div className="w-20">
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Job Search Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Job Search Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobSearchInsights.map((insight, index) => {
                      const Icon = insight.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                          <Icon className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{insight.title}</span>
                              <span className="text-sm font-semibold text-blue-600">{insight.value}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Applications Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsCharts type="timeline" data={applications} />
                </CardContent>
              </Card>

              {/* Top Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Top Applied Companies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCompanies.map((company, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{company.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {company.applications} application{company.applications > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {company.response ? (
                            <Badge variant="default" className="text-xs">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Response
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interview Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    Interview Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
                      <p className="text-sm text-muted-foreground">Overall Interview Score</p>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { skill: "Communication", score: 85 },
                        { skill: "Technical Knowledge", score: 72 },
                        { skill: "Problem Solving", score: 80 },
                        { skill: "Confidence", score: 68 }
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.skill}</span>
                            <span className={item.score >= 80 ? "text-green-600" : item.score >= 60 ? "text-yellow-600" : "text-red-600"}>
                              {item.score}%
                            </span>
                          </div>
                          <Progress value={item.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Skills Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skillsAnalysis.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{skill.skill}</span>
                          <span className="text-muted-foreground">
                            {skill.proficiency}% proficiency
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Market Demand</span>
                            <span>{skill.demand}%</span>
                          </div>
                          <Progress value={skill.demand} className="h-1" />
                          <div className="flex justify-between text-xs">
                            <span>Your Proficiency</span>
                            <span>{skill.proficiency}%</span>
                          </div>
                          <Progress value={skill.proficiency} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Market Insights Tab */}
          <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Salary Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    Salary Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsCharts type="salary" data={applications} />
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-500" />
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Hot Job Markets",
                        value: "San Francisco, Seattle, Austin",
                        change: "+15% job postings",
                        trend: "up"
                      },
                      {
                        title: "Fastest Growing Skills",
                        value: "AI/ML, Cloud Computing, React",
                        change: "+25% demand",
                        trend: "up"
                      },
                      {
                        title: "Remote Work Trend",
                        value: "68% of jobs offer remote options",
                        change: "+12% from last quarter",
                        trend: "up"
                      },
                      {
                        title: "Average Time to Hire",
                        value: "3.2 weeks",
                        change: "-5% faster than last year",
                        trend: "down"
                      }
                    ].map((insight, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                            <p className="text-sm text-blue-600 font-medium mb-1">{insight.value}</p>
                            <div className="flex items-center">
                              {insight.trend === "up" ? (
                                <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                              ) : (
                                <ArrowDown className="w-3 h-3 text-green-500 mr-1" />
                              )}
                              <span className="text-xs text-green-600">{insight.change}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
