import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://sugiyanto.com',
  image: {
    service: passthroughImageService()
  },
  adapter: cloudflare({
    platformProxy: { enabled: true }
  }),
  integrations: [sitemap(), react(), keystatic()],
});
