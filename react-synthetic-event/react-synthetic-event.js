/**
 * 合成事件类，包装原生事件提供统一接口
 */
class SyntheticEvent {
  /**
   * 构造函数，初始化合成事件
   * @param {Event} nativeEvent - 原生事件对象 
   */
  constructor(nativeEvent) {
    // 保存原生事件引用
    this.nativeEvent = nativeEvent;
    
    // 统一事件目标属性 (兼容IE)
    this.target = nativeEvent.target || nativeEvent.srcElement;
    // 事件类型
    this.type = nativeEvent.type;
    // 当前处理事件的DOM节点
    this.currentTarget = null;
    
    // 统一键盘事件属性
    if (this.type.includes('key')) {
      this.key = nativeEvent.key || String.fromCharCode(nativeEvent.keyCode);
      this.keyCode = nativeEvent.keyCode || nativeEvent.which;
    }
    
    // 统一鼠标事件属性
    if (this.type.includes('mouse')) {
      this.clientX = nativeEvent.clientX;
      this.clientY = nativeEvent.clientY;
      // 处理IE的鼠标按钮标识差异
      this.button = nativeEvent.button;
      if (navigator.userAgent.indexOf('MSIE') > -1) {
        this.button = { 0:1, 1:4, 2:2 }[nativeEvent.button] || 0;
      }
    }
    
    // 事件传播控制标志
    this._stopPropagation = false;
    // 默认行为阻止标志
    this.defaultPrevented = false;
  }

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    this._stopPropagation = true;
    // 兼容IE
    if (this.nativeEvent.stopPropagation) {
      this.nativeEvent.stopPropagation();
    } else {
      this.nativeEvent.cancelBubble = true;
    }
  }

  /**
   * 阻止默认行为
   */
  preventDefault() {
    this.defaultPrevented = true;
    // 兼容IE
    if (this.nativeEvent.preventDefault) {
      this.nativeEvent.preventDefault();
    } else {
      this.nativeEvent.returnValue = false;
    }
  }

  /**
   * 检查是否已阻止事件冒泡
   * @returns {boolean}
   */
  isPropagationStopped() {
    return this._stopPropagation;
  }
}

/**
 * React事件系统实现
 */
const ReactEventSystem = (function() {
  // 事件对象池，用于复用事件对象
  const eventPool = [];
  // 使用WeakMap存储元素的事件处理器，防止内存泄漏
  const elementEventHandlers = new WeakMap();
  
  // 事件类型映射表 (兼容不同浏览器的事件名)
  const eventTypeMap = {
    mouseenter: 'mouseover',  // 将mouseenter映射为mouseover
    mouseleave: 'mouseout'    // 将mouseleave映射为mouseout
  };

  /**
   * 从池中获取或创建事件对象
   * @param {Event} nativeEvent - 原生事件
   * @returns {SyntheticEvent}
   */
  function getEvent(nativeEvent) {
    // 优先从池中获取
    if (eventPool.length) {
      const event = eventPool.pop();
      event.nativeEvent = nativeEvent;
      return event;
    }
    // 池为空则创建新事件
    return new SyntheticEvent(nativeEvent);
  }

  /**
   * 释放事件对象回池
   * @param {SyntheticEvent} event 
   */
  function releaseEvent(event) {
    // 清除所有可能的内存引用
    for (let prop in event) {
      if (event.hasOwnProperty(prop) && prop !== 'nativeEvent') {
        event[prop] = null;
      }
    }
    // 回收事件对象
    eventPool.push(event);
  }

  /**
   * 事件委托函数
   * @param {string} eventType - 事件类型
   */
  function delegate(eventType) {
    // 获取映射后的事件类型
    const mappedType = eventTypeMap[eventType] || eventType;
    
    // 兼容IE的事件绑定
    if (document.attachEvent && !document.addEventListener) {
      // IE使用attachEvent
      document.attachEvent('on' + mappedType, function(nativeEvent) {
        handleEvent(nativeEvent, eventType);
      });
    } else {
      // 标准浏览器使用addEventListener
      document.addEventListener(mappedType, function(nativeEvent) {
        handleEvent(nativeEvent, eventType);
      }, false); // 默认冒泡阶段处理
    }
  }

  /**
   * 事件处理函数
   * @param {Event} nativeEvent - 原生事件
   * @param {string} eventType - 事件类型
   */
  function handleEvent(nativeEvent, eventType) {
    // 获取合成事件对象
    const syntheticEvent = getEvent(nativeEvent);
    // 从事件目标开始向上遍历
    let currentTarget = nativeEvent.target || nativeEvent.srcElement;
    
    // 模拟事件冒泡过程
    while (currentTarget) {
      // 获取当前元素的事件处理器
      const handlers = elementEventHandlers.get(currentTarget);
      if (handlers && handlers[eventType]) {
        // 设置当前处理的目标元素
        syntheticEvent.currentTarget = currentTarget;
        // 执行事件处理函数
        handlers[eventType](syntheticEvent);
        
        // 检查是否阻止冒泡
        if (syntheticEvent.isPropagationStopped()) {
          break;
        }
      }
      // 向上遍历父节点
      currentTarget = currentTarget.parentNode;
    }
    
    // 释放事件对象
    releaseEvent(syntheticEvent);
  }

  // 暴露公共API
  return {
    /**
     * 初始化事件系统
     */
    init() {
      // 注册基础事件委托
      ['click', 'change', 'keydown', 'mouseenter', 'mouseleave'].forEach(eventType => {
        delegate(eventType);
      });
    },
    
    /**
     * 绑定事件处理函数
     * @param {Element} element - DOM元素
     * @param {string} eventType - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    on(element, eventType, handler) {
      // 获取或创建元素的事件处理器映射
      const handlers = elementEventHandlers.get(element) || {};
      // 添加事件处理器
      handlers[eventType] = handler;
      // 保存回WeakMap
      elementEventHandlers.set(element, handlers);
    }
  };
})();

// 初始化事件系统
ReactEventSystem.init();