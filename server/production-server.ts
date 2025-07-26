import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Compression
app.use(compression());

// CORS for API routes
app.use("/api", cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://smartjobfit.com", "https://www.smartjobfit.com"]
    : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from the built frontend
app.use(express.static(path.join(__dirname, "../dist/public"), {
  maxAge: "1y",
  etag: true,
}));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Mock API endpoints for development/demo
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "SmartJobFit API is running!", 
    timestamp: new Date().toISOString() 
  });
});

app.get("/api/user", (req, res) => {
  res.json({
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    subscription: "premium",
    createdAt: "2024-01-15T10:30:00Z"
  });
});

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

// Catch-all handler for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/public/index.html"));
});

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "0.0.0.0";

server.listen(port, host, () => {
  console.log(`🚀 SmartJobFit production server running on http://${host}:${port}`);
  console.log(`📊 Health check: http://${host}:${port}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
}); 