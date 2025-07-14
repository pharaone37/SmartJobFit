import fetch from 'node-fetch';

export class RchilliService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.RCHILLI_API_KEY || '';
    this.baseUrl = 'https://api.rchilli.com/v1';
  }

  async parseResume(resumeText: string, fileName: string = 'resume.pdf'): Promise<any> {
    if (!this.apiKey) {
      console.log('RCHILLI_API_KEY not found. Using fallback parsing.');
      return this.getFallbackParsing(resumeText);
    }

    try {
      const response = await fetch(`${this.baseUrl}/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text: resumeText,
          filename: fileName,
          parseType: 'comprehensive'
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformRchilliResponse(data);
    } catch (error) {
      console.error('Rchilli parsing error:', error);
      return this.getFallbackParsing(resumeText);
    }
  }

  private transformRchilliResponse(data: any): any {
    return {
      personalInfo: {
        name: data.PersonalInformation?.Name || '',
        email: data.PersonalInformation?.Email || '',
        phone: data.PersonalInformation?.Phone || '',
        location: data.PersonalInformation?.Location || '',
        linkedin: data.PersonalInformation?.LinkedIn || '',
        github: data.PersonalInformation?.GitHub || ''
      },
      experience: (data.Experience || []).map((exp: any) => ({
        title: exp.JobTitle || '',
        company: exp.Company || '',
        location: exp.Location || '',
        startDate: exp.StartDate || '',
        endDate: exp.EndDate || '',
        description: exp.Description || '',
        responsibilities: exp.Responsibilities || []
      })),
      education: (data.Education || []).map((edu: any) => ({
        degree: edu.Degree || '',
        institution: edu.Institution || '',
        location: edu.Location || '',
        graduationDate: edu.GraduationDate || '',
        gpa: edu.GPA || ''
      })),
      skills: data.Skills || [],
      certifications: data.Certifications || [],
      languages: data.Languages || [],
      summary: data.Summary || '',
      atsScore: data.ATSScore || 85,
      keywords: data.Keywords || []
    };
  }

  private getFallbackParsing(resumeText: string): any {
    // Basic text parsing fallback
    const lines = resumeText.split('\n');
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    
    const email = resumeText.match(emailRegex)?.[0] || '';
    const phone = resumeText.match(phoneRegex)?.[0] || '';
    const name = lines[0] || '';
    
    // Extract skills with common tech terms
    const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'HTML', 'CSS', 'AWS', 'Docker', 'Git'];
    const foundSkills = skillKeywords.filter(skill => 
      resumeText.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      personalInfo: { name, email, phone, location: '', linkedin: '', github: '' },
      experience: [],
      education: [],
      skills: foundSkills,
      certifications: [],
      languages: [],
      summary: '',
      atsScore: 75,
      keywords: foundSkills
    };
  }
}

export const rchilliService = new RchilliService();