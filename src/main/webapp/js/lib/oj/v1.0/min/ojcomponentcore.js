/*
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
*/
define(["ojs/ojcore","jquery","jqueryui","ojs/ojmessaging"],function(a,f){function b(b,a){f(b).find("."+k).each(function(b,d){var c=f(d),e=c.data(h);if(null!=e)for(var g=0;g<e.length;g++){var l=c.data("oj-"+e[g]);null!=l&&a(l)}})}function d(b){this.BT=function(){return b}}function c(b,a,d,c,g,h,f){var l=d,k=!1,n={};delete c[g];Object.defineProperty(c,g,{get:function(){if(k||null!=b.Tk)return l;var d=h(f?f():g);return e([a,d,l],n)},set:function(a){l=a;null!=b.Tk?n[b.Tk]=!0:k=!0},enumerable:!0})}function e(b,
a){for(var d=void 0,c=0;c<b.length;c++){var e=b[c];void 0!==e&&(d=f.isPlainObject(e)?g(f.isPlainObject(d)?[d,e]:[e],c==b.length-1?null:a,null):e)}return d}function g(b,a,d){for(var c={},e=b.length,h=0;h<e;h++)for(var l in b[h]){var k=null==a?null:null==d?l:d+"."+l;if(null==a||!a[k]){var n=b[h][l];b[h].hasOwnProperty(l)&&void 0!==n&&(c[l]=f.isPlainObject(n)?g(f.isPlainObject(c[l])?[c[l],n]:[n],a,k):n)}}return c}a.Components={};o_("Components",a.Components,a);a.Components.ux=function(b){a.Components.GA=
f.widget.extend(a.Components.GA||{},b)};o_("Components.setDefaultOptions",a.Components.ux,a);a.Components.jG=function(){return a.Components.GA||{}};o_("Components.getDefaultOptions",a.Components.jG,a);a.Components.vj=function(b){return new d(b)};o_("Components.createDynamicPropertyGetter",a.Components.vj,a);a.Components.pr=function(b,a){var d=f(b);if(null==a){var c=d.data(h);c&&(a=c[0])}return null!=a&&(c=d[a],"function"===typeof c)?c.bind(d):null};o_("Components.getWidgetConstructor",a.Components.pr,
a);a.Components.SW=function(d){a.Aa.bG(d);b(d,function(b){b.CJ()})};a.Components.TW=function(a){b(a,function(b){b.Gy()})};a.Components.VW=function(d){a.Aa.bG(d);b(d,function(){})};a.Components.UW=function(a){b(a,function(){})};a.Components.So="data-oj-container";var h="oj-component-names",k="oj-component-initnode";f.widget("oj.baseComponent",{options:{contextMenu:null,rootAttributes:void 0},refresh:function(){this.$m=null},_createWidget:function(b,a){this.mD=this.options||{};this.kA=b||{};this._super(b,
a)},aK:function(){var b=this.options.rootAttributes;if(b){var a=this.widget();if(null!=a){var d=b["class"];d&&a.addClass(d);if(d=b.style){var c=a.attr("style");c?a.attr("style",c+";"+d):a.attr("style",d)}b=f.extend({},b);delete b["class"];delete b.style;a.attr(b);delete b.id;b=Object.keys(b);if(b.length)throw Error("Unsupported values passed to rootAttributes option: "+b.toString());}}},_create:function(){this.Wy(this.element);this._InitOptions(this.mD,this.kA);delete this.mD;delete this.kA;this._ComponentCreate();
this.Oj()},_InitOptions:function(b,a){this.VR(b,a)},_ComponentCreate:function(){this.activeable=f();this.element.addClass(k);var b=this.element,a=this.widgetName,d=b.data(h);d||(d=[],b.data(h,d));0>d.indexOf(a)&&d.push(a)},Oj:function(){this.aK();this.rw=this.eventNamespace+"contextMenu";this.LE()},Wy:function(b){var a=this;this.Cv=[];f.each(b,function(b,d){var c={},e=d.attributes;a.Cv.push({element:d,attributes:c});f.each(e,function(b,a){var e=a.name;c[e]={attr:a.value,prop:f(d).prop(e)}})})},js:function(b){var a=
this.Cv;b=b[0];for(var d=0,c=a.length;d<c;d++){var e=a[d];if(e.element===b)return e.attributes}return{}},XJ:function(){f.each(this.Cv,function(b,a){var d=f(a.element),c=a.attributes;if(1===d.length){for(var e=a.element.attributes,g=[],h=0,l=e.length;h<l;h++)e[h].name in c||g.push(e[h].name);h=0;for(l=g.length;h<l;h++)d.removeAttr(g[h]);for(var k in c)d.attr(k,c[k].attr)}})},ly:function(){return this.widgetFullName},C:function(b,d){var c={},e;2<arguments.length?c=Array.prototype.slice.call(arguments,
1):2==arguments.length&&(c=arguments[1],"object"===typeof c||c instanceof Array||(c=[c]));e=this.option(n+b);return null==e?b:a.da.pb(e.toString(),c)},getNodeBySubId:function(b){return null==b||null==b.subId?this.element?this.element[0]:null:null},getSubIdByNode:function(){return null},destroy:function(){this.nF();this._super();this.element.removeClass(k);this.widget().removeClass("oj-disabled");this.hoverable.removeClass("oj-hover");this.focusable.removeClass("oj-focus");this.activeable.removeClass("oj-active");
var b=this.element,a=this.widgetName,d=b.data(h);d&&(a=d.indexOf(a),0<=a&&(d.splice(a,1),0===d.length&&b.removeData(h)))},option:function(b,a){if(0===arguments.length)return f.widget.extend({},this.options);var d=arguments[0],c=d,e=null,g={};if("string"===typeof d){var c={},h=d.split("."),d=h.shift();if(h.length){var e=h.join("."),l;try{1<arguments.length&&(this.Tk=e),l=c[d]=f.widget.extend({},this.options[d])}finally{this.Tk=null}for(d=0;d<h.length-1;d++)l[h[d]]=l[h[d]]||{},l=l[h[d]];d=h.pop();if(1===
arguments.length)return void 0===l[d]?null:l[d];l[d]=a}else{if(1===arguments.length)return void 0===this.options[d]?null:this.options[d];c[d]=a}g=arguments[2]||g}else g=arguments[1]||g;null!=e&&(g=f.widget.extend({},g,{subkey:e}));this._setOptions(c,g);return this},_setOptions:function(b,a){for(var d in b)this._setOption(d,b[d],a);return this},_setOption:function(b,a,d){if("disabled"===b)this.options[b]=a,this.widget().toggleClass("oj-disabled",!!a).attr("aria-disabled",a),a&&(this.hoverable.removeClass("oj-hover"),
this.focusable.removeClass("oj-focus"),this.activeable||(this.activeable=f()),this.activeable.removeClass("oj-active"));else{try{var c=null==d?null:d.subkey;null!=c&&(this.Tk=c);this._super(b,a)}finally{this.Tk=null}"contextMenu"===b&&this.LE()}return this},LE:function(){this.nF();var b=this.options.contextMenu;b||(b=this.element.attr("contextmenu"))&&(b="#"+b);b&&(b=f(b).data("oj-ojMenu"));if(b){var a=this;this.JC().on("keydown"+this.rw+" contextmenu"+this.rw,function(d){return"contextmenu"===d.type||
121==d.which&&d.shiftKey?(a.Zg(b,d),!1):!0})}},nF:function(){this.JC().off(this.rw)},Zg:function(b,a){b.show(a,{launcher:this.element,focus:"menu"})},JC:function(){var b=this.widget();return b?b:f()},_hoverable:function(b){this.hoverable=this.hoverable.add(b);this._on(b,{mouseenter:function(b){f(b.currentTarget).addClass("oj-hover")},mouseleave:function(b){f(b.currentTarget).removeClass("oj-hover")}})},_focusable:function(b){this.focusable=this.focusable.add(b);this._on(b,{focusin:function(b){f(b.currentTarget).addClass("oj-focus")},
focusout:function(b){f(b.currentTarget).removeClass("oj-focus")}})},Hs:function(b){this.activeable=this.activeable.add(b);this._on(b,{mousedown:function(b){f(b.currentTarget).addClass("oj-active")},mouseup:function(b){f(b.currentTarget).removeClass("oj-active")}})},Hc:function(b){return this.option(n+b)},uc:function(){var b=document.documentElement.getAttribute("dir");b&&(b=b.toLowerCase());return"rtl"===b?"rtl":"ltr"},CJ:function(){this.$m=null},Gy:function(){this.$m=null},uV:function(){},tV:function(){},
dO:function(){var b=[],d=this,c=0;this.lF(function(e){e=0==c?d.ly():e.widgetFullName;c++;var g=a.da.ir(e);null==g||f.isEmptyObject(g)||b.push(e)});var e=b.length;return 0<e?function(){if(1==e)return a.da.ir(b[0]);for(var d={},c=e-1;0<=c;c--)f.widget.extend(d,a.da.ir(b[c]));return d}:null},qN:function(){if(!this.$m){var b={};this.$m=b;for(var d=this.element[0],c=[];d;){var e=d.getAttribute,e=e?e.call(d,a.Components.So):null;null!=e&&c.push(e);d=d.parentNode}b.containers=c}return this.$m},VR:function(b,
a){var d=this.options,e=this.dO(),g=a[l];null==e||void 0!==g&&!f.isPlainObject(g)||c(this,void 0,a[l],d,l,e);this.GP(b,a)},GP:function(b,g){var h=this.options,p={},l=[];this.lF(function(b){l.push(b.widgetName)});var k=a.Components.jG();l.push("default");for(var n=l.length-1;0<=n;n--){var v=k[l[n]];void 0!==v&&(p=f.widget.extend(p,v))}if(!f.isEmptyObject(p)){var w=this,k=function(){return w.qN()},x;for(x in p)if(n=g[x],void 0===n||f.isPlainObject(n))v=p[x],null!=v&&v instanceof d?(v=v.BT(),f.isFunction(v)?
c(this,b[x],n,h,x,v,k):a.T.error("Dynamic getter for property %s is not a function",x)):h[x]=e([b[x],v,n])}},lF:function(b){for(var a=this.constructor.prototype;null!=a&&"oj"===a.namespace;)b(a),a=Object.getPrototypeOf(a)}});a.Fa=function(b,a,d){f.widget(b,a,d);if("oj.oj"===b.substring(0,5)||"oj._oj"===b.substring(0,6)){a=b.split(".");b=a[0];a=a[1];var c=b+"-"+a;f.expr[":"][("_"===a.substring(0,1)?"_"+b+"-"+a.substring(3):b+"-"+a.substring(2)).toLowerCase()]=function(b){return!!f.data(b,c)}}};var l=
"translations",n=l+".";a.Aa={};a.Aa.YI="\\x3chtml\\x3e";a.Aa.XI="\\x3c/html\\x3e";a.Aa.sJ={SPAN:1,B:1,A:1,I:1,EM:1,BR:1,HR:1,LI:1,OL:1,UL:1,P:1,TT:1,BIG:1,SMALL:1,PRE:1};a.Aa.rJ={"class":1,style:1,href:1};a.Aa.hU=function(b){return 0===b.indexOf(a.Aa.YI)&&b.lastIndexOf(a.Aa.XI)===b.length-7?!0:!1};a.Aa.$S=function(b){var d=f(document.createElement("span")).get(0);(d.innerHTML=b)&&0<=b.indexOf("\\x3c")&&a.Aa.bA(d);return d};a.Aa.bA=function(b){for(var d=b.childNodes,c,e,g,h,l,k=d.length-1;0<=k;)if(c=
d.item(k),1===c.nodeType){if(a.Aa.sJ[c.nodeName])for(e=c.attributes,l=e.length-1;0<=l;l--)g=e[l],(h=void 0!==f(c).attr(g))&&(a.Aa.rJ[g.name]||c.removeAttribute(g.nodeName));a.Aa.bA(c)}else b.removeChild(c)};a.Aa.gU=function(b,d){a.i.$e(b);a.i.$e(d);for(var c=d.parentNode;c;){if(c==b)return!0;c=c.parentNode}return!1};a.Aa.Mn=function(b,d){a.i.$e(b);a.i.$e(d);return d==b?!0:a.Aa.gU(b,d)};a.Aa.bh=function(b,d){var c=f(b),e=c.data(a.Aa.Sl);null==e&&(e=new a.Aa.WJ(b),c.data(a.Aa.Sl,e),e.start());e.addListener(d)};
a.Aa.vl=function(b,d){var c=f(b),e=c.data(a.Aa.Sl);null!=e&&(e.removeListener(d),e.isEmpty()&&(e.stop(),c.removeData(a.Aa.Sl)))};a.Aa.bG=function(b){f(b).find(".oj-helper-detect-expansion").parent().each(function(b,d){var c=f(d).data(a.Aa.Sl);null!=c&&c.LF(!1)})};a.Aa.nP=(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(b){return window.setTimeout(b,0)}).bind(window);a.Aa.WJ=function(b){this.oq=jQuery.Callbacks();this.addListener=function(b){this.oq.add(b)};
this.removeListener=function(b){this.oq.remove(b)};this.isEmpty=function(){return this.oq.empty()};this.start=function(){var a=b.childNodes[0],d=this.fk=document.createElement("div");d.className="oj-helper-detect-expansion";var c=document.createElement("div");d.appendChild(c);b.insertBefore(d,a);this.Dq=this.yu.bind(this);d.addEventListener("scroll",this.Dq,!1);c=this.yp=document.createElement("div");c.className="oj-helper-detect-contraction";var e=document.createElement("div");e.style.width="200%";
e.style.height="200%";c.appendChild(e);b.insertBefore(c,a);c.addEventListener("scroll",this.Dq,!1);null!=d.offsetParent&&this.Js(d.offsetWidth,d.offsetHeight)};this.stop=function(){this.fk.removeEventListener("scroll",this.Dq);this.yp.removeEventListener("scroll",this.Dq);b.removeChild(this.fk);b.removeChild(this.yp)};this.LF=function(b){var d=this.fk;if(null!=d.offsetParent){var c=d.offsetWidth,e=d.offsetHeight;if(this.hQ!==c||this.gQ!==e){this.nE=2;this.Js(c,e);var g=this.oq;a.Aa.nP(function(){g.fire(c,
e)})}else b&&0<this.nE&&(0==d.scrollLeft||0==d.scrollTop)&&(this.nE--,this.Js(c,e))}};this.yu=function(b){b.stopPropagation();this.LF(!0)};this.Js=function(b,a){this.hQ=b;this.gQ=a;var d=this.fk.firstChild;d.style.width=b+1+"px";d.style.height=a+1+"px";this.fk.scrollLeft=1;this.fk.scrollTop=1;this.yp.scrollLeft=b;this.yp.scrollTop=a}};a.Aa.Sl="_ojResizeTracker";a.Sa=function(b){this.Init(b)};a.b.oa(a.Sa,a.b,"oj.ComponentMessaging");a.Sa.ed={NONE:"none",Ao:"notewindow",Hl:"placeholder"};a.Sa.fs={};
a.Sa.nx=function(b,d){b&&"function"===typeof d&&(a.Sa.fs[b]=d)};a.Sa.prototype.Init=function(b){a.Sa.t.Init.call(this);this.ta=b;this.Wl=!1;this.lP()};a.Sa.prototype.hi=function(b,d){var c=this;a.i.Pd(d);this.Wl?this.JQ(b,d):(f.each(this.ei,function(a,e){e.hi(c.ta,b,d)}),this.Wl=!0)};a.Sa.prototype.update=function(b){a.i.Pd(b);a.i.EF(this.Wl);this.Wl&&f.each(this.ei,function(a,d){d.update(b)})};a.Sa.prototype.ng=function(b){a.i.Pd(b);f.each(this.ei,function(a,d){d.ng(b)});this.Wl=!1;this.ei={}};a.Sa.prototype.getNodeBySubId=
function(b,a){var d=null;f.each(this.ei,function(c,e){d||(d=e.getNodeBySubId(b,a))});return d};a.Sa.prototype.vp=function(b,d){return new (a.Sa.fs[b]||a.Sa.fs[a.Sa.ed.NONE])(d)};a.Sa.prototype.MB=function(){var b={},d=!1,c=this.ta.options.placeholder,e,g={},h=this;f.each(this.ta.options.messagingDisplayOptions||{},function(b,l){d=!1;e=b+"";Array.isArray(l)?f.each(l,function(b,a){d||(d=h.jE(e,a,c,g))}):"string"===typeof l&&(d||(d=h.jE(e,l,c,g)));d||(g[e]=a.Sa.ed.NONE)});f.each(a.Sa.ed,function(a,d){b[d]=
[]});f.each(g,function(a,d){b[d].push(a)});return b};a.Sa.prototype.jE=function(b,d,c,e){var g=!1;switch(d){case a.Sa.ed.Hl:"converterHint"!==b||g||c||(e[b]=d,g=!0);break;default:g||(e[b]=d,g=!0)}return g};a.Sa.prototype.lP=function(){var b=this.MB(),d=b[a.Sa.ed.Ao],c=b[a.Sa.ed.NONE],b=b[a.Sa.ed.Hl],e={};0<d.length&&(e[a.Sa.ed.Ao]=this.vp(a.Sa.ed.Ao,d));0<b.length&&(e[a.Sa.ed.Hl]=this.vp(a.Sa.ed.Hl,b));e[a.Sa.ed.NONE]=this.vp(a.Sa.ed.NONE,c);this.ei=e};a.Sa.prototype.JQ=function(b,d){var c=this.MB(),
e,g=this;f.each(c,function(c,h){c+="";e=g.ei[c];h&&0<h.length?e?e&&e.CU(h,d):(e=g.vp(c,h),g.ei[c]=e,e.hi(g.ta,b,d)):e&&a.Sa.ed.NONE!==c&&(e.ng(d),delete g.ei[c])})};a.Vb=function(b){this.Init(b)};a.b.oa(a.Vb,a.b,"oj.MessagingStrategy");a.Vb.prototype.Init=function(b){a.i.gw(b);a.Vb.t.Init.call(this);this.zp=b};a.Vb.prototype.hi=function(b,a,d){this.gb=a;this.ta=b;this.rF(d)};a.Vb.prototype.update=function(b){this.rF(b)};a.Vb.prototype.ng=function(){this.ta=this.gb=null};a.Vb.prototype.CU=function(b,
a){this.Init(b);this.update(a)};a.Vb.prototype.getNodeBySubId=function(){return null};a.Vb.prototype.Ox=function(){return this.Sr().getMessages()};a.Vb.prototype.Nx=function(){return this.Sr().gh()};a.Vb.prototype.Mx=function(){var b=[],a=this.Tm.converterHint;a&&b.push(a);return b};a.Vb.prototype.hI=function(){var b=[];f.each(this.Tm.validatorHint||[],function(a,d){b.push(d)});return b};a.Vb.prototype.gI=function(){return this.Tm.title||""};a.Vb.prototype.Sr=function(){return this.Tm.validityState};
a.Vb.prototype.Px=function(){var b=this.Ox();return b&&0<b.length?!0:!1};a.Vb.prototype.vI=function(){return-1!==this.zp.indexOf("messages")?!0:!1};a.Vb.prototype.Xr=function(){return-1!==this.zp.indexOf("converterHint")?!0:!1};a.Vb.prototype.Wx=function(){return-1!==this.zp.indexOf("validatorHint")?!0:!1};a.Vb.prototype.Vx=function(){return-1!==this.zp.indexOf("title")?!0:!1};a.Vb.prototype.iI=function(){return this.Sr().Sw()};a.Vb.prototype.rF=function(b){this.Tm=f.extend(this.Tm||{},b)};a.td=function(b){this.Init(b)};
a.Sa.nx(a.Sa.ed.NONE,a.td);a.td.Uo="oj-invalid";a.td.Vo="oj-warning";a.b.oa(a.td,a.Vb,"oj.DefaultMessagingStrategy");a.td.prototype.update=function(b){var d=this.gb,c=this.Nx(),e=[],g=[],h=!1,f=this.ta,l=f.widget();a.td.t.update.call(this,f,d,b);d&&(this.iI()?(e.push(a.td.Vo),g.push(a.td.Uo),h=!0):this.Px()&&c===a.N.kb.WARNING?(e.push(a.td.Uo),g.push(a.td.Vo)):(e.push(a.td.Uo),e.push(a.td.Vo)),l.removeClass(e.join(" ")).addClass(g.join(" ")),d.attr({"aria-invalid":h}))};a.td.prototype.ng=function(b){this.ta.widget().removeClass(a.td.Uo).removeClass(a.td.Vo);
this.gb.removeAttr("aria-invalid");a.td.t.ng.call(this,b)};a.Qe=function(b){this.Init(b)};a.Sa.nx(a.Sa.ed.Hl,a.Qe);a.b.oa(a.Qe,a.Vb,"oj.PlaceholderMessagingStrategy");a.Qe.prototype.Init=function(b){a.Qe.t.Init.call(this,b)};a.Qe.prototype.hi=function(b,d,c){a.Qe.t.hi.call(this,b,d,c);this.ND()};a.Qe.prototype.update=function(b){a.Qe.t.update.call(this,b);this.ND()};a.Qe.prototype.ng=function(b){a.Qe.t.ng.call(this,b)};a.Qe.prototype.ND=function(){var b=this.gb;this.ta.widget();if(this.wI()&&b&&(b=
this.Mx(),b=b.length?b[0]:"")){var a={},d={};a.placeholder=b;d._oj_messaging_update=!0;this.ta.option(a,d)}};a.Qe.prototype.wI=function(){return this.Xr()};a.Me=function(b,a){this.Init(b,a)};a.Me.Sw=function(b){return a.N.gh(b)>=a.N.kb.ERROR?!0:!1};a.b.oa(a.Me,a.b,"oj.ComponentValidity");a.Me.prototype.Init=function(b,d){a.Me.t.Init.call(this);this.rC(d)};a.Me.prototype.Sw=function(){return this.zk};a.Me.prototype.getMessages=function(){return this.Wu};a.Me.prototype.gh=function(){return this.RP};
a.Me.prototype.update=function(b,a){this.rC(a)};a.Me.prototype.rC=function(b){this.uL=b;this.Wu=this.Vt();this.RP=a.N.gh(this.Wu);this.zk=a.Me.Sw(this.Wu)};a.Me.prototype.Vt=function(){var b=this.uL||[],d=[],c,e;for(e in b)c=b[e],c instanceof a.Tb&&!c.wn()||d.push(c);return d};a.Kl={};o_("Test",a.Kl,a);a.Kl.ready=!1;o_("Test.ready",a.Kl.ready,a);a.Kl.tT=function(b){var d=b;if(a.fb.Fd(b))try{d=f.parseJSON(b)}catch(c){return null}return d&&d.element&&(b=f(d.element))?a.Components.pr(b[0],d.component)("getNodeBySubId",
{subId:d.subId}):null};o_("Test.domNodeForLocator",a.Kl.tT,a);f(document).ready(function(){var b=f("\x3cdiv style\x3d'border: 1px solid;border-color:red green;position: absolute;top: -999px;background-image: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs\x3d);'\x3e\x3c/div\x3e"),a;b.appendTo("body");a=b.css("backgroundImage");b.css("borderTopColor")!=b.css("borderRightColor")&&(null==a||"none"!=a&&"url (invalid-url:)"!=a)||f("body").addClass("oj-hicontrast");b.remove()});
f(document).ready(function(){"Microsoft Internet Explorer"==navigator.appName&&f("html").addClass("oj-slow-borderradius oj-slow-cssgradients oj-slow-boxshadow")});a.Eg={};a.Eg.co=function(b,d){a.i.Pd(b,"position");for(var c=f.extend({},b),e=0;e<a.Eg.$x.length;e++){var g=a.Eg.$x[e],h=c[g];h&&(c[g]=h.replace("start",d?"right":"left").replace("end",d?"left":"right"))}return c};a.Eg.$x=["my","at"]});
//# sourceMappingURL=oj-modular.map