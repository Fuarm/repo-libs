/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/createElement.js":
/*!******************************!*\
  !*** ./src/createElement.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createElement\": () => (/* binding */ createElement),\n/* harmony export */   \"createTextElement\": () => (/* binding */ createTextElement)\n/* harmony export */ });\n/**\n * 创建文本节点\n * @param text\n * @returns {{type: string, props: {nodeValue, children: *[]}}}\n */\nfunction createTextElement(text) {\n  return {\n    type: 'TEXT_ELEMENT',\n    props: {\n      nodeValue: text,\n      children: []\n    }\n  };\n}\n/**\n * 创建元素\n * @param type\n * @param props\n * @param children\n * @returns {{children: (*|{type: string, props: {nodeValue, children: *[]}})[], type, props: {}}}\n */\n\n\nfunction createElement(type, props) {\n  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {\n    children[_key - 2] = arguments[_key];\n  }\n\n  return {\n    type,\n    props: { ...props,\n      children: children.map(child => typeof child === 'object' ? child : createTextElement(child))\n    }\n  };\n}\n\n\n\n//# sourceURL=webpack://@g/mini-react/./src/createElement.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createElement */ \"./src/createElement.js\");\n/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ \"./src/render.js\");\n\n\nwindow.React = {\n  createElement: _createElement__WEBPACK_IMPORTED_MODULE_0__.createElement,\n  render: _render__WEBPACK_IMPORTED_MODULE_1__.render,\n  useState: _render__WEBPACK_IMPORTED_MODULE_1__.useState\n};\n\nfunction App(props) {\n  const [state, setState] = (0,_render__WEBPACK_IMPORTED_MODULE_1__.useState)(1);\n  return /*#__PURE__*/React.createElement(\"h1\", {\n    onClick: () => setState(c => ++c)\n  }, \"Hi \", props.name, \", Count: \", state);\n}\n\nconst element = /*#__PURE__*/React.createElement(App, {\n  name: \"\\u865A\\u62DF\\u5B87\\u5B99\"\n});\nconst container = document.getElementById('root');\n(0,_render__WEBPACK_IMPORTED_MODULE_1__.render)(element, container); // const container = document.getElementById('root');\n// const updateValue = (e) => {\n//   rerender(e.target.value);\n// };\n//\n// const rerender = (value) => {\n//   const element = (\n//     <div>\n//       <input onInput={updateValue} value={value} />\n//       <h2>Hello {value}</h2>\n//     </div>\n//   );\n//   render(element, container);\n// };\n//\n// rerender('World');\n\n//# sourceURL=webpack://@g/mini-react/./src/index.js?");

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render),\n/* harmony export */   \"useState\": () => (/* binding */ useState)\n/* harmony export */ });\n/**\n * 全局变量\n */\n// 下一个工作单元\nlet nextUnitOfWork = null; // react 双缓存 跟踪当前渲染的节点\n// hooks 数据结构 栈\n\nlet wipFiber = null; // 当前的工作单元\n\nlet wipRoot = null; // 当前渲染树 最后准备提交的渲染树\n\nlet currentRoot = null; // 准备删除的节点树\n\nlet deletions = null;\n\nfunction createDom(fiber) {\n  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);\n  updateDom(dom, {}, fiber.props);\n  return dom;\n}\n\nconst isProperty = key => key !== 'children'; //判断是否是新属性\n\n\nconst isNew = (prev, next) => key => prev[key] !== next[key]; // 是否是旧属性\n\n\nconst isGone = (prev, next) => key => !(key in next);\n\nconst isEvent = key => key.startsWith('on');\n\nfunction updateDom(dom, prevProps, nextProps) {\n  // 删除旧属性\n  Object.keys(prevProps).filter(isProperty).filter(isGone(prevProps, nextProps)).forEach(name => dom[name] = ''); // 更新新属性\n\n  Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach(name => dom[name] = nextProps[name]); // 删除旧的或者有变化的事件\n\n  Object.keys(prevProps).filter(isEvent).filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key)).forEach(name => {\n    const eventType = name.toLowerCase().substring(2);\n    dom.removeEventListener(eventType, prevProps[name]);\n  }); // 注册新事件\n\n  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(name => {\n    const eventType = name.toLowerCase().substring(2);\n    dom.addEventListener(eventType, nextProps[name]);\n  });\n}\n/**\n * 删除Dom\n * 无论删除还是挂载都需要找到Dom\n * @param fiber\n * @param domParent\n */\n\n\nfunction commitDeletion(fiber, domParent) {\n  if (fiber.dom) {\n    domParent.removeChild(fiber.dom);\n  } else {\n    commitDeletion(fiber.child, domParent);\n  }\n}\n\nfunction commitRoot() {\n  deletions.forEach(commitWork);\n  commitWork(wipRoot.child); // 双缓存对应的渲染树\n\n  currentRoot = wipRoot;\n  wipRoot = null;\n}\n/**\n * 提交工作单元\n * @param fiber\n */\n\n\nfunction commitWork(fiber) {\n  if (!fiber) {\n    return;\n  } // 更新 dom\n\n\n  let domParentFiber = fiber.parent; // 如果fiber.parent 没有 dom节点，一直向上parent查找，直到找到 dom 节点\n\n  while (!domParentFiber.dom) {\n    domParentFiber = domParentFiber.parent;\n  }\n\n  const domParent = domParentFiber.dom;\n\n  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {\n    domParent.appendChild(fiber.dom);\n  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {\n    updateDom(fiber.dom, fiber.alternate.props, fiber.props);\n  } else if (fiber.effectTag === 'DELETION') {\n    commitDeletion(fiber, domParent);\n  }\n\n  commitWork(fiber.child);\n  commitWork(fiber.sibling);\n}\n/**\n * 渲染 render\n * @param element\n * @param container\n */\n\n\nfunction render(element, container) {\n  // 递归： render diff koa-compose async/await\n  // 1、蹦床函数 一定不爆栈 EC 拉平 while\n  // 2、尾调用优化\n  // 3、while 循环优化 V8 10000 for O(n)\n  // 4、遍历树 while 深度优先 广度优先\n  // const dom = element.type == 'TEXT_ELEMENT'\n  //   ? document.createTextNode('')\n  //   : document.createElement(element.type);\n  // const isProperty = key => key !== 'children';\n  // Object.keys(element.props)\n  //   .filter(isProperty)\n  //   .forEach((name) => {\n  //     dom[name] = element.props[name];\n  //   });\n  // element.props.children.forEach(child => render(child, dom));\n  // container.appendChild(dom);\n  // 阶段二\n  // 第一个工作单元\n  wipRoot = {\n    dom: container,\n    props: {\n      children: [element]\n    },\n    // 判断链表中正在工作的，切换\n    alternate: currentRoot\n  };\n  deletions = []; // 下一个fiber 节点（工作单元）的跟节点\n\n  nextUnitOfWork = wipRoot;\n}\n\nfunction workLoop(deadline) {\n  // 1、获取任务\n  // 2、执行任务\n  // 3、将任务放入队列\n  // 4、循环\n  // 5、循环结束\n  // 6、执行完成\n  // 判断是否应该停止循环\n  let shouldYield = false;\n\n  while (nextUnitOfWork && !shouldYield) {\n    nextUnitOfWork = performUnitOfWork(nextUnitOfWork); // 如果当前任务的截止时间到了 停止工作循环 执行更高优先级的任务\n\n    console.log(\"deadline🚗\", deadline.timeRemaining());\n    console.log(\"🌲\", nextUnitOfWork);\n    shouldYield = deadline.timeRemaining() < 1;\n  }\n\n  if (!nextUnitOfWork && wipRoot) {\n    // 提交阶段\n    commitRoot();\n  }\n\n  requestIdleCallback(workLoop);\n} // 告知浏览器调度\n\n\nrequestIdleCallback(workLoop);\n/**\n * 更新函数组件\n * @param fiber\n */\n\nfunction updateFunctionComponent(fiber) {\n  wipFiber = fiber;\n  const children = [fiber.type(fiber.props)];\n  wipFiber.hooks = [];\n  reconcileChildren(fiber, children);\n}\n/**\n * 更新普通节点\n * @param fiber\n */\n\n\nfunction updateHostComponent(fiber) {\n  // 第一回 渲染到页面中去\n  if (!fiber.dom) {\n    fiber.dom = createDom(fiber);\n  } // dom tree\n\n\n  const children = fiber.props.children; // 调和 dom diff tree\n\n  reconcileChildren(fiber, children);\n}\n/**\n * 承载下一个工作单元\n */\n\n\nfunction performUnitOfWork(fiber) {\n  // 判断当前节点是不是函数组件\n  const isFunctionComponent = fiber && fiber.type && fiber.type instanceof Function;\n\n  if (isFunctionComponent) {\n    updateFunctionComponent(fiber);\n  } else {\n    updateHostComponent(fiber);\n  }\n\n  if (fiber.child) {\n    return fiber.child;\n  }\n\n  let nextFiber = fiber;\n\n  while (nextFiber) {\n    if (nextFiber.sibling) {\n      return nextFiber.sibling;\n    }\n\n    nextFiber = nextFiber.parent;\n  }\n}\n/**\n * dom diff\n * 构建成双向链表\n * @param fiber\n * @param elements\n */\n\n\nfunction reconcileChildren(fiber, elements) {\n  let index = 0; // 变化之前的节点\n\n  let oldFiber = fiber.alternate && fiber.alternate.child;\n  let prevSibling = null; // 遍历 children\n\n  while (index < elements.length || oldFiber != null) {\n    // jsx --> fiber\n    const element = elements[index];\n    let newFiber = null;\n    const sameType = oldFiber && element && element.type === oldFiber.type; // 如果是同样的节点类型\n\n    if (sameType) {\n      newFiber = {\n        type: oldFiber.type,\n        props: element.props,\n        dom: oldFiber.dom,\n        parent: fiber,\n        alternate: oldFiber,\n        effectTag: 'UPDATE'\n      };\n    } // 如果节点类型不一致 新增节点\n\n\n    if (!sameType && element) {\n      newFiber = {\n        type: element.type,\n        props: element.props,\n        dom: null,\n        parent: fiber,\n        alternate: null,\n        effectTag: 'PLACEMENT'\n      };\n    } // 如果节点类型不一致 新节点不存在\n\n\n    if (!sameType && oldFiber) {\n      oldFiber.effectTag = 'DELETION';\n      deletions.push(oldFiber);\n    } // 如果存在 old 节点\n\n\n    if (oldFiber) {\n      oldFiber = oldFiber.sibling;\n    }\n\n    if (index === 0) {\n      fiber.child = newFiber;\n    } else if (element) {\n      // TODO: fiber sibling 怎么创建注入的\n      prevSibling.sibling = newFiber;\n    } // js 模拟指针移动?\n\n\n    prevSibling = newFiber;\n    index++;\n  }\n}\n/**\n * hook: useState\n * initial 初始参数\n * @param initial\n * @returns {(*|setState)[]}\n */\n\n\nfunction useState(initial) {\n  // 是否有旧的钩子， 旧钩子存储了上一次更新的 hook\n  const oldHook = wipFiber.alternate && wipFiber.alternate.hook; // 初始化钩子 钩子的状态是旧的钩子的状态或者初始状态\n\n  const hook = {\n    state: oldHook ? oldHook.state : initial,\n    queue: []\n  }; // 从旧的钩子队列中获取所有的动作 然后将他们一一应用到新的钩子的状态上\n\n  const actions = oldHook ? oldHook.queue : [];\n  actions.forEach(action => {\n    hook.state = action(hook.state);\n  }); // 设置钩子状态\n\n  const setState = action => {\n    hook.queue.push(action); // 更新渲染\n\n    wipRoot = {\n      dom: currentRoot.dom,\n      props: currentRoot.props,\n      alternate: currentRoot\n    };\n    nextUnitOfWork = wipRoot;\n    deletions = []; // hook.queue.push(state => state)\n    // scheduleWork(wipFiber)\n  }; // 把钩子添加至工作单元\n\n\n  wipFiber.hook = hook; // 返回钩子的状态和设置钩子的函数\n\n  return [hook.state, setState];\n}\n\n\n\n//# sourceURL=webpack://@g/mini-react/./src/render.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;