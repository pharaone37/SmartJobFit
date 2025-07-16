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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: `welcome_${Date.now()}`,
      role: 'assistant',
      content: `Hi! I'm your SmartJobFit Assistant. I'm here to help you with job search, resume optimization, interview preparation, and all our platform features. What can I help you with today?`,
      timestamp: new Date(),
      metadata: {
        suggestedActions: ['Get started guide', 'Explore features', 'Ask a question']
      }
    };
    
    setMessages([welcomeMessage]);
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
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
            </CardContent>

            {/* Quick Actions */}
            {messages.length <= 1 && (
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

            {/* Input */}
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
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default ChatBot;