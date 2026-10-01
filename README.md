# Kraig Spear - Resume & Portfolio

> **View the site:** [kraigspear.net](https://kraigspear.net)

Static Astro portfolio served by Cloudflare Workers. Production builds use `main`.

- [`resume.md`](resume.md) — the resume (source of truth for the PDF at `assets/resume.pdf`)
- [`website/README.md`](website/README.md) — local development, checks, and content maintenance
- [`website/src/pages/`](website/src/pages/) — Astro page routes
- [`website/DEPLOYMENT.md`](website/DEPLOYMENT.md) — current deployment settings, verification, and recovery

## Cloudflare (kraigspear.net)

The production `resume` Worker serves `website/dist/` through the repository-root
[`wrangler.jsonc`](wrangler.jsonc). The custom domain is live and verified;
`www.kraigspear.net` redirects to the HTTPS apex with paths and query strings preserved.

Workers Builds runs from `website`, using `npm ci && npm run build`, followed by
`npx wrangler deploy --config ../wrangler.jsonc`. Use the
[deployment guide](website/DEPLOYMENT.md#current-workers-builds-settings) as the
source of truth for build variables, production versus preview configuration,
and recovery. The separate preview Worker uses `website/wrangler.jsonc` and
`website/dist-preview/`.

## Legacy GitHub Pages

The older Jekyll site still builds from `main` at `/` and serves
[`kraigspear.github.io/resume`](https://kraigspear.github.io/resume/).
Its forwarding transition is pending, as recorded in the
[deployment guide](website/DEPLOYMENT.md#github-pages-inbound-link-transition).
The root `Gemfile`, `.ruby-version`, `_config.yml`, and original project Markdown
support that legacy site; Cloudflare's portfolio build uses Astro.
