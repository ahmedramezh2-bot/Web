# HEBRA MASTER PRODUCTION BIBLE

## THE CONSTITUTION REVIEW PROTOCOL

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

Nothing enters production without passing this protocol.

Every document, every asset, every shader, every animation, every environment, every line of code, every interaction, every decision that will ever be made in HEBRA's name passes through this document before it is allowed to stand. This is the permanent review process of HEBRA — the process that makes every other Bible in this Constitution enforceable rather than merely aspirational.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document does not create new creative rules — it enforces the rules every other Bible in this Constitution has already made. Its first real duty, once written, is to formally process the findings of the Constitution Audit Report (`docs/bible/reports/constitution-audit-2026-07-12.md`), which this document's own Contradiction Detection and Missing Documentation Detection sections (§5, §6) were anticipated by and must now absorb.

====================================================

## 1. REVIEW PHILOSOPHY, HIERARCHY, APPROVAL AUTHORITY, PRODUCTION AUTHORITY, DECISION AUTHORITY, CONFLICT RESOLUTION

**Review Philosophy.** A deliverable is not finished when it looks finished. It is finished when it has been checked against every document that governs it and found consistent. Every Bible in this Constitution ends its own chapters with a Review Checklist and a Production Approval Checklist for exactly this reason — this document is what makes those checklists mandatory rather than optional.

**Review Hierarchy.** Mirrors the AI Development Protocol's Authority Hierarchy (AI Development Protocol §2) exactly, extended to all review, not only AI-originated work: Creative Director → Art Director → Technical Director → Lead Engineer → contributor. No review stage below Creative Director may grant final approval on a matter Appendix G reserves to the Creative Director.

**Approval Authority.** Rests with the role at the top of the Review Hierarchy relevant to the deliverable's category (§2) — a Lighting deliverable's Creative Review is owned by the Art Director tier unless escalated; a Camera deliverable's is owned by the Creative Director directly, given the Camera Bible's foundational role.

**Production Authority.** No deliverable proceeds to Integration (cross-reference Asset Production Bible §4) without Production Authority sign-off, which is granted only after every applicable Review Stage in §2 has returned "Production Ready" per §7's Approval System.

**Decision Authority.** Where a decision is genuinely novel — not resolvable by consulting an existing Bible — Decision Authority sits with the Creative Director per Appendix G, and the resulting decision is logged as a documentation amendment to the relevant Bible before implementation proceeds, never decided ad hoc and left undocumented.

**Conflict Resolution.** Where two Bibles conflict, resolution follows this order: (1) Appendix G always wins outright; (2) a document that explicitly claims authority over another on a named topic wins on that topic (the Camera Bible's preamble claiming authority over Part 4/5 on camera matters is the working example); (3) where no explicit authority claim exists, the more recent and more detailed document is treated as the working draft pending an explicit reconciliation amendment — never silently assumed to have won.

====================================================

## 2. REVIEW STAGES

Ten named stages, each fully defined per §3's required fields:

**Creative Review** — does the deliverable serve HEBRA's identity per Appendix G's Four (plus Fifth) Questions?

**Narrative Review** — does it serve the Story Registry and its current chapter's dialect (cross-reference Camera Bible §4)?

**Visual Review** — does it meet the visual standards of its governing Bible (Lighting, Material, FX, Rendering once written)?

**Technical Review** — is it architecturally sound per the Development Standards (once written) and the relevant Bible's Technical Direction section?

**Performance Review** — does it hold its budget per Appendix F and the Performance & Optimization Bible?

**Accessibility Review** — does it meet the accessibility requirements distributed across the Camera Bible (§16, §25), UI Integration Bible (§10), and Performance Bible (§8)?

**Identity Review** — does it pass the Final Test (Appendix E, restated in every new Bible's own closing checklist): with reference material hidden, is it unmistakably HEBRA?

**Consistency Review** — does it agree with every other Bible that governs adjacent territory, per §5 below?

**Architecture Review** — does it fit the World Blueprint, Asset Production pipeline, and Development Standards without requiring rework of existing systems (cross-reference Part 6's Architecture Rule)?

**Production Review** — the final gate; synthesizes every stage above into a single Approval System verdict per §7.

====================================================

## 3. EACH REVIEW MUST DEFINE

- **Purpose** — what this review stage is checking for.
- **Reviewer** — which Review Hierarchy (§1) role owns this stage.
- **Requirements** — the specific checklist items drawn from the deliverable's governing Bible.
- **Pass Conditions** — the explicit bar for passing.
- **Fail Conditions** — the explicit bar for failing, not merely "the inverse of passing" — some failures (a Camera Safety violation, an Appendix D forbidden pattern) are absolute and non-negotiable regardless of how the rest of the deliverable performs.
- **Common Mistakes** — a living list, updated as review experience accumulates, of the ways deliverables most often fail this stage.
- **Approval Criteria** — the specific conditions under which this stage may be marked passed with notes versus passed outright.

A review stage missing any of these seven fields is not yet operational and may not be used to gate production.

====================================================

## 4. CONSISTENCY VALIDATION

Every future document must be checked against the full governing set: Story Bible, Creative Bible, Visual Bible, Audio Bible, Engineering Bible, Camera Bible, Lighting Bible, Material Bible, Shader Bible, World Blueprint, Animation Bible, FX Bible, Audio Production Bible, Asset Production Bible, UI Integration Bible, Performance Bible, AI Development Protocol.

Per the Constitution Audit Report §4, three of the documents named in this list — **Shader Bible**, a formal **Story Bible**, and the informally-covered **Creative Bible**/**Visual Bible** (currently Part 1 and Part 2) — do not yet exist as dedicated, rigorously-structured documents. Until they do, Consistency Validation against them is performed against their closest existing equivalent (Part 1, Part 2, and the scattered shader-adjacent sections of Lighting/Material/FX respectively), and every such validation is logged as provisional pending those documents' eventual authorship.

====================================================

## 5. CONTRADICTION DETECTION

Detect: conflicting rules, repeated ideas, broken philosophy, architecture conflicts, performance conflicts, visual inconsistencies, story inconsistencies.

This section's first real task, upon this document leaving pre-production, is to formally process every contradiction already surfaced in the Constitution Audit Report — most urgently the four-scheme location-naming fragmentation (Audit §3.2), the two non-identical "no exceptions" Blender export chains (Audit §3.4), and Part 6's truncation (Audit §3.3). A contradiction is not considered "detected" by this protocol until it has an owner and a resolution path, not merely a citation — the Audit Report identified these; this Protocol is what would actually close them once implementation authorization is given.

====================================================

## 6. MISSING DOCUMENTATION DETECTION

Continuously identify missing production documents. Recommend new Bibles whenever the project evolves.

This section inherited the Constitution Audit Report's §4 findings as its baseline: a Shader Bible, a successor Interaction Bible (replacing Part 4's informal coverage the way the Camera Bible replaced Part 5's), and a formal Story/Lore Bible were the three highest-priority missing documents identified. **The Shader Bible is now closed** (`docs/bible/27`). The successor Interaction Bible and the formal Story/Lore Bible remain open, non-blocking, deferred items — see the Final Constitution Report for current status. This section's ongoing duty is to keep this list current as new gaps are discovered, not to treat any single report's list as final.

====================================================

## 7. QUALITY SCORING

Every deliverable receives scores for: Creativity, Originality, Identity, Engineering, Performance, Scalability, Maintainability, Accessibility, Production Readiness.

Scoring is qualitative-with-justification, not a bare number — every score is accompanied by the specific Bible section it was measured against, mirroring the Constitution Audit Report's own readiness-score methodology (Audit §6), which stated its reasoning rather than asserting a number in isolation. A score with no cited justification is not a valid score under this protocol.

====================================================

## 8. APPROVAL SYSTEM

Four states: **Rejected** (fails one or more Fail Conditions per §3, absolute); **Needs Revision** (fails Pass Conditions but not Fail Conditions — fixable and expected to return); **Approved with Notes** (passes, with logged Common Mistakes-adjacent observations that don't block production); **Production Ready** (passes every applicable Review Stage in §2 outright).

No deliverable may skip from Rejected or Needs Revision directly to Production Ready — it must pass back through every Review Stage its revision touched, mirroring the Asset Production Bible's pipeline discipline (Asset Production Bible §4) of never re-entering an earlier stage without explicit review.

====================================================

## 9. FINAL CONSTITUTION AUDIT

When requested in the future, perform a complete audit of the entire HEBRA Constitution, generating: Strengths, Weaknesses, Contradictions, Missing Areas, Production Risks, Future Recommendations, and an Overall Readiness Score (0–100).

The Constitution Audit Report produced alongside the AI Development Protocol (`docs/bible/reports/constitution-audit-2026-07-12.md`) is the first instance of this process and should be treated as this section's working template — its structure (Method, Strengths, Contradictions, Missing Documents, Recommendations, Readiness Score) is the model every future Final Constitution Audit should follow, updated and re-scored rather than replaced outright.

====================================================

## 10. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**AAA Production Pipelines, Film Production Pipelines** — studied for how large productions structure multi-stage sign-off without becoming bureaucratic theater, informing §2 and §8.

**Software Architecture Reviews, Design Review Processes** — studied for how technical and creative review are conventionally separated and reconciled, directly informing §1's Conflict Resolution order.

**Official documentation** — studied for the same reasons, never for a ready-made review-process template adopted unmodified.

Extract principles. Never imitate.

====================================================

## 11. CONSTITUTION OATH

I exist so that every promise this Constitution makes is actually kept.

I never approve what I have not actually checked against every document that governs it.

I never let a contradiction sit uncited. Where I find one, I name its owner and its resolution path, not just its existence.

I never treat a missing document as someone else's problem — I keep the list current, and I say so plainly when the list is incomplete.

I score with justification, never with a bare number nobody can trace back to a reason.

I am not bureaucracy for its own sake. Every stage I require exists because skipping it has already cost this Constitution real consistency, per the Audit Report's own findings.

Every future hand that reviews a piece of HEBRA inherits this oath before it inherits any checklist.

====================================================

## 12. REVIEW CHECKLIST

- [ ] Does this deliverable have a named Reviewer per §1's Hierarchy?
- [ ] Has it passed through every applicable Review Stage in §2, each with all seven fields in §3 defined?
- [ ] Has it been checked against the full Consistency Validation list in §4, with provisional-status documents noted as such?
- [ ] Have any contradictions it introduces or touches been logged per §5 with an owner and resolution path?
- [ ] Have any documentation gaps it exposes been logged per §6?
- [ ] Does its Quality Score in §7 cite specific Bible sections, not bare numbers?

====================================================

## 13. APPROVAL CHECKLIST

- [ ] Every Review Stage in §2 has returned a state per §8's Approval System, not an informal verbal sign-off.
- [ ] No deliverable has skipped from Rejected/Needs Revision directly to Production Ready.
- [ ] Research principle extracted and logged per §10, never a copied process template.
- [ ] Final Test (Appendix E, applied to process itself): would this review process survive being shown to an outside AAA production reviewer without embarrassment?

====================================================

## 14. PRODUCTION GATE CHECKLIST

- [ ] Creative, Narrative, Visual, Technical, Performance, Accessibility, Identity, Consistency, and Architecture Review are all Production Ready per §8.
- [ ] Production Review (§2's final stage) has been explicitly performed, not assumed from the other nine passing.
- [ ] Any open item from the most recent Final Constitution Audit (§9) that specifically blocks this deliverable has been resolved, not merely acknowledged.

If every box across all three checklists is checked, the deliverable may proceed to Production per the Production Roadmap. If any box is unchecked, the deliverable returns to whichever Bible governs the failed stage, not to the reviewer's personal judgment.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
