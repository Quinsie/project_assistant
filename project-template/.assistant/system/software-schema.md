# Software semantic schema

This file is a system contract, not project knowledge.

Ongoing records use `origin: "ongoing"` and
`workflow_schema: "software.<type>/v1"` in node or collection-record metadata.
Bound collection records with:

```text
<!-- assistant-record:start <stable-id> -->
...
<!-- assistant-record:end <stable-id> -->
```

Use `Unknown — <reason>` for unknown information. Do not silently omit a
required field.

## Requirement

Required `###` headings:

`Requirement`, `Rationale`, `Scope`, `Non-goals`, `Constraints`,
`Acceptance criteria`, `Dependencies`, `Current evidence`, `Open ambiguity`.

A requirement derives from or depends on a foundation, requirement, decision,
or active work. It does not implement or verify a downstream artifact.

## Design

Required headings:

`Problem and context`, `Considered options`, `Chosen approach`, `Rationale`,
`Interfaces and invariants`, `Failure and security concerns`,
`Consequences and tradeoffs`, `Validation`, `Supersession condition`.

A design normally `implements` a requirement. Preserve rejected options only
when their rationale remains useful.

## Task

Required headings:

`Objective`, `Scope`, `Parent requirement or design`,
`Authorization and preconditions`, `Implementation plan`,
`Affected components`, `Verification`, `Completion or stop condition`,
`Current state`, `Blockers`, `Result`, `Follow-up`.

A task `implements` a requirement/design or `resolves` an issue. A plan or TODO
does not prove completion. Update result and state at material events.

## Test

Required headings:

`Claim or risk`, `Test level`, `Setup`, `Inputs and conditions`,
`Oracle or expected result`, `Execution and result`,
`Artifact or trace identity`, `Coverage`, `Non-coverage`, `Disposition`.

A test `verifies` a requirement, design, task, or release. Record the oracle
before treating output as pass/fail. A green test does not establish untested
scope.

## Issue

Required headings:

`Symptom`, `Context and impact`, `Reproduction`, `Evidence`, `Cause`,
`Resolution`, `Prevention`, `Current status`, `Related work`.

Separate observed symptom, suspected cause, established cause, mitigation, and
verified resolution. Preserve recurring debug value without turning every
transient failure into a durable issue.

## Release

Required headings:

`Version and scope`, `Included requirements and changes`, `Release gates`,
`Validation evidence`, `Compatibility and migration`,
`Known issues and risks`, `Rollback`, `Artifact identity`, `Authorization`,
`Status`.

A release depends on its gating tasks/tests. Artifact existence, tag names, Git
state, or version numbering do not create release authorization.

## Storage and growth

- Co-routed small requirements/designs may share `ARCHITECTURE.md`.
- Co-routed small tasks/releases may share `DELIVERY.md`.
- Co-routed tests/evidence may share `VERIFICATION.md`.
- Issues may share active operations while they remain small and co-routed.
- Promote when an item needs independent lifecycle/routing or crosses the
  boundedness warning. Preserve its ID and incoming relations.
- Consolidate only small co-routed records whose independent lifecycle has
  ended. Never consolidate merely to reduce file count.
