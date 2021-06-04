var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function c(t){t.forEach(n)}function o(t){return"function"==typeof t}function l(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function r(n,e,c){n.$$.on_destroy.push(function(n,...e){if(null==n)return t;const c=n.subscribe(...e);return c.unsubscribe?()=>c.unsubscribe():c}(e,c))}function u(t,n,e=n){return t.set(e),n}function s(t,n){t.appendChild(n)}function i(t,n,e){t.insertBefore(n,e||null)}function a(t){t.parentNode.removeChild(t)}function f(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function p(){return d(" ")}function m(){return d("")}function $(t,n,e,c){return t.addEventListener(n,e,c),()=>t.removeEventListener(n,e,c)}function g(t){return function(n){return n.preventDefault(),t.call(this,n)}}function h(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function v(t,n){n=""+n,t.data!==n&&(t.data=n)}function b(t,n){(null!=n||t.value)&&(t.value=n)}let k;function x(t){k=t}const y=[],_=[],w=[],E=[],A=Promise.resolve();let C=!1;function T(t){w.push(t)}function N(t){E.push(t)}const M=new Set;function O(){do{for(;y.length;){const t=y.shift();x(t),j(t.$$)}for(;_.length;)_.pop()();for(let t=0;t<w.length;t+=1){const n=w[t];M.has(n)||(M.add(n),n())}w.length=0}while(y.length);for(;E.length;)E.pop()();C=!1,M.clear()}function j(t){if(null!==t.fragment){t.update(),c(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(T)}}const B=new Set;let D;function L(){D={r:0,c:[],p:D}}function S(){D.r||c(D.c),D=D.p}function q(t,n){t&&t.i&&(B.delete(t),t.i(n))}function G(t,n,e,c){if(t&&t.o){if(B.has(t))return;B.add(t),D.c.push(()=>{B.delete(t),c&&(e&&t.d(1),c())}),t.o(n)}}function I(t,n,e){const c=t.$$.props[n];void 0!==c&&(t.$$.bound[c]=e,e(t.$$.ctx[c]))}function P(t){t&&t.c()}function z(t,e,l){const{fragment:r,on_mount:u,on_destroy:s,after_update:i}=t.$$;r&&r.m(e,l),T(()=>{const e=u.map(n).filter(o);s?s.push(...e):c(e),t.$$.on_mount=[]}),i.forEach(T)}function F(t,n){const e=t.$$;null!==e.fragment&&(c(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function H(t,n){-1===t.$$.dirty[0]&&(y.push(t),C||(C=!0,A.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function J(n,o,l,r,u,s,i=[-1]){const a=k;x(n);const f=o.props||{},d=n.$$={fragment:null,ctx:null,props:s,update:t,not_equal:u,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:e(),dirty:i};let p=!1;d.ctx=l?l(n,f,(t,e,...c)=>{const o=c.length?c[0]:e;return d.ctx&&u(d.ctx[t],d.ctx[t]=o)&&(d.bound[t]&&d.bound[t](o),p&&H(n,t)),e}):[],d.update(),p=!0,c(d.before_update),d.fragment=!!r&&r(d.ctx),o.target&&(o.hydrate?d.fragment&&d.fragment.l(function(t){return Array.from(t.childNodes)}(o.target)):d.fragment&&d.fragment.c(),o.intro&&q(n.$$.fragment),z(n,o.target,o.anchor),O()),x(a)}class K{$destroy(){F(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}const Q=[];function R(n,e=t){let c;const o=[];function r(t){if(l(n,t)&&(n=t,c)){const t=!Q.length;for(let t=0;t<o.length;t+=1){const e=o[t];e[1](),Q.push(e,n)}if(t){for(let t=0;t<Q.length;t+=2)Q[t][0](Q[t+1]);Q.length=0}}}return{set:r,update:function(t){r(t(n))},subscribe:function(l,u=t){const s=[l,u];return o.push(s),1===o.length&&(c=e(r)||t),l(n),()=>{const t=o.indexOf(s);-1!==t&&o.splice(t,1),0===o.length&&(c(),c=null)}}}}const U=R("all"),V=R(!1),W=R([]);function X(t){let n,e,c,o,l;return{c(){n=f("button"),e=d("✔"),h(n,"id",c="complete"+t[1]),h(n,"class",o="completed"==t[0].status?"active":"")},m(c,o){i(c,n,o),s(n,e),l=$(n,"click",t[9])},p(t,e){2&e&&c!==(c="complete"+t[1])&&h(n,"id",c),1&e&&o!==(o="completed"==t[0].status?"active":"")&&h(n,"class",o)},d(t){t&&a(n),l()}}}function Y(t){let n,e,c,o;return{c(){n=f("button"),e=d("✖"),h(n,"id",c="remove"+t[1])},m(c,l){i(c,n,l),s(n,e),o=$(n,"click",t[8])},p(t,e){2&e&&c!==(c="remove"+t[1])&&h(n,"id",c)},d(t){t&&a(n),o()}}}function Z(t){let n,e,o,l,r,u,m,g,v;return{c(){n=f("button"),e=d("✔"),r=p(),u=f("button"),m=d("✖"),h(n,"id",o="complete"+t[1]),h(n,"class",l="completed"==t[0].status?"active":""),h(u,"id",g="remove"+t[1])},m(c,o){i(c,n,o),s(n,e),i(c,r,o),i(c,u,o),s(u,m),v=[$(n,"click",t[6]),$(u,"click",t[7])]},p(t,e){2&e&&o!==(o="complete"+t[1])&&h(n,"id",o),1&e&&l!==(l="completed"==t[0].status?"active":"")&&h(n,"class",l),2&e&&g!==(g="remove"+t[1])&&h(u,"id",g)},d(t){t&&a(n),t&&a(r),t&&a(u),c(v)}}}function tt(n){let e,c,o,l,r,u=n[0].titleTask+"";function m(t,n){return"all"==t[2]?Z:"completed"==t[2]?Y:X}let $=m(n),g=$(n);return{c(){e=f("div"),c=f("h4"),o=d(u),l=p(),r=f("div"),g.c(),h(r,"class","btn-group"),h(e,"class","task")},m(t,n){i(t,e,n),s(e,c),s(c,o),s(e,l),s(e,r),g.m(r,null)},p(t,[n]){1&n&&u!==(u=t[0].titleTask+"")&&v(o,u),$===($=m(t))&&g?g.p(t,n):(g.d(1),g=$(t),g&&(g.c(),g.m(r,null)))},i:t,o:t,d(t){t&&a(e),g.d()}}}function nt(t,n,e){let c,o;r(t,W,t=>e(5,c=t)),r(t,U,t=>e(2,o=t));let{task:l}=n,{index:s}=n;function i(t){"pending"===c[t].status?u(W,c[t].status="completed",c):u(W,c[t].status="pending",c),u(W,c=[...c])}function a(t){c.splice(t,1),u(W,c=[...c])}return t.$set=t=>{"task"in t&&e(0,l=t.task),"index"in t&&e(1,s=t.index)},[l,s,o,i,a,c,()=>i(s),()=>{a(s)},()=>{a(s)},()=>i(s)]}class et extends K{constructor(t){super(),J(this,t,nt,tt,l,{task:0,index:1})}}function ct(t,n,e){const c=t.slice();return c[5]=n[e],c[6]=n,c[7]=e,c}function ot(t){let n,e;function c(n){t[4].call(null,n,t[5],t[6],t[7])}let o={index:t[7]};void 0!==t[5]&&(o.task=t[5]);const l=new et({props:o});return _.push(()=>I(l,"task",c)),{c(){P(l.$$.fragment)},m(t,n){z(l,t,n),e=!0},p(e,c){t=e;const o={};!n&&1&c&&(n=!0,o.task=t[5],N(()=>n=!1)),l.$set(o)},i(t){e||(q(l.$$.fragment,t),e=!0)},o(t){G(l.$$.fragment,t),e=!1},d(t){F(l,t)}}}function lt(t){let n,e,c="completed"==t[5].status&&ut(t);return{c(){c&&c.c(),n=m()},m(t,o){c&&c.m(t,o),i(t,n,o),e=!0},p(t,e){"completed"==t[5].status?c?(c.p(t,e),q(c,1)):(c=ut(t),c.c(),q(c,1),c.m(n.parentNode,n)):c&&(L(),G(c,1,1,()=>{c=null}),S())},i(t){e||(q(c),e=!0)},o(t){G(c),e=!1},d(t){c&&c.d(t),t&&a(n)}}}function rt(t){let n,e;function c(n){t[2].call(null,n,t[5],t[6],t[7])}let o={index:t[7]};void 0!==t[5]&&(o.task=t[5]);const l=new et({props:o});return _.push(()=>I(l,"task",c)),{c(){P(l.$$.fragment)},m(t,n){z(l,t,n),e=!0},p(e,c){t=e;const o={};!n&&1&c&&(n=!0,o.task=t[5],N(()=>n=!1)),l.$set(o)},i(t){e||(q(l.$$.fragment,t),e=!0)},o(t){G(l.$$.fragment,t),e=!1},d(t){F(l,t)}}}function ut(t){let n,e;function c(n){t[3].call(null,n,t[5],t[6],t[7])}let o={index:t[7]};void 0!==t[5]&&(o.task=t[5]);const l=new et({props:o});return _.push(()=>I(l,"task",c)),{c(){P(l.$$.fragment)},m(t,n){z(l,t,n),e=!0},p(e,c){t=e;const o={};!n&&1&c&&(n=!0,o.task=t[5],N(()=>n=!1)),l.$set(o)},i(t){e||(q(l.$$.fragment,t),e=!0)},o(t){G(l.$$.fragment,t),e=!1},d(t){F(l,t)}}}function st(t){let n,e,c,o;const l=[rt,lt,ot],r=[];function u(t,n){return"all"==t[1]?0:"completed"==t[1]?1:"pending"==t[5].status?2:-1}return~(n=u(t))&&(e=r[n]=l[n](t)),{c(){e&&e.c(),c=m()},m(t,e){~n&&r[n].m(t,e),i(t,c,e),o=!0},p(t,o){let s=n;n=u(t),n===s?~n&&r[n].p(t,o):(e&&(L(),G(r[s],1,1,()=>{r[s]=null}),S()),~n?(e=r[n],e||(e=r[n]=l[n](t),e.c()),q(e,1),e.m(c.parentNode,c)):e=null)},i(t){o||(q(e),o=!0)},o(t){G(e),o=!1},d(t){~n&&r[n].d(t),t&&a(c)}}}function it(t){let n,e,c=t[0],o=[];for(let n=0;n<c.length;n+=1)o[n]=st(ct(t,c,n));const l=t=>G(o[t],1,1,()=>{o[t]=null});return{c(){n=f("div");for(let t=0;t<o.length;t+=1)o[t].c();h(n,"class","tasks")},m(t,c){i(t,n,c);for(let t=0;t<o.length;t+=1)o[t].m(n,null);e=!0},p(t,[e]){if(3&e){let r;for(c=t[0],r=0;r<c.length;r+=1){const l=ct(t,c,r);o[r]?(o[r].p(l,e),q(o[r],1)):(o[r]=st(l),o[r].c(),q(o[r],1),o[r].m(n,null))}for(L(),r=c.length;r<o.length;r+=1)l(r);S()}},i(t){if(!e){for(let t=0;t<c.length;t+=1)q(o[t]);e=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)G(o[t]);e=!1},d(t){t&&a(n),function(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}(o,t)}}}function at(t,n,e){let c,o;return r(t,W,t=>e(0,c=t)),r(t,U,t=>e(1,o=t)),[c,o,function(t,n,e,o){e[o]=t,W.set(c)},function(t,n,e,o){e[o]=t,W.set(c)},function(t,n,e,o){e[o]=t,W.set(c)}]}class ft extends K{constructor(t){super(),J(this,t,at,it,l,{})}}function dt(n){let e,o,l,r,u,m,g,b,k,x,y,_,w,E,A,C,T=0!=n[0]?"("+n[0]+")":"",N=0!=n[1]?"("+n[1]+")":"",M=0!=n[2]?"("+n[2]+")":"";return{c(){e=f("div"),o=f("button"),l=d("All "),r=d(T),m=p(),g=f("button"),b=d("Completed "),k=d(N),y=p(),_=f("button"),w=d("Incomplete "),E=d(M),h(o,"id","all"),h(o,"class",u="all"==n[3]?"active":""),h(g,"id","completed"),h(g,"class",x="completed"==n[3]?"active":""),h(_,"id","incomplete"),h(_,"class",A="incomplete"==n[3]?"active":""),h(e,"class","filters")},m(t,c){i(t,e,c),s(e,o),s(o,l),s(o,r),s(e,m),s(e,g),s(g,b),s(g,k),s(e,y),s(e,_),s(_,w),s(_,E),C=[$(o,"click",n[7]),$(g,"click",n[8]),$(_,"click",n[9])]},p(t,[n]){1&n&&T!==(T=0!=t[0]?"("+t[0]+")":"")&&v(r,T),8&n&&u!==(u="all"==t[3]?"active":"")&&h(o,"class",u),2&n&&N!==(N=0!=t[1]?"("+t[1]+")":"")&&v(k,N),8&n&&x!==(x="completed"==t[3]?"active":"")&&h(g,"class",x),4&n&&M!==(M=0!=t[2]?"("+t[2]+")":"")&&v(E,M),8&n&&A!==(A="incomplete"==t[3]?"active":"")&&h(_,"class",A)},i:t,o:t,d(t){t&&a(e),c(C)}}}function pt(t,n,e){let c,o;r(t,W,t=>e(6,c=t)),r(t,U,t=>e(3,o=t));let l=0,s=0;let i,a,f;return t.$$.update=()=>{if(112&t.$$.dirty){e(4,l=0),e(5,s=0);for(let t in c)"pending"==c[t].status?e(5,s++,s):e(4,l++,l)}64&t.$$.dirty&&e(0,i=c.length),16&t.$$.dirty&&e(1,a=l),32&t.$$.dirty&&e(2,f=s)},[i,a,f,o,l,s,c,()=>u(U,o="all"),()=>u(U,o="completed"),()=>u(U,o="incomplete")]}class mt extends K{constructor(t){super(),J(this,t,pt,dt,l,{})}}function $t(n){let e,o,l,r,u,m,v,k,x,y,_;return{c(){e=f("form"),o=f("input"),l=p(),r=f("button"),r.textContent="Add",u=p(),m=f("button"),m.textContent="Clear",v=p(),k=f("p"),x=d("Give the task a title first."),h(o,"id","input"),h(o,"type","text"),h(o,"placeholder","Add a new task!"),h(r,"id","add"),h(e,"class","form"),h(k,"class",y="MsgError "+(n[2]?" ":"opacity"))},m(t,c){i(t,e,c),s(e,o),b(o,n[0]),s(e,l),s(e,r),s(e,u),s(e,m),i(t,v,c),i(t,k,c),s(k,x),_=[$(o,"input",n[4]),$(r,"click",g(n[3])),$(m,"click",g(n[5]))]},p(t,[n]){1&n&&o.value!==t[0]&&b(o,t[0]),4&n&&y!==(y="MsgError "+(t[2]?" ":"opacity"))&&h(k,"class",y)},i:t,o:t,d(t){t&&a(e),t&&a(v),t&&a(k),c(_)}}}function gt(t,n,e){let c,o;r(t,W,t=>e(1,c=t)),r(t,V,t=>e(2,o=t));let l="";return[l,c,o,function(){""!=l?(u(W,c=[{titleTask:l,status:"pending"},...c]),e(0,l="")):(u(V,o=!0),setTimeout(()=>{u(V,o=!1)},2e3))},function(){l=this.value,e(0,l)},()=>u(W,c=[])]}class ht extends K{constructor(t){super(),J(this,t,gt,$t,l,{})}}function vt(n){let e,c,o,l,r;const u=new ht({}),d=new ft({}),m=new mt({});return{c(){e=f("main"),c=f("div"),P(u.$$.fragment),o=p(),P(d.$$.fragment),l=p(),P(m.$$.fragment),h(c,"class","To-Do"),h(e,"class","container")},m(t,n){i(t,e,n),s(e,c),z(u,c,null),s(c,o),z(d,c,null),s(c,l),z(m,c,null),r=!0},p:t,i(t){r||(q(u.$$.fragment,t),q(d.$$.fragment,t),q(m.$$.fragment,t),r=!0)},o(t){G(u.$$.fragment,t),G(d.$$.fragment,t),G(m.$$.fragment,t),r=!1},d(t){t&&a(e),F(u),F(d),F(m)}}}return new class extends K{constructor(t){super(),J(this,t,null,vt,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
