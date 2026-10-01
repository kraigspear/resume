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

GitHub Actions tests preview and production builds, then deploys the tested
production assets on pushes to `main`. The workflow verifies the live commit
before publishing GitHub Pages forwarding pages. See the
[deployment guide](website/DEPLOYMENT.md#automatic-deployment) for environment
settings, preview configuration, and recovery. The separate preview Worker uses
`website/wrangler.jsonc` and `website/dist-preview/`.

## Legacy GitHub Pages

[`kraigspear.github.io/resume`](https://kraigspear.github.io/resume/) forwards
visitors to the corresponding pages on the canonical site. Retained PDF/image
URLs still serve actual files, and unknown paths return a helpful 404.
GitHub Actions publishes this small bridge from `website/dist-pages/`; it no
longer builds the Jekyll site. The original Markdown and Ruby configuration
remain as migration history and recovery material.
