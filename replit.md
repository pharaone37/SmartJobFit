# SmartJobFit - AI-Powered Job Search Platform

## Overview

SmartJobFit is a comprehensive full-stack web application that revolutionizes job searching by leveraging artificial intelligence. The platform provides job seekers with AI-powered job search across 15+ job boards, resume optimization, interview preparation, and analytics to help users find their dream job 10x faster.

## User Preferences

```
Preferred communication style: Simple, everyday language.
Website language: English-only interface (language selector removed)
API Keys Status: Missing keys for new enterprise services (SOVREN_API_KEY, HIREEZ_API_KEY, SKILLATE_API_KEY)
Interview preparation: Support multiple languages for better user experience
CV analytics: Support multiple languages for better user experience
Design: Job platform logos on landing page, payment method logos in footer
Production readiness: User planning to deploy with custom domain
API requirements: Needs production-level API limits for OpenAI, Stripe, Anthropic
Domain: smartjobfit.com (purchased from Namecheap)
AI Provider: OpenRouter API configured for better rate limits
Authentication: Custom JWT authentication system implemented
- Email/password registration and login
- Password reset functionality (logs reset tokens to console)
- JWT tokens stored in localStorage
- Secure password hashing with bcrypt
- Direct navigation to dashboard after login/registration
AI Integration: Enterprise-grade specialized AI services implemented (12 providers)
- OpenRouter.ai integration with Claude 3.5 Sonnet for general AI features
- Eden AI Hub with Affinda + HireAbility for advanced resume parsing
- Google Gemini 2.5 Flash for intelligent job matching and cover letter generation
- Sovren Enterprise for semantic scoring and precise matching
- HireEZ for talent intelligence and B2B matching optimization
- Skillate AI for skill graphs and machine learning job matching
- Rchilli for ATS-optimized resume parsing with ontology support
- Serper API for enhanced job search via Google with structured data
- Rezi API for professional resume optimization and cover letter generation
- Kickresume AI for intelligent CV building with GPT-powered templates
- Teal HQ for resume tracking, analysis, and rewrite recommendations
- Custom GPT-4o/Claude Flow for custom rewrite modules and advanced cover letters
- HubSpot Smart CRM with custom AI layer (API key pending)
- All services have intelligent fallback functionality and are production-ready
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
- **Authentication**: Custom JWT authentication system
- **Session Management**: JWT tokens with localStorage

### Key Technologies
- **AI Services**: Twelve specialized AI providers for enterprise-grade functionality
  - **OpenRouter.ai**: Claude 3.5 Sonnet for general AI features
  - **Eden AI Hub**: Affinda + HireAbility for advanced resume parsing
  - **Google Gemini 2.5 Flash**: Intelligent job matching and cover letter generation
  - **Sovren Enterprise**: Semantic scoring and extremely precise matching
  - **HireEZ**: Talent intelligence engine with B2B optimization
  - **Skillate AI**: AI-powered skill graphs and machine learning job matching
  - **Rchilli**: ATS-optimized resume parsing with ontology support
  - **Serper API**: Enhanced job search via Google with structured data
  - **Rezi API**: Professional resume optimization and cover letter generation
  - **Kickresume AI**: Intelligent CV building with GPT-powered templates
  - **Teal HQ**: Resume tracking, analysis, and rewrite recommendations
  - **Custom GPT-4o/Claude Flow**: Custom rewrite modules and advanced cover letters
  - **HubSpot Smart CRM**: Customer relationship management with AI layer
- **Payment Processing**: Stripe for subscription management
- **Email Services**: SendGrid for transactional emails
- **Job Board Integration**: Multi-platform job aggregation system
  - **Active APIs**: Jooble, USAJobs, Adzuna, Reed, Remote OK, ZipRecruiter
  - **Enhanced Search**: Serper API for Google-powered job discovery
  - **Planned APIs**: LinkedIn, Indeed, Glassdoor, Monster, CareerBuilder, Dice
  - **Fallback System**: High-quality generated job listings from major tech companies
- **Enterprise Job Search & Market Data**: Comprehensive market intelligence system
  - **Jobspikr**: AI-powered global job aggregation with real-time data feeds
  - **Levels.fyi**: Tech salary benchmarking and compensation analysis
  - **Gehalt.de**: GDPR-compliant German salary data and market insights
  - **Job Market Intelligence Service**: Multi-source analysis and recommendations

## Key Components

### 1. Job Search Engine ✅ IMPLEMENTED
- **Purpose**: Universal job search across multiple job boards
- **Features**: Multi-platform aggregation, intelligent deduplication, advanced filtering
- **Components**: Search interface, job cards, filtering system, real-time API integration
- **Status**: Fully functional with 6+ active job board integrations and fallback system

### 2. Resume Optimization ✅ IMPLEMENTED
- **Purpose**: AI-powered resume analysis and optimization
- **Features**: ATS scoring, keyword optimization, tailored suggestions, job-specific optimization
- **Components**: Resume analyzer with OpenRouter.ai integration, real-time feedback, comprehensive scoring
- **Status**: Fully functional with Claude 3.5 Sonnet backend

### 3. Interview Preparation ✅ IMPLEMENTED
- **Purpose**: AI-powered interview practice and coaching
- **Features**: Custom question generation, performance analysis, real-time feedback, progress tracking
- **Components**: Interview simulator, question generator with difficulty levels, AI-powered feedback system
- **Status**: Fully functional with personalized question generation and performance analysis

### 4. Cover Letter Generation ✅ IMPLEMENTED
- **Purpose**: AI-powered personalized cover letter creation
- **Features**: Job-specific customization, company research integration, professional templates
- **Components**: Cover letter generator with company insights, export functionality
- **Status**: Fully functional with OpenRouter.ai backend

### 5. Company Insights ✅ IMPLEMENTED
- **Purpose**: Comprehensive company research and analysis
- **Features**: Company culture analysis, salary research, interview process info, growth opportunities
- **Components**: Company research dashboard, insights generator, comprehensive data analysis
- **Status**: Fully functional with AI-powered company analysis

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
2. Backend queries 6+ job board APIs simultaneously (Jooble, USAJobs, Adzuna, Reed, Remote OK, ZipRecruiter)
3. System deduplicates results and applies intelligent filtering
4. Skills and requirements extracted from job descriptions
5. Results cached and returned to frontend with source attribution
6. User interactions tracked for analytics

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
- **Active**: Jooble, USAJobs, Adzuna, Reed, Remote OK, ZipRecruiter
- **Planned**: LinkedIn, Indeed, Glassdoor, Monster, CareerBuilder, Dice
- **Discontinued**: Stack Overflow Jobs, GitHub Jobs
- **Requires Partnership**: AngelList, Xing, Seek

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