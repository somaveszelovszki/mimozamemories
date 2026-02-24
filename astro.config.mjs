import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  srcDir: 'src',
  integrations: [svelte()],
  server: {
    port: 4321,
  },
  build: {
    format: 'directory',
  },
});
