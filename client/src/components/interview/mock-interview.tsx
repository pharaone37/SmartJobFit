import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Mic,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Star,
  Lightbulb
} from "lucide-react";
import { useState, useEffect } from "react";
import { InterviewQuestion, InterviewFeedback } from "@/lib/types";
import { interviewApi } from "@/lib/api";

interface MockInterviewProps {
  jobDescription?: string;
  resumeContent?: string;
}

export function MockInterview({ jobDescription, resumeContent }: MockInterviewProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'behavioral' | 'technical' | 'mixed'>('mixed');
  const [isLoading, setIsLoading] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateQuestions = async () => {
    if (!jobDescription || !resumeContent) return;
    
    setIsLoading(true);
    try {
      const generatedQuestions = await interviewApi.generateQuestions(
        jobDescription,
        resumeContent,
        10
      );
      
      // Filter by session type if needed
      const filteredQuestions = sessionType === 'mixed' 
        ? generatedQuestions
        : generatedQuestions.filter(q => q.type === sessionType);
      
      setQuestions(filteredQuestions);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsTimerRunning(true);
    setTimer(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsTimerRunning(false);
  };

  const submitResponse = async () => {
    if (!response.trim() || !jobDescription) return;
    
    setIsLoading(true);
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const evaluationFeedback = await interviewApi.evaluateResponse(
        currentQuestion.question,
        response,
        jobDescription
      );
      setFeedback(evaluationFeedback);
    } catch (error) {
      console.error('Failed to evaluate response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setResponse('');
      setFeedback(null);
      setTimer(0);
    }
  };

  const restartInterview = () => {
    setCurrentQuestionIndex(0);
    setResponse('');
    setFeedback(null);
    setTimer(0);
    setIsRecording(false);
    setIsTimerRunning(false);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'situational': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Setup */}
      {questions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Questions</SelectItem>
                  <SelectItem value="behavioral">Behavioral Only</SelectItem>
                  <SelectItem value="technical">Technical Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateQuestions}
              disabled={isLoading || !jobDescription || !resumeContent}
              className="w-full button-gradient"
            >
              {isLoading ? 'Generating Questions...' : 'Start Mock Interview'}
            </Button>
            {(!jobDescription || !resumeContent) && (
              <p className="text-sm text-muted-foreground">
                Please provide job description and resume content to start the interview.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interview Progress */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mock Interview Session</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{formatTime(timer)}</span>
                </div>
                <Button variant="outline" size="sm" onClick={restartInterview}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Question */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interview Question</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={getTypeColor(currentQuestion.type)}>
                  {currentQuestion.type}
                </Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-lg font-medium">{currentQuestion.question}</p>
              {currentQuestion.expectedAnswer && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Tip:</strong> {currentQuestion.expectedAnswer}
                  </p>
                </div>
              )}
            </div>
            
            {/* Response Input */}
            <div className="space-y-2">
              <Label htmlFor="response">Your Response</Label>
              <Textarea
                id="response"
                placeholder="Type your answer here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="sm"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                <div className="flex items-center space-x-2">
                  <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                  <Volume2 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={submitResponse}
                  disabled={!response.trim() || isLoading}
                  className="button-gradient"
                >
                  {isLoading ? 'Evaluating...' : 'Submit Response'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback */}
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>AI Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${getScoreBackground(feedback.overallScore)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(feedback.overallScore)}`}>
                    {feedback.overallScore}
                  </span>
                </div>
                <p className="text-sm font-medium">Overall</p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${getScoreBackground(feedback.communicationScore)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(feedback.communicationScore)}`}>
                    {feedback.communicationScore}
                  </span>
                </div>
                <p className="text-sm font-medium">Communication</p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${getScoreBackground(feedback.technicalScore)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(feedback.technicalScore)}`}>
                    {feedback.technicalScore}
                  </span>
                </div>
                <p className="text-sm font-medium">Technical</p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${getScoreBackground(feedback.confidenceScore)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(feedback.confidenceScore)}`}>
                    {feedback.confidenceScore}
                  </span>
                </div>
                <p className="text-sm font-medium">Confidence</p>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Detailed Feedback
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {feedback.feedback}
                </p>
              </div>

              {feedback.improvements.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Improvement Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setFeedback(null)}>
                Try Again
              </Button>
              {currentQuestionIndex < questions.length - 1 ? (
                <Button onClick={nextQuestion} className="button-gradient">
                  Next Question
                </Button>
              ) : (
                <Button onClick={restartInterview} className="button-gradient">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Interview
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
