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
  // base:'./',
  base: process.env.NODE_ENV === 'production'
    ? '/High-speed-Railway/' // 生产环境（部署到GitHub Pages）使用仓库名
    : '/', // 开发环境使用根路径
  build:{
    outDir:'dist'
  }
})