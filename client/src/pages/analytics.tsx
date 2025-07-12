import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  DollarSign,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
  Equal,
  Download,
  Filter
} from "lucide-react";
import { analyticsApi } from "@/lib/api";
import { useJobApplicationStats } from "@/hooks/useJobs";
import { useQuery } from "@tanstack/react-query";

export default function Analytics() {
  const { data: basicStats, isLoading: basicStatsLoading } = useJobApplicationStats();
  
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
    queryFn: analyticsApi.getDashboard,
    staleTime: 60 * 1000,
  });

  const isLoading = basicStatsLoading || analyticsLoading;

  // Mock additional analytics data for comprehensive view
  const applicationTrends = [
    { week: 'Week 1', applications: 5, interviews: 1, offers: 0 },
    { week: 'Week 2', applications: 8, interviews: 2, offers: 0 },
    { week: 'Week 3', applications: 12, interviews: 3, offers: 1 },
    { week: 'Week 4', applications: 6, interviews: 2, offers: 0 },
    { week: 'Week 5', applications: 9, interviews: 4, offers: 1 },
    { week: 'Week 6', applications: 15, interviews: 5, offers: 2 },
    { week: 'Week 7', applications: 11, interviews: 3, offers: 1 }
  ];

  const responseRates = [
    { source: 'LinkedIn', rate: 78, applications: 25 },
    { source: 'Indeed', rate: 45, applications: 18 },
    { source: 'Company Sites', rate: 89, applications: 12 },
    { source: 'AngelList', rate: 62, applications: 8 },
    { source: 'Glassdoor', rate: 34, applications: 15 }
  ];

  const skillDemand = [
    { skill: 'Product Management', demand: 95, growth: 12 },
    { skill: 'Data Analysis', demand: 88, growth: 8 },
    { skill: 'Leadership', demand: 82, growth: -2 },
    { skill: 'Strategic Planning', demand: 79, growth: 15 },
    { skill: 'Agile/Scrum', demand: 76, growth: 5 },
    { skill: 'User Research', demand: 71, growth: 18 }
  ];

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Equal className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Job Search Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and optimize your job search strategy
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Applications</p>
                  <p className="text-2xl font-bold">{basicStats?.totalApplications || 0}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(12)}
                    <span className={`text-sm ${getTrendColor(12)}`}>+12% this week</span>
                  </div>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Response Rate</p>
                  <p className="text-2xl font-bold">{analytics?.responseRate || 0}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(8)}
                    <span className={`text-sm ${getTrendColor(8)}`}>+8% vs average</span>
                  </div>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Interview Rate</p>
                  <p className="text-2xl font-bold">{analytics?.interviewRate || 0}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(15)}
                    <span className={`text-sm ${getTrendColor(15)}`}>+15% improvement</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Match Score</p>
                  <p className="text-2xl font-bold">{analytics?.averageMatchScore || 0}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(5)}
                    <span className={`text-sm ${getTrendColor(5)}`}>+5% this month</span>
                  </div>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Application Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Application Trends</CardTitle>
              <CardDescription>Weekly application, interview, and offer activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationTrends.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-sm">{week.week}</span>
                      <div className="flex space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span>{week.applications} apps</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>{week.interviews} interviews</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>{week.offers} offers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Rates by Source */}
          <Card>
            <CardHeader>
              <CardTitle>Response Rates by Source</CardTitle>
              <CardDescription>Performance across different job boards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responseRates.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {source.applications} applications
                        </span>
                        <Badge 
                          variant={source.rate >= 70 ? "default" : source.rate >= 50 ? "secondary" : "destructive"}
                        >
                          {source.rate}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${source.rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Analysis and Salary Insights */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Skill Demand Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Demand Analysis</CardTitle>
              <CardDescription>Market demand for your skills and trending areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillDemand.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{skill.skill}</span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(skill.growth)}
                          <span className={`text-sm ${getTrendColor(skill.growth)}`}>
                            {skill.growth > 0 ? '+' : ''}{skill.growth}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.demand}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {skill.demand}% market demand
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Salary Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Insights</CardTitle>
              <CardDescription>Market salary data for your role and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 card-gradient rounded-lg border border-green-200">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">
                  ${analytics?.salaryInsights?.min?.toLocaleString() || '120,000'} - ${analytics?.salaryInsights?.max?.toLocaleString() || '180,000'}
                </p>
                <p className="text-sm text-green-600 mt-1">Salary Range for Your Role</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-lg font-bold">
                    ${analytics?.salaryInsights?.average?.toLocaleString() || '145,000'}
                  </p>
                  <p className="text-sm text-muted-foreground">Market Average</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-lg font-bold text-green-600">
                      {analytics?.salaryInsights?.marketTrend === 'increasing' ? '+8%' : '0%'}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">Year over Year</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Negotiation Tip
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Based on your experience and skills, you're positioned to negotiate in the 75th percentile. 
                  Consider highlighting your product management and data analysis expertise.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Key insights and recommendations for your job search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 card-gradient rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-800">Strengths</h4>
                </div>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• High response rate (67% vs 45% avg)</li>
                  <li>• Strong match scores (92% avg)</li>
                  <li>• Consistent application activity</li>
                </ul>
              </div>

              <div className="p-4 card-gradient-blue rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-800">Opportunities</h4>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Focus on LinkedIn applications</li>
                  <li>• Improve technical interview prep</li>
                  <li>• Target Series B+ startups</li>
                </ul>
              </div>

              <div className="p-4 card-gradient-green rounded-lg border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-800">Next Steps</h4>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Practice system design questions</li>
                  <li>• Update resume with recent metrics</li>
                  <li>• Follow up on pending applications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
