# HEBRA MASTER PRODUCTION BIBLE

## THE RENDERING BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Rendering is not graphics. Rendering is perception. Rendering is reality.

Every other Bible in this Constitution describes what HEBRA *is* — its light, its materials, its motion, its effects. This document describes the final, singular process that turns all of those decisions into the specific pattern of photons a visitor's eye actually receives. If that process is dishonest, every other Bible's careful authorship is undermined at the last possible step.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is read together with the Lighting Bible (whose light identities and volumetrics this document must render faithfully) and the Performance & Optimization Bible (whose GPU/frame budgets this document's pipeline must live inside).

====================================================

## 1. RENDERING PHILOSOPHY, IDENTITY, HIERARCHY, PIPELINE, QUALITY, CONSISTENCY

**Rendering Philosophy.** The rendering pipeline's job is to be honest about what the Lighting and Material Bibles have already decided, not to add its own opinion on top. A tone-mapping curve or bloom pass that makes a scene "look better" while contradicting the Lighting Bible's authored intensity and color temperature (Lighting Bible §4) has overstepped its role.

**Rendering Identity.** HEBRA's rendered image has a consistent character across every chapter and environment — the same color science, the same tonal response to bright and dark values — even as the Lighting Bible's per-environment dialects (Lighting Bible §8) vary what is actually being lit. Consistency of *process* is what makes variety of *content* still read as one coherent world.

**Rendering Hierarchy.** Color management and tone mapping (§2) are the foundation every other rendering decision builds on and may never be inconsistent per-scene. Post-processing passes (§2) are the most negotiable layer, reduced first under the Performance Bible's tier system before any foundational rendering decision is touched.

**Rendering Pipeline.** The ordered sequence: scene rendered in linear space → post-processing applied in the correct color space → tone-mapped → output-transformed for the display. No step in this sequence is reordered for convenience.

**Rendering Quality.** Judged the same way every other Bible judges quality — against the Final Test (Appendix E): would a frame, examined in isolation, be mistaken for a generic WebGL demo, or does it read as a deliberate, singular rendering identity.

**Rendering Consistency.** A frame captured in Void and a frame captured in Origin Core should feel like they were rendered by the same camera and the same film stock, metaphorically — different scenes, same underlying rendering honesty.

====================================================

## 2. COVERAGE

**Linear Workflow** — all lighting and shading calculations happen in linear color space, matching physically-based rendering practice and the Material Bible's physical-honesty principle (Material Bible §11).

**Color Management** — a single, explicit color space is declared and honored end-to-end, so that a color authored in the Color Bible renders as intended regardless of which Physical Location or Environmental Dialect it appears under.

**Tone Mapping** — the single most identity-defining rendering decision HEBRA makes; converts the scene's full dynamic range into displayable values using a filmic response curve rather than simple clamping, preserving highlight and shadow detail consistent with the Lighting Bible's Darkness philosophy (Lighting Bible §3) — crushed blacks or blown highlights are a rendering failure, not an artistic choice, unless a specific narrative beat explicitly calls for it (cross-reference Camera Bible §14's logged single exception pattern).

**HDR, Exposure, ACES** — HEBRA's rendering targets an ACES-informed filmic response; exposure is treated as a scene-authored value tied to each environment's Lighting Bible §8 dialect, never a flat global default.

**Gamma** — display output correctly accounts for the difference between linear working space and display gamma; this is treated as foundational infrastructure, not a creative decision, and is therefore never varied per-scene.

**Environment Lighting** — image-based lighting (cross-reference Lighting Bible §5's Sky source) is generated once per environment and reused (PMREM, cross-reference Lighting Bible §10's Reflection philosophy) rather than computed per-frame.

**Post Processing: Bloom, Vignette, Grain, SSR, SSAO, Ambient Occlusion** — each pass is present only where it serves a specific Lighting Bible or Camera Bible purpose (cross-reference Appendix F's "every pass must justify itself"); this document's specific contribution is ensuring these passes are applied in the correct order and color space relative to tone mapping, so that, for example, bloom is computed on pre-tone-mapped HDR values, never on the already-compressed final image.

**Depth, Transparency** — depth-based effects (fog per Lighting Bible §6, DoF per Camera Bible §11) and transparent materials (Material Bible §6's subsurface/refraction families) are rendered with correct depth-sorting and depth-of-field interaction, since HEBRA's material vocabulary leans heavily on translucency (Living Glass, Unknown Crystal, Transparent Minerals).

**Temporal Stability** — motion (camera per Camera Bible §8, world objects per Animation Bible, particles per FX Bible) must render without flicker, shimmer, or crawling edges across frames — a rendering pipeline that looks correct in a still frame but unstable in motion has failed, since HEBRA is judged in motion far more than in stills (cross-reference Camera Bible §18's Final Test, "watch it in isolation").

====================================================

## 3. DESKTOP STRATEGY, MOBILE STRATEGY, FUTURE WEBGPU STRATEGY

**Desktop Strategy** — the fullest expression of every item in §2: full post-processing stack (up to Appendix F's six-pass ceiling), highest sample counts for SSR/SSAO/DoF, PMREM environment maps at full resolution.

**Mobile Strategy** — reduces sample counts and simplifies or omits the most expensive individual passes (SSR is typically the first candidate) before touching color management or tone mapping, per §1's Hierarchy rule — a mobile frame is cheaper, never a differently-toned frame.

**Future WebGPU Strategy** — this document's intent (§1, §2) is written to outlive the specific rendering API. When a WebGPU migration is authorized, its job is to reproduce this document's color science and pipeline ordering more efficiently, never to change what the rendered image is supposed to look like. Logged here per the Camera Bible's Future Expansion pattern (Camera Bible §26) — a platform change is a technical migration, not a creative amendment, unless explicitly declared otherwise through this document's own future revision process.

====================================================

## 4. PERFORMANCE

Bound by Appendix F and the Performance & Optimization Bible without exception.

**GPU Budget** — post-processing (§2) is one of the largest single GPU line items in the entire application; each active pass is justified individually per Appendix F, and the full stack is reviewed against the Performance Bible's per-frame reconciliation (Performance Bible §2) rather than budgeted in isolation from Lighting and FX's own GPU costs.

**Frame Budget** — tone mapping and color management (§2) are computed once per frame at fixed, non-negotiable cost; this cost is treated as fixed overhead the rest of the frame budget is planned around, never as a variable to be optimized away.

**Memory Budget** — environment maps, LUTs (if used for stylized color grading), and G-buffer targets are budgeted against Appendix F's VRAM ceilings alongside Material Bible §10's texture budget, coordinated through the Performance Bible's shared-frame reconciliation.

**Shader Budget** — every custom rendering-pipeline shader (tone mapping, custom post-processing) is held to Appendix F's shader-budget philosophy ("shaders solve problems") exactly as the Lighting, Material, and FX Bibles' shaders are.

====================================================

## 5. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Three.js, WebGPU** — studied for implementation technique and API capability, informing §3's platform strategy, per Appendix D and Appendix E — never for a ready-made rendering pipeline shipped unchanged.

**Filmic Rendering, Physically Based Rendering** — studied for the color science and tone-mapping theory underlying §2, cross-referenced against Material Bible §11's PBR research note and Lighting Bible §15's technical-ownership discipline.

**Official documentation** — studied for the same reasons, never for demo-scene rendering setups.

Extract principles. Never imitate.

====================================================

## 6. RENDERING OATH

I am honest. I show what the Lighting and Material Bibles have already decided — I do not add my own opinion on top of theirs.

I am consistent. The same scene rendered twice looks the same; two different scenes rendered by me still feel like one world.

I never crush a shadow or blow a highlight without the story specifically asking me to.

I am stable in motion. I do not flicker, shimmer, or crawl — HEBRA is judged moving, and I am built for that judgment.

I hold my performance budget without changing my color science — a cheaper version of me still tells the truth about what I'm looking at.

I will outlive my own rendering API. My intent is portable even when my implementation is not.

Every future hand that touches HEBRA's rendering pipeline inherits this oath before it inherits any shader.

====================================================

## 7. RENDERING CHECKLIST

- [ ] Is this rendering decision honest to the Lighting Bible's authored intensity and color temperature per §1?
- [ ] Does it follow the pipeline order in §2 — linear, post-processing, tone-mapped, output-transformed — without reordering?
- [ ] Does every post-processing pass justify itself per Appendix F, and is it applied in the correct color space relative to tone mapping?
- [ ] Is it temporally stable, checked in motion per §2, not only as a still frame?
- [ ] Does it reduce cost before it changes color science, per §3's Desktop/Mobile Hierarchy?
- [ ] Does it hold Appendix F's and the Performance Bible's GPU, frame, memory, and shader budgets per §4?

====================================================

## 8. PRODUCTION APPROVAL CHECKLIST

- [ ] Research principle extracted and logged per §5, never a copied pipeline.
- [ ] Performance reviewed against Appendix F and the Performance Bible on both desktop and mobile targets.
- [ ] Final Test (Appendix E): with all reference material hidden, does a rendered frame still feel unmistakably HEBRA's?

If every box is checked, rendering work may proceed to Creative, Technical, and Performance Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the render settings panel.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
