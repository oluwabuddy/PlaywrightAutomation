(()=>{"use strict";var e={967:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.VERSION=void 0,t.VERSION=3},204:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createEmptyContext=function(){return{startTime:Number.MAX_SAFE_INTEGER,endTime:0,browserName:"",options:{deviceScaleFactor:1,isMobile:!1,viewport:{width:1280,height:800}},pages:[],resources:[],actions:[],events:[],objects:{},hasSource:!1}}},626:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SnapshotRenderer=void 0,t.SnapshotRenderer=class{constructor(e,t,s){this._snapshots=void 0,this._index=void 0,this.snapshotName=void 0,this._resources=void 0,this._snapshot=void 0,this._resources=e,this._snapshots=t,this._index=s,this._snapshot=t[s],this.snapshotName=t[s].snapshotName}snapshot(){return this._snapshots[this._index]}viewport(){return this._snapshots[this._index].viewport}render(){const e=(t,r)=>{if("string"==typeof t)return t.replace(/[&<]/gu,(e=>n[e]));if(!t._string)if(Array.isArray(t[0])){const s=r-t[0][0];if(s>=0&&s<=r){const n=function(e){if(!e._nodes){const t=[],s=e=>{if("string"==typeof e)t.push(e);else if("string"==typeof e[0]){for(let t=2;t<e.length;t++)s(e[t]);t.push(e)}};s(e.html),e._nodes=t}return e._nodes}(this._snapshots[s]),r=t[0][1];r>=0&&r<n.length&&(t._string=e(n[r],s))}}else if("string"==typeof t[0]){const o=[];o.push("<",t[0]);const i="IFRAME"===t[0]||"FRAME"===t[0];for(const[e,s]of Object.entries(t[1]||{})){const t=i&&"src"===e.toLowerCase()?"__playwright_src__":e;o.push(" ",t,'="',s.replace(/[&<>"']/gu,(e=>n[e])),'"')}o.push(">");for(let s=2;s<t.length;s++)o.push(e(t[s],r));s.has(t[0])||o.push("</",t[0],">"),t._string=o.join("")}else t._string="";return t._string},t=this._snapshot;let r=e(t.html,this._index);return r?(r=(t.doctype?`<!DOCTYPE ${t.doctype}>`:"")+["<style>*,*::before,*::after { visibility: hidden }</style>",`<style>*[__playwright_target__="${this.snapshotName}"] { background-color: #6fa8dc7f; }</style>`,`<script>\n(${function(e,t,s,n){const r=[],o=[],i=a=>{for(const e of a.querySelectorAll(`[${t}]`))r.push(e);for(const e of a.querySelectorAll(`[${s}]`))o.push(e);for(const e of a.querySelectorAll("iframe, frame")){const t=e.getAttribute("__playwright_src__");if(t){const s=new URL(window.location.href);s.searchParams.delete("pointX"),s.searchParams.delete("pointY");const n=s.pathname.lastIndexOf("/snapshot/");-1!==n&&(s.pathname=s.pathname.substring(0,n+1)),s.pathname+=t.substring(1),e.setAttribute("src",s.toString())}else e.setAttribute("src",'data:text/html,<body style="background: #ddd"></body>')}for(const t of a.querySelectorAll(`template[${e}]`)){const e=t,s=e.parentElement.attachShadow({mode:"open"});s.appendChild(e.content),e.remove(),i(s)}if("adoptedStyleSheets"in a){const e=[...a.adoptedStyleSheets];for(const t of a.querySelectorAll(`template[${n}]`)){const s=t,r=new CSSStyleSheet;r.replaceSync(s.getAttribute(n)),e.push(r)}a.adoptedStyleSheets=e}},a=()=>{window.removeEventListener("load",a);for(const e of r)e.scrollTop=+e.getAttribute(t),e.removeAttribute(t);for(const e of o)e.scrollLeft=+e.getAttribute(s),e.removeAttribute(s);const e=new URL(window.location.href).searchParams,n=e.get("pointX"),i=e.get("pointY");if(n){const e=document.createElement("x-pw-pointer");e.style.position="fixed",e.style.backgroundColor="red",e.style.width="20px",e.style.height="20px",e.style.borderRadius="10px",e.style.margin="-10px 0 0 -10px",e.style.zIndex="2147483647",e.style.left=n+"px",e.style.top=i+"px",document.documentElement.appendChild(e)}document.styleSheets[0].disabled=!0};window.addEventListener("load",a),window.addEventListener("DOMContentLoaded",(()=>i(document)))}.toString()})('__playwright_shadow_root_', '__playwright_scroll_top_', '__playwright_scroll_left_', '__playwright_style_sheet_')<\/script>`].join("")+r,{html:r,pageId:t.pageId,frameId:t.frameId,index:this._index}):{html:"",pageId:t.pageId,frameId:t.frameId,index:this._index}}resourceByUrl(e){const t=this._snapshot;let s;for(const n of this._resources){if(n._monotonicTime>=t.timestamp)break;if(n._frameref===t.frameId&&n.request.url===e){s=n;break}}if(!s)for(const s of this._resources){if(s._monotonicTime>=t.timestamp)break;if(s.request.url===e)return s}if(s)for(const n of t.resourceOverrides)if(e===n.url&&n.sha1){s={...s,response:{...s.response,content:{...s.response.content,_sha1:n.sha1}}};break}return s}};const s=new Set(["AREA","BASE","BR","COL","COMMAND","EMBED","HR","IMG","INPUT","KEYGEN","LINK","MENUITEM","META","PARAM","SOURCE","TRACK","WBR"]),n={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}},507:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SnapshotServer=void 0;const s="http://playwright.bloburl/#";t.SnapshotServer=class{constructor(e){this._snapshotStorage=void 0,this._snapshotIds=new Map,this._snapshotStorage=e}serveSnapshot(e,t,s){const n=this._snapshot(e.substring("/snapshot".length),t);if(!n)return new Response(null,{status:404});const r=n.render();return this._snapshotIds.set(s,n),new Response(r.html,{status:200,headers:{"Content-Type":"text/html"}})}serveSnapshotInfo(e,t){const s=this._snapshot(e.substring("/snapshotInfo".length),t);return this._respondWithJson(s?{viewport:s.viewport(),url:s.snapshot().frameUrl}:{error:"No snapshot found"})}_snapshot(e,t){const s=t.get("name");return this._snapshotStorage.snapshotByName(e.slice(1),s)}_respondWithJson(e){return new Response(JSON.stringify(e),{status:200,headers:{"Cache-Control":"public, max-age=31536000","Content-Type":"application/json"}})}async serveResource(e,t){const n=this._snapshotIds.get(t),r=e.startsWith(s)?e.substring(s.length):function(e){try{const t=new URL(e);return t.hash="",t.toString()}catch(t){return e}}(e),o=null==n?void 0:n.resourceByUrl(r);if(!o)return new Response(null,{status:404});const i=o.response.content._sha1,a=i&&await this._snapshotStorage.resourceContent(i)||new Blob([]);let c=o.response.content.mimeType;/^text\/|^application\/(javascript|json)/.test(c)&&!c.includes("charset")&&(c=`${c}; charset=utf-8`);const h=new Headers;h.set("Content-Type",c);for(const{name:e,value:t}of o.response.headers)h.set(e,t);h.delete("Content-Encoding"),h.delete("Access-Control-Allow-Origin"),h.set("Access-Control-Allow-Origin","*"),h.delete("Content-Length"),h.set("Content-Length",String(a.size)),h.set("Cache-Control","public, max-age=31536000");const{status:p}=o.response;return new Response(101===p||204===p||205===p||304===p?null:a,{headers:h,status:o.response.status,statusText:o.response.statusText})}}},373:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BaseSnapshotStorage=void 0;var n=s(187),r=s(626);class o extends n.EventEmitter{constructor(...e){super(...e),this._resources=[],this._frameSnapshots=new Map}clear(){this._resources=[],this._frameSnapshots.clear()}addResource(e){this._resources.push(e)}addFrameSnapshot(e){let t=this._frameSnapshots.get(e.frameId);t||(t={raw:[],renderer:[]},this._frameSnapshots.set(e.frameId,t),e.isMainFrame&&this._frameSnapshots.set(e.pageId,t)),t.raw.push(e);const s=new r.SnapshotRenderer(this._resources,t.raw,t.raw.length-1);t.renderer.push(s),this.emit("snapshot",s)}resources(){return this._resources.slice()}snapshotByName(e,t){const s=this._frameSnapshots.get(e);return null==s?void 0:s.renderer.find((e=>e.snapshotName===t))}snapshotByIndex(e,t){const s=this._frameSnapshots.get(e);return null==s?void 0:s.renderer[t]}}t.BaseSnapshotStorage=o},606:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PersistentSnapshotStorage=t.TraceModel=void 0;var n=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var s=i(t);if(s&&s.has(e))return s.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&Object.prototype.hasOwnProperty.call(e,o)){var a=r?Object.getOwnPropertyDescriptor(e,o):null;a&&(a.get||a.set)?Object.defineProperty(n,o,a):n[o]=e[o]}return n.default=e,s&&s.set(e,n),n}(s(967)),r=s(373),o=s(204);function i(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,s=new WeakMap;return(i=function(e){return e?s:t})(e)}self.importScripts("zip.min.js");const a=self.zip;t.TraceModel=class{constructor(){this.contextEntry=void 0,this.pageEntries=new Map,this._snapshotStorage=void 0,this._entries=new Map,this._version=void 0,this.contextEntry=(0,o.createEmptyContext)()}async load(e,t){const s=new a.ZipReader(new a.HttpReader(e,{mode:"cors",preventHeadRequest:!0}),{useWebWorkers:!1});let n,r;for(const e of await s.getEntries({onprogress:t}))e.filename.endsWith(".trace")&&(n=e),e.filename.endsWith(".network")&&(r=e),e.filename.includes("src@")&&(this.contextEntry.hasSource=!0),this._entries.set(e.filename,e);this._snapshotStorage=new c(this._entries);const o=new a.TextWriter;await n.getData(o);for(const e of(await o.getData()).split("\n"))this.appendEvent(e);if(r){const e=new a.TextWriter;await r.getData(e);for(const t of(await e.getData()).split("\n"))this.appendEvent(t)}this._build()}async resourceForSha1(e){const t=this._entries.get("resources/"+e);if(!t)return;const s=new a.BlobWriter;return await t.getData(s),await s.getData()}storage(){return this._snapshotStorage}_build(){this.contextEntry.actions.sort(((e,t)=>e.metadata.startTime-t.metadata.startTime)),this.contextEntry.resources=this._snapshotStorage.resources()}_pageEntry(e){let t=this.pageEntries.get(e);return t||(t={screencastFrames:[]},this.pageEntries.set(e,t),this.contextEntry.pages.push(t)),t}appendEvent(e){if(!e)return;const t=this._modernize(JSON.parse(e));switch(t.type){case"context-options":this.contextEntry.browserName=t.browserName,this.contextEntry.title=t.title,this.contextEntry.platform=t.platform,this.contextEntry.wallTime=t.wallTime,this.contextEntry.options=t.options;break;case"screencast-frame":this._pageEntry(t.pageId).screencastFrames.push(t);break;case"action":!t.metadata.method.startsWith("tracing")&&(!t.metadata.internal||t.metadata.apiName)&&(t.metadata.apiName||(t.metadata.apiName=t.metadata.type+"."+t.metadata.method),this.contextEntry.actions.push(t));break;case"event":{const e=t.metadata;e.pageId&&("__create__"===e.method?this.contextEntry.objects[e.params.guid]=e.params.initializer:this.contextEntry.events.push(t));break}case"resource-snapshot":this._snapshotStorage.addResource(t.snapshot);break;case"frame-snapshot":this._snapshotStorage.addFrameSnapshot(t.snapshot)}"action"!==t.type&&"event"!==t.type||(this.contextEntry.startTime=Math.min(this.contextEntry.startTime,t.metadata.startTime),this.contextEntry.endTime=Math.max(this.contextEntry.endTime,t.metadata.endTime))}_modernize(e){if(void 0===this._version)return e;for(let t=this._version;t<n.VERSION;++t)e=this[`_modernize_${t}_to_${t+1}`].call(this,e);return e}_modernize_0_to_1(e){return"action"===e.type&&"string"==typeof e.metadata.error&&(e.metadata.error={error:{name:"Error",message:e.metadata.error}}),e}_modernize_1_to_2(e){return"frame-snapshot"===e.type&&e.snapshot.isMainFrame&&(e.snapshot.viewport=this.contextEntry.options.viewport||{width:1280,height:720}),e}_modernize_2_to_3(e){if("resource-snapshot"===e.type&&!e.snapshot.request){const t=e.snapshot;e.snapshot={_frameref:t.frameId,request:{url:t.url,method:t.method,headers:t.requestHeaders,postData:t.requestSha1?{_sha1:t.requestSha1}:void 0},response:{status:t.status,headers:t.responseHeaders,content:{mimeType:t.contentType,_sha1:t.responseSha1}},_monotonicTime:t.timestamp}}return e}};class c extends r.BaseSnapshotStorage{constructor(e){super(),this._entries=void 0,this._entries=e}async resourceContent(e){const t=this._entries.get("resources/"+e),s=new a.BlobWriter;return await t.getData(s),s.getData()}}t.PersistentSnapshotStorage=c},187:e=>{var t,s="object"==typeof Reflect?Reflect:null,n=s&&"function"==typeof s.apply?s.apply:function(e,t,s){return Function.prototype.apply.call(e,t,s)};t=s&&"function"==typeof s.ownKeys?s.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var r=Number.isNaN||function(e){return e!=e};function o(){o.init.call(this)}e.exports=o,e.exports.once=function(e,t){return new Promise((function(s,n){function r(s){e.removeListener(t,o),n(s)}function o(){"function"==typeof e.removeListener&&e.removeListener("error",r),s([].slice.call(arguments))}m(e,t,o,{once:!0}),"error"!==t&&function(e,t,s){"function"==typeof e.on&&m(e,"error",t,{once:!0})}(e,r)}))},o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var i=10;function a(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function c(e){return void 0===e._maxListeners?o.defaultMaxListeners:e._maxListeners}function h(e,t,s,n){var r,o,i,h;if(a(s),void 0===(o=e._events)?(o=e._events=Object.create(null),e._eventsCount=0):(void 0!==o.newListener&&(e.emit("newListener",t,s.listener?s.listener:s),o=e._events),i=o[t]),void 0===i)i=o[t]=s,++e._eventsCount;else if("function"==typeof i?i=o[t]=n?[s,i]:[i,s]:n?i.unshift(s):i.push(s),(r=c(e))>0&&i.length>r&&!i.warned){i.warned=!0;var p=new Error("Possible EventEmitter memory leak detected. "+i.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");p.name="MaxListenersExceededWarning",p.emitter=e,p.type=t,p.count=i.length,h=p,console&&console.warn&&console.warn(h)}return e}function p(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function u(e,t,s){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:s},r=p.bind(n);return r.listener=s,n.wrapFn=r,r}function l(e,t,s){var n=e._events;if(void 0===n)return[];var r=n[t];return void 0===r?[]:"function"==typeof r?s?[r.listener||r]:[r]:s?function(e){for(var t=new Array(e.length),s=0;s<t.length;++s)t[s]=e[s].listener||e[s];return t}(r):d(r,r.length)}function f(e){var t=this._events;if(void 0!==t){var s=t[e];if("function"==typeof s)return 1;if(void 0!==s)return s.length}return 0}function d(e,t){for(var s=new Array(t),n=0;n<t;++n)s[n]=e[n];return s}function m(e,t,s,n){if("function"==typeof e.on)n.once?e.once(t,s):e.on(t,s);else{if("function"!=typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,(function r(o){n.once&&e.removeEventListener(t,r),s(o)}))}}Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return i},set:function(e){if("number"!=typeof e||e<0||r(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");i=e}}),o.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||r(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},o.prototype.getMaxListeners=function(){return c(this)},o.prototype.emit=function(e){for(var t=[],s=1;s<arguments.length;s++)t.push(arguments[s]);var r="error"===e,o=this._events;if(void 0!==o)r=r&&void 0===o.error;else if(!r)return!1;if(r){var i;if(t.length>0&&(i=t[0]),i instanceof Error)throw i;var a=new Error("Unhandled error."+(i?" ("+i.message+")":""));throw a.context=i,a}var c=o[e];if(void 0===c)return!1;if("function"==typeof c)n(c,this,t);else{var h=c.length,p=d(c,h);for(s=0;s<h;++s)n(p[s],this,t)}return!0},o.prototype.addListener=function(e,t){return h(this,e,t,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(e,t){return h(this,e,t,!0)},o.prototype.once=function(e,t){return a(t),this.on(e,u(this,e,t)),this},o.prototype.prependOnceListener=function(e,t){return a(t),this.prependListener(e,u(this,e,t)),this},o.prototype.removeListener=function(e,t){var s,n,r,o,i;if(a(t),void 0===(n=this._events))return this;if(void 0===(s=n[e]))return this;if(s===t||s.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,s.listener||t));else if("function"!=typeof s){for(r=-1,o=s.length-1;o>=0;o--)if(s[o]===t||s[o].listener===t){i=s[o].listener,r=o;break}if(r<0)return this;0===r?s.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(s,r),1===s.length&&(n[e]=s[0]),void 0!==n.removeListener&&this.emit("removeListener",e,i||t)}return this},o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=function(e){var t,s,n;if(void 0===(s=this._events))return this;if(void 0===s.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==s[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete s[e]),this;if(0===arguments.length){var r,o=Object.keys(s);for(n=0;n<o.length;++n)"removeListener"!==(r=o[n])&&this.removeAllListeners(r);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=s[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},o.prototype.listeners=function(e){return l(this,e,!0)},o.prototype.rawListeners=function(e){return l(this,e,!1)},o.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):f.call(e,t)},o.prototype.listenerCount=f,o.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}}},t={};function s(n){var r=t[n];if(void 0!==r)return r.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,s),o.exports}(()=>{var e=s(507),t=s(606);self.addEventListener("install",(function(e){self.skipWaiting()})),self.addEventListener("activate",(function(e){e.waitUntil(self.clients.claim())}));const n=new URL(self.registration.scope).pathname,r=new Map;async function o(s){const o=s.request,i=await self.clients.get(s.clientId);if(o.url.startsWith(self.registration.scope)){const a=new URL(o.url),c=a.pathname.substring(n.length-1);if("/ping"===c)return await async function(){const e=new Set;for(const[t,s]of r)await self.clients.get(s.clientId)&&e.add(t);for(const t of r.keys())e.has(t)||r.delete(t)}(),new Response(null,{status:200});const h=a.searchParams.get("trace"),{snapshotServer:p}=r.get(h)||{};if("/context"===c)try{const n=await async function(s,n,o){const a=r.get(s);if(a)return a.traceModel;const c=new t.TraceModel;let h=s.startsWith("http")||s.startsWith("blob")?s:`file?path=${s}`;h.startsWith("https://www.dropbox.com/")&&(h="https://dl.dropboxusercontent.com/"+h.substring("https://www.dropbox.com/".length)),await c.load(h,((e,t)=>{i.postMessage({method:"progress",params:{done:e,total:t}})}));const p=new e.SnapshotServer(c.storage());return r.set(s,{traceModel:c,snapshotServer:p,clientId:n}),c}(h,s.clientId);return new Response(JSON.stringify(n.contextEntry),{status:200,headers:{"Content-Type":"application/json"}})}catch(e){console.error(e);const t=a.searchParams.get("traceFileName");return new Response(JSON.stringify({error:t?`Could not load trace from ${t}. Make sure to upload a valid Playwright trace.`:`Could not load trace from ${h}. Make sure a valid Playwright Trace is accessible over this url.`}),{status:500,headers:{"Content-Type":"application/json"}})}if(c.startsWith("/snapshotInfo/"))return p?p.serveSnapshotInfo(c,a.searchParams):new Response(null,{status:404});if(c.startsWith("/snapshot/"))return p?p.serveSnapshot(c,a.searchParams,o.url):new Response(null,{status:404});if(c.startsWith("/sha1/")){for(const{traceModel:e}of r.values()){const t=await e.resourceForSha1(c.slice("/sha1/".length));if(t)return new Response(t,{status:200})}return new Response(null,{status:404})}return fetch(s.request)}const a=i.url,c=new URL(a).searchParams.get("trace"),{snapshotServer:h}=r.get(c)||{};return h?h.serveResource(o.url,a):new Response(null,{status:404})}self.addEventListener("fetch",(function(e){e.respondWith(o(e))}))})()})();