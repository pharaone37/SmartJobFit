import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Target, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Star,
  TrendingUp,
  Brain,
  Users,
  Building2,
  Code,
  Briefcase,
  Award,
  Mic,
  Video
} from "lucide-react";

interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: string;
  category: string;
  tips: string[];
  expectedAnswer?: string;
  followUpQuestions?: string[];
  companySpecific?: boolean;
  timeLimit?: number;
}

interface InterviewQuestions {
  questions: InterviewQuestion[];
  totalQuestions: number;
  estimatedTime: number;
  preparationTips: string[];
  companyInsights?: {
    culture: string[];
    values: string[];
    interviewProcess: string[];
  };
}

interface InterviewPerformance {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  keyPoints: string[];
  missedPoints: string[];
  overall: string;
  confidenceLevel: number;
  communicationScore: number;
  technicalScore: number;
  culturalFitScore: number;
}

interface AICoachingSession {
  id: string;
  type: 'mock' | 'behavioral' | 'technical' | 'case-study' | 'group';
  duration: number;
  questions: InterviewQuestion[];
  performance: InterviewPerformance[];
  overallScore: number;
  recommendations: string[];
  nextSteps: string[];
}

interface CompanyProfile {
  name: string;
  industry: string;
  size: string;
  culture: string[];
  values: string[];
  interviewProcess: string[];
  commonQuestions: string[];
  difficulty: string;
}

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "junior", label: "Junior (1-3 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior (5-8 years)" },
  { value: "lead", label: "Lead (8+ years)" },
  { value: "executive", label: "Executive (10+ years)" }
];

const INTERVIEW_CATEGORIES = [
  { value: "technical", label: "Technical Questions", icon: Code },
  { value: "behavioral", label: "Behavioral Questions", icon: Users },
  { value: "situational", label: "Situational Questions", icon: Target },
  { value: "leadership", label: "Leadership Questions", icon: Award },
  { value: "culture", label: "Culture Fit Questions", icon: Building2 },
  { value: "mixed", label: "Mixed Questions", icon: Brain }
];

const INTERVIEW_TYPES = [
  { value: "mock", label: "Mock Interview", description: "Full interview simulation", icon: Video },
  { value: "behavioral", label: "Behavioral Practice", description: "STAR method training", icon: Users },
  { value: "technical", label: "Technical Deep Dive", description: "Coding & system design", icon: Code },
  { value: "case-study", label: "Case Study", description: "Problem-solving scenarios", icon: Lightbulb },
  { value: "group", label: "Group Interview", description: "Multi-candidate simulation", icon: Users }
];

const COMPANY_TYPES = [
  { value: "startup", label: "Startup (1-50 employees)" },
  { value: "scaleup", label: "Scale-up (51-500 employees)" },
  { value: "enterprise", label: "Enterprise (500+ employees)" },
  { value: "faang", label: "FAANG/Big Tech" },
  { value: "consulting", label: "Consulting Firm" },
  { value: "finance", label: "Financial Services" }
];

export default function AIInterviewPrep() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Show loading state if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">AI Interview Preparation</h1>
          <p className="text-gray-600">Please log in to access interview preparation features</p>
        </div>
      </div>
    );
  }
  
  // Basic interview setup
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [category, setCategory] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [activeTab, setActiveTab] = useState("setup");
  
  // Interview session state
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [performance, setPerformance] = useState<InterviewPerformance | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [aiCoachingSession, setAiCoachingSession] = useState<AICoachingSession | null>(null);
  const [showAICoach, setShowAICoach] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);

  const generateQuestionsMutation = useMutation({
    mutationFn: async (data: { 
      jobDescription: string; 
      experienceLevel: string; 
      category: string; 
      interviewType: string;
      companyName?: string;
      companyType?: string;
    }) => {
      return await apiRequest('/api/interview/generate-questions', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setQuestions(data);
      setCurrentQuestionIndex(0);
      setActiveTab("practice");
      toast({
        title: "Questions Generated",
        description: `Generated ${data.questions.length} interview questions for your practice.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate interview questions. Please try again.",
        variant: "destructive",
      });
    }
  });

  const researchCompanyMutation = useMutation({
    mutationFn: async (companyName: string) => {
      return await apiRequest('/api/interview/research-company', {
        method: 'POST',
        body: JSON.stringify({ companyName })
      });
    },
    onSuccess: (data) => {
      setCompanyProfile(data);
      toast({
        title: "Company Research Complete",
        description: `Gathered insights about ${data.name} for your interview preparation.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Research Failed",
        description: "Failed to research company. Please try again.",
        variant: "destructive",
      });
    }
  });

  const startAICoachingMutation = useMutation({
    mutationFn: async (data: { 
      interviewType: string; 
      jobDescription: string; 
      experienceLevel: string;
      companyProfile?: CompanyProfile;
    }) => {
      return await apiRequest('/api/interview/start-ai-coaching', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setAiCoachingSession(data);
      setShowAICoach(true);
      toast({
        title: "AI Coach Ready",
        description: "Your personal AI interview coach is now active.",
      });
    },
    onError: (error) => {
      toast({
        title: "AI Coach Failed",
        description: "Failed to start AI coaching session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const analyzePerformanceMutation = useMutation({
    mutationFn: async (data: { question: string; userAnswer: string; correctAnswer?: string }) => {
      return await apiRequest('/api/interview/analyze-performance', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setPerformance(data);
      toast({
        title: "Performance Analyzed",
        description: "Your answer has been analyzed with AI feedback.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze performance. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleGenerateQuestions = () => {
    if (!jobDescription || !experienceLevel || !category || !interviewType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate questions.",
        variant: "destructive",
      });
      return;
    }
    generateQuestionsMutation.mutate({ 
      jobDescription, 
      experienceLevel, 
      category, 
      interviewType,
      companyName,
      companyType
    });
  };

  const handleResearchCompany = () => {
    if (!companyName) {
      toast({
        title: "Missing Company",
        description: "Please enter a company name to research.",
        variant: "destructive",
      });
      return;
    }
    researchCompanyMutation.mutate(companyName);
  };

  const handleStartAICoaching = () => {
    if (!jobDescription || !experienceLevel || !interviewType) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields to start AI coaching.",
        variant: "destructive",
      });
      return;
    }
    startAICoachingMutation.mutate({
      interviewType,
      jobDescription,
      experienceLevel,
      companyProfile: companyProfile || undefined
    });
  };

  const handleAnalyzeAnswer = () => {
    if (!userAnswer || !questions) {
      toast({
        title: "Missing Answer",
        description: "Please provide your answer to analyze.",
        variant: "destructive",
      });
      return;
    }
    const currentQuestion = questions.questions[currentQuestionIndex];
    analyzePerformanceMutation.mutate({
      question: currentQuestion.question,
      userAnswer: userAnswer,
      correctAnswer: currentQuestion.expectedAnswer
    });
  };

  const startSession = () => {
    setIsRecording(true);
    setSessionStartTime(new Date());
    toast({
      title: "Session Started",
      description: "Your practice session has begun.",
    });
  };

  const endSession = () => {
    setIsRecording(false);
    setSessionStartTime(null);
    toast({
      title: "Session Ended",
      description: "Your practice session has ended.",
    });
  };

  const nextQuestion = () => {
    if (questions && currentQuestionIndex < questions.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setPerformance(null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer("");
      setPerformance(null);
    }
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return 0;
    const now = new Date();
    const diff = now.getTime() - sessionStartTime.getTime();
    return Math.floor(diff / 60000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'behavioral': return 'bg-purple-100 text-purple-800';
      case 'situational': return 'bg-orange-100 text-orange-800';
      case 'leadership': return 'bg-indigo-100 text-indigo-800';
      case 'culture': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Interview Preparation</h1>
        <p className="text-gray-600">Practice interviews with AI-powered questions and feedback</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="research">Company Research</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="ai-coach">AI Coach</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Interview Setup
              </CardTitle>
              <CardDescription>
                Configure your interview preparation session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description *</label>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-32"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    placeholder="e.g. Google, Microsoft, Startup Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Type</label>
                  <Select value={companyType} onValueChange={setCompanyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level *</label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Type *</label>
                  <Select value={interviewType} onValueChange={setInterviewType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_TYPES.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-gray-500">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Question Category *</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select question category" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVIEW_CATEGORIES.map((cat) => {
                      const IconComponent = cat.icon;
                      return (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateQuestions}
                  disabled={generateQuestionsMutation.isPending || !jobDescription || !experienceLevel || !category || !interviewType}
                  className="flex-1"
                >
                  {generateQuestionsMutation.isPending ? "Generating..." : "Generate Questions"}
                  <Target className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleStartAICoaching}
                  disabled={startAICoachingMutation.isPending || !jobDescription || !experienceLevel || !interviewType}
                  className="flex-1"
                >
                  {startAICoachingMutation.isPending ? "Starting..." : "Start AI Coach"}
                  <Brain className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Research
              </CardTitle>
              <CardDescription>
                Get AI-powered insights about your target company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter company name to research..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleResearchCompany}
                  disabled={researchCompanyMutation.isPending || !companyName}
                >
                  {researchCompanyMutation.isPending ? "Researching..." : "Research"}
                  <Target className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {companyProfile && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Company Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="font-medium">Industry:</span> {companyProfile.industry}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span> {companyProfile.size}
                        </div>
                        <div>
                          <span className="font-medium">Difficulty:</span> 
                          <Badge className={getDifficultyColor(companyProfile.difficulty)}>
                            {companyProfile.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Culture & Values</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {companyProfile.culture.map((item, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2">
                            {item}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Interview Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {companyProfile.interviewProcess.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Common Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {companyProfile.commonQuestions.map((question, index) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg">
                            <MessageCircle className="w-4 h-4 text-blue-600 inline mr-2" />
                            {question}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
          {questions && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Questions Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {questions.totalQuestions} questions generated
                  </span>
                  <span className="text-sm text-gray-600">
                    Estimated time: {questions.estimatedTime} minutes
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Preparation Tips:</h4>
                  <ul className="space-y-1">
                    {questions.preparationTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button onClick={() => setActiveTab("practice")} className="w-full">
                  Start Practice Session
                  <Play className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          {questions && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Interview Practice
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isRecording && (
                        <div className="flex items-center gap-2 text-red-600">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                          <span className="text-sm">{getSessionDuration()} min</span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={isRecording ? endSession : startSession}
                      >
                        {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Question {currentQuestionIndex + 1} of {questions.questions.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={(currentQuestionIndex + 1) / questions.questions.length * 100} />
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(questions.questions[currentQuestionIndex].difficulty)}>
                        {questions.questions[currentQuestionIndex].difficulty}
                      </Badge>
                      <Badge className={getCategoryColor(questions.questions[currentQuestionIndex].category)}>
                        {questions.questions[currentQuestionIndex].category}
                      </Badge>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-2">Question:</h3>
                      <p className="text-gray-800">
                        {questions.questions[currentQuestionIndex].question}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Tips for this question:</h4>
                      <ul className="space-y-1">
                        {questions.questions[currentQuestionIndex].tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Answer:</label>
                    <Textarea
                      placeholder="Type your answer here..."
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAnalyzeAnswer}
                      disabled={analyzePerformanceMutation.isPending || !userAnswer}
                      className="flex-1"
                    >
                      {analyzePerformanceMutation.isPending ? "Analyzing..." : "Analyze Answer"}
                      <BarChart3 className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleNextQuestion}
                      disabled={currentQuestionIndex === questions.questions.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {performance && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Score:</span>
                        <Progress value={performance.score} className="w-32" />
                        <span className="text-sm font-bold">{performance.score}/100</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">AI Feedback:</h4>
                      <p className="text-sm">{performance.feedback}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-green-600">Strengths:</h4>
                        <ul className="space-y-1">
                          {performance.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-600">Areas for Improvement:</h4>
                        <ul className="space-y-1">
                          {performance.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-600">Key Points Covered:</h4>
                        <ul className="space-y-1">
                          {performance.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Star className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-orange-600">Missed Opportunities:</h4>
                        <ul className="space-y-1">
                          {performance.missedPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Overall Assessment:</strong> {performance.overall}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          
          {!questions && (
            <Card>
              <CardContent className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No questions generated yet. Go to the Generate Questions tab to create your interview questions.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-coach" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Interview Coach
              </CardTitle>
              <CardDescription>
                Get personalized coaching and real-time feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Video Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="video-enabled"
                          checked={videoEnabled}
                          onChange={(e) => setVideoEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="video-enabled" className="text-sm font-medium">
                          Enable video recording
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Record yourself answering questions to analyze body language and presentation skills.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mic className="w-5 h-5" />
                      Voice Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="voice-enabled"
                          checked={voiceEnabled}
                          onChange={(e) => setVoiceEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="voice-enabled" className="text-sm font-medium">
                          Enable voice analysis
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Analyze speech patterns, pace, and clarity for better communication.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {aiCoachingSession && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Coach Active</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Session Type: {aiCoachingSession.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        Duration: {aiCoachingSession.duration} minutes
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Current Recommendations:</h4>
                      <ul className="space-y-1">
                        {aiCoachingSession.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Next Steps:</h4>
                      <ul className="space-y-1">
                        {aiCoachingSession.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!aiCoachingSession && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      Start an AI coaching session to get personalized feedback and guidance.
                    </p>
                    <Button onClick={handleStartAICoaching} disabled={!jobDescription || !experienceLevel || !interviewType}>
                      Start AI Coaching Session
                      <Brain className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}
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
                Track your interview performance and progress over time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">Sessions Completed</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">0</div>
                      <div className="text-sm text-gray-600">Total Practice Time</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Improvement Rate</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Technical Skills</span>
                        <div className="flex items-center gap-2">
                          <Progress value={0} className="w-32" />
                          <span className="text-sm font-medium">0%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Communication</span>
                        <div className="flex items-center gap-2">
                          <Progress value={0} className="w-32" />
                          <span className="text-sm font-medium">0%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={0} className="w-32" />
                          <span className="text-sm font-medium">0%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cultural Fit</span>
                        <div className="flex items-center gap-2">
                          <Progress value={0} className="w-32" />
                          <span className="text-sm font-medium">0%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        No recent activity. Complete some practice sessions to see your progress.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skill Development Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      Complete interview assessments to generate your personalized development plan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}