import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { CATEGORY_LABEL } from '../lib/temp';

export async function GET(context: APIContext) {
  const writing = (await getCollection('writing')).sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime()
  );
  return rss({
    title: '低温笔记 LowTemp Notes',
    description: '在噪声退去之后,记录仍然成立的东西。',
    site: context.site!,
    items: writing.map((e) => ({
      title: `${e.data.id} · ${e.data.title}`,
      description: e.data.excerpt,
      pubDate: e.data.published,
      categories: [CATEGORY_LABEL[e.data.category], ...e.data.tags],
      link: `/writing/${e.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
