import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.VITE_PRIVATE_KEY': JSON.stringify(env.VITE_PRIVATE_KEY),
      'process.env.THIRD_WEB_KEY': JSON.stringify(env.THIRD_WEB_KEY),
    },
    server: {
      configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
          res.setHeader('X-Frame-Options', 'SAMEORIGIN');
          next();
        });
      },
    },
  };
});
