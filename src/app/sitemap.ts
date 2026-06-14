import { MetadataRoute } from "next"
import { getAllBlogPosts } from "@/lib/blog"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const markdownPosts = await getAllBlogPosts()
  const posts = markdownPosts.map((post) => ({
    url: `https://muyuzhong.xyz/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [
    {
      url: "https://muyuzhong.xyz",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://muyuzhong.xyz/series",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...posts,
  ]
}
