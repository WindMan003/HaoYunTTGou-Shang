<template>
	<view class="w-100 d-flex flex-row a-center j-center">
		<view class="d-flex flex-row border p-1 rounded-10 bg-white" style="width: 92%;">
			<view class="w-100 ml-1 d-flex flex-column">
				<view class="w-100" @click="orderDetail">
					<view class="d-flex flex-row j-sb border-bottom pb">
						<view class="font-weight">桌子号：{{item.TableNumber}}</view>
						<view class="rounded-10 pl-1 pr-1 text-OrangeRed">{{item.StatusText}}</view>
					</view>
					<view class="d-flex flex-row a-center j-sb mt">
						<view class="">订单号：{{item.ID}}</view>
						<view class="text-price" v-if="item.AddStatus == 1">(加菜未确认)</view>
					</view>
					<view class="">下单时间：{{item.CreateTime}}</view>
					<view class="d-flex flex-row">
						<view class="">金额：</view>
						<view class="text-price">{{'￥'+item.Amount}}</view>
					</view>
					<view class="d-flex flex-row">
						<view class="">是否打印：</view>
						<view class="mr-3 d-flex flex-row" v-if="item.PrintCount == 0">
							<text class="text-price">未打印</text>
						</view>
						<view class="mr-3 d-flex flex-row" v-else>
							已打印<text class="text-price">{{item.PrintCount}}</text>次
						</view>
					</view>
				</view>
				
				<view class="d-flex flex-row a-center ml-1 j-end">
					<view class="font-28 border mr-3 pl-1 pr-1 btn-orange-white" @click="checkPayStatus" v-if="item.Status == 2">查询支付</view>
					<view class="font-28 border mr-3 pl-1 pr-1 btn-orange-white" @click="printOrder(item.PrintCount)" 
					v-if="item.Status == 3 || item.Status == 1">打印订单</view>
				</view>
			</view>
		
			<!-- <view class="position-absolute border text-center pl-1 pr-1 rounded-20 font-22" v-if="item.ViewStatus == 0"
			style="right: 30rpx; background-color: red; color: #FFFFFF;">未查看</view> -->
			
			<send-command ref="sendCommand" @printComplete="printComplete"></send-command>
		</view>
	</view>
</template>

<script>
	import sendCommand from "@/components/sendCommand/sendCommand.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			sendCommand
		},
		data() {
			return {
				OrderItem: [],
				ProductList: [],
			}
		},
		props:{
			item:{
				type: Object,
				default: null
			},
			statusList:{
				type: Array,
				default: null
			}
		},
		computed:{
			...mapState({
				goodsList:state=>state.goods.goodsList,
				orderList:state=>state.order.orderList,
				BLEInformation:state=>state.bluetooth.BLEInformation
			}),
			...mapGetters([
			])
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
			]),
			getStatusText(m_item){
				let temp = this.statusList
				for (let i = 0; i < temp.length; i++) {
					if(m_item.Status == temp[i].Value){
						return temp[i].Text
					}
				}
			},
			orderDetail(){
				uni.navigateTo({
					url:'../../pages/order/order-detail?ID='+this.item.ID,
				})
			},
			deleteGoods(){
				var _that = this;
				uni.showModal({
				    title: '提示',
				    content: '删除 '+_that.item.Name+' 商品',
				    success: function (res) {
				        if (res.confirm) {
				            _that.deleteGoodsCallBack()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			deleteGoodsCallBack(){
				var _self = this;
				_self.$H.post('/api/Product/DelProduct',{
					ID:_self.item.ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					_self.jumpShowToast(res.message)
					if(res.status == 0){
						var tempList = this.goodsList
						for (var i = 0; i < tempList.length; i++) {
							if(tempList[i].ID == _self.item.ID){
								tempList.splice(i, 1)
								return
							}
						}
					}
				})
			},
			checkPayStatus(){
				console.log('checkPayStatus')
				var _self = this;
				console.log(_self.item.ID)
				_self.$H.post('/api/Order/UpdateOnlinePayState',{
					OrderID:_self.item.ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					_self.jumpShowToast(res.message)
					if(res.status == 0){
						for (let i = 0; i < _self.orderList.length; i++) {
							if(_self.orderList[i].ID == _self.item.ID){
								_self.orderList.splice(i, 1)
								break
							}
						}
					}
				})
			},
			jumpShowToast(message){
				uni.showToast({
					title:message,
					icon:'none',
					duration:1500
				})
			},
			printOrder(printCount){
				this.getOrderDetail(printCount)
				// var _self = this
				// if(_self.BLEInformation.writeServiceId == ''){
				// 	uni.showModal({
				// 	    title: '提示',
				// 	    content: '您没有连接打印设备,是否去连接',
				// 	    success: function (res) {
				// 	        if (res.confirm) {
				// 				uni.navigateTo({
				// 					url:'../bleConnect/bleConnect'
				// 				})
				// 	        }
				// 	    }
				// 	});
				// }else{
				// 	_self.getOrderDetail()
				// }
			},
			getOrderDetail(printCount){
				var _self = this;
				_self.$H.post('/api/Order/Detail',{
					OrderID: _self.item.ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.OrderItem = res.data.OrderItem
						// _self.tidyProductList(res.data.ProductList)
						_self.gotoPrintOrder(printCount)
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			// tidyProductList(list){
			// 	var temp = this.OrderItem
			// 	this.ProductList = []
			// 	for (var i = temp.AddRound; i >= 0; i--) {
			// 		let newItem = {addRound: i, list: []}
			// 		for (var j = 0; j < list.length; j++) {
			// 			if(list[j].AddRound == i){
			// 				newItem.list.push(list[j])
			// 				break
			// 			}
			// 		}
			// 		this.ProductList.push(newItem)
			// 	}
			// 	this.ProductList.reverse()
			// },
			gotoPrintOrder(printCount){
				var _self = this
				var printOrderLit = _self.ProductList
			
				if(Number(printCount) > 0){
					uni.showModal({
						title: '提示',
						content: '订单已打印'+printCount+'次,继续打印?',
						success: function (res) {
							if (res.confirm) {
								// _self.$refs.sendCommand.receiptOrder(_self.OrderItem, printOrderLit, _self.item.StatusText)
								_self.printOrderSure(false)
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else{
					// _self.$refs.sendCommand.receiptOrder(_self.OrderItem, printOrderLit, _self.item.StatusText)
					_self.printOrderSure(true)
				}
			},
			printOrderSure(m_bool){
				var _self = this;
				_self.$H.post('/API/Order/PrintOrder',{
					OrderID: _self.item.ID,
					AddRound: 0
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						uni.showToast({ title: '打印成功', icon: 'none', duration: 1500 })
						var temp = _self.orderList
						for (let i = 0; i < temp.length; i++) {
							if(temp[i].ID == _self.item.ID){
								if(m_bool){
									// 打印成功，清除数据
									_self.orderList.splice(i, 1)
								}else{
									// 打印成功，打印次数增加
									_self.orderList[i].PrintCount = _self.orderList[i].PrintCount + 1
								}
								break
							}
						}
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			printComplete(){
				console.log('打印完成，回调结束')
				// var _self = this
				// let postData = { OrderID:_self.OrderItem.ID }
				// _self.$H.post('/api/order/PrintOk', postData, {
				// 	token:true
				// }).then(res=>{
				// 	console.log(res)
				// 	if(res.status == 0){
				// 		_self.initOrderView()
				// 	}
				// })
			},
			initOrderView(){
				var _self = this;
				_self.$H.post('/api/order/SetStatusViewed',{
					OrderID: _self.item.ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						// 设置为已读
						if(_self.item.ViewStatus == 0){
							for (let i = 0; i < _self.orderList.length; i++) {
								if(_self.orderList[i].ID == _self.item.ID){
									_self.orderList.ViewStatus = 1
									break
								}
							}
						}
						}else{
						_self.$Common.showToast(res)
					}
				})
			}
		}
	}
</script>

<style>

</style>