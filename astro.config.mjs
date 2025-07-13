// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx({
      components: {
        'tip': 'src/components/TipBox.astro',
        'warning': 'src/components/WarningBox.astro',
      }
    })
  ],
  adapter: netlify()
});