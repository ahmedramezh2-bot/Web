# HEBRA MASTER PRODUCTION BIBLE

## THE ANIMATION BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Animation is not decoration. Animation is life.

Everything in HEBRA that moves is making a claim: *I am alive, or I was once alive, or I remember being alive.* This document defines every movement in the civilization that is not the camera itself (owned by the Camera Bible) — the movement of the world the camera moves through.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is read together with the Camera Bible (whose Camera Language, §8, this document's object-level animation must never compete with for the visitor's attention) and the FX Bible (which owns particle-level motion; this document owns object- and world-level motion).

====================================================

## 1. ANIMATION PHILOSOPHY, IDENTITY, HIERARCHY, TIMING, EMOTION, RHYTHM

**Animation Philosophy.** Nothing in HEBRA holds a truly static pose. Stillness, where it exists, is authored stillness (cross-reference Camera Bible §6, Observing state) — a held frame with intent, never an object that simply lacks an animation system.

**Animation Identity.** Every animated object has a consistent motion signature across the whole experience — the same object should move recognizably the same way whether the visitor sees it in Void or in Threshold, even as its emotional context changes. This mirrors the Camera Bible's Identity-across-dialects principle (Camera Bible §2, §4) applied to world objects.

**Animation Hierarchy.** Hero objects (Landmarks, per the World Blueprint §3) receive the most authored, least procedural motion. Background and environmental objects rely more heavily on procedural, parameterized motion (§5) so that authorship time is spent where it matters most.

**Animation Timing.** No two consecutive world-object animation beats near the same viewpoint share identical duration or easing, mirroring the Camera Bible's rhythm-variance rule (Camera Bible §7) applied to the world rather than the camera.

**Animation Emotion.** Every animation traces to one of the target emotions in the Camera Bible's dialect table (Camera Bible §4) — an animation authored with no emotional target is an animation without a reason to exist.

**Animation Rhythm.** World motion breathes on its own clock, related to but never perfectly synchronized with the camera's breathing (Camera Bible §9, §23) — perfect synchronization between every moving system in a frame reads as mechanical, exactly as a metronomic camera would (Camera Bible §7).

====================================================

## 2. COVERAGE

Every category of object this Bible governs the motion of:

**Architecture** — structural breathing, extremely slow and extremely subtle, present even in the most "solid"-reading Landmarks, per §6's Living World principle.

**Artifacts** — small-scale, higher-frequency motion appropriate to their intimate scale (cross-reference World Blueprint §6).

**Energy** — the most continuously animated category in the world; cross-referenced directly against Lighting Bible §5 (Energy sources) and FX Bible §6 (Energy Philosophy) for its visual treatment, while this document owns its *behavioral* logic (where it travels, why, at what pace).

**Particles** — object-attached particle behavior is defined here at the level of intent and trigger; per-particle rendering technique is owned by the FX Bible §4 (Particle Philosophy).

**Light** — motion of light itself (as opposed to light's intensity/color evolution, owned by Lighting Bible §9) — e.g. a light source that visibly travels along a path.

**Symbols** — small-scale animated reveals (an engraving that appears to "activate") reserved for significant narrative beats, never ambient decoration.

**Doors** — never modern hinge-and-slide mechanisms; every threshold's opening behavior is authored to match its material and civilization identity (cross-reference Material Bible §4's Physical Behaviour field).

**Platforms** — Observation Platforms (World Blueprint §3) may carry subtle idle motion that reinforces their function as a place to stop, without ever destabilizing the Observing-state camera hold they support.

**World Objects** — the general category for anything not covered above; still requires every field in §4.

**Environment** — ambient environmental motion (foliage-equivalent effects, drifting matter) — the connective tissue that makes a scene read as alive even where no single hero object is animating.

====================================================

## 3. EVERY ANIMATION MUST DEFINE

- **Purpose** — why this object moves at all.
- **Meaning** — what the motion represents narratively.
- **Emotion** — cross-referenced against Camera Bible §4's dialect table.
- **Trigger** — ambient/idle, presence-proximity, story-progress, or narrative-scripted — no animation exists with an undefined trigger.
- **Duration** — including whether it loops, and if so, how (§7's forbidden infinite/perfect loop rule governs here).
- **Recovery** — how the object returns to its resting state after an animation completes, mirroring the Camera Bible's Settle concept (Camera Bible §23).
- **Loop Strategy** — per §7, no animation loops in a way that becomes predictable within a single Observing-state hold's typical duration.
- **Variation** — the specific mechanism (procedural offset, authored alternates) that keeps a repeated animation from reading identically each time it plays.

An animation missing any of these eight fields is not yet documented and may not be treated as production-ready.

====================================================

## 4. LIVING WORLD

**Nothing is perfectly still.** Every object in the world carries at least a Micro Movement-tier animation (§5), mirroring the Camera Bible's breathing principle (Camera Bible §9) at the world-object scale.

**Everything breathes.** The literal, slow scale/position oscillation defined in §5, applied consistently across every animated category in §2.

**Everything relaxes.** Objects that have been in a heightened animation state (activated, approached, triggered) settle back toward their baseline the way the camera settles after arrival (Camera Bible §23) — never an abrupt stop.

**Everything awakens.** Objects have their own Dormant→Active arc, mirroring the camera's own Dormant→Awakening state (Camera Bible §6), used specifically for objects the story wants to feel as though they are "noticing" the visitor for the first time.

**Everything responds.** Cross-referenced against §6's World Reactions — no object exists in a closed animation loop indifferent to the story or the visitor's presence.

====================================================

## 5. IDLE MOTION

**Micro Movement** — the smallest-amplitude, always-on layer, present on every object per §4.

**Breathing** — a slightly larger, slower oscillation reserved for hero and Landmark-scale objects, cross-referenced against the camera's own breathing (Camera Bible §9) without ever synchronizing to it exactly.

**Expansion / Contraction** — paired opposite states used specifically for Energy-category objects (§2) and Living Glass / Energy Crystal materials (Material Bible §7) — the animation-side expression of those materials' authored evolution.

**Tiny Corrections** — small, infrequent positional adjustments that read as the object "settling" rather than holding a mathematically fixed position — the object-level equivalent of the Camera Bible's Weight-shift (Camera Bible §23).

**Natural Imperfections** — deliberate asymmetry and non-repetition injected into idle motion so that two visually similar objects never move in perfect lockstep with each other.

====================================================

## 6. WORLD REACTIONS

The complete list of inputs a world object is permitted to react to:

**Visitor Presence** — proximity-based reaction, always capped and subtle, mirroring the Camera Bible's presence-response philosophy (Camera Bible §12, §22) — an object may acknowledge the visitor is near; it may never perform for them.

**Distance** — LOD-adjacent animation complexity: near objects may carry more authored detail in their idle motion than distant ones, cross-referenced against World Blueprint §10's performance tiers.

**Time** — some objects' idle motion evolves slowly across the span of a full visit, distinct from a single loop cycle.

**Story Progress** — objects tied to specific chapters may only begin their full animated behavior once the story has reached the relevant beat — an object animating "ahead of" its narrative moment is a sequencing error.

**Environment** — an object's animation register adapts to which World Blueprint location it's currently placed in, matching that location's Lighting Bible §8 and Material Bible §8 dialects.

**Light** — objects visibly react to major lighting state changes (Lighting Bible §9's Awakening/Rest arcs) rather than animating in isolation from the lighting around them.

**Energy** — Energy-category objects (§2) specifically react to nearby Energy Light sources (Lighting Bible §2), strengthening or synchronizing when near an active source.

====================================================

## 7. TRANSITION ANIMATION

World-object animation paired specifically with the Camera Bible's transition vocabulary (Camera Bible §8, §24):

**Portal** — objects immediately surrounding a Portal Entry/Exit animate in a way that visually participates in the threshold crossing, never remaining static while the camera alone does the work.

**Memory** — objects tied to Memory Spaces (World Blueprint §4) carry a distinct, softer transition animation register, matching Memory Light's desaturated treatment (Lighting Bible §2).

**Energy** — Energy Rivers and related objects (World Blueprint §3) animate through World and Environment Transitions as a continuous flow, never cutting or resetting at a boundary.

**Chapter** — a small number of hero objects per chapter are permitted a one-time, non-repeating transition animation tied specifically to the Chapter Transition boundary — logged and rationed the same way the Camera Bible rations its Spiral move (Camera Bible §8).

**Environment** — ambient object animation (§2, Environment category) shifts register across an Environment Transition, mirroring that transition's lighter-weight status relative to a full World Transition (Camera Bible §8).

**Discovery** — objects revealed through the Hidden Discovery System (World Blueprint §9) carry a distinct "first noticed" animation, played once, never repeating identically on subsequent encounters.

====================================================

## 8. FORBIDDEN ANIMATION

Per Appendix D's standing authority:

- **Infinite loops** with no variation (§5's Natural Imperfections) are forbidden — every loop must carry enough authored or procedural variance to avoid reading as mechanical within a typical Observing-state hold.
- **Perfect repetition** — two cycles of the same animation must never be pixel-identical in timing or amplitude.
- **Mechanical motion** — any animation that reads as robotic or indifferent to the object's material identity (Material Bible §4, Physical Behaviour) is forbidden.
- **Linear interpolation** as a default easing — mirrors the Camera Bible's ease-in/ease-out requirement (Camera Bible §9); a world object that snaps linearly between two states has failed this Bible.
- **Random movement** with no traced Trigger (§3) is forbidden — every motion answers to a reason, exactly as every Lighting Bible source must trace to an origin (Lighting Bible §5).
- **Animation without meaning** — the object-level restatement of this document's Preamble; any animation that cannot answer §3's Meaning field does not belong in the world.

====================================================

## 9. PERFORMANCE

Bound by Appendix F without exception.

**Animation Budget** — allocated first to Landmarks and hero Artifacts, consistent with §1's Animation Hierarchy; environmental and background objects rely on cheaper, more procedural motion.

**CPU Budget** — skeletal/bone-driven animation (where used at all) is reserved for the highest-hierarchy objects only; most of the Living World (§4) is achieved through shader- or vertex-level procedural motion rather than CPU-bound skinning, keeping cost predictable at scale.

**GPU Budget** — vertex and shader-driven idle motion (§5) is preferred over CPU-driven animation wherever both would produce the same visual result, per Appendix F's general cost-discipline.

**Instancing** — repeated environmental objects (World Blueprint §8's material palettes) share animation logic through instanced, parameterized offsets rather than unique per-instance animation tracks, preserving §5's Natural Imperfections through per-instance random seeds rather than per-instance authored tracks.

**Optimization** — animation complexity reduces under Appendix F's quality tiers by lowering update frequency and simplifying secondary motion layers first, never by removing an object's Living World baseline (§4) entirely, mirroring the Lighting Bible's "never remove, only render more cheaply" principle (Lighting Bible §14).

====================================================

## 10. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Film Animation** — study how weight, timing, and anticipation communicate life even in non-character animation (architectural motion, environmental animation in visual-effects-driven films).

**AAA Games** — study ambient world animation systems (idle object behavior, environmental storytelling through motion) for how large worlds stay visually alive without every object requiring bespoke authored animation.

**Motion Design** — study timing and easing curves as an independent discipline from character animation, informing §1's Animation Timing.

**Three.js, Theatre.js, GSAP** — studied for animation-system technique only, per Appendix D and Appendix E; Theatre.js remains reserved for camera choreography per the Camera Bible (Camera Bible §15) — its use here, if any, would be for hero-object sequences only, never ambient Living World motion, which belongs to lighter-weight procedural systems.

Extract principles. Never imitate.

====================================================

## 11. ANIMATION OATH

I am never perfectly still, and I am never still without reason.

I move the way my material and my history say I should move, never the way is easiest to implement.

I never repeat myself exactly. Two cycles of me are never identical.

I answer to a trigger. Nothing about my motion is random or unexplained.

I settle after I've moved, the way something with real weight settles.

I know what chapter I'm in, and I never animate ahead of the story that gives me permission to.

I hold my performance budget without losing my aliveness — a cheaper version of me is still recognizably alive.

Every future hand that animates a piece of HEBRA inherits this oath before it inherits any timeline.

====================================================

## 12. ANIMATION REVIEW CHECKLIST

- [ ] Does this animation answer all eight fields in §3?
- [ ] Does it carry Natural Imperfections (§5) so it never reads as a perfect loop?
- [ ] Does it match its object's Material Bible §4 Physical Behaviour rather than contradicting it?
- [ ] Does it respond only to inputs listed in §6, with no unexplained trigger?
- [ ] If it's a transition animation, does it match its paired Camera Bible move (§7)?
- [ ] Has it been checked individually against every bullet in §8?
- [ ] Does it hold Appendix F's animation, CPU, and GPU budgets per §9?

====================================================

## 13. PRODUCTION APPROVAL CHECKLIST

- [ ] Purpose and Meaning are written down before motion is finalized.
- [ ] Emotion target cross-checked against Camera Bible §4.
- [ ] Research principle extracted and logged per §10, never a copied reference.
- [ ] Performance reviewed against Appendix F on both desktop and mobile targets.
- [ ] Final Test (Appendix E): with all reference material hidden, does this motion still feel unmistakably HEBRA's?

If every box is checked, animation work may proceed to Creative, Engineering, Performance, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the timeline editor.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
