function e(){return e=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},e.apply(this,arguments)}function t(t,n,...o){return{type:t,props:e({},n,{children:o.map(e=>"object"==typeof e?e:{type:"TEXT_ELEMENT",props:{nodeValue:e,children:[]}})})}}let n=null,o=null,r=null,l=null,a=null;const i=e=>"children"!==e,c=(e,t)=>n=>e[n]!==t[n],s=e=>e.startsWith("on");function p(e,t,n){var o;Object.keys(t).filter(i).filter((o=n,e=>!(e in o))).forEach(t=>e[t]=""),Object.keys(n).filter(i).filter(c(t,n)).forEach(t=>e[t]=n[t]),Object.keys(t).filter(s).filter(e=>!(e in n)||c(t,n)(e)).forEach(n=>{const o=n.toLowerCase().substring(2);e.removeEventListener(o,t[n])}),Object.keys(n).filter(s).filter(c(t,n)).forEach(t=>{const o=t.toLowerCase().substring(2);e.addEventListener(o,n[t])})}function u(e,t){e.dom?t.removeChild(e.dom):u(e.child,t)}function f(e){if(!e)return;let t=e.parent;for(;!t.dom;)t=t.parent;const n=t.dom;"PLACEMENT"===e.effectTag&&null!==e.dom?n.appendChild(e.dom):"UPDATE"===e.effectTag&&null!==e.dom?p(e.dom,e.alternate.props,e.props):"DELETION"===e.effectTag&&u(e,n),f(e.child),f(e.sibling)}function d(e,t){r={dom:t,props:{children:[e]},alternate:l},a=[],n=r}function h(e){if(e&&e.type&&e.type instanceof Function?function(e){o=e;const t=[e.type(e.props)];o.hooks=[],E(e,t)}(e):function(e){e.dom||(e.dom=function(e){const t="TEXT_ELEMENT"===e.type?document.createTextNode(""):document.createElement(e.type);return p(t,{},e.props),t}(e)),E(e,e.props.children)}(e),e.child)return e.child;let t=e;for(;t;){if(t.sibling)return t.sibling;t=t.parent}}function E(e,t){let n=0,o=e.alternate&&e.alternate.child,r=null;for(;n<t.length||null!=o;){const l=t[n];let i=null;const c=o&&l&&l.type===o.type;c&&(i={type:o.type,props:l.props,dom:o.dom,parent:e,alternate:o,effectTag:"UPDATE"}),!c&&l&&(i={type:l.type,props:l.props,dom:null,parent:e,alternate:null,effectTag:"PLACEMENT"}),!c&&o&&(o.effectTag="DELETION",a.push(o)),o&&(o=o.sibling),0===n?e.child=i:l&&(r.sibling=i),r=i,n++}}function m(e){const t=o.alternate&&o.alternate.hook,i={state:t?t.state:e,queue:[]};return(t?t.queue:[]).forEach(e=>{i.state=e(i.state)}),o.hook=i,[i.state,e=>{i.queue.push(e),r={dom:l.dom,props:l.props,alternate:l},n=r,a=[]}]}requestIdleCallback(function e(t){let o=!1;for(;n&&!o;)n=h(n),console.log("deadline🚗",t.timeRemaining()),console.log("🌲",n),o=t.timeRemaining()<1;!n&&r&&(a.forEach(f),f(r.child),l=r,r=null),requestIdleCallback(e)});const g={createElement:t,render:d,useState:m};export{t as createElement,g as default,d as render,m as useState};
//# sourceMappingURL=mini-react.modern.mjs.map