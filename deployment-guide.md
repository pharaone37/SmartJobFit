# SmartJobFit Production Deployment Guide

## 🚀 Domain & SSL Setup

### 1. Domain Configuration
```bash
# Add your domain to REPLIT_DOMAINS environment variable
REPLIT_DOMAINS="yourdomain.com,www.yourdomain.com"
```

### 2. SSL Certificate
- Replit automatically handles SSL certificates
- Your domain will be secured with HTTPS
- No manual certificate management required

## 📊 API Limits & Upgrades Required

### OpenRouter API (RECOMMENDED - Already Configured!)
**Current:** Using OpenRouter with your API key
**Benefits:** Much better than direct OpenAI API!

**What You Get:**
- 200 requests/minute (vs OpenAI's 20)
- 40K tokens/minute (vs OpenAI's limited)
- Better pricing than direct OpenAI
- Access to multiple AI models (GPT-4o, Claude, etc.)
- Automatic failover between models

**Your Setup:**
- ✓ OpenRouter configured with your API key
- ✓ Using `openai/gpt-4o` model through OpenRouter
- ✓ Automatic fallback to other models if needed
- ✓ Better rate limits for production use

**No Action Required:** Your OpenRouter setup is production-ready!

### Stripe API (Production Ready)
**Current:** 25 requests/second
**Action:** Email Stripe Support for production limits

**Template Email:**
```
Subject: Rate Limit Increase Request - SmartJobFit AI Platform

Hello Stripe Team,

I'm launching SmartJobFit, an AI-powered job search platform. We expect:
- 1,000+ users in first month
- 50-100 subscription events per day
- Payment processing for $19-39/month plans

Please increase our rate limit to 100 requests/second.

Company: [Your Company]
Account: [Your Stripe Account ID]
Launch Date: [Your Launch Date]

Thank you!
```

### Anthropic API (Backup AI)
**Current:** Check your tier
**Recommended:** Pro plan ($20/month)
- Ensures AI features work when OpenAI is down
- 25K tokens/minute limit

### SendGrid Email
**Current:** Check your plan
**Recommended:** Pro plan ($89.95/month)
- 100K emails/month
- Essential for job alerts and notifications

## 💳 Payment System Setup

### Stripe Configuration
1. **Products & Prices Setup:**
   - Free Plan: $0/month
   - Professional: $19/month
   - Enterprise: $39/month

2. **Required Environment Variables:**
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

3. **Webhook Configuration:**
   - Endpoint: https://yourdomain.com/api/webhooks/stripe
   - Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted

### Payment Flow
1. User selects plan
2. Stripe checkout session created
3. Payment processed
4. Webhook updates user subscription
5. Access granted to premium features

## 🗄️ Database Production Setup

### Current: Neon Serverless PostgreSQL
**Advantages:**
- Automatic scaling
- Built-in connection pooling
- Backup & recovery
- No server management

### Production Optimizations
1. **Connection Pool Settings:**
```typescript
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increased for production
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
```

2. **Database Monitoring:**
   - Monitor query performance
   - Set up alerts for slow queries
   - Track connection usage

3. **Backup Strategy:**
   - Neon provides automatic backups
   - Consider additional backup to S3 for critical data

## 🔐 Security & Environment Variables

### Required Production Environment Variables
```bash
# Core
NODE_ENV=production
DATABASE_URL=postgresql://...
SESSION_SECRET=your-super-secret-session-key

# Authentication
REPLIT_DOMAINS=yourdomain.com,www.yourdomain.com
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id

# AI Services (OpenRouter provides better rates and limits)
OPENAI_API_KEY=sk-or-... # Your OpenRouter API key
ANTHROPIC_API_KEY=sk-ant-... # Optional backup

# Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Email
SENDGRID_API_KEY=SG....
FROM_EMAIL=noreply@yourdomain.com
```

### Security Headers (Already Configured)
- Content Security Policy
- HSTS (HTTPS enforcement)
- XSS Protection
- Rate limiting (2000 requests/15min in production)

## 🎯 CRM System Integration

### Built-in CRM Features
Your app already includes:
- User management with subscription tracking
- Job application tracking
- Interview scheduling
- Email notifications
- Analytics dashboard

### Enhanced CRM Setup
1. **User Analytics:**
   - Track user engagement
   - Monitor subscription conversions
   - Analyze feature usage

2. **Email Automation:**
   - Welcome sequences
   - Job alerts
   - Subscription reminders
   - Re-engagement campaigns

3. **Support System:**
   - Integrated help center
   - Ticket system (can be added)
   - Live chat integration

## 📈 Production Monitoring

### Health Checks
- `/api/health` endpoint configured
- Database connection monitoring
- Service availability checks

### Performance Monitoring
- API response times
- Database query performance
- Error tracking
- User session monitoring

## 🚢 Deployment Process

### 1. Environment Setup
1. Configure all environment variables
2. Verify API keys and limits
3. Set up domain DNS

### 2. Database Migration
```bash
npm run db:push
```

### 3. Pre-deployment Testing
1. Test payment flows
2. Verify email sending
3. Check AI service responses
4. Test user authentication

### 4. Go Live
1. Update DNS to point to Replit
2. Monitor health endpoints
3. Test all critical flows
4. Monitor error logs

## 🔧 Post-Launch Optimizations

### Week 1
- Monitor API usage and limits
- Track user sign-ups and conversions
- Optimize slow database queries

### Month 1
- Analyze user behavior
- Optimize AI prompts for better results
- Scale API limits based on usage

### Ongoing
- Regular security updates
- Performance optimizations
- Feature enhancements based on user feedback

## 📞 Support Contacts

### API Support
- OpenAI: support@openai.com
- Stripe: support@stripe.com
- Anthropic: support@anthropic.com
- SendGrid: support@sendgrid.com

### Emergency Contacts
- Database issues: Neon support
- Domain issues: Your domain registrar
- Security issues: security@replit.com