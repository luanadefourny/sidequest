import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Pass your API key to your app, replacing placeholder in index.html if needed
    __API_KEY__: JSON.stringify(env.VITE_API_KEY),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // your backend port
        changeOrigin: true,
      },
    },
  },
});
