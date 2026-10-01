# Portfolio

Static Astro portfolio for Cloudflare. See [DEPLOYMENT.md](DEPLOYMENT.md) for
the current launch status, build settings, domain cutover, and recovery steps.

## Run locally

Use Node 26.4.0 (or Node >=22.19) and npm. No Ruby is required.

```sh
cd website
npm ci
npm run check
npm run build:preview
npm run preview
```

Open http://127.0.0.1:4321. Preview serves `dist-preview/` through local Cloudflare
Workers static assets using Wrangler. It needs no Cloudflare credentials and
does not deploy anything. `npm run dev` provides Astro's editing server instead.

The committed lockfile pins dependencies. With npm 11.17+, installation scripts
for esbuild and workerd may be reported as skipped; their platform binaries are
provided by optional dependencies. The build and preview commands verify these
binaries work on your platform.

## Verify

```sh
npx playwright install chromium
npm test
```

The browser suite builds the site and starts its own Cloudflare preview on port
4321; stop any existing preview first. Tests run in desktop and mobile Chromium.
Screenshots for visual review are saved under `test-results/`.

The `Portfolio checks` GitHub Actions workflow runs on pull requests, pushes to
`main`, and manual dispatch. It uses `website/.node-version`, installs the locked
dependencies and Chromium, then runs Astro checks and the full desktop/mobile
browser suite separately for preview and production. Playwright builds each mode
and serves it locally through Wrangler; CI needs no Cloudflare credentials.
Reports, failure traces, and screenshots are retained for 14 days. The existing
PDF freshness workflow remains separate.

## Migration boundary

Only `website/dist/` is publishable for the new site. Astro builds page routes
from `src/pages/` and copies explicitly selected `public/` assets. Repository
planning docs, dependency directories, tests, and scripts are outside this
output. The root Jekyll build excludes `website/` entirely.

`website/wrangler.jsonc` names the separate `resume-preview` worker and serves
`dist-preview/`. Preview responses and HTML request no indexing. `npm run dev`
also emits noindex HTML. Noindex is a crawler request, not access control.

`npm run build` produces indexable production files in `dist/`, with canonical
and Open Graph URLs rooted at `https://kraigspear.net`. The root
`../wrangler.jsonc` serves only this production directory. Use
`npm run preview:production` to inspect it locally, and
`TEST_PRODUCTION=true npm test` to run the same browser journeys on that build.
Build outputs are separate so a preview build cannot overwrite production assets.

The homepage links to `/projects/klimate/`; shared navigation returns to the
homepage sections. Klimate is labeled in development. The Radar engineering
walkthrough explains direct rendering, progressive first coverage, frame retention,
and memory trade-offs, with a responsive diagram and a keyboard-accessible Swift
excerpt. Activities remain forthcoming; no beta access is advertised.
See [Radar evidence](RADAR.md) for the verified source revision and media provenance.

## Images

The About section uses the owner-supplied portrait in `src/assets/kraig-spear.png`.
Astro generates responsive WebP versions at build time; the original PNG is
kept as the source and is not copied to the public output.

`src/assets/social-card.svg` is the editable source for the 1200×630 sharing
card. `public/favicon.svg` contains the KS monogram as paths. The build and dev
hooks run `scripts/prepare-branding.mjs` to generate the PNG card, 32px favicon,
and 180px Apple touch icon; these generated files are ignored by Git. Run that
script directly to preview asset changes without building the whole site.
Shared Open Graph and Twitter card metadata uses each page’s title/description.
Production images point at `kraigspear.net`; preview images point at the preview
Worker so they are available before domain cutover. Canonical URLs remain on
the production domain and preview responses remain noindex.

Klimate weather, Activities, and Radar screenshots come from the owner's Klimate app
(`klimate2/Website/public/*-preview.webp`). The Beginner's Bible image is the
existing portfolio asset `assets/images/beginners-bible-toc.jpg`. These are real
project images, copied here so the new build is self-contained.

## Klimate copy evidence — KLI-77

The overview was checked against the owner’s `klimate2` source on 2026-09-30:
`ExtractionModelProviding.swift` drafts structured `ExtractedCriteria` through
`LanguageModelSession`; criteria editor UI tests cover editing criteria;
`HourlyActivityEvaluator.swift` evaluates saved criteria against forecast hours
and delegates Recommendations to `RecommendationEngine`. This supports the
limited overview, not a completed demonstration or a beta availability claim.
The Weather and Activities images use existing development screenshots.
The Radar implementation has a separate source audit in [RADAR.md](RADAR.md).
The Activities walkthrough remains deferred; the site makes no quantitative
performance claims.

## Radar recording

The gallery uses a fresh recording captured on October 1 from a verified Klimate
build with RadarKit 0.9.0. The iPhone 17 simulator runs the normal app and live
NOAA provider, centered on Caledonia, Michigan. The clip shows precipitation
animation, the advancing timeline, and expansion of the map controls.

The 12-second web clip keeps seconds 7–19 of the 25.20-second simulator capture.
It is H.264 MP4, 720×1566, 30 fps, CRF 25, yuv420p, with fast-start metadata and
no audio. The poster is the first frame of the web clip. Playback is initiated
by the visitor, with native controls, inline mobile playback, no preload, and
a visible text description. Source revisions, capture checksums, and the media
commands are recorded in [RADAR.md](RADAR.md).

This supersedes the owner's September 30 clip because the installed dependency
revision of that earlier recording could not be confirmed. The original
owner-supplied file has not been changed.

## The Beginner’s Bible — KLI-78

The historical case study retains `/projects/the-beginners-bible/` and uses the
existing project account in `projects/the-beginners-bible.md` plus its two
original images. The copy distinguishes Kraig’s 2012–2015 engineering role from
Andy Anderson’s visual direction; it makes no current app availability promise.
Unsupported rankings, awards, performance metrics, and ambiguous speech-to-text
claims were not carried forward.

On 2026-09-30, provider oEmbed endpoints returned the original titles and owners
for both Zondervan YouTube videos and Kraig Spear’s Vimeo games compilation.
Direct playback-status requests were rate-limited (YouTube) or forbidden (Vimeo),
so playback availability is not independently certified. Lazy-loaded players
sit in keyboard-operated disclosures with visible contextual descriptions and
provider links. The smoke test blocks the external players deliberately and
verifies that the page and media disclosure remain usable without them.

## Resume and PDF — KLI-79

`../resume.md` remains the authoritative content for the web resume and PDF.
The Astro page imports it at build time, removes only the Jekyll front matter
and download button, and displays the source headline as a paragraph beneath
the page heading. Titles, employers, dates, and body content are preserved.

The source now uses a concise public account. Detailed Target implementation
claims, internal outcomes, usage/revenue/rating metrics, rankings, and regression
improvements were omitted pending owner verification. They remain recoverable
in Git history; do not restore them automatically. Actual employment titles and
dates are unchanged. The source headline emphasizes hands-on iOS engineering.

After any content or PDF-renderer change, from the repository root:

```sh
python3 scripts/build_resume_pdf.py
cd website
npm run check:pdf
npm run build
```

PDF regeneration requires Python 3 and Chrome; set `CHROME_BIN` if Chrome is not
at the default macOS location. The normal site build needs only Node and the
committed PDF. Review the generated PDF's content and page breaks, then commit
`resume.md`, `scripts/build_resume_pdf.py` (if changed), `assets/resume.pdf`, and
`scripts/resume-pdf.sha256` together.

The SHA-256 stamp covers the source, renderer, and PDF bytes in that order.
`prebuild`, `prebuild:preview`, and `predev` reject a stale stamp before copying the authoritative
PDF to the ignored `public/assets/resume.pdf`. The separate GitHub Actions
freshness workflow runs the same check without regenerating or changing files.
There is no second PDF to maintain. `/resume/` and `/assets/resume.pdf` retain
the existing canonical paths. Host migration and legacy GitHub-prefixed URL
redirects remain part of the cutover ticket.

## Additional projects and legacy links — KLI-80

`/projects/` contains the lower-prominence archive; homepage and footer links make
it discoverable. The featured pages retain their separate presentation. See
[ROUTES.md](ROUTES.md) for the complete migration inventory and media decisions.
The root production redirect file is preserved; the new build copies
`public/_redirects` and verifies it through Wrangler in the browser suite.
