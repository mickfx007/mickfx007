import { test, expect } from '@playwright/test';

test('home loads and shows controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Style Word Generator')).toBeVisible();
  await expect(page.getByText('Target Word')).toBeVisible();
});

