import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const env = loadEnv('', process.cwd(), '');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __API_KEY__: JSON.stringify(env.VITE_API_KEY),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});