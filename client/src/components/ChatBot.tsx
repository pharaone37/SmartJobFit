import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal,
  ExternalLink,
  Star,
  Clock,
  Settings,
  Volume2,
  VolumeX,
  Copy,
  RotateCcw,
  Zap,
  ArrowUp,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestedActions?: string[];
    relatedFeatures?: string[];
  };
}

interface ChatbotResponse {
  message: string;
  confidence: number;
  suggestedActions?: string[];
  relatedFeatures?: string[];
  escalateToHuman?: boolean;
  conversationContext?: any;
}

interface ChatBotProps {
  initialOpen?: boolean;
  currentFeature?: string;
  userContext?: any;
}

interface FeatureOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  subTopics: SubTopic[];
}

interface SubTopic {
  id: string;
  name: string;
  description: string;
  quickQuestions: string[];
}

const ChatBot: React.FC<ChatBotProps> = ({ 
  initialOpen = false, 
  currentFeature,
  userContext 
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentView, setCurrentView] = useState<'features' | 'subtopics' | 'chat'>('features');
  const [selectedFeature, setSelectedFeature] = useState<FeatureOption | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<SubTopic | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Decision Tree Data: 9 Core Features with Sub-topics
  const featureOptions: FeatureOption[] = [
    {
      id: 'job-search',
      name: 'Find Jobs with AI',
      description: 'Search millions of jobs from 15+ platforms with 94% accuracy matching',
      icon: '🔍',
      subTopics: [
        {
          id: 'search-basics',
          name: 'Search Basics',
          description: 'How to search for jobs effectively',
          quickQuestions: [
            'How do I search for jobs?',
            'What job boards do you support?',
            'How does AI matching work?'
          ]
        },
        {
          id: 'filters-sorting',
          name: 'Filters & Sorting',
          description: 'Advanced filtering and sorting options',
          quickQuestions: [
            'How do I filter jobs by salary?',
            'Can I filter by location?',
            'How do I sort results?'
          ]
        },
        {
          id: 'saved-searches',
          name: 'Saved Searches',
          description: 'Save and manage your job searches',
          quickQuestions: [
            'How do I save searches?',
            'Can I edit saved searches?',
            'How many searches can I save?'
          ]
        }
      ]
    },
    {
      id: 'resume-optimization',
      name: 'Optimize Your Resume',
      description: 'Get 99.8% ATS compatibility and 300% more recruiter responses',
      icon: '📄',
      subTopics: [
        {
          id: 'ats-scoring',
          name: 'ATS Scoring',
          description: 'Get your resume scored for ATS compatibility',
          quickQuestions: [
            'What is ATS scoring?',
            'How do I improve my ATS score?',
            'What score should I aim for?'
          ]
        },
        {
          id: 'keyword-optimization',
          name: 'Keyword Optimization',
          description: 'Optimize keywords for specific jobs',
          quickQuestions: [
            'How do I optimize keywords?',
            'What keywords should I use?',
            'How many keywords should I include?'
          ]
        },
        {
          id: 'formatting-tips',
          name: 'Formatting Tips',
          description: 'Professional formatting guidelines',
          quickQuestions: [
            'What format should I use?',
            'How long should my resume be?',
            'What sections should I include?'
          ]
        }
      ]
    },
    {
      id: 'interview-prep',
      name: 'Ace Your Interviews',
      description: 'AI coaching with 78% success rate and real-time feedback',
      icon: '🎯',
      subTopics: [
        {
          id: 'mock-interviews',
          name: 'Mock Interviews',
          description: 'Practice with AI-powered mock interviews',
          quickQuestions: [
            'How do mock interviews work?',
            'Can I practice specific job types?',
            'Do you provide feedback?'
          ]
        },
        {
          id: 'question-types',
          name: 'Question Types',
          description: 'Learn about different interview question categories',
          quickQuestions: [
            'What types of questions should I expect?',
            'How do I answer behavioral questions?',
            'What about technical questions?'
          ]
        },
        {
          id: 'preparation-strategies',
          name: 'Preparation Strategies',
          description: 'Effective interview preparation techniques',
          quickQuestions: [
            'How should I prepare for interviews?',
            'What research should I do?',
            'How can I reduce interview anxiety?'
          ]
        }
      ]
    },
    {
      id: 'application-tracking',
      name: 'Track Your Applications',
      description: 'Smart tracking with 87% outcome prediction and email integration',
      icon: '📊',
      subTopics: [
        {
          id: 'tracking-basics',
          name: 'Tracking Basics',
          description: 'How to track your job applications',
          quickQuestions: [
            'How do I track applications?',
            'What information is tracked?',
            'Can I import existing applications?'
          ]
        },
        {
          id: 'email-integration',
          name: 'Email Integration',
          description: 'Automatic email parsing and updates',
          quickQuestions: [
            'How does email integration work?',
            'What email providers are supported?',
            'Is my email data secure?'
          ]
        },
        {
          id: 'analytics',
          name: 'Analytics',
          description: 'Track your application performance',
          quickQuestions: [
            'What analytics are available?',
            'How do I improve my success rate?',
            'What metrics should I track?'
          ]
        }
      ]
    },
    {
      id: 'salary-intelligence',
      name: 'Salary Intelligence & Negotiation',
      description: '73% achieve salary increases with market data and coaching',
      icon: '💰',
      subTopics: [
        {
          id: 'salary-research',
          name: 'Salary Research',
          description: 'Research salaries for specific roles',
          quickQuestions: [
            'How do I research salaries?',
            'How accurate is the salary data?',
            'Can I see salary ranges by location?'
          ]
        },
        {
          id: 'negotiation-coaching',
          name: 'Negotiation Coaching',
          description: 'Learn effective salary negotiation strategies',
          quickQuestions: [
            'How do I negotiate salary?',
            'When should I negotiate?',
            'What if they say no?'
          ]
        },
        {
          id: 'market-trends',
          name: 'Market Trends',
          description: 'Stay updated on salary market trends',
          quickQuestions: [
            'What are current market trends?',
            'How often is data updated?',
            'Which industries pay the most?'
          ]
        }
      ]
    },
    {
      id: 'career-coaching',
      name: 'Career Coaching & Development',
      description: '68% career advancement with personalized roadmaps and mentorship',
      icon: '🚀',
      subTopics: [
        {
          id: 'career-planning',
          name: 'Career Planning',
          description: 'Plan your career path effectively',
          quickQuestions: [
            'How do I plan my career?',
            'What career paths are available?',
            'How do I set career goals?'
          ]
        },
        {
          id: 'skill-development',
          name: 'Skill Development',
          description: 'Identify and develop key skills',
          quickQuestions: [
            'What skills do I need?',
            'How do I improve my skills?',
            'What skills are in demand?'
          ]
        },
        {
          id: 'career-transitions',
          name: 'Career Transitions',
          description: 'Navigate career changes successfully',
          quickQuestions: [
            'How do I change careers?',
            'What if I have no experience?',
            'How do I explain career gaps?'
          ]
        }
      ]
    },
    {
      id: 'job-alerts',
      name: 'Smart Job Alerts',
      description: 'Get notified instantly when perfect jobs match your criteria',
      icon: '🔔',
      subTopics: [
        {
          id: 'alert-setup',
          name: 'Alert Setup',
          description: 'Set up personalized job alerts',
          quickQuestions: [
            'How do I set up job alerts?',
            'Can I customize alert frequency?',
            'What criteria can I use?'
          ]
        },
        {
          id: 'notification-preferences',
          name: 'Notification Preferences',
          description: 'Manage your notification settings',
          quickQuestions: [
            'How do I change notification settings?',
            'Can I get alerts via email?',
            'How do I turn off alerts?'
          ]
        },
        {
          id: 'alert-management',
          name: 'Alert Management',
          description: 'Organize and manage your alerts',
          quickQuestions: [
            'How do I manage multiple alerts?',
            'Can I pause alerts temporarily?',
            'How do I delete old alerts?'
          ]
        }
      ]
    },
    {
      id: 'one-click-apply',
      name: 'One-Click Apply Automation',
      description: 'Save 8 hours per week with automated applications and AI personalization',
      icon: '⚡',
      subTopics: [
        {
          id: 'automation-setup',
          name: 'Automation Setup',
          description: 'Set up application automation',
          quickQuestions: [
            'How do I set up automation?',
            'What platforms are supported?',
            'Is it safe to use?'
          ]
        },
        {
          id: 'personalization',
          name: 'Personalization',
          description: 'AI-powered application personalization',
          quickQuestions: [
            'How does personalization work?',
            'Can I review before sending?',
            'What if I want to customize?'
          ]
        },
        {
          id: 'automation-rules',
          name: 'Automation Rules',
          description: 'Create rules for automated applications',
          quickQuestions: [
            'How do I create automation rules?',
            'Can I set application limits?',
            'What criteria can I use?'
          ]
        }
      ]
    },
    {
      id: 'company-insights',
      name: 'Company Intelligence',
      description: '96% accuracy in culture assessments and insights',
      icon: '🏢',
      subTopics: [
        {
          id: 'company-research',
          name: 'Company Research',
          description: 'Research companies effectively',
          quickQuestions: [
            'How do I research companies?',
            'What information is available?',
            'How current is the data?'
          ]
        },
        {
          id: 'culture-analysis',
          name: 'Culture Analysis',
          description: 'Understand company culture and values',
          quickQuestions: [
            'How do you analyze company culture?',
            'What culture factors matter most?',
            'How do I assess culture fit?'
          ]
        },
        {
          id: 'competitive-intel',
          name: 'Competitive Intelligence',
          description: 'Compare companies and opportunities',
          quickQuestions: [
            'How do I compare companies?',
            'What makes a company competitive?',
            'How do I evaluate opportunities?'
          ]
        }
      ]
    }
  ];
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, sessionId }: { message: string; sessionId?: string }) => {
      const response = await apiRequest('/api/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({
          message,
          sessionId,
          userProfile: user,
          currentFeature
        })
      });
      return response;
    },
    onSuccess: (data) => {
      const { response, sessionId: newSessionId } = data.data;
      
      if (!sessionId) {
        setSessionId(newSessionId);
      }
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        metadata: {
          confidence: response.confidence,
          suggestedActions: response.suggestedActions,
          relatedFeatures: response.relatedFeatures
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Play sound notification
      if (soundEnabled) {
        playNotificationSound();
      }
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async ({ messageId, rating, feedback }: { messageId: string; rating: number; feedback?: string }) => {
      const response = await apiRequest('/api/chatbot/feedback', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          messageId,
          rating,
          feedback
        })
      });
      return response;
    },
    onSuccess: () => {
      setShowFeedback(null);
    }
  });

  // Get suggestions query
  const { data: suggestions } = useQuery({
    queryKey: ['/api/chatbot/suggestions', sessionId, currentFeature],
    enabled: isOpen && !!sessionId,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const playNotificationSound = () => {
    // Simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Send message
    sendMessageMutation.mutate({ 
      message: message.trim(), 
      sessionId: sessionId || undefined 
    });
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    handleSendMessage();
  };

  const handleFeedback = (messageId: string, rating: number) => {
    submitFeedbackMutation.mutate({ messageId, rating });
  };

  const startNewConversation = () => {
    setMessages([]);
    setSessionId(null);
    setShowFeedback(null);
    setCurrentView('features');
    setSelectedFeature(null);
    setSelectedSubTopic(null);
  };

  const handleFeatureSelect = (feature: FeatureOption) => {
    setSelectedFeature(feature);
    setCurrentView('subtopics');
  };

  const handleSubTopicSelect = (subTopic: SubTopic) => {
    setSelectedSubTopic(subTopic);
    setCurrentView('chat');
    
    // Auto-trigger the first question from the sub-topic
    if (subTopic.quickQuestions.length > 0) {
      const firstQuestion = subTopic.quickQuestions[0];
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: firstQuestion,
        timestamp: new Date()
      };
      
      setMessages([userMessage]);
      setIsTyping(true);
      
      // Auto-send the question
      setTimeout(() => {
        sendMessageMutation.mutate({ 
          message: firstQuestion, 
          sessionId: sessionId || undefined 
        });
      }, 100);
    } else {
      // Fallback to context message if no questions available
      const contextMessage: ChatMessage = {
        id: `context_${Date.now()}`,
        role: 'system',
        content: `You've selected ${selectedFeature?.name} > ${subTopic.name}. How can I help you with this topic?`,
        timestamp: new Date()
      };
      
      setMessages([contextMessage]);
    }
  };

  const handleQuickQuestionSelect = (question: string) => {
    setMessage(question);
    setCurrentView('chat');
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleDirectChatClick = () => {
    setCurrentView('chat');
    if (messages.length === 0) {
      // Add welcome message for direct chat
      const welcomeMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        role: 'assistant',
        content: `Hi! I'm your SmartJobFit Assistant. I can help you with any questions about our 9 core features: job search, resume optimization, interview prep, application tracking, salary intelligence, career coaching, job alerts, one-click apply, and company intelligence. What would you like to know?`,
        timestamp: new Date(),
        metadata: {
          suggestedActions: ['How do I get started?', 'Help me find jobs', 'Optimize my resume', 'Practice interviews']
        }
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleBackToFeatures = () => {
    setCurrentView('features');
    setSelectedFeature(null);
    setSelectedSubTopic(null);
  };

  const handleBackToSubTopics = () => {
    setCurrentView('subtopics');
    setSelectedSubTopic(null);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const quickActions = [
    'How do I get started?',
    'Help me optimize my resume',
    'Practice interview questions',
    'Find jobs matching my skills',
    'What are the pricing plans?',
    'How does AI job search work?'
  ];

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startNewConversation();
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        {suggestions?.data?.length > 0 && (
          <Badge className="absolute -top-2 -left-2 bg-red-500 text-white animate-pulse">
            {suggestions.data.length}
          </Badge>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 right-6 z-50 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } transition-all duration-300`}
    >
      <Card className="h-full flex flex-col shadow-2xl border-0 bg-white dark:bg-gray-900">
        {/* Header */}
        <CardHeader className="flex-row items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">SmartJobFit Assistant</CardTitle>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Content Area */}
            <CardContent className="flex-1 overflow-y-auto p-4">
              {/* Decision Tree Views */}
              {currentView === 'features' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      How can I help you today?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose from our 9 core features to get started
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {featureOptions.map((feature) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: featureOptions.indexOf(feature) * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full p-4 h-auto text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                          onClick={() => handleFeatureSelect(feature)}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{feature.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {feature.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {currentView === 'subtopics' && selectedFeature && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToFeatures}
                      className="p-2"
                    >
                      ← Back
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedFeature.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {selectedFeature.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {selectedFeature.subTopics.map((subTopic) => (
                      <motion.div
                        key={subTopic.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: selectedFeature.subTopics.indexOf(subTopic) * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full p-4 h-auto text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                          onClick={() => handleSubTopicSelect(subTopic)}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {subTopic.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {subTopic.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {subTopic.quickQuestions.slice(0, 2).map((question, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {question.length > 25 ? `${question.substring(0, 25)}...` : question}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {currentView === 'chat' && (
                <div className="space-y-4">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToSubTopics}
                        className="p-2"
                      >
                        ← Back
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedFeature?.icon}</span>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {selectedFeature?.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {selectedSubTopic?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={startNewConversation}
                      className="text-xs"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.role === 'user' 
                            ? 'bg-purple-100 dark:bg-purple-900' 
                            : 'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          {msg.role === 'user' ? (
                            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        
                        {/* Message */}
                        <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          
                          {/* Metadata */}
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{msg.timestamp.toLocaleTimeString()}</span>
                            
                            {msg.metadata?.confidence && (
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(msg.metadata.confidence * 100)}% confident
                              </Badge>
                            )}
                            
                            {msg.role === 'assistant' && (
                              <div className="flex items-center gap-1 ml-auto">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyMessage(msg.content)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(msg.id, 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleFeedback(msg.id, -1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          {/* Suggested Actions */}
                          {msg.metadata?.suggestedActions && msg.metadata.suggestedActions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {msg.metadata.suggestedActions.map((action, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickAction(action)}
                                  className="h-7 text-xs"
                                >
                                  {action}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          {/* Related Features */}
                          {msg.metadata?.relatedFeatures && msg.metadata.relatedFeatures.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {msg.metadata.relatedFeatures.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </CardContent>

            {/* Footer Actions for non-chat views */}
            {(currentView === 'features' || currentView === 'subtopics') && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {currentView === 'features' ? 'Select a feature above or ask directly' : 'Select a topic above or ask directly'}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDirectChatClick}
                    className="text-xs h-7"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Direct Chat
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Actions - Only show in chat mode */}
            {currentView === 'chat' && messages.length <= 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="h-8 text-xs justify-start"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input - Only show in chat mode */}
            {currentView === 'chat' && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="h-10 w-10 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startNewConversation}
                  className="h-7 text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  New Chat
                </Button>
                
                <div className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
              </div>
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default ChatBot;