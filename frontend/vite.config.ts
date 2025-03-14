import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [react(), cesium()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    // proxy: {
    //   '/geo-proxy': {
    //     target: 'http://api 주소',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     secure: false,
    //     ws: true,
    //   },
    //   '/catch': {
    //     target: 'http://api 주소',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     secure: false,
    //     ws: true,
    //   },
    // },
    host: true,
  },
});
