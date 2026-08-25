// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://axiomatic-spark-505611-t0.web.app',
  output: 'static',
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
  },
});