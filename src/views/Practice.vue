<template>
  <div class="practice">
    <div class="practice-header">
      <h1>练习demo</h1>
      <p class="subtitle">动手实践，巩固知识。在这里测试你的代码吧！</p>
    </div>

    <div class="practice-tabs">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="practice-content">
      <!-- Vue 响应式示例 -->
      <div
        v-if="activeTab === 'vue'"
        class="demo-section">
        <h2>Vue 响应式示例</h2>
        <div class="demo-card">
          <div class="demo-description">
            <p>
              体验 Vue 3 的响应式系统。修改下面的数据，观察视图如何自动更新。
            </p>
          </div>
          <div class="demo-interactive">
            <div class="data-display">
              <p>
                当前计数: <span class="highlight">{{ count }}</span>
              </p>
              <p>
                当前消息: <span class="highlight">{{ message }}</span>
              </p>
              <p>
                用户信息:
                <span class="highlight">{{ JSON.stringify(user) }}</span>
              </p>
            </div>
            <div class="controls">
              <button
                @click="increment"
                class="btn primary">
                增加计数
              </button>
              <button
                @click="decrement"
                class="btn secondary">
                减少计数
              </button>
              <div class="input-group">
                <input
                  v-model="message"
                  placeholder="输入新消息"
                  class="input" />
                <button
                  @click="resetMessage"
                  class="btn outline">
                  重置消息
                </button>
              </div>
              <div class="input-group">
                <input
                  v-model="user.name"
                  placeholder="用户名"
                  class="input" />
                <input
                  v-model.number="user.age"
                  type="number"
                  placeholder="年龄"
                  class="input" />
                <button
                  @click="resetUser"
                  class="btn outline">
                  重置用户
                </button>
              </div>
            </div>
          </div>
          <div class="code-preview">
            <pre><code>{{ vueExampleCode }}</code></pre>
          </div>
        </div>
      </div>

      <!-- JavaScript 示例 -->
      <div
        v-if="activeTab === 'js'"
        class="demo-section">
        <h2>JavaScript 异步编程</h2>
        <div class="demo-card">
          <div class="demo-description">
            <p>模拟异步操作，体验 Promise 和 async/await。</p>
          </div>
          <div class="demo-interactive">
            <div class="data-display">
              <p>
                异步状态:
                <span :class="['status', asyncStatus]">{{
                  asyncStatusText
                }}</span>
              </p>
              <p>
                结果: <span class="highlight">{{ asyncResult }}</span>
              </p>
              <p>
                耗时: <span class="highlight">{{ asyncTime }}ms</span>
              </p>
            </div>
            <div class="controls">
              <button
                @click="startAsync"
                :disabled="isLoading"
                class="btn primary">
                {{ isLoading ? '处理中...' : '开始异步操作' }}
              </button>
              <button
                @click="resetAsync"
                class="btn secondary">
                重置
              </button>
            </div>
          </div>
          <div class="code-preview">
            <pre><code>{{ jsExampleCode }}</code></pre>
          </div>
        </div>
      </div>

      <!-- CSS 动画示例 -->
      <div
        v-if="activeTab === 'css'"
        class="demo-section">
        <h2>CSS 动画效果</h2>
        <div class="demo-card">
          <div class="demo-description">
            <p>体验 CSS 动画和过渡效果。</p>
          </div>
          <div class="demo-interactive">
            <div class="animation-area">
              <div
                :class="['animated-box', animationClass]"
                @click="toggleAnimation">
                {{ animationText }}
              </div>
            </div>
            <div class="controls">
              <div class="animation-buttons">
                <button
                  @click="setAnimation('bounce')"
                  class="btn outline">
                  弹跳
                </button>
                <button
                  @click="setAnimation('rotate')"
                  class="btn outline">
                  旋转
                </button>
                <button
                  @click="setAnimation('scale')"
                  class="btn outline">
                  缩放
                </button>
                <button
                  @click="setAnimation('color')"
                  class="btn outline">
                  颜色
                </button>
              </div>
              <button
                @click="toggleAnimation"
                class="btn primary">
                {{ isAnimating ? '停止动画' : '开始动画' }}
              </button>
            </div>
          </div>
          <div class="code-preview">
            <pre><code>{{ cssExampleCode }}</code></pre>
          </div>
        </div>
      </div>

      <!-- 代码编辑器 -->
      <div
        v-if="activeTab === 'editor'"
        class="demo-section">
        <h2>在线代码编辑器</h2>
        <div class="demo-card">
          <div class="demo-description">
            <p>在这里编写和测试你的 JavaScript 代码。</p>
          </div>
          <div class="editor-area">
            <div class="editor-header">
              <span>JavaScript 代码</span>
              <button
                @click="runCode"
                class="btn primary">
                运行代码
              </button>
            </div>
            <textarea
              v-model="userCode"
              class="code-editor"
              placeholder="输入你的代码..."></textarea>
            <div class="output-area">
              <div class="output-header">输出结果</div>
              <div class="output-content">
                <pre>{{ codeOutput }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 选项卡
const tabs = [
  { id: 'vue', label: 'Vue 响应式' },
  { id: 'js', label: 'JavaScript' },
  { id: 'css', label: 'CSS 动画' },
  { id: 'editor', label: '代码编辑器' },
];
const activeTab = ref('vue');

// Vue 响应式示例
const count = ref(0);
const message = ref('Hello Vue 3!');
const user = ref({
  name: '开发者',
  age: 25,
});

const increment = () => count.value++;
const decrement = () => count.value--;
const resetMessage = () => (message.value = 'Hello Vue 3!');
const resetUser = () => {
  user.value = { name: '开发者', age: 25 };
};

// JavaScript 异步示例
const asyncStatus = ref('idle');
const asyncResult = ref('');
const asyncTime = ref(0);
const isLoading = ref(false);

const asyncStatusText = computed(() => {
  switch (asyncStatus.value) {
    case 'idle':
      return '等待开始';
    case 'pending':
      return '处理中...';
    case 'success':
      return '成功';
    case 'error':
      return '失败';
    default:
      return '未知';
  }
});

const startAsync = async () => {
  asyncStatus.value = 'pending';
  isLoading.value = true;
  asyncResult.value = '';
  const startTime = Date.now();

  try {
    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const random = Math.random();
    if (random > 0.2) {
      asyncResult.value = `操作成功！随机数: ${random.toFixed(3)}`;
      asyncStatus.value = 'success';
    } else {
      throw new Error('模拟失败');
    }
  } catch (error) {
    asyncResult.value = '操作失败，请重试';
    asyncStatus.value = 'error';
  } finally {
    isLoading.value = false;
    asyncTime.value = Date.now() - startTime;
  }
};

const resetAsync = () => {
  asyncStatus.value = 'idle';
  asyncResult.value = '';
  asyncTime.value = 0;
};

// CSS 动画示例
const animationClass = ref('');
const isAnimating = ref(false);

const animationText = computed(() => {
  if (!animationClass.value) return '点击开始动画';
  return isAnimating.value ? '动画进行中...' : '点击开始动画';
});

const setAnimation = (type: string) => {
  animationClass.value = type;
  isAnimating.value = false;
};

const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value;
};

// 代码编辑器
const userCode = ref(`// 在这里编写你的 JavaScript 代码
console.log('Hello, Practice Demo!');

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 计算斐波那契数列第 10 项
const result = fibonacci(10);
console.log('斐波那契数列第 10 项:', result);

// 返回结果
result;`);
const codeOutput = ref('');

const runCode = () => {
  try {
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(
        args
          .map((arg) =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
          )
          .join(' '),
      );
    };

    const result = eval(userCode.value);

    console.log = originalLog;

    if (logs.length > 0) {
      codeOutput.value = logs.join('\n');
    } else if (result !== undefined) {
      codeOutput.value = String(result);
    } else {
      codeOutput.value = '代码执行完毕，无输出';
    }
  } catch (error) {
    codeOutput.value = `错误: ${error}`;
  }
};

// 示例代码
const vueExampleCode = `// Vue 响应式示例代码
// 这里显示 Vue 组件的基本结构`;

const jsExampleCode = `// JavaScript 异步编程示例
// 这里显示 Promise 和 async/await 的基本用法`;

const cssExampleCode = `/* CSS 动画示例代码
这里显示 CSS 关键帧动画的基本用法 */`;
</script>

<style lang="scss" scoped>
.practice {
  padding: 40px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: $content-bg;

  &-header {
    margin-bottom: 40px;
    h1 {
      font-size: 36px;
      color: #2c3e50;
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 18px;
      color: $text-dark;
    }
  }

  // 1. 选项卡
  .tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
    border-bottom: 2px solid #eee;
    padding-bottom: 4px;

    .tab {
      padding: 12px 24px;
      background: none;
      border: none;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      font-size: 16px;
      color: $text-dark;
      transition: $transition-base;

      &:hover {
        color: $primary-color;
        background: rgba($primary-color, 0.05);
      }

      &.active {
        color: $primary-color;
        font-weight: 600;
        background: $active-bg;
        border-bottom: 3px solid $primary-color;
      }
    }
  }

  // 2. 演示卡片
  .demo-section {
    margin-bottom: 48px;
    h2 {
      font-size: 24px;
      color: #2c3e50;
      margin-bottom: 24px;
    }

    .demo-card {
      background: white;
      border-radius: $border-radius-md;
      padding: 32px;
      box-shadow: $card-shadow;

      .demo-description {
        margin-bottom: 24px;
        p {
          color: #5d6d7e;
          font-size: 16px;
          line-height: 1.6;
        }
      }

      .demo-interactive {
        background: $bg-light;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
      }
    }
  }

  // 3. 状态标签 (Status)
  .status {
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 14px;

    &.idle {
      color: $color-idle;
      background: $bg-light;
    }
    &.pending {
      color: $color-pending;
      background: #fef9e7;
    }
    &.success {
      color: $color-success;
      background: #e8f8ef;
    }
    &.error {
      color: $color-error;
      background: #fdedec;
    }
  }

  .highlight {
    font-weight: 600;
    color: $primary-color;
    background: $active-bg;
    padding: 2px 8px;
    border-radius: 4px;
  }

  // 4. 表单与按钮
  .controls {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .input-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      .input {
        flex: 1;
        min-width: 200px;
        padding: 12px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.3s ease;
        &:focus {
          outline: none;
          border-color: $primary-color;
        }
      }
    }
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: $transition-base;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &.primary {
      background: $primary-gradient;
      color: white;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary-color, 0.4);
      }
    }
    &.secondary {
      background: #ecf0f1;
      color: #2c3e50;
      &:hover {
        background: #d5dbdb;
      }
    }
    &.outline {
      background: transparent;
      border: 2px solid $primary-color;
      color: $primary-color;
      &:hover {
        background: $active-bg;
      }
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
  }

  // 5. 动画演示区
  .animation-area {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    min-height: 200px;

    .animated-box {
      width: 120px;
      height: 120px;
      background: $primary-gradient;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: $transition-base;
      box-shadow: 0 4px 12px rgba($primary-color, 0.3);

      &:hover {
        transform: scale(1.05);
      }

      // 动画类名绑定
      &.bounce {
        animation: bounce 1s ease infinite;
      }
      &.rotate {
        animation: rotate 2s linear infinite;
      }
      &.scale {
        animation: scale 1.5s ease-in-out infinite;
      }
      &.color {
        animation: colorChange 3s linear infinite;
      }
    }
  }

  // 6. 代码编辑器区域
  .editor-area {
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid #e0e0e0;

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: $editor-header;
      color: white;
      font-weight: 600;
    }

    .code-editor {
      width: 100%;
      min-height: 300px;
      padding: 24px;
      border: none;
      background: $bg-dark;
      color: #ecf0f1;
      font-family: 'Monaco', 'Menlo', 'monospace';
      font-size: 14px;
      line-height: 1.6;
      outline: none;
      resize: vertical;
    }
  }

  .output-area {
    border-top: 2px solid #e0e0e0;
    .output-header {
      padding: 16px 24px;
      background: $bg-light;
      font-weight: 600;
      color: #2c3e50;
    }
    .output-content {
      padding: 24px;
      background: white;
      min-height: 100px;
      pre {
        margin: 0;
        font-family: 'monospace';
        color: #2c3e50;
        white-space: pre-wrap;
      }
    }
  }
}

// 7. Keyframes 保持在最外层
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes scale {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
@keyframes colorChange {
  0% {
    background: $primary-color;
  }
  50% {
    background: #4caf50;
  }
  100% {
    background: $primary-color;
  }
}
</style>
