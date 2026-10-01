import { defineConfig } from '@playwright/test';
import portfolio from './playwright.config';
export default defineConfig({
  ...portfolio,
  testDir: './tests-bridge',
  outputDir: './test-results-bridge',
  reporter: process.env.CI ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report-bridge' }]] : 'list',
  use: { ...portfolio.use, baseURL: 'http://127.0.0.1:4322' },
  webServer: { command: 'node tests-bridge/server.mjs', url: 'http://127.0.0.1:4322/resume/', reuseExistingServer: false },
});
