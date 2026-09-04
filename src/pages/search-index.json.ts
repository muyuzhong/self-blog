import { getCollection } from 'astro:content';
import { fmtTemp, tempOf, STATUS_LABEL, CATEGORY_LABEL } from '../lib/temp';

export async function GET() {
  const writing = await getCollection('writing');
  const projects = await getCollection('projects');
  const log = await getCollection('log');

  const items = [
    ...writing.map((w) => {
      const temp = tempOf(w.data.status, w.data.temperature);
      return {
        type: 'writing',
        id: w.data.id,
        slug: w.id,
        title: w.data.title,
        subtitle: w.data.subtitle ?? '',
        excerpt: w.data.excerpt,
        category: CATEGORY_LABEL[w.data.category] ?? w.data.category,
        status: STATUS_LABEL[w.data.status] ?? w.data.status,
        temp: fmtTemp(temp),
        tags: w.data.tags ?? [],
        url: `/writing/${w.id}/`,
        date: w.data.published.toISOString().split('T')[0],
        body: w.body ? w.body.slice(0, 3000).replace(/[#*`>_[\]()]/g, ' ').replace(/\s+/g, ' ').trim() : '',
      };
    }),
    ...projects.map((p) => {
      const temp = tempOf(p.data.status, p.data.temperature);
      return {
        type: 'project',
        id: p.data.id,
        slug: p.id,
        title: p.data.title,
        subtitle: p.data.subtitle ?? '',
        excerpt: p.data.excerpt,
        category: '项目',
        status: STATUS_LABEL[p.data.status] ?? p.data.status,
        temp: fmtTemp(temp),
        tags: p.data.tags ?? [],
        url: `/projects/`,
        date: p.data.created ? p.data.created.toISOString().split('T')[0] : '',
        body: p.body ? p.body.slice(0, 1500).replace(/[#*`>_[\]()]/g, ' ').replace(/\s+/g, ' ').trim() : '',
      };
    }),
    ...log.map((l) => ({
      type: 'log',
      id: `LOG-${l.id}`,
      slug: l.id,
      title: `日志 · ${l.id}`,
      subtitle: '',
      excerpt: l.body ? l.body.slice(0, 160).replace(/[#*`>_[\]()]/g, ' ').replace(/\s+/g, ' ').trim() : '',
      category: '实验日志',
      status: '记录',
      temp: '',
      tags: l.data.tags ?? [],
      url: `/log/#log-${l.id}`,
      date: l.id,
      body: l.body ? l.body.slice(0, 400).replace(/[#*`>_[\]()]/g, ' ').replace(/\s+/g, ' ').trim() : '',
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
