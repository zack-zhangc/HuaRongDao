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

test('supports a full game flow with theme switching and reset controls', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByTestId('board')).toBeVisible();

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveTitle('极简华容道 - 原木版 | Minimal Klotski Wood Edition');

  await page.getByTestId('theme-dark-button').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page).toHaveTitle(
    '极简华容道 - 尊享暗木版 | Minimal Klotski Dark Edition'
  );

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page).toHaveTitle(
    '极简华容道 - 尊享暗木版 | Minimal Klotski Dark Edition'
  );

  const target = page.locator('[data-piece-id="target"]');
  await swipe(target, page, 80, 0);
  await expect(page.getByTestId('move-count')).toHaveText('0');

  await swipe(target, page, 0, 120);
  await expect(page.getByTestId('move-count')).toHaveText('1');
  await expect(page.getByTestId('win-dialog')).toBeVisible();
  await expect(page.locator('#win-summary')).toContainText('一步之遥');

  await page.getByRole('button', { name: '再来一局' }).click();
  await expect(page.getByTestId('move-count')).toHaveText('0');
  await expect(page.getByTestId('win-dialog')).toBeHidden();

  await page.getByTestId('level-select').selectOption('cloud-pass');
  await expect(page.locator('#level-name')).toHaveText('插翅难飞');

  await page.getByTestId('theme-light-button').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveTitle('极简华容道 - 原木版 | Minimal Klotski Wood Edition');
});
