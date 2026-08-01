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

---

# 소프트웨어 프로젝트 보조 시스템

상태: Windows 로컬에서 사용할 수 있는 프로토타입이며, 아직 공개 릴리스 준비는
완료되지 않았습니다.

이 디렉터리는 소프트웨어 개발용 Agent Documentation & Assistant System의
독립 소스 루트입니다. 연구용 에디션과 동일하게 검증된 문서화 커널을 사용하되,
요구사항 → 설계 → 작업 → 테스트 → 릴리스로 이어지는 소프트웨어 전용 의미
프로필을 설치합니다.

초기화된 프로젝트 자체가 아닙니다. 의존성 없는 Node 런타임, Windows `.cmd`
실행기, 설치 프로그램, 프로젝트 템플릿, validator, 제한 구역 게이트웨이,
소프트웨어 워크플로 Skill 및 테스트를 포함합니다.

현재 요구 사항은 Node.js 20 이상, Codex CLI, Windows 네이티브 `elevated`
sandbox 설정입니다. 다음 명령으로 프로젝트를 초기화합니다.

```text
assistant.cmd init --target <프로젝트-경로>
```

Codex가 요청하면 설치된 프로젝트 설정을 검토하고 신뢰한 뒤
`assistant.cmd doctor --target <프로젝트-경로>`를 다시 실행합니다. 정상 사용을
시작하려면 doctor가 `ready`를 보고해야 합니다. 제한된 source, report, vault 및
capability 경로는 permission profile, Windows ACL 및 정확한 경로만 허용하는
게이트웨이로 보호됩니다.

릴리스 패키징, 업데이트 배포, 지원 정책 및 macOS/Linux 검증은 아직 이 Windows
빌드의 범위 밖입니다.

## 기여 및 라이선스

보호된 `main` 브랜치의 작업 절차는 [CONTRIBUTING.md](CONTRIBUTING.md)를
참조하십시오. Apache-2.0 라이선스를 적용하며, 자세한 내용은
[LICENSE](LICENSE)를 참조하십시오.
