import { test, expect } from '@playwright/test';

test('visitors can open Klimate and return to selected work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore Klimate' }).click();
  await expect(page).toHaveURL(/\/projects\/klimate\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Klimate');
  await expect(page.getByText('In development', { exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Selected work' })).toBeInViewport();
});

test('shows real screens and keeps unfinished Activities clearly labeled', async ({ page }, testInfo) => {
  await page.goto('/projects/klimate/');
  await expect(page.getByRole('heading', { name: 'A look inside Klimate' })).toBeVisible();
  await expect(page.getByRole('img')).toHaveCount(2);
  for (const image of await page.getByRole('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('alt', /Klimate.+/);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  const activities = page.getByRole('article', { name: 'Activities', exact: true });
  await expect(activities.getByText('Walkthrough forthcoming', { exact: true })).toBeVisible();
  await expect(activities.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /TestFlight|beta|play|watch/i })).toHaveCount(0);
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/klimate/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('klimate.png'), fullPage: true });
});

test('Radar walkthrough and Swift excerpt work with the keyboard', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/klimate/');
  await page.getByRole('link', { name: 'Read the Radar walkthrough' }).click();
  await expect(page).toHaveURL(/#radar-engineering$/);
  const walkthrough = page.getByRole('region', { name: 'Inside Radar' });
  await expect(walkthrough.getByRole('heading', { name: 'Inside Radar' })).toBeInViewport();
  await expect(walkthrough.getByRole('figure')).toBeVisible();
  const excerpt = walkthrough.getByLabel('Swift frame-selection excerpt');
  await expect(excerpt).not.toBeVisible();
  await walkthrough.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(excerpt).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(excerpt).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await walkthrough.screenshot({ path: testInfo.outputPath('radar-walkthrough.png') });
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Enter');
  await expect(excerpt).not.toBeVisible();
  await walkthrough.getByRole('link', { name: 'recording above' }).click();
  await expect(page.getByText('Precipitation animates over Michigan', { exact: false })).toBeInViewport();
});


test('radar recording plays on demand and can be paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/klimate/');
  const video = page.getByLabel('Klimate Radar demonstration');
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('controls', '');
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused && !element.autoplay)).toBe(true);
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.duration)).toBeCloseTo(12, 0);
  await video.evaluate((element: HTMLVideoElement) => element.pause());
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});
