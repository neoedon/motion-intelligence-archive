# Motion Intelligence Archive

持续累计的产品动态视频研究档案，包含逐帧扫描、关键画面、镜头与叙事节拍、视觉语言和声音设计分析。

在线站点：<https://neoedon.github.io/motion-intelligence-archive/>

## 数据范围

站点发布累计 JSON 与压缩 WebP 图片，不发布原始视频、逐帧 CSV 或其他大型研究中间文件。每日数据保存在 `app/site-data.json`、`public/data/` 与 `public/media/`。

## 本地开发

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

## 构建与验证

```bash
# 原有 Sites / Worker 构建
npm test

# GitHub Pages 纯静态构建
npm run test:pages
```

GitHub Pages 输出目录为 `dist-pages/`。

## 自动发布

- `.github/workflows/pages.yml` 在 `main` 更新后构建并部署 GitHub Pages。
- `.githooks/post-commit` 在本机每日任务提交 `main` 后自动推送 GitHub。
- `scripts/publish-latest.ps1` 可在每日分析完成后手动执行同步、验证、提交与推送：

```powershell
.\scripts\publish-latest.ps1 -Date 2026-08-07
```

本地自动任务需要电脑保持开机、ChatGPT 桌面应用保持运行，并使用当前项目目录。
