import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, "../client/dist")));

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SmartJobFit server is running!" });
});

// Mock user data for development
app.get("/api/user", (req, res) => {
  res.json({
    id: "dev-user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    title: "Senior Software Engineer",
    summary: "Experienced full-stack developer with expertise in React, Node.js, and TypeScript.",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL"],
    experience: ["5+ years in web development", "3+ years in React", "2+ years in Node.js"],
    subscriptionPlan: "premium"
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
    careerGoals: 2
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
    }
  ]);
});

// Catch-all route to serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`🚀 SmartJobFit development server running on http://localhost:${port}`);
  console.log(`📊 Dashboard: http://localhost:${port}/dashboard`);
  console.log(`🔍 Health check: http://localhost:${port}/api/health`);
}); 