# Route and media inventory — KLI-80

Only `website/dist/` is public output. This inventory stays in the source tree.

## Canonical routes

| Existing reference | New destination | Treatment |
| --- | --- | --- |
| `/` | `/` | Featured Klimate and Beginner’s Bible introductions |
| `/projects/` | `/projects/` | Secondary project index |
| `/projects/the-beginners-bible/` | Same path | Historical case study |
| New Klimate preview | `/projects/klimate/` | Current featured project |
| `/resume/` | Same path | Root resume source rendered at build time |
| `/assets/resume.pdf` | Same path | Authoritative PDF, copied after freshness validation |
| `/open-source-contributions/` | Same path | Original contribution and patent links |
| `/projects/target/` | Same path | Concise professional work |
| `/projects/shop-scan/` | Same path | Concise historical retail work |
| `/projects/team-assist/` | Same path | Concise historical enterprise work |
| `/projects/shop-scan-status/` | Same path | Concise historical enterprise work |
| `/projects/mpizza/` | Same path | Concise historical prototype |
| `/projects/amway-refreshments/` | Same path | Concise historical collaboration |
| `/projects/the-purpose-driven-life/` | Same path | Concise historical publishing work |
| `/projects/common-prayer/` | Same path | Concise historical publishing work |
| `/projects/studygateway/` | Same path | Concise historical publishing work |
| `/projects/seth-godins-blog/` | Same path | Concise historical collaboration |
| `/projects/fastcast/` | Same path | Concise earlier personal project |

## Legacy redirects

All original Squarespace rules from the root `_redirects` are retained in
`public/_redirects`. Explicit trailing-slash aliases and specific GitHub Pages
base-path aliases are added; `/resume/` itself remains the resume page.
The root production `_redirects` is unchanged.

| Incoming path | Destination | Status |
| --- | --- | --- |
| `/s/Resume-2020.pdf` | `/assets/resume.pdf` | 301 |
| `/home` | `/` | 301 |
| `/blog` | `/` | 301 |
| `/shop-scan` | `/projects/shop-scan/` | 301 |
| `/team-assist` | `/projects/team-assist/` | 301 |
| `/shop-scan-status` | `/projects/shop-scan-status/` | 301 |
| `/mpizza` | `/projects/mpizza/` | 301 |
| `/amway-refreshments` | `/projects/amway-refreshments/` | 301 |
| `/the-beginners-bible` | `/projects/the-beginners-bible/` | 301 |
| `/seth-godins-blog` | `/projects/seth-godins-blog/` | 301 |
| `/common-prayer` | `/projects/common-prayer/` | 301 |
| `/purpose-drive-life` | `/projects/the-purpose-driven-life/` | 301 |
| `/fastcast` | `/projects/fastcast/` | 301 |
| `/studygateway` | `/projects/studygateway/` | 301 |
| `/studygateway/*` | `/projects/studygateway/` | 301 |
| `/home/` | `/` | 301 |
| `/blog/` | `/` | 301 |
| `/shop-scan/` | `/projects/shop-scan/` | 301 |
| `/team-assist/` | `/projects/team-assist/` | 301 |
| `/shop-scan-status/` | `/projects/shop-scan-status/` | 301 |
| `/mpizza/` | `/projects/mpizza/` | 301 |
| `/amway-refreshments/` | `/projects/amway-refreshments/` | 301 |
| `/the-beginners-bible/` | `/projects/the-beginners-bible/` | 301 |
| `/seth-godins-blog/` | `/projects/seth-godins-blog/` | 301 |
| `/common-prayer/` | `/projects/common-prayer/` | 301 |
| `/purpose-drive-life/` | `/projects/the-purpose-driven-life/` | 301 |
| `/fastcast/` | `/projects/fastcast/` | 301 |
| `/studygateway/` | `/projects/studygateway/` | 301 |
| `/resume/projects` | `/projects/` | 301 |
| `/resume/projects/` | `/projects/` | 301 |
| `/resume/projects/*` | `/projects/:splat` | 301 |
| `/resume/assets/*` | `/assets/:splat` | 301 |
| `/resume/resume` | `/resume/` | 301 |
| `/resume/resume/` | `/resume/` | 301 |
| `/resume/open-source-contributions/` | `/open-source-contributions/` | 301 |

Every configured rule is exercised through Wrangler, with representative suffixes
for wildcard rules. Its status, Location, and successful final response are checked.
Tests also enumerate every original project Markdown filename independently of
the new route data, then crawl internal links and image/video/PDF targets.

## Content and media decisions

- All eleven nonfeatured projects retain their canonical routes and concise accounts.
- Additional project descriptions are curated in `src/data/projects.json`; all are
  grounded in the original project accounts. No current listing availability is claimed.
- Target is limited to the same broad role as the approved public resume. Its original
  account/deals screenshot and recording are not republished without content approval.
- Internal operational details, architecture claims, commercial context, performance
  figures, usage, ratings, and unverified employer outcomes are omitted.
- Existing shop & scan, publishing, Seth Godin, and FastCast images are copied without
  alteration; captions preserve their original UI context. No media is invented for
  projects without images.
- The three shop & scan YouTube references were verified via provider oEmbed on
  2026-09-30. Their owners are WOOD TV8, Milwaukee Journal Sentinel, and News 10
  Lansing; captions use those verified publishers rather than the previous descriptions.
- FastCast Vimeo 89697871 returned `fastcastipad`, owner Kraig Spear. The original
  project account dates the demonstration to 2014. Provider metadata is verification
  of the reference, not a guarantee of playback in every browser or region.
- External videos remain optional, lazy-loaded, user-operated players with surrounding
  descriptions and provider links. Tests block providers while checking reading/navigation.
- GitHub’s pull-request API confirms flutter_vlc_player #26 is merged and titled
  `Ios multiple instance`; the original contribution and repository links are retained.
- The existing patent reference remains unchanged. There are no App Store download
  controls for historical apps whose current availability has not been verified.

Production hostname cutover, GitHub Pages retirement, and deployment remain KLI-81.
