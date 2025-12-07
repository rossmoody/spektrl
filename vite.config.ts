import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@generators': path.resolve(__dirname, 'src/generators'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@consts': path.resolve(__dirname, 'src/consts'),
    },
  },
})
