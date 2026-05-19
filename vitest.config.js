import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Inyecta de forma segura la variable para que config.js la detecte
    env: {
      NODE_ENV: 'test'
    }
  },
});