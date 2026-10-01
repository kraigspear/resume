# Portfolio deployment and recovery

## Launch status — 2026-10-01

[RES-6](https://linear.app/klimate/issue/RES-6/cut-over-the-verified-portfolio-to-cloudflare)
is **in progress**. The Astro portfolio is merged and deployed to the production
Worker. Custom-domain verification and the GitHub Pages forwarding transition
remain open. Keep existing hosting until `https://kraigspear.net` is verified.

[PR #10](https://github.com/kraigspear/resume/pull/10) merged to `main` as
`3e2396e7dcf7d05e737ef99b9535dbc276c7ea23`. Workers Builds deployed that exact
commit to `https://resume.qdwct4w2sm.workers.dev`, version
`5679a949-ccb0-4307-8bbe-dac749e2f6ce`, in build
`96d26af7-cbde-44d5-ac48-dc68db7bc7c5`.

Verification passed on all six primary production routes: `/`, `/resume/`,
`/projects/klimate/`, `/projects/the-beginners-bible/`, `/projects/`, and
`/open-source-contributions/`. Canonical and sharing metadata use the production
domain, with no preview noindex directives. The portrait, icons, sharing card,
and PDF respond correctly; `/CONTEXT.md` returns 404. Post-merge GitHub checks
passed all 32 desktop/mobile tests in each build mode (64 total), and the
existing GitHub Pages build/deployment succeeded.

The last domain discovery, on September 30, found `kraigspear.net` redirecting
to `www.kraigspear.net` on Squarespace, with Squarespace/NS1 nameservers. The
available Cloudflare token exposed only the `spearware.net` zone. No DNS or
GitHub Pages source settings were changed during the October 1 deployment.
Recheck access and DNS before cutover; these observations are not a DNS backup.

### Current Workers Builds settings

Account: `5449f2872bd04938eca8148dd1706c83`. Production Worker: `resume`.
Trigger: `46ac9d85-1ca0-47d7-b8d1-f5571fb1cf6d`.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | `website` |
| Build command | `npm ci && npm run build` |
| Deploy command | `npx wrangler deploy --config ../wrangler.jsonc` |
| `NODE_VERSION` | `26.4.0` |
| `SKIP_DEPENDENCY_INSTALL` | `true` |

Both variables are plain build configuration. The explicit `npm ci` replaces
automatic dependency installation. The deploy command must select the
repository-root Wrangler config: `website/wrangler.jsonc` targets the separate
preview Worker.

Cloudflare still detects the repository-root `.ruby-version` during runtime
setup, even with `website` as the build root. The verified build spent about
five minutes installing Ruby before running the Node build/deploy commands.
Changing the build root does not remove that setup overhead.

The verification build was started manually for the merged SHA because the
merge webhook had not queued a build when checked. This confirms the build
configuration and deployed source; the next push must still confirm automatic
triggering. An earlier verification build,
`67a634dc-99d5-4bcf-87c6-ae8f4b21280d`, was cancelled during runtime setup.

### Preview baseline — RES-10

The sharing-polish preview at `https://resume-preview.qdwct4w2sm.workers.dev` is
version `2d5f6462-27bd-4bec-a29c-4c4a5bc09b50`. It adds the owner-supplied About
portrait, a KS favicon and Apple touch icon, and a 1200×630 social sharing card.
Preview image metadata uses the Worker origin; production uses the custom domain.

Astro reported zero errors/warnings. All 32 desktop/mobile tests passed in each
mode. Live checks confirmed sharing metadata and noindex on the six primary
routes; four portrait sizes, the card, and three icons matched the tested build
byte-for-byte with image content types. GitHub Actions retains browser reports,
screenshots, and failure traces. Earlier checks covered all 63 legacy redirects,
Radar playback, keyboard navigation, reduced motion, and the output inventory.

## Reproducible build

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
2. Preserve the old Squarespace site and the rollback Worker versions below.
   Recheck the current production Worker. If source has changed since the verified
   deployment, deploy the reviewed build with `npm run deploy` from `website/`
   and verify its workers.dev routes, PDF, images, and video before attaching the domain.
3. Connect the active Cloudflare zone to the `resume` Worker using Custom Domains.
   Make the apex canonical and redirect `www` to the apex while preserving paths
   and query strings. Check TLS and DNS propagation before declaring success.
4. Verify on the actual domain: homepage, both featured projects, additional
   projects, resume download, email destination, all rules in `public/_redirects`,
   retained media, 404 responses for internal files, canonical metadata, and
   absence of preview noindex directives. Record the deployed version and results.
5. Confirm the next `main` push starts an automatic Astro build using the current
   settings above, and verify the deployed commit and version. Manual deployment
   success alone does not prove the repository webhook is working.
6. Only after custom-domain verification, replace the GitHub Pages full site
   with a forwarding bridge as described below. Record its outcome, then close
   RES-6. Missing Activities/Radar write-ups and TestFlight access do not block it.

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

The first verified Astro production version is
`5679a949-ccb0-4307-8bbe-dac749e2f6ce` (2026-10-01). Use it to recover from a
later portfolio regression. From `website/`, with authorized Cloudflare credentials:

```sh
npx wrangler rollback 5679a949-ccb0-4307-8bbe-dac749e2f6ce --name resume
```

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
