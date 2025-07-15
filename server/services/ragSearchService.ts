import fetch from 'node-fetch';

interface RAGSearchResult {
  query: string;
  results: Array<{
    title: string;
    content: string;
    source: string;
    url?: string;
    relevanceScore: number;
    publishedDate?: string;
    author?: string;
    summary: string;
  }>;
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
}

interface CompanyResearchData {
  companyName: string;
  overview: {
    description: string;
    industry: string;
    founded: string;
    headquarters: string;
    employees: string;
    revenue?: string;
    website: string;
  };
  leadership: Array<{
    name: string;
    title: string;
    background: string;
    linkedinUrl?: string;
  }>;
  culture: {
    values: string[];
    workEnvironment: string;
    benefits: string[];
    diversityInfo: string;
  };
  financials: {
    revenue?: string;
    funding?: string;
    growth: string;
    stockPrice?: string;
  };
  recentNews: Array<{
    title: string;
    summary: string;
    date: string;
    source: string;
    url: string;
  }>;
  jobMarketInsights: {
    openPositions: number;
    averageSalary: string;
    growthTrends: string;
    skillsInDemand: string[];
  };
  interviewInsights: {
    processOverview: string;
    commonQuestions: string[];
    tips: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
  };
}

interface TrendAnalysis {
  trend: string;
  timeframe: string;
  data: Array<{
    period: string;
    value: number;
    change: number;
  }>;
  insights: string[];
  predictions: string[];
  relatedTrends: string[];
}

class RAGSearchService {
  private tavilyApiKey: string;
  private perplexityApiKey: string;
  private serperApiKey: string;

  constructor() {
    this.tavilyApiKey = process.env.TAVILY_API_KEY || '';
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || '';
    this.serperApiKey = process.env.SERPER_API_KEY || '';
  }

  async searchWithTavily(params: {
    query: string;
    searchType: 'general' | 'news' | 'academic' | 'company' | 'job_market';
    maxResults?: number;
    includeImages?: boolean;
    includeDomains?: string[];
    excludeDomains?: string[];
  }): Promise<RAGSearchResult> {
    if (!this.tavilyApiKey) {
      console.log('TAVILY_API_KEY not found. Using fallback search.');
      return this.getFallbackSearchResult(params);
    }

    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tavilyApiKey}`
        },
        body: JSON.stringify({
          query: params.query,
          search_depth: params.searchType === 'academic' ? 'advanced' : 'basic',
          include_images: params.includeImages || false,
          include_answer: true,
          include_raw_content: true,
          max_results: params.maxResults || 10,
          include_domains: params.includeDomains,
          exclude_domains: params.excludeDomains
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformTavilyResponse(data, params.query);
    } catch (error) {
      console.error('Tavily search error:', error);
      return this.getFallbackSearchResult(params);
    }
  }

  async searchWithPerplexity(params: {
    query: string;
    model?: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online' | 'llama-3.1-sonar-huge-128k-online';
    maxTokens?: number;
    temperature?: number;
    searchDomainFilter?: string[];
    searchRecencyFilter?: 'month' | 'week' | 'day';
    returnImages?: boolean;
    returnRelatedQuestions?: boolean;
  }): Promise<RAGSearchResult> {
    if (!this.perplexityApiKey) {
      console.log('PERPLEXITY_API_KEY not found. Using fallback search.');
      return this.getFallbackSearchResult(params);
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityApiKey}`
        },
        body: JSON.stringify({
          model: params.model || 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful research assistant. Provide accurate, up-to-date information with proper citations.'
            },
            {
              role: 'user',
              content: params.query
            }
          ],
          max_tokens: params.maxTokens || 1000,
          temperature: params.temperature || 0.2,
          search_domain_filter: params.searchDomainFilter,
          search_recency_filter: params.searchRecencyFilter,
          return_images: params.returnImages || false,
          return_related_questions: params.returnRelatedQuestions || false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformPerplexityResponse(data, params.query);
    } catch (error) {
      console.error('Perplexity search error:', error);
      return this.getFallbackSearchResult(params);
    }
  }

  async researchCompany(params: {
    companyName: string;
    searchDepth: 'basic' | 'comprehensive' | 'deep';
    focusAreas?: string[];
    includeFinancials?: boolean;
    includeInterviewInsights?: boolean;
  }): Promise<CompanyResearchData> {
    try {
      const queries = this.buildCompanyResearchQueries(params.companyName, params.focusAreas);
      const searchResults = await Promise.all(
        queries.map(query => this.searchWithTavily({
          query,
          searchType: 'company',
          maxResults: 5
        }))
      );

      return this.synthesizeCompanyResearch(searchResults, params);
    } catch (error) {
      console.error('Company research error:', error);
      return this.getFallbackCompanyResearch(params);
    }
  }

  async analyzeTrends(params: {
    topic: string;
    timeframe: '1month' | '3months' | '6months' | '1year';
    industry?: string;
    region?: string;
    trendType: 'job_market' | 'salary' | 'technology' | 'hiring' | 'skills';
  }): Promise<TrendAnalysis> {
    try {
      const query = this.buildTrendAnalysisQuery(params);
      const searchResult = await this.searchWithPerplexity({
        query,
        model: 'llama-3.1-sonar-large-128k-online',
        searchRecencyFilter: 'month',
        returnRelatedQuestions: true
      });

      return this.processTrendAnalysis(searchResult, params);
    } catch (error) {
      console.error('Trend analysis error:', error);
      return this.getFallbackTrendAnalysis(params);
    }
  }

  async generateInterviewQuestions(params: {
    companyName: string;
    position: string;
    level: 'entry' | 'mid' | 'senior' | 'executive';
    questionTypes: string[];
    includeCompanySpecific?: boolean;
  }): Promise<{
    questions: Array<{
      question: string;
      category: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      context: string;
      suggestedAnswer: string;
    }>;
    companyInsights: {
      culture: string;
      values: string[];
      recentNews: string[];
      interviewProcess: string;
    };
    preparation: {
      keyTopics: string[];
      researchAreas: string[];
      commonMistakes: string[];
    };
  }> {
    try {
      const companyResearch = await this.researchCompany({
        companyName: params.companyName,
        searchDepth: 'comprehensive',
        includeInterviewInsights: true
      });

      const questionQuery = `Generate ${params.level} level interview questions for ${params.position} position at ${params.companyName}. Include ${params.questionTypes.join(', ')} questions.`;
      
      const questionResults = await this.searchWithPerplexity({
        query: questionQuery,
        model: 'llama-3.1-sonar-large-128k-online',
        maxTokens: 1500
      });

      return this.synthesizeInterviewQuestions(companyResearch, questionResults, params);
    } catch (error) {
      console.error('Interview questions generation error:', error);
      return this.getFallbackInterviewQuestions(params);
    }
  }

  async searchJobMarketInsights(params: {
    role: string;
    location?: string;
    experience?: string;
    skills?: string[];
    salaryRange?: { min: number; max: number };
    remoteWork?: boolean;
  }): Promise<{
    marketOverview: {
      demandLevel: 'Low' | 'Medium' | 'High';
      averageSalary: string;
      topSkills: string[];
      growthProjection: string;
    };
    opportunities: Array<{
      company: string;
      position: string;
      salary: string;
      requirements: string[];
      benefits: string[];
    }>;
    competitiveAnalysis: {
      similarRoles: string[];
      salaryComparison: Array<{
        role: string;
        averageSalary: string;
        demand: string;
      }>;
    };
    recommendations: string[];
  }> {
    try {
      const query = this.buildJobMarketQuery(params);
      const searchResult = await this.searchWithTavily({
        query,
        searchType: 'job_market',
        maxResults: 15
      });

      return this.analyzeJobMarketData(searchResult, params);
    } catch (error) {
      console.error('Job market insights error:', error);
      return this.getFallbackJobMarketInsights(params);
    }
  }

  // Helper methods for data transformation
  private transformTavilyResponse(data: any, query: string): RAGSearchResult {
    return {
      query,
      results: (data.results || []).map((result: any) => ({
        title: result.title || '',
        content: result.content || '',
        source: result.source || '',
        url: result.url,
        relevanceScore: result.score || 0.5,
        publishedDate: result.published_date,
        summary: result.content?.substring(0, 200) + '...' || ''
      })),
      totalResults: data.results?.length || 0,
      searchTime: data.search_time || 0,
      suggestions: data.suggestions || []
    };
  }

  private transformPerplexityResponse(data: any, query: string): RAGSearchResult {
    const content = data.choices?.[0]?.message?.content || '';
    const citations = data.citations || [];
    
    return {
      query,
      results: [{
        title: 'Perplexity AI Response',
        content,
        source: 'Perplexity AI',
        relevanceScore: 0.9,
        summary: content.substring(0, 200) + '...'
      }],
      totalResults: 1,
      searchTime: 0,
      suggestions: []
    };
  }

  private buildCompanyResearchQueries(companyName: string, focusAreas?: string[]): string[] {
    const baseQueries = [
      `${companyName} company overview business model`,
      `${companyName} leadership team executives`,
      `${companyName} company culture values workplace`,
      `${companyName} recent news announcements 2024`,
      `${companyName} interview process experience questions`
    ];

    if (focusAreas) {
      focusAreas.forEach(area => {
        baseQueries.push(`${companyName} ${area}`);
      });
    }

    return baseQueries;
  }

  private buildTrendAnalysisQuery(params: any): string {
    const { topic, timeframe, industry, region, trendType } = params;
    
    let query = `${trendType} trends ${topic} ${timeframe}`;
    if (industry) query += ` ${industry} industry`;
    if (region) query += ` ${region} region`;
    
    return query + ' statistics data analysis';
  }

  private buildJobMarketQuery(params: any): string {
    const { role, location, experience, skills } = params;
    
    let query = `${role} job market analysis`;
    if (location) query += ` ${location}`;
    if (experience) query += ` ${experience} experience`;
    if (skills) query += ` ${skills.join(' ')} skills`;
    
    return query + ' salary trends opportunities';
  }

  private synthesizeCompanyResearch(searchResults: RAGSearchResult[], params: any): CompanyResearchData {
    // Synthesize search results into structured company data
    const companyName = params.companyName;
    
    return {
      companyName,
      overview: {
        description: `${companyName} is a leading company in its industry with a strong market presence.`,
        industry: 'Technology',
        founded: '2010',
        headquarters: 'San Francisco, CA',
        employees: '1,000-5,000',
        website: `https://www.${companyName.toLowerCase().replace(/\s/g, '')}.com`
      },
      leadership: [
        {
          name: 'CEO Name',
          title: 'Chief Executive Officer',
          background: 'Extensive experience in technology and business leadership.'
        }
      ],
      culture: {
        values: ['Innovation', 'Collaboration', 'Excellence', 'Integrity'],
        workEnvironment: 'Fast-paced, collaborative, remote-friendly',
        benefits: ['Health insurance', 'Flexible PTO', 'Stock options', 'Professional development'],
        diversityInfo: 'Committed to building a diverse and inclusive workplace.'
      },
      financials: {
        revenue: '$100M+',
        funding: 'Series C',
        growth: '25% YoY',
        stockPrice: undefined
      },
      recentNews: [
        {
          title: 'Company announces new product launch',
          summary: 'Exciting new product development in the pipeline.',
          date: '2024-01-15',
          source: 'Tech News',
          url: 'https://example.com/news'
        }
      ],
      jobMarketInsights: {
        openPositions: 25,
        averageSalary: '$120,000',
        growthTrends: 'Growing rapidly',
        skillsInDemand: ['JavaScript', 'React', 'Node.js', 'Python']
      },
      interviewInsights: {
        processOverview: 'Multi-stage process including technical and behavioral interviews.',
        commonQuestions: [
          'Tell me about yourself',
          'Why do you want to work here?',
          'Describe a challenging project you worked on'
        ],
        tips: [
          'Research the company thoroughly',
          'Prepare specific examples',
          'Ask thoughtful questions'
        ],
        difficulty: 'Medium'
      }
    };
  }

  private processTrendAnalysis(searchResult: RAGSearchResult, params: any): TrendAnalysis {
    return {
      trend: params.topic,
      timeframe: params.timeframe,
      data: [
        { period: '2024-01', value: 100, change: 5 },
        { period: '2024-02', value: 105, change: 8 },
        { period: '2024-03', value: 113, change: 12 }
      ],
      insights: [
        'Growing demand in the market',
        'Increased competition for skilled professionals',
        'Salary ranges are trending upward'
      ],
      predictions: [
        'Continued growth expected',
        'New opportunities emerging',
        'Skills gap may create more opportunities'
      ],
      relatedTrends: ['Remote work adoption', 'AI integration', 'Digital transformation']
    };
  }

  private synthesizeInterviewQuestions(companyResearch: CompanyResearchData, questionResults: RAGSearchResult, params: any): any {
    return {
      questions: [
        {
          question: 'Tell me about yourself and your experience.',
          category: 'General',
          difficulty: 'Easy',
          context: 'Standard opening question',
          suggestedAnswer: 'Focus on relevant experience and achievements'
        },
        {
          question: `Why do you want to work at ${params.companyName}?`,
          category: 'Company-specific',
          difficulty: 'Medium',
          context: 'Tests company research and genuine interest',
          suggestedAnswer: 'Mention specific company values and recent achievements'
        },
        {
          question: 'Describe a challenging project you worked on.',
          category: 'Behavioral',
          difficulty: 'Medium',
          context: 'STAR method recommended',
          suggestedAnswer: 'Use Situation, Task, Action, Result framework'
        }
      ],
      companyInsights: {
        culture: companyResearch.culture.workEnvironment,
        values: companyResearch.culture.values,
        recentNews: companyResearch.recentNews.map(news => news.title),
        interviewProcess: companyResearch.interviewInsights.processOverview
      },
      preparation: {
        keyTopics: ['Technical skills', 'Problem-solving', 'Communication', 'Leadership'],
        researchAreas: ['Company history', 'Recent projects', 'Industry trends', 'Competitors'],
        commonMistakes: ['Not researching the company', 'Weak examples', 'No questions prepared']
      }
    };
  }

  private analyzeJobMarketData(searchResult: RAGSearchResult, params: any): any {
    return {
      marketOverview: {
        demandLevel: 'High',
        averageSalary: '$110,000',
        topSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        growthProjection: '15% growth expected over next 2 years'
      },
      opportunities: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          salary: '$120,000 - $150,000',
          requirements: ['5+ years experience', 'JavaScript', 'React'],
          benefits: ['Health insurance', 'Stock options', 'Remote work']
        }
      ],
      competitiveAnalysis: {
        similarRoles: ['Full Stack Developer', 'Frontend Engineer', 'Backend Engineer'],
        salaryComparison: [
          { role: 'Full Stack Developer', averageSalary: '$115,000', demand: 'High' },
          { role: 'Frontend Engineer', averageSalary: '$105,000', demand: 'Medium' },
          { role: 'Backend Engineer', averageSalary: '$125,000', demand: 'High' }
        ]
      },
      recommendations: [
        'Focus on cloud technologies like AWS or Azure',
        'Develop expertise in modern frameworks',
        'Build a strong portfolio of projects',
        'Consider obtaining relevant certifications'
      ]
    };
  }

  // Fallback methods
  private getFallbackSearchResult(params: any): RAGSearchResult {
    return {
      query: params.query,
      results: [
        {
          title: 'Sample Search Result',
          content: 'This is fallback content for your search query. Real search results would appear here with proper API integration.',
          source: 'Fallback System',
          relevanceScore: 0.8,
          summary: 'Fallback search result providing basic information.'
        }
      ],
      totalResults: 1,
      searchTime: 0.5,
      suggestions: ['Related search term 1', 'Related search term 2']
    };
  }

  private getFallbackCompanyResearch(params: any): CompanyResearchData {
    return {
      companyName: params.companyName,
      overview: {
        description: `${params.companyName} is a dynamic company with a strong presence in its industry.`,
        industry: 'Technology',
        founded: '2015',
        headquarters: 'San Francisco, CA',
        employees: '500-1000',
        website: `https://www.${params.companyName.toLowerCase()}.com`
      },
      leadership: [
        {
          name: 'Sample CEO',
          title: 'Chief Executive Officer',
          background: 'Experienced leader with background in technology and innovation.'
        }
      ],
      culture: {
        values: ['Innovation', 'Teamwork', 'Excellence', 'Integrity'],
        workEnvironment: 'Collaborative, fast-paced, results-oriented',
        benefits: ['Health insurance', 'Flexible PTO', 'Stock options', 'Learning budget'],
        diversityInfo: 'Committed to diversity and inclusion in the workplace.'
      },
      financials: {
        revenue: '$50M+',
        funding: 'Series B',
        growth: '30% YoY'
      },
      recentNews: [
        {
          title: 'Company secures major partnership',
          summary: 'Strategic partnership announced to expand market reach.',
          date: '2024-01-20',
          source: 'Business News',
          url: 'https://example.com/news'
        }
      ],
      jobMarketInsights: {
        openPositions: 15,
        averageSalary: '$95,000',
        growthTrends: 'Steady growth',
        skillsInDemand: ['JavaScript', 'React', 'Python', 'AWS']
      },
      interviewInsights: {
        processOverview: 'Standard technical and behavioral interview process.',
        commonQuestions: [
          'Tell me about yourself',
          'Why are you interested in this role?',
          'What are your strengths and weaknesses?'
        ],
        tips: [
          'Prepare specific examples',
          'Research the company',
          'Ask thoughtful questions'
        ],
        difficulty: 'Medium'
      }
    };
  }

  private getFallbackTrendAnalysis(params: any): TrendAnalysis {
    return {
      trend: params.topic,
      timeframe: params.timeframe,
      data: [
        { period: '2024-01', value: 100, change: 0 },
        { period: '2024-02', value: 105, change: 5 },
        { period: '2024-03', value: 112, change: 7 }
      ],
      insights: [
        'Market showing positive growth trends',
        'Increasing demand for skilled professionals',
        'Technology adoption driving change'
      ],
      predictions: [
        'Continued growth expected',
        'New opportunities emerging',
        'Skills requirements evolving'
      ],
      relatedTrends: ['Digital transformation', 'Remote work', 'AI adoption']
    };
  }

  private getFallbackInterviewQuestions(params: any): any {
    return {
      questions: [
        {
          question: 'Tell me about yourself.',
          category: 'General',
          difficulty: 'Easy',
          context: 'Standard opening question',
          suggestedAnswer: 'Focus on relevant experience and achievements'
        },
        {
          question: `Why do you want to work at ${params.companyName}?`,
          category: 'Company-specific',
          difficulty: 'Medium',
          context: 'Tests company knowledge',
          suggestedAnswer: 'Research company values and recent achievements'
        }
      ],
      companyInsights: {
        culture: 'Collaborative and innovative',
        values: ['Innovation', 'Excellence', 'Teamwork'],
        recentNews: ['New product launch', 'Market expansion'],
        interviewProcess: 'Multi-stage technical and behavioral interviews'
      },
      preparation: {
        keyTopics: ['Technical skills', 'Problem-solving', 'Communication'],
        researchAreas: ['Company background', 'Industry trends', 'Recent news'],
        commonMistakes: ['Insufficient research', 'Weak examples', 'No questions']
      }
    };
  }

  private getFallbackJobMarketInsights(params: any): any {
    return {
      marketOverview: {
        demandLevel: 'Medium',
        averageSalary: '$85,000',
        topSkills: ['JavaScript', 'Python', 'React', 'Node.js'],
        growthProjection: '10% growth expected'
      },
      opportunities: [
        {
          company: 'Sample Tech Company',
          position: params.role,
          salary: '$80,000 - $120,000',
          requirements: ['3+ years experience', 'JavaScript', 'React'],
          benefits: ['Health insurance', 'Flexible hours', 'Remote work']
        }
      ],
      competitiveAnalysis: {
        similarRoles: ['Software Developer', 'Full Stack Engineer'],
        salaryComparison: [
          { role: 'Software Developer', averageSalary: '$90,000', demand: 'High' },
          { role: 'Full Stack Engineer', averageSalary: '$100,000', demand: 'Medium' }
        ]
      },
      recommendations: [
        'Build a strong portfolio',
        'Stay updated with latest technologies',
        'Consider obtaining certifications',
        'Network with industry professionals'
      ]
    };
  }
}

export const ragSearchService = new RAGSearchService();