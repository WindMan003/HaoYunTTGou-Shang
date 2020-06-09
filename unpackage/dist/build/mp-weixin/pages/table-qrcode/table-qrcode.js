(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/table-qrcode/table-qrcode"],{"3b3c":function(e,t,o){"use strict";var n,s=function(){var e=this,t=e.$createElement;e._self._c},i=[];o.d(t,"b",(function(){return s})),o.d(t,"c",(function(){return i})),o.d(t,"a",(function(){return n}))},"5e41":function(e,t,o){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o={components:{},data:function(){return{totalH:0,qrCodeList:"",tableIDText:"",selectQRCodeList:[],selected:!1}},onLoad:function(){var t=this;e.getSystemInfo({success:function(o){t.totalH=o.windowHeight-e.upx2px(62)}}),this.__init()},computed:{getFilePaths:function(){for(var e=this.qrCodeList,t=[],o=0;o<e.length;o++)t.push(e[o].BgQRCodePath);return t},getSelectQRCodeCount:function(){return this.selectQRCodeList.length}},methods:{__init:function(){var t=this;t.$H.post("/api/TableQRCode/List",{},{token:!0}).then((function(o){console.log(o),0==o.status?t.qrCodeList=o.data:e.showToast({title:o.message,icon:"none",duration:1e3})}))},tableIDInput:function(e){this.tableIDText=e.detail.value},createQRCode:function(){var t=this,o=this;o.$H.post("/api/TableQRCode/Add",{TableNumber:o.tableIDText},{token:!0}).then((function(n){console.log(n),0==n.status?(o.qrCodeList.push(n.data),t.tableIDText=""):e.showToast({title:n.message,icon:"none",duration:1e3})}))},deleteQRImg:function(t){var o=this;e.showModal({title:"提示",content:"确定删除图片",success:function(e){e.confirm?o.deleteQRImgSure(t):e.cancel&&console.log("用户点击取消")}})},deleteQRImgSure:function(t){var o=this;o.$H.post("/api/TableQRCode/Del",{ID:o.qrCodeList[t].ID},{token:!0}).then((function(n){console.log(n),e.hideLoading(),0==n.status?o.qrCodeList.splice(t,1):e.showToast({title:n.message,icon:"none",duration:1e3})}))},previewImage:function(t){var o=this.getFilePaths;e.previewImage({current:t,urls:o})},tableIDChangeInput:function(t){for(var o=this.qrCodeList,n="",s=0;s<o.length;s++){if(t.target.id==o[s].ID&&t.detail.value==o[s].TableNumber)return;t.target.id==o[s].ID&&t.detail.value!=o[s].TableNumber&&(n=s)}var i=this;e.showModal({title:"提示",content:"确定把桌号改为"+t.detail.value,success:function(e){e.confirm?i.changeTableID(t.detail.value,t.target.id,n):e.cancel&&console.log("用户点击取消")}})},changeTableID:function(t,o,n){var s=this;s.$H.post("/api/TableQRCode/Update",{TableNumber:t,ID:o},{token:!0}).then((function(t){console.log(t),e.hideLoading(),0==t.status?s.qrCodeList.splice(n,1,t.data):e.showToast({title:t.message,icon:"none",duration:1e3})}))},checkboxChange:function(e){this.selectQRCodeList=e.detail.value},saveToPhotoAlbum:function(){console.log(this.selectQRCodeList);for(var t=this.selectQRCodeList,o=0,n=0;n<t.length;n++)e.getImageInfo({src:t[n],success:function(n){console.log(n),e.saveImageToPhotosAlbum({filePath:n.path,success:function(){console.log("save success"),o+=1,o==t.length&&e.showModal({title:"提示",content:"图片已经全部保存成功"})}})}})},selectAll:function(){if(this.selected=!this.selected,this.selected)for(var e=0;e<this.qrCodeList.length;e++)this.selectQRCodeList.push(this.qrCodeList[e].BgQRCodePath);else this.selectQRCodeList=[]}}};t.default=o}).call(this,o("543d")["default"])},"913d":function(e,t,o){"use strict";o.r(t);var n=o("3b3c"),s=o("e663");for(var i in s)"default"!==i&&function(e){o.d(t,e,(function(){return s[e]}))}(i);var a,l=o("f0c5"),c=Object(l["a"])(s["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],a);t["default"]=c.exports},e663:function(e,t,o){"use strict";o.r(t);var n=o("5e41"),s=o.n(n);for(var i in n)"default"!==i&&function(e){o.d(t,e,(function(){return n[e]}))}(i);t["default"]=s.a},f8d2:function(e,t,o){"use strict";(function(e){o("2e69"),o("921b");n(o("66fd"));var t=n(o("913d"));function n(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,o("543d")["createPage"])}},[["f8d2","common/runtime","common/vendor"]]]);