import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: true,
  retries: 0,
  timeout: 30000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/dev-server.mjs . 4173',
    port: 4173,
    reuseExistingServer: true,
    timeout: 30000,
  },
  projects: [
    {
      name: 'chromium-mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'webkit-mobile',
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        browserName: 'chromium',
        viewport: { width: 820, height: 1180 },
      },
    },
    {
      name: 'webkit-tablet',
      use: {
        browserName: 'webkit',
        viewport: { width: 820, height: 1180 },
      },
    },
    {
      name: 'chromium-desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        browserName: 'webkit',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
