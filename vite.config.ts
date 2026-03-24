import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // 关键：当发现新内容时，提示用户刷新
      devOptions: {
        enabled: false, // 开发环境也开启，方便你调试
      },
      manifest: {
        name: '我的 Vue 部署实践',
        short_name: 'VueDeploy',
        theme_color: '#ffffff',
        icons: [
          // PWA 需要图标才能安装到手机/桌面，暂时可以先空着或放个 logo
        ],
      },
    }),
    visualizer({
      filename: 'dist/stats.html', // 输出分析报告的文件名
      open: true, // 构建完成后自动打开报告
      gzipSize: true, // 显示 gzip 大小
      brotliSize: true, // 显示 brotli 大小
    }) as any, // 由于 rollup-plugin-visualizer 没有完全适配 Vite 的类型定义，这里暂时使用 any 绕过类型检查
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 1. 指定使用现代编译器 API
        api: 'modern-compiler',
        // 2. 你的全局变量注入
        additionalData: `@use "@/assets/styles/_variables.scss" as *;`,
      },
    },
  },
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      output: {
        // 分包策略：把大的库拆出来，避免一个 index.js 走天下
        manualChunks: {
          'markdown-vendor': ['markdown-it', 'highlight.js'],
          'vue-vendor': ['vue', 'vue-router'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 默认 500kb 警告，咱们放宽一点
  },
});
