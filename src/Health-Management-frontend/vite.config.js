/// <reference types="vitest" />
import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: '../../.env' });

// Check if production build
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
  base: './',
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js',
  },
  resolve: {
    alias: [
      {
        find: 'declarations',
        replacement: fileURLToPath(
          new URL('../declarations', import.meta.url)
        ),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
  define: {
    'process.env.CANISTER_ID_HEALTH_MANAGEMENT_FRONTEND': 
      JSON.stringify(process.env.CANISTER_ID_HEALTH_MANAGEMENT_FRONTEND || ''),
    'process.env.CANISTER_ID_HEALTHCHAIN_BACKEND': 
      JSON.stringify(process.env.CANISTER_ID_HEALTHCHAIN_BACKEND || 'p5w3h-viaaa-aaaah-arcmq-cai'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
});
