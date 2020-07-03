import $H from '@/common/lib/request.js';
export default {
	state:{
		orderList:[]
	},
	getters:{
		
	},
	mutations:{
		updateOrderList(state, value){
			if(value){
				state.orderList = value
			}
		},
		pushUpdateOrderList(state, value){
			for (var i = 0; i < value.length; i++) {
				state.orderList.push(value[i])
			}
		}
	},
	
	actions:{
		updateOrderListFunc(context){
			return new Promise((res,rej)=>{
				$H.post('/api/Order/List',{
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status === 0){
						context.commit('updateOrderList', res.data)
					}
				})
			})
		}
	},
}