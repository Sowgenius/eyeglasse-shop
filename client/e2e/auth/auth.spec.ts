import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // Check for login form elements
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login');

    // Submit empty form
    await page.getByRole('button', { name: /login/i }).click();

    // Check for validation errors
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should navigate to dashboard after successful login', async ({ page }) => {
    await page.goto('/login');

    // Fill in credentials (using demo credentials)
    await page.getByLabel(/email/i).fill('manager@optician.pro');
    await page.getByLabel(/password/i).fill('manager123');

    // Submit form
    await page.getByRole('button', { name: /login/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('manager@optician.pro');
    await page.getByLabel(/password/i).fill('manager123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard with stats', async ({ page }) => {
    // Check for dashboard elements
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByText(/clients/i)).toBeVisible();
    await expect(page.getByText(/produits/i)).toBeVisible();
  });

  test('should navigate to customers page', async ({ page }) => {
    await page.getByRole('link', { name: /clients/i }).click();
    await expect(page).toHaveURL('/customers');
    await expect(page.getByRole('heading', { name: /clients/i })).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.getByRole('link', { name: /produits/i }).click();
    await expect(page).toHaveURL('/products');
    await expect(page.getByRole('heading', { name: /produits/i })).toBeVisible();
  });
});
