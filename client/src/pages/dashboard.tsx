import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  NotebookPen, 
  Calendar, 
  BarChart3, 
  Star,
  Plus,
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap,
  BookOpen
} from "lucide-react";
import { Link } from "wouter";
import { useJobApplications, useJobApplicationStats, useJobRecommendations } from "@/hooks/useJobs";
import { useAuth } from "@/hooks/useAuth";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ApplicationList } from "@/components/dashboard/application-list";
import { AIRecommendations } from "@/components/dashboard/ai-recommendations";
import { analyticsApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: applications, isLoading: applicationsLoading } = useJobApplications();
  const { data: stats, isLoading: statsLoading } = useJobApplicationStats();
  const { data: recommendations, isLoading: recommendationsLoading } = useJobRecommendations(5);
  
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
    queryFn: analyticsApi.getDashboard,
    staleTime: 60 * 1000, // 1 minute
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-96">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const weeklyApplications = analytics?.weeklyApplications || [5, 8, 12, 6, 9, 15, 11];
  const currentWeekTotal = weeklyApplications[weeklyApplications.length - 1] || 0;
  const previousWeekTotal = weeklyApplications[weeklyApplications.length - 2] || 0;
  const weeklyTrend = previousWeekTotal > 0 ? ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your job search progress and latest opportunities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="button-gradient" asChild>
              <Link href="/jobs">
                <Plus className="h-4 w-4 mr-2" />
                Find Jobs
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resume">
                <Target className="h-4 w-4 mr-2" />
                Optimize Resume
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value={statsLoading ? "..." : (stats?.totalApplications || 0)}
            description="Jobs applied to"
            icon={NotebookPen}
            trend={{
              value: weeklyTrend,
              label: "vs last week",
              isPositive: weeklyTrend >= 0
            }}
            gradient="from-purple-500 to-blue-500"
          />
          
          <StatsCard
            title="Interviews Scheduled"
            value={statsLoading ? "..." : (stats?.interviews || 0)}
            description="Upcoming interviews"
            icon={Calendar}
            progress={{
              value: stats?.interviews || 0,
              max: Math.max(stats?.totalApplications || 1, 10),
              label: "Interview rate"
            }}
            gradient="from-green-500 to-teal-500"
          />
          
          <StatsCard
            title="Response Rate"
            value={analyticsLoading ? "..." : `${analytics?.responseRate || 0}%`}
            description="Applications with responses"
            icon={BarChart3}
            trend={{
              value: 12,
              label: "above average",
              isPositive: true
            }}
            gradient="from-blue-500 to-indigo-500"
          />
          
          <StatsCard
            title="Average Match"
            value={analyticsLoading ? "..." : `${analytics?.averageMatchScore || 0}%`}
            description="Job compatibility score"
            icon={Star}
            trend={{
              value: 8,
              label: "improvement",
              isPositive: true
            }}
            gradient="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            {applicationsLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ApplicationList 
                applications={applications || []} 
                maxItems={5}
              />
            )}
          </div>

          {/* AI Recommendations */}
          <div>
            {recommendationsLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 rounded-lg bg-muted">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-full mb-3" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <AIRecommendations maxItems={4} />
            )}
          </div>
        </div>

        {/* Job Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recommended Jobs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Recommended Jobs</span>
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/jobs">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recommendationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(recommendations || []).slice(0, 3).map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                        </div>
                        {job.matchScore && (
                          <Badge variant="outline">
                            {job.matchScore}% Match
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {job.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {job.skills?.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/jobs?q=${encodeURIComponent(job.title)}`}>
                            View Job
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start h-auto p-4" variant="outline" asChild>
                <Link href="/interview">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Practice Interviews</p>
                      <p className="text-sm text-muted-foreground">AI-powered mock interviews</p>
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button className="w-full justify-start h-auto p-4" variant="outline" asChild>
                <Link href="/resume">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Optimize Resume</p>
                      <p className="text-sm text-muted-foreground">AI resume analysis & optimization</p>
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button className="w-full justify-start h-auto p-4" variant="outline" asChild>
                <Link href="/analytics">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">View Analytics</p>
                      <p className="text-sm text-muted-foreground">Detailed job search insights</p>
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button className="w-full justify-start h-auto p-4" variant="outline">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Salary Insights</p>
                    <p className="text-sm text-muted-foreground">Market data & negotiation tips</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Resume optimized for "Senior Product Manager" role</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Applied to TechCorp Inc. - Product Manager position</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed mock interview session</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
