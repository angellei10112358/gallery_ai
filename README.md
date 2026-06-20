# AI Gallery

A static portfolio gallery for AI-generated images, built with Vite + React + TypeScript + Tailwind CSS and hosted on GitHub Pages.

## Features

- Masonry layout with responsive columns
- Lightbox: keyboard navigation, swipe gestures, scroll-to-zoom
- Search (by filename/title/tags), tag filter, sorting
- Dark/Light theme toggle
- Lazy loading with blur placeholder (LQIP)
- WebP/AVIF multi-resolution generation at build time
- Responsive design, mobile-first
- SEO: Open Graph, sitemap, schema.org structured data

## How to Add New Images

1. Put your PNG/JPG images into `src/images/`
2. (Optional) Create a sidecar `cat.json` alongside `cat.png` to add title/tags:
   ```json
   { "title": "My Image", "tags": ["tag1", "tag2"] }
   ```
3. Commit and push to `main`:
   ```
   git add src/images/
   git commit -m "add new image"
   git push
   ```
4. GitHub Actions automatically builds and deploys. The site updates in minutes.

> No manual editing of config files or JSON manifests is required.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173/gallery_ai/`

## Build

```bash
npm run build
npm run preview
```

## One-Time GitHub Pages Setup

1. In your GitHub repo Settings → Pages:
   - Source: select **GitHub Actions**
2. Push to `main` — the Action builds and deploys automatically
3. Site URL: `https://angellei10112358.github.io/gallery_ai/`

> The repo name is `gallery_ai`, so the site is served under `/gallery_ai/`. `vite.config.ts` has `base: '/gallery_ai/'` already set.

## Configuration `gallery.config.json`

| Field | Description |
|---|---|
| `siteTitle` | Site title |
| `author` | Author name |
| `bio` | Short bio / description |
| `githubUrl` | GitHub repo URL |
| `defaultTheme` | Default theme `dark` / `light` |
| `layout` | Layout mode (currently only `masonry`) |
| `watermark.enabled` | Toggle watermark overlay on full-size images (default off) |
| `watermark.text` | Watermark text |
| `disableRightClick` | Disable right-click context menu (default off) |
| `sortDefault` | Default sort order |

## Tech Stack Rationale

**Vite + React + TypeScript + Tailwind CSS**:
- Vite: fast dev server and lightweight production builds
- React: mature component model for interactive UI
- TypeScript: type safety across the codebase
- Tailwind CSS: responsive design and dark theme out of the box
- Output is pure static HTML/CSS/JS — no runtime server needed

## Notes

- AI-generated images tend to be large; consider compressing originals before committing to git. Git LFS is an option for very large collections.
- During build, thumbnails and WebP/AVIF copies are auto-generated. Originals stay in `src/images/` and are never served directly.
- `.gitignore` excludes `public/images/` and `public/manifest.json` (build artifacts) to avoid committing generated files.
