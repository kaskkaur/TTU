# design/

Standalone lander mockups — vanilla HTML/CSS/JS, no framework, no build step.

| File | Direction |
|------|-----------|
| `lander-v1.html` | Dark plum hero, video as ground, type over picture |
| `lander-v2.html` | Iteration on v1 — footage runs clean, type on a solid plate |
| `lander-v3.html` | Divergent — white ground, type as structure, video as a framed panel |
| `audit-plan.html` | Technical + design audit and staged work plan |

`*.body.html` are the sources published as Artifacts (no `<html>`/`<head>`
wrapper). `*.html` are generated standalone copies — regenerate them from
the sources rather than editing them by hand.

Open the `*.html` files directly in a browser. The hero video resolves to
`../img/ttu-video-web.*`; where it can't load, an animated canvas fallback
stands in — which is also what mobile and reduced-data visitors see in the
production design.

Placeholder data is marked in the page. Nothing here is wired to Formspree.
