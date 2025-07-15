import {
  users,
  jobs,
  resumes,
  jobApplications,
  interviews,
  jobAlerts,
  notifications,
  userPreferences,
  savedJobs,
  interviewPractice,
  salaryNegotiations,
  resumeTemplates,
  moodBoards,
  skillTracking,
  interviewSessions,
  networkConnections,
  type User,
  type UpsertUser,
  type Job,
  type InsertJob,
  type Resume,
  type InsertResume,
  type JobApplication,
  type InsertJobApplication,
  type Interview,
  type InsertInterview,
  type JobAlert,
  type InsertJobAlert,
  type Notification,
  type InsertNotification,
  type UserPreferences,
  type InsertUserPreferences,
  type SavedJob,
  type InsertSavedJob,
  type InterviewPractice,
  type InsertInterviewPractice,
  type SalaryNegotiation,
  type InsertSalaryNegotiation,
  type ResumeTemplate,
  type InsertResumeTemplate,
  type MoodBoard,
  type InsertMoodBoard,
  type SkillTracking,
  type InsertSkillTracking,
  type InterviewSession,
  type InsertInterviewSession,
  type NetworkConnection,
  type InsertNetworkConnection,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, ilike, gte, lte, inArray, isNull } from "drizzle-orm";

export interface JobSearchFilters {
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  remote?: boolean;
  limit?: number;
}

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Job operations
  createJob(job: InsertJob): Promise<Job>;
  getJob(id: string): Promise<Job | undefined>;
  getJobs(filters?: JobSearchFilters): Promise<Job[]>;
  searchJobs(query: string, filters?: JobSearchFilters): Promise<Job[]>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined>;
  deleteJob(id: string): Promise<void>;
  
  // Resume operations
  createResume(resume: InsertResume): Promise<Resume>;
  getResume(id: string): Promise<Resume | undefined>;
  getResumes(userId: string): Promise<Resume[]>;
  updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<void>;
  
  // Job application operations
  createJobApplication(application: InsertJobApplication): Promise<JobApplication>;
  getJobApplication(id: string): Promise<JobApplication | undefined>;
  getJobApplications(userId: string): Promise<JobApplication[]>;
  updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication | undefined>;
  deleteJobApplication(id: string): Promise<void>;
  getJobApplicationStats(userId: string): Promise<any>;
  
  // Interview operations
  createInterview(interview: InsertInterview): Promise<Interview>;
  getInterview(id: string): Promise<Interview | undefined>;
  getInterviews(userId: string): Promise<Interview[]>;
  updateInterview(id: string, updates: Partial<Interview>): Promise<Interview | undefined>;
  deleteInterview(id: string): Promise<void>;
  
  // Job alert operations
  createJobAlert(alert: InsertJobAlert): Promise<JobAlert>;
  getJobAlert(id: string): Promise<JobAlert | undefined>;
  getJobAlerts(userId: string): Promise<JobAlert[]>;
  updateJobAlert(id: string, updates: Partial<JobAlert>): Promise<JobAlert | undefined>;
  deleteJobAlert(id: string): Promise<void>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  
  // User preferences operations
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | undefined>;
  
  // Saved job operations
  createSavedJob(savedJob: InsertSavedJob): Promise<SavedJob>;
  getSavedJobs(userId: string): Promise<SavedJob[]>;
  deleteSavedJob(id: string): Promise<void>;
  
  // Interview practice operations
  createInterviewPractice(practice: InsertInterviewPractice): Promise<InterviewPractice>;
  getInterviewPractice(userId: string): Promise<InterviewPractice[]>;
  
  // Salary negotiation operations
  createSalaryNegotiation(negotiation: InsertSalaryNegotiation): Promise<SalaryNegotiation>;
  getSalaryNegotiations(userId: string): Promise<SalaryNegotiation[]>;
  updateSalaryNegotiation(id: string, updates: Partial<SalaryNegotiation>): Promise<SalaryNegotiation | undefined>;
  
  // Resume template operations
  createResumeTemplate(template: InsertResumeTemplate): Promise<ResumeTemplate>;
  getResumeTemplate(id: string): Promise<ResumeTemplate | undefined>;
  getResumeTemplates(userId: string): Promise<ResumeTemplate[]>;
  updateResumeTemplate(id: string, updates: Partial<ResumeTemplate>): Promise<ResumeTemplate | undefined>;
  deleteResumeTemplate(id: string): Promise<void>;
  
  // Mood board operations
  createMoodBoard(moodBoard: InsertMoodBoard): Promise<MoodBoard>;
  getMoodBoard(id: string): Promise<MoodBoard | undefined>;
  getMoodBoards(userId: string): Promise<MoodBoard[]>;
  updateMoodBoard(id: string, updates: Partial<MoodBoard>): Promise<MoodBoard | undefined>;
  deleteMoodBoard(id: string): Promise<void>;
  
  // Skill tracking operations
  createSkillTracking(skill: InsertSkillTracking): Promise<SkillTracking>;
  getSkillTracking(id: string): Promise<SkillTracking | undefined>;
  getSkillTrackings(userId: string): Promise<SkillTracking[]>;
  updateSkillTracking(id: string, updates: Partial<SkillTracking>): Promise<SkillTracking | undefined>;
  deleteSkillTracking(id: string): Promise<void>;
  
  // Interview session operations
  createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession>;
  getInterviewSession(id: string): Promise<InterviewSession | undefined>;
  getInterviewSessions(userId: string): Promise<InterviewSession[]>;
  updateInterviewSession(id: string, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined>;
  deleteInterviewSession(id: string): Promise<void>;
  
  // Network connection operations
  createNetworkConnection(connection: InsertNetworkConnection): Promise<NetworkConnection>;
  getNetworkConnection(id: string): Promise<NetworkConnection | undefined>;
  getNetworkConnections(userId: string): Promise<NetworkConnection[]>;
  updateNetworkConnection(id: string, updates: Partial<NetworkConnection>): Promise<NetworkConnection | undefined>;
  deleteNetworkConnection(id: string): Promise<void>;
  syncNetworkConnections(userId: string, platform: string): Promise<NetworkConnection[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          provider: userData.provider,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Job operations
  async createJob(job: InsertJob): Promise<Job> {
    const [createdJob] = await db.insert(jobs).values(job).returning();
    return createdJob;
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getJobs(filters: JobSearchFilters = {}): Promise<Job[]> {
    const conditions = [eq(jobs.isActive, true)];

    if (filters.location) {
      conditions.push(
        or(
          ilike(jobs.location, `%${filters.location}%`),
          ilike(jobs.location, '%remote%')
        )!
      );
    }

    if (filters.jobType) {
      conditions.push(eq(jobs.jobType, filters.jobType));
    }

    if (filters.experienceLevel) {
      conditions.push(eq(jobs.experienceLevel, filters.experienceLevel));
    }

    if (filters.salaryMin) {
      conditions.push(gte(jobs.salaryMin, filters.salaryMin));
    }

    if (filters.salaryMax) {
      conditions.push(lte(jobs.salaryMax, filters.salaryMax));
    }

    const query = db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.postedAt));

    if (filters.limit) {
      return await query.limit(filters.limit);
    }

    return await query;
  }

  async searchJobs(query: string, filters: JobSearchFilters = {}): Promise<Job[]> {
    const conditions = [
      eq(jobs.isActive, true),
      or(
        ilike(jobs.title, `%${query}%`),
        ilike(jobs.company, `%${query}%`),
        ilike(jobs.description, `%${query}%`)
      )
    ];

    if (filters.location) {
      conditions.push(
        or(
          ilike(jobs.location, `%${filters.location}%`),
          ilike(jobs.location, '%remote%')
        )
      );
    }

    if (filters.jobType) {
      conditions.push(eq(jobs.jobType, filters.jobType));
    }

    if (filters.experienceLevel) {
      conditions.push(eq(jobs.experienceLevel, filters.experienceLevel));
    }

    if (filters.salaryMin) {
      conditions.push(gte(jobs.salaryMin, filters.salaryMin));
    }

    if (filters.salaryMax) {
      conditions.push(lte(jobs.salaryMax, filters.salaryMax));
    }

    const dbQuery = db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.postedAt));

    if (filters.limit) {
      return await dbQuery.limit(filters.limit);
    }

    return await dbQuery;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: string): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Resume operations
  async createResume(resume: InsertResume): Promise<Resume> {
    const [createdResume] = await db.insert(resumes).values(resume).returning();
    return createdResume;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, id));
    return resume;
  }

  async getResumes(userId: string): Promise<Resume[]> {
    return db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.createdAt));
  }

  async updateResume(id: string, updates: Partial<Resume>): Promise<Resume | undefined> {
    const [resume] = await db
      .update(resumes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return resume;
  }

  async deleteResume(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.id, id));
  }

  // Job application operations
  async createJobApplication(application: InsertJobApplication): Promise<JobApplication> {
    const [createdApplication] = await db.insert(jobApplications).values(application).returning();
    return createdApplication;
  }

  async getJobApplication(id: string): Promise<JobApplication | undefined> {
    const [application] = await db.select().from(jobApplications).where(eq(jobApplications.id, id));
    return application;
  }

  async getJobApplications(userId: string): Promise<JobApplication[]> {
    return db.select().from(jobApplications).where(eq(jobApplications.userId, userId)).orderBy(desc(jobApplications.appliedAt));
  }

  async updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication | undefined> {
    const [application] = await db
      .update(jobApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobApplications.id, id))
      .returning();
    return application;
  }

  async deleteJobApplication(id: string): Promise<void> {
    await db.delete(jobApplications).where(eq(jobApplications.id, id));
  }

  async getJobApplicationStats(userId: string): Promise<any> {
    const applications = await this.getJobApplications(userId);
    const totalApplications = applications.length;
    const interviewCount = applications.filter(app => app.status === 'interview').length;
    const offerCount = applications.filter(app => app.status === 'offer').length;
    const rejectedCount = applications.filter(app => app.status === 'rejected').length;

    return {
      totalApplications,
      interviewCount,
      offerCount,
      rejectedCount,
      responseRate: totalApplications > 0 ? Math.round(((interviewCount + offerCount + rejectedCount) / totalApplications) * 100) : 0,
      interviewRate: totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0,
      offerRate: interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0,
    };
  }

  // Interview operations
  async createInterview(interview: InsertInterview): Promise<Interview> {
    const [createdInterview] = await db.insert(interviews).values(interview).returning();
    return createdInterview;
  }

  async getInterview(id: string): Promise<Interview | undefined> {
    const [interview] = await db.select().from(interviews).where(eq(interviews.id, id));
    return interview;
  }

  async getInterviews(userId: string): Promise<Interview[]> {
    return db.select().from(interviews).where(eq(interviews.userId, userId)).orderBy(desc(interviews.scheduledAt));
  }

  async updateInterview(id: string, updates: Partial<Interview>): Promise<Interview | undefined> {
    const [interview] = await db
      .update(interviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interviews.id, id))
      .returning();
    return interview;
  }

  async deleteInterview(id: string): Promise<void> {
    await db.delete(interviews).where(eq(interviews.id, id));
  }

  // Job alert operations
  async createJobAlert(alert: InsertJobAlert): Promise<JobAlert> {
    const [createdAlert] = await db.insert(jobAlerts).values(alert).returning();
    return createdAlert;
  }

  async getJobAlert(id: string): Promise<JobAlert | undefined> {
    const [alert] = await db.select().from(jobAlerts).where(eq(jobAlerts.id, id));
    return alert;
  }

  async getJobAlerts(userId: string): Promise<JobAlert[]> {
    return db.select().from(jobAlerts).where(eq(jobAlerts.userId, userId)).orderBy(desc(jobAlerts.createdAt));
  }

  async updateJobAlert(id: string, updates: Partial<JobAlert>): Promise<JobAlert | undefined> {
    const [alert] = await db
      .update(jobAlerts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobAlerts.id, id))
      .returning();
    return alert;
  }

  async deleteJobAlert(id: string): Promise<void> {
    await db.delete(jobAlerts).where(eq(jobAlerts.id, id));
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [createdNotification] = await db.insert(notifications).values(notification).returning();
    return createdNotification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }

  // User preferences operations
  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [createdPreferences] = await db.insert(userPreferences).values(preferences).returning();
    return createdPreferences;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .update(userPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return preferences;
  }

  // Saved job operations
  async createSavedJob(savedJob: InsertSavedJob): Promise<SavedJob> {
    const [createdSavedJob] = await db.insert(savedJobs).values(savedJob).returning();
    return createdSavedJob;
  }

  async getSavedJobs(userId: string): Promise<SavedJob[]> {
    return db.select().from(savedJobs).where(eq(savedJobs.userId, userId)).orderBy(desc(savedJobs.createdAt));
  }

  async deleteSavedJob(id: string): Promise<void> {
    await db.delete(savedJobs).where(eq(savedJobs.id, id));
  }

  // Interview practice operations
  async createInterviewPractice(practice: InsertInterviewPractice): Promise<InterviewPractice> {
    const [createdPractice] = await db.insert(interviewPractice).values(practice).returning();
    return createdPractice;
  }

  async getInterviewPractice(userId: string): Promise<InterviewPractice[]> {
    return db.select().from(interviewPractice).where(eq(interviewPractice.userId, userId)).orderBy(desc(interviewPractice.createdAt));
  }

  // Salary negotiation operations
  async createSalaryNegotiation(negotiation: InsertSalaryNegotiation): Promise<SalaryNegotiation> {
    const [createdNegotiation] = await db.insert(salaryNegotiations).values(negotiation).returning();
    return createdNegotiation;
  }

  async getSalaryNegotiations(userId: string): Promise<SalaryNegotiation[]> {
    return db.select().from(salaryNegotiations).where(eq(salaryNegotiations.userId, userId)).orderBy(desc(salaryNegotiations.createdAt));
  }

  async updateSalaryNegotiation(id: string, updates: Partial<SalaryNegotiation>): Promise<SalaryNegotiation | undefined> {
    const [negotiation] = await db
      .update(salaryNegotiations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(salaryNegotiations.id, id))
      .returning();
    return negotiation;
  }

  // Resume template operations
  async createResumeTemplate(template: InsertResumeTemplate): Promise<ResumeTemplate> {
    const [createdTemplate] = await db.insert(resumeTemplates).values(template).returning();
    return createdTemplate;
  }

  async getResumeTemplate(id: string): Promise<ResumeTemplate | undefined> {
    const [template] = await db.select().from(resumeTemplates).where(eq(resumeTemplates.id, id));
    return template;
  }

  async getResumeTemplates(userId: string): Promise<ResumeTemplate[]> {
    return db.select().from(resumeTemplates).where(eq(resumeTemplates.userId, userId)).orderBy(desc(resumeTemplates.createdAt));
  }

  async updateResumeTemplate(id: string, updates: Partial<ResumeTemplate>): Promise<ResumeTemplate | undefined> {
    const [template] = await db
      .update(resumeTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resumeTemplates.id, id))
      .returning();
    return template;
  }

  async deleteResumeTemplate(id: string): Promise<void> {
    await db.delete(resumeTemplates).where(eq(resumeTemplates.id, id));
  }

  // Mood board operations
  async createMoodBoard(moodBoard: InsertMoodBoard): Promise<MoodBoard> {
    const [createdMoodBoard] = await db.insert(moodBoards).values(moodBoard).returning();
    return createdMoodBoard;
  }

  async getMoodBoard(id: string): Promise<MoodBoard | undefined> {
    const [moodBoard] = await db.select().from(moodBoards).where(eq(moodBoards.id, id));
    return moodBoard;
  }

  async getMoodBoards(userId: string): Promise<MoodBoard[]> {
    return db.select().from(moodBoards).where(eq(moodBoards.userId, userId)).orderBy(desc(moodBoards.createdAt));
  }

  async updateMoodBoard(id: string, updates: Partial<MoodBoard>): Promise<MoodBoard | undefined> {
    const [moodBoard] = await db
      .update(moodBoards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(moodBoards.id, id))
      .returning();
    return moodBoard;
  }

  async deleteMoodBoard(id: string): Promise<void> {
    await db.delete(moodBoards).where(eq(moodBoards.id, id));
  }

  // Skill tracking operations
  async createSkillTracking(skill: InsertSkillTracking): Promise<SkillTracking> {
    const [createdSkill] = await db.insert(skillTracking).values(skill).returning();
    return createdSkill;
  }

  async getSkillTracking(id: string): Promise<SkillTracking | undefined> {
    const [skill] = await db.select().from(skillTracking).where(eq(skillTracking.id, id));
    return skill;
  }

  async getSkillTrackings(userId: string): Promise<SkillTracking[]> {
    return db.select().from(skillTracking).where(eq(skillTracking.userId, userId)).orderBy(desc(skillTracking.createdAt));
  }

  async updateSkillTracking(id: string, updates: Partial<SkillTracking>): Promise<SkillTracking | undefined> {
    const [skill] = await db
      .update(skillTracking)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(skillTracking.id, id))
      .returning();
    return skill;
  }

  async deleteSkillTracking(id: string): Promise<void> {
    await db.delete(skillTracking).where(eq(skillTracking.id, id));
  }

  // Interview session operations
  async createInterviewSession(session: InsertInterviewSession): Promise<InterviewSession> {
    const [createdSession] = await db.insert(interviewSessions).values(session).returning();
    return createdSession;
  }

  async getInterviewSession(id: string): Promise<InterviewSession | undefined> {
    const [session] = await db.select().from(interviewSessions).where(eq(interviewSessions.id, id));
    return session;
  }

  async getInterviewSessions(userId: string): Promise<InterviewSession[]> {
    return db.select().from(interviewSessions).where(eq(interviewSessions.userId, userId)).orderBy(desc(interviewSessions.createdAt));
  }

  async updateInterviewSession(id: string, updates: Partial<InterviewSession>): Promise<InterviewSession | undefined> {
    const [session] = await db
      .update(interviewSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interviewSessions.id, id))
      .returning();
    return session;
  }

  async deleteInterviewSession(id: string): Promise<void> {
    await db.delete(interviewSessions).where(eq(interviewSessions.id, id));
  }

  // Network connection operations
  async createNetworkConnection(connection: InsertNetworkConnection): Promise<NetworkConnection> {
    const [createdConnection] = await db.insert(networkConnections).values(connection).returning();
    return createdConnection;
  }

  async getNetworkConnection(id: string): Promise<NetworkConnection | undefined> {
    const [connection] = await db.select().from(networkConnections).where(eq(networkConnections.id, id));
    return connection;
  }

  async getNetworkConnections(userId: string): Promise<NetworkConnection[]> {
    return db.select().from(networkConnections).where(eq(networkConnections.userId, userId)).orderBy(desc(networkConnections.createdAt));
  }

  async updateNetworkConnection(id: string, updates: Partial<NetworkConnection>): Promise<NetworkConnection | undefined> {
    const [connection] = await db
      .update(networkConnections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(networkConnections.id, id))
      .returning();
    return connection;
  }

  async deleteNetworkConnection(id: string): Promise<void> {
    await db.delete(networkConnections).where(eq(networkConnections.id, id));
  }

  async syncNetworkConnections(userId: string, platform: string): Promise<NetworkConnection[]> {
    return db.select().from(networkConnections).where(
      and(
        eq(networkConnections.userId, userId),
        eq(networkConnections.platform, platform)
      )
    );
  }
}

export const storage = new DatabaseStorage();
