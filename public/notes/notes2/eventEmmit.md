# 发布订阅模式 (EventEmitter)

## 1. 模式定义

**发布订阅模式 (Publish-Subscribe Pattern)**：一种对象间的一对多依赖关系。当一个对象的状态发生改变时，所有订阅了该对象的“订阅者”都会得到通知。

**生活类比：** 微信公众号。你（订阅者）关注（on）了某个公众号，公众号发文（emit）时会推送到所有关注者，你也可以取消关注（off）。

---

## 2. 手写 EventEmitter 实现

```javascript
class EventEmitter {
  constructor() {
    // 亮点 1：Object.create(null) 防止原型链污染，创建一个纯净的对象
    this.events = Object.create(null);
    this.maxListeners = 10;
  }

  // 订阅事件
  on(eventName, listener) {
    if (!eventName || typeof listener !== 'function') {
      throw new Error('参数错误');
    }
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    // 亮点 2：最大监听数限制，防止内存泄漏风险
    if (this.events[eventName].length >= this.maxListeners) {
      console.warn(`警告: 事件 ${eventName} 的监听器超过限制`);
    }
    this.events[eventName].push(listener);
    return this; // 链式调用
  }

  // 发布事件
  emit(eventName, ...args) {
    const listeners = this.events[eventName];
    if (!listeners || listeners.length === 0) return false;

    // 亮点 3：使用解构赋值 [...listeners] 创建副本
    // 防止执行过程中有 listener 执行 off 操作修改原数组，导致索引错乱（即“数组快照”机制）
    const deepCopy = [...listeners];
    deepCopy.forEach((listener) => listener(...args));
    return true;
  }

  // 取消订阅
  off(eventName, listener) {
    const listeners = this.events[eventName];
    if (!listeners) return this;
    if (!listener) {
      this.events[eventName] = [];
    }
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    return this;
  }
  once(eventName, listener) {
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      listener(...args);
    };
    return this.on(eventName, wrapper);
  }
}
```
