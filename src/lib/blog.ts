export interface HeadingItem {
  id: string
  text: string
  depth: 2 | 3
}

export function stripFrontmatter(source: string) {
  return source.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
}

export function getReadingMinutes(source: string) {
  const content = stripFrontmatter(source)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
  const words = content.match(/[\u4e00-\u9fa5]|[A-Za-z0-9_]+/g)?.length ?? 0
  return Math.max(1, Math.ceil(words / 420))
}

export function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

export function getMarkdownHeadings(source: string): HeadingItem[] {
  const content = stripFrontmatter(source)
  const seen = new Map<string, number>()
  const headings: HeadingItem[] = []

  for (const match of content.matchAll(/^(##|###)\s+(.+)$/gm)) {
    const depth = match[1].length as 2 | 3
    const text = match[2].replace(/\*\*/g, "").trim()
    const baseId = slugifyHeading(text)
    const count = seen.get(baseId) ?? 0
    seen.set(baseId, count + 1)
    headings.push({
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
      text,
      depth,
    })
  }

  return headings
}
