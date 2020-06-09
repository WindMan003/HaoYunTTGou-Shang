<template>
	<view class="w-100" style="height: 100%;">	
		<view class="d-flex flex-column a-center j-center" style="">
			<view class="" style="height: 200rpx;"></view>
			<view class="border d-flex a-center j-center btn-orange-white" style="width: 200rpx; height: 80rpx;"
			@click="loginByMerchant">
				<text class="font-38 font-weight">商家登录</text>
			</view>
			<view class="border d-flex a-center j-center btn-orange-white mt-5" style="width: 200rpx; height: 80rpx;"
			@click="loginByEmployee">
				<text class="font-38 font-weight">员工登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			var isMerchant = uni.getStorageSync('isMerchant')
			if(isMerchant){
				if(isMerchant == 1){
					uni.navigateTo({
						url:'../login/login'
					})
				}else if(isMerchant == 2){
					uni.navigateTo({
						url:'../login/login-employee'
					})
				}
			}
		},
		methods: {
			loginByMerchant(){
				uni.setStorageSync('isMerchant', 1)
				uni.navigateTo({
					url:'../login/login'
				})
			},
			loginByEmployee(){
				uni.setStorageSync('isMerchant', 2)
				uni.navigateTo({
					url:'../login/login-employee'
				})
			}
		}
	}
</script>

<style>

</style>
