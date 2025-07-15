import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from "./storage";
import fetch from "node-fetch";
import { z } from "zod";
import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as path from "path";

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Resume optimization schemas
const ResumeUploadSchema = z.object({
  fileName: z.string(),
  fileContent: z.string(),
  contentType: z.string(),
  userId: z.string()
});

const OptimizationRequest = z.object({
  resumeId: z.string(),
  targetRole: z.string().optional(),
  targetCompany: z.string().optional(),
  jobDescription: z.string().optional(),
  industry: z.string().optional(),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'executive']).optional()
});

// Resume data interfaces
interface ResumeSection {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'achievements';
  title: string;
  content: any;
  optimizationSuggestions: string[];
  atsScore: number;
  keywords: string[];
}

interface ParsedResume {
  id: string;
  userId: string;
  fileName: string;
  sections: ResumeSection[];
  rawContent: string;
  overallAtsScore: number;
  createdAt: Date;
  lastModified: Date;
  version: string;
}

interface ATSAnalysis {
  overallScore: number;
  systemCompatibility: {
    system: string;
    score: number;
    issues: string[];
    recommendations: string[];
  }[];
  keywordAnalysis: {
    keyword: string;
    frequency: number;
    relevanceScore: number;
    suggestions: string[];
  }[];
  formatIssues: string[];
  contentSuggestions: string[];
}

interface OptimizationSuggestion {
  section: string;
  type: 'keyword' | 'content' | 'format' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  impact: string;
  before: string;
  after: string;
}

export class ResumeOptimizer {
  private geminiModel: any;
  private cache: Map<string, any> = new Map();
  private atsSystemsData: any[] = [];

  constructor() {
    this.geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.initializeATSSystems();
  }

  /**
   * Initialize ATS systems data for compatibility testing
   */
  private initializeATSSystems() {
    this.atsSystemsData = [
      { name: 'Workday', popularity: 25, strictness: 'high', keywordWeight: 0.4 },
      { name: 'Greenhouse', popularity: 20, strictness: 'medium', keywordWeight: 0.35 },
      { name: 'Lever', popularity: 15, strictness: 'medium', keywordWeight: 0.3 },
      { name: 'BambooHR', popularity: 12, strictness: 'low', keywordWeight: 0.25 },
      { name: 'JazzHR', popularity: 10, strictness: 'medium', keywordWeight: 0.3 },
      { name: 'SmartRecruiters', popularity: 8, strictness: 'high', keywordWeight: 0.4 },
      { name: 'iCIMS', popularity: 6, strictness: 'high', keywordWeight: 0.45 },
      { name: 'Jobvite', popularity: 4, strictness: 'medium', keywordWeight: 0.3 }
    ];
  }

  /**
   * Parse uploaded resume using Eden AI Hub
   */
  async parseResume(file: Express.Multer.File, userId: string): Promise<ParsedResume> {
    try {
      // Use Eden AI Hub for resume parsing
      const parsedData = await this.callEdenAI(file);
      
      // If Eden AI fails, use Gemini as fallback
      if (!parsedData) {
        const extractedText = await this.extractTextFromFile(file);
        const parsedContent = await this.parseWithGemini(extractedText);
        return this.createResumeFromGemini(parsedContent, file, userId);
      }

      return this.createResumeFromEdenAI(parsedData, file, userId);
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error('Failed to parse resume');
    }
  }

  /**
   * Call Eden AI Hub API for resume parsing
   */
  private async callEdenAI(file: Express.Multer.File): Promise<any> {
    const apiKey = process.env.EDEN_AI_API_KEY;
    if (!apiKey) {
      console.warn('Eden AI API key not found, using fallback');
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      formData.append('providers', 'affinda');

      const response = await fetch('https://api.edenai.run/v2/ocr/resume_parser', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Eden AI API error: ${response.status}`);
      }

      const result = await response.json();
      return result.affinda;
    } catch (error) {
      console.error('Eden AI parsing error:', error);
      return null;
    }
  }

  /**
   * Extract text from uploaded file
   */
  private async extractTextFromFile(file: Express.Multer.File): Promise<string> {
    // This is a simplified version - in production, use proper PDF/DOC parsing
    const content = file.buffer.toString('utf8');
    return content;
  }

  /**
   * Parse resume using Gemini as fallback
   */
  private async parseWithGemini(text: string): Promise<any> {
    try {
      const prompt = `
        Parse this resume and extract structured data:
        
        "${text}"
        
        Return a JSON object with this structure:
        {
          "personalInfo": {
            "name": "Full Name",
            "email": "email@example.com",
            "phone": "phone number",
            "location": "City, State",
            "linkedin": "linkedin profile",
            "portfolio": "portfolio website"
          },
          "summary": "Professional summary or objective",
          "experience": [
            {
              "title": "Job Title",
              "company": "Company Name",
              "location": "Location",
              "duration": "Start Date - End Date",
              "description": "Job description and achievements"
            }
          ],
          "education": [
            {
              "degree": "Degree",
              "institution": "School Name",
              "location": "Location",
              "graduation": "Graduation Date",
              "gpa": "GPA if mentioned"
            }
          ],
          "skills": ["skill1", "skill2", "skill3"],
          "projects": [
            {
              "name": "Project Name",
              "description": "Project description",
              "technologies": ["tech1", "tech2"]
            }
          ],
          "certifications": [
            {
              "name": "Certification Name",
              "issuer": "Issuing Organization",
              "date": "Date obtained"
            }
          ]
        }
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text_response = response.text();
      
      return JSON.parse(text_response);
    } catch (error) {
      console.error('Gemini parsing error:', error);
      throw new Error('Failed to parse resume with AI');
    }
  }

  /**
   * Create resume object from Eden AI data
   */
  private createResumeFromEdenAI(data: any, file: Express.Multer.File, userId: string): ParsedResume {
    const sections: ResumeSection[] = [];
    
    // Header section
    sections.push({
      id: 'header',
      type: 'header',
      title: 'Personal Information',
      content: data.personal_infos || {},
      optimizationSuggestions: [],
      atsScore: 0,
      keywords: []
    });

    // Experience section
    if (data.experiences) {
      sections.push({
        id: 'experience',
        type: 'experience',
        title: 'Professional Experience',
        content: data.experiences,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    // Education section
    if (data.educations) {
      sections.push({
        id: 'education',
        type: 'education',
        title: 'Education',
        content: data.educations,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    // Skills section
    if (data.skills) {
      sections.push({
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        content: data.skills,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    return {
      id: `resume_${Date.now()}`,
      userId,
      fileName: file.originalname,
      sections,
      rawContent: file.buffer.toString('utf8'),
      overallAtsScore: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      version: '1.0'
    };
  }

  /**
   * Create resume object from Gemini data
   */
  private createResumeFromGemini(data: any, file: Express.Multer.File, userId: string): ParsedResume {
    const sections: ResumeSection[] = [];
    
    // Header section
    sections.push({
      id: 'header',
      type: 'header',
      title: 'Personal Information',
      content: data.personalInfo || {},
      optimizationSuggestions: [],
      atsScore: 0,
      keywords: []
    });

    // Summary section
    if (data.summary) {
      sections.push({
        id: 'summary',
        type: 'summary',
        title: 'Professional Summary',
        content: data.summary,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    // Experience section
    if (data.experience) {
      sections.push({
        id: 'experience',
        type: 'experience',
        title: 'Professional Experience',
        content: data.experience,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    // Education section
    if (data.education) {
      sections.push({
        id: 'education',
        type: 'education',
        title: 'Education',
        content: data.education,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    // Skills section
    if (data.skills) {
      sections.push({
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        content: data.skills,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    // Projects section
    if (data.projects) {
      sections.push({
        id: 'projects',
        type: 'projects',
        title: 'Projects',
        content: data.projects,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    // Certifications section
    if (data.certifications) {
      sections.push({
        id: 'certifications',
        type: 'certifications',
        title: 'Certifications',
        content: data.certifications,
        optimizationSuggestions: [],
        atsScore: 0,
        keywords: []
      });
    }

    return {
      id: `resume_${Date.now()}`,
      userId,
      fileName: file.originalname,
      sections,
      rawContent: file.buffer.toString('utf8'),
      overallAtsScore: 0,
      createdAt: new Date(),
      lastModified: new Date(),
      version: '1.0'
    };
  }

  /**
   * Perform comprehensive ATS analysis
   */
  async performATSAnalysis(resume: ParsedResume): Promise<ATSAnalysis> {
    try {
      const systemCompatibility = await Promise.all(
        this.atsSystemsData.map(async (system) => {
          const score = await this.calculateATSScore(resume, system);
          const issues = await this.identifyATSIssues(resume, system);
          const recommendations = await this.generateATSRecommendations(resume, system);
          
          return {
            system: system.name,
            score,
            issues,
            recommendations
          };
        })
      );

      const keywordAnalysis = await this.analyzeKeywords(resume);
      const formatIssues = await this.identifyFormatIssues(resume);
      const contentSuggestions = await this.generateContentSuggestions(resume);

      const overallScore = this.calculateOverallScore(systemCompatibility);

      return {
        overallScore,
        systemCompatibility,
        keywordAnalysis,
        formatIssues,
        contentSuggestions
      };
    } catch (error) {
      console.error('ATS analysis error:', error);
      throw new Error('Failed to perform ATS analysis');
    }
  }

  /**
   * Calculate ATS score for specific system
   */
  private async calculateATSScore(resume: ParsedResume, system: any): Promise<number> {
    try {
      const prompt = `
        Calculate ATS compatibility score (0-100) for this resume with ${system.name} ATS system:
        
        Resume Content: ${JSON.stringify(resume.sections)}
        
        ${system.name} characteristics:
        - Strictness: ${system.strictness}
        - Keyword weight: ${system.keywordWeight}
        
        Consider:
        1. Keyword presence and density
        2. Format compatibility
        3. Section structure
        4. Content quality
        5. Missing elements
        
        Return only a number between 0-100.
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const score = parseInt(text.match(/\d+/)?.[0] || '0');
      return Math.min(Math.max(score, 0), 100);
    } catch (error) {
      console.error('ATS score calculation error:', error);
      return 0;
    }
  }

  /**
   * Identify ATS-specific issues
   */
  private async identifyATSIssues(resume: ParsedResume, system: any): Promise<string[]> {
    try {
      const prompt = `
        Identify specific issues with this resume for ${system.name} ATS system:
        
        Resume: ${JSON.stringify(resume.sections)}
        
        Return a JSON array of specific issues:
        ["issue1", "issue2", "issue3"]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const issues = JSON.parse(text);
        return Array.isArray(issues) ? issues : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('ATS issues identification error:', error);
      return [];
    }
  }

  /**
   * Generate ATS recommendations
   */
  private async generateATSRecommendations(resume: ParsedResume, system: any): Promise<string[]> {
    try {
      const prompt = `
        Generate specific recommendations to improve ATS compatibility for ${system.name}:
        
        Resume: ${JSON.stringify(resume.sections)}
        
        Return a JSON array of actionable recommendations:
        ["recommendation1", "recommendation2", "recommendation3"]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const recommendations = JSON.parse(text);
        return Array.isArray(recommendations) ? recommendations : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('ATS recommendations generation error:', error);
      return [];
    }
  }

  /**
   * Analyze keywords in resume
   */
  private async analyzeKeywords(resume: ParsedResume): Promise<any[]> {
    try {
      // Use TextRazor API if available
      const textRazorResult = await this.callTextRazor(resume.rawContent);
      if (textRazorResult) {
        return textRazorResult;
      }

      // Fallback to Gemini
      const prompt = `
        Analyze keywords in this resume and provide insights:
        
        ${resume.rawContent}
        
        Return a JSON array with this structure:
        [
          {
            "keyword": "keyword text",
            "frequency": number,
            "relevanceScore": number (0-100),
            "suggestions": ["suggestion1", "suggestion2"]
          }
        ]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('Keyword analysis error:', error);
      return [];
    }
  }

  /**
   * Call TextRazor API for keyword analysis
   */
  private async callTextRazor(text: string): Promise<any> {
    const apiKey = process.env.TEXTRAZOR_API_KEY;
    if (!apiKey) {
      return null;
    }

    try {
      const response = await fetch('https://api.textrazor.com/', {
        method: 'POST',
        headers: {
          'X-TextRazor-Key': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `text=${encodeURIComponent(text)}&extractors=keywords,entities`
      });

      if (!response.ok) {
        throw new Error(`TextRazor API error: ${response.status}`);
      }

      const result = await response.json();
      return this.processTextRazorResult(result);
    } catch (error) {
      console.error('TextRazor API error:', error);
      return null;
    }
  }

  /**
   * Process TextRazor result
   */
  private processTextRazorResult(result: any): any[] {
    const keywords: any[] = [];
    
    if (result.response?.keywords) {
      result.response.keywords.forEach((keyword: any) => {
        keywords.push({
          keyword: keyword.text,
          frequency: keyword.count || 1,
          relevanceScore: Math.round(keyword.score * 100),
          suggestions: []
        });
      });
    }

    return keywords;
  }

  /**
   * Identify format issues
   */
  private async identifyFormatIssues(resume: ParsedResume): Promise<string[]> {
    try {
      const prompt = `
        Identify formatting issues in this resume that could cause ATS problems:
        
        ${JSON.stringify(resume.sections)}
        
        Return a JSON array of specific formatting issues:
        ["issue1", "issue2", "issue3"]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const issues = JSON.parse(text);
        return Array.isArray(issues) ? issues : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('Format issues identification error:', error);
      return [];
    }
  }

  /**
   * Generate content suggestions
   */
  private async generateContentSuggestions(resume: ParsedResume): Promise<string[]> {
    try {
      const prompt = `
        Generate content improvement suggestions for this resume:
        
        ${JSON.stringify(resume.sections)}
        
        Return a JSON array of specific content suggestions:
        ["suggestion1", "suggestion2", "suggestion3"]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const suggestions = JSON.parse(text);
        return Array.isArray(suggestions) ? suggestions : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('Content suggestions generation error:', error);
      return [];
    }
  }

  /**
   * Calculate overall ATS score
   */
  private calculateOverallScore(systemCompatibility: any[]): number {
    const totalScore = systemCompatibility.reduce((sum, system) => {
      const weight = this.atsSystemsData.find(s => s.name === system.system)?.popularity || 1;
      return sum + (system.score * weight);
    }, 0);

    const totalWeight = systemCompatibility.reduce((sum, system) => {
      const weight = this.atsSystemsData.find(s => s.name === system.system)?.popularity || 1;
      return sum + weight;
    }, 0);

    return Math.round(totalScore / totalWeight);
  }

  /**
   * Optimize resume content
   */
  async optimizeResume(resumeId: string, options: any): Promise<OptimizationSuggestion[]> {
    try {
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        throw new Error('Resume not found');
      }

      const suggestions: OptimizationSuggestion[] = [];

      // Optimize each section
      for (const section of resume.sections) {
        const sectionSuggestions = await this.optimizeSection(section, options);
        suggestions.push(...sectionSuggestions);
      }

      // Store optimization results
      await storage.storeOptimizationResults(resumeId, suggestions);

      return suggestions;
    } catch (error) {
      console.error('Resume optimization error:', error);
      throw new Error('Failed to optimize resume');
    }
  }

  /**
   * Optimize individual section
   */
  private async optimizeSection(section: ResumeSection, options: any): Promise<OptimizationSuggestion[]> {
    try {
      const prompt = `
        Optimize this resume section for ATS compatibility and recruiter appeal:
        
        Section: ${section.title}
        Content: ${JSON.stringify(section.content)}
        
        Target Role: ${options.targetRole || 'Not specified'}
        Target Company: ${options.targetCompany || 'Not specified'}
        Job Description: ${options.jobDescription || 'Not specified'}
        Industry: ${options.industry || 'Not specified'}
        
        Generate optimization suggestions with this JSON structure:
        [
          {
            "section": "${section.title}",
            "type": "keyword|content|format|achievement",
            "priority": "high|medium|low",
            "suggestion": "specific suggestion",
            "impact": "expected impact",
            "before": "current text",
            "after": "improved text"
          }
        ]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const suggestions = JSON.parse(text);
        return Array.isArray(suggestions) ? suggestions : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('Section optimization error:', error);
      return [];
    }
  }

  /**
   * Generate professional resume PDF
   */
  async generateResumePDF(resumeId: string, templateName: string = 'professional'): Promise<Buffer> {
    try {
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        throw new Error('Resume not found');
      }

      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      // Apply template styling
      await this.applyResumeTemplate(doc, resume, templateName);

      doc.end();

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Apply resume template
   */
  private async applyResumeTemplate(doc: PDFKit.PDFDocument, resume: ParsedResume, templateName: string) {
    const templates = {
      professional: this.applyProfessionalTemplate,
      modern: this.applyModernTemplate,
      creative: this.applyCreativeTemplate,
      minimal: this.applyMinimalTemplate
    };

    const templateFunction = templates[templateName] || templates.professional;
    await templateFunction.call(this, doc, resume);
  }

  /**
   * Apply professional template
   */
  private applyProfessionalTemplate(doc: PDFKit.PDFDocument, resume: ParsedResume) {
    // Header
    const headerSection = resume.sections.find(s => s.type === 'header');
    if (headerSection) {
      const info = headerSection.content;
      doc.fontSize(20).text(info.name || 'Name', 50, 50);
      doc.fontSize(12).text(info.email || '', 50, 80);
      doc.text(info.phone || '', 200, 80);
      doc.text(info.location || '', 350, 80);
    }

    let yPosition = 120;

    // Other sections
    resume.sections.forEach(section => {
      if (section.type !== 'header') {
        doc.fontSize(16).text(section.title, 50, yPosition);
        yPosition += 30;
        
        if (Array.isArray(section.content)) {
          section.content.forEach(item => {
            doc.fontSize(12).text(this.formatSectionItem(item), 50, yPosition);
            yPosition += 20;
          });
        } else {
          doc.fontSize(12).text(section.content.toString(), 50, yPosition);
          yPosition += 20;
        }
        
        yPosition += 20;
      }
    });
  }

  /**
   * Apply modern template
   */
  private applyModernTemplate(doc: PDFKit.PDFDocument, resume: ParsedResume) {
    // Implementation for modern template
    this.applyProfessionalTemplate(doc, resume);
  }

  /**
   * Apply creative template
   */
  private applyCreativeTemplate(doc: PDFKit.PDFDocument, resume: ParsedResume) {
    // Implementation for creative template
    this.applyProfessionalTemplate(doc, resume);
  }

  /**
   * Apply minimal template
   */
  private applyMinimalTemplate(doc: PDFKit.PDFDocument, resume: ParsedResume) {
    // Implementation for minimal template
    this.applyProfessionalTemplate(doc, resume);
  }

  /**
   * Format section item for PDF
   */
  private formatSectionItem(item: any): string {
    if (typeof item === 'string') {
      return item;
    }
    
    if (item.title || item.name) {
      return `${item.title || item.name} - ${item.company || item.institution || ''}\n${item.description || ''}`;
    }
    
    return JSON.stringify(item);
  }

  /**
   * Get resume analytics
   */
  async getResumeAnalytics(resumeId: string): Promise<any> {
    try {
      const analytics = await storage.getResumeAnalytics(resumeId);
      return analytics;
    } catch (error) {
      console.error('Resume analytics error:', error);
      throw new Error('Failed to get resume analytics');
    }
  }

  /**
   * Track resume performance
   */
  async trackResumePerformance(resumeId: string, event: string, data: any): Promise<void> {
    try {
      await storage.trackResumeEvent(resumeId, event, data);
    } catch (error) {
      console.error('Resume tracking error:', error);
    }
  }

  /**
   * Get optimization suggestions for job description
   */
  async getJobSpecificOptimization(resumeId: string, jobDescription: string): Promise<OptimizationSuggestion[]> {
    try {
      const resume = await storage.getResume(resumeId);
      if (!resume) {
        throw new Error('Resume not found');
      }

      const prompt = `
        Generate job-specific optimization suggestions for this resume:
        
        Resume: ${JSON.stringify(resume.sections)}
        Job Description: ${jobDescription}
        
        Return a JSON array of specific optimization suggestions:
        [
          {
            "section": "section name",
            "type": "keyword|content|format|achievement",
            "priority": "high|medium|low",
            "suggestion": "specific suggestion",
            "impact": "expected impact",
            "before": "current text",
            "after": "improved text"
          }
        ]
      `;

      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const suggestions = JSON.parse(text);
        return Array.isArray(suggestions) ? suggestions : [];
      } catch (parseError) {
        return [];
      }
    } catch (error) {
      console.error('Job-specific optimization error:', error);
      return [];
    }
  }
}

export const resumeOptimizer = new ResumeOptimizer();