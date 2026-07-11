# H E B R A

> *In the beginning, there was darkness.*

The official website of **HEBRA** — a premium digital studio designed to feel
like another dimension. Mysterious, philosophical, cinematic, black.

## Experience

- **The Rite of Entry** — a cinematic WebGL loading sequence: a starfield wakes,
  a refracting crystal grows out of the void while a counter climbs `000 → 100`,
  then a beam of light tears the veil open. (Skippable, shortened on revisits,
  and skipped entirely for `prefers-reduced-motion`.)
- **001 Origin** — the monolith emblem, the wordmark, and a live starfield that
  drifts with the pointer.
- **002 Manifesto** — the philosophy, revealed line by line under volumetric rays.
- **003 Craft** — thirteen disciplines presented as a luxury catalog: three
  flagship plates and an index of pointer-lit accordion rows.
- **004 Mind** — an interactive contour-line presence rendered in shaders,
  reacting to the visitor's hand.
- **005 Ritual** — the four movements of every engagement.
- **006 Transmission** — a magnetic call into the dark.

## Stack

Zero build step. Static files only — open `index.html` or serve the folder.

| Layer | Tool |
| --- | --- |
| 3D / shaders | Three.js (vendored, ES module) |
| Timeline & scroll choreography | GSAP + ScrollTrigger (vendored) |
| Smooth scrolling | Lenis (vendored) |
| Typography | Space Grotesk · Cormorant Garamond · Inter (self-hosted, variable, latin subset) |

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

(A server is required because the site uses ES modules; any static server works.
Deploy anywhere static — GitHub Pages, Vercel, Netlify.)

## Engineering notes

- One WebGL context serves both the loading sequence and the site backdrop —
  the canvas is re-layered, never recreated.
- The Mind scene sleeps when offscreen (IntersectionObserver) and everything
  pauses when the tab is hidden.
- Device pixel ratio is capped, star counts scale down on small/touch devices.
- No horizontal overflow at any viewport; custom cursor only on fine pointers;
  full keyboard navigation and `prefers-reduced-motion` support.
- The crystal, contour head and particle atmospheres are procedural
  recreations of the studio's reference imagery — no raster assets shipped.

## Tuning the loading rite (Theatre.js)

Open the site with `?edit` in the URL — e.g. `http://localhost:8000/?edit` —
and a [Theatre.js](https://www.theatrejs.com) panel appears, live-wired to
the crystal's two most cinematic parameters: `ignite` (the signal flash) and
`heroShift` (its drift into hero orbit). Drag the sliders and the WebGL
scene responds immediately.

This is a developer-only instrument, not a visitor feature:

- Regular visits (no `?edit`) never load Theatre.js. The GSAP-authored rite
  in `assets/js/main.js` remains the only thing a visitor experiences —
  nothing about the default site changed.
- `?edit` skips the auto-playing rite (so the crystal is on stage
  immediately) and hands `ignite`/`heroShift` to the panel instead.
- Studio's own project menu has an **Export** action that saves a
  `state.json`. Drop it at `assets/theatre/hebra-state.json` and
  `theatre-rite.js` will load it as the new baked default next time
  edit mode runs.

The runtime is vendored, not installed via npm — see
`assets/js/vendor/theatre/` (built from the
[theatre-js/theatre](https://github.com/theatre-js/theatre) monorepo's
`@theatre/browser-bundles` package, Apache-2.0, license included alongside).
