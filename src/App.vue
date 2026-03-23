<template>
  <div style="text-align: center; margin-top: 100px; font-family: sans-serif">
    <img
      src="./assets/vue.svg"
      alt="Vue logo"
      width="100" />
    <h1>环境变量实测</h1>

    <div style="border: 1px solid #ccc; padding: 20px; display: inline-block">
      <p>
        当前运行环境：<strong style="color: #646cff">{{ envName }}</strong>
      </p>
      <p>
        Axios 将会请求：<code>{{ baseUrl }}</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取 Vite 注入的环境变量
const envName = import.meta.env.VITE_APP_ENV_NAME;
const baseUrl = import.meta.env.VITE_APP_BASE_URL;
</script>
