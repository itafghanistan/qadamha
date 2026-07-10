# Invite a Friend — Design

**Date:** 2026-07-10
**Status:** Approved

## Problem

Some visitors know someone whose startup or project idea stopped, paused, or
never finished — but that person isn't the visitor to submit it themselves;
they weren't there, and the archive wants first-hand accounts. The visitor
needs a way to nudge their friend directly: describe the friend's idea in
passing, generate a personal link, and send it so the friend can tell the
full story in their own words.

## Constraint

Qadamha is a fully static Astro site (`astro build`, no `output: 'server'`
adapter) with no backend, database, or user accounts. There is nowhere to
persist an "invite." The entire mechanism must live in a URL: a link encodes
what the sender wrote, and every page that personalizes content reads
`location.search` client-side after the static HTML loads — the same pattern
`submit.astro` already uses to turn form input into a prefilled GitHub issue
or `mailto:` link.

## Flow

```
Home page widget          /invite/ page              /submit/ page
┌──────────────────┐      ┌───────────────────┐      ┌───────────────────────┐
│ idea (required)   │      │ reads ?idea&name   │      │ reads ?idea&name       │
│ name (optional)   │─────▶│ personalizes copy  │─CTA─▶│ prefills               │
│ → builds link,    │ link │ shows idea quote   │ link │  tagline + founders    │
│   copy button     │      │ "Tell the story"   │      │ (friend edits, sends)  │
└──────────────────┘      └───────────────────┘      └───────────────────────┘
```

1. A visitor on the home page fills in the **InviteWidget**: a required
   one-line "their idea" field and an optional "their name" field.
2. Client JS builds `${origin}${localizePath(locale, '/invite/')}?idea=<enc>&name=<enc>`
   (name param omitted entirely if blank) and reveals it in a read-only field
   with a copy button.
3. The visitor sends that link to their friend however they like (WhatsApp,
   email, SMS — out of scope to build sharing shortcuts beyond copy).
4. The friend opens `/invite/`. It's a normal page using the site's regular
   `Base` layout (header, nav, footer) — not a stripped landing page — so it
   doesn't read as a phishing link. Client JS reads `idea`/`name` from
   `URLSearchParams`, personalizes the heading if `name` is present, quotes
   the idea text, and shows a motivational message consistent with the site's
   existing tone (see `home.message.*` in i18n).
5. The friend clicks through to `/submit/?idea=<enc>&name=<enc>`, which
   prefills `tagline` with the idea text and `founders` with the name (the
   friend is presumably a founder of their own idea), and shows a small note
   that the form was prefilled from an invite. The friend fills in the rest
   (city, sector, years, status, and — most importantly — the story) and
   submits exactly as anyone else does today (GitHub issue or email).

## Components

### `src/components/InviteWidget.astro`

- Props: `locale: Locale`.
- Markup: a form with:
  - `<input name="idea" required maxlength="160">` — "Their idea, in one line"
  - `<input name="name">` — "Their name (optional)"
  - a submit button ("Generate link")
  - a hidden-until-generated row: read-only `<input readonly>` holding the
    link, plus a copy button reusing the existing `.copy-btn` /
    `data-url` / `data-copied` pattern from `[...slug].astro` (writes to
    `navigator.clipboard`, swaps button text to the `idea.copied` string for
    ~1.6s).
- Client `<script>`: on submit, prevent default, read the two fields, build
  the URL via a small pure helper (see Testing), set it as the link input's
  value and the copy button's `data-url`, reveal the result row.
- No new sharing integrations (no WhatsApp/X/etc. quick-share) — copy-link
  only, per approved design.

### `src/pages/[lang]/invite.astro`

- `getStaticPaths` over `LOCALES`, same shape as `submit.astro`.
- Uses `Base` layout with `path="/invite/"`.
- Static markup (rendered at build time, locale-aware via `t()`) contains
  placeholder elements for the personalized bits (name-dependent heading,
  idea quote) that a client `<script>` fills in after reading
  `URLSearchParams(location.search)`:
  - If `idea` is present: show `t('invite.page.titleNamed', { name })` when
    `name` is present, else `t('invite.page.title')`; render the idea text
    into a `<blockquote>` via `textContent` (never `innerHTML` — the value is
    fully attacker-controlled since it comes from a URL anyone can craft).
    CTA button links to `/submit/?idea=...&name=...` (locale-aware,
    re-encoding whatever was read from the query string).
  - If `idea` is absent (direct nav with no/partial query string): hide the
    blockquote and show the generic, non-personalized heading/body with a
    CTA straight to `/submit/` (no query string) — same tone, just without
    the quoted idea. This is the only fallback state; there's no error page.
- No SSR, no server logic — this is exactly as static as every other page,
  just with a bit of progressive client-side enhancement.

### `src/pages/[lang]/submit.astro` (extend existing script)

- On `DOMContentLoaded` (or inline, since the script already runs after the
  form exists), read `idea`/`name` from `URLSearchParams(location.search)`.
- If `idea` is present, set the `tagline` input's value to it.
- If `name` is present, set the `founders` input's value to it.
- If either was set, reveal a small note above the form:
  `t('invite.prefillNote')` — "Prefilled from a friend's invite — check
  everything before you continue."
- Everything else about the form (GitHub-issue / email submission) is
  unchanged.

### `src/pages/[lang]/index.astro`

- New `<section class="section">` inserted between the "Featured ideas"
  section and the "letter" section, containing `<InviteWidget locale={locale} />`
  with a heading/intro (`t('invite.title')` / `t('invite.body')`).

### `src/lib/invite.ts` (new, small, pure — for testability)

- `buildInviteSearch(idea: string, name: string): string` — trims inputs,
  returns a `?idea=...` or `?idea=...&name=...` query string (empty name
  omitted). Used by both the widget (building the `/invite/` link) and the
  `/invite/` page (building the `/submit/` link from whatever it read),
  imported directly into each client `<script>` block via a relative import —
  `src/pages/[lang]/ideas/index.astro`'s own client script already imports
  `normalizeSearchText` from `../../../lib/content-utils` the same way, so
  this is an established pattern here, not a new one.
- Kept intentionally tiny: just the query-string construction, no URL/origin
  handling (that stays inline where `localizePath` and `location.origin` are
  already in scope).

## i18n

New keys added to `en.json`, `fa.json`, `ps.json` (all three, per the
project's existing structural-sync test in `test/i18n.test.ts`):

- `invite.title` — home section heading, e.g. "Know someone whose idea belongs here?"
- `invite.body` — home section intro copy
- `invite.f.idea` — widget field label, "Their idea, in one line"
- `invite.f.ideaPlaceholder` — example placeholder text
- `invite.f.name` — widget field label, "Their name (optional)"
- `invite.generate` — submit button, "Generate link"
- `invite.linkLabel` — label above the generated link field
- `invite.page.title` — generic (no name) heading on `/invite/`
- `invite.page.titleNamed` — `{name}`-interpolated heading on `/invite/`
- `invite.page.body` — motivational paragraph on `/invite/`
- `invite.page.cta` — CTA button, "Tell the story"
- `invite.prefillNote` — note shown on `/submit/` when prefilled from an invite

Reused (not duplicated): `idea.copyLink` and `idea.copied` for the widget's
copy button, since the button text is identical in meaning.

## Error handling / edge cases

- `idea` input is `required` with `maxlength="160"` (one-line, like the
  existing `tagline` field) so generated links stay a sane length.
- All dynamic values are written via `textContent`/`.value`, never
  `innerHTML`, so a maliciously crafted `/invite/?idea=<script>...` link
  cannot inject markup.
- `/invite/` with no query string (or an empty `idea`) renders the generic
  fallback described above rather than a broken/empty page.
- Clipboard copy has the same no-fallback limitation the existing
  `.copy-btn` already has on unsupported browsers — not a new gap introduced
  by this feature.
- Extremely long or unusual `idea`/`name` values from a hand-crafted URL are
  rendered as plain text and wrap normally (`overflow-wrap: break-word` on
  the quote block) — no layout break, no truncation needed.

## Testing

- `test/invite.test.ts` (new): unit tests for `buildInviteSearch` — trims
  whitespace, encodes special characters, omits `name` when blank, matches
  the shape of existing pure-function tests in `test/i18n.test.ts` /
  `test/content-utils.test.ts`.
- `test/i18n.test.ts`'s existing "all locales have exactly the same keys" /
  "no dictionary value is empty" tests automatically cover the new i18n keys
  once added to all three dictionaries — no new test needed there.
- No automated test for the client-side query-param reading in `.astro`
  `<script>` blocks (consistent with how `submit.astro`'s existing script
  logic is untested today); this is verified manually in-browser per the
  project's dev-server verification step.

## Out of scope

- WhatsApp/X/Telegram quick-share buttons on the widget (copy-link only, per
  approved design).
- Persisting invites server-side, tracking whether a friend clicked through,
  or any analytics.
- Prefilling any `/submit/` field beyond `tagline` and `founders`.
