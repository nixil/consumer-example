/*
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery","ojs/ojeditablevalue","ojs/ojbutton"],function(a,f){a.Fa("oj.ojInputNumber",f.oj.editableValue,{version:"1.0.0",defaultElement:"\x3cinput\x3e",widgetEventPrefix:"oj",options:{converter:a.ba.ji(a.Pf.CONVERTER_TYPE_NUMBER).createConverter(),max:void 0,min:void 0,placeholder:void 0,readOnly:void 0,step:void 0},stepUp:function(a){this.aF(a,!0)},stepDown:function(a){this.aF(a,!1)},getNodeBySubId:function(a){var d=this._super(a);d||(a=a.subId,"oj-inputnumber-up"===a&&(d=this.widget().find(".oj-inputnumber-up")[0]),
"oj-inputnumber-down"===a&&(d=this.widget().find(".oj-inputnumber-down")[0]),"oj-inputnumber-input"===a&&(d=this.widget().find(".oj-inputnumber-input")[0]));return d||null},_InitOptions:function(b,d){this._super(b,d);a.ud.vi([{attribute:"disabled",defaultOptionValue:!1,validateOption:!0},{attribute:"pattern",defaultOptionValue:""},{attribute:"placeholder",defaultOptionValue:""},{attribute:"value",defaultOptionValue:null},{attribute:"readonly",option:"readOnly",defaultOptionValue:!1,validateOption:!0},
{attribute:"required",defaultOptionValue:"optional",coerceDomValue:!0,validateOption:!0},{attribute:"title",defaultOptionValue:""},{attribute:"min",defaultOptionValue:null},{attribute:"max",defaultOptionValue:null},{attribute:"step",defaultOptionValue:1}],d,this);this.options.value=this.gt(this.options.value);null!=this.options.step&&(this.options.step=this.oD(this.options.step));null!=this.options.min&&(this.options.min=this.xq("min",this.options.min));null!=this.options.max&&(this.options.max=this.xq("max",
this.options.max));if(null!=this.options.min&&null!=this.options.max&&this.options.max<this.options.min)throw Error("max must not be less than min");},_ComponentCreate:function(){var a=this.element;this._super();"boolean"===typeof this.options.readOnly&&a.prop("readonly",this.options.readOnly);this.km();this._on(this.vf);this._on(this.window,{beforeunload:function(){a.removeAttr("autocomplete")}});a.removeAttr("pattern");this.sC={}},Oj:function(){this._super();this.JD();this.$v();this.zq("readOnly",
this.options.readOnly);this.PD("readOnly",this.options.readOnly)},_setOption:function(a,d,c){"value"===a&&(d=this.gt(d));if("max"===a||"min"===a)d=this.xq(a,d);"step"===a&&(d=this.oD(d));this._super(a,d,c);if("max"===a||"min"===a)c={min:null!=this.options.min?this.options.min:void 0,max:null!=this.options.max?this.options.max:void 0,converter:this.wd()},this.sA(c),this.Tl();"disabled"===a&&this.element.prop("disabled",!!d);"readOnly"===a&&(this.element.prop("readonly",!!d),this.zq("readOnly",this.options.readOnly),
this.PD("readOnly",this.options.readOnly))},_destroy:function(){this.element.removeClass("oj-inputnumber-input").prop("disabled",!1).removeAttr("autocomplete").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow").removeAttr("aria-valuetext").removeAttr("aria-disabled");this.element.attr("type",this.saveType);this._super();this._off(this.element,"keydown keyup focus blur mousedown mouseup mouseenter mouseleave");this.qo.replaceWith(this.element);clearTimeout(this.Nf)},
ws:function(a,d){this._super(a,d);var c="value"===a||"max"===a||"min"===a;c&&this.JD();(c||"disabled"===a)&&this.$v()},iy:function(){return!this._super()||this.options.readOnly?!1:!0},Jo:function(){var a=this._superApply(arguments),d=null!=this.options.min?this.options.min:void 0,c=null!=this.options.max?this.options.max:void 0,e={};if(null!=d||null!=c)e={min:d,max:c,converter:this.wd()},this.sA(e);return f.extend(this.sC,a)},_GetDefaultStyleClass:function(){return"oj-inputnumber"},vf:{keydown:function(a){a.keyCode===
f.ui.keyCode.ENTER?(this.Jz(a),a.preventDefault()):this.Uk()&&this.hj(a)&&a.preventDefault()},keyup:function(a){this.kn(a)},focus:function(){this.previous=this.element.val()},blur:function(a){this.kw?delete this.kw:this.Jz(a)},"mousedown .oj-inputnumber-button":function(a){function d(){this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=c,this._delay(function(){this.previous=c}))}var c;c=this.element[0]===this.document[0].activeElement?this.previous:this.element.val();
a.preventDefault();d.call(this);this.kw=!0;this._delay(function(){delete this.kw;d.call(this)});this.Uk();this.en(null,f(a.currentTarget).hasClass("oj-inputnumber-up")?1:-1,a)},"mouseup .oj-inputnumber-button":function(a){this.kn(a)},"mouseenter .oj-inputnumber-button":function(a){f(a.currentTarget).hasClass("oj-active")&&(this.Uk(),this.en(null,f(a.currentTarget).hasClass("oj-inputnumber-up")?1:-1,a))},"mouseleave .oj-inputnumber-button":function(a){this.kn(a)}},Xa:{kK:"tooltipDecrement",mK:"tooltipIncrement"},
Yf:{readOnly:"oj-read-only"},km:function(){var a=this.qo=this.element.addClass("oj-inputnumber-input").attr("autocomplete","off").wrap("\x3cspan class\x3d'oj-inputnumber oj-component'\x3e\x3c/span\x3e").parent().append("\x3ca class\x3d'oj-inputnumber-button oj-inputnumber-down'\x3e\x3c/a\x3e\x3ca class\x3d'oj-inputnumber-button oj-inputnumber-up'\x3e\x3c/a\x3e");this.saveType=this.element.prop("type");this.element.attr("type","text");var d=this.C(this.Xa.mK),c=this.C(this.Xa.kK);a.find(".oj-inputnumber-up").ojButton({display:"icons",
icons:{start:"oj-component-icon oj-inputnumber-up-icon"},label:d});a.find(".oj-inputnumber-down").ojButton({display:"icons",icons:{start:"oj-component-icon oj-inputnumber-down-icon"},label:c});this.buttons=a.find(".oj-inputnumber-button").attr("tabIndex","-1").attr("aria-hidden",!0)},hj:function(a){var d=f.ui.keyCode;switch(a.keyCode){case d.UP:return this.en(null,1,a),!0;case d.DOWN:return this.en(null,-1,a),!0}return!1},lW:function(){return"\x3cspan class\x3d'oj-inputnumber oj-component'\x3e\x3c/span\x3e"},
yV:function(){return"\x3ca class\x3d'oj-inputnumber-button oj-inputnumber-down'\x3e\x3c/a\x3e\x3ca class\x3d'oj-inputnumber-button oj-inputnumber-up'\x3e\x3c/a\x3e"},Uk:function(){return this.FH=!0},en:function(a,d,c){a=a||500;clearTimeout(this.Nf);this.Nf=this._delay(function(){this.en(40,d,c)},a);this.Mv(d*this.options.step,c)},Mv:function(a,d){var c=this.zh()||0,c=this.gv(c),c=this.BK(c,a);this.ee(c,d,this.Ig.Ll)},uQ:function(){var a=this.tD(this.options.step);null!=this.options.min&&(a=Math.max(a,
this.tD(this.options.min)));return a},tD:function(a){a=a.toString();var d=a.indexOf(".");return-1===d?0:a.length-d-1},BK:function(a,d){var c,e,f=this.options,h=this.uQ();e=null!=f.min?f.min:0;c=a-e;var k=Math.round(c/f.step)*f.step,k=parseFloat(k.toFixed(h));k!==c?(c=0>d?Math.ceil(c/f.step)*f.step:Math.floor(c/f.step)*f.step,c=e+c+d):c=a+d;c=parseFloat(c.toFixed(h));return null!=f.min&&c<f.min?f.min:null!=f.max&&c>f.max?(e=Math.floor((f.max-e)/f.step)*f.step+e,e=parseFloat(e.toFixed(h))):c},kn:function(){this.FH&&
(clearTimeout(this.Nf),this.FH=!1)},$v:function(){var a;try{var d=this.zh()||0;a=this.gv(d)}catch(c){a=void 0}finally{var d=this.options.min,e=this.options.max;if(!this.qo)return;var f=this.qo.find(".oj-inputnumber-down").ojButton(),h=this.qo.find(".oj-inputnumber-up").ojButton();this.options.disabled||void 0===a?(f.ojButton("disable"),h.ojButton("disable")):null!=e&&a>=e?(f.ojButton("enable"),h.ojButton("disable")):(null!=d&&a<=d?f.ojButton("disable"):f.ojButton("enable"),h.ojButton("enable"))}},
Jz:function(a){this.kn();this.previous!==this.element.val()&&(this.$v(),this.ee(this.element.val(),a))},sA:function(b){this.sC[a.kc.VALIDATOR_TYPE_NUMBERRANGE]=a.ba.wh(a.kc.VALIDATOR_TYPE_NUMBERRANGE).createValidator(b)},gt:function(a){return null!==a?+a:a},xq:function(a,d){if(null===d)return d;var c;c="string"===typeof d&&""!==d?+d:parseFloat(d);if(isNaN(c))throw Error(a+" is not a number");return c},oD:function(a){if(null===a)return 1;a=this.xq("step",a);if(0>=a)throw Error("Invalid step; step must be \x3e 0");
if(null===a||0>=a)a=1;return a},zq:function(a,d){this.Yf.hasOwnProperty(a)&&this.widget().toggleClass(this.Yf[a],!!d)},PD:function(a,d){d?this.widget().removeAttr("role"):this.widget().attr("role","spinbutton")},JD:function(){var a=this.gt(this.options.value),d=this.element.val();this.element.attr({"aria-valuemin":this.options.min,"aria-valuemax":this.options.max,"aria-valuenow":a});this.fz(""+a,d)||this.element.attr({"aria-valuetext":d})},aF:function(a,d){this.Uk();d?this.Mv((a||1)*this.options.step):
this.Mv((a||1)*-this.options.step);this.kn()},widget:function(){return this.qo}})});
//# sourceMappingURL=oj-modular.map