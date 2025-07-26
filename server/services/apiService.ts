import { memoize } from 'memoizee';
import { z } from 'zod';

// API Configuration Schema
const ApiConfigSchema = z.object({
  openai: z.object({
    apiKey: z.string(),
    model: z.string().default('gpt-4o'),
    maxTokens: z.number().default(4000),
  }),
  anthropic: z.object({
    apiKey: z.string(),
    model: z.string().default('claude-3-5-sonnet-20241022'),
  }),
  google: z.object({
    apiKey: z.string(),
    model: z.string().default('gemini-2.0-flash-exp'),
  }),
  openrouter: z.object({
    apiKey: z.string(),
    baseUrl: z.string().default('https://openrouter.ai/api/v1'),
  }),
  edenai: z.object({
    apiKey: z.string(),
  }),
  jooble: z.object({
    apiKey: z.string(),
  }),
  stripe: z.object({
    secretKey: z.string(),
    publishableKey: z.string(),
  }),
  sendgrid: z.object({
    apiKey: z.string(),
  }),
});

export type ApiConfig = z.infer<typeof ApiConfigSchema>;

// API Service Manager
export class ApiServiceManager {
  private config: ApiConfig;
  private rateLimiters: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: ApiConfig) {
    this.config = config;
  }

  // Rate limiting utility
  private checkRateLimit(service: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const key = `${service}_${Math.floor(now / windowMs)}`;
    
    if (!this.rateLimiters.has(key)) {
      this.rateLimiters.set(key, { count: 0, resetTime: now + windowMs });
    }
    
    const limiter = this.rateLimiters.get(key)!;
    if (now > limiter.resetTime) {
      limiter.count = 0;
      limiter.resetTime = now + windowMs;
    }
    
    if (limiter.count >= limit) {
      return false;
    }
    
    limiter.count++;
    return true;
  }

  // Generic API call with retry logic
  private async makeApiCall<T>(
    service: string,
    url: string,
    options: RequestInit,
    retries: number = 3
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('API call failed after retries');
  }

  // AI Services
  async generateContent(prompt: string, service: 'openai' | 'anthropic' | 'google' | 'openrouter' = 'openai') {
    const rateLimitKey = `${service}_content`;
    if (!this.checkRateLimit(rateLimitKey, 100, 60000)) {
      throw new Error('Rate limit exceeded');
    }

    switch (service) {
      case 'openai':
        return this.openaiGenerate(prompt);
      case 'anthropic':
        return this.anthropicGenerate(prompt);
      case 'google':
        return this.googleGenerate(prompt);
      case 'openrouter':
        return this.openrouterGenerate(prompt);
      default:
        throw new Error(`Unsupported service: ${service}`);
    }
  }

  private async openaiGenerate(prompt: string) {
    return this.makeApiCall('openai', 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.openai.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: this.config.openai.maxTokens,
        temperature: 0.7,
      }),
    });
  }

  private async anthropicGenerate(prompt: string) {
    return this.makeApiCall('anthropic', 'https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.anthropic.apiKey}`,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.anthropic.model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  }

  private async googleGenerate(prompt: string) {
    return this.makeApiCall('google', `https://generativelanguage.googleapis.com/v1beta/models/${this.config.google.model}:generateContent`, {
      method: 'POST',
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    });
  }

  private async openrouterGenerate(prompt: string) {
    return this.makeApiCall('openrouter', `${this.config.openrouter.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.openrouter.apiKey}`,
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });
  }

  // Job Search Services
  async searchJobs(query: string, location?: string, filters?: any) {
    const rateLimitKey = 'job_search';
    if (!this.checkRateLimit(rateLimitKey, 50, 60000)) {
      throw new Error('Job search rate limit exceeded');
    }

    // Try multiple job APIs with fallback
    const apis = [
      () => this.joobleSearch(query, location, filters),
      // Add more job APIs here
    ];

    for (const apiCall of apis) {
      try {
        return await apiCall();
      } catch (error) {
        console.error('Job search API failed:', error);
        continue;
      }
    }

    throw new Error('All job search APIs failed');
  }

  private async joobleSearch(query: string, location?: string, filters?: any) {
    const params = new URLSearchParams({
      keywords: query,
      ...(location && { location }),
      ...filters,
    });

    return this.makeApiCall('jooble', `https://jooble.org/api/${this.config.jooble.apiKey}?${params}`, {
      method: 'GET',
    });
  }

  // Resume Optimization Services
  async optimizeResume(resumeText: string, jobDescription?: string) {
    const rateLimitKey = 'resume_optimization';
    if (!this.checkRateLimit(rateLimitKey, 20, 60000)) {
      throw new Error('Resume optimization rate limit exceeded');
    }

    // Use Eden AI for resume optimization
    return this.makeApiCall('edenai', 'https://api.edenai.run/v2/text/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.edenai.apiKey}`,
      },
      body: JSON.stringify({
        providers: 'openai',
        text: `Optimize this resume for ATS compatibility: ${resumeText}${jobDescription ? `\n\nJob Description: ${jobDescription}` : ''}`,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
  }

  // Interview Coaching Services
  async generateInterviewQuestions(jobTitle: string, company?: string) {
    const prompt = `Generate 10 relevant interview questions for a ${jobTitle} position${company ? ` at ${company}` : ''}. Include behavioral, technical, and situational questions.`;
    
    return this.generateContent(prompt, 'anthropic');
  }

  // Salary Intelligence Services
  async getSalaryData(jobTitle: string, location: string, experienceLevel: string) {
    // Implement salary data aggregation from multiple sources
    const rateLimitKey = 'salary_intelligence';
    if (!this.checkRateLimit(rateLimitKey, 30, 60000)) {
      throw new Error('Salary intelligence rate limit exceeded');
    }

    // This would integrate with Levels.fyi, Glassdoor, etc.
    return this.generateContent(
      `Provide salary intelligence for ${jobTitle} in ${location} with ${experienceLevel} experience level. Include salary ranges, benefits, and market trends.`,
      'openai'
    );
  }

  // Company Intelligence Services
  async getCompanyInsights(companyName: string) {
    const rateLimitKey = 'company_intelligence';
    if (!this.checkRateLimit(rateLimitKey, 40, 60000)) {
      throw new Error('Company intelligence rate limit exceeded');
    }

    return this.generateContent(
      `Provide comprehensive company insights for ${companyName}. Include culture, benefits, work-life balance, growth opportunities, and employee satisfaction.`,
      'anthropic'
    );
  }

  // Email Services
  async sendEmail(to: string, subject: string, content: string, from?: string) {
    return this.makeApiCall('sendgrid', 'https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.sendgrid.apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from || 'noreply@smartjobfit.com' },
        subject,
        content: [{ type: 'text/html', value: content }],
      }),
    });
  }

  // Payment Services
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.makeApiCall('stripe', 'https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.stripe.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency,
        automatic_payment_methods: 'enabled',
      }).toString(),
    });
  }
}

// Memoized instance for performance
export const apiService = memoize((config: ApiConfig) => new ApiServiceManager(config), {
  maxAge: 1000 * 60 * 5, // 5 minutes
});

// Export configuration helper
export const createApiConfig = (): ApiConfig => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY || '',
    model: process.env.GOOGLE_MODEL || 'gemini-2.0-flash-exp',
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  },
  edenai: {
    apiKey: process.env.EDENAI_API_KEY || '',
  },
  jooble: {
    apiKey: process.env.JOOBLE_API_KEY || '',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },
}); 