# Software Project Assistant System

Status: usable cross-platform preview; not yet public-release-ready.

This repository distributes the software-project profile of the Agent
Documentation & Assistant System. It is not an initialized project. It
contains Windows and POSIX launchers, the project template, deterministic
documentation kernel, software workflow Skill, restricted gateway, validators,
and regression suite.

The Assistant is an optional local tool. People and the project remain
sovereign: collaborators may work without it, and out-of-band changes to code,
documents, data, or Git history are normal project events to reconcile.

## Requirements

- Node.js 20 or later
- Codex CLI
- A working native Codex sandbox backend:
  - Windows: native `elevated` sandbox setup
  - macOS: Codex Seatbelt
  - Linux: bubblewrap/user namespaces and distribution-required policy

On Ubuntu 24.04 with restricted unprivileged user namespaces, load the packaged
`bwrap-userns-restrict` AppArmor profile before activation.

## Initialize a project

Run from this repository root:

```text
# Windows
assistant.cmd init --target <project-path> --yes

# Linux or macOS
./assistant init --target <project-path> --yes
```

Quote paths when the shell requires it, such as when a path contains spaces.
Provide an explicit source file or directory with repeatable `--source`:

```text
assistant.cmd init --target <project-path> --source <exact-path> --yes
```

Explicit sources are copied into immutable Assistant intake storage for that
initialization episode. The originals remain user-owned. A source directory
grant covers its complete bounded contents.

Existing projects require acknowledgement of the model and token-cost notice.
The default initialization selection is `gpt-5.6-sol` with `high` reasoning
effort. `--profile` is mutually exclusive with `--model` and `--effort`.
Long initialization prints phase and elapsed-time heartbeats. There is no
default wall-clock timeout: the Codex session, workspace, evidence identity,
model/profile, and effort are persisted and resumed.

If repository-native AGENTS, Codex config, or Skill rules need reconciliation,
initialization stops before semantic model work and prints an interactive Codex
handoff. This migration changes the Assistant control route only; it does not
move or delete referenced project documents.

## Existing-project semantic migration

Initialization inventories the whole project boundary. It does not assume that
documentation lives under `docs/`, use a filename such as `MASTER_PLAN.md`, or
infer meaning from a directory named `archive`.

Knowledge-bearing text is processed as stable semantic units in resumable
batches. Modern DOCX, PPTX, XLSX, ODT, RTF, and PDF inputs receive bounded,
non-executing representations. Macros, embedded programs, and external
relationships are never run. Encrypted, image-only, corrupt, oversized, or
legacy DOC/PPT/XLS inputs become explicit gaps instead of silent omissions.

Activation requires loss-aware coverage, origin-to-current lineage, explicit
current state and authorization, preserved requirements and design evolution,
tests and releases, failures and corrections, resolved material conflicts, and
no live dependency on original project documents.

Document candidates are classified by meaning. A spreadsheet may be a plan,
report, inventory, or operational dataset; extension and location do not
decide its role.

## Human document cold zone

After initialization:

- `docs/` is human-managed cold document space.
- The Assistant does not list, search, read, or use it during normal work.
- An exact file or directory named in the current prompt receives a temporary,
  purpose-bounded gateway grant.
- `docs/report/` is the only write exception for new derived reports. Reports
  are never canonical authority or fallback input.
- A human document kept outside `docs/` becomes an exact cold-in-place boundary.

For scattered human documents, initialization shows one whole relocation
preview after their meaning has been integrated. It includes source,
destination, role, canonical targets, reason, and rollback conditions. Nothing
moves without explicit approval. Approved moves are hash-verified and recorded
in a reversible ledger. Destination collisions, modified relocated files, and
occupied original paths fail closed without overwrite.

## Normal operation

Work needing project context begins with the small orientation set and follows
only the relevant semantic route. Canonical knowledge evolves with material
results, decisions, blockers, authorization, and current state. Cold documents
are not reopened as a shortcut.

Run doctor after trusting the installed project configuration:

```text
# Windows
<project-path>\.assistant\system\assistant.cmd doctor --target <project-path>

# Linux or macOS
<project-path>/.assistant/system/assistant doctor --target <project-path>
```

Protected workflows require doctor to report `ready`. The Codex permission
profile and exact-grant gateway protect `docs/`, external cold documents,
`.assistant/vault`, and internal capability data. Windows also uses NTFS ACL
defense in depth. Activation fails closed if sandbox denial cannot be proven.

## Lifecycle and updates

Lifecycle commands are preview-first:

```text
assistant uninstall --target <project-path>
assistant export --target <project-path> --output <outside-path>
assistant purge --target <project-path>
assistant update --target <project-path>
```

When approved relocations are active, uninstall and purge require one explicit
layout choice: `--keep-layout` or `--restore-relocations`. Restore never
overwrites a changed destination or occupied original. `uninstall` preserves
local canonical continuity while removing runtime integration. `purge` removes
Assistant-owned local state and integration. Project code, data, configuration,
documents, and Git history are otherwise preserved.

On the first prompt of each identifiable Codex session, a non-model checker
requests only public GitHub release metadata. It reports a newer version once,
never updates automatically, and remains silent when current or offline.
Disable it with `update_check = disabled`; run `update` explicitly from a newly
downloaded release.

Windows, Linux, and macOS run the same required regression suite.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) for the protected-main workflow.
Licensed under Apache-2.0; see [LICENSE](LICENSE).

---

# 소프트웨어 프로젝트 어시스턴트 시스템

상태: Windows, Linux, macOS에서 사용할 수 있는 프리뷰이며 아직 공개 릴리스 준비
단계는 아닙니다.

이 저장소는 소프트웨어 프로젝트용 Agent Documentation & Assistant System의 배포
원본입니다. 초기화된 프로젝트 자체가 아니라 실행기, 프로젝트 템플릿, 문서 운영
커널, 소프트웨어 워크플로 Skill, 제한 구역 gateway, validator와 회귀 테스트를
제공합니다.

Assistant는 선택적인 로컬 보조 도구입니다. 사람과 프로젝트가 항상 주체이며,
Assistant 없이 수행한 코드·문서·데이터·Git 변경도 정상적인 프로젝트 사건으로
인식하고 이후 상태를 조율합니다.

## 요구 환경

- Node.js 20 이상
- Codex CLI
- 운영체제별 Codex sandbox backend
  - Windows: native `elevated` sandbox 설정
  - macOS: Codex Seatbelt
  - Linux: bubblewrap/user namespace와 배포판별 보안 정책

## 프로젝트 초기화

이 저장소 루트에서 실행합니다.

```text
# Windows
assistant.cmd init --target <프로젝트-경로> --yes

# Linux 또는 macOS
./assistant init --target <프로젝트-경로> --yes
```

경로에 공백이 있는 등 현재 shell이 요구할 때 따옴표로 감쌉니다. 정확한 초기
자료는 `--source <정확한-경로>`를 반복해 지정할 수 있습니다. 지정된 자료는 해당
초기화 episode의 immutable intake에 복사되며 원본의 소유권과 위치는 유지됩니다.

기존 프로젝트 초기화는 model/token 비용 안내 확인이 필요합니다. 기본값은
`gpt-5.6-sol`과 `high` reasoning effort입니다. `--profile`은 `--model`,
`--effort`와 함께 사용할 수 없습니다. 장시간 작업은 단계와 경과 시간을 계속
알리며 기본 시간 제한 없이 같은 Codex session과 evidence identity를 이어갑니다.

기존 AGENTS, Codex 설정, Skill 규칙의 조율이 필요하면 semantic 분석 전에 멈추고
interactive Codex에서 수행할 정확한 안내를 출력합니다. 이 단계는 Assistant 제어
경로만 조율하며 참조된 프로젝트 문서를 이동하거나 삭제하지 않습니다.

## 기존 프로젝트 의미 이관

초기화는 프로젝트 전체 경계를 조사합니다. 문서가 `docs/`에 있다고 가정하거나
`MASTER_PLAN.md`, `archive` 같은 이름에 특별한 의미를 하드코딩하지 않습니다.

지식이 있는 자료는 안정적인 semantic unit와 재개 가능한 batch로 처리합니다.
DOCX, PPTX, XLSX, ODT, RTF, PDF는 코드를 실행하지 않는 제한된 표현으로
추출합니다. 매크로와 외부 관계는 실행하지 않습니다. 암호화·이미지 전용·손상·
과대 크기·legacy DOC/PPT/XLS는 누락하지 않고 명시적인 gap으로 기록합니다.

활성화 전에는 의미 보전 coverage, 시작부터 현재까지의 lineage, 요구사항·설계·
테스트·릴리스·실패·수정 이력, 현재 상태와 권한, 충돌 해결, 원문에 의존하지 않는
closed-book 동작을 검증합니다. 문서 후보는 확장자나 위치가 아니라 실제 역할로
분류합니다.

## 사람 문서 cold zone

초기화 후에는 다음이 적용됩니다.

- `docs/`는 사람이 자유롭게 관리하는 cold document 공간입니다.
- Assistant는 정상 작업에서 그 안을 목록화·검색·열람·참조하지 않습니다.
- 현재 prompt가 정확히 지정한 파일이나 디렉터리만 목적이 제한된 임시 grant를
  받습니다.
- `docs/report/`만 새 파생 보고서를 쓰는 예외이며 보고서는 정규 권위가 아닙니다.
- `docs/` 밖에 유지하기로 한 사람 문서는 정확한 cold-in-place 경계가 됩니다.

흩어진 문서는 의미 통합 후 한 번의 전체 relocation preview로 제안합니다. 현재
경로, 목적지, 역할, 정규 지식 대상, 이유, 복구 조건을 보여주며 명시적 승인 전에는
이동하지 않습니다. 승인된 이동은 hash 검증과 가역 ledger를 사용하고 충돌이나
사후 수정이 발견되면 덮어쓰지 않고 중단합니다.

## 정상 운영과 생명주기

프로젝트 문맥이 필요한 작업은 작은 orientation set에서 시작해 관련 semantic
route만 따릅니다. 중요한 결과·결정·blocker·권한·현재 상태가 변할 때 정규 지식을
갱신하며 cold 문서를 편의상 다시 여는 fallback은 금지됩니다.

보호 워크플로를 사용하기 전 `doctor`가 `ready`인지 확인합니다. Codex permission
profile과 exact-grant gateway가 `docs/`, 외부 cold 문서, `.assistant/vault`,
내부 capability 자료를 보호합니다. Windows는 NTFS ACL도 방어층으로 사용합니다.

`uninstall`, `export`, `purge`, `update`는 먼저 preview를 제공합니다. relocation이
남아 있으면 제거 시 `--keep-layout` 또는 `--restore-relocations`를 명시해야 하며,
복구는 수정된 목적지나 이미 사용 중인 원래 경로를 덮어쓰지 않습니다. 그 외
프로젝트 코드·데이터·설정·문서·Git 이력은 보존됩니다.

식별 가능한 Codex session의 첫 prompt에서는 모델을 사용하지 않는 checker가 공개
GitHub 릴리스 metadata만 확인합니다. 새 버전이 있을 때 한 번 알릴 뿐 자동
업데이트하지 않으며 최신이거나 offline이면 조용히 끝납니다.

Windows, Linux, macOS는 동일한 필수 회귀 테스트를 실행합니다.

## 기여와 라이선스

보호된 `main` 작업 절차는 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하십시오.
Apache-2.0 라이선스이며 자세한 내용은 [LICENSE](LICENSE)에 있습니다.
