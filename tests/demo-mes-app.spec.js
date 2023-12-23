// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Spectrum/);
});

test('Test Routing base', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('img', { name: 'base' }).click();
  const currentURL = page.url();
  await expect(currentURL).toBe('http://localhost:3000/base');
});

test('Test Routing execution', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('img', { name: 'execution' }).click();
    const currentURL = page.url();
    await expect(currentURL).toBe('http://localhost:3000/execution');
  });
  