# self-blog

Personal technical blog and portfolio for documenting AI engineering, Agent workflows, and frontend engineering practice.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS
- Markdown/MDX content with `next-mdx-remote`
- Static export for GitHub Pages-style deployment

## Development

```bash
npm install
npm run dev
npm run build
```

The repository includes a project-level `.npmrc` so peer dependency resolution is reproducible with the current React 19 dependency set.

## Content

Blog content is organized under `content/blog/`. Series content lives under `content/blog/series/`. The app reads this content during static generation and exports the site to `out/`.

## Site

Production site: <https://muyuzhong.xyz>
