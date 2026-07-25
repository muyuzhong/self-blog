// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 改成你的实际域名(RSS 和 sitemap 依赖它)
  site: 'https://lowtemp.lab',
  integrations: [sitemap()],
});
