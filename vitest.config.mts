/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'cypress/**'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'src/test-setup.ts'],
    },
  },
  resolve: {
    alias: {
      '@core': '/src/app/core',
      '@test/mock-component': '/src/test/ng2-mock-component-compat.ts',
      'ng2-mock-component': '/src/test/ng2-mock-component-compat.ts',
    },
  },
});
