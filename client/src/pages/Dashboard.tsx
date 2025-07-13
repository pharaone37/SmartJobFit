import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import JobSearchFilters from '@/components/JobSearchFilters';
import type { JobSearchFilters as JobSearchFiltersType } from '@/components/JobSearchFilters';
import { 
  Search, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Calendar,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Star,
  Upload,
  Eye,
  Edit,
  Plus,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Building,
  ExternalLink,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<JobSearchFiltersType>({});
  const [isSearching, setIsSearching] = useState(false);

  // Use static data for now
  const dashboardData = null;
  const recommendedJobs = null;
  const userStats = null;
  const dashboardLoading = false;
  const jobsLoading = false;
  const statsLoading = false;

  // Default data if API calls fail
  const defaultData = {
    jobSearches: 23,
    applications: 12,
    interviews: 3,
    resumeScore: 85,
    profileStrength: 92,
    matchingJobs: 47,
    plan: user?.subscriptionPlan || 'free'
  };

  const data = dashboardData || defaultData;

  const recentActivity = [
    { id: 1, type: 'job_search', title: 'Software Engineer at TechCorp', time: '2 hours ago' },
    { id: 2, type: 'resume_update', title: 'Updated resume skills section', time: '1 day ago' },
    { id: 3, type: 'interview', title: 'Interview scheduled with StartupXYZ', time: '2 days ago' },
    { id: 4, type: 'application', title: 'Applied to Product Manager role', time: '3 days ago' },
  ];

  const matchingJobs = recommendedJobs || [
    { id: 1, title: 'Senior Software Engineer', company: 'TechCorp', match: 95, location: 'San Francisco, CA', salary: '$120k - $180k', type: 'Full-time' },
    { id: 2, title: 'Product Manager', company: 'StartupXYZ', match: 88, location: 'New York, NY', salary: '$110k - $160k', type: 'Full-time' },
    { id: 3, title: 'Full Stack Developer', company: 'WebCorp', match: 82, location: 'Remote', salary: '$100k - $140k', type: 'Full-time' },
    { id: 4, title: 'Data Scientist', company: 'DataTech', match: 78, location: 'Boston, MA', salary: '$130k - $190k', type: 'Full-time' },
  ];

  const resumes = [
    { id: 1, title: 'Senior Software Engineer Resume', score: 85, lastUpdated: '2 days ago', isActive: true },
    { id: 2, title: 'Product Manager Resume', score: 78, lastUpdated: '1 week ago', isActive: false },
    { id: 3, title: 'Full Stack Developer Resume', score: 92, lastUpdated: '3 days ago', isActive: false },
  ];

  const interviews = [
    { id: 1, company: 'TechCorp', position: 'Senior Software Engineer', date: '2024-01-15', time: '10:00 AM', type: 'Technical' },
    { id: 2, company: 'StartupXYZ', position: 'Product Manager', date: '2024-01-18', time: '2:00 PM', type: 'Behavioral' },
    { id: 3, company: 'WebCorp', position: 'Full Stack Developer', date: '2024-01-20', time: '11:30 AM', type: 'System Design' },
  ];

  const handleJobSearch = async () => {
    setIsSearching(true);
    try {
      // API call would go here
      console.log('Searching with filters:', filters);
      setTimeout(() => setIsSearching(false), 2000);
    } catch (error) {
      console.error('Search failed:', error);
      setIsSearching(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'job_search': return <Search className="h-4 w-4" />;
      case 'resume_update': return <FileText className="h-4 w-4" />;
      case 'interview': return <MessageSquare className="h-4 w-4" />;
      case 'application': return <Briefcase className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600';
    if (match >= 80) return 'text-blue-600';
    if (match >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBadgeColor = (match: number) => {
    if (match >= 90) return 'bg-green-100 text-green-800';
    if (match >= 80) return 'bg-blue-100 text-blue-800';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (dashboardLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.firstName || 'Job Seeker'}!</h1>
            <p className="text-muted-foreground">Track your progress and discover new opportunities</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Quick Apply
          </Button>
        </div>

        {/* Overview Content */}
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Job Searches</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.jobSearches}</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.applications}</div>
                  <p className="text-xs text-muted-foreground">+5 from last week</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.interviews}</div>
                  <p className="text-xs text-muted-foreground">+1 from last week</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Match Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.resumeScore}%</div>
                  <p className="text-xs text-muted-foreground">Resume strength</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Matched Jobs */}
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    AI Matched Jobs
                  </CardTitle>
                  <CardDescription>
                    Personalized job recommendations based on your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matchingJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge className={getMatchBadgeColor(job.match)}>
                              {job.match}% match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {job.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
