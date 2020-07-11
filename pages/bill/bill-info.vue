<template>
	<view class="main" style="background-color: #F5F5F5;" :style="'height:'+windowH+'px;'">
		<view class="w-100 border-top"></view>
		
		<!-- 提现 -->
		<view class="bg-white" v-if="tradeType == 8">
			<view class="d-flex flex-column a-center j-center border-bottom" style="height: 220rpx;">
				<view class="font-32">提现</view>
				<view class="font-38 font-weight mt-2">-{{item.Amount}}</view>
			</view>
			
			<view class="d-flex flex-column mt-3 ml-3">
				<view class="d-flex flex-row a-center">
					<view class="font-26 text-muted" style="width: 24%;">类型</view>
					<view class="font-26">提现</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">提现方式</view>
					<view class="font-26">{{getTakeType(item.TakeType)}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">提现账户</view>
					<view class="font-26">{{item.TakeAccount}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">提现姓名</view>
					<view class="font-26">{{item.TakeName}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">时间</view>
					<view class="font-26">{{item.CreateTime}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">交易单号</view>
					<view class="font-26">{{item.ID}}</view>
				</view>
				<view class="" style="height: 50rpx;"></view>
			</view>
		</view>
		
		<!-- 用户消费 -->
		<view class="bg-white" v-if="tradeType == 1">
			<view class="d-flex flex-column a-center j-center border-bottom" style="height: 220rpx;">
				<view class="font-32">收入</view>
				<view class="font-38 font-weight mt-2 text-price">+{{getConsumptionAmount}}</view>
			</view>
			
			<view class="d-flex flex-column mt-3 ml-3">
				<view class="d-flex flex-row a-center">
					<view class="font-26 text-muted" style="width: 24%;">订单状态</view>
					<view class="font-26">{{item.StatusText}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">使用代金券</view>
					<view class="font-26">{{item.UseVoucherAmount}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">使用代金币</view>
					<view class="font-26">{{item.UseBuyCoin}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">代金币佣金</view>
					<view class="font-26 text-price">{{item.UseBuyCoinHandlingFee}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">使用幸运币</view>
					<view class="font-26">{{item.UseLuckyCoin}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">幸运币佣金</view>
					<view class="font-26 text-price">{{item.UseLuckyCoinHandlingFee}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">用户支付</view>
					<view class="font-26">{{item.PayAmount}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">支付手续费</view>
					<view class="font-26 text-price">{{item.PayHandlingFee}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">合计支付</view>
					<view class="font-26">{{item.Amount}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">时间</view>
					<view class="font-26">{{item.CreateTime}}</view>
				</view>
				<view class="" style="height: 50rpx;"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowH:0,
				item: [],
				statusText:'',
				orderID: '',
				tradeType: ''
			}
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.windowH = res.windowHeight
				}
			})
			
			console.log(option)
			this.orderID = option.orderID
			this.tradeType = option.tradeType
			
			this.getShowItem()
		},
		computed:{
			getConsumptionAmount(){
				let item = this.item
				let temp = item.Amount - item.PayHandlingFee - item.UseBuyCoinHandlingFee - item.UseLuckyCoinHandlingFee
				return temp.toFixed(4)
			}
		},
		methods: {
			getShowItem(){
				var _self = this;
				var action = ''
				if(_self.tradeType == 1){
					action = '/api/Order/Detail'
				}else if(_self.tradeType == 8){
					action = '/api/Finance/TakeOrderItem'
				}
				var postData = { OrderID: _self.orderID }
				_self.$H.post(action, postData, {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(_self.tradeType == 1){
							this.item = res.data.OrderItem
						}else{
							this.item = res.data
						}
					}else{
						_self.jumpShowToast(res.message)
					}
				})
			},
			getTakeType(typeID){
				if(typeID == 2){
					return '支付宝'
				}
			},
		}
	}
</script>

<style>

</style>
