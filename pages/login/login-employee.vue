<template>
	<view class="w-100" style="height: 100%;">
		<view class="mt-1 position-relative">
			<view class="font-26 border rounded-10 pl-1 pr-1 position-absolute btn-orange-white text-center" 
			style="right: 15rpx;" @click="chooseLoginIdentity">选择登录入口</view>
		</view>
		<!-- 占位 -->
		<view class="" style="height: 200rpx;"></view> 

		<view class="d-flex flex-column mt-4">
			<view class="d-flex border a-center font-30 bg-white" style="margin-left: 120rpx; width: 500rpx; height: 60rpx;">
				<image class="ml" src="@/static/login/zhanghao.png" mode="widthFix" style="width: 35rpx;"></image>
				<input class="ml-1" type="text" :value="account" placeholder="账号" maxlength="16" @blur="accountInput"/>
			</view>
			<view class="d-flex border a-center mt-2 font-30 bg-white" style="margin-left: 120rpx; width: 500rpx; height: 60rpx;">
				<image class="ml" src="@/static/login/mima.png" mode="widthFix" style="width: 35rpx;"></image>
				<input class="ml-1" type="password" :value="password" placeholder="密码" maxlength="16" @blur="passwordInput"/>
			</view>
		</view>
		
		<view class="d-flex j-center" style="margin-top: 80rpx;">
			<view class="border d-flex a-center j-center btn-orange-white" style="width: 200rpx; height: 80rpx;"
			@click="loginUp">
				<text class="font-38 font-weight">登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
		
	export default {
		data() {
			return {
				account:'',
				password:''
			}
		},
		onLoad() {
			// var em_token = uni.getStorageSync('em_token')
			// console.log(em_token)
			// if(em_token != ''){
			// 	// 直接登录
			// 	this.loginByToken(em_token)
			// }
		},
		computed:{
			...mapState({
				clientid:state=>state.user.clientid,
				uuid:state=>state.user.uuid
			})
		},
		methods: {
			...mapMutations([
				'login',
				'initIsEmployee'
			]),
			accountInput(e){
				this.account = e.detail.value
			},
			passwordInput(e){
				this.password = e.detail.value
			},
			loginUp(){
				this.loginUpByAcount()
			},
			loginByToken(em_token){
				var _self = this
				_self.$H.post('/api/Employee/ValidateToken',{
					token:em_token
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						//存储用户信息
						_self.login(res.data)
						uni.reLaunch({
							url: '../order/order-employee'
						})
					}else{
						// uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			loginUpByAcount(){
				var _self = this
				if(_self.account == ""){
					uni.showToast({title: '账号为空', icon: 'none', duration:1000})
					return
				} 
				if(_self.password == ""){
					uni.showToast({title: '密码为空', icon: 'none', duration:1000})
					return
				}
				
				console.log(_self.account, _self.password)
				uni.showLoading({title: '登录中...'})
				_self.$H.post('/api/Employee/login',{
					account:_self.account,
					password:_self.$md5(_self.password),
					UniPushClientID:_self.clientid,
					MachineID:_self.uuid,
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.setStorageSync('em_token', res.data.token)
						//存储用户信息
						_self.login(res.data)
						uni.navigateTo({
							url: '../order/order-employee'
						})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			chooseLoginIdentity(){
				uni.setStorageSync('isMerchant', '')
				uni.navigateTo({
					url:'./login-choose'
				})
			}
		}
	}
</script>

<style>

</style>