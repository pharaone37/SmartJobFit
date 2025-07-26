import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Users, 
  TrendingUp, 
  Bell, 
  Zap, 
  Building, 
  Target, 
  BarChart3,
  Plus,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
  applicationsSubmitted: number;
  interviewsScheduled: number;
  resumeOptimizations: number;
  jobMatches: number;
  salaryInsights: number;
  careerGoals: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'interview' | 'resume' | 'salary' | 'coaching';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'in-progress';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch data from mock API
  const { data: stats = {
    applicationsSubmitted: 12,
    interviewsScheduled: 3,
    resumeOptimizations: 5,
    jobMatches: 47,
    salaryInsights: 8,
    careerGoals: 2
  } } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });
  
  const { data: recentActivity = [] } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: dashboardApi.getActivity,
  });

  const features = [
    {
      id: 'job-search',
      title: 'AI-Powered Job Search',
      description: '95% relevance, 2-second response time',
      icon: Search,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      stats: '47 matches found',
      action: 'Search Jobs'
    },
    {
      id: 'resume-optimization',
      title: 'Resume Optimization',
      description: '99.8% ATS compatibility, 300% response rate increase',
      icon: FileText,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      stats: '98/100 ATS Score',
      action: 'Optimize Resume'
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      description: '78% success rate, 6-language support',
      icon: Users,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      stats: '3 interviews scheduled',
      action: 'Practice Interview'
    },
    {
      id: 'application-tracking',
      title: 'Application Tracking',
      description: '100% automated capture, 87% outcome prediction',
      icon: BarChart3,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      stats: '12 applications submitted',
      action: 'View Applications'
    },
    {
      id: 'salary-intelligence',
      title: 'Salary Intelligence',
      description: '95% accuracy, 73% negotiation success',
      icon: DollarSign,
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-emerald-600',
      stats: '8 salary insights',
      action: 'Analyze Salary'
    },
    {
      id: 'career-coaching',
      title: 'Career Coaching',
      description: '68% career advancement in 12 months',
      icon: Target,
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
      stats: '2 goals set',
      action: 'Get Coaching'
    },
    {
      id: 'job-alerts',
      title: 'Job Alerts',
      description: '67% early discovery advantage',
      icon: Bell,
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      stats: '5 active alerts',
      action: 'Manage Alerts'
    },
    {
      id: 'one-click-apply',
      title: 'One-Click Apply',
      description: '95% time savings, 34% higher response rates',
      icon: Zap,
      color: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600',
      stats: '8 applications automated',
      action: 'Setup Automation'
    },
    {
      id: 'company-intelligence',
      title: 'Company Intelligence',
      description: '96% accuracy, 50,000+ company profiles',
      icon: Building,
      color: 'bg-pink-500',
      gradient: 'from-pink-500 to-pink-600',
      stats: '15 companies analyzed',
      action: 'Research Companies'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your job search today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.applicationsSubmitted}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <Progress value={75} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.interviewsScheduled}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Progress value={60} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.jobMatches}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <Progress value={85} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <Progress value={87} className="mt-4" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Your AI-Powered Features</CardTitle>
                <CardDescription>
                  Access all 9 revolutionary features to accelerate your career
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="group relative p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${feature.color} bg-opacity-10`}>
                          <feature.icon className={`w-5 h-5 ${feature.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="secondary" className="text-xs">
                              {feature.stats}
                            </Badge>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              {feature.action}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                <CardDescription>
                  Your latest job search activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(activity.status)}`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to accelerate your career?</h3>
                  <p className="text-blue-100 mb-4">
                    Get personalized AI recommendations and start applying to your dream jobs today.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="secondary" size="sm">
                      Start Job Search
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-blue-600">
                      View Analytics
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="p-4 bg-white bg-opacity-20 rounded-full">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
