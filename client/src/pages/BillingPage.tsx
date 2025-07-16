import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Receipt, 
  AlertCircle, 
  CheckCircle, 
  Star,
  Crown,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Building,
  Sparkles,
  Award,
  Rocket,
  Gift,
  Bell,
  Eye,
  Lock,
  Unlock,
  Plus,
  Minus,
  X,
  Check,
  Info,
  AlertTriangle,
  CreditCard as Card2,
  Banknote,
  Wallet,
  PiggyBank,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const BillingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [autoRenewal, setAutoRenewal] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        '5 job applications per month',
        'Basic resume analysis',
        'Standard interview prep',
        'Email support'
      ],
      limitations: [
        'Limited AI features',
        'Basic analytics',
        'Standard templates'
      ],
      popular: false,
      current: false
    },
    {
      name: 'Professional',
      price: 19,
      period: 'month',
      description: 'For serious job seekers',
      features: [
        'Unlimited job applications',
        'Advanced AI matching',
        'Premium resume templates',
        'Priority interview coaching',
        'Salary negotiation tools',
        'Advanced analytics'
      ],
      limitations: [],
      popular: true,
      current: true
    },
    {
      name: 'Enterprise',
      price: 49,
      period: 'month',
      description: 'For power users and teams',
      features: [
        'Everything in Professional',
        'Custom AI training',
        'White-label solutions',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security'
      ],
      limitations: [],
      popular: false,
      current: false
    }
  ];

  const currentPlan = plans.find(plan => plan.current);

  const usageStats = {
    jobApplications: { used: 87, limit: 'unlimited', percentage: 0 },
    aiAnalyses: { used: 234, limit: 'unlimited', percentage: 0 },
    interviews: { used: 12, limit: 'unlimited', percentage: 0 },
    resumeOptimizations: { used: 45, limit: 'unlimited', percentage: 0 }
  };

  const invoices = [
    {
      id: 'inv_001',
      date: '2024-01-01',
      amount: 19.00,
      status: 'paid',
      plan: 'Professional',
      period: 'Jan 2024'
    },
    {
      id: 'inv_002',
      date: '2023-12-01',
      amount: 19.00,
      status: 'paid',
      plan: 'Professional',
      period: 'Dec 2023'
    },
    {
      id: 'inv_003',
      date: '2023-11-01',
      amount: 19.00,
      status: 'paid',
      plan: 'Professional',
      period: 'Nov 2023'
    }
  ];

  const CurrentPlanCard = () => (
    <motion.div variants={cardVariants}>
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Crown className="w-6 h-6 text-yellow-500" />
                Current Plan: {currentPlan?.name}
              </CardTitle>
              <CardDescription className="text-lg mt-1">
                {currentPlan?.description}
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ${currentPlan?.price}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                per {currentPlan?.period}
              </div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                Jan 15
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Next billing date
              </div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                47
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Days remaining
              </div>
            </div>
          </div>

          {/* Auto-renewal Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-renewal</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automatically renew your subscription
                </p>
              </div>
            </div>
            <Switch
              checked={autoRenewal}
              onCheckedChange={setAutoRenewal}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" className="flex-1">
              <Receipt className="w-4 h-4 mr-2" />
              Billing History
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Rocket className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const UsageCard = () => (
    <motion.div variants={cardVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Usage Statistics
          </CardTitle>
          <CardDescription>
            Current month usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(usageStats).map(([key, stat]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.used} {stat.limit !== 'unlimited' ? `/ ${stat.limit}` : ''}
                </span>
              </div>
              {stat.limit !== 'unlimited' ? (
                <Progress value={stat.percentage} className="h-2" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    Unlimited
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

  const PlanComparison = () => (
    <motion.div variants={cardVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Available Plans
          </CardTitle>
          <CardDescription>
            Choose the perfect plan for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
                  plan.current
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per {plan.period}
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                  {plan.description}
                </p>

                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${
                    plan.current 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Select Plan'}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const PaymentMethod = () => (
    <motion.div variants={cardVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </CardTitle>
          <CardDescription>
            Manage your payment information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                •••• •••• •••• 4242
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expires 12/25
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
            <Button variant="outline" className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const BillingHistory = () => (
    <motion.div variants={cardVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Billing History
          </CardTitle>
          <CardDescription>
            Your recent invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {invoice.plan} - {invoice.period}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Billing & Subscription
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your subscription and billing information
            </p>
          </div>

          {/* Current Plan */}
          <CurrentPlanCard />

          {/* Usage Stats */}
          <UsageCard />

          {/* Plan Comparison */}
          <PlanComparison />

          {/* Payment Method */}
          <PaymentMethod />

          {/* Billing History */}
          <BillingHistory />
        </motion.div>
      </div>
    </div>
  );
};

export default BillingPage;