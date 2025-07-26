#!/bin/bash

# SmartJobFit AWS Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="smartjobfit"
AWS_REGION=${AWS_REGION:-"us-east-1"}
ECR_REPOSITORY=${ECR_REPOSITORY:-"smartjobfit"}
ECS_CLUSTER=${ECS_CLUSTER:-"smartjobfit-cluster"}
ECS_SERVICE=${ECS_SERVICE:-"smartjobfit-service"}

echo -e "${BLUE}🚀 SmartJobFit AWS Deployment${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Step 1: Clean and build
print_status "Cleaning previous builds..."
npm run clean

print_status "Installing dependencies..."
npm ci

print_status "Building application..."
npm run build:all

# Step 2: Run tests (if any)
print_status "Running type checks..."
npm run type-check

# Step 3: Build Docker image
print_status "Building Docker image..."
docker build -t $APP_NAME:latest .

# Step 4: Test Docker image locally
print_status "Testing Docker image..."
docker run --rm -d --name $APP_NAME-test -p 3000:3000 $APP_NAME:latest

# Wait for container to start
sleep 10

# Test health endpoint
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    print_status "Docker container is healthy"
else
    print_error "Docker container health check failed"
    docker logs $APP_NAME-test
    docker stop $APP_NAME-test
    exit 1
fi

# Stop test container
docker stop $APP_NAME-test

# Step 5: AWS ECR Login
print_status "Logging into AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Step 6: Tag and push to ECR
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"
print_status "Tagging image for ECR..."
docker tag $APP_NAME:latest $ECR_URI:latest

print_status "Pushing to ECR..."
docker push $ECR_URI:latest

# Step 7: Update ECS service
print_status "Updating ECS service..."
aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --force-new-deployment \
    --region $AWS_REGION

# Step 8: Wait for deployment
print_status "Waiting for deployment to complete..."
aws ecs wait services-stable \
    --cluster $ECS_CLUSTER \
    --services $ECS_SERVICE \
    --region $AWS_REGION

print_status "Deployment completed successfully! 🎉"

# Get service URL
SERVICE_URL=$(aws ecs describe-services \
    --cluster $ECS_CLUSTER \
    --services $ECS_SERVICE \
    --region $AWS_REGION \
    --query 'services[0].loadBalancers[0].dnsName' \
    --output text)

if [ "$SERVICE_URL" != "None" ]; then
    echo -e "${GREEN}🌐 Your application is available at: http://$SERVICE_URL${NC}"
else
    print_warning "Could not determine service URL. Check AWS Console for the correct URL."
fi

echo -e "${BLUE}📊 Monitor your deployment in the AWS Console:${NC}"
echo "ECS Console: https://console.aws.amazon.com/ecs/home?region=$AWS_REGION#/clusters/$ECS_CLUSTER"
echo "CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION" 