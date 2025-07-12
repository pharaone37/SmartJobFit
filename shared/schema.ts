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
