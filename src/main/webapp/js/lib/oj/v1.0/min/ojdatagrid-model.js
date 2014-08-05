/*
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
 Copyright (c) 2014, Oracle and/or its affiliates.
 All rights reserved.
*/
define(["ojs/ojcore","jquery","ojs/ojdatacollection-common","ojs/ojmodel"],function(a,f){a.ec=function(b,d,c,e,f,h,k){a.i.$b(b,null);a.i.$b(d,null);a.i.$b(c,null);a.i.$b(e,null);a.i.un(h);this.If=b;this.Aj=d;this.kf=c;this.mh=e;this.yi=f;this.Ic=h;this.Bj=k};o_("CollectionCellSet",a.ec,a);a.ec.prototype.getData=function(b){var d=this;this.Ob(b);this.Ob(b).done(function(a){d.Id=a});if(null==d.Id)return null;b=b.column;a.i.assert(b>=this.kf&&b<=this.mh);return d.Id.get(this.Ic[b])};a.b.g("CollectionCellSet.prototype.getData",
{getData:a.ec.prototype.getData});a.ec.prototype.getMetadata=function(b){var d=this;this.Ob(b);this.Ob(b).done(function(a){d.Id=a});if(null==d.Id)return null;b=b.column;a.i.assert(b>=this.kf&&b<=this.mh);return{keys:{row:a.Hi.qk(d.Id),column:this.Ic[b]}}};a.b.g("CollectionCellSet.prototype.getMetadata",{getMetadata:a.ec.prototype.getMetadata});a.ec.prototype.Ob=function(b){var d;a.i.Pd(b);d=b.row;null!=this.Bj&&(d+=this.Bj);b=b.column;a.i.assert(d>=this.If&&d<=this.Aj&&b>=this.kf&&b<=this.mh);return this.yi.at(d,
{deferred:!0})};a.ec.prototype.Y=function(a){return"row"===a?Math.max(0,this.Aj-this.If):"column"===a?Math.max(0,this.mh-this.kf):0};a.b.g("CollectionCellSet.prototype.getCount",{Y:a.ec.prototype.Y});a.ec.prototype.In=function(){return this.If};a.b.g("CollectionCellSet.prototype.getStartRow",{In:a.ec.prototype.In});a.ec.prototype.mG=function(){return this.Aj};a.b.g("CollectionCellSet.prototype.getEndRow",{mG:a.ec.prototype.mG});a.ec.prototype.Hn=function(){return this.kf};a.b.g("CollectionCellSet.prototype.getStartColumn",
{Hn:a.ec.prototype.Hn});a.ec.prototype.lG=function(){return this.mh};a.b.g("CollectionCellSet.prototype.getEndColumn",{lG:a.ec.prototype.lG});a.ec.prototype.getCollection=function(){return this.yi};a.b.g("CollectionCellSet.prototype.getCollection",{getCollection:a.ec.prototype.getCollection});a.ec.prototype.pi=function(){return this.Ic};a.b.g("CollectionCellSet.prototype.getColumns",{pi:a.ec.prototype.pi});a.Hi=function(){};a.Hi.qk=function(a){var d;d=a.re();null==d&&(d=a.Lj());return d};a.rc=function(b,
d,c,e,f,h){a.i.$b(b,null);a.i.$b(d,null);a.i.un(c);this.Jc=b;this.Hf=d;this.tr=c;this.yi=e;this.jf=f;this.Bj=h};o_("CollectionHeaderSet",a.rc,a);a.rc.prototype.getData=function(b){a.i.assert(b<=this.Hf&&b>=this.Jc);var d=this;return null!=this.jf&&null!=this.yi?(null!=this.Bj&&(b+=this.Bj),this.yi.at(b,{deferred:!0}).done(function(a){d.Id=a}),d.Id.get(this.jf)):this.tr[b]};a.b.g("CollectionHeaderSet.prototype.getData",{getData:a.rc.prototype.getData});a.rc.prototype.getMetadata=function(b){var d;
return null!=this.jf&&null!=this.yi?(d=this,null!=this.Bj&&(b+=this.Bj),this.yi.at(b,{deferred:!0}).done(function(a){d.Id=a}),null==d.Id?null:{key:a.Hi.qk(d.Id)}):{key:this.getData(b)}};a.b.g("CollectionHeaderSet.prototype.getMetadata",{getMetadata:a.rc.prototype.getMetadata});a.rc.prototype.Y=function(){return Math.max(0,this.Hf-this.Jc)};a.b.g("CollectionHeaderSet.prototype.getCount",{Y:a.rc.prototype.Y});a.rc.prototype.Da=function(){return this.Jc};a.b.g("CollectionHeaderSet.prototype.getStart",
{Da:a.rc.prototype.Da});a.rc.prototype.kG=function(){return this.Hf};a.b.g("CollectionHeaderSet.prototype.getEnd",{kG:a.rc.prototype.kG});a.rc.prototype.tG=function(){return this.tr};a.b.g("CollectionHeaderSet.prototype.getHeaders",{tG:a.rc.prototype.tG});a.rc.prototype.En=function(){return this.jf};a.b.g("CollectionHeaderSet.prototype.getRowHeader",{En:a.rc.prototype.En});a.rc.prototype.getCollection=function(){return this.yi};a.b.g("CollectionHeaderSet.prototype.getCollection",{getCollection:a.rc.prototype.getCollection});
a.ga=function(b,d){this.ka=b;null!=d&&(this.uh=d.rowHeader,this.columns=d.columns);this.O=0;this.lb=-1;a.ga.t.constructor.call(this)};o_("CollectionDataGridDataSource",a.ga,a);a.b.oa(a.ga,a.fc,"oj.CollectionDataGridDataSource");a.ga.prototype.Init=function(){a.ga.t.Init.call(this);this.rl={};!this.Mu()&&null==this.columns&&0<this.ka.length&&(this.columns=this.ka.first().keys(),-1!=this.columns.indexOf(this.uh)&&this.columns.splice(this.columns.indexOf(this.uh),1));this.TQ()};a.b.g("CollectionDataGridDataSource.prototype.Init",
{Init:a.ga.prototype.Init});a.ga.prototype.TQ=function(){this.ka.on("add",this.GO.bind(this));this.ka.on("remove",this.bC.bind(this));this.ka.on("change",this.HO.bind(this));this.ka.on("refresh",this.jO.bind(this))};a.ga.prototype.Mu=function(){return null!=this.ka.url||null!=this.ka.customURL};a.ga.prototype.rP=function(){return this.Mu()?null!=this.data:!0};a.ga.prototype.yC=function(a){if(this.Mu()){if("column"===a)return null!=this.columns;if("row"===a&&null!=this.uh)return null!=this.data}return!0};
a.ga.prototype.Y=function(a){if(!this.yC(a))return this.precision="estimate",-1;this.precision="exact";return"row"==a?this.size():"column"==a?this.columns.length:0};a.b.g("CollectionDataGridDataSource.prototype.getCount",{Y:a.ga.prototype.Y});a.ga.prototype.ef=function(a){null==this.precision&&this.Y(a);return this.precision};a.b.g("CollectionDataGridDataSource.prototype.getCountPrecision",{ef:a.ga.prototype.ef});a.ga.prototype.Td=function(a,d,c){var e,f;e=a.axis;this.yC(e)?this.aC(a,d,c):null!=d&&
(f={},f.UT=a,f.callbacks=d,f.jw=c,this.rl[e]=f)};a.b.g("CollectionDataGridDataSource.prototype.fetchHeaders",{Td:a.ga.prototype.Td});a.ga.prototype.aC=function(b,d,c,e){var f,h,k,l;f=b.axis;h=b.start;k=b.count;a.i.assert("row"===f||"column"===f);a.i.assert(0<k);"column"===f?null!=this.columns?(e=Math.min(this.columns.length,h+k),l=new a.rc(h,e,this.columns)):l=new a.qe(h,h,f,null):"row"===f&&(null!=this.uh?(null!=e&&(k=e.count),e=Math.min(this.size(),h+k),0<this.lb?(e=Math.min(e,this.totalSize()-
this.O),l=new a.rc(h,e,this.columns,this.ka,this.uh,this.O)):l=new a.rc(h,e,this.columns,this.ka,this.uh)):l=new a.qe(h,h,f,null));null!=d&&d.success&&d.success.call(c.success,l,b);this.rl[f]=null};a.ga.prototype.JB=function(b){var d,c,e,f,h,k;for(d=0;d<b.length;d+=1)c=b[d],a.i.assert("row"===c.axis||"column"===c.axis),a.i.assert(0<c.count),"row"===c.axis?(e=c.start,f=c.count):"column"===c.axis&&(h=c.start,k=c.count);return{rowStart:e,rowCount:f,colStart:h,colCount:k}};a.ga.prototype.$B=function(b,
d,c,e){var f,h,k;f=this.JB(b);h=f.rowStart;e=null!=e?Math.min(this.size(),h+e.count):Math.min(this.size(),h+b.count);k=f.colStart;f=Math.min(this.columns.length,k+f.colCount);0<this.lb?(e=Math.min(e,this.totalSize()-this.O),h=new a.ec(h,e,k,f,this.ka,this.columns,this.O)):h=new a.ec(h,e,k,f,this.ka,this.columns);null!=d&&null!=d.success&&(null!=d&&null==c&&(c={}),d.success.call(c.success,h,b),this.LM=0);this.Lf=null};a.ga.prototype.Rd=function(a,d,c){this.rP()?this.$B(a,d,c):(null!=d&&(this.Lf={},
this.Lf.XS=a,this.Lf.callbacks=d,this.Lf.jw=c),this.NM(a))};a.b.g("CollectionDataGridDataSource.prototype.fetchCells",{Rd:a.ga.prototype.Rd});a.ga.prototype.xD=function(a){var d,c,e,f,h;d=this.rl[a];null!=d&&(c=d.UT,e=d.callbacks,f=d.jw,"row"===a&&(h=d.fw),this.aC(c,e,f,h))};a.ga.prototype.BQ=function(){this.$B(this.Lf.XS,this.Lf.callbacks,this.Lf.jw,this.Lf.fw)};a.ga.prototype.NM=function(b){var d;b=this.JB(b);d=b.rowStart;0<this.lb&&(d+=this.O);this.ka.Gr(d,b.rowCount).done(function(b,e){var f=
this.ka.at(d,{deferred:!0});this.yR(b,e);null!=f&&void 0===this.columns&&f.done(function(a){this.Iv(a)}.bind(this));null!=this.rl&&(this.xD("column"),this.xD("row"));null!=this.Lf&&this.BQ();0<this.lb&&a.fc.t.handleEvent.call(this,"sync",!0)}.bind(this))};a.ga.prototype.yR=function(a,d){var c={start:a,count:d};null!=this.rl.row&&(this.rl.row.fw=c);null!=this.Lf&&(this.Lf.fw=c)};a.ga.prototype.Iv=function(a){this.columns=a.keys();-1!=this.columns.indexOf(this.uh)&&this.columns.splice(this.columns.indexOf(this.uh),
1)};a.ga.prototype.keys=function(b){var d,c,e,g,h;d=b.row+this.O;c=b.column;h=f.Deferred();b=this.ka.at(d,{deferred:!0});null!=b?b.done(function(b){e=a.Hi.qk(b);null==this.columns&&this.Iv(b);g=this.columns[c];h.resolve({row:null==e?null:e,column:null==g?null:g})}.bind(this)):h.resolve({row:null,column:null});return h};a.b.g("CollectionDataGridDataSource.prototype.keys",{keys:a.ga.prototype.keys});a.ga.prototype.Wd=function(a){var d,c,e,g;d=a.row;c=a.column;e=f.Deferred();this.ka.indexOf(d,{deferred:!0}).done(function(a){null==
this.columns&&this.ka.first(1,{deferred:!0}).done(function(a){this.Iv(a)}.bind(this));g=this.columns.indexOf(c);e.resolve({row:null==a?-1:a,column:null==g?-1:g})}.bind(this));return e};a.b.g("CollectionDataGridDataSource.prototype.indexes",{Wd:a.ga.prototype.Wd});a.ga.prototype.getCapability=function(a){return"sort"===a?"column":"move"===a?"row":null};a.b.g("CollectionDataGridDataSource.prototype.getCapability",{getCapability:a.ga.prototype.getCapability});a.ga.prototype.sort=function(a,d,c){var e,
f=a.direction,h=a.key;a=a.axis;null==c&&(c={});"column"===a?(-1<this.ka.yw&&this.ka.hasMore?(this.ka.comparator=h,this.ka.sortDirection="ascending"===f?1:-1):("ascending"===f&&(e=function(a,b){var c,d;a=a.get(h);b=b.get(h);c=isNaN(a);d=isNaN(b);a instanceof Date&&(a=a.toISOString(),c=!0);b instanceof Date&&(b=b.toISOString(),d=!0);return c&&d?a<b?-1:a===b?0:1:c?1:d?-1:a-b}),"descending"===f&&(e=function(a,b){var c,d;a=a.get(h);b=b.get(h);c=isNaN(a);d=isNaN(b);a instanceof Date&&(a=a.toISOString());
b instanceof Date&&(b=b.toISOString());return c&&d?a>b?-1:a===b?0:1:c?-1:d?1:b-a}),this.ka.comparator=e),this.ka.sort(),null!=d&&null!=d.success&&d.success.call(c.success)):null!=d&&null!=d.error&&d.error.call(c.error,"Axis value not supported")};a.b.g("CollectionDataGridDataSource.prototype.sort",{sort:a.ga.prototype.sort});a.ga.prototype.move=function(a,d){var c;this.ka.get(a,{deferred:!0}).done(function(e){null==d?(this.ka.remove(e),this.ka.add(e)):(a===d?(c=this.ka.indexOf(d,{deferred:!0}),this.ka.remove(e)):
(this.ka.remove(e),c=this.ka.indexOf(d,{deferred:!0})),c.done(function(a){this.ka.add(e,{at:a,uW:!0})}.bind(this)))}.bind(this))};a.b.g("CollectionDataGridDataSource.prototype.move",{move:a.ga.prototype.move});a.ga.prototype.Sp=function(a,d,c,e){var f={source:this};f.operation=a;f.keys={row:d,column:null};f.indexes={row:c,column:e};return f};a.ga.prototype.GO=function(b){var d,c;this.ka.indexOf(b,{deferred:!0}).done(function(e){c=a.Hi.qk(b);d=this.Sp("insert",c,0<e-this.O?e-this.O:0,-1);this.handleEvent("change",
d);e<this.lb+this.O&&(e=this.ka.at(this.O+this.lb,{deferred:!0}),null!=e&&e.done(function(a){null!=b&&this.bC(a)}.bind(this)))}.bind(this))};a.ga.prototype.bC=function(b){this.handleEvent("change",this.Sp("delete",a.Hi.qk(b)))};a.ga.prototype.HO=function(b){var d,c;this.ka.indexOf(b,{deferred:!0}).done(function(e){c=a.Hi.qk(b);e=0<e-this.O?e-this.O:-1;d=this.Sp("update",c,e,-1);this.handleEvent("change",d)}.bind(this))};a.ga.prototype.jO=function(){this.handleEvent("change",this.Sp("refresh",null))};
a.ga.prototype.setPageSize=function(a){this.lb=a};a.b.g("CollectionDataGridDataSource.prototype.setPageSize",{setPageSize:a.ga.prototype.setPageSize});a.ga.prototype.size=function(){return 0===this.ka.length?-1:null!=this.lb&&0<this.lb&&this.ka.size()>this.lb?this.lb:this.ka.size()};a.b.g("CollectionDataGridDataSource.prototype.size",{size:a.ga.prototype.size});a.ga.prototype.totalSize=function(){return null!=this.ka?this.ka.totalResults:-1};a.b.g("CollectionDataGridDataSource.prototype.totalSize",
{totalSize:a.ga.prototype.totalSize});a.ga.prototype.hasMore=function(){return null!=this.ka?this.ka.hasMore:!1};a.b.g("CollectionDataGridDataSource.prototype.hasMore",{hasMore:a.ga.prototype.hasMore});a.ga.prototype.fetch=function(a){this.O=null!=a?null!=a.startIndex?a.startIndex:0:0;this.handleEvent("change",{operation:"sync",pageSize:this.lb})};a.ga.prototype.getCollection=function(){return this.ka};a.b.g("CollectionDataGridDataSource.prototype.getCollection",{getCollection:a.ga.prototype.getCollection});
a.ga.prototype.pi=function(){return this.columns};a.b.g("CollectionDataGridDataSource.prototype.getColumns",{pi:a.ga.prototype.pi});a.ga.prototype.En=function(){return this.uh};a.b.g("CollectionDataGridDataSource.prototype.getRowHeader",{En:a.ga.prototype.En});a.ga.prototype.zG=function(){return this.O};a.b.g("CollectionDataGridDataSource.prototype.getStartIndex",{zG:a.ga.prototype.zG});a.ga.prototype.uG=function(){return this.lb};a.b.g("CollectionDataGridDataSource.prototype.getPageSize",{uG:a.ga.prototype.uG});
a.ga.prototype.oG=function(){return this.LM};a.b.g("CollectionDataGridDataSource.prototype.getFetchCalls",{oG:a.ga.prototype.oG});a.ga.prototype.getData=function(){return this.data};a.b.g("CollectionDataGridDataSource.prototype.getData",{getData:a.ga.prototype.getData})});
//# sourceMappingURL=oj-modular.map