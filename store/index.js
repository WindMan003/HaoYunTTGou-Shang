import Vue from "vue"
import Vuex from "vuex"

import cart from "@/store/modules/cart.js"
import user from "@/store/modules/user.js"
import goods from "@/store/modules/goods.js"
import order from "@/store/modules/order.js"
import notice from "@/store/modules/notice.js"
import employee from "@/store/modules/employee.js"
import updata from "@/store/modules/updata.js"
//蓝牙设置
import bluetooth from '@/store/modules/bluetooth.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules:{
		cart,
		user,
		goods,
		order,
		notice,
		employee,
		updata,
		bluetooth
	},
})

export default store