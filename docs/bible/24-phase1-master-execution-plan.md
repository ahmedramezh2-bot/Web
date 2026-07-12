# HEBRA

## PHASE 1 MASTER EXECUTION PLAN

*Documentation only. This document becomes the official execution roadmap for the first implementation phase. Nothing here is implemented by its own existence.*

====================================================

PREAMBLE

This document transforms the approved Constitution into an executable production roadmap. Every implementation step exists here before the first line of production code is written.

This plan was originally written under the Phase Gate Review's conditional finding (`docs/bible/23-phase-gate-review.md` §8), with M8 and M9 marked **[NAMING-GATED]** pending a Creative Director decision. **That decision has since been made** — see `docs/bible/26-canonical-naming-architecture.md` — and M8/M9 are no longer gated. The `[NAMING-GATED]` markers below are preserved as historical record of the original sequencing constraint and its reasoning; both milestones may now be scheduled per their own dependency chains alone, using the canonical Physical Location and Discipline Zone names registered in docs/bible/26 §3.

====================================================

## 1. MILESTONES

Nine required fields per milestone: Purpose, Objectives, Dependencies, Inputs, Outputs, Estimated Complexity, Potential Risks, Exit Criteria, Rollback Strategy.

### M1 — Project Bootstrap
- **Purpose:** establish the working repository skeleton, tooling, and CI.
- **Objectives:** TypeScript strict config, lint/format, CI pipeline, Development Standards §3–§5 conventions scaffolded.
- **Dependencies:** none — first milestone.
- **Inputs:** Development Standards, Design Token Bible.
- **Outputs:** a buildable, empty, correctly-tooled repository.
- **Complexity:** Low.
- **Risks:** tooling choices made hastily and revisited later at higher cost.
- **Exit Criteria:** CI green on an empty scaffold; Development Standards §22 checklist passes.
- **Rollback:** trivial — no dependents yet.

### M2 — Core Engine
- **Purpose:** the minimal React + R3F application shell.
- **Objectives:** app entry, root scene, render loop, per Development Standards §6's React/R3F/Three.js responsibility split.
- **Dependencies:** M1.
- **Inputs:** Development Standards §6.
- **Outputs:** a running, empty 3D canvas.
- **Complexity:** Low.
- **Risks:** premature architecture decisions baked in before Rendering Pipeline (M3) is designed.
- **Exit Criteria:** a stable render loop at target frame budget with zero scene content.
- **Rollback:** low cost — few dependents yet.

### M3 — Rendering Pipeline
- **Purpose:** implement the Rendering Bible's color management, tone mapping, and post-processing ordering.
- **Objectives:** linear workflow, ACES-informed tone mapping, post-processing stack scaffolded to Appendix F's six-pass ceiling.
- **Dependencies:** M2.
- **Inputs:** Rendering Bible, Appendix F.
- **Outputs:** a color-correct, empty scene ready to receive lit content.
- **Complexity:** Medium.
- **Risks:** getting color management wrong here corrupts every downstream Lighting/Material decision — highest-leverage milestone to get right early.
- **Exit Criteria:** Rendering Bible §7 checklist passes on a synthetic test scene.
- **Rollback:** medium cost once Lighting/Material work depends on it — must be validated thoroughly before M6/M7 begin.

### M4 — State Architecture
- **Purpose:** implement Zustand-based global/interaction/world state per Development Standards §6.
- **Objectives:** state boundaries matching Camera Bible §6's state machine and UI Integration Bible §3's Information Layers.
- **Dependencies:** M2.
- **Inputs:** Camera Bible §6, UI Integration Bible §3, Development Standards §6.
- **Outputs:** a typed, tested state layer with no business logic per the standing Zustand restriction.
- **Complexity:** Medium.
- **Risks:** state boundaries drawn incorrectly are expensive to redraw once camera and UI systems depend on them.
- **Exit Criteria:** Camera Bible's seven-state machine representable in state with no invalid transitions possible.
- **Rollback:** medium — isolated behind a typed interface if drawn correctly at M4.

### M5 — Camera Foundation
- **Purpose:** the Theatre.js-driven camera rig per Camera Bible §15.
- **Objectives:** camera object lifecycle, breathing (Camera Bible §9), state machine wiring to M4.
- **Dependencies:** M3, M4.
- **Inputs:** Camera Bible in full.
- **Outputs:** a camera that breathes and holds Dormant/Awakening/Resting states with no authored path content yet.
- **Complexity:** High — the Camera Bible is the Constitution's most demanding single document.
- **Risks:** under-building this milestone forces every later chapter's camera choreography to fight a weak foundation.
- **Exit Criteria:** Camera Bible §18/§27 review checklist passes on the empty-world rig.
- **Rollback:** high cost once chapters depend on it — this milestone gets the most Review cycles of any in Phase 1.

### M6 — Scroll Translation Layer
- **Purpose:** Lenis integration turning physical scroll into the camera's narrative-progress scalar, per Camera Bible §10.
- **Objectives:** scroll-to-scalar mapping, Skip/Return Yielding-state detection.
- **Dependencies:** M5.
- **Inputs:** Camera Bible §6, §10; the Technical Addendum's Skip/Return logic.
- **Outputs:** a working, content-free scroll-paced camera demo.
- **Complexity:** Medium.
- **Risks:** conflating literal scroll with narrative progress, which the Camera Bible explicitly forbids (Camera Bible §10).
- **Exit Criteria:** scroll velocity correctly triggers Yielding state without altering the authored path.
- **Rollback:** medium.

### M7 — Navigation Layer
- **Purpose:** multi-axis world navigation per Camera Bible §10 and World Blueprint §2.
- **Objectives:** the full navigation taxonomy (forward/backward, lateral, vertical, depth, circular/spiral, bridge/portal) representable in the camera path system.
- **Dependencies:** M5, M6.
- **Inputs:** Camera Bible §8, §10; World Blueprint §2.
- **Outputs:** a camera capable of every named move in the Camera Language on a placeholder path.
- **Complexity:** High.
- **Risks:** building this too narrowly (forward-only) is the single most common failure mode this Constitution explicitly warns against.
- **Exit Criteria:** Camera Bible §10's "ten random screenshots, no two the same shot" test passes on a placeholder path.
- **Rollback:** high — foundational to every subsequent World milestone.

### M8 — World Framework **[NAMING-GATE RESOLVED — see docs/bible/26]**
- **Purpose:** implement World Blueprint's Level 2 Physical Location data model.
- **Objectives:** location schema per World Blueprint §5's eight required fields; The Main Path chapter structure, using the canonical names in docs/bible/26 §3.
- **Dependencies:** M7 only — the naming decision this milestone originally waited on is closed.
- **Inputs:** World Blueprint, the Canonical Naming Architecture (docs/bible/26).
- **Outputs:** a data-driven, populated world graph using canonical Level 2 location names.
- **Complexity:** High.
- **Risks:** none naming-related remain; ordinary implementation risk only.
- **Exit Criteria:** World Blueprint §13 checklist passes for every seed location.
- **Rollback:** high — foundational to every subsequent milestone, but no longer additionally at risk from a pending rename.

### M9 — Environment Framework **[NAMING-GATE RESOLVED — see docs/bible/26]**
- **Purpose:** implement per-location Environmental Dialects (Lighting Bible §8, Material Bible §8, FX Bible §7, Audio Production Bible §5), using the eight canonical Dialect names in docs/bible/26 §4.
- **Dependencies:** M8.
- **Inputs:** the four Bibles above, plus docs/bible/26 §3's Location-to-Dialect mapping table.
- **Outputs:** a working Environmental Dialect system, parameterized per Physical Location.
- **Complexity:** High.
- **Risks:** none naming-related remain; ordinary implementation risk only.
- **Exit Criteria:** at least one full Dialect (e.g. The Vast Dialect, applied to The Starfield Reach) implemented end-to-end and reviewed against all four governing Bibles.
- **Rollback:** high — foundational to every subsequent milestone, but no longer additionally at risk from a pending rename.

### M10 — Lighting Framework
- **Purpose:** implement the Lighting Bible's eight Light Identities, darkness, and volumetric system.
- **Dependencies:** M3, M9 (may begin in parallel with M9 on a placeholder environment if scheduling requires, but final validation requires M9).
- **Inputs:** Lighting Bible in full.
- **Outputs:** a working light-identity system usable by any environment.
- **Complexity:** High.
- **Risks:** getting Light Identity assignment wrong early propagates through every later environment.
- **Exit Criteria:** Lighting Bible §19 checklist passes for at least one full identity.
- **Rollback:** medium — reasonably isolated behind the identity abstraction if built correctly.

### M11 — Material Framework
- **Purpose:** implement the Material Bible's twelve material families.
- **Dependencies:** M3, M10.
- **Inputs:** Material Bible in full.
- **Outputs:** a working material-family system with correct light interaction (Material Bible §13).
- **Complexity:** High.
- **Risks:** shader complexity growing unchecked without the (not-yet-commissioned) Shader Bible's philosophy layer — flagged as an open risk inherited from the Phase Gate Review.
- **Exit Criteria:** Material Bible §13 checklist passes for at least three families spanning the reflection spectrum (§6).
- **Rollback:** medium.

### M12 — Shader Framework
- **Purpose:** implement the Shader Bible's (`docs/bible/27`) five shader categories as working shared infrastructure.
- **Dependencies:** M10, M11.
- **Inputs:** the Shader Bible in full, plus Development Standards §7's code convention.
- **Outputs:** a shared shader-uniform-passing convention and library, organized by the Shader Bible's five categories.
- **Complexity:** High.
- **Risks:** the Shader Bible gap the Phase Gate Review originally flagged is now closed — remaining risk is ordinary implementation risk only.
- **Exit Criteria:** Shader Bible §14 checklist passes for at least one shader per category.
- **Rollback:** medium-high — many later systems will depend on this convention.

### M13 — Interaction Framework
- **Purpose:** general click/tap/gesture interaction beyond camera presence-response, per UI Integration Bible §7.
- **Dependencies:** M4, M5.
- **Inputs:** UI Integration Bible §7; Camera Bible §12–§13; ideally a successor Interaction Bible if commissioned.
- **Outputs:** a working interaction-state vocabulary (Hover/Touch/Focus/Selection/Discovery/Activation/Completion).
- **Complexity:** Medium.
- **Risks:** without a dedicated Interaction Bible, this milestone leans more heavily on UI Integration Bible §7 and Camera Bible than either was scoped to fully carry alone.
- **Exit Criteria:** UI Integration Bible §15 checklist passes for all seven interaction states.
- **Rollback:** medium.

### M14 — Animation Framework
- **Purpose:** implement the Animation Bible's Living World baseline and object-level motion.
- **Dependencies:** M9, M11.
- **Inputs:** Animation Bible in full.
- **Outputs:** a working idle-motion and world-reaction system.
- **Complexity:** Medium.
- **Risks:** low — this Bible is unusually implementation-ready.
- **Exit Criteria:** Animation Bible §12 checklist passes on at least one hero and one ambient object.
- **Rollback:** low.

### M15 — Audio Framework
- **Purpose:** implement the Audio Production Bible's procedural, spatial audio system via Tone.js.
- **Dependencies:** M4, M9.
- **Inputs:** Audio Production Bible in full.
- **Outputs:** a working ambient-layer and spatial-positioning system.
- **Complexity:** High — procedural audio is technically demanding relative to its documentation maturity.
- **Risks:** Part 9/Audio Production Bible's undeclared authority relationship (Phase Gate Review §2) could cause implementation ambiguity if not resolved before this milestone.
- **Exit Criteria:** Audio Production Bible §14 checklist passes for at least one environment's ambient bed.
- **Rollback:** medium.

### M16 — UI Framework
- **Purpose:** implement UI Integration Bible's world-grounded interface system.
- **Dependencies:** M4, M13, Typography Bible, Color Bible, Design Token Bible.
- **Inputs:** UI Integration Bible, Typography Bible, Color Bible, Design Token Bible.
- **Outputs:** a working Information Layer system (Primary/Secondary/Contextual/Functional).
- **Complexity:** Medium.
- **Risks:** business-room content (UI Integration Bible §5) is naming-adjacent — schedule after M8/M9 clear the gate.
- **Exit Criteria:** UI Integration Bible §15 checklist passes for at least one Panel type.
- **Rollback:** medium.

### M17 — Optimization Framework
- **Purpose:** implement the Performance & Optimization Bible's adaptive quality tier system.
- **Dependencies:** M3, M10, M11, M12 — begins only once there is real content to measure.
- **Inputs:** Performance & Optimization Bible, Appendix F.
- **Outputs:** working Cinema/Balanced/Essential tier switching, capability-measured per Performance Bible §3.
- **Complexity:** High.
- **Risks:** per Production Execution Protocol §4, optimization started before validation is explicitly forbidden — this milestone is deliberately late in the sequence.
- **Exit Criteria:** Performance Bible §12 checklist passes on a representative scene at all three tiers.
- **Rollback:** low — additive to already-validated systems.

### M18 — Testing Framework
- **Purpose:** implement the Bible-conformance testing discipline per Development Standards §8.
- **Dependencies:** all prior milestones with content to test.
- **Inputs:** every governing Bible's own Review Checklist.
- **Outputs:** automated checks wherever a Bible's rule is mechanically checkable (performance budgets, forbidden-pattern linting); documented manual review process for everything else.
- **Complexity:** Medium.
- **Risks:** over-indexing on what's automatable and under-indexing on the qualitative Final Test (Appendix E) every Bible ends with.
- **Exit Criteria:** Constitution Review Protocol §2's ten Review Stages each have a defined, repeatable process.
- **Rollback:** low.

### M19 — Deployment Framework
- **Purpose:** implement the CI/CD pipeline per Production Execution Protocol §5–§7.
- **Dependencies:** M1, M18.
- **Inputs:** Production Execution Protocol, Development Standards §17–§19.
- **Outputs:** a working `main`-protected, gated deployment pipeline.
- **Complexity:** Low-Medium.
- **Risks:** low — the most conventional milestone in this plan.
- **Exit Criteria:** Development Standards §23 checklist passes; a full deploy dry-run succeeds without shipping developer tooling (Development Standards §18).
- **Rollback:** low.

====================================================

## 2. DEPENDENCY GRAPH (TEXTUAL)

```
M1 → M2 → M3 → M5 → M6 → M7 → M8[GATED] → M9[GATED] → M10 → M11 → M12
                 M2 → M4 ────────────────────┘         │      │
                                              M9 → M14 ─┘      │
                                         M4,M9 → M15            │
                                    M4,M5 → M13 → M16            │
                          M3,M10,M11,M12 → M17                   │
                                     all → M18 → M19
```

No circular dependencies exist. M8 and M9 originally forked on an external decision (the naming resolution) rather than an internal technical one — that decision is now closed per docs/bible/26, so the graph today resolves entirely by engineering sequencing alone, exactly like every other fork point.

====================================================

## 3. MUST / SHOULD / COULD / FUTURE, PER MILESTONE GROUP

**Must Have (Phase 1 cannot exit without these):** M1–M7 (foundation), M8–M9 once ungated, M10–M11 (at least one Light Identity and three Material families), M17 (at least Balanced tier working), M19.

**Should Have:** M12 (Shader Framework) formalized rather than ad hoc; M13 full interaction vocabulary; M15 full procedural audio rather than a placeholder bed.

**Could Have:** M14's full Living World baseline across every object category (a partial implementation is acceptable to exit Phase 1); M16's full Panel taxonomy (one working Panel type is sufficient to exit).

**Future Work (explicitly deferred past Phase 1):** the six Discipline Zones' full business content (UI Integration Bible §5) beyond one demonstration Zone; the full Hidden Discovery System (World Blueprint §9); WebGPU migration (Rendering Bible §3).

====================================================

## 4. IMPLEMENTATION CHECKPOINTS

Each checkpoint requires **Creative Approval, Technical Approval, Performance Approval, Architecture Approval** before the next milestone group may begin:

- **Checkpoint A** (after M4): foundation review — does the engine, rendering pipeline, and state architecture hold Appendix F's frame budget with zero content?
- **Checkpoint B** (after M7): camera review — does the navigation layer pass Camera Bible §10's screenshot test on a placeholder path?
- **Checkpoint C** (after M9): world review — the first checkpoint where real, canonically-named location content (docs/bible/26) exists; the single most important checkpoint in Phase 1.
- **Checkpoint D** (after M12): material/lighting/shader review — does a fully lit, fully materialed placeholder scene pass the Lighting, Material, and Rendering Bibles' checklists together?
- **Checkpoint E** (after M17): performance review — do all three quality tiers hold their respective Appendix F budgets on real content?
- **Checkpoint F** (after M19): Phase 1 exit review — feeds directly into the Production Authorization document's ongoing verification.

====================================================

## 5. PRODUCTION RISKS

- **Architecture Drift** — mitigated by Development Standards §2's additive-architecture rule and the Constitution Review Protocol's Architecture Review stage.
- **Feature Creep** — mitigated by Production Execution Protocol §4's "no feature starts without documentation" rule.
- **Performance Regression** — mitigated by M17–M18 and the Performance Bible's continuous-measurement Lifecycle rule (Performance Bible §1).
- **Identity Drift** — mitigated by every milestone's Exit Criteria citing a specific Bible checklist rather than a subjective bar.
- **Documentation Drift** — mitigated by Production Execution Protocol §6's PR-level "Documentation Updated" requirement; actively at risk per the Phase Gate Review's documentation-load finding (Phase Gate Review §3) unless a Constitution custodian role is staffed.
- **Dependency Bloat** — mitigated by Development Standards §13's dependency convention (new dependencies justified and assigned a single responsibility before adoption).
- **The Naming Gate itself** — *resolved.* This was, at authoring time, the risk that M8/M9 would begin before the Creative Director's decision, multiplying rework cost with every location record created in the interim. The decision has since been made (docs/bible/26); this line is preserved to document that the risk was identified and closed, not left unaddressed.

====================================================

## 6. PHASE 1 APPROVAL CHECKLIST

- [ ] Every milestone in §1 has all nine required fields defined.
- [ ] The dependency graph in §2 contains no circular dependencies.
- [ ] MoSCoW prioritization in §3 has been reviewed and agreed by the Execution Hierarchy.
- [ ] Every checkpoint in §4 has named approvers, not just named approval types.

====================================================

## 7. PHASE 1 READINESS CHECKLIST

- [ ] M1–M7 have no unresolved dependency on the naming gate.
- [x] M8–M9's naming dependency is resolved (docs/bible/26); no project-tracking block remains on this specific condition.
- [ ] The Constitution custodian role (Phase Gate Review §3) is staffed before M1 begins.
- [ ] A Shader Bible exists, or M12's risk is explicitly accepted by the Technical Director without one.

====================================================

## 8. PRODUCTION LAUNCH CHECKLIST

- [ ] Checkpoints A through F all passed with all four required approvals each.
- [ ] No milestone shipped with an unresolved Critical or Major risk per the Production Authorization document's risk classification.
- [ ] Deployment Framework (M19) validated end-to-end with a real, non-trivial content set.

If every checklist above passes, recommend authorization to begin production. If the Phase 1 Approval and Readiness Checklists pass but the naming gate is still open, recommend the scoped, conditional authorization described in the Production Authorization document rather than a full, unconditional one.

Documentation only. No implementation.
