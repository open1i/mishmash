import { useRef, useEffect } from 'react';
import './SyntheticEventDemo.css'

export default function SyntheticEventDemo() {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 原生事件监听器 - 捕获阶段
    parentRef.current?.addEventListener('click', () => {
      console.log('%c1. 原生事件: 父元素捕获阶段', 'color: blue');
    }, true);
    
    // 原生事件监听器 - 目标阶段
    childRef.current?.addEventListener('click', () => {
      console.log('%c2. 原生事件: 子元素目标阶段', 'color: blue');
    }, { once: true });
    
    // 原生事件监听器 - 冒泡阶段
    parentRef.current?.addEventListener('click', () => {
      console.log('%c3. 原生事件: 父元素冒泡阶段', 'color: blue');
    });
    
    document.addEventListener('click', () => {
      console.log('%c4. 原生事件: document冒泡阶段', 'color: blue');
    }, false);

    // 原生事件捕获阶段 - document级别
    document.addEventListener('click', () => {
      console.log('%c0. 原生事件: document捕获阶段', 'color: blue');
    }, true);
  }, []);

  // React合成事件处理函数 - 捕获阶段
  const handleParentCapture = (e: React.MouseEvent) => {
    console.log('%c5. React合成事件: 父元素捕获阶段', 'color: green');
  };

  const handleChildClick = (e: React.MouseEvent) => {
    console.log('%c6. React合成事件: 子元素目标阶段', 'color: green');
    // e.stopPropagation(); // 测试阻止冒泡
  };

  // React合成事件处理函数 - 冒泡阶段
  const handleParentClick = (e: React.MouseEvent) => {
    console.log('%c7. React合成事件: 父元素冒泡阶段', 'color: green');
  };

  return (
    <div className="event-demo-container">
      <h2>React合成事件演示</h2>
      <div 
        ref={parentRef} 
        onClick={handleParentClick}
        onClickCapture={handleParentCapture}
        className="parent-box"
      >
        <div 
          ref={childRef} 
          onClick={handleChildClick}
          className="child-box"
        >
          点击我查看控制台输出
        </div>
      </div>
      <p>注意查看控制台的事件触发顺序</p>
      <div className="event-phase-explain">
        <h4>事件阶段说明：</h4>
        <ol>
          <li style={{color: 'blue'}}>蓝色日志：原生事件流</li>
          <li style={{color: 'green'}}>绿色日志：React合成事件流</li>
          <li>完整执行顺序：0 → 1 → 2 → 3 → 4 → 5 → 6 → 7</li>
          <li>React事件总是在原生事件完成后才触发</li>
          <li>React事件流独立于原生事件流</li>
        </ol>
      </div>
    </div>
  );
}