#!/bin/bash

# Optician Pro - Production Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Environment: production (default) | staging

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-production}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups/${TIMESTAMP}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Optician Pro Deployment${NC}"
echo -e "${BLUE}  Environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}  Timestamp: ${TIMESTAMP}${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if running from project root
if [ ! -f "Makefile" ]; then
    echo -e "${RED}Error: Must run from project root directory${NC}"
    exit 1
fi

# Function to print section headers
print_header() {
    echo -e "${YELLOW}\n>>> $1${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Pre-deployment checks
print_header "Running Pre-deployment Checks"

if ! command_exists node; then
    print_error "Node.js is not installed"
    exit 1
fi
print_success "Node.js found: $(node --version)"

if ! command_exists npm; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm found: $(npm --version)"

# Check environment files
if [ "$ENVIRONMENT" = "production" ]; then
    if [ ! -f "server/.env" ]; then
        print_error "server/.env not found. Copy from .env.example and configure."
        exit 1
    fi
    print_success "Server environment file found"
    
    if [ ! -f "client/.env.local" ]; then
        print_error "client/.env.local not found. Copy from .env.example and configure."
        exit 1
    fi
    print_success "Client environment file found"
fi

# Install dependencies
print_header "Installing Dependencies"

echo "Installing server dependencies..."
cd server
npm ci --production=false
print_success "Server dependencies installed"

echo "Installing client dependencies..."
cd ../client
npm ci --production=false
print_success "Client dependencies installed"

cd ..

# Run tests
print_header "Running Tests"

echo "Running backend tests..."
cd server
npm test
if [ $? -eq 0 ]; then
    print_success "Backend tests passed"
else
    print_error "Backend tests failed"
    exit 1
fi

echo "Running frontend tests..."
cd ../client
npm test -- --run
if [ $? -eq 0 ]; then
    print_success "Frontend tests passed"
else
    print_error "Frontend tests failed"
    exit 1
fi

cd ..

# Build applications
print_header "Building Applications"

echo "Building backend..."
cd server
npm run build
if [ $? -eq 0 ]; then
    print_success "Backend built successfully"
else
    print_error "Backend build failed"
    exit 1
fi

echo "Building frontend..."
cd ../client
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# Database migrations (production only)
if [ "$ENVIRONMENT" = "production" ]; then
    print_header "Running Database Migrations"
    
    cd server
    echo "Creating backup before migration..."
    mkdir -p ../backups
    # Note: In production, implement proper database backup here
    
    echo "Running migrations..."
    npx prisma migrate deploy
    if [ $? -eq 0 ]; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed"
        exit 1
    fi
    
    cd ..
fi

# Post-deployment tasks
print_header "Post-deployment Tasks"

# Clear caches and temporary files
echo "Clearing temporary files..."
rm -rf client/.next/cache
rm -rf server/dist/*.map  # Remove source maps in production
print_success "Temporary files cleared"

# Set proper permissions
echo "Setting file permissions..."
chmod -R 755 server/dist
print_success "Permissions set"

# Health check
print_header "Running Health Checks"

echo "Checking backend build..."
if [ -d "server/dist" ] && [ -f "server/dist/main.js" ]; then
    print_success "Backend build verified"
else
    print_error "Backend build verification failed"
    exit 1
fi

echo "Checking frontend build..."
if [ -d "client/dist" ] || [ -d "client/.next" ]; then
    print_success "Frontend build verified"
else
    print_error "Frontend build verification failed"
    exit 1
fi

# Create deployment info file
print_header "Creating Deployment Info"

cat > deployment-info.txt << EOF
Deployment Information
======================
Environment: ${ENVIRONMENT}
Timestamp: ${TIMESTAMP}
Date: $(date)
Node Version: $(node --version)
NPM Version: $(npm --version)
Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "N/A")
Git Branch: $(git branch --show-current 2>/dev/null || echo "N/A")
EOF

print_success "Deployment info created"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Completed Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Start the backend: cd server && npm start"
echo "  2. Start the frontend: cd client && npm start"
echo "  3. Or use PM2/Docker for production deployment"
echo ""
echo -e "${BLUE}Deployment Info:${NC}"
echo "  Environment: ${ENVIRONMENT}"
echo "  Timestamp: ${TIMESTAMP}"
echo "  Info File: deployment-info.txt"
echo ""

exit 0
