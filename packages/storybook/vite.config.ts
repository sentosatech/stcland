import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
