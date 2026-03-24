<template>
  <div class="home">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <span class="welcome-text">欢迎回来，</span>
          <span class="dynamic-text">{{ dynamicText }}</span>
          <span class="cursor">|</span>
        </h1>
        <p class="welcome-subtitle">今天又是充满学习动力的一天！</p>
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">{{ noteCount }}</div>
            <div class="stat-label">篇笔记</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ practiceCount }}</div>
            <div class="stat-label">个练习</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ todayProgress }}%</div>
            <div class="stat-label">今日进度</div>
          </div>
        </div>
      </div>
      <div class="welcome-illustration">
        <div class="floating-elements">
          <div class="floating-element vue">Vue</div>
          <div class="floating-element js">JS</div>
          <div class="floating-element css">CSS</div>
          <div class="floating-element ts">TS</div>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="quick-actions">
      <h2>快速入口</h2>
      <div class="action-grid">
        <router-link
          to="/practice"
          class="action-card">
          <div class="action-icon">💻</div>
          <h3>练习demo</h3>
          <p>动手实践，巩固知识</p>
        </router-link>
        <router-link
          to="/notes"
          class="action-card">
          <div class="action-icon">📚</div>
          <h3>学习笔记</h3>
          <p>查阅笔记，温故知新</p>
        </router-link>
        <div
          class="action-card"
          @click="addNote">
          <div class="action-icon">✏️</div>
          <h3>新建笔记</h3>
          <p>记录新的学习内容</p>
        </div>
        <div
          class="action-card"
          @click="viewProgress">
          <div class="action-icon">📈</div>
          <h3>学习进度</h3>
          <p>查看学习统计</p>
        </div>
      </div>
    </div>

    <!-- 最近更新 -->
    <div class="recent-updates">
      <h2>最近更新</h2>
      <div class="updates-list">
        <div
          v-for="update in recentUpdates"
          :key="update.id"
          class="update-item">
          <div class="update-icon">{{ update.icon }}</div>
          <div class="update-content">
            <h4>{{ update.title }}</h4>
            <p>{{ update.description }}</p>
            <div class="update-meta">
              <span class="update-time">{{ update.time }}</span>
              <span class="update-category">{{ update.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 动态文本效果
const texts = ['开发者', '学习者', '探索者', '创造者'];
const dynamicText = ref('');
const textIndex = ref(0);
const charIndex = ref(0);
const isDeleting = ref(false);
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseDuration = 2000;

let typingInterval: number;

const typeText = () => {
  const currentText = texts[textIndex.value];

  if (!isDeleting.value && charIndex.value <= currentText.length) {
    dynamicText.value = currentText.substring(0, charIndex.value);
    charIndex.value++;
    typingInterval = setTimeout(typeText, typingSpeed);
  } else if (isDeleting.value && charIndex.value >= 0) {
    dynamicText.value = currentText.substring(0, charIndex.value);
    charIndex.value--;
    typingInterval = setTimeout(typeText, deletingSpeed);
  } else {
    isDeleting.value = !isDeleting.value;
    if (!isDeleting.value) {
      textIndex.value = (textIndex.value + 1) % texts.length;
    }
    typingInterval = setTimeout(typeText, pauseDuration);
  }
};

// 统计数据
const noteCount = ref(15);
const practiceCount = ref(8);
const todayProgress = ref(65);

// 最近更新
const recentUpdates = ref([
  {
    id: 1,
    icon: '📝',
    title: 'Vue 响应式原理',
    description: '深入理解 Vue 3 的响应式系统实现',
    time: '2小时前',
    category: 'notes1',
  },
  {
    id: 2,
    icon: '🔧',
    title: '防抖与节流',
    description: '性能优化常用技巧详解',
    time: '昨天',
    category: 'notes2',
  },
  {
    id: 3,
    icon: '🎨',
    title: 'CSS 查漏补缺',
    description: 'CSS 高级特性与实用技巧',
    time: '3天前',
    category: 'notes3',
  },
  {
    id: 4,
    icon: '⚡',
    title: 'Promise 核心',
    description: 'Promise 实现原理与异步编程',
    time: '5天前',
    category: 'notes2',
  },
]);

// 方法
const addNote = () => {
  alert('新建笔记功能开发中...');
};

const viewProgress = () => {
  alert('学习进度功能开发中...');
};

// 生命周期
onMounted(() => {
  typeText();
});

onUnmounted(() => {
  clearTimeout(typingInterval);
});
</script>

<style lang="scss" scoped>
.home {
  padding: 40px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: $content-bg;

  // 1. 欢迎区域
  .welcome-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 60px;
    background: $primary-gradient;
    border-radius: $border-radius-lg;
    padding: 40px;
    color: white;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

    .welcome-content {
      flex: 1;

      .welcome-title {
        font-size: 48px;
        font-weight: 700;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .dynamic-text {
          color: #ffd700;
          min-width: 120px;
          display: inline-block;
        }

        .cursor {
          animation: blink 1s infinite;
          margin-left: 2px;
        }
      }

      .welcome-subtitle {
        font-size: 20px;
        opacity: 0.9;
        margin-bottom: 32px;
      }
    }

    // 统计卡片嵌套
    .stats {
      display: flex;
      gap: 24px;

      .stat-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: $border-radius-sm;
        padding: 20px;
        min-width: 120px;
        text-align: center;
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-5px);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }

    // 插画与浮动元素
    .welcome-illustration {
      flex: 0 0 300px;
      position: relative;
      height: 200px;

      .floating-element {
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        animation: float 6s ease-in-out infinite;

        // 使用 SCSS 遍历或直接嵌套定义不同类型的颜色
        &.vue {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          top: 20px;
          left: 50px;
          animation-delay: 0s;
        }
        &.js {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          top: 80px;
          left: 180px;
          animation-delay: 1s;
        }
        &.css {
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
          top: 120px;
          left: 80px;
          animation-delay: 2s;
        }
        &.ts {
          background: rgba(156, 39, 176, 0.2);
          color: #9c27b0;
          top: 40px;
          left: 220px;
          animation-delay: 3s;
        }
      }
    }
  }

  // 2. 快捷操作与更新列表标题
  h2 {
    font-size: 28px;
    margin-bottom: 24px;
    color: #2c3e50;
  }

  // 3. 快捷操作网格
  .quick-actions {
    margin-bottom: 60px;

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;

      .action-card {
        background: white;
        border-radius: $border-radius-md;
        padding: 30px;
        text-align: center;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        transition: $transition-base;
        border: 2px solid transparent;
        box-shadow: $card-shadow;

        &:hover {
          transform: translateY(-8px);
          border-color: $primary-color;
          box-shadow: $card-shadow-hover;
        }

        .action-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        h3 {
          margin: 0 0 8px;
          font-size: 20px;
          color: #2c3e50;
        }

        p {
          margin: 0;
          color: $text-dark;
          font-size: 14px;
        }
      }
    }
  }

  // 4. 最近更新
  .recent-updates {
    .updates-list {
      display: grid;
      gap: 16px;

      .update-item {
        display: flex;
        align-items: flex-start;
        background: white;
        border-radius: $border-radius-sm;
        padding: 20px;
        transition: $transition-base;
        box-shadow: $card-shadow;

        &:hover {
          transform: translateX(8px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .update-icon {
          font-size: 24px;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .update-content {
          flex: 1;

          h4 {
            margin: 0 0 8px;
            font-size: 18px;
            color: #2c3e50;
          }
          p {
            margin: 0 0 8px;
            color: $text-dark;
            font-size: 14px;
          }

          .update-meta {
            display: flex;
            gap: 16px;
            font-size: 12px;

            .update-time {
              color: #95a5a6;
            }
            .update-category {
              color: $primary-color;
              font-weight: 500;
              padding: 2px 8px;
              background: rgba(102, 126, 234, 0.1);
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}

// 动画保持全局或放在最外层
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
</style>
