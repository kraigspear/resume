# Portfolio deployment and recovery

## Launch status — 2026-09-30

KLI-81 is **in progress**, not a completed domain cutover. The production build
is prepared on `update-profile-photo`. Do not retire existing hosting until the
replacement is verified at `https://kraigspear.net`.

Read-only discovery confirmed:

- `kraigspear.net` redirects to `www.kraigspear.net`; both still use Squarespace.
  The apex resolves to `198.49.23.144` and www to `ext-sq.squarespace.com`.
  Authoritative nameservers are Squarespace/NS1, not Cloudflare.
- The available Cloudflare token exposes only the `spearware.net` zone.
  No `kraigspear.net` zone or Worker custom-domain binding is accessible.
- Account `5449f2872bd04938eca8148dd1706c83` has the existing `resume` Worker
  at `resume.qdwct4w2sm.workers.dev`. Its previous deployment is preserved.
- Its current Workers Builds trigger `46ac9d85-1ca0-47d7-b8d1-f5571fb1cf6d`
  builds `main` at repository root with
  `LC_ALL=C.UTF-8 bundle exec jekyll build --config _config.yml,_config.cloudflare.yml`,
  then `npx wrangler deploy`. These remote settings have **not** changed.
- GitHub Pages currently builds `main` at `/` using the legacy build system,
  serving `https://kraigspear.github.io/resume/`. It remains enabled.

The reviewed preview is deployed at
`https://resume-preview.qdwct4w2sm.workers.dev`, version
`43a58cd8-16bf-46da-9023-fd0cbba6f2df` (2026-09-30). Live checks passed for the
six primary routes, PDF signature/download, preview noindex headers, internal
file 404s, all 63 redirect rules and their destinations, and radar playback.
Both preview and production builds passed all 30 desktop/mobile browser tests;
Astro reported zero errors/warnings, production deployment dry-run and Worker
type generation succeeded. The output inventory contains only portfolio HTML,
CSS, selected images/video, PDF, and Cloudflare routing/header files. Desktop
and narrow-screen resume screenshots were visually checked; earlier ticket
reviews covered the other page layouts. Keyboard and reduced-motion browser
checks passed. Independent standards and spec reviews found no code issues;
the domain, remote-build switch, and Pages transition remain pending.

## Reproducible build

### Preview update — 2026-10-01 (RES-10)

The latest preview at `https://resume-preview.qdwct4w2sm.workers.dev` is version
`2d5f6462-27bd-4bec-a29c-4c4a5bc09b50`. It adds the owner-supplied About portrait,
a KS favicon and Apple touch icon, and a 1200×630 social sharing card. Preview
image metadata uses the Worker origin; production uses `https://kraigspear.net`.

Astro reported zero errors/warnings. All 32 desktop/mobile tests passed in each
of preview and production mode (64 total). Live verification confirmed sharing
metadata and noindex on the six primary routes; all four portrait sizes, the
sharing card, and three icons matched the tested build byte-for-byte and served
with image content types. The new GitHub Actions workflow runs both build modes
and retains browser reports, screenshots, and failure traces. Production hosting,
domain settings, and the existing remote build trigger are unchanged.

### Build commands

Use Node 26.4.0 and the committed npm lockfile. From the repository root:

```sh
npm ci --prefix website
npm run check --prefix website
npm run build --prefix website
cd website
TEST_PRODUCTION=true npm test
npx wrangler deploy --config ../wrangler.jsonc --dry-run
```

Only `website/dist/` is deployable production content. The build copies the
verified PDF and selected public assets; no repository-root publish or Jekyll
build is involved. Canonical and Open Graph URLs use `https://kraigspear.net`.

For a separate nonindexed Cloudflare preview, run `npm run deploy:preview`
from `website/`. It builds `dist-preview/` and deploys `resume-preview`.
The response header covers all preview assets, including the PDF, and the HTML
also requests no indexing. This is not a private or authenticated site.

## Complete the cutover

1. Obtain domain-management access. Add/activate `kraigspear.net` in the intended
   Cloudflare account if needed. Before a nameserver migration, export and retain
   the complete existing DNS zone, including mail and verification records.
   The apex/www observations above are not a complete DNS backup.
2. Preserve the old Squarespace site and the rollback Worker version below.
   Deploy the reviewed production build with `npm run deploy` from `website/`.
   Verify its workers.dev routes, PDF, images, and video before attaching the domain.
3. Connect the active Cloudflare zone to the `resume` Worker using Custom Domains.
   Make the apex canonical and redirect `www` to the apex while preserving paths
   and query strings. Check TLS and DNS propagation before declaring success.
4. Verify on the actual domain: homepage, both featured projects, additional
   projects, resume download, email destination, all rules in `public/_redirects`,
   retained media, 404 responses for internal files, canonical metadata, and
   absence of preview noindex directives. Record the deployed version and results.
5. Coordinate the source release to `main` with the Workers Builds switch. Keep
   repository root `/`, set build command to
   `npm ci --prefix website && npm run build --prefix website`, and deploy command
   to `cd website && npx wrangler deploy --config ../wrangler.jsonc`. Set Node
   version to `26.4.0`. Do not run that trigger on the old Jekyll-only source.
   Confirm the first automatic Astro deployment succeeds. Retire the old Jekyll
   build command at that point; local Ruby need not be removed.
6. Only after custom-domain verification, replace the GitHub Pages full site
   with a forwarding bridge as described below. Record its outcome, then close
   KLI-81. Missing Activities/Radar write-ups and TestFlight access do not block it.

## GitHub Pages inbound-link transition

Cloudflare cannot redirect the `github.io` hostname. Keep a small static bridge
on a dedicated `gh-pages` branch, containing `.nojekyll` and forwarding pages
for `/resume/`, `/resume/resume/`, `/resume/projects/`, every retained project,
and `/resume/open-source-contributions/`. Each page should have its exact
`https://kraigspear.net` canonical URL, a meta refresh, and a visible destination
link. Map the GitHub project root `/resume/` to the new homepage `/`; it is
different from the new resume page `/resume/`.

Preserve actual PDF and retained image bytes at their old GitHub asset paths;
an HTML redirect masquerading as a `.pdf` or image is not reliable. Include an
honest 404 page linking to the new homepage for unknown paths. Use `ROUTES.md`
and the old site's route inventory when producing the bridge. Point Pages at
that branch only after checking the generated bridge, then verify the public
GitHub URLs. This retires the duplicate portfolio while retaining a forwarding
service; do not describe it as disabling Pages entirely.

**Outcome so far:** transition not applied; original Pages settings preserved
because custom-domain verification is not yet possible.

## Recovery

Before this migration, `resume` served version
`6484d10d-3cda-4c2e-a498-bdd285d9616b` at 100%, deployed 2026-09-27 10:56 UTC.
This restores the previous Cloudflare Worker, not the external Squarespace site.
From `website/`, with authorized Cloudflare credentials:

```sh
npx wrangler rollback 6484d10d-3cda-4c2e-a498-bdd285d9616b --name resume
```

Pause automatic builds while diagnosing a failed cutover so they cannot replace
the rollback. Verify the restored Worker routes and PDF. To undo the domain
move, restore the separately exported DNS records/nameservers and keep the old
Squarespace subscription/site active until the migration is stable. DNS changes
are not instantaneous. To undo the future GitHub forwarding bridge, restore
Pages source to `main`, path `/`, legacy build (and the saved pre-transition
source commit if `main` has since changed).

Deployment mechanics follow the official [Workers Builds API reference](https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/)
and [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/).
