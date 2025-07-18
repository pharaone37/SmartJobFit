import { Request, Response } from 'express';
import { storage } from './storage';
import { eq, desc, and, or } from 'drizzle-orm';
import { 
  insertCareerProfileSchema,
  insertSkillAssessmentSchema,
  insertCareerGoalSchema,
  insertLearningPlanSchema,
  insertMentorshipMatchSchema,
  insertIndustryInsightSchema,
  insertNetworkingEventSchema,
  insertCareerProgressSchema,
  insertPersonalBrandingSchema,
  type CareerProfile,
  type SkillAssessment,
  type CareerGoal,
  type LearningPlan,
  type MentorshipMatch,
  type IndustryInsight,
  type NetworkingEvent,
  type CareerProgress,
  type PersonalBranding
} from '@shared/schema';

// Career Profile Management
export async function getCareerProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await storage.getCareerProfile(userId);
    if (!profile) {
      // Create default profile if none exists
      const defaultProfile = await storage.createCareerProfile({
        userId,
        careerStage: 'exploration',
        careerValues: [],
        strengths: [],
        improvementAreas: [],
        careerGoals: [],
        assessmentData: {}
      });
      return res.json(defaultProfile);
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching career profile:', error);
    res.status(500).json({ error: 'Failed to fetch career profile' });
  }
}

export async function updateCareerProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertCareerProfileSchema.parse(req.body);
    const updatedProfile = await storage.updateCareerProfile(userId, validatedData);
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating career profile:', error);
    res.status(500).json({ error: 'Failed to update career profile' });
  }
}

// Skill Assessment Management
export async function getSkillAssessments(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const assessments = await storage.getUserSkillAssessments(userId);
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching skill assessments:', error);
    res.status(500).json({ error: 'Failed to fetch skill assessments' });
  }
}

export async function createSkillAssessment(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertSkillAssessmentSchema.parse({
      ...req.body,
      userId,
      lastAssessed: new Date()
    });
    
    const assessment = await storage.createSkillAssessment(validatedData);
    res.json(assessment);
  } catch (error) {
    console.error('Error creating skill assessment:', error);
    res.status(500).json({ error: 'Failed to create skill assessment' });
  }
}

export async function updateSkillAssessment(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { assessmentId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertSkillAssessmentSchema.parse({
      ...req.body,
      lastAssessed: new Date()
    });
    
    const assessment = await storage.updateSkillAssessment(assessmentId, validatedData);
    res.json(assessment);
  } catch (error) {
    console.error('Error updating skill assessment:', error);
    res.status(500).json({ error: 'Failed to update skill assessment' });
  }
}

// Career Goals Management
export async function getCareerGoals(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const goals = await storage.getUserCareerGoals(userId);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching career goals:', error);
    res.status(500).json({ error: 'Failed to fetch career goals' });
  }
}

export async function createCareerGoal(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertCareerGoalSchema.parse({
      ...req.body,
      userId
    });
    
    const goal = await storage.createCareerGoal(validatedData);
    res.json(goal);
  } catch (error) {
    console.error('Error creating career goal:', error);
    res.status(500).json({ error: 'Failed to create career goal' });
  }
}

export async function updateCareerGoal(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { goalId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertCareerGoalSchema.parse(req.body);
    const goal = await storage.updateCareerGoal(goalId, validatedData);
    res.json(goal);
  } catch (error) {
    console.error('Error updating career goal:', error);
    res.status(500).json({ error: 'Failed to update career goal' });
  }
}

export async function deleteCareerGoal(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { goalId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await storage.deleteCareerGoal(goalId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting career goal:', error);
    res.status(500).json({ error: 'Failed to delete career goal' });
  }
}

// Learning Plans Management
export async function getLearningPlans(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const plans = await storage.getUserLearningPlans(userId);
    res.json(plans);
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    res.status(500).json({ error: 'Failed to fetch learning plans' });
  }
}

export async function createLearningPlan(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertLearningPlanSchema.parse({
      ...req.body,
      userId
    });
    
    const plan = await storage.createLearningPlan(validatedData);
    res.json(plan);
  } catch (error) {
    console.error('Error creating learning plan:', error);
    res.status(500).json({ error: 'Failed to create learning plan' });
  }
}

export async function updateLearningPlan(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { planId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertLearningPlanSchema.parse(req.body);
    const plan = await storage.updateLearningPlan(planId, validatedData);
    res.json(plan);
  } catch (error) {
    console.error('Error updating learning plan:', error);
    res.status(500).json({ error: 'Failed to update learning plan' });
  }
}

// Mentorship Management
export async function getMentorshipMatches(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const matches = await storage.getUserMentorshipMatches(userId);
    res.json(matches);
  } catch (error) {
    console.error('Error fetching mentorship matches:', error);
    res.status(500).json({ error: 'Failed to fetch mentorship matches' });
  }
}

export async function createMentorshipMatch(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertMentorshipMatchSchema.parse(req.body);
    const match = await storage.createMentorshipMatch(validatedData);
    res.json(match);
  } catch (error) {
    console.error('Error creating mentorship match:', error);
    res.status(500).json({ error: 'Failed to create mentorship match' });
  }
}

// Industry Insights
export async function getIndustryInsights(req: Request, res: Response) {
  try {
    const { industry, region } = req.query;
    
    const insights = await storage.getIndustryInsights(
      industry as string,
      region as string
    );
    res.json(insights);
  } catch (error) {
    console.error('Error fetching industry insights:', error);
    res.status(500).json({ error: 'Failed to fetch industry insights' });
  }
}

// Networking Events
export async function getNetworkingEvents(req: Request, res: Response) {
  try {
    const { industry, location, eventType } = req.query;
    
    const events = await storage.getNetworkingEvents(
      industry as string,
      location as string,
      eventType as string
    );
    res.json(events);
  } catch (error) {
    console.error('Error fetching networking events:', error);
    res.status(500).json({ error: 'Failed to fetch networking events' });
  }
}

// Career Progress Tracking
export async function getCareerProgress(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const progress = await storage.getUserCareerProgress(userId);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching career progress:', error);
    res.status(500).json({ error: 'Failed to fetch career progress' });
  }
}

export async function recordCareerProgress(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertCareerProgressSchema.parse({
      ...req.body,
      userId
    });
    
    const progress = await storage.recordCareerProgress(validatedData);
    res.json(progress);
  } catch (error) {
    console.error('Error recording career progress:', error);
    res.status(500).json({ error: 'Failed to record career progress' });
  }
}

// Personal Branding
export async function getPersonalBranding(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const branding = await storage.getPersonalBranding(userId);
    res.json(branding);
  } catch (error) {
    console.error('Error fetching personal branding:', error);
    res.status(500).json({ error: 'Failed to fetch personal branding' });
  }
}

export async function updatePersonalBranding(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validatedData = insertPersonalBrandingSchema.parse({
      ...req.body,
      userId
    });
    
    const branding = await storage.updatePersonalBranding(userId, validatedData);
    res.json(branding);
  } catch (error) {
    console.error('Error updating personal branding:', error);
    res.status(500).json({ error: 'Failed to update personal branding' });
  }
}

// AI-Powered Career Coaching
export async function generateCareerAdvice(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { question, context } = req.body;
    
    // Get user's career profile for personalized advice
    const profile = await storage.getCareerProfile(userId);
    const goals = await storage.getUserCareerGoals(userId);
    const skills = await storage.getUserSkillAssessments(userId);
    
    // Create personalized context for AI
    const personalizedContext = {
      profile,
      goals,
      skills,
      userQuestion: question,
      additionalContext: context
    };

    // Generate AI-powered career advice
    const advice = await storage.generateCareerAdvice(personalizedContext);
    
    res.json({
      advice,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating career advice:', error);
    res.status(500).json({ error: 'Failed to generate career advice' });
  }
}

// Career Path Analysis
export async function analyzeCareerPath(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { targetRole, targetIndustry } = req.body;
    
    // Get user's current profile and skills
    const profile = await storage.getCareerProfile(userId);
    const skills = await storage.getUserSkillAssessments(userId);
    
    // Analyze career path and gaps
    const analysis = await storage.analyzeCareerPath(userId, {
      targetRole,
      targetIndustry,
      currentProfile: profile,
      currentSkills: skills
    });
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing career path:', error);
    res.status(500).json({ error: 'Failed to analyze career path' });
  }
}

// Skill Gap Analysis
export async function analyzeSkillGaps(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { targetRole, targetIndustry } = req.body;
    
    // Get user's current skills
    const currentSkills = await storage.getUserSkillAssessments(userId);
    
    // Analyze skill gaps
    const analysis = await storage.analyzeSkillGaps(userId, {
      targetRole,
      targetIndustry,
      currentSkills
    });
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    res.status(500).json({ error: 'Failed to analyze skill gaps' });
  }
}

// Learning Recommendations
export async function getLearningRecommendations(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { skillGaps, preferences } = req.body;
    
    // Get personalized learning recommendations
    const recommendations = await storage.getLearningRecommendations(userId, {
      skillGaps,
      preferences
    });
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting learning recommendations:', error);
    res.status(500).json({ error: 'Failed to get learning recommendations' });
  }
}

// Dashboard Summary
export async function getCareerDashboardSummary(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [profile, goals, skills, progress, learningPlans] = await Promise.all([
      storage.getCareerProfile(userId),
      storage.getUserCareerGoals(userId),
      storage.getUserSkillAssessments(userId),
      storage.getUserCareerProgress(userId),
      storage.getUserLearningPlans(userId)
    ]);

    // Calculate summary metrics
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const skillsImproving = skills.filter(s => s.currentLevel < s.targetLevel).length;
    const activeLearningPlans = learningPlans.filter(p => p.status === 'in_progress').length;
    
    const summary = {
      profile,
      metrics: {
        activeGoals,
        completedGoals,
        skillsImproving,
        activeLearningPlans,
        totalProgress: progress.length
      },
      recentGoals: goals.slice(0, 3),
      prioritySkills: skills.filter(s => s.importanceScore >= 8).slice(0, 5),
      upcomingMilestones: goals.filter(g => g.targetDate && new Date(g.targetDate) > new Date()).slice(0, 3)
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching career dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch career dashboard summary' });
  }
}

// Career Coaching Service Object for tests and other services
export const careerCoaching = {
  async getPersonalizedAdvice(context: any) {
    try {
      const { userId, currentRole, targetRole, skills, experience, salaryData } = context;
      
      // Get user's career profile and goals
      const profile = await storage.getCareerProfile(userId);
      const goals = await storage.getUserCareerGoals(userId);
      const assessments = await storage.getUserSkillAssessments(userId);
      
      // Generate personalized advice based on context
      const advice = await storage.generateCareerAdvice({
        profile,
        goals,
        assessments,
        currentRole,
        targetRole,
        skills,
        experience,
        salaryData
      });
      
      return advice;
    } catch (error) {
      console.error('Error getting personalized advice:', error);
      throw error;
    }
  },

  async analyzeSkillGaps(context: any) {
    try {
      const { currentSkills, targetJobSkills, industryTrends } = context;
      
      // Analyze skill gaps
      const skillGaps = await storage.analyzeSkillGaps(context.userId || 'test-user-id', {
        currentSkills,
        targetJobSkills,
        industryTrends
      });
      
      return skillGaps;
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      throw error;
    }
  }
};