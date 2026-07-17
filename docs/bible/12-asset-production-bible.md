# HEBRA MASTER PRODUCTION BIBLE

## THE ASSET PRODUCTION BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Assets are not decoration. Assets are history. Assets are architecture. Assets are storytelling. Assets are identity.

This document defines how every asset inside HEBRA must be conceived, designed, produced, validated, and integrated. Nothing should ever enter the world without passing this document.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is the production discipline that turns the Material Bible's families, the World Blueprint's locations, the Lighting Bible's identities, and the Animation/FX Bibles' behaviors into a single, accountable object at the end of a pipeline.

====================================================

## 1. ASSET PHILOSOPHY, IDENTITY, HIERARCHY, LIFECYCLE, OWNERSHIP

**Asset Philosophy.** Every asset is a small act of world-building, not a task to be completed. An asset produced without first knowing its Purpose and History (§4) is production debt, regardless of how well it renders.

**Asset Identity.** Every asset's silhouette, material assignment (Material Bible §3), and lighting behavior (Lighting Bible §2) must be decided together, at concept stage, never reconciled after modeling is complete.

**Asset Hierarchy.** Hero assets (Landmarks, Monuments, named Artifacts per World Blueprint §3) receive the full pipeline in §6. Environment Props and repeated background assets receive a lighter, still-disciplined pass, mirroring the hierarchy principle already established across the Lighting, Material, Animation, and FX Bibles.

**Asset Lifecycle.** An asset's life does not end at integration — it is revisited whenever the Bible it depends on (Material, Lighting, World Blueprint) is amended, per the Constitution Review Protocol's (`docs/bible/16` §4) consistency validation.

**Asset Ownership.** Every asset has a single accountable owner at every pipeline stage (§6) — no asset moves to the next stage without a named handoff, mirroring the AI Development Protocol's Human Approval Chain (deferred to that document).

====================================================

## 2. ASSET CATEGORIES

**Architecture** — the largest-scale, most structurally significant category; cross-referenced against World Blueprint §3's Landmarks.

**Artifacts** — small, personal, often Memory- or Ancient-Light-carrying objects (Lighting Bible §2).

**Monuments** — the hero subset of Architecture, held to the full pipeline (§6) without exception.

**Environment Props** — the repeated, instanced-friendly category that fills a location without individually authored uniqueness, cross-referenced against FX Bible §10 and Animation Bible §9's instancing discipline.

**Bridges** — cross-referenced against World Blueprint §2's Bridge Traversal.

**Platforms** — cross-referenced against World Blueprint §3's Observation Platforms.

**Symbols** — the smallest narratively significant category, cross-referenced against Material Bible §5's Tiny Symbols and Lighting Bible §5's Symbols light source.

**Energy Objects** — physical carriers of Energy Light and Energy FX (Lighting Bible §2, FX Bible §6).

**Interactive Objects** — assets with defined interaction behavior, deferred fully to the future Interaction Bible but requiring the same production rigor as any other asset here.

**Hidden Objects** — cross-referenced against World Blueprint §9's Hidden Discovery System.

**Sacred Objects** — reserved for Origin- and Awakening-adjacent narrative significance, cross-referenced against Material Bible §3's Sacred Stone.

**Living Objects** — assets carrying Animation Bible §4's Living World baseline at its most pronounced, and Material Bible §7's Material Evolution where applicable.

====================================================

## 3. EVERY ASSET MUST DEFINE

- **Purpose** — why this asset exists.
- **Story** — its narrative role.
- **History** — cross-referenced directly against Material Bible §4's History field for its assigned material.
- **Scale** — cross-referenced against World Blueprint §6.
- **Material** — cross-referenced against Material Bible §3; every asset must declare its family before production begins, never after.
- **Lighting Behavior** — cross-referenced against Lighting Bible §2 and §13.
- **Animation Behavior** — cross-referenced against Animation Bible §3.
- **Interaction Behavior** — deferred to the future Interaction Bible, logged here as a required field regardless.
- **Audio Behavior** — cross-referenced against Audio Production Bible §2's Artifact/Architecture/Energy categories as applicable.
- **Performance Cost** — measured against Appendix F, logged per asset.
- **LOD Strategy** — cross-referenced against World Blueprint §10 and Appendix F's geometry tiers.

An asset missing any of these eleven fields is not yet documented and may not enter production.

====================================================

## 4. PRODUCTION PIPELINE

The mandatory stage order — no stage may be skipped, and no asset may re-enter an earlier stage without explicit review:

**Concept → Research → Sketch → Blockout → High Poly → Optimization → Retopology → UV → Bake → Textures → Validation → Integration → Review → Approval.**

**Concept** begins with §3's required fields answered in outline, not with geometry.

**Research** is mandatory before Sketch, per §9 below and Appendix E's standing protocol — no asset skips straight to visual development without documented reference study.

**Blockout** establishes silhouette and scale (cross-reference World Blueprint §7's silhouette-uniqueness test) before any surface detail is considered.

**High Poly** is where Material Bible §5's Micro Details are sculpted or authored at source fidelity.

**Optimization and Retopology** bring the asset within Appendix F's geometry budgets for its Asset Hierarchy tier (§1) without discarding the silhouette established at Blockout.

**UV and Bake** prepare the asset for Material Bible §10's texture and compression pipeline.

**Textures** apply the asset's declared Material family (§3), never a generic or placeholder material.

**Validation** checks the asset against every field in §3 and every rule in §5 (Quality Standards) before Integration is attempted.

**Integration, Review, Approval** — the final three stages mirror the Constitution Review Protocol's general review discipline (deferred to that document), applied at asset scale.

====================================================

## 5. QUALITY STANDARDS

**Silhouette** — cross-referenced directly against World Blueprint §7; every asset above Environment Prop tier must pass a silhouette-recognition test.

**Readability** — an asset must communicate its Purpose (§3) at the distance and lighting condition it is actually expected to be seen at, not only in a clean turntable render.

**Identity** — consistent with its declared Material family's Visual Identity (Material Bible §4).

**Uniqueness** — no asset duplicates another's form without narrative reason (World Blueprint §7's no-duplicate-silhouette rule, applied at asset scale).

**Storytelling** — cross-referenced against World Blueprint §8's environmental storytelling principle.

**Material Quality** — validated against every field in Material Bible §4, not just Visual Identity.

**Scale Accuracy** — validated against World Blueprint §6.

**Visual Weight** — an asset's apparent mass must be consistent with its Material Bible §4 Physical Behaviour — a Liquid Metal object that reads as visually weightless has failed this standard.

**Environmental Believability** — the asset must belong to its intended World Blueprint location's palette (World Blueprint §8) or deliberately, legibly break from it for a logged reason.

====================================================

## 6. FORBIDDEN ASSETS

Per Appendix D's standing authority:

- **Marketplace Assets** — no unmodified purchased or downloaded asset ships in HEBRA (cross-reference Appendix E's Blender research section).
- **Kitbash Identity** — assembling recognizable pieces from other sources into a "new" asset is forbidden; every asset's identity must originate from HEBRA's own Material and World Blueprint documents.
- **Generic Sci-Fi** — cross-reference Appendix D's 3D Clichés section.
- **Fantasy Clichés** — same standing prohibition, applied to fantasy-genre visual tropes with no HEBRA-specific grounding.
- **Plastic Appearance** — cross-reference Material Bible §9 verbatim.
- **AI-looking Geometry** — cross-reference Appendix D's AI section — any AI-assisted asset must be transformed until it no longer reads as AI output.
- **Low Quality Sculpt** — assets that skip the High Poly stage (§4) or otherwise fail Quality Standards (§5) are forbidden from Integration.
- **Repeated Props / Visible Repetition** — cross-reference World Blueprint §7; even Environment Props (§2) require enough authored variation (per Animation Bible §5's Natural Imperfections principle, applied to static geometry) to avoid visibly tiling.

====================================================

## 7. FIGMA INTEGRATION

Every asset begins its Concept stage (§4) in Figma, per Appendix E's standing protocol restricting Figma to documentation, planning, and specification — never ready-made assets.

**Moodboards** — collected research (§9) organized by Purpose and Material family before any original sketching begins.

**Orthographic Concepts** — front/side/top views establishing silhouette (§5) prior to 3D blockout.

**Shape Language** — the deliberate geometric vocabulary an asset draws from, cross-referenced against its declared Material family's Visual Identity (Material Bible §4).

**Material Notes** — direct annotation linking the asset to its Material Bible §3 family and §4 required fields.

**Production Notes** — pipeline-stage-specific instructions handed off between owners (§1, Asset Ownership).

**Review Notes** — the running record of Validation and Review stage feedback (§4), preserved as part of the asset's permanent documentation, not discarded once addressed.

====================================================

## 8. OPTIMIZATION

Bound by Appendix F without exception.

**Triangle Budget** — follows Appendix F's Hero/Interactive/Environment/Background tiers directly, assigned at Concept stage (§4) based on the asset's Hierarchy (§1), not decided reactively during Optimization.

**Texture Budget** — cross-referenced against Material Bible §10.

**Memory Budget** — tracked cumulatively across all assets in a given World Blueprint location against Appendix F's VRAM ceilings.

**Instancing** — Environment Props (§2) are designed from Concept stage to support instancing, per Animation Bible §9 and FX Bible §10's shared instancing discipline.

**LOD** — every asset above Environment Prop tier receives an explicit LOD strategy (§3) authored at Blockout stage, not retrofitted after High Poly.

**Streaming** — assets load progressively with their World Blueprint location per that document's §10 chunk-loading philosophy.

**Occlusion** — assets in Secret Chambers or Hidden Worlds (World Blueprint §4) are produced to the same quality standard as any other asset but are budgeted assuming near-zero visibility for most visitors, per World Blueprint §10.

**GPU Cost** — validated per-asset before Integration (§4), never assumed from similar prior assets.

====================================================

## 9. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Industrial Design, Architecture, Luxury Products** — studied for form language and craft-communicating detail, informing §5's Quality Standards.

**Museum Objects** — studied for how real historic and precious objects are presented and lit, directly informing the Artifacts and Sacred Objects categories (§2).

**AAA Environment Art** — studied for production pipeline discipline (§4) and instancing/LOD technique (§8) at scale.

**Three.js, glTF, official documentation** — studied for asset delivery and format technique only, per Appendix D and Appendix E, never for ready-made models.

Extract principles. Never imitate.

====================================================

## 10. ASSET OATH

I am not decoration. I am history, made solid.

I know my Purpose and my Story before I have a single vertex.

I belong to a Material family, and I honor everything that family requires of me.

I pass through every pipeline stage in order. I do not skip High Poly. I do not skip Validation.

I am never a marketplace default, never a kitbash of someone else's identity, never AI output left untransformed.

I hold my performance budget without losing my believability — a cheaper version of me is still recognizably the object I was designed to be.

Every future hand that produces an asset for HEBRA inherits this oath before it inherits any pipeline tool.

====================================================

## 11. ASSET REVIEW CHECKLIST

- [ ] Does this asset answer all eleven fields in §3?
- [ ] Has it passed through every stage of §4's pipeline in order?
- [ ] Does it meet every standard in §5, not only the most visually obvious ones?
- [ ] Has it been checked individually against every bullet in §6?
- [ ] Did its Concept stage begin in Figma per §7, with documented research?
- [ ] Does it hold Appendix F's triangle, texture, and memory budgets per §8?

====================================================

## 12. APPROVAL CHECKLIST

- [ ] Purpose, Story, and History are written down before the asset is finalized.
- [ ] Research principle extracted and logged per §9, never a copied reference.
- [ ] Performance reviewed against Appendix F on both desktop and mobile targets.
- [ ] Final Test (Appendix E): with all reference material hidden, does this asset still feel unmistakably HEBRA's?

If every box is checked, asset work may proceed to Creative, Engineering, Performance, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the DCC tool.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
