import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// const env = loadEnv('', process.cwd(), ''); //TODO chnage here

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   envDir: '..',
//   // define: {
//     // __API_KEY__: JSON.stringify(import.meta.env.VITE_API_KEY),
//   // },
//   server: {
//     proxy: {
//       '/api': {
//         target: import.meta.env.VITE_BACKEND_URL,
//         changeOrigin: true,
//       },
//     },
//   },
// });

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), ''); // load from repo root
    return {
    plugins: [react(), tailwindcss()],
    envDir: '..',
    server: {
      proxy: {
        '/api': {
          // target: env.VITE_BACKEND_URL,
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});