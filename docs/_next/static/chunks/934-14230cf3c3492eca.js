(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[934],{5677:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{noSSR:function(){return u},default:function(){return i}});let n=r(8754),l=(r(7294),n._(r(8976)));function o(e){return{default:(null==e?void 0:e.default)||e}}function u(e,t){return delete t.webpack,delete t.modules,e(t)}function i(e,t){let r=l.default,n={loading:e=>{let{error:t,isLoading:r,pastDelay:n}=e;return null}};e instanceof Promise?n.loader=()=>e:"function"==typeof e?n.loader=e:"object"==typeof e&&(n={...n,...e}),n={...n,...t};let i=n.loader;return(n.loadableGenerated&&(n={...n,...n.loadableGenerated},delete n.loadableGenerated),"boolean"!=typeof n.ssr||n.ssr)?r({...n,loader:()=>null!=i?i().then(o):Promise.resolve(o(()=>null))}):(delete n.webpack,delete n.modules,u(r,n))}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2254:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"LoadableContext",{enumerable:!0,get:function(){return o}});let n=r(8754),l=n._(r(7294)),o=l.default.createContext(null)},8976:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return h}});let n=r(8754),l=n._(r(7294)),o=r(2254),u=[],i=[],a=!1;function s(e){let t=e(),r={loading:!0,loaded:null,error:null};return r.promise=t.then(e=>(r.loading=!1,r.loaded=e,e)).catch(e=>{throw r.loading=!1,r.error=e,e}),r}class d{promise(){return this._res.promise}retry(){this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};let{_res:e,_opts:t}=this;e.loading&&("number"==typeof t.delay&&(0===t.delay?this._state.pastDelay=!0:this._delay=setTimeout(()=>{this._update({pastDelay:!0})},t.delay)),"number"==typeof t.timeout&&(this._timeout=setTimeout(()=>{this._update({timedOut:!0})},t.timeout))),this._res.promise.then(()=>{this._update({}),this._clearTimeouts()}).catch(e=>{this._update({}),this._clearTimeouts()}),this._update({})}_update(e){this._state={...this._state,error:this._res.error,loaded:this._res.loaded,loading:this._res.loading,...e},this._callbacks.forEach(e=>e())}_clearTimeouts(){clearTimeout(this._delay),clearTimeout(this._timeout)}getCurrentValue(){return this._state}subscribe(e){return this._callbacks.add(e),()=>{this._callbacks.delete(e)}}constructor(e,t){this._loadFn=e,this._opts=t,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}}function c(e){return function(e,t){let r=Object.assign({loader:null,loading:null,delay:200,timeout:null,webpack:null,modules:null},t),n=null;function u(){if(!n){let t=new d(e,r);n={getCurrentValue:t.getCurrentValue.bind(t),subscribe:t.subscribe.bind(t),retry:t.retry.bind(t),promise:t.promise.bind(t)}}return n.promise()}if(!a){let e=r.webpack?r.webpack():r.modules;e&&i.push(t=>{for(let r of e)if(t.includes(r))return u()})}function s(e,t){!function(){u();let e=l.default.useContext(o.LoadableContext);e&&Array.isArray(r.modules)&&r.modules.forEach(t=>{e(t)})}();let i=l.default.useSyncExternalStore(n.subscribe,n.getCurrentValue,n.getCurrentValue);return l.default.useImperativeHandle(t,()=>({retry:n.retry}),[]),l.default.useMemo(()=>{var t;return i.loading||i.error?l.default.createElement(r.loading,{isLoading:i.loading,pastDelay:i.pastDelay,timedOut:i.timedOut,error:i.error,retry:n.retry}):i.loaded?l.default.createElement((t=i.loaded)&&t.default?t.default:t,e):null},[e,i])}return s.preload=()=>u(),s.displayName="LoadableComponent",l.default.forwardRef(s)}(s,e)}function f(e,t){let r=[];for(;e.length;){let n=e.pop();r.push(n(t))}return Promise.all(r).then(()=>{if(e.length)return f(e,t)})}c.preloadAll=()=>new Promise((e,t)=>{f(u).then(e,t)}),c.preloadReady=e=>(void 0===e&&(e=[]),new Promise(t=>{let r=()=>(a=!0,t());f(i,e).then(r,r)})),window.__NEXT_PRELOADREADY=c.preloadReady;let h=c},8934:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return b}});var n=r(5893),l=r(7294),o=r(9034),u=r.n(o),i=r(5152),a=r.n(i);let s=["a","b","c"];function d(){let e="";for(let t=0;t<10;t++)e+=s[function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Math.floor(Math.random()*e)+t}(s.length)];return e}function c(e){let t={};for(let e of s)t[e]=0;for(let r of e.split("")){if(null==t[r])throw Error("In random word there is a never seen letter");t[r]++}return t}function f(e){let t=c(e),r=[],n=42;for(let e of s){if(null==t[e])throw Error("In random word there is a never seen letter");r.push({letter:e,frequency:t[e],id:n}),n++}for(r.sort((e,t)=>e.frequency-t.frequency);r.length>1;){let e=r.shift(),t=r.shift();if(!e||!t)break;e.parent=t.parent=n,r.push({frequency:e.frequency+t.frequency,left:e,right:t,id:n}),n++}return r.shift()}let h=a()(()=>Promise.all([r.e(737),r.e(177)]).then(r.bind(r,7177)).then(e=>e.GraphCanvas),{loadableGenerated:{webpack:()=>[null]},ssr:!1});function p(e){let{word:t}=e,[r,o]=(0,l.useState)([]),[u,i]=(0,l.useState)([]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("button",{onClick:()=>(function(){let e=f(t);if(!e)return;let r=[e],n=[],l=[];for(;r.length>0;){var u;let e=r.shift();if(!e)return;n.push({id:"".concat(e.id),label:null!==(u=e.letter)&&void 0!==u?u:""}),e.parent&&l.push({id:"".concat(e.parent,"->").concat(e.id),source:"".concat(e.parent),target:"".concat(e.id),label:"".concat(e.parent,"->").concat(e.id)}),e.left&&r.push(e.left),e.right&&r.push(e.right)}o(n),i(l)})(),children:"Load Tree"}),r.length>0&&u.length>0&&(0,n.jsx)("div",{style:{border:"solid 1px black",height:"100vh",width:"100%",position:"relative"},children:(0,n.jsx)(h,{nodes:r,edges:u,layoutType:"treeTd2d"})})]})}function m(e){let t=new RegExp("^[".concat("1").concat("0","]*$"));return t.test(e)}let _="Encoding is ambiguous!";function b(){let[e,t]=(0,l.useState)("");(0,l.useEffect)(()=>t(d()),[t]);let[r,o]=(0,l.useState)(""),[i,a]=(0,l.useState)(""),[h,b]=(0,l.useState)({});return(0,n.jsxs)("main",{className:u().main,children:[(0,n.jsxs)("div",{className:u().random_word,children:["Random Word:",(0,n.jsx)("input",{readOnly:!0,value:e}),(0,n.jsx)("button",{onClick:()=>t(d()),children:"Get new word"})]}),(0,n.jsxs)("form",{className:u().random_word,onSubmit:t=>{t.preventDefault(),function(){let t;if(!m(i))return;try{t=function(e){let t=42,r={frequency:0,id:t};t++;let n=r;for(let l of Object.keys(e)){let o=e[l].split("");for(let e of o){if(n.letter)throw Error(_);if("1"===e){!n.left&&(n.left={frequency:0,id:t},t++),n=n.left;continue}if("0"===e){!n.right&&(n.right={frequency:0,id:t},t++),n=n.right;continue}}if(n.letter)throw Error(_);n.letter=l,n=r}let l=[r];for(;l.length>0;){if((n=l.shift()).right&&!n.left||n.left&&!n.right||n.left&&n.right&&n.letter||!n.left&&!n.right&&!n.letter)throw Error("Tree has empty paths!");n.right&&n.left&&(l.push(n.right),l.push(n.left))}return r}(h)}catch(e){o(e.message);return}let r=function(e,t){let r=e.split(""),n="",l=t;for(let e of r)"1"===e?l=l.left:"0"===e&&(l=l.right),l.letter&&(n+=l.letter,l=t);return n}(i,t),n="";if(r==e){n="I understood the word. You encrypted correctly!";let t=function(e){let t=function(e){let t=f(e);if(!t)return{};let r=function e(t,r,n){if(!t)return r;if(t.letter)return{...r,[t.letter]:n};if(t.left&&t.right){let l=e(t.left,r,n+"1"),o=e(t.right,r,n+"0");return{...l,...o}}throw console.error({node:t,encryption_table:r,current_decode:n}),Error("How did you get here?")}(t,{},"");return r}(e),r=e.split(""),n=[];for(let e of r)n.push(t[e]);let l=n.join("");return l}(e);i.length===t.length?n+="You are a genious! I wouldn't know how to compress better!":n+="You compressed the message down to ".concat(i.length,", but I did it in ").concat(t.length,". Can you do the same?")}else n="I wasn't able to decrypt the word correctly. I understood: ".concat(r);o(n)}()},children:[(0,n.jsx)("div",{className:u().frequencies,children:function(){let t=c(e),r=[];for(let e of s){var l;r.push((0,n.jsxs)("label",{className:u().letter_description,children:[e,":",t[e],(0,n.jsx)("input",{required:!0,value:null!==(l=h[e])&&void 0!==l?l:"",onChange:t=>{let r=t.target.value;m(r)&&b(t=>({...t,[e]:r}))}})]},e))}return r}()}),"Put here your encrypted word:",(0,n.jsx)("input",{required:!0,value:i,onChange:e=>{let t=e.target.value;a(t)}}),(0,n.jsx)("button",{type:"submit",children:"Check"})]}),(0,n.jsx)("p",{children:r}),(0,n.jsx)(p,{word:e})]})}},9034:function(e){e.exports={main:"Home_main__nLjiQ",random_word:"Home_random_word__LWtU4",frequencies:"Home_frequencies__komqP",letter_description:"Home_letter_description__lHyzI"}},5152:function(e,t,r){e.exports=r(5677)}}]);