import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(testDirectory, "..", "..");
const windows = process.platform === "win32";
const launcher = path.join(packageRoot, windows ? "assistant.cmd" : "assistant");

function runLauncher(args) {
  const effectiveArgs = args.includes("--json") ? args : [...args, "--json"];
  const result = spawnSync(
    windows ? "cmd.exe" : launcher,
    windows ? ["/d", "/c", launcher, ...effectiveArgs] : effectiveArgs,
    {
      cwd: packageRoot,
      encoding: "utf8",
      windowsHide: true
    }
  );
  assert.equal(
    result.status,
    0,
    `command failed: ${effectiveArgs.join(" ")}\nstdout=${result.stdout}\nstderr=${result.stderr}`
  );
  return JSON.parse(result.stdout);
}

test("software platform launcher initializes and validates a spaced path", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "assistant-software-cli-"));
  const target = path.join(tempRoot, "project with spaces");
  try {
    const initialized = runLauncher(["init", "--target", target]);
    assert.equal(initialized.initialization_status, "ready");

    const validation = runLauncher(["validate", "--target", target]);
    assert.equal(validation.valid, true);
    assert.equal(validation.manifest.profile, "software");
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("software migration stops before model work and installed CLI gives a human handoff", async () => {
  const tempRoot = await mkdtemp(
    path.join(os.tmpdir(), "assistant-software-migration-")
  );
  const target = path.join(tempRoot, "legacy project");
  try {
    await mkdir(path.join(target, "docs", "agent"), { recursive: true });
    await writeFile(
      path.join(target, "AGENTS.md"),
      "# Existing repository rules\n\nRead docs/agent/INDEX.md before work.\n",
      "utf8"
    );
    await writeFile(
      path.join(target, "docs", "agent", "INDEX.md"),
      "# Legacy index\n",
      "utf8"
    );
    const initialized = runLauncher([
      "init",
      "--target",
      target,
      "--yes"
    ]);
    assert.equal(initialized.completion.readiness, "system_migration_required");
    assert.equal(initialized.selection.model, "gpt-5.6-sol");
    assert.equal(initialized.selection.effort, "high");
    for (const relative of [
      "lib/bootstrap.mjs",
      "lib/evidence-packet.mjs",
      "lib/legacy-surfaces.mjs",
      "prompts/bootstrap-batch-v1.md",
      "prompts/bootstrap-discovery-v1.md",
      "schemas/bootstrap-batch-output.schema.json",
      "schemas/bootstrap-discovery.schema.json",
      "schemas/bootstrap-output.schema.json"
    ]) {
      const installed = await import("node:fs/promises").then(({ stat }) =>
        stat(
          path.join(
            target,
            ".assistant",
            "system",
            ...relative.split("/")
          )
        ).then(() => true, () => false)
      );
      assert.equal(installed, true, `missing installed continuation asset ${relative}`);
    }
    const executionExists = await import("node:fs/promises").then(({ stat }) =>
      stat(
        path.join(
          target,
          ".assistant",
          "internal",
          "bootstrap",
          "execution.json"
        )
      ).then(() => true, () => false)
    );
    assert.equal(executionExists, false);

    const installedRuntime = path.join(
      target,
      ".assistant",
      "system",
      "runtime",
      "assistant.mjs"
    );
    const status = spawnSync(
      process.execPath,
      [installedRuntime, "migration", "--target", target],
      { cwd: target, encoding: "utf8", windowsHide: true }
    );
    assert.equal(status.status, 0, status.stderr);
    assert.doesNotMatch(status.stdout, /^\s*\{/u);
    assert.match(status.stdout, /interactive Codex/i);
    assert.match(status.stdout, /gpt-5\.6-sol/i);
    assert.match(status.stdout, /high/i);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
