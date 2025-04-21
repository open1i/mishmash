// 模拟React的事件委托系统
const ReactEventSystem = {
  // 事件池，用于复用事件对象
  eventPool: [],
  
  // 获取或创建事件对象
  getEvent: function(nativeEvent) {
    if (this.eventPool.length) {
      const event = this.eventPool.pop();
      event.nativeEvent = nativeEvent;
      return event;
    }
    return {
      nativeEvent: nativeEvent,
      type: nativeEvent.type,
      target: nativeEvent.target,
      currentTarget: null,
      // 其他合成事件属性...
    };
  },
  
  // 释放事件对象回池
  releaseEvent: function(event) {
    event.nativeEvent = null;
    event.currentTarget = null;
    this.eventPool.push(event);
  },
  
  // 事件委托到document
  delegate: function(eventType) {
    document.addEventListener(eventType, (nativeEvent) => {
      // 1. 获取合成事件对象
      const syntheticEvent = this.getEvent(nativeEvent);
      
      // 2. 模拟事件冒泡路径
      let currentTarget = nativeEvent.target;
      while (currentTarget) {
        // 3. 检查是否有React组件的事件处理函数
        if (currentTarget.__reactHandlers && 
            currentTarget.__reactHandlers[eventType]) {
          syntheticEvent.currentTarget = currentTarget;
          
          // 4. 执行事件处理函数
          currentTarget.__reactHandlers[eventType](syntheticEvent);
          
          // 5. 如果阻止冒泡，则停止向上传播
          if (syntheticEvent.isPropagationStopped()) {
            break;
          }
        }
        currentTarget = currentTarget.parentNode;
      }
      
      // 6. 释放事件对象
      this.releaseEvent(syntheticEvent);
    });
  },
  
  // 初始化常用事件
  init: function() {
    ['click', 'change', 'keydown', 'keyup', 'mouseover'].forEach(eventType => {
      this.delegate(eventType);
    });
  }
};

// 初始化事件系统
ReactEventSystem.init();

// 模拟React组件的事件绑定
function simulateReactComponent(element, eventType, handler) {
  if (!element.__reactHandlers) {
    element.__reactHandlers = {};
  }
  element.__reactHandlers[eventType] = handler;
}

// 示例使用
const button = document.createElement('button');
button.textContent = 'Click me';
document.body.appendChild(button);

// 模拟React的事件绑定方式
simulateReactComponent(button, 'click', (e) => {
  console.log('React合成事件触发', e);
  e.preventDefault(); // 阻止默认行为
  e.stopPropagation(); // 阻止冒泡
});