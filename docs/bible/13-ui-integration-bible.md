# HEBRA MASTER PRODUCTION BIBLE

## THE UI INTEGRATION BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

HEBRA does not have an interface. HEBRA reveals information through the world itself.

The UI must feel like part of the civilization. Never like software. This document defines how information, navigation, and business content exist inside HEBRA without ever collapsing the experience into a website wearing a 3D skin.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is read together with the Camera Bible (whose presence-response philosophy, §12/§22, this document's interaction language must not duplicate or contradict) and the future Typography, Color, and Design Token Bibles, which this document's typography and interaction sections anticipate.

====================================================

## 1. UI PHILOSOPHY, IDENTITY, HIERARCHY, LIFECYCLE, VISIBILITY, PRESENCE

**UI Philosophy.** Interface exists only where the world cannot carry meaning on its own. Every piece of UI is a last resort, chosen only after the Camera, Lighting, and World Blueprint Bibles have been asked, and have failed, to communicate the same thing diegetically.

**UI Identity.** Where UI must exist, it carries HEBRA's material and lighting language (cross-reference Material Bible §3, Lighting Bible §2) rather than a separate, software-native visual system — a panel is a surface of the civilization, not a browser element floating above it.

**UI Hierarchy.** Primary Information (§4) may use the most world-integrated, least conventional presentation. Secondary and Temporary Information use progressively more conventional, more legible presentation as their functional urgency increases — clarity is allowed to win over immersion only at the point where confusion would otherwise cost the visitor something real (being lost, being unable to complete a genuine task).

**UI Lifecycle.** Interface elements are born and die the way world objects are (cross-reference Animation Bible §3's Recovery field) — no UI element simply appears or disappears without an authored transition (§9).

**UI Visibility.** Nothing is visible until it is relevant. Appendix D's forbidden persistent navigation bars and dashboard chrome are the direct consequence of this rule.

**UI Presence.** The interface never announces itself as being "on" — a visitor should never be able to point to a single moment and say "this is where the website part starts."

====================================================

## 2. THE INTERFACE

**The interface never interrupts.** No modal, no blocking overlay, no forced pause breaks the Camera Bible's authored pacing (Camera Bible §7, §9) for a UI reason.

**The interface never covers the experience.** UI never occupies screen-center or obscures a Camera Bible Observing-state hero subject (Camera Bible §6) — it is composed around the world, never on top of it as a separate layer competing for the same space.

**The interface appears only when earned.** Cross-referenced against §1's Visibility rule and the World Blueprint's Hidden Discovery System (World Blueprint §9) — information is revealed at the moment the visitor's actions or progress make it relevant, never pre-loaded as a permanent fixture "just in case."

====================================================

## 3. INFORMATION LAYERS

- **Primary Information** — the single most important thing the visitor needs at this moment (a Story Chapter's name, a Discipline Zone's identity — per the Canonical Naming Architecture, docs/bible/26) — presented with the most world-integrated treatment.
- **Secondary Information** — supporting detail, presented only on deliberate visitor attention (proximity, hover, hold) rather than by default.
- **Hidden Information** — cross-referenced directly against World Blueprint §9 — surfaced only through discovery, never through a UI toggle.
- **Contextual Information** — appears only in relation to a specific object or location currently in frame, and disappears when that object or location leaves relevance.
- **Persistent Information** — the smallest possible set of information that must remain available across an entire visit (if any); every persistent element must justify its permanence against §1's Visibility rule.
- **Temporary Information** — confirmation or status information with an authored, finite lifetime, never left on screen indefinitely.

====================================================

## 4. NAVIGATION

**How visitors understand where they are** — through World Blueprint Landmarks (World Blueprint §3) and Lighting Bible §8 environmental dialects functioning as wayfinding, reinforced by Contextual Information (§3) only when the world's own visual language is insufficient alone.

**How visitors understand where they came from** — through the Camera Bible's Chapter/World/Environment Transition vocabulary (Camera Bible §8) making passage itself memorable, rather than through a breadcrumb UI element.

**How visitors understand where they can go** — through Lighting Bible §12's navigation-through-light principle and World Blueprint §2's path design, never through a map overlay or menu.

**Without traditional navigation bars.** The standing constraint underlying this entire section — cross-referenced against Appendix D's forbidden Website Clichés (fullscreen slogans, template navigation) and this document's own §8 Forbidden UI list.

====================================================

## 5. BUSINESS INTEGRATION

**Services, Projects, Career Boost, About, Contact — the Level 4 Business Destinations per the Canonical Naming Architecture (docs/bible/26 §5).**

Every business element must emerge naturally from the world. Never feel inserted. Never feel like a landing page.

Cross-referenced directly against the Canonical Naming Architecture's six Level 2 Discipline Zones (The Creation Zone, The Identity Zone, The Architecture Zone, The Technology Zone, The Imagination Zone, The Legacy Zone, docs/bible/26 §3) — business content lives *inside* those Zones as world content with World Blueprint §5 required fields (Purpose, Story Role, Emotional Role) of its own, never as a separate "business mode" bolted onto the cinematic experience. Each Business Destination's specific host Zone is fixed in docs/bible/26 §3's table — Career Boost lives in The Legacy Zone, About and Contact live in The Identity Zone, and so on — never left ambiguous per-implementation.

A Services page, in HEBRA, is not a page — it is a Zone the visitor walks into, whose Purpose (World Blueprint §5) happens to be commercial, authored with exactly the same rigor as a Monument's Purpose.

====================================================

## 6. TYPOGRAPHY

**Typography as architecture.** Type is placed and scaled the way structural elements are placed in the World Blueprint — with hierarchy, purpose, and spatial logic — not laid out on a flat document plane.

**Typography as light.** Cross-referenced against Lighting Bible §5's Symbols — type can itself be a light source or a lit object within the world, never merely an HTML overlay indifferent to the scene's illumination.

**Typography as sculpture.** Where type appears at Landmark or Monument scale, it is held to World Blueprint §7's silhouette and recognizability standards.

**Typography as guidance.** Cross-referenced against §4's Navigation section — type may reinforce wayfinding, but never substitutes for the world's own diegetic navigation cues.

Full typographic system (typeface selection, scale, weight, spacing, rhythm, bilingual handling) is deferred to the dedicated Typography Bible; this section defines only *how* type behaves as a UI citizen of the world.

====================================================

## 7. INTERACTION

**Hover, Touch, Focus, Selection, Discovery, Activation, Completion** — the complete interaction-state vocabulary.

Every interaction must belong to the civilization — cross-referenced directly against Appendix D's forbidden generic hover/scale/ripple interactions. A hover state in HEBRA responds the way an object in the World Blueprint would respond to attention (cross-reference Animation Bible §6's Visitor Presence reaction), never with a generic CSS transform.

**Discovery** and **Activation** states are distinguished by consequence — Discovery is passive noticing (cross-reference World Blueprint §9); Activation is a deliberate visitor choice with a lasting effect, and always carries a distinct, non-generic feedback treatment (cross-reference Animation Bible §7's Discovery transition and FX Bible §8's Discovery FX).

**Completion** states close a loop the visitor opened (finishing a Contextual Information read, completing a business-room interaction) and are the primary trigger for Temporary Information's authored lifetime (§3).

====================================================

## 8. PANELS

**Information Panels, Story Panels, Project Panels, Service Panels, Contact Panels.**

Every panel should emerge from the world. Never appear as floating web cards.

A panel's material and lighting treatment is drawn from Material Bible §3 and Lighting Bible §2 exactly like any other world surface — cross-reference §1's UI Identity rule. Where a panel must present dense information (Contact, Service), its typographic hierarchy (§6) is allowed to become more conventional than a Story Panel's, mirroring §1's Hierarchy rule that clarity may win as functional urgency increases.

====================================================

## 9. TRANSITIONS

**Reveal, Dissolve, Expansion, Materialization, Energy, Memory, Architecture.**

UI transitions draw their vocabulary directly from the Camera Bible's transition language (Camera Bible §8, §24) and the FX Bible's Transition FX (FX Bible §8) rather than inventing a separate, software-native transition system (fades, slides, standard easing curves with no world-grounding).

**Materialization** and **Energy** transitions are reserved for UI elements tied to Energy Objects or Sacred content (cross-reference Asset Production Bible §2); **Memory** transitions are reserved for content tied to Memory Spaces (World Blueprint §4) — the same rationing discipline the Camera Bible applies to its rarest moves (Camera Bible §8's Spiral) applies here to keep these transitions meaningful.

====================================================

## 10. ACCESSIBILITY

**Keyboard, Reduced Motion, Readable Typography, Contrast, Screen Readers, Accessible Navigation — without breaking immersion.**

Reduced Motion for UI elements follows the same authored-branch principle the Camera Bible establishes for camera motion (Camera Bible §16, §25) — never a blanket speed multiplier.

Screen Reader and Keyboard support is authored as a parallel, equally-considered path through the same World Blueprint locations and Information Layers (§3) — never a stripped-down "accessible mode" that abandons HEBRA's identity, and never an afterthought bolted on after the visual system is finished.

Contrast and Readable Typography requirements are treated as hard constraints on the Color and Typography Bibles, not exceptions to them — an accessible contrast ratio is achieved within HEBRA's authored palette, never by breaking from it.

====================================================

## 11. PERFORMANCE

Bound by Appendix F without exception.

**Animation Budget** — UI transitions (§9) share the same GPU/CPU discipline as world Animation and FX (Animation Bible §9, FX Bible §10), never a separate unbudgeted layer.

**Layout Budget** — UI computation (layout, text measurement) is kept off the main render thread's critical path wherever possible, protecting the frame budgets Appendix F establishes for camera and world rendering.

**Rendering Budget** — UI elements rendered in-world (§1's UI Identity) are counted against the same draw-call ceilings as any other world geometry, never treated as a "free" overlay layer.

**Memory Budget** — UI assets (fonts, icon geometry) are budgeted against Appendix F's bundle-size targets, lazy-loaded per business room (§5) rather than bundled globally.

**Desktop / Mobile** — mobile UI simplifies interaction affordances (§7) before it simplifies visual identity (§1) — a touch-adapted interaction still looks like HEBRA even where its mechanics differ, mirroring the Camera Bible's Mobile Input Language philosophy (Camera Bible §13).

====================================================

## 12. FORBIDDEN UI

Per Appendix D's standing authority:

- **Floating Cards** — any panel with no world-grounded material or lighting treatment (§1, §8) is forbidden.
- **Glassmorphism Templates** — cross-reference Appendix D verbatim.
- **Dashboard Layouts** — persistent multi-panel software chrome is forbidden outright.
- **Generic Buttons** — an interactive element with no world-material identity (§7) is forbidden.
- **Cookie Banner Style UI** — any intrusive, blocking, non-diegetic overlay is forbidden (cross-reference §2's "never interrupts" rule).
- **Landing Page Sections** — cross-reference Appendix D's Website Clichés and this document's §5, Business Integration.
- **Template Navigation** — cross-reference §4 verbatim.

====================================================

## 13. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Apple HIG, Material Design** — studied for interaction-pattern rigor and accessibility discipline, never for visual style to be imitated (cross-reference Appendix D's "never imitate: Apple").

**AAA Game UI** — studied specifically for diegetic and spatial UI technique — interfaces that exist as part of a game world rather than as an overlay — directly informing §1 and §8.

**Film Title Design** — studied for how typography can carry emotional and narrative weight without behaving like software text, informing §6.

**Interactive Installations** — studied for how physical, spatial exhibits present information without conventional UI at all, informing §1's Philosophy.

**Figma, official documentation** — studied for accessibility and interaction-pattern technique only, per Appendix D and Appendix E, never for ready-made component kits.

Extract principles. Never imitate.

====================================================

## 14. UI OATH

I am not software. I am the civilization, speaking when the world alone cannot.

I appear only when I am earned, and I disappear the moment I am no longer relevant.

I never cover the experience. I never interrupt what the camera and the world are already saying.

I wear HEBRA's materials and HEBRA's light. I am never a floating card borrowed from somewhere else.

I am accessible without abandoning my identity — a visitor using a keyboard or a screen reader still experiences HEBRA, not a stripped-down substitute.

I hold my performance budget without losing my presence — a cheaper version of me still belongs to this world.

I am never a dashboard, never a cookie banner, never a template. Every future hand that builds an interface for HEBRA inherits this oath before it inherits any component library.

====================================================

## 15. UI REVIEW CHECKLIST

- [ ] Has every non-diegetic option been ruled out before this UI element was proposed, per §1?
- [ ] Does it use the correct Information Layer treatment from §3?
- [ ] Does its navigation role, if any, avoid traditional navigation-bar patterns per §4?
- [ ] If it's business content, does it emerge from a World Blueprint room per §5, not float above one?
- [ ] Does its typography behave as world citizen per §6, not flat overlay text?
- [ ] Does its interaction vocabulary belong to the civilization per §7?
- [ ] Does its transition draw from Camera Bible/FX Bible vocabulary per §9, not a generic UI easing curve?
- [ ] Is it accessible per §10 without breaking immersion?
- [ ] Has it been checked individually against every bullet in §12?
- [ ] Does it hold Appendix F's rendering and memory budgets per §11?

====================================================

## 16. UI REVIEW CHECKLIST (PRODUCTION)

*(Production Approval Checklist)*

- [ ] Purpose and Information Layer are written down before the element is visually finalized.
- [ ] Research principle extracted and logged per §13, never a copied reference.
- [ ] Accessibility reviewed against §10 as a first-class requirement, not a final pass.
- [ ] Performance reviewed against Appendix F on both desktop and mobile targets.
- [ ] Final Test (Appendix E): with all reference material hidden, does this interface still feel unmistakably HEBRA's, and not like software?

If every box is checked, UI work may proceed to Creative, Engineering, Performance, Accessibility, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the component library.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
