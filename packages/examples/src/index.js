import React from '@g/mini-react'

function App(props) {
  const [state, setState] = React.useState(1)
  return <h1 onClick={() => setState(c => ++c)}>Hi {props.name}, Count: { state }</h1>
}
const element = <App name="虚拟宇宙" />
const container = document.getElementById('root')
React.render(element, container);