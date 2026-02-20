import { test, expect } from '@playwright/test';

test.describe('App - Basic Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Code Playground | corvid-agent');
  });

  test('should display header brand with logo and title', async ({ page }) => {
    await expect(page.locator('.header-logo')).toBeVisible();
    await expect(page.locator('.header-title')).toHaveText('Code Playground');
    await expect(page.locator('.header-subtitle')).toHaveText('corvid-agent');
  });

  test('should display all header action buttons', async ({ page }) => {
    await expect(page.locator('#btn-run')).toBeVisible();
    await expect(page.locator('#btn-clear')).toBeVisible();
    await expect(page.locator('#btn-reset')).toBeVisible();
  });

  test('should display the Run button with primary styling', async ({ page }) => {
    const runBtn = page.locator('#btn-run');
    await expect(runBtn).toHaveClass(/btn-primary/);
    await expect(runBtn).toContainText('Run');
  });

  test('should display the Reset button with danger styling', async ({ page }) => {
    const resetBtn = page.locator('#btn-reset');
    await expect(resetBtn).toHaveClass(/btn-danger/);
    await expect(resetBtn).toContainText('Reset');
  });
});

test.describe('App - Key Elements Visible', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all three tab buttons (HTML, CSS, JS)', async ({ page }) => {
    await expect(page.locator('.tab[data-tab="html"]')).toBeVisible();
    await expect(page.locator('.tab[data-tab="css"]')).toBeVisible();
    await expect(page.locator('.tab[data-tab="js"]')).toBeVisible();
  });

  test('should have HTML tab active by default', async ({ page }) => {
    await expect(page.locator('.tab[data-tab="html"]')).toHaveClass(/active/);
    await expect(page.locator('.tab[data-tab="css"]')).not.toHaveClass(/active/);
    await expect(page.locator('.tab[data-tab="js"]')).not.toHaveClass(/active/);
  });

  test('should display the editor panel', async ({ page }) => {
    await expect(page.locator('#editor-panel')).toBeVisible();
  });

  test('should display the preview panel with iframe', async ({ page }) => {
    await expect(page.locator('#preview-panel')).toBeVisible();
    await expect(page.locator('#preview-frame')).toBeVisible();
  });

  test('should display the preview label', async ({ page }) => {
    await expect(page.locator('.preview-label')).toHaveText('Preview');
  });

  test('should display the auto-run checkbox checked by default', async ({ page }) => {
    const autoRun = page.locator('#auto-run');
    await expect(autoRun).toBeVisible();
    await expect(autoRun).toBeChecked();
  });

  test('should display the console panel', async ({ page }) => {
    await expect(page.locator('#console-panel')).toBeVisible();
    await expect(page.locator('.console-title')).toContainText('Console');
  });

  test('should display the status bar with Ready state', async ({ page }) => {
    await expect(page.locator('#status-text')).toHaveText('Ready');
    await expect(page.locator('#status-cursor')).toBeVisible();
  });

  test('should display the resize handle between editor and preview', async ({ page }) => {
    await expect(page.locator('#resize-handle')).toBeVisible();
  });

  test('should display the console resize handle', async ({ page }) => {
    await expect(page.locator('#console-resize-handle')).toBeAttached();
  });
});
