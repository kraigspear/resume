# Radar walkthrough evidence — RES-8

## Source and build

Reviewed on 2026-10-01:

- Klimate commit: `39c609636d2a7b3f72d65edfcdb0d0e8011eff77`.
- RadarKit release: **0.9.0**, commit `4013f2969273aac5bfa5eb0a60c44a80b4575975`.
- The app workspace, AppShellFeature, and WeatherFeature `Package.resolved`
  files all pin that revision. Xcode's resolved package checkout matches it;
  there are no tracked modifications to that checkout.
- Klimate's `RadarView` constructs `WeatherRadar` without overriding the
  default automatic renderer. The dependency was updated on September 23 in
  Klimate commit `ae3e873220bcd3a0141744f3ec3e96c8b2d64d84`.
- A fresh Debug simulator build succeeded with Xcode 27.2 (`27B5028f`), with
  automatic resolution and package updates disabled. Its bundle identifier is
  `com.spearware.thunderful`, version `2025.1.0` (build `1`). These app version
  fields alone do not identify the source; retain the commits above.

The sibling RadarKit checkout's HEAD is newer than the consumed revision.
All implementation claims and the excerpt were checked using `git show` at
the pinned revision, rather than reading the sibling working tree as evidence.
No app or RadarKit source files were changed for this portfolio work.

Build command, run from the Klimate repository:

```sh
xcodebuild -project Klimate/Klimate.xcodeproj -scheme Klimate \
  -configuration Debug -destination 'generic/platform=iOS Simulator' \
  -disableAutomaticPackageResolution -onlyUsePackageVersionsFromResolvedFile \
  -skipPackageUpdates build
```

## Claim audit

Paths below are inside `Sources/RadarKit/` at the full RadarKit commit above.

| Portfolio explanation | Implementation evidence |
| --- | --- |
| Direct rendering draws decoded images without the per-tile PNG round trip | `Views/WeatherRadar/Contains/WeatherRadarMap/DirectGridRenderer/RadarGridDirectRenderer.swift`, `draw(_:zoomScale:in:)` |
| Geography/provider/memory determine direct, hybrid, or tile rendering | `DirectGridRenderer/HybridRenderingPolicy.swift`, `mode(for:directRenderingAvailable:previousMode:)`, under the same map directory |
| Initial coverage can be partial; a different timestamp requires complete visible coverage | `DirectGridRenderer/DirectGridRendererController.swift`, `tryPinDesiredFrame()`, lines 541–584; published excerpt is lines 560–565 |
| Known-empty grids settle a frame and clear the prior precipitation | That method's decoded/empty collection; `RadarGridDirectRenderer.canDraw` and `draw` |
| The displayed frame retains shared decoded objects independently of cache eviction | `DirectGridRenderer/DirectGridRendererSupport.swift`, `PinnedGridFrame`; `RadarGridDirectRenderer.pin` |
| Retained images reduce the remaining cache allowance | `General/Cache/DecodedGridImageCache.swift`, external retention accounting and `effectiveCacheCostLimitBytes` |
| Lookahead respects capacity, with tile fallback when the working set cannot fit | `DirectGridMemoryPolicy` in the support file; controller `canRender` and `frameCapacity`; hybrid policy |
| Raw grids, decoded images, and tiles use separate byte budgets | `General/AppConfig/Dependencies.swift`, `General/Cache/URLDataCache.swift`, `General/Cache/DecodedGridImageCache.swift` |

The published snippet is a short excerpt of the owner's implementation. The
RadarKit repository is private, so the public page does not contain inaccessible
GitHub source links. No third-party source or credentials are included.

The walkthrough explains behavior and trade-offs. It does not claim measured
CPU, memory savings, frame rates, or device performance. Simulator playback is
not a performance measurement. Package tests covering partial pins, replacement
frames, clear-sky frames, and external retention were inspected as supporting
intent; they were not rerun because this change does not modify Swift code.

## Media provenance

The October 1 capture was made from the verified build above on a separate
`RES-8 Radar recording` simulator (iPhone 17, iOS 27.2). The app was launched
normally, without UI-test flags, seeded forecasts, or a mock Radar provider.
Caledonia, Michigan was selected through the app's location search. The live
Radar tab was opened, playback started, and the map controls expanded.

The raw simulator capture is `klimate-radar-2026-10-01.mov`: 25.20 seconds,
1206×2622, H.264, no audio, captured at 2026-10-01 09:45 UTC. The local original
is retained at `/private/tmp/klimate-radar-2026-10-01.mov`; it is not committed.
The web clip keeps seconds 7–19 at 720×1566, 30 fps. The first web frame is the
poster. The recording demonstrates loaded animation and control expansion;
the explanation of initial progressive coverage comes from the source audit,
not from a claim that this trimmed clip shows a cold start.

Media commands (FFmpeg 7.1, from the portfolio repository root):

```sh
ffmpeg -ss 7 -i klimate-radar-2026-10-01.mov -t 12 \
  -vf 'scale=720:-2,fps=30' -c:v libx264 -crf 25 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an public-radar.mp4
ffmpeg -i public-radar.mp4 -frames:v 1 -q:v 3 radar-poster.jpg
```

Outputs are committed as `public/videos/klimate-radar.mp4` and
`public/images/klimate-radar-poster.jpg` under `website/`.

| File | SHA-256 |
| --- | --- |
| Raw capture | `d2f6959be591249d42fc0939d57a23a0198fcb095d90eafea75c7d38f312fe29` |
| Web MP4 | `2ecf5187e4298cfae91beb2494141667a9dc77540eae4e02bd47bd082f25f583` |
| Poster | `5de5260cf1bd46351372ee0154a077086060392867e25508efcd05bc04068fbc` |

This replaces the owner's September 30 gallery clip, whose installed dependency
revision could not be confirmed. That original owner-supplied file is unchanged.

This file is source documentation only. Astro serves `public/` and generated
pages; it does not publish this Markdown file.
