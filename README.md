# Software Assistant System

Status: usable Windows-local prototype; not yet public-release-ready.

This directory is the standalone source root of the software-development Agent
Documentation & Assistant System. It installs the same validated documentation
kernel as the research edition with a software-specific
requirement → design → task → test → release semantic profile.

It is not an initialized project instance. The build contains a dependency-free
Node runtime, Windows `.cmd` launcher, installer, project template, validator,
restricted gateway, software workflow Skill, and tests.

Current prerequisites are Node.js 20+, Codex CLI, and the native Windows
`elevated` sandbox setup. Initialize a project with:

```text
assistant.cmd init --target <project-path>
```

Review and trust the installed project config if Codex requests it, then rerun
`assistant.cmd doctor --target <project-path>`. Normal use requires doctor to
report `ready`. Restricted source, report, vault, and capability paths are
protected by a permission profile, Windows ACLs, and an exact-grant gateway.

Release packaging, update delivery, support policy, and macOS/Linux validation
remain outside this Windows build.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) for the protected-main workflow.
Licensed under Apache-2.0; see [LICENSE](LICENSE).
