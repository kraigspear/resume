import { test, expect } from '@playwright/test';

test('visitors can read employment history and download the authoritative PDF', async ({ page, request }) => {
  await page.goto('/');
  const resumeLink = page.getByRole('navigation').getByRole('link', { name: 'Resume', exact: true });
  await expect(resumeLink).toBeVisible();
  await resumeLink.click();
  await expect(page).toHaveURL(/\/resume\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Resume');
  await expect(page.getByRole('heading', { name: 'Lead iOS Engineer', exact: true })).toBeVisible();
  await expect(page.getByText('2022–Present', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get in touch' }).first()).toHaveAttribute('href', 'mailto:kraigspear@gmail.com');
  const download = page.getByRole('link', { name: 'Download resume (PDF)', exact: true });
  await expect(download).toHaveAttribute('href', '/assets/resume.pdf');
  const response = await request.get('/assets/resume.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const pdf = await response.body();
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  expect(pdf.length).toBeGreaterThan(10000);
});

test('resume history stays readable on narrow screens and supports keyboard download', async ({ page }, testInfo) => {
  await page.goto('/resume/');
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([
    'Lead iOS Engineer', 'Senior iOS Engineer', 'Principal iOS Engineer & Engineering Manager',
    'Senior Developer of Mobile & IoT', 'iOS Lead Architect',
    'Senior Developer for Mobile Applications & IoT', 'Senior iOS Developer',
    'Senior Developer of Mobile Technologies', 'Senior Software Engineer',
  ]);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  const download = page.getByRole('link', { name: 'Download resume (PDF)', exact: true });
  await expect(download).toBeFocused();
  await expect(download).toHaveCSS('outline-style', 'solid');
  const downloadEvent = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  expect((await downloadEvent).suggestedFilename()).toBe('Kraig-Spear-Resume.pdf');
  if (testInfo.project.name === 'mobile') await page.setViewportSize({ width: 320, height: 700 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('resume.png'), fullPage: true });
});
