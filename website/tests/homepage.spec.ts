import { test, expect } from '@playwright/test';

test('introduces the engineer, projects, and a working contact destination', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('iOS Engineer');
  await expect(page.locator('article h3')).toHaveText(['Klimate', 'The Beginner’s Bible']);
  await expect(page.getByRole('link', { name: 'Get in touch', exact: true }).first()).toHaveAttribute('href', 'mailto:kraigspear@gmail.com');
});

test('keeps the preview unindexed and internal files out of public responses', async ({ request }) => {
  const home = await request.get('/');
  expect(home.headers()['x-robots-tag']).toContain('noindex');
  for (const path of ['/CONTEXT.md', '/docs/specs/portfolio-redesign.md', '/package.json', '/src/pages/index.astro', '/node_modules/astro/package.json']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test('supports keyboard navigation, reduced motion, and readable responsive images', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();

  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await navigation.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeInViewport();
  await navigation.getByRole('link', { name: 'About', exact: true }).click();
  await expect(page.getByRole('heading', { name: /A builder/ })).toBeInViewport();
  await navigation.getByRole('link', { name: 'About', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(navigation.getByRole('link', { name: 'Get in touch' })).toBeFocused();
  await expect(navigation.getByRole('link', { name: 'Get in touch' })).toHaveCSS('outline-style', 'solid');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');

  for (const image of await page.getByRole('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('alt', /\S.+/);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('homepage.png'), fullPage: true });
  if (testInfo.project.name === 'mobile') {
    await page.setViewportSize({ width: 320, height: 700 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(navigation).toBeInViewport();
  }
});
