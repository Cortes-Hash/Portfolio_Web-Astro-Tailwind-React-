import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
  site: 'https://alejandro-cortes.dev', // Cambia esta URL por la que te dé Vercel (ej: https://tu-portfolio.vercel.app)
});
