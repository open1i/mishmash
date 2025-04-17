// 数据
let count = 0;

// 事件, 通过事件驱动数据更新
window.addEventListener(
  "click",
  () => {
    count++;
    // 当数据变化,将render重新调用
    render();
  },
  false
);

// 视图, 通过视图渲染数据 将新数据渲染到页面中
const render = () => {
  document.body.innerHTML = count;
};

render(); // 初始渲染

/**
 * 这样写的问题在于,会发生耦合 事件的代码和渲染的代码耦合
 */
