import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    proxy: {
      "/app": {
        target: 'http://43.139.92.74:8081',
        changeOrigin: true,
      }
    }
  },
  build: {
    target: 'esnext',
  },
  
});
