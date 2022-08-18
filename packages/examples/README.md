1. createElement (虚拟DOM)
2. render
3. Concurrent Mode
   1. 允许中断渲染 优先级更高优先执行
   2. 将渲染工作进行分解 分解成一个个小 fiber task
   3. requestIdleCallback (mock 模拟)
      messageChannel (macrotask) + requestAnimationFrame (计算超时时间)
4. Fibers
   1. 小块 fiber task (虚拟dom + 状态) -> fiber tree -> 将要被渲染的 tree 双缓存
   2. fiber 是一种数据结构 也是一个工作单元
      ![cmd-markdown-logo](https://pomb.us/static/a88a3ec01855349c14302f6da28e2b0c/ac667/fiber1.png)
   3. h1 每一个fiber 如右图 链表
      const nextUnitOfWork = {
         parant: "", 
         dom: "",
         props: {
            children: [],
         }
      }
      <div>
         <h1>
            <p />
            <a />
         </h1>
         <h2 />
      </div>
   链表 + DFS + BFS
5. Render and Commit Phases
   提交阶段
6. Reconciliation(Dom diff)
7. Function Components
8. Hooks
   排队 + 栈 【更新顺序】
   桥接对应的组件