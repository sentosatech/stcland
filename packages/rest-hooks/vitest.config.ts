import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['vitests/**.test.ts'],
  },
})