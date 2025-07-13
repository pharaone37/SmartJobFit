# SmartJobFit - AI-Powered Job Search Platform

## Overview

SmartJobFit is a comprehensive full-stack web application that revolutionizes job searching by leveraging artificial intelligence. The platform provides job seekers with AI-powered job search across 15+ job boards, resume optimization, interview preparation, and analytics to help users find their dream job 10x faster.

## User Preferences

```
Preferred communication style: Simple, everyday language.
Website language: English-only interface (language selector removed)
Interview preparation: Support multiple languages for better user experience
CV analytics: Support multiple languages for better user experience
Design: Job platform logos on landing page, payment method logos in footer
Production readiness: User planning to deploy with custom domain
API requirements: Needs production-level API limits for OpenAI, Stripe, Anthropic
Domain: smartjobfit.com (purchased from Namecheap)
AI Provider: OpenRouter API configured for better rate limits
Authentication: Custom auth page created to show SmartJobFit branding
OAuth Configuration: Replit OAuth app needs to be updated from "CareerCatalyst" to "SmartJobFit" in settings
UI Language: English-only interface (removed German translations)
Hosting: Multiple options available - Replit Deployments (quickest), Vercel (recommended), Railway, DigitalOcean
Deployment: Ready for production deployment with comprehensive guides created
```

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state and caching
- **Routing**: React Router for client-side navigation
- **Theme**: Dark/light mode support with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: PostgreSQL-based session store

### Key Technologies
- **AI Services**: OpenAI (GPT-4o) and Anthropic (Claude Sonnet 4) for job matching and resume optimization
- **Payment Processing**: Stripe for subscription management
- **Email Services**: SendGrid for transactional emails
- **Job Board Integration**: APIs from 15+ major job boards (LinkedIn, Indeed, Glassdoor, etc.)

## Key Components

### 1. Job Search Engine
- **Purpose**: Universal job search across multiple job boards
- **Features**: AI-powered job matching, filtering, and recommendations
- **Components**: Search interface, job cards, filtering system

### 2. Resume Optimization
- **Purpose**: AI-powered resume analysis and optimization
- **Features**: ATS scoring, keyword optimization, tailored suggestions
- **Components**: Resume analyzer, optimizer, builder interface

### 3. Interview Preparation
- **Purpose**: AI-powered interview practice and coaching
- **Features**: Mock interviews, voice analysis, personalized feedback
- **Components**: Interview simulator, question generator, feedback system

### 4. Analytics Dashboard
- **Purpose**: Job search performance tracking and insights
- **Features**: Application tracking, success metrics, trend analysis
- **Components**: Charts, statistics cards, progress tracking

### 5. Subscription Management
- **Purpose**: Freemium model with premium features
- **Features**: Stripe integration, plan management, usage tracking
- **Tiers**: Free, Professional, Enterprise

## Data Flow

### Authentication Flow
1. User authentication via Replit Auth (OpenID Connect)
2. Session management using PostgreSQL session store
3. JWT-based API authentication for protected routes

### Job Search Flow
1. User submits search query with filters
2. Backend queries multiple job board APIs simultaneously
3. AI services analyze and rank job matches
4. Results cached and returned to frontend
5. User interactions tracked for analytics

### Resume Optimization Flow
1. User uploads resume content
2. AI services analyze ATS compatibility and keywords
3. Job-specific optimization recommendations generated
4. User applies suggestions and re-analyzes
5. Optimized resume stored for future use

### Interview Preparation Flow
1. User selects job type and difficulty level
2. AI generates relevant interview questions
3. User practices with mock interview simulator
4. AI analyzes responses and provides feedback
5. Performance metrics tracked for improvement

## External Dependencies

### AI Services
- **OpenAI API**: Job matching, resume analysis, interview coaching
- **Anthropic API**: Alternative AI processing for redundancy

### Job Board APIs
- LinkedIn, Indeed, Glassdoor, ZipRecruiter, Monster
- CareerBuilder, Dice, AngelList, Stack Overflow
- GitHub Jobs, Reed (UK), Xing (DACH), Seek (AU)

### Payment Processing
- **Stripe**: Subscription management, payment processing
- **Plans**: Free, Professional ($19/month), Enterprise ($49/month)

### Email Services
- **SendGrid**: Welcome emails, job alerts, notifications

### Database
- **Neon PostgreSQL**: Serverless database hosting
- **Drizzle ORM**: Type-safe database operations

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon development database
- **Environment Variables**: Managed via .env files

### Production Deployment
- **Platform**: Replit hosting with automatic deployments
- **Build Process**: Vite build for frontend, esbuild for backend
- **Database**: Neon production database with connection pooling
- **CDN**: Static assets served via Replit's CDN

### Database Management
- **Migrations**: Drizzle-kit for schema management
- **Seeding**: Automated data seeding for development
- **Backup Strategy**: Neon automatic backups

### Security Considerations
- **Authentication**: Secure OpenID Connect implementation
- **API Security**: Rate limiting, input validation
- **Data Protection**: Encrypted sensitive data storage
- **Payment Security**: PCI compliance via Stripe

### Monitoring and Analytics
- **Application Monitoring**: Error tracking and performance monitoring
- **User Analytics**: Job search behavior and conversion tracking
- **System Health**: Database performance and API response times

### Scalability Approach
- **Database**: Neon serverless scaling
- **Caching**: Query result caching with TanStack Query
- **API Rate Limiting**: Prevent abuse and ensure fair usage
- **Job Board Integration**: Distributed API calls with fallback mechanisms

The application follows a modern full-stack architecture with clear separation of concerns, comprehensive AI integration, and robust subscription management. The codebase is well-structured for maintainability and scalability.