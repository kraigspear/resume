import { test, expect } from '@playwright/test';
import sharp from 'sharp';

test('introduces the engineer, projects, and a working contact destination', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('iOS Engineer');
  await expect(page.locator('article h3')).toHaveText(['Klimate', 'The Beginner’s Bible']);
  await expect(page.getByRole('link', { name: 'Get in touch', exact: true }).first()).toHaveAttribute('href', 'mailto:kraigspear@gmail.com');
});

test('publishes canonical metadata for the intended public routes', async ({ page }) => {
  const imageOrigin = process.env.TEST_PRODUCTION === 'true'
    ? 'https://kraigspear.net'
    : 'https://resume-preview.qdwct4w2sm.workers.dev';
  for (const path of ['/', '/resume/', '/projects/klimate/', '/projects/the-beginners-bible/', '/projects/', '/open-source-contributions/']) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://kraigspear.net${path}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://kraigspear.net${path}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', await page.title());
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${imageOrigin}/images/social-card.png`);
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /Kraig Spear/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', await page.title());
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${imageOrigin}/images/social-card.png`);
  }
});

test('serves the sharing card and site icons as correctly sized images', async ({ page, request }) => {
  await page.goto('/');
  const assets = [
    { selector: 'meta[property="og:image"]', attribute: 'content', type: 'image/png', width: 1200, height: 630 },
    { selector: 'link[rel="icon"][type="image/svg+xml"]', attribute: 'href', type: 'image/svg+xml', width: 64, height: 64 },
    { selector: 'link[rel="icon"][type="image/png"]', attribute: 'href', type: 'image/png', width: 32, height: 32 },
    { selector: 'link[rel="apple-touch-icon"]', attribute: 'href', type: 'image/png', width: 180, height: 180 },
  ];
  for (const asset of assets) {
    const url = await page.locator(asset.selector).getAttribute(asset.attribute);
    expect(url).toBeTruthy();
    // Test the current build's asset, including before production domain cutover.
    const response = await request.get(new URL(url!, page.url()).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain(asset.type);
    expect(await sharp(await response.body()).metadata()).toMatchObject({ width: asset.width, height: asset.height });
  }
});

test('indexes only production and keeps internal files out of public responses', async ({ request }) => {
  const home = await request.get('/');
  const preview = process.env.TEST_PRODUCTION !== 'true';
  expect(home.headers()['x-robots-tag']?.includes('noindex') ?? false).toBe(preview);
  expect((await home.text()).includes('content="noindex, nofollow"')).toBe(preview);
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
