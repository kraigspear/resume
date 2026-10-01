import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
const preview = process.env.PORTFOLIO_PREVIEW === 'true';
export default defineConfig({
  site: 'https://kraigspear.net',
  output: 'static',
  outDir: preview ? './dist-preview' : './dist',
  integrations: [{
    name: 'portfolio-response-headers',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await writeFile(new URL('_headers', dir), `/*\n  X-Content-Type-Options: nosniff\n${preview ? '  X-Robots-Tag: noindex, nofollow\n' : ''}`);
      },
    },
  }],
});
