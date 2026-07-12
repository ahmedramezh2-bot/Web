# HEBRA MASTER PRODUCTION BIBLE

## THE COLOR BIBLE

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Color is narrative. Color is psychology. Color is memory.

This document defines HEBRA's complete color system — not a swatch sheet, but the emotional logic that determines which colors are permitted to appear, where, and why. Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is read together with the Lighting Bible (§4, Color Temperature, which this document formalizes into a full palette) and the Rendering Bible (§2, Color Management, which is responsible for rendering this document's colors faithfully).

====================================================

## 1. COLOR PHILOSOPHY

Color in HEBRA is never chosen for visual interest alone. Every color traces to one of two sources: a Lighting Bible Light Identity (Lighting Bible §2) or a Material Bible family's Visual Identity (Material Bible §4) — color is a *consequence* of what is emitting or reflecting light, never an independent decorative layer painted on top.

This is the direct color-system expression of Appendix D's forbidden "gradient overload," "RGB gaming effects," and "neon cyberpunk aesthetics" — a palette with no traceable physical or emotional source is, by definition, decoration, and HEBRA's color system exists specifically to prevent that.

====================================================

## 2. COLOR IDENTITY

HEBRA's overall color identity is restrained and cool-leaning by default (cross-reference Lighting Bible §4's "Cold" as the default register for Void and most Traveling state), with warmth strictly rationed for arrival, understanding, and intimacy (Origin, Threshold's resolution) — exactly mirroring the Lighting Bible's Color Temperature table. A visitor should be able to describe HEBRA's overall color identity in one sentence, the same test the Camera Bible applies to its own identity (Camera Bible §2).

====================================================

## 3. PRIMARY PALETTE

The primary palette is the smallest set of colors capable of rendering every Light Identity in the Lighting Bible (§2) and every Material family's dominant tone in the Material Bible (§3) — anchored around near-black (Obsidian-adjacent), near-white (White Stone-adjacent), and a small number of desaturated neutrals that carry most of the world's surface area. The primary palette is deliberately unglamorous; it is the palette the *accent* colors (§5) are set against.

====================================================

## 4. SECONDARY PALETTE

A slightly wider set of desaturated, chapter-adjacent neutrals — the color-system expression of the Lighting Bible's per-Dialect registers (Lighting Bible §8, cross-referenced against the Canonical Naming Architecture, docs/bible/26 §4). The secondary palette shifts subtly per Environmental Dialect without ever introducing a fully new hue family — The Attentive Dialect's secondary palette and The Hushed Dialect's secondary palette are recognizably related, not visually unrelated the way two different brands' palettes would be.

====================================================

## 5. ACCENT COLORS

The rationed, high-impact colors — reserved specifically for Energy Light (Lighting Bible §2), Origin Light, and Living Light identities. Accent colors are used exactly as sparingly as the Camera Bible rations its Spiral move (Camera Bible §8) or the FX Bible rations Gravity Distortion (FX Bible §2) — an accent color appearing too frequently stops being an accent and becomes wallpaper, which is the single fastest way to violate Appendix D's forbidden "neon everywhere."

====================================================

## 6. EMOTIONAL MAPPING

Every color in the palette (§3–§5) is mapped to the same emotional vocabulary the Camera Bible uses for its dialects (Camera Bible §4: Curiosity, Wonder, Discovery, Understanding, Respect, Hope) — a color is never introduced without an answer to "which of these emotions does this color serve." This mapping is what keeps the palette from drifting into decoration over time as new content is added.

====================================================

## 7. CHAPTER COLORS

Cross-referenced directly against Camera Bible §4 and Lighting Bible §4: each of the six Story Registry chapters (Void, Monument, Fragments, Origin, Awakening, Threshold) has an authored color signature drawn from the Primary and Secondary palettes (§3–§4) with a chapter-specific accent allowance (§5). Void's signature is the coldest and most desaturated in the experience; Origin's is the warmest and most saturated; the five chapters between them form a legible gradient rather than six unrelated moods.

====================================================

## 8. LIGHTING INTERACTION

Color values in this document are defined and validated in the same linear, ACES-informed working space the Rendering Bible establishes (Rendering Bible §2) — a color that looks correct only after display-referred gamma correction has been informally "eyeballed in" is not a validated color under this system. Every Primary and Secondary palette entry is checked under at least the three most common Light Identities it will actually be seen under (Lighting Bible §13's mutual-dependency principle, applied here from the color side).

====================================================

## 9. MATERIAL INTERACTION

A color is never assigned to an object independently of that object's Material Bible family (Material Bible §3) — Obsidian's near-black is not "chosen," it is a direct consequence of that family's Visual Identity (Material Bible §4). Where a Material family's own described color and this document's palette would conflict, the Material Bible's physically-grounded description wins, and this document's palette is revised to match, never the reverse.

====================================================

## 10. ACCESSIBILITY

Every text-and-background color pairing arising from the Typography Bible's roles (Typography Bible §2) meets a legible contrast ratio without leaving the authored palette (§3–§5) — cross-referenced directly against UI Integration Bible §10's standing rule that accessible contrast is achieved *within* HEBRA's identity, never by breaking from it. Where the authored palette genuinely cannot produce a legible pairing for Functional-role content (Typography Bible §2), a validated high-contrast variant is authored as an explicit accessibility branch, mirroring the Camera Bible's Reduced Motion branch pattern (Camera Bible §16) rather than as a silent, unreviewed exception.

====================================================

## 11. CONTRAST

Beyond accessibility minimums, contrast is used compositionally, cross-referenced against Lighting Bible §11's Atmospheric Perspective — near/far and important/ambient visual hierarchy is reinforced through color contrast exactly as it is through light contrast, cooperating with the Camera Bible's foreground/midground/background framing discipline (Camera Bible §20) rather than working independently of it.

====================================================

## 12. FUTURE EXPANSION

New chapters, discipline rooms, or Light Identities introduced after this document's authorship inherit the Primary/Secondary/Accent structure (§3–§5) as their base grammar, defining a new chapter-specific signature (§7) rather than inventing a new palette structure from nothing — mirroring the Camera Bible's own Future Expansion discipline (Camera Bible §26) verbatim. Any proposed new *hue family* (as opposed to a new signature drawn from the existing families) is treated with the same review weight as a Camera Philosophy amendment, since it changes the grammar every future room draws from.

====================================================

## 13. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**Film Color Science** — study how color grading communicates mood and narrative progression across a film's runtime without the palette becoming arbitrary, informing §6 and §7.

**Color Psychology** — studied for principle, never for generic "blue means calm" cliché — every emotional mapping in §6 is validated against HEBRA's own specific Camera Bible dialects, not against a generic psychology chart.

**Museum Design** — studied for how color is used to support, never compete with, precious or historic objects on display, informing §9's material-first discipline.

**Luxury Branding** — studied for restraint and rationing of high-impact color, informing §5's Accent Color discipline.

**ACES Workflow** — studied for the technical color-management foundation this document assumes, cross-referenced against Rendering Bible §2.

**Official documentation** — studied for the same reason, never for a ready-made palette or design-system color tokens.

Extract principles. Never imitate.

====================================================

## 14. COLOR OATH

I am never chosen for visual interest alone. I trace to a light or a material, always.

I am restrained by default. My warmth is earned, not given freely.

I am rationed where I am loud. An accent that appears everywhere has stopped being an accent.

I know which chapter I belong to, and my signature tells the truth about that chapter's place in the story.

I am accessible without abandoning my identity — a legible pairing is still recognizably HEBRA's palette.

I am never neon, never gradient-for-its-own-sake, never RGB. Every future hand that chooses a color for HEBRA inherits this oath before it inherits any hex code.

====================================================

## 15. COLOR CHECKLIST

- [ ] Does this color trace to a Light Identity (Lighting Bible §2) or Material family (Material Bible §3), per §1?
- [ ] Does it belong to the Primary, Secondary, or Accent palette per §3–§5, used at the correct rarity?
- [ ] Does it map to a named emotion per §6?
- [ ] Does it match its chapter's authored signature per §7, or deliberately and legibly break from it?
- [ ] Has it been validated under multiple Light Identities per §8?
- [ ] Does it meet contrast requirements per §10 without leaving the authored palette?

====================================================

## 16. COLOR CHECKLIST (PRODUCTION)

*(Production Approval Checklist)*

- [ ] Research principle extracted and logged per §13, never a copied palette.
- [ ] Cross-checked against Material Bible §4 for the object it's assigned to, per §9.
- [ ] Accessibility reviewed per §10 as a first-class requirement.
- [ ] Final Test (Appendix E): with all reference material hidden, does this palette still feel unmistakably HEBRA's?

If every box is checked, color work may proceed to Creative, Engineering, and Identity Review per the Production Roadmap. If any box is unchecked, the work returns to this document, not to the color picker.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
