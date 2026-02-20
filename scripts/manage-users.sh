#!/bin/bash

# Optician Pro - User Management Script
# Wrapper for Node.js user creation scripts

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/../server"

cd "$SERVER_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}Optician Pro - User Management${NC}"
    echo ""
    echo "Usage: ./scripts/manage-users.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  create        Create a new user"
    echo "  create-admin  Create default admin users"
    echo "  list          List all users"
    echo "  delete        Delete a user by email"
    echo ""
    echo "Options for 'create':"
    echo "  -e, --email     User email (required)"
    echo "  -n, --name      User name (required)"
    echo "  -p, --password  User password (required)"
    echo "  -r, --role      User role: USER or MANAGER (default: USER)"
    echo "  -a, --admin     Create as admin/manager"
    echo ""
    echo "Examples:"
    echo "  ./scripts/manage-users.sh create -e john@example.com -n \"John Doe\" -p secret123"
    echo "  ./scripts/manage-users.sh create --admin -e admin@shop.com -n \"Admin\" -p admin123"
    echo "  ./scripts/manage-users.sh create-admin"
    echo "  ./scripts/manage-users.sh list"
    echo ""
}

create_user() {
    shift # Remove 'create' command
    node scripts/create-user.js "$@"
}

create_admin() {
    node scripts/create-admin.js
}

list_users() {
    echo -e "${BLUE}Listing all users...${NC}\n"
    npx prisma studio --browser none &
    sleep 2
    echo -e "${GREEN}✅ Prisma Studio opened. Press Ctrl+C to close.${NC}"
    wait
}

# Main command handler
case "${1:-}" in
    create)
        create_user "$@"
        ;;
    create-admin)
        create_admin
        ;;
    list)
        list_users
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Error: Unknown command '${1:-}'${NC}"
        show_help
        exit 1
        ;;
esac
