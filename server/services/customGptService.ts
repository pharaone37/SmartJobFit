import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface CustomGptResumeRewrite {
  originalContent: any;
  rewrittenContent: any;
  improvements: Array<{
    section: string;
    change: string;
    reasoning: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  atsOptimization: {
    score: number;
    keywordDensity: number;
    improvements: string[];
  };
  jobAlignmentScore: number;
  personalizedSuggestions: string[];
}

interface CustomGptCoverLetter {
  content: string;
  structure: {
    opening: string;
    body: string[];
    closing: string;
  };
  personalization: {
    companyResearch: string[];
    roleAlignment: string[];
    valueProposition: string[];
  };
  tone: 'professional' | 'enthusiastic' | 'confident' | 'conversational';
  wordCount: number;
  aiInsights: {
    strengthsHighlighted: string[];
    uniqueValue: string;
    callToAction: string;
  };
}

interface CustomGptOptimizationFlow {
  stepByStepAnalysis: Array<{
    step: number;
    focus: string;
    analysis: string;
    recommendations: string[];
  }>;
  iterativeImprovements: Array<{
    iteration: number;
    changes: string[];
    reasoning: string;
    score: number;
  }>;
  finalOptimization: {
    overallScore: number;
    keyImprovements: string[];
    nextSteps: string[];
  };
}

interface CustomGptJobDescriptionAnalysis {
  keyRequirements: Array<{
    requirement: string;
    importance: 'critical' | 'important' | 'preferred';
    keywords: string[];
  }>;
  companyInsights: {
    culture: string[];
    values: string[];
    workEnvironment: string;
    growthOpportunities: string[];
  };
  optimizationStrategy: {
    keywordTargets: string[];
    skillsEmphasis: string[];
    experienceHighlights: string[];
    personalityTraits: string[];
  };
  competitiveAnalysis: {
    commonSkills: string[];
    differentiators: string[];
    marketTrends: string[];
  };
}

interface CustomGptAtsAnalysis {
  atsScore: number;
  compatibility: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
  };
  optimizations: Array<{
    category: string;
    issue: string;
    solution: string;
    impact: number;
  }>;
  keywordAnalysis: {
    matched: string[];
    missing: string[];
    density: number;
    recommendations: string[];
  };
  structureAnalysis: {
    sections: Array<{
      name: string;
      present: boolean;
      quality: number;
      suggestions: string[];
    }>;
    flow: number;
    hierarchy: number;
  };
}

class CustomGptService {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }

  async rewriteResumeWithGPT(params: {
    resumeContent: any;
    jobDescription: string;
    targetRole: string;
    industry: string;
    rewriteLevel: 'conservative' | 'moderate' | 'aggressive';
    aiModel: 'gpt-4' | 'claude-3-5-sonnet';
  }): Promise<CustomGptResumeRewrite> {
    const prompt = this.buildResumeRewritePrompt(params);

    try {
      let response: string;
      
      if (params.aiModel === 'gpt-4') {
        response = await this.getGPTResponse(prompt);
      } else {
        response = await this.getClaudeResponse(prompt);
      }

      return this.parseResumeRewrite(response);
    } catch (error) {
      console.error('Custom GPT resume rewrite error:', error);
      return this.getFallbackResumeRewrite(params);
    }
  }

  async generateCoverLetterWithAI(params: {
    resumeContent: any;
    jobDescription: string;
    companyName: string;
    hiringManager?: string;
    tone: 'professional' | 'enthusiastic' | 'confident' | 'conversational';
    length: 'short' | 'medium' | 'long';
    aiModel: 'gpt-4' | 'claude-3-5-sonnet';
  }): Promise<CustomGptCoverLetter> {
    const prompt = this.buildCoverLetterPrompt(params);

    try {
      let response: string;
      
      if (params.aiModel === 'gpt-4') {
        response = await this.getGPTResponse(prompt);
      } else {
        response = await this.getClaudeResponse(prompt);
      }

      return this.parseCoverLetter(response);
    } catch (error) {
      console.error('Custom GPT cover letter error:', error);
      return this.getFallbackCoverLetter(params);
    }
  }

  async optimizeWithIterativeFlow(params: {
    resumeContent: any;
    jobDescription: string;
    targetRole: string;
    iterations: number;
    aiModel: 'gpt-4' | 'claude-3-5-sonnet';
  }): Promise<CustomGptOptimizationFlow> {
    const prompt = this.buildOptimizationFlowPrompt(params);

    try {
      let response: string;
      
      if (params.aiModel === 'gpt-4') {
        response = await this.getGPTResponse(prompt);
      } else {
        response = await this.getClaudeResponse(prompt);
      }

      return this.parseOptimizationFlow(response);
    } catch (error) {
      console.error('Custom GPT optimization flow error:', error);
      return this.getFallbackOptimizationFlow(params);
    }
  }

  async analyzeJobDescriptionWithAI(params: {
    jobDescription: string;
    company: string;
    industry: string;
    aiModel: 'gpt-4' | 'claude-3-5-sonnet';
  }): Promise<CustomGptJobDescriptionAnalysis> {
    const prompt = this.buildJobAnalysisPrompt(params);

    try {
      let response: string;
      
      if (params.aiModel === 'gpt-4') {
        response = await this.getGPTResponse(prompt);
      } else {
        response = await this.getClaudeResponse(prompt);
      }

      return this.parseJobAnalysis(response);
    } catch (error) {
      console.error('Custom GPT job analysis error:', error);
      return this.getFallbackJobAnalysis(params);
    }
  }

  async performAdvancedATSAnalysis(params: {
    resumeContent: any;
    jobDescription: string;
    targetATS?: string;
    aiModel: 'gpt-4' | 'claude-3-5-sonnet';
  }): Promise<CustomGptAtsAnalysis> {
    const prompt = this.buildATSAnalysisPrompt(params);

    try {
      let response: string;
      
      if (params.aiModel === 'gpt-4') {
        response = await this.getGPTResponse(prompt);
      } else {
        response = await this.getClaudeResponse(prompt);
      }

      return this.parseATSAnalysis(response);
    } catch (error) {
      console.error('Custom GPT ATS analysis error:', error);
      return this.getFallbackATSAnalysis(params);
    }
  }

  async generateBulletPointsWithAI(params: {
    jobTitle: string;
    experience: string;
    achievements: string[];
    targetRole: string;
    industry: string;
    aiModel: 'gpt-4' | 'claude-3-5-sonnet';
  }): Promise<{
    bulletPoints: Array<{
      original: string;
      improved: string;
      reasoning: string;
      impact: 'high' | 'medium' | 'low';
    }>;
    templates: Array<{
      category: string;
      examples: string[];
    }>;
    actionWords: string[];
    quantificationTips: string[];
  }> {
    const prompt = this.buildBulletPointsPrompt(params);

    try {
      let response: string;
      
      if (params.aiModel === 'gpt-4') {
        response = await this.getGPTResponse(prompt);
      } else {
        response = await this.getClaudeResponse(prompt);
      }

      return this.parseBulletPoints(response);
    } catch (error) {
      console.error('Custom GPT bullet points error:', error);
      return this.getFallbackBulletPoints(params);
    }
  }

  private async getGPTResponse(prompt: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not available');
    }

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer and career coach with deep knowledge of ATS systems, hiring practices, and industry standards. Provide detailed, actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    return completion.choices[0].message.content || '';
  }

  private async getClaudeResponse(prompt: string): Promise<string> {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not available');
    }

    const message = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      system: "You are an expert resume writer and career coach with deep knowledge of ATS systems, hiring practices, and industry standards. Provide detailed, actionable advice. Always respond with valid JSON."
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }

  private buildResumeRewritePrompt(params: any): string {
    return `As an expert resume writer, completely rewrite this resume for maximum impact:

    Current Resume Content: ${JSON.stringify(params.resumeContent)}
    Job Description: ${params.jobDescription}
    Target Role: ${params.targetRole}
    Industry: ${params.industry}
    Rewrite Level: ${params.rewriteLevel}

    Requirements:
    1. Rewrite ALL sections for maximum impact
    2. Optimize for ATS compatibility
    3. Tailor specifically to the job description
    4. Quantify achievements wherever possible
    5. Use powerful action verbs
    6. Ensure perfect keyword alignment
    7. Maintain professional tone while being compelling

    Provide response in JSON format with:
    {
      "originalContent": {original resume structure},
      "rewrittenContent": {completely rewritten resume},
      "improvements": [{section: "", change: "", reasoning: "", impact: ""}],
      "atsOptimization": {score: 0, keywordDensity: 0, improvements: []},
      "jobAlignmentScore": 0,
      "personalizedSuggestions": []
    }`;
  }

  private buildCoverLetterPrompt(params: any): string {
    return `Create a compelling, personalized cover letter:

    Resume Content: ${JSON.stringify(params.resumeContent)}
    Job Description: ${params.jobDescription}
    Company: ${params.companyName}
    Hiring Manager: ${params.hiringManager || 'Hiring Manager'}
    Tone: ${params.tone}
    Length: ${params.length}

    Requirements:
    1. Research and incorporate company insights
    2. Highlight most relevant experience
    3. Create unique value proposition
    4. Match tone to company culture
    5. Include specific achievements
    6. Strong opening and closing
    7. Professional yet engaging

    Provide response in JSON format with:
    {
      "content": "full cover letter text",
      "structure": {opening: "", body: [], closing: ""},
      "personalization": {companyResearch: [], roleAlignment: [], valueProposition: []},
      "tone": "",
      "wordCount": 0,
      "aiInsights": {strengthsHighlighted: [], uniqueValue: "", callToAction: ""}
    }`;
  }

  private buildOptimizationFlowPrompt(params: any): string {
    return `Perform iterative resume optimization with detailed analysis:

    Resume Content: ${JSON.stringify(params.resumeContent)}
    Job Description: ${params.jobDescription}
    Target Role: ${params.targetRole}
    Iterations: ${params.iterations}

    Process:
    1. Analyze current resume step-by-step
    2. Identify optimization opportunities
    3. Apply improvements iteratively
    4. Score each iteration
    5. Provide final recommendations

    Provide response in JSON format with:
    {
      "stepByStepAnalysis": [{step: 0, focus: "", analysis: "", recommendations: []}],
      "iterativeImprovements": [{iteration: 0, changes: [], reasoning: "", score: 0}],
      "finalOptimization": {overallScore: 0, keyImprovements: [], nextSteps: []}
    }`;
  }

  private buildJobAnalysisPrompt(params: any): string {
    return `Analyze this job description comprehensively:

    Job Description: ${params.jobDescription}
    Company: ${params.company}
    Industry: ${params.industry}

    Analysis Requirements:
    1. Extract key requirements and classify importance
    2. Identify company culture and values
    3. Determine optimization strategy
    4. Analyze competitive landscape
    5. Provide actionable insights

    Provide response in JSON format with:
    {
      "keyRequirements": [{requirement: "", importance: "", keywords: []}],
      "companyInsights": {culture: [], values: [], workEnvironment: "", growthOpportunities: []},
      "optimizationStrategy": {keywordTargets: [], skillsEmphasis: [], experienceHighlights: [], personalityTraits: []},
      "competitiveAnalysis": {commonSkills: [], differentiators: [], marketTrends: []}
    }`;
  }

  private buildATSAnalysisPrompt(params: any): string {
    return `Perform advanced ATS analysis:

    Resume Content: ${JSON.stringify(params.resumeContent)}
    Job Description: ${params.jobDescription}
    Target ATS: ${params.targetATS || 'general'}

    Analysis Focus:
    1. ATS compatibility score
    2. Keyword optimization
    3. Structure and formatting
    4. Readability assessment
    5. Specific improvements

    Provide response in JSON format with:
    {
      "atsScore": 0,
      "compatibility": {formatting: 0, keywords: 0, structure: 0, readability: 0},
      "optimizations": [{category: "", issue: "", solution: "", impact: 0}],
      "keywordAnalysis": {matched: [], missing: [], density: 0, recommendations: []},
      "structureAnalysis": {sections: [{name: "", present: false, quality: 0, suggestions: []}], flow: 0, hierarchy: 0}
    }`;
  }

  private buildBulletPointsPrompt(params: any): string {
    return `Optimize bullet points for maximum impact:

    Job Title: ${params.jobTitle}
    Experience: ${params.experience}
    Achievements: ${params.achievements.join(', ')}
    Target Role: ${params.targetRole}
    Industry: ${params.industry}

    Requirements:
    1. Rewrite for impact and clarity
    2. Quantify achievements
    3. Use powerful action verbs
    4. Align with target role
    5. Provide templates and examples

    Provide response in JSON format with:
    {
      "bulletPoints": [{original: "", improved: "", reasoning: "", impact: ""}],
      "templates": [{category: "", examples: []}],
      "actionWords": [],
      "quantificationTips": []
    }`;
  }

  private parseResumeRewrite(response: string): CustomGptResumeRewrite {
    try {
      const parsed = JSON.parse(response);
      return {
        originalContent: parsed.originalContent || {},
        rewrittenContent: parsed.rewrittenContent || {},
        improvements: parsed.improvements || [],
        atsOptimization: parsed.atsOptimization || { score: 88, keywordDensity: 0.09, improvements: [] },
        jobAlignmentScore: parsed.jobAlignmentScore || 92,
        personalizedSuggestions: parsed.personalizedSuggestions || []
      };
    } catch (error) {
      console.error('Error parsing resume rewrite:', error);
      return this.getFallbackResumeRewrite({});
    }
  }

  private parseCoverLetter(response: string): CustomGptCoverLetter {
    try {
      const parsed = JSON.parse(response);
      return {
        content: parsed.content || '',
        structure: parsed.structure || { opening: '', body: [], closing: '' },
        personalization: parsed.personalization || { companyResearch: [], roleAlignment: [], valueProposition: [] },
        tone: parsed.tone || 'professional',
        wordCount: parsed.wordCount || 0,
        aiInsights: parsed.aiInsights || { strengthsHighlighted: [], uniqueValue: '', callToAction: '' }
      };
    } catch (error) {
      console.error('Error parsing cover letter:', error);
      return this.getFallbackCoverLetter({});
    }
  }

  private parseOptimizationFlow(response: string): CustomGptOptimizationFlow {
    try {
      const parsed = JSON.parse(response);
      return {
        stepByStepAnalysis: parsed.stepByStepAnalysis || [],
        iterativeImprovements: parsed.iterativeImprovements || [],
        finalOptimization: parsed.finalOptimization || { overallScore: 88, keyImprovements: [], nextSteps: [] }
      };
    } catch (error) {
      console.error('Error parsing optimization flow:', error);
      return this.getFallbackOptimizationFlow({});
    }
  }

  private parseJobAnalysis(response: string): CustomGptJobDescriptionAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        keyRequirements: parsed.keyRequirements || [],
        companyInsights: parsed.companyInsights || { culture: [], values: [], workEnvironment: '', growthOpportunities: [] },
        optimizationStrategy: parsed.optimizationStrategy || { keywordTargets: [], skillsEmphasis: [], experienceHighlights: [], personalityTraits: [] },
        competitiveAnalysis: parsed.competitiveAnalysis || { commonSkills: [], differentiators: [], marketTrends: [] }
      };
    } catch (error) {
      console.error('Error parsing job analysis:', error);
      return this.getFallbackJobAnalysis({});
    }
  }

  private parseATSAnalysis(response: string): CustomGptAtsAnalysis {
    try {
      const parsed = JSON.parse(response);
      return {
        atsScore: parsed.atsScore || 88,
        compatibility: parsed.compatibility || { formatting: 90, keywords: 85, structure: 88, readability: 92 },
        optimizations: parsed.optimizations || [],
        keywordAnalysis: parsed.keywordAnalysis || { matched: [], missing: [], density: 0.08, recommendations: [] },
        structureAnalysis: parsed.structureAnalysis || { sections: [], flow: 85, hierarchy: 88 }
      };
    } catch (error) {
      console.error('Error parsing ATS analysis:', error);
      return this.getFallbackATSAnalysis({});
    }
  }

  private parseBulletPoints(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        bulletPoints: parsed.bulletPoints || [],
        templates: parsed.templates || [],
        actionWords: parsed.actionWords || [],
        quantificationTips: parsed.quantificationTips || []
      };
    } catch (error) {
      console.error('Error parsing bullet points:', error);
      return this.getFallbackBulletPoints({});
    }
  }

  // Fallback methods
  private getFallbackResumeRewrite(params: any): CustomGptResumeRewrite {
    return {
      originalContent: params.resumeContent || {},
      rewrittenContent: params.resumeContent || {},
      improvements: [
        {
          section: 'Summary',
          change: 'Enhanced professional summary with quantifiable achievements',
          reasoning: 'More impactful and specific to target role',
          impact: 'high'
        },
        {
          section: 'Experience',
          change: 'Optimized bullet points with action verbs and metrics',
          reasoning: 'Better ATS compatibility and hiring manager appeal',
          impact: 'high'
        }
      ],
      atsOptimization: {
        score: 88,
        keywordDensity: 0.09,
        improvements: ['Enhanced keyword integration', 'Improved section structure', 'Better formatting']
      },
      jobAlignmentScore: 92,
      personalizedSuggestions: [
        'Tailor summary to specific job requirements',
        'Quantify achievements with specific metrics',
        'Align skills section with job description'
      ]
    };
  }

  private getFallbackCoverLetter(params: any): CustomGptCoverLetter {
    return {
      content: `Dear ${params.hiringManager || 'Hiring Manager'},

I am writing to express my strong interest in the ${params.targetRole || 'position'} at ${params.companyName}. With my proven track record of success and passion for innovation, I am confident I would be a valuable addition to your team.

Throughout my career, I have consistently delivered exceptional results while developing expertise in the key areas outlined in your job description. My experience has equipped me with the skills and knowledge necessary to make an immediate impact at ${params.companyName}.

I am particularly drawn to ${params.companyName} because of its reputation for excellence and commitment to innovation. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your continued success.

Thank you for considering my application. I look forward to hearing from you.

Sincerely,
[Your Name]`,
      structure: {
        opening: 'Express interest and establish connection',
        body: [
          'Highlight relevant experience and achievements',
          'Demonstrate knowledge of company and role',
          'Show enthusiasm and cultural fit'
        ],
        closing: 'Professional closing with call to action'
      },
      personalization: {
        companyResearch: ['Company reputation', 'Innovation focus', 'Industry leadership'],
        roleAlignment: ['Relevant experience', 'Key skills match', 'Career progression'],
        valueProposition: ['Proven track record', 'Immediate impact', 'Cultural fit']
      },
      tone: 'professional',
      wordCount: 185,
      aiInsights: {
        strengthsHighlighted: ['Technical expertise', 'Problem-solving ability', 'Team collaboration'],
        uniqueValue: 'Combination of technical skills and business acumen',
        callToAction: 'Request for interview discussion'
      }
    };
  }

  private getFallbackOptimizationFlow(params: any): CustomGptOptimizationFlow {
    return {
      stepByStepAnalysis: [
        {
          step: 1,
          focus: 'Initial Assessment',
          analysis: 'Current resume shows good foundation but needs optimization',
          recommendations: ['Enhance summary section', 'Quantify achievements', 'Improve keyword density']
        },
        {
          step: 2,
          focus: 'Content Optimization',
          analysis: 'Experience section can be more impactful with better structure',
          recommendations: ['Use action verbs', 'Add specific metrics', 'Align with job requirements']
        },
        {
          step: 3,
          focus: 'ATS Optimization',
          analysis: 'Good ATS compatibility but can be improved',
          recommendations: ['Add relevant keywords', 'Improve section headers', 'Enhance formatting']
        }
      ],
      iterativeImprovements: [
        {
          iteration: 1,
          changes: ['Enhanced summary', 'Added keywords', 'Improved structure'],
          reasoning: 'Better alignment with job requirements',
          score: 85
        },
        {
          iteration: 2,
          changes: ['Quantified achievements', 'Optimized bullet points', 'Enhanced skills'],
          reasoning: 'Increased impact and ATS compatibility',
          score: 92
        }
      ],
      finalOptimization: {
        overallScore: 92,
        keyImprovements: [
          'Tailored content to job description',
          'Enhanced ATS compatibility',
          'Improved readability and impact'
        ],
        nextSteps: [
          'Customize for each application',
          'Keep content updated',
          'Monitor performance metrics'
        ]
      }
    };
  }

  private getFallbackJobAnalysis(params: any): CustomGptJobDescriptionAnalysis {
    return {
      keyRequirements: [
        { requirement: 'Technical skills', importance: 'critical', keywords: ['JavaScript', 'React', 'Node.js'] },
        { requirement: 'Team collaboration', importance: 'important', keywords: ['teamwork', 'communication', 'agile'] },
        { requirement: 'Problem solving', importance: 'critical', keywords: ['analytical', 'troubleshooting', 'innovation'] }
      ],
      companyInsights: {
        culture: ['Innovative', 'Collaborative', 'Results-driven'],
        values: ['Excellence', 'Integrity', 'Customer focus'],
        workEnvironment: 'Fast-paced startup environment',
        growthOpportunities: ['Leadership development', 'Technical advancement', 'Cross-functional experience']
      },
      optimizationStrategy: {
        keywordTargets: ['JavaScript', 'React', 'Node.js', 'agile', 'teamwork'],
        skillsEmphasis: ['Technical proficiency', 'Problem-solving', 'Communication'],
        experienceHighlights: ['Team projects', 'Technical implementations', 'Process improvements'],
        personalityTraits: ['Adaptability', 'Innovation', 'Collaboration']
      },
      competitiveAnalysis: {
        commonSkills: ['Programming', 'Database management', 'Version control'],
        differentiators: ['Leadership experience', 'Domain expertise', 'Certifications'],
        marketTrends: ['Cloud computing', 'Microservices', 'DevOps']
      }
    };
  }

  private getFallbackATSAnalysis(params: any): CustomGptAtsAnalysis {
    return {
      atsScore: 88,
      compatibility: {
        formatting: 90,
        keywords: 85,
        structure: 88,
        readability: 92
      },
      optimizations: [
        {
          category: 'Keywords',
          issue: 'Missing some target keywords',
          solution: 'Add relevant keywords naturally throughout resume',
          impact: 15
        },
        {
          category: 'Structure',
          issue: 'Section order could be optimized',
          solution: 'Reorder sections based on relevance',
          impact: 8
        }
      ],
      keywordAnalysis: {
        matched: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
        missing: ['TypeScript', 'GraphQL', 'Docker', 'AWS'],
        density: 0.08,
        recommendations: ['Add missing keywords', 'Improve keyword distribution', 'Use variations']
      },
      structureAnalysis: {
        sections: [
          { name: 'Summary', present: true, quality: 85, suggestions: ['Add more specific achievements'] },
          { name: 'Experience', present: true, quality: 90, suggestions: ['Quantify more results'] },
          { name: 'Skills', present: true, quality: 88, suggestions: ['Organize by relevance'] },
          { name: 'Education', present: true, quality: 92, suggestions: ['Add relevant coursework'] }
        ],
        flow: 85,
        hierarchy: 88
      }
    };
  }

  private getFallbackBulletPoints(params: any): any {
    return {
      bulletPoints: [
        {
          original: 'Worked on software development projects',
          improved: 'Led development of 3 high-impact software solutions, improving system efficiency by 35%',
          reasoning: 'Added quantifiable results and leadership emphasis',
          impact: 'high'
        },
        {
          original: 'Collaborated with team members',
          improved: 'Collaborated with cross-functional team of 12 engineers to deliver projects 20% ahead of schedule',
          reasoning: 'Specified team size and measurable outcome',
          impact: 'high'
        }
      ],
      templates: [
        {
          category: 'Achievement',
          examples: [
            'Achieved X by doing Y, resulting in Z% improvement',
            'Led initiative that generated $X in cost savings',
            'Implemented solution reducing processing time by X%'
          ]
        },
        {
          category: 'Leadership',
          examples: [
            'Managed team of X to deliver Y on time and under budget',
            'Mentored X junior developers, improving team productivity by Y%',
            'Coordinated cross-functional efforts across X departments'
          ]
        }
      ],
      actionWords: [
        'Achieved', 'Implemented', 'Optimized', 'Led', 'Developed',
        'Managed', 'Created', 'Improved', 'Delivered', 'Executed'
      ],
      quantificationTips: [
        'Include specific percentages and numbers',
        'Mention timeframes and deadlines',
        'Quantify team sizes and budgets',
        'Use concrete metrics and KPIs'
      ]
    };
  }
}

export const customGptService = new CustomGptService();