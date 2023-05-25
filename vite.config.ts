import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 8000,
    proxy: {
      "/app": {
        target: 'http://150.158.101.116:9002',
        // target: 'http://43.139.92.74:8081',
        changeOrigin: true,
      }
    }
  },
  build: {
    target: 'esnext',
  },
  
});
