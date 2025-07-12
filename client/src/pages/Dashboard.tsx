import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Filter
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const dashboardData = {
    jobSearches: 23,
    applications: 12,
    interviews: 3,
    resumeScore: 85,
    profileStrength: 92,
    matchingJobs: 47,
    plan: user?.subscriptionPlan || 'free'
  };

  const recentActivity = [
    { id: 1, type: 'job_search', title: 'Software Engineer at TechCorp', time: '2 hours ago' },
    { id: 2, type: 'resume_update', title: 'Updated resume skills section', time: '1 day ago' },
    { id: 3, type: 'interview', title: 'Interview scheduled with StartupXYZ', time: '2 days ago' },
    { id: 4, type: 'application', title: 'Applied to Product Manager role', time: '3 days ago' },
  ];

  const matchingJobs = [
    { id: 1, title: 'Senior Software Engineer', company: 'TechCorp', match: 95, location: 'San Francisco' },
    { id: 2, title: 'Product Manager', company: 'StartupXYZ', match: 88, location: 'New York' },
    { id: 3, title: 'Full Stack Developer', company: 'WebCorp', match: 82, location: 'Remote' },
    { id: 4, title: 'Data Scientist', company: 'DataTech', match: 78, location: 'Boston' },
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t.dashboard.welcome}, {user?.firstName || 'User'}!</h1>
            <p className="text-muted-foreground mt-1">
              {t.dashboard.analytics} - {dashboardData.plan === 'free' ? 'Free Plan' : dashboardData.plan === 'professional' ? 'Professional Plan' : 'AI Career Coach Plan'}
            </p>
          </div>
          {dashboardData.plan === 'free' && (
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              {t.dashboard.upgrade}
            </Button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.jobSearches}</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.jobSearches}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.applications}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.applications}</div>
              <p className="text-xs text-muted-foreground">
                +3 this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.interviews}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.interviews}</div>
              <p className="text-xs text-muted-foreground">
                2 upcoming
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dashboard.resumeScore}</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.resumeScore}%</div>
              <Progress value={dashboardData.resumeScore} className="w-full mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">{t.dashboard.jobMatching}</TabsTrigger>
            <TabsTrigger value="resumes">{t.dashboard.cvAnalysis}</TabsTrigger>
            <TabsTrigger value="interviews">{t.dashboard.interviewPrep}</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">{t.dashboard.analytics}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t.dashboard.quickActions}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-16 flex-col gap-2" variant="outline">
                      <Search className="h-5 w-5" />
                      <span className="text-sm">Search Jobs</span>
                    </Button>
                    <Button className="h-16 flex-col gap-2" variant="outline">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm">Optimize Resume</span>
                    </Button>
                    <Button className="h-16 flex-col gap-2" variant="outline">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">Practice Interview</span>
                    </Button>
                    <Button className="h-16 flex-col gap-2" variant="outline">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-sm">View Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Strength */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.dashboard.profileStrength}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {dashboardData.profileStrength}%
                    </div>
                    <Progress value={dashboardData.profileStrength} className="w-full mb-4" />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Resume Complete</span>
                        <Badge variant="secondary">95%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Skills Updated</span>
                        <Badge variant="secondary">90%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Experience Added</span>
                        <Badge variant="secondary">85%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t.dashboard.recentActivity}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {activity.type === 'job_search' && <Search className="h-4 w-4 text-primary" />}
                        {activity.type === 'resume_update' && <FileText className="h-4 w-4 text-primary" />}
                        {activity.type === 'interview' && <MessageSquare className="h-4 w-4 text-primary" />}
                        {activity.type === 'application' && <Briefcase className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Matching Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.dashboard.matchingJobs}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  New Search
                </Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {matchingJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        <p className="text-sm text-muted-foreground mt-1">{job.location}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Badge variant={job.match >= 90 ? 'default' : job.match >= 80 ? 'secondary' : 'outline'}>
                            {job.match}% Match
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resume Analysis Tab */}
          <TabsContent value="resumes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.dashboard.cvAnalysis}</h2>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Resume
              </Button>
            </div>
            
            <div className="grid gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id} className={`hover:shadow-md transition-shadow ${resume.isActive ? 'ring-2 ring-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{resume.title}</h3>
                          {resume.isActive && <Badge>Active</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Last updated: {resume.lastUpdated}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{resume.score}%</div>
                          <p className="text-xs text-muted-foreground">ATS Score</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Interview Preparation Tab */}
          <TabsContent value="interviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.dashboard.interviewPrep}</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Practice
              </Button>
            </div>
            
            <div className="grid gap-4">
              {interviews.map((interview) => (
                <Card key={interview.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{interview.position}</h3>
                        <p className="text-muted-foreground">{interview.company}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{interview.time}</span>
                          </div>
                          <Badge variant="outline">{interview.type}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Practice
                        </Button>
                        <Button size="sm">
                          Prepare
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Job Applications</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>
            
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No applications yet</h3>
                    <p className="text-sm">Start applying to jobs to track your progress here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Advanced Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Search Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Search to Application Rate</span>
                      <Badge>52%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Application to Interview Rate</span>
                      <Badge>25%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Interview Success Rate</span>
                      <Badge>67%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skills Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>JavaScript</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20" />
                        <span className="text-sm">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>React</span>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="w-20" />
                        <span className="text-sm">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Node.js</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-20" />
                        <span className="text-sm">72%</span>
                      </div>
                    </div>
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