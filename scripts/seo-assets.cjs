const { execFileSync } = require("node:child_process")
const { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } = require("node:fs")
const path = require("node:path")
const zlib = require("node:zlib")

const SITE_URL = "https://muyuzhong.xyz"
const SITE_TITLE = "暮羽中 | Agent 开发学习者"
const SITE_DESCRIPTION = "暮羽中的个人网站，记录 Agent 开发学习、技术笔记和实习准备。"
const STATIC_PATHS = ["/", "/blog/", "/series/"]

function posixPath(value) {
  return value.split(path.sep).join("/")
}

function absoluteUrl(route) {
  return new URL(route, SITE_URL).toString()
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function parseScalar(value) {
  const trimmed = value.trim()
  const quoted = trimmed.match(/^["'](.*)["']$/)
  return quoted ? quoted[1] : trimmed
}

function parseTags(value) {
  const trimmed = value.trim()
  if (!trimmed) return []
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return [parseScalar(trimmed)].filter(Boolean)

  return trimmed
    .slice(1, -1)
    .split(",")
    .map((tag) => parseScalar(tag))
    .filter(Boolean)
}

function parseInteger(value) {
  const normalized = value.trim()
  if (!/^-?\d+$/.test(normalized)) return undefined
  const parsed = Number.parseInt(normalized, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/)
  const data = {}
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

function stripFrontmatter(source) {
  return source.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, "")
}

function excerptFromContent(content) {
  const paragraph = content
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith("#") && !part.startsWith("---"))

  return paragraph ? paragraph.replace(/[#*_>`]/g, "").slice(0, 120) : ""
}

function findPostFiles(directory) {
  if (!existsSync(directory)) return []

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return findPostFiles(entryPath)
    return /\.(md|mdx)$/i.test(entry.name) ? [entryPath] : []
  })
}

function gitDates(rootDir, filePath) {
  const relativePath = posixPath(path.relative(rootDir, filePath))

  try {
    const output = execFileSync("git", ["log", "--follow", "--format=%aI", "--", relativePath], {
      cwd: rootDir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)

    if (output.length > 0) {
      return {
        modified: output[0],
        published: output[output.length - 1],
      }
    }
  } catch {
    // Fall back to file timestamps when Git metadata is unavailable.
  }

  const stats = statSync(filePath)
  return {
    modified: stats.mtime.toISOString(),
    published: stats.birthtime.toISOString(),
  }
}

function getBlogPosts(rootDir) {
  const blogDir = path.join(rootDir, "content", "blog")
  const postFiles = findPostFiles(blogDir)

  return postFiles
    .map((filePath) => {
      const source = readFileSync(filePath, "utf8")
      const content = stripFrontmatter(source)
      const frontmatter = parseFrontmatter(source)
      const slug = path.basename(filePath, path.extname(filePath))
      const dates = gitDates(rootDir, filePath)

      return {
        slug,
        title: frontmatter.title || slug.replace(/[-_]/g, " "),
        excerpt: frontmatter.excerpt || excerptFromContent(content),
        tags: frontmatter.tags || [],
        order: frontmatter.order,
        series: frontmatter.series,
        seriesOrder: frontmatter.seriesOrder,
        url: absoluteUrl(`/blog/${slug}/`),
        published: dates.published,
        modified: dates.modified,
      }
    })
    .sort((a, b) => {
      if (a.order !== undefined || b.order !== undefined) {
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)
      }
      return b.slug.localeCompare(a.slug)
    })
}

function renderSitemap(posts) {
  const urls = [
    ...STATIC_PATHS.map((route) => ({
      loc: absoluteUrl(route),
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: route === "/" ? "1.0" : "0.8",
    })),
    ...posts.map((post) => ({
      loc: post.url,
      lastmod: post.modified,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <lastmod>${xmlEscape(url.lastmod)}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`
}

function renderRobots() {
  return `User-Agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`
}

function renderFeed(posts) {
  const latestDate = posts
    .map((post) => new Date(post.modified).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0]

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_TITLE)}</title>
    <link>${xmlEscape(SITE_URL)}</link>
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date(latestDate || Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${xmlEscape(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
${posts
  .map(
    (post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(post.url)}</link>
      <guid isPermaLink="true">${xmlEscape(post.url)}</guid>
      <description>${xmlEscape(post.excerpt)}</description>
      <pubDate>${new Date(post.published).toUTCString()}</pubDate>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`
}

function crc32(buffer) {
  let crc = -1
  for (const byte of buffer) {
    crc ^= byte
    for (let i = 0; i < 8; i += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return (crc ^ -1) >>> 0
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)

  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])))

  return Buffer.concat([length, typeBuffer, data, crc])
}

function createOgImage() {
  const width = 1200
  const height = 630
  const raw = Buffer.alloc((width * 3 + 1) * height)

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 3 + 1)
    raw[rowStart] = 0

    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 3
      const accent = x > width * 0.08 && x < width * 0.14
      const rule = y > height * 0.72 && y < height * 0.735
      const glow = x + y > 1020 && x + y < 1110

      raw[offset] = accent || rule ? 226 : glow ? 72 : 18
      raw[offset + 1] = accent || rule ? 102 : glow ? 100 : 22
      raw[offset + 2] = accent || rule ? 46 : glow ? 96 : 27
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ])
}

function writeIfChanged(filePath, content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8")
  if (existsSync(filePath)) {
    const current = readFileSync(filePath)
    if (Buffer.compare(current, buffer) === 0) return
  }

  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, buffer)
}

function buildSeoArtifacts(rootDir = process.cwd()) {
  const posts = getBlogPosts(rootDir)

  return {
    posts,
    sitemap: renderSitemap(posts),
    robots: renderRobots(),
    feed: renderFeed(posts),
    ogImage: createOgImage(),
  }
}

function writePublicAssets(rootDir, artifacts) {
  const publicDir = path.join(rootDir, "public")
  writeIfChanged(path.join(publicDir, "feed.xml"), artifacts.feed)
  writeIfChanged(path.join(publicDir, "og-image.png"), artifacts.ogImage)
}

function writeExportAssets(rootDir, artifacts) {
  const outDir = path.join(rootDir, "out")
  if (!existsSync(outDir)) return

  writeIfChanged(path.join(outDir, "sitemap.xml"), artifacts.sitemap)
  writeIfChanged(path.join(outDir, "robots.txt"), artifacts.robots)
  writeIfChanged(path.join(outDir, "feed.xml"), artifacts.feed)
  writeIfChanged(path.join(outDir, "og-image.png"), artifacts.ogImage)
}

function registerSeoBuildArtifacts(rootDir = process.cwd()) {
  const artifacts = buildSeoArtifacts(rootDir)
  writePublicAssets(rootDir, artifacts)

  let written = false
  const writeOnce = () => {
    if (written) return
    written = true
    writeExportAssets(rootDir, artifacts)
  }

  process.once("beforeExit", writeOnce)
  process.once("exit", writeOnce)
}

module.exports = {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  buildSeoArtifacts,
  getBlogPosts,
  registerSeoBuildArtifacts,
}
