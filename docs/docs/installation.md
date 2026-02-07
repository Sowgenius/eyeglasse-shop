---
sidebar_position: 2
---

# Installation Guide

Complete installation instructions for Optician Pro.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **Git**
- **npm** or **yarn**

### Checking Prerequisites

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check PostgreSQL
psql --version
```

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd eyeglasse-shop
```

## Step 2: Database Setup

### Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE optician_db;

# Exit
\q
```

Or using command line:
```bash
createdb optician_db -U postgres
```

### Configure Connection

Create environment file:

```bash
cd server
cp .env.example .env
```

Edit `.env` file:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/optician_db?schema=public"
JWT_SECRET="your-secret-key-min-32-characters-long"
RESEND_API_KEY=""  # Optional - for email functionality
CLIENT_URL="http://localhost:3000"
NODE_ENV=development
PORT=8080
```

## Step 3: Backend Installation

```bash
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed with demo data
npx prisma db seed

# Start development server
npm run dev
```

The backend will start on `http://localhost:8080`

## Step 4: Frontend Installation

Open a new terminal:

```bash
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 5: Verify Installation

1. Open browser to http://localhost:3000
2. You should see the login page
3. Use demo credentials (if you ran seed):
   - **Email**: `manager@optician.pro`
   - **Password**: `manager123`

## Troubleshooting

### Database Connection Issues

**Error**: `P1001: Can't reach database server`

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it:
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo service postgresql start

# Windows
# Start from Services panel or pgAdmin
```

### Port Already in Use

**Error**: `EADDRINUSE: Address already in use :::8080`

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=8081
```

### Migration Errors

If migrations fail:
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or drop and recreate
dropdb optician_db
createdb optician_db
npx prisma migrate dev
```

## Production Installation

For production deployment, see the [Deployment Guide](../deploy/overview).

## Next Steps

- [Configuration Guide](./configuration)
- [User Guide](../guide/dashboard)
- [API Reference](../api/authentication)
