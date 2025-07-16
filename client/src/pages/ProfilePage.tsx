import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Star,
  Edit3, 
  Save, 
  Camera, 
  Upload,
  Calendar,
  Globe,
  Linkedin,
  Github,
  Trophy,
  Target,
  TrendingUp,
  Eye,
  FileText,
  Download,
  Share2,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Key,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
  X,
  Check,
  AlertCircle,
  Sparkles,
  Zap,
  Clock,
  Building,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    bio: 'Passionate software engineer with 8+ years of experience building scalable web applications. Specialized in React, TypeScript, and cloud architecture.',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'PostgreSQL'],
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    website: 'https://johndoe.dev'
  });

  const [activeTab, setActiveTab] = useState('overview');

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to the backend
  };

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

  const ProfileHeader = () => (
    <motion.div variants={cardVariants}>
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">{profileData.title}</p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{profileData.company}</p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="transition-all duration-300"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">127</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Profile Views</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Match Rate</div>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">23</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Applications</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ProfileTabs = () => (
    <motion.div variants={cardVariants}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto mb-6 bg-transparent border-b border-border p-0">
          <TabsTrigger value="overview" className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            <User className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            <Briefcase className="w-4 h-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            <Award className="w-4 h-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            <BarChart3 className="w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="min-h-[120px]"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {profileData.bio}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Links & Social
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <Input
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                    disabled={!isEditing}
                    placeholder="LinkedIn URL"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                  <Input
                    value={profileData.github}
                    onChange={(e) => setProfileData({...profileData, github: e.target.value})}
                    disabled={!isEditing}
                    placeholder="GitHub URL"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <Input
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Personal Website"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Experience Items */}
                <div className="space-y-4">
                  {[
                    {
                      title: "Senior Software Engineer",
                      company: "TechCorp Inc.",
                      duration: "2022 - Present",
                      location: "San Francisco, CA",
                      description: "Leading development of scalable web applications using React and Node.js. Mentoring junior developers and driving technical decisions."
                    },
                    {
                      title: "Software Engineer",
                      company: "StartupXYZ",
                      duration: "2020 - 2022",
                      location: "Remote",
                      description: "Built full-stack applications from scratch. Implemented CI/CD pipelines and improved system performance by 40%."
                    }
                  ].map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">{job.company}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{job.duration} • {job.location}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{job.description}</p>
                    </motion.div>
                  ))}
                </div>
                
                <Button className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="px-3 py-1 text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
                      >
                        {skill}
                        {isEditing && (
                          <X className="w-3 h-3 ml-2 hover:text-red-500" />
                        )}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Applied to Senior Developer position", company: "Google", time: "2 hours ago", icon: Briefcase },
                    { action: "Updated resume", details: "Added new project", time: "1 day ago", icon: FileText },
                    { action: "Completed interview", company: "Microsoft", time: "3 days ago", icon: Users },
                    { action: "Profile viewed", details: "45 new views", time: "1 week ago", icon: Eye }
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <activity.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        {activity.company && (
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            {activity.company}
                          </p>
                        )}
                        {activity.details && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.details}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new opportunities</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Privacy Settings</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Control your profile visibility</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Billing & Subscription</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage your premium plan</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <ProfileHeader />
          <ProfileTabs />
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;