import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Send, Bot, User, Clock, Target, Lightbulb, BookOpen, Zap, Star, Play } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  context?: {
    jobRole?: string;
    company?: string;
    questionType?: string;
    difficulty?: string;
  };
}

interface InterviewSession {
  id: string;
  jobRole: string;
  company: string;
  sessionType: string;
  difficulty: string;
  messages: ChatMessage[];
  startedAt: Date;
  lastActiveAt: Date;
  feedback?: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
}

const interviewTypes = [
  { value: 'technical', label: 'Technical Interview', icon: '💻' },
  { value: 'behavioral', label: 'Behavioral Interview', icon: '🤝' },
  { value: 'system-design', label: 'System Design', icon: '🏗️' },
  { value: 'case-study', label: 'Case Study', icon: '📊' },
  { value: 'leadership', label: 'Leadership', icon: '👑' },
  { value: 'general', label: 'General Discussion', icon: '💬' }
];

const difficulties = [
  { value: 'junior', label: 'Junior Level', color: 'bg-green-100 text-green-800' },
  { value: 'mid', label: 'Mid Level', color: 'bg-blue-100 text-blue-800' },
  { value: 'senior', label: 'Senior Level', color: 'bg-purple-100 text-purple-800' },
  { value: 'principal', label: 'Principal/Staff', color: 'bg-red-100 text-red-800' }
];

const sampleQuestions = {
  technical: [
    "Tell me about a challenging technical problem you've solved recently.",
    "How would you approach debugging a performance issue in a web application?",
    "Explain the difference between REST and GraphQL APIs.",
    "Walk me through how you would implement a caching strategy."
  ],
  behavioral: [
    "Tell me about a time you had to work with a difficult team member.",
    "Describe a situation where you had to learn something new quickly.",
    "How do you handle competing priorities and tight deadlines?",
    "Give me an example of when you had to give difficult feedback."
  ],
  'system-design': [
    "Design a URL shortening service like bit.ly.",
    "How would you design a chat application like WhatsApp?",
    "Design a notification system for a social media platform.",
    "How would you build a file storage system like Dropbox?"
  ]
};

export default function InterviewChatbot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionSettings, setSessionSettings] = useState({
    jobRole: '',
    company: '',
    sessionType: 'technical',
    difficulty: 'mid'
  });
  const [showSettings, setShowSettings] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions } = useQuery({
    queryKey: ['/api/interview-sessions'],
    staleTime: 300000,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest('/api/interview-sessions', 'POST', sessionData);
    },
    onSuccess: (data) => {
      setCurrentSession(data);
      setShowSettings(false);
      queryClient.invalidateQueries({ queryKey: ['/api/interview-sessions'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create interview session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const chatMutation = useMutation({
    mutationFn: async (messageData: any) => {
      return await apiRequest('/api/interview-chatbot', 'POST', messageData);
    },
    onSuccess: (data) => {
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      return await apiRequest(`/api/interview-sessions/${id}`, 'PUT', updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/interview-sessions'] });
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartSession = () => {
    if (!sessionSettings.jobRole || !sessionSettings.company) {
      toast({
        title: "Missing Information",
        description: "Please provide job role and company name.",
        variant: "destructive",
      });
      return;
    }

    createSessionMutation.mutate({
      jobRole: sessionSettings.jobRole,
      company: sessionSettings.company,
      sessionType: sessionSettings.sessionType,
      difficulty: sessionSettings.difficulty,
      messages: [],
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    });

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your AI interview coach. I'll help you prepare for your ${sessionSettings.sessionType} interview for the ${sessionSettings.jobRole} position at ${sessionSettings.company}. 

Let's start with some practice questions. Are you ready to begin?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      context: {
        jobRole: currentSession.jobRole,
        company: currentSession.company,
        questionType: currentSession.sessionType,
        difficulty: currentSession.difficulty
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    chatMutation.mutate({
      message: inputMessage,
      jobRole: currentSession.jobRole,
      company: currentSession.company,
      sessionId: currentSession.id
    });
  };

  const handleSampleQuestion = (question: string) => {
    const botMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const SessionSetup = () => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Start Interview Practice
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure your interview session to get personalized coaching
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Job Role</label>
            <Input
              value={sessionSettings.jobRole}
              onChange={(e) => setSessionSettings(prev => ({ ...prev, jobRole: e.target.value }))}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <Input
              value={sessionSettings.company}
              onChange={(e) => setSessionSettings(prev => ({ ...prev, company: e.target.value }))}
              placeholder="e.g., Google, Microsoft"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Interview Type</label>
            <Select
              value={sessionSettings.sessionType}
              onValueChange={(value) => setSessionSettings(prev => ({ ...prev, sessionType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {interviewTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty Level</label>
            <Select
              value={sessionSettings.difficulty}
              onValueChange={(value) => setSessionSettings(prev => ({ ...prev, difficulty: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(diff => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleStartSession} className="w-full" size="lg">
          <Play className="h-5 w-5 mr-2" />
          Start Interview Practice
        </Button>
      </CardContent>
    </Card>
  );

  const ChatInterface = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Interview Practice: {currentSession?.jobRole} at {currentSession?.company}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentSession?.sessionType}</Badge>
                <Badge className={difficulties.find(d => d.value === currentSession?.difficulty)?.color}>
                  {difficulties.find(d => d.value === currentSession?.difficulty)?.label}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        {message.type === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="mt-4 flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowSettings(true)}
            >
              <Target className="h-4 w-4 mr-2" />
              New Session
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Session analysis will be available soon!",
                });
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sample Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleQuestions[currentSession?.sessionType as keyof typeof sampleQuestions]?.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2"
                  onClick={() => handleSampleQuestion(question)}
                >
                  <div className="text-xs">{question}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                <div>
                  <p className="font-medium">Be Specific</p>
                  <p className="text-gray-600">Use concrete examples and quantify your achievements</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="font-medium">Structure Your Response</p>
                  <p className="text-gray-600">Use the STAR method (Situation, Task, Action, Result)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 mt-0.5 text-purple-500" />
                <div>
                  <p className="font-medium">Ask Questions</p>
                  <p className="text-gray-600">Show curiosity about the role and company</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Interview Coach
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Practice interviews with AI-powered coaching and real-time feedback
            </p>
          </div>
          {currentSession && (
            <Button
              onClick={() => {
                setCurrentSession(null);
                setMessages([]);
                setShowSettings(true);
              }}
              variant="outline"
            >
              End Session
            </Button>
          )}
        </div>

        {showSettings || !currentSession ? (
          <div className="flex justify-center items-center min-h-[500px]">
            <SessionSetup />
          </div>
        ) : (
          <ChatInterface />
        )}
      </div>
    </div>
  );
}