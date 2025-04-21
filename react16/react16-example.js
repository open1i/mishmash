// 使用React Hooks的函数式组件
function App() {
  // 使用useRef创建ref
  const parentRef = React.useRef(null);
  const childRef = React.useRef(null);

  // React合成事件 - 捕获阶段
  const handleParentCapture = () => {
    console.log("%cReact捕获阶段: 父元素", "color: #2196F3; font-weight: bold"); // 蓝色
  };

  // React合成事件 - 目标阶段
  const handleChildClick = () => {
    console.log("%cReact目标阶段: 子元素", "color: #2196F3; font-weight: bold"); // 蓝色
  };

  // React合成事件 - 冒泡阶段
  const handleParentClick = () => {
    console.log("%cReact冒泡阶段: 父元素", "color: #2196F3; font-weight: bold"); // 蓝色
  };

  React.useEffect(() => {
    const root = document.querySelector("#root");
    root.addEventListener("click", () => {
      console.log("%c原生root冒泡", "color: #FF5722"); // 橙色
    });
    root.addEventListener(
      "click",
      () => {
        console.log("%c原生root捕获", "color: #FF5722"); // 橙色
      },
      true
    );

    // 原生事件 - 捕获阶段
    parentRef.current.addEventListener(
      "click",
      () => {
        console.log("%c原生捕获阶段: 父元素", "color: #FF5722"); // 橙色
      },
      true
    );

    // 原生事件 - 目标阶段
    childRef.current.addEventListener("click", () => {
      console.log("%c原生目标阶段: 子元素", "color: #FF5722"); // 橙色
    });

    // 原生事件 - 冒泡阶段
    parentRef.current.addEventListener("click", () => {
      console.log("%c原生冒泡阶段: 父元素", "color: #FF5722"); // 橙色
    });

    // document级别原生事件
    document.addEventListener(
      "click",
      () => {
        console.log("%c原生document捕获阶段", "color: #FF5722"); // 橙色
      },
      true
    );

    document.addEventListener("click", () => {
      console.log("%c原生document冒泡阶段", "color: #FF5722"); // 橙色
    });

    // 清理函数
    return () => {
      parentRef.current.removeEventListener("click", () => {});
      childRef.current.removeEventListener("click", () => {});
      document.removeEventListener("click", () => {});
    };
  }, []);

  return (
    <div
      ref={parentRef}
      onClick={handleParentClick}
      onClickCapture={handleParentCapture}
    >
      <div
        ref={childRef}
        onClick={handleChildClick}
        style={{ padding: "20px", background: "#f0f0f0" }}
      >
        点击我查看事件流阶段
      </div>
    </div>
  );
}

// 渲染到DOM
ReactDOM.render(<App />, document.getElementById("root"));
