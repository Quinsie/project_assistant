---
name: assistant-software-workflow
description: Maintain durable software requirements, designs, tasks, tests, issues, releases, verification evidence, work episodes, and reports in an installed Assistant project. Use when implementing, debugging, testing, planning, reviewing architecture, resolving a persistent issue, preparing a release, or integrating an exact user source into canonical software-project knowledge.
---

# Software workflow

Use this Skill for durable project meaning. Short answers, transient analysis,
and trivial maintenance do not require a canonical node.

1. Read `.assistant/INDEX.md` and `.assistant/CURRENT.md`.
2. Resolve the exact semantic entity route and the policy slices for intended
   side effects. Do not inspect `docs/user/`, `docs/report/`,
   `.assistant/vault/`, or another restricted boundary without a current
   gateway grant.
3. Read `.assistant/system/software-schema.md` completely.
4. Classify the instruction as addition, refinement, conflict, supersession,
   continuation, stop, replacement, or unrelated substantial work. Give the
   user concise transition feedback before changing active-work priority.
5. If meaning conflicts materially with north star, scope, requirement,
   design, plan, state, authorization, active work, release gate, or terminal
   disposition, stage the whole change and ask before changing active owners.
6. Otherwise update the smallest owner. Preserve stable IDs and typed
   relations. A parent owns status and routes, not copied child results.
7. Create a durable owner when the meaning first needs independent lifecycle,
   authority, state, or selective routing. Keep co-routed small records in a
   bounded collection; promote without changing IDs when they become
   independent or exceed the structure warning.
8. Treat code, tests, build output, Git state, filenames, timestamps, TODOs,
   and artifact presence as observations. They never select current intent,
   completion, release approval, or execution authorization by themselves.
9. Record unknown or unverified fields explicitly. Do not invent requirements,
   acceptance criteria, causes, test results, current branches, or release
   authority.
10. Update `CURRENT.md` only for current state, authorization, active work,
    blocker, current decision, parallel/blocked route, and next safe route.
11. Persist material results, blockers, decisions, authorization, plan
    evolution, issue resolution, and test/release disposition promptly.
12. Run `.assistant\system\assistant.cmd validate` after material canonical
    changes. If boundedness warns, preview
    `.assistant\system\assistant.cmd structure`, apply with `structure --apply`,
    then validate again.

## Lifecycle direction

- Requirement states what must hold and how acceptance is judged.
- Design `implements` a requirement.
- Task `implements` a requirement or design and may `resolve` an issue.
- Test `verifies` a requirement, design, task, or release.
- Release `depends_on` the tasks and tests that gate it.
- Issue `challenges` or derives from the affected design, task, test, release,
  environment, work, or evidence.

Do not reverse those edges to make a graph pass. If the relation is genuinely
unclear, leave a documentation gap.

## Work episode and report

- Do not create a durable Goal for a short answer or trivial maintenance.
- For continuing work, preserve ID, authority, scope, status, stop condition,
  current state, child work, lineage, decision requirement, and report link.
- Stop before downstream work at a gate, anomaly, material problem, user stop,
  failed test with branching consequences, or required decision.
- A terminal report is generated only after canonical state is current. Use
  the locale in `.assistant/manifest.json`.
- One terminal episode has at most one idempotent report. Include without
  repetition: Goal and authority, Why, actual and excluded work, method and
  evidence basis, factual results, interpretation and non-claims, limitations,
  resulting state and authorization, exact decision required, next paths, and
  traceability.
- Create a requested report only on explicit request from current canonical
  owners and artifacts. Never use an older report as its source.

## Exact source integration

Use this route only when the current instruction identifies an exact source
boundary and requests canonical integration. Review, summary, critique, or
comparison alone must not update canonical state.

1. Use only the current gateway grant. Inventory a granted directory completely
   and do not follow links outside it.
2. Preflight content and preserve exact bytes with `source_snapshot`. Record
   unsupported, binary, encrypted, or oversized meaning as coverage gaps.
3. Account each meaningful section as `preserved`, `consolidated`,
   `historical`, `superseded`, or `omitted_with_reason`. Preserve requirements,
   constraints, interfaces, acceptance criteria, decisions, task state, test
   oracle/results, issues, release gates, authorization, and plan evolution.
4. Compare only with routed canonical owners. Do not choose authority by path,
   name, date, mtime, Git state, or wording such as “latest.”
5. Stage one `source_integration` transaction with affected writes, immutable
   snapshot IDs, section coverage, and all conflicts. Canonical meaning must
   not depend on the live source.
6. If any conflict is material, preview the entire conflict and wait for
   explicit confirmation. Do not apply a non-conflicting subset.
7. Commit atomically, maintain structure, validate, and re-route with source,
   reports, and vault hidden. A failed closed-book route is a documentation gap,
   not a completed integration.

## Existing-project bootstrap resolution

When `CURRENT.md` names `BOOTSTRAP-EXISTING` and
`awaiting_user_input`, pause assistant-managed canonical integration before
relying on it. The project and its human collaborators are not blocked. Resolve an
`agents_control_plane` migration first when present: retain repository-native
build, test, safety, and subtree rules in AGENTS; move durable assistant
side-effect preferences to `.assistant/POLICY.md` only when approved; remove
competing canonical orientation routes only after preview and confirmation.

Ask at most three related semantic questions at a time. After every blocker has
an explicit answer, create one `assistant.bootstrap-resolution/v1` package with
one decision per initialization gap/material conflict, declared affected
candidate IDs, complete unaffected meaning, and a
`canonical_user_approved` decision candidate for each material conflict.
Confirm the whole material change, then run:

`.assistant\system\assistant.cmd bootstrap-resolve --input <exact-json-path> --confirm`

For gap-only resolution, omit `--confirm`. After activation, claim and resume
the durable deferred first request with `bootstrap-deferred --claim`, then mark
it complete only after its durable state is recorded.
