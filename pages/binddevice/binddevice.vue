<template>
	<view class="d-flex flex-column position-fixed" style="background-color: #EEEEEE;" :style="'height:'+windowsH+'px'">
		<view class="w-100 d-flex flex-row a-center j-center">
			<view class="rounded-10 border bg-white" style="width: 94%;">
				1
			</view>
		</view>
		
		<view class="position-absolute" style="bottom: 100rpx;">
			<view class="w-100 d-flex a-center j-center">
				<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
				style="width: 90%;" @click="bindNewDevice">绑定新设备</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowsH: 0
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowsH = res.windowHeight
				}
			})
		},
		methods: {
			bindNewDevice(){
				uni.navigateTo({
					url:'./bind-newdevice'
				})
			}
		}
	}
</script>

<style>

</style>
