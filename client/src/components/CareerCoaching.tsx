import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, User, Target, BookOpen, Users, TrendingUp, Star, Award, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CareerCoachingProps {
  userId: string;
}

interface CareerProfile {
  id: string;
  currentRole: string;
  experienceLevel: string;
  skills: string[];
  industries: string[];
  careerGoals: string[];
  strengths: string[];
  areasForImprovement: string[];
  preferredLearningStyle: string;
}

interface SkillAssessment {
  id: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  assessmentDate: string;
  feedback: string;
  recommendations: string[];
}

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  targetDate: string;
  progress: number;
  milestones: string[];
  status: 'active' | 'completed' | 'paused';
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  skillsTargeted: string[];
  estimatedDuration: string;
  resources: string[];
  progress: number;
  status: 'active' | 'completed' | 'not_started';
}

interface MentorshipMatch {
  id: string;
  mentorName: string;
  mentorExpertise: string[];
  matchScore: number;
  status: 'pending' | 'active' | 'completed';
  connectionDate: string;
}

export default function CareerCoaching({ userId }: CareerCoachingProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch career profile
  const { data: profile, isLoading: profileLoading } = useQuery<CareerProfile>({
    queryKey: ['/api/career-coaching/profile'],
    enabled: !!userId,
  });

  // Fetch skill assessments
  const { data: skillAssessments, isLoading: skillsLoading } = useQuery<SkillAssessment[]>({
    queryKey: ['/api/career-coaching/skill-assessments'],
    enabled: !!userId,
  });

  // Fetch career goals
  const { data: careerGoals, isLoading: goalsLoading } = useQuery<CareerGoal[]>({
    queryKey: ['/api/career-coaching/goals'],
    enabled: !!userId,
  });

  // Fetch learning plans
  const { data: learningPlans, isLoading: plansLoading } = useQuery<LearningPlan[]>({
    queryKey: ['/api/career-coaching/learning-plans'],
    enabled: !!userId,
  });

  // Fetch mentorship matches
  const { data: mentorshipMatches, isLoading: mentorshipLoading } = useQuery<MentorshipMatch[]>({
    queryKey: ['/api/career-coaching/mentorship'],
    enabled: !!userId,
  });

  // Fetch career progress
  const { data: careerProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['/api/career-coaching/progress'],
    enabled: !!userId,
  });

  // Mutations
  const createProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/career-coaching/profile', 'POST', data),
    onSuccess: () => {
      toast({ title: "Profile created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/career-coaching/profile'] });
    },
  });

  const createSkillAssessmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/career-coaching/skill-assessments', 'POST', data),
    onSuccess: () => {
      toast({ title: "Skill assessment created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/career-coaching/skill-assessments'] });
    },
  });

  const createCareerGoalMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/career-coaching/goals', 'POST', data),
    onSuccess: () => {
      toast({ title: "Career goal created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/career-coaching/goals'] });
    },
  });

  const createLearningPlanMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/career-coaching/learning-plans', 'POST', data),
    onSuccess: () => {
      toast({ title: "Learning plan created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/career-coaching/learning-plans'] });
    },
  });

  const generateAdviceMutation = useMutation({
    mutationFn: (context: any) => apiRequest('/api/career-coaching/advice', 'POST', context),
    onSuccess: (data) => {
      toast({ title: "Career advice generated successfully" });
      setIsLoadingAdvice(false);
    },
    onError: () => {
      setIsLoadingAdvice(false);
    },
  });

  const handleGenerateAdvice = async () => {
    if (!profile) return;
    
    setIsLoadingAdvice(true);
    try {
      const context = {
        profile,
        goals: careerGoals || [],
        skills: skillAssessments || [],
        learningPlans: learningPlans || []
      };
      
      await generateAdviceMutation.mutateAsync(context);
    } catch (error) {
      console.error('Error generating advice:', error);
    }
  };

  const ProfileSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Career Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Current Role</Label>
                  <p className="text-lg">{profile.currentRole}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Experience Level</Label>
                  <p className="text-lg">{profile.experienceLevel}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Industries</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.industries?.map((industry, index) => (
                    <Badge key={index} variant="outline">{industry}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Career Goals</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.careerGoals?.map((goal, index) => (
                    <Badge key={index} variant="default">{goal}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No career profile found</p>
              <Button onClick={() => setActiveTab('create-profile')}>
                Create Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const SkillAssessmentSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Skill Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {skillsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : skillAssessments && skillAssessments.length > 0 ? (
            <div className="space-y-4">
              {skillAssessments.map((assessment) => (
                <div key={assessment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{assessment.skillName}</h3>
                    <Badge variant={assessment.currentLevel >= assessment.targetLevel ? 'default' : 'secondary'}>
                      {assessment.currentLevel}/{assessment.targetLevel}
                    </Badge>
                  </div>
                  <Progress 
                    value={(assessment.currentLevel / assessment.targetLevel) * 100} 
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-600 mb-2">{assessment.feedback}</p>
                  {assessment.recommendations && assessment.recommendations.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Recommendations:</Label>
                      <ul className="text-sm text-gray-600 mt-1">
                        {assessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No skill assessments found</p>
              <Button onClick={() => setActiveTab('create-assessment')}>
                Create Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const CareerGoalsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Career Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goalsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : careerGoals && careerGoals.length > 0 ? (
            <div className="space-y-4">
              {careerGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{goal.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        goal.priority === 'high' ? 'destructive' : 
                        goal.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {goal.priority}
                      </Badge>
                      <Badge variant={goal.status === 'completed' ? 'default' : 'outline'}>
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  <div className="mb-2">
                    <Label className="text-sm font-medium">Progress: {goal.progress}%</Label>
                    <Progress value={goal.progress} className="mt-1" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <Label className="font-medium">Target Date:</Label> {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium">Milestones:</Label>
                      <ul className="text-sm text-gray-600 mt-1">
                        {goal.milestones.map((milestone, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No career goals found</p>
              <Button onClick={() => setActiveTab('create-goal')}>
                Create Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const LearningPlansSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Learning Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plansLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : learningPlans && learningPlans.length > 0 ? (
            <div className="space-y-4">
              {learningPlans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{plan.title}</h3>
                    <Badge variant={plan.status === 'completed' ? 'default' : 'outline'}>
                      {plan.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                  <div className="mb-2">
                    <Label className="text-sm font-medium">Progress: {plan.progress}%</Label>
                    <Progress value={plan.progress} className="mt-1" />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <Label className="font-medium">Estimated Duration:</Label> {plan.estimatedDuration}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Skills Targeted:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {plan.skillsTargeted?.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  {plan.resources && plan.resources.length > 0 && (
                    <div className="mt-3">
                      <Label className="text-sm font-medium">Resources:</Label>
                      <ul className="text-sm text-gray-600 mt-1">
                        {plan.resources.map((resource, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No learning plans found</p>
              <Button onClick={() => setActiveTab('create-plan')}>
                Create Learning Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const MentorshipSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Mentorship Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mentorshipLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : mentorshipMatches && mentorshipMatches.length > 0 ? (
            <div className="space-y-4">
              {mentorshipMatches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{match.mentorName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{match.matchScore}%</span>
                      </div>
                      <Badge variant={match.status === 'active' ? 'default' : 'outline'}>
                        {match.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Expertise:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {match.mentorExpertise?.map((expertise, index) => (
                        <Badge key={index} variant="secondary">{expertise}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <Label className="font-medium">Connected:</Label> {new Date(match.connectionDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No mentorship matches found</p>
              <Button onClick={() => setActiveTab('find-mentor')}>
                Find Mentor
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const ProgressSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Career Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progressLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : careerProgress ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall career progress is tracked here</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No progress data available</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/career-coaching/progress'] })}>
                Refresh Progress
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const AIAdviceSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            AI Career Coaching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Get personalized career advice based on your profile, goals, and progress.
            </p>
            <Button 
              onClick={handleGenerateAdvice}
              disabled={isLoadingAdvice || !profile}
              className="w-full"
            >
              {isLoadingAdvice ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Generate Career Advice
            </Button>
            
            {generateAdviceMutation.data && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">AI Career Advice:</h4>
                <p className="text-sm text-gray-700">{generateAdviceMutation.data.advice}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Career Coaching</h1>
        <p className="text-gray-600">
          Accelerate your career growth with personalized coaching, skill development, and goal tracking.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="ai-advice">AI Advice</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillAssessmentSection />
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <CareerGoalsSection />
        </TabsContent>

        <TabsContent value="learning" className="mt-6">
          <LearningPlansSection />
        </TabsContent>

        <TabsContent value="mentorship" className="mt-6">
          <MentorshipSection />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ProgressSection />
        </TabsContent>

        <TabsContent value="ai-advice" className="mt-6">
          <AIAdviceSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}