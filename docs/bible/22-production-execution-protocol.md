# HEBRA MASTER PRODUCTION BIBLE

## THE PRODUCTION EXECUTION PROTOCOL

*Documentation only. Pre-production. Nothing in this document is implemented by its own existence.*

====================================================

PREAMBLE

This document defines exactly how HEBRA enters production.

This is the bridge between Pre-Production and Development. Nothing may enter production unless it follows this protocol. Every Bible before this one defined *what* HEBRA is; this document defines the mechanical process by which *what* becomes *built*.

Where this document is silent, the Creative Director Protocol (Appendix G) governs. This document is enforced by the Constitution Review Protocol (docs/bible/16) — every task described here passes through that document's Review Stages before it is considered complete.

====================================================

## 1. PRODUCTION PHILOSOPHY, EXECUTION HIERARCHY, DECISION HIERARCHY, PRODUCTION PIPELINE, DEVELOPMENT AUTHORITY

**Production Philosophy.** Production is the controlled translation of an already-approved decision into working software. Nothing is decided *during* production that could have been decided during pre-production — if a production task requires a creative or architectural decision that isn't already answered by an existing Bible, the task is not ready to start, per §5's standing rule.

**Execution Hierarchy.** Executive Producer → Creative Director → Technical Director → Lead Engineer → Production Manager → contributor. This extends the AI Development Protocol's Authority Hierarchy (AI Development Protocol §2) with the two production-specific roles (Executive Producer, Production Manager) who own schedule and cross-team coordination without holding creative or technical authority themselves. **Named people now hold every role in this hierarchy** — see the Execution Hierarchy Authorization (`docs/bible/28`) for the current staffing.

**Decision Hierarchy.** Mirrors the Constitution Review Protocol's Decision Authority (Constitution Review Protocol §1) exactly — novel decisions escalate to the Creative Director and are logged as a documentation amendment before implementation proceeds, never decided ad hoc inside a production task.

**Production Pipeline.** The lifecycle in §2, applied per task (§3), gated at every transition by the Constitution Review Protocol's Approval System (Constitution Review Protocol §8).

**Development Authority.** No individual contributor holds unilateral authority to merge, deploy, or declare a task complete — every Definition of Done (§7) requires sign-off from a role above the contributor in the Execution Hierarchy.

====================================================

## 2. PRODUCTION LIFECYCLE

**Research → Concept → Approval → Prototype → Review → Iteration → Optimization → Validation → Merge → Deployment → Maintenance.**

**Research** follows Appendix E's standing protocol without exception — no Concept stage begins without it, mirroring Asset Production Bible §4's pipeline discipline exactly.

**Concept** produces a proposal checked against every governing Bible before any code is written.

**Approval** is granted per §1's Decision Hierarchy — a Concept does not become a Prototype without an approving role's explicit sign-off.

**Prototype** is throwaway-safe by default — a prototype's purpose is to answer an open technical question, not to become production code by accretion; where a prototype is intended to become production code, that intention is stated at Concept stage, not decided retroactively.

**Review** applies the Constitution Review Protocol's relevant Review Stages (Constitution Review Protocol §2) to the prototype's output.

**Iteration** responds to Review findings; a task may cycle through Prototype→Review→Iteration multiple times before proceeding.

**Optimization** never precedes Validation, per §5's standing rule — a system is optimized only after it has been confirmed correct and consistent with its governing Bible.

**Validation** is the Asset Production Bible §4/§16 discipline applied to code and systems generally, not only to art assets.

**Merge** requires the branch and PR discipline in §9–§10.

**Deployment** requires every item in §7's Definition of Done.

**Maintenance** is not a terminal state but an ongoing lifecycle stage — a shipped system re-enters Research whenever a governing Bible it depends on is amended, mirroring the Constitution Review Protocol's Consistency Review (Constitution Review Protocol §2).

====================================================

## 3. EVERY PRODUCTION TASK MUST DEFINE

- **Purpose** — why this task exists, traced to a specific Bible section.
- **Dependencies** — which other systems or Bibles this task requires to already exist or be stable.
- **Owner** — a named role per §1's Execution Hierarchy, never left ambiguous.
- **Expected Output** — the concrete, checkable deliverable.
- **Review Process** — which Constitution Review Protocol stages apply.
- **Exit Criteria** — the specific, checkable bar for this task being done, not a vague sense of completeness.
- **Rollback Strategy** — how this task's output can be safely reverted if it fails Review or introduces regression, mirroring Development Standards §19's "never deploy unfinished work" from the opposite direction — a task without a rollback plan has not actually been made safe to attempt.

A task missing any of these seven fields is not ready to enter the Production Pipeline (§1).

====================================================

## 4. DEVELOPMENT RULES

**No feature starts without documentation.** Every feature traces to an existing Bible section per §3's Purpose field — a feature with no governing documentation is not a HEBRA feature, it is scope creep.

**No implementation starts without approval.** Per §2's Approval stage.

**No merge without review.** Per §2's Review stage and §10's PR Strategy.

**No optimization before validation.** Restated from §2 because it is the rule most often broken under schedule pressure on real productions — Appendix F's own performance philosophy makes the same point ("profile continuously, never optimize only at the end") from the performance-discipline side.

**No shortcuts.** The standing rule underneath every other rule in this section — a shortcut taken to hit a date is a debt against every Bible this Constitution has built, and it is logged as a rollback-eligible risk, not quietly absorbed.

====================================================

## 5. BRANCH STRATEGY

`main` — protected, deployable at all times, per Development Standards §9.

`develop` — the integration branch; feature branches merge here first, never directly to `main`.

`feature/*` — one feature, one branch, matching §3's per-task discipline; a feature branch that has grown to cover more than one task's Purpose field should be split.

`hotfix/*` — reserved for Production Lock-breaking regressions only (cross-reference the future Production Authorization's Production Lock concept), never used to bypass §4's Development Rules for a convenient feature.

`release/*` — cut from `develop` once a milestone (cross-reference the future Phase 1 Master Execution Plan) is validated, stabilized independently before merging to `main`.

====================================================

## 6. PULL REQUEST STRATEGY

Every PR must include: **Purpose, Affected Systems, Risks, Performance Impact, Testing Results, Documentation Updated.**

This list is the PR-level restatement of §3's per-task required fields — a PR is, in effect, the closing report of a Production Task, and every field here traces back to that task's own Purpose, Dependencies, and Exit Criteria. "Documentation Updated" specifically enforces §4's "no feature starts without documentation" rule at the point of merge, not only at the point of task creation — a PR that changes behavior without updating the Bible section that governs it is incomplete regardless of how correct its code is.

====================================================

## 7. DEFINITION OF DONE

**Creative Approval. Technical Approval. Performance Approval. Accessibility Approval. Identity Approval.** Only then is a task complete.

This is a direct subset of the Constitution Review Protocol's ten Review Stages (Constitution Review Protocol §2), scoped to the five that apply to essentially every production task regardless of discipline. A task-specific additional stage (Narrative Review for story-adjacent work, Consistency Review for cross-Bible work) is added per §3's Review Process field where relevant, but these five are the non-negotiable floor for every task without exception.

====================================================

## 8. RESEARCH

Per Appendix E's standing protocol, applied here specifically:

**AAA Production Pipelines** — studied for how large creative-technical productions structure sequential gates without becoming bureaucratic theater, informing §2 and §7.

**GitHub Flow, Trunk Based Development** — studied for branch and merge discipline, informing §5–§6; HEBRA's branch strategy borrows GitHub Flow's protected-main discipline while retaining a `develop` integration branch closer to a lightweight Git Flow, chosen because HEBRA's milestone-gated Phase structure (cross-reference the Production Roadmap) benefits from a stabilization point that pure trunk-based development doesn't provide.

**Agile for Creative Teams** — studied for how iterative development coexists with a fixed creative vision rather than eroding it, informing §2's Iteration stage.

**Official documentation** — studied for the same reasons, never for a ready-made process template adopted unmodified.

Extract principles. Never imitate.

====================================================

## 9. PRODUCTION OATH

I never start without documentation. I never implement without approval. I never merge without review.

I never optimize before I have validated. Speed does not excuse skipping the order.

Every task I take on has a named owner, a named purpose, and a way to be undone if it fails.

I do not take shortcuts, and I do not let schedule pressure quietly become an excuse for one.

I am complete only when Creative, Technical, Performance, Accessibility, and Identity Approval all agree that I am — never when I merely feel finished.

Every future hand that builds HEBRA inherits this oath before it inherits any ticket.

====================================================

## 10. EXECUTION CHECKLIST

- [ ] Does this task define all seven fields in §3?
- [ ] Has it passed Research and Concept before Approval, per §2?
- [ ] Does it follow the branch strategy in §5 and the PR requirements in §6?
- [ ] Has Optimization been deferred until after Validation, per §4?
- [ ] Does it have a Rollback Strategy that has actually been considered, not just stated?

====================================================

## 11. PRODUCTION READINESS CHECKLIST

- [ ] Definition of Done (§7) fully satisfied — all five approvals obtained.
- [ ] Research principle extracted and logged per §8.
- [ ] PR includes every field in §6, with Documentation Updated verified, not assumed.
- [ ] Final Test (Appendix E, applied to process): would this task's execution survive being audited by an outside AAA production reviewer without embarrassment?

If every box is checked, the task may merge and deploy per §5–§6. If any box is unchecked, the task returns to the Production Pipeline stage where it last held true, not forward to deployment regardless of deadline pressure.

====================================================

THIS DOCUMENT IS NOW PART OF THE PERMANENT HEBRA BIBLE.

Nothing in this document has been implemented by writing it.

**Awaiting: explicit authorization to leave pre-production.**
