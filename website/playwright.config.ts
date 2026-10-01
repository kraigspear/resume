import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: process.env.TEST_PRODUCTION === 'true'
      ? 'npm run build && npm run preview:production'
      : 'npm run build:preview && npm run preview',
    url: 'http://127.0.0.1:4321', reuseExistingServer: false, timeout: 120000,
  },
});
