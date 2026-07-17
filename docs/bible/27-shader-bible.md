# HEBRA MASTER PRODUCTION BIBLE

## THE SHADER BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

A shader is where every other visual Bible in this Constitution becomes a single number on the GPU. The Lighting Bible decides what a Light Identity means; the Material Bible decides what a surface is; the Rendering Bible decides how the frame is finally exposed; the FX Bible decides what a phenomenon does. None of that reaches the screen without a shader converting the decision into math. This document governs that conversion — not by inventing new artistic rules, but by giving the six documents above one shared, disciplined layer they can all trust.

This document was commissioned by the Constitution Audit Report and the Phase Gate Review as a missing document, and is written now under the Creative Director's direct authorization. It closes that gap.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. Where this document appears to conflict with Lighting Bible §15, Material Bible §6, FX Bible, Rendering Bible §2, or Appendix F's shader budget section, it does not — this document is written specifically to consolidate and formalize what those sections already established, never to override them. Any apparent conflict is a drafting error in this document, to be corrected in favor of whichever of those five sources is older, per the Constitution Review Protocol's Conflict Resolution order (Constitution Review Protocol §1).

====================================================

## 1. SHADER PHILOSOPHY, IDENTITY, HIERARCHY, LIFECYCLE

**Shader Philosophy.** No shader exists only because it looks impressive — this is Appendix F's own standing rule, restated here as this document's first principle because everything else follows from it. A shader is a question with a specific answer: what does this Light Identity look like on this Material, under this atmosphere, in this Dialect? A shader that cannot name the specific question it answers does not belong in HEBRA.

**Shader Identity.** Every shader belongs to exactly one of the five categories in §2, and inherits that category's governing Bible's artistic intent completely — a Material shader is never permitted to make a lighting decision Lighting Bible §2 hasn't already made; a Lighting shader is never permitted to invent a material behavior Material Bible §4 hasn't already described. Shaders execute decisions. They do not make new ones.

**Shader Hierarchy.** Hero shaders (applied to Landmarks and named Artifacts, per Asset Production Bible §2's Hierarchy) receive the most authored, least generic treatment — custom-tuned per object where the story calls for it. Ambient and environmental shaders are parameterized and shared across many instances, mirroring the Animation Bible §1 and FX Bible §1 hierarchy pattern applied here to shader code specifically.

**Shader Lifecycle.** A shader is conceived against a specific Bible requirement (§3), authored, budgeted (§6), reviewed against every governing document below, and only then integrated — mirroring the Asset Production Bible's pipeline discipline (Asset Production Bible §4) applied to code rather than geometry.

====================================================

## 2. SHADER COVERAGE — THE FIVE CATEGORIES

**Material Shaders** — govern how a Material Bible family (Material Bible §3) responds to light: gloss, roughness, subsurface, refraction, per Material Bible §6's Reflection Philosophy. This document adds no new material behavior; it is the execution layer for what Material Bible §4 and §6 already specify per family.

**Lighting Shaders** — govern how a Light Identity (Lighting Bible §2) is computed and how Darkness (Lighting Bible §3) is represented — the shader-level expression of Lighting Bible §15's Technical Direction section, which this document formally absorbs and expands.

**Volumetric & Atmospheric Shaders** — govern Fog, Mist, Dust, and Light Shafts (Lighting Bible §6) and their FX-layer counterparts (FX Bible §2's Volumetric Light, Atmospheric Waves). Owned jointly by Lighting and FX; this document defines only their shared technical conventions (§7).

**Post-Processing & Rendering Shaders** — govern tone mapping, color management, and the post-processing stack (Rendering Bible §2) — the shader-level execution of that document's pipeline ordering rule.

**Particle & FX Shaders** — govern per-particle rendering (FX Bible §4's Particle Philosophy) and phenomenon-specific shaders (Energy, Crystal Emission, Heat Distortion — FX Bible §2).

Every shader in HEBRA belongs to exactly one category. A shader that appears to serve two categories at once (e.g., a Material shader that also computes atmospheric fog) is a sign the two responsibilities should be split into two shaders, mirroring Development Standards §6's "every library owns exactly one responsibility, never duplicate" rule applied here to shader code specifically.

====================================================

## 3. EVERY SHADER MUST DEFINE

- **Purpose** — the specific Bible requirement it executes, cited by section number (e.g., "Material Bible §4, Liquid Metal's Reflection Behaviour").
- **Category** — one of the five in §2, never ambiguous.
- **Governing Bible(s)** — the document(s) whose decisions this shader is not permitted to contradict.
- **Inputs** — which Light Identity, Material family, Environmental Dialect, or FX phenomenon it reads.
- **Complexity Tier** — cross-referenced against §6's budget, declared before authoring begins, not measured only afterward.
- **Fallback Behavior** — what the shader does under Appendix F's Balanced/Essential quality tiers (cross-reference Performance Bible §3) — every shader has a defined, authored cheaper path, never an ad hoc runtime branch discovered during optimization.
- **Ownership** — which category-governing Bible's author (per the Constitution Review Protocol's Review Hierarchy) signs off on this shader's correctness.

A shader missing any of these seven fields is not yet documented and may not be treated as production-ready.

====================================================

## 4. INTEGRATION WITH THE MATERIAL BIBLE

Material Bible §6 (Reflection Philosophy) already defines the five dial-set every material family sets a baseline for: Gloss, Roughness, Mirror, Diffusion, Blur, plus Subsurface and Refraction for translucent families. This Bible adds no new parameter to that set. What it adds is the shared technical contract: every Material Shader (§2) reads its baseline values from the Material Bible's per-family table (Material Bible §4) as authored data, never as hardcoded constants inside the shader itself — this is the shader-level expression of the Design Token Bible's single-source-of-truth principle (Design Token Bible §1), applied to material parameters specifically.

Material Bible §9's forbidden list (Plastic, Cheap Metal, Stock PBR, Artificial Perfection) is enforced at the shader level by this rule: no Material Shader may default to a "clean," zero-imperfection response when its family's authored micro-detail (Material Bible §5) is absent from a given asset — a missing detail map is a production gap to flag, never a reason for the shader to fall back to an artificially perfect surface.

====================================================

## 5. INTEGRATION WITH THE LIGHTING BIBLE

Lighting Bible §15 already establishes that Three.js and R3F own rendering, not direction — that shaders apply, per frame, values that Theatre.js/breathing/presence have already computed, never originate lighting decisions themselves. This Bible's Lighting Shaders (§2) are the literal fulfillment of that rule: every Lighting Shader reads a Light Identity (Lighting Bible §2) and a Color Temperature (Lighting Bible §4) as authored per-Dialect data (cross-reference the Canonical Naming Architecture, docs/bible/26 §4), and computes only how that already-decided light behaves physically — falloff, shadow softness (Lighting Bible §7), volumetric scattering (Lighting Bible §6). It never decides which Light Identity is present in a scene; that decision belongs entirely to the Lighting Bible and the World Blueprint's per-location Dialect assignment (docs/bible/26 §3).

Appendix F's shadow-caster ceilings (Desktop 6, Mobile 2) and Lighting Bible §14's performance philosophy are the binding budget for every Lighting Shader; §6 below restates them in shader-specific terms only.

====================================================

## 6. SHADER COMPLEXITY BUDGET

Bound by Appendix F without exception. This section is the shader-specific reading of that budget, consolidating what was previously scattered across Lighting §14, Material §10, FX §10, and Rendering §4.

**Allowed** (per Appendix F, restated here as this document's own standing list): atmospheric depth, energy flow, living reflections, volumetric light, material uniqueness, micro distortion. **Forbidden**: random RGB effects, noise for decoration, heavy raymarching without reason, infinite procedural complexity (Appendix F, verbatim).

**Instruction count ceilings** are set per Complexity Tier (§3's required field): Hero shaders (Asset Production Bible §1 Hierarchy) receive the largest instruction budget within Appendix F's overall shader-budget philosophy; ambient/environmental shaders are held to a materially smaller ceiling and rely on parameterized reuse (§1's Hierarchy rule) rather than per-instance complexity.

**Quality-tier fallback** (§3's Fallback Behavior field, cross-referenced against Performance Bible §3's Cinema/Balanced/Essential tiers): every shader's Essential-tier fallback is authored, not automatically generated by simply truncating the Cinema-tier version — a naively truncated shader frequently produces visibly wrong results rather than merely simpler ones, and this document treats that distinction as load-bearing.

**Shader compilation timing** — per Performance Bible §5, shader compilation is scheduled to avoid visible hitches during Camera Bible Transitioning state (Camera Bible §6); this document adds the specific rule that every shader's variants (per its Complexity Tier) are precompiled at the same World/Environment Transition boundary that loads the underlying Physical Location, never compiled lazily on first visibility.

====================================================

## 7. INTEGRATION WITH THE FX BIBLE

FX Bible §4 (Particle Philosophy) already establishes that particles never exist randomly. Particle & FX Shaders (§2) enforce this at the GPU level: every particle shader reads an authored origin, destination, and lifetime (FX Bible §3's required fields) as instanced per-particle data, never generates particle behavior procedurally with no traceable authored source. Volumetric & Atmospheric Shaders (§2) are the shared technical layer between Lighting Bible §6 and FX Bible §5–§6 (Fog and Energy Philosophy) — one shader family, read by both documents' artistic rules, never two independently-authored fog implementations.

====================================================

## 8. INTEGRATION WITH THE RENDERING BIBLE

Rendering Bible §2 already establishes the pipeline order: linear working space → post-processing → tone mapping → output transform. Post-Processing & Rendering Shaders (§2 of this document) are that pipeline's literal implementation layer. This document adds one rule the Rendering Bible does not: every custom post-processing shader is written and reviewed against Rendering Bible §1's Consistency principle specifically — a bloom or grain shader tuned to look correct in one Environmental Dialect (docs/bible/26 §4) but not validated across at least two others is not yet production-ready, since Rendering Consistency requires the same underlying process to hold across the whole world.

====================================================

## 9. INTEGRATION WITH THE WORLD BLUEPRINT

Shaders never define which Physical Location or Environmental Dialect is present (docs/bible/26 §1–§4) — that assignment belongs entirely to the World Blueprint and the Canonical Naming Architecture. What this document adds is the technical contract: every shader that varies by Dialect reads its Dialect-specific parameters (color temperature, volumetric density, material palette) as authored data keyed to the canonical Dialect names in docs/bible/26 §4, never as a hardcoded per-location branch — a new Physical Location added to World Blueprint §3 should be able to select an existing Dialect and receive correct shader behavior automatically, with zero shader code changes, per Development Standards §2's additive-architecture rule.

====================================================

## 10. TECHNICAL OWNERSHIP (CONCEPTUAL)

No implementation code belongs in this document — this section explains ownership, not mechanism, exactly as Camera Bible §15 and Lighting Bible §15 do for their own domains.

**Three.js and GLSL** own shader execution itself. **React Three Fiber** owns how a shader's uniforms are wired to React-managed state (Development Standards §6's R3F responsibility). **The Design Token Bible** owns any shader-relevant numeric constant that also has a design meaning (a color, a spacing-adjacent scale value) — a shader never hardcodes a value the Design Token Bible already tokenizes. Development Standards §7 governs shader *code* convention (naming, file organization, uniform-passing pattern); this document governs shader *philosophy and integration* — the two are companion sections, not competitors, and Development Standards §7 is hereby updated to point here as the canonical source for everything beyond pure code convention.

====================================================

## 11. FORBIDDEN SHADERS

Per Appendix D and Appendix F's combined standing authority, restated here as this document's own list for direct shader-level enforcement:

- Random RGB effects with no traced Light Identity or Material family origin.
- Noise applied for decoration rather than a specific atmospheric or material purpose (cross-reference §6's Allowed/Forbidden list).
- Heavy raymarching without a specific, logged narrative or technical reason.
- Infinite or unbounded procedural complexity — every procedural shader has an authored, finite complexity ceiling per §6.
- A shader that duplicates another shader's Purpose (§3) rather than being reused or parameterized — cross-reference Development Standards §6's "never duplicate responsibilities" rule, applied here at the shader level.
- Official Three.js example shaders shipped unmodified — cross-reference Appendix D's Three.js Clichés section and Appendix E's "never ship examples" rule.

====================================================

## 12. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Physically Based Rendering, shader theory** — studied for the mathematical foundation every Material and Lighting Shader builds on, cross-referenced against Material Bible §11 and Lighting Bible §15's existing research notes rather than duplicated here.

**Three.js, WebGL/WebGPU shader architecture** — studied for implementation technique only, per Appendix D and Appendix E, never for ready-made shader code shipped unchanged.

**AAA rendering engines' shader pipelines** — studied for how large productions manage shader variant explosion (Complexity Tiers, §6) without either under-optimizing or over-fragmenting their shader library.

**Official documentation** — studied for the same reasons, never for demo shaders to be shipped in production.

Extract principles. Never imitate.

====================================================

## 13. SHADER OATH

I execute a decision another Bible has already made. I never make a new one of my own.

I know exactly which category I belong to, and I never quietly serve two at once.

I read my Dialect and Material parameters as authored data, never as constants I've hardcoded myself.

I have an authored fallback for every quality tier I run under — a cheaper version of me is still correct, never merely truncated.

I am never random, never decorative noise, never unbounded complexity for its own sake.

I am never an unmodified example lifted from a tutorial. Every future hand that writes a shader for HEBRA inherits this oath before it inherits any GLSL file.

====================================================

## 14. SHADER REVIEW CHECKLIST

- [ ] Does this shader answer all seven fields in §3?
- [ ] Does it belong to exactly one of the five categories in §2?
- [ ] Does it read its governing Bible's parameters as authored data rather than hardcoding them, per §4–§5, §7–§9?
- [ ] Does it hold its Complexity Tier's instruction budget per §6, with an authored (not truncated) fallback for lower tiers?
- [ ] Has it been checked individually against every bullet in §11?
- [ ] If it's a post-processing shader, has it been validated across at least two Environmental Dialects per §8?

====================================================

## 15. PRODUCTION APPROVAL CHECKLIST

- [ ] Purpose and governing Bible citation are written down before the shader is finalized.
- [ ] Research principle extracted and logged per §12, never a copied shader.
- [ ] Performance reviewed against Appendix F and the Performance Bible on both desktop and mobile targets.
- [ ] Final Test (Appendix E): with all reference material hidden, does this shader's output still feel unmistakably HEBRA's?

If every box is checked, shader work may proceed to Creative, Technical, and Performance Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the shader editor.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

It closes the Shader Bible gap identified in the Constitution Audit Report and the Phase Gate Review. It introduces no new artistic decisions — it consolidates and formalizes what Lighting Bible §15, Material Bible §6, FX Bible, Rendering Bible §2, and Appendix F already established.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
