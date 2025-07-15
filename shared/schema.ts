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
