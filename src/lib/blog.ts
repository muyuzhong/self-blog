import { promises as fs } from "fs"
import path from "path"

export interface HeadingItem {
  id: string
  text: string
  depth: 2 | 3
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  content: string
  readingMinutes: number
  series?: string
  seriesOrder?: number
}

export type BlogPostSummary = Omit<BlogPost, "content">

const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const POST_EXTENSIONS = [".md", ".mdx"]

function isPostFile(filePath: string) {
  return POST_EXTENSIONS.includes(path.extname(filePath).toLowerCase())
}

export function stripFrontmatter(source: string) {
  return source.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, "")
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

function parseScalar(value: string) {
  const trimmed = value.trim()
  const quoted = trimmed.match(/^["'](.*)["']$/)
  return quoted ? quoted[1] : trimmed
}

function parseTags(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return []
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((tag) => parseScalar(tag))
      .filter(Boolean)
  }
  return [parseScalar(trimmed)].filter(Boolean)
}

function parseInteger(value: string) {
  const normalized = value.trim()
  if (!/^-?\d+$/.test(normalized)) return undefined

  const parsed = Number.parseInt(normalized, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/)
  const data: {
    title?: string
    excerpt?: string
    tags?: string[]
    order?: number
    series?: string
    seriesOrder?: number
  } = {}

  if (!match) return data

  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!field) continue

    const [, key, rawValue] = field
    if (key === "title") data.title = parseScalar(rawValue)
    if (key === "excerpt") data.excerpt = parseScalar(rawValue)
    if (key === "tags") data.tags = parseTags(rawValue)
    if (key === "order") data.order = parseInteger(rawValue)
    if (key === "series") data.series = parseScalar(rawValue)
    if (key === "seriesOrder") data.seriesOrder = parseInteger(rawValue)
  }

  return data
}

function excerptFromContent(content: string) {
  const paragraph = content
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith("#") && !part.startsWith("---"))

  return paragraph?.replace(/[#*_>`]/g, "").slice(0, 120) ?? ""
}

async function findPostFile(slug: string) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug)) return null

  const postFiles = await getPostFiles()
  return postFiles.find((filePath) => path.basename(filePath, path.extname(filePath)) === slug) ?? null
}

async function getPostFiles(directory = BLOG_DIR): Promise<string[]> {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const files = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name)
        if (entry.isDirectory()) return getPostFiles(entryPath)
        return isPostFile(entryPath) ? [entryPath] : []
      }),
    )

    return files.flat()
  } catch {
    return []
  }
}

async function readPostFromFile(filePath: string): Promise<BlogPost & { order?: number }> {
  const source = await fs.readFile(filePath, "utf-8")
  const content = stripFrontmatter(source)
  const frontmatter = parseFrontmatter(source)
  const slug = path.basename(filePath, path.extname(filePath))

  return {
    slug,
    title: frontmatter.title ?? slug.replace(/[-_]/g, " "),
    excerpt: frontmatter.excerpt ?? excerptFromContent(content),
    tags: frontmatter.tags ?? [],
    content,
    readingMinutes: getReadingMinutes(source),
    order: frontmatter.order,
    series: frontmatter.series,
    seriesOrder: frontmatter.seriesOrder,
  }
}

export async function getAllBlogPosts(): Promise<BlogPostSummary[]> {
  const postFiles = await getPostFiles()

  const posts = await Promise.all(postFiles.map(readPostFromFile))

  return posts
    .sort((a, b) => {
      if (a.order !== undefined || b.order !== undefined) {
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
      }
      return b.slug.localeCompare(a.slug)
    })
    .map(({ order, ...post }) => post)
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = await findPostFile(slug)
  if (!filePath) return null

  const { order, ...post } = await readPostFromFile(filePath)
  return post
}

export async function getSeriesPosts(seriesName: string): Promise<BlogPostSummary[]> {
  const posts = await getAllBlogPosts()

  return posts
    .filter((post) => post.series === seriesName)
    .sort((a, b) => {
      if (a.seriesOrder !== undefined || b.seriesOrder !== undefined) {
        return (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.seriesOrder ?? Number.MAX_SAFE_INTEGER)
      }
      return a.slug.localeCompare(b.slug)
    })
}

export async function getStandaloneBlogPosts(): Promise<BlogPostSummary[]> {
  const posts = await getAllBlogPosts()
  return posts.filter((post) => !post.series)
}
