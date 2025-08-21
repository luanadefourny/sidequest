import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// const env = loadEnv('', process.cwd(), ''); //TODO chnage here

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: '..',
  // define: {
    // __API_KEY__: JSON.stringify(import.meta.env.VITE_API_KEY),
  // },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});