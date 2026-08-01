import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(testDirectory, "..", "..");
const windows = process.platform === "win32";
const launcher = path.join(packageRoot, windows ? "assistant.cmd" : "assistant");

function runLauncher(args) {
  const result = spawnSync(
    windows ? "cmd.exe" : launcher,
    windows ? ["/d", "/c", launcher, ...args] : args,
    {
      cwd: packageRoot,
      encoding: "utf8",
      windowsHide: true
    }
  );
  assert.equal(
    result.status,
    0,
    `command failed: ${args.join(" ")}\nstdout=${result.stdout}\nstderr=${result.stderr}`
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
