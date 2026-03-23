import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt', // 关键：当发现新内容时，提示用户刷新
      devOptions: {
        enabled: true, // 开发环境也开启，方便你调试
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
  ],
});
