#!/bin/bash

# Optician Pro - Quick User Creation Script
# Usage: ./create-user.sh <email> <name> <password> [user|manager]

set -e

if [ "$#" -lt 3 ]; then
    echo "Usage: $0 <email> <name> <password> [user|manager]"
    echo "Example: $0 john@example.com 'John Doe' password123 manager"
    exit 1
fi

EMAIL="$1"
NAME="$2"
PASSWORD="$3"
ROLE="${4:-user}"

# Convert role to uppercase
ROLE=$(echo "$ROLE" | tr '[:lower:]' '[:upper:]')

cd "$(dirname "$0")/server"

node scripts/create-user.js \
    --email "$EMAIL" \
    --name "$NAME" \
    --password "$PASSWORD" \
    --role "$ROLE"
