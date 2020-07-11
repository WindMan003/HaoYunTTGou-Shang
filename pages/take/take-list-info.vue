<template>
	<view class="main" style="background-color: #F5F5F5;" :style="'height:'+windowH+'px;'">
		<view class="w-100 border-top"></view>
		
		<view class="bg-white">
			<view class="d-flex flex-column a-center j-center border-bottom" style="height: 220rpx;">
				<view class="font-32">提现</view>
				<view class="font-38 font-weight mt-2">-{{getAmount}}</view>
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
				<view class="d-flex flex-row a-center mt-2">
					<view class="font-26 text-muted" style="width: 24%;">提现状态</view>
					<view class="font-26">{{statusText}}</view>
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
				item:[],
				statusText:''
			}
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.windowH = res.windowHeight
				}
			})
			
			this.item = JSON.parse(decodeURIComponent(option.item))
			this.statusText = option.status
		},
		computed:{
			getAmount(){
				var amount = this.item.Amount
				if(amount){
					return amount
				}
			}
		},
		methods: {
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
