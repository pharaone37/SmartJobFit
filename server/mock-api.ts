import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();
const server = createServer(app);

// Enable CORS for development
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "SmartJobFit Mock API is running!",
    timestamp: new Date().toISOString()
  });
});

// Mock user data
app.get("/api/user", (req, res) => {
  res.json({
    id: "dev-user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    title: "Senior Software Engineer",
    summary: "Experienced full-stack developer with expertise in React, Node.js, and TypeScript. Passionate about building scalable applications and mentoring junior developers.",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    experience: ["5+ years in web development", "3+ years in React", "2+ years in Node.js", "1+ year in cloud technologies"],
    subscriptionPlan: "premium",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString()
  });
});

// Mock dashboard stats
app.get("/api/dashboard/stats", (req, res) => {
  res.json({
    applicationsSubmitted: 12,
    interviewsScheduled: 3,
    resumeOptimizations: 5,
    jobMatches: 47,
    salaryInsights: 8,
    careerGoals: 2,
    successRate: 87,
    profileStrength: 92
  });
});

// Mock recent activity
app.get("/api/dashboard/activity", (req, res) => {
  res.json([
    {
      id: "1",
      type: "application",
      title: "Applied to Senior Software Engineer",
      description: "Google • Mountain View, CA",
      timestamp: "2 hours ago",
      status: "pending"
    },
    {
      id: "2",
      type: "interview",
      title: "Interview Scheduled",
      description: "Microsoft • Technical Round",
      timestamp: "1 day ago",
      status: "in-progress"
    },
    {
      id: "3",
      type: "resume",
      title: "Resume Optimized",
      description: "ATS Score: 98/100",
      timestamp: "2 days ago",
      status: "completed"
    },
    {
      id: "4",
      type: "salary",
      title: "Salary Analysis Complete",
      description: "Market rate: $140K - $180K",
      timestamp: "3 days ago",
      status: "completed"
    },
    {
      id: "5",
      type: "coaching",
      title: "Career Coaching Session",
      description: "Goal setting and career planning",
      timestamp: "1 week ago",
      status: "completed"
    }
  ]);
});

// Mock job recommendations
app.get("/api/jobs/recommended", (req, res) => {
  res.json([
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp",
      match: 95,
      location: "San Francisco, CA",
      salary: "$120k - $180k",
      type: "Full-time",
      jobUrl: "https://techcorp.com/careers/senior-software-engineer",
      description: "We're looking for a Senior Software Engineer to join our growing team...",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      postedAt: "2024-01-15T00:00:00Z"
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      match: 88,
      location: "Remote",
      salary: "$100k - $140k",
      type: "Full-time",
      jobUrl: "https://startupxyz.com/jobs/full-stack-developer",
      description: "Join our mission to revolutionize the industry...",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      postedAt: "2024-01-14T00:00:00Z"
    },
    {
      id: "3",
      title: "Software Engineer",
      company: "Innovation Labs",
      match: 82,
      location: "New York, NY",
      salary: "$110k - $160k",
      type: "Full-time",
      jobUrl: "https://innovationlabs.com/careers/software-engineer",
      description: "Build the future of technology with us...",
      skills: ["TypeScript", "React", "Python", "Docker"],
      postedAt: "2024-01-13T00:00:00Z"
    }
  ]);
});

// Mock resume analysis
app.post("/api/resume/analyze", (req, res) => {
  res.json({
    overallScore: 85,
    strengths: [
      "Strong technical background",
      "Relevant experience",
      "Good project management skills",
      "Clear communication"
    ],
    weaknesses: [
      "Could improve keyword optimization",
      "Missing some industry-specific terms",
      "Quantify achievements more"
    ],
    recommendations: [
      "Add more industry-specific keywords",
      "Quantify achievements with metrics",
      "Include relevant certifications",
      "Enhance summary section"
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
  });
});

// Mock interview questions
app.post("/api/interview/questions", (req, res) => {
  res.json({
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
      },
      {
        question: "Describe a time you had to learn a new technology quickly.",
        difficulty: "medium",
        category: "behavioral",
        tips: "Focus on your learning process and adaptability"
      },
      {
        question: "How do you ensure code quality in your projects?",
        difficulty: "easy",
        category: "technical",
        tips: "Mention testing, code reviews, and best practices"
      }
    ],
    totalQuestions: 10,
    estimatedTime: 45,
    preparationTips: [
      "Research the company thoroughly",
      "Prepare questions to ask the interviewer",
      "Practice your responses out loud",
      "Review your resume and be ready to discuss any point"
    ]
  });
});

// Mock salary data
app.get("/api/salary/:jobTitle", (req, res) => {
  const { jobTitle } = req.params;
  res.json({
    jobTitle,
    location: "San Francisco, CA",
    experienceLevel: "mid",
    salaryRange: {
      min: 120000,
      max: 180000,
      median: 150000
    },
    benefits: [
      "Health insurance",
      "401k matching",
      "Flexible PTO",
      "Remote work options",
      "Professional development"
    ],
    marketTrends: "Growing demand for this role",
    negotiationTips: [
      "Research market rates",
      "Highlight unique skills",
      "Consider total compensation",
      "Be prepared to discuss benefits"
    ]
  });
});

// Mock company insights
app.get("/api/company/:companyName", (req, res) => {
  const { companyName } = req.params;
  res.json({
    name: companyName,
    overview: "Leading technology company focused on innovation and user experience.",
    culture: "Fast-paced, collaborative environment with emphasis on learning and growth.",
    values: ["Innovation", "Collaboration", "Excellence", "Customer Focus"],
    recentNews: [
      "Recent funding round of $50M",
      "New product launch in Q4",
      "Expansion to new markets"
    ],
    benefits: [
      "Health insurance",
      "401k matching",
      "Flexible PTO",
      "Remote work",
      "Professional development"
    ],
    interviewProcess: "Typically 3-4 rounds: phone screen, technical, behavioral, final",
    salaryRange: { min: 80000, max: 120000 },
    growthOpportunities: [
      "Career advancement",
      "Skill development",
      "Mentorship programs"
    ],
    challenges: [
      "Fast-paced environment",
      "High expectations",
      "Continuous learning required"
    ],
    tips: [
      "Research recent company news",
      "Prepare technical questions",
      "Show enthusiasm for the role"
    ]
  });
});

// Mock authentication (simplified for development)
app.post("/api/auth/login", (req, res) => {
  res.json({
    success: true,
    user: {
      id: "dev-user-1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    token: "mock-jwt-token"
  });
});

// Mock job search
app.post("/api/jobs/search", (req, res) => {
  const { query, location, filters } = req.body;
  res.json({
    jobs: [
      {
        id: "1",
        title: "Senior Software Engineer",
        company: "TechCorp",
        location: "San Francisco, CA",
        salary: "$120k - $180k",
        type: "Full-time",
        match: 95,
        description: "We're looking for a Senior Software Engineer...",
        skills: ["React", "Node.js", "TypeScript"],
        postedAt: "2024-01-15T00:00:00Z"
      },
      {
        id: "2",
        title: "Full Stack Developer",
        company: "StartupXYZ",
        location: "Remote",
        salary: "$100k - $140k",
        type: "Full-time",
        match: 88,
        description: "Join our mission to revolutionize...",
        skills: ["JavaScript", "React", "Node.js"],
        postedAt: "2024-01-14T00:00:00Z"
      }
    ],
    total: 47,
    page: 1,
    hasMore: true
  });
});

// Start server
const port = process.env.API_PORT || 3001;

server.listen(port, () => {
  console.log(`🚀 SmartJobFit Mock API running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`👤 User data: http://localhost:${port}/api/user`);
  console.log(`📈 Dashboard stats: http://localhost:${port}/api/dashboard/stats`);
  console.log(`📋 Recent activity: http://localhost:${port}/api/dashboard/activity`);
  console.log(`💼 Job recommendations: http://localhost:${port}/api/jobs/recommended`);
}); 