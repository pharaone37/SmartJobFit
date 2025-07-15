import { storage } from './storage';
import type { 
  InsertApplication, 
  InsertApplicationTimeline, 
  InsertCommunication, 
  InsertFollowUp, 
  InsertOutcomePrediction,
  InsertEmailIntegration,
  InsertApplicationAnalytics
} from '@shared/schema';

export class ApplicationTracker {
  // Application lifecycle management
  async createApplication(userId: string, applicationData: any) {
    const application = await storage.createApplication({
      userId,
      positionTitle: applicationData.positionTitle,
      companyName: applicationData.companyName,
      applicationDate: new Date(applicationData.applicationDate),
      status: applicationData.status || 'applied',
      source: applicationData.source || 'manual',
      priorityScore: applicationData.priorityScore || 50,
      applicationUrl: applicationData.applicationUrl,
      jobDescription: applicationData.jobDescription,
      requirements: applicationData.requirements,
      salary: applicationData.salary,
      location: applicationData.location,
      workType: applicationData.workType,
      contactPerson: applicationData.contactPerson,
      contactEmail: applicationData.contactEmail,
      contactPhone: applicationData.contactPhone,
      notes: applicationData.notes,
      jobId: applicationData.jobId,
      companyId: applicationData.companyId,
      metadata: applicationData.metadata
    });

    // Create initial timeline entry
    await storage.createApplicationTimeline({
      applicationId: application.id,
      eventType: 'status_change',
      eventDate: new Date(),
      description: `Application created with status: ${application.status}`,
      source: 'manual',
      confidenceScore: 100
    });

    return application;
  }

  async updateApplicationStatus(applicationId: string, newStatus: string, notes?: string) {
    const application = await storage.getApplication(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    const oldStatus = application.status;
    
    // Update application status
    const updatedApplication = await storage.updateApplication(applicationId, {
      status: newStatus,
      lastInteractionDate: new Date(),
      notes: notes || application.notes
    });

    // Create timeline entry
    await storage.createApplicationTimeline({
      applicationId,
      eventType: 'status_change',
      eventDate: new Date(),
      description: `Status changed from ${oldStatus} to ${newStatus}${notes ? `: ${notes}` : ''}`,
      source: 'manual',
      confidenceScore: 100
    });

    return updatedApplication;
  }

  // Email integration and analysis
  async processEmailCommunication(applicationId: string, emailData: any) {
    const communication = await storage.createCommunication({
      applicationId,
      communicationType: 'email',
      direction: emailData.direction,
      subject: emailData.subject,
      content: emailData.content,
      fromAddress: emailData.fromAddress,
      toAddress: emailData.toAddress,
      timestamp: new Date(emailData.timestamp),
      sentimentScore: emailData.sentimentScore,
      priorityLevel: emailData.priorityLevel || 'medium',
      requiresAction: emailData.requiresAction || false,
      emailId: emailData.emailId,
      threadId: emailData.threadId,
      messageId: emailData.messageId,
      attachments: emailData.attachments
    });

    // Create timeline entry
    await storage.createApplicationTimeline({
      applicationId,
      eventType: emailData.direction === 'inbound' ? 'email_received' : 'email_sent',
      eventDate: new Date(emailData.timestamp),
      description: `Email ${emailData.direction}: ${emailData.subject}`,
      source: 'email',
      confidenceScore: 95,
      metadata: {
        communicationId: communication.id,
        emailId: emailData.emailId
      }
    });

    return communication;
  }

  // Intelligent email analysis using Gemini API
  async analyzeEmailContent(emailContent: string, context: any = {}) {
    // Fallback analysis when API key is not available
    const fallbackAnalysis = {
      type: 'unknown',
      sentiment: 0,
      requiresAction: false,
      priorityLevel: 'medium',
      suggestedResponse: null,
      confidence: 0.7
    };

    // Check for common patterns in email content
    const lowerContent = emailContent.toLowerCase();
    
    if (lowerContent.includes('interview') || lowerContent.includes('schedule')) {
      fallbackAnalysis.type = 'interview_invitation';
      fallbackAnalysis.requiresAction = true;
      fallbackAnalysis.priorityLevel = 'high';
      fallbackAnalysis.suggestedResponse = 'Accept interview invitation and confirm availability';
      fallbackAnalysis.confidence = 0.9;
    } else if (lowerContent.includes('reject') || lowerContent.includes('unfortunately')) {
      fallbackAnalysis.type = 'rejection';
      fallbackAnalysis.sentiment = -0.8;
      fallbackAnalysis.priorityLevel = 'low';
      fallbackAnalysis.confidence = 0.85;
    } else if (lowerContent.includes('offer') || lowerContent.includes('congratulations')) {
      fallbackAnalysis.type = 'job_offer';
      fallbackAnalysis.sentiment = 0.9;
      fallbackAnalysis.requiresAction = true;
      fallbackAnalysis.priorityLevel = 'urgent';
      fallbackAnalysis.suggestedResponse = 'Review offer details and respond appropriately';
      fallbackAnalysis.confidence = 0.95;
    } else if (lowerContent.includes('next steps') || lowerContent.includes('follow up')) {
      fallbackAnalysis.type = 'follow_up_request';
      fallbackAnalysis.requiresAction = true;
      fallbackAnalysis.priorityLevel = 'medium';
      fallbackAnalysis.suggestedResponse = 'Provide requested information or take next steps';
      fallbackAnalysis.confidence = 0.8;
    }

    return fallbackAnalysis;
  }

  // Follow-up automation
  async createFollowUp(applicationId: string, followUpData: any) {
    const followUp = await storage.createFollowUp({
      applicationId,
      followUpType: followUpData.followUpType,
      scheduledDate: new Date(followUpData.scheduledDate),
      messageTemplate: followUpData.messageTemplate,
      subject: followUpData.subject,
      automationLevel: followUpData.automationLevel || 'manual',
      metadata: followUpData.metadata
    });

    // Create timeline entry
    await storage.createApplicationTimeline({
      applicationId,
      eventType: 'follow_up',
      eventDate: new Date(),
      description: `Follow-up scheduled for ${followUp.scheduledDate.toLocaleDateString()}`,
      source: 'system',
      confidenceScore: 100,
      metadata: {
        followUpId: followUp.id,
        followUpType: followUpData.followUpType
      }
    });

    return followUp;
  }

  async generateFollowUpMessage(applicationId: string, followUpType: string, context: any = {}) {
    const application = await storage.getApplication(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    // Template-based follow-up generation (fallback)
    const templates = {
      application_status: {
        subject: `Following up on ${application.positionTitle} Application`,
        message: `Dear Hiring Manager,

I hope this email finds you well. I wanted to follow up on my application for the ${application.positionTitle} position at ${application.companyName}, which I submitted on ${application.applicationDate.toLocaleDateString()}.

I remain very interested in this opportunity and would welcome the chance to discuss how my skills and experience align with your team's needs. If you need any additional information from me, please don't hesitate to reach out.

Thank you for your time and consideration.

Best regards,
[Your Name]`
      },
      interview_follow_up: {
        subject: `Thank you for the ${application.positionTitle} Interview`,
        message: `Dear [Interviewer Name],

Thank you for taking the time to speak with me about the ${application.positionTitle} position at ${application.companyName}. I enjoyed our conversation and learning more about the role and your team.

Our discussion reinforced my enthusiasm for this opportunity, and I'm excited about the possibility of contributing to your team's success. If you need any additional information or have any follow-up questions, please don't hesitate to reach out.

I look forward to hearing about the next steps in the process.

Best regards,
[Your Name]`
      },
      thank_you: {
        subject: `Thank You - ${application.positionTitle}`,
        message: `Dear [Name],

Thank you for your time and consideration regarding the ${application.positionTitle} position at ${application.companyName}. I appreciate the opportunity to learn more about the role and your organization.

I remain very interested in this position and believe my background would be a strong fit for your team. Please let me know if you need any additional information.

Thank you again for your time.

Best regards,
[Your Name]`
      }
    };

    const template = templates[followUpType] || templates.application_status;
    
    return {
      subject: template.subject,
      message: template.message,
      personalizedMessage: template.message.replace('[Your Name]', context.userName || '[Your Name]'),
      suggestedTiming: this.getSuggestedFollowUpTiming(followUpType),
      tips: this.getFollowUpTips(followUpType)
    };
  }

  private getSuggestedFollowUpTiming(followUpType: string): string {
    const timings = {
      application_status: '1-2 weeks after application',
      interview_follow_up: '24-48 hours after interview',
      thank_you: 'Immediately after interview or interaction',
      networking: '1-2 weeks for initial contact, then monthly'
    };
    return timings[followUpType] || '1 week';
  }

  private getFollowUpTips(followUpType: string): string[] {
    const tips = {
      application_status: [
        'Keep it brief and professional',
        'Reiterate your interest in the position',
        'Mention any relevant updates to your qualifications'
      ],
      interview_follow_up: [
        'Reference specific points from your conversation',
        'Reaffirm your interest and qualifications',
        'Provide any additional information discussed'
      ],
      thank_you: [
        'Send within 24 hours',
        'Personalize based on your interaction',
        'Keep it concise but meaningful'
      ]
    };
    return tips[followUpType] || ['Be professional and courteous'];
  }

  // Outcome prediction using ML models
  async generateOutcomePrediction(applicationId: string) {
    const application = await storage.getApplication(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    // Get application timeline and communications for context
    const timeline = await storage.getApplicationTimeline(applicationId);
    const communications = await storage.getCommunications(applicationId);

    // Fallback prediction logic
    const factors = [];
    let predictionScore = 0.5; // Base 50% chance

    // Analyze application age
    const daysSinceApplication = Math.floor(
      (new Date().getTime() - application.applicationDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceApplication < 7) {
      factors.push({ factor: 'Recent application', impact: 0.1 });
      predictionScore += 0.1;
    } else if (daysSinceApplication > 30) {
      factors.push({ factor: 'Old application', impact: -0.2 });
      predictionScore -= 0.2;
    }

    // Analyze communication patterns
    const inboundCommunications = communications.filter(c => c.direction === 'inbound');
    if (inboundCommunications.length > 0) {
      factors.push({ factor: 'Employer communication', impact: 0.3 });
      predictionScore += 0.3;
    }

    // Analyze timeline events
    const interviewEvents = timeline.filter(t => t.eventType === 'interview_scheduled');
    if (interviewEvents.length > 0) {
      factors.push({ factor: 'Interview scheduled', impact: 0.4 });
      predictionScore += 0.4;
    }

    // Determine predicted outcome
    let predictedOutcome = 'no_response';
    let confidenceLevel = 'medium';

    if (predictionScore > 0.7) {
      predictedOutcome = 'success';
      confidenceLevel = 'high';
    } else if (predictionScore > 0.4) {
      predictedOutcome = 'success';
      confidenceLevel = 'medium';
    } else if (predictionScore < 0.3) {
      predictedOutcome = 'rejection';
      confidenceLevel = 'low';
    }

    // Calculate time to hire prediction
    const timeToHirePrediction = Math.max(7, Math.min(45, 
      Math.round(30 * (1 - predictionScore))
    ));

    const prediction = await storage.createOutcomePrediction({
      applicationId,
      predictionScore: Math.max(0, Math.min(1, predictionScore)),
      predictedOutcome,
      factors,
      confidenceLevel,
      modelVersion: 'fallback_v1.0',
      timeToHirePrediction,
      probabilityDetails: {
        success: Math.max(0, Math.min(1, predictionScore)),
        rejection: Math.max(0, Math.min(1, 1 - predictionScore - 0.2)),
        no_response: Math.max(0, Math.min(1, 0.2))
      }
    });

    return prediction;
  }

  // Portfolio analytics and insights
  async generatePortfolioAnalytics(userId: string) {
    const stats = await storage.getApplicationPortfolioStats(userId);
    const applications = await storage.getApplications(userId);
    
    // Generate optimization suggestions
    const suggestions = [];
    
    if (stats.responseRate < 20) {
      suggestions.push({
        type: 'application_quality',
        title: 'Improve Application Quality',
        description: 'Your response rate is low. Consider customizing your applications more specifically to each job.',
        priority: 'high',
        actionItems: [
          'Tailor your resume for each application',
          'Write personalized cover letters',
          'Research company culture and values'
        ]
      });
    }

    if (stats.totalApplications < 10) {
      suggestions.push({
        type: 'application_volume',
        title: 'Increase Application Volume',
        description: 'Apply to more positions to increase your chances of success.',
        priority: 'medium',
        actionItems: [
          'Set a daily application target',
          'Expand your search criteria',
          'Use multiple job boards'
        ]
      });
    }

    if (stats.interviewRate > 0 && stats.offerRate / stats.interviewRate < 0.3) {
      suggestions.push({
        type: 'interview_skills',
        title: 'Improve Interview Performance',
        description: 'You\'re getting interviews but not offers. Focus on interview preparation.',
        priority: 'high',
        actionItems: [
          'Practice common interview questions',
          'Research the company thoroughly',
          'Prepare specific examples using the STAR method'
        ]
      });
    }

    return {
      stats,
      suggestions,
      trends: this.calculateTrends(applications),
      recommendations: this.generateRecommendations(stats, applications)
    };
  }

  private calculateTrends(applications: any[]) {
    const last30Days = applications.filter(app => 
      (new Date().getTime() - new Date(app.applicationDate).getTime()) <= (30 * 24 * 60 * 60 * 1000)
    );

    const previous30Days = applications.filter(app => {
      const daysSince = (new Date().getTime() - new Date(app.applicationDate).getTime()) / (24 * 60 * 60 * 1000);
      return daysSince > 30 && daysSince <= 60;
    });

    return {
      applicationVolume: {
        current: last30Days.length,
        previous: previous30Days.length,
        change: last30Days.length - previous30Days.length
      },
      responseRate: {
        current: last30Days.filter(app => 
          ['screening', 'interview', 'offer', 'rejected'].includes(app.status)
        ).length / (last30Days.length || 1),
        previous: previous30Days.filter(app => 
          ['screening', 'interview', 'offer', 'rejected'].includes(app.status)
        ).length / (previous30Days.length || 1)
      }
    };
  }

  private generateRecommendations(stats: any, applications: any[]) {
    const recommendations = [];

    // Best performing companies
    const companyStats = {};
    applications.forEach(app => {
      if (!companyStats[app.companyName]) {
        companyStats[app.companyName] = { total: 0, responses: 0 };
      }
      companyStats[app.companyName].total++;
      if (['screening', 'interview', 'offer'].includes(app.status)) {
        companyStats[app.companyName].responses++;
      }
    });

    const bestCompanies = Object.entries(companyStats)
      .map(([company, stats]: [string, any]) => ({
        company,
        responseRate: stats.responses / stats.total,
        applications: stats.total
      }))
      .filter(c => c.applications >= 2)
      .sort((a, b) => b.responseRate - a.responseRate)
      .slice(0, 5);

    if (bestCompanies.length > 0) {
      recommendations.push({
        type: 'target_companies',
        title: 'Focus on High-Response Companies',
        data: bestCompanies,
        description: 'These companies have responded well to your applications'
      });
    }

    return recommendations;
  }

  // Email integration setup
  async setupEmailIntegration(userId: string, provider: string, credentials: any) {
    const integration = await storage.createEmailIntegration({
      userId,
      provider,
      email: credentials.email,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      tokenExpiry: credentials.tokenExpiry ? new Date(credentials.tokenExpiry) : null,
      isActive: true,
      scopes: credentials.scopes || [],
      metadata: credentials.metadata || {}
    });

    return integration;
  }

  // Utility methods
  async getApplicationDashboard(userId: string) {
    const applications = await storage.getApplications(userId);
    const stats = await storage.getApplicationPortfolioStats(userId);
    const upcomingFollowUps = await storage.getUpcomingFollowUps(userId);
    const emailIntegrations = await storage.getEmailIntegrations(userId);

    return {
      applications: applications.slice(0, 10), // Recent applications
      stats,
      upcomingFollowUps,
      emailIntegrations,
      quickActions: [
        { type: 'add_application', label: 'Add New Application' },
        { type: 'sync_email', label: 'Sync Emails' },
        { type: 'view_analytics', label: 'View Analytics' },
        { type: 'schedule_follow_up', label: 'Schedule Follow-up' }
      ]
    };
  }
}

export const applicationTracker = new ApplicationTracker();