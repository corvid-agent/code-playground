import { test, expect } from '@playwright/test';

test.describe('Editor - Code Input', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show HTML editor textarea as active by default', async ({ page }) => {
    const htmlEditor = page.locator('#editor-html');
    await expect(htmlEditor).toBeVisible();
    await expect(htmlEditor).toHaveClass(/active/);
  });

  test('should have starter HTML content loaded', async ({ page }) => {
    const htmlEditor = page.locator('#editor-html');
    await expect(htmlEditor).toHaveValue(/Hello, Playground!/);
  });

  test('should type in the HTML editor', async ({ page }) => {
    const editor = page.locator('#editor-html');
    await editor.click();
    await editor.fill('<h1>Test Heading</h1>');
    await expect(editor).toHaveValue('<h1>Test Heading</h1>');
  });

  test('should switch to CSS tab and show CSS editor', async ({ page }) => {
    await page.locator('.tab[data-tab="css"]').click();
    const cssEditor = page.locator('#editor-css');
    await expect(cssEditor).toBeVisible();
    await expect(cssEditor).toHaveClass(/active/);
    // HTML editor should be hidden
    await expect(page.locator('#editor-html')).not.toBeVisible();
  });

  test('should have starter CSS content loaded', async ({ page }) => {
    await page.locator('.tab[data-tab="css"]').click();
    const cssEditor = page.locator('#editor-css');
    await expect(cssEditor).toHaveValue(/box-sizing: border-box/);
  });

  test('should switch to JS tab and show JS editor', async ({ page }) => {
    await page.locator('.tab[data-tab="js"]').click();
    const jsEditor = page.locator('#editor-js');
    await expect(jsEditor).toBeVisible();
    await expect(jsEditor).toHaveClass(/active/);
    // HTML and CSS editors should be hidden
    await expect(page.locator('#editor-html')).not.toBeVisible();
    await expect(page.locator('#editor-css')).not.toBeVisible();
  });

  test('should have starter JS content loaded', async ({ page }) => {
    await page.locator('.tab[data-tab="js"]').click();
    const jsEditor = page.locator('#editor-js');
    await expect(jsEditor).toHaveValue(/Playground loaded successfully/);
  });

  test('should update active tab styling when switching', async ({ page }) => {
    // Click CSS tab
    await page.locator('.tab[data-tab="css"]').click();
    await expect(page.locator('.tab[data-tab="css"]')).toHaveClass(/active/);
    await expect(page.locator('.tab[data-tab="html"]')).not.toHaveClass(/active/);

    // Click JS tab
    await page.locator('.tab[data-tab="js"]').click();
    await expect(page.locator('.tab[data-tab="js"]')).toHaveClass(/active/);
    await expect(page.locator('.tab[data-tab="css"]')).not.toHaveClass(/active/);

    // Click back to HTML tab
    await page.locator('.tab[data-tab="html"]').click();
    await expect(page.locator('.tab[data-tab="html"]')).toHaveClass(/active/);
    await expect(page.locator('.tab[data-tab="js"]')).not.toHaveClass(/active/);
  });

  test('should type in CSS editor', async ({ page }) => {
    await page.locator('.tab[data-tab="css"]').click();
    const editor = page.locator('#editor-css');
    await editor.click();
    await editor.fill('body { color: red; }');
    await expect(editor).toHaveValue('body { color: red; }');
  });

  test('should type in JS editor', async ({ page }) => {
    await page.locator('.tab[data-tab="js"]').click();
    const editor = page.locator('#editor-js');
    await editor.click();
    await editor.fill('console.log("test");');
    await expect(editor).toHaveValue('console.log("test");');
  });
});

test.describe('Editor - Run and Output', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should run code and show console output on initial load', async ({ page }) => {
    // The app auto-runs on load after 100ms, which produces "Playground loaded successfully!"
    const consoleOutput = page.locator('#console-output');
    await expect(consoleOutput.locator('.console-entry')).toBeVisible({ timeout: 5000 });
    await expect(consoleOutput.locator('.console-entry-text').first()).toContainText(
      'Playground loaded successfully!'
    );
  });

  test('should run code when clicking the Run button', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500);

    // Click Run
    await page.locator('#btn-run').click();

    // Console should show output from the starter JS
    const consoleOutput = page.locator('#console-output');
    await expect(consoleOutput.locator('.console-entry')).toBeVisible({ timeout: 5000 });
    await expect(consoleOutput.locator('.console-entry-text').first()).toContainText(
      'Playground loaded successfully!'
    );
  });

  test('should clear console when clicking Clear Console button', async ({ page }) => {
    // Wait for initial run to produce console output
    const consoleOutput = page.locator('#console-output');
    await expect(consoleOutput.locator('.console-entry')).toBeVisible({ timeout: 5000 });

    // Click Clear Console
    await page.locator('#btn-clear').click();

    // Console entries should be gone, placeholder should return
    await expect(consoleOutput.locator('.console-entry')).not.toBeVisible();
    await expect(consoleOutput.locator('.console-placeholder')).toBeVisible();
    await expect(consoleOutput.locator('.console-placeholder')).toHaveText(
      'Console output will appear here...'
    );
  });

  test('should clear console using the inline clear button', async ({ page }) => {
    const consoleOutput = page.locator('#console-output');
    await expect(consoleOutput.locator('.console-entry')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-clear-inline').click();

    await expect(consoleOutput.locator('.console-entry')).not.toBeVisible();
    await expect(consoleOutput.locator('.console-placeholder')).toBeVisible();
  });

  test('should update preview iframe when code runs', async ({ page }) => {
    // Fill custom HTML and run
    const htmlEditor = page.locator('#editor-html');
    await htmlEditor.click();
    await htmlEditor.fill('<p id="test-para">E2E Test Content</p>');

    await page.locator('#btn-run').click();

    // Verify the preview iframe contains the content
    const frame = page.frameLocator('#preview-frame');
    await expect(frame.locator('#test-para')).toHaveText('E2E Test Content', { timeout: 5000 });
  });

  test('should show console badge count when entries exist', async ({ page }) => {
    const badge = page.locator('#console-badge');
    // Wait for initial run to produce at least one console entry
    await expect(page.locator('#console-output .console-entry')).toBeVisible({ timeout: 5000 });
    await expect(badge).toHaveClass(/visible/);
  });

  test('should hide console badge after clearing', async ({ page }) => {
    const badge = page.locator('#console-badge');
    await expect(page.locator('#console-output .console-entry')).toBeVisible({ timeout: 5000 });

    await page.locator('#btn-clear').click();

    await expect(badge).not.toHaveClass(/visible/);
    await expect(badge).toHaveText('0');
  });

  test('should auto-run when typing with auto-run checked', async ({ page }) => {
    // Clear console first
    await page.locator('#btn-clear').click();

    // Switch to JS tab and type console.log
    await page.locator('.tab[data-tab="js"]').click();
    const jsEditor = page.locator('#editor-js');
    await jsEditor.click();
    await jsEditor.fill('console.log("auto-run-test");');

    // Wait for debounced auto-run (400ms + render time)
    const consoleOutput = page.locator('#console-output');
    await expect(consoleOutput.locator('.console-entry-text').first()).toContainText(
      'auto-run-test',
      { timeout: 5000 }
    );
  });

  test('should display status text as Ready after run', async ({ page }) => {
    await page.locator('#btn-run').click();
    await expect(page.locator('#status-text')).toHaveText('Ready');
  });
});
