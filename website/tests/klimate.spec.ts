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

test('shows real screens and clearly forthcoming engineering material', async ({ page }, testInfo) => {
  await page.goto('/projects/klimate/');
  await expect(page.getByRole('heading', { name: 'A look inside Klimate' })).toBeVisible();
  await expect(page.getByRole('img')).toHaveCount(2);
  for (const image of await page.getByRole('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute('alt', /Klimate.+/);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  for (const title of ['Activities', 'Radar']) {
    const highlight = page.getByRole('article', { name: title, exact: true });
    await expect(highlight.getByText('Walkthrough forthcoming', { exact: true })).toBeVisible();
    await expect(highlight.getByRole('button')).toHaveCount(0);
  }
  await expect(page.getByRole('link', { name: /TestFlight|beta|play|watch/i })).toHaveCount(0);
  await expect(page.locator('iframe, pre')).toHaveCount(0);
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


test('radar recording plays on demand and can be paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/klimate/');
  const video = page.getByLabel('Klimate Radar demonstration');
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('controls', '');
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused && !element.autoplay)).toBe(true);
  await video.evaluate((element: HTMLVideoElement) => element.play());
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.duration)).toBeCloseTo(7, 0);
  await video.evaluate((element: HTMLVideoElement) => element.pause());
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});
