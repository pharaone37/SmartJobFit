import { useState, useEffect } from 'react';
import { useAuth, removeAuthToken } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import JobSearchFilters from '@/components/JobSearchFilters';
import type { JobSearchFilters as JobSearchFiltersType } from '@/components/JobSearchFilters';
import ApplicationTracker from '@/pages/ApplicationTracker';
import SalaryIntelligence from '@/components/SalaryIntelligence';
import CareerCoaching from '@/components/CareerCoaching';
import JobAlerts from '@/components/JobAlerts';
import { AutoApply } from '@/components/AutoApply';
import OnboardingTour from '@/components/OnboardingTour';
import { 
  Search, 
  FileText, 
  MessageSquare, 
  MessageCircle,
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
  Play,
  Download,
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
  Globe,
  User,
  CreditCard,
  LogOut
} from 'lucide-react';

export default function ImprovedDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<JobSearchFiltersType>({});
  const { 
    shouldShowTour, 
    closeTour, 
    completeTour, 
    startTour, 
    isNewUser,
    isProfileIncomplete 
  } = useOnboarding();

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = '/';
  };
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
      {/* Mobile-Optimized Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Left Side - Logo and Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">SmartJobFit</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Career Platform</p>
                </div>
              </div>
            </div>

            {/* Right Side - Actions and Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setActiveTab('job-search')}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Desktop Search */}
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search jobs, companies..."
                    className="pl-10 pr-4 py-2 w-60 lg:w-80 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <Sheet open={quickActions} onOpenChange={setQuickActions}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 px-2 sm:px-3">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Quick Actions</span>
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
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {data.profileCompletion}% Complete
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                        <AvatarFallback>
                          {user?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-3 border-b">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                        <AvatarFallback>
                          {user?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        {user?.firstName && (
                          <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                        )}
                        {user?.email && (
                          <p className="w-[180px] truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                        <Badge variant="secondary" className="w-fit text-xs">
                          {user?.subscriptionPlan || "Free Plan"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem id="premium-upgrade" onClick={() => navigate('/pricing')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing & Subscription</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/faq')}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Mobile-Optimized Navigation */}
        <div className="mb-6 sm:mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700">
              <TabsList className="grid w-full grid-cols-5 gap-0 bg-transparent p-2 h-auto">
                {navigationItems.slice(0, 5).map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex flex-col items-center gap-1 px-2 py-2 text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400"
                  >
                    <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                    <span className="text-xs truncate">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Desktop Navigation - Unified and Smooth */}
            <div className="desktop-nav-container hidden md:flex">
              <div className="nav-pill-container">
                <TabsList className="nav-tabs-list">
                  {navigationItems.map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      id={`${item.id}-tab`}
                      className="nav-tab-trigger"
                    >
                      <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                      <span className="truncate">{item.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* Overview Tab - Mobile Optimized */}
            <TabsContent value="overview" className="space-y-4 sm:space-y-6 pb-20 md:pb-6">
              {/* Welcome Section */}
              <Card id="welcome-card" className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {isNewUser ? `Welcome, ${user?.firstName || 'User'}!` : `Welcome back, ${user?.firstName || 'User'}!`}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
                        {isNewUser ? 'Let\'s get you started on your career journey.' : 'Your career journey continues. Here\'s what\'s happening today.'}
                      </p>
                      {(isNewUser || isProfileIncomplete) && (
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            onClick={startTour}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Rocket className="h-4 w-4 mr-2" />
                            Start Interactive Tour
                          </Button>
                          <span className="text-xs text-slate-500">Learn how to use SmartJobFit</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <div className="text-center sm:text-right">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Success Rate</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">{data.successRate}%</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Overview */}
              <div id="profile-completion" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {progressIndicators.map((indicator) => (
                  <Card key={indicator.label} className="border-0 shadow-lg">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                          {indicator.label}
                        </p>
                        <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {indicator.value}%
                        </span>
                        <Progress value={indicator.value} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('job-search')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                    <CardTitle className="text-xs sm:text-sm font-medium truncate">Job Searches</CardTitle>
                    <Search className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{data.jobSearches}</div>
                    <p className="text-xs text-muted-foreground">+2 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('applications')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                    <CardTitle className="text-xs sm:text-sm font-medium truncate">Applications</CardTitle>
                    <FileText className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{data.applications}</div>
                    <p className="text-xs text-muted-foreground">+5 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('interviews')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                    <CardTitle className="text-xs sm:text-sm font-medium truncate">Interviews</CardTitle>
                    <MessageSquare className="h-4 w-4 text-green-500 flex-shrink-0" />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{data.interviews}</div>
                    <p className="text-xs text-muted-foreground">+1 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => setActiveTab('auto-apply')}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                    <CardTitle className="text-xs sm:text-sm font-medium truncate">Auto-Apply</CardTitle>
                    <Zap className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{data.automationActive}</div>
                    <p className="text-xs text-muted-foreground">Active profiles</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid - Mobile Optimized */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* AI Matched Jobs - Mobile Optimized */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Target className="h-5 w-5 text-blue-500" />
                      AI Matched Jobs
                      <Badge className="ml-auto text-xs">Live</Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Personalized recommendations updated in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <ScrollArea className="h-64 sm:h-80">
                      <div className="space-y-3 sm:space-y-4">
                        {matchingJobs.map((job) => (
                          <div key={job.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-sm sm:text-base truncate flex-shrink-0">{job.title}</h3>
                                <Badge className={`${getMatchBadgeColor(job.match)} text-xs`}>
                                  {job.match}% match
                                </Badge>
                                {job.urgent && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    Urgent
                                  </Badge>
                                )}
                                {job.remote && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    Remote
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="truncate">{job.company}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="truncate">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="truncate">{job.salary}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button variant="outline" size="sm" onClick={() => setSavedJobs(prev => [...prev, job.id])}>
                                {savedJobs.includes(job.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                              </Button>
                              <Button size="sm" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                <span className="hidden sm:inline">Apply</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Enhanced Activity Feed - Mobile Optimized */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Activity className="h-5 w-5 text-purple-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <ScrollArea className="h-64 sm:h-80">
                      <div className="space-y-3 sm:space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                              <activity.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-medium truncate">{activity.title}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                <Badge className={`${getStatusColor(activity.status)} text-xs`} variant="outline">
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

            {/* Job Search Tab - Mobile Optimized */}
            <TabsContent value="job-search" className="pb-20 md:pb-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Search className="h-5 w-5 text-green-500" />
                    AI-Powered Job Search
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Find your perfect job across 15+ job boards with intelligent matching
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <JobSearchFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onSearch={() => setIsSearching(true)}
                    isSearching={isSearching}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs with mobile optimization */}
            <TabsContent value="applications" className="pb-20 md:pb-6">
              <div className="space-y-4">
                <ApplicationTracker />
              </div>
            </TabsContent>

            {/* Resume Section with Sample Data */}
            <TabsContent value="resume" className="pb-20 md:pb-6">
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Resume Analytics & Optimization
                    </CardTitle>
                    <CardDescription>
                      AI-powered resume analysis with 99.8% ATS compatibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">ATS Score</span>
                          <span className="text-2xl font-bold text-green-600">94%</span>
                        </div>
                        <Progress value={94} className="h-3" />
                        <p className="text-xs text-muted-foreground">Excellent compatibility</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Keyword Match</span>
                          <span className="text-2xl font-bold text-blue-600">87%</span>
                        </div>
                        <Progress value={87} className="h-3" />
                        <p className="text-xs text-muted-foreground">Strong keyword optimization</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Format Score</span>
                          <span className="text-2xl font-bold text-purple-600">91%</span>
                        </div>
                        <Progress value={91} className="h-3" />
                        <p className="text-xs text-muted-foreground">Professional formatting</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Strong technical skills section</li>
                          <li>• Quantified achievements</li>
                          <li>• Industry-relevant keywords</li>
                          <li>• Professional formatting</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Add more action verbs</li>
                          <li>• Include soft skills</li>
                          <li>• Optimize for specific roles</li>
                          <li>• Add portfolio links</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <Button className="flex-1">
                        <Target className="w-4 h-4 mr-2" />
                        Optimize for Job
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        Download Resume
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Interview Section with Sample Data */}
            <TabsContent value="interviews" className="pb-20 md:pb-6">
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-purple-500" />
                      Interview Preparation & Coaching
                    </CardTitle>
                    <CardDescription>
                      AI-powered interview practice with real-time feedback
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Performance Score</span>
                          <span className="text-2xl font-bold text-purple-600">85%</span>
                        </div>
                        <Progress value={85} className="h-3" />
                        <p className="text-xs text-muted-foreground">Above average performance</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Questions Practiced</span>
                          <span className="text-2xl font-bold text-green-600">47</span>
                        </div>
                        <Progress value={75} className="h-3" />
                        <p className="text-xs text-muted-foreground">Strong preparation</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Sessions Completed</span>
                          <span className="text-2xl font-bold text-blue-600">12</span>
                        </div>
                        <Progress value={60} className="h-3" />
                        <p className="text-xs text-muted-foreground">Consistent practice</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Upcoming Interviews</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Software Engineer - Google</span>
                            <span className="text-purple-600">Tomorrow 2 PM</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Product Manager - Meta</span>
                            <span className="text-purple-600">Friday 10 AM</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Recent Practice</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Behavioral Questions</span>
                            <span className="text-green-600">Score: 88%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Technical Deep Dive</span>
                            <span className="text-green-600">Score: 82%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          console.log('Dashboard Start Practice Session clicked');
                          navigate('/interview-coach');
                          toast({
                            title: "Launching Interview Coach",
                            description: "Starting your AI-powered interview coaching session!",
                            variant: "default"
                          });
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Practice Session
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Section with Sample Data */}
            <TabsContent value="analytics" className="pb-20 md:pb-6">
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                      Job Search Analytics & Insights
                    </CardTitle>
                    <CardDescription>
                      Comprehensive performance tracking and market insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-blue-600">156</div>
                        <div className="text-sm text-muted-foreground">Applications Sent</div>
                        <div className="text-xs text-green-600">+12% this month</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-green-600">23</div>
                        <div className="text-sm text-muted-foreground">Interview Invites</div>
                        <div className="text-xs text-green-600">+8% this month</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-purple-600">14.7%</div>
                        <div className="text-sm text-muted-foreground">Response Rate</div>
                        <div className="text-xs text-green-600">Above average</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-orange-600">5</div>
                        <div className="text-sm text-muted-foreground">Job Offers</div>
                        <div className="text-xs text-green-600">+2 this week</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Top Performing Skills</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>React Development</span>
                            <Badge className="bg-blue-100 text-blue-800">92% match</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Product Management</span>
                            <Badge className="bg-blue-100 text-blue-800">88% match</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Data Analysis</span>
                            <Badge className="bg-blue-100 text-blue-800">84% match</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Market Trends</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Remote Work Opportunities</span>
                            <span className="text-green-600">↑ 23%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Average Salary Range</span>
                            <span className="text-green-600">$95K - $145K</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Competition Level</span>
                            <span className="text-orange-600">Medium</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <Button className="flex-1">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Detailed Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="auto-apply" className="pb-20 md:pb-6">
              <div className="space-y-4">
                <AutoApply userId={user?.id || ''} />
              </div>
            </TabsContent>

            <TabsContent value="salary" className="pb-20 md:pb-6">
              <div className="space-y-4">
                <SalaryIntelligence userId={user?.id || ''} />
              </div>
            </TabsContent>

            <TabsContent value="career" className="pb-20 md:pb-6">
              <div className="space-y-4">
                <CareerCoaching userId={user?.id || ''} />
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="pb-20 md:pb-6">
              <div className="space-y-4">
                <JobAlerts />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Enhanced Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">SmartJobFit</h1>
                  <p className="text-sm opacity-90">AI-Powered Career Platform</p>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="text-lg">
                    {user?.firstName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {data.profileCompletion}% Complete
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start gap-3 h-auto p-3"
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-current' : item.color}`} />
                    <div className="text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Success Rate</span>
                <span className="font-semibold text-green-600">{data.successRate}%</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Onboarding Tour */}
      <OnboardingTour 
        isOpen={shouldShowTour} 
        onClose={closeTour} 
        onComplete={completeTour}
        userProfile={user} 
      />
    </div>
  );
}