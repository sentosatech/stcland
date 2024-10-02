import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({ rollupTypes: true, insertTypesEntry: true }),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss('./tailwind.config.ts'),
        autoprefixer,
      ],
    },
  },
  build: {
    outDir: './dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        withStyles: resolve(__dirname, 'src/withStyles/index.ts'),
        icons: resolve(__dirname, 'src/icons/index.ts'),
        iconsWithStyles: resolve(__dirname, 'src/icons/withStyles/index.ts')

      },
      name: 'Stcland Components',
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@tanstack/react-table', 'tailwindcss'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@tanstack/react-table': 'ReactTable',
          tailwindcss: 'tailwindcss'
        },
      },
    },
    target: 'esnext',
  },
})
