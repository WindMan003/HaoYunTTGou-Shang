<template>
	<view class="w-100 d-flex flex-row border-bottom p-1">
		<view class="w-100 ml-1 d-flex flex-column">
			<view class="" @click="orderDetail">
				<view class="w-100 d-flex flex-row a-center ml-1">
					<view class="d-flex flex-row" style="width: 40%;">
						<view class="font-26 font-weight">订单号:</view>
						<view class="font-26 ml">{{item.ID}}</view>
					</view>
					<view class="d-flex flex-row" style="width: 60%;">
						<view class="font-26 font-weight">状态:</view>
						<view class="font-26 ml">{{getStatusText(item)}}</view>
					</view>
				</view>
				
				<view class="d-flex flex-row a-center ml-1">
					<view class="d-flex flex-row" style="width: 40%;">
						<view class="font-26 font-weight">桌子号:</view>
						<view class="font-26 ml">{{item.TableNumber}}</view>
					</view>
					<view class="d-flex flex-row" style="width: 60%;">
						<!-- <view class="font-26 font-weight">用户:</view> -->
						<!-- <view class="font-26">{{item.UserNickName}}</view> -->
						<view class="font-26" v-if="item.AddStatus == 1 && item.Status == 1" 
						style="color: #FF582B;">(加菜未确认)</view>
					</view>
				</view>
				
				<view class="d-flex flex-row a-center ml-1">
					<view class="d-flex flex-row">
						<view class="font-26 font-weight">金额:</view>
						<view class="font-26 ml" style="color: #FF582B;">￥{{item.Amount}}</view>
					</view>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center ml-1">
				<view class="d-flex flex-row" style="width: 60%;">
					<view class="font-26 font-weight">创建时间:</view>
					<view class="font-26 ml">{{item.CreateTime}}</view>
				</view>
				<view class="d-flex flex-row" style="width: 23%;">
					<view v-if="item.Status == 2">
						<view class="font-28 border pl-1 pr-1 btn-blue-white" @click="checkPayStatus">查询支付</view>
					</view>
				</view>
				<view class="d-flex flex-row" style="width: 17%;">
					<view class="font-28 border pl-1 pr-1 btn-orange-white" @click="orderDetail">明细</view>
				</view>
			</view>
		</view>

		<view class="position-absolute border text-center pl-1 pr-1 rounded-20 font-22" v-if="item.ViewStatus == 0"
		style="right: 30rpx; background-color: red; color: #FFFFFF;">未查看</view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
		},
		data() {
			return {
			}
		},
		props:{
			item:{
				type:Object,
				default:null
			},
			statusList:{
				type: Array,
				default: []
			}
		},
		computed:{
			...mapState({
				goodsList:state=>state.goods.goodsList,
				orderList:state=>state.order.orderList
			}),
			...mapGetters([
			])
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
				'updateGoodsListFunc'
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
			}
		}
	}
</script>

<style>

</style>