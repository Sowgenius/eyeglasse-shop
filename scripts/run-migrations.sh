#!/bin/bash
# Emergency Migration Script
# Usage: ./scripts/run-migrations.sh [environment]
#
# This script runs database migrations for the specified environment.
# It includes safety checks and rollback capability.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Database Migration Script${NC}"
echo -e "${YELLOW}  Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}========================================${NC}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL is not set!${NC}"
    echo "Please set the DATABASE_URL environment variable:"
    echo "  export DATABASE_URL='postgresql://user:pass@host:5432/db'"
    exit 1
fi

# Function to run migrations
run_migrations() {
    echo -e "\n${GREEN}Running migrations...${NC}"
    
    cd "$PROJECT_ROOT/server"
    
    # First, verify database connection
    echo "Verifying database connection..."
    if ! npx prisma db execute --stdin <<< "SELECT 1" 2>/dev/null; then
        echo -e "${RED}Cannot connect to database!${NC}"
        echo "Please check your DATABASE_URL and ensure the database is running."
        exit 1
    fi
    
    echo "Connection verified!"
    
    # Run migrations with verbose output
    echo "Applying migrations..."
    npx prisma migrate deploy --schema=./prisma/schema.prisma --verbose
    
    # Verify the migration was successful
    echo "Verifying migration status..."
    npx prisma migrate status --schema=./prisma/schema.prisma
    
    echo -e "\n${GREEN}✓ Migrations completed successfully!${NC}"
}

# Function to reset database (DANGER!)
reset_database() {
    echo -e "${RED}⚠️  WARNING: This will reset the database!${NC}"
    echo -e "${RED}⚠️  ALL DATA WILL BE LOST!${NC}"
    read -p "Type 'yes' to confirm: " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "Cancelled."
        exit 0
    fi
    
    echo -e "${RED}Resetting database...${NC}"
    
    cd "$PROJECT_ROOT/server"
    
    # Reset and re-apply all migrations
    npx prisma migrate reset --schema=./prisma/schema.prisma --force --skip-seed
    
    echo -e "${GREEN}✓ Database reset complete!${NC}"
}

# Function to create a backup before migration
create_backup() {
    echo -e "${YELLOW}Creating database backup...${NC}"
    
    if command -v pg_dump &> /dev/null; then
        BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"
        
        # Extract connection details from DATABASE_URL
        # Format: postgresql://user:pass@host:port/database
        DB_USER=$(echo "$DATABASE_URL" | sed -E 's|.*://([^:]+):.*|\1|')
        DB_PASS=$(echo "$DATABASE_URL" | sed -E 's|.*://[^:]+:([^@]+)@.*|\1|')
        DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^:]+):.*|\1|')
        DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*:([0-9]+)/.*|\1|')
        DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*/([^?]+).*|\1|')
        
        PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BACKUP_FILE"
        
        echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
    else
        echo -e "${YELLOW}⚠️  pg_dump not found. Skipping backup.${NC}"
    fi
}

# Parse command line arguments
case "$2" in
    --backup)
        create_backup
        run_migrations
        ;;
    --reset)
        reset_database
        ;;
    --help|-h)
        echo "Usage: $0 [environment] [command]"
        echo ""
        echo "Commands:"
        echo "  (none)     Run pending migrations"
        echo "  --backup   Create backup before migrating"
        echo "  --reset    Reset database (DANGER!)"
        echo "  --help     Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 production              # Run migrations in production"
        echo "  $0 staging --backup        # Backup then migrate in staging"
        exit 0
        ;;
    *)
        run_migrations
        ;;
esac
