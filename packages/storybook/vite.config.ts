import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../packages'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss('./tailwind.config.ts'),
        autoprefixer,
      ],
    },
  },
})
