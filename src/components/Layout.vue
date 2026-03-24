<template>
  <div class="layout">
    <!-- 左侧菜单栏 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>学习笔记</h2>
        <p class="subtitle">Knowledge Base</p>
      </div>
      <nav class="menu">
        <router-link
          to="/home"
          class="menu-item"
          active-class="active">
          <span class="icon">🏠</span>
          <span>首页</span>
        </router-link>
        <router-link
          to="/practice"
          class="menu-item"
          active-class="active">
          <span class="icon">💻</span>
          <span>练习demo</span>
        </router-link>
        <div class="menu-section">
          <div
            class="menu-section-header"
            @click="toggleNotes">
            <span class="icon">📚</span>
            <span>学习笔记</span>
            <span class="arrow">{{ notesExpanded ? '▼' : '▶' }}</span>
          </div>
          <div
            v-if="notesExpanded"
            class="notes-tree">
            <template v-if="isLoading">
              <div class="loading-text">📂 正在扫描笔记...</div>
            </template>
            <template v-else>
              <div
                v-for="item in noteTree"
                :key="item.path"
                class="note-item"
                :class="{ 'is-folder': item.children }">
                <div
                  @click="toggleNote(item)"
                  class="note-label">
                  <span class="note-icon">{{
                    item.children ? '📁' : '📄'
                  }}</span>
                  <span>{{ item.name }}</span>
                  <span
                    v-if="item.children"
                    class="note-arrow"
                    >{{ item.expanded ? '▼' : '▶' }}</span
                  >
                </div>
                <div
                  v-if="item.children && item.expanded"
                  class="note-children">
                  <router-link
                    v-for="child in item.children"
                    :key="child.path"
                    :to="`/notes/${child.path}`"
                    class="note-child-item"
                    active-class="active">
                    <span class="note-icon">📄</span>
                    <span>{{ child.name }}</span>
                  </router-link>
                </div>
              </div>
            </template>
          </div>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">👤</div>
          <div class="user-details">
            <p class="username">欢迎回来</p>
            <p class="user-email">今天也是学习的一天</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧内容区域 -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNoteTree } from '@/composables/useNoteTree';
const router = useRouter();
const notesExpanded = ref(true);
const { noteTree, isLoading } = useNoteTree(); // 👈 直接解构使用
// 笔记树结构
interface NoteNode {
  name: string;
  path: string;
  children?: NoteNode[];
  expanded?: boolean;
}

const toggleNotes = () => {
  notesExpanded.value = !notesExpanded.value;
};

const toggleNote = (item: NoteNode) => {
  if (item.children) {
    item.expanded = !item.expanded;
  } else {
    router.push(`/notes/${item.path}`);
  }
};

// 动态加载笔记树（未来可以改为自动扫描）
onMounted(() => {
  // 这里可以添加动态加载笔记文件的逻辑
});
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: $content-bg;

  .loading-text {
    padding: 10px 20px;
    font-size: 13px;
    color: $text-dark;
    font-style: italic;
  }
}

.sidebar {
  width: 320px;
  background: $sidebar-bg-gradient;
  color: $text-light;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  flex-shrink: 0;

  // 使用 BEM 配合 SCSS 嵌套
  &-header {
    padding: 24px 20px;
    border-bottom: 1px solid $sidebar-border;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      background: $primary-gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      margin: 4px 0 0;
      font-size: 12px;
      opacity: 0.7;
      letter-spacing: 1px;
    }
  }

  .menu {
    padding: 20px 0;
    flex: 1;
    overflow-y: auto;

    &-item,
    &-section-header {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: $text-muted;
      text-decoration: none;
      transition: $transition-base;
      border-left: 3px solid transparent;
      cursor: pointer;

      .icon {
        margin-right: 12px;
        font-size: 18px;
      }

      &:hover {
        background: $hover-bg;
        color: #fff;
      }
    }

    &-item {
      &:hover {
        border-left-color: $primary-color;
      }

      &.active {
        background: $active-bg;
        color: $primary-color;
        border-left-color: $primary-color;
      }
    }

    &-section {
      margin-top: 8px;
      .arrow {
        margin-left: auto;
        font-size: 12px;
      }
    }
  }

  .notes-tree {
    padding-left: 20px;

    .note-item {
      margin: 4px 0;

      .note-label {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        color: $text-tree;
        cursor: pointer;
        border-radius: 4px;
        transition: $transition-fast;

        &:hover {
          background: $hover-bg;
          color: #fff;
        }

        .note-icon {
          margin-right: 8px;
          font-size: 14px;
        }
        .note-arrow {
          margin-left: auto;
          font-size: 10px;
        }
      }

      .note-children {
        padding-left: 24px;
        border-left: 1px solid $sidebar-border;
        margin-left: 12px;

        .note-child-item {
          display: flex;
          align-items: center;
          padding: 6px 12px;
          color: $text-dark;
          text-decoration: none;
          border-radius: 4px;
          transition: $transition-fast;
          font-size: 13px;

          &:hover {
            background: $hover-bg;
            color: #fff;
          }

          &.active {
            background: $active-bg;
            color: $primary-color;
          }
        }
      }
    }
  }

  &-footer {
    padding: 20px;
    border-top: 1px solid $sidebar-border;

    .user-info {
      display: flex;
      align-items: center;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: $primary-gradient;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        margin-right: 12px;
      }

      .username {
        margin: 0;
        font-weight: 600;
        font-size: 14px;
      }

      .user-email {
        margin: 4px 0 0;
        font-size: 12px;
        opacity: 0.7;
      }
    }
  }
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}
</style>
