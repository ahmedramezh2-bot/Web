# HEBRA

_"Ideas never die. Civilizations disappear. HEBRA gives sleeping ideas physical existence."_

This is not a marketing site. It is the production repository for the HEBRA cinematic
experience, governed by the HEBRA Master Production Bible (Parts 1–12 + Appendices
A, D, E, F, G) and the Technical Architecture Addendum in `docs/bible/`.

**Before touching any code, read `docs/bible/` in full — start at `docs/bible/00-INDEX.md`.**
Every word from every Bible document sent across the planning conversation is preserved
there verbatim, across two document sets (the informal Cinematic Narrative series and the
formal Master Production Bible + Appendices), plus the 16-phase Production Roadmap. If a
change doesn't answer the Four Questions (identity / emotion / immersion / timelessness)
and the Fifth (would this exist only inside HEBRA), it does not belong here.

---

## Architecture — one responsibility per folder, never per technology

| Folder                                    | Owns                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------- |
| `src/world/canvas`                        | The single persistent R3F canvas. One world, never unloaded.          |
| `src/world/scene-graph`                   | The one continuous scene every chapter shares.                        |
| `src/camera`                              | Camera-as-character: rails, breathing, curiosity response.            |
| `src/cinematic`                           | Theatre.js sequences — the 00:00–04:00 journey + compressed Overture. |
| `src/audio`                               | Tone.js procedural sound, spatial/material resonance.                 |
| `src/interaction/{mouse,touch,gyroscope}` | Deliberately separate physics per input type.                         |
| `src/quality`                             | Adaptive tiers by measured device capability, not device type.        |
| `src/performance`                         | Frame-time/draw-call budget enforcement.                              |
| `src/state`                               | Zustand — shared state only, never business logic.                    |
| `src/content/{schema,chapters}`           | Zod-validated copy/service/chapter data.                              |
| `src/design-tokens`                       | Generated from Figma. Never hand-edited out of sync.                  |
| `src/glyphs`                              | The original HEBRA symbolic language.                                 |
| `src/materials` / `src/shaders`           | PBR material system / narrative-justified GLSL only.                  |
| `src/components/ui`                       | GSAP-owned interface layer.                                           |
| `src/dev-tools`                           | Developer HUD — stripped from production.                             |

Every folder above contains its own `README.md` explaining _why it exists_ — the
Bible's own test applied mechanically.

---

## Phase 0 — Exit Report

Per the Production Roadmap, Phase 0's job was preparation, not content. Status:

- ✅ **Architecture verified** — folder structure built strictly by responsibility (table above), matching the Engineering Bible and Technical Architecture Addendum.
- ✅ **Stack list locked** — versions pinned in `package.json` to the exact approved ecosystem (React, R3F, Three.js, Theatre.js, GSAP, Lenis, Zustand, Tone.js, React Flow, Drei, three-mesh-bvh, postprocessing, `@use-gesture/react`, Zod). No unapproved library present.
- ✅ **Tooling verified** — `tsconfig.json` (strict mode, `noUncheckedIndexedAccess`, path aliases matching the responsibility folders), ESLint flat config (no `any`, no unused exports — mechanically enforcing "every file must justify its existence"), Prettier, `.gitignore`.
- ✅ **Every Bible document accounted for** — Parts 1–12 and Appendices A/D/E/F/G internalized across the conversation; the Technical Architecture Addendum is now version-controlled in `docs/bible/`, not just chat history.
- ⚠️ **Two verified constraints, reported honestly rather than silently worked around:**
  1. **Package installation** — this sandbox's network egress blocks `registry.npmjs.org` (same restriction hit earlier with `github.com`). `npm install` has **not** been run or verified end-to-end yet. You can either enable npm registry access in this environment's network settings, or pull this scaffold and run `npm install` locally/on your own CI — at that point `npm run typecheck` and `npm run build` become the real Phase-0-completion gate.
  2. **Figma** — no team/workspace key has been provided yet, so no live Figma file exists. Phase 2 (Design System) is where this becomes blocking — I'll ask for your Figma plan/team key at that checkpoint rather than assume one.
- ⬜ **No scenes. No systems. No 3D content.** — correctly nothing here yet, per Phase 0's own exit criteria; that work is Phase 1.

**Phase 0 is functionally complete pending the two flags above.** Awaiting your review before Phase 1 (Foundation: Camera Manager, Scene Manager, Pointer System, Audio System, Quality System, Performance System).
