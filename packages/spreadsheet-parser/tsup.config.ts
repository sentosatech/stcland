import { defineConfig } from 'tsup'

// export default defineConfig({
//   format: ['cjs', 'esm'],
//   entry: ['./src/index.ts'],
//   dts: true,
//   shims: true,
//   skipNodeModulesBundle: true,
//   clean: true,
//   tsconfig: 'tsconfig.json',
// })

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: `.${format === 'esm' ? 'mjs' : 'cjs'}`,
    }
  },
})
