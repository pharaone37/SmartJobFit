import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  Medal,
  Crown,
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText,
  Send,
  Eye,
  Handshake,
  Plus,
  Filter
} from 'lucide-react';

interface JobApplication {
  id: string;
  title: string;
  company: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  lastUpdate: string;
  salary?: string;
  location: string;
  difficulty: 'entry' | 'mid' | 'senior' | 'lead';
  xpEarned: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'applications' | 'interviews' | 'skills' | 'networking' | 'goals';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

interface PlayerStats {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
  applicationsCount: number;
  interviewsCount: number;
  offersCount: number;
  streak: number;
  rank: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'milestone';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  xpReward: number;
  progress: number;
  maxProgress: number;
  deadline?: string;
  completed: boolean;
}

export default function GamifiedJobTracker() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Sample data for demo
  const sampleApplications: JobApplication[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      status: 'interview',
      appliedDate: '2025-01-15',
      lastUpdate: '2025-01-16',
      salary: '$120k - $150k',
      location: 'San Francisco, CA',
      difficulty: 'senior',
      xpEarned: 150
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      status: 'applied',
      appliedDate: '2025-01-14',
      lastUpdate: '2025-01-14',
      salary: '$90k - $110k',
      location: 'Remote',
      difficulty: 'mid',
      xpEarned: 100
    },
    {
      id: '3',
      title: 'React Developer',
      company: 'InnovateNow',
      status: 'offer',
      appliedDate: '2025-01-10',
      lastUpdate: '2025-01-16',
      salary: '$105k - $125k',
      location: 'New York, NY',
      difficulty: 'mid',
      xpEarned: 250
    }
  ];

  const sampleAchievements: Achievement[] = [
    {
      id: 'first_app',
      name: 'First Steps',
      description: 'Submit your first job application',
      icon: '🎯',
      category: 'applications',
      rarity: 'common',
      unlockedAt: '2025-01-14',
      progress: 1,
      maxProgress: 1,
      xpReward: 50
    },
    {
      id: 'interview_ace',
      name: 'Interview Ace',
      description: 'Complete 5 interviews',
      icon: '🎤',
      category: 'interviews',
      rarity: 'rare',
      progress: 3,
      maxProgress: 5,
      xpReward: 200
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Apply to jobs for 7 consecutive days',
      icon: '🔥',
      category: 'goals',
      rarity: 'epic',
      unlockedAt: '2025-01-16',
      progress: 7,
      maxProgress: 7,
      xpReward: 300
    },
    {
      id: 'networking_ninja',
      name: 'Networking Ninja',
      description: 'Connect with 20 professionals on LinkedIn',
      icon: '🥷',
      category: 'networking',
      rarity: 'rare',
      progress: 15,
      maxProgress: 20,
      xpReward: 150
    }
  ];

  const samplePlayerStats: PlayerStats = {
    level: 8,
    totalXP: 2350,
    xpToNextLevel: 650,
    applicationsCount: 12,
    interviewsCount: 5,
    offersCount: 2,
    streak: 7,
    rank: 'Job Hunter Elite',
    weeklyGoal: 5,
    weeklyProgress: 3
  };

  const sampleQuests: Quest[] = [
    {
      id: 'daily_app',
      title: 'Daily Application',
      description: 'Submit 1 job application today',
      category: 'daily',
      difficulty: 'easy',
      xpReward: 50,
      progress: 1,
      maxProgress: 1,
      completed: true
    },
    {
      id: 'weekly_interviews',
      title: 'Interview Week',
      description: 'Schedule 3 interviews this week',
      category: 'weekly',
      difficulty: 'medium',
      xpReward: 200,
      progress: 2,
      maxProgress: 3,
      deadline: '2025-01-20',
      completed: false
    },
    {
      id: 'skill_boost',
      title: 'Skill Boost',
      description: 'Complete a coding challenge or online course',
      category: 'weekly',
      difficulty: 'medium',
      xpReward: 150,
      progress: 0,
      maxProgress: 1,
      deadline: '2025-01-20',
      completed: false
    },
    {
      id: 'cover_letter_master',
      title: 'Cover Letter Master',
      description: 'Write personalized cover letters for 10 applications',
      category: 'monthly',
      difficulty: 'hard',
      xpReward: 500,
      progress: 7,
      maxProgress: 10,
      deadline: '2025-01-31',
      completed: false
    }
  ];

  useEffect(() => {
    setApplications(sampleApplications);
    setAchievements(sampleAchievements);
    setPlayerStats(samplePlayerStats);
    setQuests(sampleQuests);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Send className="h-4 w-4" />;
      case 'screening': return <Eye className="h-4 w-4" />;
      case 'interview': return <MessageSquare className="h-4 w-4" />;
      case 'offer': return <Handshake className="h-4 w-4" />;
      case 'rejected': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'epic': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateLevelProgress = () => {
    if (!playerStats) return 0;
    const currentLevelXP = playerStats.totalXP - (playerStats.level - 1) * 1000;
    return (currentLevelXP / 1000) * 100;
  };

  const addNewApplication = () => {
    const newApp: JobApplication = {
      id: Date.now().toString(),
      title: 'New Position',
      company: 'New Company',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0],
      location: 'Remote',
      difficulty: 'mid',
      xpEarned: 100
    };
    
    setApplications(prev => [newApp, ...prev]);
    
    if (playerStats) {
      setPlayerStats(prev => prev ? {
        ...prev,
        totalXP: prev.totalXP + 100,
        applicationsCount: prev.applicationsCount + 1,
        weeklyProgress: prev.weeklyProgress + 1
      } : null);
    }
    
    toast({
      title: "New Application Added!",
      description: "+100 XP earned for submitting an application."
    });
  };

  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, completed: true, progress: quest.maxProgress }
        : quest
    ));
    
    const quest = quests.find(q => q.id === questId);
    if (quest && playerStats) {
      setPlayerStats(prev => prev ? {
        ...prev,
        totalXP: prev.totalXP + quest.xpReward
      } : null);
      
      toast({
        title: "Quest Completed!",
        description: `+${quest.xpReward} XP earned for completing "${quest.title}"`
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    if (selectedFilter === 'all') return true;
    return app.status === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Job Hunt Game Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Level up your job search! Earn XP, unlock achievements, and track your progress toward your dream career.
          </p>
        </div>

        {/* Player Stats Bar */}
        {playerStats && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Crown className="h-6 w-6 text-yellow-600 mr-2" />
                    <span className="text-2xl font-bold">Lv.{playerStats.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{playerStats.rank}</p>
                  <Progress value={calculateLevelProgress()} className="mt-2" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{playerStats.totalXP.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{playerStats.applicationsCount}</div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{playerStats.interviewsCount}</div>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Zap className="h-5 w-5 text-orange-500 mr-1" />
                    <span className="text-2xl font-bold text-orange-600">{playerStats.streak}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{playerStats.weeklyProgress}/{playerStats.weeklyGoal}</div>
                  <p className="text-sm text-muted-foreground">Weekly Goal</p>
                  <Progress value={(playerStats.weeklyProgress / playerStats.weeklyGoal) * 100} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="quests">Quests</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(app.status)}
                          <div>
                            <p className="font-medium text-sm">{app.title}</p>
                            <p className="text-xs text-muted-foreground">{app.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">+{app.xpEarned} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Quests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Active Quests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quests.filter(q => !q.completed).slice(0, 4).map((quest) => (
                      <div key={quest.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{quest.title}</h4>
                          <Badge className={getDifficultyColor(quest.difficulty)}>
                            {quest.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
                        <div className="flex items-center justify-between">
                          <Progress value={(quest.progress / quest.maxProgress) * 100} className="flex-1 mr-2" />
                          <span className="text-xs font-medium">{quest.progress}/{quest.maxProgress}</span>
                        </div>
                        {quest.progress === quest.maxProgress && !quest.completed && (
                          <Button 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={() => completeQuest(quest.id)}
                          >
                            Claim Reward (+{quest.xpReward} XP)
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === 'applied' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter('applied')}
                >
                  Applied
                </Button>
                <Button
                  variant={selectedFilter === 'interview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter('interview')}
                >
                  Interview
                </Button>
                <Button
                  variant={selectedFilter === 'offer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter('offer')}
                >
                  Offers
                </Button>
              </div>
              <Button onClick={addNewApplication} className="bg-gradient-to-r from-purple-500 to-blue-500">
                <Plus className="mr-2 h-4 w-4" />
                Add Application
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredApplications.map((app) => (
                <Card key={app.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{app.title}</CardTitle>
                        <CardDescription>{app.company} • {app.location}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {app.salary && (
                        <p className="text-sm font-medium text-green-600">{app.salary}</p>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Applied: {app.appliedDate}</span>
                        <span>XP: +{app.xpEarned}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <Badge variant="outline">{app.difficulty} level</Badge>
                        <span className="text-xs text-muted-foreground">Updated: {app.lastUpdate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`${getRarityColor(achievement.rarity)} ${achievement.unlockedAt ? 'opacity-100' : 'opacity-60'}`}
                >
                  <CardHeader className="text-center pb-3">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    <Badge className={`mx-auto ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="mb-2" />
                    <div className="flex justify-between text-sm">
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                      <span className="font-medium">+{achievement.xpReward} XP</span>
                    </div>
                    {achievement.unlockedAt && (
                      <div className="mt-2 flex items-center justify-center text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Unlocked {achievement.unlockedAt}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quests.map((quest) => (
                <Card key={quest.id} className={quest.completed ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {quest.completed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                          {quest.title}
                        </CardTitle>
                        <CardDescription>{quest.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={getDifficultyColor(quest.difficulty)}>
                          {quest.difficulty}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">+{quest.xpReward} XP</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Progress value={(quest.progress / quest.maxProgress) * 100} className="flex-1 mr-2" />
                        <span className="text-sm font-medium">{quest.progress}/{quest.maxProgress}</span>
                      </div>
                      
                      {quest.deadline && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Deadline: {quest.deadline}
                        </div>
                      )}
                      
                      {quest.progress === quest.maxProgress && !quest.completed && (
                        <Button 
                          onClick={() => completeQuest(quest.id)}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500"
                        >
                          <Trophy className="mr-2 h-4 w-4" />
                          Claim Reward
                        </Button>
                      )}
                      
                      {quest.completed && (
                        <div className="flex items-center justify-center text-green-600 text-sm">
                          <Trophy className="h-4 w-4 mr-2" />
                          Quest Completed!
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}