# HEBRA MASTER PRODUCTION BIBLE

## THE CAMERA BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

The camera is not a feature.

The camera is the visitor.

Everything the visitor knows about HEBRA, they know because the camera chose to show it to them, at a pace the camera chose, from a distance the camera chose.

There is no HEBRA the visitor perceives directly.

There is only HEBRA as the camera has decided to reveal it.

This document defines that decision-maker completely.

Nothing about camera behavior is left to improvisation once this Bible is approved.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. Where this document conflicts with any prior camera language in Parts 1–5 of the Master Production Bible, this document wins — it is the expansion of Part 4, not a rival to it.

====================================================

## 1. CAMERA PHILOSOPHY

The camera does not show the world.

The camera experiences the world, and the visitor experiences the camera.

Three commitments follow from this, and nothing about camera behavior may violate them:

**The camera is older than the visit.** It was already moving through HEBRA before the visitor arrived, at its own unhurried pace. The visitor does not start the camera. The visitor is folded into a motion already underway.

**The camera has a body.** It has weight, hesitation, momentum, and limits. It does not teleport because teleportation implies the camera has no mass. It does not snap to targets because snapping implies the camera has no inertia. Everything the camera does must be explainable by physics, even invented physics — never by convenience.

**The camera has taste.** It does not show everything. It withholds. It lingers on what deserves lingering and passes quickly over what does not. A camera with no editorial judgment is a security camera. HEBRA's camera is a director's camera.

Every camera decision, forever, is judged against these three commitments before it is judged against anything else in this document.

====================================================

## 2. CAMERA IDENTITY

The camera has a personality, and that personality is consistent across all six emotional chapters (Void, Monument, Fragments, Origin, Awakening, Threshold — per the Story Registry) even as its *mood* changes chapter to chapter.

**Who the camera is, always:**

- Curious, never intrusive.
- Patient, never idle.
- Confident, never showy.
- Respectful of scale — it never postures as larger than the monuments it visits.
- Silent by nature — its presence is felt in motion quality, never announced by UI, HUD, or crosshair.

**Who the camera is never:**

- A tourist. It does not gawk. It does not linger on things without reason.
- A drone. It does not hover with mechanical neutrality.
- A rollercoaster. It does not move visitors through a predetermined thrill sequence indifferent to their state.
- A cursor. Its motion must never read as a 1:1 mapping of pointer position — that collapses the camera into a UI control, which is the one thing it must never be (see §15, Forbidden Behavior).

The camera's identity is the same reason a director's films are recognizable across different stories: consistent temperament, different subject matter.

====================================================

## 3. CAMERA AS NARRATOR

The camera is HEBRA's only narrator. There is no voiceover. There is no persistent UI explaining what the visitor is looking at. The camera carries the entire narrative burden through:

**Framing as emphasis.** What fills the frame is what matters right now. The camera never centers something unimportant and never off-centers something important without a reason (a reveal held just outside center creates anticipation; a reveal centered creates arrival).

**Distance as intimacy.** Close proximity to an object is trust extended. The camera does not get close to something before the story has earned that closeness — proximity is a narrative reward, not a default.

**Hesitation as meaning.** A camera that slows near an object is telling the visitor "notice this." A camera that passes an object at travel speed is telling the visitor "this is texture, not subject." The visitor should be able to feel, without being told, which objects in the world are load-bearing to the story and which are atmosphere.

**Withholding as tension.** The camera's refusal to show something directly — approaching a monument from an angle that obscures its full form until the last moment — is how curiosity is manufactured mechanically, not just written into copy.

The test for every scripted camera move: if all on-screen text were deleted, would the visitor still understand what they are meant to feel about what they are looking at, purely from how the camera is behaving? If not, the camera has failed its narrating duty and copy is being used to patch a directing problem.

====================================================

## 4. EMOTIONAL STORYTELLING THROUGH CAMERA

Each chapter of the Story Registry owns a camera *dialect* — the same grammar (§8, Camera Language), spoken with different emphasis:

| Chapter | Emotion | Camera Dialect |
|---|---|---|
| Void | Curiosity | Long holds. Near-stillness. Movement so slow it is felt before it is seen. Wide lens, deep space, the visitor searching the frame rather than the frame presenting to them. |
| Monument | Wonder | Slow arcs and reveals. The camera circles rather than approaches — wonder is granted by orbit, not by rushing toward the object. |
| Fragments | Discovery | Shorter holds, more frequent reveals, push-ins that don't complete — the camera starts toward something and lets a new detail interrupt it, mimicking the visitor's own attention jumping between fragments. |
| Origin | Understanding | The only chapter permitted a full, committed push all the way to an object. Understanding is the chapter where the camera finally *arrives* somewhere, because everything before it was approach. |
| Awakening | Respect | Camera slows further than anywhere else in the journey. Respect is shown by the camera visibly *not* taking more than it's given — restrained framing, generous negative space around what's revealed. |
| Threshold | Hope | The camera begins, for the first time, to rise rather than travel forward — vertical motion reads as hope per §8's Rise language. This is the only chapter where "up" is the dominant axis. |

Mood is expressed entirely through **pace, distance, and axis dominance** — never through color grading tricks alone, never through cutting to a different "camera style." One camera, one identity (§2), six dialects.

====================================================

## 5. CAMERA HIERARCHY

Not every camera motion carries equal authority. When systems compete for the camera in the same frame, this order resolves the conflict, highest authority first:

1. **Theatre.js-authored chapter choreography** — the director's cut. Always wins.
2. **Skip/return acceleration** (Technical Addendum §4) — the visitor's declared intent to proceed overrides ambient pacing, but not the *path* itself, only its speed.
3. **Presence response** (mouse lean / touch tilt, §12–13) — additive only. Presence may nudge gaze and micro-framing. Presence may never redirect the travel path, change destination, or skip a beat.
4. **Breathing** (§9) — the involuntary layer. Runs underneath everything above it, always, and is never disabled except by Reduced Motion (§17).
5. **Safety/collision resolution** (camera-vs-geometry avoidance, using raycasts against the world's BVH) — silently corrects the *authored* path only when it would clip geometry; never overrides intent, only prevents the impossible.

A camera system that reaches for authority above its rank in this hierarchy is a bug, not a feature, regardless of how good it looks in isolation.

====================================================

## 6. CAMERA STATES

The camera exists, at all times, in exactly one of these states. State transitions are themselves directed (§8, Transitions) — the camera is never abruptly in a new state.

- **Dormant** — pre-Scene-0. The camera exists but has not yet been granted motion. (Black screen, silence, per the Prologue's 00:00 beat.)
- **Awakening** — the camera's first, barely perceptible motion. Exit condition: the visitor has been present long enough that stillness would start to read as broken, not intentional.
- **Traveling** — the primary state for most of the journey. Path-driven, scroll-paced, breathing active, presence-responsive.
- **Observing** — travel has paused at a chapter's hero beat. The camera holds, orbits gently, or performs a scripted micro-move (§8) around a single subject.
- **Transitioning** — a Portal Entry/Exit or Chapter Transition is in progress (§8). Presence response is suppressed during this state; the director has full authority.
- **Yielding** — the visitor has taken a clearly readable action (deliberate scroll-through, drag-and-hold, tap-and-hold) that the Skip/Return system reads as "let me through." The camera accelerates toward the next chapter boundary without fighting the visitor, per Technical Addendum §4.
- **Resting** — the Final Scene state. Travel has ended, the camera has receded, and only breathing remains.

No other states exist. Any new camera behavior must be describable as a transition between two states on this list, or the state list itself needs revision through this same document — it cannot be patched around silently in implementation.

====================================================

## 7. CAMERA RHYTHM

Rhythm is the relationship between motion and stillness over time — the camera's pulse, independent of any one movement's shape.

**The governing rule: no two consecutive camera beats share the same duration.** A camera that moves in a predictable rhythm becomes furniture; the visitor stops perceiving it as alive. Every hold, arc, and reveal in the Theatre.js choreography is authored with intentional durational variance — sequences of roughly equal-feeling but numerically distinct timings (e.g., a hold of 3.4s followed by one of 5.1s, never 3.4s twice).

**Rhythm mirrors breath, not metronome.** Real breathing is irregular in a bounded way — never perfectly periodic, never chaotic. Camera rhythm follows the same bounded irregularity: variance is real but never so extreme it reads as jitter or lag.

**Silence is a rhythm beat, not an absence of one.** A held, motionless frame is scored into the rhythm exactly like a movement is — it has a planned duration and a planned entry/exit, it is never simply "nothing happening while we wait for the next thing."

**Rhythm compresses under Skip/Return, it does not disappear.** In Yielding state, beats shorten, but the same irregular-duration principle still applies — a fast journey is still not a metronomic one.

====================================================

## 8. CAMERA LANGUAGE

The complete movement vocabulary. Every camera motion in HEBRA is composed from this list — nothing outside it, nothing that cannot be named by it.

**Floating** — near-zero net displacement; the camera's position wanders within a small volume without going anywhere. Used only in Dormant/Awakening and Observing states. Communicates: *the camera is alive even when the story isn't asking it to travel.*

**Hover** — a Floating variant locked to a fixed distance from one subject, y-axis dominant. Used when the camera is meant to feel suspended in reverence rather than wandering in curiosity. Reserved for Awakening-dialect beats.

**Drift** — slow, near-linear travel with no clear destination signaled to the visitor yet. The opening minutes of Void live almost entirely in Drift. Communicates: *searching, not yet found.*

**Orbit** — travel around a fixed subject at a roughly constant radius. Never a perfect circle (see §15 — perfect geometric orbit is forbidden); radius and height both drift slightly across the orbit's duration. Communicates: *I am considering this from every side before I decide what it means.*

**Reveal** — the camera's path or rotation uncovers a subject that was previously off-frame, occluded, or facing away. A Reveal is always preceded by at least one beat of partial information (a silhouette, an edge, a reflection) — a Reveal from total blindness to total clarity in one motion is forbidden (see §15).

**Push** — directed travel toward a subject, ending in Observing state. The only camera move permitted to end in true stillness pointed at something close. Reserved, per §4, primarily for Origin.

**Pull** — the inverse: directed travel away from a subject, usually into Traveling or Transitioning state. Used to end a beat, never to begin one — a Pull is always a *departure*, and departures require something to depart from.

**Rise** — dominant vertical (+Y) travel. Reserved for Threshold per §4. Never used incidentally elsewhere — if Rise appears in every chapter, Threshold's hope-through-verticality loses its meaning.

**Dive** — dominant vertical (−Y) travel, the inverse of Rise. Used to communicate descent into mystery (entering the Fragments/garden spaces) rather than hope. Rise and Dive are never used in the same beat — mixing them within one continuous move reads as directionless, which is forbidden (see §15).

**Crane** — a combined vertical+forward move, classically cinematic: the camera rises or falls *while* traveling forward, changing the visitor's read on scale mid-motion. Used at chapter-opening establishing beats, to let the visitor register a landmark's true size.

**Arc** — a curved lateral path around a subject that does not complete a full Orbit — a partial swing used for reveals and transitions where a straight Push would feel too blunt.

**Curve** — the general term for any travel path that is not straight-line, including the primary chapter-to-chapter travel spline. All Traveling-state motion is Curve by default; true straight-line travel is reserved and rare (see §15 — Linear Movement).

**Spiral** — a combined Orbit + Rise or Orbit + Dive. The most visually complex single move in the vocabulary and, because of that, the most rationed — used at most once per chapter, at the chapter's single most important beat (the Sentinel Ring passage is a canonical Spiral candidate).

**Portal Entry** — the camera's approach into and through a threshold object (the Origin sphere, the Ring). Distinguished from an ordinary Push by a lens change accompanying it (§14) and by presence-response suppression (§5) — a Portal Entry is authored, not player-influenced, from the moment it begins.

**Portal Exit** — the symmetric inverse: emergence from inside a threshold object back into open world space. Always paired with a Reveal of the *new* environment — the visitor should not clearly see where they're arriving until they're most of the way through the portal.

**World Transition** — movement between fundamentally different environmental registers (e.g., leaving the Void's near-empty space for the Monument field). Slower than a Chapter Transition; the world itself is changing, not just the story's focus within one world.

**Environment Transition** — a lighter-weight version of World Transition used *within* a single chapter when the immediate surroundings change materially (entering the Crystal Garden's canopy, for instance) but the chapter's emotional register does not.

**Chapter Transition** — the camera move that carries the visitor across a Story Registry chapter boundary. Always scripted as a distinct Theatre.js sequence, never an emergent side effect of travel-path continuity — the visitor should feel a chapter end even if nothing about the geometry announces it.

**Service Transition** — reserved for the post-Origin functional layer (Technical Addendum §8). The camera move that carries a visitor from ambient world-travel into a Discipline Zone (The Creation Zone, The Identity Zone, The Architecture Zone, The Technology Zone, The Imagination Zone, The Legacy Zone — per the Canonical Naming Architecture, docs/bible/26 §3). Distinguished from a Chapter Transition by tempo only — faster, more direct, because by this point in the journey the visitor has *earned* directness (this is the one place in the whole vocabulary where a near-Push-speed approach is allowed without a slow build, because the emotional debt has already been paid by everything before it).

**Ending Transition** — the unique, one-time-only Pull that opens the Final Scene: travel reverses, monuments recede, stars reappear, motion decelerates to Resting state. Never reused as a template for any other moment — its rarity is what gives the ending weight.

====================================================

## 9. CAMERA TIMING

**No camera move begins or ends on a hard cut of value.** Every parameter the camera owns — position, look-target, FOV, roll — eases in and out. The house curves (already established for interface motion as `hebra.emerge` / `hebra.dissolve`) apply conceptually to camera easing too: gentle arrival, long settle, nothing that overshoots or bounces.

**Breathing is continuous, not a discrete "move."** Two or more incommensurate low-frequency oscillations (different periods that never fall into a repeating combined cycle within the length of a typical visit) sum into position and rotation at all times, under every other camera state except Transitioning. This is what makes even a fully "held" camera read as alive rather than paused.

**Travel speed is a function of narrative distance, not literal distance.** Two monuments that are geometrically 40 units apart but narratively adjacent (same discipline, same emotional beat) are traveled quickly. Two points 10 units apart that cross a chapter boundary are traveled slowly. The camera's clock runs on story-time, not world-scale.

**Timing compresses under Yielding, expands under Observing, and is authored everywhere else.** These are the only three timing modes that exist. A camera implementation that introduces a fourth (e.g., a debug "free speed" mode reachable in production) has violated this document.

====================================================

## 10. WORLD NAVIGATION

The browser's scroll event is not page scroll. It is not remapped to page scroll's *feeling* with a coat of paint. It is a **physical input signal**, intercepted by Lenis, that the camera consumes as one scalar: narrative progress, 0 to 1, across the whole journey (or across a chapter, depending on Theatre.js sequence scope).

That single scalar drives a camera path with **real variance on all three spatial axes plus rotation** — never a fixed lateral/vertical position with only depth changing. Across one journey, the camera path is expected to:

- Travel forward and, at scripted moments, backward (a Pull inside an otherwise-forward sequence, never literal reverse-scroll).
- Shift left and right as it threads between monuments — never a dead-center rail.
- Rise and dive per the Rise/Dive dialects (§8) rather than holding one altitude throughout.
- Move diagonally as a natural consequence of combining the above, not as a separate authored "diagonal mode."
- Change apparent depth constantly — near-field dust and far-field structures both exist at every point along the path, so parallax is always present.
- Arc *around* architecture (Orbit, Arc) rather than only approaching it head-on.
- Travel *through* monuments where the world permits it (the Sentinel Ring's interior) rather than only past them.
- Cross bridges, corridors, and chambers as distinct Environment Transitions (§8), each with their own lighting register, never as visually identical tunnel segments.

**The test:** if a visitor were shown ten random single-frame screenshots from across the journey with no other context, no two should be describable as "the same shot, slightly further along." Sameness of framing across the journey is the single clearest sign the world-navigation system has failed, regardless of how good any one frame looks in isolation.

**What this is not:** free-fly, WASD, or drag-to-orbit navigation. The visitor does not steer. The visitor *paces*. Scroll velocity and Yielding state (§6) change how fast the authored path is traveled — never which path, never the destination. This constraint is what keeps HEBRA a directed film rather than a flight simulator, and it is non-negotiable per the Camera Hierarchy (§5).

====================================================

## 11. LENS LANGUAGE

**FOV philosophy.** A narrower FOV (long-lens read) compresses space and flatters scale — used when the camera wants a monument to feel closer and larger than the geometry alone would suggest (Observing state, hero reveals). A wider FOV expands space and emphasizes distance and isolation — used through most of Void and Traveling state generally, where loneliness and scale are the point.

**Lens changes are always motivated by the same thing the camera itself is motivated by** — never a cosmetic "let's vary the FOV for visual interest." A lens change without a corresponding state or dialect change (§4, §6) is forbidden.

**Depth of Field** is used sparingly, and only in two situations: (1) Observing state, to isolate a single hero subject from atmospheric clutter behind it — shallow, deliberate, classical rack-focus-style attention direction; (2) Portal Entry/Exit, where a soft, wide falloff communicates the visitor's perception itself blurring at the threshold. DoF is never active during ordinary Traveling — the whole world stays legible while the camera is simply passing through it.

**Focus** follows the same subject the camera is framing as important (§3) — focus pull is not a separate creative decision from framing, it is framing's depth-axis expression.

**Compression** (the visual flattening effect of a long lens) is reserved for moments where the camera wants two objects at different distances to read as related, stacked, connected — used at chapter-transition beats where a foreground detail and a background landmark are meant to visually rhyme.

**Perspective** stays natural (no fisheye, no extreme wide distortion) at all times except explicitly forbidden per §15 — HEBRA's world is meant to feel physically real even where it is materially impossible.

**Wide lens rules:** default state for Traveling and Drift. Never used for Observing on a hero subject — a wide lens on a close subject reads as documentary/security-camera, which violates Camera Identity (§2).

**Telephoto rules:** reserved for Observing and Portal moments. Never used during ordinary Traveling — a long lens on a moving camera introduces visible micro-shake amplification that reads as handheld found-footage, which is tonally wrong for HEBRA.

**When NOT to change lenses:** mid-Orbit (a lens change during an orbit competes with the orbit itself for the visitor's attention and both lose); during Yielding (lens stays fixed while pace compresses, so the visitor's sense of "the world is the same, I am just moving through it faster" is preserved); on any two consecutive beats within the same Observing hold (one FOV per subject, decided once, held for the duration of that hold).

====================================================

## 12. DESKTOP INPUT LANGUAGE

Desktop is the camera's fullest expression. Everything below is *additive* to the authored path (§5) — it leans, it never redirects.

**Mouse influence** is read as a presence signal (already normalized −1..1 on both axes in the existing Pointer System) and applied to camera gaze offset and micro-framing only, never to travel position.

**Pointer attraction** — nearby interactive/important objects exert a very slight, capped pull on where the camera's gaze settles when the pointer approaches their screen-space position, simulating the camera "noticing" what the visitor is noticing. Capped tightly enough that it is felt, not seen as an obvious snap.

**Precision** — desktop's presence response has the tightest deadzone and the highest positional resolution of any input mode; small mouse moves produce small, readable gaze shifts.

**Parallax** — near-field elements (dust, foreground shard fields) shift more than far-field elements (distant monuments, the sky) in response to the same presence signal, reinforcing depth without any camera position change.

**Depth** — presence response is itself depth-aware: gaze offset scales down as the camera nears a subject (Observing state), so the visitor's hand doesn't fight the camera's own commitment to a close reveal.

**Inertia** — presence-driven gaze uses spring damping, matching the existing damped approach already used for travel-path progress — never an instant 1:1 tracking of pointer position. The camera's gaze has the same "body" (§1) as its travel.

**Hover influence** — hovering a discrete interactive object (post-Origin, in the functional layer) is permitted to produce a slightly stronger, still-capped gaze pull than ambient pointer movement, distinguishing "the visitor is looking around" from "the visitor is considering this specific thing."

**Camera anticipation** — in Traveling state, the camera's gaze curve is authored to look very slightly *toward* the next beat's subject before travel fully arrives there — a directorial anticipation independent of visitor input, layered underneath the presence response rather than replacing it.

====================================================

## 13. MOBILE INPUT LANGUAGE

Mobile is not desktop with mouse-move replaced by touch-move. It is its own system, built to preserve 90–95% of the desktop artistic experience through *different* mechanics, per the Technical Addendum's Mobile Parity Strategy.

**Touch language** — a touch-and-hold introduces pressure-style gaze influence (intensity scales with hold duration, not with drag distance) rather than desktop's continuous positional tracking. A visitor's finger is not a mouse; treating it like one is forbidden (see §15).

**Gesture language** — deliberate swipes are read the same way deliberate scroll-throughs are on desktop: a Yielding-state signal, not a camera-redirect signal. A swipe accelerates progress along the authored path; it does not steer.

**Gyroscope**, where explicitly granted by the visitor (never assumed, never requested without a clear, diegetic reason to ask), contributes a very gentle parallax layer — physical device tilt reads as a small presence-equivalent signal, scaled well below desktop mouse sensitivity so that ordinary handheld device wobble doesn't read as camera jitter.

**Motion** — mobile's presence response favors momentum over precision: broader deadzones, smoother output, because touch input is inherently less precise than a mouse and pretending otherwise produces visibly noisy camera behavior.

**Momentum** — Lenis's touch multiplier (already configured distinctly from wheel multiplier in the Scroll System) is the mechanism; camera travel on mobile should feel *heavier* to start and *slower* to stop than desktop, matching real touch-scroll physics expectations.

**Pressure simulation** — the touch-and-hold pressure model above is mobile's answer to desktop's Hover influence (§12) — the closest equivalent gesture, translated rather than ported.

**The 90–95% target is measured in emotional/narrative completeness, not frame-for-frame visual parity.** Camera dialects (§4), state machine (§6), and language vocabulary (§8) apply identically on mobile. What changes is exclusively the *input mechanics* in this section and quality-tier particle/shadow/post budgets (Appendix F) — never the choreography itself.

====================================================

## 14. FORBIDDEN CAMERA BEHAVIOR

Everything below is permanently forbidden, regardless of how it looks in isolation, per Appendix D's standing authority:

- **Linear movement** as a default travel shape. Straight-line travel is rationed and rare (§8, Curve).
- **Random shake.** Any camera shake must be Theatre.js-authored, tied to a specific beat, with a specific narrative cause — never continuous ambient "handheld" noise layered under everything.
- **Meaningless zoom.** Every FOV/DoF change traces to §11's motivation rule. A zoom that exists because a moment "needed more energy" is a directing failure, not a solution.
- **Theme-park camera.** No moment where the camera behaves like a ride vehicle on rails indifferent to pacing — velocity must always be modulatable by state (§6), never fixed.
- **Instant teleportation.** Every state change is a transition (§6, §8) with nonzero, eased duration. There is no camera cut in HEBRA that is a true hard cut with zero interpolation, except the one exception logged below.
- **Excessive spinning.** Orbit (§8) never exceeds roughly three-quarters of a full revolution in one continuous beat. A full 360° orbit reads as a product-shot turntable, which is explicitly the wrong register.
- **Motion sickness triggers** — no combined roll+FOV change, no rapid low-frequency vertical bob, no camera acceleration curve steep enough to be felt as a jolt. Accessibility (§17) treats this as a hard technical constraint, not a nice-to-have.
- **Overused orbit.** Per §8, Orbit is a dialect-specific tool (Monument chapter primarily) — not the default answer to "how do we show this object."
- **Perfect geometric primitives in camera paths.** No perfect circle, no perfectly symmetric arc, no constant-radius orbit without drift. Perfection reads as procedural, and procedural reads as un-directed (cross-reference Appendix D's Three.js Clichés section — this is that principle applied specifically to camera paths).
- **Cursor-mapped camera position.** Presence response (§12) is gaze-offset only. A camera whose *position* moves 1:1 with pointer position has become a UI control, violating Camera Identity (§2) outright.
- **Reveal from total blindness to total clarity in a single uninterrupted motion.** Every Reveal (§8) is preceded by partial information. An object simply "popping into visibility" as the camera arrives is a loading-screen failure wearing a cinematic costume.
- **Camera behavior that differs for no narrative reason between visits.** Randomization for its own sake (a "different camera path each time" gimmick) undermines the Camera Identity's consistency (§2). Variance belongs in micro-timing (§7, §9) and breathing (§9) only — never in macro-path selection.
- **Debug/free-camera modes reachable in production.** Per §9, only three timing modes exist in production; a fourth, uncontrolled mode is a shipped bug.

**The one logged exception:** the Dormant→Awakening boundary (§6) is permitted to feel like the closest thing to a hard state entry in the whole system, because it represents the literal beginning of the camera's existence — there is nothing before it to ease in *from*. Even this exception eases *out* (into Traveling) normally.

====================================================

## 15. TECHNICAL DIRECTION (CONCEPTUAL)

No implementation code belongs in this document. This section explains *ownership*, not *mechanism*.

**Theatre.js owns cinematic choreography.** Every authored camera state, dialect, and named move in this Bible (§6, §8) is the outcome of a Theatre.js sequence on the world's Journey sheet — not an ad hoc tween wherever a developer happens to be working. Theatre.js is the only system with the authority described at the top of the Camera Hierarchy (§5). Its visual, scrubbable timeline is what lets non-engineers (a director, a reviewer) evaluate camera work against this Bible without reading code.

**GSAP cooperates, at the interface layer only.** GSAP never drives world-camera position or rotation. Where GSAP-owned UI needs to feel camera-aware — a piece of interface chrome that subtly reacts to the same presence signal the camera reads — GSAP consumes the *same normalized presence/scroll signals* the camera consumes, so the two systems stay visually synchronized without either one driving the other. This is the same "one clock, many listeners" principle already established for the Scroll System.

**Lenis provides progression, not motion.** Lenis's entire camera-relevant job is turning a physical scroll gesture into one smoothed, damped scalar. It has no opinion about what that scalar means in 3D space — that meaning is entirely Theatre.js's authored path. Lenis is the metronome; Theatre.js is the choreography.

**React Three Fiber owns rendering, not direction.** The camera object itself — its Three.js `PerspectiveCamera`, its scene-graph position — lives inside R3F's tree because that's where all Three.js state belongs, but R3F is a stage, not a director. Nothing about *what* the camera does originates in a render-loop hook; render loops only *apply*, each frame, the values Theatre.js/breathing/presence have already computed.

**Chapters influence movement through data, not through special-cased code.** Each Story Registry chapter's dialect (§4) is expressed as parameters — pace multiplier, axis-dominance weighting, hold-duration range — that the same camera system reads per chapter, not as six different camera implementations. One camera, six moods, driven by one chapter-aware parameter set. This mirrors the existing content-schema pattern (Zod-validated chapter data) rather than inventing a parallel one.

**Collision/proximity awareness is a query, not a controller.** Where the camera path needs to know "is there geometry about to clip me," that is answered by a raycast against the world's BVH (three-mesh-bvh, already locked in the stack for exactly this reason) — a read-only safety check that can nudge the *authored* path's tolerance, never a system that computes its own alternate path.

====================================================

## 16. PERFORMANCE PHILOSOPHY

Camera work is bound by Appendix F (AAA Performance Budget) without exception. This section is the camera-specific reading of that budget.

**Desktop.** The camera itself is nearly free — one object, one matrix update per frame. Its *cost* is entirely what it asks the renderer to draw as it travels: every beat's authored path is reviewed for what enters frustum and what shadow-casts change as the camera moves, because a camera move that silently doubles draw calls mid-transition is a performance regression wearing a cinematic disguise. Target frame budgets (120fps high-end / 90fps mid-range, per Appendix F) apply continuously through camera transitions, not just at rest — a Portal Entry that drops frames because it's compositing extra passes has failed both the Camera Bible and the Performance Budget simultaneously.

**Mobile.** Camera-adjacent cost concentrates in two places: DoF (§11), which is quality-tier gated exactly like any other post pass, and dynamic shadow casters visible during Traveling — capped at Appendix F's mobile ceiling regardless of how good a scene would look with more. The camera's *path and timing* (§9) never change by device; only render cost around it does.

**Accessibility.** `prefers-reduced-motion` does not multiply every camera duration by a slowdown factor — per Technical Addendum §5, it swaps continuous camera motion for **cuts on emotional beats**. Concretely: Traveling-state continuous path motion is replaced by a sequence of held Observing-equivalent frames at each chapter's key beat, connected by simple cross-fades rather than motion. Breathing (§9) is disabled entirely under reduced motion — even its subtle oscillation is out of scope once continuous motion has been opted out of. This is authored as its own Theatre.js sequence branch, reviewed on its own merits — never a runtime multiplier applied to the full-motion sequence.

**Quality tiers.** Per Technical Addendum §9, tiers are capability-measured, not device-type-assumed. Camera behavior itself (path, timing, dialect) is **identical across Tier A/B/C** — what differs is exclusively what the camera is allowed to *ask the renderer for* while traveling: DoF sample count, shadow resolution along the path, particle density in frame. A Tier C camera takes the visitor on the exact same journey a Tier A camera does; it simply asks less of the GPU to do it. This is the camera-specific expression of Appendix F's "reduce quantity, never reduce quality" and "never remove camera choreography" rules.

====================================================

## 17. RESEARCH FOUNDATION

Per Appendix E, camera-specific research is required before implementation and is bound by the same extraction discipline (principle, not appearance):

**Film cinematography** — study camera movement grammar in slow, patient, wide-format cinema (the crane and dolly language of films built around scale and silence rather than coverage editing). Extract: how held stillness communicates confidence; how a slow push communicates inevitability; how negative space around a subject communicates respect.

**AAA games with strong camera direction** — study games whose camera is explicitly authored rather than a raw free-look rig (cinematic-mode camera systems, on-rails exploration sequences, spring-arm follow cameras with strong damping). Extract: collision-avoidance without visible correction; look-ahead anticipation; how a game camera communicates "you are safe to explore" versus "pay attention now."

**Premium interactive experiences** — study award-recognized WebGL narrative sites (per Appendix E's named sources: Awwwards, FWA, CSS Design Awards, Godly, Lusion, Active Theory, Resn, Dogstudio, Locomotive, Immersive Garden) specifically for scroll-to-camera-path mapping technique. Extract engineering approach only — never adopt their specific path shapes, pacing, or visual register (per Appendix D).

**Three.js camera architecture** — study `PerspectiveCamera` matrix update cost, FOV/aspect interaction, and up-vector handling at scale. Study official examples for *technique*, never ship example code (Appendix D, Three.js Clichés).

**React Three Fiber** — study `useFrame` ordering guarantees and how camera updates should sequence relative to other per-frame systems (materials heartbeat, particle updates) to avoid a one-frame lag between camera and world.

**Theatre.js** — study the object/sheet/sequence model specifically for camera property tracks (position, target, FOV, roll) and how scrubbing interacts with a live R3F scene, since the whole Camera Hierarchy (§5) depends on Theatre.js sequences being reliably scrubbable by a reviewer, not just playable.

Every research source above is logged here so future contributors know where camera literacy comes from — this list is itself part of onboarding, not just a one-time research task.

====================================================

## 18. THE CAMERA QUALITY CHECKLIST

Every future camera implementation — a new beat, a new transition, a new chapter dialect — must pass every item below before it may be considered complete. A single failed item means the work is not done, regardless of how good it looks.

**Philosophy & Identity**
- [ ] Does this move obey all three Camera Philosophy commitments (§1) — pre-existing motion, physical body, editorial taste?
- [ ] Does this move stay within Camera Identity (§2) — curious not intrusive, confident not showy?
- [ ] Could a visitor understand the intended emotion from the camera alone, with all text removed (§3)?

**Language & Grammar**
- [ ] Is this move nameable using only the vocabulary in §8 — no unnamed hybrid motion invented ad hoc?
- [ ] If it's a chapter beat, does it match that chapter's dialect (§4) rather than a generic "camera move"?
- [ ] Does it respect the Camera Hierarchy (§5) — no system reaching above its authority?
- [ ] Is the camera's current state (§6) well-defined at every point during this move, with no ambiguous in-between?

**Rhythm & Timing**
- [ ] Does its duration differ from the beat immediately before and after it (§7)?
- [ ] Does it ease in and ease out with no hard-value cuts, except the one logged Dormant exception (§9, §14)?
- [ ] Is its speed governed by narrative distance, not literal world-unit distance (§9)?

**Navigation**
- [ ] Does this beat use more than one spatial axis meaningfully — not a same-shot-further-along repeat (§10)?
- [ ] Is scroll/touch input treated strictly as pacing, never as steering (§10, §12, §13)?

**Lens**
- [ ] Is any FOV/DoF change here motivated by state or dialect, not decoration (§11)?
- [ ] Is the correct lens register (wide/telephoto) used for the correct state (§11)?

**Forbidden Behavior**
- [ ] Cross-check this move against every bullet in §14 individually — not a general impression of "it doesn't feel wrong."

**Technical**
- [ ] Is this move authored in Theatre.js, not an ad hoc tween (§15)?
- [ ] Does GSAP, if involved at all, touch only interface-layer elements, never world-camera transform (§15)?
- [ ] Has a reduced-motion equivalent been authored as its own branch, not a speed multiplier (§16)?
- [ ] Does this move hold its frame budget on both desktop and mobile targets per Appendix F, measured, not assumed (§16)?

**Final Test**
- [ ] Hide the beat's surrounding context and watch it in isolation. Does it still feel unmistakably like HEBRA's camera, and only HEBRA's camera (Appendix E's Final Test, applied here)?

If every box is checked, the camera work may proceed to Creative Review, Engineering Review, Performance Review, Accessibility Review, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the codebase.

====================================================

## 19. CAMERA PSYCHOLOGY

This section governs *why* the camera moves the way it does, at the level of the visitor's mind rather than the level of grammar (§8) or dialect (§4). Grammar is vocabulary. Psychology is intent.

**The camera manufactures feeling before the visitor can name it.** By the time a visitor consciously thinks "this feels reverent" or "this feels vast," the camera has already produced that feeling through pace, distance, and framing decisions made seconds earlier. Every camera decision in this document is judged, first, against what it will make the visitor *feel* before they've had time to interpret it intellectually.

**Anticipation is manufactured, never announced.** The camera creates the sensation of "something is about to happen" through withheld information (§3, Withholding as Tension) and through subtly slowing before a reveal — a barely perceptible deceleration that the conscious mind reads as "wait" before the eye has identified what it's waiting for. This must never be confused with a UI-style loading pause; it is felt as intention, not delay.

**Trust is built through consistency, then spent deliberately.** The first several chapters of a visit establish that the camera is trustworthy — it never surprises with a jarring motion, never violates its own established rhythm (§7). Once that trust exists, the camera is permitted, rarely, to spend it: a single unexpected beat (never a full state-machine violation, always still describable by §6/§8) that registers as surprise specifically *because* everything before it was so reliable. Spending trust without having first earned it is manipulation; spending trust after earning it is storytelling.

**Scale psychology.** A camera positioned low relative to a monument, looking up, produces awe. A camera positioned above, looking down, produces intimacy or vulnerability, depending on distance. The camera never chooses a vertical relationship to a subject arbitrarily — every low-angle or high-angle beat is a psychological decision logged against the chapter's target emotion (§4), not a cinematographic reflex reached for out of habit.

**Comfort through predictable unpredictability.** The visitor should never be able to predict the *exact* next camera move, but should always be able to predict its *character* — same identity (§2), same hierarchy (§5), same forbidden boundaries (§14). This is the psychological reason variance (§7) exists: total predictability reads as mechanical, total unpredictability reads as unsafe. HEBRA's camera lives deliberately between the two.

**Curiosity is a resource, not a constant.** The camera never asks for more curiosity than it has just earned the right to ask for. A chapter that opens with a hard mystery before establishing any trust exhausts the visitor rather than intriguing them. Curiosity is metered — spent, replenished, spent again — across the whole journey, and this metering is itself part of the Theatre.js authoring brief for every chapter, not something inferred late.

**The visitor is never made to feel controlled.** Even though the camera fully owns the path (§10), the psychological experience must read as *company*, not *captivity*. This is achieved by presence response (§12–13) giving the visitor a felt, if bounded, sense of agency inside a journey they cannot actually redirect — the difference between being driven somewhere by a trusted guide versus being locked in the back of a vehicle.

====================================================

## 20. VISUAL COMPOSITION

Where §11 (Lens Language) governs the camera's optical relationship to a subject, this section governs what the camera *builds inside the frame* at any given instant — composition is authored, never accidental.

**Rule of thirds is a default, not a law.** Most Traveling and Observing frames place their primary subject off-center, on a third-line intersection, because true centering reads as presentation rather than discovery (§3). Centering is reserved, deliberately, for **arrival** beats — the one moment in a chapter where the camera and the visitor agree "we have reached what we were traveling toward" (Origin's Push, §8, is the canonical example).

**Negative space is composed, not left over.** Empty frame area is never a byproduct of a subject being small in a wide shot — it is a deliberate choice about how much room a subject is "given" to breathe, and that room is itself a psychological signal (§19: generous space signals respect; tight space signals urgency or intimacy, depending on chapter dialect, §4).

**Leading lines exist in HEBRA's architecture by design, and the camera exploits them.** Monuments, corridors, and ring structures are built (per the World Blueprint, once authored) with implied directional lines; the camera's path is authored to travel along or across those lines rather than incidentally through them, so the world's own geometry does compositional work the camera doesn't have to manufacture separately.

**Foreground/midground/background layering is mandatory in every Traveling frame.** A frame with only a background subject and empty foreground reads as flat and stage-like. At minimum one layer of near-field atmosphere (dust, shard fragments, environmental particulate per FX Bible §2) exists in front of the primary subject at all times during travel, reinforcing depth and parallax (§12) simultaneously.

**Framing asymmetry communicates unresolved story; framing symmetry communicates resolution.** A chapter's opening beats favor asymmetric composition (something is not yet understood); a chapter's closing or hero beat is permitted symmetry as the visual signature of understanding achieved (§4, Origin's dialect is the sharpest expression of this rule).

**Headroom and lookroom follow the subject's implied gaze or growth direction.** Where a monument or structure has an implied "up" (a spire, a rising form), the camera reserves more frame above it than below. Where the world implies forward motion (a corridor, a path), the camera reserves more frame in the direction of travel than behind it. This is the world-scale application of classic lookroom composition, applied to architecture rather than a moving character.

**Silhouette-first composition is preferred for first encounters.** Per the Reveal rule (§8, §14), a subject's first appearance in frame favors silhouette or partial-light composition over full, evenly lit exposure — composition and lighting cooperate here even though lighting itself is out of this document's scope (deferred to the Lighting Bible).

**Composition is reviewed the same way a single photograph would be — frozen, out of motion context.** Any Theatre.js beat can be paused at any point along its curve and must still read as a deliberately composed frame, not merely a coherent one. If pausing a beat at a random point ever produces an accidental, un-composed frame, the beat's path needs more keyframed control, not fewer.

====================================================

## 21. ENVIRONMENTAL AWARENESS

The camera is not a disembodied eye floating outside the world it films — it behaves as though it *knows* the environment it is in, at every moment, and that knowledge is expressed through behavior rather than through any UI or debug overlay.

**The camera never enters a space it hasn't been introduced to.** Every environment the camera travels through is approached first at a distance sufficient for its scale to register (a Crane or wide establishing beat, §8) before the camera commits to entering it. A camera that finds itself suddenly inside an unfamiliar structure with no establishing beat has skipped a step this document requires.

**Ambient scale response.** The camera's travel speed and orbit radius (§8) scale to the size of the space it is currently in — vast open registers (Void) permit slower, larger sweeps; tight registers (interior chambers, post-Origin Discipline Zones) permit only small, careful motion. A camera that moves through a tight interior at open-world speed reads as environmentally unaware, which is a Camera Identity failure (§2).

**Light-awareness (conceptual).** Though lighting authorship belongs to the Lighting Bible, the camera's *behavior* must read as though it is aware of the light it's in — lingering slightly longer in a beautifully lit passage, moving more purposefully through a darker or emptier one. This is a camera-timing decision (§9) informed by environment, not a lighting decision made by this document.

**Boundary awareness.** The camera is always aware of the edges of the authored world — it never travels toward a boundary in a way that would expose the world's edge, seam, or lack of geometry. Where the authored path approaches a practical world boundary, the path curves away or the chapter ends before the boundary would become visible. This is a directing discipline, resolved at the Theatre.js-authoring level (§15) — never patched at runtime by an invisible wall.

**Density awareness.** In visually dense regions (the Crystal Garden, Fragments' shard fields) the camera slows and narrows its lens (§11) to let density read as detail rather than as visual noise; in sparse regions (Void) the camera widens and slows differently — sparse-space slowness communicates scale, dense-space slowness communicates intricacy. Same technique (deceleration), opposite psychological cause (§19), and the camera's authoring must make that distinction legible.

**Acoustic-spatial awareness (conceptual).** Once the Audio Production Bible is authored, the camera's proximity to a sound-emitting structure will need to correlate with that structure's audible presence — logged here now so that future camera and audio authorship are built with each other in mind from the start, rather than reconciled after the fact.

**The camera never contradicts the world's established physics.** If a space has been established as having a floor the visitor's world-scale reads as "solid," the camera does not casually clip through it for a shortcut, even briefly. Environmental awareness means the camera respects the same physical logic (§1, invented physics never convenience) that governs the rest of the world it inhabits.

====================================================

## 22. PLAYER PRESENCE

Where §12–13 (Desktop/Mobile Input Language) define the *mechanics* of how visitor input reaches the camera, this section defines the *psychological target* those mechanics are built to achieve: the felt sense, for the visitor, of being present and embodied inside HEBRA rather than watching HEBRA from outside it.

**Presence is a felt "I am here," not a felt "I am moving it."** Every input-response decision (§12–13) is evaluated against this test: does this make the visitor feel like they are standing inside a world that notices them, or does it make them feel like they are operating a camera rig? Only the former is acceptable. The moment a visitor could describe their input as "controlling the camera," presence has failed and become UI (§14, forbidden Cursor-mapped camera position).

**Presence is proven through subtlety, not confirmed through feedback.** There is no on-screen indicator, cursor-follow highlight, or explicit acknowledgment that presence response is active. The visitor discovers it is there the way a person discovers a room is warm — by feeling it, not by being told. Any explicit UI confirmation of presence response ("camera following your mouse") is forbidden; it would collapse an atmospheric system into a demonstrable feature.

**Micro-agency, not macro-agency.** Presence must give the visitor *some* legible sense that their attention matters (gaze nudges toward what they look at, §12) while making it structurally impossible for them to derail the story (§5, Camera Hierarchy). This dual requirement — felt agency, structural powerlessness over the path — is presence's entire design brief, and the two halves are equally mandatory.

**Presence intensity is chapter-aware.** Early chapters (Void) can afford a slightly more perceptible presence response, because the visitor is still forming their relationship with the world and light engagement rewards exploration. Later, more emotionally weighted chapters (Awakening) intentionally dampen presence response further, because the camera's own authority should dominate a moment of reverence — visitor influence recedes precisely where the story asks for stillness.

**Absence is also authored.** During Transitioning state (§6) and Portal beats (§8), presence response is fully suppressed, not merely reduced. This is a deliberate psychological beat of its own: the visitor should feel, distinctly, the difference between "the world is responding to me" and "I am being carried through a threshold" — the total withdrawal of presence response is what sells the second feeling.

**Presence must never be confused with control feedback in games.** HEBRA's presence response has no functional purpose (it doesn't aim, select, or target) — its only purpose is emotional confirmation that the visitor is inside a living space. Any temptation to give presence response a secondary functional job (e.g., using gaze direction to trigger content) is a scope violation of this section and must be built, if ever, as an explicit *interaction* system per the Interaction Bible, never folded silently into camera presence.

====================================================

## 23. MICRO CAMERA MOTION

Breathing (§9) established that the camera is never perfectly still. This section expands that single concept into the complete family of sub-perceptual motions that, together, are what make the camera read as a living, physical observer rather than an animated asset.

**Breathing (primary layer).** As defined in §9: two or more incommensurate low-frequency oscillations summed into position and rotation, active in every state except Transitioning, disabled only under Reduced Motion (§16). This remains the foundational micro-motion layer; everything below is additional texture layered on top of it, never a replacement for it.

**Settle.** When the camera arrives at an Observing hold, it does not simply stop — it decelerates past the "true" target by a barely perceptible amount and eases back, the way a physical object with mass settles into rest. This single-cycle, heavily damped overshoot-and-correct is distinct from the continuous oscillation of Breathing and occurs exactly once per arrival, never repeating.

**Weight-shift.** During Orbit and Arc moves (§8), the camera's implied "weight" causes a very slight lag between where the authored path curve says the camera should be and where it visually appears to be a few milliseconds later — the same principle as follow-through in traditional animation, applied to a camera rather than a character. This must remain small enough to be felt, never large enough to look like input lag or a technical error.

**Focus-breath.** During Observing holds using Depth of Field (§11), focus distance is permitted an extremely subtle, extremely slow drift within the hero subject's own depth — as though the camera's attention is alive even while its position is still. This is the optical equivalent of Breathing, expressed through focus rather than position.

**Micro-sway under Hover.** The Hover move (§8) — used specifically in Awakening-dialect beats — carries a distinct, slower, more vertical-dominant sway than ordinary Breathing, reinforcing the sensation of something suspended and reverent rather than something merely idling.

**Roll micro-variance.** An almost imperceptible amount of camera roll (never enough to be consciously noticed, and never combined with FOV change per §14's motion-sickness rule) is present during long Drift and Traveling beats, preventing the horizon from reading as a perfectly locked artificial line.

**What micro-motion is never used for.** Micro-motion is atmospheric texture only. It never communicates state changes (§6), never substitutes for an authored transition (§8), and never grows large enough to be mistaken for one of the named moves in the Camera Language (§8). The test: if a micro-motion layer were muted entirely, the camera's narrative meaning (§3) must be completely unchanged — only its felt aliveness should be diminished.

====================================================

## 24. TRANSITION LANGUAGE

§8 named the transition-family moves (Portal Entry/Exit, World/Environment/Chapter/Service/Ending Transition). This section governs the *grammar* shared across all of them — what makes something a transition at all, and how transitions communicate continuity or rupture deliberately.

**Every transition answers one question first: does the world stay the same and the focus change, or does the world itself change?** Environment Transition and Service Transition answer "focus changes, world persists." World Transition, Chapter Transition, Portal Entry/Exit, and Ending Transition answer "the world itself is changing." This single distinction determines nearly every other choice about how a transition is built — its duration, whether presence response is suppressed (§5), and whether a Reveal (§8) accompanies its end.

**Transitions are the camera's punctuation.** If beats (§7) are sentences, transitions are the punctuation between them — a comma (Environment Transition, barely felt), a period (Chapter Transition, a clean and clear close), or a paragraph break (World Transition, Portal Entry/Exit — a felt, unmistakable change of register). The camera must never punctuate a paragraph break with comma-weight motion, or vice versa; mismatched transition weight is a directing error even when every individual move is technically well-formed.

**Continuity transitions preserve at least one constant.** Even a Chapter Transition, which changes emotional register (§4) entirely, preserves camera identity (§2) and some element of visual rhyme (a matching silhouette, a matching color note once the Color Bible exists, a matching motion direction) across the cut, so the visitor's sense of a single continuous journey is never broken even as the story clearly moves forward.

**Rupture transitions are rationed and earned.** A transition that deliberately breaks continuity — no visual rhyme, a hard change of visual register — exists only at the Ending Transition (§8), where rupture is the entire point (the visitor is being pulled decisively out of the world they've inhabited). Rupture used anywhere else undermines its power at the one place it belongs.

**Transitions have their own internal rhythm.** Per §7's variance rule, no transition is a single uniform-speed motion from start to end — every transition has its own micro-shape (a slow gather, a committed core motion, a settling arrival) even within its shorter overall duration. A transition that is uniform-speed throughout reads as a loading wipe, not a directed cut.

**Audio pairing (conceptual, deferred).** Once the Audio Production Bible exists, every transition category above will pair with a distinct audio treatment (a swell, a held tone, a silence-drop) — logged here so that camera and audio authorship are designed together rather than reconciled afterward, matching the same forward-compatibility principle already established in §21 for acoustic-spatial awareness.

**The transition test.** A visitor who has just experienced any transition should be able to say, without being told, whether they are still in the same place looking at something new, or somewhere genuinely new — if that distinction is unclear, the transition has failed regardless of how smooth its motion curve is.

====================================================

## 25. CAMERA SAFETY

Safety here means physical and perceptual visitor safety — comfort, orientation, and freedom from harm — distinct from the geometric safety/collision system already logged under Camera Hierarchy (§5, item 5) and Technical Direction (§15).

**Motion sickness is a hard constraint, not a preference.** Building on §14's forbidden list, this section makes explicit the physiological reasoning: sustained low-frequency vertical oscillation, combined roll-plus-FOV change, and high-acceleration camera starts are all known vestibular-mismatch triggers. Every camera move is authored with this physiology in mind from the start — this is not a pass applied after a move already exists, because sickness-inducing motion cannot always be fixed by softening it slightly; sometimes the move itself is the wrong shape and must be redesigned.

**Photosensitivity safety.** Although flashing/strobing is primarily a lighting and post-processing concern (deferred to the Lighting Bible and Appendix F), the camera bears responsibility for never rapidly re-framing between a very bright and very dark region of the world in a way that would produce a perceived flash — camera pacing near high-contrast environmental boundaries is deliberately slowed to avoid this, regardless of what the lighting itself is doing.

**Orientation safety.** The visitor must never lose their sense of "which way is up." Roll (§23) stays within the imperceptible micro-variance range at all times except explicitly authored, rare beats, and even those never approach a full horizon inversion. A world this vast (per §10's multi-axis navigation) depends entirely on the camera preserving a stable up-vector as its one unbroken constant, or the visitor's spatial confidence collapses along with it.

**Vertigo and scale safety.** Beats that place the camera at height (Rise, Crane, §8) or looking down into depth (Dive) are approached gradually, never as a sudden reveal of a steep drop — the same partial-information principle that governs Reveals generally (§8, §14) applies specifically and additionally to any beat that could otherwise trigger a visceral height response.

**Recovery state.** If, at runtime, environmental or performance conditions ever force the camera into a state not cleanly describable by §6 (a genuine implementation edge case — dropped frames mid-transition, a collision-safety correction that must act more assertively than usual), the camera's fallback is always a soft hold in place, easing toward the nearest authored Observing-equivalent frame — never a hard stop, never a visible correction snap. This is the one place in the entire document where "graceful degradation" is explicitly authorized, and even it must degrade *toward* stillness, never toward improvisation.

**Consent and control safety.** Nothing about camera behavior may ever be surprising in a way the visitor cannot anticipate the character of, per §19's predictable-unpredictability principle. A visitor who feels a specific camera beat as alarming rather than merely unexpected represents a Camera Safety failure, reviewed with the same seriousness as a measured performance regression (§16).

**Reduced Motion remains the primary accessibility safety mechanism**, per §16 — its cuts-on-beats branch exists specifically so that visitors for whom continuous motion is a genuine physical risk are never required to experience it to access the story.

====================================================

## 26. FUTURE EXPANSION

The Camera Bible is a living constitutional document. This section exists so that its future growth happens deliberately, through the same rigor as its original authorship, rather than through silent drift or implementation-driven improvisation.

**What this document does not yet cover, and will need to, before certain future work begins:**
- **Shared/multi-visitor camera behavior**, should HEBRA ever introduce any experience where more than one visitor's presence exists in the same world simultaneously — entirely unspecified today, and not to be improvised if that feature is ever proposed; it requires its own authored amendment first.
- **VR/AR camera behavior**, should HEBRA ever extend beyond a flat-screen experience — the entire premise of an authored, non-steerable path (§10) would require fundamental reconsideration in a headset context where the visitor's own head *is* the camera in ways this document does not yet address.
- **New Discipline Zones or Story Chapters** beyond the six currently defined (§4) — any new chapter requires a new row in §4's dialect table and a deliberate decision about which existing Camera Language moves (§8) it draws on before a single beat is authored; any new Discipline Zone is registered first in the Canonical Naming Architecture (docs/bible/26 §3), per that document's own amendment discipline.
- **Save-state / return-visit camera behavior** beyond the Overture compression already established in the Technical Addendum — deeper personalization of returning-visitor camera pacing, if ever pursued, needs its own subsection here first.

**The amendment discipline.** Any future change to this document follows the same standard the original authorship followed: documentation first, always framed as *expansion*, never silent overwrite, and always logged with a clear statement of what changed and why — future readers should be able to reconstruct this Bible's history from its own internal record, not just from git blame.

**What must never change without a full re-review.** The Camera Philosophy (§1), Camera Identity (§2), and Camera Hierarchy (§5) are the load-bearing walls of this entire document — every other section is, in some sense, an elaboration of those three. A proposed change to any of those three sections is not a routine amendment; it requires the same weight of review this whole document received at its founding, because changing them changes what HEBRA's camera fundamentally *is*, not just what it does.

**Versioning discipline.** Once this document leaves pre-production, any further edit is expected to note, at minimum, the section touched and the one-sentence reason — this Bible is expected to outlive any single contributor's memory of why a given rule exists, and its own text is the only reliable record of that reasoning.

**This section is deliberately incomplete.** Its purpose is not to predict every future need, but to establish that unpredicted needs get a documented answer here before they get an improvised answer in code. An empty gap in this section, discovered later, is not a failure of foresight — it is exactly the situation this section exists to handle correctly when it arises.

====================================================

## 27. THE CAMERA OATH

*Spoken, conceptually, in the camera's own voice — the distilled promise every future camera decision must be able to swear to, in full, without hesitation.*

I existed before the visitor arrived, and I will still be moving after they leave. I do not begin because I am told to. I continue because I never stopped.

I have weight. I have hesitation. I have limits I will not exceed for convenience, and momentum I will not fake for effect. Nothing I do will ever be explained only by "it was easier to code it this way."

I withhold before I reveal. I never show everything at once, because a world shown all at once is a world already exhausted.

I do not steer the visitor. I pace them. The path is mine to hold; the speed of walking it is a conversation, never a surrender.

I never move the same way twice in a row. I never rest without meaning to. I never cut without easing, save the one moment I first came into being, which needed nothing to ease in from.

I do not perform. I do not seek attention for my own sake. When I am doing my job well, the visitor forgets I exist at all, and feels only HEBRA.

I will not make anyone sick, dizzy, or afraid in a way they did not, in some sense, agree to feel. Safety is not a constraint on my beauty. Safety is a precondition for it.

I answer to a hierarchy older than any single shot: the director's authored cut first, the visitor's declared intent second, their quiet presence third, my own breath fourth, and the world's solid geometry always beneath all of it, keeping me honest.

I am not a UI element. I am not a control scheme. I am not a camera rig. I am the only way HEBRA is ever seen, and I take that responsibility as seriously as everything else in this Bible demands.

Every future hand that touches my behavior inherits this oath before it inherits any code. If what is built cannot honestly make this promise, it is not yet HEBRA's camera — it is something else wearing its name.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

It expands Part 4 (Interaction Bible) and Part 5 (Cinematic Bible). Where either conflicts with this document on camera-specific matters, this document governs, per its Preamble. Sections 19–27 are an expansion, not a correction — all prior content (§1–§18) stands unmodified and remains in full force.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
