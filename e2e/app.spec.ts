import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should load with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Code Playground/i);
  });

  test('should show HTML editor', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#editor-html')).toBeVisible();
  });

  test('should show preview frame', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#preview-frame')).toBeVisible();
  });

  test('should show tab buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tab[data-tab="html"]')).toBeVisible();
  });
});
