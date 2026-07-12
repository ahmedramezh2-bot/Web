# HEBRA MASTER PRODUCTION BIBLE

## DEVELOPMENT STANDARDS

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

This document defines how HEBRA is engineered.

It is the single canonical home for conventions that, until now, were declared independently across Part 3, Part 6, and Part 10 of the Master Production Bible — each time with slightly different wording. Per the Constitution Audit Report (`docs/bible/reports/constitution-audit-2026-07-12.md` §3.3–§3.5), Part 6 (Engineering Bible) is also known to be truncated in the source material, ending mid-sentence with no closing section. This document's first responsibility, beyond its own content, is to formally supersede and complete what Part 6 left unfinished, and to resolve the two contradictory findings the Audit Report identified.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. Every future contributor must follow this document.

====================================================

## 1. RESOLVING KNOWN CONTRADICTIONS (PER THE CONSTITUTION AUDIT REPORT)

**The Blender export pipeline** was stated twice with different final steps (Part 6: `...→ KTX2 → Production Asset`; Part 10: `...→ KTX2 Texture Compression → Production Validation → Repository`). Per the Audit Report's own recommendation, **Part 10's version is adopted as canonical**, being the more complete of the two: `Blender → glTF 2.0 → Meshopt Optimization → Draco Compression → KTX2 Texture Compression → Production Validation → Repository`. No exceptions. Part 6's shorter version is formally superseded by this document.

**The tool "one responsibility" table** was declared independently in Part 3, Part 6, and Part 10, with mostly-but-not-entirely consistent wording, and restated a fourth and fifth time in this session's Camera Bible §15 and Audio Production Bible. **This document (§6 below) is now the single canonical source.** Every other document's restatement is retroactively downgraded to a cross-reference; where any future wording conflicts with §6, this document wins per the Constitution Review Protocol's Conflict Resolution order (Constitution Review Protocol §1).

**Part 6's truncation** is formally closed by this document's existence — everything Part 6 was attempting to establish (core stack, per-library responsibility, Figma/Blender pipeline, asset validation, performance, quality tiers, developer tools, the Engineering Rule, the Architecture Rule) is restated completely below, with its unfinished Architecture Rule sentence completed in §12.

====================================================

## 2. ARCHITECTURE RULES

**Adding new features should never require rewriting old ones.** (This completes Part 6's truncated Architecture Rule sentence, made explicit here for the first time.) A well-formed HEBRA architecture is additive — a new Story Chapter, a new Discipline Zone, a new material family, extends the existing system per that family's own Bible (World Blueprint, Material Bible, and the Canonical Naming Architecture per docs/bible/26 §8's amendment discipline) without requiring existing chapters, zones, or materials to be restructured to accommodate it.

**Folders represent responsibilities, never technologies, never temporary groupings.** One responsibility per folder, mirroring §6's one-responsibility-per-library principle at the file-system level.

**Every file must answer "why does this exist?"** — the Engineering Rule (Part 6, preserved verbatim): if no answer, delete it. This is the file-level expression of every other Bible's Purpose-first requirement (Material Bible §4, Asset Production Bible §3, FX Bible §3, Audio Production Bible §3 all begin with a required Purpose field for exactly this reason).

====================================================

## 3. NAMING CONVENTION

Explicit, readable, meaningful names. Avoid abbreviations. Avoid "temp." Avoid "new." Avoid version numbers in file or variable names. This mirrors the Design Token Bible's own naming convention (Design Token Bible §3) — a name describes what something *means*, never what it literally *is* or when it was created.

====================================================

## 4. FOLDER CONVENTION

Cross-referenced against §2 — folders are organized by discipline responsibility (matching this Constitution's own Bible-per-discipline structure: camera, lighting, materials, world, animation, fx, audio) rather than by technology (no generic `components/` or `utils/` catch-all that obscures which discipline a piece of code actually serves).

====================================================

## 5. IMPORT AND FILE CONVENTION

Imports are explicit and traceable to a single responsibility owner (§6) — a file that imports across discipline boundaries without a clear architectural reason is a signal that responsibility has blurred somewhere. File conventions mirror the Camera Bible's own "one camera, one identity, six dialects" pattern (Camera Bible §2, §4) at the code level: one system, one file-family, many parameterized variants — never six near-duplicate files for six chapters where one parameterized system would do (cross-reference Animation Bible §1's Animation Hierarchy and Camera Bible §15's "chapters influence movement through data, not through special-cased code").

====================================================

## 6. LIBRARY RESPONSIBILITY CONVENTION (CANONICAL — SUPERSEDES PART 3, PART 6, PART 10)

Every library owns exactly one responsibility. Never duplicate responsibilities.

- **React** → app architecture, component composition, state boundaries.
- **TypeScript** → strict typing across the entire codebase; no `any` used as a substitute for correctly modeling a Bible-defined concept (a Material family, a Camera state, a Light Identity).
- **Three.js** → rendering, GPU communication, geometry, materials, shaders. Nothing else.
- **React Three Fiber** → declarative scene management, scene composition, Three.js integration, reusable world components.
- **Theatre.js** → the Film Director. Camera choreography, environmental timelines, scene sequencing, narrative animation, per Camera Bible §15. Never UI animation. Never application logic.
- **GSAP** → UI motion only: typography, interface transitions, micro animations, panels, buttons, forms, navigation. Never competes with Theatre.js. Never cinematic direction.
- **Lenis** → physical navigation, momentum, travel, scroll orchestration, per Camera Bible §10. Never ordinary smooth scrolling. Never fake momentum.
- **Zustand** → global state, interaction state, world state. Never business logic.
- **Tone.js** → procedural ambience, spatial interaction, generative sound, environmental reactions, per Audio Production Bible §9. Never orchestral soundtrack generation.
- **React Flow** → internal world graph, narrative graph, chapter dependencies, development planning. Never visible to visitors.
- **@react-three/drei** → professional helper utilities. Used only when it reduces boilerplate without reducing quality or architectural clarity.
- **three-mesh-bvh** → high-performance raycasting, complex collision, accurate interaction, camera safety proximity checks per Camera Bible §15.
- **React Bits** → research and engineering inspiration only, per Appendix E and Appendix D. Never copy visual styling, motion language, component appearance, or interaction identity. Visitors should never recognize React Bits.

A library reaching for a responsibility outside this table is an architecture violation, mirroring the Camera Bible's own Hierarchy discipline (Camera Bible §5) — a system that reaches for authority above its rank is a bug, not a feature, regardless of how good it looks in isolation.

====================================================

## 7. SHADER CONVENTION

Shaders solve problems, per Appendix F's shader-budget philosophy — never written because they look impressive. Every shader traces to a Lighting Bible, Material Bible, or FX Bible requirement (never authored independently of those Bibles' already-established intent), and is held to Appendix F's shader-budget ceiling. Shader *philosophy, categorization, and cross-Bible integration* is now governed by the Shader Bible (`docs/bible/27-shader-bible.md`), which formally closed the gap previously noted here and in the Constitution Audit Report (`docs/bible/reports/constitution-audit-2026-07-12.md` §4). This section governs only shader *code convention* (naming, file organization, uniform-passing pattern) — the Shader Bible's §10 explicitly designates this section as its companion, not its competitor.

====================================================

## 8. TESTING CONVENTION

Every system is validated against its governing Bible's own Review Checklist before it is considered complete — a HEBRA "test" is not only functional correctness but Bible-conformance, checked via the Constitution Review Protocol's Review Stages (Constitution Review Protocol §2). Performance-sensitive systems are additionally measured against Appendix F and the Performance & Optimization Bible §7's Measurement discipline, never assumed correct from code review alone.

====================================================

## 9. GIT CONVENTION

Protected main branch. Feature branches only. Every feature reviewed before merge. No direct commits to production, per Part 10's existing standard, preserved here as canonical.

====================================================

## 10. BRANCH, COMMIT, AND PULL REQUEST CONVENTION

Branch names describe the discipline and feature they touch, mirroring §4's folder convention. Commit messages describe *why* a change was made, not only what changed, mirroring §2's "why does this exist" rule applied to history rather than only to files. Pull requests are reviewed against the relevant Bible's checklist before merge — a PR touching Lighting code is reviewed against the Lighting Bible's Review Checklist (Lighting Bible §19), not only against general code quality.

====================================================

## 11. REVIEW CONVENTION

Mirrors the Constitution Review Protocol's Review Hierarchy (Constitution Review Protocol §1) exactly — no engineering review stands in for Creative or Identity Review, and no Creative approval substitutes for Technical Review. Both are required, independently, per Constitution Review Protocol §2.

====================================================

## 12. DOCUMENTATION CONVENTION

Code comments exist only where the reasoning isn't otherwise legible from well-named code — a hidden constraint, a subtle invariant, a workaround for a specific bug — never a restatement of what the code already says. This mirrors the AI Development Protocol's Code Generation Rules (AI Development Protocol §6) exactly: "Documented" means sufficient for a human engineer to understand *why*, not exhaustive restatement of *what*.

====================================================

## 13. DEPENDENCY CONVENTION

New dependencies are added only if they improve visual/engineering quality, maintainability, performance, scalability, or originality — never because they are modern or popular, per Part 6's preserved standard. A new dependency's responsibility is defined and added to §6's canonical table before it is adopted, never left ambiguous relative to an existing library's already-assigned responsibility.

====================================================

## 14. SECURITY CONVENTION

Mirrors the AI Development Protocol's Security section (AI Development Protocol §9) exactly: never expose secrets, API keys, internal architecture, hidden content, or production information. Applies to every engineer and every AI-assisted contribution equally, per the AI Development Protocol's Authority Hierarchy (AI Development Protocol §2).

====================================================

## 15. PERFORMANCE CONVENTION

Never postpone optimization — every draw call, texture, shader, and particle matters, per Part 6's preserved standard, reconciled with the Performance & Optimization Bible's fuller strategic treatment (Performance Bible §1's Lifecycle rule: measured continuously, not only at the end of a production cycle). Quality tiers are capability-measured, never a binary Desktop-vs-Mobile assumption, resolving the tension the Constitution Audit Report flagged between Part 6 and Part 11 (Audit §3.6) in favor of Part 6's capability-measured framing, exactly as the Performance Bible already adopted (Performance Bible §3–§4).

====================================================

## 16. ASSET VALIDATION

Rejects assets violating: naming rules (§3), polygon budgets (Appendix F), texture budgets (Material Bible §10), material consistency (Material Bible §4), performance standards (§15), visual language (every discipline Bible's Forbidden section). Cross-referenced directly against Asset Production Bible §4's Validation pipeline stage — this section is the engineering-side enforcement of that stage, not a separate parallel system.

====================================================

## 17. QUALITY GATES

Before deployment: Visual Quality, Performance, Accessibility, Responsiveness, Audio, Lighting, Story Continuity, Interaction, Memory Usage, GPU Usage, Bundle Size — preserved from Part 10's existing named checklist, now formally cross-referenced against the Constitution Review Protocol's ten Review Stages (Constitution Review Protocol §2) as this document's engineering-specific subset of that fuller list.

====================================================

## 18. DEVELOPER TOOLS

Lighting controls, camera controls, fog controls, shader controls, particle controls, performance graphs, scene debugging, quality tier switching — created freely, per Part 6's preserved standard, but never shipped to production. Development-only tooling is stripped from production builds without exception, mirroring Appendix F's explicit "Developer HUD — Development only. Never production" rule.

====================================================

## 19. DEPLOYMENT CONVENTION

Never deploy unfinished work, per Part 10's preserved standard. Every deployment passes the Constitution Review Protocol's Production Gate Checklist (Constitution Review Protocol §14) before release.

====================================================

## 20. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Google Engineering, Airbnb, Microsoft** — studied for large-scale engineering convention and style-guide discipline, informing §3–§5.

**React, Three.js, TypeScript official documentation** — studied for framework-specific best practice, cross-referenced against §6's canonical responsibility table.

Extract principles. Never imitate.

====================================================

## 21. DEVELOPER OATH

I write code that answers "why does this exist" before anyone has to ask.

I never duplicate a responsibility another library already owns. I check the table in §6 before I reach for a new tool.

I never rewrite old features to accommodate new ones — I extend, per §2.

I document only what isn't otherwise legible from well-named code.

I never ship a developer tool to production, and I never deploy unfinished work.

I resolve contradictions when I find them, the way this document resolved the Blender export pipeline and the tool-responsibility table — I do not let a known inconsistency sit uncited.

Every future hand that writes code for HEBRA inherits this oath before it inherits any style guide.

====================================================

## 22. ENGINEERING CHECKLIST

- [ ] Does this code answer "why does this exist" per §2?
- [ ] Does it follow the naming, folder, import, and file conventions in §3–§5?
- [ ] Does every library it uses stay within its single responsibility per §6, with no duplication?
- [ ] Does any shader involved trace to a Lighting/Material/FX Bible requirement per §7?
- [ ] Has it been validated against its governing Bible's Review Checklist per §8?
- [ ] Does its git history follow §9–§10's branch/commit/PR conventions?
- [ ] Does it hold Appendix F and the Performance Bible's budgets per §15?

====================================================

## 23. PRODUCTION APPROVAL CHECKLIST

- [ ] Research principle extracted and logged per §20, never a copied convention adopted wholesale.
- [ ] Asset Validation (§16) and Quality Gates (§17) both passed.
- [ ] No developer-only tooling (§18) present in the production build.
- [ ] Final Test (Appendix E, applied to engineering): would this codebase survive being shown to an outside AAA engineering reviewer without embarrassment?

If every box is checked, engineering work may proceed to Technical, Performance, and Production Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the IDE.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

It formally supersedes and completes the truncated Part 6 (Engineering Bible), and resolves the Blender export pipeline and tool-responsibility contradictions identified in the Constitution Audit Report.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
