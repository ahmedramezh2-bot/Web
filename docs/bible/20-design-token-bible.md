# HEBRA MASTER PRODUCTION BIBLE

## THE DESIGN TOKEN BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

This document defines every design token used across HEBRA. The Design Tokens become the single source of truth shared between Figma, React, R3F, GSAP, and Theatre.js.

Where every other Bible in this Constitution defines *what* HEBRA is, this document defines the shared *vocabulary of values* every tool in the pipeline reads from — so that a number changed once, here, updates consistently everywhere it's used, rather than drifting into five slightly different copies across five different tools.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document does not originate creative decisions — it packages decisions already made in the Color, Typography, Lighting, and Camera Bibles into a shared, synchronized format.

====================================================

## 1. TOKENS AS SINGLE SOURCE OF TRUTH

A token exists in exactly one authoritative place and is consumed, never redefined, everywhere else. Figma authors and previews tokens (cross-reference Asset Production Bible §7's Figma Integration and Appendix E's restriction of Figma to documentation/planning); React, R3F, GSAP, and Theatre.js consume the same values at build or runtime.

**Figma** owns the design-authoring surface where tokens are visually previewed and where designers propose changes, per the Master Production Bible Part 6/10's existing Figma-ownership pattern (design tokens, typography, spacing, color system, motion boards) — this document formalizes that existing informal ownership into an explicit, synchronized system rather than replacing it.

**React** consumes tokens for UI Integration Bible layout, spacing, and Typography Bible scale/weight values.

**R3F** consumes tokens for world-space measurements that must agree with UI-space measurements at their boundary (cross-reference UI Integration Bible §1's world-grounded UI identity).

**GSAP** consumes Motion tokens (§2) for UI-layer micro-motion, strictly scoped per the Camera Bible §15's standing rule that GSAP never drives world-camera transform.

**Theatre.js** consumes Timing tokens (§2) for camera and world choreography, per Camera Bible §15's ownership assignment — Theatre.js's consumption of shared tokens does not grant GSAP or React any authority over camera choreography; token-sharing is about value consistency, never about blurring the strict tool-responsibility boundaries already established in Camera Bible §15 and the future Development Standards document.

====================================================

## 2. TOKEN CATEGORIES

- **Colors** — the tokenized form of the Color Bible's Primary, Secondary, and Accent palettes (Color Bible §3–§5), never a parallel or independently-maintained color list.
- **Typography** — the tokenized form of the Typography Bible's scale, weight, and role system (Typography Bible §2–§4).
- **Spacing** — the tokenized form of the Typography Bible's rhythm (Typography Bible §6) and the World Blueprint's spatial hierarchy (World Blueprint §1), unified into one shared spacing scale for both UI and world-adjacent measurements.
- **Radius** — corner and edge treatment values, held to the same restraint Appendix D applies to visual clichés (no default "friendly rounded corner" treatment without a Material Bible §4 Edge Behaviour justification).
- **Elevation** — the token-system expression of UI Integration Bible §8's Panels emerging from the world rather than floating above it — elevation values describe in-world depth relationships, never a generic drop-shadow z-index stack.
- **Motion** — GSAP-consumed UI micro-motion values, strictly scoped away from Camera Bible-owned choreography per §1.
- **Animation Curves** — the tokenized form of the house easing curves already referenced across the Camera Bible (`hebra.emerge` / `hebra.dissolve`, Camera Bible §9) and Animation Bible §1's timing discipline — one shared curve library, not independently redefined per tool.
- **Timing** — Theatre.js-consumed choreography durations, cross-referenced against Camera Bible §7's rhythm-variance rule; timing tokens are ranges with authored variance, never single fixed values, so §1's tooling cannot accidentally flatten the Camera Bible's "no two consecutive beats identical" requirement into a fixed constant.
- **Opacity, Blur, Shadow, Glass** — surface-treatment tokens, each held to the same forbidden-pattern check as the Color and Material Bibles (no glassmorphism without purpose, cross-reference Appendix D and UI Integration Bible §12).
- **Lighting** — the tokenized form of Lighting Bible §2's Light Identities and §4's Color Temperature values, where those values need to be shared with React-driven UI elements that must visually cohere with world lighting (cross-reference UI Integration Bible §1's UI Identity rule).
- **Transitions** — the tokenized form of Camera Bible §24's Transition Language weights, shared between Theatre.js (world transitions) and GSAP/React (UI transitions) so the two stay visually synchronized per Camera Bible §15's "one clock, many listeners" principle.
- **Breakpoints: Desktop, Tablet, Mobile** — the shared capability-tier boundaries token, cross-referenced against the Performance & Optimization Bible §3's Quality Tiers (Cinema/Balanced/Essential) — breakpoints describe layout adaptation; Quality Tiers describe rendering cost adaptation; the two are related but not identical, and this document keeps them as separate, explicitly cross-referenced token sets rather than conflating them.

====================================================

## 3. NAMING CONVENTIONS

Token names are structured, hierarchical, and self-describing (category → role → variant, e.g., a Color token names its palette tier and emotional mapping per Color Bible §6, not an arbitrary swatch number). No token is named after its literal value (no `blue-500`-style naming) — naming follows the same meaningful-over-abbreviated discipline the eventual Development Standards document will formalize for code generally (cross-reference AI Development Protocol §6's "readable, maintainable" code generation rule, applied here to tokens).

====================================================

## 4. VERSIONING

Tokens are versioned as a set, not individually — a released token version is immutable; a change produces a new version rather than mutating a value consumers already depend on. This mirrors the Camera Bible's own Versioning Discipline (Camera Bible §26) — every token change is expected to note which token changed and why, so the token system's own history stays legible without relying on version-control archaeology.

====================================================

## 5. GOVERNANCE

No token is added, renamed, or removed without passing through the same Authority Hierarchy the AI Development Protocol establishes (AI Development Protocol §2) — token governance is a Technical Director-level decision by default, escalating to Creative Director where a token change would alter a value another Bible (Color, Typography, Camera) has already authored. A token change that contradicts its source Bible is not a token decision at all — it is a proposed amendment to that Bible, and must be reviewed as one via the Constitution Review Protocol (Constitution Review Protocol §1's Conflict Resolution order), never slipped in silently through the token layer.

====================================================

## 6. SYNCHRONIZATION BETWEEN FIGMA AND PRODUCTION

Figma-authored token values and production (React/R3F/GSAP/Theatre.js)-consumed token values are kept in sync through a single declared export/import path — never hand-copied per tool, which is exactly the failure mode that produced the Blender export pipeline's two divergent, non-identical "no exceptions" chains flagged in the Constitution Audit Report (`docs/bible/reports/constitution-audit-2026-07-12.md` §3.4). This document explicitly commits to avoiding that failure mode for design tokens specifically, by keeping Figma's role restricted to *authoring and previewing* (§1) rather than becoming a second, independently-maintained source of truth.

====================================================

## 7. DESIGN TOKEN OATH

I am defined once, in one place, and consumed everywhere else without being redefined.

I never contradict the Bible that authored my value — a Color token that disagrees with the Color Bible is not a token, it is a bug.

I keep Figma, React, R3F, GSAP, and Theatre.js speaking the same language, without letting any one of them quietly drift from the others.

I am named for what I mean, never for what I literally am.

I version as a set. I never mutate silently under a consumer that already depends on me.

Every future hand that adds a token to HEBRA inherits this oath before it inherits any config file.

====================================================

## 8. REVIEW CHECKLIST

- [ ] Does this token trace to a single authoritative source Bible (Color, Typography, Camera, Lighting, World Blueprint) per §1–§2, with no independently invented value?
- [ ] Does it follow the structured naming convention in §3?
- [ ] Is its change versioned per §4, not a silent mutation?
- [ ] Has it passed the governance path in §5, escalated to Creative Director if it touches another Bible's authored value?
- [ ] Is it synchronized between Figma and production per §6, with no hand-copied divergence?

====================================================

## 9. APPROVAL CHECKLIST

- [ ] Source Bible cited explicitly for every new or changed token.
- [ ] Cross-tool consumption verified (Figma, React, R3F, GSAP, Theatre.js) per §1.
- [ ] Final Test (Appendix E, applied to tokens): would changing this token in one place actually update it correctly everywhere it's used?

If every box is checked, token work may proceed to Technical and Creative Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the token file.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
