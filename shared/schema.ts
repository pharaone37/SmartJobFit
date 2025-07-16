import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  jsonb, 
  index, 
  serial,
  integer,
  boolean,
  decimal,
  uuid,
  date
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),
  title: varchar("title"),
  summary: text("summary"),
  skills: text("skills").array(),
  experience: text("experience").array(),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("free"),
  subscriptionPlan: varchar("subscription_plan").default("free"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  jobSearchesThisMonth: integer("job_searches_this_month").default(0),
  resumeOptimizationsThisMonth: integer("resume_optimizations_this_month").default(0),
  provider: varchar("provider").default("email"), // 'email', 'linkedin', 'replit'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  company: varchar("company").notNull(),
  location: varchar("location"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  description: text("description"),
  requirements: text("requirements"),
  skills: text("skills").array(),
  jobType: varchar("job_type"), // full-time, part-time, contract, internship
  experienceLevel: varchar("experience_level"), // entry, mid, senior, executive
  source: varchar("source").notNull(), // indeed, linkedin, glassdoor, etc.
  externalId: varchar("external_id"),
  url: varchar("url"),
  isActive: boolean("is_active").default(true),
  postedAt: timestamp("posted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Resume templates and styling
export const resumeTemplates = pgTable("resume_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  templateData: jsonb("template_data").notNull(),
  styling: jsonb("styling").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Career mood board
export const moodBoards = pgTable("mood_boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  items: jsonb("items").notNull(), // Array of mood board items
  goals: jsonb("goals").notNull(), // Career goals and aspirations
  inspiration: jsonb("inspiration").notNull(), // Inspirational content
  isPrivate: boolean("is_private").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Skill development tracking
export const skillTracking = pgTable("skill_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  skillName: varchar("skill_name").notNull(),
  category: varchar("category").notNull(), // technical, soft, language, etc.
  currentLevel: integer("current_level").default(1), // 1-10 scale
  targetLevel: integer("target_level").default(5),
  progress: integer("progress").default(0), // 0-100 percentage
  timeSpent: integer("time_spent").default(0), // minutes
  activities: jsonb("activities").notNull(), // Learning activities
  achievements: jsonb("achievements").notNull(), // Badges and milestones
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interview chat sessions
export const interviewSessions = pgTable("interview_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  sessionType: varchar("session_type").notNull(), // practice, mock, preparation
  jobRole: varchar("job_role"),
  company: varchar("company"),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  questions: jsonb("questions").notNull(),
  responses: jsonb("responses").notNull(),
  feedback: jsonb("feedback").notNull(),
  score: integer("score"),
  duration: integer("duration"), // seconds
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Professional network connections
export const networkConnections = pgTable("network_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  platform: varchar("platform").notNull(), // linkedin, twitter, github, etc.
  platformUserId: varchar("platform_user_id"),
  name: varchar("name").notNull(),
  title: varchar("title"),
  company: varchar("company"),
  profileUrl: varchar("profile_url"),
  connectionData: jsonb("connection_data"),
  connectionType: varchar("connection_type").default("contact"), // contact, colleague, mentor, etc.
  isActive: boolean("is_active").default(true),
  lastSynced: timestamp("last_synced"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  content: jsonb("content"), // structured resume data
  fileName: varchar("file_name"),
  fileUrl: varchar("file_url"),
  isActive: boolean("is_active").default(false),
  atsScore: integer("ats_score"),
  analysis: jsonb("analysis"), // AI analysis results
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  resumeId: uuid("resume_id").references(() => resumes.id),
  status: varchar("status").default("applied"), // applied, interview, offer, rejected
  matchScore: varchar("match_score"),
  coverLetter: text("cover_letter"),
  notes: text("notes"),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id),
  applicationId: uuid("application_id").references(() => jobApplications.id),
  type: varchar("type").notNull(), // phone, video, in-person, technical
  scheduledAt: timestamp("scheduled_at"),
  duration: integer("duration"), // in minutes
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled
  notes: text("notes"),
  feedback: text("feedback"),
  rating: integer("rating"), // 1-5
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobAlerts = pgTable("job_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  keywords: varchar("keywords"),
  location: varchar("location"),
  jobType: varchar("job_type"),
  experienceLevel: varchar("experience_level"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  skills: text("skills").array(),
  isActive: boolean("is_active").default(true),
  frequency: varchar("frequency").default("daily"), // daily, weekly, monthly
  lastSent: timestamp("last_sent"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  message: text("message"),
  isRead: boolean("is_read").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type definitions for new features
export type ResumeTemplate = typeof resumeTemplates.$inferSelect;
export type InsertResumeTemplate = typeof resumeTemplates.$inferInsert;
export const insertResumeTemplateSchema = createInsertSchema(resumeTemplates);

export type MoodBoard = typeof moodBoards.$inferSelect;
export type InsertMoodBoard = typeof moodBoards.$inferInsert;
export const insertMoodBoardSchema = createInsertSchema(moodBoards);

export type SkillTracking = typeof skillTracking.$inferSelect;
export type InsertSkillTracking = typeof skillTracking.$inferInsert;
export const insertSkillTrackingSchema = createInsertSchema(skillTracking);

export type InterviewSession = typeof interviewSessions.$inferSelect;
export type InsertInterviewSession = typeof interviewSessions.$inferInsert;
export const insertInterviewSessionSchema = createInsertSchema(interviewSessions);

export type NetworkConnection = typeof networkConnections.$inferSelect;
export type InsertNetworkConnection = typeof networkConnections.$inferInsert;
export const insertNetworkConnectionSchema = createInsertSchema(networkConnections);

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobTypes: text("job_types").array(),
  locations: text("locations").array(),
  experienceLevels: text("experience_levels").array(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  skills: text("skills").array(),
  industries: text("industries").array(),
  companyTypes: text("company_types").array(),
  workTypes: text("work_types").array(), // remote, hybrid, onsite
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedJobs = pgTable("saved_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interviewPractice = pgTable("interview_practice", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id),
  type: varchar("type").notNull(), // behavioral, technical, case_study
  questions: jsonb("questions"),
  answers: jsonb("answers"),
  aiAnalysis: jsonb("ai_analysis"),
  score: integer("score"),
  duration: integer("duration"), // in minutes
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const salaryNegotiations = pgTable("salary_negotiations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id),
  applicationId: uuid("application_id").references(() => jobApplications.id),
  currentOffer: decimal("current_offer"),
  targetSalary: decimal("target_salary"),
  marketData: jsonb("market_data"),
  negotiationStrategy: text("negotiation_strategy"),
  status: varchar("status").default("planning"), // planning, negotiating, completed
  finalOffer: decimal("final_offer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Interview Coaching System Tables
export const interviewCoachingSessions = pgTable("interview_coaching_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionType: varchar("session_type").notNull(), // behavioral, technical, company-specific, panel, group
  companyId: varchar("company_id"),
  targetRole: varchar("target_role"),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  language: varchar("language").default("en"),
  coachingPersonality: jsonb("coaching_personality"),
  duration: integer("duration"), // in minutes
  overallScore: integer("overall_score"),
  status: varchar("status").default("active"), // active, completed, paused
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const interviewQuestions = pgTable("interview_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionText: text("question_text").notNull(),
  category: varchar("category").notNull(), // behavioral, technical, situational, company-culture
  difficulty: varchar("difficulty").notNull(), // easy, medium, hard
  industry: varchar("industry").notNull(),
  companySpecific: boolean("company_specific").default(false),
  expectedDuration: integer("expected_duration"), // in seconds
  followUpQuestions: text("follow_up_questions").array(),
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const interviewResponses = pgTable("interview_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").references(() => interviewCoachingSessions.id).notNull(),
  questionId: uuid("question_id").references(() => interviewQuestions.id).notNull(),
  responseText: text("response_text"),
  responseAudio: text("response_audio"), // base64 or file path
  responseVideo: text("response_video"), // base64 or file path
  confidenceScore: integer("confidence_score"),
  clarityScore: integer("clarity_score"),
  contentScore: integer("content_score"),
  timeToThink: integer("time_to_think"), // in seconds
  responseTime: integer("response_time"), // in seconds
  facialExpressions: jsonb("facial_expressions"),
  bodyLanguage: jsonb("body_language"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interviewFeedback = pgTable("interview_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  responseId: uuid("response_id").references(() => interviewResponses.id).notNull(),
  feedbackText: text("feedback_text"),
  improvementSuggestions: text("improvement_suggestions").array(),
  strengths: text("strengths").array(),
  areasToImprove: text("areas_to_improve").array(),
  emotionalIntelligence: jsonb("emotional_intelligence"),
  communicationScores: jsonb("communication_scores"),
  speechAnalysis: jsonb("speech_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companyInterviewInsights = pgTable("company_interview_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: varchar("company_id").notNull(),
  companyName: varchar("company_name").notNull(),
  interviewProcess: text("interview_process"),
  commonQuestions: text("common_questions").array(),
  cultureNotes: text("culture_notes"),
  successTips: text("success_tips").array(),
  interviewerProfiles: jsonb("interviewer_profiles"),
  salaryNegotiationTips: text("salary_negotiation_tips").array(),
  averageInterviewDuration: integer("average_interview_duration"),
  difficultyLevel: varchar("difficulty_level"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userInterviewProgress = pgTable("user_interview_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  totalSessions: integer("total_sessions").default(0),
  hoursSpent: decimal("hours_spent").default("0"),
  improvementRate: integer("improvement_rate").default(0),
  skillProgress: jsonb("skill_progress"),
  achievements: jsonb("achievements"),
  nextGoals: text("next_goals").array(),
  lastSessionAt: timestamp("last_session_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Career Coaching System Tables
export const careerProfiles = pgTable("career_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  currentRole: varchar("current_role"),
  targetRole: varchar("target_role"),
  experienceLevel: varchar("experience_level"), // entry, junior, mid, senior, lead, executive
  industry: varchar("industry"),
  careerStage: varchar("career_stage"), // exploration, establishment, advancement, transition, maintenance
  personalityType: varchar("personality_type"),
  workStyle: varchar("work_style"),
  careerValues: text("career_values").array(),
  strengths: text("strengths").array(),
  improvementAreas: text("improvement_areas").array(),
  careerGoals: text("career_goals").array(),
  assessmentData: jsonb("assessment_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skillAssessments = pgTable("skill_assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  skillName: varchar("skill_name").notNull(),
  skillCategory: varchar("skill_category"), // technical, soft, industry-specific
  currentLevel: integer("current_level"), // 1-10 scale
  targetLevel: integer("target_level"),
  importanceScore: integer("importance_score"), // 1-10 scale
  marketDemand: integer("market_demand"), // 1-10 scale
  assessmentMethod: varchar("assessment_method"), // self-assessment, test, peer-review, ai-evaluation
  evidenceData: jsonb("evidence_data"),
  lastAssessed: timestamp("last_assessed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const careerGoals = pgTable("career_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  goalType: varchar("goal_type").notNull(), // role_advancement, skill_development, salary_increase, industry_change
  title: varchar("title").notNull(),
  description: text("description"),
  targetDate: date("target_date"),
  progressPercentage: integer("progress_percentage").default(0),
  priority: varchar("priority").default("medium"), // low, medium, high, critical
  status: varchar("status").default("active"), // active, completed, paused, cancelled
  milestones: jsonb("milestones"),
  actionItems: text("action_items").array(),
  successMetrics: jsonb("success_metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const learningPlans = pgTable("learning_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  goalId: uuid("goal_id").references(() => careerGoals.id),
  courseId: varchar("course_id"),
  courseName: varchar("course_name").notNull(),
  platform: varchar("platform").notNull(), // coursera, udemy, linkedin_learning, internal
  courseUrl: varchar("course_url"),
  skillsTargeted: text("skills_targeted").array(),
  estimatedDuration: integer("estimated_duration"), // in hours
  difficulty: varchar("difficulty"), // beginner, intermediate, advanced
  status: varchar("status").default("planned"), // planned, in_progress, completed, abandoned
  progress: integer("progress").default(0), // 0-100 percentage
  startDate: date("start_date"),
  completionDate: date("completion_date"),
  skillImpact: jsonb("skill_impact"),
  certificateUrl: varchar("certificate_url"),
  rating: integer("rating"), // 1-5 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mentorshipMatches = pgTable("mentorship_matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  mentorId: varchar("mentor_id").references(() => users.id).notNull(),
  menteeId: varchar("mentee_id").references(() => users.id).notNull(),
  matchScore: integer("match_score"), // 1-100 compatibility score
  matchingCriteria: jsonb("matching_criteria"),
  relationshipType: varchar("relationship_type"), // formal, informal, group, peer
  goals: text("goals").array(),
  meetingFrequency: varchar("meeting_frequency"), // weekly, biweekly, monthly, as_needed
  communicationPreference: varchar("communication_preference"), // video, phone, chat, email
  status: varchar("status").default("pending"), // pending, active, completed, cancelled
  startDate: date("start_date"),
  endDate: date("end_date"),
  satisfactionScore: integer("satisfaction_score"), // 1-10 scale
  outcomes: text("outcomes").array(),
  nextMeetingDate: date("next_meeting_date"),
  totalMeetings: integer("total_meetings").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const industryInsights = pgTable("industry_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  industry: varchar("industry").notNull(),
  trendType: varchar("trend_type").notNull(), // growth, decline, disruption, emergence
  title: varchar("title").notNull(),
  description: text("description"),
  impactScore: integer("impact_score"), // 1-10 scale
  timeHorizon: varchar("time_horizon"), // short_term, medium_term, long_term
  affectedRoles: text("affected_roles").array(),
  skillsInDemand: text("skills_in_demand").array(),
  skillsDepreciating: text("skills_depreciating").array(),
  sourceUrl: varchar("source_url"),
  confidence: integer("confidence"), // 1-10 scale
  region: varchar("region"), // global, us, europe, asia, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const networkingEvents = pgTable("networking_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  description: text("description"),
  eventType: varchar("event_type"), // conference, meetup, workshop, webinar, job_fair
  industry: varchar("industry"),
  targetAudience: text("target_audience").array(),
  location: varchar("location"),
  isVirtual: boolean("is_virtual").default(false),
  eventDate: timestamp("event_date"),
  registrationUrl: varchar("registration_url"),
  cost: decimal("cost"),
  organizer: varchar("organizer"),
  skillsRelevant: text("skills_relevant").array(),
  networkingPotential: integer("networking_potential"), // 1-10 scale
  careerImpact: integer("career_impact"), // 1-10 scale
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const careerProgress = pgTable("career_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  goalId: uuid("goal_id").references(() => careerGoals.id),
  progressType: varchar("progress_type"), // milestone, skill_improvement, goal_completion
  progressData: jsonb("progress_data"),
  description: text("description"),
  impactScore: integer("impact_score"), // 1-10 scale
  evidenceUrl: varchar("evidence_url"),
  recognitionReceived: text("recognition_received"),
  nextSteps: text("next_steps").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const personalBranding = pgTable("personal_branding", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  brandStatement: text("brand_statement"),
  valueProposition: text("value_proposition"),
  targetAudience: text("target_audience"),
  keyMessages: text("key_messages").array(),
  brandingGoals: text("branding_goals").array(),
  linkedinOptimization: jsonb("linkedin_optimization"),
  contentStrategy: jsonb("content_strategy"),
  networkingStrategy: jsonb("networking_strategy"),
  brandConsistency: integer("brand_consistency"), // 1-10 scale
  onlinePresence: jsonb("online_presence"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Relations
export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  jobApplications: many(jobApplications),
  interviews: many(interviews),
  jobAlerts: many(jobAlerts),
  notifications: many(notifications),
  userPreferences: many(userPreferences),
  savedJobs: many(savedJobs),
  interviewPractice: many(interviewPractice),
  salaryNegotiations: many(salaryNegotiations),
  interviewCoachingSessions: many(interviewCoachingSessions),
  userInterviewProgress: many(userInterviewProgress),
  careerProfiles: many(careerProfiles),
  skillAssessments: many(skillAssessments),
  careerGoals: many(careerGoals),
  learningPlans: many(learningPlans),
  mentorshipMatches: many(mentorshipMatches),
  careerProgress: many(careerProgress),
  personalBranding: many(personalBranding),
}));

export const jobsRelations = relations(jobs, ({ many }) => ({
  jobApplications: many(jobApplications),
  interviews: many(interviews),
  savedJobs: many(savedJobs),
  interviewPractice: many(interviewPractice),
  salaryNegotiations: many(salaryNegotiations),
}));

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, { fields: [resumes.userId], references: [users.id] }),
  jobApplications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one, many }) => ({
  user: one(users, { fields: [jobApplications.userId], references: [users.id] }),
  job: one(jobs, { fields: [jobApplications.jobId], references: [jobs.id] }),
  resume: one(resumes, { fields: [jobApplications.resumeId], references: [resumes.id] }),
  interviews: many(interviews),
  salaryNegotiations: many(salaryNegotiations),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  user: one(users, { fields: [interviews.userId], references: [users.id] }),
  job: one(jobs, { fields: [interviews.jobId], references: [jobs.id] }),
  application: one(jobApplications, { fields: [interviews.applicationId], references: [jobApplications.id] }),
}));

export const jobAlertsRelations = relations(jobAlerts, ({ one }) => ({
  user: one(users, { fields: [jobAlerts.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  user: one(users, { fields: [savedJobs.userId], references: [users.id] }),
  job: one(jobs, { fields: [savedJobs.jobId], references: [jobs.id] }),
}));

export const interviewPracticeRelations = relations(interviewPractice, ({ one }) => ({
  user: one(users, { fields: [interviewPractice.userId], references: [users.id] }),
  job: one(jobs, { fields: [interviewPractice.jobId], references: [jobs.id] }),
}));

export const salaryNegotiationsRelations = relations(salaryNegotiations, ({ one }) => ({
  user: one(users, { fields: [salaryNegotiations.userId], references: [users.id] }),
  job: one(jobs, { fields: [salaryNegotiations.jobId], references: [jobs.id] }),
  application: one(jobApplications, { fields: [salaryNegotiations.applicationId], references: [jobApplications.id] }),
}));

// Interview Coaching System Relations
export const interviewCoachingSessionsRelations = relations(interviewCoachingSessions, ({ one, many }) => ({
  user: one(users, { fields: [interviewCoachingSessions.userId], references: [users.id] }),
  responses: many(interviewResponses),
}));

export const interviewQuestionsRelations = relations(interviewQuestions, ({ many }) => ({
  responses: many(interviewResponses),
}));

export const interviewResponsesRelations = relations(interviewResponses, ({ one, many }) => ({
  session: one(interviewCoachingSessions, { fields: [interviewResponses.sessionId], references: [interviewCoachingSessions.id] }),
  question: one(interviewQuestions, { fields: [interviewResponses.questionId], references: [interviewQuestions.id] }),
  feedback: many(interviewFeedback),
}));

export const interviewFeedbackRelations = relations(interviewFeedback, ({ one }) => ({
  response: one(interviewResponses, { fields: [interviewFeedback.responseId], references: [interviewResponses.id] }),
}));

export const userInterviewProgressRelations = relations(userInterviewProgress, ({ one }) => ({
  user: one(users, { fields: [userInterviewProgress.userId], references: [users.id] }),
}));

// Career Coaching System Relations
export const careerProfilesRelations = relations(careerProfiles, ({ one }) => ({
  user: one(users, { fields: [careerProfiles.userId], references: [users.id] }),
}));

export const skillAssessmentsRelations = relations(skillAssessments, ({ one }) => ({
  user: one(users, { fields: [skillAssessments.userId], references: [users.id] }),
}));

export const careerGoalsRelations = relations(careerGoals, ({ one, many }) => ({
  user: one(users, { fields: [careerGoals.userId], references: [users.id] }),
  learningPlans: many(learningPlans),
  careerProgress: many(careerProgress),
}));

export const learningPlansRelations = relations(learningPlans, ({ one }) => ({
  user: one(users, { fields: [learningPlans.userId], references: [users.id] }),
  goal: one(careerGoals, { fields: [learningPlans.goalId], references: [careerGoals.id] }),
}));

export const mentorshipMatchesRelations = relations(mentorshipMatches, ({ one }) => ({
  mentor: one(users, { fields: [mentorshipMatches.mentorId], references: [users.id] }),
  mentee: one(users, { fields: [mentorshipMatches.menteeId], references: [users.id] }),
}));

export const careerProgressRelations = relations(careerProgress, ({ one }) => ({
  user: one(users, { fields: [careerProgress.userId], references: [users.id] }),
  goal: one(careerGoals, { fields: [careerProgress.goalId], references: [careerGoals.id] }),
}));

export const personalBrandingRelations = relations(personalBranding, ({ one }) => ({
  user: one(users, { fields: [personalBranding.userId], references: [users.id] }),
}));

// Job Alerts and Opportunity Intelligence System Tables
export const alertProfiles = pgTable("alert_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  alertName: varchar("alert_name").notNull(),
  criteriaJson: jsonb("criteria_json").notNull(), // Search criteria, filters, keywords
  predictionEnabled: boolean("prediction_enabled").default(true),
  isActive: boolean("is_active").default(true),
  frequency: varchar("frequency").default("daily"), // immediate, daily, weekly
  lastTriggered: timestamp("last_triggered"),
  relevanceScore: decimal("relevance_score", { precision: 3, scale: 2 }).default("0.00"),
  totalAlerts: integer("total_alerts").default(0),
  userFeedbackScore: decimal("user_feedback_score", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const opportunityPredictions = pgTable("opportunity_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: varchar("company_id").notNull(),
  companyName: varchar("company_name").notNull(),
  predictedRoles: text("predicted_roles").array(),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }).notNull(),
  signalsDetected: jsonb("signals_detected").notNull(), // Array of detected signals
  industryTrends: jsonb("industry_trends"),
  competitiveLandscape: jsonb("competitive_landscape"),
  hiringProbability: decimal("hiring_probability", { precision: 3, scale: 2 }).notNull(),
  expectedTimeframe: varchar("expected_timeframe"), // 1-7 days, 1-2 weeks, 1-3 months
  salaryTrends: jsonb("salary_trends"),
  skillsInDemand: text("skills_in_demand").array(),
  predictionDate: timestamp("prediction_date").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  accuracy: decimal("accuracy", { precision: 3, scale: 2 }), // Post-validation accuracy
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alertDeliveries = pgTable("alert_deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  alertId: uuid("alert_id").references(() => alertProfiles.id, { onDelete: "cascade" }).notNull(),
  opportunityId: uuid("opportunity_id"), // Can reference jobs or predictions
  opportunityType: varchar("opportunity_type").notNull(), // job_posting, prediction, market_signal
  deliveryChannel: varchar("delivery_channel").notNull(), // email, push, sms, in_app
  deliveryStatus: varchar("delivery_status").default("pending"), // pending, sent, delivered, failed
  userAction: varchar("user_action"), // viewed, clicked, applied, dismissed, saved
  actionTimestamp: timestamp("action_timestamp"),
  relevanceScore: decimal("relevance_score", { precision: 3, scale: 2 }).notNull(),
  urgencyScore: decimal("urgency_score", { precision: 3, scale: 2 }).notNull(),
  personalizedContent: jsonb("personalized_content"),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketSignals = pgTable("market_signals", {
  id: uuid("id").primaryKey().defaultRandom(),
  signalType: varchar("signal_type").notNull(), // funding, expansion, news, social, job_posting
  companyId: varchar("company_id").notNull(),
  companyName: varchar("company_name").notNull(),
  signalData: jsonb("signal_data").notNull(),
  source: varchar("source").notNull(), // crunchbase, news_api, linkedin, twitter, etc.
  impactScore: decimal("impact_score", { precision: 3, scale: 2 }).notNull(),
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }),
  detectionDate: timestamp("detection_date").defaultNow(),
  processingStatus: varchar("processing_status").default("pending"), // pending, processed, analyzed
  relatedOpportunities: jsonb("related_opportunities"),
  industryImpact: jsonb("industry_impact"),
  competitorAnalysis: jsonb("competitor_analysis"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alertUserPreferences = pgTable("alert_user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  notificationChannels: text("notification_channels").array().default([]), // email, push, sms
  timingPreferences: jsonb("timing_preferences").notNull(), // preferred hours, timezone, frequency
  frequencySettings: jsonb("frequency_settings").notNull(), // max per day, batching preferences
  priorityFilters: jsonb("priority_filters"), // minimum relevance, urgency thresholds
  channelPreferences: jsonb("channel_preferences"), // channel-specific settings
  quietHours: jsonb("quiet_hours"), // do not disturb periods
  weekendAlerts: boolean("weekend_alerts").default(false),
  instantAlerts: boolean("instant_alerts").default(false),
  batchingEnabled: boolean("batching_enabled").default(true),
  maxDailyAlerts: integer("max_daily_alerts").default(10),
  emailDigestEnabled: boolean("email_digest_enabled").default(true),
  pushEnabled: boolean("push_enabled").default(true),
  smsEnabled: boolean("sms_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alertAnalytics = pgTable("alert_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  alertId: uuid("alert_id").references(() => alertProfiles.id, { onDelete: "cascade" }).notNull(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  periodType: varchar("period_type").notNull(), // daily, weekly, monthly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalAlerts: integer("total_alerts").default(0),
  alertsViewed: integer("alerts_viewed").default(0),
  alertsClicked: integer("alerts_clicked").default(0),
  applicationsMade: integer("applications_made").default(0),
  opportunitiesSaved: integer("opportunities_saved").default(0),
  averageRelevanceScore: decimal("average_relevance_score", { precision: 3, scale: 2 }).default("0.00"),
  averageUrgencyScore: decimal("average_urgency_score", { precision: 3, scale: 2 }).default("0.00"),
  clickThroughRate: decimal("click_through_rate", { precision: 5, scale: 2 }).default("0.00"),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0.00"),
  userSatisfactionScore: decimal("user_satisfaction_score", { precision: 3, scale: 2 }),
  performanceMetrics: jsonb("performance_metrics"),
  improvementSuggestions: jsonb("improvement_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companyIntelligence = pgTable("company_intelligence", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: varchar("company_id").notNull(),
  companyName: varchar("company_name").notNull(),
  industry: varchar("industry"),
  companySize: varchar("company_size"),
  foundingYear: integer("founding_year"),
  location: varchar("location"),
  website: varchar("website"),
  description: text("description"),
  fundingStage: varchar("funding_stage"),
  totalFunding: decimal("total_funding", { precision: 15, scale: 2 }),
  lastFundingDate: timestamp("last_funding_date"),
  lastFundingAmount: decimal("last_funding_amount", { precision: 15, scale: 2 }),
  growthStage: varchar("growth_stage"), // startup, growth, mature, decline
  hiringTrends: jsonb("hiring_trends"),
  technologiesUsed: text("technologies_used").array(),
  competitorAnalysis: jsonb("competitor_analysis"),
  marketPosition: jsonb("market_position"),
  leadershipTeam: jsonb("leadership_team"),
  recentNews: jsonb("recent_news"),
  socialMediaData: jsonb("social_media_data"),
  glassdoorRating: decimal("glassdoor_rating", { precision: 2, scale: 1 }),
  linkedinFollowers: integer("linkedin_followers"),
  employeeCount: integer("employee_count"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports for Job Alerts System
export type InsertAlertProfile = typeof alertProfiles.$inferInsert;
export type AlertProfile = typeof alertProfiles.$inferSelect;

export type InsertOpportunityPrediction = typeof opportunityPredictions.$inferInsert;
export type OpportunityPrediction = typeof opportunityPredictions.$inferSelect;

export type InsertAlertDelivery = typeof alertDeliveries.$inferInsert;
export type AlertDelivery = typeof alertDeliveries.$inferSelect;

export type InsertMarketSignal = typeof marketSignals.$inferInsert;
export type MarketSignal = typeof marketSignals.$inferSelect;

export type InsertAlertUserPreferences = typeof alertUserPreferences.$inferInsert;
export type AlertUserPreferences = typeof alertUserPreferences.$inferSelect;

export type InsertAlertAnalytics = typeof alertAnalytics.$inferInsert;
export type AlertAnalytics = typeof alertAnalytics.$inferSelect;

export type InsertCompanyIntelligence = typeof companyIntelligence.$inferInsert;
export type CompanyIntelligence = typeof companyIntelligence.$inferSelect;

// Job Alerts System Zod schemas
export const insertAlertProfileSchema = createInsertSchema(alertProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOpportunityPredictionSchema = createInsertSchema(opportunityPredictions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAlertDeliverySchema = createInsertSchema(alertDeliveries).omit({ id: true, createdAt: true });
export const insertMarketSignalSchema = createInsertSchema(marketSignals).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAlertUserPreferencesSchema = createInsertSchema(alertUserPreferences).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAlertAnalyticsSchema = createInsertSchema(alertAnalytics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompanyIntelligenceSchema = createInsertSchema(companyIntelligence).omit({ id: true, createdAt: true, updatedAt: true });

// Job Alerts System Relations
export const alertProfilesRelations = relations(alertProfiles, ({ one, many }) => ({
  user: one(users, { fields: [alertProfiles.userId], references: [users.id] }),
  deliveries: many(alertDeliveries),
  analytics: many(alertAnalytics),
}));

export const opportunityPredictionsRelations = relations(opportunityPredictions, ({ many }) => ({
  deliveries: many(alertDeliveries),
}));

export const alertDeliveriesRelations = relations(alertDeliveries, ({ one }) => ({
  alert: one(alertProfiles, { fields: [alertDeliveries.alertId], references: [alertProfiles.id] }),
}));

export const alertUserPreferencesRelations = relations(alertUserPreferences, ({ one }) => ({
  user: one(users, { fields: [alertUserPreferences.userId], references: [users.id] }),
}));

export const alertAnalyticsRelations = relations(alertAnalytics, ({ one }) => ({
  alert: one(alertProfiles, { fields: [alertAnalytics.alertId], references: [alertProfiles.id] }),
  user: one(users, { fields: [alertAnalytics.userId], references: [users.id] }),
}));

// Schema exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertJob = typeof jobs.$inferInsert;
export type Job = typeof jobs.$inferSelect;

export type InsertResume = typeof resumes.$inferInsert;
export type Resume = typeof resumes.$inferSelect;

export type InsertJobApplication = typeof jobApplications.$inferInsert;
export type JobApplication = typeof jobApplications.$inferSelect;

export type InsertInterview = typeof interviews.$inferInsert;
export type Interview = typeof interviews.$inferSelect;

export type InsertJobAlert = typeof jobAlerts.$inferInsert;
export type JobAlert = typeof jobAlerts.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;

export type InsertUserPreferences = typeof userPreferences.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertSavedJob = typeof savedJobs.$inferInsert;
export type SavedJob = typeof savedJobs.$inferSelect;

export type InsertInterviewPractice = typeof interviewPractice.$inferInsert;
export type InterviewPractice = typeof interviewPractice.$inferSelect;

export type InsertSalaryNegotiation = typeof salaryNegotiations.$inferInsert;
export type SalaryNegotiation = typeof salaryNegotiations.$inferSelect;

// Interview Coaching System Types
export type InsertInterviewCoachingSession = typeof interviewCoachingSessions.$inferInsert;
export type InterviewCoachingSession = typeof interviewCoachingSessions.$inferSelect;

export type InsertInterviewQuestion = typeof interviewQuestions.$inferInsert;
export type InterviewQuestion = typeof interviewQuestions.$inferSelect;

export type InsertInterviewResponse = typeof interviewResponses.$inferInsert;
export type InterviewResponse = typeof interviewResponses.$inferSelect;

export type InsertInterviewFeedback = typeof interviewFeedback.$inferInsert;
export type InterviewFeedback = typeof interviewFeedback.$inferSelect;

export type InsertCompanyInterviewInsights = typeof companyInterviewInsights.$inferInsert;
export type CompanyInterviewInsights = typeof companyInterviewInsights.$inferSelect;

export type InsertUserInterviewProgress = typeof userInterviewProgress.$inferInsert;
export type UserInterviewProgress = typeof userInterviewProgress.$inferSelect;

// Career Coaching System Types
export type InsertCareerProfile = typeof careerProfiles.$inferInsert;
export type CareerProfile = typeof careerProfiles.$inferSelect;

export type InsertSkillAssessment = typeof skillAssessments.$inferInsert;
export type SkillAssessment = typeof skillAssessments.$inferSelect;

export type InsertCareerGoal = typeof careerGoals.$inferInsert;
export type CareerGoal = typeof careerGoals.$inferSelect;

export type InsertLearningPlan = typeof learningPlans.$inferInsert;
export type LearningPlan = typeof learningPlans.$inferSelect;

export type InsertMentorshipMatch = typeof mentorshipMatches.$inferInsert;
export type MentorshipMatch = typeof mentorshipMatches.$inferSelect;

export type InsertIndustryInsight = typeof industryInsights.$inferInsert;
export type IndustryInsight = typeof industryInsights.$inferSelect;

export type InsertNetworkingEvent = typeof networkingEvents.$inferInsert;
export type NetworkingEvent = typeof networkingEvents.$inferSelect;

export type InsertCareerProgress = typeof careerProgress.$inferInsert;
export type CareerProgress = typeof careerProgress.$inferSelect;

export type InsertPersonalBranding = typeof personalBranding.$inferInsert;
export type PersonalBranding = typeof personalBranding.$inferSelect;

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true, updatedAt: true });
export const insertResumeSchema = createInsertSchema(resumes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({ id: true, appliedAt: true, updatedAt: true });
export const insertInterviewSchema = createInsertSchema(interviews).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJobAlertSchema = createInsertSchema(jobAlerts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({ id: true, createdAt: true });
export const insertInterviewPracticeSchema = createInsertSchema(interviewPractice).omit({ id: true, createdAt: true, completedAt: true });
export const insertSalaryNegotiationSchema = createInsertSchema(salaryNegotiations).omit({ id: true, createdAt: true, updatedAt: true });

// Interview Coaching System Zod schemas
export const insertInterviewCoachingSessionSchema = createInsertSchema(interviewCoachingSessions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInterviewQuestionSchema = createInsertSchema(interviewQuestions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInterviewResponseSchema = createInsertSchema(interviewResponses).omit({ id: true, createdAt: true });
export const insertInterviewFeedbackSchema = createInsertSchema(interviewFeedback).omit({ id: true, createdAt: true });
export const insertCompanyInterviewInsightsSchema = createInsertSchema(companyInterviewInsights).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserInterviewProgressSchema = createInsertSchema(userInterviewProgress).omit({ id: true, createdAt: true, updatedAt: true });

// Career Coaching System Zod schemas
export const insertCareerProfileSchema = createInsertSchema(careerProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSkillAssessmentSchema = createInsertSchema(skillAssessments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCareerGoalSchema = createInsertSchema(careerGoals).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLearningPlanSchema = createInsertSchema(learningPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMentorshipMatchSchema = createInsertSchema(mentorshipMatches).omit({ id: true, createdAt: true, updatedAt: true });
export const insertIndustryInsightSchema = createInsertSchema(industryInsights).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNetworkingEventSchema = createInsertSchema(networkingEvents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCareerProgressSchema = createInsertSchema(careerProgress).omit({ id: true, createdAt: true });
export const insertPersonalBrandingSchema = createInsertSchema(personalBranding).omit({ id: true, createdAt: true, updatedAt: true });

// Auto-Apply Automation System Tables
export const automationProfiles = pgTable("automation_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  profileName: varchar("profile_name").notNull(),
  automationRules: jsonb("automation_rules").notNull(), // Application criteria, filters, exclusions
  qualitySettings: jsonb("quality_settings").notNull(), // Quality thresholds, review requirements
  approvalRequired: boolean("approval_required").default(true),
  isActive: boolean("is_active").default(true),
  dailyLimit: integer("daily_limit").default(10),
  weeklyLimit: integer("weekly_limit").default(50),
  monthlyLimit: integer("monthly_limit").default(200),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0.00"),
  totalApplications: integer("total_applications").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applicationQueue = pgTable("application_queue", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  profileId: uuid("profile_id").references(() => automationProfiles.id, { onDelete: "cascade" }).notNull(),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  jobUrl: varchar("job_url").notNull(),
  companyName: varchar("company_name").notNull(),
  positionTitle: varchar("position_title").notNull(),
  status: varchar("status").default("pending"), // pending, analyzed, generated, review, approved, submitted, failed
  generatedContent: jsonb("generated_content"), // Cover letter, resume customization, answers
  reviewStatus: varchar("review_status").default("pending"), // pending, approved, rejected, needs_revision
  reviewNotes: text("review_notes"),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }),
  personalizationScore: decimal("personalization_score", { precision: 3, scale: 2 }),
  atsCompatibility: decimal("ats_compatibility", { precision: 3, scale: 2 }),
  submissionDate: timestamp("submission_date"),
  submissionMethod: varchar("submission_method"), // direct_upload, email, form_fill, api
  submissionResponse: jsonb("submission_response"),
  errorDetails: text("error_details"),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  nextRetryAt: timestamp("next_retry_at"),
  priority: integer("priority").default(50), // 0-100 priority score
  estimatedCompletionTime: integer("estimated_completion_time"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const automationRules = pgTable("automation_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  profileId: uuid("profile_id").references(() => automationProfiles.id, { onDelete: "cascade" }).notNull(),
  ruleType: varchar("rule_type").notNull(), // include, exclude, prioritize, customize
  conditions: jsonb("conditions").notNull(), // Keywords, salary range, location, etc.
  actions: jsonb("actions").notNull(), // Apply specific template, skip, priority adjustment
  priority: integer("priority").default(50), // Rule execution priority
  activeStatus: boolean("active_status").default(true),
  matchCount: integer("match_count").default(0),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const qualityMetrics = pgTable("quality_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applicationQueue.id, { onDelete: "cascade" }).notNull(),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }).notNull(),
  personalizationScore: decimal("personalization_score", { precision: 3, scale: 2 }).notNull(),
  atsCompatibility: decimal("ats_compatibility", { precision: 3, scale: 2 }).notNull(),
  humanReview: boolean("human_review").default(false),
  grammarScore: decimal("grammar_score", { precision: 3, scale: 2 }),
  relevanceScore: decimal("relevance_score", { precision: 3, scale: 2 }),
  originalityScore: decimal("originality_score", { precision: 3, scale: 2 }),
  professionalismScore: decimal("professionalism_score", { precision: 3, scale: 2 }),
  keywordOptimization: decimal("keyword_optimization", { precision: 3, scale: 2 }),
  detailedAnalysis: jsonb("detailed_analysis"), // Specific feedback and suggestions
  improvementSuggestions: text("improvement_suggestions").array(),
  flaggedIssues: text("flagged_issues").array(),
  comparisonBenchmarks: jsonb("comparison_benchmarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const submissionLogs = pgTable("submission_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applicationQueue.id, { onDelete: "cascade" }).notNull(),
  submissionMethod: varchar("submission_method").notNull(), // direct_upload, email, form_fill, api
  platform: varchar("platform").notNull(), // linkedin, indeed, company_website, etc.
  successStatus: boolean("success_status").notNull(),
  httpStatus: integer("http_status"),
  errorDetails: text("error_details"),
  responseData: jsonb("response_data"),
  submissionDuration: integer("submission_duration"), // in seconds
  documentsSubmitted: text("documents_submitted").array(),
  formFieldsCompleted: jsonb("form_fields_completed"),
  captchaEncountered: boolean("captcha_encountered").default(false),
  humanInterventionRequired: boolean("human_intervention_required").default(false),
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  sessionId: varchar("session_id"),
  screenshotPath: varchar("screenshot_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const automationAnalytics = pgTable("automation_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  profileId: uuid("profile_id").references(() => automationProfiles.id, { onDelete: "cascade" }).notNull(),
  periodType: varchar("period_type").notNull(), // daily, weekly, monthly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalApplications: integer("total_applications").default(0),
  successfulSubmissions: integer("successful_submissions").default(0),
  failedSubmissions: integer("failed_submissions").default(0),
  averageQualityScore: decimal("average_quality_score", { precision: 3, scale: 2 }).default("0.00"),
  averagePersonalizationScore: decimal("average_personalization_score", { precision: 3, scale: 2 }).default("0.00"),
  averageAtsCompatibility: decimal("average_ats_compatibility", { precision: 3, scale: 2 }).default("0.00"),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("0.00"),
  interviewInviteRate: decimal("interview_invite_rate", { precision: 5, scale: 2 }).default("0.00"),
  timeSaved: integer("time_saved"), // in minutes
  costPerApplication: decimal("cost_per_application", { precision: 5, scale: 2 }),
  automationEfficiency: decimal("automation_efficiency", { precision: 5, scale: 2 }),
  topPerformingRules: jsonb("top_performing_rules"),
  improvementSuggestions: text("improvement_suggestions").array(),
  performanceMetrics: jsonb("performance_metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const platformCredentials = pgTable("platform_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  platform: varchar("platform").notNull(), // linkedin, indeed, glassdoor, etc.
  credentialType: varchar("credential_type").notNull(), // oauth, username_password, api_key
  encryptedCredentials: text("encrypted_credentials").notNull(),
  credentialStatus: varchar("credential_status").default("active"), // active, expired, revoked, invalid
  lastValidated: timestamp("last_validated"),
  validationErrors: text("validation_errors").array(),
  permissions: text("permissions").array(),
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const automationSessions = pgTable("automation_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  profileId: uuid("profile_id").references(() => automationProfiles.id, { onDelete: "cascade" }).notNull(),
  sessionType: varchar("session_type").notNull(), // scheduled, manual, test
  status: varchar("status").default("running"), // running, completed, failed, paused, cancelled
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalJobs: integer("total_jobs").default(0),
  processedJobs: integer("processed_jobs").default(0),
  successfulApplications: integer("successful_applications").default(0),
  failedApplications: integer("failed_applications").default(0),
  averageProcessingTime: integer("average_processing_time"), // in seconds
  errorsSummary: jsonb("errors_summary"),
  performanceMetrics: jsonb("performance_metrics"),
  resourceUsage: jsonb("resource_usage"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Auto-Apply System Relations
export const automationProfilesRelations = relations(automationProfiles, ({ one, many }) => ({
  user: one(users, { fields: [automationProfiles.userId], references: [users.id] }),
  queue: many(applicationQueue),
  rules: many(automationRules),
  analytics: many(automationAnalytics),
  sessions: many(automationSessions),
}));

export const applicationQueueRelations = relations(applicationQueue, ({ one, many }) => ({
  user: one(users, { fields: [applicationQueue.userId], references: [users.id] }),
  profile: one(automationProfiles, { fields: [applicationQueue.profileId], references: [automationProfiles.id] }),
  job: one(jobs, { fields: [applicationQueue.jobId], references: [jobs.id] }),
  qualityMetrics: many(qualityMetrics),
  submissionLogs: many(submissionLogs),
}));

export const automationRulesRelations = relations(automationRules, ({ one }) => ({
  user: one(users, { fields: [automationRules.userId], references: [users.id] }),
  profile: one(automationProfiles, { fields: [automationRules.profileId], references: [automationProfiles.id] }),
}));

export const qualityMetricsRelations = relations(qualityMetrics, ({ one }) => ({
  application: one(applicationQueue, { fields: [qualityMetrics.applicationId], references: [applicationQueue.id] }),
}));

export const submissionLogsRelations = relations(submissionLogs, ({ one }) => ({
  application: one(applicationQueue, { fields: [submissionLogs.applicationId], references: [applicationQueue.id] }),
}));

export const automationAnalyticsRelations = relations(automationAnalytics, ({ one }) => ({
  user: one(users, { fields: [automationAnalytics.userId], references: [users.id] }),
  profile: one(automationProfiles, { fields: [automationAnalytics.profileId], references: [automationProfiles.id] }),
}));

export const platformCredentialsRelations = relations(platformCredentials, ({ one }) => ({
  user: one(users, { fields: [platformCredentials.userId], references: [users.id] }),
}));

export const automationSessionsRelations = relations(automationSessions, ({ one }) => ({
  user: one(users, { fields: [automationSessions.userId], references: [users.id] }),
  profile: one(automationProfiles, { fields: [automationSessions.profileId], references: [automationProfiles.id] }),
}));

// Auto-Apply System Types
export type InsertAutomationProfile = typeof automationProfiles.$inferInsert;
export type AutomationProfile = typeof automationProfiles.$inferSelect;

export type InsertApplicationQueue = typeof applicationQueue.$inferInsert;
export type ApplicationQueue = typeof applicationQueue.$inferSelect;

export type InsertAutomationRule = typeof automationRules.$inferInsert;
export type AutomationRule = typeof automationRules.$inferSelect;

export type InsertQualityMetric = typeof qualityMetrics.$inferInsert;
export type QualityMetric = typeof qualityMetrics.$inferSelect;

export type InsertSubmissionLog = typeof submissionLogs.$inferInsert;
export type SubmissionLog = typeof submissionLogs.$inferSelect;

export type InsertAutomationAnalytics = typeof automationAnalytics.$inferInsert;
export type AutomationAnalytics = typeof automationAnalytics.$inferSelect;

export type InsertPlatformCredential = typeof platformCredentials.$inferInsert;
export type PlatformCredential = typeof platformCredentials.$inferSelect;

export type InsertAutomationSession = typeof automationSessions.$inferInsert;
export type AutomationSession = typeof automationSessions.$inferSelect;

// Auto-Apply System Zod Schemas
export const insertAutomationProfileSchema = createInsertSchema(automationProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApplicationQueueSchema = createInsertSchema(applicationQueue).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertQualityMetricSchema = createInsertSchema(qualityMetrics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubmissionLogSchema = createInsertSchema(submissionLogs).omit({ id: true, createdAt: true });
export const insertAutomationAnalyticsSchema = createInsertSchema(automationAnalytics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPlatformCredentialSchema = createInsertSchema(platformCredentials).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAutomationSessionSchema = createInsertSchema(automationSessions).omit({ id: true, createdAt: true, updatedAt: true });

// Application Tracking and Management System
export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
  companyId: varchar("company_id"),
  positionTitle: varchar("position_title").notNull(),
  companyName: varchar("company_name").notNull(),
  applicationDate: timestamp("application_date").notNull(),
  status: varchar("status").notNull().default("applied"), // applied, screening, interview, offer, rejected, withdrawn
  source: varchar("source").notNull(), // manual, job_board, email, referral
  priorityScore: integer("priority_score").default(50), // 0-100
  applicationUrl: varchar("application_url"),
  jobDescription: text("job_description"),
  requirements: text("requirements"),
  salary: varchar("salary"),
  location: varchar("location"),
  workType: varchar("work_type"), // remote, hybrid, onsite
  contactPerson: varchar("contact_person"),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  notes: text("notes"),
  emailThreadId: varchar("email_thread_id"),
  lastInteractionDate: timestamp("last_interaction_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  expectedResponseDate: timestamp("expected_response_date"),
  isArchived: boolean("is_archived").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applicationTimeline = pgTable("application_timeline", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  eventType: varchar("event_type").notNull(), // status_change, email_sent, email_received, interview_scheduled, follow_up
  eventDate: timestamp("event_date").notNull(),
  description: text("description").notNull(),
  source: varchar("source").notNull(), // manual, email, calendar, system
  confidenceScore: integer("confidence_score").default(100), // 0-100
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communications = pgTable("communications", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  communicationType: varchar("communication_type").notNull(), // email, phone, linkedin, text
  direction: varchar("direction").notNull(), // inbound, outbound
  subject: varchar("subject"),
  content: text("content"),
  fromAddress: varchar("from_address"),
  toAddress: varchar("to_address"),
  ccAddress: varchar("cc_address"),
  timestamp: timestamp("timestamp").notNull(),
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }), // -1.00 to 1.00
  priorityLevel: varchar("priority_level").default("medium"), // low, medium, high, urgent
  requiresAction: boolean("requires_action").default(false),
  actionTaken: boolean("action_taken").default(false),
  emailId: varchar("email_id"),
  threadId: varchar("thread_id"),
  messageId: varchar("message_id"),
  attachments: jsonb("attachments"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const followUps = pgTable("follow_ups", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  followUpType: varchar("follow_up_type").notNull(), // application_status, interview_follow_up, thank_you, networking
  scheduledDate: timestamp("scheduled_date").notNull(),
  actualSentDate: timestamp("actual_sent_date"),
  messageTemplate: text("message_template"),
  personalizedMessage: text("personalized_message"),
  subject: varchar("subject"),
  sentStatus: varchar("sent_status").default("pending"), // pending, sent, failed, cancelled
  responseReceived: boolean("response_received").default(false),
  responseDate: timestamp("response_date"),
  responseContent: text("response_content"),
  effectiveness: varchar("effectiveness"), // positive, neutral, negative
  automationLevel: varchar("automation_level").default("manual"), // manual, semi_auto, fully_auto
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const outcomePredictions = pgTable("outcome_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }).notNull(),
  predictionScore: decimal("prediction_score", { precision: 3, scale: 2 }).notNull(), // 0.00 to 1.00
  predictedOutcome: varchar("predicted_outcome").notNull(), // success, rejection, no_response
  factors: jsonb("factors").notNull(), // JSON array of prediction factors
  confidenceLevel: varchar("confidence_level").notNull(), // low, medium, high
  modelVersion: varchar("model_version").notNull(),
  timeToHirePrediction: integer("time_to_hire_prediction"), // days
  probabilityDetails: jsonb("probability_details"), // breakdown by outcome
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailIntegrations = pgTable("email_integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  provider: varchar("provider").notNull(), // gmail, outlook
  email: varchar("email").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  isActive: boolean("is_active").default(true),
  lastSyncDate: timestamp("last_sync_date"),
  syncStatus: varchar("sync_status").default("pending"), // pending, syncing, completed, error
  errorMessage: text("error_message"),
  scopes: text("scopes").array(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applicationAnalytics = pgTable("application_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  periodType: varchar("period_type").notNull(), // daily, weekly, monthly, yearly
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalApplications: integer("total_applications").default(0),
  responsesReceived: integer("responses_received").default(0),
  interviewsScheduled: integer("interviews_scheduled").default(0),
  offersReceived: integer("offers_received").default(0),
  rejections: integer("rejections").default(0),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("0.00"),
  interviewRate: decimal("interview_rate", { precision: 5, scale: 2 }).default("0.00"),
  offerRate: decimal("offer_rate", { precision: 5, scale: 2 }).default("0.00"),
  averageResponseTime: decimal("average_response_time", { precision: 5, scale: 2 }), // days
  topPerformingCompanies: jsonb("top_performing_companies"),
  topPerformingRoles: jsonb("top_performing_roles"),
  optimizationSuggestions: jsonb("optimization_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports for Application Tracking System
export type InsertApplication = typeof applications.$inferInsert;
export type Application = typeof applications.$inferSelect;

export type InsertApplicationTimeline = typeof applicationTimeline.$inferInsert;
export type ApplicationTimeline = typeof applicationTimeline.$inferSelect;

export type InsertCommunication = typeof communications.$inferInsert;
export type Communication = typeof communications.$inferSelect;

export type InsertFollowUp = typeof followUps.$inferInsert;
export type FollowUp = typeof followUps.$inferSelect;

export type InsertOutcomePrediction = typeof outcomePredictions.$inferInsert;
export type OutcomePrediction = typeof outcomePredictions.$inferSelect;

export type InsertEmailIntegration = typeof emailIntegrations.$inferInsert;
export type EmailIntegration = typeof emailIntegrations.$inferSelect;

export type InsertApplicationAnalytics = typeof applicationAnalytics.$inferInsert;
export type ApplicationAnalytics = typeof applicationAnalytics.$inferSelect;

// Application Tracking System Zod schemas
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApplicationTimelineSchema = createInsertSchema(applicationTimeline).omit({ id: true, createdAt: true });
export const insertCommunicationSchema = createInsertSchema(communications).omit({ id: true, createdAt: true });
export const insertFollowUpSchema = createInsertSchema(followUps).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOutcomePredictionSchema = createInsertSchema(outcomePredictions).omit({ id: true, createdAt: true });
export const insertEmailIntegrationSchema = createInsertSchema(emailIntegrations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApplicationAnalyticsSchema = createInsertSchema(applicationAnalytics).omit({ id: true, createdAt: true, updatedAt: true });

// Application Tracking System Relations
export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, { fields: [applications.userId], references: [users.id] }),
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  timeline: many(applicationTimeline),
  communications: many(communications),
  followUps: many(followUps),
  outcomePredictions: many(outcomePredictions),
}));

export const applicationTimelineRelations = relations(applicationTimeline, ({ one }) => ({
  application: one(applications, { fields: [applicationTimeline.applicationId], references: [applications.id] }),
}));

export const communicationsRelations = relations(communications, ({ one }) => ({
  application: one(applications, { fields: [communications.applicationId], references: [applications.id] }),
}));

export const followUpsRelations = relations(followUps, ({ one }) => ({
  application: one(applications, { fields: [followUps.applicationId], references: [applications.id] }),
}));

export const outcomePredictionsRelations = relations(outcomePredictions, ({ one }) => ({
  application: one(applications, { fields: [outcomePredictions.applicationId], references: [applications.id] }),
}));

export const emailIntegrationsRelations = relations(emailIntegrations, ({ one }) => ({
  user: one(users, { fields: [emailIntegrations.userId], references: [users.id] }),
}));

export const applicationAnalyticsRelations = relations(applicationAnalytics, ({ one }) => ({
  user: one(users, { fields: [applicationAnalytics.userId], references: [users.id] }),
}));

// Salary Intelligence System Tables
export const salaryData = pgTable("salary_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobTitle: varchar("job_title").notNull(),
  company: varchar("company"),
  location: varchar("location").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryMedian: integer("salary_median"),
  equity: varchar("equity"),
  benefits: text("benefits"),
  dataSource: varchar("data_source").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  experienceLevel: varchar("experience_level"),
  industry: varchar("industry"),
  companySize: varchar("company_size"),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  costOfLiving: decimal("cost_of_living", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow()
});

export const userNegotiations = pgTable("user_negotiations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  positionTitle: varchar("position_title").notNull(),
  company: varchar("company").notNull(),
  currentOffer: integer("current_offer"),
  targetSalary: integer("target_salary"),
  negotiationStatus: varchar("negotiation_status").default('planned'), // 'planned', 'in_progress', 'completed', 'rejected'
  outcome: varchar("outcome"),
  finalSalary: integer("final_salary"),
  improvementPercent: decimal("improvement_percent", { precision: 5, scale: 2 }),
  strategyUsed: text("strategy_used"),
  simulationScores: jsonb("simulation_scores"),
  coachingNotes: text("coaching_notes"),
  negotiationTips: text("negotiation_tips").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const companyCompensation = pgTable("company_compensation", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: varchar("company_id").notNull(),
  companyName: varchar("company_name").notNull(),
  avgSalary: integer("avg_salary"),
  salaryRanges: jsonb("salary_ranges"),
  equityPolicy: text("equity_policy"),
  benefitsPackage: text("benefits_package"),
  negotiationFlexibility: varchar("negotiation_flexibility"),
  workLifeBalance: decimal("work_life_balance", { precision: 3, scale: 2 }),
  cultureScore: decimal("culture_score", { precision: 3, scale: 2 }),
  financialHealth: varchar("financial_health"),
  growthStage: varchar("growth_stage"),
  compensationPhilosophy: text("compensation_philosophy"),
  reviewCycle: varchar("review_cycle"),
  promotionTimeline: text("promotion_timeline"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

export const marketTrends = pgTable("market_trends", {
  id: uuid("id").primaryKey().defaultRandom(),
  industry: varchar("industry").notNull(),
  jobTitle: varchar("job_title").notNull(),
  location: varchar("location").notNull(),
  timePeriod: varchar("time_period").notNull(),
  salaryTrend: varchar("salary_trend"), // 'increasing', 'decreasing', 'stable'
  trendPercentage: decimal("trend_percentage", { precision: 5, scale: 2 }),
  demandLevel: varchar("demand_level"), // 'low', 'medium', 'high', 'critical'
  growthProjection: decimal("growth_projection", { precision: 5, scale: 2 }),
  skillsPremium: jsonb("skills_premium"),
  marketInsights: text("market_insights"),
  competitiveFactors: text("competitive_factors").array(),
  dataSource: varchar("data_source"),
  confidenceLevel: varchar("confidence_level"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const negotiationSessions = pgTable("negotiation_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  negotiationId: uuid("negotiation_id").references(() => userNegotiations.id),
  sessionType: varchar("session_type").notNull(), // 'simulation', 'coaching', 'practice', 'strategy'
  scenario: text("scenario"),
  userResponses: jsonb("user_responses"),
  aiResponses: jsonb("ai_responses"),
  performanceScore: decimal("performance_score", { precision: 3, scale: 2 }),
  communicationScore: decimal("communication_score", { precision: 3, scale: 2 }),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  areasImproved: text("areas_improved").array(),
  recommendations: text("recommendations").array(),
  sessionDuration: integer("session_duration"),
  feedback: text("feedback"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow()
});

export const salaryBenchmarks = pgTable("salary_benchmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  jobTitle: varchar("job_title").notNull(),
  industry: varchar("industry").notNull(),
  location: varchar("location").notNull(),
  experienceLevel: varchar("experience_level").notNull(),
  marketMin: integer("market_min"),
  marketMax: integer("market_max"),
  marketMedian: integer("market_median"),
  userTarget: integer("user_target"),
  personalizedMin: integer("personalized_min"),
  personalizedMax: integer("personalized_max"),
  benchmarkFactors: jsonb("benchmark_factors"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});

// Salary Intelligence System Types
export type SalaryData = typeof salaryData.$inferSelect;
export type UserNegotiation = typeof userNegotiations.$inferSelect;
export type CompanyCompensation = typeof companyCompensation.$inferSelect;
export type MarketTrend = typeof marketTrends.$inferSelect;
export type NegotiationSession = typeof negotiationSessions.$inferSelect;
export type SalaryBenchmark = typeof salaryBenchmarks.$inferSelect;

// Salary Intelligence System Zod schemas
export const insertSalaryDataSchema = createInsertSchema(salaryData).omit({ id: true, createdAt: true });
export const insertUserNegotiationSchema = createInsertSchema(userNegotiations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompanyCompensationSchema = createInsertSchema(companyCompensation).omit({ id: true, createdAt: true, lastUpdated: true });
export const insertMarketTrendSchema = createInsertSchema(marketTrends).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNegotiationSessionSchema = createInsertSchema(negotiationSessions).omit({ id: true, createdAt: true });
export const insertSalaryBenchmarkSchema = createInsertSchema(salaryBenchmarks).omit({ id: true, createdAt: true, lastUpdated: true });

// Salary Intelligence System Relations
export const salaryDataRelations = relations(salaryData, ({ one, many }) => ({
  benchmarks: many(salaryBenchmarks),
}));

export const userNegotiationsRelations = relations(userNegotiations, ({ one, many }) => ({
  user: one(users, { fields: [userNegotiations.userId], references: [users.id] }),
  sessions: many(negotiationSessions),
}));

export const companyCompensationRelations = relations(companyCompensation, ({ one, many }) => ({
  negotiations: many(userNegotiations),
}));

export const marketTrendsRelations = relations(marketTrends, ({ one, many }) => ({
  benchmarks: many(salaryBenchmarks),
}));

export const negotiationSessionsRelations = relations(negotiationSessions, ({ one }) => ({
  user: one(users, { fields: [negotiationSessions.userId], references: [users.id] }),
  negotiation: one(userNegotiations, { fields: [negotiationSessions.negotiationId], references: [userNegotiations.id] }),
}));

export const salaryBenchmarksRelations = relations(salaryBenchmarks, ({ one }) => ({
  user: one(users, { fields: [salaryBenchmarks.userId], references: [users.id] }),
}));
