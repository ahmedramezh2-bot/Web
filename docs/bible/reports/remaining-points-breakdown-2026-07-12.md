# HEBRA — REMAINING POINTS BREAKDOWN

*Requested prior to implementation authorization. Explains every point below 90 across the five scores in the Final Constitution Report (`reports/final-constitution-report-2026-07-12.md` §4) that scored under 90. Documentation only — no Constitution content is changed by this report; it explains existing scores and, where a gap is real, states the exact fix.*

====================================================

## CREATIVE — 88 (2 points short)

**1. Why points were lost.** Every other narrative-adjacent level in the Canonical Naming Architecture (`docs/bible/26`) has a rigorous, Oath-and-Checklist-bearing governing document — World Blueprint owns Level 2, the four Dialect Bibles own Level 3, UI Integration Bible §5 owns Level 4. **Level 1 (Story Chapters) does not.** It rests on the informal Cinematic Narrative document set and Part 1, neither of which was ever held to the same authoring discipline (Research Protocol, Forbidden Patterns check, Final Test) as the sixteen formal Bibles.

**2. The exact issue.** No formal Story/Lore Bible exists. Material Bible §5 (Tiny Symbols) and Lighting Bible §5 (Symbols) both explicitly defer their symbolic-language content to "whatever symbolic system the eventual Story/Identity documents define" — that system has never been formally defined anywhere.

**3. Severity: Minor.** Re-classified from Medium to Minor in the Final Constitution Report §3 specifically because it blocks no Phase 1 milestone — Phase 1 needs the six Chapter *names* and their camera/lighting *dialects*, both of which are already fixed in the Camera Bible and this session's work. It does not yet need deep lore content.

**4. Fix before implementation or can wait: can wait.** Should be resolved before any milestone that authors actual narrative content, symbol meaning, or dialogue-adjacent text — realistically a Phase 2+ concern, not a Foundation-phase blocker.

**5. Exact improvement required.** Commission a formal Story/Lore Bible: consolidate the informal Cinematic Narrative set + Part 1 into one document with the same structure as the other sixteen (Philosophy, per-chapter required fields, the symbolic-language system Material/Lighting Bibles are waiting on, Forbidden Patterns, Research, Oath, Checklists).

====================================================

## ARCHITECTURE — 87 (3 points short)

**1. Why points were lost.** The two structural gaps that previously capped this score (no naming architecture, no Shader Bible) are closed. What remains is one real missing document and one purely cosmetic gap.

**2. The exact issue.**
- **(a) No successor Interaction Bible.** Part 4 (Interaction Bible • Touch • Sound • Presence) was never re-formalized the way Part 5 became the Camera Bible and Part 9 became the Audio Production Bible. General interaction semantics — click/tap/gesture activation *outside* camera presence-response — currently rest on UI Integration Bible §7 and Camera Bible §12–13, both of which were scoped narrower than a dedicated document would be. This is already logged as an accepted risk on Phase 1 Master Execution Plan M13.
- **(b) Three undeclared authority-relationship preambles.** Audio Production Bible (vs. Part 9), World Blueprint (vs. Part 3), and Asset Production Bible (vs. Part 10) never added the explicit "this document expands and wins over X" clause the Camera Bible's preamble has. First flagged in the original Constitution Audit Report §5 item 2 and never executed.

**3. Severity: Minor** for both. (a) has a logged, accepted fallback (existing sections carry the load, just not ideally). (b) has zero functional ambiguity today because the Constitution Review Protocol §1's Conflict Resolution order already provides a structural tiebreaker (more recent, more detailed document wins) even without an explicit preamble stating it.

**4. Fix before implementation or can wait: can wait.** (a) is scheduled to be resolved before M13 reaches full scope, not before Phase 1 starts. (b) has no urgency at all — it is a clarity improvement, not a risk mitigation.

**5. Exact improvement required.** (a) Commission a successor Interaction Bible before M13's full interaction vocabulary is built out. (b) Add one paragraph each to Audio Production Bible, World Blueprint, and Asset Production Bible's preambles, mirroring the Camera Bible's exact pattern ("this document expands Part N and wins on [topic]-specific matters").

====================================================

## ENGINEERING — 88 (2 points short)

**1. Why points were lost.** Development Standards, the Shader Bible, and the Production Execution Protocol are now fully mutually consistent — but two items remain genuinely undecided rather than merely under-documented.

**2. The exact issue.**
- **(a) Testing Framework has a discipline but no tooling.** Development Standards §8 defines *what* gets checked (Bible-conformance against each document's own Review Checklist) but names no actual test runner, e2e framework, or visual-regression tool. Phase 1 Master Execution Plan M18's entire purpose is to close this — meaning the Constitution deliberately stopped short of a concrete technical choice here.
- **(b) The "Constitution custodian" cadence is recommended, not operational.** Execution Hierarchy Authorization §3 leans on AI as a second-pass reviewer, but there is no codified rule for *when* a Constitution Consistency-style re-check actually runs (every N PRs? every Phase transition?) — Production Execution Protocol §6's "Documentation Updated" PR field is currently a manual checkbox, not an automated or scheduled gate.

**3. Severity: Minor.** Both are scoped, expected gaps — (a) is M18's explicit job; (b) is a process refinement, not a missing capability.

**4. Fix before implementation or can wait: can wait, by design.** Per Production Execution Protocol §2, concrete tooling choices happen at a milestone's *Concept* stage, not during Constitution authoring — inventing a test-runner choice now, before any real code exists to test, would itself violate Production Execution Protocol §4's "no optimization/tooling-lock-in before there's something real to validate against" spirit.

**5. Exact improvement required.** (a) At M18's Concept stage, select and document specific tooling consistent with Development Standards §8. (b) Add an explicit cadence rule to Production Execution Protocol (e.g., "a Constitution Consistency Report is re-run at every Phase-gate checkpoint, minimum") so §6's PR-level check has a scheduled counterpart, not only a per-PR one.

====================================================

## SCALABILITY — 86 (4 points short)

**1. Why points were lost.** Naming and shader-philosophy no longer cap this score. What remains is that two of the Constitution's budget/registry systems are qualitatively designed but not yet numerically or mechanically proven at scale.

**2. The exact issue.**
- **(a) No numeric shader instruction-count ceiling.** Shader Bible §6 states Hero shaders "receive the largest instruction budget" within Appendix F's philosophy, but Appendix F itself only budgets draw calls, particles, and textures — never GLSL instruction counts. Scaling to many locations × many Dialects × many hero shaders has no numeric guardrail yet, only a qualitative one.
- **(b) The Canonical Naming Architecture's registry is manual.** Doc 26 §8's amendment discipline ("register a new name here before using it elsewhere") is a written rule, not a checked one — nothing currently verifies that a new Physical Location or Dialect referenced in, say, a future World Blueprint update was actually registered first. Fine at today's scale (15 canonical locations); a real friction point as content volume grows.

**3. Severity: Minor.** Both are refinements expected during implementation, not Foundation-blocking gaps — M8/M9 only need today's 15 registered locations, not hundreds.

**4. Fix before implementation or can wait: can wait — and (a) specifically *should* wait.** Performance Bible §1's own "measure before optimize" rule argues directly against inventing a shader instruction-count number now, before M12 has produced any real shader to measure. Setting a number today would be a guess dressed as a budget.

**5. Exact improvement required.** (a) After M12 (Shader Framework) produces working shaders, measure real instruction counts and codify per-Complexity-Tier ceilings as a logged Shader Bible amendment. (b) Add a lightweight validation step — realistically a small script, not a new document — that checks any new location/Dialect reference against doc 26's registry before use; natural to fold into M18 (Testing Framework).

====================================================

## MAINTAINABILITY — 87 (3 points short)

**1. Why points were lost.** The Execution Hierarchy is staffed and Design Token Bible / Constitution Review Protocol infrastructure is strong — but two long-horizon record-keeping gaps remain.

**2. The exact issue.**
- **(a) No centralized Constitution changelog.** Every amendment is logged inline within whichever document it touches (the pattern the Camera Bible §26 and doc 26 §8 both establish) — correct for a single document, but there is no single ledger showing what changed, where, and why across all 33 documents over time. Camera Bible §26 itself warns "this Bible is expected to outlive any single contributor's memory" — yet nothing currently aggregates that memory in one place.
- **(b) Solo-creator self-review is disclosed, not eliminated.** Execution Hierarchy Authorization §3 explicitly accepts this as unavoidable and mitigates it with AI as an independent second pass — an honest, working mitigation, but a single point of failure/bias for creative and technical judgment nonetheless.

**3. Severity: Minor-to-cosmetic.** Neither blocks any technical work; both are process and record-keeping refinements.

**4. Fix before implementation or can wait: can wait**, ideally resolved before the Constitution's *first* post-1.0 amendment rather than before implementation starts.

**5. Exact improvement required.** (a) Create `docs/bible/CHANGELOG.md` — one line per future amendment (document, section, one-sentence reason, date), starting now at Version 1.0. (b) No document fix exists for (b); it is a standing, disclosed operating condition, not a gap with a closing action — the existing mitigation (AI second-pass review, per Execution Hierarchy Authorization §3) is the appropriate and sufficient response for a solo-creator project.

====================================================

## SUMMARY OF ALL ELEVEN POINTS

| Score | Points short | Primary gap | Secondary gap | Severity | Blocking? |
|---|---|---|---|---|---|
| Creative (88) | 2 | No formal Story/Lore Bible | — | Minor | No |
| Architecture (87) | 3 | No successor Interaction Bible | 3 missing authority preambles | Minor | No |
| Engineering (88) | 2 | No Testing Framework tooling chosen yet | No codified custodian cadence | Minor | No |
| Scalability (86) | 4 | No numeric shader instruction budget | Manual naming-registry check | Minor | No |
| Maintainability (87) | 3 | No centralized changelog | Solo-review single point of failure (disclosed, mitigated) | Minor | No |

Every issue above is additive or Phase-scoped — none requires reversing, contradicting, or reopening any decision already frozen in Constitution Version 1.0. Every fix is either (a) a new document to commission alongside ongoing development, (b) a milestone-scoped tooling choice already scheduled at the correct point in the Phase 1 Master Execution Plan, or (c) a lightweight process addition. None require pausing Phase 1 to resolve.

====================================================

## AUTHORIZATION

**All remaining issues are confirmed non-blocking and addressable during development without changing the Constitution.**

**HEBRA is production-ready. Implementation is authorized to begin under the existing Production Authorization Certificate (`reports/final-constitution-report-2026-07-12.md` §6), Constitution Version 1.0, effective immediately.**

Phase 1 — Foundation Implementation may proceed per the Phase 1 Master Execution Plan's own Implementation Command (`docs/bible/25` §11): M1 (Project Bootstrap) first, then M2–M3 (Core Engine, Rendering Pipeline), then M4–M5 (State Architecture, Camera Foundation) — with the five gaps above tracked as ordinary backlog items against their already-identified milestones (Story Bible before deep narrative content, Interaction Bible before M13's full scope, test tooling at M18 Concept stage, shader budget numbers after M12, changelog at the first post-1.0 amendment) rather than as pre-implementation blockers.

Documentation only up to this point. This report authorizes what happens next; it does not itself build it.
