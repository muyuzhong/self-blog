import { existsSync } from "node:fs"
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"

const rootDir = process.cwd()
const outDir = path.join(rootDir, "out")
const blogDir = path.join(rootDir, "content", "blog")
const siteUrl = "https://muyuzhong.xyz"

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function getPostFiles(directory = blogDir) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return getPostFiles(entryPath)
      return /\.(md|mdx)$/i.test(entry.name) ? [entryPath] : []
    }),
  )

  return nested.flat()
}

function parseScalar(value) {
  const trimmed = value.trim()
  const quoted = trimmed.match(/^["'](.*)["']$/)
  return quoted ? quoted[1] : trimmed
}

function parseTags(value) {
  const trimmed = value.trim()
  if (!trimmed) return []
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return [parseScalar(trimmed)]

  return trimmed
    .slice(1, -1)
    .split(",")
    .map((tag) => parseScalar(tag))
    .filter(Boolean)
}

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/)
  const data = { title: "", excerpt: "", tags: [] }
  if (!match) return data

  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!field) continue

    const [, key, rawValue] = field
    if (key === "title") data.title = parseScalar(rawValue)
    if (key === "excerpt") data.excerpt = parseScalar(rawValue)
    if (key === "tags") data.tags = parseTags(rawValue)
  }

  return data
}

async function getPosts() {
  const files = await getPostFiles()
  const posts = await Promise.all(
    files.map(async (filePath) => {
      const source = await readFile(filePath, "utf8")
      const frontmatter = parseFrontmatter(source)
      const slug = path.basename(filePath, path.extname(filePath))
      return {
        filePath,
        slug,
        title: frontmatter.title || slug,
        excerpt: frontmatter.excerpt || "",
      }
    }),
  )

  return posts.sort((a, b) => a.slug.localeCompare(b.slug))
}

function requireMeta(html, nameOrProperty, value) {
  const attrPattern = `${nameOrProperty === "property" ? "property" : "name"}=["']${escapeRegExp(value)}["']`
  const contentPattern = `content=["'][^"']+["']`
  const metaPattern = new RegExp(`<meta\\s+[^>]*${attrPattern}[^>]*${contentPattern}[^>]*>`, "i")
  assert(metaPattern.test(html), `Missing meta ${nameOrProperty}=${value}`)
}

function readJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  return scripts.map((match) => JSON.parse(match[1]))
}

function flattenJsonLd(entries) {
  const flattened = []
  for (const entry of entries) {
    if (Array.isArray(entry)) {
      flattened.push(...flattenJsonLd(entry))
      continue
    }
    if (entry && Array.isArray(entry["@graph"])) {
      flattened.push(entry, ...flattenJsonLd(entry["@graph"]))
      continue
    }
    if (entry) flattened.push(entry)
  }
  return flattened
}

async function verifySitemap(posts) {
  const sitemapPath = path.join(outDir, "sitemap.xml")
  assert(existsSync(sitemapPath), "Missing out/sitemap.xml")

  const sitemap = await readFile(sitemapPath, "utf8")
  const expectedUrls = [
    `${siteUrl}/`,
    `${siteUrl}/blog/`,
    `${siteUrl}/series/`,
    ...posts.map((post) => `${siteUrl}/blog/${post.slug}/`),
  ]

  for (const url of expectedUrls) {
    assert(sitemap.includes(`<loc>${url}</loc>`) || sitemap.includes(`<loc>${url.replace(/\/$/, "")}</loc>`), `Sitemap missing ${url}`)
  }
}

async function verifyRobots() {
  const robotsPath = path.join(outDir, "robots.txt")
  assert(existsSync(robotsPath), "Missing out/robots.txt")

  const robots = await readFile(robotsPath, "utf8")
  assert(/User-Agent:\s*\*/i.test(robots), "robots.txt missing User-Agent: *")
  assert(new RegExp(`Sitemap:\\s*${escapeRegExp(`${siteUrl}/sitemap.xml`)}`, "i").test(robots), "robots.txt missing sitemap URL")
}

async function verifyFeed(posts) {
  const feedPath = path.join(outDir, "feed.xml")
  assert(existsSync(feedPath), "Missing out/feed.xml")

  const feed = await readFile(feedPath, "utf8")
  const itemCount = (feed.match(/<item>/g) ?? []).length
  assert(itemCount === posts.length, `Expected ${posts.length} RSS items, found ${itemCount}`)

  for (const post of posts) {
    assert(feed.includes(`<title>${post.title}</title>`) || feed.includes(`<![CDATA[${post.title}]]>`), `RSS missing title for ${post.slug}`)
    assert(feed.includes(`${siteUrl}/blog/${post.slug}/`), `RSS missing link for ${post.slug}`)
    assert(feed.includes(post.excerpt) || feed.includes(`<![CDATA[${post.excerpt}]]>`), `RSS missing description for ${post.slug}`)
  }

  assert(/<pubDate>[^<]+<\/pubDate>/.test(feed), "RSS missing pubDate values")
}

async function verifyHomeMetadata() {
  const indexPath = path.join(outDir, "index.html")
  const html = await readFile(indexPath, "utf8")

  requireMeta(html, "property", "og:title")
  requireMeta(html, "property", "og:description")
  requireMeta(html, "property", "og:image")
  requireMeta(html, "name", "twitter:card")
  requireMeta(html, "name", "twitter:title")
  requireMeta(html, "name", "twitter:description")
  requireMeta(html, "name", "twitter:image")

  const jsonLd = flattenJsonLd(readJsonLd(html))
  assert(jsonLd.some((entry) => entry["@type"] === "Person"), "Home page missing Person JSON-LD")
}

async function verifyArticleJsonLd(posts) {
  for (const post of posts) {
    const articlePath = path.join(outDir, "blog", post.slug, "index.html")
    assert(existsSync(articlePath), `Missing article HTML for ${post.slug}`)

    const html = await readFile(articlePath, "utf8")
    const jsonLd = flattenJsonLd(readJsonLd(html))
    assert(
      jsonLd.some((entry) => ["Article", "BlogPosting"].includes(entry["@type"]) && entry.headline === post.title),
      `Article page ${post.slug} missing matching Article JSON-LD`,
    )
  }
}

async function main() {
  assert(existsSync(outDir), "Missing out directory. Run npm run build first.")

  const posts = await getPosts()
  for (const post of posts) {
    await stat(post.filePath)
  }

  await verifySitemap(posts)
  await verifyRobots()
  await verifyFeed(posts)
  await verifyHomeMetadata()
  await verifyArticleJsonLd(posts)

  console.log(`SEO verification passed for ${posts.length} posts.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
