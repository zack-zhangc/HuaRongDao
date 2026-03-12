import { expect, test } from '@playwright/test';

test('exposes focusable controls with readable labels', async ({ page }) => {
  await page.goto('/');
  for (const testId of [
    'level-select',
    'undo-button',
    'restart-button',
    'sound-toggle',
    'haptics-toggle',
  ]) {
    await expect(page.getByTestId(testId)).toBeVisible();
  }
});

test('supports the empty fixture without blocking the page', async ({ page }) => {
  await page.goto('/?fixture=empty');
  await expect(page.getByTestId('empty-state')).toBeVisible();
  await expect(page.getByText('重新加载')).toBeVisible();
});
