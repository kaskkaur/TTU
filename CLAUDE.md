# TTÜ Korvpallikool — ttukorvpallikool.ee

**Read [AGENTS.md](AGENTS.md) before changing anything.** It is the full guide:
architecture, conventions, the traps this codebase sets, and the decisions
already made with their reasons. This file is only the short version.

Trilingual (ee / en / ru) Jekyll site for a Tallinn basketball club. Deploys
to Netlify from **`master`**. Estonian is the default and lives at `/`; the
others at `/en/` and `/ru/`.

```bash
bundle install
bundle exec jekyll serve --livereload     # http://127.0.0.1:4000
```

## The five things that will bite you

1. **Never run `jekyll build` while `jekyll serve` is running.** Both write
   `_site` and interleave into a partial site: whole sections vanish from the
   served page while the source is fine. If content looks deleted, this is
   why — kill the server, `rm -rf _site`, rebuild, then restart the server.
   Do not start "fixing" the source.

2. **Bootstrap 3 sets `html { font-size: 10px }`.** Every `rem` computes at
   62.5% unless the root is reset. It is reset in the token block at the top
   of `css/landing-page.css`. Do not remove it.

3. **Bootstrap selectors routinely outrank ours.** `#custom-nav a` is an ID
   selector; `.navbar-nav > li > a` beats a bare class. Fix by matching
   specificity, never by adding `!important`.

4. **Verify what is actually served, and look as well as measure.** Real bugs
   here were invisible in screenshots but obvious in `getComputedStyle` — and
   the footer once measured as perfect equal thirds while reading as a mess.
   After any scripted CSS edit, check the braces balance.

5. **Copy lives in `_data/{ee,en,ru}/content.yml`, never in templates.** A new
   string means the same key in all three files; a missing key renders empty
   with no error.

## Style system

All visual decisions come from the token block at the top of
`css/landing-page.css`. **No raw colour or font-size literals in rules.**
Colour ramp is tuned to the club logo; `--brand-500` `#E4067E` is
deliberately off that curve because it is TalTech's own brand magenta. If you
change a brand colour, hold lightness constant — contrast ratios depend on it.

## Do not undo these without reading AGENTS.md §6

- `_services` is a collection with `output: false` (it killed 27 duplicate
  homepages).
- The sitemap is a hand-rolled template, not `jekyll-sitemap` (the plugin only
  sees one language under polyglot).
- hreflang comes from `site.lang_codes`, because polyglot emitted the invalid
  `hreflang="ee"` instead of `et`.
- **Analytics work.** `ga_id` holds `UA-108664795-1`, which still reports via
  an auto-created GA4 property with a connected site tag. Removing it once
  broke live analytics. Leave it alone.
- The **Instagram feed is fetched client-side** from Behold, deliberately, so
  it is current without a rebuild. `_data/instagram.yml` holds only the feed
  id and the toggle. See AGENTS.md §6 before changing that.

## State

The `style-cleanup` branch is well ahead of `master` and **nothing on it has
deployed**. Outstanding work and what needs a human rather than an agent are
listed in AGENTS.md §7.
