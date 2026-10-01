# Portfolio deployment and recovery

## Launch status

The Astro portfolio, including the completed Radar walkthrough, is published at
`https://kraigspear.net`. [RES-6](https://linear.app/klimate/issue/RES-6/cut-over-the-verified-portfolio-to-cloudflare)
records the rollout and final live verification of automatic deployments and
GitHub Pages forwarding. Activities and TestFlight access remain optional content.

## Verified rollout — 2026-10-01

[PR #12](https://github.com/kraigspear/resume/pull/12) merged as
`b9c8ed1d3ac5894de47d460960edf81a961a65bf`. That push automatically started
[run 36939478430](https://github.com/kraigspear/resume/actions/runs/36939478430),
which passed 68 portfolio browser checks and 10 forwarding checks, deployed
Cloudflare, verified the live commit, and published the GitHub Pages bridge.
No manual deployment or workflow dispatch was needed.

Live checks confirmed all 30 forwarding pages and all 16 retained PDF/image
files match the verified build byte-for-byte, plus a real custom 404 for unknown
paths. Browser navigation from the old GitHub homepage reaches the canonical
portfolio. The six main production routes retain correct canonical/indexing
metadata, the Radar video/poster retain their verified checksums, and private
source paths remain 404.

## Automatic deployment

`.github/workflows/portfolio.yml` owns both public deployments:

1. Pull requests and `main` pushes build and test both preview and production.
   The production job also tests the generated GitHub Pages bridge.
2. Only a successful run on `main` may enter the `cloudflare-production`
   environment. It downloads the exact production assets from that run, installs
   the committed Wrangler version, and deploys with the root `wrangler.jsonc`.
   Pull requests never run deployment jobs or receive the deployment credential.
3. A stale-run guard compares the run's commit with current `main`. Production
   runs are serialized; a newer push does not interrupt an in-flight deployment.
4. `/release.json` must report the run's commit before GitHub Pages is updated.
5. `actions/deploy-pages` publishes the forwarding artifact to the `github-pages`
   environment. GitHub Pages uses the **GitHub Actions** source (`build_type: workflow`).

The `cloudflare-production` environment permits only the `main` branch. It holds
an encrypted `CLOUDFLARE_API_TOKEN` secret and the plain `CLOUDFLARE_ACCOUNT_ID`
variable (`5449f2872bd04938eca8148dd1706c83`). Credentials are supplied only to
Wrangler's deploy step. `github-pages` also permits deployment from `main`.
A manual workflow dispatch from current `main` uses the same checks and artifacts.

All jobs use Node from `website/.node-version`, the npm lockfile, and Ubuntu 24.04.
No Ruby or Jekyll installation participates in either deployment. Preview and
production remain separate: `website/wrangler.jsonc` targets `resume-preview`
and `dist-preview`, while root `wrangler.jsonc` targets `resume` and `website/dist`.

### Superseded Workers Builds integration

The old trigger `46ac9d85-1ca0-47d7-b8d1-f5571fb1cf6d` did not enqueue builds for
the PR #10 or PR #11 main pushes; the dashboard confirmed that the project was
disconnected from its Git account. A manual PR #11 build also remained in Ruby
runtime setup for more than seven minutes and was cancelled. GitHub Actions
replaces that deployment path; the trigger is retained for recovery with all
build-watch paths excluded (`path_excludes: ["*"]`) to prevent competing
deployments. Its previous path exclusions were empty. The exclusion was verified
through the API.

Historical settings: root `website`, build `npm ci && npm run build`, deploy
`npx wrangler deploy --config ../wrangler.jsonc`, `NODE_VERSION=26.4.0`, and
`SKIP_DEPENDENCY_INSTALL=true`. Restoring the old path exclusions does not
prove that its GitHub integration works. Keep it excluded during normal operation.

## GitHub Pages inbound-link transition

`npm run build` generates `website/dist-pages/` after the production Astro build.
The generator uses the actual production routes and explicit legacy redirect
inventory. It creates 30 forwarding pages, 16 retained PDF/image files,
and an honest 404. The old root `/resume/` forwards to the new homepage `/`;
`/resume/resume/` forwards to the new résumé page `/resume/`.

Each forwarding page has its exact production canonical URL, a zero-delay meta
refresh, and a visible destination link. JavaScript preserves query strings and
fragments; no-JavaScript visitors still get the meta refresh and link. Unknown
paths stay 404 rather than automatically forwarding to the homepage. Retained
PDF and image paths serve byte-identical binary files. Withheld Target media,
the previous avatar, source files, and internal planning documents are excluded.

The bridge is published as an Actions artifact, rather than the previously
proposed dedicated `gh-pages` branch, so current PDF/media are rebuilt and checked
with each release without another writable Git credential or generated commits.
This retires the duplicate Jekyll portfolio while retaining inbound links.
Cloudflare cannot issue HTTP redirects for the GitHub-owned hostname; these are
HTML forwarding pages, not server-side 301 responses.

## Reproducible checks and builds

From `website/`, using the committed Node version:

```sh
npm ci
npm run check
npm test
TEST_PRODUCTION=true npm test
npm run test:bridge
npx wrangler deploy --config ../wrangler.jsonc --dry-run
```

There are 34 browser checks in each portfolio mode and 10 forwarding checks
across desktop/mobile. The forwarding tests cover every retained project route,
the home/résumé distinction, queries/fragments, JavaScript-disabled navigation,
binary integrity and MIME types, excluded files, and unknown-path 404s.
The separate resume PDF freshness check remains part of pull-request CI.

Only `website/dist/` is deployable Cloudflare production content; only
`website/dist-pages/` is deployable GitHub forwarding content. Build artifacts,
source, tests, and this guide are not public assets. Preview deployment remains
`npm run deploy:preview` from `website/`; its headers and HTML request no indexing.

### Domain routing — verified October 1, 3:18 PM EDT

Cloudflare zone `09e90b783e3afd06395639fbff8bfb07` is active, using
`carol.ns.cloudflare.com` and `theo.ns.cloudflare.com`.

- `kraigspear.net` is a Custom Domain on production Worker `resume`, attachment
  `f90c11173c67a9e161ca21c078e97cd99d171b50`. Cloudflare manages its DNS and TLS.
- `www` is a proxied CNAME to `kraigspear.net`. Single Redirect
  `86127168a1f442d6ad586db3eab78de1`, named **Redirect www to kraigspear.net**,
  matches `(http.host eq "www.kraigspear.net")` and returns a 301 to
  `concat("https://kraigspear.net", http.request.uri.path)`, with **Preserve
  query string** enabled.
- **Always Use HTTPS** is enabled. The preexisting DNS-only wildcard CNAME to
  `ext-sq.squarespace.com` remains unchanged.

Before replacing the Squarespace apex A record, the complete dashboard list of
three records was captured in the owner's local
`Downloads/kraigspear-net-dns-before-cutover-2026-10-01.json`. This is a
reconstructed record backup, not a BIND export. The token can manage Workers
but lacks DNS/ruleset access; those edits used the signed-in dashboard.
The domain switch did not deploy a new Worker version or change GitHub Pages.

## Recovery

Disable the **Portfolio checks** workflow before rolling back so an in-flight
or later run cannot replace the recovered version. Cancel any running deployment
job and keep the old Workers Builds trigger excluded. Restore the workflow only
after the source regression is repaired or reverted.

The verified pre-automation Radar release is Worker version
`1fb966f1-93b3-4d77-9a82-46174d9fd678` from merged commit
`1ef9a1fa7bc04291c875c0a084c1fcbe9af39d26`. It was published from an isolated
clean source export on October 1, 2026. From `website/`:

```sh
npx wrangler rollback 1fb966f1-93b3-4d77-9a82-46174d9fd678 --name resume
```

The first verified Astro production version is
`5679a949-ccb0-4307-8bbe-dac749e2f6ce` (PR #10). The older pre-Astro Worker version
is `6484d10d-3cda-4c2e-a498-bdd285d9616b`; it does not restore Squarespace.

To recover the old GitHub Pages full site, restore Pages to `build_type: legacy`,
source `main`, path `/`. The pre-transition main commit is
`1ef9a1fa7bc04291c875c0a084c1fcbe9af39d26`; if the root Jekyll files change later,
restore that source into a separate recovery branch and select it instead.
The forwarding workflow must stay disabled during this recovery.

To return the domain to Squarespace, use the local record backup noted above:

1. Disable **Redirect www to kraigspear.net**.
2. Remove the `kraigspear.net` Custom Domain attachment from Worker `resume`.
3. Restore the apex A record to `198.49.23.144` and the www CNAME to
   `ext-sq.squarespace.com`, both DNS-only with automatic TTL. The wildcard
   CNAME already retains its original value.
4. To restore the previous zone settings too, set **Always Use HTTPS** to off.

Cloudflare nameservers can remain in place for this DNS-only recovery. Keep the
old Squarespace site active until the migration is stable; DNS changes are not
instantaneous.

Implementation references: [Cloudflare GitHub Actions deployment](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/),
[GitHub Pages deployment action](https://github.com/actions/deploy-pages), and
[GitHub Pages API](https://docs.github.com/en/rest/pages/pages).
