<template>
	<view class="d-flex flex-column position-fixed">
		<view class="w-100 mt-5 d-flex flex-row a-center">
			<view class="d-flex j-end" style="width: 35%;">设备PIN码</view>
			<view class="ml-3" style="width: 65%;">
				<input class="border" style="width: 300rpx;" type="text" :value="PIN" @input="PINInput"/>
			</view>
		</view>
		<view class="w-100 mt-3 d-flex flex-row a-center">
			<view class="d-flex j-end" style="width: 35%;">设备key</view>
			<view class="ml-3" style="width: 65%;">
				<input class="border" style="width: 300rpx;" type="text" :value="key" @input="keyInput"/>
			</view>
		</view>
		<view class="w-100 d-flex a-center j-center" style="margin-top: 70rpx;">
			<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 90%;" @click="toBind">绑定</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PIN: '',
				key: ''
			}
		},
		onLoad() {
			
		},
		methods: {
			PINInput(e){
				this.PIN = e.detail.value
			},
			keyInput(e){
				this.key = e.detail.value
			},
			toBind(){
				
			}
		}
	}
</script>

<style>

</style>
