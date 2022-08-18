import { createElement } from './createElement';
import { render, useState } from './render'

const React = { createElement, render, useState }

export default React

// window.React = {
//   createElement,
//   render,
//   useState
// }
//
// function App(props) {
//   const [state, setState] = useState(1)
//   return <h1 onClick={() => setState(c => ++c)}>Hi {props.name}, Count: { state }</h1>
// }
// const element = <App name="虚拟宇宙" />
// const container = document.getElementById('root')
// render(element, container);

// const container = document.getElementById('root');
// const updateValue = (e) => {
//   rerender(e.target.value);
// };
//
// const rerender = (value) => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   );
//   render(element, container);
// };
//
// rerender('World');