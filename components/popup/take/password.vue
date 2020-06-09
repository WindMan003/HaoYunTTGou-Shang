<template>
	<uni-popup type="center" ref="popup" @change="change" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex flex-column w-100 bg-white" style="height: 400rpx; border-radius: 3%;">
			<view class="d-flex flex-row a-center mt-1 p-1 j-center position-relative">
				<view class="font-32" style="color: #333333;">请输入提现密码</view>
				<view class="position-absolute" style="width: 50rpx; height: 50rpx; right: 15rpx; top: 5rpx;" @tap="close">
					<image src="@/static/take/close.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="d-flex a-center j-center mt-3">
				<view class="d-flex border a-center font-30 bg-white mt-3" style="width: 500rpx; height: 60rpx;">
					<input class="ml-2" type="password" :value="password" placeholder="密码" maxlength="16" @blur="passwordInput"/>
				</view>
			</view>
			<view class="d-flex j-center mb-2 mt-8">
				<view class="border font-38 pl-2 pr-2 btn-orange-white rounded-10"  @click="complete">完成</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	export default{
		data() {
			return {
				password:''
			}
		},
		methods:{
			showPopup(){
				this.$refs.popup.open()
			},
			change(e){
				if(!e.show){
					this.password = ''
				}
			},
			close(){
				this.$refs.popup.onTap()
			},
			passwordInput(e){
				this.password = e.detail.value
			},
			complete(){
				if(this.password == ''){
					uni.showToast({title: '请输入密码', icon:'none', duration: 1500})
					return
				}
				this.$emit('complete', this.password)
				this.$refs.popup.onTap()
			}
			
		}
	}
</script>

<style>

</style>
