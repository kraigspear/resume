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
engineering explanations remain forthcoming. The Radar gallery includes a real
recording with native playback controls; no beta access is advertised.
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

## Radar recording

The owner-supplied `ScreenRecording_09-30-2026 04-14-13_1.MP4` replaces the
static Radar gallery image. The web clip keeps 0.5–7.5 seconds of the 9.07-second
source. It is H.264 MP4, 720×1564, 30 fps, CRF 25, yuv420p, with fast-start
metadata and the silent audio track removed. The poster is taken at 0.5 seconds.
The original recording is unchanged and is not included in the site. Playback
is user-initiated, with native controls, inline mobile playback, no preload,
and a visible text description. The engineering write-up remains deferred.

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
