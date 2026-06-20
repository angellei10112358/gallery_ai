# AI Gallery — AI 生成图片作品集

基于 Vite + React + TypeScript + Tailwind CSS 的纯静态作品集画廊，托管于 GitHub Pages。

## 功能

- 瀑布流（Masonry）布局，自适应列数
- 灯箱大图查看：键盘导航、手势滑动、滚轮缩放
- 搜索（按文件名/标题/标签）、标签筛选、排序
- 暗色/亮色主题切换
- 懒加载 + 模糊占位图（LQIP）
- 构建时自动生成 WebP/AVIF 多尺寸图片
- 响应式设计，移动端优先
- SEO：Open Graph、sitemap、schema.org 结构化数据

## 如何添加新图片

1. 将 PNG/JPG 图片放入 `src/images/`
2. （可选）为 `cat.png` 创建同名 `cat.json`，补充标题/标签：
   ```json
   { "title": "标题", "tags": ["标签1", "标签2"] }
   ```
3. 提交并推送至 `main` 分支：
   ```
   git add src/images/
   git commit -m "add new image"
   git push
   ```
4. GitHub Actions 自动构建并部署，数分钟后网站自动更新。

> 无需手动编辑任何配置文件或 JSON 清单。

## 本地预览

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173/gallery_ai/`

## 构建

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages（一次性设置）

1. 在 GitHub 仓库 Settings → Pages 中：
   - Source 选 **GitHub Actions**
2. 推送 `main` 分支后，Actions 自动构建并部署
3. 网站地址：`https://angellei10112358.github.io/gallery_ai/`

> 注意：该项目仓库名为 `gallery_ai`，部署在子路径 `/gallery_ai/` 下。`vite.config.ts` 中已配置 `base: '/gallery_ai/'`。

## 配置项 `gallery.config.json`

| 字段 | 说明 |
|---|---|
| `siteTitle` | 站点标题 |
| `author` | 作者名 |
| `bio` | 简介 |
| `githubUrl` | GitHub 仓库链接 |
| `defaultTheme` | 默认主题 `dark` / `light` |
| `layout` | 布局模式，当前仅支持 `masonry` |
| `watermark.enabled` | 是否显示水印（默认关闭） |
| `watermark.text` | 水印文字 |
| `disableRightClick` | 是否禁用右键菜单（默认关闭） |
| `sortDefault` | 默认排序方式 |

## 技术选型说明

**Vite + React + TypeScript + Tailwind CSS** 的优势：
- Vite 开发服务器极快，构建产物轻量
- React 提供成熟的交互组件生态
- TypeScript 保证类型安全
- Tailwind CSS 实现响应式布局和暗色主题
- 最终产物为纯静态 HTML/CSS/JS，无需运行时服务器

## 注意事项

- 仓库体积：AI 生成图通常较大，原图提交到 git 前建议压缩。可考虑 Git LFS。
- 构建时自动生成缩略图和 WebP/AVIF，原始图片保留在 `src/images/`，不在网页中直接引用。
- `.gitignore` 中排除了 `public/images/` 和 `public/manifest.json`（构建产物），避免提交。
