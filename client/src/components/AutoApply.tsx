import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Play, 
  Square, 
  Pause, 
  Settings, 
  BarChart3, 
  Users, 
  Clock,
  Target,
  Brain,
  FileText,
  Award,
  Search,
  DollarSign,
  Building,
  MapPin,
  Timer,
  Sparkles,
  Rocket,
  Filter,
  MessageSquare,
  Calendar,
  Zap,
  CheckCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AutoApplyProps {
  userId: string;
}

export function AutoApply({ userId }: AutoApplyProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timelineStep, setTimelineStep] = useState(0);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [showParticles, setShowParticles] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    jobsScanned: 0,
    atsScore: 0,
    companiesAnalyzed: 0,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Demo timeline for AI agents workflow
  const agentWorkflow = [
    {
      id: 1,
      name: "Search Agent",
      icon: Search,
      task: "Scanning 15+ job boards",
      description: "Finding ML Engineer positions in Berlin",
      duration: "8s",
      status: "completed",
      result: "47 positions found"
    },
    {
      id: 2,
      name: "Filter Agent",
      icon: Filter,
      task: "Applying salary & location filters",
      description: "Filtering for ≥€90k remote positions",
      duration: "3s",
      status: "completed",
      result: "12 qualified matches"
    },
    {
      id: 3,
      name: "Resume Agent",
      icon: FileText,
      task: "Tailoring resume for each role",
      description: "Optimizing keywords & ATS compatibility",
      duration: "12s",
      status: "active",
      result: "99.8% ATS score achieved"
    },
    {
      id: 4,
      name: "Company Intel Agent",
      icon: Building,
      task: "Researching target companies",
      description: "Culture analysis & leadership insights",
      duration: "15s",
      status: "pending",
      result: "Deep reports ready"
    },
    {
      id: 5,
      name: "Interview Prep Agent",
      icon: MessageSquare,
      task: "Generating custom questions",
      description: "Role-specific & company-specific prep",
      duration: "10s",
      status: "pending",
      result: "Practice sessions ready"
    },
    {
      id: 6,
      name: "Salary Intel Agent",
      icon: DollarSign,
      task: "Market analysis & negotiation",
      description: "Benchmarking salary data",
      duration: "7s",
      status: "pending",
      result: "Negotiation scripts ready"
    },
    {
      id: 7,
      name: "Application Agent",
      icon: Zap,
      task: "Submitting applications",
      description: "Quality control & personalization",
      duration: "8s",
      status: "pending",
      result: "12 applications sent"
    },
    {
      id: 8,
      name: "Follow-up Agent",
      icon: Calendar,
      task: "Scheduling follow-ups",
      description: "Strategic timing optimization",
      duration: "5s",
      status: "pending",
      result: "Follow-up sequence active"
    },
    {
      id: 9,
      name: "Analytics Agent",
      icon: BarChart3,
      task: "Performance tracking",
      description: "Success metrics & optimization",
      duration: "4s",
      status: "pending",
      result: "Real-time insights available"
    }
  ];

  // Dummy data for visualization
  const dummyDashboardData = {
    activeProfiles: 3,
    totalProfiles: 5,
    applicationsToday: 24,
    successRate: 87,
    queueSize: 42,
    processing: 9,
    qualityScore: 94
  };

  const dummyProfiles = [
    {
      id: 1,
      name: "ML Engineer - Remote Europe",
      targetRole: "Machine Learning Engineer",
      location: "Berlin, Germany (Remote)",
      salaryMin: 90000,
      platforms: ["LinkedIn", "Indeed", "AngelList", "Xing"],
      status: "active",
      applicationsToday: 8,
      totalApplications: 156,
      responseRate: 23,
      lastActivity: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      filters: {
        workType: "Remote",
        experience: "Mid-Senior",
        industries: ["Tech", "Fintech", "AI/ML"]
      }
    },
    {
      id: 2,
      name: "Senior Developer - Hybrid",
      targetRole: "Senior Software Developer",
      location: "Munich, Germany",
      salaryMin: 75000,
      platforms: ["LinkedIn", "StepStone", "Xing"],
      status: "paused",
      applicationsToday: 0,
      totalApplications: 89,
      responseRate: 31,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      filters: {
        workType: "Hybrid",
        experience: "Senior",
        industries: ["Software", "E-commerce"]
      }
    },
    {
      id: 3,
      name: "Data Scientist - On-site",
      targetRole: "Data Scientist",
      location: "Frankfurt, Germany",
      salaryMin: 70000,
      platforms: ["LinkedIn", "Indeed"],
      status: "stopped",
      applicationsToday: 0,
      totalApplications: 45,
      responseRate: 18,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      filters: {
        workType: "On-site",
        experience: "Mid-level",
        industries: ["Data", "Analytics", "Banking"]
      }
    }
  ];

  // Auto-advance timeline demo with enhanced effects
  useEffect(() => {
    if (isDemoActive) {
      const interval = setInterval(() => {
        setTimelineStep((prev) => {
          const newStep = prev + 1;
          if (newStep >= agentWorkflow.length) {
            setIsDemoActive(false);
            setCompletedJobs(12);
            setCurrentTask("All agents completed successfully!");
            toast({
              title: "Demo Complete!",
              description: "12 applications ready for submission with 99.8% ATS scores",
            });
            return 0;
          }
          
          // Update current task
          setCurrentTask(agentWorkflow[newStep]?.task || "Processing...");
          
          // Update live metrics based on agent progress
          if (newStep === 1) { // Search Agent
            setLiveMetrics(prev => ({ ...prev, jobsScanned: 47 }));
          } else if (newStep === 2) { // Filter Agent
            setLiveMetrics(prev => ({ ...prev, jobsScanned: 12 }));
          } else if (newStep === 3) { // Resume Agent
            setLiveMetrics(prev => ({ ...prev, atsScore: 99.8 }));
          } else if (newStep === 4) { // Company Intel Agent
            setLiveMetrics(prev => ({ ...prev, companiesAnalyzed: 12 }));
          } else if (newStep === 7) { // Application Agent
            setCompletedJobs(12);
            setShowParticles(true);
            setTimeout(() => setShowParticles(false), 3000);
          }
          
          return newStep;
        });
      }, 1800); // Slightly faster for better engagement
      
      return () => clearInterval(interval);
    }
  }, [isDemoActive, agentWorkflow.length, toast]);

  const startDemo = () => {
    setIsDemoActive(true);
    setTimelineStep(0);
    setCompletedJobs(0);
    setCurrentTask("Initializing AI agents...");
    setLiveMetrics({ jobsScanned: 0, atsScore: 0, companiesAnalyzed: 0 });
    setShowParticles(false);
    toast({
      title: "🚀 AI Agents Activated",
      description: "9 specialist agents are now working in parallel",
    });
  };

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
        return <Target className="w-4 h-4" />;
    }
  };

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
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-auto mb-6 bg-transparent border-b border-border p-0">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger 
            value="profiles" 
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none"
          >
            <Users className="w-4 h-4" />
            <span>Profiles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="queue" 
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none"
          >
            <Clock className="w-4 h-4" />
            <span>Queue</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Hero Section with Demo */}
          <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
              <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-green-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-pink-300 rounded-full animate-pulse"></div>
            </div>
            
            {/* Particle Effect for Completed Actions */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: '1s'
                    }}
                  ></div>
                ))}
              </div>
            )}

            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <span className="animate-pulse">🎯</span>
                    From "I need a job" to "I got offers" in 60 seconds
                  </CardTitle>
                  <p className="text-blue-100">
                    Simply tell our AI: <em className="bg-white/20 px-2 py-1 rounded">"Find me a remote ML Engineer role in Berlin paying ≥€90k"</em>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-200">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>9 specialist agents activate in parallel</span>
                    </div>
                    <span>→</span>
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      <span>60 seconds to complete package</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button 
                    onClick={startDemo}
                    disabled={isDemoActive}
                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg transform transition-all hover:scale-105"
                  >
                    <Rocket className={`w-4 h-4 mr-2 ${isDemoActive ? 'animate-spin' : ''}`} />
                    {isDemoActive ? "Running Demo..." : "Watch Agents Work"}
                  </Button>
                  {!isDemoActive && (
                    <p className="text-xs text-blue-200 mt-2">Click to see the magic ✨</p>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {isDemoActive && (
              <CardContent className="pt-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-4">
                  {/* Real-time Status Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Timer className="w-5 h-5 animate-spin" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <span className="font-semibold">Live AI Agent Workflow</span>
                      <Badge className="bg-green-400 text-green-900 animate-pulse">
                        Active: {timelineStep + 1}/9 agents
                      </Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                        <div className="text-lg font-bold text-green-300">{completedJobs} Jobs Ready</div>
                      </div>
                      <div className="text-xs text-blue-200 max-w-xs text-right">{currentTask}</div>
                      <div className="flex items-center gap-2 justify-end text-xs">
                        <span className="bg-green-400/20 px-2 py-1 rounded text-green-300">
                          {liveMetrics.jobsScanned} scanned
                        </span>
                        {liveMetrics.atsScore > 0 && (
                          <span className="bg-blue-400/20 px-2 py-1 rounded text-blue-300">
                            {liveMetrics.atsScore}% ATS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Agent Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {agentWorkflow.slice(0, 9).map((agent, index) => {
                      const isActive = index === timelineStep;
                      const isCompleted = index < timelineStep;
                      const isPending = index > timelineStep;
                      
                      return (
                        <div
                          key={agent.id}
                          className={`relative p-3 rounded-lg border transition-all duration-700 transform ${
                            isActive 
                              ? 'bg-yellow-400 text-yellow-900 border-yellow-300 animate-pulse scale-105 shadow-lg' 
                              : isCompleted 
                                ? 'bg-green-400 text-green-900 border-green-300 shadow-md' 
                                : 'bg-white/20 text-white border-white/30 opacity-70'
                          }`}
                        >
                          {/* Status indicator */}
                          <div className="absolute -top-2 -right-2">
                            {isCompleted && (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {isActive && (
                              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center animate-spin">
                                <Timer className="w-3 h-3 text-yellow-900" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <agent.icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
                            <span className="font-semibold text-sm">{agent.name}</span>
                            <span className="ml-auto text-xs font-mono bg-black/20 px-2 py-1 rounded">
                              {agent.duration}
                            </span>
                          </div>
                          
                          <p className="text-xs mb-1 font-medium">{agent.task}</p>
                          <p className="text-xs opacity-80">{agent.description}</p>
                          
                          {(isCompleted || isActive) && (
                            <div className="mt-3 pt-2 border-t border-current/20">
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <p className="text-xs font-semibold">{agent.result}</p>
                              </div>
                            </div>
                          )}

                          {/* Progress bar for active agent */}
                          {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-600/30 rounded-b-lg overflow-hidden">
                              <div className="h-full bg-yellow-300 animate-pulse w-full"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Enhanced Progress Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-mono">{Math.round(((timelineStep + 1) / agentWorkflow.length) * 100)}%</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={((timelineStep + 1) / agentWorkflow.length) * 100} 
                        className="h-3"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    
                    {/* Enhanced Live Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="text-center p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border border-green-400/30">
                        <div className="text-xl font-bold text-green-300 flex items-center justify-center gap-1">
                          <Search className="w-4 h-4" />
                          {liveMetrics.jobsScanned}
                        </div>
                        <div className="text-xs text-green-200">Jobs Scanned</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30">
                        <div className="text-xl font-bold text-blue-300 flex items-center justify-center gap-1">
                          <Award className="w-4 h-4" />
                          {liveMetrics.atsScore > 0 ? `${liveMetrics.atsScore}%` : '0%'}
                        </div>
                        <div className="text-xs text-blue-200">ATS Score</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg border border-purple-400/30">
                        <div className="text-xl font-bold text-purple-300 flex items-center justify-center gap-1">
                          <Building className="w-4 h-4" />
                          {liveMetrics.companiesAnalyzed}
                        </div>
                        <div className="text-xs text-purple-200">Companies</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg border border-orange-400/30">
                        <div className="text-xl font-bold text-orange-300 flex items-center justify-center gap-1">
                          <Brain className="w-4 h-4" />
                          {timelineStep + 1}/9
                        </div>
                        <div className="text-xs text-orange-200">Agents Active</div>
                      </div>
                    </div>

                    {/* Success Message */}
                    {completedJobs > 0 && (
                      <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 text-green-300">
                          <CheckCircle className="w-5 h-5 animate-bounce" />
                          <span className="font-bold">Success! {completedJobs} applications ready for submission</span>
                        </div>
                        <p className="text-xs text-green-200 mt-1">
                          Each application is tailored, ATS-optimized, and includes company research
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyDashboardData.activeProfiles}</div>
                <p className="text-xs text-muted-foreground">
                  {dummyDashboardData.totalProfiles} total profiles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications Today</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyDashboardData.applicationsToday}</div>
                <p className="text-xs text-muted-foreground">
                  {dummyDashboardData.successRate}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyDashboardData.queueSize}</div>
                <p className="text-xs text-muted-foreground">
                  {dummyDashboardData.processing} processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dummyDashboardData.qualityScore}%</div>
                <p className="text-xs text-muted-foreground">
                  AI-powered quality metrics
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Active Automation Profiles */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Active Automation Profiles</h3>
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Create New Profile
              </Button>
            </div>
            
            {dummyProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(profile.status)}`} />
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profile.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ≥€{profile.salaryMin.toLocaleString()}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getStatusIcon(profile.status)}
                        {profile.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{profile.applicationsToday}</div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{profile.totalApplications}</div>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{profile.responseRate}%</div>
                      <p className="text-xs text-muted-foreground">Response Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatDistanceToNow(profile.lastActivity, { addSuffix: true })}
                      </div>
                      <p className="text-xs text-muted-foreground">Last Activity</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Platforms</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary">{platform}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Filters</p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{profile.filters.workType}</Badge>
                        <Badge variant="outline">{profile.filters.experience}</Badge>
                        {profile.filters.industries.map((industry) => (
                          <Badge key={industry} variant="outline">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Application Queue
              </CardTitle>
              <CardDescription>
                Monitor queued applications and processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Queued Applications</h3>
                <p className="text-muted-foreground">
                  Applications will appear here when queued for processing
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>
                Track your automation performance and success metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Success Rate</div>
                  <div className="text-3xl font-bold text-green-600">87%</div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Response Rate</div>
                  <div className="text-3xl font-bold text-blue-600">23%</div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Interview Rate</div>
                  <div className="text-3xl font-bold text-purple-600">12%</div>
                  <Progress value={12} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Automation Settings
              </CardTitle>
              <CardDescription>
                Configure global automation preferences and quality controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Settings Configuration</h3>
                <p className="text-muted-foreground mb-4">
                  Customize your automation preferences and quality controls
                </p>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}