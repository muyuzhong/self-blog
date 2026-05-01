import { MetadataRoute } from "next"
import { blogPosts } from "@/lib/data"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = blogPosts.map((post) => ({
    url: `https://muyuzhong.dev/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: "https://muyuzhong.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...posts,
  ]
}
