/*
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
*/
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base","ojs/internal-deps/dvt/DvtGauge"],function(a,f){a.Fa("oj.dvtBaseGauge",f.oj.dvtBaseComponent,{_setOption:function(b,d){var c=this.Hz;this.Hz=!1;var e,f=!1;"string"===typeof b&&void 0!==d?"value"===b&&(f=!0,e=this.options.value):"object"===typeof b&&b&&void 0!==b.value&&(f=!0,e=this.options.value);var h=this._superApply(arguments);f&&(f=this.options.value,a.b.Ni(e,f)||this._trigger("optionChange",null,{option:"value",previousValue:e,
value:f,optionMetadata:{writeback:c?"shouldWrite":"shouldNotWrite"}}));return h},Ki:function(){var a=this._super();a["oj-gauge-metric-label"]={path:"metricLabel/style",property:"CSS_TEXT_PROPERTIES"};a["oj-gauge-tick-label"]={path:"tickLabel/style",property:"CSS_TEXT_PROPERTIES"};return a},Rl:function(){var a=this._super();a["DvtGaugeBundle.EMPTY_TEXT"]=this.vc("msgNoData");return a},Li:function(a){var d=a&&a.getType?a.getType():null;d===DvtValueChangeEvent.TYPE?(this.Hz=!0,this.option("value",a.getNewValue())):
d===DvtValueChangeEvent.TYPE_INPUT?this._trigger("input",null,{value:a.getNewValue()}):this._super(a)}});a.Fa("oj.ojStatusMeterGauge",f.oj.dvtBaseGauge,{version:"1.0.0",widgetEventPrefix:"oj",options:{input:null,optionChange:null},pf:function(a,d,c){return DvtStatusMeterGauge.newInstance(a,d,c)},Ue:function(){var a=this._super();a.push("oj-statusmetergauge");return a},Zf:function(){this.options.shortDesc=this.element.attr("title");this._super()},getMetricLabel:function(){return this.ta.getAutomation().getMetricLabel()}});
a.Fa("oj.ojLedGauge",f.oj.dvtBaseGauge,{version:"1.0.0",widgetEventPrefix:"oj",options:{},pf:function(a,d,c){return DvtLedGauge.newInstance(a,d,c)},Ue:function(){var a=this._super();a.push("oj-ledgauge");return a},Zf:function(){this.options.shortDesc=this.element.attr("title");this._super()},getMetricLabel:function(){return this.ta.getAutomation().getMetricLabel()}});a.Fa("oj.ojRatingGauge",f.oj.dvtBaseGauge,{version:"1.0.0",widgetEventPrefix:"oj",options:{input:null,optionChange:null},pf:function(a,
d,c){return DvtRatingGauge.newInstance(a,d,c)},Ue:function(){var a=this._super();a.push("oj-ratinggauge");return a},Zf:function(){this.options.shortDesc=this.element.attr("title");this._super()}});a.Fa("oj.ojDialGauge",f.oj.dvtBaseGauge,{version:"1.0.0",widgetEventPrefix:"oj",options:{input:null,optionChange:null},pf:function(a,d,c){return DvtDialGauge.newInstance(a,d,c)},Ue:function(){var a=this._super();a.push("oj-dialgauge");return a},Zf:function(){this.options.shortDesc=this.element.attr("title");
this.$J();this._super()},$J:function(){var b=this.options.background,d=this.options.indicator,c="",c="";"string"===typeof b&&(c="rectangleAlta"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/alta-rectangle-200x200.png"),width:200,height:154},{src:a.ha.ab("resources/internal-deps/dvt/gauge/alta-rectangle-400x400.png"),width:400,height:309}]:"domeAlta"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/alta-dome-200x200.png"),width:200,height:154},{src:a.ha.ab("resources/internal-deps/dvt/gauge/alta-dome-400x400.png"),
width:400,height:309}]:"circleAntique"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/antique-circle-200x200.png"),width:200,height:200},{src:a.ha.ab("resources/internal-deps/dvt/gauge/antique-circle-400x400.png"),width:400,height:400}]:"rectangleAntique"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/antique-rectangle-200x200.png"),width:200,height:168},{src:a.ha.ab("resources/internal-deps/dvt/gauge/antique-rectangle-400x400.png"),width:400,height:335}]:"domeAntique"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/antique-dome-200x200.png"),
width:200,height:176},{src:a.ha.ab("resources/internal-deps/dvt/gauge/antique-dome-400x400.png"),width:400,height:352}]:"circleLight"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/light-circle-200x200.png"),width:200,height:200},{src:a.ha.ab("resources/internal-deps/dvt/gauge/light-circle-400x400.png"),width:400,height:400}]:"rectangleLight"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/light-rectangle-200x200.png"),width:200,height:154},{src:a.ha.ab("resourcesinternal-deps/dvt/gauge/light-rectangle-400x400.png"),
width:400,height:307}]:"domeLight"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/light-dome-200x200.png"),width:200,height:138},{src:a.ha.ab("resources/internal-deps/dvt/gauge/light-dome-400x400.png"),width:400,height:276}]:"circleDark"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/dark-circle-200x200.png"),width:200,height:200},{src:a.ha.ab("resources/internal-deps/dvt/gauge/dark-circle-400x400.png"),width:400,height:400}]:"rectangleDark"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/dark-rectangle-200x200.png"),
width:200,height:154},{src:a.ha.ab("resourcesinternal-deps/dvt/gauge/dark-rectangle-400x400.png"),width:400,height:307}]:"domeDark"===b?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/dark-dome-200x200.png"),width:200,height:138},{src:a.ha.ab("resources/internal-deps/dvt/gauge/dark-dome-400x400.png"),width:400,height:276}]:[{src:a.ha.ab("resources/internal-deps/dvt/gauge/alta-circle-200x200.png"),width:200,height:200},{src:a.ha.ab("resources/internal-deps/dvt/gauge/alta-circle-400x400.png"),width:400,
height:400}],this.options._backgroundImages=c);"string"===typeof d&&(c="needleAntique"===d?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/antique-needle-1600x1600.png"),width:81,height:734}]:"needleDark"===d?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/dark-needle-1600x1600.png"),width:454,height:652}]:"needleLight"===d?[{src:a.ha.ab("resources/internal-deps/dvt/gauge/light-needle-1600x1600.png"),width:454,height:652}]:[{src:a.ha.ab("resources/internal-deps/dvt/gauge/alta-needle-1600x1600.png"),
width:374,height:575}],this.options._indicatorImages=c)},getMetricLabel:function(){return this.ta.getAutomation().getMetricLabel()}})});
//# sourceMappingURL=oj-modular.map