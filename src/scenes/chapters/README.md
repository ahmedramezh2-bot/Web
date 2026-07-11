# Chapters

Every chapter of the journey mounts here as a component inside the one
continuous `Stage`. A chapter:

- registers its Theatre tracks on the `Journey` sheet (`src/story/theatre.ts`)
- reads its scroll span from `src/story/chapters.ts` — never hardcodes ranges
- consumes `ScrollSystem` / `PointerSystem` signals — never raw DOM events
- respects `getQuality()` budgets — never assumes cinema tier
- imports noise from `src/shaders/noise.ts` — never duplicates GLSL

No chapter exists yet by design: Phase 1 is the foundation.
