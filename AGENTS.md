# Agent Project Memory

## Project

This repository is a personal technical blog and portfolio for an Agent-development learner. It is meant to make a clean first impression on GitHub: the root should stay small, reproducible, and free of local logs, packed dependencies, or one-off scripts.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript with `strict: true`
- Tailwind CSS
- MD/MDX blog content rendered through `next-mdx-remote` and `remark-gfm`
- Static export for GitHub Pages-style hosting

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Build: `npm run build`
- Production preview after build: `npm run start`
- Site checks: `npm run verify:site`

The project uses `.npmrc` with `legacy-peer-deps=true` because some current React 19 peer ranges lag behind the app dependency set. Do not work around this with CI-only command flags or manually committed `.tgz` packages.

## Content Organization

- Blog markdown lives under `content/blog/`.
- Series posts live under `content/blog/series/`.
- Blog parsing and metadata logic lives in `src/lib/blog.ts`.
- Page and component implementation lives under `src/`.

## Deployment

`next.config.js` sets `output: "export"` and `distDir: "out"`, with unoptimized images for static hosting. The exported site is produced by `npm run build`.

## Guardrails

- Do not modify `src/`, `content/`, `.github/workflows/`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, or `package.json` unless the user explicitly changes the scope.
- Do not change dependency declarations in `package.json` for cleanup tasks.
- Before deleting a tracked root file, confirm it is not referenced by source, scripts, or config.
- Keep logs, build output, local assistant state, package archives, and temporary files out of Git.
- TypeScript strict mode is enabled in `tsconfig.json`; keep build and type checking passing under strict mode.
