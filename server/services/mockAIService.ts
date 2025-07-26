// Mock AI Service for Local Development
// This provides realistic demo data when API keys aren't available

export class MockAIService {
  // Resume Analysis and Optimization
  async analyzeResume(resumeContent: string, jobDescription?: string): Promise<any> {
    return {
      overallScore: 85,
      strengths: ["Strong technical background", "Relevant experience", "Good project management skills"],
      weaknesses: ["Could improve keyword optimization", "Missing some industry-specific terms"],
      recommendations: [
        "Add more industry-specific keywords",
        "Quantify achievements with metrics",
        "Include relevant certifications"
      ],
      atsScore: 78,
      keywordMatches: ["JavaScript", "React", "Node.js", "TypeScript", "API"],
      missingKeywords: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      skillsAnalysis: { 
        technical: ["JavaScript", "React", "Node.js", "TypeScript"], 
        soft: ["Communication", "Leadership", "Problem Solving"] 
      },
      experienceLevel: "mid",
      industryFit: "Good fit for web development and full-stack roles"
    };
  }

  // Resume Optimization
  async optimizeResume(resumeContent: string, jobDescription: string, targetRole: string): Promise<any> {
    return {
      optimizedResume: "Optimized resume content would appear here...",
      changes: [
        "Added industry-specific keywords",
        "Improved action verbs",
        "Enhanced quantifiable achievements"
      ],
      keywordImprovements: ["Added 'AWS', 'Docker', 'CI/CD'"],
      structureImprovements: ["Reorganized experience section", "Enhanced summary"],
      contentImprovements: ["Added metrics to achievements", "Improved descriptions"],
      atsImprovements: ["Better keyword placement", "Improved formatting"]
    };
  }

  // Generate Resume from Scratch
  async generateResume(userInfo: any, targetRole: string, template: string): Promise<any> {
    return {
      resumeContent: "Generated resume content would appear here...",
      sections: {
        summary: "Professional summary...",
        experience: "Work experience...",
        skills: "Technical and soft skills...",
        education: "Educational background..."
      },
      template: template,
      tips: ["Customize for each application", "Keep it concise", "Use action verbs"]
    };
  }

  // Interview Preparation
  async generateInterviewQuestions(jobDescription: string, experienceLevel: string, category: string): Promise<any> {
    return {
      questions: [
        {
          question: "Tell me about a challenging project you worked on.",
          difficulty: "medium",
          category: "behavioral",
          tips: "Use STAR method: Situation, Task, Action, Result"
        },
        {
          question: "How do you handle conflicting priorities?",
          difficulty: "easy",
          category: "behavioral",
          tips: "Provide specific examples from your experience"
        },
        {
          question: "What's your experience with React hooks?",
          difficulty: "medium",
          category: "technical",
          tips: "Explain useState, useEffect, and custom hooks"
        }
      ],
      totalQuestions: 10,
      estimatedTime: 45,
      preparationTips: [
        "Research the company thoroughly",
        "Prepare questions to ask the interviewer",
        "Practice your responses out loud"
      ]
    };
  }

  // Interview Performance Analysis
  async analyzeInterviewPerformance(question: string, userAnswer: string, correctAnswer?: string): Promise<any> {
    return {
      score: 85,
      feedback: "Good response with room for improvement. Consider adding more specific examples.",
      strengths: ["Clear communication", "Relevant experience mentioned"],
      improvements: ["Add more quantifiable results", "Use STAR method more effectively"],
      keyPoints: ["Project management", "Problem solving"],
      missedPoints: ["Specific metrics", "Technical details"],
      overall: "Strong performance with potential for enhancement"
    };
  }

  // Cover Letter Generation
  async generateCoverLetter(resumeContent: string, jobDescription: string, companyInfo: any): Promise<any> {
    return {
      coverLetter: "Generated cover letter content would appear here...",
      keyPoints: ["Relevant experience", "Company alignment", "Enthusiasm for role"],
      companySpecific: ["Company values", "Recent achievements", "Culture fit"],
      callToAction: "I look forward to discussing how I can contribute to your team.",
      tips: ["Customize for each company", "Keep it concise", "Show enthusiasm"]
    };
  }

  // Company Insights
  async getCompanyInsights(companyName: string, jobTitle: string): Promise<any> {
    return {
      companyOverview: "Leading technology company focused on innovation...",
      culture: "Fast-paced, collaborative environment with emphasis on learning",
      values: ["Innovation", "Collaboration", "Excellence", "Customer Focus"],
      recentNews: ["Recent funding round", "New product launch", "Expansion plans"],
      benefits: ["Health insurance", "401k matching", "Flexible PTO", "Remote work"],
      interviewProcess: "Typically 3-4 rounds: phone screen, technical, behavioral, final",
      salaryRange: { min: 80000, max: 120000 },
      growthOpportunities: ["Career advancement", "Skill development", "Mentorship"],
      challenges: ["Fast-paced environment", "High expectations", "Continuous learning"],
      tips: ["Research recent company news", "Prepare technical questions", "Show enthusiasm"]
    };
  }

  // Job Matching and Recommendations
  async generateJobRecommendations(userProfile: any, preferences: any): Promise<any> {
    return {
      recommendations: [
        {
          title: "Senior Software Engineer",
          company: "TechCorp",
          match: 95,
          reasoning: "Strong technical fit with your React and Node.js experience"
        },
        {
          title: "Full Stack Developer",
          company: "StartupXYZ",
          match: 88,
          reasoning: "Good cultural fit and growth opportunities"
        }
      ],
      skillGaps: ["AWS", "Docker", "Kubernetes"],
      careerPath: "Consider specializing in cloud technologies or moving to senior roles",
      marketInsights: "Strong demand for full-stack developers with React experience",
      actionItems: [
        "Learn AWS fundamentals",
        "Build a portfolio project",
        "Network with industry professionals"
      ],
      learningResources: [
        "AWS Certified Developer course",
        "Docker for Beginners",
        "System Design Interview prep"
      ]
    };
  }

  // Career Tips and Advice
  async generateCareerTips(userProfile: any, currentRole: string, targetRole: string): Promise<any> {
    return {
      tips: [
        "Focus on building a strong portfolio",
        "Network actively in your industry",
        "Stay updated with latest technologies"
      ],
      skillDevelopment: ["Cloud technologies", "System design", "Leadership skills"],
      networking: [
        "Attend industry conferences",
        "Join professional groups",
        "Connect on LinkedIn"
      ],
      certifications: ["AWS Certified Developer", "Google Cloud Professional", "Azure Developer"],
      timeline: "6-12 months for significant career advancement",
      resources: [
        "Online courses (Coursera, Udemy)",
        "Professional networking events",
        "Mentorship programs"
      ]
    };
  }

  // Job Search Optimization
  async optimizeJobSearch(searchQuery: string, userProfile: any, previousResults: any[]): Promise<any> {
    return {
      optimizedQuery: "senior software engineer react node.js typescript remote",
      suggestedFilters: {
        experience: "3-5 years",
        location: "Remote or San Francisco",
        salary: "$100k+"
      },
      platforms: ["LinkedIn", "Indeed", "Glassdoor", "AngelList"],
      timing: "Tuesday-Thursday mornings are best for applications",
      strategy: "Focus on quality over quantity, customize each application",
      keywords: ["React", "Node.js", "TypeScript", "Full Stack", "API Development"]
    };
  }
}

export const mockAIService = new MockAIService(); 