<template>
	<view class="d-flex flex-column a-center" style="background-color: #F5F5F5;" :style="'height:'+ windowHeight + 'px'">
		<view class="" style="width: 94%;">
			<view class="d-flex flex-row a-center mt-3">
				<view class="">是否开启</view>
				<checkbox-group @change="enableStatus">
					<label class="ml-2">
						<checkbox value="cb" :checked="isEnable"/>
					</label>
				</checkbox-group>
			</view>
			
			<block v-if="isEnable">
				<view class="mt-3">满减金额</view>
				<view class="d-flex flex-row a-center">
					<view class="border p-1 bg-white" style="width: 150rpx;">
						<input type="number" value="" />
					</view>
					<view class="ml">元</view>
				</view>
				
				<view class="mt-2">减少金额</view>
				<view class="d-flex flex-row a-center ">
					<view class="border p-1 bg-white" style="width: 150rpx;">
						<input type="number" value="" />
					</view>
					<view class="ml">元</view>
				</view>

				<view class="w-100 d-flex a-center j-center" style="margin-top: 100rpx;">
					<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
					style="width: 90%;" @click="upload">保存</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowHeight: 0,
				isEnable: false
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
				}
			})
		},
		methods: {
			enableStatus(e){
				var temp =  e.detail.value
				if(temp.length > 0){
					this.isEnable = true
				}else{
					this.isEnable = false
				}
			},
			upload(){
				
			}
		}
	}
</script>

<style>

</style>
