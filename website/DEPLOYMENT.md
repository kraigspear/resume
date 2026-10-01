# Portfolio deployment and recovery

## Launch status — 2026-10-01

[RES-6](https://linear.app/klimate/issue/RES-6/cut-over-the-verified-portfolio-to-cloudflare)
is **in progress**. The Astro portfolio is live and verified at
`https://kraigspear.net`. The remaining launch work is the GitHub Pages forwarding
transition and verification that the next `main` push triggers an automatic build.

[PR #10](https://github.com/kraigspear/resume/pull/10) merged to `main` as
`3e2396e7dcf7d05e737ef99b9535dbc276c7ea23`. Workers Builds deployed that exact
commit to `https://resume.qdwct4w2sm.workers.dev`, version
`5679a949-ccb0-4307-8bbe-dac749e2f6ce`, in build
`96d26af7-cbde-44d5-ac48-dc68db7bc7c5`.

Custom-domain verification passed on all six primary production routes: `/`, `/resume/`,
`/projects/klimate/`, `/projects/the-beginners-bible/`, `/projects/`, and
`/open-source-contributions/`. Canonical and sharing metadata use the production
domain, with no preview noindex directives. The portrait, icons, sharing card,
and PDF respond correctly; internal source and planning paths return 404.
All 63 legacy redirects and their destinations passed live checks. HTTP apex,
HTTP www, and HTTPS www redirect to the HTTPS apex, preserving paths and query
strings; TLS validation succeeds. Post-merge GitHub checks passed all 32
desktop/mobile tests in each build mode (64 total), and the existing GitHub
Pages build/deployment succeeded.

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

The Radar walkthrough is complete in [PR #11](https://github.com/kraigspear/resume/pull/11)
and available in the separate preview. At this verification, production still
serves the merged PR #10 version above; the Radar release awaits PR #11's merge
and deployment.

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

## Remaining launch work

1. Confirm the next `main` push starts an automatic Astro build using the current
   settings above, and verify the deployed commit and version. Manual deployment
   success alone does not prove the repository webhook is working. After the
   Radar release, verify the walkthrough and new media on the custom domain.
2. Replace the GitHub Pages full site with the forwarding bridge described below,
   now that the custom domain is verified. Record its public verification and
   the automatic-build outcome, then close RES-6.

The unfinished Activities walkthrough and TestFlight access do not block launch.
Keep the existing Squarespace site and the recovery information below available
while the migration stabilizes.

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

**Outcome so far:** transition not applied. GitHub Pages still uses `main`,
path `/`, with the legacy build system. Custom-domain verification is complete;
the forwarding bridge is the remaining hosting transition.

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
the rollback. Verify the restored Worker routes and PDF.

To return the domain to Squarespace, use the local record backup noted above:

1. Disable **Redirect www to kraigspear.net**.
2. Remove the `kraigspear.net` Custom Domain attachment from Worker `resume`.
3. Restore the apex A record to `198.49.23.144` and the www CNAME to
   `ext-sq.squarespace.com`, both DNS-only with automatic TTL. The wildcard
   CNAME already retains its original value.
4. To restore the previous zone settings too, set **Always Use HTTPS** to off.

Cloudflare nameservers can remain in place for this DNS-only recovery. Keep the
old Squarespace site active until the migration is stable; DNS changes are not
instantaneous. To undo the future GitHub forwarding bridge, restore
Pages source to `main`, path `/`, legacy build (and the saved pre-transition
source commit if `main` has since changed).

Deployment mechanics follow the official [Workers Builds API reference](https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/)
and [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/).
