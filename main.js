import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$S = store

// 引入全局组件
import divider from "@/components/common/divider.vue"
Vue.component('divider', divider)
// 引入request库
import $H from '@/common/lib/request.js';
Vue.prototype.$H = $H
// 引入md5库
import $md5 from '@/common/lib/md5.js';
Vue.prototype.$md5 = $md5
//引入时间处理库
import $Time from '@/common/lib/time.js';
Vue.prototype.$Time = $Time
//引入公共函数库
import $Common from '@/common/lib/common.js';
Vue.prototype.$Common = $Common

// 在main.js注册全局组件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

const app = new Vue({
	store,
    ...App
})
app.$mount()
