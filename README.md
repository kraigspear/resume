# Kraig Spear - Resume & Portfolio

> **View the site:** [kraigspear.github.io/resume](https://kraigspear.github.io/resume)

Jekyll + GitHub Pages portfolio site (Minimal Mistakes theme). Deploys from `main`.

- [`resume.md`](resume.md) — the resume (source of truth for the PDF at `assets/resume.pdf`)
- [`projects.md`](projects.md) and [`projects/`](projects/) — project pages
- [`_config.yml`](_config.yml) — site settings and author profile

## Cloudflare Pages (kraigspear.net)

The site is moving from Squarespace to Cloudflare Pages at kraigspear.net. GitHub Pages keeps serving `kraigspear.github.io/resume` until the domain switches.

- **Build command:** `bundle exec jekyll build --config _config.yml,_config.cloudflare.yml`
- **Output directory:** `_site`
- [`_config.cloudflare.yml`](_config.cloudflare.yml) serves the site from the domain root and publishes [`_redirects`](_redirects), which keeps old Squarespace URLs working. [`Gemfile`](Gemfile) and [`.ruby-version`](.ruby-version) pin the build to the GitHub Pages gem set.
