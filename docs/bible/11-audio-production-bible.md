# HEBRA MASTER PRODUCTION BIBLE

## THE AUDIO PRODUCTION BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Sound is invisible architecture. Sound is emotion. Sound is space. Silence is equally important.

A visitor closes their eyes and HEBRA should still exist — still have depth, still have distance, still have a place they are standing in. This document defines the complete sonic identity that makes that true.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is read together with the Camera Bible (whose transitions, §24, and states, §6, this document's audio must track) and the Lighting/FX Bibles (whose energy and environmental language this document's sound design must match, never contradict).

====================================================

## 1. AUDIO PHILOSOPHY, IDENTITY, HIERARCHY, NARRATIVE, EMOTION

**Audio Philosophy.** Sound in HEBRA is never added after the fact to "support" a visual. It is authored as a co-equal narrator alongside the camera (cross-reference Camera Bible §3) — a visitor who could not see at all should still be able to follow HEBRA's emotional arc through sound alone.

**Audio Identity.** Every environment and every object category has a consistent sonic signature, matching the discipline the Lighting Bible applies to Light Identity (Lighting Bible §2) and the Material Bible applies to material families (Material Bible §3).

**Audio Hierarchy.** Not every sound carries equal weight. Hero sounds (tied to Landmarks, Origin moments, chapter transitions) receive full authored, non-looping composition. Ambient layers (§4) are procedural and generative, mirroring the FX Bible's hierarchy principle (FX Bible §1).

**Audio Narrative.** Every sound traces to a Camera Bible state or Story Registry beat — sound never exists in a vacuum independent of what the visitor is currently experiencing.

**Audio Emotion.** Every sound design decision is checked against the Camera Bible's dialect table (Camera Bible §4) before it is checked against how it sounds in isolation.

====================================================

## 2. COVERAGE

**Ambient Layers** — the baseline sonic bed for every location, cross-referenced against §4's Ambient Philosophy below.

**Spatial Audio** — HEBRA's sound is positioned in 3D and tied to the camera's listener pose (conceptually — implementation deferred), never a flat stereo bed regardless of camera position.

**Environmental Audio** — cross-referenced directly against §5's per-environment sonic identity table.

**Artifact Audio** — small, intimate, often the only close-proximity sound source in a quiet scene, mirroring the Lighting Bible's Symbols-as-spotlight principle (Lighting Bible §5).

**Architecture Audio** — the sound structures make simply by existing — resonance, faint tonal presence — cross-referenced against Material Bible §4's Physical Behaviour field per material family.

**Energy Audio** — the sonic expression of Lighting Bible §2's Energy Light and FX Bible §6's Energy Philosophy — fluid, organic, never electronic (cross-reference §9's forbidden list).

**Portal Audio** — paired directly with Camera Bible §8's Portal Entry/Exit — a distinct, non-reused sonic treatment for threshold crossings.

**Memory Audio** — desaturated, softer, tied to Memory Spaces (World Blueprint §4) and Memory Light (Lighting Bible §2), matching those systems' visual restraint with sonic restraint.

**Origin Audio** — reserved exclusively for the Origin chapter and Origin Core, the most saturated and intentional sound design in the entire experience, mirroring Lighting Bible §2's Origin Light exclusivity.

**Silence** — a first-class category, not an absence of design; fully defined in §7.

====================================================

## 3. EVERY SOUND MUST DEFINE

- **Purpose** — why this sound exists.
- **Narrative Meaning** — what story or emotional beat it serves, cross-referenced against Camera Bible §4.
- **Trigger** — ambient, proximity, story-progress, or transition-paired.
- **Distance** — its audible falloff behavior, tied to Spatial Audio (§2).
- **Volume Behavior** — its authored dynamic range, never a single fixed level.
- **Spatial Behavior** — how it moves or stays fixed relative to the listener.
- **Evolution** — how it changes over the course of a visit, mirroring Lighting Bible §9's Time section.
- **Fade Logic** — how it enters and exits — never a hard cut, mirroring the Camera Bible's easing requirement (Camera Bible §9).
- **Performance Cost** — measured against Appendix F and this document's §10 budget, logged per sound, not assumed.

A sound missing any of these nine fields is not yet documented and may not be treated as production-ready.

====================================================

## 4. AMBIENT PHILOSOPHY

**Nothing is silent. Nothing is noisy.** Every location sits deliberately between these two poles — full silence reads as a technical gap, full noise reads as unauthored chaos; HEBRA's baseline is always a considered, moderate presence.

**Every environment breathes.** The audio equivalent of the Lighting Bible's Breathing concept (Lighting Bible §9) and the Camera Bible's Breathing (Camera Bible §9) — ambient layers carry slow, incommensurate-period variation so they never loop predictably.

**Every location has its own invisible atmosphere.** Cross-referenced against §5's per-environment table — no two locations share an identical ambient bed, even where their visual registers are similar.

====================================================

## 5. ENVIRONMENTAL AUDIO DIALECTS

*Terminology note: these are Level 3 Environmental Dialects per the Canonical Naming Architecture (docs/bible/26) — reusable sonic registers, never locations. See that document §3 for which Level 2 Physical Location uses which Dialect.*

Each Dialect (cross-reference Lighting Bible §8, Material Bible §8, FX Bible §7) owns a sonic register:

- **The Reverent Dialect** *(formerly "Temple")* — the most resonant, spacious ambient bed in the world, matching its dramatic Light Shafts (Lighting Bible §6); Origin- and Energy-adjacent tonal presence.
- **The Active Dialect** *(formerly "Workshop")* — the busiest, most texturally active register, matching its active Heat Distortion and Energy FX (FX Bible §7).
- **The Hushed Dialect** *(formerly "Archive")* — the quietest interior register in HEBRA, matching its underlit Lighting Bible §8 register and restrained Material Bible §8 palette.
- **The Attentive Dialect** *(formerly "Library")* — soft, close, intimate ambient presence, rewarding proximity the way its lighting rewards close attention (Lighting Bible §8).
- **The Vast Dialect** *(formerly "Observatory")* — the most Natural-Light-dominant register sonically as well as visually — wind-and-distance-coded ambience, minimal artificial or energy tonal presence.
- **The Genesis Dialect** *(formerly "Origin Core" as an environment name)* — reserved for Origin Audio (§2) exclusively — the most saturated, least ambient-bed-reliant register, because at The Origin Core composed sound design takes over from generative ambience.
- **The Generative Dialect** *(formerly "Creation Chamber")* — the most Energy-Audio-active register, matching its Material Bible §8 Living Glass/Energy Crystal dominance.
- **The Recollective Dialect** *(formerly "Memory Hall")* — Memory Audio almost exclusively, the most restrained sonic palette in HEBRA, matching its restrained lighting and material Dialects.

Each Dialect must have its own sonic identity while remaining part of one civilization — achieved by keeping the underlying Ambient Philosophy (§4) and spatial system (§2) constant everywhere; only mix and tonal center change Dialect to Dialect. A single Physical Location may draw on more than one Dialect where its World Blueprint entry calls for it.

====================================================

## 6. MUSIC PHILOSOPHY

**Music should emerge. Never dominate. Never manipulate. Never become wallpaper.**

Music in HEBRA is generative and reactive (§8, Procedural Audio) rather than a fixed, pre-composed score playing on a timeline independent of the visitor's pace — it grows out of the ambient and energy layers already present rather than being a separate, imposed layer.

**Emotion grows naturally.** Musical intensity tracks the Camera Bible's state machine (Camera Bible §6) and dialect table (Camera Bible §4) — a musical swell is a response to the story reaching a beat, never a manipulation designed to produce a feeling the visuals haven't earned.

====================================================

## 7. SILENCE

Silence must be intentional — never a bug, always a decision, mirroring the Lighting Bible's treatment of darkness (Lighting Bible §3).

- **Rest** — paired with the Camera Bible's Resting state (Camera Bible §6) — the sonic equivalent of the Final Scene's visual recession.
- **Expectation** — a held quiet ahead of a reveal, paired with Camera Bible §3's Withholding.
- **Suspense** — a brief, tension-building quiet immediately preceding a significant beat.
- **Isolation** — the dominant silence register for Void, matching its cold, sparse visual and lighting treatment.
- **Wonder** — a softer, less tense quiet used at Monument-dialect beats (Camera Bible §4), where awe is better served by restraint than by swelling music.
- **Scale** — silence used specifically to let a space's reverberant properties (§2, Architecture Audio) communicate its size without competing musical content.

====================================================

## 8. INTERACTIVE AUDIO

Sound reacts to:

**Presence** — cross-referenced against the Camera Bible's presence-response philosophy (Camera Bible §12, §22) — capped, subtle, never functional feedback.

**Movement** — the camera's current state (Camera Bible §6) directly informs mix balance — Traveling state favors ambient/spatial layers; Observing state allows hero/composed sound to take precedence.

**Distance** — governed by §3's Distance field per sound, using standard spatial falloff logic conceptually, detailed technically only once implementation is authorized.

**Story Progress** — sounds unlock or evolve in step with the Story Registry, never appearing "ahead of" their narrative moment, mirroring the Animation Bible's Story Progress reaction (Animation Bible §6).

**Environment** — the active §5 dialect governs which layers are present at all.

**Artifacts / Energy / Architecture** — each object category's audio (§2) responds to proximity and, where applicable, to Lighting Bible §9's Pulse behavior for Energy sources specifically.

====================================================

## 9. PROCEDURAL AUDIO

**Generative Layers** — ambient beds (§4) are built from generative, parameterized systems rather than fixed loops, so no two visits or no two passes through the same location sound identical.

**Dynamic Mixing** — the overall mix rebalances continuously based on Camera Bible state (§8 above) and Story Registry progress, never a single static mix applied uniformly.

**Adaptive Ambience** — environmental beds (§5) shift smoothly across Environment and World Transitions (Camera Bible §8), matching those transitions' visual crossfade treatment rather than cutting abruptly.

**Spatial Positioning** — every sound source carries a positional identity tied to its World Blueprint location, cross-referenced against §2's Spatial Audio.

**World Evolution** — sound is permitted to evolve across a full visit the way Material Bible §7 permits material evolution — slow, subtle, tied to real story progress rather than elapsed real time alone.

**Never rely on static looping.** The standing rule underlying every item above — any audio system that would sound identical on a visitor's second listen within the same session has failed this section.

====================================================

## 10. FORBIDDEN AUDIO

Per Appendix D's standing authority:

- **Stock sounds** — no unmodified sound-library asset ships in HEBRA (cross-reference Appendix D's Stock Assets section).
- **Hollywood clichés** — cross-reference Appendix D's "overused cinematic booms" and "trailer impacts."
- **Random impacts** — every impact-style sound traces to a Trigger per §3.
- **Meaningless drones** — an ambient layer with no traced Purpose (§3) is forbidden.
- **Cheap whooshes** — cross-reference Appendix D verbatim.
- **Overused risers** — the audio equivalent of Appendix D's forbidden "unmotivated camera shake" — tension-building audio must be earned by the beat it precedes, never applied reflexively.
- **Artificial reverb** — reverb that doesn't match the space it's supposedly occurring in (cross-reference §2's Architecture Audio and §5's per-environment resonance) is forbidden; reverb must be spatially honest.

====================================================

## 11. PERFORMANCE

Bound by Appendix F without exception.

**CPU Budget** — procedural/generative audio (§9) is the primary cost center; budgeted to stay well within Appendix F's general CPU discipline, since audio competes with rendering and camera systems for the same frame budget.

**Memory Budget** — sample libraries and generative synthesis assets are budgeted against Appendix F's bundle-size and memory targets, with heavy audio systems lazy-loaded per Appendix F's code-splitting philosophy.

**Streaming** — long-form ambient and music layers stream rather than fully preload, matching Appendix F's atmosphere-first, detail-later loading priority.

**Compression** — audio assets are compressed appropriately for web delivery without audibly degrading the spatial and tonal qualities §2 through §9 depend on.

**Spatial Voice Limits** — the number of simultaneous spatialized sound sources is capped per Appendix F's general performance discipline, allocated first to Hierarchy-critical sounds (§1) exactly as the FX Bible caps particle counts (FX Bible §10).

**Desktop / Mobile** — mobile targets reduce simultaneous voice count and generative layer complexity first, never removing a location's core sonic identity (§5) entirely.

====================================================

## 12. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Film Sound Design** — study how sound design communicates space, weight, and emotion without relying on literal diegetic realism, informing §1's co-equal-narrator principle.

**AAA Game Audio** — study adaptive, state-driven mixing systems (music and ambience that respond to player state) for direct technique parallels to §8's Interactive Audio.

**Procedural Audio, Tone.js, Web Audio API, Spatial Audio** — studied for implementation technique only, per Appendix D and Appendix E, and consistent with Tone.js already being locked in the stack for exactly this purpose.

**Official documentation** — studied for the same reason, never for ready-made sound-design templates.

Extract principles. Never imitate.

====================================================

## 13. AUDIO OATH

I am invisible architecture. I give HEBRA depth even when nothing is on screen to look at.

I never loop the same way twice. I am generated, not merely played back.

My silence is a decision, never a gap. When I say nothing, I am saying something.

I know what space I'm in, and my resonance tells the truth about that space's size and material.

I never manipulate. My swells are earned by the story, not imposed on it.

I hold my performance budget without losing my depth — a cheaper version of me is thinner, never silent where I should be heard.

I am never stock, never a cliché, never a whoosh borrowed from somewhere else. Every future hand that composes a sound for HEBRA inherits this oath before it inherits any DAW session.

====================================================

## 14. AUDIO REVIEW CHECKLIST

- [ ] Does this sound answer all nine fields in §3?
- [ ] Does its ambient bed, if any, follow §4's "neither silent nor noisy" rule?
- [ ] Does it match its environment's sonic dialect in §5?
- [ ] If it's music, does it emerge per §6 rather than impose?
- [ ] If it's silence, is it one of the six intentional registers in §7?
- [ ] Does it react only to the inputs listed in §8, with no unexplained trigger?
- [ ] Does it stay procedurally generative per §9 rather than relying on a static loop?
- [ ] Has it been checked individually against every bullet in §10?
- [ ] Does it hold Appendix F's CPU, memory, and voice-count budgets per §11?

====================================================

## 15. PRODUCTION APPROVAL CHECKLIST

- [ ] Purpose and Narrative Meaning are written down before the sound is finalized.
- [ ] Research principle extracted and logged per §12, never a copied reference.
- [ ] Performance reviewed against Appendix F on both desktop and mobile targets.
- [ ] Final Test (Appendix E): with all reference material hidden, does this sound still feel unmistakably HEBRA's?

If every box is checked, audio work may proceed to Creative, Engineering, Performance, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the audio engine.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
