/**
 * 创建文本节点
 * @param text
 * @returns {{type: string, props: {nodeValue, children: *[]}}}
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

/**
 * 创建元素
 * @param type
 * @param props
 * @param children
 * @returns {{children: (*|{type: string, props: {nodeValue, children: *[]}})[], type, props: {}}}
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      )
    },
  }
}

export {
  createElement,
  createTextElement
}
