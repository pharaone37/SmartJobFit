import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trophy, Target, Clock, Zap, Star, Award, TrendingUp, BookOpen, Play, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlockedAt?: string;
}

interface LearningActivity {
  id: string;
  title: string;
  type: 'course' | 'practice' | 'project' | 'reading' | 'video';
  duration: number; // in minutes
  points: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
  completedAt?: string;
}

interface SkillData {
  id: string;
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  timeSpent: number;
  activities: LearningActivity[];
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

const skillCategories = [
  { value: 'technical', label: 'Technical Skills', icon: '💻', color: 'bg-blue-500' },
  { value: 'soft', label: 'Soft Skills', icon: '🤝', color: 'bg-green-500' },
  { value: 'language', label: 'Languages', icon: '🌐', color: 'bg-purple-500' },
  { value: 'design', label: 'Design', icon: '🎨', color: 'bg-pink-500' },
  { value: 'business', label: 'Business', icon: '📈', color: 'bg-orange-500' },
  { value: 'creative', label: 'Creative', icon: '🎭', color: 'bg-yellow-500' }
];

const levelNames = [
  'Beginner', 'Novice', 'Apprentice', 'Practitioner', 'Proficient', 
  'Advanced', 'Expert', 'Master', 'Guru', 'Legend'
];

const achievementTypes = {
  bronze: { color: 'bg-amber-600', icon: '🥉' },
  silver: { color: 'bg-gray-400', icon: '🥈' },
  gold: { color: 'bg-yellow-500', icon: '🥇' },
  diamond: { color: 'bg-blue-600', icon: '💎' }
};

const sampleActivities: LearningActivity[] = [
  {
    id: '1',
    title: 'Complete React Hooks Course',
    type: 'course',
    duration: 180,
    points: 150,
    difficulty: 'intermediate',
    url: 'https://example.com/course'
  },
  {
    id: '2',
    title: 'Build a Portfolio Project',
    type: 'project',
    duration: 480,
    points: 300,
    difficulty: 'advanced'
  },
  {
    id: '3',
    title: 'Practice LeetCode Problems',
    type: 'practice',
    duration: 60,
    points: 50,
    difficulty: 'intermediate'
  },
  {
    id: '4',
    title: 'Read "Clean Code" Chapter',
    type: 'reading',
    duration: 45,
    points: 40,
    difficulty: 'beginner'
  },
  {
    id: '5',
    title: 'Watch TypeScript Tutorial',
    type: 'video',
    duration: 90,
    points: 80,
    difficulty: 'intermediate'
  }
];

export default function SkillTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const [newSkill, setNewSkill] = useState<Partial<SkillData>>({});
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false);
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<LearningActivity>>({});
  const [activeTab, setActiveTab] = useState('overview');

  const { data: skills, isLoading } = useQuery({
    queryKey: ['/api/skill-tracking'],
    staleTime: 300000,
  });

  const createSkillMutation = useMutation({
    mutationFn: async (skillData: any) => {
      return await apiRequest('/api/skill-tracking', 'POST', skillData);
    },
    onSuccess: () => {
      toast({
        title: "Skill Added",
        description: "Your skill has been added to the tracker successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/skill-tracking'] });
      setShowAddSkillDialog(false);
      setNewSkill({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateSkillMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      return await apiRequest(`/api/skill-tracking/${id}`, 'PUT', updates);
    },
    onSuccess: () => {
      toast({
        title: "Progress Updated",
        description: "Your skill progress has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/skill-tracking'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update skill. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddSkill = () => {
    if (!newSkill.skillName || !newSkill.category) return;

    createSkillMutation.mutate({
      skillName: newSkill.skillName,
      category: newSkill.category,
      currentLevel: 1,
      targetLevel: newSkill.targetLevel || 5,
      progress: 0,
      timeSpent: 0,
      activities: [],
      achievements: []
    });
  };

  const handleCompleteActivity = (skillId: string, activityId: string) => {
    const skill = skills?.find((s: SkillData) => s.id === skillId);
    if (!skill) return;

    const activity = skill.activities.find(a => a.id === activityId);
    if (!activity) return;

    const updatedActivities = skill.activities.map(a =>
      a.id === activityId ? { ...a, completedAt: new Date().toISOString() } : a
    );

    const newTimeSpent = skill.timeSpent + activity.duration;
    const newProgress = Math.min(100, skill.progress + (activity.points / 10));

    updateSkillMutation.mutate({
      id: skillId,
      activities: updatedActivities,
      timeSpent: newTimeSpent,
      progress: newProgress
    });

    // Check for achievements
    checkAchievements(skill, newTimeSpent, newProgress);
  };

  const checkAchievements = (skill: SkillData, timeSpent: number, progress: number) => {
    const achievements: Achievement[] = [];

    // Time-based achievements
    if (timeSpent >= 300 && !skill.achievements.find(a => a.id === 'first-5-hours')) {
      achievements.push({
        id: 'first-5-hours',
        title: 'First 5 Hours',
        description: 'Completed 5 hours of learning',
        icon: '⏰',
        type: 'bronze',
        unlockedAt: new Date().toISOString()
      });
    }

    if (timeSpent >= 1200 && !skill.achievements.find(a => a.id === 'dedication-warrior')) {
      achievements.push({
        id: 'dedication-warrior',
        title: 'Dedication Warrior',
        description: 'Completed 20 hours of learning',
        icon: '⚔️',
        type: 'silver',
        unlockedAt: new Date().toISOString()
      });
    }

    // Progress-based achievements
    if (progress >= 50 && !skill.achievements.find(a => a.id === 'halfway-hero')) {
      achievements.push({
        id: 'halfway-hero',
        title: 'Halfway Hero',
        description: 'Reached 50% progress',
        icon: '🎯',
        type: 'silver',
        unlockedAt: new Date().toISOString()
      });
    }

    if (progress >= 100 && !skill.achievements.find(a => a.id === 'skill-master')) {
      achievements.push({
        id: 'skill-master',
        title: 'Skill Master',
        description: 'Completed skill development',
        icon: '👑',
        type: 'gold',
        unlockedAt: new Date().toISOString()
      });
    }

    if (achievements.length > 0) {
      const updatedAchievements = [...skill.achievements, ...achievements];
      updateSkillMutation.mutate({
        id: skill.id,
        achievements: updatedAchievements
      });

      achievements.forEach(achievement => {
        toast({
          title: "Achievement Unlocked!",
          description: `${achievement.icon} ${achievement.title} - ${achievement.description}`,
        });
      });
    }
  };

  const SkillCard = ({ skill }: { skill: SkillData }) => {
    const category = skillCategories.find(cat => cat.value === skill.category);
    const completedActivities = skill.activities.filter(a => a.completedAt).length;
    const totalPoints = skill.activities.reduce((sum, a) => sum + (a.completedAt ? a.points : 0), 0);

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${selectedSkill?.id === skill.id ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => setSelectedSkill(skill)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 ${category?.color} rounded-full flex items-center justify-center text-white`}>
                {category?.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{skill.skillName}</CardTitle>
                <p className="text-sm text-gray-500">{category?.label}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Level {skill.currentLevel}</div>
              <div className="text-xs text-gray-400">{levelNames[skill.currentLevel - 1]}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(skill.progress)}%</span>
            </div>
            <Progress value={skill.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-blue-600">{Math.round(skill.timeSpent / 60)}h</div>
              <div className="text-xs text-gray-500">Time Spent</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">{completedActivities}</div>
              <div className="text-xs text-gray-500">Activities</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-purple-600">{totalPoints}</div>
              <div className="text-xs text-gray-500">Points</div>
            </div>
          </div>

          {skill.achievements.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skill.achievements.slice(0, 3).map(achievement => (
                <Badge key={achievement.id} variant="secondary" className="text-xs">
                  {achievement.icon}
                </Badge>
              ))}
              {skill.achievements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{skill.achievements.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const ActivityCard = ({ activity, skillId }: { activity: LearningActivity; skillId: string }) => {
    const isCompleted = !!activity.completedAt;
    const difficultyColors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };

    const typeIcons = {
      course: <BookOpen className="h-4 w-4" />,
      practice: <Target className="h-4 w-4" />,
      project: <Zap className="h-4 w-4" />,
      reading: <BookOpen className="h-4 w-4" />,
      video: <Play className="h-4 w-4" />
    };

    return (
      <Card className={`${isCompleted ? 'bg-gray-50 border-green-200' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : typeIcons[activity.type]}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                  {activity.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-xs ${difficultyColors[activity.difficulty]}`}>
                    {activity.difficulty}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {activity.duration}min
                  </span>
                  <span className="text-xs text-gray-500">
                    <Star className="h-3 w-3 inline mr-1" />
                    {activity.points} points
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activity.url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={activity.url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              )}
              {!isCompleted && (
                <Button 
                  size="sm" 
                  onClick={() => handleCompleteActivity(skillId, activity.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const typeStyle = achievementTypes[achievement.type];
    
    return (
      <Card className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-12 h-12 ${typeStyle.color} rounded-bl-full flex items-center justify-center text-white text-lg`}>
          {typeStyle.icon}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{achievement.icon}</div>
            <div>
              <h3 className="font-medium">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
              {achievement.unlockedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Skill Development Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Gamify your learning journey with achievements, progress tracking, and rewards
            </p>
          </div>
          <Dialog open={showAddSkillDialog} onOpenChange={setShowAddSkillDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    value={newSkill.skillName || ''}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, skillName: e.target.value }))}
                    placeholder="e.g., React, Python, Public Speaking"
                  />
                </div>
                <div>
                  <Label htmlFor="skill-category">Category</Label>
                  <Select
                    value={newSkill.category || ''}
                    onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target-level">Target Level (1-10)</Label>
                  <Select
                    value={newSkill.targetLevel?.toString() || '5'}
                    onValueChange={(value) => setNewSkill(prev => ({ ...prev, targetLevel: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelNames.map((name, index) => (
                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                          Level {index + 1}: {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSkill} className="w-full">
                  Add Skill
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Overview */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Skills</h2>
              {skills?.length > 0 ? (
                skills.map((skill: SkillData) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No skills added yet</p>
                    <p className="text-sm text-gray-400">Add your first skill to start tracking</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Skill Details */}
          <div className="lg:col-span-2">
            {selectedSkill ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {selectedSkill.skillName} Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Current Level</span>
                            <span>Level {selectedSkill.currentLevel}</span>
                          </div>
                          <Progress value={(selectedSkill.currentLevel / 10) * 100} className="h-3" />
                          <p className="text-xs text-gray-500 mt-1">
                            {levelNames[selectedSkill.currentLevel - 1]}
                          </p>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress to Target</span>
                            <span>{Math.round(selectedSkill.progress)}%</span>
                          </div>
                          <Progress value={selectedSkill.progress} className="h-3" />
                          <p className="text-xs text-gray-500 mt-1">
                            Target: Level {selectedSkill.targetLevel}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(selectedSkill.timeSpent / 60)}
                          </div>
                          <div className="text-sm text-gray-600">Hours Spent</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedSkill.activities.filter(a => a.completedAt).length}
                          </div>
                          <div className="text-sm text-gray-600">Activities</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedSkill.achievements.length}
                          </div>
                          <div className="text-sm text-gray-600">Achievements</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activities" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Learning Activities</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                    
                    {selectedSkill.activities.length > 0 ? (
                      <div className="space-y-4">
                        {selectedSkill.activities.map((activity) => (
                          <ActivityCard 
                            key={activity.id} 
                            activity={activity} 
                            skillId={selectedSkill.id}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-500">No activities added yet</p>
                          <p className="text-sm text-gray-400">Add learning activities to track your progress</p>
                          <Button className="mt-4" onClick={() => {
                            // Add sample activities for demo
                            const updatedActivities = [...selectedSkill.activities, ...sampleActivities];
                            updateSkillMutation.mutate({
                              id: selectedSkill.id,
                              activities: updatedActivities
                            });
                          }}>
                            Add Sample Activities
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="achievements" className="mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Achievements</h3>
                    {selectedSkill.achievements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSkill.achievements.map((achievement) => (
                          <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-500">No achievements unlocked yet</p>
                          <p className="text-sm text-gray-400">Complete activities to earn achievements</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Target className="h-16 w-16 mx-auto mb-6 text-gray-400" />
                  <h2 className="text-2xl font-semibold mb-4">Start Your Learning Journey</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Select a skill from the left panel to view progress, activities, and achievements.
                  </p>
                  <Button onClick={() => setShowAddSkillDialog(true)} size="lg" className="gap-2">
                    <Plus className="h-5 w-5" />
                    Add Your First Skill
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}