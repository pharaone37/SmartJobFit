import fetch from 'node-fetch';

export interface HubSpotContact {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  website?: string;
  industry?: string;
  lifecycleStage?: string;
  leadStatus?: string;
  properties?: Record<string, any>;
}

export interface HubSpotDeal {
  id?: string;
  dealName: string;
  amount?: number;
  stage: string;
  closeDate?: string;
  contactId?: string;
  companyId?: string;
  properties?: Record<string, any>;
}

export interface HubSpotCompany {
  id?: string;
  name: string;
  domain?: string;
  industry?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  city?: string;
  state?: string;
  country?: string;
  properties?: Record<string, any>;
}

export interface CrmInsights {
  contactAnalysis: {
    totalContacts: number;
    recentActivity: number;
    conversionRate: number;
    topSources: string[];
  };
  dealAnalysis: {
    totalDeals: number;
    totalValue: number;
    avgDealSize: number;
    winRate: number;
    pipelineHealth: string;
  };
  companyAnalysis: {
    totalCompanies: number;
    topIndustries: string[];
    avgCompanySize: number;
    geographicDistribution: Record<string, number>;
  };
  recommendations: string[];
}

class HubSpotService {
  private apiKey: string;
  private baseUrl = 'https://api.hubapi.com';

  constructor() {
    this.apiKey = process.env.HUBSPOT_API_KEY || '';
    if (!this.apiKey) {
      console.warn('HUBSPOT_API_KEY not found. CRM features will use fallback.');
    }
  }

  private async makeRequest(endpoint: string, method = 'GET', body?: any) {
    if (!this.apiKey) {
      throw new Error('HubSpot API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Contact Management
  async createContact(contact: HubSpotContact): Promise<HubSpotContact> {
    try {
      const properties = {
        email: contact.email,
        firstname: contact.firstName,
        lastname: contact.lastName,
        company: contact.company,
        jobtitle: contact.jobTitle,
        phone: contact.phone,
        website: contact.website,
        industry: contact.industry,
        lifecyclestage: contact.lifecycleStage || 'lead',
        hs_lead_status: contact.leadStatus || 'NEW',
        ...contact.properties,
      };

      const response = await this.makeRequest('/crm/v3/objects/contacts', 'POST', {
        properties,
      });

      return this.transformContactResponse(response);
    } catch (error) {
      console.error('HubSpot create contact error:', error);
      throw error;
    }
  }

  async getContact(contactId: string): Promise<HubSpotContact> {
    try {
      const response = await this.makeRequest(`/crm/v3/objects/contacts/${contactId}`);
      return this.transformContactResponse(response);
    } catch (error) {
      console.error('HubSpot get contact error:', error);
      throw error;
    }
  }

  async updateContact(contactId: string, updates: Partial<HubSpotContact>): Promise<HubSpotContact> {
    try {
      const properties = {
        email: updates.email,
        firstname: updates.firstName,
        lastname: updates.lastName,
        company: updates.company,
        jobtitle: updates.jobTitle,
        phone: updates.phone,
        website: updates.website,
        industry: updates.industry,
        lifecyclestage: updates.lifecycleStage,
        hs_lead_status: updates.leadStatus,
        ...updates.properties,
      };

      const response = await this.makeRequest(`/crm/v3/objects/contacts/${contactId}`, 'PATCH', {
        properties,
      });

      return this.transformContactResponse(response);
    } catch (error) {
      console.error('HubSpot update contact error:', error);
      throw error;
    }
  }

  async searchContacts(query: string): Promise<HubSpotContact[]> {
    try {
      const response = await this.makeRequest('/crm/v3/objects/contacts/search', 'POST', {
        query,
        limit: 100,
      });

      return response.results.map(this.transformContactResponse);
    } catch (error) {
      console.error('HubSpot search contacts error:', error);
      return [];
    }
  }

  // Deal Management
  async createDeal(deal: HubSpotDeal): Promise<HubSpotDeal> {
    try {
      const properties = {
        dealname: deal.dealName,
        amount: deal.amount,
        dealstage: deal.stage,
        closedate: deal.closeDate,
        ...deal.properties,
      };

      const response = await this.makeRequest('/crm/v3/objects/deals', 'POST', {
        properties,
      });

      return this.transformDealResponse(response);
    } catch (error) {
      console.error('HubSpot create deal error:', error);
      throw error;
    }
  }

  async getDeal(dealId: string): Promise<HubSpotDeal> {
    try {
      const response = await this.makeRequest(`/crm/v3/objects/deals/${dealId}`);
      return this.transformDealResponse(response);
    } catch (error) {
      console.error('HubSpot get deal error:', error);
      throw error;
    }
  }

  // Company Management
  async createCompany(company: HubSpotCompany): Promise<HubSpotCompany> {
    try {
      const properties = {
        name: company.name,
        domain: company.domain,
        industry: company.industry,
        numberofemployees: company.numberOfEmployees,
        annualrevenue: company.annualRevenue,
        city: company.city,
        state: company.state,
        country: company.country,
        ...company.properties,
      };

      const response = await this.makeRequest('/crm/v3/objects/companies', 'POST', {
        properties,
      });

      return this.transformCompanyResponse(response);
    } catch (error) {
      console.error('HubSpot create company error:', error);
      throw error;
    }
  }

  // AI-Powered CRM Insights
  async generateCrmInsights(): Promise<CrmInsights> {
    try {
      // Fetch data from HubSpot
      const contacts = await this.makeRequest('/crm/v3/objects/contacts?limit=100');
      const deals = await this.makeRequest('/crm/v3/objects/deals?limit=100');
      const companies = await this.makeRequest('/crm/v3/objects/companies?limit=100');

      // Analyze data with AI
      const insights = await this.analyzeDataWithAI(contacts, deals, companies);
      
      return insights;
    } catch (error) {
      console.error('HubSpot insights generation error:', error);
      return this.fallbackInsights();
    }
  }

  private async analyzeDataWithAI(contacts: any, deals: any, companies: any): Promise<CrmInsights> {
    try {
      const prompt = `
        Analyze the following CRM data and provide comprehensive insights:
        
        Contacts: ${JSON.stringify(contacts.results?.slice(0, 10) || [], null, 2)}
        Deals: ${JSON.stringify(deals.results?.slice(0, 10) || [], null, 2)}
        Companies: ${JSON.stringify(companies.results?.slice(0, 10) || [], null, 2)}
        
        Provide analysis in this JSON format:
        {
          "contactAnalysis": {
            "totalContacts": number,
            "recentActivity": number,
            "conversionRate": number,
            "topSources": ["source1", "source2"]
          },
          "dealAnalysis": {
            "totalDeals": number,
            "totalValue": number,
            "avgDealSize": number,
            "winRate": number,
            "pipelineHealth": "excellent|good|fair|poor"
          },
          "companyAnalysis": {
            "totalCompanies": number,
            "topIndustries": ["industry1", "industry2"],
            "avgCompanySize": number,
            "geographicDistribution": {"US": 50, "CA": 30, "UK": 20}
          },
          "recommendations": ["recommendation1", "recommendation2"]
        }
      `;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://smartjobfit.com',
          'X-Title': 'SmartJobFit'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: 'You are a CRM data analyst. Analyze the provided CRM data and generate actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze CRM data');
      }

      const data = await response.json() as any;
      const analysisText = data.choices[0].message.content;
      
      try {
        return JSON.parse(analysisText);
      } catch (parseError) {
        return this.fallbackInsights();
      }
    } catch (error) {
      console.error('AI CRM analysis error:', error);
      return this.fallbackInsights();
    }
  }

  private transformContactResponse(response: any): HubSpotContact {
    const props = response.properties || {};
    return {
      id: response.id,
      email: props.email,
      firstName: props.firstname,
      lastName: props.lastname,
      company: props.company,
      jobTitle: props.jobtitle,
      phone: props.phone,
      website: props.website,
      industry: props.industry,
      lifecycleStage: props.lifecyclestage,
      leadStatus: props.hs_lead_status,
      properties: props,
    };
  }

  private transformDealResponse(response: any): HubSpotDeal {
    const props = response.properties || {};
    return {
      id: response.id,
      dealName: props.dealname,
      amount: props.amount,
      stage: props.dealstage,
      closeDate: props.closedate,
      properties: props,
    };
  }

  private transformCompanyResponse(response: any): HubSpotCompany {
    const props = response.properties || {};
    return {
      id: response.id,
      name: props.name,
      domain: props.domain,
      industry: props.industry,
      numberOfEmployees: props.numberofemployees,
      annualRevenue: props.annualrevenue,
      city: props.city,
      state: props.state,
      country: props.country,
      properties: props,
    };
  }

  private fallbackInsights(): CrmInsights {
    return {
      contactAnalysis: {
        totalContacts: 0,
        recentActivity: 0,
        conversionRate: 0,
        topSources: ['Direct', 'Website', 'Referral'],
      },
      dealAnalysis: {
        totalDeals: 0,
        totalValue: 0,
        avgDealSize: 0,
        winRate: 0,
        pipelineHealth: 'fair',
      },
      companyAnalysis: {
        totalCompanies: 0,
        topIndustries: ['Technology', 'Healthcare', 'Finance'],
        avgCompanySize: 0,
        geographicDistribution: { 'US': 100 },
      },
      recommendations: [
        'Configure HubSpot API key to access CRM data',
        'Set up proper contact tracking',
        'Implement deal pipeline monitoring',
      ],
    };
  }
}

export const hubspotService = new HubSpotService();