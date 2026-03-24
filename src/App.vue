<template>
  <div id="app">
    <!-- PWA 更新提示 -->
    <div
      v-if="needRefresh"
      class="update-pwa-toast">
      <div class="message">🚀 发现新版本，是否立即更新以获取最新功能？</div>
      <button @click="updateServiceWorker()">立即更新</button>
      <button @click="close">稍后</button>
    </div>
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
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
