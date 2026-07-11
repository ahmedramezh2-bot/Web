# HEBRA — Architecture

> Phase 1 foundation. No scenes, no story content — by design.
> Every future feature plugs into what is described here.

## Principles

One library, one responsibility. No system depends on an unrelated
system. High-frequency signals never enter React state. Quality is
decided before rendering begins, not after frames drop.

## Responsibility map

| Domain | Owner | Module |
| --- | --- | --- |
| Rendering | three.js | via R3F only |
| Scene graph & lifecycle | @react-three/fiber | `src/scenes/Stage.tsx` |
| Cinematic direction | @theatre/core + @theatre/r3f | `src/story/` |
| Director's console (dev / `?edit`) | @theatre/studio | dynamic import, never in visitor bundles |
| Interface micro-motion | GSAP | `src/animations/motion.ts` |
| Movement through the universe | Lenis | `src/systems/scroll/ScrollSystem.ts` |
| Visitor presence (mouse/touch/gyro) | — | `src/systems/input/PointerSystem.ts` |
| The sound of the void (procedural WebAudio) | — | `src/systems/audio/AudioSystem.ts` |
| Device capability tiers | — | `src/systems/performance/QualitySystem.ts` |
| Post pipeline (bloom/vignette/grain) | postprocessing | `PostPipeline` inside Stage |
| Story structure (chapters, emotional curve) | — | `src/story/chapters.ts` |
| Idea networks / storytelling graphs | @xyflow/react | installed; mounts when a chapter earns it |
| Global slow state | zustand | `src/state/experience.ts` |

## Hard rules

1. **One canvas.** `Stage` mounts once and lives for the whole visit.
   Chapters mount scene graph *inside* it. No chapter ever owns a canvas.
2. **Theatre directs cinema; GSAP animates interface.** A camera move,
   a lighting change, an environment transition — Theatre track on the
   `Journey` sheet. A button, a label, a panel — GSAP with the house
   eases (`hebra.emerge`, `hebra.dissolve`).
3. **Signals, not events.** Consumers subscribe to `ScrollSystem` /
   `PointerSystem`; nothing reads raw DOM events twice.
4. **Budgets come from `getQuality()`.** Particle counts, DPR, post
   effects — read the profile; never assume cinema tier.
5. **Shaders import from `src/shaders/`.** One simplex, one fbm.
6. **Sound is invited.** `AudioSystem` never plays before an explicit
   visitor gesture.
7. **Choreography becomes canon via state.** Directors work in
   `?edit`, export from Studio, and commit `src/story/state.json`.

## Chapter contract

A chapter (later phases) is a folder in `src/scenes/chapters/` that:

- reads its scroll span from `CHAPTERS` (`src/story/chapters.ts`)
- registers Theatre tracks on the `Journey` sheet
- mounts R3F children inside `Stage`, DOM children inside `.surface`
- degrades by quality tier, honors `reducedMotion`

## Build & deploy

- `npm run dev` — Vite + Studio mounted automatically
- `npm run build` — strict typecheck, then production bundles
  (entry ≈ 50 KB; rendering / direction stacks code-split; Studio
  in a lazy chunk only fetched with `?edit`)
- Deploys from `main` only via `.github/workflows/deploy-pages.yml`;
  working branches can never overwrite the live world.

## Version matrix (deliberate)

React 18.3 + R3F 8 + drei 9 + three 0.169 + @theatre/r3f 0.7 —
the newest set in which Theatre's R3F bindings are first-class.
Upgrading to React 19 / R3F 9 waits until @theatre/r3f supports them.
