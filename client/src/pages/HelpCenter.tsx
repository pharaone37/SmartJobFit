import { useState } from 'react';
import { Bot, MessageCircle, Send, Search, CreditCard, Shield, User, FileText, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HelpCenter() {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your SmartJobFit assistant. I can help you with account setup, billing, upgrades, FAQ, and CV handling. What would you like to know?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const faqCategories = [
    {
      title: 'Account Setup',
      icon: User,
      items: [
        { q: 'How do I create an account?', a: 'Click "Get Started Free" and sign in with your Replit account. No additional registration needed.' },
        { q: 'Can I change my account information?', a: 'Yes, you can update your profile information in your account settings.' },
        { q: 'How do I delete my account?', a: 'Contact support through our help center to request account deletion.' }
      ]
    },
    {
      title: 'Billing & Upgrades',
      icon: CreditCard,
      items: [
        { q: 'How does the free tier work?', a: 'Free tier includes 5 AI job searches per month, basic resume optimization, and limited job board access.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards and debit cards through Stripe.' },
        { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time. Your access continues until the end of the billing period.' },
        { q: 'How do I upgrade to Professional?', a: 'Click "Upgrade to Professional" on any pricing plan. You\'ll get unlimited AI searches, advanced optimization, and priority support.' }
      ]
    },
    {
      title: 'CV & Resume Handling',
      icon: FileText,
      items: [
        { q: 'What resume formats do you support?', a: 'We support PDF, DOC, and DOCX formats. We recommend PDF for best results.' },
        { q: 'Is my resume data secure?', a: 'Yes, all resume data is encrypted and stored securely. We never share your information with third parties.' },
        { q: 'How does AI resume optimization work?', a: 'Our AI analyzes your resume for ATS compatibility, suggests keywords, and provides improvement recommendations.' },
        { q: 'Can I have multiple resumes?', a: 'Yes, Professional and Enterprise plans support multiple resume versions.' }
      ]
    },
    {
      title: 'Security & Privacy',
      icon: Shield,
      items: [
        { q: 'How do you protect my data?', a: 'We use enterprise-grade encryption, secure servers, and follow strict data protection protocols.' },
        { q: 'Do you share my information?', a: 'No, we never share your personal information or job search data with third parties.' },
        { q: 'What about payment security?', a: 'All payments are processed through Stripe with bank-level security and PCI compliance.' },
        { q: 'Can I export my data?', a: 'Yes, you can export your data anytime from your account settings.' }
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      { role: 'user', content: inputMessage },
      { role: 'assistant', content: 'I understand you need help with that. Based on our knowledge base, here are some relevant resources. For specific account issues, please check your account settings or contact our support team.' }
    ]);
    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Bot className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold">SmartJobFit Help Center</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Get instant help with account setup, billing, upgrades, and more
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Assistant Chatbot */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>AI Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border rounded-lg p-4 overflow-y-auto mb-4 space-y-3">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Categories */}
          <div className="lg:col-span-2">
            <div className="grid gap-6">
              {faqCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-purple-600" />
                        <span>{category.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="border-l-2 border-purple-200 pl-4">
                            <h4 className="font-medium text-foreground mb-2">{item.q}</h4>
                            <p className="text-sm text-muted-foreground">{item.a}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upgrade Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Unlock unlimited AI searches and premium features
                </p>
                <Button className="w-full">View Pricing</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Optimize Resume</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get AI-powered resume optimization and ATS scoring
                </p>
                <Button variant="outline" className="w-full">Upload Resume</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account security and privacy settings
                </p>
                <Button variant="outline" className="w-full">Manage Security</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}