# HEBRA MASTER PRODUCTION BIBLE

## THE TYPOGRAPHY BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Typography is architecture. Typography is guidance. Typography is emotion.

Every letterform in HEBRA is held to the same standard as a monument in the World Blueprint — it must be placed with purpose, scaled with intent, and never present simply because text needed to go somewhere. This document defines the complete typographic system.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is read together with the UI Integration Bible (§6, which this document expands in full) and the Color and Design Token Bibles, which consume this document's scale and rhythm values as tokens.

====================================================

## 1. TYPOGRAPHY PHILOSOPHY

Type in HEBRA is never neutral. Every choice of scale, weight, and placement is a directorial decision with the same weight as a camera framing choice (cross-reference Camera Bible §20, Visual Composition).

**Typography as architecture** — type is composed spatially, with hierarchy and structure, the way the World Blueprint composes a location (World Blueprint §5) — never laid flat on an assumed document plane.

**Typography as guidance** — cross-referenced against UI Integration Bible §4's Navigation section; type may reinforce wayfinding but never substitutes for the world's own diegetic cues.

**Typography as emotion** — type's weight, scale, and rhythm shift with the Camera Bible's chapter dialects (Camera Bible §4) the same way lighting temperature does (Lighting Bible §4) — Void-chapter type reads colder and sparser than Origin-chapter type, without either changing its underlying typeface identity.

Typography exists to create architecture, per Appendix D's standing prohibition on decorative, attention-seeking type (huge hero headlines, ultra-bold everything, random italic emphasis) — every typographic decision is judged first against whether it builds structure and hierarchy, never against whether it looks striking in isolation.

====================================================

## 2. HIERARCHY

A fixed, small set of typographic roles, mirroring the UI Integration Bible's Information Layers (UI Integration Bible §3):

- **Primary** — reserved for Primary Information (UI Integration Bible §3); the largest scale, the most spatially deliberate placement, used sparingly.
- **Secondary** — supporting detail, smaller scale, more conventional placement, appearing only on deliberate attention per UI Integration Bible §3.
- **Contextual** — tied to a specific object or location in frame, disappearing when that context leaves relevance, matching UI Integration Bible §3's Contextual Information exactly.
- **Functional** — the most conventional, most legible register, reserved for business-room content (UI Integration Bible §5) where clarity must win over immersion per UI Integration Bible §1's Hierarchy rule.

No fifth role may be introduced without amending this section explicitly — a proliferation of ad hoc type roles is itself a hierarchy failure.

====================================================

## 3. SCALE

Scale follows a single, deliberate ratio system (a modular scale) rather than arbitrary per-instance sizing, so that every typographic size in HEBRA relates mathematically to every other one. Hero/Primary scale is reserved for the same rarity the Camera Bible reserves its Spiral move for (Camera Bible §8) — used at a chapter's single most important textual moment, not routinely.

Scale shifts across breakpoints (§12, cross-reference Design Token Bible §2's Breakpoints token category) proportionally, never by simply substituting a different, unrelated size at each breakpoint — the modular relationship between roles (§2) must survive every screen size unchanged.

====================================================

## 4. WEIGHT

A small, deliberate set of weights — never the full range a variable font technically offers. Heavier weights are reserved for Primary role (§2) and used exactly as sparingly as Appendix D's forbidden "ultra-bold everything" rule implies they should be. Lighter weights carry most of Secondary and Contextual content, keeping HEBRA's typographic voice restrained rather than shouting.

====================================================

## 5. SPACING

Letter-spacing and word-spacing are treated as architectural parameters, not defaults left at a typeface's shipped values. Primary-role type (§2) at large scale typically tightens tracking slightly, consistent with premium editorial practice (cross-reference §9's research); Functional-role type at small scale opens tracking slightly for legibility, mirroring the same principle museum wall-text and signage systems use.

====================================================

## 6. RHYTHM

Vertical rhythm (line-height, spacing between typographic blocks) follows the same house easing and pacing discipline the Camera Bible applies to motion (Camera Bible §7) — consistent baseline spacing within a role, deliberately varied spacing between roles, so that a block of type reads with the same "no two consecutive beats identical" texture the Camera Bible requires of motion, expressed here as considered, non-mechanical spacing rather than uniform grid filler.

====================================================

## 7. GRID

Type is placed on a spatial grid that is a typographic expression of the World Blueprint's own spatial hierarchy (World Blueprint §1) rather than a conventional 12-column web grid imported wholesale. Where type appears in-world (cross-reference UI Integration Bible §6), its grid is derived from the camera's current framing (Camera Bible §20) rather than a fixed screen-space grid, so text composition follows the same rule-of-thirds and negative-space discipline the camera itself follows.

====================================================

## 8. ALIGNMENT

Left-alignment is the default for Functional and Secondary roles, matching conventional reading patterns where clarity is the goal (UI Integration Bible §1's clarity-when-earned rule). Primary-role type is permitted centered or asymmetric alignment specifically at "arrival" beats, mirroring the Camera Bible's own centering-communicates-resolution principle (Camera Bible §20) — alignment choice is never decorative, it is always a legibility or emphasis decision.

====================================================

## 9. ENGLISH

The primary typeface family for English content is chosen (once implementation is authorized) against §11's research criteria — premium editorial and cinematic title-design character, high legibility at both Primary and Functional scale, and a genuinely distinct voice rather than a currently-fashionable system font (cross-reference Appendix D's "never imitate: Apple" — a typeface choice that reads as an obvious system-font default undermines Rendering Identity the same way an unmodified stock asset would).

====================================================

## 10. ARABIC

Arabic typography is treated as a first-class parallel system, not a translated afterthought of the English system. Arabic's own hierarchy, scale, and rhythm (§2–§6) are authored to feel equally premium and equally HEBRA-specific — never a directly mirrored Latin layout with Arabic glyphs substituted in. Bidirectional layout (RTL Arabic alongside LTR English or numerals) is planned for at the Hierarchy and Grid level (§2, §7) from the start, never retrofitted.

====================================================

## 11. NUMBERS

Numerals (dates, counts, any Functional-role numeric content per §2) use a typeface treatment distinct enough to remain legible at small scale even where the surrounding display type is stylistically expressive — numerals never sacrifice legibility for typographic personality, consistent with Functional role's clarity-first mandate (§2).

====================================================

## 12. ICONS

Icons, where they exist at all, are held to Asset Production Bible §2's Symbols category discipline rather than treated as a separate typographic afterthought — an icon is a small asset with its own Purpose and History (Asset Production Bible §3), never a generic icon-font glyph. Icons never substitute for a Primary or Secondary typographic role; they support Functional and Contextual content only, per UI Integration Bible §7's interaction vocabulary.

====================================================

## 13. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Premium editorial systems** — study high-end print and digital editorial typography for hierarchy discipline and restrained scale/weight use, informing §2–§4.

**Museum typography** — study wall-text and signage systems for how clarity and premium character coexist, informing §5 and §9.

**Apple, Google** — studied for technical rigor (variable fonts, accessibility, internationalization) only, never for visual style, per Appendix D's explicit "never imitate: Apple" rule.

**Swiss design** — studied for grid discipline and typographic hierarchy as a systematic practice, informing §7.

**Cinematic title design** — studied for how typography carries emotional weight without behaving like software text, informing §1 and §6, cross-referenced against UI Integration Bible §6's identical research note.

**Official documentation** — studied for font-loading and internationalization technique only, never for ready-made type systems.

Extract principles. Never imitate.

====================================================

## 14. TYPOGRAPHY OATH

I am architecture, not decoration. I am placed with the same intent as a monument.

I never shout. My scale and weight are earned, not defaulted to the loudest option available.

I guide without replacing the world's own way of guiding — I support wayfinding, I do not become it.

I hold my hierarchy strictly — four roles, never a fifth invented casually.

I treat Arabic as a first-class voice, never a mirrored afterthought.

I hold my legibility at every scale, especially where numerals and small Functional text must simply be read correctly.

I am never a system font wearing a fashionable weight. Every future hand that sets type for HEBRA inherits this oath before it inherits any font file.

====================================================

## 15. TYPOGRAPHY CHECKLIST

- [ ] Does this typographic instance use one of the four roles in §2, correctly matched to its Information Layer (UI Integration Bible §3)?
- [ ] Does its scale follow the modular system in §3 rather than an arbitrary size?
- [ ] Is its weight restrained per §4, avoiding Appendix D's forbidden "ultra-bold everything"?
- [ ] Does its spacing and rhythm follow §5–§6 rather than shipped typeface defaults?
- [ ] Does its grid placement derive from World Blueprint/Camera Bible framing per §7, not a generic web grid?
- [ ] Is its alignment a legibility or emphasis decision per §8, never decorative?
- [ ] If Arabic, was it authored as a first-class parallel system per §10, not a mirrored translation?

====================================================

## 16. PRODUCTION APPROVAL CHECKLIST

- [ ] Research principle extracted and logged per §13, never a copied reference.
- [ ] Accessibility (contrast, legibility) reviewed against UI Integration Bible §10.
- [ ] Final Test (Appendix E): with all reference material hidden, does this typography still feel unmistakably HEBRA's?

If every box is checked, typography work may proceed to Creative, Engineering, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the type specimen sheet.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
