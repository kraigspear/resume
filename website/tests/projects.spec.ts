import { test, expect } from '@playwright/test';

test('visitors can browse additional projects and open-source work', async ({ page }) => {
  await page.goto('/');
  const allProjects = page.getByRole('link', { name: 'More projects', exact: true }).first();
  await expect(allProjects).toBeVisible();
  await allProjects.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('More projects');
  await page.getByRole('link', { name: 'FastCast', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('FastCast');
  await page.getByRole('link', { name: 'Back to all projects', exact: true }).click();
  await page.getByRole('link', { name: 'Open source & patents', exact: true }).first().click();
  await expect(page.getByRole('link', { name: 'View contribution #26' })).toHaveAttribute('href', 'https://github.com/solid-software/flutter_vlc_player/pull/26');
});

test('legacy rules redirect to usable destinations in Cloudflare', async ({ request }) => {
  const { readFile } = await import('node:fs/promises');
  const rules = (await readFile(new URL('../public/_redirects', import.meta.url), 'utf8'))
    .split('\n').filter(line => line.trim() && !line.startsWith('#'));
  expect(rules.length).toBeGreaterThanOrEqual(15);
  for (const rule of rules) {
    const [from, to, status] = rule.trim().split(/\s+/);
    const sample = from.startsWith('/resume/assets/') ? 'resume.pdf' : from.startsWith('/resume/projects/') ? 'fastcast/' : 'old-page';
    const response = await request.get(from.replace('*', sample), { maxRedirects: 0 });
    expect(response.status(), from).toBe(Number(status));
    const location = response.headers().location;
    expect(new URL(location, 'http://127.0.0.1:4321').pathname, from).toBe(to.replace(':splat', sample));
    expect((await request.get(location)).status(), `${from} destination`).toBe(200);
  }
});

test('migrated pages have working internal links and assets on desktop and mobile', async ({ page, request }, testInfo) => {
  const { readdir } = await import('node:fs/promises');
  const legacyProjects = (await readdir(new URL('../../projects/', import.meta.url)))
    .filter(file => file.endsWith('.md')).map(file => `/projects/${file.slice(0, -3)}/`);
  const routes = ['/', '/projects/', '/projects/klimate/', '/resume/', '/open-source-contributions/', ...legacyProjects];
  const checked = new Set<string>();
  await page.route(/youtube-nocookie\.com|player\.vimeo\.com/, route => route.abort());
  for (const route of routes) {
    expect((await page.goto(route))?.status(), route).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    const targets = await page.locator('a[href], img[src], source[src], video[poster]').evaluateAll(elements => elements.flatMap(element =>
      ['href', 'src', 'poster'].map(attribute => element.getAttribute(attribute)).filter((value): value is string => !!value && value.startsWith('/'))));
    for (const target of targets) {
      if (checked.has(target)) continue;
      checked.add(target);
      const response = await request.get(target);
      expect(response.status(), `${route}: ${target}`).toBe(200);
      const fragment = new URL(target, 'http://127.0.0.1:4321').hash.slice(1);
      if (fragment) expect(await response.text(), target).toContain(`id="${fragment}"`);
    }
    if (route === '/projects/' || route === '/projects/fastcast/') {
      for (const image of await page.getByRole('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(route === '/projects/' ? 'projects.png' : 'fastcast.png'), fullPage: true });
    }
  }
  await page.goto('/projects/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Klimate', exact: true })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Klimate', exact: true })).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/klimate\/?$/);
});
