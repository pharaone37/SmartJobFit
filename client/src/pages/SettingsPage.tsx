import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Mail, 
  Phone, 
  Globe, 
  Moon, 
  Sun, 
  Monitor,
  Key,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Database,
  CreditCard,
  LogOut,
  HelpCircle,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Languages,
  Palette,
  Volume2,
  VolumeX,
  Smartphone,
  Desktop,
  Tablet,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  Archive,
  UserCheck,
  UserX,
  Users,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Sparkles,
  Star,
  Heart,
  Bookmark,
  Filter,
  Search,
  Tag,
  Folder,
  Plus,
  Minus,
  X,
  Check,
  Info,
  AlertTriangle,
  ExternalLink,
  Copy,
  Share2,
  QrCode,
  Scan,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageCircle,
  MessageSquare,
  Send,
  Inbox,
  Archive as ArchiveIcon,
  Flag,
  Pin,
  Paperclip,
  Image,
  FileImage,
  FileVideo,
  FileAudio,
  FilePdf,
  FileCode,
  FileSpreadsheet,
  FileType,
  FolderOpen,
  FolderClosed,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  Move,
  Edit,
  Edit2,
  Edit3,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Unlink,
  Table,
  Grid,
  Columns,
  Rows,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,
  PanelTop,
  PanelBottom
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    jobAlerts: true,
    weeklyReport: true,
    marketing: false
  });

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

  const GeneralSettings = () => (
    <div className="space-y-6">
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="San Francisco, CA" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                  <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                  <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                  <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize your interface preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Switch to dark theme
                  </p>
                </div>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications for {key.toLowerCase()}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({...prev, [key]: checked}))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Notification Schedule
            </CardTitle>
            <CardDescription>
              Set your preferred notification times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Quiet Hours</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Start Time</Label>
                  <Input id="quietStart" type="time" defaultValue="22:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">End Time</Label>
                  <Input id="quietEnd" type="time" defaultValue="08:00" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const PrivacySettings = () => (
    <div className="space-y-6">
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy Controls
            </CardTitle>
            <CardDescription>
              Manage your privacy and data sharing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Profile Visibility</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Make your profile visible to recruiters
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Data Analytics</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Allow anonymous usage analytics
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Data Sharing</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share data with trusted partners
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Download or delete your personal data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Export Data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Download all your data in JSON format
                </p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-900/20">
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">Delete Account</p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Password & Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">SMS Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive codes via SMS
                  </p>
                </div>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Authenticator App</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Use Google Authenticator or similar
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Active Sessions
            </CardTitle>
            <CardDescription>
              Monitor and manage your active sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { device: 'Chrome on Windows', location: 'San Francisco, CA', lastActive: '2 minutes ago', current: true },
              { device: 'Safari on iPhone', location: 'San Francisco, CA', lastActive: '1 hour ago', current: false },
              { device: 'Firefox on macOS', location: 'New York, NY', lastActive: '3 days ago', current: false }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session.device}
                      {session.current && (
                        <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Current
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session.location} • {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
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
              Settings
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your account preferences and security settings
            </p>
          </div>

          {/* Settings Tabs */}
          <motion.div variants={cardVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="general">
                  <GeneralSettings />
                </TabsContent>
                <TabsContent value="notifications">
                  <NotificationSettings />
                </TabsContent>
                <TabsContent value="privacy">
                  <PrivacySettings />
                </TabsContent>
                <TabsContent value="security">
                  <SecuritySettings />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;