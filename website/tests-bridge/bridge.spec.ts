import { test, expect } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const origin = 'https://kraigspear.net';

test('old project URLs retain their exact destination and visible fallback', async ({ request }) => {
  const projects = (await readdir(new URL('../../projects/', import.meta.url)))
    .filter(file => file.endsWith('.md')).map(file => `/projects/${file.slice(0, -3)}/`);
  for (const path of ['/', '/resume/', '/projects/', '/projects/klimate/', '/open-source-contributions/', ...projects]) {
    const response = await request.get('/resume' + path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain(`<link rel="canonical" href="${origin}${path}">`);
    expect(html, path).toContain(`<meta http-equiv="refresh" content="0; url=${origin}${path}">`);
    expect(html, path).toContain(`<a href="${origin}${path}">`);
  }
});

test('forwarding preserves the home/resume distinction, query, and fragment', async ({ page }) => {
  await page.route(`${origin}/**`, route => route.fulfill({ contentType: 'text/html', body: '<h1>Destination</h1>' }));
  for (const [oldPath, destination] of [
    ['/resume/', '/'], ['/resume/resume/', '/resume/'],
    ['/resume/projects/klimate/', '/projects/klimate/'], ['/resume/shop-scan/', '/projects/shop-scan/'],
  ]) {
    await page.goto(`${oldPath}?from=old#radar-engineering`);
    await expect(page).toHaveURL(`${origin}${destination}?from=old#radar-engineering`);
  }
});

test('forwarding works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route(`${origin}/**`, route => route.fulfill({ contentType: 'text/html', body: '<h1>Destination</h1>' }));
  await page.goto('http://127.0.0.1:4322/resume/resume/');
  await expect(page).toHaveURL(`${origin}/resume/`);
  await context.close();
});

test('retained binaries remain byte-identical and private/withheld files are absent', async ({ request }) => {
  const rules = (await readFile(new URL('../public/_redirects', import.meta.url), 'utf8')).split('\n');
  const assets = new Map([['/assets/resume.pdf', '/assets/resume.pdf']]);
  for (const line of rules) {
    const [from, to] = line.trim().split(/\s+/);
    if (from && !from.startsWith('/resume/') && to && /\.(pdf|png|jpe?g)$/.test(to)) assets.set(from, to);
  }
  for (const [path, destination] of assets) {
    const response = await request.get('/resume' + path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()['content-type'], path).toMatch(/^(image\/|application\/pdf)/);
    const source = await readFile(new URL('../dist' + destination, import.meta.url));
    expect(createHash('sha256').update(await response.body()).digest('hex'), path)
      .toBe(createHash('sha256').update(source).digest('hex'));
  }
  for (const path of ['CONTEXT.md', 'RADAR.md', 'README.md', 'website/package.json', 'assets/images/target-mobile-deals.jpeg', 'assets/images/target-video-demo.mp4', 'assets/images/avatar.jpg']) {
    expect((await request.get('/resume/' + path)).status(), path).toBe(404);
  }
});

test('unknown old URLs return an honest 404 without an automatic redirect', async ({ page }) => {
  expect((await page.goto('/resume/unknown-old-link/'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found.');
  await expect(page.getByRole('link', { name: 'my portfolio' })).toHaveAttribute('href', origin + '/');
  await expect(page.locator('meta[http-equiv="refresh"]')).toHaveCount(0);
});
