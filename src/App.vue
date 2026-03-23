<template>
  <div style="text-align: center; margin-top: 100px; font-family: sans-serif">
    <img
      src="./assets/vue.svg"
      alt="Vue logo"
      width="100" />
    <h1>那咋了</h1>

    <div style="border: 1px solid #ccc; padding: 20px; display: inline-block">
      <p>
        当前运行环境：<strong style="color: #646cff">{{ envName }}</strong>
      </p>
      <p>
        Axios 将会请求：<code>{{ baseUrl }}</code>
      </p>
    </div>
    <div
      v-if="needRefresh"
      class="update-pwa-toast">
      <div class="message">🚀 发现新版本，是否立即更新以获取最新功能？</div>
      <button @click="updateServiceWorker()">立即更新</button>
      <button @click="close">稍后</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取 Vite 注入的环境变量
const envName = import.meta.env.VITE_APP_ENV_NAME;
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

import { useRegisterSW } from 'virtual:pwa-register/vue';

// 注册 Service Worker，它会返回一个“是否有更新”的变量和“刷新方法”
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered(r) {
    console.log('SW 注册成功:', r);
  },
  onNeedRefresh() {
    console.log('检测到新版本，needRefresh 应该变 true 了');
  },
  onRegisterError(error) {
    console.error('SW 注册失败:', error);
  },
});

const close = () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>
<style scoped>
.update-pwa-toast {
  position: fixed;
  right: 20px;
  bottom: 20px;
  border: 1px solid #888;
  background-color: white;
  padding: 15px;
  z-index: 999;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.update-pwa-toast button {
  margin-left: 10px;
  cursor: pointer;
}
</style>
