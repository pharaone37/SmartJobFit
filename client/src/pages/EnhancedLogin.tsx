import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Github,
  Chrome,
  Apple,
  Linkedin,
  User,
  Shield,
  Rocket,
  Star,
  Clock,
  Globe,
  TrendingUp,
  Users,
  Award,
  Target,
  Zap,
  Heart,
  Building,
  DollarSign,
  BarChart3,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Bell,
  Search,
  FileText,
  Calendar,
  Phone,
  MapPin,
  Camera,
  Upload,
  Download,
  Share2,
  Copy,
  Save,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  Info,
  AlertTriangle,
  HelpCircle,
  Settings,
  LogOut,
  RefreshCw,
  Loader2
} from 'lucide-react';

const EnhancedLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      if (isLogin) {
        // Login API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store JWT token
          localStorage.setItem('auth_token', data.token);
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          setErrors({ general: data.message || 'Login failed' });
        }
      } else {
        // Register API call
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store JWT token
          localStorage.setItem('auth_token', data.token);
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          setErrors({ general: data.message || 'Registration failed' });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const socialProviders = [
    { name: 'Google', icon: Chrome, color: 'bg-red-500' },
    { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { name: 'GitHub', icon: Github, color: 'bg-gray-800' },
    { name: 'Apple', icon: Apple, color: 'bg-gray-900' }
  ];

  const features = [
    { icon: Zap, text: 'AI-Powered Job Matching', color: 'text-blue-600' },
    { icon: Target, text: '94% Match Accuracy', color: 'text-green-600' },
    { icon: Award, text: 'Professional Growth', color: 'text-purple-600' },
    { icon: TrendingUp, text: 'Career Advancement', color: 'text-orange-600' }
  ];

  const stats = [
    { value: '50K+', label: 'Success Stories' },
    { value: '78%', label: 'Interview Rate' },
    { value: '2.3M', label: 'Jobs Matched' },
    { value: '94%', label: 'User Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Platform
              </Badge>
              
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Land Your Dream Job
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  10x Faster
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of professionals who've accelerated their careers with our AI-powered job search platform.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 mb-4">
                "SmartJobFit helped me land my dream job at Google. The AI matching was incredibly accurate!"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">SJ</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Sarah Johnson</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Software Engineer at Google</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <motion.div variants={cardVariants}>
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="text-center pb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isLogin ? 'Welcome Back!' : 'Join SmartJobFit'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {isLogin 
                      ? 'Sign in to continue your job search journey'
                      : 'Create your account and start finding your dream job'
                    }
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Social Login */}
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          Continue with
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {socialProviders.slice(0, 2).map((provider) => (
                        <Button
                          key={provider.name}
                          variant="outline"
                          disabled
                          className="w-full opacity-50 cursor-not-allowed"
                          title="Social login coming soon"
                        >
                          <provider.icon className="w-5 h-5 mr-2" />
                          {provider.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        or
                      </span>
                    </div>
                  </div>

                  {/* Error Display */}
                  {errors.general && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-red-700 dark:text-red-300">{errors.general}</span>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                type="text"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="transition-colors"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="transition-colors"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10 transition-colors"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-2"
                        >
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className="pl-10 transition-colors"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-300">
                          Remember me
                        </Label>
                      </div>
                      {isLogin && (
                        <Link
                          to="/forgot-password"
                          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {isLogin ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : (
                        <>
                          {isLogin ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Switch Mode */}
                  <div className="text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <Button
                      variant="link"
                      onClick={() => setIsLogin(!isLogin)}
                      className="ml-2 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 p-0"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogin;