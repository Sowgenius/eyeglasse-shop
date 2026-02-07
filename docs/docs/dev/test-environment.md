# Test Environment Setup

This guide explains how to set up the test environment for Optician Pro.

## Prerequisites

- PostgreSQL installed locally
- Node.js 18+ installed

## 1. Create Test Database

```bash
# Create the test database
createdb optician_test_db -U postgres

# Or using psql
psql -U postgres -c "CREATE DATABASE optician_test_db;"
```

## 2. Configure Environment Variables

The `.env.test` file is already configured in `server/.env.test`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/optician_test_db?schema=public"
JWT_SECRET="test-secret-key-for-jwt-tokens-only"
RESEND_API_KEY=""
CLIENT_URL="http://localhost:3000"
NODE_ENV=test
PORT=8081
```

Update the `DATABASE_URL` if your PostgreSQL credentials are different.

## 3. Run Migrations

```bash
cd server

# Set environment to test and run migrations
export NODE_ENV=test
npx prisma migrate deploy
```

Or using dotenv-cli:
```bash
cd server
npm run db:test:setup
```

## 4. Verify Test Setup

Run the tests to ensure everything is working:

```bash
cd server
npm test
```

You should see all tests passing.

## Test Database Structure

The test database has the same schema as the production database but:
- Is cleaned before each test run
- Uses transactions for test isolation
- Can be reset at any time without affecting production data

## Running Tests in Different Modes

### Watch Mode (Development)
```bash
cd server
npm run test:watch
```

### Coverage Report
```bash
cd server
npm run test:coverage
```

### Specific Test File
```bash
cd server
npm test -- user.service.test.ts
```

### CI Mode
```bash
cd server
npm run test:ci
```

## Troubleshooting

### "Database does not exist"
```bash
createdb optician_test_db
```

### "Permission denied"
```bash
# Grant permissions
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE optician_test_db TO postgres;"
```

### "Port already in use"
The test environment uses port 8081 by default. If it's occupied, change it in `.env.test`.

### Reset Test Database
```bash
cd server
npm run db:test:setup
```

This will:
1. Drop all data
2. Re-run migrations
3. Create fresh schema

## Continuous Integration

In CI/CD environments (GitHub Actions), the test database is automatically created using the PostgreSQL service container. See `.github/workflows/ci.yml` for details.

## Best Practices

1. **Never use production database for testing**
2. **Always clean up after tests**
3. **Use transactions for test isolation**
4. **Mock external services (email, APIs)**
5. **Keep test data minimal and focused**

## Frontend Test Environment

Frontend tests use:
- **Vitest** with jsdom for unit tests
- **Playwright** with Chromium/Firefox/WebKit for E2E
- **MSW** for API mocking

No database setup needed for frontend tests.

## E2E Test Environment

E2E tests require:
1. Backend server running on port 8080
2. Frontend running on port 3000
3. Test database with seed data

```bash
# Terminal 1: Start backend
make dev-server

# Terminal 2: Start frontend
make dev-client

# Terminal 3: Run E2E tests
make test-e2e
```
