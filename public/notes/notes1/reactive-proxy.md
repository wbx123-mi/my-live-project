# 响应式系统：Proxy 深度解析

## 1. 核心变革：从 defineProperty 到 Proxy

Vue 3 的响应式核心从 Vue 2 的 `Object.defineProperty` 彻底迁移到了 ES6 的 **`Proxy`**。

| 特性              | Vue 2 (defineProperty) | Vue 3 (Proxy)              |
| :---------------- | :--------------------- | :------------------------- |
| **监听粒度**      | 仅限属性（Property）   | 整个对象（Object）         |
| **新增/删除属性** | 不支持（需 `$set`）    | **原生支持**               |
| **数组监听**      | 需重写数组方法         | **原生支持索引和长度修改** |
| **初始化性能**    | 需递归遍历所有属性     | **按需监听（惰性）**       |

---

## 2. 惰性监听机制 (Lazy Tracking) 🌟

> **面试必杀技**：为什么 Vue 3 的初始化速度比 Vue 2 快？

### 核心逻辑

Vue 3 的 `reactive` 是**“被动”**的。当你创建一个深层嵌套的响应式对象时，Vue 并不会立即给每一层都加代理。

- **原理**：只有当你**访问（Get）**到对象的某个深层属性时，Vue 才会实时地将该子对象包装成 Proxy。
- **金句总结**：**“你不访问深层对象，我就不建立深层代理。”** 这种“走一步算一步”的策略极大地节省了初始化时的 CPU 和内存开销。

---

## 3. ref 与 reactive 的交互陷阱

### ① 自动脱壳 (Unwrapping)

当 `ref` 嵌套在 `reactive` 对象中时，访问它不需要 `.value`：

```javascript
const count = ref(0);
const state = reactive({ count });
console.log(state.count); // 输出 0 (自动解包)
```
