(()=>{"use strict";function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}var t=app._cache,n=t.parser,o=function(){function o(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),this._timer=null,this._ready=!1,this._first=!0,this._create()}var a,i,c;return a=o,(i=[{key:"_create",value:function(){var e=this;this.root=dom.create("div",{className:"cc-body",style:{display:"none"}}),this.root.addEventListener("click",(function(e){var t=e.target,n=dom.getAttr(t,"cc-action");n&&app.doAction(n,t,e)})),this.container=dom.create("div",{className:"cc-container"}),this.root.appendChild(this.container),document.documentElement.appendChild(this.root),this.styleSheet=dom.create("style",{title:"cc-stylesheet",textContent:t.plugins.render.css}),document.head.appendChild(this.styleSheet),this.styleSheet.disabled=!0,document.addEventListener("keyup",(function(t){27===(t.keyCode||t.which)&&e.hide()}))}},{key:"bootstrap",value:function(e){var n=this;api.send("option",{execute:"all"},(function(o){var a=o.error,i=o.data;if(a)app.doAction("error",a);else{var c=i||{},r=c.theme,l=c.hidepaper;(!utils.isBoolean(l)||!l)&&n.root.classList.add("cc-pager"),t.theme=r,n.theme(r),n.renderToolbar(),api.send("plugin",{execute:"all"},(function(t){var o=t.error,a=t.data;if(o)app.doAction("error",o);else{var i=[],c=[];utils.each(a,(function(e){switch(e.type){case"toolbar":c.push(e);break;case"render":i.push(e)}}));var r=i.length+c.length;if(r<=0)n.renderContent(e);else{var l=0;c.sort((function(e,t){return e.name.charCodeAt(0)-t.name.charCodeAt(0)})).forEach((function(t){n.toolbar.appendChild(dom.create("a",{"data-tooltip":t.desc,"cc-action":t.name,innerHTML:t.icon})),app.loadPlugin(t.name,(function(){++l>=r&&n.renderContent(e)}))})),i.forEach((function(t){app.loadPlugin(t.name,(function(){++l>=r&&n.renderContent(e)}))}))}}}))}}))}},{key:"start",value:function(){this._ready?this.hide():this.show()}},{key:"reset",value:function(){this.container.innerHTML=""}},{key:"theme",value:function(e,t){if(utils.isPlainObject(e))utils.each(e,(function(e,t){"preset"!==t&&("custom"===t?utils.each(e,(function(e,t){document.documentElement.style.setProperty("--cc-".concat(t),e)})):"default"===e?document.documentElement.style.removeProperty("--cc-".concat(t)):document.documentElement.style.setProperty("--cc-".concat(t),e))}));else{if("preset"===e)return;"custom"===e?utils.each(t,(function(e,t){document.documentElement.style.setProperty("--cc-".concat(t),e)})):"default"===t?document.documentElement.style.removeProperty("--cc-".concat(e)):document.documentElement.style.setProperty("--cc-".concat(e),t)}}},{key:"_validate",value:function(e){var t=e.childNodes;if(t.length>8)return e;var n,o=0;return utils.each(t,(function(e){switch(e.nodeType){case 1:!dom.tag(e,"img")&&dom.nodeText(e).length>0&&(n=e,o++);break;case 3:e.nodeValue.trim().length>0&&o++}})),1===o?n:e}},{key:"append",value:function(){var e=n._url,t=n._title,o=n._article;if(t&&o){var a=utils.isElement(t)?dom.nodeText(t):t,i=utils.isElement(o)?this._validate(o).innerHTML:o,c=dom.create("div",{"data-cc":"page"}),r=dom.create("h1",{"data-cc":"title"});r.appendChild(dom.create("a",{target:"_blank",href:e,innerText:a}));var l=dom.create("div",{"data-cc":"article",innerHTML:i});c.appendChild(r),c.appendChild(l),this.container.appendChild(c),this._first?(this._first=!1,this.root.scrollTo(0,0)):this.root.scrollBy({top:280,left:0,behavior:"smooth"}),n._title=null,n._article=null,app.doAction("loading",!1),app.doAction("append",l,r)}}},{key:"show",value:function(){this._ready||(this._ready=!0,this.styleSheet.disabled=!1,dom.disableStyleSheets(!0,(function(e){return"cc-stylesheet"!==e.title})),dom.setStyle(this.root,"display","block"),api.send("cc-active"),app.doAction("show"))}},{key:"hide",value:function(){this._ready&&(this._ready=!1,dom.disableStyleSheets(!1,(function(e){return"cc-stylesheet"!==e.title})),this.styleSheet.disabled=!0,dom.setStyle(this.root,"display","none"),api.send("cc-inactive"),app.doAction("hide"))}},{key:"renderContent",value:function(e){e&&e(),this.append(),this.root.appendChild(dom.create("div",{"data-cc":"copyright",innerText:"本文由 Circle 渲染生成，版权归原文所有"}))}},{key:"renderToolbar",value:function(){this.toolbar=dom.create("div",{"data-cc":"toolbar"}),this.toolbar.appendChild(dom.create("a",{"data-tooltip":api.i18n.getMessage("setting"),"cc-action":"setting",innerHTML:'<svg viewBox="0 0 1024 1024"><path d="M381.482667 673.877333a90.389333 90.389333 0 0 1 85.226666 60.245334H853.333333v64H465.28a90.389333 90.389333 0 0 1-167.573333 0H170.666667v-64h125.610666a90.389333 90.389333 0 0 1 85.205334-60.245334z m0 64a26.346667 26.346667 0 1 0 0 52.693334 26.346667 26.346667 0 0 0 0-52.693334z m261.034666-304.938666a90.389333 90.389333 0 0 1 85.205334 60.245333H853.333333v64h-127.04a90.389333 90.389333 0 0 1-167.573333 0H170.666667v-64h386.624a90.389333 90.389333 0 0 1 85.226666-60.245333z m0 64a26.346667 26.346667 0 1 0 0 52.693333 26.346667 26.346667 0 0 0 0-52.693333zM381.482667 192a90.389333 90.389333 0 0 1 85.226666 60.224H853.333333v64H465.28a90.389333 90.389333 0 0 1-167.573333 0H170.666667v-64h125.610666A90.389333 90.389333 0 0 1 381.482667 192z m0 64a26.346667 26.346667 0 1 0 0 52.693333 26.346667 26.346667 0 0 0 0-52.693333z"></path></svg>'})),this.root.appendChild(this.toolbar)}}])&&e(a.prototype,i),c&&e(a,c),o}();function a(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function i(e){var t=0;if(utils.each(e.childNodes,(function(e){switch(e.nodeType){case 1:(dom.tag(e,"img")||dom.nodeText(e).length>0||e.getElementsByTagName("img").length>0)&&t++;break;case 3:e.nodeValue.trim().length>0&&t++}})),!(t>0)){var n=e.parentElement;dom.remove(e),n&&i(n)}}function c(e){var t=e.naturalWidth,n=e.naturalHeight;(t>200||n>200)&&(e.classList.add("cc-block-img"),dom.setAttr(e,"cc-action","cc-large-img"))}var r=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}var t,n,o;return t=e,(n=[{key:"init",value:function(e,t){this.lazyImg(e),this.removeNode(e),this.removeAttrs(e),this.removeTitle(e,t)}},{key:"lazyImg",value:function(e){utils.each(e.querySelectorAll("img"),(function(e){var t;e.onerror=function(){dom.remove(e)},utils.each(e.attributes,(function(e){var n="".concat(e.nodeValue);"src"!==e.nodeName&&n.split("/").length>2&&n.length>10&&(t=n.split(/\s/).shift())})),t&&dom.getAttr(e,"src")!==t&&dom.setAttr(e,"src",t),dom.getAttr(e,"src")?(e.complete&&c(e),e.addEventListener("load",(function(){c(e)}))):dom.remove(e)}))}},{key:"removeNode",value:function(e){utils.each(e.querySelectorAll(["link","script","iframe","form","button","textarea","input"].join(",")),(function(e){dom.remove(e)})),utils.each(e.querySelectorAll(["div","table","font","p","span"].join(",")),(function(e){i(e)}));var t=e.lastElementChild;!dom.tag(t,"img")&&dom.nodeText(t).length<=0&&t.getElementsByTagName("img").length<=0&&dom.remove(t)}},{key:"removeAttrs",value:function(e){utils.each(e.querySelectorAll(["h2","h3","div","table","font","td","p","span","br"].join(",")),(function(e){for(;e.attributes.length>0;)dom.removeAttr(e,e.attributes[0].name)})),utils.each(e.querySelectorAll("[style]"),(function(e){dom.removeAttr(e,"style")}))}},{key:"removeTitle",value:function(e,t){var n=!1,o=dom.nodeText(t);if(utils.each(e.querySelectorAll("h1"),(function(e){if(dom.nodeText(e)===o)return dom.remove(e),n=!0,!0})),!n)for(var a=0,i=e.firstChild;a<5;){a++;var c="";if(!i)break;switch(i.nodeType){case 1:c=dom.nodeText(i);break;case 3:c="".concat(i.data).trim()}c===o&&dom.remove(i),i=i.nextSibling}}}])&&a(t.prototype,n),o&&a(t,o),e}(),l=new o,d=new r;app._cache.render=l,l.start(),l.bootstrap((function(){app.addAction("append",(function(e,t){d.init(e,t)})),app.addAction("show",(function(){api.send("cc-active")})),app.addAction("hide",(function(){api.send("cc-enable")})),app.addAction("open-option-page",(function(){api.send("open-option-page")})),app.addAction("browserAction-click",(function(){l.start()})),app.addAction("close",(function(){l.hide()})),app.addAction("parser-success",(function(e){e&&l.reset(),l.append()})),app.addAction("theme",(function(e,t){l.theme(e,t)})),app.addAction("setting",(function(){app.loadPlugin("react",(function(){app.loadPlugin("setting")}))})),app.loadPlugin("loading")}))})();