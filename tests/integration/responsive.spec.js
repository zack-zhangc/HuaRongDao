import { expect, test } from '@playwright/test';

test('keeps the board visible without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const board = page.getByTestId('board');
  await expect(board).toBeVisible();

  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth <= root.clientWidth + 1;
  });
  expect(overflow).toBe(true);
});
