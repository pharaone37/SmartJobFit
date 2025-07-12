import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Phone,
  Video,
  FileText,
  Users,
  Settings,
  CreditCard,
  Shield,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function HelpCenter() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      articles: [
        { title: 'Creating Your Account', views: '2.3k', time: '3 min read' },
        { title: 'Setting Up Your Profile', views: '1.8k', time: '5 min read' },
        { title: 'Your First Job Search', views: '3.1k', time: '7 min read' },
        { title: 'Understanding AI Matching', views: '1.5k', time: '4 min read' }
      ]
    },
    {
      id: 'resume-optimization',
      title: 'Resume Optimization',
      icon: FileText,
      articles: [
        { title: 'ATS Optimization Basics', views: '4.2k', time: '8 min read' },
        { title: 'Keyword Matching Guide', views: '2.7k', time: '6 min read' },
        { title: 'Resume Templates', views: '3.5k', time: '5 min read' },
        { title: 'Common Resume Mistakes', views: '2.1k', time: '10 min read' }
      ]
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      icon: Video,
      articles: [
        { title: 'AI Mock Interview Guide', views: '3.8k', time: '12 min read' },
        { title: 'Common Interview Questions', views: '5.1k', time: '15 min read' },
        { title: 'Body Language Tips', views: '2.2k', time: '8 min read' },
        { title: 'Technical Interview Prep', views: '1.9k', time: '20 min read' }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Subscriptions',
      icon: CreditCard,
      articles: [
        { title: 'Subscription Plans Explained', views: '1.7k', time: '4 min read' },
        { title: 'Changing Your Plan', views: '980', time: '3 min read' },
        { title: 'Payment Methods', views: '1.2k', time: '2 min read' },
        { title: 'Refund Policy', views: '750', time: '3 min read' }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How does AI job matching work?',
      answer: 'Our AI analyzes your resume, skills, experience, and preferences to match you with relevant job opportunities across 15+ job boards. The system considers factors like job requirements, company culture, salary range, and location to provide highly accurate matches.'
    },
    {
      question: 'Can I use SmartJobFit for free?',
      answer: 'Yes! We offer a free plan that includes 5 AI job searches per month, basic resume optimization, and limited job board access. You can upgrade to unlock unlimited searches and advanced features.'
    },
    {
      question: 'How accurate is the ATS resume optimization?',
      answer: 'Our ATS optimization has a 95% accuracy rate based on testing with major ATS systems. We analyze over 100 formatting and content factors to ensure your resume passes through applicant tracking systems.'
    },
    {
      question: 'What makes AI interviews different from practice questions?',
      answer: 'Our AI interviewer adapts in real-time to your responses, provides voice and body language analysis, and offers personalized feedback. It\'s like having a professional coach available 24/7.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. You\'ll continue to have access to premium features until the end of your billing period.'
    },
    {
      question: 'Do you support multiple languages?',
      answer: 'Yes! SmartJobFit is available in 10+ languages including English, German, French, Italian, Spanish, Portuguese, Japanese, Korean, Chinese, and Arabic.'
    }
  ];

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      available: true
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Detailed help via email within 24 hours',
      action: 'Send Email',
      available: true
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Available for Professional and AI Career Coach plans',
      action: 'Call Us',
      available: false
    },
    {
      icon: BookOpen,
      title: 'Video Tutorials',
      description: 'Step-by-step guides and tutorials',
      action: 'Watch Now',
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers, get support, and learn how to make the most of SmartJobFit
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="articles" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
          </div>

          {/* Help Articles */}
          <TabsContent value="articles" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.articles.map((article, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                            <div>
                              <p className="font-medium text-sm">{article.title}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{article.views} views</Badge>
                                <span className="text-xs text-muted-foreground">{article.time}</span>
                              </div>
                            </div>
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
                <CardDescription>
                  Quick answers to the most common questions about SmartJobFit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support */}
          <TabsContent value="contact" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
              <p className="text-muted-foreground">Choose the support method that works best for you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className={`text-center hover:shadow-md transition-shadow ${!method.available ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full" 
                        variant={method.available ? "default" : "secondary"}
                        disabled={!method.available}
                      >
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Form */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a detailed message and we'll get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    className="w-full min-h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Please describe your issue or question in detail..."
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}