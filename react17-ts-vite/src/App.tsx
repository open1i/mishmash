// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import React from 'react';

// class App extends React.Component {
//     constructor(props) {
//         super(props);
//         this.parentRef = React.createRef();
//         this.childRef = React.createRef();

//         this.handleParentCapture = this.handleParentCapture.bind(this);
//         this.handleChildClick = this.handleChildClick.bind(this);
//         this.handleParentClick = this.handleParentClick.bind(this);
//     }

//     // React合成事件 - 捕获阶段
//     handleParentCapture() {
//         console.log('%cReact捕获阶段: 父元素', 'color: #4CAF50; font-weight: bold');
//     }

//     // React合成事件 - 目标阶段
//     handleChildClick() {
//         console.log('%cReact目标阶段: 子元素', 'color: #2196F3; font-weight: bold');
//     }

//     // React合成事件 - 冒泡阶段
//     handleParentClick() {
//         console.log('%cReact冒泡阶段: 父元素', 'color: #FF5722; font-weight: bold');
//     }

//     componentDidMount() {
//         // 原生事件 - 捕获阶段
//         this.parentRef.current?.addEventListener('click', () => {
//             console.log('%c原生捕获阶段: 父元素', 'color: #009688');
//         }, true);

//         // 原生事件 - 目标阶段
//         this.childRef.current?.addEventListener('click', () => {
//             console.log('%c原生目标阶段: 子元素', 'color: #3F51B5');
//         } );

//         // 原生事件 - 冒泡阶段
//         this.parentRef.current?.addEventListener('click', () => {
//             console.log('%c原生冒泡阶段: 父元素', 'color: #E91E63');
//         });

//         // document级别原生事件
//         document.addEventListener('click', () => {
//             console.log('%c原生document捕获阶段', 'color: #795548');
//         }, true);

//         document.addEventListener('click', () => {
//             console.log('%c原生document冒泡阶段', 'color: #607D8B');
//         });
//     }

//     render() {
//         return (
//             <div
//                 ref={this.parentRef}
//                 onClick={this.handleParentClick}
//                 onClickCapture={this.handleParentCapture}
//             >
//                 <div
//                     ref={this.childRef}
//                     onClick={this.handleChildClick}
//                     style={{ padding: '20px', background: '#f0f0f0' }}
//                 >
//                     点击我查看事件流阶段
//                 </div>
//             </div>
//         );
//     }
// }

//-------------------------------------------------------------------------------------------

import { useEffect, useRef } from "react";

function App() {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const root = document.querySelector("#root")!;
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
    parentRef.current?.addEventListener(
      "click",
      () => {
        console.log("%c原生捕获阶段: 父元素", "color: #FF5722"); // 橙色
      },
      true
    );

    // 原生事件 - 目标阶段
    childRef.current?.addEventListener("click", () => {
      console.log("%c原生冒泡阶段: 子元素", "color: #FF5722"); // 橙色
    });
    childRef.current?.addEventListener("click", () => {
      console.log("%c原生目标阶段: 子元素", "color: #FF5722"); // 橙色
    });

    // 原生事件 - 冒泡阶段
    parentRef.current?.addEventListener("click", () => {
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
      parentRef.current?.removeEventListener("click", () => {});
      childRef.current?.removeEventListener("click", () => {});
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

export default App;
// function App() {
//   useEffect(() => {
//     document.getElementById('box').addEventListener('click', () => {
//       console.log('原生 click');
//     });
//   }, []);

//   const handleClick = () => {
//     console.log('React 合成 click');
//   };

//   return <div id="box" onClick={handleClick}>click me</div>;
// }

// export default App;

//-------------------------------------------------------------------------------------------

// export default App;

// import React, { useEffect, useRef } from "react";

// function App() {
//   const outerRef = useRef();
//   const innerRef = useRef();

//   useEffect(() => {
//     // 原生事件绑定
//     outerRef.current.addEventListener("click", () => {
//       console.log("🔵 原生冒泡 outer");
//     });
//     outerRef.current.addEventListener(
//       "click",
//       () => {
//         console.log("🟡 原生捕获 outer");
//       },
//       true
//     );

//     innerRef.current.addEventListener("click", () => {
//       console.log("🔴 原生冒泡 inner");
//     });
//     // innerRef.current.addEventListener("click", () => {
//     //   console.log("🔴 原生目标阶段 inner");
//     // });
//     innerRef.current.addEventListener(
//       "click",
//       () => {
//         console.log("🟠 原生捕获 inner");
//       },
//       true
//     );
//   }, []);

//   const handleOuterClick = () => {
//     console.log("🟣 React 冒泡 outer");
//   };
//   const handleOuterClickCapture = () => {
//     console.log("🟢 React 捕获 outer");
//   };

//   const handleInnerClick = () => {
//     console.log("🟤 React 冒泡 inner");
//   };
//   const handleInnerClickCapture = () => {
//     console.log("⚪ React 捕获 inner");
//   };

//   return (
//     <div
//       ref={outerRef}
//       onClick={handleOuterClick}
//       onClickCapture={handleOuterClickCapture}
//     >
//       <div
//         ref={innerRef}
//         onClick={handleInnerClick}
//         onClickCapture={handleInnerClickCapture}
//       >
//         点我试试 inner
//       </div>
//     </div>
//   );
// }

// export default App;
