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

Pages: `/` (homepage), `/meist/`, `/spordiklass/`, `/sporditeraapia/`, each
with `/en/` and `/ru/` variants. A page is a stub at the repo root carrying
`layout` and `permalink` front matter; the markup lives in `_layouts/`. Add
new pages to `sitemap.xml`, which is a hand-rolled template.

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

**Container.** Content sits on `--container-max` 1200px. Only the nav bar runs
wide (`--container-wide` 1400px) so the CTA can sit at the far right.

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

### SEO and performance pass

- **Killed 27 duplicate pages.** The service blurbs were `_posts` with
  `layout: default`, so each rendered the whole homepage. They are now a
  `_services` collection with `output: false`: still rendered inline on the
  homepage, but generating no standalone pages. 39 pages down to 12.
- Added `rel=canonical`, Open Graph and Twitter cards, and a `lang` attribute
  on `<html>`. Polyglot emitted `hreflang="ee"`, which is not a valid ISO
  639-1 code for Estonian and so was ignored; alternates are now built from
  `site.lang_codes` (`ee` -> `et`) with an `x-default`.
- `site.url` corrected to https, since canonical must match what is served.
- **Sitemap** is a template, not `jekyll-sitemap`: the plugin only ever sees
  one language because polyglot forks per language, and it emitted 4 URLs
  including `/admin/`. The template walks every language for every real page:
  9 URLs with hreflang alternates. `robots.txt` disallows `/admin/`.
- **Weight.** Removed the Netlify Identity widget from every visitor page
  (235 KB; `admin/index.html` loads its own), swapped unminified jQuery for
  the minified build, stripped Instafeed.js from `ttu.js` (half the file, for
  an API dead since 2020, and it carried a commented-out access token), and
  removed the 1s `setTimeout` that held the page loader over
  already-rendered content. JS+CSS transferred is now ~103 KB.
- Recompressed four photos that were saved at maximum quality: 3.5 MB to
  763 KB, `img/` from 9.5 MB to 6.8 MB. Three other files were left alone
  because re-encoding made them *larger* — check before and after, do not
  assume a compression pass is a win.
- Removed duplicate DOM ids (`navbar`, `lines`, and the language-link ids
  repeated across nav and sidebar). None were referenced by JS or CSS.
- `rexml` 3.2.6 -> 3.4.4, clearing the Dependabot advisory.

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

- **GA4 needs a measurement ID.** The dead UA property is gone and a GA4
  snippet is wired up, but `ga4_id` in `_config.yml` is blank, so no analytics
  load at all. Set it to `G-XXXXXXXXXX` to switch on.
- **Instagram** section is built and hidden; see the plan above.
- Images have no WebP/AVIF, no `srcset` and no intrinsic `width`/`height`
  (the last costs layout shift). The hero video is 4.6 MB across mp4+webm and
  could stand a smaller encode.
- 14 `!important` declarations remain, all fighting Bootstrap; retiring them
  needs markup changes. Bootstrap 3 has been EOL since 2019 and is still the
  layout engine — a big change for little visible gain, so left alone.
- `_includes/sporditeraapia.html` exists but is not included anywhere. Left in
  place rather than deleted, in case the homepage section is wanted back.
- The unreferenced Proxima Nova `.otf` files in `/fonts` are dead repo weight
  (no `@font-face` anywhere) but cost visitors nothing, and are the source if
  the brand face is ever licensed for web.
- The contact form was **confirmed working** on the legacy Formspree endpoint.
  Worth migrating to the `formspree.io/f/{id}` shape before the old one is
  retired, since the AJAX handler treats any 2xx as success and would fail
  silently.
