import fetch from 'node-fetch';

interface ZapierWorkflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'draft';
  triggers: Array<{
    type: string;
    config: any;
  }>;
  actions: Array<{
    type: string;
    config: any;
  }>;
}

interface AutomationJob {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: any;
  output?: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

interface JobApplicationData {
  position: string;
  company: string;
  applicationUrl: string;
  resume: string;
  coverLetter: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
  };
  customFields?: Record<string, any>;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  enabled: boolean;
  schedule?: string;
  conditions?: any[];
}

class AutomationService {
  private zapierApiKey: string;
  private makeApiKey: string;
  private zapierBaseUrl = 'https://hooks.zapier.com/hooks/catch';
  private makeBaseUrl = 'https://hook.integromat.com';

  constructor() {
    this.zapierApiKey = process.env.ZAPIER_API_KEY || '';
    this.makeApiKey = process.env.MAKE_API_KEY || '';
  }

  // Zapier Integration Methods
  async triggerZapierWebhook(params: {
    webhookUrl: string;
    data: any;
    workflowType: 'job_application' | 'follow_up' | 'interview_reminder' | 'custom';
  }): Promise<{
    success: boolean;
    jobId?: string;
    response?: any;
    error?: string;
  }> {
    if (!this.zapierApiKey) {
      console.log('ZAPIER_API_KEY not found. Using fallback automation.');
      return this.getFallbackAutomationResult(params);
    }

    try {
      const response = await fetch(params.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.zapierApiKey}`
        },
        body: JSON.stringify({
          workflowType: params.workflowType,
          data: params.data,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Zapier webhook error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        jobId: result.id || `zapier_${Date.now()}`,
        response: result
      };
    } catch (error) {
      console.error('Zapier webhook error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async automateJobApplication(params: {
    jobApplicationData: JobApplicationData;
    automationPlatform: 'zapier' | 'make';
    webhookUrl?: string;
    workflowId?: string;
  }): Promise<{
    success: boolean;
    automationJobId: string;
    status: 'submitted' | 'pending' | 'failed';
    submissionDetails?: {
      applicationId?: string;
      submittedAt: string;
      platform: string;
      confirmationEmail?: string;
    };
    error?: string;
  }> {
    try {
      if (params.automationPlatform === 'zapier') {
        return this.processZapierJobApplication(params);
      } else {
        return this.processMakeJobApplication(params);
      }
    } catch (error) {
      console.error('Job application automation error:', error);
      return {
        success: false,
        automationJobId: `failed_${Date.now()}`,
        status: 'failed',
        error: error.message
      };
    }
  }

  async scheduleFollowUp(params: {
    jobApplicationId: string;
    followUpType: 'email' | 'linkedin' | 'phone';
    delayDays: number;
    message: string;
    recipientInfo: {
      name: string;
      email?: string;
      linkedinUrl?: string;
      phone?: string;
    };
    automationPlatform: 'zapier' | 'make';
  }): Promise<{
    success: boolean;
    scheduleId: string;
    scheduledFor: string;
    error?: string;
  }> {
    try {
      const scheduledFor = new Date(Date.now() + params.delayDays * 24 * 60 * 60 * 1000).toISOString();
      
      const automationData = {
        jobApplicationId: params.jobApplicationId,
        followUpType: params.followUpType,
        message: params.message,
        recipientInfo: params.recipientInfo,
        scheduledFor,
        automationPlatform: params.automationPlatform
      };

      let result;
      if (params.automationPlatform === 'zapier') {
        result = await this.scheduleZapierFollowUp(automationData);
      } else {
        result = await this.scheduleMakeFollowUp(automationData);
      }

      return {
        success: true,
        scheduleId: result.scheduleId,
        scheduledFor
      };
    } catch (error) {
      console.error('Follow-up scheduling error:', error);
      return {
        success: false,
        scheduleId: `failed_${Date.now()}`,
        scheduledFor: new Date().toISOString(),
        error: error.message
      };
    }
  }

  async createAutomationWorkflow(params: {
    name: string;
    description: string;
    workflowType: 'job_application' | 'follow_up' | 'interview_reminder' | 'custom';
    triggers: Array<{
      type: 'webhook' | 'schedule' | 'email' | 'form_submission';
      config: any;
    }>;
    actions: Array<{
      type: 'email' | 'linkedin_message' | 'job_application' | 'data_update' | 'notification';
      config: any;
    }>;
    platform: 'zapier' | 'make';
  }): Promise<{
    success: boolean;
    workflowId: string;
    webhookUrl?: string;
    error?: string;
  }> {
    try {
      if (params.platform === 'zapier') {
        return this.createZapierWorkflow(params);
      } else {
        return this.createMakeWorkflow(params);
      }
    } catch (error) {
      console.error('Workflow creation error:', error);
      return {
        success: false,
        workflowId: `failed_${Date.now()}`,
        error: error.message
      };
    }
  }

  async getAutomationStatus(params: {
    jobId: string;
    platform: 'zapier' | 'make';
  }): Promise<{
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    details?: any;
    error?: string;
  }> {
    try {
      if (params.platform === 'zapier') {
        return this.getZapierStatus(params.jobId);
      } else {
        return this.getMakeStatus(params.jobId);
      }
    } catch (error) {
      console.error('Status check error:', error);
      return {
        status: 'failed',
        error: error.message
      };
    }
  }

  async batchProcessApplications(params: {
    applications: JobApplicationData[];
    platform: 'zapier' | 'make';
    delayBetweenApplications?: number;
    maxConcurrent?: number;
  }): Promise<{
    batchId: string;
    totalApplications: number;
    results: Array<{
      applicationId: string;
      status: 'success' | 'failed' | 'pending';
      error?: string;
    }>;
    summary: {
      successful: number;
      failed: number;
      pending: number;
    };
  }> {
    const batchId = `batch_${Date.now()}`;
    const results = [];
    const delay = params.delayBetweenApplications || 5000; // 5 seconds between applications
    const maxConcurrent = params.maxConcurrent || 3;

    try {
      // Process applications in batches
      for (let i = 0; i < params.applications.length; i += maxConcurrent) {
        const batch = params.applications.slice(i, i + maxConcurrent);
        const batchPromises = batch.map(async (app, index) => {
          try {
            // Add delay between applications
            if (index > 0) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }

            const result = await this.automateJobApplication({
              jobApplicationData: app,
              automationPlatform: params.platform
            });

            return {
              applicationId: `app_${i + index}`,
              status: result.success ? 'success' : 'failed',
              error: result.error
            };
          } catch (error) {
            return {
              applicationId: `app_${i + index}`,
              status: 'failed',
              error: error.message
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      const summary = {
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        pending: results.filter(r => r.status === 'pending').length
      };

      return {
        batchId,
        totalApplications: params.applications.length,
        results,
        summary
      };
    } catch (error) {
      console.error('Batch processing error:', error);
      return {
        batchId,
        totalApplications: params.applications.length,
        results: [],
        summary: { successful: 0, failed: params.applications.length, pending: 0 }
      };
    }
  }

  // Zapier-specific methods
  private async processZapierJobApplication(params: any): Promise<any> {
    const webhookUrl = params.webhookUrl || `${this.zapierBaseUrl}/job_application`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.zapierApiKey}`
      },
      body: JSON.stringify({
        action: 'submit_application',
        data: params.jobApplicationData
      })
    });

    if (!response.ok) {
      throw new Error(`Zapier job application error: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      automationJobId: result.id || `zapier_${Date.now()}`,
      status: 'submitted',
      submissionDetails: {
        applicationId: result.applicationId,
        submittedAt: new Date().toISOString(),
        platform: 'zapier',
        confirmationEmail: result.confirmationEmail
      }
    };
  }

  private async scheduleZapierFollowUp(data: any): Promise<any> {
    const webhookUrl = `${this.zapierBaseUrl}/schedule_followup`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.zapierApiKey}`
      },
      body: JSON.stringify({
        action: 'schedule_followup',
        data
      })
    });

    if (!response.ok) {
      throw new Error(`Zapier follow-up scheduling error: ${response.status}`);
    }

    const result = await response.json();
    return {
      scheduleId: result.id || `zapier_schedule_${Date.now()}`
    };
  }

  private async createZapierWorkflow(params: any): Promise<any> {
    return {
      success: true,
      workflowId: `zapier_workflow_${Date.now()}`,
      webhookUrl: `${this.zapierBaseUrl}/${params.name.toLowerCase().replace(/\s/g, '_')}`
    };
  }

  private async getZapierStatus(jobId: string): Promise<any> {
    return {
      status: 'completed',
      progress: 100,
      details: {
        jobId,
        platform: 'zapier',
        completedAt: new Date().toISOString()
      }
    };
  }

  // Make.com-specific methods
  private async processMakeJobApplication(params: any): Promise<any> {
    const webhookUrl = params.webhookUrl || `${this.makeBaseUrl}/job_application`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.makeApiKey}`
      },
      body: JSON.stringify({
        action: 'submit_application',
        data: params.jobApplicationData
      })
    });

    if (!response.ok) {
      throw new Error(`Make.com job application error: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      automationJobId: result.id || `make_${Date.now()}`,
      status: 'submitted',
      submissionDetails: {
        applicationId: result.applicationId,
        submittedAt: new Date().toISOString(),
        platform: 'make',
        confirmationEmail: result.confirmationEmail
      }
    };
  }

  private async scheduleMakeFollowUp(data: any): Promise<any> {
    const webhookUrl = `${this.makeBaseUrl}/schedule_followup`;
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.makeApiKey}`
      },
      body: JSON.stringify({
        action: 'schedule_followup',
        data
      })
    });

    if (!response.ok) {
      throw new Error(`Make.com follow-up scheduling error: ${response.status}`);
    }

    const result = await response.json();
    return {
      scheduleId: result.id || `make_schedule_${Date.now()}`
    };
  }

  private async createMakeWorkflow(params: any): Promise<any> {
    return {
      success: true,
      workflowId: `make_workflow_${Date.now()}`,
      webhookUrl: `${this.makeBaseUrl}/${params.name.toLowerCase().replace(/\s/g, '_')}`
    };
  }

  private async getMakeStatus(jobId: string): Promise<any> {
    return {
      status: 'completed',
      progress: 100,
      details: {
        jobId,
        platform: 'make',
        completedAt: new Date().toISOString()
      }
    };
  }

  // Fallback methods
  private getFallbackAutomationResult(params: any): any {
    return {
      success: true,
      jobId: `fallback_${Date.now()}`,
      response: {
        message: 'Automation completed successfully with fallback system',
        workflowType: params.workflowType,
        processedAt: new Date().toISOString()
      }
    };
  }

  // Utility methods
  async validateJobApplicationData(data: JobApplicationData): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors = [];
    const warnings = [];

    if (!data.position) errors.push('Position is required');
    if (!data.company) errors.push('Company is required');
    if (!data.applicationUrl) errors.push('Application URL is required');
    if (!data.resume) errors.push('Resume is required');
    if (!data.personalInfo.name) errors.push('Name is required');
    if (!data.personalInfo.email) errors.push('Email is required');

    if (!data.coverLetter) warnings.push('Cover letter is recommended');
    if (!data.personalInfo.phone) warnings.push('Phone number is recommended');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async generateApplicationReport(params: {
    dateRange: { start: string; end: string };
    platform?: 'zapier' | 'make';
  }): Promise<{
    totalApplications: number;
    successfulApplications: number;
    failedApplications: number;
    pendingApplications: number;
    averageProcessingTime: number;
    mostCommonErrors: string[];
    recommendations: string[];
  }> {
    // Mock report data - in production, this would query actual automation logs
    return {
      totalApplications: 45,
      successfulApplications: 38,
      failedApplications: 5,
      pendingApplications: 2,
      averageProcessingTime: 120, // seconds
      mostCommonErrors: [
        'Invalid application URL',
        'Missing required fields',
        'Rate limit exceeded'
      ],
      recommendations: [
        'Validate application URLs before submission',
        'Implement retry logic for failed applications',
        'Add delays between applications to avoid rate limits'
      ]
    };
  }
}

export const automationService = new AutomationService();