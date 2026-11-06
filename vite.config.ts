import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8081,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return undefined;
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id))
            return 'vendor-react';
          if (/\/node_modules\/(react-router|react-router-dom)\//.test(id))
            return 'vendor-router';
          if (
            /\/node_modules\/(@radix-ui\/react-slot|class-variance-authority|clsx|tailwind-merge)\//.test(
              id
            )
          )
            return 'vendor-ui';
          return undefined;
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/setupTests.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/assets/**/*',
        'src/components/shared/**/*',
      ],
      thresholds: {
        lines: 67,
        statements: 66,
        functions: 64,
        branches: 64,
      },
    },
  },
}));
