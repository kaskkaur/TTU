# TTÜ Korvpallikool — ttukorvpallikool.ee

Trilingual (ee / en / ru) Jekyll site for a Tallinn basketball club.
Deploys to Netlify from **`master`**. Estonian is the default language and
lives at `/`; the others at `/en/` and `/ru/`.

## Running it

```bash
bundle install
bundle exec jekyll serve --livereload      # http://127.0.0.1:4000
```

Ruby is pinned to 3.2.2 in `.ruby-version`.

If a fresh clone's first build dies with `Errno::EINVAL` on `.jekyll-cache`,
that is Dropbox's filesystem still indexing the new files, not a repo problem.
Wait for sync to settle and re-run.

## Stack

Jekyll 4.3.3 · jekyll-polyglot (i18n) · jekyll-minifier · Bootstrap 3.3.7 and
jQuery from CDN · Decap/Netlify CMS at `/admin/`.

Content lives in `_data/{ee,en,ru}/content.yml`, not in the templates. Adding
a string means adding the same key to all three files.

## Style system

Everything visual is driven by tokens at the top of `css/landing-page.css`.
**Add no raw colour or font-size literals to the rules** — use the tokens.

**Colour.** Five brand steps (`--brand-500` … `--brand-900`) plus named
neutrals (`--ink`, `--muted`, `--paper`, `--surface`, `--line`,
`--line-strong`). `--brand-500` `#E4067E` is TalTech magenta and is the accent
and hover colour; `--brand-600` `#AA1352` is the primary action colour.

**Type.** One family (Mulish, the closest free stand-in for the brand's
Proxima Nova, and it carries Cyrillic for the RU pages) on one fluid `rem`
scale. `--fw-display` 900 for h1/h2, `--fw-strong` 700 for h3 and buttons.

**Buttons.** One shape for every CTA: `--btn-height` 48px, inline-flex
centred. Primary is solid brand; `.btn-ttu-inverse` is the same shape outlined
and inverts to white inside brand-coloured sections.

**Container** is capped at `--container-max` 1400px globally, so the nav and
the sections below stay on the same edges.

**Focus** rings live on `:focus-visible` only, so mouse clicks show nothing
and keyboard users get a brand-coloured ring.

### Two traps this codebase sets

1. **Bootstrap 3 sets `html { font-size: 10px }`.** Every `rem` computes at
   62.5% unless the root is reset — it is, in the token block. Do not remove
   that reset.
2. **Bootstrap selectors routinely outrank ours.** `#custom-nav a` is an ID
   selector, and `.navbar-nav > li > a` beats a bare class. Fix by matching
   specificity, not by adding `!important`. Verify with computed styles rather
   than by eye — several bugs here (a nav CTA rendering brand-on-brand, a
   button stuck at 54px, form fields glowing Bootstrap-blue) were invisible in
   a screenshot but obvious in `getComputedStyle`.

## What the `style-cleanup` branch changed

A styles-only pass; no layout or content rewrite beyond what is listed.

- Consolidated 18 raw colour literals and 8 near-identical brand pinks into
  the token ramp. `#ACADAC` (2.25:1 on white, failed AA) became `--muted` at
  4.61:1.
- Replaced the `pt`/`px`/`em`/`%` font-size mix with one fluid `rem` scale;
  headings moved to Mulish Black with tighter tracking and leading.
- Swapped Quattrocento Sans for Mulish.
- **Fixed the mobile hero.** `#video-overlay` and `#video` are absolutely
  positioned but `.intro-header` was never a containing block, so on a phone
  the image floated in a full-document-height box and left the headline white
  on white — invisible. `.intro-header` is now the containing block and the
  mobile overlay has the `background-size: cover` it lacked.
- Cancelled Bootstrap `.row` gutters on two wrappers in the logos block that
  sat outside any `.container` and pushed 15px past both viewport edges.
- Rebuilt the about section as two columns on `--surface`: TalTech mark left,
  "Ühendklubi" heading plus statement right. It had been a whole paragraph
  inside a single `<h2>`.
- Unified all CTAs to 48px with a primary/secondary system, and moved the nav
  CTA to the far right of the bar.
- Locations are individual links: each hovers to the primary CTA's hover
  colour and preselects that region in the enquiry form on click.

## Instagram feed — plan

The section is **built but hidden**. Flip `enabled: true` in
`_data/instagram.yml` to show it.

**Decision: use [Behold](https://behold.so)** (or LightWidget) rather than the
Graph API. Reason: the API route needs a 60-day token refresh *and* scheduled
rebuilds, because a static site only updates when it builds. For a site with a
handful of commits a year that is two standing maintenance jobs. Behold holds
the token, refreshes it, and updates client-side with no rebuild. Cost is
third-party JS and a line in the privacy notice.

**Prerequisite either way:** `@taltechbasketballschool` must be a Business or
Creator account. The Basic Display API was shut down 4 December 2024 and no
route works on a personal account.

**To switch on with Behold:** connect the account in Behold, then replace the
`.instagram-grid` markup in `_includes/instagram.html` with their embed and
set `enabled: true`. Keep `.instagram` and `.instagram-head` so the band
matches the rest of the page.

**The Graph API alternative is already written** if the third-party script is
ever unacceptable: `bin/fetch_instagram.rb` pulls the latest three posts,
downloads the images locally (Instagram's CDN URLs expire) and rewrites
`_data/instagram.yml`, whose fields mirror the Graph API media object.
`netlify.toml` runs it before the build. It is fail-soft — no token or any API
error leaves the last good data and exits 0, so a deploy never breaks. It
would still need `IG_USER_ID` and `IG_TOKEN` in Netlify, a token-refresh job,
and a scheduled build hook.

## Known, not yet addressed

- **SEO is untouched.** The three service posts use `layout: default`, so each
  renders the whole homepage: 27 near-duplicate pages with no `rel=canonical`.
  There is no `lang` attribute on `<html>` on a trilingual site, no `og:` /
  `twitter:` / `hreflang` tags, and `sitemap.xml` is hand-written and stale
  (missing `/spordiklass/` and `/sporditeraapia/`).
- **Analytics has been dead since 2023** — the property is Universal
  Analytics, which stopped processing hits in July 2023.
- **The contact form posts to Formspree's legacy `formspree.io/{email}`
  endpoint.** Send a test enquiry and confirm it arrives; the AJAX handler
  shows success on any 2xx, so a silent failure would go unnoticed.
- 14 `!important` declarations remain, and Bootstrap 3 has been EOL since 2019.
- `_includes/sporditeraapia.html` exists but is not included anywhere.
- The unreferenced Proxima Nova `.otf` files in `/fonts` are dead weight (no
  `@font-face` anywhere) but are the source if the brand face is ever licensed
  for web.
- Duplicate DOM ids: `navbar` is used on both a `<section>` and a `<div>`, and
  the language links are repeated in `navbar.html` and `sidebar.html`.
