<template>
  <div class="notes-viewer">
    <div
      v-if="loading"
      class="loading">
      <div class="spinner"></div>
      <p>加载笔记内容...</p>
    </div>

    <div
      v-else-if="error"
      class="error">
      <div class="error-icon">❌</div>
      <h3>加载失败</h3>
      <p>{{ error }}</p>
      <button
        @click="retry"
        class="btn primary">
        重试
      </button>
    </div>

    <div
      v-else
      class="notes-content">
      <!-- 笔记标题和元信息 -->
      <div class="notes-header">
        <div class="breadcrumb">
          <router-link to="/">首页</router-link>
          <span class="separator">/</span>
          <router-link to="/notes">学习笔记</router-link>
          <template v-if="currentNote">
            <span class="separator">/</span>
            <span>{{ currentNote.category }}</span>
            <span class="separator">/</span>
            <span class="current">{{ currentNote.title }}</span>
          </template>
        </div>
        <div class="notes-actions">
          <button
            @click="toggleTheme"
            class="btn icon"
            :title="isDark ? '切换亮色主题' : '切换暗色主题'">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <button
            @click="copyLink"
            class="btn icon"
            title="复制链接">
            🔗
          </button>
          <button
            @click="printNote"
            class="btn icon"
            title="打印">
            🖨️
          </button>
        </div>
      </div>

      <!-- 笔记内容 -->
      <div
        class="markdown-body"
        :class="{ dark: isDark }"
        v-html="renderedContent"></div>

      <!-- 上一篇/下一篇导航 -->
      <div
        v-if="currentNote"
        class="notes-navigation">
        <router-link
          v-if="prevNote"
          :to="`/notes/${prevNote.path}`"
          class="nav-link prev">
          <span class="nav-arrow">←</span>
          <div class="nav-content">
            <div class="nav-label">上一篇</div>
            <div class="nav-title">{{ prevNote.title }}</div>
          </div>
        </router-link>
        <div
          v-else
          class="nav-placeholder"></div>

        <router-link
          v-if="nextNote"
          :to="`/notes/${nextNote.path}`"
          class="nav-link next">
          <div class="nav-content">
            <div class="nav-label">下一篇</div>
            <div class="nav-title">{{ nextNote.title }}</div>
          </div>
          <span class="nav-arrow">→</span>
        </router-link>
        <div
          v-else
          class="nav-placeholder"></div>
      </div>

      <!-- 笔记信息 -->
      <div
        v-if="currentNote"
        class="notes-meta">
        <div class="meta-item">
          <span class="meta-label">📅 最后更新:</span>
          <span class="meta-value">{{ currentNote.updated || '未知' }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">📂 分类:</span>
          <span class="meta-value">{{ currentNote.category }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">🔖 标签:</span>
          <div class="tags">
            <span
              v-for="tag in currentNote.tags"
              :key="tag"
              class="tag"
              >{{ tag }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css'; // 引入暗色代码主题

// 初始化 markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // 使用默认转义
  },
});

// 路由
const route = useRoute();
const notePath = computed(() => route.params.path as string);

// 状态
const loading = ref(true);
const error = ref('');
const noteContent = ref('');
const isDark = ref(false);

// 笔记数据
interface NoteItem {
  path: string;
  title: string;
  category: string;
  tags: string[];
  updated: string;
}

const notesList = ref<NoteItem[]>([
  {
    path: 'notes1/reactive-proxy',
    title: 'Vue 响应式原理',
    category: 'notes1',
    tags: ['Vue', '响应式', '原理'],
    updated: '2024-03-20',
  },
  {
    path: 'notes1/render-optimization',
    title: '渲染优化',
    category: 'notes1',
    tags: ['Vue', '性能', '优化'],
    updated: '2024-03-19',
  },
  {
    path: 'notes1/v-model-task',
    title: 'v-model 任务',
    category: 'notes1',
    tags: ['Vue', 'v-model', '组件'],
    updated: '2024-03-18',
  },
  {
    path: 'notes1/slots',
    title: '插槽详解',
    category: 'notes1',
    tags: ['Vue', '插槽', '组件'],
    updated: '2024-03-17',
  },
  {
    path: 'notes1/optionAndcompositionApi',
    title: '选项式与组合式 API',
    category: 'notes1',
    tags: ['Vue', 'API', '对比'],
    updated: '2024-03-16',
  },
  {
    path: 'notes1/diff-algorithm',
    title: 'Diff 算法',
    category: 'notes1',
    tags: ['Vue', '算法', '虚拟DOM'],
    updated: '2024-03-15',
  },
  {
    path: 'notes2/promise-core',
    title: 'Promise 核心原理',
    category: 'notes2',
    tags: ['JavaScript', '异步', 'Promise'],
    updated: '2024-03-14',
  },
  {
    path: 'notes2/debounce-throttle',
    title: '防抖与节流',
    category: 'notes2',
    tags: ['JavaScript', '性能', '优化'],
    updated: '2024-03-13',
  },
  {
    path: 'notes2/mini-reactive',
    title: '迷你响应式系统',
    category: 'notes2',
    tags: ['JavaScript', '响应式', '实现'],
    updated: '2024-03-12',
  },
  {
    path: 'notes2/eventEmmit',
    title: '事件发射器',
    category: 'notes2',
    tags: ['JavaScript', '事件', '模式'],
    updated: '2024-03-11',
  },
  {
    path: 'notes2/deep-clone',
    title: '深拷贝实现',
    category: 'notes2',
    tags: ['JavaScript', '算法', '拷贝'],
    updated: '2024-03-10',
  },
  {
    path: 'notes3/css查漏补缺',
    title: 'CSS 查漏补缺',
    category: 'notes3',
    tags: ['CSS', '技巧', '查漏补缺'],
    updated: '2024-03-09',
  },
  {
    path: 'notes3/vue查漏补缺',
    title: 'Vue 查漏补缺',
    category: 'notes3',
    tags: ['Vue', '技巧', '查漏补缺'],
    updated: '2024-03-08',
  },
  {
    path: 'notes3/js查漏补缺',
    title: 'JavaScript 查漏补缺',
    category: 'notes3',
    tags: ['JavaScript', '技巧', '查漏补缺'],
    updated: '2024-03-07',
  },
  {
    path: 'index',
    title: '首页',
    category: 'root',
    tags: ['介绍', '目录'],
    updated: '2024-03-01',
  },
  {
    path: 'README',
    title: '说明文档',
    category: 'root',
    tags: ['说明', '文档'],
    updated: '2024-03-01',
  },
]);

// 当前笔记
const currentNote = computed(() => {
  return notesList.value.find((note) => note.path === notePath.value);
});
console.log(currentNote.value, 111);
// 上一篇/下一篇
const currentIndex = computed(() => {
  if (!currentNote.value) return -1;
  return notesList.value.findIndex((note) => note.path === notePath.value);
});

const prevNote = computed(() => {
  if (currentIndex.value <= 0) return null;
  return notesList.value[currentIndex.value - 1];
});

const nextNote = computed(() => {
  if (
    currentIndex.value === -1 ||
    currentIndex.value >= notesList.value.length - 1
  )
    return null;
  return notesList.value[currentIndex.value + 1];
});

// 渲染后的内容
const renderedContent = computed(() => {
  if (!noteContent.value) return '';
  return md.render(noteContent.value);
});

// 加载笔记内容
const loadNoteContent = async () => {
  loading.value = true;
  error.value = '';

  // 获取路由参数，例如 "notes1/reactive-proxy"
  const path = route.params.path as string;

  if (!path) {
    noteContent.value = '# 欢迎使用学习笔记\n请从左侧菜单选择内容。';
    loading.value = false;
    return;
  }

  try {
    // 关键点：从 public/notes/ 动态抓取文件

    // 如果 path 已经是字符串，.join 会报错，所以建议加个判断或直接强制转换
    const pathStr = Array.isArray(path) ? path.join('/') : path;
    console.log(pathStr, 111);
    const response = await fetch(`/notes/${pathStr}.md`);

    if (!response.ok) {
      throw new Error(`笔记不存在或路径错误: ${path}.md`);
    }

    const text = await response.text();

    // 把读取到的原文存入响应式变量
    noteContent.value = text;

    // 如果有平级目录需求，这里可以顺便更新 document.title
    if (currentNote.value) {
      document.title = `${currentNote.value.title} - 学习笔记`;
    }
  } catch (err) {
    error.value = (err as Error).message;
    noteContent.value = '';
  } finally {
    loading.value = false;
  }
};

// 方法
const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.setAttribute(
    'data-theme',
    isDark.value ? 'dark' : 'light',
  );
};

const copyLink = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板');
  });
};

const printNote = () => {
  window.print();
};

const retry = () => {
  loadNoteContent();
};

// 监听路由变化
watch(
  () => route.params.path,
  (newPath) => {
    console.log('路由参数变化，newPath:', newPath, 'notePath:', notePath.value);
    loadNoteContent();
  },
  { immediate: true },
);

// 初始化
onMounted(() => {
  if (notePath.value) {
    loadNoteContent();
  } else {
    // 如果没有指定笔记，重定向到笔记列表或首页
    // 暂时显示欢迎信息
    noteContent.value = '# 学习笔记\n\n请从左侧菜单选择要查看的笔记。';
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.notes-viewer {
  padding: 40px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: $content-bg;

  // 1. 加载状态
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: $text-dark;

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid $primary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
  }

  // 2. 错误状态
  .error {
    text-align: center;
    padding: 60px 20px;
    color: $error-red;

    &-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h3 {
      margin: 0 0 12px;
      font-size: 24px;
    }
    p {
      margin: 0 0 24px;
      color: $text-dark;
    }
  }

  // 3. 头部与面包屑
  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;

    .breadcrumb {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 14px;

      a {
        color: $primary-color;
        text-decoration: none;
        transition: color 0.3s ease;
        &:hover {
          color: #764ba2;
          text-decoration: underline;
        }
      }

      .separator {
        color: $breadcrumb-separator;
        margin: 0 4px;
      }
      .current {
        font-weight: 600;
        color: #2c3e50;
      }
    }

    .notes-actions {
      display: flex;
      gap: 8px;

      .btn.icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f8f9fa;
        border: 2px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        transition: $transition-base;

        &:hover {
          background: $primary-color;
          border-color: $primary-color;
          color: white;
          transform: scale(1.1);
        }
      }
    }
  }

  // 4. Markdown 容器（包含深色模式逻辑）
  .markdown-body {
    background: white;
    border-radius: $border-radius-md;
    padding: 40px;
    box-shadow: $card-shadow;
    margin-bottom: 40px;
    min-height: 400px;
    transition: $transition-base;

    &.dark {
      background: $markdown-dark-bg;
      color: #ecf0f1;

      // 这里的嵌套会应用到深色模式下的子元素
      :deep(h1),
      :deep(h2),
      :deep(h3) {
        color: #ecf0f1;
      }
      :deep(p) {
        color: #bdc3c7;
      }
      :deep(code) {
        background: #2c3e50;
        color: #ffd700;
      }
      :deep(table),
      :deep(td) {
        border-color: #34495e;
      }
      :deep(th) {
        background: #2c3e50;
        color: #ecf0f1;
      }
      :deep(td) {
        color: #bdc3c7;
      }
    }

    // Markdown 内部样式注入
    :deep() {
      h1 {
        font-size: 32px;
        color: #2c3e50;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 2px solid #f0f0f0;
      }
      h2 {
        font-size: 24px;
        color: #2c3e50;
        margin-top: 32px;
        margin-bottom: 16px;
      }
      p {
        line-height: 1.8;
        margin: 16px 0;
        color: #5d6d7e;
      }

      a {
        color: $primary-color;
        border-bottom: 1px solid transparent;
        transition: $transition-fast;
        &:hover {
          border-bottom-color: $primary-color;
        }
      }

      code {
        background: #f8f9fa;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 14px;
        color: $error-red;
      }

      pre {
        background: $markdown-dark-bg;
        border-radius: 8px;
        padding: 20px;
        overflow-x: auto;
        margin: 20px 0;
        code {
          background: transparent;
          color: #ecf0f1;
        }
      }

      blockquote {
        border-left: 4px solid $primary-color;
        padding-left: 20px;
        margin: 20px 0;
        color: $text-dark;
        font-style: italic;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        th,
        td {
          padding: 12px;
          border: 1px solid #e0e0e0;
        }
        th {
          background: #f8f9fa;
          font-weight: 600;
        }
      }
    }
  }

  // 5. 底部导航（上一篇/下一篇）
  .notes-navigation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    gap: 20px;

    .nav-link {
      display: flex;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      color: inherit;
      flex: 1;
      transition: $transition-base;
      border: 2px solid transparent;
      box-shadow: $card-shadow;

      &:hover {
        transform: translateY(-4px);
        border-color: $primary-color;
        box-shadow: $card-shadow-hover;
      }

      &.prev {
        text-align: left;
      }
      &.next {
        text-align: right;
        flex-direction: row-reverse;
      }

      .nav-arrow {
        font-size: 24px;
        color: $primary-color;
        margin: 0 16px;
      }
      .nav-content {
        flex: 1;
        .nav-label {
          font-size: 12px;
          color: $text-dark;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .nav-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }

  // 6. 元数据标签
  .notes-meta {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
      .meta-label {
        font-weight: 600;
        color: #2c3e50;
        font-size: 14px;
      }
      .meta-value {
        color: $text-dark;
        font-size: 14px;
      }
    }

    .tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      .tag {
        padding: 4px 12px;
        background: $active-bg;
        color: $primary-color;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
