---
description: "极简华容道纯网页版任务列表"
---

# 任务: 极简华容道纯网页版

**输入**: 来自 `/specs/001-minimal-klotski-web/` 的设计文档
**前置条件**: plan.md(必需), spec.md(必需), research.md, data-model.md, contracts/, quickstart.md

**测试**: 测试不是可选项. 每个用户故事都包含单元、合约/合同、集成或回归验证任务。

**组织结构**: 任务按用户故事分组, 以保证每个故事都能独立实施、独立验证 UX 一致性并证明性能达标。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可以并行运行(不同文件, 无依赖关系)
- **[Story]**: 此任务属于哪个用户故事(例如: US1, US2, US3)
- 每条任务都包含确切文件路径

## 路径约定

- 单页静态 Web 应用: `index.html`, `styles/`, `src/`, `assets/`, `tests/`
- 集成测试: `tests/integration/`
- 合同测试: `tests/contract/`
- 单元测试: `tests/unit/`

## 阶段 1: 设置(共享基础设施)

**目的**: 初始化静态 Web 项目、开发脚本和质量门控。

- [x] T001 在 `/package.json` 中初始化 npm 项目并声明 `dev`、`build`、`preview`、`format:check`、`lint`、`typecheck`、`test:unit`、`test:e2e` 脚本
- [x] T002 在 `/scripts/dev-server.mjs` 和 `/scripts/build.mjs` 中实现本地静态开发服务器与静态产物构建流程, 生成 `/dist` 目录
- [x] T003 [P] 在 `/eslint.config.js` 中配置原生 JavaScript/浏览器环境的 ESLint 规则
- [x] T004 [P] 在 `/.prettierrc.json` 和 `/.prettierignore` 中配置格式化规则与忽略项
- [x] T005 [P] 在 `/tsconfig.json` 中启用 `checkJs` 和 `noEmit` 以执行 JavaScript 类型检查
- [x] T006 [P] 在 `/vitest.config.js` 和 `/tests/setup/vitest.setup.js` 中配置 Vitest 运行环境
- [x] T007 [P] 在 `/playwright.config.js` 中配置 Chromium/WebKit 浏览器矩阵, 并定义手机(390x844)、平板(820x1180)和桌面(1440x900)视口项目

---

## 阶段 2: 基础(阻塞前置条件)

**目的**: 建立所有用户故事共享的应用骨架、合同校验和基础状态模型。

**⚠️ 关键**: 在此阶段完成之前, 不得开始用户故事开发。

- [x] T008 在 `/index.html` 中创建 `#app` 根节点、`aria-live` 状态区域和基础 HUD/棋盘占位结构
- [x] T009 [P] 在 `/styles/tokens.css` 和 `/styles/app.css` 中定义莫兰迪色板、圆角、阴影、排版和全局布局规则
- [x] T010 [P] 在 `/src/state/levels.js` 和 `/src/state/validate-levels.js` 中建立关卡模块骨架, 预留 `Level` schema 校验、自定义不变量校验和默认关卡导出
- [x] T011 [P] 在 `/src/state/session-store.js` 和 `/src/state/history-stack.js` 中建立对局状态、计时和撤销历史的基础数据结构
- [x] T012 [P] 在 `/tests/contract/level-schema.test.js` 和 `/tests/contract/level-invariants.test.js` 中为 `/specs/001-minimal-klotski-web/contracts/level.schema.json`、`/src/state/validate-levels.js` 和 `/src/state/levels.js` 编写关卡字段形状与布局不变量合同测试
- [x] T013 [P] 在 `/tests/contract/ui-contract.test.js` 中为 `/specs/001-minimal-klotski-web/contracts/ui-contract.md` 约定的测试钩子、状态区域、`level-select`、`undo-button`、`restart-button`、`sound-toggle` 和 `haptics-toggle` 编写 UI 合同测试
- [x] T014 [P] 在 `/src/ui/hud.js`, `/src/ui/overlays.js` 和 `/src/ui/settings-panel.js` 中建立 HUD、加载态、空状态、提示层和设置面板骨架
- [x] T015 [P] 在 `/src/ui/board-renderer.js` 中建立棋盘容器、棋子 DOM 映射和响应式尺寸计算骨架
- [x] T016 [P] 在 `/tests/integration/performance-smoke.spec.js` 中建立首屏可玩时间、手势反馈和重布局性能采样脚手架
- [x] T017 在 `/src/main.js` 中完成应用启动流程、模块装配和基础加载/空状态/错误状态切换

**检查点**: 项目骨架、合同测试和共享状态已就绪, 可以开始实现用户故事。

---

## 阶段 3: 用户故事 1 - 沉浸式解谜主流程 (优先级: P1) 🎯 MVP

**目标**: 让玩家在默认关卡中完成按压滑动、合法移动、阻挡回弹和通关判定的完整解谜闭环。

**独立测试**: 在手机和桌面浏览器打开默认关卡, 完成一次合法滑动、一次非法滑动失败, 并触发通关反馈。

### 用户故事 1 的测试与验证(必需)

- [x] T018 [P] [US1] 在 `/tests/unit/engine/board-state.test.js` 和 `/tests/unit/engine/movement-rules.test.js` 中编写棋盘占位、碰撞检测和合法移动单元测试
- [x] T019 [P] [US1] 在 `/tests/unit/engine/victory.test.js` 和 `/tests/unit/input/gesture-controller.test.js` 中编写出口判定、方向锁定和滑动阈值单元测试
- [x] T020 [P] [US1] 在 `/tests/integration/gameplay.spec.js` 中编写默认关卡加载、合法移动、非法回弹和通关流程集成测试
- [x] T021 [US1] 在 `/tests/integration/gameplay.spec.js` 和 `/specs/001-minimal-klotski-web/quickstart.md` 中补充加载态、空状态、错误态、成功态和 `aria-live` 反馈的 UX 验证断言与手动验收步骤
- [x] T022 [US1] 在 `/tests/integration/performance-smoke.spec.js` 中为合法手势反馈 50ms 和吸附/回弹 250ms 预算添加性能断言

### 用户故事 1 的实施

- [x] T023 [P] [US1] 在 `/src/engine/board-state.js` 中实现 4x5 网格占位计算、棋子快照和空位查询逻辑
- [x] T024 [P] [US1] 在 `/src/engine/movement-rules.js` 中实现单轴移动判定、阻挡检测和目标落点求解逻辑
- [x] T025 [P] [US1] 在 `/src/engine/victory.js` 中实现目标棋子出口检测和通关判定逻辑
- [x] T026 [US1] 在 `/src/input/gesture-controller.js` 中实现按压后滑动、主方向识别、阈值判定和释放触发机制
- [x] T027 [US1] 在 `/src/ui/board-renderer.js` 中实现棋子定位、吸附/回弹过渡和棋盘 DOM 更新逻辑
- [x] T028 [US1] 在 `/src/main.js` 中串联默认关卡加载、合法移动提交、胜利状态切换和错误恢复流程
- [x] T029 [US1] 在 `/src/ui/hud.js` 和 `/src/ui/overlays.js` 中实现默认关卡 HUD、加载提示、错误提示和通关层内容
- [x] T030 [US1] 在 `/styles/tokens.css` 和 `/styles/app.css` 中实现棋盘、棋子、按压态、胜利态和回弹/吸附动效样式

**检查点**: 默认关卡可完整游玩, 规则正确, 非法移动会回弹, 胜利流程可独立验收。

---

## 阶段 4: 用户故事 2 - 低挫败试错与挑战进程 (优先级: P2)

**目标**: 提供经典关卡切换、步数与时间统计、撤销/重开能力, 降低试错挫败感。

**独立测试**: 切换至少两个关卡, 完成若干步移动, 使用撤销和重开, 并验证步数、用时和关卡状态同步更新。

### 用户故事 2 的测试与验证(必需)

- [x] T031 [P] [US2] 在 `/tests/unit/state/levels.test.js`, `/tests/unit/state/session-store.test.js` 和 `/tests/unit/state/history-stack.test.js` 中编写关卡加载、计时计步和撤销栈单元测试
- [x] T032 [P] [US2] 在 `/tests/integration/progress-controls.spec.js` 中编写关卡切换、撤销、重开和无历史记录提示的集成测试
- [x] T033 [US2] 在 `/tests/integration/progress-controls.spec.js` 和 `/specs/001-minimal-klotski-web/quickstart.md` 中验证关卡选择、按钮禁用态和非阻断提示的 UX 规则
- [x] T034 [US2] 在 `/tests/integration/performance-smoke.spec.js` 中为关卡切换和重开后的 1 秒内稳定重布局添加性能断言

### 用户故事 2 的实施

- [x] T035 [P] [US2] 在 `/src/state/levels.js` 中填充精选经典关卡数据、难度元数据和参考最优步数
- [x] T036 [US2] 在 `/src/state/session-store.js` 中实现关卡加载、对局计时、步数累加和状态重置逻辑
- [x] T037 [US2] 在 `/src/state/history-stack.js` 中实现移动快照入栈、撤销回退和历史清空逻辑
- [x] T038 [US2] 在 `/src/ui/hud.js` 中实现关卡名称、难度、步数和计时的实时渲染
- [x] T039 [US2] 在 `/src/ui/settings-panel.js` 中实现关卡选择、撤销和重开控件及其禁用态
- [x] T040 [US2] 在 `/src/main.js` 中接通关卡切换、撤销和重开事件流, 保证与棋盘渲染同步
- [x] T041 [US2] 在 `/src/ui/overlays.js` 和 `/styles/app.css` 中补齐关卡库为空、无历史记录、关卡加载失败和流程提示的轻量反馈样式

**检查点**: 玩家可以切换关卡并低成本试错, 计时计步和撤销/重开行为稳定可验收。

---

## 阶段 5: 用户故事 3 - 细节反馈与设备适配打磨 (优先级: P3)

**目标**: 在支持的设备上提供克制音效、轻微震感和稳定的多端布局, 强化数字玩具质感。

**独立测试**: 在支持和不支持音频/震动的设备上分别完成移动, 并在手机、平板和桌面视口下检查棋盘比例和居中表现。

### 用户故事 3 的测试与验证(必需)

- [x] T042 [P] [US3] 在 `/tests/unit/feedback/audio-feedback.test.js` 和 `/tests/unit/feedback/haptics.test.js` 中编写音频能力检测、震动能力检测和开关逻辑单元测试
- [x] T043 [P] [US3] 在 `/tests/integration/responsive.spec.js` 和 `/tests/integration/feedback-fallback.spec.js` 中编写响应式布局、反馈开关和能力降级集成测试
- [x] T044 [US3] 在 `/tests/integration/feedback-fallback.spec.js` 和 `/tests/integration/progress-controls.spec.js` 中验证全部非拖拽控件的标签、焦点态、权限受限提示和键盘可理解性
- [x] T045 [US3] 在 `/tests/integration/performance-smoke.spec.js` 中为旋转屏幕、视口变化和首屏可玩时间添加性能断言

### 用户故事 3 的实施

- [x] T046 [P] [US3] 在 `/src/feedback/audio-feedback.js` 中实现可开关的轻量音效播放控制器
- [x] T047 [P] [US3] 在 `/src/feedback/haptics.js` 中实现 `navigator.vibrate` 能力检测和安全调用封装
- [x] T048 [US3] 在 `/src/ui/settings-panel.js` 和 `/src/state/session-store.js` 中实现音效/震动开关与当前会话偏好同步
- [x] T049 [US3] 在 `/src/ui/board-renderer.js` 和 `/src/main.js` 中实现视口变化重布局、棋盘居中和继续对局逻辑
- [x] T050 [US3] 在 `/styles/tokens.css` 和 `/styles/app.css` 中打磨响应式留白、控件焦点态、反馈开关样式和低噪视觉细节
- [x] T051 [US3] 在 `/src/main.js` 和 `/src/ui/overlays.js` 中接通合法落位时的音效/震动触发与权限受限降级提示

**检查点**: 产品在多端下保持稳定视觉比例, 反馈能力可用时生效, 不可用时优雅降级。

---

## 阶段 6: 完善与横切关注点

**目的**: 清理横切问题并完成最终质量门控。

- [x] T052 [P] 在 `/README.md` 和 `/specs/001-minimal-klotski-web/quickstart.md` 中补充运行方式、验收路径和已实现能力说明
- [x] T053 在 `/src/main.js`, `/src/ui/board-renderer.js` 和 `/src/input/gesture-controller.js` 中重构重复事件与 DOM 查询逻辑
- [x] T054 在 `/src/main.js`, `/src/feedback/audio-feedback.js` 和 `/src/feedback/haptics.js` 中加固能力检测和静默降级分支
- [x] T055 [P] 在 `/tests/integration/gameplay.spec.js`, `/tests/integration/progress-controls.spec.js` 和 `/tests/integration/feedback-fallback.spec.js` 中补齐回归断言并清理脆弱选择器
- [x] T056 在 `/package.json`, `/scripts/build.mjs`, `/tests/integration/performance-smoke.spec.js` 和 `/specs/001-minimal-klotski-web/quickstart.md` 中对齐最终质量门控命令、构建校验与验收记录
- [x] T057 [P] 在 `/specs/001-minimal-klotski-web/quickstart.md` 和 `/docs/usability-session.md` 中定义首次访问试玩记录表, 记录进入页面到首手合法移动的完成时间
- [x] T058 [P] 在 `/docs/usability-session.md` 和 `/docs/playtest-results.md` 中建立 5 分制“操作手感/视觉舒适度”回收模板并汇总课堂试玩结果

---

## 依赖关系与执行顺序

### 阶段依赖关系

- **阶段 1: 设置**: 无依赖, 可立即开始。
- **阶段 2: 基础**: 依赖阶段 1 完成, 阻塞所有用户故事。
- **阶段 3: 用户故事 1**: 依赖阶段 2 完成, 是 MVP 核心路径。
- **阶段 4: 用户故事 2**: 依赖阶段 3 的可玩棋盘和移动提交流程。
- **阶段 5: 用户故事 3**: 依赖阶段 3 的移动事件和基础 UI; 可在阶段 4 期间并行推进部分任务。
- **阶段 6: 完善**: 依赖目标用户故事完成后统一收尾。

### 用户故事依赖关系

- **US1 (P1)**: 无其他用户故事依赖, 是最小可交付版本。
- **US2 (P2)**: 依赖 US1 已提供合法移动与会话状态更新能力。
- **US3 (P3)**: 依赖 US1 已提供落位事件和棋盘渲染; 可与 US2 部分并行, 但最终要在完整 HUD/设置面板上验收。

### 每个用户故事内部顺序

- 先写单元/集成/性能测试, 让断言先失败。
- 再实现引擎或状态模块。
- 之后接入 UI 与主流程装配。
- 最后闭环 UX 一致性和性能验证。

### 并行机会

- 阶段 1 中 `T003`-`T007` 可并行。
- 阶段 2 中 `T009`-`T016` 大部分可并行, `T017` 需等待基础模块骨架就位。
- US1 中 `T018`-`T020`、`T023`-`T025` 可并行。
- US2 中 `T031`-`T035`、`T038`-`T039` 可并行。
- US3 中 `T042`-`T047` 可并行。

---

## 并行示例: 用户故事 1

```bash
# 并行编写核心规则测试
任务: "在 /tests/unit/engine/board-state.test.js 和 /tests/unit/engine/movement-rules.test.js 中编写棋盘占位和合法移动单元测试"
任务: "在 /tests/unit/engine/victory.test.js 和 /tests/unit/input/gesture-controller.test.js 中编写出口判定和手势阈值单元测试"
任务: "在 /tests/integration/gameplay.spec.js 中编写默认关卡加载和通关流程集成测试"

# 并行实现规则核心
任务: "在 /src/engine/board-state.js 中实现 4x5 网格占位计算"
任务: "在 /src/engine/movement-rules.js 中实现合法移动与碰撞检测"
任务: "在 /src/engine/victory.js 中实现目标棋子出口判定"
```

---

## 实施策略

### 仅 MVP(仅用户故事 1)

1. 完成阶段 1 和阶段 2, 建好静态应用骨架、质量门控和合同测试。
2. 完成 US1 的规则引擎、输入控制、棋盘渲染和通关流程。
3. 运行单元测试、集成测试和性能采样, 验证默认关卡可独立交付。

### 增量交付

1. 设置 + 基础 → 项目骨架完成。
2. US1 → 形成可游玩的华容道 MVP。
3. US2 → 提升关卡复玩性、目标感和低挫败体验。
4. US3 → 增强数字玩具氛围与多端细节。
5. 最终阶段 → 统一回归、文档和门控收尾。

### 建议 MVP 范围

- 只做 **US1** 也能交付一个完整可玩的极简华容道网页版本。

