# v-model 的本质与进化

在 Vue 中，`v-model` 是一个**语法糖**。它背后的实现逻辑在 Vue 2 和 Vue 3 之间发生了重大的断代式演变。

---

## 1. Vue 3 的 v-model 本质 (重点)

在 Vue 3 中，`v-model` 默认等价于 **绑定一个名为 `modelValue` 的 prop** 和 **触发一个名为 `update:modelValue` 的事件**。

### 语法糖展开

```vue
<CustomComponent v-model="searchText" />

<CustomComponent
  :modelValue="searchText"
  @update:modelValue="(newValue) => (searchText = newValue)" />
```

## 2. Vue 2 vs Vue 3 核心区别

| 特性               | Vue 2                     | Vue 3                           |
| :----------------- | :------------------------ | :------------------------------ |
| **默认 Prop 名称** | `value`                   | `modelValue`                    |
| **默认 事件名称**  | `input`                   | `update:modelValue`             |
| **多绑定支持**     | 不支持（需改用 .sync）    | **原生支持多个 v-model**        |
| **自定义参数**     | 需在组件内配置 model 选项 | **直接通过 v-model:title 指定** |

---

### 💡 核心差异点速记：

1. **打破唯一性**：Vue 2 一个组件只能有一个 `v-model`，Vue 3 可以有无数个。
2. **命名标准化**：Vue 3 统一使用 `update:` 前缀，语义化更强（告诉开发者这就是在更新某个属性）。
3. **API 瘦身**：因为 `v-model` 能传参数了，所以功能重复的 `.sync` 直接被干掉了。

4. 为什么 Vue 3 废弃了 .sync 修饰符？
   背景：在 Vue 2 中，v-model 只能绑定一个值。如果需要实现多个属性的双向绑定（例如弹窗的 visible 和 title），必须使用另一个语法糖 :title.sync="title"。

## Vue 3 的改进： Vue 3 统一了双向绑定的逻辑。现在所有的双向绑定都统称为 v-model。

多绑定示例：

代码段

<UserProfile 
  v-model:first-name="first" 
  v-model:last-name="last" 
/>
面试话术：“Vue 3 通过将 v-model 参数化，精简了 API 复杂度，消除了功能重叠，使代码逻辑更加统一且直观。”

## 4. 高级进阶：自定义修饰符

Vue 3 允许你给 v-model 添加自定义修饰符（如 v-model.capitalize）。

实现原理：子组件会接收到一个特殊的 prop，名为 modelModifiers。

逻辑：子组件通过判断这个对象里的布尔值，在 emit 之前对数据进行加工（如首字母大写）。

## 5. 内部原理流转图

代码段

sequenceDiagram
participant P as 父组件 (Parent)
participant C as 子组件 (Child)

    Note over P,C: 1. 初始化传递数据
    P->>C: :modelValue="data"

    Note over C: 2. 用户操作触发更新
    C->>P: $emit('update:modelValue', newValue)

    Note over P: 3. 父组件修改源数据
    P->>P: data = newValue

    Note over P,C: 4. 响应式触发重新渲染
    P->>C: :modelValue="newData"

## 6. 现代开发建议：defineModel (Vue 3.4+)

如果你使用的是 Vue 3.4 及以上版本，强烈推荐使用 defineModel() 宏，它极大简化了子组件的代码：

代码段

```vue
<script setup>
// 直接像普通 ref 一样使用，底层自动处理 props 和 emits
const model = defineModel();
</script>

<template>
  <input v-model="model" />
</template>
```

## 💡 面试高频：v-model 是真正的双向绑定吗？

::: info 核心定性
**结论**：宏观表象上是“双向”，底层实现上是“单向”。
:::

### 1. 宏观表象：是双向的

从开发者的直观感受来看，无论是 `input` 还是自定义组件，数据确实在“自动”同步：

- **数据驱动视图**：改变脚本中的变量，输入框内容随之改变。
- **视图驱动数据**：操作输入框，脚本中的变量同步更新。

---

### 2. 底层实现：不是 (重点) 🌟

在 Vue 的设计哲学里，`v-model` 始终是一个 **单向数据流的语法糖**。

- **原生 HTML 元素（如 `<input>`）**：
  由编译器根据类型自动转化，本质是：`:value` (属性绑定) + `@input` (事件监听)。
- **自定义组件**：
  本质是：`:modelValue` (**Props Down**) + `@update:modelValue` (**Events Up**) 的缩写。

---

### 3. 为什么 Vue 不采用 Angular 的“真·双向绑定”？

如果像早期 Angular 那样实现双向数据追踪（Data Tracking），会带来以下痛点：

| 痛点             | 说明                                                                     |
| :--------------- | :----------------------------------------------------------------------- |
| **数据流向混乱** | 一个变量被多个子组件绑定时，其中一个修改，全线变动，难以追踪“谁是凶手”。 |
| **性能损耗**     | 需要大量的脏检查（Dirty Checking）或深度监听，维护开销极大。             |

#### ✅ Vue 的策略：逻辑闭环

Vue 通过 **“单向数据流 + 事件反馈”** 完美平衡了开发体验与系统稳定性：

- **流向清晰**：数据只有唯一的源头（父组件），拥有“最终修改权”。
- **调试友好**：父组件可以拦截、验证甚至拒绝子组件传回的新值。

---

### 📝 面试高分话术（背诵版）

> “在 Vue 中，`v-model` 仅仅是在**视图层面上**模拟了双向绑定。它的核心依然严格遵守**单向数据流**：父组件通过 Props 传递状态，子组件通过 Emit 请求修改。这种‘看似双向、实则单向’的设计，既保证了开发的便捷性，又确保了数据流向的可追溯性和系统的可维护性。”
