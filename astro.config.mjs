import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  srcDir: 'src',
  server: {
    port: 4321,
  },
  build: {
    format: 'directory',
  },
});
