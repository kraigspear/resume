import { test, expect } from '@playwright/test';

test('visitors can read the historical case study and return to selected work', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Explore The Beginner’s Bible' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/projects\/the-beginners-bible\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Beginner’s Bible');
  await expect(page.getByText('Historical project · 2012–2015')).toBeVisible();
  await expect(page.getByText('Senior Developer of Mobile Technologies', { exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeInViewport();
});

test('case study stays readable without external video and supports keyboard media disclosure', async ({ page }, testInfo) => {
  await page.route(/youtube-nocookie\.com|player\.vimeo\.com/, route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/the-beginners-bible/');
  await expect(page.getByRole('heading', { name: 'Building the tools to build the book' })).toBeVisible();
  for (const image of await page.getByRole('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('alt', /\S.+/);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  const summary = page.locator('summary').filter({ hasText: 'Watch the publisher walkthrough' });
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTitle('The Beginner’s Bible publisher walkthrough')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open publisher walkthrough on YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=1LUS1dVZJxs');
  await page.keyboard.press('Enter');
  await expect(page.getByTitle('The Beginner’s Bible publisher walkthrough')).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'A shared creative effort' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, 0); });
  await page.screenshot({ path: testInfo.outputPath('bible.png'), fullPage: true });
});
