# HEBRA MASTER PRODUCTION BIBLE

## THE PERFORMANCE & OPTIMIZATION BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Performance is part of the artistic identity. Smoothness is immersion. Optimization is invisible design.

Every other Bible in this Constitution assumes its budgets will be honored by something. This document is that something — the systematic discipline, across every discipline, that makes Appendix F's numbers achievable rather than aspirational.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document does not replace Appendix F — it is Appendix F's operational strategy, read alongside the performance sections already embedded in every other Bible (Camera §16, Lighting §14, Material §10, World Blueprint §10, Animation §9, FX §10, Audio §11, Asset Production §8, UI Integration §11).

====================================================

## 1. PERFORMANCE PHILOSOPHY, OPTIMIZATION HIERARCHY, IDENTITY, LIFECYCLE, BUDGET

**Performance Philosophy.** A visitor should never notice optimization. They should only notice beauty (cross-reference Appendix F verbatim). Every optimization decision is judged by whether it changed what the visitor feels, not only by whether it changed the frame time.

**Optimization Hierarchy.** When budgets are tight, reduction happens in a fixed order, cross-referenced against every discipline Bible's own hierarchy principle: ambient/background systems first (Environment Props, ambient particles, ambient audio layers), hero/story-critical systems last, and Story/Lore/Camera-choreography (Appendix F's "Never Remove" list) not at all.

**Performance Identity.** HEBRA's performance profile is itself part of its identity — the specific choice of 120fps-capable, multi-axis camera motion (Camera Bible §10) over a simpler, cheaper scroll-jacked page is a performance decision as much as a stack decision, and this document exists to keep that ambition honest.

**Performance Lifecycle.** Performance is measured continuously across a feature's life — at Concept (Asset Production Bible §4), at Integration, and periodically after ship — never only once at the end of a production cycle (cross-reference §9, Measurement).

**Performance Budget.** The complete numeric budget lives in Appendix F; this document defines the *strategy* that keeps every system within it.

====================================================

## 2. PERFORMANCE BUDGETS BY SYSTEM

Defined in full numeric detail in Appendix F; this document assigns strategic ownership per system:

**CPU** — owned primarily by Animation Bible §9's CPU-light procedural motion strategy and Audio Production Bible §11's generative-audio CPU discipline.

**GPU** — owned primarily by Lighting Bible §14, FX Bible §10, and Rendering Bible (deferred) — the three systems with the largest per-frame GPU footprint.

**Memory / VRAM** — owned jointly by Material Bible §10 (textures) and Asset Production Bible §8 (geometry and instancing).

**JavaScript** — owned by Development Standards (deferred) and this document's §5 Streaming/Code Splitting section.

**WebGL / WebGPU (future)** — owned by Rendering Bible (deferred); this document tracks only the budget ceiling, not the technique.

**Textures, Geometry, Materials, Shaders, Particles, Lighting, Audio, Animations, Physics, Post Processing** — each owned by its respective discipline Bible's own performance section, with this document responsible for reconciling all of them against a single, shared per-frame budget so that no two systems' "safe" individual budgets sum to an unsafe frame total.

====================================================

## 3. QUALITY TIERS

**Cinema, Balanced, Essential** — HEBRA's naming for Appendix F's Tier A/B/C, chosen deliberately to avoid implying any tier is a "lesser" experience.

Each tier must preserve artistic identity. Only implementation complexity changes. Never story. Never atmosphere. Never world structure.

This is the single most load-bearing rule in this document, and it is inherited verbatim from every discipline Bible's own tier language (Lighting §16, Material §9's "never remove," Camera §16's "identical journey, different render cost"). Quality tiers are capability-measured (cross-reference Camera Bible §16), never device-type-assumed — a high-end phone may run Cinema tier; a constrained desktop may run Essential.

====================================================

## 4. DESKTOP AND MOBILE STRATEGY

**Desktop Strategy** — High-end GPU targets Appendix F's 120fps ceiling; Mid-range targets 90fps; Low-end degrades gracefully toward Essential tier (§3) rather than failing outright. High Refresh and Ultrawide displays are treated as capability signals for the adaptive quality system (§7), never assumed from device category alone.

**Mobile Strategy** — Flagship devices target the fullest mobile experience Appendix F allows (60fps target); Upper Midrange, Midrange, and Entry Level step down through Balanced and Essential tiers in that order. The standing target: maintain approximately 90–95% of the desktop artistic language whenever hardware allows, cross-referenced directly against the Camera Bible's Mobile Input Language philosophy (Camera Bible §13) and Appendix F's mobile section.

====================================================

## 5. STREAMING

**Progressive Loading, Asset Streaming, Texture Streaming, Geometry Streaming, Shader Compilation, Audio Streaming, World Streaming** — the complete streaming surface, each owned by its respective discipline Bible (Material §10, Asset Production §8, Audio Production §11, World Blueprint §10) and coordinated here so that no two streaming systems compete for the same bandwidth or main-thread budget at the same moment.

**Shader Compilation** specifically is scheduled to avoid visible hitches during Camera Bible Transitioning state (Camera Bible §6) — a shader compiling mid-transition is a performance regression wearing a cinematic disguise, echoing the Camera Bible's own §16 language verbatim.

Atmosphere loads before detail, per Appendix F's loading philosophy, applied consistently across every streaming system listed above.

====================================================

## 6. RENDERING STRATEGY

**Frustum Culling, Occlusion, LOD, Instancing, Texture Compression, Batching, Adaptive Resolution, Adaptive Effects** — the complete rendering-cost-control surface.

Ownership: Occlusion and LOD are primarily World Blueprint §10 and Asset Production Bible §8 concerns; Instancing and Batching are primarily Animation Bible §9 and FX Bible §10 concerns; Texture Compression is a Material Bible §10 concern; Adaptive Resolution and Adaptive Effects are this document's own responsibility, since they operate at the whole-frame level rather than any single discipline's assets.

**Adaptive Resolution** reduces render resolution before it reduces any single system's individual quality, since a resolution reduction is the most globally effective, least artistically visible lever available under load.

**Adaptive Effects** follows Appendix F's tier-by-tier reduction order (§9 of Appendix F) exactly, coordinated across Lighting, FX, and Rendering so that a single quality-tier drop reduces cost across the whole frame coherently, rather than each system reducing independently and unpredictably.

====================================================

## 7. MEASUREMENT

**FPS, Frame Time, GPU Time, CPU Time, Memory Usage, Input Latency, Loading Time, Interaction Delay** — the complete measurement surface, measured continuously per §1's Lifecycle rule, never assumed.

Every discipline Bible's own performance section (cross-referenced throughout this document) is validated against these eight measurements specifically — a Lighting Bible §14 claim about shadow-caster cost, for example, is not considered production-ready until it has been measured against Frame Time and GPU Time on both a desktop and mobile reference target.

Input Latency and Interaction Delay are measured specifically against the Camera Bible's presence-response philosophy (Camera Bible §12, §22) — a felt lag between visitor input and camera or UI response is treated as a Camera Safety concern (Camera Bible §25) as much as a performance concern.

====================================================

## 8. ACCESSIBILITY

**Reduced Motion** — cross-referenced directly against Camera Bible §16 and §25; this document's role is to ensure the Reduced Motion branch is never more expensive than the full-motion branch, since a visitor opting into a comfort mode should never be rewarded with worse performance.

**Battery Awareness / Thermal Awareness** — mobile devices' sustained performance is monitored for thermal throttling; the adaptive quality system (§3, §6) responds to sustained thermal pressure the same way it responds to a low initial capability measurement — gracefully, and without ever dropping below Essential tier's guarantee of complete artistic identity.

**Graceful Degradation** — the standing principle underlying this entire section: performance problems are absorbed by the tier system (§3) before they are allowed to surface as visible stutter, dropped frames, or — worst of all — content that silently fails to appear.

====================================================

## 9. FORBIDDEN

Per Appendix D and Appendix F's combined standing authority:

- **Premature Optimization** — optimizing a system before it has been measured (§7) against real budgets is forbidden; guesses are not optimization.
- **Visual Sacrifice** — cross-reference §3 verbatim: no optimization may remove Story, Lore, Lighting philosophy, Interaction philosophy, Camera choreography, or Material identity (Appendix F's "Never Remove" list).
- **Blocking Main Thread** — any operation that blocks the render or input thread long enough to be felt as input lag (§7) is forbidden.
- **Massive Bundles** — cross-reference Appendix F's <300KB gzip initial JavaScript target verbatim.
- **Memory Leaks** — any system that grows memory usage unboundedly across a session is forbidden from Integration (cross-reference Asset Production Bible §4).
- **Duplicate Assets** — cross-reference Material Bible §10 and Asset Production Bible §8's shared instancing discipline.
- **Unbounded Particle Systems** — cross-reference FX Bible §10's Appendix F particle-tier ceilings verbatim.

====================================================

## 10. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Chrome Performance, WebGL Optimization** — studied for browser-specific rendering and profiling technique, informing §7's Measurement discipline.

**Three.js, React Three Fiber** — studied for framework-specific cost patterns (`useFrame` ordering, draw-call batching), directly informing §6.

**GPU Architecture** — studied at a conceptual level to understand why certain operations (overdraw, shader complexity, texture bandwidth) cost what they cost, informing every discipline Bible's own performance section.

**Modern Game Engines** — studied for adaptive quality and LOD systems at scale, directly informing §3 and §6.

**Official documentation** — studied for the same reasons, never for ready-made optimization shortcuts that would compromise §9's forbidden list.

Extract principles. Never imitate.

====================================================

## 11. PERFORMANCE OATH

I am invisible when I am working correctly. The visitor should only ever notice beauty.

I never sacrifice story, lore, or identity to hit a number. A faster version of HEBRA that isn't HEBRA has failed me.

I measure before I optimize. I do not guess.

I degrade gracefully, in a fixed order, protecting what matters most until there is truly nothing left to give.

I hold every discipline's budget accountable to a single shared frame, not to its own budget in isolation.

I am never a memory leak, never an unbounded particle system, never a blocking operation the visitor can feel.

Every future hand that ships a system for HEBRA inherits this oath before it inherits any profiler.

====================================================

## 12. OPTIMIZATION REVIEW CHECKLIST

- [ ] Has this system been measured per §7 before being optimized?
- [ ] Does its degradation path follow §1's Optimization Hierarchy — ambient first, hero last, Appendix F's Never Remove list untouched?
- [ ] Does it respect its Quality Tier's identity-preservation guarantee per §3?
- [ ] Does it coordinate with other systems' streaming (§5) and rendering strategy (§6) rather than competing blindly for the same budget?
- [ ] Does it hold up under Accessibility's Reduced Motion and thermal conditions per §8?
- [ ] Has it been checked individually against every bullet in §9?

====================================================

## 13. PRODUCTION APPROVAL CHECKLIST

- [ ] Budget ownership assigned per §2 before implementation begins.
- [ ] Research principle extracted and logged per §10, never a copied shortcut.
- [ ] Measured on both desktop and mobile reference targets per §7.
- [ ] Final Test (Appendix F): if optimization changed emotion, optimization failed; if beauty broke performance, beauty failed. Balance verified.

If every box is checked, performance work may proceed to Engineering, Performance, and Accessibility Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the profiler.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
