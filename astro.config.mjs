// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // RSS 和 sitemap 依赖此域名
  site: 'https://muyuzhong.xyz',
  integrations: [sitemap()],
});
