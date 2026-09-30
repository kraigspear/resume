# Portfolio preview

An isolated static Astro homepage. The root Jekyll site and its production
Cloudflare configuration remain the public site during migration.

## Run locally

Use Node 26.4.0 (or Node >=22.19) and npm. No Ruby is required.

```sh
cd website
npm ci
npm run check
npm run build
npm run preview
```

Open http://127.0.0.1:4321. Preview serves `dist/` through local Cloudflare
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

## Migration boundary

Only `website/dist/` is publishable for the new site. Astro builds page routes
from `src/pages/` and copies explicitly selected `public/` assets. Repository
planning docs, dependency directories, tests, and scripts are outside this
output. The root Jekyll build excludes `website/` entirely.

`wrangler.jsonc` names a separate `resume-preview` worker and has no production
routes or domains. No hosted preview is created by these instructions. If a
hosted preview is provisioned later, use this directory's configuration and
`dist/`, never the root production worker. Preview responses and HTML request
no indexing. Remove those preview restrictions deliberately during KLI-81
production cutover. Do not change the live domain or retire GitHub Pages here.

The homepage links to `/projects/klimate/`; shared navigation returns to the
homepage sections. Klimate is labeled in development. Activities and Radar
walkthroughs remain explicitly forthcoming, with no beta or media controls.
Replace each engineering article with verified completed content when available.

## Images

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
The gallery uses the existing development screenshots, not newly recorded flows.
Detailed code excerpts, performance claims, and recordings await the separate
Activities and Radar content tickets.
