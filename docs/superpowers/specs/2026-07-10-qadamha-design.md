# Qadamha (قدم‌ها) — Design

**Date:** 2026-07-10
**Status:** Approved

## Mission

Qadamha ("Steps") is an open-source, trilingual archive of Afghan startups, apps,
websites, and projects that failed, stopped, or were never completed. It honors
the effort — the steps taken by our people through war, upheaval, and hardship —
and tells the next generation: *we did what we could; keep going until we make it.*

## Decisions

| Decision | Choice |
|---|---|
| Name | Qadamha (قدم‌ها) |
| Stack | Astro + Markdown content collections |
| Hosting | Cloudflare Pages, auto-deploy from GitHub on merge |
| Languages | English (`en`), Dari (`fa`), Pashto (`ps`) |
| Code license | MIT |
| Content license | CC BY-SA 4.0 |
| Contribution | GitHub PRs (developers) and GitHub issue forms (non-developers) |

## Architecture

Fully static Astro site. No database, no backend, no user accounts. Stories are
Markdown files in the repository; the git history is part of the archive.

```
src/
  content/
    stories/
      en/<slug>.md      # same slug across languages links translations
      fa/<slug>.md
      ps/<slug>.md
  i18n/
    en.json  fa.json  ps.json   # UI string dictionaries
    index.ts                    # t() helper, locale metadata (dir, name)
  layouts/                      # Base layout w/ dir=rtl handling, SEO head
  pages/
    [lang]/index.astro          # home
    [lang]/stories/index.astro  # filterable index
    [lang]/stories/[slug].astro # story detail
    [lang]/timeline.astro       # timeline by year
    [lang]/about.astro          # mission
    [lang]/contribute.astro     # how to contribute
    index.astro                 # root → redirect/landing to language choice
    og/[...].png.ts             # build-time OG image endpoints
  components/
```

## Content model

Story frontmatter, validated by Astro content-collection schema (zod). Invalid
PRs fail CI with a clear message.

- `name` (string, required) — project name
- `tagline` (string, required) — one line
- `founders` (array of { name, role?, link? }, required, min 1)
- `team` (array of { name, role? }, optional)
- `sector` (enum: fintech, edtech, healthtech, ecommerce, media, agritech,
  logistics, energy, social, gaming, tooling, other)
- `city` (string, required)
- `yearsActive` ({ start: number, end?: number }, required)
- `status` (enum: stopped | paused | incomplete)
- `reasons` (array of enum: war, funding, migration, sanctions, market,
  infrastructure, regulation, team, personal, other; min 1)
- `links` (array of { label, url }, optional) — site, app store, press
- `logo` (image path, optional)
- `sources` (array of { label, url }, optional) — news articles, references
- `featured` (boolean, default false)
- `draft` (boolean, default false)

Body: the human story — the idea, the effort, what happened, what it meant.

Translations share the slug across `en/ fa/ ps/`. A story may exist in 1–3
languages. Story pages link to available translations; missing ones show a
"help translate this story" invitation linking to the contribute page.

## i18n & RTL

- Routes prefixed `/en/`, `/fa/`, `/ps/`. Root `/` shows a minimal trilingual
  landing/redirect (respecting `Accept-Language` is not possible statically, so
  the root page presents the three languages, with English content beneath for SEO).
- `dir="rtl"` and RTL-aware CSS (logical properties) for `fa` and `ps`.
- UI strings live in three JSON dictionaries with a typed `t()` helper.
- Language switcher preserves the current page, falling back to the section
  index when the target translation does not exist.
- Self-hosted Vazirmatn variable font (covers Dari + Pashto letterforms) with
  system-font fallback; `font-display: swap`.

## Pages

- **Home** — mission statement told with emotional weight; count of recorded
  steps; featured stories; call to contribute.
- **Stories index** — cards; client-side filters (sector, city, year, status,
  reason) over a small generated JSON index; full HTML also rendered for SEO.
- **Timeline** — stories grouped by year, interleaved with brief historical
  context markers; the exploratory heart of the site.
- **Story detail** — narrative, metadata sidebar (founders, years, city, sector,
  status, reasons), sources, related stories (same sector or city), share links,
  "edit this story on GitHub" link.
- **About** — the mission, the message to the next generation, the license.
- **Contribute** — step-by-step for PR contributors and non-developers, in all
  three languages.

## SEO & sharing

- Pre-rendered HTML; per-page `<title>`/meta description in page language.
- `hreflang` alternate links between translations; canonical URLs.
- `sitemap.xml` (via @astrojs/sitemap) and `robots.txt`.
- JSON-LD: `Organization` on home, `Article` on stories.
- Build-time OG images per story (name + tagline + Qadamha branding) via
  astro-og-canvas or satori; per-language OG images for section pages.

## Contribution flow

- `CONTRIBUTING.md` (trilingual), `_template.md` story template with commented
  guidance, `.github/ISSUE_TEMPLATE/` story-submission forms in EN/Dari/Pashto,
  PR template, `CODE_OF_CONDUCT.md`.
- CI (GitHub Actions): install → schema check (`astro check` + content build)
  → full build. Runs on every PR.

## Testing

- Content schema validation via content collections (fails build on bad data).
- Unit tests (vitest) for i18n utilities and filter-index generation.
- CI builds the site on every PR.

## V1 scope

Trilingual UI + stories, timeline & filtering, contributor guide + PR/issue
templates, OG share cards. Seed content: a handful of realistic placeholder
stories (clearly marked as examples) to be replaced by real ones.

Out of scope for V1: web-based submission UI/CMS, comments, search service,
newsletters, analytics.
