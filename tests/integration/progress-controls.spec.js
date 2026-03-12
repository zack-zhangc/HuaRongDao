import { expect, test } from '@playwright/test';

async function swipe(locator, page, deltaX, deltaY) {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Piece is not visible');
  }

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + deltaX, startY + deltaY, { steps: 5 });
  await page.mouse.up();
}

test('supports level switching, undo and restart', async ({ page }) => {
  await page.goto('/');
  const target = page.locator('[data-piece-id="target"]');
  await swipe(target, page, 0, 120);
  await expect(page.getByTestId('move-count')).toHaveText('1');

  await page.getByTestId('undo-button').click();
  await expect(page.getByTestId('move-count')).toHaveText('0');

  await swipe(target, page, 0, 120);
  await page.getByTestId('restart-button').click();
  await expect(page.getByTestId('move-count')).toHaveText('0');

  await page.getByTestId('level-select').selectOption('cloud-pass');
  await expect(page.locator('#level-name')).toHaveText('插翅难飞');
});
