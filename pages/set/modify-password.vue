<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		<view class="d-flex a-center j-center flex-column" style="height: 500rpx;">		
			<view class="d-flex border a-center font-30 mt-2" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="password" :value="oldPassword" placeholder="原密码" maxlength="16" @blur="oldPasswordInput"/>
			</view>
			
			<view class="d-flex border a-center font-30 mt-2" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="password" :value="newPassword" placeholder="新密码" maxlength="16" @blur="newPasswordInput"/>
			</view>
			
			<view class="d-flex border a-center font-30 mt-2" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="password" :value="newPasswordAgn" placeholder="确认新密码" maxlength="16" @blur="newPasswordAgnInput"/>
			</view>
			
			<view class="d-flex a-center mt-2 position-relative" style="width: 500rpx; height: 60rpx;">
				<view class="font-24 position-absolute" style="right: 0; color: #007AFF;" @click="findPassword">忘记密码?</view>
			</view>
		</view>
		
		<view class="w-100 d-flex a-center j-center">
			<view class="font-38 font-weight btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 200rpx;" @click="modifyPassword">修改</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				oldPassword:'',
				newPassword:'',
				newPasswordAgn:''
			}
		},
		methods: {
			oldPasswordInput(e){
				this.oldPassword = e.detail.value
			},
			newPasswordInput(e){
				this.newPassword = e.detail.value
			},
			newPasswordAgnInput(e){
				this.newPasswordAgn = e.detail.value
			},
			modifyPassword(){
				var _self = this
				if(_self.oldPassword == '' || _self.newPassword == '' || _self.newPasswordAgn == ''){
					uni.showToast({title: '请将密码填写完整', icon:'none', duration: 1500})
					return
				}
				if(_self.newPassword != _self.newPasswordAgn){
					uni.showToast({title: '两次输入新密码不一样', icon:'none', duration: 1500})
					return
				}
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Safe/UpdatePwd',{
					OldPassword:_self.$md5(_self.oldPassword),
					Password:_self.newPassword,
					PasswordAgn:_self.newPasswordAgn
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showToast({title: '设置密码成功', icon:'none', duration: 1500})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						}, 1500)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			findPassword(){
				uni.navigateTo({
					url:'./find-password'
				})
			},
		}
	}
</script>

<style>

</style>
