(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/index/product-info"],{1406:function(t,e,o){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=o("2f62");function i(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function a(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?i(Object(o),!0).forEach((function(e){r(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}function r(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}var s=function(){o.e("components/item/goods-info-item").then(function(){return resolve(o("dc06"))}.bind(null,o)).catch(o.oe)},u=function(){o.e("components/uni-combox/uni-combox").then(function(){return resolve(o("cd15"))}.bind(null,o)).catch(o.oe)},c=function(){Promise.all([o.e("common/vendor"),o.e("components/uni-icons/uni-icons")]).then(function(){return resolve(o("fc7a"))}.bind(null,o)).catch(o.oe)},d={components:{goodsInfoItem:s,uniCombox:u,uniIcons:c},data:function(){return{defaultPageIndex:1,defaultItemCount:4,typeText:"",nameString:"",isShowLoadMoreBoole:!1,sortName:"SortValue",sortValue:"desc",defaultSrot:[{ChinaName:"排序值",Name:"SortValue",SortValue:"desc"},{ChinaName:"名称",Name:"Name",SortValue:"desc"},{ChinaName:"价格",Name:"Price",SortValue:"asc"},{ChinaName:"库存",Name:"Stock",SortValue:"asc"},{ChinaName:"销量",Name:"SellCount",SortValue:"desc"}],sortIndex:0}},props:{totalH:Number},computed:a({},(0,n.mapState)({goodsTypeList:function(t){return t.goods.goodsTypeList},goodsList:function(t){return t.goods.goodsList}}),{},(0,n.mapGetters)([]),{getTypeNameList:function(){for(var t=[],e=0;e<this.goodsTypeList.length;e++)t.push(this.goodsTypeList[e].Name);return t},getTypeName:function(){if(!this.typeText)return"";for(var t=0;t<this.goodsTypeList.length;t++)if(this.goodsTypeList[t].ID==this.typeText)return this.goodsTypeList[t].Name}}),mounted:function(){this.$nextTick((function(){this.isShowLoadMore()}))},methods:a({},(0,n.mapMutations)(["updateGoodsList","pushUpdateGoodsList"]),{},(0,n.mapActions)([]),{getColor:function(t,e){return t==this.sortIndex&&this.sortValue==e?"#FF4500":"#CFCFCF"},typeInput:function(t){console.log(t);for(var e=0;e<this.goodsTypeList.length;e++){var o=this.goodsTypeList[e];if(o.Name==t)return void(this.typeText=o.ID)}this.typeText=""},nameInput:function(t){this.nameString=t.detail.value},isShowLoadMore:function(t){var e=this.goodsList;return t&&(e=t),e.length>=this.defaultItemCount?this.isShowLoadMoreBoole=!0:this.isShowLoadMoreBoole=!1},loadMore:function(){this.defaultPageIndex=this.defaultPageIndex+1,this.requestData("loadMore")},check:function(){""!=this.nameString||""!=this.typeText?this.requestData():t.showToast({title:"请输入要查询的内容",icon:"none",duration:1e3})},refresh:function(){this.defaultPageIndex=1,this.sortName=this.defaultSrot[0].Name,this.sortValue=this.defaultSrot[0].SortValue,this.requestData()},clearInput:function(){this.nameString="",this.typeText=""},newAddGoods:function(){t.navigateTo({url:"../../pages/newadd-goods/newadd-goods"})},chooseSort:function(t){this.sortIndex=t,this.sortName!=this.defaultSrot[t].Name?(this.sortName=this.defaultSrot[t].Name,this.sortValue=this.defaultSrot[t].SortValue):this.sortName==this.defaultSrot[t].Name&&("asc"==this.sortValue?this.sortValue="desc":this.sortValue="asc"),this.defaultPageIndex=1,this.requestData()},requestData:function(e){var o=this;o.$H.post("/api/Product/List",{Name:o.nameString,ProductTypeID:o.typeText,SortName:o.sortName,SortValue:o.sortValue,PageIndex:o.defaultPageIndex},{token:!0}).then((function(n){console.log(n),0==n.status?(o.isShowLoadMore(n.data),"loadMore"==e?o.pushUpdateGoodsList(n.data):o.updateGoodsList(n.data)):t.showToast({title:n.message,icon:"none",duration:1500})}))}})};e.default=d}).call(this,o("543d")["default"])},"468a":function(t,e,o){"use strict";o.r(e);var n=o("9a5f"),i=o("9f48");for(var a in i)"default"!==a&&function(t){o.d(e,t,(function(){return i[t]}))}(a);var r,s=o("f0c5"),u=Object(s["a"])(i["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],r);e["default"]=u.exports},"9a5f":function(t,e,o){"use strict";var n={"uni-combox":function(){return o.e("components/uni-combox/uni-combox").then(o.bind(null,"cd15"))},"uni-icons":function(){return Promise.all([o.e("common/vendor"),o.e("components/uni-icons/uni-icons")]).then(o.bind(null,"fc7a"))}},i=function(){var t=this,e=t.$createElement,o=(t._self._c,t.__map(t.defaultSrot,(function(e,o){var n=t.getColor(o,"asc"),i=t.getColor(o,"desc");return{$orig:t.__get_orig(e),m0:n,m1:i}})));t.$mp.data=Object.assign({},{$root:{l0:o}})},a=[];o.d(e,"b",(function(){return i})),o.d(e,"c",(function(){return a})),o.d(e,"a",(function(){return n}))},"9f48":function(t,e,o){"use strict";o.r(e);var n=o("1406"),i=o.n(n);for(var a in n)"default"!==a&&function(t){o.d(e,t,(function(){return n[t]}))}(a);e["default"]=i.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/index/product-info-create-component',
    {
        'components/index/product-info-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("468a"))
        })
    },
    [['components/index/product-info-create-component']]
]);