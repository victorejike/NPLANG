import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@nplang/language-core': path.resolve(__dirname, '../packages/language-core/src/index.ts'),
    },
  },
});
