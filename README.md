# 极简华容道纯网页版

纯 HTML、CSS 与原生 JavaScript 实现的华容道小游戏。目标是在浏览器中提供
轻量、平滑且多端自适应的解谜体验。

## 开发

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:4173` 即可开始试玩。

## 手机试玩

可以直接用手机浏览器打开页面试玩，不需要安装 App。

- 本地调试: 打开 `http://127.0.0.1:4173`
- 手机操作: 按住棋子，朝目标方向滑一下，再松手
- 常用按钮: `切换关卡`、`撤销`、`重开`、`音效`、`震动`

完整说明见 [docs/mobile-play.md](./docs/mobile-play.md)。

## 部署到 GitHub Pages

这个项目是纯静态网页，适合直接部署到 GitHub Pages。

1. 把仓库推送到 GitHub
2. 保留仓库中的 [deploy-pages.yml](./.github/workflows/deploy-pages.yml)
3. 在 GitHub 仓库进入 `Settings -> Pages`
4. 将发布来源设置为 `GitHub Actions`
5. 当代码推送到 `main` 或 `master` 后，Actions 会自动执行:

```bash
npm ci --ignore-scripts
npm run build
```

并把 `dist/` 发布到 GitHub Pages。

部署成功后，页面地址通常是:

```text
https://<你的 GitHub 用户名>.github.io/<仓库名>/
```

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
