---
sidebar_position: 6
---

# Testing Guide

Optician Pro uses Test-Driven Development (TDD) with comprehensive test coverage for both backend and frontend.

## Test Strategy

### Backend Testing

We use **Jest** with **Supertest** for backend testing:

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and database interactions
- **Coverage Target**: 80%+ code coverage

### Frontend Testing

We use **Vitest** with **React Testing Library** for unit/integration tests and **Playwright** for E2E tests:

- **Unit Tests**: Test individual components and hooks
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Coverage Target**: 70%+ code coverage

## Running Tests

### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- user.service.test.ts
```

### Frontend Unit Tests

```bash
cd client

# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- login-form.test.tsx
```

### E2E Tests

```bash
cd client

# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run tests in UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test auth/auth.spec.ts
```

## Writing Tests

### Backend Test Example

```typescript
// src/modules/user/__tests__/user.service.test.ts
import * as userService from '../user.service';
import { prisma } from '@/lib/prisma';

describe('User Service', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const result = await userService.create(mockUser);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
      expect(result.token).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      await userService.create(mockUser);
      await expect(userService.create(mockUser)).rejects.toThrow();
    });
  });
});
```

### Frontend Test Example

```tsx
// src/components/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### E2E Test Example

```typescript
// e2e/auth/auth.spec.ts
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('manager@optician.pro');
  await page.getByLabel(/password/i).fill('manager123');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

## Test Database

### Backend Test Database

Tests use a separate database (`optician_test_db`) to avoid polluting development data:

```bash
# Create test database
createdb optician_test_db

# Configure in .env.test
DATABASE_URL="postgresql://user:pass@localhost:5432/optician_test_db"
```

The test setup automatically:
1. Cleans the database before each test
2. Rolls back transactions after tests
3. Seeds test data when needed

## Mocking

### Backend Mocking

```typescript
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Use in tests
(prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', name: 'Test' });
```

### Frontend Mocking

```typescript
import { vi } from 'vitest';

// Mock API hooks
vi.mock('@/redux/api/auth', () => ({
  useLoginMutation: () => [
    vi.fn().mockResolvedValue({ data: { user: mockUser } }),
    { isLoading: false },
  ],
}));

// Mock router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
  }),
}));
```

## Test Coverage

Generate coverage reports:

```bash
# Backend
cd server
npm run test:coverage

# Frontend
cd client
npm run test:coverage
```

View coverage reports:
- Backend: `server/coverage/lcov-report/index.html`
- Frontend: `client/coverage/index.html`

## Best Practices

1. **Test Behavior, Not Implementation**: Test what the code does, not how it does it
2. **One Assertion Per Test**: Keep tests focused and readable
3. **Use Descriptive Names**: Test names should explain what's being tested
4. **Arrange-Act-Assert**: Structure tests clearly
5. **Mock External Dependencies**: Don't test external services
6. **Clean Up**: Always clean up test data
7. **Run Tests Before Committing**: Never commit without running tests

## Troubleshooting

### Tests Failing

```bash
# Reset test database
npm run db:test:setup

# Run tests with verbose output
npm test -- --verbose

# Run single test file
npm test -- user.service.test.ts
```

### Coverage Not Generated

```bash
# Clear Jest cache
npx jest --clearCache

# Run coverage again
npm run test:coverage
```

## CI/CD Integration

Tests run automatically on:
- Every pull request
- Every push to main branch
- Before deployment

See `.github/workflows/ci.yml` for configuration.

## Next Steps

- Learn about [API Testing](../api/authentication)
- Explore [Component Testing](#)
- Review [E2E Testing](#)
