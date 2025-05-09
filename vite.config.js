import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'assets': path.resolve(__dirname, './public/assets')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  base:'./',
  build:{
    outDir:'dist'
  }
})