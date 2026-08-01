---
name: assistant-software-workflow
description: Maintain durable software requirements, designs, tasks, tests, issues, releases, verification evidence, work episodes, and reports in an installed Assistant project. Use when implementing, debugging, testing, planning, reviewing architecture, resolving a persistent issue, preparing a release, or integrating an exact user source into canonical software-project knowledge.
---

# Software workflow

Use this skill for durable project meaning. Short answers, transient analysis,
and trivial maintenance do not require a canonical node.

1. Read `.assistant/INDEX.md` and `.assistant/CURRENT.md`.
2. Resolve the exact semantic route and effective policy. Do not inspect
   `docs/`, an external cold document boundary, or `.assistant/vault/` without
   a current exact-path gateway grant. `docs/report/` is write-only except when
   the user names an exact report for review, edit, or comparison.
3. Read `.assistant/system/software-schema.md` completely.
4. Classify the instruction as addition, refinement, conflict, supersession,
   continuation, stop, replacement, or unrelated substantial work. Give
   concise transition feedback before changing active-work priority.
5. If meaning conflicts materially with north star, scope, requirement,
   design, plan, state, authorization, active work, release gate, or terminal
   disposition, stage the whole change and ask before changing active owners.
6. Otherwise update the smallest owner. Preserve stable IDs and typed
   relations. A parent owns status and routes, not copied child results.
7. Create a durable owner when meaning first needs independent lifecycle,
   authority, state, or selective routing. Keep co-routed small records in a
   bounded collection; promote without changing IDs when structure warns.
8. Treat code, tests, build output, Git state, filenames, timestamps, TODOs,
   and artifact presence as observations. They do not select current intent,
   completion, release approval, or execution authorization by themselves.
9. Record unknown or unverified fields explicitly. Do not invent requirements,
   acceptance criteria, causes, results, branches, or release authority.
10. Update `CURRENT.md` only for current state, authorization, active work,
    blocker, current decision, parallel or blocked route, and next safe route.
11. Persist material results, blockers, decisions, authorization, plan
    evolution, issue resolution, and test or release disposition promptly.
12. Run `.assistant\system\assistant.cmd validate` after material changes. If
    boundedness warns, preview `.assistant\system\assistant.cmd structure`,
    apply with `structure --apply`, then validate again.

## Lifecycle direction

- A requirement states what must hold and how acceptance is judged.
- A design `implements` a requirement.
- A task `implements` a requirement or design and may `resolve` an issue.
- A test `verifies` a requirement, design, task, or release.
- A release `depends_on` the tasks and tests that gate it.
- An issue `challenges` or derives from an affected design, task, test,
  release, environment, work episode, or evidence owner.

Do not reverse edges merely to pass validation. Leave an explicit documentation
gap when the genuine relation is unclear.

## Work episode and report

- Do not create a durable Goal for a short answer or trivial maintenance.
- For continuing work, preserve ID, authority, scope, status, stop condition,
  current state, child work, lineage, decision requirement, and report link.
- Stop before downstream work at a gate, anomaly, material problem, user stop,
  consequential test failure, or required decision.
- Generate a terminal report only after canonical state is current, using the
  locale in `.assistant/manifest.json`.
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

1. Use only the current gateway grant. Inventory a granted directory
   completely and do not follow links outside it.
2. Preflight each file and preserve exact bytes with `source_snapshot`. Read
   supported text and modern office documents through the safe bounded
   extractor. Record unsupported legacy binary, encrypted, malformed, or
   oversized meaning as an explicit coverage gap.
3. Account each meaningful section as `preserved`, `consolidated`,
   `historical`, `superseded`, or `omitted_with_reason`. Preserve requirements,
   constraints, interfaces, acceptance criteria, decisions, task state, test
   oracles and results, issues, release gates, authorization, and evolution.
4. Compare only with routed canonical owners. Do not choose authority by path,
   name, date, mtime, Git state, or wording such as "latest".
5. Stage one `source_integration` transaction with affected writes, immutable
   snapshot IDs, coverage, and all conflicts. Canonical meaning must not depend
   on the live source.
6. For a material conflict, preview the entire conflict and wait for explicit
   confirmation. Do not apply only a non-conflicting subset.
7. Commit atomically, maintain structure, validate, and re-route with source,
   reports, and vault hidden. A failed closed-book route is a documentation
   gap, not a completed integration.

## Existing-project bootstrap resolution

When `CURRENT.md` names `BOOTSTRAP-EXISTING` and `awaiting_user_input`,
assistant-managed canonical integration is paused; normal human project work
is not blocked. Resolve `agents_control_plane` first when present. Retain
repository-native build, test, safety, and subtree rules in AGENTS. Move
durable Assistant side-effect preferences to `.assistant/POLICY.md` only when
approved. Rewrite a semantically competing current, plan, decision,
authorization, policy, or routing owner only after preview and confirmation.
Never infer a special role from a fixed filename or directory.

After confirmation, run:

`.assistant\system\assistant.cmd migration --complete-agents --confirm --json`

This changes only the AGENTS/POLICY control route. Do not move, delete, rename,
or archive referenced documents at this step. Semantic bootstrap must first
integrate their meaning and then present document placement separately.

Continue the same bootstrap with `.assistant\system\assistant.cmd init --json`
on Windows or `.assistant/system/assistant init --json` on POSIX. Use the
persisted model settings and Codex session. Never downgrade effort, add a
timeout, or replace an attempt without the user's explicit restart instruction.

Process every knowledge-bearing candidate as stable semantic units. Do not
bypass incomplete unit coverage, lineage, or closed-book findings by opening a
legacy master document as fallback authority. Preserve historical and
superseded requirements, designs, tests, releases, failures, and corrections
when they explain the project. A valid node count alone is not readiness.

Review staged `legacy_surfaces` by observed meaning. `integrate_then_cold`
means the meaning is canonical and the original is protected from normal
Assistant access; it does not require movement. Preview any competing-surface
rewrite, move, or removal. Do not invent a generic archive.

Review every staged `document_assets` item. Show one whole relocation preview:
current path, observed role, canonical targets, destination or cold-in-place
disposition, reason, and rollback conditions. Explain that `docs/` is
human-managed cold storage and `docs/report/` is the only report write
interface. Ask once whether to apply the complete proposal. The user may
change any disposition or destination. Never move before the complete semantic
output validates and never overwrite a collision. Approved `move_to_docs` and
`cold_in_place` items use `decision_status: approved`; reject or resolve every
ambiguous pending item explicitly.

Ask at most three related semantic questions at a time. Then create one
temporary `assistant.bootstrap-resolution/v1` JSON package containing:

- one decision for every active gap and material conflict;
- one exact-path decision for every pending document asset;
- affected candidate IDs and all unaffected candidate meaning;
- complete inventory, semantic-unit coverage, and origin-to-current lineage;
- resolved control-surface dispositions and a closed-book audit with no live
  legacy authority dependency;
- a `canonical_user_approved` candidate for every material conflict.

Confirm the whole material change or document placement, then run:

`.assistant\system\assistant.cmd bootstrap-resolve --input <exact-json-path> --confirm --json`

For gap-only resolution with no material conflict or document placement, omit
`--confirm`. The command validates changes, applies the approved relocation and
cold-boundary ledger atomically with canonical activation, maintains structure,
and validates closed-book state.

After activation, run
`.assistant\system\assistant.cmd bootstrap-deferred --claim --json`, tell the
user initialization is resolved and resume the original request. After durable
state is recorded, run
`.assistant\system\assistant.cmd bootstrap-deferred --complete --json`.
