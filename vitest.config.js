import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.js', 'tests/contract/**/*.test.js'],
    setupFiles: ['tests/setup/vitest.setup.js'],
    environment: 'node',
    coverage: {
      enabled: false,
    },
  },
});
