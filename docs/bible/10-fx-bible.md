# HEBRA MASTER PRODUCTION BIBLE

## THE FX BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Effects are not decoration. Effects are physical language.

Every particle, every wisp of fog, every shimmer of heat distortion in HEBRA is a sentence in a vocabulary the world speaks instead of speaking English. This document defines that vocabulary — what every visual phenomenon in the civilization is allowed to say, and what it is never allowed to say.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is read together with the Lighting Bible (Volumetric Philosophy, Lighting Bible §6, which this document extends into full effect behavior) and the Animation Bible (which owns object-level motion; this document owns particle- and phenomenon-level motion).

====================================================

## 1. FX PHILOSOPHY, IDENTITY, HIERARCHY, LIFECYCLE, STORYTELLING

**FX Philosophy.** An effect exists to make something invisible — energy, air, memory, atmosphere — visible enough to be felt. An effect that exists only to look impressive, with nothing invisible being revealed, has no philosophy and does not belong in HEBRA.

**FX Identity.** Every effect category (§2) has a consistent visual signature across the world — Energy always looks like Energy, Fog always behaves like Fog, regardless of which environment it appears in — matching the Lighting Bible's Light Identity discipline (Lighting Bible §2) applied to effects.

**FX Hierarchy.** Hero effects (tied to Landmarks and major story beats) receive full authored control; ambient effects (background dust, atmospheric haze) are procedural and parameterized, mirroring the Animation Bible's hierarchy principle (Animation Bible §1).

**FX Lifecycle.** Every effect has an authored birth, life, and death — cross-reference §5's Particle Philosophy — nothing simply appears at full intensity and disappears at zero; every effect eases in the way the camera eases (Camera Bible §9).

**FX Storytelling.** Every effect traces to a narrative or physical cause. An effect with no traceable cause is noise, regardless of its technical quality (cross-reference Appendix D's Visual Clichés section).

====================================================

## 2. COVERAGE

**Particles** — the base unit of most effects in this document; governed fully by §5's Particle Philosophy.

**Fog / Mist / Dust** — cross-referenced directly against Lighting Bible §6; this document owns their *behavioral* triggers and lifecycle, the Lighting Bible owns how they interact with light.

**Volumetric Light** — cross-referenced against Lighting Bible §6's Light Shafts; this document owns the FX-side authoring of shaft density and animation.

**Energy** — cross-referenced against §6's Energy Philosophy below and Lighting Bible §2's Energy Light identity.

**Atmospheric Waves** — large-scale, slow, barely-perceptible distortion used to communicate a space's scale or a story beat's emotional pressure, never a decorative screen-space wobble.

**Gravity Distortion** — rationed as tightly as the World Blueprint's Impossible Geometry (World Blueprint §3) — reserved for singular, high-impact narrative moments.

**Refraction** — cross-referenced against Material Bible §6; owns the effect-layer expression of Unknown Crystal and Transparent Minerals' optical behavior.

**Heat Distortion** — reserved for Energy- and Origin-adjacent environments where temperature is narratively implied, never applied generically for "atmosphere."

**Crystal Emission** — the effect-side expression of Energy Crystal's internal light (Material Bible §3, Lighting Bible §5).

**Light Rays** — the effect-authoring layer for Lighting Bible §6's Light Shafts, specifically their particle interaction (dust catching light) rather than the shaft's own volumetric rendering.

**Memory Fragments** — small, rare, narratively triggered particulate effects tied specifically to Memory Spaces (World Blueprint §4) and Memory Light (Lighting Bible §2).

**World Transitions / Portal Effects** — the FX-layer companion to the Camera Bible's World Transition and Portal Entry/Exit moves (Camera Bible §8) — the visual "texture" of a threshold crossing.

**Environmental Effects** — the general category for a location's baseline atmospheric signature, cross-referenced against World Blueprint §5's required Sound/Lighting/Material fields — every location also implicitly requires an FX signature, logged here as a standing dependency.

====================================================

## 3. EVERY EFFECT MUST DEFINE

- **Purpose** — what invisible thing this effect is making visible, per §1.
- **Narrative Meaning** — what story or emotional beat it serves.
- **Trigger** — ambient, proximity, story-progress, or camera-transition-paired — no untriggered effects.
- **Intensity** — its authored range, never a single fixed value, so it can breathe (cross-reference Lighting Bible §9).
- **Lifetime** — per §5's Particle Philosophy, every effect's individual elements have an authored beginning and end.
- **Scale** — from Micro (Material Bible §5-adjacent) to World-scale (Cosmic, per World Blueprint §6).
- **Behavior** — its motion logic: does it flow, drift, pulse, or hold.
- **Interaction** — what it does when it meets geometry, light, or another effect.
- **Performance Cost** — measured against Appendix F's particle and shader budgets, logged per effect, not assumed.

An effect missing any of these nine fields is not yet documented and may not be treated as production-ready.

====================================================

## 4. PARTICLE PHILOSOPHY

Particles never exist randomly.

**Every particle has origin.** A traceable Light Source-equivalent (cross-reference Lighting Bible §5) — dust rising from a disturbed surface, energy emitted from a Crystal, memory fragments drifting from a Memory Well (World Blueprint §3).

**Every particle has destination.** Even ambient, slow-drifting particles are authored with an implied direction and eventual fate (settling, dissipating, being drawn toward an Energy River) — never a particle system that simply exists in a bounded volume with no directionality.

**Every particle belongs to the world.** No particle system is generic "atmosphere" applied uniformly everywhere — each environment's particle behavior is cross-referenced against its World Blueprint §5 Purpose and its Lighting Bible §8 dialect.

====================================================

## 5. FOG PHILOSOPHY

**Fog hides.** Consistent with the Camera Bible's Withholding principle (Camera Bible §3) and the World Blueprint's environmental storytelling (World Blueprint §8) — fog is one of the primary tools for controlling what the visitor is allowed to see and when.

**Fog reveals.** The inverse: fog thinning is itself a reveal mechanism, paired with Camera Bible §8's Reveal move — a landmark emerging from fog is preferred, where narratively appropriate, over a landmark simply coming into camera range.

**Fog guides.** Density gradients can imply a path forward, cooperating with Lighting Bible §12's navigation-through-light principle.

**Fog creates scale.** Cross-referenced directly against Lighting Bible §11's Atmospheric Perspective — fog density at distance is one of the primary tools for making vast spaces read as vast.

**Fog creates mystery.** The emotional expression of "hides," specifically tied to Void and other high-mystery chapters (cross-reference Camera Bible §4).

**Fog never exists only because it looks beautiful.** Every fog instance traces to one of the five purposes above — decorative fog with no functional role is forbidden (cross-reference §9).

====================================================

## 6. ENERGY PHILOSOPHY

**Energy is intelligent.** It never moves randomly — every Energy effect has an implied purpose and awareness, cross-referenced against Lighting Bible §2's Energy Light identity.

**Energy stores memory.** Where Energy interacts with Memory Spaces or Memory Stone (Material Bible §3), its behavior slows and softens, mirroring Memory Light's desaturated treatment (Lighting Bible §2).

**Energy reacts to presence.** Cross-referenced against the Animation Bible's World Reactions (Animation Bible §6) — Energy is one of the most presence-responsive effect categories in the world, though always capped per the Camera Bible's presence-response philosophy (Camera Bible §12, §22).

**Energy travels with purpose.** Along authored paths (Energy Rivers, per World Blueprint §3) rather than free-floating — Energy's motion is choreographed, not simulated without direction.

**Energy is never electricity.** No arcing, sparking, or crackling electrical visual language — Energy's visual grammar is fluid and organic, never mechanical or electronic (cross-reference Appendix D's forbidden "RGB gaming effects" and "neon cyberpunk aesthetics").

====================================================

## 7. ENVIRONMENTAL FX DIALECTS

*Terminology note: these are Level 3 Environmental Dialects per the Canonical Naming Architecture (docs/bible/26) — reusable atmospheric registers, never locations. See that document §3 for which Level 2 Physical Location uses which Dialect.*

Each Dialect (cross-reference Lighting Bible §8 and World Blueprint) owns a unique atmospheric behavior:

- **The Reverent Dialect** *(formerly "Temple")* — Volumetric Light and Light Rays dominant, minimal particulate, the most compositionally deliberate FX register in the world.
- **The Active Dialect** *(formerly "Workshop")* — Energy and Heat Distortion, the most "active" and busy effect register, reflecting ongoing labor.
- **The Hushed Dialect** *(formerly "Archive")* — Memory Fragments and fine Dust, the quietest FX register, matching its underlit Lighting Bible §8 register.
- **The Attentive Dialect** *(formerly "Library")* — fine Dust catching Light Rays, minimal Energy presence.
- **The Vast Dialect** *(formerly "Observatory")* — near-absence of particulate FX, letting Lighting Bible §8's sky-dominant illumination remain uncompeted-with.
- **The Genesis Dialect** *(formerly "Origin Core" as an environment name)* — the most saturated Energy and Crystal Emission presence in the world, matching its Lighting Bible §2 Origin Light exclusivity.
- **The Generative Dialect** *(formerly "Creation Chamber")* — the most volumetrically and energetically active Dialect, cross-referenced against Material Bible §8's Living Glass/Energy Crystal dominance here.
- **The Recollective Dialect** *(formerly "Memory Hall")* — Memory Fragments almost exclusively, the most restrained FX palette in HEBRA.

====================================================

## 8. TRANSITION FX

Paired directly with the Camera Bible's transition vocabulary (Camera Bible §8, §24):

**Portal** — Portal Effects (§2) intensify through the transition's duration, peaking at the threshold's midpoint, matching the Camera Bible's suppressed-presence, fully-authored treatment of Portal Entry/Exit.

**Memory** — Memory Fragments increase in density and slow in motion during any transition into a Memory Space.

**Light / Darkness** — FX-layer companion to Lighting Bible §9's Expansion/Relaxation arcs — particulate density and Light Ray visibility shift in step with a lighting transition rather than independently of it.

**Architecture** — dust and debris-equivalent particulate accompanies any transition that implies physical passage through or near structure, reinforcing the World Blueprint's Transition Space design (World Blueprint §4).

**Discovery** — a distinct, one-time "first noticed" FX beat accompanies Hidden Discovery System reveals (World Blueprint §9), paired with the Animation Bible's Discovery transition animation (Animation Bible §7).

**Awakening** — the FX-layer companion to the camera's Dormant→Awakening state (Camera Bible §6) and Lighting Bible's Awakening arc (Lighting Bible §9) — the visitor's first perceptible atmospheric detail, authored with equal care.

====================================================

## 9. FORBIDDEN FX

Per Appendix D's standing authority:

- **Explosion spam** — no effect exists purely for impact or spectacle with no narrative trigger (§3).
- **Random particles** — every particle system traces to §4's origin/destination/belonging requirements.
- **Cheap glow** — cross-referenced directly against Lighting Bible §16's forbidden "random glow."
- **Fake magic** — effects that read as generic fantasy sparkle with no connection to HEBRA's specific visual language (Appendix D's "never imitate" list) are forbidden.
- **RGB effects** — cross-referenced against §6's "Energy is never electricity" rule.
- **Noise without purpose** — cross-referenced against Appendix F's shader budget philosophy ("shaders solve problems").
- **Bloom abuse** — cross-referenced directly against Lighting Bible §16.

====================================================

## 10. PERFORMANCE

Bound by Appendix F without exception.

**GPU Budget** — particle rendering (GPU-instanced wherever possible) is the primary cost center this document introduces; allocated first to hero, story-critical effects per §1's FX Hierarchy.

**Particle Budget** — follows Appendix F's tiered ceilings (Desktop Ultra 150k down to Mobile Essential 15k) directly; ambient/environmental particle counts (§7) are the first reduced under a lower tier, never hero/story-critical particle systems (§3).

**Simulation Budget** — CPU-side particle logic (trigger evaluation, lifecycle management) stays lightweight by keeping most per-particle motion GPU-driven, consistent with the Animation Bible's CPU/GPU cost-discipline (Animation Bible §9).

**LOD** — distant particle systems reduce count and simulation fidelity while preserving their overall silhouette and density read, mirroring the World Blueprint's Landmark LOD philosophy (World Blueprint §10).

**Adaptive Quality — Desktop / Mobile** — Appendix F's Tier A/B/C reductions apply first to particle count and shader iteration count (§9's shader-budget cross-reference), never to whether an effect exists at all — a Tier C Energy River is thinner, not absent.

====================================================

## 11. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Film VFX** — study how practical-feeling visual effects communicate physical presence (weight, air displacement, light interaction) even when created digitally, informing §1's core "make the invisible visible" principle.

**AAA Games** — study real-time particle and volumetric systems for how large-scale effects (energy rivers, atmospheric weather) stay performant across an open, explorable space, directly informing §10.

**Three.js, GPU Particles, Volumetrics** — studied for implementation technique only, per Appendix D and Appendix E, never for ready-made effect presets.

**Official documentation** — studied for the same reason, never for demo-scene FX to be shipped unchanged.

Extract principles. Never imitate.

====================================================

## 12. FX OATH

I make the invisible visible. I do not exist for spectacle alone.

Every particle I contain has a beginning, a direction, and an end.

My fog hides and reveals with intent — it is never beautiful for its own sake.

My energy is alive and purposeful. It is never electricity, and it is never random.

I know which environment I belong to, and I never borrow another environment's atmosphere without reason.

I hold my performance budget without losing my presence — a cheaper version of me is thinner, never absent.

I am never explosion spam, never cheap glow, never fake magic. Every future hand that authors an effect for HEBRA inherits this oath before it inherits any particle system.

====================================================

## 13. FX REVIEW CHECKLIST

- [ ] Does this effect answer all nine fields in §3?
- [ ] Does every particle within it trace to an origin and destination per §4?
- [ ] If it's fog, does it serve one of the five purposes in §5, not decoration alone?
- [ ] If it's energy, does it follow §6's five rules, especially "never electricity"?
- [ ] Does it match its environment's atmospheric signature in §7?
- [ ] If it's a transition effect, does it match its paired Camera Bible move per §8?
- [ ] Has it been checked individually against every bullet in §9?
- [ ] Does it hold Appendix F's particle, GPU, and shader budgets per §10?

====================================================

## 14. PRODUCTION APPROVAL CHECKLIST

- [ ] Purpose and Narrative Meaning are written down before the effect is finalized visually.
- [ ] Research principle extracted and logged per §11, never a copied reference.
- [ ] Performance reviewed against Appendix F on both desktop and mobile targets.
- [ ] Final Test (Appendix E): with all reference material hidden, does this effect still feel unmistakably HEBRA's?

If every box is checked, FX work may proceed to Creative, Engineering, Performance, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the particle editor.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
