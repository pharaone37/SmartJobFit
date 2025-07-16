import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import JobSearchFilters from '@/components/JobSearchFilters';
import type { JobSearchFilters as JobSearchFiltersType } from '@/components/JobSearchFilters';
import ApplicationTracker from '@/pages/ApplicationTracker';
import SalaryIntelligence from '@/components/SalaryIntelligence';
import CareerCoaching from '@/components/CareerCoaching';
import JobAlerts from '@/components/JobAlerts';
import { AutoApply } from '@/components/AutoApply';
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
  BookmarkCheck,
  Bell,
  Home,
  Settings,
  HelpCircle,
  Activity,
  PieChart,
  Zap,
  Menu,
  X,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  StopCircle,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Rocket,
  Shield,
  Globe
} from 'lucide-react';

export default function ImprovedDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState<JobSearchFiltersType>({});
  const [isSearching, setIsSearching] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickActions, setQuickActions] = useState(false);

  // Enhanced data with better UX focus
  const data = {
    jobSearches: 24,
    applications: 12,
    interviews: 3,
    resumeScore: 94,
    profileCompletion: 87,
    networkConnections: 156,
    skillsAssessed: 8,
    careersExplored: 3,
    automationActive: 2,
    successRate: 68
  };

  // Navigation items with better organization
  const navigationItems = [
    { id: 'overview', label: 'Home', icon: Home, color: 'text-blue-500', description: 'Dashboard overview' },
    { id: 'job-search', label: 'Job Search', icon: Search, color: 'text-green-500', description: 'Find opportunities' },
    { id: 'applications', label: 'Applications', icon: FileText, color: 'text-purple-500', description: 'Track applications' },
    { id: 'auto-apply', label: 'Auto Apply', icon: Zap, color: 'text-orange-500', description: 'Automate applications' },
    { id: 'resume', label: 'Resume', icon: Upload, color: 'text-pink-500', description: 'Optimize your resume' },
    { id: 'interviews', label: 'Interviews', icon: MessageSquare, color: 'text-indigo-500', description: 'Practice & prepare' },
    { id: 'salary', label: 'Salary Intel', icon: DollarSign, color: 'text-emerald-500', description: 'Salary insights' },
    { id: 'career', label: 'Career Coach', icon: Award, color: 'text-red-500', description: 'Career development' },
    { id: 'alerts', label: 'Job Alerts', icon: Bell, color: 'text-yellow-500', description: 'Smart notifications' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-cyan-500', description: 'Performance metrics' }
  ];

  // Quick actions for better workflow
  const quickActionItems = [
    { label: 'Upload Resume', icon: Upload, action: () => setActiveTab('resume') },
    { label: 'Search Jobs', icon: Search, action: () => setActiveTab('job-search') },
    { label: 'Start Interview', icon: PlayCircle, action: () => setActiveTab('interviews') },
    { label: 'Quick Apply', icon: Zap, action: () => setActiveTab('auto-apply') },
    { label: 'Check Salary', icon: DollarSign, action: () => setActiveTab('salary') },
    { label: 'Career Goals', icon: Target, action: () => setActiveTab('career') }
  ];

  // Enhanced activity data
  const recentActivity = [
    { id: 1, type: 'application', title: 'Applied to Senior Engineer at TechCorp', time: '2 hours ago', status: 'pending', icon: FileText },
    { id: 2, type: 'interview', title: 'Interview scheduled with StartupXYZ', time: '1 day ago', status: 'scheduled', icon: Calendar },
    { id: 3, type: 'resume', title: 'Resume optimized for ATS', time: '2 days ago', status: 'completed', icon: Upload },
    { id: 4, type: 'automation', title: 'Auto-apply sent 3 applications', time: '3 days ago', status: 'active', icon: Zap },
    { id: 5, type: 'salary', title: 'Salary research completed', time: '4 days ago', status: 'completed', icon: DollarSign }
  ];

  // Enhanced job matching with better data
  const matchingJobs = [
    { id: 1, title: 'Senior Software Engineer', company: 'TechCorp', match: 95, location: 'San Francisco, CA', salary: '$120k - $180k', type: 'Full-time', urgent: true, remote: true },
    { id: 2, title: 'Product Manager', company: 'StartupXYZ', match: 88, location: 'New York, NY', salary: '$110k - $160k', type: 'Full-time', urgent: false, remote: false },
    { id: 3, title: 'Full Stack Developer', company: 'InnovateCorp', match: 82, location: 'Remote', salary: '$90k - $130k', type: 'Full-time', urgent: false, remote: true },
    { id: 4, title: 'Technical Lead', company: 'FutureTech', match: 79, location: 'Seattle, WA', salary: '$140k - $200k', type: 'Full-time', urgent: true, remote: false }
  ];

  // Progress indicators for better UX
  const progressIndicators = [
    { label: 'Profile Completion', value: data.profileCompletion, color: 'bg-blue-500' },
    { label: 'Resume Score', value: data.resumeScore, color: 'bg-green-500' },
    { label: 'Interview Readiness', value: 76, color: 'bg-purple-500' },
    { label: 'Network Growth', value: 83, color: 'bg-orange-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchBadgeColor = (match: number) => {
    if (match >= 90) return 'bg-green-100 text-green-800';
    if (match >= 80) return 'bg-blue-100 text-blue-800';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">SmartJobFit</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Career Platform</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Search */}
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search jobs, companies..."
                    className="pl-10 pr-4 py-2 w-80 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <Sheet open={quickActions} onOpenChange={setQuickActions}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Quick Actions
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Quick Actions</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-3 mt-6">
                    {quickActionItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="outline"
                        className="justify-start gap-3 h-12"
                        onClick={() => {
                          item.action();
                          setQuickActions(false);
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {data.profileCompletion}% Complete
                  </p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback>
                    {user?.firstName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 bg-white/50 dark:bg-slate-800/50 p-1 h-auto">
                {navigationItems.slice(0, 5).map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex flex-col items-center gap-1 px-3 py-2 text-xs"
                  >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="hidden lg:flex">
                <TabsList className="grid grid-cols-5 gap-1 bg-white/50 dark:bg-slate-800/50 p-1 h-auto">
                  {navigationItems.slice(5).map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="flex flex-col items-center gap-1 px-3 py-2 text-xs"
                    >
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <span>{item.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* Overview Tab - Enhanced */}
            <TabsContent value="overview" className="space-y-6">
              {/* Welcome Section */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Welcome back, {user?.firstName || 'User'}!
                      </h2>
                      <p className="text-slate-600 dark:text-slate-300 mt-2">
                        Your career journey continues. Here's what's happening today.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Success Rate</p>
                        <p className="text-2xl font-bold text-green-600">{data.successRate}%</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {progressIndicators.map((indicator) => (
                  <Card key={indicator.label} className="border-0 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {indicator.label}
                        </p>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {indicator.value}%
                        </span>
                      </div>
                      <Progress value={indicator.value} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('job-search')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Job Searches</CardTitle>
                    <Search className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.jobSearches}</div>
                    <p className="text-xs text-muted-foreground">+2 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('applications')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Applications</CardTitle>
                    <FileText className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.applications}</div>
                    <p className="text-xs text-muted-foreground">+5 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('interviews')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                    <MessageSquare className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.interviews}</div>
                    <p className="text-xs text-muted-foreground">+1 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('auto-apply')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Auto-Apply</CardTitle>
                    <Zap className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.automationActive}</div>
                    <p className="text-xs text-muted-foreground">Active profiles</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Matched Jobs - Enhanced */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      AI Matched Jobs
                      <Badge className="ml-auto">Live</Badge>
                    </CardTitle>
                    <CardDescription>
                      Personalized recommendations updated in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-4">
                        {matchingJobs.map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{job.title}</h3>
                                <Badge className={getMatchBadgeColor(job.match)}>
                                  {job.match}% match
                                </Badge>
                                {job.urgent && (
                                  <Badge className="bg-red-100 text-red-800">
                                    Urgent
                                  </Badge>
                                )}
                                {job.remote && (
                                  <Badge className="bg-green-100 text-green-800">
                                    Remote
                                  </Badge>
                                )}
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
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => setSavedJobs(prev => [...prev, job.id])}>
                                {savedJobs.includes(job.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                              </Button>
                              <Button size="sm" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Apply
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Enhanced Activity Feed */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <activity.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(activity.status)} variant="outline">
                                  {activity.status}
                                </Badge>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Job Search Tab */}
            <TabsContent value="job-search">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-500" />
                    AI-Powered Job Search
                  </CardTitle>
                  <CardDescription>
                    Find your perfect job across 15+ job boards with intelligent matching
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobSearchFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onSearch={() => setIsSearching(true)}
                    isSearching={isSearching}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs with enhanced components */}
            <TabsContent value="applications">
              <ApplicationTracker />
            </TabsContent>

            <TabsContent value="auto-apply">
              <AutoApply userId={user?.id || ''} />
            </TabsContent>

            <TabsContent value="salary">
              <SalaryIntelligence userId={user?.id || ''} />
            </TabsContent>

            <TabsContent value="career">
              <CareerCoaching userId={user?.id || ''} />
            </TabsContent>

            <TabsContent value="alerts">
              <JobAlerts />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <div className="text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}