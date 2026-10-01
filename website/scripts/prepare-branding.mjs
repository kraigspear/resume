import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const publicDir = new URL('../public/', import.meta.url);
const favicon = await readFile(new URL('favicon.svg', publicDir));
const card = await readFile(new URL('../src/assets/social-card.svg', import.meta.url));

await mkdir(new URL('images/', publicDir), { recursive: true });
await Promise.all([
  sharp(card).png().toFile(fileURLToPath(new URL('images/social-card.png', publicDir))),
  sharp(favicon).resize(32, 32).png().toFile(fileURLToPath(new URL('favicon-32.png', publicDir))),
  sharp(favicon, { density: 216 }).resize(180, 180).png().toFile(fileURLToPath(new URL('apple-touch-icon.png', publicDir))),
]);
console.log('Social sharing card and site icons generated.');
