import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

const rootEnv = path.resolve(__dirname, "../../.env");
dotenv.config({ path: rootEnv });


export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: '..',
  server: {
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});