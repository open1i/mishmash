# React 合成事件模拟实现

## 核心特点

### 1. 事件委托机制
- 所有事件统一委托到document处理
- 避免直接绑定大量事件监听器，提升性能
```
function delegate(eventType) {
  document.addEventListener(mappedType, function(nativeEvent) {
    handleEvent(nativeEvent, eventType);
  }, false);
}
```

### 2. 浏览器差异抹平
- 统一事件目标属性 (`target` vs `srcElement`)
- 统一阻止冒泡方法 (`stopPropagation` vs `cancelBubble`)
- 统一阻止默认行为 (`preventDefault` vs `returnValue`)
- 标准化鼠标/键盘事件属性
```
// 统一事件目标属性
this.target = nativeEvent.target || nativeEvent.srcElement;

// 统一阻止冒泡方法
if (this.nativeEvent.stopPropagation) {
  this.nativeEvent.stopPropagation();
} else {
  this.nativeEvent.cancelBubble = true;
}
```

### 3. 事件对象池化
- 复用事件对象减少内存分配
- 通过`eventPool`管理事件对象生命周期
- 使用后清除引用防止内存泄漏
```
const eventPool = [];
function getEvent() {
  if (eventPool.length) return eventPool.pop();
  return new SyntheticEvent();
}
function releaseEvent(event) {
  eventPool.push(event);
}
```
### 4. 合成事件对象
- 包装原生事件提供统一API
- 提供标准方法：
    stopPropagation()
    preventDefault()
    isPropagationStopped()
```
const eventPool = [];
function getEvent() {
  if (eventPool.length) return eventPool.pop();
  return new SyntheticEvent();
}
function releaseEvent(event) {
  eventPool.push(event);
}
```