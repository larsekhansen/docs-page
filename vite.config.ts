import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { ConfigEnv } from 'vite';

export default defineConfig((env: ConfigEnv) => {
  const { command } = env;
  const isDev = command === 'serve';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
    },
    build: {
      outDir: path.resolve(__dirname, 'hugo/static/ui'),
      emptyOutDir: true,
      sourcemap: isDev,
      rollupOptions: {
        input: path.resolve(__dirname, 'ui/main.tsx'),
        output: {
          entryFileNames: 'islands.js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  };
});
