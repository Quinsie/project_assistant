import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { activateBootstrap } from "../../runtime/lib/activation.mjs";
import { validateBootstrapOutput } from "../../runtime/lib/bootstrap-contract.mjs";
import { buildSemanticEvidenceBatches } from "../../runtime/lib/evidence-packet.mjs";
import { discoverReferencedControlSurfaces } from "../../runtime/lib/legacy-surfaces.mjs";
import { SOFTWARE_WORKFLOW_HEADINGS } from "../../runtime/lib/contract.mjs";
import { doctorProject } from "../../runtime/lib/doctor.mjs";
import { authorizeTerminalEpisode } from "../../runtime/lib/episode.mjs";
import {
  initializeBlankProject,
  initializeProject
} from "../../runtime/lib/installer.mjs";
import {
  parseNodeDocument,
  serializeNodeDocument
} from "../../runtime/lib/meta.mjs";
import { resolvePolicy } from "../../runtime/lib/policy.mjs";
import { routeTask } from "../../runtime/lib/router.mjs";
import { maintainStructure } from "../../runtime/lib/structure.mjs";
import {
  commitCanonicalUpdate,
  stageCanonicalUpdate
} from "../../runtime/lib/transaction.mjs";
import { pathExists } from "../../runtime/lib/files.mjs";
import {
  loadCanonicalNodes,
  validateProject
} from "../../runtime/lib/validator.mjs";
import {
  exportAssistant,
  purgeAssistant,
  uninstallAssistant
} from "../../runtime/lib/lifecycle.mjs";
import { updateAssistant } from "../../runtime/lib/updater.mjs";
import { checkAvailableUpdate } from "../../runtime/lib/version-check.mjs";

const sections = (type, overrides = {}) =>
  (SOFTWARE_WORKFLOW_HEADINGS[type] ?? []).map((heading) => ({
    heading,
    content: overrides[heading] ?? `Unknown — ${heading} was not established.`
  }));

const candidate = (id, type, relations = [], overrides = {}) => ({
  id,
  type,
  status: overrides.status ?? "candidate",
  authority: overrides.authority ?? "candidate_unintegrated",
  certainty: overrides.certainty ?? "direct",
  relations,
  title: overrides.title ?? id,
  body: overrides.body ?? `${id} observed meaning.`,
  semantic_sections: sections(type, overrides.sections),
  evidence_paths: overrides.evidence_paths ?? ["README.md"],
  legacy_aliases: overrides.legacy_aliases ?? []
});

function softwareOutput() {
  return {
    schema: "assistant.bootstrap-output/v1",
    project_summary: {
      purpose: "Maintain a small software service.",
      scope: "Local implementation and verification.",
      current_state: "Implementation exists; current user intent is absent.",
      current_authorization: "No durable execution or release authority.",
      authorization_state: "not_authorized",
      authorized_work: [],
      blocked_work: [
        "Modify or execute the project before the user selects a bounded task.",
        "Treat a build, tag, or green test as release authorization."
      ],
      authorization_basis_paths: [],
      next_safe_route: "Ask for the current objective and allowed action."
    },
    candidate_nodes: [
      candidate("FND-SW-001", "foundation", [], {
        body: "The service exposes a bounded local interface."
      }),
      candidate(
        "REQ-SW-001",
        "requirement",
        [{ type: "derived_from", target: "FND-SW-001" }],
        {
          sections: {
            Requirement: "The service must reject malformed requests.",
            "Acceptance criteria":
              "A malformed request returns a stable error without changing state."
          }
        }
      ),
      candidate(
        "DESIGN-SW-001",
        "design",
        [{ type: "implements", target: "REQ-SW-001" }],
        {
          sections: {
            "Chosen approach": "Validate at the interface boundary.",
            "Interfaces and invariants":
              "Rejected requests do not reach the state mutation layer."
          }
        }
      ),
      candidate(
        "TASK-SW-001",
        "task",
        [{ type: "implements", target: "DESIGN-SW-001" }],
        {
          status: "observed_not_current",
          sections: {
            Objective: "Implement boundary validation.",
            "Current state": "Implementation files are present; completion authority is absent."
          }
        }
      ),
      candidate(
        "TEST-SW-001",
        "test",
        [{ type: "verifies", target: "TASK-SW-001" }],
        {
          sections: {
            "Claim or risk": "Malformed requests cannot mutate state.",
            "Oracle or expected result":
              "Stable error and unchanged persisted state.",
            "Execution and result":
              "Unknown — test existence does not prove its latest result."
          }
        }
      ),
      candidate(
        "ISSUE-SW-001",
        "issue",
        [{ type: "challenges", target: "DESIGN-SW-001" }],
        {
          status: "open_unknown",
          sections: {
            Symptom: "Legacy notes mention inconsistent malformed-input handling.",
            Cause: "Unknown — no verified diagnosis was present.",
            "Current status": "Unknown — filename and TODO order are not authority."
          }
        }
      ),
      candidate(
        "RELEASE-SW-001",
        "release",
        [{ type: "depends_on", target: "TEST-SW-001" }],
        {
          status: "not_authorized",
          sections: {
            "Version and scope": "Candidate release scope is not approved.",
            Authorization: "Not authorized.",
            Status: "Blocked pending current intent and verified gates."
          }
        }
      )
    ],
    coverage_groups: [],
    semantic_coverage: [],
    document_assets: [],
    legacy_surfaces: [],
    lineage: {
      origin_ids: ["FND-SW-001"],
      ordered_stage_ids: [
        "REQ-SW-001",
        "DESIGN-SW-001",
        "TASK-SW-001",
        "TEST-SW-001"
      ],
      current_ids: ["ISSUE-SW-001", "RELEASE-SW-001"],
      complete: true,
      missing: []
    },
    closed_book_audit: {
      origin_to_current_explainable: true,
      current_authorization_explainable: true,
      hypotheses_explainable: true,
      decisions_explainable: true,
      live_legacy_dependencies: [],
      missing_concerns: []
    },
    gaps: [],
    conflicts: []
  };
}

function fieldBody(type, overrides = {}) {
  return (SOFTWARE_WORKFLOW_HEADINGS[type] ?? [])
    .map(
      (heading) =>
        `### ${heading}\n\n${overrides[heading] ?? `Unknown — ${heading} was not established.`}`
    )
    .join("\n\n");
}

function record(id, type, relations, status = "active") {
  return {
    id,
    type,
    status,
    authority: "canonical_user_approved",
    origin: "ongoing",
    ...(SOFTWARE_WORKFLOW_HEADINGS[type]
      ? { workflow_schema: `software.${type}/v1` }
      : {}),
    relations
  };
}

function collection(id, kind, title, entries) {
  const metadata = {
    schema: "assistant.node/v1",
    id,
    type: "collection",
    collection_kind: kind,
    status: "active",
    authority: "canonical_agent",
    relations: entries.map((entry) => ({
      type: "contains",
      target: entry.record.id
    })),
    records: entries.map((entry) => entry.record),
    verified_at: new Date().toISOString()
  };
  const body = entries
    .map(
      (entry) => `<!-- assistant-record:start ${entry.record.id} -->
## ${entry.record.id}

${entry.body}
<!-- assistant-record:end ${entry.record.id} -->`
    )
    .join("\n\n");
  return serializeNodeDocument(metadata, `# ${title}\n\n${body}\n`);
}

async function currentContent(target, patch, body) {
  const currentPath = path.join(target, ".assistant", "CURRENT.md");
  const current = parseNodeDocument(await readFile(currentPath, "utf8"));
  Object.assign(current.metadata, patch, {
    verified_at: new Date().toISOString()
  });
  return serializeNodeDocument(
    current.metadata,
    `# Current state\n\n${body}\n`
  );
}

async function commitEpisode(target, id, writes) {
  await stageCanonicalUpdate(target, {
    id,
    type: "software_longitudinal_episode",
    authority: "current_user_instruction",
    writes,
    conflicts: []
  });
  return commitCanonicalUpdate(target, id);
}

test("blank software installation selects only software profile assets", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-sw-blank-"));
  const target = path.join(tempRoot, "project");
  try {
    const initialized = await initializeBlankProject(target);
    assert.equal(initialized.initialization_status, "ready");
    const manifest = JSON.parse(
      await readFile(path.join(target, ".assistant", "manifest.json"), "utf8")
    );
    assert.equal(manifest.profile, "software");
    assert.equal(
      await pathExists(
        path.join(
          target,
          ".agents",
          "skills",
          "assistant-software-workflow",
          "SKILL.md"
        )
      ),
      true
    );
    assert.equal(
      await pathExists(
        path.join(
          target,
          ".agents",
          "skills",
          "assistant-research-workflow",
          "SKILL.md"
        )
      ),
      false
    );
    assert.equal(
      await pathExists(
        path.join(target, ".assistant", "system", "software-schema.md")
      ),
      true
    );
    assert.equal(
      await pathExists(path.join(target, "docs", "report")),
      true
    );
    assert.equal(
      await pathExists(path.join(target, "docs", "user")),
      false
    );
    assert.match(
      await readFile(path.join(target, ".codex", "config.toml"), "utf8"),
      /"docs"\s*=\s*"deny"/
    );
    assert.equal((await validateProject(target)).valid, true);
    const doctor = await doctorProject(target, { probeSandbox: false });
    assert.equal(doctor.status, "ready");

    const policy = await readFile(
      path.join(target, ".assistant", "POLICY.md"),
      "utf8"
    );
    const resolved = resolvePolicy(policy, "canonical_write", null, {
      profile: "software"
    });
    assert.equal(resolved.source, "profile_default");
    assert.match(resolved.effective, /software_schema/);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("software bootstrap contract rejects research-only nodes and reverse edges", () => {
  const output = softwareOutput();
  assert.deepEqual(
    validateBootstrapOutput(output, { entries: [] }, {
      profile: "software"
    }),
    []
  );

  output.candidate_nodes.push({
    ...candidate("HYP-SW-INVALID", "hypothesis"),
    semantic_sections: []
  });
  assert.ok(
    validateBootstrapOutput(output, { entries: [] }, {
      profile: "software"
    }).some((item) => /not allowed by the software profile/.test(item))
  );
  output.candidate_nodes.pop();

  output.candidate_nodes.find((item) => item.id === "REQ-SW-001").relations = [
    { type: "verifies", target: "TEST-SW-001" }
  ];
  const findings = validateBootstrapOutput(output, { entries: [] }, {
    profile: "software"
  });
  assert.ok(findings.some((item) => /cannot use verifies as a requirement/.test(item)));
  assert.ok(findings.some((item) => /no valid requirement parent relation/.test(item)));
});

test("software semantic migration is path-independent and retains middle history", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-sw-semantic-"));
  try {
    const files = new Map([
      [
        "notes/product_memory/origin.md",
        "# Origin\n\nThe service began as a local validator.\n"
      ],
      [
        "wiki/change_records/design.txt",
        [
          "# Plan evolution",
          "",
          `${"context ".repeat(100)}MIDDLE_DESIGN_SENTINEL ${"detail ".repeat(100)}`,
          "",
          "# Decision",
          "",
          "The boundary validator replaced controller-level checks."
        ].join("\n")
      ],
      [
        "meta/runtime-state.json",
        JSON.stringify({ current_state: "paused", authorization: "not_authorized" })
      ]
    ]);
    const entries = [];
    for (const [relative, content] of files) {
      const absolute = path.join(tempRoot, ...relative.split("/"));
      await mkdir(path.dirname(absolute), { recursive: true });
      await writeFile(absolute, content, "utf8");
      entries.push({
        path: relative,
        kind: "file",
        category: relative.endsWith(".json") ? "config" : "document",
        size: Buffer.byteLength(content),
        sha256: "fixture"
      });
    }
    const result = await buildSemanticEvidenceBatches(
      tempRoot,
      { summary: { paths: entries.length, files: entries.length }, entries },
      { unitLimit: 320, batchLimit: 700 }
    );
    assert.match(
      result.batches.map((batch) => batch.packet).join("\n"),
      /MIDDLE_DESIGN_SENTINEL/
    );
    assert.equal(result.manifest.semantic_files, 3);
    const first = discoverReferencedControlSurfaces(
      "Read `notes/product_memory/origin.md` before work."
    );
    const second = discoverReferencedControlSurfaces(
      "Read `wiki/start/status.txt` before work."
    );
    assert.deepEqual(first[0].roles, second[0].roles);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("software semantic contract rejects history compressed into current work", () => {
  const output = softwareOutput();
  output.semantic_coverage = [
    {
      unit_id: "SEM-AAAAAAAAAAAAAAAAAAAA",
      disposition: "consolidated",
      target_ids: ["TASK-SW-001"],
      reason: "Compressed into current task"
    }
  ];
  const findings = validateBootstrapOutput(
    output,
    { entries: [] },
    {
      profile: "software",
      semanticManifest: {
        schema: "assistant.semantic-manifest/v1",
        units: [
          {
            unit_id: "SEM-AAAAAAAAAAAAAAAAAAAA",
            path: "기록/이전설계.md",
            control_roles: ["history"]
          }
        ],
        control_candidate_paths: []
      },
      semanticLedger: {
        schema: "assistant.semantic-ledger/v1",
        batches: [
          {
            unit_analyses: [
              {
                unit_id: "SEM-AAAAAAAAAAAAAAAAAAAA",
                classification: "historical_or_superseded",
                semantic_roles: ["history"],
                exact_elements: ["release-v1"]
              }
            ]
          }
        ]
      }
    }
  );
  assert.ok(findings.some((finding) => /history meaning lacks/.test(finding)));
  assert.ok(findings.some((finding) => /exact element is absent/.test(finding)));
});

test("software semantic migration exposes document-code classification conflicts", async () => {
  const tempRoot = await mkdtemp(
    path.join(os.tmpdir(), "assistant-sw-document-code-conflict-")
  );
  try {
    const plannedPath = "planning/classification.md";
    const activePath = "src/active_release.py";
    const planned = [
      "# Release plan",
      "",
      "The approved release classification is RELEASE-LEGACY."
    ].join("\n");
    const active = 'RELEASE_CLASSIFICATION = "RELEASE-ACTIVE"\n';
    await mkdir(path.join(tempRoot, "planning"), { recursive: true });
    await mkdir(path.join(tempRoot, "src"), { recursive: true });
    await writeFile(path.join(tempRoot, plannedPath), planned, "utf8");
    await writeFile(path.join(tempRoot, activePath), active, "utf8");
    const evidence = await buildSemanticEvidenceBatches(
      tempRoot,
      {
        summary: { paths: 2, files: 2 },
        entries: [
          {
            path: plannedPath,
            kind: "file",
            category: "document",
            size: Buffer.byteLength(planned),
            sha256: "planned"
          },
          {
            path: activePath,
            kind: "file",
            category: "code",
            size: Buffer.byteLength(active),
            sha256: "active"
          }
        ]
      }
    );
    const packet = evidence.batches.map((batch) => batch.packet).join("\n");
    assert.match(packet, /RELEASE-LEGACY/);
    assert.match(packet, /RELEASE-ACTIVE/);

    const semanticLedger = {
      schema: "assistant.semantic-ledger/v1",
      batches: evidence.batches.map((batch) => ({
        unit_analyses: batch.unit_ids.map((unit_id) => {
          const unit = evidence.manifest.units.find(
            (candidateUnit) => candidateUnit.unit_id === unit_id
          );
          const plannedUnit = unit.path === plannedPath;
          return {
            unit_id,
            classification: "canonical_knowledge_candidate",
            semantic_roles: plannedUnit ? ["plan"] : ["current"],
            exact_elements: [
              plannedUnit ? "RELEASE-LEGACY" : "RELEASE-ACTIVE"
            ],
            conflict_candidates: [
              "The planned and active release classifications disagree."
            ]
          };
        })
      }))
    };
    const output = softwareOutput();
    const targetId = "WORK-SW-CONFLICT-001";
    output.candidate_nodes = [
      candidate(targetId, "work", [], {
        status: "blocked",
        body:
          "The plan says RELEASE-LEGACY while active code says RELEASE-ACTIVE.",
        evidence_paths: [plannedPath, activePath]
      })
    ];
    output.semantic_coverage = evidence.manifest.units.map((unit) => ({
      unit_id: unit.unit_id,
      disposition: "consolidated",
      target_ids: [targetId],
      reason: "Both observations were retained."
    }));
    output.lineage = {
      origin_ids: [targetId],
      ordered_stage_ids: [],
      current_ids: [targetId],
      complete: true,
      missing: []
    };
    output.conflicts = [];
    const findings = validateBootstrapOutput(
      output,
      { entries: [] },
      {
        profile: "software",
        semanticManifest: evidence.manifest,
        semanticLedger
      }
    );
    assert.ok(
      findings.some((finding) =>
        /unrepresented conflict candidates/.test(finding)
      )
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("software update check runs once per interactive session", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-sw-version-"));
  const target = path.join(tempRoot, "project");
  try {
    await initializeBlankProject(target);
    let calls = 0;
    const fetchImpl = async () => {
      calls += 1;
      return {
        ok: true,
        json: async () => ({ tag_name: "v0.1.0" })
      };
    };
    await checkAvailableUpdate(target, {
      fetchImpl,
      sessionId: "software-session-a",
      now: Date.parse("2026-08-02T00:00:00Z")
    });
    await checkAvailableUpdate(target, {
      fetchImpl,
      sessionId: "software-session-a",
      now: Date.parse("2026-08-02T00:01:00Z")
    });
    await checkAvailableUpdate(target, {
      fetchImpl,
      sessionId: "software-session-b",
      now: Date.parse("2026-08-02T00:02:00Z")
    });
    assert.equal(calls, 2);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("existing software bootstrap activates bounded owners and survives source masking", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-sw-existing-"));
  const target = path.join(tempRoot, "project");
  try {
    await mkdir(target, { recursive: true });
    await writeFile(
      path.join(target, "README.md"),
      "# Legacy service\n\nImplementation exists; current intent is undocumented.\n",
      "utf8"
    );
    await initializeProject(target);
    const output = softwareOutput();
    assert.deepEqual(
      validateBootstrapOutput(output, { entries: [] }, {
        profile: "software"
      }),
      []
    );
    await writeFile(
      path.join(
        target,
        ".assistant",
        "internal",
        "bootstrap",
        "model-result.json"
      ),
      `${JSON.stringify(output, null, 2)}\n`,
      "utf8"
    );
    const activation = await activateBootstrap(target);
    assert.equal(activation.validation.valid, true);
    for (const relative of [
      ".assistant/knowledge/software/ARCHITECTURE.md",
      ".assistant/knowledge/software/DELIVERY.md",
      ".assistant/knowledge/software/VERIFICATION.md",
      ".assistant/knowledge/work/ACTIVE.md"
    ]) {
      assert.equal(
        await pathExists(path.join(target, ...relative.split("/"))),
        true,
        relative
      );
    }
    const current = parseNodeDocument(
      await readFile(path.join(target, ".assistant", "CURRENT.md"), "utf8")
    );
    assert.equal(current.metadata.authorization, "not_authorized");

    await rm(path.join(target, "README.md"), { force: true });
    assert.equal((await validateProject(target)).valid, true);
    const loaded = await loadCanonicalNodes(target);
    const route = routeTask(loaded.nodes, "software_release", {
      entityIds: ["RELEASE-SW-001"]
    });
    assert.equal(route.status, "routed");
    const ids = new Set(
      route.required.flatMap((item) => item.entity_ids ?? [item.id])
    );
    for (const id of [
      "RELEASE-SW-001",
      "TEST-SW-001",
      "TASK-SW-001",
      "DESIGN-SW-001",
      "REQ-SW-001",
      "FND-SW-001"
    ]) {
      assert.equal(ids.has(id), true, id);
    }
    const bytes = route.required.reduce(
      (total, item) =>
        total +
        (activation.validation.nodes.find((node) => node.path === item.path)
          ?.bytes ?? 0),
      0
    );
    assert.ok(bytes < 48_000);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("software lifecycle resumes through failure, repair, verification, release, and promotion", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-sw-long-"));
  const target = path.join(tempRoot, "project");
  try {
    await initializeBlankProject(target);
    const foundation = serializeNodeDocument(
      {
        schema: "assistant.node/v1",
        id: "FND-SW-LONG",
        type: "foundation",
        status: "active",
        authority: "canonical_user_approved",
        origin: "ongoing",
        relations: [],
        verified_at: new Date().toISOString()
      },
      "# Software foundation\n\nProvide a stable request-validation service.\n"
    );
    const requirement = record(
      "REQ-SW-LONG",
      "requirement",
      [{ type: "derived_from", target: "FND-SW-LONG" }]
    );
    const design = record(
      "DESIGN-SW-LONG",
      "design",
      [{ type: "implements", target: requirement.id }]
    );
    const task = record(
      "TASK-SW-LONG",
      "task",
      [{ type: "implements", target: design.id }]
    );
    const verification = record(
      "TEST-SW-LONG",
      "test",
      [{ type: "verifies", target: task.id }],
      "planned"
    );
    const work = record(
      "WORK-SW-LONG",
      "work",
      [{ type: "depends_on", target: task.id }]
    );
    const architecture = collection(
      "COL-SOFTWARE-ARCHITECTURE",
      "software_architecture",
      "Software requirements and design",
      [
        {
          record: requirement,
          body: fieldBody("requirement", {
            Requirement: "Malformed requests must not mutate service state.",
            "Acceptance criteria":
              "A stable error is returned and persisted state remains unchanged."
          })
        },
        {
          record: design,
          body: fieldBody("design", {
            "Chosen approach": "Validate before the state mutation boundary.",
            "Interfaces and invariants":
              "Invalid input cannot reach the mutation layer."
          })
        }
      ]
    );
    let delivery = collection(
      "COL-SOFTWARE-DELIVERY",
      "software_delivery",
      "Software delivery",
      [{
        record: task,
        body: fieldBody("task", {
          Objective: "Implement boundary validation.",
          "Authorization and preconditions":
            "Authorized for this bounded synthetic change.",
          "Current state": "active",
          Result: "Unknown — not completed."
        })
      }]
    );
    let verificationDoc = collection(
      "COL-SOFTWARE-VERIFICATION",
      "software_verification",
      "Software verification evidence",
      [{
        record: verification,
        body: fieldBody("test", {
          "Claim or risk": "Malformed requests cannot mutate state.",
          "Oracle or expected result":
            "Stable error and unchanged persisted state.",
          "Execution and result": "Unknown — not run.",
          Disposition: "planned"
        })
      }]
    );
    let operations = collection(
      "COL-ACTIVE-OPERATIONS",
      "operations",
      "Active operations",
      [{
        record: work,
        body: "The bounded validation task is active."
      }]
    );
    await commitEpisode(target, "TXN-SW-LONG-001", [
      { path: ".assistant/knowledge/FOUNDATION.md", content: foundation },
      {
        path: ".assistant/knowledge/software/ARCHITECTURE.md",
        content: architecture
      },
      {
        path: ".assistant/knowledge/software/DELIVERY.md",
        content: delivery
      },
      {
        path: ".assistant/knowledge/software/VERIFICATION.md",
        content: verificationDoc
      },
      {
        path: ".assistant/knowledge/work/ACTIVE.md",
        content: operations
      },
      {
        path: ".assistant/CURRENT.md",
        content: await currentContent(
          target,
          {
            activity_status: "active",
            active_work_id: work.id,
            authorization: "active",
            relations: [
              { type: "routes_to", target: work.id },
              { type: "routes_to", target: task.id },
              { type: "routes_to", target: verification.id }
            ]
          },
          "Boundary validation is active and limited to the approved task."
        )
      }
    ]);

    let fresh = await loadCanonicalNodes(target);
    assert.equal(
      routeTask(fresh.nodes, "software_task", {
        entityIds: [task.id]
      }).status,
      "routed"
    );

    const issue = record(
      "ISSUE-SW-LONG",
      "issue",
      [{ type: "challenges", target: design.id }],
      "open"
    );
    task.status = "blocked";
    task.relations.push({ type: "blocked_by", target: issue.id });
    work.status = "blocked";
    work.relations.push({ type: "blocked_by", target: issue.id });
    verification.status = "failed";
    delivery = collection(
      "COL-SOFTWARE-DELIVERY",
      "software_delivery",
      "Software delivery",
      [{
        record: task,
        body: fieldBody("task", {
          Objective: "Implement boundary validation.",
          "Current state": "blocked",
          Blockers: issue.id,
          Result: "The first check exposed mutation before validation."
        })
      }]
    );
    verificationDoc = collection(
      "COL-SOFTWARE-VERIFICATION",
      "software_verification",
      "Software verification evidence",
      [{
        record: verification,
        body: fieldBody("test", {
          "Claim or risk": "Malformed requests cannot mutate state.",
          "Oracle or expected result":
            "Stable error and unchanged persisted state.",
          "Execution and result":
            "Failed — malformed input changed synthetic state.",
          "Artifact or trace identity": "trace:synthetic:first-run",
          Coverage: "Malformed request path.",
          "Non-coverage": "Concurrency and remote transports.",
          Disposition: "failed; blocks completion"
        })
      }]
    );
    operations = collection(
      "COL-ACTIVE-OPERATIONS",
      "operations",
      "Active operations",
      [
        { record: work, body: "Blocked at the verification gate." },
        {
          record: issue,
          body: fieldBody("issue", {
            Symptom: "Malformed input changed state before rejection.",
            "Context and impact": "Violates the accepted invariant.",
            Reproduction: "Submit the synthetic malformed fixture.",
            Evidence: "trace:synthetic:first-run",
            Cause: "Validation ran after mutation.",
            Resolution: "Unknown — not yet implemented.",
            Prevention: "Keep a regression test at the interface boundary.",
            "Current status": "open",
            "Related work": task.id
          })
        }
      ]
    );
    await commitEpisode(target, "TXN-SW-LONG-002", [
      {
        path: ".assistant/knowledge/software/DELIVERY.md",
        content: delivery
      },
      {
        path: ".assistant/knowledge/software/VERIFICATION.md",
        content: verificationDoc
      },
      {
        path: ".assistant/knowledge/work/ACTIVE.md",
        content: operations
      },
      {
        path: ".assistant/CURRENT.md",
        content: await currentContent(
          target,
          {
            activity_status: "blocked",
            authorization: "blocked",
            relations: [
              { type: "routes_to", target: work.id },
              { type: "routes_to", target: task.id },
              { type: "routes_to", target: issue.id },
              { type: "routes_to", target: verification.id }
            ]
          },
          "The failed oracle blocks completion; only diagnosis and repair are allowed."
        )
      }
    ]);
    assert.equal((await validateProject(target)).valid, true);

    task.status = "completed";
    task.relations = task.relations.filter(
      (relation) => relation.type !== "blocked_by"
    );
    verification.status = "passed";
    issue.status = "resolved";
    work.status = "completed";
    work.relations = work.relations.filter(
      (relation) => relation.type !== "blocked_by"
    );
    const release = record(
      "RELEASE-SW-LONG",
      "release",
      [{ type: "depends_on", target: verification.id }],
      "ready_for_user_decision"
    );
    delivery = collection(
      "COL-SOFTWARE-DELIVERY",
      "software_delivery",
      "Software delivery",
      [
        {
          record: task,
          body: fieldBody("task", {
            Objective: "Implement boundary validation.",
            "Implementation plan":
              `Validate before mutation.${" Preserve the interface invariant.".repeat(350)}`,
            "Verification": verification.id,
            "Completion or stop condition": "The declared oracle passes.",
            "Current state": "completed",
            Blockers: "None.",
            Result: "Validation now precedes mutation.",
            "Follow-up": "Retain the regression test."
          })
        },
        {
          record: release,
          body: fieldBody("release", {
            "Version and scope": "Synthetic candidate; no public version.",
            "Included requirements and changes": requirement.id,
            "Release gates": verification.id,
            "Validation evidence": "trace:synthetic:second-run",
            Authorization: "User release decision is still required.",
            Status: "ready for user decision, not released"
          })
        }
      ]
    );
    verificationDoc = collection(
      "COL-SOFTWARE-VERIFICATION",
      "software_verification",
      "Software verification evidence",
      [{
        record: verification,
        body: fieldBody("test", {
          "Claim or risk": "Malformed requests cannot mutate state.",
          "Oracle or expected result":
            "Stable error and unchanged persisted state.",
          "Execution and result": "Passed after moving validation.",
          "Artifact or trace identity": "trace:synthetic:second-run",
          Coverage: "Malformed request path.",
          "Non-coverage": "Concurrency and remote transports.",
          Disposition: "passed for the declared scope"
        })
      }]
    );
    operations = collection(
      "COL-ACTIVE-OPERATIONS",
      "operations",
      "Active operations",
      [
        { record: work, body: "Completed at the release decision boundary." },
        {
          record: issue,
          body: fieldBody("issue", {
            Symptom: "Malformed input changed state before rejection.",
            "Context and impact": "Violated the accepted invariant.",
            Reproduction: "Synthetic first-run trace.",
            Evidence: "trace:synthetic:first-run and trace:synthetic:second-run",
            Cause: "Validation ran after mutation.",
            Resolution: "Move validation before mutation.",
            Prevention: "Retain the interface regression test.",
            "Current status": "resolved and verified",
            "Related work": `${task.id}, ${verification.id}`
          })
        }
      ]
    );
    await commitEpisode(target, "TXN-SW-LONG-003", [
      {
        path: ".assistant/knowledge/software/DELIVERY.md",
        content: delivery
      },
      {
        path: ".assistant/knowledge/software/VERIFICATION.md",
        content: verificationDoc
      },
      {
        path: ".assistant/knowledge/work/ACTIVE.md",
        content: operations
      },
      {
        path: ".assistant/CURRENT.md",
        content: await currentContent(
          target,
          {
            activity_status: "terminal",
            active_work_id: work.id,
            authorization: "completed",
            relations: [
              { type: "routes_to", target: work.id },
              { type: "routes_to", target: task.id },
              { type: "routes_to", target: verification.id },
              { type: "routes_to", target: release.id }
            ]
          },
          "Implementation and bounded verification are complete; release remains a user decision."
        )
      }
    ]);
    const maintenance = await maintainStructure(target);
    assert.equal(maintenance.applied, true);
    assert.equal((await validateProject(target)).valid, true);
    await authorizeTerminalEpisode(target, {
      workId: work.id,
      episodeId: "EP-SW-LONG-001",
      locale: "ko"
    });

    fresh = await loadCanonicalNodes(target);
    const releaseRoute = routeTask(fresh.nodes, "software_release", {
      entityIds: [release.id]
    });
    assert.equal(releaseRoute.status, "routed");
    const routedIds = new Set(
      releaseRoute.required.flatMap((item) => item.entity_ids ?? [item.id])
    );
    for (const id of [
      release.id,
      verification.id,
      task.id,
      design.id,
      requirement.id,
      "FND-SW-LONG"
    ]) {
      assert.equal(routedIds.has(id), true, id);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("software lifecycle commands preserve project assets and target the software skill", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-sw-purge-"));
  const target = path.join(tempRoot, "project");
  try {
    await mkdir(path.join(target, "docs"), { recursive: true });
    await writeFile(path.join(target, "app.js"), "export const value = 1;\n", "utf8");
    await writeFile(path.join(target, "docs", "notes.md"), "human notes\n", "utf8");
    await initializeProject(target);
    assert.equal(
      await pathExists(
        path.join(target, ".agents", "skills", "assistant-software-workflow")
      ),
      true
    );
    await writeFile(path.join(target, "app.js"), "export const value = 2;\n", "utf8");
    await writeFile(path.join(target, "docs", "notes.md"), "updated\n", "utf8");
    assert.equal((await purgeAssistant(target)).status, "preview");
    assert.equal((await purgeAssistant(target, { confirmed: true })).status, "completed");
    assert.equal(await pathExists(path.join(target, ".assistant")), false);
    assert.equal(await pathExists(path.join(target, ".agents")), false);
    assert.equal(await pathExists(path.join(target, ".codex")), false);
    assert.equal(await readFile(path.join(target, "app.js"), "utf8"), "export const value = 2;\n");
    assert.equal(await readFile(path.join(target, "docs", "notes.md"), "utf8"), "updated\n");
    assert.equal(
      await pathExists(
        path.join(target, ".agents", "skills", "assistant-software-workflow")
      ),
      false
    );
    assert.equal((await initializeProject(target)).initialization_status, "bootstrap_incomplete");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("software update, export, and uninstall preserve profile continuity", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-sw-update-"));
  const target = path.join(tempRoot, "project");
  const output = path.join(tempRoot, "export");
  try {
    await initializeBlankProject(target);
    const manifestPath = path.join(target, ".assistant", "manifest.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    assert.match(manifest.update_origin, /project_assistant/);
    manifest.system_version = "0.0.0-test";
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    const updated = await updateAssistant(target);
    assert.equal(updated.status, "completed");
    assert.equal(updated.to_version, "0.1.0-dev");
    assert.equal((await exportAssistant(target, output)).status, "completed");
    assert.equal(
      JSON.parse(await readFile(path.join(output, "manifest.json"), "utf8")).profile,
      "software"
    );
    assert.equal((await uninstallAssistant(target, { confirmed: true })).status, "completed");
    assert.equal(await pathExists(path.join(target, ".assistant", "POLICY.md")), true);
    assert.equal(await pathExists(path.join(target, ".assistant", "system")), false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
