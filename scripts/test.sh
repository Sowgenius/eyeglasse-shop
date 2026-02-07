#!/bin/bash

# Test Suite Runner for Optician Pro
# This script runs all tests across the entire project

set -e

echo "🧪 Running Optician Pro Test Suite"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo -e "${YELLOW}$1${NC}"
    echo "----------------------------------------"
}

# Function to check if command succeeded
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 passed${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Backend Tests
print_section "Backend Tests"

cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Generate Prisma client
print_section "Generating Prisma Client"
npx prisma generate
check_result "Prisma Client Generation"

# Run backend unit tests
print_section "Running Backend Unit Tests"
npm test
check_result "Backend Unit Tests"

# Run backend tests with coverage
print_section "Running Backend Tests with Coverage"
npm run test:coverage
check_result "Backend Coverage Tests"

cd ..

# Frontend Tests
print_section "Frontend Tests"

cd client

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Run frontend unit tests
print_section "Running Frontend Unit Tests"
npm test -- --run
check_result "Frontend Unit Tests"

# Run frontend tests with coverage
print_section "Running Frontend Tests with Coverage"
npm run test:coverage
check_result "Frontend Coverage Tests"

# Run type checking
print_section "Running Type Checking"
npm run typecheck
check_result "TypeScript Type Checking"

cd ..

# E2E Tests (optional - takes longer)
if [ "$1" == "--e2e" ]; then
    print_section "E2E Tests"
    
    cd client
    
    # Install Playwright browsers if needed
    if [ ! -d "$HOME/.cache/ms-playwright" ]; then
        echo "Installing Playwright browsers..."
        npx playwright install
    fi
    
    # Run E2E tests
    npm run test:e2e
    check_result "E2E Tests"
    
    cd ..
fi

# Summary
echo ""
echo "================================"
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo "================================"
echo ""
echo "Test Coverage Reports:"
echo "  Backend: server/coverage/lcov-report/index.html"
echo "  Frontend: client/coverage/index.html"
echo ""

if [ "$1" == "--e2e" ]; then
    echo "E2E Report: client/playwright-report/index.html"
    echo ""
fi
