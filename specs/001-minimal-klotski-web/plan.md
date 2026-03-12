# 实施计划: 极简华容道纯网页版

**分支**: `001-minimal-klotski-web` | **日期**: 2026-03-12 | **规范**: [spec.md](./spec.md)
**输入**: 来自 `/specs/001-minimal-klotski-web/spec.md` 的功能规范

**注意**: 此模板由 `/speckit.plan` 命令填充. 执行工作流程请参见 `.specify/templates/plan-template.md`.

## 摘要

交付一个纯 Web、无运行时框架依赖的极简华容道单页应用。实现方式基于单个
`index.html`、浏览器原生 ES Modules、纯 CSS 视觉系统与原生事件输入层。
MVP 交互从“持续实时拖拽”收敛为“按压后沿主方向滑动并释放触发移动”,
以换取更低复杂度、更稳定的多端体验和更可控的测试面。运行时不引入状态管理
库、UI 框架或动画引擎; 开发期补充 ESLint、Prettier、TypeScript `checkJs`,
Vitest 与 Playwright 作为质量门控。构建阶段通过 `npm run build` 生成
`/dist` 静态产物, 并校验 `index.html`、样式、脚本与资源引用可被静态托管
直接消费。

## 技术背景

**语言/版本**: HTML5 + CSS3 + JavaScript (ES2023 模块), Node.js 22 LTS(仅开发工具链)
**Language/Version**: HTML5 + CSS3 + JavaScript (ES2023 modules), Node.js 22 LTS for tooling
**主要依赖**: 运行时零依赖; 开发依赖为 ESLint, Prettier, TypeScript(checkJs), Vitest, Playwright
**Primary Dependencies**: Runtime browser APIs only; dev tooling: ESLint, Prettier, TypeScript (checkJs), Vitest, Playwright
**存储**: N/A - 对局状态驻留内存, 关卡数据为静态模块, 并通过 JSON Schema + 自定义 invariant 校验保证布局合法性
**Storage**: N/A - in-memory session state with static level modules
**代码质量门控**: `prettier --check`, `eslint`, `tsc --noEmit --checkJs`, `vitest run`, `playwright test`, `npm run build`
**测试**: Vitest 单元测试 + Playwright 集成/响应式/回归测试 + 手动性能验收脚本
**目标平台**: Playwright 覆盖 Chromium 与 WebKit; 视口覆盖手机(390x844)、平板(820x1180)和桌面(1440x900), 并手动补充 Safari 桌面端最终验收
**项目类型**: 单页面静态 Web 应用
**Project Type**: Single-page static web app
**用户体验影响**: 单屏沉浸式棋盘 + HUD + 通关层; 需要统一覆盖加载、空状态、错误、成功、反馈权限受限状态
**性能预算**: 95% 合法手势 50ms 内出现反馈, 吸附/回弹 250ms 内完成, 首屏 2s 内可玩, 重布局 1s 内恢复
**约束条件**: 无运行时框架、无后端、无数据库、无 Canvas、无状态管理库; 以静态托管和离线单人玩法为 MVP 边界
**规模/范围**: 1 个单页入口, 1 套核心棋盘 UI, 5-10 个精选经典关卡, 1 条撤销历史链, 可选音效/震动反馈

## 章程检查

*门控: 必须在阶段 0 研究前通过, 并在阶段 1 设计后复核.*

- [x] **代码质量优先**: 采用 Prettier、ESLint 和 `tsc --checkJs` 形成格式化、
  静态检查和类型检查门控; 运行时零框架减少表面积, 模块边界通过 UI 合同和
  关卡 schema 固化。
- [x] **测试标准不可协商**: 规则引擎、手势判定和历史栈由 Vitest 覆盖;
  核心流程、响应式布局、反馈降级和胜利流程由 Playwright 覆盖; 当前无计划
  豁免项。
- [x] **用户体验一致性**: 计划明确单页信息层级、状态反馈、响应式断点、
  控件层级和可访问性约束, 并通过 UI 合同和 quickstart 验收步骤落地。
- [x] **性能要求前置**: 性能预算与验收指标已写入计划; 使用浏览器
  Performance API 与 Playwright 场景脚本记录首屏、手势反馈和重布局时间。

## 项目结构

### 文档(此功能)

```
specs/001-minimal-klotski-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── level.schema.json
│   └── ui-contract.md
└── tasks.md
```

### 源代码(仓库根目录)

```
index.html

scripts/
├── build.mjs
└── dev-server.mjs

dist/

styles/
├── tokens.css
└── app.css

src/
├── main.js
├── engine/
│   ├── board-state.js
│   ├── movement-rules.js
│   └── victory.js
├── input/
│   └── gesture-controller.js
├── state/
│   ├── levels.js
│   ├── session-store.js
│   ├── history-stack.js
│   └── validate-levels.js
├── ui/
│   ├── board-renderer.js
│   ├── hud.js
│   ├── overlays.js
│   └── settings-panel.js
└── feedback/
    ├── audio-feedback.js
    └── haptics.js

assets/
└── audio/

docs/
├── usability-session.md
└── playtest-results.md

tests/
├── contract/
│   ├── level-schema.test.js
│   ├── level-invariants.test.js
│   └── ui-contract.test.js
├── setup/
│   └── vitest.setup.js
├── unit/
│   ├── engine/
│   ├── feedback/
│   ├── input/
│   └── state/
└── integration/
    ├── gameplay.spec.js
    ├── progress-controls.spec.js
    ├── responsive.spec.js
    ├── feedback-fallback.spec.js
    └── performance-smoke.spec.js
```

**结构决策**: 保持单页静态项目结构, 将运行时代码按规则引擎、输入、状态、
渲染与反馈分层。这样既符合“一个 `index.html` + 原生 JS/CSS”的极简目标,
又能让测试和后续任务按模块拆分。

## 复杂度跟踪

> **仅在章程检查有必须证明的违规时填写**

当前无章程违规或豁免项, 不需要复杂度例外登记。
