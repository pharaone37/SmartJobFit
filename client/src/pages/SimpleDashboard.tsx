import React from 'react';
import { motion } from 'framer-motion';

const SimpleDashboard: React.FC = () => {
  const features = [
    {
      id: 'job-search',
      title: 'AI-Powered Job Search',
      description: '95% relevance, 2-second response time',
      icon: '🔍',
      color: 'bg-blue-500',
      stats: '47 matches found'
    },
    {
      id: 'resume-optimization',
      title: 'Resume Optimization',
      description: '99.8% ATS compatibility, 300% response rate increase',
      icon: '📄',
      color: 'bg-green-500',
      stats: '98/100 ATS Score'
    },
    {
      id: 'interview-prep',
      title: 'Interview Preparation',
      description: '78% success rate, 6-language support',
      icon: '👥',
      color: 'bg-purple-500',
      stats: '3 interviews scheduled'
    },
    {
      id: 'application-tracking',
      title: 'Application Tracking',
      description: '100% automated capture, 87% outcome prediction',
      icon: '📊',
      color: 'bg-orange-500',
      stats: '12 applications submitted'
    },
    {
      id: 'salary-intelligence',
      title: 'Salary Intelligence',
      description: '95% accuracy, 73% negotiation success',
      icon: '💰',
      color: 'bg-yellow-500',
      stats: '8 salary insights'
    },
    {
      id: 'career-coaching',
      title: 'Career Coaching',
      description: '68% career advancement in 12 months',
      icon: '🎯',
      color: 'bg-indigo-500',
      stats: '2 career goals set'
    },
    {
      id: 'job-alerts',
      title: 'Job Alerts',
      description: '67% early discovery advantage',
      icon: '🔔',
      color: 'bg-red-500',
      stats: '15 alerts active'
    },
    {
      id: 'one-click-apply',
      title: 'One-Click Apply',
      description: '95% time savings, 34% higher response rates',
      icon: '⚡',
      color: 'bg-teal-500',
      stats: '5 auto-applications'
    },
    {
      id: 'company-intelligence',
      title: 'Company Intelligence',
      description: '96% accuracy, 50,000+ company profiles',
      icon: '🏢',
      color: 'bg-pink-500',
      stats: '23 companies analyzed'
    }
  ];

  const stats = {
    applicationsSubmitted: 12,
    interviewsScheduled: 3,
    resumeOptimizations: 5,
    jobMatches: 47
  };

  const recentActivity = [
    {
      id: '1',
      type: 'application',
      title: 'Applied to Senior Software Engineer',
      description: 'Google • Mountain View, CA',
      timestamp: '2 hours ago',
      status: 'pending'
    },
    {
      id: '2',
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Microsoft • Technical Round',
      timestamp: '1 day ago',
      status: 'in-progress'
    },
    {
      id: '3',
      type: 'resume',
      title: 'Resume Optimized',
      description: 'ATS Score: 98/100',
      timestamp: '2 days ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'salary',
      title: 'Salary Analysis Complete',
      description: 'Market rate: $140K - $180K',
      timestamp: '3 days ago',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Your AI-powered career journey continues. Here's what's happening today.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.applicationsSubmitted}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewsScheduled}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resumes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resumeOptimizations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Job Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.jobMatches}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }} 
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your AI-Powered Features
              </h2>
              <p className="text-gray-600 mb-6">
                Access all 9 revolutionary features to accelerate your career
              </p>
              
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
                      <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {feature.description}
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-2">
                          {feature.stats}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <p className="text-gray-600 mb-6">
                Your latest job search activities
              </p>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                      {activity.type === 'application' && '📝'}
                      {activity.type === 'interview' && '🎯'}
                      {activity.type === 'resume' && '📄'}
                      {activity.type === 'salary' && '💰'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {activity.timestamp}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                View All Activity
              </button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="mt-8"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span>🔍</span>
                <span>Search Jobs</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <span>📄</span>
                <span>Optimize Resume</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <span>🎯</span>
                <span>Practice Interview</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleDashboard; 