# 阶段 0 研究: 极简华容道纯网页版

## 决策 1: 使用单个 `index.html` + 浏览器原生 ES Modules 交付

- **Decision**: 运行时采用单页静态应用结构, 由一个 `index.html` 加载
  `src/main.js`, 其余逻辑拆分为浏览器原生 ES Modules。
- **Rationale**: 这与用户指定的“纯 HTML + 原生 JavaScript”完全一致,
  同时保留模块边界, 避免随着规则、关卡和反馈逻辑增长而退化成单文件脚本。
- **Alternatives considered**:
  - 引入 React/Vue/Svelte: 与“纯原生”目标冲突, 并增加构建和状态复杂度。
  - 使用 Vite/Parcel 作为运行时打包前提: 对 MVP 来说不是必需, 静态托管更直接。

## 决策 2: 视觉系统使用 CSS Variables + 绝对定位棋子 + `transform` 过渡

- **Decision**: 主题色、圆角、阴影和间距统一放在 `styles/tokens.css`
  中管理; 棋盘使用固定比例容器, 棋子通过绝对定位和 `transform` 过渡实现
  吸附与回弹动画。
- **Rationale**: CSS Variables 满足全局调色需求; `transform` 过渡比直接修改
  `left/top` 更容易保持平滑动画, 也仍然满足“纯 CSS3 过渡”的约束。
- **Alternatives considered**:
  - 直接修改 `left/top`: 实现简单, 但更容易引发布局抖动和性能回归。
  - Framer Motion 或物理引擎: 手感更强, 但超出用户指定的极简技术栈。
  - Canvas 渲染: 会让 DOM 可访问性、测试和样式调整复杂化。

## 决策 3: MVP 交互采用“按压后滑动并释放”而非持续实时拖拽

- **Decision**: 输入层以按压、主方向识别、阈值判定和释放吸附为核心,
  每次合法手势只触发一次稳定移动; 不实现持续实时跟手拖拽。
- **Rationale**: 该模型显著降低手势防抖、多点触控和碰撞同步难度, 更符合
  当前“班级小游戏 + 原生技术栈 + 低 Bug 风险”的目标。
- **Alternatives considered**:
  - 持续实时拖拽: 视觉更贴近原始愿景, 但输入复杂度和回归风险更高。
  - 点击按钮移动: 实现最简单, 但会明显削弱解压和物理直觉体验。
  - 第三方手势库: 会降低事件处理难度, 但违背零运行时依赖方向。

## 决策 4: 游戏状态只保存在内存, 关卡由静态模块维护

- **Decision**: `boardState`、`sessionStore` 和 `historyStack` 在运行时以内存
  形式存在; 关卡库作为静态模块或 JSON 资源随应用发布。
- **Rationale**: MVP 不涉及账号、同步或远程存储, 内存态最简单且足以满足
  关卡切换、撤销和重开需求。
- **Alternatives considered**:
  - `localStorage` 持久化: 可保存进度, 但不是首版核心价值, 也增加数据兼容性工作。
  - 远程存储或后端: 明显超出首版范围。

## 决策 5: 开发期引入轻量质量工具链, 运行时仍保持零依赖

- **Decision**: 本地开发使用 Node.js 22 LTS 和 npm, 引入 ESLint、Prettier、
  TypeScript `checkJs`, Vitest 与 Playwright 作为质量门控。
- **Rationale**: 章程要求格式化、静态检查、类型检查和自动化测试齐备;
  这些工具都只存在于开发期, 不会改变最终静态页面的纯原生实现。
- **Alternatives considered**:
  - 不做类型检查: 与章程冲突, 后续维护风险高。
  - 仅靠浏览器手测: 无法稳定覆盖规则引擎与响应式回归。
  - 使用 Jest/Cypress: 能满足部分需求, 但 Vitest/Playwright 更贴合当前
    ES Modules + 现代浏览器验证场景。

## 决策 6: 反馈能力按特性检测降级

- **Decision**: 音效基于浏览器音频能力, 震动反馈基于 `navigator.vibrate`
  的存在性与权限结果按需启用; 默认提供关闭开关。
- **Rationale**: 多感官反馈属于增强体验, 必须在不支持时静默降级, 不能阻断
  主流程。
- **Alternatives considered**:
  - 默认强制开启所有反馈: 容易在受限环境中引发权限或自动播放问题。
  - 完全删除反馈模块: 会削弱“数字玩具”的氛围目标。
