$ErrorActionPreference = "Stop"

$failures = New-Object System.Collections.Generic.List[string]

$dataPath = Join-Path $PSScriptRoot "src\lib\data.ts"
$blogComponentPath = Join-Path $PSScriptRoot "src\components\sections\Blog.tsx"
$blogIndexPath = Join-Path $PSScriptRoot "src\app\blog\page.tsx"
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

if ($failures.Count -gt 0) {
  foreach ($failure in $failures) {
    [Console]::Error.WriteLine($failure)
  }
  exit 1
}

Write-Host "site verification passed"
