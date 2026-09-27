# Kraig Spear - Resume & Portfolio

> **View the site:** [kraigspear.github.io/resume](https://kraigspear.github.io/resume)

Jekyll + GitHub Pages portfolio site (Minimal Mistakes theme). Deploys from `main`.

- [`resume.md`](resume.md) — the resume (source of truth for the PDF at `assets/resume.pdf`)
- [`projects.md`](projects.md) and [`projects/`](projects/) — project pages
- [`_config.yml`](_config.yml) — site settings and author profile

## Cloudflare (kraigspear.net)

The site is moving from Squarespace to a Cloudflare Worker that serves the built site as static assets. GitHub Pages keeps serving `kraigspear.github.io/resume` until the domain switches.

Workers Builds settings:

- **Build command:** `LC_ALL=C.UTF-8 bundle exec jekyll build --config _config.yml,_config.cloudflare.yml`
  (the build image has no UTF-8 locale, and the theme's Sass fails without one; Cloudflare runs `bundle install` before this)
- **Deploy command:** `npx wrangler deploy`
- **Preview command:** `npx wrangler preview`

[`wrangler.jsonc`](wrangler.jsonc) points the Worker at `_site`. [`_config.cloudflare.yml`](_config.cloudflare.yml) serves the site from the domain root and publishes [`_redirects`](_redirects), which keeps old Squarespace URLs working. [`Gemfile`](Gemfile) and [`.ruby-version`](.ruby-version) pin the build to the GitHub Pages gem set.
