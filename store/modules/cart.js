import $H from '@/common/lib/request.js';
export default {
	state:{
		//商家ID
		merchantID:1,
		//桌子ID
		tableID:1,
		allGoodsList:[],
		//通过服务器拿到的购物车内物品
		cartGoodsList:[],
		//当前选中商品数量
		nowChooseCount:0,
		//当前选中商品总价格
		chooseTotalPrice:0,
		//购物车ID
		cartId:0,
		//是否是多人点商品模式
		isManyPeople:true,
		//订单ID
		OrderID:0,
		
	},
	getters:{
		totalPrice:(state)=>{
			var total = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				total = total + state.cartGoodsList[i].Count*state.cartGoodsList[i].Price
			}
			return total
		},
		getCartCount:(state)=>{
			var count = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				let temp = state.cartGoodsList[i]
				count = count + temp.Count
			}
			return count
		},
		//根据商品Id获得数量
		getGoodsCount:(state)=>(goodsId)=>{
			let count = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				if (state.cartGoodsList[i].ProductID === goodsId){
					count = count + state.cartGoodsList[i].Count
				}
			}
			return count
		},
		getGoodsTypeCount:(state)=>(typeId)=>{
			var tempcount = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				if (state.cartGoodsList[i].ProductTypeID === typeId){
					tempcount = tempcount + state.cartGoodsList[i].Count
				}
			}
			return tempcount
		},
		// 根据商品id获取对应商品信息
		getGoodsIdList:(state)=>(goodsId)=>{
			var tempcount = 0
			for (var i = 0; i < state.allGoodsList.length; i++) {
				if (state.allGoodsList[i].ID === goodsId){
					return state.allGoodsList[i]
				}
			}
		}
	},
	mutations:{
		updateMerchantID(state, merchantID){
			state.merchantID = merchantID
		},
		updateTableID(state, tableID){
			state.tableID = tableID
		},
		//更新规格里面数据
		updateSpecDate(state, list){
			state.nowChooseCount = 0
			state.chooseTotalPrice = 0
			for (var i = 0; i < state.cartGoodsList.length; i++) {
				let temp = state.cartGoodsList[i]
				//只有口味
				if(temp.ProductID === list.goodsId && list.tasteId !== 0 && temp.TasteID === list.tasteId && list.specId === 0){
					state.chooseTotalPrice = temp.Count * temp.Price
					state.nowChooseCount = temp.Count
					return
				}
				//只有规格
				if(temp.ProductID === list.goodsId && list.specId !== 0 && temp.SpecificationID === list.specId && list.tasteId === 0){
					state.chooseTotalPrice = temp.Count * temp.Price
					state.nowChooseCount = temp.Count
					return
				}
				//口味规格都有
				if(temp.ProductID === list.goodsId && list.specId !== 0 && temp.SpecificationID === list.specId){
					if(list.tasteId != 0 && temp.TasteID === list.tasteId){
						state.chooseTotalPrice = temp.Count * temp.Price
						state.nowChooseCount = temp.Count
						return
					}
				}
			}
		},
		//更新购物车数据
		updateCartGoodsList(state, list){
			state.cartGoodsList = list
		},
		//清空购物车数据
		clearCartList(state){
			state.cartGoodsList = []
		},
		updateAllGoodsList(state, list){
			console.log(list)
			state.allGoodsList = list
		},
		updateCartId(state, cartId){
			state.cartId = cartId
		},
		updateManyPeople(state, value){
			state.isManyPeople = value
		},
		updateOrderID(state, OrderID){
			state.OrderID = OrderID
		}	
	},
	actions:{
		//更新所有商品数据
		updateAllGoodsListFunc(context, value){
			context.commit('updateAllGoodsList', value)
		},
		updateSpecDateFunc(context, value){
			context.commit('updateSpecDate', value)
		},
		//更新购物车ID
		updateCartIdFunc(context, value){
			context.commit('updateCartId', value)
		},
		updateManyPeopleFunc(context, value){
			context.commit('updateManyPeople', value)
		},
		//拉取购物车最新数据
		updateCartList(context){
			return new Promise((res,rej)=>{
				$H.post('/api/Merchant/SelectCart',{
					MerchantID:context.state.merchantID,
					CartID:context.state.cartId
				},{
					token:true
				}).then(res=>{
					if(res.status === 0){
						context.commit('updateCartGoodsList', res.data.Products)
					}else{
						context.commit('updateCartGoodsList', [])
					}
				}).catch(err=>{
					rej(err)
				})
			})
		},
		//给购物车加减商品
		operationCartGoods(context, value){
			uni.showLoading({
				title: '修改中...'
			})
			let tempStr = ''
			if(value.operationStr === 'plus'){
				tempStr = '/api/Merchant/AddProduct'
			}else if(value.operationStr === 'minus'){
				tempStr = '/api/Merchant/RemoveProduct '
			}
			//判断规格
			var specId = value.specId ? value.specId : 0
			//判断口味
			var tasteId = value.tasteId ? value.tasteId : 0
			var aaa = {
				MerchantID:context.state.merchantID,
				CartID:context.state.cartId,
				ProductID:value.nameid,
				SpecificationID:specId,
				TasteID:tasteId,
				Count:"1",
				CurCount:"0"
			}
			console.log(aaa)
			return new Promise((res,rej)=>{
				$H.post(tempStr,{
					MerchantID:context.state.merchantID,
					CartID:context.state.cartId,
					ProductID:value.nameid,
					SpecificationID:specId,
					TasteID:tasteId,
					Count:"1",
					CurCount:"0"
				},{
					token:true,
				}).then(res=>{
					if(res.status === 0){
						context.commit('updateCartGoodsList', res.data.Products)
						context.commit('updateSpecDate', {
							"goodsId":value.nameid,
							"tasteId":tasteId,
							"specId":specId
						})
					}else{
						uni.showToast({title:res.message, icon: 'none' })
					}
					uni.hideLoading()
				}).catch(err=>{
					rej(err)
				})
			})
		}

	},
}