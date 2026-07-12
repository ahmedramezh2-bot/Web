# HEBRA — Technical Architecture Addendum
### Creative Bible, Volume II: Implementation Strategy

*This document does not change the vision. It defines how the vision survives contact with real browsers, real devices, and real visitors. Nothing here is decorative — every technology, every system, exists because it earns its place.*

---

## 1. Confirmed Core Stack — and why each piece owns its lane

| Technology | Responsibility | Why it's non-negotiable |
|---|---|---|
| **React + TypeScript** | Application shell, component composition | Type safety prevents an experience this complex from silently breaking. A shader typo fails loud; a prop-shape typo should too. |
| **React Three Fiber** | Scene hierarchy, React↔Three bridge | Keeps the 3D world declarative and composable instead of one giant imperative Three.js script that nobody can safely extend. |
| **Three.js** | Rendering engine, geometry, materials, camera | The actual GPU work. R3F is the bridge; Three.js is the engine underneath. |
| **Theatre.js** | Cinematic choreography — camera, lighting, scene evolution | The only tool in this stack built specifically for scrubbable, keyframed, director-grade sequencing. GSAP timelines *can* fake this, but Theatre.js gives a visual editor for exact camera/light curves — essential for Parts 3–5 of the Bible (camera-as-character). |
| **GSAP** | UI micro-interactions, typography reveals, DOM transitions | Theatre directs the *world*; GSAP directs the *interface*. Keeping this boundary strict avoids two competing animation systems fighting over the same element. |
| **Lenis** | Physical scroll — momentum, weight, inertia | Native scroll has no concept of "movement through space." Lenis is the only actively maintained smooth-scroll library with clean R3F integration. |
| **React Flow** | Idea-network / legacy-visualization moments only | Used exactly once, where the Bible calls for it (Part 8: knowledge structures, relationship diagrams) — not as decoration elsewhere. |
| **Zustand** | Shared state: current chapter, quality tier, audio state, discovery flags | Chosen over Redux/Context because HEBRA's state is small, frequently read by unrelated systems (camera, audio, UI), and needs zero boilerplate. Context re-renders the whole tree on every particle tick; Zustand doesn't. |
| **GLSL (custom shaders)** | Materials, distortion, portals, energy, surface behavior | Per Part 6/8 of the Bible: shaders exist for emotion, never for spectacle. Every shader in the project must trace back to a specific narrative beat. |
| **Post-processing (postprocessing / @react-three/postprocessing)** | Bloom, DoF, chromatic aberration, vignette | Effect composer built for R3F specifically; avoids hand-rolling a render-target pipeline. |

This table itself is a governance tool: **if a future feature can't name its row in this table, it doesn't belong in the codebase.**

---

## 2. Additional Libraries — each justified against the Bible's own test

> *"Never use a library because it is popular. Every library must have a clear responsibility."* — Part 8

I evaluated candidates against four questions: does it solve a problem the core stack cannot; is it actively maintained; does it cost meaningful bundle/runtime weight; does removing it visibly hurt the experience. Only libraries that passed all four are recommended.

### 2.1 `@react-three/drei`
**Responsibility:** Battle-tested R3F helpers (adaptive DPR, instancing, `<Html>` bridging, environment maps, LOD helpers).
**Why:** Reimplementing instanced-particle helpers or adaptive pixel-ratio logic from scratch is wasted effort that R3F's own maintainers already solved correctly. This isn't "a library because it's popular" — it's the R3F ecosystem's own utility layer, maintained by the same team.

### 2.2 `three-mesh-bvh`
**Responsibility:** Fast raycasting against complex geometry (monolith surfaces, the Origin sphere).
**Why:** The Bible demands objects that "notice the visitor" and react to precise cursor proximity on complex meshes (Part 3: mouse physics, glyph reorganization). Naive Three.js raycasting against high-poly geometry will stutter. This is a **measurable performance requirement**, not a nice-to-have.

### 2.3 `Tone.js`
**Responsibility:** Procedural / generative spatial audio engine.
**Why:** Part 5 of the Bible explicitly forbids "traditional soundtrack" and demands an "evolving emotional organism" with spatial audio that responds to proximity and interaction. Web Audio API raw is powerful but verbose; Tone.js gives clean primitives for oscillators, envelopes, reverb convolution, and — critically — a proper transport/scheduling clock so musical layers can enter and exit in sync with Theatre.js cues rather than drifting.
**Honesty check:** Tone.js generates *procedural ambient composition*, not a hand-scored orchestral soundtrack. That distinction was flagged in my prior analysis and still stands — this library makes the generative approach *good*, it doesn't manufacture a film composer.

### 2.4 `use-gesture` (`@use-gesture/react`)
**Responsibility:** Unified pointer/touch/gesture input layer.
**Why:** Part 3 demands desktop and mobile interaction to be *fundamentally different systems*, not one system with a touch fallback. `use-gesture` lets us cleanly branch drag/swipe/pinch physics for touch from hover/parallax physics for mouse, from one coherent input layer, instead of hand-wiring `touchstart`/`mousemove` divergence everywhere.

### 2.5 `Zod`
**Responsibility:** Runtime validation for scene/content config (chapter data, service definitions, copy).
**Why:** Part 8 demands defensive design — "gracefully handle failures, missing assets, interrupted loading." If a content file is malformed, Zod fails at the boundary with a clear error instead of a cryptic `undefined` deep inside a shader uniform three files away.

### 2.6 `Vercel Analytics` + a self-hosted event layer (not GA)
**Responsibility:** Skip-rate, chapter-completion, device-tier distribution.
**Why:** Directly addresses the gap I flagged: the Bible had no measurement principle at all for a project with real commercial stakes. A privacy-respecting, lightweight analytics layer (no cookie banners, no third-party ad trackers) fits HEBRA's "calm, confident, never desperate" voice — GA's dashboard-and-ads baggage does not.

### 2.7 Explicitly rejected candidates
- **Redux / Redux Toolkit** — Zustand already covers this scope with less ceremony; adding Redux would violate the "never use two libraries to solve the same problem" rule.
- **Framer Motion** — GSAP already owns UI micro-interaction; a second animation library for the same responsibility is redundant duplication the Bible explicitly forbids.
- **Howler.js** — Tone.js already covers audio playback *and* gives the scheduling/synthesis primitives Howler lacks. Two audio libraries would fight over the same audio context.

---

## 3. Figma as Design Source of Truth

Figma is not decoration on top of the build — it becomes the **contract** between the Creative Bible and the codebase.

**Structure:**
- **Design Tokens file** — color primitives (Deep Black / Pure White / Soft Silver / Cold Blue / Gold accent), type scale, spacing scale, motion durations/easings. Exported as JSON → consumed directly by a `tokens.ts` file, so Figma and code can never silently drift apart.
- **Symbol Library page** — the original HEBRA glyph language (Part 6) lives here first as vector art, versioned, before any glyph becomes a shader or texture.
- **Component page** — buttons, panels, typography specimens — built once in Figma, translated 1:1 into the React component layer. No component gets built in code without a Figma reference existing first.
- **Motion Reference boards** — for cinematic beats too complex to spec in text (camera paths, transition choreography from Part 4), Figma prototypes or annotated frame sequences act as the storyboard Theatre.js timelines are built against.
- **Asset organization** — every texture/material reference gets a page and a naming convention *before* it's imported into the 3D pipeline, satisfying Part 8's asset-pipeline requirement ("optimize, rename consistently, organize, document origin").

This closes a real gap: previously "visual identity" existed only as prose. Figma gives it a versioned, inspectable, collaborative source of truth — which also means future collaborators (if Ahmed brings in another designer/dev) have something concrete to work from instead of re-reading eleven creative documents.

---

## 4. Skip / Return Logic (new system — did not exist in the original Bible)

**Principle:** Respect without breaking the spell. No visible "Skip Intro" button — that's a website-logic solution to a cinema-logic problem.

- **First visit:** full Prologue → Threshold → City → Origin sequence plays.
- **Any deliberate interaction** (scroll, drag, tap-and-hold) during the sequence is read as *intent to proceed* — the camera and Theatre.js timeline accelerate toward the next chapter boundary rather than fighting the visitor. This stays diegetic: the world responds to curiosity, exactly as Part 3 demands, rather than exposing a UI escape hatch.
- **Return visits:** a `localStorage` flag (`hebra_journey_seen`) triggers a **compressed Overture** — roughly 20–30 seconds, hitting the emotional beats (light → object → one sentence → transition) without the full four-minute journey — before landing at the functional site with full chapter navigation unlocked.
- **Direct deep links** (e.g., a client returning to review a proposal) skip straight to the functional layer with a minimal ambient loader — no journey replay at all.

This single system resolves the biggest contradiction I flagged earlier without touching the philosophy: mystery is preserved for first contact, respect is preserved for return visits.

---

## 5. Reduced Motion — a real second experience, not a CSS toggle

Per Part 11, `prefers-reduced-motion` cannot mean "same experience, slightly slower." It means:
- Camera moves are replaced with **cuts on emotional beats** rather than continuous motion.
- Particle systems render as **static or near-static compositions** at key frames instead of animating.
- All narrative content (the sentences from Parts 1–3) remains fully present — reduced motion never removes story, only removes motion.
- This is a genuinely separate Theatre.js timeline branch, built and tested on its own — not a global animation-speed multiplier.

---

## 6. Progressive Loading — loading as narrative, not a spinner

Per Part 11 ("loading is part of the story"): the Prologue's first 8–12 seconds (distant star, silence, breathing darkness) are **deliberately lightweight** — minimal geometry, no heavy textures — so they can render before the rest of the experience finishes streaming in. Heavier assets (monolith geometry, city architecture, Origin sphere shader) load progressively *behind* that opening beat. The visitor is never staring at a progress bar; they're staring at the story's first frame while the rest arrives.

---

## 7. Analytics — measuring without betraying the voice

Tracked, privacy-respecting, no third-party ad pixels:
- Chapter reached (Prologue / Threshold / City / Origin / Functional site)
- Skip-forward triggered (and at which chapter)
- Return-visit compressed-overture completion
- Device quality tier assigned (see §9)
- Time-to-first-interaction on the functional site (services/pricing/contact)

This directly answers the commercial risk I raised: we'll actually know whether visitors are reaching the services/pricing/contact layer, instead of guessing.

---

## 8. Service Discoverability — the fix for "lore eating the brand"

Per Part 9, services must be *discovered*, not interrupted upon. Concretely:
- Chapter 3 (The City, 02:40) already stages six rooms representing disciplines — now formally named The Creation Zone, The Identity Zone, The Architecture Zone, The Technology Zone, The Imagination Zone, and The Legacy Zone per the Canonical Naming Architecture (docs/bible/26 §3) — these become **real navigable anchors**, not just atmosphere. A visitor who wants to skip ahead can jump directly to a Discipline Zone.
- A persistent, minimal wayfinding affordance (not a traditional navbar — a single glyph, per Part 10: "the symbol should appear rarely, never everywhere") gives access to Services / Pricing / Contact at any point after the Prologue, satisfying "confidence, not urgency" from Part 9.
- The functional layer (post-Origin) is built with the same discoverability rigor as any high-converting site — clear service architecture, custom-quotation pricing tiers, direct contact — just wrapped in HEBRA's voice, never generic agency language.

---

## 9. Mobile Parity Strategy — 90–95%, not "mobile-lite"

This is the most consequential decision in this document, so it gets its own system.

### 9.1 Adaptive Quality Tiers (not device-type branching)
Quality is decided by **measured device capability**, not by `isMobile` boolean:
- On boot, a short capability probe runs: GPU tier detection (via `renderer.info` / WebGL extension support), device memory (`navigator.deviceMemory`), and a one-frame render-cost sample.
- Result maps to one of three tiers — **Tier A (full)**, **Tier B (high, ~90–95%)**, **Tier C (adaptive-safe floor)** — independent of whether the device is a phone, tablet, or laptop. A high-end phone can land on Tier A. An old laptop can land on Tier C.
- `drei`'s adaptive DPR/adaptive-performance utilities drive **continuous** adjustment during runtime, not just a one-time decision — if frame time degrades mid-scene, quality steps down gracefully (per Part 8: "degrade elegantly, never catastrophically") and steps back up if headroom returns.

### 9.2 What actually changes between Tier A and Tier B (the 90–95% target)
Exactly the categories the direction called out as acceptable — nothing else:
- Particle counts reduced (not removed) — e.g., Origin sphere symbol-density scaled, never the symbol *concept* removed.
- Shadow map resolution stepped down one notch.
- Shader loop iterations reduced (e.g., fewer raymarch steps in volumetric fog) while keeping the same visual language.
- Post-processing quality (bloom kernel size, SSR sample count) reduced, not disabled.

**Never on the table for Tier B:** disabling shaders outright, removing volumetrics, removing reflections, replacing a scene with a static image, or cutting a chapter. Tier C (very low-end fallback) is the only tier permitted to make a structural simplification, and even then it preserves reduced-motion-style narrative cuts rather than a "basic website."

### 9.3 Touch-native interaction, not desktop-ported
Per Part 3, mobile physics are their own system (`use-gesture` handles this cleanly): pressure, ripple, momentum — never a cursor-parallax system awkwardly mapped to touch position.

---

## 10. Updated Implementation Roadmap

0. **Figma foundation** — tokens, glyph system v1, component specimens, motion boards for the Prologue.
1. **Engineering scaffold** — R3F canvas, Theatre.js project wiring, Zustand store (chapter/quality-tier/audio state), Zod-validated content schema, adaptive quality-tier probe.
2. **Prologue (00:00–01:00)** — built and reviewed in isolation, including the compressed-overture branch and reduced-motion branch from day one, not retrofitted later.
3. **Threshold (01:00–02:00)** → **City (02:00–03:00)** → **Origin (03:00–04:00)** — each shipped with its Tier A/B behavior and skip-forward acceleration working, each reviewed before the next begins.
4. **Functional layer** — services/pricing/process/contact, wayfinding glyph, built with the discoverability rigor of §8.
5. **Tone.js audio layer** — layered in against finished visuals, spatial and interaction-responsive, synced to Theatre.js cues.
6. **Analytics + reduced-motion QA + cross-tier performance pass** — last mile, not an afterthought.

Each phase still stops for review before the next begins, per the original working agreement.

---

*This document is now part of the permanent Creative Bible. Nothing above changes the vision from Parts 1–11 — it defines how that vision gets built without betraying performance, accessibility, or the visitor's time.*

**Awaiting: "BEGIN IMPLEMENTATION"**
