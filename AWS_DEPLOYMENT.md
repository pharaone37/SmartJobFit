# 🚀 SmartJobFit AWS Deployment Guide

This guide will help you deploy SmartJobFit to AWS using ECS, ECR, RDS, and other AWS services.

## 📋 Prerequisites

- AWS CLI installed and configured
- Docker installed and running
- Node.js 18+ installed
- Domain name (optional, for custom domain)

## 🏗️ Infrastructure Overview

The deployment uses the following AWS services:

- **ECS Fargate**: Container orchestration
- **ECR**: Container registry
- **RDS PostgreSQL**: Database
- **Application Load Balancer**: Traffic distribution
- **CloudWatch**: Logging and monitoring
- **VPC**: Network isolation
- **IAM**: Security and permissions

## 🚀 Quick Start

### 1. Build and Test Locally

```bash
# Install dependencies
npm ci

# Build the application
npm run build:all

# Test locally with Docker
docker build -t smartjobfit:latest .
docker run -p 3000:3000 smartjobfit:latest
```

### 2. Deploy Infrastructure

```bash
# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name smartjobfit-production \
  --template-body file://aws-infrastructure.yml \
  --parameters \
    ParameterKey=Environment,ParameterValue=production \
    ParameterKey=DatabasePassword,ParameterValue=YourSecurePassword123! \
  --capabilities CAPABILITY_NAMED_IAM

# Wait for stack creation
aws cloudformation wait stack-create-complete \
  --stack-name smartjobfit-production
```

### 3. Deploy Application

```bash
# Set environment variables
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1
export ECR_REPOSITORY=production-smartjobfit
export ECS_CLUSTER=production-smartjobfit-cluster
export ECS_SERVICE=production-smartjobfit-service

# Run deployment script
./aws-deploy.sh
```

## 📁 Project Structure

```
SmartJobFit/
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared types and schemas
├── dist/                   # Built application
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Local development
├── aws-infrastructure.yml # CloudFormation template
├── aws-deploy.sh          # Deployment script
└── env.production.example # Environment variables
```

## 🔧 Configuration

### Environment Variables

Copy `env.production.example` to `.env.production` and configure:

```bash
# Required for AWS deployment
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your-account-id

# Database (set by CloudFormation)
DATABASE_URL=postgresql://smartjobfit:password@db-endpoint:5432/smartjobfit

# Security
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret

# API Keys (add your actual keys)
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk-your-stripe-key
# ... other API keys
```

### AWS Systems Manager Parameter Store

Store sensitive configuration in AWS Systems Manager:

```bash
# Store API keys securely
aws ssm put-parameter \
  --name "/smartjobfit/production/openai-api-key" \
  --value "sk-your-openai-key" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/smartjobfit/production/stripe-secret-key" \
  --value "sk-your-stripe-key" \
  --type "SecureString"

# ... repeat for other API keys
```

## 🐳 Docker Configuration

### Multi-stage Build

The Dockerfile uses multi-stage builds for optimization:

1. **deps**: Install dependencies
2. **builder**: Build frontend and server
3. **runner**: Production image with minimal footprint

### Health Checks

The container includes health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"
```

## 🔒 Security

### Network Security

- VPC with public and private subnets
- Security groups restricting access
- Database in private subnet
- ALB in public subnet

### Application Security

- Helmet.js for security headers
- Rate limiting on API endpoints
- CORS configuration
- Input validation with Zod

### Secrets Management

- API keys stored in AWS Systems Manager
- Database credentials managed by CloudFormation
- No secrets in code or Docker images

## 📊 Monitoring

### CloudWatch Logs

Logs are automatically sent to CloudWatch:

```bash
# View application logs
aws logs tail /ecs/production-smartjobfit --follow
```

### Health Monitoring

- ALB health checks on `/health` endpoint
- ECS service health monitoring
- CloudWatch alarms (can be configured)

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:all
      - run: npm run type-check
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: ./aws-deploy.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clean and rebuild
   npm run clean
   npm ci
   npm run build:all
   ```

2. **Docker Issues**
   ```bash
   # Test Docker build
   docker build -t test .
   docker run -p 3000:3000 test
   ```

3. **ECS Service Issues**
   ```bash
   # Check service status
   aws ecs describe-services \
     --cluster production-smartjobfit-cluster \
     --services production-smartjobfit-service
   ```

4. **Database Connection Issues**
   ```bash
   # Check RDS status
   aws rds describe-db-instances \
     --db-instance-identifier production-smartjobfit-db
   ```

### Logs and Debugging

```bash
# View ECS task logs
aws logs tail /ecs/production-smartjobfit --follow

# SSH into ECS task (if needed)
aws ecs execute-command \
  --cluster production-smartjobfit-cluster \
  --task task-id \
  --container smartjobfit-app \
  --interactive \
  --command "/bin/bash"
```

## 💰 Cost Optimization

### Resource Sizing

- **ECS**: Start with 256 CPU units and 512MB RAM
- **RDS**: Use db.t3.micro for development
- **ALB**: Use application load balancer (not network)

### Scaling

```bash
# Scale ECS service
aws ecs update-service \
  --cluster production-smartjobfit-cluster \
  --service production-smartjobfit-service \
  --desired-count 3
```

## 🔄 Updates and Maintenance

### Application Updates

```bash
# Build new image
npm run build:all
docker build -t smartjobfit:latest .

# Deploy update
./aws-deploy.sh
```

### Infrastructure Updates

```bash
# Update CloudFormation stack
aws cloudformation update-stack \
  --stack-name smartjobfit-production \
  --template-body file://aws-infrastructure.yml \
  --parameters ParameterKey=Environment,ParameterValue=production
```

## 📞 Support

For issues and questions:

1. Check CloudWatch logs
2. Review ECS service events
3. Verify security group rules
4. Test health endpoints

## 🎯 Next Steps

After successful deployment:

1. Configure custom domain with Route 53
2. Set up SSL certificate with ACM
3. Configure CloudWatch alarms
4. Set up backup strategies
5. Implement monitoring dashboards 