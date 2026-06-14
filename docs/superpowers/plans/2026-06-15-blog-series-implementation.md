# Blog Series Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sustainable `/series` blog collection section and make `runtime-engine-the-clockmaker.md` the first article in “Harness 工程札记”.

**Architecture:** Extend the existing Markdown frontmatter parser with optional series metadata, derive series membership from the same `content/blog` source used by the blog archive, and render one dedicated static series index page. Existing article pages conditionally expose series context without changing ordinary posts.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Markdown frontmatter, PowerShell site verification

---

### Task 1: Add Failing Series Acceptance Checks

**Files:**
- Modify: `verify-site.ps1`

- [ ] Add checks for the `/series` source page, exported page, navigation link, sitemap entry, article frontmatter, and article-page series UI.
- [ ] Run `npm run verify:site`.
- [ ] Confirm it fails because the series feature is not implemented.

### Task 2: Extend Blog Data Model

**Files:**
- Modify: `src/lib/blog.ts`
- Modify: `content/blog/runtime-engine-the-clockmaker.md`

- [ ] Add optional `series` and `seriesOrder` fields to blog post data.
- [ ] Parse the fields from frontmatter.
- [ ] Add `getSeriesPosts(seriesName)` and sort matching posts by `seriesOrder`.
- [ ] Mark the runtime engine article as “Harness 工程札记” article 01.

### Task 3: Build the Series Page and Navigation

**Files:**
- Create: `src/app/series/page.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] Add the editorial `/series` page using the existing visual system.
- [ ] Add the desktop and mobile navigation entry.
- [ ] Add `/series` to the static sitemap.

### Task 4: Add Article Series Context

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] Show a linked series name and zero-padded article number for series posts.
- [ ] Add a series return link in the article footer.
- [ ] Keep ordinary article pages unchanged.

### Task 5: Verify and Close

**Files:**
- Modify if needed: `verify-site.ps1`

- [ ] Run `npm run verify:site` and confirm all source acceptance checks pass.
- [ ] Run `npm run build` and confirm static export succeeds.
- [ ] Run `npm run verify:site` again and confirm `/series/index.html` exists.
- [ ] Inspect `git diff` and confirm only intended files changed.
