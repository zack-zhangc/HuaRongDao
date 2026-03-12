# 数据模型: 极简华容道纯网页版

## 实体: Level

**描述**: 一个可游玩的经典华容道开局。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | string | 关卡唯一标识 | 必填, 全局唯一 |
| `name` | string | 关卡展示名称 | 必填 |
| `difficulty` | string | 难度标签 | `easy` / `medium` / `hard` |
| `optimalMoves` | number | 参考最优步数 | 可选, 大于 0 |
| `boardWidth` | number | 棋盘列数 | 固定为 4 |
| `boardHeight` | number | 棋盘行数 | 固定为 5 |
| `exit` | object | 胜利出口定义 | 必填, 位于底部中央出口区域 |
| `pieces` | Piece[] | 初始棋子集合 | 必填, 不允许重叠 |

## 实体: Piece

**描述**: 棋盘上的单个棋子或目标块。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | string | 棋子唯一标识 | 必填, 关卡内唯一 |
| `role` | string | 角色类型 | `target`, `general`, `soldier` 等受控枚举 |
| `widthCells` | number | 占用列数 | 1 或 2 |
| `heightCells` | number | 占用行数 | 1 或 2 |
| `row` | number | 左上角所在行 | `0 <= row < 5` |
| `col` | number | 左上角所在列 | `0 <= col < 4` |
| `themeToken` | string | 视觉样式令牌 | 可选, 对应 CSS 变量或类名 |

**派生属性**

- `occupiedCells`: 由 `row`、`col`、`widthCells`、`heightCells` 推导出的格位集合。
- `isTarget`: 由 `role === "target"` 推导。

## 实体: GameSession

**描述**: 玩家当前一次对局的运行时状态。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `levelId` | string | 当前关卡 ID | 必填 |
| `status` | string | 对局状态 | `loading`, `empty`, `ready`, `active`, `won`, `error` |
| `pieces` | Piece[] | 当前棋盘快照 | 必填, 满足不重叠约束 |
| `moveCount` | number | 已完成合法移动数 | `>= 0` |
| `elapsedMs` | number | 已用时毫秒数 | `>= 0` |
| `startedAt` | number | 对局开始时间戳 | 首次进入后写入 |
| `lastUpdatedAt` | number | 最近一次状态更新时间戳 | 合法移动或流程操作后更新 |
| `activePieceId` | string/null | 当前按压中的棋子 | 可空 |
| `feedbackSettings` | FeedbackSettings | 当前反馈开关 | 必填 |

## 实体: MoveRecord

**描述**: 一次可撤销的合法移动。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `pieceId` | string | 被移动棋子 ID | 必填 |
| `direction` | string | 移动方向 | `up`, `down`, `left`, `right` |
| `from` | object | 起始坐标 | 必填 |
| `to` | object | 结束坐标 | 必填 |
| `timestamp` | number | 移动时间戳 | 必填 |
| `sessionMoveIndex` | number | 对局内顺序号 | 必填, 递增 |

## 实体: FeedbackSettings

**描述**: 玩家当前设备上的反馈偏好与可用能力。

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `soundEnabled` | boolean | 是否启用音效 | 必填 |
| `hapticsEnabled` | boolean | 是否启用震动 | 必填 |
| `soundSupported` | boolean | 浏览器是否支持音效播放 | 必填 |
| `hapticsSupported` | boolean | 浏览器是否支持震动 API | 必填 |

## 实体关系

- 一个 `Level` 包含多个 `Piece` 作为初始布局。
- 一个 `GameSession` 在任一时刻只关联一个 `Level`。
- 一个 `GameSession` 可关联零到多个 `MoveRecord`, 构成撤销历史栈。
- 一个 `GameSession` 内的 `Piece` 集合始终满足棋盘占位唯一性约束。

## 关键校验规则

- 任意两个棋子的 `occupiedCells` 不得重叠。
- 任意棋子的 `occupiedCells` 不得超出 4x5 棋盘边界。
- 非法手势不得生成 `MoveRecord` 或增加 `moveCount`。
- `status === "won"` 时, 目标棋子必须已满足出口判定。
- `undo` 仅能在历史栈非空时回退到前一合法快照。

## 状态转换

### GameSession

| 当前状态 | 触发 | 下一状态 |
|----------|------|----------|
| `loading` | 默认关卡加载成功 | `ready` |
| `loading` | 关卡库为空或默认关卡缺失 | `empty` |
| `loading` | 默认关卡加载失败 | `error` |
| `empty` | 玩家重新加载且关卡恢复可用 | `loading` |
| `ready` | 第一次合法移动 | `active` |
| `active` | 普通合法移动 | `active` |
| `active` | 目标棋子到达出口 | `won` |
| `won` | 重开当前关卡 | `ready` |
| `ready` / `active` / `won` | 切换关卡 | `loading` |
| `ready` / `active` | 加载错误 | `error` |

### FeedbackSettings

| 当前状态 | 触发 | 下一状态 |
|----------|------|----------|
| 任意 | 用户切换音效 | `soundEnabled` 取反 |
| 任意 | 用户切换震动 | `hapticsEnabled` 取反 |
| 任意 | 能力检测完成 | `soundSupported` / `hapticsSupported` 更新 |
