/**
 * 全局变量
 */
// 下一个工作单元
let nextUnitOfWork = null;
// react 双缓存 跟踪当前渲染的节点
// hooks 数据结构 栈
let wipFiber = null;
// 当前的工作单元
let wipRoot = null;
// 当前渲染树 最后准备提交的渲染树
let currentRoot = null;
// 准备删除的节点树
let deletions = null;

function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(fiber.type)
  updateDom(dom, {}, fiber.props)
  return dom
}

const isProperty = key => key !== 'children';

//判断是否是新属性
const isNew = (prev, next) => key => prev[key] !== next[key];
// 是否是旧属性
const isGone = (prev, next) => key => !(key in next)

const isEvent = key => key.startsWith('on')

function updateDom(dom, prevProps, nextProps) {
  // 删除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => dom[name] = '')
  // 更新新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => dom[name] = nextProps[name])
  // 删除旧的或者有变化的事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })
  // 注册新事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

/**
 * 删除Dom
 * 无论删除还是挂载都需要找到Dom
 * @param fiber
 * @param domParent
 */
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  // 双缓存对应的渲染树
  currentRoot = wipRoot
  wipRoot = null
}

/**
 * 提交工作单元
 * @param fiber
 */
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  // 更新 dom
  let domParentFiber = fiber.parent
  // 如果fiber.parent 没有 dom节点，一直向上parent查找，直到找到 dom 节点
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

/**
 * 渲染 render
 * @param element
 * @param container
 */
function render(element, container) {
  // 递归： render diff koa-compose async/await
  // 1、蹦床函数 一定不爆栈 EC 拉平 while
  // 2、尾调用优化
  // 3、while 循环优化 V8 10000 for O(n)
  // 4、遍历树 while 深度优先 广度优先
  // const dom = element.type == 'TEXT_ELEMENT'
  //   ? document.createTextNode('')
  //   : document.createElement(element.type);
  // const isProperty = key => key !== 'children';
  // Object.keys(element.props)
  //   .filter(isProperty)
  //   .forEach((name) => {
  //     dom[name] = element.props[name];
  //   });
  // element.props.children.forEach(child => render(child, dom));
  // container.appendChild(dom);


  // 阶段二
  // 第一个工作单元
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    // 判断链表中正在工作的，切换
    alternate: currentRoot,
  }
  deletions = []
  // 下一个fiber 节点（工作单元）的跟节点
  nextUnitOfWork = wipRoot
}

function workLoop(deadline) {
  // 1、获取任务
  // 2、执行任务
  // 3、将任务放入队列
  // 4、循环
  // 5、循环结束
  // 6、执行完成
  // 判断是否应该停止循环
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // 如果当前任务的截止时间到了 停止工作循环 执行更高优先级的任务
    console.log("deadline🚗", deadline.timeRemaining())
    console.log("🌲", nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    // 提交阶段
    commitRoot();
  }

  requestIdleCallback(workLoop)
}
// 告知浏览器调度
requestIdleCallback(workLoop)

/**
 * 更新函数组件
 * @param fiber
 */
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  const children = [fiber.type(fiber.props)]
  wipFiber.hooks = []
  reconcileChildren(fiber, children)
}

/**
 * 更新普通节点
 * @param fiber
 */
function updateHostComponent(fiber) {
  // 第一回 渲染到页面中去
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // dom tree
  const children = fiber.props.children
  // 调和 dom diff tree
  reconcileChildren(fiber, children)
}

/**
 * 承载下一个工作单元
 */
function performUnitOfWork(fiber) {
  // 判断当前节点是不是函数组件
  const isFunctionComponent = fiber && fiber.type && fiber.type instanceof  Function

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

/**
 * dom diff
 * 构建成双向链表
 * @param fiber
 * @param elements
 */
function reconcileChildren(fiber, elements) {
  let index = 0
  // 变化之前的节点
  let oldFiber = fiber.alternate && fiber.alternate.child
  let prevSibling = null
  // 遍历 children
  while (index < elements.length || oldFiber != null) {
    // jsx --> fiber
    const element = elements[index]
    let newFiber = null;
    const sameType = oldFiber && element && element.type === oldFiber.type
    // 如果是同样的节点类型
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      }
    }
    // 如果节点类型不一致 新增节点
    if (!sameType && element) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: fiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      }
    }
    // 如果节点类型不一致 新节点不存在
    if (!sameType && oldFiber) {
      oldFiber.effectTag = 'DELETION'
      deletions.push(oldFiber)
    }
    // 如果存在 old 节点
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      fiber.child = newFiber
    } else if (element) {
      // TODO: fiber sibling 怎么创建注入的
      prevSibling.sibling = newFiber
    }
    // js 模拟指针移动?
    prevSibling = newFiber
    index++
  }
}

/**
 * hook: useState
 * initial 初始参数
 * @param initial
 * @returns {(*|setState)[]}
 */
function useState(initial) {
  // 是否有旧的钩子， 旧钩子存储了上一次更新的 hook
  const oldHook = wipFiber.alternate && wipFiber.alternate.hook
  // 初始化钩子 钩子的状态是旧的钩子的状态或者初始状态
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  }
  // 从旧的钩子队列中获取所有的动作 然后将他们一一应用到新的钩子的状态上
  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })
  // 设置钩子状态
  const setState = (action) => {
    hook.queue.push(action)
    // 更新渲染
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextUnitOfWork = wipRoot
    deletions = []
    // hook.queue.push(state => state)
    // scheduleWork(wipFiber)
  }
  // 把钩子添加至工作单元
  wipFiber.hook = hook

  // 返回钩子的状态和设置钩子的函数
  return [hook.state, setState]
}

export { render, useState }
