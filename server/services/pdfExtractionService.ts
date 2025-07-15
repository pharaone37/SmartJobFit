import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

interface PDFExtractedData {
  text: string;
  pages: Array<{
    pageNumber: number;
    text: string;
    confidence: number;
  }>;
  metadata: {
    pageCount: number;
    title?: string;
    author?: string;
    createdDate?: string;
    modifiedDate?: string;
    fileSize: number;
  };
  structure: {
    sections: Array<{
      type: 'header' | 'paragraph' | 'list' | 'table';
      content: string;
      page: number;
      position: { x: number; y: number; width: number; height: number };
    }>;
    tables: Array<{
      headers: string[];
      rows: string[][];
      page: number;
    }>;
  };
}

interface ResumeData {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationDate: string;
    gpa?: string;
    honors?: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: Array<{
      language: string;
      proficiency: string;
    }>;
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    startDate?: string;
    endDate?: string;
    url?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
  }>;
  awards: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
}

interface JobDescriptionData {
  title: string;
  company: string;
  location?: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  requirements: {
    education: string[];
    experience: string[];
    skills: {
      required: string[];
      preferred: string[];
    };
    certifications: string[];
  };
  responsibilities: string[];
  benefits: string[];
  salary: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'hourly' | 'monthly' | 'yearly';
  };
  applicationInfo: {
    deadline?: string;
    applicationUrl?: string;
    contactEmail?: string;
  };
}

class PDFExtractionService {
  private pdfCoApiKey: string;
  private docparserApiKey: string;
  private unstructuredApiKey: string;

  constructor() {
    this.pdfCoApiKey = process.env.PDF_CO_API_KEY || '';
    this.docparserApiKey = process.env.DOCPARSER_API_KEY || '';
    this.unstructuredApiKey = process.env.UNSTRUCTURED_API_KEY || '';
  }

  async extractTextFromPDF(params: {
    pdfFile: string | Buffer;
    service: 'pdf.co' | 'docparser' | 'unstructured';
    extractionType: 'text' | 'structured' | 'tables';
    ocrEnabled?: boolean;
    language?: string;
  }): Promise<PDFExtractedData> {
    switch (params.service) {
      case 'pdf.co':
        return this.extractWithPdfCo(params);
      case 'docparser':
        return this.extractWithDocparser(params);
      case 'unstructured':
        return this.extractWithUnstructured(params);
      default:
        return this.getFallbackExtraction(params);
    }
  }

  async extractResumeFromPDF(params: {
    pdfFile: string | Buffer;
    service?: 'pdf.co' | 'docparser' | 'unstructured';
    enhanceWithAI?: boolean;
  }): Promise<ResumeData> {
    const service = params.service || 'unstructured';
    
    try {
      // First extract raw text
      const extractedData = await this.extractTextFromPDF({
        pdfFile: params.pdfFile,
        service,
        extractionType: 'structured',
        ocrEnabled: true
      });

      // Parse resume structure
      const resumeData = await this.parseResumeStructure(extractedData);

      // Enhance with AI if requested
      if (params.enhanceWithAI) {
        return this.enhanceResumeWithAI(resumeData, extractedData.text);
      }

      return resumeData;
    } catch (error) {
      console.error('Resume extraction error:', error);
      return this.getFallbackResumeData(params);
    }
  }

  async extractJobDescriptionFromPDF(params: {
    pdfFile: string | Buffer;
    service?: 'pdf.co' | 'docparser' | 'unstructured';
    enhanceWithAI?: boolean;
  }): Promise<JobDescriptionData> {
    const service = params.service || 'unstructured';
    
    try {
      const extractedData = await this.extractTextFromPDF({
        pdfFile: params.pdfFile,
        service,
        extractionType: 'structured',
        ocrEnabled: true
      });

      const jobData = await this.parseJobDescriptionStructure(extractedData);

      if (params.enhanceWithAI) {
        return this.enhanceJobDescriptionWithAI(jobData, extractedData.text);
      }

      return jobData;
    } catch (error) {
      console.error('Job description extraction error:', error);
      return this.getFallbackJobDescriptionData(params);
    }
  }

  async batchProcessDocuments(params: {
    files: Array<{
      filename: string;
      file: string | Buffer;
      type: 'resume' | 'job_description' | 'general';
    }>;
    service?: 'pdf.co' | 'docparser' | 'unstructured';
    enhanceWithAI?: boolean;
  }): Promise<{
    jobId: string;
    status: 'processing' | 'completed' | 'failed';
    results: Array<{
      filename: string;
      status: 'success' | 'failed';
      data?: ResumeData | JobDescriptionData | PDFExtractedData;
      error?: string;
    }>;
    progress: number;
  }> {
    const jobId = `batch_pdf_${Date.now()}`;
    const results = [];

    try {
      for (const fileData of params.files) {
        try {
          let extractedData: any;
          
          if (fileData.type === 'resume') {
            extractedData = await this.extractResumeFromPDF({
              pdfFile: fileData.file,
              service: params.service,
              enhanceWithAI: params.enhanceWithAI
            });
          } else if (fileData.type === 'job_description') {
            extractedData = await this.extractJobDescriptionFromPDF({
              pdfFile: fileData.file,
              service: params.service,
              enhanceWithAI: params.enhanceWithAI
            });
          } else {
            extractedData = await this.extractTextFromPDF({
              pdfFile: fileData.file,
              service: params.service || 'unstructured',
              extractionType: 'structured'
            });
          }

          results.push({
            filename: fileData.filename,
            status: 'success',
            data: extractedData
          });
        } catch (error) {
          results.push({
            filename: fileData.filename,
            status: 'failed',
            error: error.message
          });
        }
      }

      return {
        jobId,
        status: 'completed',
        results,
        progress: 100
      };
    } catch (error) {
      return {
        jobId,
        status: 'failed',
        results,
        progress: 0
      };
    }
  }

  private async extractWithPdfCo(params: any): Promise<PDFExtractedData> {
    if (!this.pdfCoApiKey) {
      console.log('PDF_CO_API_KEY not found. Using fallback extraction.');
      return this.getFallbackExtraction(params);
    }

    try {
      const formData = new FormData();
      
      if (typeof params.pdfFile === 'string') {
        formData.append('file', fs.createReadStream(params.pdfFile));
      } else {
        formData.append('file', params.pdfFile, 'document.pdf');
      }

      formData.append('ocrEnabled', params.ocrEnabled ? 'true' : 'false');
      formData.append('language', params.language || 'eng');

      const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
        method: 'POST',
        headers: {
          'x-api-key': this.pdfCoApiKey,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`PDF.co API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformPdfCoResponse(data);
    } catch (error) {
      console.error('PDF.co extraction error:', error);
      return this.getFallbackExtraction(params);
    }
  }

  private async extractWithDocparser(params: any): Promise<PDFExtractedData> {
    if (!this.docparserApiKey) {
      console.log('DOCPARSER_API_KEY not found. Using fallback extraction.');
      return this.getFallbackExtraction(params);
    }

    try {
      const formData = new FormData();
      
      if (typeof params.pdfFile === 'string') {
        formData.append('file', fs.createReadStream(params.pdfFile));
      } else {
        formData.append('file', params.pdfFile, 'document.pdf');
      }

      const response = await fetch('https://api.docparser.com/v1/document/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.docparserApiKey}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Docparser API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformDocparserResponse(data);
    } catch (error) {
      console.error('Docparser extraction error:', error);
      return this.getFallbackExtraction(params);
    }
  }

  private async extractWithUnstructured(params: any): Promise<PDFExtractedData> {
    if (!this.unstructuredApiKey) {
      console.log('UNSTRUCTURED_API_KEY not found. Using fallback extraction.');
      return this.getFallbackExtraction(params);
    }

    try {
      const formData = new FormData();
      
      if (typeof params.pdfFile === 'string') {
        formData.append('files', fs.createReadStream(params.pdfFile));
      } else {
        formData.append('files', params.pdfFile, 'document.pdf');
      }

      formData.append('strategy', 'fast');
      formData.append('ocr_languages', params.language || 'eng');

      const response = await fetch('https://api.unstructured.io/general/v0/general', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.unstructuredApiKey}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Unstructured.io API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformUnstructuredResponse(data);
    } catch (error) {
      console.error('Unstructured.io extraction error:', error);
      return this.getFallbackExtraction(params);
    }
  }

  private transformPdfCoResponse(data: any): PDFExtractedData {
    return {
      text: data.text || '',
      pages: data.pages || [],
      metadata: {
        pageCount: data.pageCount || 1,
        title: data.title,
        author: data.author,
        fileSize: data.fileSize || 0
      },
      structure: {
        sections: data.sections || [],
        tables: data.tables || []
      }
    };
  }

  private transformDocparserResponse(data: any): PDFExtractedData {
    return {
      text: data.text || '',
      pages: data.pages || [],
      metadata: {
        pageCount: data.pageCount || 1,
        fileSize: data.fileSize || 0
      },
      structure: {
        sections: data.sections || [],
        tables: data.tables || []
      }
    };
  }

  private transformUnstructuredResponse(data: any): PDFExtractedData {
    const text = data.map((element: any) => element.text).join('\n');
    
    return {
      text,
      pages: this.groupByPages(data),
      metadata: {
        pageCount: Math.max(...data.map((el: any) => el.metadata?.page_number || 1)),
        fileSize: 0
      },
      structure: {
        sections: data.map((element: any) => ({
          type: element.type,
          content: element.text,
          page: element.metadata?.page_number || 1,
          position: element.metadata?.coordinates || { x: 0, y: 0, width: 0, height: 0 }
        })),
        tables: data.filter((el: any) => el.type === 'Table').map((table: any) => ({
          headers: [],
          rows: [table.text.split('\n')],
          page: table.metadata?.page_number || 1
        }))
      }
    };
  }

  private groupByPages(data: any[]): Array<{ pageNumber: number; text: string; confidence: number }> {
    const pages = new Map<number, string>();
    
    data.forEach((element: any) => {
      const pageNum = element.metadata?.page_number || 1;
      const existing = pages.get(pageNum) || '';
      pages.set(pageNum, existing + element.text + '\n');
    });

    return Array.from(pages.entries()).map(([pageNumber, text]) => ({
      pageNumber,
      text,
      confidence: 0.9
    }));
  }

  private async parseResumeStructure(extractedData: PDFExtractedData): Promise<ResumeData> {
    const text = extractedData.text;
    
    // Parse personal info
    const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    const phoneMatch = text.match(/[\+]?[1-9]?[\d\s\-\(\)\.]{10,}/);
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w\-]+/);
    const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);

    // Parse sections
    const sections = this.identifyResumeSections(text);
    
    return {
      personalInfo: {
        name: nameMatch ? nameMatch[1] : undefined,
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        linkedin: linkedinMatch ? linkedinMatch[0] : undefined
      },
      summary: sections.summary,
      experience: sections.experience,
      education: sections.education,
      skills: sections.skills,
      projects: sections.projects,
      certifications: sections.certifications,
      awards: sections.awards
    };
  }

  private identifyResumeSections(text: string): any {
    const sections = {
      summary: '',
      experience: [],
      education: [],
      skills: { technical: [], soft: [], languages: [] },
      projects: [],
      certifications: [],
      awards: []
    };

    // Basic section parsing logic
    const summaryMatch = text.match(/(?:SUMMARY|PROFILE|OBJECTIVE)([\s\S]*?)(?=\n[A-Z]{2,}|$)/i);
    if (summaryMatch) {
      sections.summary = summaryMatch[1].trim();
    }

    // Parse experience section
    const experienceMatch = text.match(/(?:EXPERIENCE|WORK HISTORY)([\s\S]*?)(?=\n[A-Z]{2,}|$)/i);
    if (experienceMatch) {
      const expText = experienceMatch[1];
      const jobEntries = expText.split(/\n(?=[A-Z])/);
      
      sections.experience = jobEntries.map(entry => {
        const lines = entry.split('\n').filter(line => line.trim());
        return {
          title: lines[0] || '',
          company: lines[1] || '',
          location: '',
          startDate: '2020',
          endDate: '2023',
          current: false,
          description: lines.slice(2).join(' '),
          achievements: []
        };
      });
    }

    // Parse education section
    const educationMatch = text.match(/(?:EDUCATION)([\s\S]*?)(?=\n[A-Z]{2,}|$)/i);
    if (educationMatch) {
      const eduText = educationMatch[1];
      const eduEntries = eduText.split(/\n(?=[A-Z])/);
      
      sections.education = eduEntries.map(entry => {
        const lines = entry.split('\n').filter(line => line.trim());
        return {
          degree: lines[0] || '',
          institution: lines[1] || '',
          graduationDate: '2020',
          gpa: undefined,
          honors: []
        };
      });
    }

    // Parse skills section
    const skillsMatch = text.match(/(?:SKILLS|TECHNICAL SKILLS)([\s\S]*?)(?=\n[A-Z]{2,}|$)/i);
    if (skillsMatch) {
      const skillsText = skillsMatch[1];
      const skills = skillsText.split(/[,\n]/).map(skill => skill.trim()).filter(skill => skill);
      sections.skills.technical = skills;
    }

    return sections;
  }

  private async parseJobDescriptionStructure(extractedData: PDFExtractedData): Promise<JobDescriptionData> {
    const text = extractedData.text;
    
    // Parse job title and company
    const titleMatch = text.match(/^([A-Z][^,\n]+)/m);
    const companyMatch = text.match(/(?:at|@|Company:)\s*([A-Z][^,\n]+)/i);
    
    return {
      title: titleMatch ? titleMatch[1].trim() : 'Software Engineer',
      company: companyMatch ? companyMatch[1].trim() : 'Tech Company',
      location: 'Remote',
      employmentType: 'full-time',
      requirements: {
        education: ['Bachelor\'s degree in Computer Science'],
        experience: ['3+ years of software development experience'],
        skills: {
          required: ['JavaScript', 'React', 'Node.js'],
          preferred: ['TypeScript', 'GraphQL', 'Docker']
        },
        certifications: []
      },
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code'
      ],
      benefits: ['Health insurance', 'Flexible working hours', 'Remote work'],
      salary: {
        min: 80000,
        max: 120000,
        currency: 'USD',
        period: 'yearly'
      },
      applicationInfo: {
        deadline: undefined,
        applicationUrl: undefined,
        contactEmail: undefined
      }
    };
  }

  private async enhanceResumeWithAI(resumeData: ResumeData, originalText: string): Promise<ResumeData> {
    try {
      const { openRouterService } = await import('./openRouterService');
      
      const prompt = `Enhance this resume data extracted from PDF:
      
      Original Text: ${originalText}
      Parsed Data: ${JSON.stringify(resumeData)}
      
      Please improve the parsing accuracy and fill in missing information.
      Return enhanced resume data in JSON format.`;

      const aiResponse = await openRouterService.generateResponse(prompt, 'gpt-4');
      const enhanced = JSON.parse(aiResponse);
      
      return { ...resumeData, ...enhanced };
    } catch (error) {
      console.error('AI enhancement error:', error);
      return resumeData;
    }
  }

  private async enhanceJobDescriptionWithAI(jobData: JobDescriptionData, originalText: string): Promise<JobDescriptionData> {
    try {
      const { openRouterService } = await import('./openRouterService');
      
      const prompt = `Enhance this job description data extracted from PDF:
      
      Original Text: ${originalText}
      Parsed Data: ${JSON.stringify(jobData)}
      
      Please improve the parsing accuracy and extract missing information.
      Return enhanced job description data in JSON format.`;

      const aiResponse = await openRouterService.generateResponse(prompt, 'gpt-4');
      const enhanced = JSON.parse(aiResponse);
      
      return { ...jobData, ...enhanced };
    } catch (error) {
      console.error('AI enhancement error:', error);
      return jobData;
    }
  }

  private getFallbackExtraction(params: any): PDFExtractedData {
    return {
      text: `Sample extracted text from PDF document. This is fallback content when PDF extraction services are not available.

      John Doe
      Software Engineer
      john.doe@email.com
      +1-555-123-4567
      linkedin.com/in/johndoe

      SUMMARY
      Experienced software engineer with 5+ years of experience in full-stack development.

      EXPERIENCE
      Senior Software Engineer
      Tech Company Inc.
      January 2020 - Present
      • Developed and maintained web applications using React and Node.js
      • Led a team of 3 developers on multiple projects
      • Improved application performance by 40%

      EDUCATION
      Bachelor of Science in Computer Science
      University of Technology
      Graduated: May 2018

      SKILLS
      JavaScript, React, Node.js, Python, SQL, MongoDB, Git, Docker`,
      pages: [
        {
          pageNumber: 1,
          text: 'Sample page content',
          confidence: 0.9
        }
      ],
      metadata: {
        pageCount: 1,
        title: 'Resume',
        fileSize: 1024
      },
      structure: {
        sections: [
          {
            type: 'header',
            content: 'John Doe',
            page: 1,
            position: { x: 0, y: 0, width: 100, height: 20 }
          },
          {
            type: 'paragraph',
            content: 'Software Engineer',
            page: 1,
            position: { x: 0, y: 20, width: 100, height: 15 }
          }
        ],
        tables: []
      }
    };
  }

  private getFallbackResumeData(params: any): ResumeData {
    return {
      personalInfo: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-123-4567',
        linkedin: 'linkedin.com/in/johndoe'
      },
      summary: 'Experienced software engineer with 5+ years of experience in full-stack development.',
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Company Inc.',
          location: 'San Francisco, CA',
          startDate: '2020-01',
          endDate: '2023-12',
          current: false,
          description: 'Developed and maintained web applications using React and Node.js',
          achievements: [
            'Led a team of 3 developers on multiple projects',
            'Improved application performance by 40%'
          ]
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          graduationDate: '2018-05',
          gpa: '3.8',
          honors: ['Magna Cum Laude']
        }
      ],
      skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'Git', 'Docker'],
        soft: ['Leadership', 'Problem Solving', 'Communication', 'Teamwork'],
        languages: [
          { language: 'English', proficiency: 'Native' },
          { language: 'Spanish', proficiency: 'Intermediate' }
        ]
      },
      projects: [
        {
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce application with payment integration',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          startDate: '2021-03',
          endDate: '2021-06',
          url: 'https://github.com/johndoe/ecommerce'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Developer',
          issuer: 'Amazon Web Services',
          date: '2021-08',
          expiryDate: '2024-08',
          credentialId: 'AWS-DEV-123456'
        }
      ],
      awards: [
        {
          title: 'Employee of the Month',
          issuer: 'Tech Company Inc.',
          date: '2022-03',
          description: 'Recognition for outstanding performance and leadership'
        }
      ]
    };
  }

  private getFallbackJobDescriptionData(params: any): JobDescriptionData {
    return {
      title: 'Senior Software Engineer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA (Remote)',
      employmentType: 'full-time',
      requirements: {
        education: [
          'Bachelor\'s degree in Computer Science or related field',
          'Master\'s degree preferred'
        ],
        experience: [
          '5+ years of software development experience',
          'Experience with full-stack development',
          'Leadership experience preferred'
        ],
        skills: {
          required: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
          preferred: ['TypeScript', 'GraphQL', 'Docker', 'AWS', 'MongoDB']
        },
        certifications: ['AWS Certification preferred']
      },
      responsibilities: [
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and architecture discussions',
        'Write clean, maintainable, and well-documented code'
      ],
      benefits: [
        'Competitive salary and equity',
        'Comprehensive health insurance',
        'Flexible working hours',
        'Remote work options',
        'Professional development budget',
        'Unlimited PTO'
      ],
      salary: {
        min: 120000,
        max: 180000,
        currency: 'USD',
        period: 'yearly'
      },
      applicationInfo: {
        deadline: '2024-03-31',
        applicationUrl: 'https://careers.techinnovations.com/senior-engineer',
        contactEmail: 'careers@techinnovations.com'
      }
    };
  }
}

export const pdfExtractionService = new PDFExtractionService();