import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Play, 
  Pause, 
  Square,
  RotateCcw,
  CheckCircle,
  Clock,
  Star,
  Brain,
  MessageSquare,
  TrendingUp,
  X,
  Volume2,
  Settings,
  Camera,
  Monitor
} from "lucide-react";

interface InterviewSimulatorProps {
  jobTitle: string;
  industry: string;
  difficulty: string;
  onClose: () => void;
}

interface Question {
  id: string;
  question: string;
  category: string;
  timeLimit: number;
}

interface InterviewSession {
  questions: Question[];
  currentQuestionIndex: number;
  answers: string[];
  startTime: Date;
  isRecording: boolean;
  isPaused: boolean;
}

export default function InterviewSimulator({ jobTitle, industry, difficulty, onClose }: InterviewSimulatorProps) {
  const { toast } = useToast();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Generate questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: async (data: { jobTitle: string; industry: string; difficulty: string }) => {
      return await apiRequest("POST", "/api/interview-prep/questions", data);
    },
    onSuccess: (data) => {
      const questions = data.questions || generateMockQuestions();
      setSession({
        questions,
        currentQuestionIndex: 0,
        answers: new Array(questions.length).fill(""),
        startTime: new Date(),
        isRecording: false,
        isPaused: false
      });
      setTimeRemaining(questions[0]?.timeLimit || 120);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate questions. Using sample questions.",
        variant: "destructive",
      });
      // Fallback to mock questions
      const questions = generateMockQuestions();
      setSession({
        questions,
        currentQuestionIndex: 0,
        answers: new Array(questions.length).fill(""),
        startTime: new Date(),
        isRecording: false,
        isPaused: false
      });
      setTimeRemaining(questions[0]?.timeLimit || 120);
    },
  });

  // Save practice session mutation
  const savePracticeMutation = useMutation({
    mutationFn: async (practiceData: any) => {
      return await apiRequest("POST", "/api/interview-prep/practice", practiceData);
    },
    onSuccess: () => {
      toast({
        title: "Session Saved",
        description: "Your interview practice session has been saved!",
      });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: "Could not save practice session.",
        variant: "destructive",
      });
    },
  });

  // Initialize camera on mount
  useEffect(() => {
    initializeCamera();
    generateQuestionsMutation.mutate({ jobTitle, industry, difficulty });
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopCamera();
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (session?.isRecording && !session.isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session?.isRecording, session?.isPaused, timeRemaining]);

  const generateMockQuestions = (): Question[] => {
    const baseQuestions: Omit<Question, 'id'>[] = [
      {
        question: "Tell me about yourself and why you're interested in this role.",
        category: "Introduction",
        timeLimit: 120
      },
      {
        question: `What experience do you have in ${industry} and specifically with ${jobTitle} responsibilities?`,
        category: "Experience",
        timeLimit: 180
      },
      {
        question: "Describe a challenging project you worked on and how you overcame the obstacles.",
        category: "Behavioral",
        timeLimit: 180
      },
      {
        question: "Where do you see yourself in 5 years and how does this role fit into your career goals?",
        category: "Career Goals",
        timeLimit: 120
      },
      {
        question: "Do you have any questions for me about the role or the company?",
        category: "Questions",
        timeLimit: 90
      }
    ];

    return baseQuestions.map((q, index) => ({
      ...q,
      id: `question_${index}`
    }));
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Failed to access camera:", error);
      setIsVideoEnabled(false);
      setIsAudioEnabled(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const toggleRecording = () => {
    if (!session) return;

    if (session.isRecording) {
      setSession(prev => prev ? { ...prev, isPaused: !prev.isPaused } : null);
    } else {
      setSession(prev => prev ? { ...prev, isRecording: true, isPaused: false } : null);
      const currentQuestion = session.questions[session.currentQuestionIndex];
      setTimeRemaining(currentQuestion.timeLimit);
    }
  };

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
    if (session) {
      const newAnswers = [...session.answers];
      newAnswers[session.currentQuestionIndex] = answer;
      setSession(prev => prev ? { ...prev, answers: newAnswers } : null);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;

    if (session.currentQuestionIndex < session.questions.length - 1) {
      const nextIndex = session.currentQuestionIndex + 1;
      setSession(prev => prev ? { 
        ...prev, 
        currentQuestionIndex: nextIndex,
        isRecording: false,
        isPaused: false
      } : null);
      setCurrentAnswer(session.answers[nextIndex] || "");
      setTimeRemaining(session.questions[nextIndex].timeLimit);
    } else {
      completeInterview();
    }
  };

  const handlePreviousQuestion = () => {
    if (!session || session.currentQuestionIndex === 0) return;

    const prevIndex = session.currentQuestionIndex - 1;
    setSession(prev => prev ? { 
      ...prev, 
      currentQuestionIndex: prevIndex,
      isRecording: false,
      isPaused: false
    } : null);
    setCurrentAnswer(session.answers[prevIndex] || "");
    setTimeRemaining(session.questions[prevIndex].timeLimit);
  };

  const completeInterview = () => {
    if (!session) return;

    // Generate mock analysis results
    const mockResults = {
      overallScore: Math.floor(Math.random() * 20) + 75, // 75-94
      questionScores: session.questions.map((q, index) => ({
        question: q.question,
        score: Math.floor(Math.random() * 30) + 70, // 70-99
        feedback: generateMockFeedback()
      })),
      strengths: [
        "Clear and articulate communication",
        "Good structure in responses",
        "Relevant examples provided"
      ],
      improvements: [
        "Provide more specific metrics and numbers",
        "Practice maintaining eye contact",
        "Work on reducing filler words"
      ],
      recommendations: [
        "Practice the STAR method for behavioral questions",
        "Research company-specific information",
        "Prepare more detailed technical examples"
      ]
    };

    setAnalysisResults(mockResults);
    setShowResults(true);

    // Save the practice session
    savePracticeMutation.mutate({
      type: "behavioral",
      questions: session.questions.map(q => q.question),
      answers: session.answers,
      aiAnalysis: mockResults,
      score: mockResults.overallScore,
      duration: Math.floor((new Date().getTime() - session.startTime.getTime()) / (1000 * 60))
    });
  };

  const generateMockFeedback = () => {
    const feedbacks = [
      "Great response! You provided specific examples and showed clear problem-solving skills.",
      "Good answer, but try to be more concise and focus on quantifiable results.",
      "Consider adding more details about your specific role and contributions.",
      "Excellent use of the STAR method. Your answer was well-structured and engaging.",
      "Try to connect your experience more directly to the requirements of this role."
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (seconds: number, limit: number) => {
    const percentage = seconds / limit;
    if (percentage > 0.5) return "text-green-600";
    if (percentage > 0.25) return "text-yellow-600";
    return "text-red-600";
  };

  if (showResults && analysisResults) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  Interview Complete!
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Here's your AI-powered performance analysis
                </p>
              </div>
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold mb-2 ${analysisResults.overallScore >= 80 ? 'text-green-600' : analysisResults.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {analysisResults.overallScore}%
              </div>
              <p className="text-muted-foreground">
                {analysisResults.overallScore >= 80 ? 'Excellent Performance' : 
                 analysisResults.overallScore >= 60 ? 'Good Performance' : 'Needs Improvement'}
              </p>
            </div>
            <Progress value={analysisResults.overallScore} className="h-3" />
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <TrendingUp className="w-5 h-5 mr-2" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisResults.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-600">
                <Brain className="w-5 h-5 mr-2" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisResults.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Clock className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Question by Question Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResults.questionScores.map((result: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">Question {index + 1}</h4>
                    <Badge variant={result.score >= 80 ? "default" : result.score >= 60 ? "secondary" : "destructive"}>
                      {result.score}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.question}</p>
                  <p className="text-sm">{result.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => {
            setShowResults(false);
            setSession(null);
            generateQuestionsMutation.mutate({ jobTitle, industry, difficulty });
          }}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
          <Button variant="outline" onClick={onClose}>
            Back to Prep
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Preparing Your Interview</h3>
        <p className="text-muted-foreground">
          Our AI is generating personalized questions for your {jobTitle} interview...
        </p>
      </Card>
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Video className="w-6 h-6 text-purple-500 mr-2" />
                AI Mock Interview
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {jobTitle} • {industry} • {difficulty} level
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Exit Interview
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {session.currentQuestionIndex + 1} of {session.questions.length}
            </span>
            <Badge variant="outline">{currentQuestion.category}</Badge>
          </div>
          <Progress 
            value={((session.currentQuestionIndex + 1) / session.questions.length) * 100} 
            className="h-2" 
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Video Preview
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                >
                  {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {isVideoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Recording indicator */}
              {session.isRecording && !session.isPaused && (
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">Recording</span>
                </div>
              )}

              {/* Timer */}
              <div className="absolute top-4 right-4 bg-black/70 rounded-lg px-3 py-1">
                <span className={`text-lg font-mono ${getTimeColor(timeRemaining, currentQuestion.timeLimit)}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={session.currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={toggleRecording}
                className={session.isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              >
                {session.isRecording ? (
                  session.isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  )
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleNextQuestion}>
                {session.currentQuestionIndex === session.questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question & Answer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Interview Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Question {session.currentQuestionIndex + 1}
              </h3>
              <p className="text-blue-700 dark:text-blue-300">{currentQuestion.question}</p>
              <div className="flex items-center justify-between mt-3 text-sm">
                <Badge variant="outline">{currentQuestion.category}</Badge>
                <span className="text-blue-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {Math.floor(currentQuestion.timeLimit / 60)} minutes
                </span>
              </div>
            </div>

            {/* Answer Input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Your Answer</label>
              <Textarea
                placeholder="Start speaking or type your answer here..."
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions
              </p>
            </div>

            {/* Answer timer */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Time Remaining</span>
              <span className={`text-lg font-mono ${getTimeColor(timeRemaining, currentQuestion.timeLimit)}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm mb-1">Interview Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Maintain eye contact with the camera</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Use specific examples to support your answers</li>
                <li>• Practice good posture and professional body language</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
