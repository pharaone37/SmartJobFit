import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  Play, 
  Square, 
  Plus, 
  BarChart3, 
  BookOpen, 
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  GraduationCap,
  Trophy
} from 'lucide-react';
import { 
  type InterviewCoachingSession, 
  type InterviewQuestion, 
  type InterviewResponse, 
  type InterviewFeedback,
  type UserInterviewProgress
} from '@shared/schema';

interface InterviewCoachProps {}

const InterviewCoach: React.FC<InterviewCoachProps> = () => {
  const [activeSession, setActiveSession] = useState<InterviewCoachingSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [sessionType, setSessionType] = useState<'behavioral' | 'technical' | 'company-specific' | 'panel' | 'group'>('behavioral');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [targetRole, setTargetRole] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's interview sessions
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/interview-coaching/sessions'],
    enabled: !activeSession
  });

  // Fetch user's interview progress
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/interview-coaching/progress']
  });

  // Fetch questions for current session
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/interview-coaching/questions', sessionType, difficulty],
    enabled: !!activeSession
  });

  // Fetch responses for current session
  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ['/api/interview-coaching/responses', activeSession?.id],
    enabled: !!activeSession
  });

  // Create new interview session
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return apiRequest('/api/interview-coaching/sessions', {
        method: 'POST',
        body: sessionData
      });
    },
    onSuccess: (data) => {
      setActiveSession(data.session);
      queryClient.invalidateQueries({ queryKey: ['/api/interview-coaching/sessions'] });
      toast({
        title: "Interview Session Started",
        description: "Your interview coaching session has been created successfully!",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create interview session",
        variant: "destructive"
      });
    }
  });

  // Submit interview response
  const submitResponseMutation = useMutation({
    mutationFn: async (responseData: any) => {
      return apiRequest('/api/interview-coaching/responses', {
        method: 'POST',
        body: responseData
      });
    },
    onSuccess: (data) => {
      setCurrentResponse('');
      setAnsweredQuestions(prev => [...prev, currentQuestion?.id || '']);
      setSessionProgress(prev => prev + 1);
      queryClient.invalidateQueries({ queryKey: ['/api/interview-coaching/responses', activeSession?.id] });
      toast({
        title: "Response Submitted",
        description: "Your response has been recorded and analyzed!",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit response",
        variant: "destructive"
      });
    }
  });

  // Update session
  const updateSessionMutation = useMutation({
    mutationFn: async ({ sessionId, updates }: { sessionId: string; updates: any }) => {
      return apiRequest(`/api/interview-coaching/sessions/${sessionId}`, {
        method: 'PUT',
        body: updates
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/interview-coaching/sessions'] });
    }
  });

  // Start a new interview session
  const startNewSession = () => {
    if (!targetRole.trim()) {
      toast({
        title: "Target Role Required",
        description: "Please enter the job role you're preparing for",
        variant: "destructive"
      });
      return;
    }

    const sessionData = {
      sessionType,
      difficulty,
      targetRole: targetRole.trim(),
      companyId: companyId.trim() || undefined,
      language: 'en',
      coachingPersonality: {
        type: 'supportive',
        tone: 'encouraging',
        feedbackStyle: 'constructive',
        encouragementLevel: 8
      }
    };

    createSessionMutation.mutate(sessionData);
  };

  // Get next question
  const getNextQuestion = () => {
    if (!questions?.questions || questions.questions.length === 0) return null;
    
    const availableQuestions = questions.questions.filter(
      (q: InterviewQuestion) => !answeredQuestions.includes(q.id)
    );
    
    if (availableQuestions.length === 0) {
      setShowResults(true);
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    return availableQuestions[randomIndex];
  };

  // Handle next question
  const handleNextQuestion = () => {
    const nextQuestion = getNextQuestion();
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    }
  };

  // Submit current response
  const handleSubmitResponse = () => {
    if (!currentResponse.trim() || !currentQuestion || !activeSession) return;

    const responseData = {
      sessionId: activeSession.id,
      questionId: currentQuestion.id,
      responseText: currentResponse.trim(),
      timeToThink: 30, // Placeholder - would be calculated
      responseTime: 120, // Placeholder - would be calculated
      confidenceScore: 75, // Placeholder - would be analyzed
      clarityScore: 80, // Placeholder - would be analyzed
      contentScore: 85 // Placeholder - would be analyzed
    };

    submitResponseMutation.mutate(responseData);
  };

  // Complete session
  const completeSession = () => {
    if (!activeSession) return;

    const updates = {
      status: 'completed',
      duration: Math.floor(sessionProgress * 3), // Rough estimate
      overallScore: Math.floor(Math.random() * 20) + 80 // Placeholder
    };

    updateSessionMutation.mutate({ sessionId: activeSession.id, updates });
    setActiveSession(null);
    setCurrentQuestion(null);
    setSessionProgress(0);
    setAnsweredQuestions([]);
    setShowResults(false);
  };

  // Initialize first question when session starts
  useEffect(() => {
    if (activeSession && questions?.questions && questions.questions.length > 0 && !currentQuestion) {
      handleNextQuestion();
    }
  }, [activeSession, questions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'behavioral': return <MessageSquare className="w-4 h-4" />;
      case 'technical': return <BookOpen className="w-4 h-4" />;
      case 'company-specific': return <GraduationCap className="w-4 h-4" />;
      case 'panel': return <BarChart3 className="w-4 h-4" />;
      case 'group': return <Trophy className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (sessionsLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Coach</h1>
          <p className="text-gray-600 dark:text-gray-400">AI-powered interview preparation and coaching</p>
        </div>
        {!activeSession && (
          <Button onClick={() => setActiveSession(null)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        )}
      </div>

      {/* User Progress Overview */}
      {userProgress?.progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userProgress.progress.totalSessions || 0}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userProgress.progress.hoursSpent || 0}h</div>
                <div className="text-sm text-gray-600">Hours Practiced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userProgress.progress.improvementRate || 0}%</div>
                <div className="text-sm text-gray-600">Improvement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userProgress.progress.achievements?.length || 0}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Session */}
      {activeSession ? (
        <div className="space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getSessionTypeIcon(activeSession.sessionType)}
                {activeSession.sessionType.charAt(0).toUpperCase() + activeSession.sessionType.slice(1)} Interview
              </CardTitle>
              <CardDescription>
                Role: {activeSession.targetRole} | Difficulty: {activeSession.difficulty}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge className={getDifficultyColor(activeSession.difficulty)}>
                    {activeSession.difficulty}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{sessionProgress} questions answered</span>
                  </div>
                </div>
                <Button onClick={completeSession} variant="outline">
                  Complete Session
                </Button>
              </div>
              <div className="mt-4">
                <Progress value={(sessionProgress / 10) * 100} className="w-full" />
                <p className="text-sm text-gray-600 mt-1">Progress: {sessionProgress}/10 questions</p>
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          {currentQuestion && !showResults && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Question</CardTitle>
                <CardDescription>
                  Category: {currentQuestion.category} | Expected duration: {currentQuestion.expectedDuration}s
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-lg font-medium">{currentQuestion.questionText}</p>
                </div>
                
                {currentQuestion.keywords && currentQuestion.keywords.length > 0 && (
                  <div>
                    <Label>Key Topics to Address:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentQuestion.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea
                    id="response"
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    placeholder="Type your response here..."
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsRecording(!isRecording)}
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Record Audio
                        </>
                      )}
                    </Button>
                    <span className="text-sm text-gray-600">
                      {isRecording ? 'Recording...' : 'Click to record your response'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleNextQuestion}
                      variant="outline"
                      disabled={questionsLoading}
                    >
                      Skip Question
                    </Button>
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={!currentResponse.trim() || submitResponseMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submitResponseMutation.isPending ? 'Submitting...' : 'Submit Response'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Results */}
          {showResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Session Complete!
                </CardTitle>
                <CardDescription>
                  Great job! You've completed your interview practice session.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{sessionProgress}</div>
                      <div className="text-sm text-gray-600">Questions Answered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{Math.floor(sessionProgress * 3)}min</div>
                      <div className="text-sm text-gray-600">Total Time</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Strengths:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Clear and concise communication</li>
                      <li>Good use of specific examples</li>
                      <li>Confident delivery</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Could provide more quantifiable achievements</li>
                      <li>Consider using the STAR method more consistently</li>
                      <li>Practice speaking at a slightly slower pace</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <Button onClick={() => setActiveSession(null)} variant="outline">
                      Back to Dashboard
                    </Button>
                    <Button onClick={completeSession} className="bg-green-600 hover:bg-green-700">
                      Save Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Session Setup */
        <div className="space-y-6">
          {/* Recent Sessions */}
          {sessions?.sessions && sessions.sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your latest interview practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessions.sessions.slice(0, 3).map((session: InterviewCoachingSession) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSessionTypeIcon(session.sessionType)}
                        <div>
                          <div className="font-medium">{session.targetRole}</div>
                          <div className="text-sm text-gray-600">
                            {session.sessionType} • {session.difficulty} • {session.status}
                          </div>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(session.difficulty)}>
                        {session.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Session Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Start New Interview Session</CardTitle>
              <CardDescription>Configure your interview practice session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Input
                    id="targetRole"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Software Engineer, Product Manager"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company (Optional)</Label>
                  <Input
                    id="companyId"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    placeholder="e.g., Google, Microsoft, Startup"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionType">Interview Type</Label>
                  <Select value={sessionType} onValueChange={(value: any) => setSessionType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="company-specific">Company-specific</SelectItem>
                      <SelectItem value="panel">Panel Interview</SelectItem>
                      <SelectItem value="group">Group Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={startNewSession}
                  disabled={createSessionMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createSessionMutation.isPending ? 'Creating...' : 'Start Interview Session'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InterviewCoach;