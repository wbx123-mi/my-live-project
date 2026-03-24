# ✍️ 手写响应式系统：Reactive 核心实现

> **核心原理**：利用 ES6 **Proxy** 进行对象劫持，结合 **WeakMap/Map/Set** 构建依赖账本，实现“读取即收集，修改即触发”。

---

## 1. 响应式系统全景图

---

## 2. 核心代码实现

```javascript
/**
 * 第一步：定义全局“依赖账本” targetMap
 * 结构：WeakMap { target -> Map { key -> Set [effect1, effect2] } }
 */
const targetMap = new WeakMap();
let activeEffect = null; // 临时存储当前正在执行的副作用函数

/**
 * 第二步：track (依赖收集)
 * 当读取响应式对象的属性时，将当前的 activeEffect 存入账本
 */
function track(target, key) {
  if (!activeEffect) return; // 如果当前没有 effect 在运行，则不收集

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // 第一层：使用 WeakMap 存储对象，利于垃圾回收
    targetMap.set(target, (depsMap = new Map()));
  }

  let dep = depsMap.get(key);
  if (!dep) {
    // 第二层：使用 Map 存储属性名 key
    depsMap.set(key, (dep = new Set()));
  }

  // 第三层：使用 Set 存储对应的副作用函数，避免重复收集
  dep.add(activeEffect);
}

/**
 * 第三步：trigger (触发更新)
 * 当修改响应式对象的属性时，从账本中找出对应的 effect 列表并执行
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (dep) {
    // 挨个执行账本中登记的函数
    dep.forEach((effect) => effect());
  }
}

/**
 * 第四步：reactive (核心代理)
 * 将普通对象转化为 Proxy 代理对象
 */
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      // 使用 Reflect 确保上下文正确
      const res = Reflect.get(target, key, receiver);

      // 【关键】读取时，去账本登记 (依赖收集)
      track(target, key);
      return res;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);

      // 【关键】修改时，去账本叫人执行 (派发更新)
      trigger(target, key);
      return result;
    },
  });
}
```

### 🚀 存储结构实例模拟

当执行 `user.name` 和 `user.age` 的依赖收集后，`targetMap` 内部逻辑如下：

```javascript
// targetMap (WeakMap)
{
  { name: 'Gemini', age: 18 }: { // Key: 原始对象
    "name": Set([ effect1, effect3 ]), // Key: 属性名 -> Value: 订阅者集合
    "age":  Set([ effect2, effect3 ])  // Key: 属性名 -> Value: 订阅者集合
  }
}
```

## 核心原理深度解析

### 1. 为什么选择 WeakMap？

在全局账本 `targetMap` 中，我们使用 **WeakMap** 而不是普通的 Map，这是出于**内存管理**的考量：

- **弱引用特性**：`WeakMap` 的键（target 对象）是弱引用的。
- **防止内存泄漏**：如果被代理的对象 `target` 在外部被销毁（例如组件卸载，对象置为 `null`），`WeakMap` 不会阻止垃圾回收机制回收该对象。
- **自动清理**：一旦对象被回收，它在 `targetMap` 中对应的键值对也会自动消失，无需手动清理。

---

### 2. 依赖账本的存储结构

Vue 3 的响应式追踪是一个三层嵌套的结构，被称为“依赖树”：

1.  **WeakMap (target)**：第一层，通过对象本身来区分不同的响应式对象。
2.  **Map (key)**：第二层，通过属性名 `key` 来区分同一个对象下的不同属性。
3.  **Set (effects)**：第三层，存储该属性关联的所有副作用函数（如组件渲染 `render`、`watch` 或 `computed`）。使用 `Set` 是为了自动去重，防止同一个 effect 被多次收集。

---

### 3. 响应式闭环流程

一个完整的响应式生命周期遵循以下四个步骤：

| 阶段          | 动作               | 技术细节                                                                                                   |
| :------------ | :----------------- | :--------------------------------------------------------------------------------------------------------- |
| **1. Define** | 定义响应式         | 通过 `reactive()` 函数，利用 `new Proxy` 包装原始对象。                                                    |
| **2. Effect** | 准备副作用         | 运行 `effect` 函数，将当前函数赋值给全局变量 `activeEffect` 并开始读取属性。                               |
| **3. Get**    | 依赖收集 (Track)   | 读取属性触发 Proxy 的 `get` 拦截 -> 执行 `track()` -> 将 `activeEffect` 存入 `targetMap`。                 |
| **4. Set**    | 派发更新 (Trigger) | 修改属性触发 Proxy 的 `set` 拦截 -> 执行 `trigger()` -> 从 `targetMap` 取出该属性对应的 `Set` 并挨个执行。 |

---

## 💡 面试加分项：Reflect 的不可替代性

**问：手写响应式时，直接 `target[key]` 不就行了吗，为什么要用 `Reflect.get`？**

**答**：主要原因是为了**处理对象继承时的 `this` 指向问题**。

- **场景**：如果原始对象中定义了 `getter`，且该 `getter` 内部使用了 `this`。
- **问题**：直接使用 `target[key]` 读取时，`this` 会指向**原始对象**，导致丢失响应式劫持。
- **解决**：使用 `Reflect.get(target, key, receiver)`，其中的 `receiver` 参数会将 `this` 锁定在 **Proxy 代理对象**上。

> **结论**：`Reflect` 与 `Proxy` 配对使用是现代 JS 代理模式的标准实践，它确保了代码在复杂继承关系下的健壮性，避免了直接操作原对象可能引发的上下文异常。
