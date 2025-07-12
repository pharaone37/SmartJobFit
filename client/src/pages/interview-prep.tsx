import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Video, 
  Play, 
  BookOpen, 
  TrendingUp, 
  Brain,
  MessageSquare,
  Clock,
  Star,
  Target,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Users,
  Award
} from "lucide-react";
import { MockInterview } from "@/components/interview/mock-interview";
import { useResumes } from "@/hooks/useResume";
import { interviewApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedJobDescription, setSelectedJobDescription] = useState("");
  const [selectedResume, setSelectedResume] = useState("");

  const { data: resumes, isLoading: resumesLoading } = useResumes();
  
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/interviews/sessions"],
    queryFn: interviewApi.getSessions,
    staleTime: 2 * 60 * 1000,
  });

  const activeResume = resumes?.find(r => r.isActive) || resumes?.[0];

  const interviewTips = [
    {
      icon: <Target className="h-5 w-5 text-blue-500" />,
      title: "Research the Company",
      description: "Learn about the company's mission, values, recent news, and culture."
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      title: "Practice Common Questions",
      description: "Prepare answers for behavioral and technical questions relevant to your role."
    },
    {
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      title: "Arrive Early",
      description: "Plan to arrive 10-15 minutes early to show respect for their time."
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-yellow-500" />,
      title: "Prepare Questions",
      description: "Have thoughtful questions ready about the role, team, and company."
    }
  ];

  const commonQuestions = [
    {
      category: "Behavioral",
      questions: [
        "Tell me about yourself",
        "What are your greatest strengths and weaknesses?",
        "Describe a challenging situation and how you handled it",
        "Why do you want to work here?",
        "Where do you see yourself in 5 years?"
      ]
    },
    {
      category: "Technical",
      questions: [
        "Walk me through your problem-solving process",
        "How do you stay updated with industry trends?",
        "Describe a project you're proud of",
        "How do you handle tight deadlines?",
        "What tools and technologies do you use?"
      ]
    },
    {
      category: "Situational",
      questions: [
        "How would you handle a disagreement with a teammate?",
        "What would you do if you missed a deadline?",
        "How do you prioritize multiple tasks?",
        "Describe how you would approach a new project",
        "How do you handle feedback and criticism?"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview Preparation</h1>
          <p className="text-muted-foreground">
            Master your interview skills with AI-powered coaching and practice
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mock-interview">Mock Interview</TabsTrigger>
            <TabsTrigger value="questions">Question Bank</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-gradient border border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-700 font-medium">Practice Sessions</p>
                      <p className="text-3xl font-bold text-purple-800">
                        {sessionsLoading ? "..." : (sessions?.length || 0)}
                      </p>
                    </div>
                    <Video className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-gradient-blue border border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 font-medium">Avg. Score</p>
                      <p className="text-3xl font-bold text-blue-800">85%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-gradient-green border border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-700 font-medium">Improvement</p>
                      <p className="text-3xl font-bold text-green-800">+15%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-primary" />
                    <span>Quick Start</span>
                  </CardTitle>
                  <CardDescription>
                    Jump into practice with AI-powered interview simulation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full button-gradient"
                    onClick={() => setActiveTab("mock-interview")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Mock Interview
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveTab("questions")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Questions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span>Interview Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interviewTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="mt-1">{tip.icon}</div>
                        <div>
                          <p className="font-semibold text-sm">{tip.title}</p>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Preparation Features</CardTitle>
                <CardDescription>
                  Comprehensive tools to help you ace your interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 card-gradient rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">AI Mock Interviews</h3>
                    <p className="text-sm text-muted-foreground">
                      Practice with our advanced AI that adapts to your responses and provides real-time feedback.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 card-gradient-blue rounded-lg border border-blue-200">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Voice Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Get feedback on your speaking pace, clarity, and confidence level during practice sessions.
                    </p>
                  </div>
                  
                  <div className="text-center p-6 card-gradient-green rounded-lg border border-green-200">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">Performance Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor your progress over time and identify areas for improvement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mock Interview Tab */}
          <TabsContent value="mock-interview" className="space-y-6">
            <MockInterview 
              jobDescription={selectedJobDescription}
              resumeContent={activeResume?.content}
            />
          </TabsContent>

          {/* Questions Bank Tab */}
          <TabsContent value="questions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Interview Question Bank</span>
                </CardTitle>
                <CardDescription>
                  Practice with common interview questions organized by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {commonQuestions.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge variant="outline" className="text-sm">
                          {category.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.questions.length} questions
                        </span>
                      </div>
                      <div className="grid gap-3">
                        {category.questions.map((question, qIndex) => (
                          <Card key={qIndex} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{question}</p>
                                <Button size="sm" variant="outline">
                                  Practice
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Practice Sessions</span>
                </CardTitle>
                <CardDescription>
                  Review your past interview practice sessions and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-3 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : sessions && sessions.length > 0 ? (
                  <div className="space-y-4">
                    {sessions.map((session: any, index: number) => (
                      <Card key={session.id || index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold">
                                {session.sessionType} Interview Session
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(session.createdAt).toLocaleDateString()} • 
                                {session.duration || 15} minutes
                              </p>
                            </div>
                            <div className="text-right">
                              {session.overallScore && (
                                <Badge className="bg-green-100 text-green-800">
                                  {session.overallScore}% Score
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {session.feedback && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {session.feedback.substring(0, 150)}...
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Badge variant="outline">
                                {(session.questions?.length || 0)} questions
                              </Badge>
                              <Badge variant="outline">
                                {session.sessionType}
                              </Badge>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Practice Sessions Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your first mock interview to begin tracking your progress.
                    </p>
                    <Button 
                      className="button-gradient"
                      onClick={() => setActiveTab("mock-interview")}
                    >
                      Start First Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
