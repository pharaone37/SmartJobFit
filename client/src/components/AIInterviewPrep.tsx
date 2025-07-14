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
  TrendingUp
} from "lucide-react";

interface InterviewQuestion {
  question: string;
  difficulty: string;
  category: string;
  tips: string[];
}

interface InterviewQuestions {
  questions: InterviewQuestion[];
  totalQuestions: number;
  estimatedTime: number;
  preparationTips: string[];
}

interface InterviewPerformance {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  keyPoints: string[];
  missedPoints: string[];
  overall: string;
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
  { value: "technical", label: "Technical Questions" },
  { value: "behavioral", label: "Behavioral Questions" },
  { value: "situational", label: "Situational Questions" },
  { value: "leadership", label: "Leadership Questions" },
  { value: "culture", label: "Culture Fit Questions" },
  { value: "mixed", label: "Mixed Questions" }
];

export default function AIInterviewPrep() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [jobDescription, setJobDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("generate");
  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [performance, setPerformance] = useState<InterviewPerformance | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const generateQuestionsMutation = useMutation({
    mutationFn: async (data: { jobDescription: string; experienceLevel: string; category: string }) => {
      return await apiRequest('/api/interview/questions', {
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

  const analyzePerformanceMutation = useMutation({
    mutationFn: async (data: { question: string; userAnswer: string; correctAnswer?: string }) => {
      return await apiRequest('/api/interview/analyze', {
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
    if (!jobDescription || !experienceLevel || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate questions.",
        variant: "destructive",
      });
      return;
    }
    generateQuestionsMutation.mutate({ jobDescription, experienceLevel, category });
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
      userAnswer: userAnswer
    });
  };

  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setPerformance(null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer("");
      setPerformance(null);
    }
  };

  const startSession = () => {
    setSessionStartTime(new Date());
    setIsRecording(true);
  };

  const endSession = () => {
    setIsRecording(false);
    setSessionStartTime(null);
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return 0;
    return Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000);
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Questions</TabsTrigger>
          <TabsTrigger value="practice">Practice Interview</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Generate Interview Questions
              </CardTitle>
              <CardDescription>
                Create personalized interview questions based on your job description and experience level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <label className="text-sm font-medium">Question Category *</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question category" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVIEW_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateQuestions}
                disabled={generateQuestionsMutation.isPending || !jobDescription || !experienceLevel || !category}
                className="w-full"
              >
                {generateQuestionsMutation.isPending ? "Generating..." : "Generate Questions"}
                <Target className="w-4 h-4 ml-2" />
              </Button>
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

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>
                Track your interview performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Performance tracking will be available after completing interview sessions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}