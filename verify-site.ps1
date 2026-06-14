$ErrorActionPreference = "Stop"

$failures = New-Object System.Collections.Generic.List[string]

$dataPath = Join-Path $PSScriptRoot "src\lib\data.ts"
$blogComponentPath = Join-Path $PSScriptRoot "src\components\sections\Blog.tsx"
$blogIndexPath = Join-Path $PSScriptRoot "src\app\blog\page.tsx"
$seriesIndexPath = Join-Path $PSScriptRoot "src\app\series\page.tsx"
$seriesExportPath = Join-Path $PSScriptRoot "out\series\index.html"
$navbarPath = Join-Path $PSScriptRoot "src\components\layout\Navbar.tsx"
$sitemapPath = Join-Path $PSScriptRoot "src\app\sitemap.ts"
$blogPostPagePath = Join-Path $PSScriptRoot "src\app\blog\[slug]\page.tsx"
$runtimeArticlePath = Join-Path $PSScriptRoot "content\blog\runtime-engine-the-clockmaker.md"
$contactPath = Join-Path $PSScriptRoot "src\components\sections\Contact.tsx"
$blogContentPath = Join-Path $PSScriptRoot "content\blog"

$data = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8
$slugs = [regex]::Matches($data, 'slug:\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }

foreach ($slug in $slugs) {
  $postPath = Join-Path $PSScriptRoot "src\content\posts\$slug.mdx"
  if (-not (Test-Path -LiteralPath $postPath)) {
    $failures.Add("Missing MDX file for blog slug: $slug")
  }
}

$blogComponent = Get-Content -LiteralPath $blogComponentPath -Raw -Encoding UTF8
if ($blogComponent -match 'href="/blog"' -and -not (Test-Path -LiteralPath $blogIndexPath)) {
  $failures.Add("Blog section links to /blog but src/app/blog/page.tsx is missing")
}

if (-not (Test-Path -LiteralPath $seriesIndexPath)) {
  $failures.Add("Series index page is missing: src/app/series/page.tsx")
}

if (Test-Path -LiteralPath (Join-Path $PSScriptRoot "out")) {
  if (-not (Test-Path -LiteralPath $seriesExportPath)) {
    $failures.Add("Static series export is missing: out/series/index.html")
  }
}

$navbarSource = Get-Content -LiteralPath $navbarPath -Raw -Encoding UTF8
if ($navbarSource -match 'href:\s*"/series"') {
  $failures.Add("Navbar should not expose a top-level /series entry")
}

if ($blogComponent -notmatch 'seriesPosts') {
  $failures.Add("Homepage blog module should render series posts separately")
}
if ($blogComponent -notmatch 'href="/series"') {
  $failures.Add("Homepage blog module should link its series area to /series")
}
if ($blogComponent -notmatch 'Harness') {
  $failures.Add("Homepage blog module should expose the Harness series")
}

$homePageSource = Get-Content -LiteralPath (Join-Path $PSScriptRoot "src\app\page.tsx") -Raw -Encoding UTF8
if ($homePageSource -notmatch 'getStandaloneBlogPosts') {
  $failures.Add("Homepage should query standalone blog posts")
}
if ($homePageSource -notmatch 'getSeriesPosts') {
  $failures.Add("Homepage should query series posts separately")
}

$blogIndexSource = Get-Content -LiteralPath $blogIndexPath -Raw -Encoding UTF8
if ($blogIndexSource -notmatch 'getStandaloneBlogPosts') {
  $failures.Add("Blog archive should exclude series posts")
}

$blogDataSource = Get-Content -LiteralPath (Join-Path $PSScriptRoot "src\lib\blog.ts") -Raw -Encoding UTF8
if ($blogDataSource -notmatch 'export async function getStandaloneBlogPosts') {
  $failures.Add("Blog data layer should expose a standalone-post query")
}
if ($blogDataSource -notmatch 'filter\(\(post\) => !post\.series\)') {
  $failures.Add("Standalone-post query should exclude every series post")
}

$sitemapSource = Get-Content -LiteralPath $sitemapPath -Raw -Encoding UTF8
if ($sitemapSource -notmatch 'https://muyuzhong\.xyz/series') {
  $failures.Add("Sitemap should include /series")
}

$blogPostPageSource = Get-Content -LiteralPath $blogPostPagePath -Raw -Encoding UTF8
if ($blogPostPageSource -notmatch 'post\.series') {
  $failures.Add("Blog post page should render series context when present")
}

$runtimeArticleSource = Get-Content -LiteralPath $runtimeArticlePath -Raw -Encoding UTF8
if ($runtimeArticleSource -notmatch '(?m)^series:\s*"Harness .+"\s*$') {
  $failures.Add("Runtime engine article should belong to Harness 工程札记")
}
if ($runtimeArticleSource -notmatch '(?m)^seriesOrder:\s*1\s*$') {
  $failures.Add("Runtime engine article should be series article 01")
}

$sourceFiles = Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot "src") -Recurse -Include *.ts,*.tsx,*.mdx -File
foreach ($file in $sourceFiles) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  if ($text -match 'example\.com') {
    $relative = Resolve-Path -LiteralPath $file.FullName -Relative
    $failures.Add("Placeholder example.com contact found in $relative")
  }
  if ($text -cmatch '\bblogPosts\b') {
    $relative = Resolve-Path -LiteralPath $file.FullName -Relative
    $failures.Add("Old manual blogPosts source found in $relative")
  }
}

$contactSource = Get-Content -LiteralPath $contactPath -Raw -Encoding UTF8
if ($contactSource -match 'setTimeout') {
  $failures.Add("Contact form still uses setTimeout fake submission")
}

if (-not (Test-Path -LiteralPath $blogContentPath)) {
  $failures.Add("Markdown blog directory is missing: content\blog")
} else {
  $markdownPosts = Get-ChildItem -LiteralPath $blogContentPath -File -Include *.md,*.mdx
  if ($markdownPosts.Count -eq 0) {
    $failures.Add("Markdown blog directory has no .md or .mdx posts")
  }

  foreach ($post in $markdownPosts) {
    $source = Get-Content -LiteralPath $post.FullName -Raw -Encoding UTF8
    if ($source -notmatch '(?s)^---\s.*?\btitle:\s*.+?\s---') {
      $relative = Resolve-Path -LiteralPath $post.FullName -Relative
      $failures.Add("Markdown post must include frontmatter title in $relative")
    }
  }
}

$blogSourceFiles = @(
  (Join-Path $PSScriptRoot "src\components\sections\Blog.tsx"),
  (Join-Path $PSScriptRoot "src\app\blog\page.tsx"),
  (Join-Path $PSScriptRoot "src\app\blog\[slug]\page.tsx")
)

foreach ($file in $blogSourceFiles) {
  $text = Get-Content -LiteralPath $file -Raw -Encoding UTF8
  if ($text -cmatch '\bblogPosts\b') {
    $relative = Resolve-Path -LiteralPath $file -Relative
    $failures.Add("Blog UI should read posts from content\blog, not blogPosts in $relative")
  }
}

$blogUiFiles = @(
  (Join-Path $PSScriptRoot "src\components\sections\Blog.tsx"),
  (Join-Path $PSScriptRoot "src\app\blog\page.tsx"),
  (Join-Path $PSScriptRoot "src\app\blog\[slug]\page.tsx")
)

foreach ($file in $blogUiFiles) {
  $text = Get-Content -LiteralPath $file -Raw -Encoding UTF8
  if ($text -match 'post\.date') {
    $relative = Resolve-Path -LiteralPath $file -Relative
    $failures.Add("Blog UI should not render post.date in $relative")
  }
  if ($text -match 'Calendar') {
    $relative = Resolve-Path -LiteralPath $file -Relative
    $failures.Add("Blog UI should not show calendar/date UI in $relative")
  }
}

$blogPostPage = Get-Content -LiteralPath (Join-Path $PSScriptRoot "src\app\blog\[slug]\page.tsx") -Raw -Encoding UTF8
if ($blogPostPage -notmatch 'max-w-\[70ch\]') {
  $failures.Add("Blog article page should use a readable 70ch text column")
}
if ($blogPostPage -match 'lg:grid-cols') {
  $failures.Add("Blog article page should not use a competing two-column article layout")
}
if ($blogPostPage -notmatch 'ARTICLE INDEX') {
  $failures.Add("Blog article page should expose a lightweight in-flow article index")
}

if ($failures.Count -gt 0) {
  foreach ($failure in $failures) {
    [Console]::Error.WriteLine($failure)
  }
  exit 1
}

Write-Host "site verification passed"
