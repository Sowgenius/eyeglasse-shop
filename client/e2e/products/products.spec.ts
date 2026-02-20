import { test, expect } from '@playwright/test';

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('manager@optician.pro');
    await page.getByLabel(/password/i).fill('manager123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('/dashboard');
  });

  test('should display products table', async ({ page }) => {
    // Wait for the data table to load
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
    
    // Check for table headers
    await expect(page.getByRole('columnheader', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /price/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /quantity/i })).toBeVisible();
  });

  test('should open add product dialog', async ({ page }) => {
    // Click add new button
    await page.getByRole('button', { name: /add new/i }).click();
    
    // Check dialog is open
    await expect(page.getByRole('dialog', { name: /add new product/i })).toBeVisible();
    await expect(page.getByLabel(/product name/i)).toBeVisible();
    await expect(page.getByLabel(/brand name/i)).toBeVisible();
    await expect(page.getByLabel(/price/i)).toBeVisible();
  });

  test('should filter products by brand', async ({ page }) => {
    // Wait for table to load
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
    
    // Use search/filter functionality
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('Ray-Ban');
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Check that filtered results contain the search term
    const table = page.getByTestId('data-table');
    await expect(table).toContainText('Ray-Ban');
  });

  test('should select multiple products', async ({ page }) => {
    // Wait for table to load
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
    
    // Find checkboxes and select first two products
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    
    if (count >= 3) {
      // Select header checkbox to select all
      await checkboxes.first().click();
      
      // Check that bulk actions appear
      await expect(page.getByRole('button', { name: /delete selected/i })).toBeVisible();
    }
  });

  test('should sort products by price', async ({ page }) => {
    // Wait for table to load
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
    
    // Click on price column header to sort
    const priceHeader = page.getByRole('columnheader', { name: /price/i });
    await priceHeader.click();
    
    // Wait for sort to apply
    await page.waitForTimeout(500);
    
    // Table should still be visible
    await expect(page.getByTestId('data-table')).toBeVisible();
  });
});

test.describe('Sales Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('manager@optician.pro');
    await page.getByLabel(/password/i).fill('manager123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('/dashboard');
  });

  test('should open sell product dialog', async ({ page }) => {
    // Wait for table to load
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
    
    // Find and click sell button on first product
    const sellButton = page.getByRole('button', { name: /sell/i }).first();
    await sellButton.click();
    
    // Check sell dialog is open
    await expect(page.getByRole('dialog', { name: /sell product/i })).toBeVisible();
    await expect(page.getByLabel(/buyer name/i)).toBeVisible();
    await expect(page.getByLabel(/quantity/i)).toBeVisible();
  });

  test('should validate quantity input', async ({ page }) => {
    // Wait for table to load
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
    
    // Open sell dialog
    const sellButton = page.getByRole('button', { name: /sell/i }).first();
    await sellButton.click();
    
    // Try to enter invalid quantity
    const quantityInput = page.getByLabel(/quantity/i);
    await quantityInput.fill('-1');
    
    // Should show validation error
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('manager@optician.pro');
    await page.getByLabel(/password/i).fill('manager123');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForURL('/dashboard');
  });

  test('should display correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page to apply mobile styles
    await page.goto('/dashboard');
    
    // Check that main elements are still visible
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
  });

  test('should display correctly on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Reload page
    await page.goto('/dashboard');
    
    // Check layout
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('data-table')).toBeVisible({ timeout: 10000 });
  });
});
