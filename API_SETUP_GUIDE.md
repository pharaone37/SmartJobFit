# SmartJobFit API Configuration Guide

## 🚀 Complete API Setup for 52 Services

This guide will help you set up all the API keys needed for SmartJobFit's 9 revolutionary features.

## 📋 Required Environment Variables

Create a `.env` file in your project root with the following variables:

### Core AI Services (4 keys)
```env
# OpenAI - Primary AI for content generation
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"
OPENAI_MAX_TOKENS="4000"

# Anthropic - Alternative AI for complex reasoning
ANTHROPIC_API_KEY="sk-ant-..."
ANTHROPIC_MODEL="claude-3-5-sonnet-20241022"

# Google Gemini - Fast AI for job matching
GOOGLE_API_KEY="your-google-api-key"
GOOGLE_MODEL="gemini-2.0-flash-exp"

# OpenRouter - AI service aggregator
OPENROUTER_API_KEY="sk-or-..."
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
```

### Resume & Optimization (6 keys)
```env
# Eden AI - Resume parsing and optimization
EDENAI_API_KEY="your-edenai-api-key"

# Affinda - Advanced resume parsing
AFFINDA_API_KEY="your-affinda-api-key"

# Sovren - Semantic scoring
SOVREN_API_KEY="your-sovren-api-key"

# Rchilli - ATS-optimized parsing
RCHILLI_API_KEY="your-rchilli-api-key"

# Rezi - Professional resume optimization
REZI_API_KEY="your-rezi-api-key"

# Kickresume - AI CV building
KICKRESUME_API_KEY="your-kickresume-api-key"

# Teal - Resume tracking and analysis
TEAL_API_KEY="your-teal-api-key"
```

### Interview Coaching (5 keys)
```env
# Yoodli - Real-time speech feedback
YOODLI_API_KEY="your-yoodli-api-key"

# Google Interview Warmup
GOOGLE_INTERVIEW_WARMUP_API_KEY="your-google-interview-api-key"

# Vervoe/HireVue - AI Interviewer
VERVOE_API_KEY="your-vervoe-api-key"

# PromptLoop - Custom LLM agents
PROMPTLOOP_API_KEY="your-promptloop-api-key"

# OpenAI Whisper - Speech-to-text
WHISPER_API_KEY="your-whisper-api-key"
```

### Job Board APIs (23 keys)
```env
# Currently Active APIs
JOOBLE_API_KEY="your-jooble-api-key"
USAJOBS_API_KEY="your-usajobs-api-key"
ADZUNA_API_KEY="your-adzuna-api-key"
REED_API_KEY="your-reed-api-key"
REMOTE_OK_API_KEY="your-remoteok-api-key"
ZIPRECRUITER_API_KEY="your-ziprecruiter-api-key"

# LinkedIn Integration
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

# Planned Integrations
INDEED_API_KEY="your-indeed-api-key"
GLASSDOOR_API_KEY="your-glassdoor-api-key"
MONSTER_API_KEY="your-monster-api-key"
CAREERBUILDER_API_KEY="your-careerbuilder-api-key"
DICE_API_KEY="your-dice-api-key"

# International Job Boards
CLEVERISM_API_KEY="your-cleverism-api-key"
WORKOPOLIS_API_KEY="your-workopolis-api-key"
ELUTA_API_KEY="your-eluta-api-key"
JOBBANK_API_KEY="your-jobbank-api-key"
SEEK_API_KEY="your-seek-api-key"
CAREERS_API_KEY="your-careers-api-key"
STEPSTONE_API_KEY="your-stepstone-api-key"
INFOJOBS_API_KEY="your-infojobs-api-key"
JOBSORA_API_KEY="your-jobsora-api-key"
JOBSDB_API_KEY="your-jobsdb-api-key"
JOBSSTREET_API_KEY="your-jobstreet-api-key"
```

### Market Intelligence (4 keys)
```env
# Jobspikr - Global job aggregation
JOBSPIKR_API_KEY="your-jobspikr-api-key"

# Levels.fyi - Tech salary benchmarking
LEVELS_FYI_API_KEY="your-levelsfyi-api-key"

# Gehalt.de - German salary data
GEHALT_API_KEY="your-gehalt-api-key"

# Job Market Intelligence Service
JOB_MARKET_INTELLIGENCE_API_KEY="your-job-market-intelligence-api-key"
```

### Document Processing (3 keys)
```env
# PDF.co - Advanced PDF extraction
PDF_CO_API_KEY="your-pdfco-api-key"

# Docparser - Template-based extraction
DOCPARSER_API_KEY="your-docparser-api-key"

# Unstructured.io - AI document analysis
UNSTRUCTURED_API_KEY="your-unstructured-api-key"
```

### Automation (2 keys)
```env
# Zapier - Webhook automation
ZAPIER_WEBHOOK_URL="your-zapier-webhook-url"

# Make.com - Advanced workflow automation
MAKE_WEBHOOK_URL="your-make-webhook-url"
```

### Research APIs (2 keys)
```env
# Tavily - Real-time search
TAVILY_API_KEY="your-tavily-api-key"

# Perplexity - AI-powered search
PERPLEXITY_API_KEY="your-perplexity-api-key"
```

### Business Services (3 keys)
```env
# HubSpot - CRM with AI layer
HUBSPOT_API_KEY="your-hubspot-api-key"

# SendGrid - Email services
SENDGRID_API_KEY="your-sendgrid-api-key"

# Stripe - Payment processing
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 🔧 API Setup Instructions

### 1. Core AI Services Setup

#### OpenAI
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create account and add payment method
3. Generate API key in API Keys section
4. Set usage limits and billing alerts

#### Anthropic
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account and verify email
3. Generate API key
4. Set up usage monitoring

#### Google Gemini
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create project in Google Cloud Console
3. Enable Gemini API
4. Generate API key

#### OpenRouter
1. Visit [OpenRouter](https://openrouter.ai/)
2. Create account and add payment method
3. Generate API key
4. Configure model preferences

### 2. Job Board APIs Setup

#### Jooble (Recommended for MVP)
1. Visit [Jooble API](https://jooble.org/api)
2. Register for free account
3. Get API key instantly
4. Test with sample requests

#### LinkedIn Jobs API
1. Visit [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create app and request Jobs API access
3. Generate OAuth 2.0 credentials
4. Set up redirect URIs

### 3. Resume Optimization APIs

#### Eden AI (Recommended for MVP)
1. Visit [Eden AI](https://edenai.co/)
2. Create account and add credits
3. Get API key
4. Test resume parsing endpoints

### 4. Payment Setup

#### Stripe
1. Visit [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create account and verify business details
3. Get test API keys
4. Set up webhook endpoints

## 🎯 MVP Priority Setup

For initial launch, focus on these essential APIs:

### Phase 1 (Week 1) - Core Functionality
```env
# Essential for MVP
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
JOOBLE_API_KEY="your-jooble-api-key"
EDENAI_API_KEY="your-edenai-api-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
SENDGRID_API_KEY="your-sendgrid-api-key"
```

### Phase 2 (Week 2) - Enhanced Features
```env
# Add these for better functionality
GOOGLE_API_KEY="your-google-api-key"
OPENROUTER_API_KEY="sk-or-..."
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
```

### Phase 3 (Week 3+) - Full Feature Set
```env
# Add remaining APIs for complete functionality
# (All other APIs listed above)
```

## 🔒 Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all secrets**
3. **Rotate API keys regularly**
4. **Set up usage monitoring and alerts**
5. **Use API key prefixes for organization**
6. **Implement rate limiting and error handling**

## 💰 Cost Estimation

### Monthly API Costs (Estimated)
- **OpenAI GPT-4o**: $50-200/month
- **Anthropic Claude**: $30-150/month
- **Job Board APIs**: $100-500/month
- **Resume APIs**: $50-200/month
- **Email Services**: $20-100/month
- **Payment Processing**: 2.9% + $0.30 per transaction

**Total Estimated Monthly Cost**: $250-1,150/month

## 🚀 Next Steps

1. **Set up essential APIs** (Phase 1)
2. **Test API integrations** with sample data
3. **Implement error handling** and fallbacks
4. **Add monitoring** and analytics
5. **Scale up** with additional APIs as needed

## 📞 Support

For API-specific issues:
- Check each provider's documentation
- Use their support channels
- Monitor API status pages
- Set up webhook notifications for outages

---

**Ready to launch SmartJobFit?** Start with Phase 1 APIs and build up from there! 🎉 