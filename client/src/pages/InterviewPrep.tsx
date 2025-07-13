import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import InterviewSimulator from "@/components/InterviewSimulator";
import { 
  Video, 
  BookOpen, 
  Target, 
  Play, 
  BarChart3, 
  Brain,
  Clock,
  Star,
  Trophy,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Calendar,
  Eye
} from "lucide-react";

export default function InterviewPrep() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("practice");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [showSimulator, setShowSimulator] = useState(false);

  // Sample interview data (fallback)
  const sampleInterviews = [
    { id: 1, company: 'TechCorp', position: 'Senior Software Engineer', date: '2024-01-15', time: '10:00 AM', type: 'Technical' },
    { id: 2, company: 'StartupXYZ', position: 'Product Manager', date: '2024-01-18', time: '2:00 PM', type: 'Behavioral' },
    { id: 3, company: 'WebCorp', position: 'Full Stack Developer', date: '2024-01-20', time: '11:30 AM', type: 'System Design' },
  ];

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
  const practiceHistory = [];
  const historyLoading = false;

  // Generate questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: async (data: { jobTitle: string; industry: string; difficulty: string }) => {
      return await apiRequest("POST", "/api/interview-prep/questions", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Questions Generated",
        description: "AI has generated personalized interview questions for you!",
      });
      setShowSimulator(true);
    },
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
      toast({
        title: "Generation Failed",
        description: "Could not generate questions. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleStartPractice = () => {
    if (!selectedJobTitle || !selectedIndustry || !selectedDifficulty) {
      toast({
        title: "Missing Information",
        description: "Please select job title, industry, and difficulty level.",
        variant: "destructive",
      });
      return;
    }

    generateQuestionsMutation.mutate({
      jobTitle: selectedJobTitle,
      industry: selectedIndustry,
      difficulty: selectedDifficulty,
    });
  };

  const features = [
    {
      icon: Video,
      title: "AI Mock Interviews",
      description: "Practice with our AI interviewer that adapts to your industry and role. Get realistic interview experience.",
      features: ["Industry-specific questions", "Real-time feedback", "Voice & body language analysis"],
      color: "purple"
    },
    {
      icon: BookOpen,
      title: "Question Bank",
      description: "Access 1000+ interview questions tailored to your role, with expert answers and explanations.",
      features: ["Behavioral questions", "Technical challenges", "Company-specific prep"],
      color: "blue"
    },
    {
      icon: Target,
      title: "Performance Analytics",
      description: "Track your improvement over time with detailed analytics and personalized recommendations.",
      features: ["Progress tracking", "Skill assessments", "Improvement insights"],
      color: "green"
    }
  ];

  const commonQuestions = [
    {
      category: "Behavioral",
      questions: [
        "Tell me about yourself",
        "Why do you want to work here?",
        "Describe a challenging situation you faced at work",
        "Where do you see yourself in 5 years?",
        "Tell me about a time you failed"
      ]
    },
    {
      category: "Technical",
      questions: [
        "Explain your approach to problem-solving",
        "How do you stay updated with industry trends?",
        "Describe your experience with [specific technology]",
        "Walk me through your thought process on this problem",
        "How would you handle a disagreement with a team member?"
      ]
    },
    {
      category: "Situational",
      questions: [
        "How would you prioritize multiple urgent tasks?",
        "What would you do if you disagreed with your manager?",
        "How do you handle stress and pressure?",
        "Describe your ideal work environment",
        "How do you handle constructive criticism?"
      ]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview Preparation</h1>
          <p className="text-muted-foreground">
            Practice with AI, get real-time feedback, and master your interview skills
          </p>
        </div>

        {showSimulator ? (
          <InterviewSimulator
            jobTitle={selectedJobTitle}
            industry={selectedIndustry}
            difficulty={selectedDifficulty}
            onClose={() => setShowSimulator(false)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="practice">AI Practice</TabsTrigger>
              <TabsTrigger value="questions">Question Bank</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="analytics">Performance</TabsTrigger>
              <TabsTrigger value="tips">Tips & Guides</TabsTrigger>
            </TabsList>

            {/* AI Practice Tab */}
            <TabsContent value="practice" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Video className="w-5 h-5 mr-2 text-purple-500" />
                        Start AI Interview Practice
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Job Title</label>
                          <Select value={selectedJobTitle} onValueChange={setSelectedJobTitle}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job title" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="software-engineer">Software Engineer</SelectItem>
                              <SelectItem value="product-manager">Product Manager</SelectItem>
                              <SelectItem value="data-scientist">Data Scientist</SelectItem>
                              <SelectItem value="ux-designer">UX Designer</SelectItem>
                              <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                              <SelectItem value="sales-representative">Sales Representative</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Industry</label>
                          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="startup">Startup</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy - Entry Level</SelectItem>
                            <SelectItem value="medium">Medium - Mid Level</SelectItem>
                            <SelectItem value="hard">Hard - Senior Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleStartPractice}
                        disabled={generateQuestionsMutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start AI Interview
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Practice History */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                        Recent Practice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {historyLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                            </div>
                          ))}
                        </div>
                      ) : practiceHistory && practiceHistory.length > 0 ? (
                        <div className="space-y-4">
                          {practiceHistory.slice(0, 5).map((session: any) => (
                            <div key={session.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{session.type}</span>
                                <Badge variant={session.score >= 80 ? "default" : session.score >= 60 ? "secondary" : "destructive"}>
                                  {session.score}%
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(session.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No practice sessions yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Features Overview */}
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const colorClasses = {
                    purple: "border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20",
                    blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
                    green: "border-green-200 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20"
                  };
                  
                  return (
                    <Card key={index} className={`${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color === 'green' ? 'teal' : feature.color === 'blue' ? 'indigo' : 'blue'}-500 rounded-xl flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {feature.features.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Question Bank Tab */}
            <TabsContent value="questions" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {commonQuestions.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                        {category.category} Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.questions.map((question, qIndex) => (
                          <div key={qIndex} className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                            <p className="text-sm">{question}</p>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All {category.category} Questions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Interviews Tab */}
            <TabsContent value="interviews" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        Upcoming Interviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sampleInterviews.map((interview) => (
                          <div key={interview.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold">{interview.position}</h4>
                                <p className="text-sm text-muted-foreground">{interview.company}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                                    {interview.date}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                                    {interview.time}
                                  </div>
                                  <Badge variant="outline">{interview.type}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                                <Button variant="default" size="sm">
                                  <Play className="w-4 h-4 mr-1" />
                                  Practice
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2 text-purple-500" />
                        Interview Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Interviews</span>
                          <span className="text-2xl font-bold text-blue-600">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Success Rate</span>
                          <span className="text-2xl font-bold text-green-600">75%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Score</span>
                          <span className="text-2xl font-bold text-purple-600">8.2/10</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                        Recent Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { company: "TechCorp", score: 8.5, status: "Passed" },
                          { company: "StartupXYZ", score: 7.8, status: "Pending" },
                          { company: "WebCorp", score: 9.1, status: "Passed" }
                        ].map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{result.company}</p>
                              <p className="text-xs text-muted-foreground">Score: {result.score}/10</p>
                            </div>
                            <Badge variant={result.status === "Passed" ? "default" : "secondary"}>
                              {result.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Overall Interview Score</span>
                          <span className="text-2xl font-bold text-green-600">78%</span>
                        </div>
                        <Progress value={78} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-2">Above average performance</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-xs text-muted-foreground">Practice Sessions</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">45m</div>
                          <div className="text-xs text-muted-foreground">Total Practice Time</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Skill Breakdown</h4>
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
                                <span className={getScoreColor(item.score)}>{item.score}%</span>
                              </div>
                              <Progress value={item.score} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                      Improvement Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Work on Confidence",
                          description: "Practice speaking more assertively and maintaining eye contact",
                          priority: "high",
                          icon: AlertCircle
                        },
                        {
                          title: "Technical Deep Dives",
                          description: "Prepare more detailed explanations of your technical projects",
                          priority: "medium",
                          icon: Brain
                        },
                        {
                          title: "STAR Method",
                          description: "Use the Situation-Task-Action-Result framework for behavioral questions",
                          priority: "low",
                          icon: Star
                        }
                      ].map((rec, index) => {
                        const Icon = rec.icon;
                        const priorityColors = {
                          high: "text-red-600 bg-red-50 dark:bg-red-950/20",
                          medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20",
                          low: "text-green-600 bg-green-50 dark:bg-green-950/20"
                        };
                        
                        return (
                          <div key={index} className={`p-4 rounded-lg border ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                            <div className="flex items-start space-x-3">
                              <Icon className="w-5 h-5 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{rec.title}</h4>
                                <p className="text-xs mt-1 opacity-80">{rec.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {rec.priority}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tips & Guides Tab */}
            <TabsContent value="tips" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Before the Interview",
                    tips: [
                      "Research the company thoroughly",
                      "Review the job description",
                      "Prepare your STAR stories",
                      "Practice common questions",
                      "Plan your outfit"
                    ],
                    icon: Clock,
                    color: "blue"
                  },
                  {
                    title: "During the Interview",
                    tips: [
                      "Arrive 10-15 minutes early",
                      "Maintain good eye contact",
                      "Listen actively to questions",
                      "Ask thoughtful questions",
                      "Show enthusiasm"
                    ],
                    icon: Users,
                    color: "purple"
                  },
                  {
                    title: "After the Interview",
                    tips: [
                      "Send a thank-you email within 24 hours",
                      "Reflect on your performance",
                      "Follow up appropriately",
                      "Continue job searching",
                      "Prepare for next rounds"
                    ],
                    icon: CheckCircle,
                    color: "green"
                  }
                ].map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Icon className={`w-5 h-5 mr-2 text-${guide.color}-500`} />
                          {guide.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {guide.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
