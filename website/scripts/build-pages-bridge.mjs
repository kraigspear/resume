import { mkdir, readFile, readdir, rm, copyFile, writeFile } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const website = fileURLToPath(new URL('../', import.meta.url));
const production = join(website, 'dist');
const output = join(website, 'dist-pages');
const origin = 'https://kraigspear.net';
const pages = new Map();
const assets = new Map([['/assets/resume.pdf', '/assets/resume.pdf']]);

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name === 'index.html') files.push(path);
  }
  return files;
}

// Derive destinations from the actual production output, never from the old base URL.
for (const file of await htmlFiles(production)) {
  const path = '/' + relative(production, file).replace(/index\.html$/, '');
  const html = await readFile(file, 'utf8');
  if (!html.includes(`href="${origin}${path}"`)) throw new Error(`Missing canonical: ${path}`);
  pages.set(path, path);
}
if (!pages.has('/') || !pages.has('/resume/')) throw new Error('Build production first.');

for (const line of (await readFile(join(website, 'public/_redirects'), 'utf8')).split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  const [from, to] = line.trim().split(/\s+/);
  // These aliases already contain GitHub's /resume base path. Pages adds it itself.
  if (from.startsWith('/resume/') || from.includes('*')) continue;
  if (/\.(pdf|png|jpe?g|webp)$/.test(to)) assets.set(from, to);
  else {
    if (!pages.has(to)) throw new Error(`Unknown redirect destination: ${to}`);
    const path = from.endsWith('/') ? from : `${from}/`;
    pages.set(path, to);
  }
}

const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
function document(title, head, body) {
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} — Kraig Spear</title>${head}<style>body{font:18px/1.6 system-ui,sans-serif;margin:12vh auto;padding:0 24px;max-width:640px;color:#20372d;background:#f7f6f2}a{color:#245d45}h1{line-height:1.2}</style></head><body><main>${body}</main></body></html>\n`;
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const [path, destination] of pages) {
  const url = origin + destination;
  const head = `<link rel="canonical" href="${escape(url)}"><meta http-equiv="refresh" content="0; url=${escape(url)}"><script>location.replace(${JSON.stringify(url)} + location.search + location.hash);</script>`;
  const file = join(output, path.slice(1), 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, document('Portfolio moved', head, `<h1>My portfolio has moved.</h1><p>Continue to <a href="${escape(url)}">${escape(url)}</a>.</p>`));
}
for (const [path, source] of assets) {
  const file = join(output, path.slice(1));
  await mkdir(dirname(file), { recursive: true });
  await copyFile(join(production, source.slice(1)), file);
}
await writeFile(join(output, '404.html'), document('Page not found', '', '<h1>Page not found.</h1><p>This old link is no longer available. Visit <a href="https://kraigspear.net/">my portfolio</a> to find the current projects and résumé.</p>'));
console.log(`GitHub Pages bridge: ${pages.size} forwarding pages, ${assets.size} retained files.`);
