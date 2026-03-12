# 极简华容道纯网页版

纯 HTML、CSS 与原生 JavaScript 实现的华容道小游戏。目标是在浏览器中提供
轻量、平滑且多端自适应的解谜体验。

## 开发

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:4173` 即可开始试玩。

## 质量门控

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
```

## 测试夹具

- `/?fixture=empty`: 强制显示空状态
- `/?fixture=error`: 强制显示错误状态
