import { MailService } from '@sendgrid/mail';
import { storage } from '../storage';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set. Email functionality will be disabled.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private fromEmail = process.env.FROM_EMAIL || 'noreply@jobmatch.ai';

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("Email not sent - SENDGRID_API_KEY not configured");
      return false;
    }

    try {
      await mailService.send({
        to: params.to,
        from: params.from || this.fromEmail,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">Welcome to JobMatch AI, ${userName}!</h1>
        <p>We're excited to help you find your dream job 10x faster with AI-powered job search.</p>
        
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: white; margin: 0;">Get Started</h2>
          <p style="color: #e0e7ff; margin: 10px 0;">Here's what you can do next:</p>
          <ul style="color: #e0e7ff;">
            <li>Upload your resume for AI optimization</li>
            <li>Set your job preferences</li>
            <li>Start searching 15+ job boards simultaneously</li>
            <li>Practice with our AI interview coach</li>
          </ul>
        </div>
        
        <p>If you have any questions, reply to this email or visit our help center.</p>
        <p>Best regards,<br>The JobMatch AI Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      from: this.fromEmail,
      subject: 'Welcome to JobMatch AI - Your AI-Powered Job Search Begins!',
      html,
      text: `Welcome to JobMatch AI, ${userName}! We're excited to help you find your dream job 10x faster with AI-powered job search.`,
    });
  }

  async sendJobAlertEmail(userEmail: string, jobs: any[], alertName: string): Promise<boolean> {
    const jobsHtml = jobs.map(job => `
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="color: #1f2937; margin: 0 0 8px 0;">${job.title}</h3>
        <p style="color: #6b7280; margin: 0 0 8px 0;">${job.company} • ${job.location}</p>
        <p style="color: #374151; margin: 0 0 12px 0;">${job.description?.substring(0, 150)}...</p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${job.skills?.map(skill => `<span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${skill}</span>`).join('') || ''}
        </div>
        <p style="margin: 12px 0 0 0;">
          <a href="${job.url}" style="color: #8b5cf6; text-decoration: none;">View Job →</a>
        </p>
      </div>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">New Job Matches Found!</h1>
        <p>Your "${alertName}" alert has found ${jobs.length} new job${jobs.length === 1 ? '' : 's'} that match your criteria.</p>
        
        ${jobsHtml}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View All Jobs
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          You're receiving this because you have an active job alert. 
          <a href="${process.env.FRONTEND_URL}/settings" style="color: #8b5cf6;">Manage your alerts</a>
        </p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      from: this.fromEmail,
      subject: `${jobs.length} New Job Matches - ${alertName}`,
      html,
    });
  }

  async sendInterviewReminderEmail(userEmail: string, jobTitle: string, company: string, interviewDate: Date): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">Interview Reminder</h1>
        <p>This is a reminder about your upcoming interview:</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin: 0 0 10px 0;">${jobTitle}</h2>
          <p style="color: #6b7280; margin: 0 0 10px 0;">${company}</p>
          <p style="color: #374151; margin: 0;"><strong>Date:</strong> ${interviewDate.toLocaleDateString()}</p>
          <p style="color: #374151; margin: 0;"><strong>Time:</strong> ${interviewDate.toLocaleTimeString()}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: white; margin: 0 0 10px 0;">Quick Prep Tips</h3>
          <ul style="color: #e0e7ff; margin: 0;">
            <li>Review the job description and your application</li>
            <li>Practice common interview questions</li>
            <li>Prepare questions about the company and role</li>
            <li>Test your tech setup if it's a video interview</li>
          </ul>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/interview-prep" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Practice with AI Interview Coach
          </a>
        </div>
        
        <p>Good luck with your interview!</p>
        <p>Best regards,<br>The JobMatch AI Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      from: this.fromEmail,
      subject: `Interview Reminder: ${jobTitle} at ${company}`,
      html,
    });
  }

  async sendApplicationStatusUpdateEmail(userEmail: string, jobTitle: string, company: string, status: string): Promise<boolean> {
    const statusMessages = {
      'interview': 'Great news! You have an interview scheduled.',
      'offer': 'Congratulations! You received a job offer.',
      'rejected': 'Unfortunately, this application was not successful.',
    };

    const statusColors = {
      'interview': '#10b981',
      'offer': '#059669',
      'rejected': '#ef4444',
    };

    const message = statusMessages[status] || 'Your application status has been updated.';
    const color = statusColors[status] || '#6b7280';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8b5cf6;">Application Status Update</h1>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin: 0 0 10px 0;">${jobTitle}</h2>
          <p style="color: #6b7280; margin: 0 0 15px 0;">${company}</p>
          <p style="color: ${color}; font-weight: bold; margin: 0;">${message}</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.FRONTEND_URL}/dashboard" style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Dashboard
          </a>
        </div>
        
        <p>Keep up the great work on your job search!</p>
        <p>Best regards,<br>The JobMatch AI Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      from: this.fromEmail,
      subject: `Application Update: ${jobTitle} at ${company}`,
      html,
    });
  }

  async processJobAlerts(): Promise<void> {
    try {
      // Get all active job alerts
      const users = await storage.getUser(''); // This would need to be implemented to get all users
      // For now, we'll skip the automated job alert processing
      // In a real implementation, you'd:
      // 1. Get all users with active job alerts
      // 2. For each alert, search for new jobs matching their criteria
      // 3. Send email notifications for new matches
      // 4. Update the lastSent timestamp
      
      console.log('Job alert processing would run here');
    } catch (error) {
      console.error('Failed to process job alerts:', error);
    }
  }
}

export const emailService = new EmailService();
