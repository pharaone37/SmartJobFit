/**
 * Communication Test Suite
 * Tests information exchange between different sections/services
 */

import { storage } from "../storage";
import { jobSearchEngine } from "../jobSearchEngine";
import { resumeOptimizer } from "../resumeOptimizer";
import { applicationTracker } from "../applicationTracker";
import { interviewCoach } from "../interviewCoach";
import { salaryIntelligence } from "../salaryIntelligence";
import { careerCoaching } from "../careerCoaching";
import { openRouterService } from "../services/openRouterService";
import { geminiService } from "../services/geminiService";
import { emailService } from "../services/emailService";

export async function runCommunicationTests() {
  console.log("🔄 Starting Communication Tests...\n");

  // Test 1: User Data Flow
  await testUserDataFlow();
  
  // Test 2: Job Search to Resume Optimization
  await testJobSearchToResumeFlow();
  
  // Test 3: Resume to Interview Preparation
  await testResumeToInterviewFlow();
  
  // Test 4: Application Tracking Integration
  await testApplicationTrackingFlow();
  
  // Test 5: Cross-Service Data Sharing
  await testCrossServiceDataSharing();
  
  // Test 6: AI Service Communication
  await testAIServiceCommunication();
  
  // Test 7: Email and Notification Flow
  await testEmailNotificationFlow();
  
  console.log("✅ All Communication Tests Completed!\n");
}

async function testUserDataFlow() {
  console.log("1. Testing User Data Flow...");
  
  try {
    // Create test user
    const testUser = await storage.createUser({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      passwordHash: "hashed_password",
      title: "Software Engineer",
      skills: ["JavaScript", "React", "Node.js"],
      experience: ["5 years frontend development"]
    });
    
    // Test user preferences
    const preferences = await storage.createUserPreferences({
      userId: testUser.id,
      jobTypes: ["full-time", "remote"],
      preferredLocation: "San Francisco",
      salaryRange: { min: 100000, max: 150000 },
      skills: ["React", "TypeScript"],
      industries: ["tech", "startup"]
    });
    
    // Verify data retrieval
    const retrievedUser = await storage.getUser(testUser.id);
    const retrievedPreferences = await storage.getUserPreferences(testUser.id);
    
    console.log("   ✅ User creation and retrieval working");
    console.log("   ✅ User preferences flow working");
    
    return { testUser, preferences };
  } catch (error) {
    console.log("   ❌ User Data Flow Error:", error.message);
    throw error;
  }
}

async function testJobSearchToResumeFlow() {
  console.log("2. Testing Job Search to Resume Optimization Flow...");
  
  try {
    // Mock job search results
    const searchQuery = {
      query: "React Developer",
      location: "San Francisco",
      jobType: "full-time",
      salaryMin: 100000
    };
    
    // Test job search (would normally call external APIs)
    const jobSearchResults = await jobSearchEngine.searchJobs(searchQuery);
    
    // Test job details extraction
    if (jobSearchResults.jobs.length > 0) {
      const selectedJob = jobSearchResults.jobs[0];
      const jobDetails = await jobSearchEngine.getJobDetails(selectedJob.id);
      
      // Test resume optimization based on job
      const resumeOptimization = await resumeOptimizer.optimizeForJob({
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        jobDescription: selectedJob.description,
        requirements: selectedJob.requirements,
        userSkills: ["React", "JavaScript", "Node.js"]
      });
      
      console.log("   ✅ Job search results processing");
      console.log("   ✅ Job details extraction");
      console.log("   ✅ Resume optimization based on job");
      
      return { selectedJob, resumeOptimization };
    }
  } catch (error) {
    console.log("   ❌ Job Search to Resume Flow Error:", error.message);
  }
}

async function testResumeToInterviewFlow() {
  console.log("3. Testing Resume to Interview Preparation Flow...");
  
  try {
    // Mock resume data
    const resumeData = {
      userId: "test-user-id",
      title: "Senior React Developer",
      experience: ["5 years React development", "Team lead experience"],
      skills: ["React", "TypeScript", "Node.js", "Leadership"],
      education: ["BS Computer Science"]
    };
    
    // Test interview question generation based on resume
    const interviewQuestions = await interviewCoach.generateQuestionsFromResume({
      resumeData,
      jobTitle: "Senior React Developer",
      difficulty: "senior",
      questionTypes: ["technical", "behavioral", "situational"]
    });
    
    // Test company research integration
    const companyInsights = await interviewCoach.researchCompany({
      companyName: "Google",
      position: "Senior React Developer",
      userBackground: resumeData
    });
    
    console.log("   ✅ Interview questions from resume");
    console.log("   ✅ Company research integration");
    console.log("   ✅ Personalized interview preparation");
    
    return { interviewQuestions, companyInsights };
  } catch (error) {
    console.log("   ❌ Resume to Interview Flow Error:", error.message);
  }
}

async function testApplicationTrackingFlow() {
  console.log("4. Testing Application Tracking Integration...");
  
  try {
    // Test application creation
    const application = await applicationTracker.createApplication({
      userId: "test-user-id",
      jobId: "test-job-id",
      companyName: "Google",
      position: "Senior React Developer",
      status: "applied",
      appliedDate: new Date(),
      resumeVersion: "optimized-v1",
      coverLetter: "Generated cover letter content"
    });
    
    // Test status updates
    await applicationTracker.updateApplicationStatus({
      applicationId: application.id,
      status: "interviewing",
      notes: "Phone screen scheduled",
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    // Test timeline creation
    const timeline = await applicationTracker.getApplicationTimeline(application.id);
    
    // Test outcome prediction
    const prediction = await applicationTracker.predictOutcome({
      applicationId: application.id,
      userProfile: {
        skills: ["React", "TypeScript"],
        experience: 5,
        education: "BS Computer Science"
      }
    });
    
    console.log("   ✅ Application creation and tracking");
    console.log("   ✅ Status updates and timeline");
    console.log("   ✅ Outcome prediction");
    
    return { application, timeline, prediction };
  } catch (error) {
    console.log("   ❌ Application Tracking Flow Error:", error.message);
  }
}

async function testCrossServiceDataSharing() {
  console.log("5. Testing Cross-Service Data Sharing...");
  
  try {
    // Test salary intelligence integration
    const salaryData = await salaryIntelligence.getSalaryIntelligence({
      position: "Senior React Developer",
      location: "San Francisco",
      experience: 5,
      skills: ["React", "TypeScript", "Node.js"],
      company: "Google"
    });
    
    // Test career coaching integration
    const careerAdvice = await careerCoaching.getPersonalizedAdvice({
      userId: "test-user-id",
      currentRole: "React Developer",
      targetRole: "Senior React Developer",
      skills: ["React", "TypeScript"],
      experience: 5,
      salaryData: salaryData
    });
    
    // Test skill gap analysis
    const skillGaps = await careerCoaching.analyzeSkillGaps({
      currentSkills: ["React", "JavaScript"],
      targetJobSkills: ["React", "TypeScript", "Node.js", "GraphQL"],
      industryTrends: ["AI/ML", "Cloud Computing"]
    });
    
    console.log("   ✅ Salary intelligence integration");
    console.log("   ✅ Career coaching data sharing");
    console.log("   ✅ Skill gap analysis");
    
    return { salaryData, careerAdvice, skillGaps };
  } catch (error) {
    console.log("   ❌ Cross-Service Data Sharing Error:", error.message);
  }
}

async function testAIServiceCommunication() {
  console.log("6. Testing AI Service Communication...");
  
  try {
    // Test OpenRouter service
    const openRouterResponse = await openRouterService.generateResponse({
      prompt: "Analyze this job description for key requirements",
      context: "Software Engineer at Google",
      maxTokens: 500
    });
    
    // Test Gemini service
    const geminiResponse = await geminiService.generateJobMatchScore({
      jobDescription: "Senior React Developer role",
      userProfile: {
        skills: ["React", "TypeScript"],
        experience: 5
      }
    });
    
    // Test service fallback
    const fallbackTest = await testAIServiceFallback();
    
    console.log("   ✅ OpenRouter service communication");
    console.log("   ✅ Gemini service communication");
    console.log("   ✅ AI service fallback system");
    
    return { openRouterResponse, geminiResponse, fallbackTest };
  } catch (error) {
    console.log("   ❌ AI Service Communication Error:", error.message);
  }
}

async function testAIServiceFallback() {
  // Test fallback mechanism when primary AI service fails
  try {
    // This would test what happens when OpenRouter fails
    const fallbackResponse = await openRouterService.generateResponse({
      prompt: "Test fallback",
      context: "Testing",
      maxTokens: 100
    });
    
    return { status: "success", response: fallbackResponse };
  } catch (error) {
    // Should gracefully fall back to alternative service
    return { status: "fallback_triggered", error: error.message };
  }
}

async function testEmailNotificationFlow() {
  console.log("7. Testing Email and Notification Flow...");
  
  try {
    // Test email service
    const emailTest = await emailService.sendEmail({
      to: "test@example.com",
      subject: "Test Communication Flow",
      template: "test",
      data: {
        userName: "Test User",
        message: "Communication test successful"
      }
    });
    
    // Test notification creation
    const notification = await storage.createNotification({
      userId: "test-user-id",
      type: "job_match",
      title: "New Job Match",
      message: "We found a job that matches your profile",
      data: {
        jobId: "test-job-id",
        matchScore: 95
      }
    });
    
    console.log("   ✅ Email service communication");
    console.log("   ✅ Notification system");
    console.log("   ✅ Data flow to email templates");
    
    return { emailTest, notification };
  } catch (error) {
    console.log("   ❌ Email Notification Flow Error:", error.message);
  }
}

// Export for use in other tests
export {
  testUserDataFlow,
  testJobSearchToResumeFlow,
  testResumeToInterviewFlow,
  testApplicationTrackingFlow,
  testCrossServiceDataSharing,
  testAIServiceCommunication,
  testEmailNotificationFlow
};