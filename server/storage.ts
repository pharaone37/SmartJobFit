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
  interviewCoachingSessions,
  interviewQuestions,
  interviewResponses,
  interviewFeedback,
  companyInterviewInsights,
  userInterviewProgress,
  applications,
  applicationTimeline,
  communications,
  followUps,
  outcomePredictions,
  emailIntegrations,
  applicationAnalytics,
  careerProfiles,
  skillAssessments,
  careerGoals,
  learningPlans,
  mentorshipMatches,
  industryInsights,
  networkingEvents,
  careerProgress,
  personalBranding,
  alertProfiles,
  opportunityPredictions,
  alertDeliveries,
  marketSignals,
  alertUserPreferences,
  alertAnalytics,
  companyIntelligence,
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
  type InterviewCoachingSession,
  type InsertInterviewCoachingSession,
  type InterviewQuestion,
  type InsertInterviewQuestion,
  type InterviewResponse,
  type InsertInterviewResponse,
  type InterviewFeedback,
  type InsertInterviewFeedback,
  type CompanyInterviewInsights,
  type InsertCompanyInterviewInsights,
  type UserInterviewProgress,
  type InsertUserInterviewProgress,
  type Application,
  type InsertApplication,
  type ApplicationTimeline,
  type InsertApplicationTimeline,
  type Communication,
  type InsertCommunication,
  type FollowUp,
  type InsertFollowUp,
  type OutcomePrediction,
  type InsertOutcomePrediction,
  type EmailIntegration,
  type InsertEmailIntegration,
  type ApplicationAnalytics,
  type InsertApplicationAnalytics,
  salaryData,
  userNegotiations,
  companyCompensation,
  marketTrends,
  negotiationSessions,
  salaryBenchmarks,
  type SalaryData,
  type UserNegotiation,
  type CompanyCompensation,
  type MarketTrend,
  type NegotiationSession,
  type SalaryBenchmark,
  type insertSalaryDataSchema,
  type insertUserNegotiationSchema,
  type insertCompanyCompensationSchema,
  type insertMarketTrendSchema,
  type insertNegotiationSessionSchema,
  type insertSalaryBenchmarkSchema,
  type CareerProfile,
  type InsertCareerProfile,
  type SkillAssessment,
  type InsertSkillAssessment,
  type CareerGoal,
  type InsertCareerGoal,
  type LearningPlan,
  type InsertLearningPlan,
  type MentorshipMatch,
  type InsertMentorshipMatch,
  type IndustryInsight,
  type InsertIndustryInsight,
  type NetworkingEvent,
  type InsertNetworkingEvent,
  type CareerProgress,
  type InsertCareerProgress,
  type PersonalBranding,
  type InsertPersonalBranding,
  type AlertProfile,
  type InsertAlertProfile,
  type OpportunityPrediction,
  type InsertOpportunityPrediction,
  type AlertDelivery,
  type InsertAlertDelivery,
  type MarketSignal,
  type InsertMarketSignal,
  type AlertUserPreferences,
  type InsertAlertUserPreferences,
  type AlertAnalytics,
  type InsertAlertAnalytics,
  type CompanyIntelligence,
  type InsertCompanyIntelligence,
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
  
  // Job search engine operations
  storeSearchHistory(userId: string, searchData: any): Promise<void>;
  getJobDetails(jobId: string): Promise<any>;
  saveJobForUser(userId: string, jobId: string, notes?: string): Promise<any>;
  
  // Resume optimizer operations  
  getUserResumeVersions(userId: string): Promise<any[]>;
  storeOptimizationResults(resumeId: string, suggestions: any[]): Promise<void>;
  getResumeAnalytics(resumeId: string): Promise<any>;
  trackResumeEvent(resumeId: string, event: string, data: any): Promise<void>;
  
  // Interview coaching operations
  createInterviewCoachingSession(session: InsertInterviewCoachingSession): Promise<InterviewCoachingSession>;
  getInterviewCoachingSession(id: string): Promise<InterviewCoachingSession | undefined>;
  getInterviewCoachingSessions(userId: string): Promise<InterviewCoachingSession[]>;
  updateInterviewCoachingSession(id: string, updates: Partial<InterviewCoachingSession>): Promise<InterviewCoachingSession | undefined>;
  deleteInterviewCoachingSession(id: string): Promise<void>;
  
  // Interview question operations
  createInterviewQuestion(question: InsertInterviewQuestion): Promise<InterviewQuestion>;
  getInterviewQuestion(id: string): Promise<InterviewQuestion | undefined>;
  getInterviewQuestions(filters?: Partial<InterviewQuestion>): Promise<InterviewQuestion[]>;
  updateInterviewQuestion(id: string, updates: Partial<InterviewQuestion>): Promise<InterviewQuestion | undefined>;
  deleteInterviewQuestion(id: string): Promise<void>;
  
  // Interview response operations
  createInterviewResponse(response: InsertInterviewResponse): Promise<InterviewResponse>;
  getInterviewResponse(id: string): Promise<InterviewResponse | undefined>;
  getInterviewResponses(sessionId: string): Promise<InterviewResponse[]>;
  updateInterviewResponse(id: string, updates: Partial<InterviewResponse>): Promise<InterviewResponse | undefined>;
  deleteInterviewResponse(id: string): Promise<void>;
  
  // Interview feedback operations
  createInterviewFeedback(feedback: InsertInterviewFeedback): Promise<InterviewFeedback>;
  getInterviewFeedback(responseId: string): Promise<InterviewFeedback | undefined>;
  updateInterviewFeedback(id: string, updates: Partial<InterviewFeedback>): Promise<InterviewFeedback | undefined>;
  deleteInterviewFeedback(id: string): Promise<void>;
  
  // Company interview insights operations
  createCompanyInterviewInsights(insights: InsertCompanyInterviewInsights): Promise<CompanyInterviewInsights>;
  getCompanyInterviewInsights(companyId: string): Promise<CompanyInterviewInsights | undefined>;
  updateCompanyInterviewInsights(id: string, updates: Partial<CompanyInterviewInsights>): Promise<CompanyInterviewInsights | undefined>;
  deleteCompanyInterviewInsights(id: string): Promise<void>;
  
  // User interview progress operations
  createUserInterviewProgress(progress: InsertUserInterviewProgress): Promise<UserInterviewProgress>;
  getUserInterviewProgress(userId: string): Promise<UserInterviewProgress | undefined>;
  updateUserInterviewProgress(userId: string, updates: Partial<UserInterviewProgress>): Promise<UserInterviewProgress | undefined>;
  deleteUserInterviewProgress(userId: string): Promise<void>;

  // Application tracking operations
  createApplication(application: InsertApplication): Promise<Application>;
  getApplication(id: string): Promise<Application | undefined>;
  getApplications(userId: string, filters?: any): Promise<Application[]>;
  updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined>;
  deleteApplication(id: string): Promise<void>;
  
  // Application timeline operations
  createApplicationTimeline(timeline: InsertApplicationTimeline): Promise<ApplicationTimeline>;
  getApplicationTimeline(applicationId: string): Promise<ApplicationTimeline[]>;
  deleteApplicationTimeline(id: string): Promise<void>;
  
  // Communication operations
  createCommunication(communication: InsertCommunication): Promise<Communication>;
  getCommunications(applicationId: string): Promise<Communication[]>;
  updateCommunication(id: string, updates: Partial<Communication>): Promise<Communication | undefined>;
  deleteCommunication(id: string): Promise<void>;
  
  // Follow-up operations
  createFollowUp(followUp: InsertFollowUp): Promise<FollowUp>;
  getFollowUps(applicationId: string): Promise<FollowUp[]>;
  getUpcomingFollowUps(userId: string): Promise<FollowUp[]>;
  updateFollowUp(id: string, updates: Partial<FollowUp>): Promise<FollowUp | undefined>;
  deleteFollowUp(id: string): Promise<void>;
  
  // Outcome prediction operations
  createOutcomePrediction(prediction: InsertOutcomePrediction): Promise<OutcomePrediction>;
  getOutcomePrediction(applicationId: string): Promise<OutcomePrediction | undefined>;
  updateOutcomePrediction(id: string, updates: Partial<OutcomePrediction>): Promise<OutcomePrediction | undefined>;
  deleteOutcomePrediction(id: string): Promise<void>;
  
  // Email integration operations
  createEmailIntegration(integration: InsertEmailIntegration): Promise<EmailIntegration>;
  getEmailIntegration(userId: string, provider: string): Promise<EmailIntegration | undefined>;
  getEmailIntegrations(userId: string): Promise<EmailIntegration[]>;
  updateEmailIntegration(id: string, updates: Partial<EmailIntegration>): Promise<EmailIntegration | undefined>;
  deleteEmailIntegration(id: string): Promise<void>;
  
  // Application analytics operations
  createApplicationAnalytics(analytics: InsertApplicationAnalytics): Promise<ApplicationAnalytics>;
  getApplicationAnalytics(userId: string, periodType: string): Promise<ApplicationAnalytics | undefined>;
  getApplicationAnalyticsHistory(userId: string): Promise<ApplicationAnalytics[]>;
  updateApplicationAnalytics(id: string, updates: Partial<ApplicationAnalytics>): Promise<ApplicationAnalytics | undefined>;
  deleteApplicationAnalytics(id: string): Promise<void>;
  
  // Application tracking utility operations
  getApplicationsWithTimeline(userId: string): Promise<any[]>;
  
  // Salary intelligence operations
  createSalaryData(salaryData: any): Promise<SalaryData>;
  getSalaryData(filters?: any): Promise<SalaryData[]>;
  updateSalaryData(id: string, updates: Partial<SalaryData>): Promise<SalaryData | undefined>;
  deleteSalaryData(id: string): Promise<void>;
  
  // User negotiation operations
  createUserNegotiation(negotiation: any): Promise<UserNegotiation>;
  getUserNegotiation(id: string): Promise<UserNegotiation | undefined>;
  getUserNegotiations(userId: string): Promise<UserNegotiation[]>;
  updateUserNegotiation(id: string, updates: Partial<UserNegotiation>): Promise<UserNegotiation | undefined>;
  deleteUserNegotiation(id: string): Promise<void>;
  
  // Company compensation operations
  createCompanyCompensation(compensation: any): Promise<CompanyCompensation>;
  getCompanyCompensation(companyId: string): Promise<CompanyCompensation | undefined>;
  getCompanyCompensations(filters?: any): Promise<CompanyCompensation[]>;
  updateCompanyCompensation(id: string, updates: Partial<CompanyCompensation>): Promise<CompanyCompensation | undefined>;
  deleteCompanyCompensation(id: string): Promise<void>;
  
  // Market trend operations
  createMarketTrend(trend: any): Promise<MarketTrend>;
  getMarketTrend(id: string): Promise<MarketTrend | undefined>;
  getMarketTrends(filters?: any): Promise<MarketTrend[]>;
  updateMarketTrend(id: string, updates: Partial<MarketTrend>): Promise<MarketTrend | undefined>;
  deleteMarketTrend(id: string): Promise<void>;
  
  // Negotiation session operations
  createNegotiationSession(session: any): Promise<NegotiationSession>;
  getNegotiationSession(id: string): Promise<NegotiationSession | undefined>;
  getNegotiationSessions(userId: string): Promise<NegotiationSession[]>;
  updateNegotiationSession(id: string, updates: Partial<NegotiationSession>): Promise<NegotiationSession | undefined>;
  deleteNegotiationSession(id: string): Promise<void>;
  
  // Salary benchmark operations
  createSalaryBenchmark(benchmark: any): Promise<SalaryBenchmark>;
  getSalaryBenchmark(id: string): Promise<SalaryBenchmark | undefined>;
  getSalaryBenchmarks(userId: string): Promise<SalaryBenchmark[]>;
  updateSalaryBenchmark(id: string, updates: Partial<SalaryBenchmark>): Promise<SalaryBenchmark | undefined>;
  deleteSalaryBenchmark(id: string): Promise<void>;
  getApplicationsWithCommunications(userId: string): Promise<any[]>;
  getApplicationPortfolioStats(userId: string): Promise<any>;
  syncEmailForApplications(userId: string, emailData: any[]): Promise<void>;
  
  // Career coaching operations
  createCareerProfile(profile: InsertCareerProfile): Promise<CareerProfile>;
  getCareerProfile(userId: string): Promise<CareerProfile | undefined>;
  updateCareerProfile(userId: string, updates: Partial<CareerProfile>): Promise<CareerProfile | undefined>;
  deleteCareerProfile(userId: string): Promise<void>;
  
  // Skill assessment operations
  createSkillAssessment(assessment: InsertSkillAssessment): Promise<SkillAssessment>;
  getSkillAssessment(id: string): Promise<SkillAssessment | undefined>;
  getUserSkillAssessments(userId: string): Promise<SkillAssessment[]>;
  updateSkillAssessment(id: string, updates: Partial<SkillAssessment>): Promise<SkillAssessment | undefined>;
  deleteSkillAssessment(id: string): Promise<void>;
  
  // Career goal operations
  createCareerGoal(goal: InsertCareerGoal): Promise<CareerGoal>;
  getCareerGoal(id: string): Promise<CareerGoal | undefined>;
  getUserCareerGoals(userId: string): Promise<CareerGoal[]>;
  updateCareerGoal(id: string, updates: Partial<CareerGoal>): Promise<CareerGoal | undefined>;
  deleteCareerGoal(id: string): Promise<void>;
  
  // Learning plan operations
  createLearningPlan(plan: InsertLearningPlan): Promise<LearningPlan>;
  getLearningPlan(id: string): Promise<LearningPlan | undefined>;
  getUserLearningPlans(userId: string): Promise<LearningPlan[]>;
  updateLearningPlan(id: string, updates: Partial<LearningPlan>): Promise<LearningPlan | undefined>;
  deleteLearningPlan(id: string): Promise<void>;
  
  // Mentorship operations
  createMentorshipMatch(match: InsertMentorshipMatch): Promise<MentorshipMatch>;
  getMentorshipMatch(id: string): Promise<MentorshipMatch | undefined>;
  getUserMentorshipMatches(userId: string): Promise<MentorshipMatch[]>;
  updateMentorshipMatch(id: string, updates: Partial<MentorshipMatch>): Promise<MentorshipMatch | undefined>;
  deleteMentorshipMatch(id: string): Promise<void>;
  
  // Industry insights operations
  createIndustryInsight(insight: InsertIndustryInsight): Promise<IndustryInsight>;
  getIndustryInsight(id: string): Promise<IndustryInsight | undefined>;
  getIndustryInsights(industry?: string, region?: string): Promise<IndustryInsight[]>;
  updateIndustryInsight(id: string, updates: Partial<IndustryInsight>): Promise<IndustryInsight | undefined>;
  deleteIndustryInsight(id: string): Promise<void>;
  
  // Networking events operations
  createNetworkingEvent(event: InsertNetworkingEvent): Promise<NetworkingEvent>;
  getNetworkingEvent(id: string): Promise<NetworkingEvent | undefined>;
  getNetworkingEvents(industry?: string, location?: string, eventType?: string): Promise<NetworkingEvent[]>;
  updateNetworkingEvent(id: string, updates: Partial<NetworkingEvent>): Promise<NetworkingEvent | undefined>;
  deleteNetworkingEvent(id: string): Promise<void>;
  
  // Career progress operations
  recordCareerProgress(progress: InsertCareerProgress): Promise<CareerProgress>;
  getCareerProgress(id: string): Promise<CareerProgress | undefined>;
  getUserCareerProgress(userId: string): Promise<CareerProgress[]>;
  updateCareerProgress(id: string, updates: Partial<CareerProgress>): Promise<CareerProgress | undefined>;
  deleteCareerProgress(id: string): Promise<void>;
  
  // Personal branding operations
  createPersonalBranding(branding: InsertPersonalBranding): Promise<PersonalBranding>;
  getPersonalBranding(userId: string): Promise<PersonalBranding | undefined>;
  updatePersonalBranding(userId: string, updates: Partial<PersonalBranding>): Promise<PersonalBranding | undefined>;
  deletePersonalBranding(userId: string): Promise<void>;
  
  // AI-powered career coaching operations
  generateCareerAdvice(context: any): Promise<any>;
  analyzeCareerPath(userId: string, analysis: any): Promise<any>;
  analyzeSkillGaps(userId: string, analysis: any): Promise<any>;
  getLearningRecommendations(userId: string, preferences: any): Promise<any>;
  
  // Job Alerts and Opportunity Intelligence operations
  createAlertProfile(alertProfile: InsertAlertProfile): Promise<AlertProfile>;
  getAlertProfile(id: string): Promise<AlertProfile | undefined>;
  getAlertProfiles(userId: string): Promise<AlertProfile[]>;
  updateAlertProfile(id: string, updates: Partial<AlertProfile>): Promise<AlertProfile | undefined>;
  deleteAlertProfile(id: string): Promise<void>;
  
  // Opportunity prediction operations
  createOpportunityPrediction(prediction: InsertOpportunityPrediction): Promise<OpportunityPrediction>;
  getOpportunityPrediction(id: string): Promise<OpportunityPrediction | undefined>;
  getOpportunityPredictions(filters?: any): Promise<OpportunityPrediction[]>;
  updateOpportunityPrediction(id: string, updates: Partial<OpportunityPrediction>): Promise<OpportunityPrediction | undefined>;
  deleteOpportunityPrediction(id: string): Promise<void>;
  
  // Alert delivery operations
  createAlertDelivery(delivery: InsertAlertDelivery): Promise<AlertDelivery>;
  getAlertDelivery(id: string): Promise<AlertDelivery | undefined>;
  getAlertDeliveries(alertId: string): Promise<AlertDelivery[]>;
  getUserAlertDeliveries(userId: string): Promise<AlertDelivery[]>;
  updateAlertDelivery(id: string, updates: Partial<AlertDelivery>): Promise<AlertDelivery | undefined>;
  deleteAlertDelivery(id: string): Promise<void>;
  
  // Market signal operations
  createMarketSignal(signal: InsertMarketSignal): Promise<MarketSignal>;
  getMarketSignal(id: string): Promise<MarketSignal | undefined>;
  getMarketSignals(filters?: any): Promise<MarketSignal[]>;
  updateMarketSignal(id: string, updates: Partial<MarketSignal>): Promise<MarketSignal | undefined>;
  deleteMarketSignal(id: string): Promise<void>;
  
  // Alert user preferences operations
  createAlertUserPreferences(preferences: InsertAlertUserPreferences): Promise<AlertUserPreferences>;
  getAlertUserPreferences(userId: string): Promise<AlertUserPreferences | undefined>;
  updateAlertUserPreferences(userId: string, updates: Partial<AlertUserPreferences>): Promise<AlertUserPreferences | undefined>;
  deleteAlertUserPreferences(userId: string): Promise<void>;
  
  // Alert analytics operations
  createAlertAnalytics(analytics: InsertAlertAnalytics): Promise<AlertAnalytics>;
  getAlertAnalytics(alertId: string): Promise<AlertAnalytics | undefined>;
  getUserAlertAnalytics(userId: string): Promise<AlertAnalytics[]>;
  updateAlertAnalytics(id: string, updates: Partial<AlertAnalytics>): Promise<AlertAnalytics | undefined>;
  deleteAlertAnalytics(id: string): Promise<void>;
  
  // Company intelligence operations
  createCompanyIntelligence(intelligence: InsertCompanyIntelligence): Promise<CompanyIntelligence>;
  getCompanyIntelligence(companyId: string): Promise<CompanyIntelligence | undefined>;
  getCompanyIntelligences(filters?: any): Promise<CompanyIntelligence[]>;
  updateCompanyIntelligence(id: string, updates: Partial<CompanyIntelligence>): Promise<CompanyIntelligence | undefined>;
  deleteCompanyIntelligence(id: string): Promise<void>;
  
  // Job alerts utility operations
  processJobAlerts(userId: string): Promise<any>;
  generateOpportunityPredictions(companyId: string): Promise<any>;
  processMarketSignals(signalType: string): Promise<any>;
  getAlertDashboard(userId: string): Promise<any>;
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

  // Job search engine operations
  async storeSearchHistory(userId: string, searchData: any): Promise<void> {
    const notification = {
      id: crypto.randomUUID(),
      userId,
      type: 'search_history',
      title: 'Search Performed',
      message: `Search query: "${searchData.query}" - ${searchData.resultsCount} results`,
      data: searchData,
      isRead: false,
      createdAt: new Date()
    };
    
    await db.insert(notifications).values(notification);
  }

  async getJobDetails(jobId: string): Promise<any> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
    return job;
  }

  async saveJobForUser(userId: string, jobId: string, notes?: string): Promise<any> {
    const savedJob = {
      id: crypto.randomUUID(),
      userId,
      jobId,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [created] = await db.insert(savedJobs).values(savedJob).returning();
    return created;
  }

  // Resume optimizer operations  
  async getUserResumeVersions(userId: string): Promise<any[]> {
    const userResumes = await db.select().from(resumes).where(eq(resumes.userId, userId)).orderBy(desc(resumes.createdAt));
    return userResumes;
  }

  async storeOptimizationResults(resumeId: string, suggestions: any[]): Promise<void> {
    const optimizationData = {
      optimizationSuggestions: suggestions,
      lastOptimized: new Date(),
      updatedAt: new Date()
    };
    
    await db
      .update(resumes)
      .set(optimizationData)
      .where(eq(resumes.id, resumeId));
  }

  async getResumeAnalytics(resumeId: string): Promise<any> {
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, resumeId));
    if (!resume) return null;
    
    return {
      resumeId,
      fileName: resume.fileName,
      createdAt: resume.createdAt,
      lastModified: resume.updatedAt,
      version: resume.version,
      optimizationSuggestions: resume.optimizationSuggestions,
      atsScore: resume.atsScore,
      keywords: resume.keywords
    };
  }

  async trackResumeEvent(resumeId: string, event: string, data: any): Promise<void> {
    const eventData = {
      resumeId,
      event,
      data,
      timestamp: new Date()
    };
    
    // Store in resume activity tracking
    await db
      .update(resumes)
      .set({ 
        lastModified: new Date(),
        updatedAt: new Date()
      })
      .where(eq(resumes.id, resumeId));
  }

  // Interview coaching operations
  async createInterviewCoachingSession(session: InsertInterviewCoachingSession): Promise<InterviewCoachingSession> {
    const [created] = await db.insert(interviewCoachingSessions).values(session).returning();
    return created;
  }

  async getInterviewCoachingSession(id: string): Promise<InterviewCoachingSession | undefined> {
    const [session] = await db.select().from(interviewCoachingSessions).where(eq(interviewCoachingSessions.id, id));
    return session;
  }

  async getInterviewCoachingSessions(userId: string): Promise<InterviewCoachingSession[]> {
    return await db.select().from(interviewCoachingSessions).where(eq(interviewCoachingSessions.userId, userId)).orderBy(desc(interviewCoachingSessions.createdAt));
  }

  async updateInterviewCoachingSession(id: string, updates: Partial<InterviewCoachingSession>): Promise<InterviewCoachingSession | undefined> {
    const [updated] = await db
      .update(interviewCoachingSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interviewCoachingSessions.id, id))
      .returning();
    return updated;
  }

  async deleteInterviewCoachingSession(id: string): Promise<void> {
    await db.delete(interviewCoachingSessions).where(eq(interviewCoachingSessions.id, id));
  }

  // Interview question operations
  async createInterviewQuestion(question: InsertInterviewQuestion): Promise<InterviewQuestion> {
    const [created] = await db.insert(interviewQuestions).values(question).returning();
    return created;
  }

  async getInterviewQuestion(id: string): Promise<InterviewQuestion | undefined> {
    const [question] = await db.select().from(interviewQuestions).where(eq(interviewQuestions.id, id));
    return question;
  }

  async getInterviewQuestions(filters?: Partial<InterviewQuestion>): Promise<InterviewQuestion[]> {
    let query = db.select().from(interviewQuestions);
    
    if (filters?.category) {
      query = query.where(eq(interviewQuestions.category, filters.category));
    }
    if (filters?.difficulty) {
      query = query.where(eq(interviewQuestions.difficulty, filters.difficulty));
    }
    if (filters?.industry) {
      query = query.where(eq(interviewQuestions.industry, filters.industry));
    }
    if (filters?.companySpecific !== undefined) {
      query = query.where(eq(interviewQuestions.companySpecific, filters.companySpecific));
    }
    
    return await query.orderBy(desc(interviewQuestions.createdAt));
  }

  async updateInterviewQuestion(id: string, updates: Partial<InterviewQuestion>): Promise<InterviewQuestion | undefined> {
    const [updated] = await db
      .update(interviewQuestions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interviewQuestions.id, id))
      .returning();
    return updated;
  }

  async deleteInterviewQuestion(id: string): Promise<void> {
    await db.delete(interviewQuestions).where(eq(interviewQuestions.id, id));
  }

  // Interview response operations
  async createInterviewResponse(response: InsertInterviewResponse): Promise<InterviewResponse> {
    const [created] = await db.insert(interviewResponses).values(response).returning();
    return created;
  }

  async getInterviewResponse(id: string): Promise<InterviewResponse | undefined> {
    const [response] = await db.select().from(interviewResponses).where(eq(interviewResponses.id, id));
    return response;
  }

  async getInterviewResponses(sessionId: string): Promise<InterviewResponse[]> {
    return await db.select().from(interviewResponses).where(eq(interviewResponses.sessionId, sessionId)).orderBy(desc(interviewResponses.createdAt));
  }

  async updateInterviewResponse(id: string, updates: Partial<InterviewResponse>): Promise<InterviewResponse | undefined> {
    const [updated] = await db
      .update(interviewResponses)
      .set(updates)
      .where(eq(interviewResponses.id, id))
      .returning();
    return updated;
  }

  async deleteInterviewResponse(id: string): Promise<void> {
    await db.delete(interviewResponses).where(eq(interviewResponses.id, id));
  }

  // Interview feedback operations
  async createInterviewFeedback(feedback: InsertInterviewFeedback): Promise<InterviewFeedback> {
    const [created] = await db.insert(interviewFeedback).values(feedback).returning();
    return created;
  }

  async getInterviewFeedback(responseId: string): Promise<InterviewFeedback | undefined> {
    const [feedback] = await db.select().from(interviewFeedback).where(eq(interviewFeedback.responseId, responseId));
    return feedback;
  }

  async updateInterviewFeedback(id: string, updates: Partial<InterviewFeedback>): Promise<InterviewFeedback | undefined> {
    const [updated] = await db
      .update(interviewFeedback)
      .set(updates)
      .where(eq(interviewFeedback.id, id))
      .returning();
    return updated;
  }

  async deleteInterviewFeedback(id: string): Promise<void> {
    await db.delete(interviewFeedback).where(eq(interviewFeedback.id, id));
  }

  // Company interview insights operations
  async createCompanyInterviewInsights(insights: InsertCompanyInterviewInsights): Promise<CompanyInterviewInsights> {
    const [created] = await db.insert(companyInterviewInsights).values(insights).returning();
    return created;
  }

  async getCompanyInterviewInsights(companyId: string): Promise<CompanyInterviewInsights | undefined> {
    const [insights] = await db.select().from(companyInterviewInsights).where(eq(companyInterviewInsights.companyId, companyId));
    return insights;
  }

  async updateCompanyInterviewInsights(id: string, updates: Partial<CompanyInterviewInsights>): Promise<CompanyInterviewInsights | undefined> {
    const [updated] = await db
      .update(companyInterviewInsights)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companyInterviewInsights.id, id))
      .returning();
    return updated;
  }

  async deleteCompanyInterviewInsights(id: string): Promise<void> {
    await db.delete(companyInterviewInsights).where(eq(companyInterviewInsights.id, id));
  }

  // User interview progress operations
  async createUserInterviewProgress(progress: InsertUserInterviewProgress): Promise<UserInterviewProgress> {
    const [created] = await db.insert(userInterviewProgress).values(progress).returning();
    return created;
  }

  async getUserInterviewProgress(userId: string): Promise<UserInterviewProgress | undefined> {
    const [progress] = await db.select().from(userInterviewProgress).where(eq(userInterviewProgress.userId, userId));
    return progress;
  }

  async updateUserInterviewProgress(userId: string, updates: Partial<UserInterviewProgress>): Promise<UserInterviewProgress | undefined> {
    const [updated] = await db
      .update(userInterviewProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userInterviewProgress.userId, userId))
      .returning();
    return updated;
  }

  async deleteUserInterviewProgress(userId: string): Promise<void> {
    await db.delete(userInterviewProgress).where(eq(userInterviewProgress.userId, userId));
  }

  // Application tracking operations
  async createApplication(application: InsertApplication): Promise<Application> {
    const [created] = await db.insert(applications).values(application).returning();
    return created;
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplications(userId: string, filters?: any): Promise<Application[]> {
    let query = db.select().from(applications).where(eq(applications.userId, userId));
    
    if (filters) {
      if (filters.status) {
        query = query.where(eq(applications.status, filters.status));
      }
      if (filters.source) {
        query = query.where(eq(applications.source, filters.source));
      }
      if (filters.isArchived !== undefined) {
        query = query.where(eq(applications.isArchived, filters.isArchived));
      }
    }
    
    return await query.orderBy(desc(applications.createdAt));
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<Application | undefined> {
    const [updated] = await db
      .update(applications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updated;
  }

  async deleteApplication(id: string): Promise<void> {
    await db.delete(applications).where(eq(applications.id, id));
  }

  // Application timeline operations
  async createApplicationTimeline(timeline: InsertApplicationTimeline): Promise<ApplicationTimeline> {
    const [created] = await db.insert(applicationTimeline).values(timeline).returning();
    return created;
  }

  async getApplicationTimeline(applicationId: string): Promise<ApplicationTimeline[]> {
    return await db.select().from(applicationTimeline)
      .where(eq(applicationTimeline.applicationId, applicationId))
      .orderBy(desc(applicationTimeline.eventDate));
  }

  async deleteApplicationTimeline(id: string): Promise<void> {
    await db.delete(applicationTimeline).where(eq(applicationTimeline.id, id));
  }

  // Communication operations
  async createCommunication(communication: InsertCommunication): Promise<Communication> {
    const [created] = await db.insert(communications).values(communication).returning();
    return created;
  }

  async getCommunications(applicationId: string): Promise<Communication[]> {
    return await db.select().from(communications)
      .where(eq(communications.applicationId, applicationId))
      .orderBy(desc(communications.timestamp));
  }

  async updateCommunication(id: string, updates: Partial<Communication>): Promise<Communication | undefined> {
    const [updated] = await db
      .update(communications)
      .set(updates)
      .where(eq(communications.id, id))
      .returning();
    return updated;
  }

  async deleteCommunication(id: string): Promise<void> {
    await db.delete(communications).where(eq(communications.id, id));
  }

  // Follow-up operations
  async createFollowUp(followUp: InsertFollowUp): Promise<FollowUp> {
    const [created] = await db.insert(followUps).values(followUp).returning();
    return created;
  }

  async getFollowUps(applicationId: string): Promise<FollowUp[]> {
    return await db.select().from(followUps)
      .where(eq(followUps.applicationId, applicationId))
      .orderBy(desc(followUps.scheduledDate));
  }

  async getUpcomingFollowUps(userId: string): Promise<FollowUp[]> {
    return await db.select({
      id: followUps.id,
      applicationId: followUps.applicationId,
      followUpType: followUps.followUpType,
      scheduledDate: followUps.scheduledDate,
      messageTemplate: followUps.messageTemplate,
      sentStatus: followUps.sentStatus,
      positionTitle: applications.positionTitle,
      companyName: applications.companyName,
    })
    .from(followUps)
    .leftJoin(applications, eq(followUps.applicationId, applications.id))
    .where(and(
      eq(applications.userId, userId),
      eq(followUps.sentStatus, 'pending'),
      gte(followUps.scheduledDate, new Date())
    ))
    .orderBy(asc(followUps.scheduledDate));
  }

  async updateFollowUp(id: string, updates: Partial<FollowUp>): Promise<FollowUp | undefined> {
    const [updated] = await db
      .update(followUps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(followUps.id, id))
      .returning();
    return updated;
  }

  async deleteFollowUp(id: string): Promise<void> {
    await db.delete(followUps).where(eq(followUps.id, id));
  }

  // Outcome prediction operations
  async createOutcomePrediction(prediction: InsertOutcomePrediction): Promise<OutcomePrediction> {
    const [created] = await db.insert(outcomePredictions).values(prediction).returning();
    return created;
  }

  async getOutcomePrediction(applicationId: string): Promise<OutcomePrediction | undefined> {
    const [prediction] = await db.select().from(outcomePredictions)
      .where(eq(outcomePredictions.applicationId, applicationId))
      .orderBy(desc(outcomePredictions.lastUpdated));
    return prediction;
  }

  async updateOutcomePrediction(id: string, updates: Partial<OutcomePrediction>): Promise<OutcomePrediction | undefined> {
    const [updated] = await db
      .update(outcomePredictions)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(outcomePredictions.id, id))
      .returning();
    return updated;
  }

  async deleteOutcomePrediction(id: string): Promise<void> {
    await db.delete(outcomePredictions).where(eq(outcomePredictions.id, id));
  }

  // Email integration operations
  async createEmailIntegration(integration: InsertEmailIntegration): Promise<EmailIntegration> {
    const [created] = await db.insert(emailIntegrations).values(integration).returning();
    return created;
  }

  async getEmailIntegration(userId: string, provider: string): Promise<EmailIntegration | undefined> {
    const [integration] = await db.select().from(emailIntegrations)
      .where(and(
        eq(emailIntegrations.userId, userId),
        eq(emailIntegrations.provider, provider)
      ));
    return integration;
  }

  async getEmailIntegrations(userId: string): Promise<EmailIntegration[]> {
    return await db.select().from(emailIntegrations)
      .where(eq(emailIntegrations.userId, userId))
      .orderBy(desc(emailIntegrations.createdAt));
  }

  async updateEmailIntegration(id: string, updates: Partial<EmailIntegration>): Promise<EmailIntegration | undefined> {
    const [updated] = await db
      .update(emailIntegrations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailIntegrations.id, id))
      .returning();
    return updated;
  }

  async deleteEmailIntegration(id: string): Promise<void> {
    await db.delete(emailIntegrations).where(eq(emailIntegrations.id, id));
  }

  // Application analytics operations
  async createApplicationAnalytics(analytics: InsertApplicationAnalytics): Promise<ApplicationAnalytics> {
    const [created] = await db.insert(applicationAnalytics).values(analytics).returning();
    return created;
  }

  async getApplicationAnalytics(userId: string, periodType: string): Promise<ApplicationAnalytics | undefined> {
    const [analytics] = await db.select().from(applicationAnalytics)
      .where(and(
        eq(applicationAnalytics.userId, userId),
        eq(applicationAnalytics.periodType, periodType)
      ))
      .orderBy(desc(applicationAnalytics.createdAt));
    return analytics;
  }

  async getApplicationAnalyticsHistory(userId: string): Promise<ApplicationAnalytics[]> {
    return await db.select().from(applicationAnalytics)
      .where(eq(applicationAnalytics.userId, userId))
      .orderBy(desc(applicationAnalytics.createdAt));
  }

  async updateApplicationAnalytics(id: string, updates: Partial<ApplicationAnalytics>): Promise<ApplicationAnalytics | undefined> {
    const [updated] = await db
      .update(applicationAnalytics)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(applicationAnalytics.id, id))
      .returning();
    return updated;
  }

  async deleteApplicationAnalytics(id: string): Promise<void> {
    await db.delete(applicationAnalytics).where(eq(applicationAnalytics.id, id));
  }

  // Application tracking utility operations
  async getApplicationsWithTimeline(userId: string): Promise<any[]> {
    const userApplications = await db.select().from(applications)
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));

    const applicationsWithTimeline = await Promise.all(
      userApplications.map(async (app) => {
        const timeline = await this.getApplicationTimeline(app.id);
        return {
          ...app,
          timeline
        };
      })
    );

    return applicationsWithTimeline;
  }

  async getApplicationsWithCommunications(userId: string): Promise<any[]> {
    const userApplications = await db.select().from(applications)
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));

    const applicationsWithCommunications = await Promise.all(
      userApplications.map(async (app) => {
        const communications = await this.getCommunications(app.id);
        return {
          ...app,
          communications
        };
      })
    );

    return applicationsWithCommunications;
  }

  async getApplicationPortfolioStats(userId: string): Promise<any> {
    const userApplications = await this.getApplications(userId);
    
    const stats = {
      totalApplications: userApplications.length,
      byStatus: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      responseRate: 0,
      interviewRate: 0,
      offerRate: 0,
      averageResponseTime: 0,
      recentActivity: [] as any[],
    };

    // Calculate status and source distribution
    userApplications.forEach(app => {
      stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
      stats.bySource[app.source] = (stats.bySource[app.source] || 0) + 1;
    });

    // Calculate rates
    const responses = userApplications.filter(app => 
      ['screening', 'interview', 'offer', 'rejected'].includes(app.status)
    ).length;
    const interviews = userApplications.filter(app => 
      ['interview', 'offer'].includes(app.status)
    ).length;
    const offers = userApplications.filter(app => app.status === 'offer').length;

    stats.responseRate = userApplications.length > 0 ? (responses / userApplications.length) * 100 : 0;
    stats.interviewRate = userApplications.length > 0 ? (interviews / userApplications.length) * 100 : 0;
    stats.offerRate = userApplications.length > 0 ? (offers / userApplications.length) * 100 : 0;

    // Get recent activity (last 10 timeline events)
    const recentApplications = userApplications.slice(0, 10);
    for (const app of recentApplications) {
      const timeline = await this.getApplicationTimeline(app.id);
      stats.recentActivity.push(...timeline.slice(0, 2).map(event => ({
        ...event,
        applicationId: app.id,
        positionTitle: app.positionTitle,
        companyName: app.companyName
      })));
    }

    stats.recentActivity.sort((a, b) => 
      new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );
    stats.recentActivity = stats.recentActivity.slice(0, 10);

    return stats;
  }

  async syncEmailForApplications(userId: string, emailData: any[]): Promise<void> {
    // This would integrate with email APIs to sync application-related emails
    // For now, we'll create timeline entries for the email sync
    for (const email of emailData) {
      if (email.applicationId) {
        await this.createApplicationTimeline({
          applicationId: email.applicationId,
          eventType: email.type === 'sent' ? 'email_sent' : 'email_received',
          eventDate: new Date(email.timestamp),
          description: email.subject || 'Email communication',
          source: 'email',
          confidenceScore: email.confidenceScore || 90,
          metadata: {
            emailId: email.id,
            subject: email.subject,
            sender: email.sender,
            recipient: email.recipient
          }
        });
      }
    }
  }

  // Salary intelligence operations
  async createSalaryData(salaryDataInput: any): Promise<SalaryData> {
    const [created] = await db.insert(salaryData).values(salaryDataInput).returning();
    return created;
  }

  async getSalaryData(filters?: any): Promise<SalaryData[]> {
    let query = db.select().from(salaryData);
    
    if (filters?.jobTitle) {
      query = query.where(ilike(salaryData.jobTitle, `%${filters.jobTitle}%`));
    }
    
    if (filters?.location) {
      query = query.where(ilike(salaryData.location, `%${filters.location}%`));
    }
    
    if (filters?.industry) {
      query = query.where(eq(salaryData.industry, filters.industry));
    }
    
    return await query.orderBy(desc(salaryData.lastUpdated));
  }

  async updateSalaryData(id: string, updates: Partial<SalaryData>): Promise<SalaryData | undefined> {
    const [updated] = await db
      .update(salaryData)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(salaryData.id, id))
      .returning();
    return updated;
  }

  async deleteSalaryData(id: string): Promise<void> {
    await db.delete(salaryData).where(eq(salaryData.id, id));
  }

  // User negotiation operations
  async createUserNegotiation(negotiationInput: any): Promise<UserNegotiation> {
    const [created] = await db.insert(userNegotiations).values(negotiationInput).returning();
    return created;
  }

  async getUserNegotiation(id: string): Promise<UserNegotiation | undefined> {
    const [negotiation] = await db.select().from(userNegotiations).where(eq(userNegotiations.id, id));
    return negotiation;
  }

  async getUserNegotiations(userId: string): Promise<UserNegotiation[]> {
    return await db.select().from(userNegotiations).where(eq(userNegotiations.userId, userId)).orderBy(desc(userNegotiations.createdAt));
  }

  async updateUserNegotiation(id: string, updates: Partial<UserNegotiation>): Promise<UserNegotiation | undefined> {
    const [updated] = await db
      .update(userNegotiations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userNegotiations.id, id))
      .returning();
    return updated;
  }

  async deleteUserNegotiation(id: string): Promise<void> {
    await db.delete(userNegotiations).where(eq(userNegotiations.id, id));
  }

  // Company compensation operations
  async createCompanyCompensation(compensationInput: any): Promise<CompanyCompensation> {
    const [created] = await db.insert(companyCompensation).values(compensationInput).returning();
    return created;
  }

  async getCompanyCompensation(companyId: string): Promise<CompanyCompensation | undefined> {
    const [compensation] = await db.select().from(companyCompensation).where(eq(companyCompensation.companyId, companyId));
    return compensation;
  }

  async getCompanyCompensations(filters?: any): Promise<CompanyCompensation[]> {
    let query = db.select().from(companyCompensation);
    
    if (filters?.companyName) {
      query = query.where(ilike(companyCompensation.companyName, `%${filters.companyName}%`));
    }
    
    if (filters?.growthStage) {
      query = query.where(eq(companyCompensation.growthStage, filters.growthStage));
    }
    
    return await query.orderBy(desc(companyCompensation.lastUpdated));
  }

  async updateCompanyCompensation(id: string, updates: Partial<CompanyCompensation>): Promise<CompanyCompensation | undefined> {
    const [updated] = await db
      .update(companyCompensation)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(companyCompensation.id, id))
      .returning();
    return updated;
  }

  async deleteCompanyCompensation(id: string): Promise<void> {
    await db.delete(companyCompensation).where(eq(companyCompensation.id, id));
  }

  // Market trend operations
  async createMarketTrend(trendInput: any): Promise<MarketTrend> {
    const [created] = await db.insert(marketTrends).values(trendInput).returning();
    return created;
  }

  async getMarketTrend(id: string): Promise<MarketTrend | undefined> {
    const [trend] = await db.select().from(marketTrends).where(eq(marketTrends.id, id));
    return trend;
  }

  async getMarketTrends(filters?: any): Promise<MarketTrend[]> {
    let query = db.select().from(marketTrends);
    
    if (filters?.industry) {
      query = query.where(eq(marketTrends.industry, filters.industry));
    }
    
    if (filters?.location) {
      query = query.where(ilike(marketTrends.location, `%${filters.location}%`));
    }
    
    if (filters?.jobTitle) {
      query = query.where(ilike(marketTrends.jobTitle, `%${filters.jobTitle}%`));
    }
    
    return await query.orderBy(desc(marketTrends.updatedAt));
  }

  async updateMarketTrend(id: string, updates: Partial<MarketTrend>): Promise<MarketTrend | undefined> {
    const [updated] = await db
      .update(marketTrends)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(marketTrends.id, id))
      .returning();
    return updated;
  }

  async deleteMarketTrend(id: string): Promise<void> {
    await db.delete(marketTrends).where(eq(marketTrends.id, id));
  }

  // Negotiation session operations
  async createNegotiationSession(sessionInput: any): Promise<NegotiationSession> {
    const [created] = await db.insert(negotiationSessions).values(sessionInput).returning();
    return created;
  }

  async getNegotiationSession(id: string): Promise<NegotiationSession | undefined> {
    const [session] = await db.select().from(negotiationSessions).where(eq(negotiationSessions.id, id));
    return session;
  }

  async getNegotiationSessions(userId: string): Promise<NegotiationSession[]> {
    return await db.select().from(negotiationSessions).where(eq(negotiationSessions.userId, userId)).orderBy(desc(negotiationSessions.createdAt));
  }

  async updateNegotiationSession(id: string, updates: Partial<NegotiationSession>): Promise<NegotiationSession | undefined> {
    const [updated] = await db
      .update(negotiationSessions)
      .set(updates)
      .where(eq(negotiationSessions.id, id))
      .returning();
    return updated;
  }

  async deleteNegotiationSession(id: string): Promise<void> {
    await db.delete(negotiationSessions).where(eq(negotiationSessions.id, id));
  }

  // Salary benchmark operations
  async createSalaryBenchmark(benchmarkInput: any): Promise<SalaryBenchmark> {
    const [created] = await db.insert(salaryBenchmarks).values(benchmarkInput).returning();
    return created;
  }

  async getSalaryBenchmark(id: string): Promise<SalaryBenchmark | undefined> {
    const [benchmark] = await db.select().from(salaryBenchmarks).where(eq(salaryBenchmarks.id, id));
    return benchmark;
  }

  async getSalaryBenchmarks(userId: string): Promise<SalaryBenchmark[]> {
    return await db.select().from(salaryBenchmarks).where(eq(salaryBenchmarks.userId, userId)).orderBy(desc(salaryBenchmarks.lastUpdated));
  }

  async updateSalaryBenchmark(id: string, updates: Partial<SalaryBenchmark>): Promise<SalaryBenchmark | undefined> {
    const [updated] = await db
      .update(salaryBenchmarks)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(salaryBenchmarks.id, id))
      .returning();
    return updated;
  }

  async deleteSalaryBenchmark(id: string): Promise<void> {
    await db.delete(salaryBenchmarks).where(eq(salaryBenchmarks.id, id));
  }

  // Career coaching operations
  async createCareerProfile(profileInput: InsertCareerProfile): Promise<CareerProfile> {
    const [created] = await db.insert(careerProfiles).values(profileInput).returning();
    return created;
  }

  async getCareerProfile(userId: string): Promise<CareerProfile | undefined> {
    const [profile] = await db.select().from(careerProfiles).where(eq(careerProfiles.userId, userId));
    return profile;
  }

  async updateCareerProfile(userId: string, updates: Partial<CareerProfile>): Promise<CareerProfile | undefined> {
    const [updated] = await db
      .update(careerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(careerProfiles.userId, userId))
      .returning();
    return updated;
  }

  async deleteCareerProfile(userId: string): Promise<void> {
    await db.delete(careerProfiles).where(eq(careerProfiles.userId, userId));
  }

  // Skill assessment operations
  async createSkillAssessment(assessmentInput: InsertSkillAssessment): Promise<SkillAssessment> {
    const [created] = await db.insert(skillAssessments).values(assessmentInput).returning();
    return created;
  }

  async getSkillAssessment(id: string): Promise<SkillAssessment | undefined> {
    const [assessment] = await db.select().from(skillAssessments).where(eq(skillAssessments.id, id));
    return assessment;
  }

  async getUserSkillAssessments(userId: string): Promise<SkillAssessment[]> {
    return await db.select().from(skillAssessments).where(eq(skillAssessments.userId, userId)).orderBy(desc(skillAssessments.lastAssessed));
  }

  async updateSkillAssessment(id: string, updates: Partial<SkillAssessment>): Promise<SkillAssessment | undefined> {
    const [updated] = await db
      .update(skillAssessments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(skillAssessments.id, id))
      .returning();
    return updated;
  }

  async deleteSkillAssessment(id: string): Promise<void> {
    await db.delete(skillAssessments).where(eq(skillAssessments.id, id));
  }

  // Career goal operations
  async createCareerGoal(goalInput: InsertCareerGoal): Promise<CareerGoal> {
    const [created] = await db.insert(careerGoals).values(goalInput).returning();
    return created;
  }

  async getCareerGoal(id: string): Promise<CareerGoal | undefined> {
    const [goal] = await db.select().from(careerGoals).where(eq(careerGoals.id, id));
    return goal;
  }

  async getUserCareerGoals(userId: string): Promise<CareerGoal[]> {
    return await db.select().from(careerGoals).where(eq(careerGoals.userId, userId)).orderBy(desc(careerGoals.createdAt));
  }

  async updateCareerGoal(id: string, updates: Partial<CareerGoal>): Promise<CareerGoal | undefined> {
    const [updated] = await db
      .update(careerGoals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(careerGoals.id, id))
      .returning();
    return updated;
  }

  async deleteCareerGoal(id: string): Promise<void> {
    await db.delete(careerGoals).where(eq(careerGoals.id, id));
  }

  // Learning plan operations
  async createLearningPlan(planInput: InsertLearningPlan): Promise<LearningPlan> {
    const [created] = await db.insert(learningPlans).values(planInput).returning();
    return created;
  }

  async getLearningPlan(id: string): Promise<LearningPlan | undefined> {
    const [plan] = await db.select().from(learningPlans).where(eq(learningPlans.id, id));
    return plan;
  }

  async getUserLearningPlans(userId: string): Promise<LearningPlan[]> {
    return await db.select().from(learningPlans).where(eq(learningPlans.userId, userId)).orderBy(desc(learningPlans.createdAt));
  }

  async updateLearningPlan(id: string, updates: Partial<LearningPlan>): Promise<LearningPlan | undefined> {
    const [updated] = await db
      .update(learningPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(learningPlans.id, id))
      .returning();
    return updated;
  }

  async deleteLearningPlan(id: string): Promise<void> {
    await db.delete(learningPlans).where(eq(learningPlans.id, id));
  }

  // Mentorship operations
  async createMentorshipMatch(matchInput: InsertMentorshipMatch): Promise<MentorshipMatch> {
    const [created] = await db.insert(mentorshipMatches).values(matchInput).returning();
    return created;
  }

  async getMentorshipMatch(id: string): Promise<MentorshipMatch | undefined> {
    const [match] = await db.select().from(mentorshipMatches).where(eq(mentorshipMatches.id, id));
    return match;
  }

  async getUserMentorshipMatches(userId: string): Promise<MentorshipMatch[]> {
    return await db.select().from(mentorshipMatches).where(
      or(
        eq(mentorshipMatches.mentorId, userId),
        eq(mentorshipMatches.menteeId, userId)
      )
    ).orderBy(desc(mentorshipMatches.createdAt));
  }

  async updateMentorshipMatch(id: string, updates: Partial<MentorshipMatch>): Promise<MentorshipMatch | undefined> {
    const [updated] = await db
      .update(mentorshipMatches)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(mentorshipMatches.id, id))
      .returning();
    return updated;
  }

  async deleteMentorshipMatch(id: string): Promise<void> {
    await db.delete(mentorshipMatches).where(eq(mentorshipMatches.id, id));
  }

  // Industry insights operations
  async createIndustryInsight(insightInput: InsertIndustryInsight): Promise<IndustryInsight> {
    const [created] = await db.insert(industryInsights).values(insightInput).returning();
    return created;
  }

  async getIndustryInsight(id: string): Promise<IndustryInsight | undefined> {
    const [insight] = await db.select().from(industryInsights).where(eq(industryInsights.id, id));
    return insight;
  }

  async getIndustryInsights(industry?: string, region?: string): Promise<IndustryInsight[]> {
    let query = db.select().from(industryInsights);

    if (industry) {
      query = query.where(eq(industryInsights.industry, industry));
    }

    if (region) {
      query = query.where(eq(industryInsights.region, region));
    }

    return await query.orderBy(desc(industryInsights.createdAt));
  }

  async updateIndustryInsight(id: string, updates: Partial<IndustryInsight>): Promise<IndustryInsight | undefined> {
    const [updated] = await db
      .update(industryInsights)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(industryInsights.id, id))
      .returning();
    return updated;
  }

  async deleteIndustryInsight(id: string): Promise<void> {
    await db.delete(industryInsights).where(eq(industryInsights.id, id));
  }

  // Networking events operations
  async createNetworkingEvent(eventInput: InsertNetworkingEvent): Promise<NetworkingEvent> {
    const [created] = await db.insert(networkingEvents).values(eventInput).returning();
    return created;
  }

  async getNetworkingEvent(id: string): Promise<NetworkingEvent | undefined> {
    const [event] = await db.select().from(networkingEvents).where(eq(networkingEvents.id, id));
    return event;
  }

  async getNetworkingEvents(industry?: string, location?: string, eventType?: string): Promise<NetworkingEvent[]> {
    let query = db.select().from(networkingEvents);

    if (industry) {
      query = query.where(eq(networkingEvents.industry, industry));
    }

    if (location) {
      query = query.where(ilike(networkingEvents.location, `%${location}%`));
    }

    if (eventType) {
      query = query.where(eq(networkingEvents.eventType, eventType));
    }

    return await query.orderBy(desc(networkingEvents.eventDate));
  }

  async updateNetworkingEvent(id: string, updates: Partial<NetworkingEvent>): Promise<NetworkingEvent | undefined> {
    const [updated] = await db
      .update(networkingEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(networkingEvents.id, id))
      .returning();
    return updated;
  }

  async deleteNetworkingEvent(id: string): Promise<void> {
    await db.delete(networkingEvents).where(eq(networkingEvents.id, id));
  }

  // Career progress operations
  async recordCareerProgress(progressInput: InsertCareerProgress): Promise<CareerProgress> {
    const [created] = await db.insert(careerProgress).values(progressInput).returning();
    return created;
  }

  async getCareerProgress(id: string): Promise<CareerProgress | undefined> {
    const [progress] = await db.select().from(careerProgress).where(eq(careerProgress.id, id));
    return progress;
  }

  async getUserCareerProgress(userId: string): Promise<CareerProgress[]> {
    return await db.select().from(careerProgress).where(eq(careerProgress.userId, userId)).orderBy(desc(careerProgress.createdAt));
  }

  async updateCareerProgress(id: string, updates: Partial<CareerProgress>): Promise<CareerProgress | undefined> {
    const [updated] = await db
      .update(careerProgress)
      .set(updates)
      .where(eq(careerProgress.id, id))
      .returning();
    return updated;
  }

  async deleteCareerProgress(id: string): Promise<void> {
    await db.delete(careerProgress).where(eq(careerProgress.id, id));
  }

  // Personal branding operations
  async createPersonalBranding(brandingInput: InsertPersonalBranding): Promise<PersonalBranding> {
    const [created] = await db.insert(personalBranding).values(brandingInput).returning();
    return created;
  }

  async getPersonalBranding(userId: string): Promise<PersonalBranding | undefined> {
    const [branding] = await db.select().from(personalBranding).where(eq(personalBranding.userId, userId));
    return branding;
  }

  async updatePersonalBranding(userId: string, updates: Partial<PersonalBranding>): Promise<PersonalBranding | undefined> {
    const [updated] = await db
      .update(personalBranding)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(personalBranding.userId, userId))
      .returning();
    return updated;
  }

  async deletePersonalBranding(userId: string): Promise<void> {
    await db.delete(personalBranding).where(eq(personalBranding.userId, userId));
  }

  // AI-powered career coaching operations
  async generateCareerAdvice(context: any): Promise<any> {
    // This would integrate with AI services to generate personalized career advice
    // For now, return a structured response
    return {
      advice: "Based on your profile and goals, I recommend focusing on developing your technical skills in cloud computing and data analysis. Consider taking online courses and building projects to demonstrate your capabilities.",
      actionItems: [
        "Complete AWS certification",
        "Build a data visualization project",
        "Network with professionals in your target industry",
        "Update your LinkedIn profile with recent achievements"
      ],
      resources: [
        {
          title: "AWS Cloud Practitioner Certification",
          url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
          type: "certification"
        },
        {
          title: "Data Analysis with Python",
          url: "https://www.coursera.org/learn/data-analysis-with-python",
          type: "course"
        }
      ]
    };
  }

  async analyzeCareerPath(userId: string, analysis: any): Promise<any> {
    // This would use AI to analyze career path options
    return {
      currentPosition: analysis.currentProfile?.currentRole || "Not specified",
      targetPosition: analysis.targetRole,
      careerGap: "2-3 years with focused skill development",
      requiredSkills: ["Cloud Computing", "Data Analysis", "Project Management"],
      recommendations: [
        "Focus on cloud certifications",
        "Gain experience with data visualization tools",
        "Develop leadership skills through project management"
      ],
      similarPaths: [
        {
          role: "Senior Data Analyst",
          company: "Tech Company",
          timeframe: "18 months",
          requirements: ["Python", "SQL", "Tableau"]
        }
      ]
    };
  }

  async analyzeSkillGaps(userId: string, analysis: any): Promise<any> {
    // This would analyze skill gaps using AI
    return {
      criticalGaps: [
        {
          skill: "Cloud Computing",
          currentLevel: 3,
          requiredLevel: 7,
          priority: "high",
          timeToAcquire: "6 months"
        },
        {
          skill: "Data Visualization",
          currentLevel: 4,
          requiredLevel: 8,
          priority: "high",
          timeToAcquire: "4 months"
        }
      ],
      developmentPlan: [
        {
          phase: "Phase 1 (Months 1-3)",
          focus: "Cloud Computing Fundamentals",
          activities: ["AWS Certification", "Hands-on projects"]
        },
        {
          phase: "Phase 2 (Months 4-6)",
          focus: "Data Visualization",
          activities: ["Tableau certification", "Build portfolio projects"]
        }
      ]
    };
  }

  async getLearningRecommendations(userId: string, preferences: any): Promise<any> {
    // This would provide personalized learning recommendations
    return {
      recommendations: [
        {
          title: "AWS Solutions Architect",
          provider: "AWS",
          duration: "40 hours",
          difficulty: "intermediate",
          relevance: 95,
          cost: "$150"
        },
        {
          title: "Data Visualization with Tableau",
          provider: "Coursera",
          duration: "25 hours",
          difficulty: "beginner",
          relevance: 90,
          cost: "$49/month"
        }
      ],
      learningPath: [
        {
          step: 1,
          title: "Foundation Building",
          courses: ["Cloud Computing Basics", "Data Analysis Fundamentals"]
        },
        {
          step: 2,
          title: "Skill Development",
          courses: ["AWS Certification", "Tableau Visualization"]
        }
      ]
    };
  }

  // Job Alerts and Opportunity Intelligence operations
  async createAlertProfile(alertProfileInput: InsertAlertProfile): Promise<AlertProfile> {
    const [created] = await db.insert(alertProfiles).values(alertProfileInput).returning();
    return created;
  }

  async getAlertProfile(id: string): Promise<AlertProfile | undefined> {
    const [profile] = await db.select().from(alertProfiles).where(eq(alertProfiles.id, id));
    return profile;
  }

  async getAlertProfiles(userId: string): Promise<AlertProfile[]> {
    return await db.select().from(alertProfiles).where(eq(alertProfiles.userId, userId)).orderBy(desc(alertProfiles.createdAt));
  }

  async updateAlertProfile(id: string, updates: Partial<AlertProfile>): Promise<AlertProfile | undefined> {
    const [updated] = await db
      .update(alertProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alertProfiles.id, id))
      .returning();
    return updated;
  }

  async deleteAlertProfile(id: string): Promise<void> {
    await db.delete(alertProfiles).where(eq(alertProfiles.id, id));
  }

  // Opportunity prediction operations
  async createOpportunityPrediction(predictionInput: InsertOpportunityPrediction): Promise<OpportunityPrediction> {
    const [created] = await db.insert(opportunityPredictions).values(predictionInput).returning();
    return created;
  }

  async getOpportunityPrediction(id: string): Promise<OpportunityPrediction | undefined> {
    const [prediction] = await db.select().from(opportunityPredictions).where(eq(opportunityPredictions.id, id));
    return prediction;
  }

  async getOpportunityPredictions(filters: any = {}): Promise<OpportunityPrediction[]> {
    let query = db.select().from(opportunityPredictions);

    if (filters.companyId) {
      query = query.where(eq(opportunityPredictions.companyId, filters.companyId));
    }

    if (filters.minConfidence) {
      query = query.where(gte(opportunityPredictions.confidenceScore, filters.minConfidence));
    }

    return await query.orderBy(desc(opportunityPredictions.confidenceScore));
  }

  async updateOpportunityPrediction(id: string, updates: Partial<OpportunityPrediction>): Promise<OpportunityPrediction | undefined> {
    const [updated] = await db
      .update(opportunityPredictions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(opportunityPredictions.id, id))
      .returning();
    return updated;
  }

  async deleteOpportunityPrediction(id: string): Promise<void> {
    await db.delete(opportunityPredictions).where(eq(opportunityPredictions.id, id));
  }

  // Alert delivery operations
  async createAlertDelivery(deliveryInput: InsertAlertDelivery): Promise<AlertDelivery> {
    const [created] = await db.insert(alertDeliveries).values(deliveryInput).returning();
    return created;
  }

  async getAlertDelivery(id: string): Promise<AlertDelivery | undefined> {
    const [delivery] = await db.select().from(alertDeliveries).where(eq(alertDeliveries.id, id));
    return delivery;
  }

  async getAlertDeliveries(alertId: string): Promise<AlertDelivery[]> {
    return await db.select().from(alertDeliveries).where(eq(alertDeliveries.alertId, alertId)).orderBy(desc(alertDeliveries.sentAt));
  }

  async getUserAlertDeliveries(userId: string): Promise<AlertDelivery[]> {
    return await db.select().from(alertDeliveries).where(eq(alertDeliveries.userId, userId)).orderBy(desc(alertDeliveries.sentAt));
  }

  async updateAlertDelivery(id: string, updates: Partial<AlertDelivery>): Promise<AlertDelivery | undefined> {
    const [updated] = await db
      .update(alertDeliveries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alertDeliveries.id, id))
      .returning();
    return updated;
  }

  async deleteAlertDelivery(id: string): Promise<void> {
    await db.delete(alertDeliveries).where(eq(alertDeliveries.id, id));
  }

  // Market signal operations
  async createMarketSignal(signalInput: InsertMarketSignal): Promise<MarketSignal> {
    const [created] = await db.insert(marketSignals).values(signalInput).returning();
    return created;
  }

  async getMarketSignal(id: string): Promise<MarketSignal | undefined> {
    const [signal] = await db.select().from(marketSignals).where(eq(marketSignals.id, id));
    return signal;
  }

  async getMarketSignals(filters: any = {}): Promise<MarketSignal[]> {
    let query = db.select().from(marketSignals);

    if (filters.signalType) {
      query = query.where(eq(marketSignals.signalType, filters.signalType));
    }

    if (filters.companyId) {
      query = query.where(eq(marketSignals.companyId, filters.companyId));
    }

    return await query.orderBy(desc(marketSignals.detectionDate));
  }

  async updateMarketSignal(id: string, updates: Partial<MarketSignal>): Promise<MarketSignal | undefined> {
    const [updated] = await db
      .update(marketSignals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(marketSignals.id, id))
      .returning();
    return updated;
  }

  async deleteMarketSignal(id: string): Promise<void> {
    await db.delete(marketSignals).where(eq(marketSignals.id, id));
  }

  // Alert user preferences operations
  async createAlertUserPreferences(preferencesInput: InsertAlertUserPreferences): Promise<AlertUserPreferences> {
    const [created] = await db.insert(alertUserPreferences).values(preferencesInput).returning();
    return created;
  }

  async getAlertUserPreferences(userId: string): Promise<AlertUserPreferences | undefined> {
    const [preferences] = await db.select().from(alertUserPreferences).where(eq(alertUserPreferences.userId, userId));
    return preferences;
  }

  async updateAlertUserPreferences(userId: string, updates: Partial<AlertUserPreferences>): Promise<AlertUserPreferences | undefined> {
    const [updated] = await db
      .update(alertUserPreferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alertUserPreferences.userId, userId))
      .returning();
    return updated;
  }

  async deleteAlertUserPreferences(userId: string): Promise<void> {
    await db.delete(alertUserPreferences).where(eq(alertUserPreferences.userId, userId));
  }

  // Alert analytics operations
  async createAlertAnalytics(analyticsInput: InsertAlertAnalytics): Promise<AlertAnalytics> {
    const [created] = await db.insert(alertAnalytics).values(analyticsInput).returning();
    return created;
  }

  async getAlertAnalytics(alertId: string): Promise<AlertAnalytics | undefined> {
    const [analytics] = await db.select().from(alertAnalytics).where(eq(alertAnalytics.alertId, alertId));
    return analytics;
  }

  async getUserAlertAnalytics(userId: string): Promise<AlertAnalytics[]> {
    return await db.select().from(alertAnalytics).where(eq(alertAnalytics.userId, userId)).orderBy(desc(alertAnalytics.createdAt));
  }

  async updateAlertAnalytics(id: string, updates: Partial<AlertAnalytics>): Promise<AlertAnalytics | undefined> {
    const [updated] = await db
      .update(alertAnalytics)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(alertAnalytics.id, id))
      .returning();
    return updated;
  }

  async deleteAlertAnalytics(id: string): Promise<void> {
    await db.delete(alertAnalytics).where(eq(alertAnalytics.id, id));
  }

  // Company intelligence operations
  async createCompanyIntelligence(intelligenceInput: InsertCompanyIntelligence): Promise<CompanyIntelligence> {
    const [created] = await db.insert(companyIntelligence).values(intelligenceInput).returning();
    return created;
  }

  async getCompanyIntelligence(companyId: string): Promise<CompanyIntelligence | undefined> {
    const [intelligence] = await db.select().from(companyIntelligence).where(eq(companyIntelligence.companyId, companyId));
    return intelligence;
  }

  async getCompanyIntelligences(filters: any = {}): Promise<CompanyIntelligence[]> {
    let query = db.select().from(companyIntelligence);

    if (filters.industry) {
      query = query.where(eq(companyIntelligence.industry, filters.industry));
    }

    if (filters.size) {
      query = query.where(eq(companyIntelligence.size, filters.size));
    }

    return await query.orderBy(desc(companyIntelligence.lastUpdated));
  }

  async updateCompanyIntelligence(id: string, updates: Partial<CompanyIntelligence>): Promise<CompanyIntelligence | undefined> {
    const [updated] = await db
      .update(companyIntelligence)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companyIntelligence.id, id))
      .returning();
    return updated;
  }

  async deleteCompanyIntelligence(id: string): Promise<void> {
    await db.delete(companyIntelligence).where(eq(companyIntelligence.id, id));
  }

  // Job alerts utility operations
  async processJobAlerts(userId: string): Promise<any> {
    // This would process job alerts for a specific user
    const alertProfiles = await this.getAlertProfiles(userId);
    const results = [];

    for (const profile of alertProfiles) {
      if (profile.isActive) {
        // Process each active alert
        const opportunities = await this.getOpportunityPredictions({
          companyId: profile.criteriaJson?.companyId
        });
        
        results.push({
          alertId: profile.id,
          opportunitiesFound: opportunities.length,
          lastProcessed: new Date()
        });
      }
    }

    return results;
  }

  async generateOpportunityPredictions(companyId: string): Promise<any> {
    // This would generate opportunity predictions for a specific company
    return {
      companyId,
      predictions: [
        {
          role: 'Software Engineer',
          confidence: 0.8,
          timeframe: '1-2 weeks',
          signals: ['team_expansion', 'funding_round']
        }
      ],
      generatedAt: new Date()
    };
  }

  async processMarketSignals(signalType: string): Promise<any> {
    // This would process market signals of a specific type
    const signals = await this.getMarketSignals({ signalType });
    
    return {
      signalType,
      processedSignals: signals.length,
      highImpactSignals: signals.filter(s => s.impactScore >= 0.8).length,
      processedAt: new Date()
    };
  }

  async getAlertDashboard(userId: string): Promise<any> {
    // This would return dashboard data for a user
    const [alertProfiles, opportunities, preferences, analytics] = await Promise.all([
      this.getAlertProfiles(userId),
      this.getOpportunityPredictions({}),
      this.getAlertUserPreferences(userId),
      this.getUserAlertAnalytics(userId)
    ]);

    return {
      alertProfiles,
      opportunities,
      preferences,
      analytics,
      summary: {
        totalAlerts: alertProfiles.length,
        activeAlerts: alertProfiles.filter(a => a.isActive).length,
        totalOpportunities: opportunities.length,
        highConfidenceOpportunities: opportunities.filter(o => o.confidenceScore >= 0.8).length
      }
    };
  }
}

export const storage = new DatabaseStorage();
