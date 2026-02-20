#!/bin/bash

# Optician Pro - Environment Setup Script
# This script helps set up the environment for local development or production

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running from project root
if [ ! -f "Makefile" ]; then
    print_error "Must run from project root directory"
    exit 1
fi

print_header "Optician Pro - Environment Setup"

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node --version)"
    exit 1
fi
print_success "Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm $(npm --version)"

# Check for PostgreSQL
if command -v psql &> /dev/null; then
    print_success "PostgreSQL found"
else
    print_warning "PostgreSQL not found. You'll need to install it or use Docker"
fi

# Setup Server Environment
echo -e "\n${YELLOW}Setting up Server Environment...${NC}"

cd server

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created server/.env from example"
        print_warning "Please edit server/.env and configure your database credentials"
    else
        print_error "server/.env.example not found"
    fi
else
    print_success "server/.env already exists"
fi

cd ..

# Setup Client Environment
echo -e "\n${YELLOW}Setting up Client Environment...${NC}"

cd client

if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_success "Created client/.env.local from example"
    else
        # Create default .env.local
        cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080/api
EOF
        print_success "Created client/.env.local with defaults"
    fi
else
    print_success "client/.env.local already exists"
fi

cd ..

# Install dependencies
echo -e "\n${YELLOW}Installing Dependencies...${NC}"

echo "Installing server dependencies..."
cd server
npm install
print_success "Server dependencies installed"

cd ../client
echo "Installing client dependencies..."
npm install
print_success "Client dependencies installed"

cd ..

# Setup database (if PostgreSQL is available)
if command -v psql &> /dev/null; then
    echo -e "\n${YELLOW}Database Setup${NC}"
    
    read -p "Do you want to create the database? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter database name (default: optician_db): " DB_NAME
        DB_NAME=${DB_NAME:-optician_db}
        
        if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
            print_warning "Database $DB_NAME already exists"
        else
            createdb $DB_NAME
            print_success "Database $DB_NAME created"
        fi
        
        # Run migrations
        cd server
        echo "Running database migrations..."
        npx prisma migrate dev
        print_success "Migrations completed"
        
        # Ask about seeding
        read -p "Do you want to seed the database with demo data? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npx prisma db seed
            print_success "Database seeded with demo data"
        fi
        
        cd ..
    fi
else
    print_warning "Skipping database setup (PostgreSQL not found)"
    print_warning "You can use Docker: docker-compose up postgres"
fi

# Setup Git hooks (optional)
if [ -d ".git" ]; then
    echo -e "\n${YELLOW}Git Hooks Setup${NC}"
    
    read -p "Do you want to set up pre-commit hooks? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for Optician Pro

echo "Running pre-commit checks..."

# Run linting
cd server
npm run lint
if [ $? -ne 0 ]; then
    echo "Server linting failed. Commit aborted."
    exit 1
fi

cd ../client
npm run lint
if [ $? -ne 0 ]; then
    echo "Client linting failed. Commit aborted."
    exit 1
fi

cd ..
echo "Pre-commit checks passed!"
EOF
        chmod +x .git/hooks/pre-commit
        print_success "Pre-commit hook installed"
    fi
fi

# Summary
print_header "Setup Complete!"

echo -e "\n${GREEN}Next Steps:${NC}"
echo "  1. Edit server/.env with your configuration"
echo "  2. Start the database: make dev-server or docker-compose up postgres"
echo "  3. Start the backend: cd server && npm run dev"
echo "  4. Start the frontend: cd client && npm run dev"
echo "  5. Visit http://localhost:3000"
echo ""
echo -e "${GREEN}Demo Credentials:${NC}"
echo "  Email: manager@optician.pro"
echo "  Password: manager123"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  make install    - Install all dependencies"
echo "  make dev        - Start all development servers"
echo "  make test       - Run all tests"
echo "  make db-seed    - Seed database with demo data"
echo ""

exit 0
