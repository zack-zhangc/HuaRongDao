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

test('records startup and interaction metrics', async ({ page }) => {
  await page.goto('/');
  const readyAt = await page.evaluate(() => window.__appMetrics.readyAt);
  const loadStartedAt = await page.evaluate(() => window.__appMetrics.loadStartedAt);
  expect(readyAt - loadStartedAt).toBeLessThanOrEqual(2000);

  const target = page.locator('[data-piece-id="target"]');
  await swipe(target, page, 0, 120);

  const moveCompletedAt = await page.evaluate(
    () => window.__appMetrics.lastMoveCompletedAt
  );
  const gestureFeedbackAt = await page.evaluate(
    () => window.__appMetrics.lastGestureFeedbackAt
  );
  expect(moveCompletedAt).toBeGreaterThan(0);
  expect(gestureFeedbackAt - loadStartedAt).toBeLessThan(2000);
});
