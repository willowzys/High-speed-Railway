// 简单的事件总线实现，用于组件间通信
import { ref } from 'vue'

// 创建一个事件总线实例
const eventBus = {
  events: new Map(),
  
  // 发送事件
  emit(event, ...args) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => callback(...args))
    }
  },
  
  // 监听事件
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
    
    // 返回取消监听的函数
    return () => {
      const callbacks = this.events.get(event)
      const index = callbacks.indexOf(callback)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  },
  
  // 移除事件监听
  off(event, callback) {
    if (this.events.has(event)) {
      if (callback) {
        const callbacks = this.events.get(event)
        const index = callbacks.indexOf(callback)
        if (index !== -1) {
          callbacks.splice(index, 1)
        }
      } else {
        this.events.delete(event)
      }
    }
  }
}

// 创建一个钩子函数以便在组件中使用
export function useEventBus() {
  return {
    emit: eventBus.emit.bind(eventBus),
    on: eventBus.on.bind(eventBus),
    off: eventBus.off.bind(eventBus)
  }
}
