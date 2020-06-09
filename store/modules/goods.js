import $H from '@/common/lib/request.js';
export default {
	state:{
		//商品分类
		goodsTypeList:[],
		//商品信息
		goodsList:[]
	},
	getters:{
		
	},
	mutations:{
		updateGoodsTypeList(state, value){
			if(value){
				state.goodsTypeList = value
			}
		},
		pushUpdateGoodsTypeList(state, value){
			for (var i = 0; i < value.length; i++) {
				for (var j = 0; j < state.goodsTypeList.length; j++) {
					if(value[i].ID == state.goodsTypeList[j].ID){
						break
					}
					if(j == state.goodsTypeList.length - 1){
						state.goodsTypeList.push(value[i])
					}
				}
			}
		},
		updateGoodsList(state, value){
			state.goodsList = value
		},
		pushUpdateGoodsList(state, value){
			for (var i = 0; i < value.length; i++) {
				for (var j = 0; j < state.goodsList.length; j++) {
					if(value[i].ID == state.goodsList[j].ID){
						break
					}
					if(j == state.goodsList.length - 1){
						state.goodsList.push(value[i])
					}
				}
			}
		},
	},
	actions:{
		updateGoodsTypeListFunc(context){
			this.$H.post('/api/ProductType/list',{
			},{
				token:true
			}).then(res=>{
				console.log(res)
				if(res.status === 0){
					context.commit('updateGoodsTypeList', res.data)
				}
			})
		},
		updateGoodsListFunc(context){
			return new Promise((res,rej)=>{
				$H.post('/api/Product/list',{
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status === 0){
						context.commit('updateGoodsList', res.data)
					}
				})
			})
		}
	},
}