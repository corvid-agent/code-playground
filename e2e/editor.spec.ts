import { test, expect } from '@playwright/test';

test.describe('Editor', () => {
  test('should switch to CSS tab', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab[data-tab="css"]').click();
    await expect(page.locator('#editor-css')).toBeVisible();
  });

  test('should switch to JS tab', async ({ page }) => {
    await page.goto('/');
    await page.locator('.tab[data-tab="js"]').click();
    await expect(page.locator('#editor-js')).toBeVisible();
  });

  test('should show console output area', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#console-output')).toBeAttached();
  });

  test('should show status bar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#status-text')).toBeVisible();
  });

  test('should have resize handle', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#resize-handle')).toBeVisible();
  });

  test('should type in editor', async ({ page }) => {
    await page.goto('/');
    const editor = page.locator('#editor-html');
    await editor.click();
    await editor.fill('<h1>Hello</h1>');
    await expect(editor).toHaveValue(/<h1>Hello<\/h1>/);
  });
});
