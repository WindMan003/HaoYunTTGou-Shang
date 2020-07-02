<template>
	<view class="w-100" style="height: 100%;">
		<!-- 占位 -->
		<view class="mt-1 position-relative">
			<view class="font-26 border rounded-10 pl-1 pr-1 position-absolute btn-orange-white text-center" 
			style="right: 15rpx;" @click="chooseLoginIdentity">选择登录入口</view>
		</view>
		<view class="" style="height: 200rpx;"></view> 
		<view class="d-flex flex-row border-bottom pb-1">
			<view class="" style="width: 10%;"></view>
			<view class="font-32 text-center" style="width: 40%;" @click="loginType1"
			:class="loginType == 1 ? 'font-weight text-OrangeRed':''">
				账号密码登录
			</view>
			<view class="font-32 text-center" style="width: 40%;" @click="loginType2"
			:class="loginType == 2 ? 'font-weight text-OrangeRed':''">
				手机验证登录
			</view>
			
			<view class="" style="width: 10%;"></view>
		</view>
		
		<view class="d-flex flex-column mt-4">
			<block v-if="loginType == 1">
				<view class="d-flex border a-center font-30 bg-white" style="margin-left: 120rpx; width: 500rpx; height: 60rpx;">
					<image class="ml" src="@/static/login/zhanghao.png" mode="widthFix" style="width: 35rpx;"></image>
					<input class="ml-1" type="text" :value="account" placeholder="账号" maxlength="16" @blur="accountInput"/>
				</view>
				<view class="d-flex border a-center mt-2 font-30 bg-white" style="margin-left: 120rpx; width: 500rpx; height: 60rpx;">
					<image class="ml" src="@/static/login/mima.png" mode="widthFix" style="width: 35rpx;"></image>
					<input class="ml-1" type="password" :value="password" placeholder="密码" maxlength="16" @blur="passwordInput"/>
				</view>
				<view class="d-flex a-center mt-2 position-relative" style="margin-left: 120rpx; width: 500rpx; height: 60rpx;">
					<view class="font-24 position-absolute" style="right: 0; color: #007AFF;" @click="findPassword">忘记密码?</view>
				</view>
			</block>
			
			<block v-if="loginType == 2">
				<view class="d-flex border a-center font-30 bg-white" style="margin-left: 120rpx; width: 500rpx; height: 60rpx;">
					<image class="ml" src="@/static/login/shouji.png" mode="widthFix" style="width: 35rpx;"></image>
					<input class="ml-1" type="number" :value="phone" placeholder="手机号" maxlength="11" @blur="phoneInput"/>
				</view>
				
				<view class="d-flex flex-row mt-2">
					<view class="d-flex border a-center font-30 bg-white" style="margin-left: 120rpx; width: 300rpx; height: 60rpx;">
						<input class="ml-1" type="number" :value="phoneCode" placeholder="验证码" maxlength="6" @blur="phoneCodeInput"/>
					</view>
					<view class="ml-2 border btn-blue-white" @click="sendphoneCode"
					style="width: 180rpx; height: 60rpx; border-radius: 5rpx;">
						<text class="font-26 d-flex a-center j-center" style="height: 60rpx;">{{codeBut}}</text>
					</view>
				</view>
				
				<view class="border mt-2 font-30" style="margin-left: 120rpx; width: 500rpx;" v-if="isShowAccountInfo">
					<view class="ml-2">
						<uni-combox placeholder="选择需要登录的账号" :value="getAccountName" :candidates="getAccountNameList" 
						@input="accountNameInput"></uni-combox>
					</view>
				</view>
				
				<view class="mt-2 border d-flex flex-column font-30" style="margin-left: 120rpx; width: 500rpx;" v-if="isShowAccountInfo && accountInfo != ''">
					<view class="d-flex flex-row a-center">
						<view class="ml-3 font-weight">店名：</view>
						<view class="">{{accountInfo.Name}}</view>
					</view>
					<view class="d-flex flex-row a-center">
						<view class="ml-3 font-weight">账号：</view>
						<view class="">{{accountInfo.Account}}</view>
					</view>
				</view>
			</block>
		</view>
		
		<view class="d-flex flex-row j-center" style="margin-top: 80rpx;">
			<view class="d-flex a-center">
				<view class="border d-flex a-center mr-3 j-center btn-orange-white" style="width: 200rpx; height: 80rpx;"
				@click="register">
					<text class="font-38 font-weight">注册</text>
				</view>
				<view class="border d-flex a-center ml-3 j-center btn-orange-white" style="width: 200rpx; height: 80rpx;"
				@click="loginUp">
					<text class="font-38 font-weight">登录</text>
				</view>
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
				password:'',
				// account:'qazwsxedc',
				// password:'123123',
				phone: '',
				phoneCode: '',
				loginType: 1,
				codeBut: '发送验证码',
				codeClick: true,
				infoList: '',
				accountInfo: ''
			}
		},
		onLoad() {
			var m_token = uni.getStorageSync('m_token')
			console.log(m_token)
			if(m_token != ''){
				// 直接登录
				this.loginByToken(m_token)
			}
		},
		computed:{
			...mapState({
				clientid:state=>state.user.clientid,
				uuid:state=>state.user.uuid
			}),
			isShowAccountInfo(){
				var length = this.infoList.length
				if(length > 1){
					return true
				}else{
					return false
				}
			},
			getAccountName(){
				return this.accountInfo.Name
			},
			getAccountNameList(){
				var temp = []
				if(this.infoList != ''){
					var templist = this.infoList
					for (var i = 0; i < templist.length; i++) {
						temp.push(templist[i].Name)
					}
				}
				return temp
			}
		},
		methods: {
			...mapMutations([
				'login'
			]),
			accountInput(e){
				this.account = e.detail.value
			},
			passwordInput(e){
				this.password = e.detail.value
			},
			phoneInput(e){
				this.phone = e.detail.value
			},
			phoneCodeInput(e){
				this.phoneCode = e.detail.value
				this.getInfoByPhone()
			},
			loginByToken(m_token){
				var _self = this
				_self.$H.post('/api/merchant/ValidateToken',{
					MachineID: _self.uuid,
					token: m_token
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						//存储用户信息
						_self.login(res.data)
						uni.switchTab({
							url: '/pages/index/index',
						})
					}else{
						// uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			// 通过手机号获取商家信息
			getInfoByPhone(){
				var _self = this
				console.log("Mobilephone:"+_self.phone)
				_self.$H.post('/api/merchant/GetAccountsByMobilephone',{
					Mobilephone:_self.phone,
					Code:_self.phoneCode
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.infoList = res.data
						if(_self.infoList.length == 1){
							_self.accountInfo = _self.infoList[0]
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			accountNameInput(e){
				var temp = this.infoList
				for (var i = 0; i < temp.length; i++) {
					let tempName = temp[i].Name
					if(tempName == e){
						this.accountInfo = temp[i]
						return
					}
				}
			},
			loginType1(){
				this.loginType = 1
			},
			loginType2(){
				this.loginType = 2
			},
			loginUp(){
				if(this.loginType == 1){
					this.loginUpByAcount()
				}else if(this.loginType == 2 && this.accountInfo != ''){
					this.loginUpByPhoneCode()
				}
			},
			loginUpByAcount(){
				var _self = this
				if(_self.account == ""){
					uni.showToast({title: '账号为空', icon: 'none', duration:1500})
					return
				} 
				if(_self.password == ""){
					uni.showToast({title: '密码为空', icon: 'none', duration:1500})
					return
				}
				
				console.log(_self.account, _self.password)
				uni.showLoading({title: '登录中...'})
				_self.$H.post('/api/merchant/Login',{
					account:_self.account,
					password:_self.$md5(_self.password),
					UniPushClientID:_self.clientid,
					MachineID:_self.uuid
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.setStorageSync('m_token', res.data.token)
						//存储用户信息
						_self.login(res.data)
						uni.switchTab({
							url: '/pages/index/index',
						})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:3000})
					}
				})
			},
			loginUpByPhoneCode(){
				var _self = this
				if(_self.phone == ""){
					uni.showToast({title: '手机号为空', icon: 'none', duration:1500})
					return
				} 
				if(_self.phoneCode == ""){
					uni.showToast({title: '验证码为空', icon: 'none', duration:1500})
					return
				}
				
				console.log(_self.phone, _self.phoneCode, _self.accountInfo.ID, _self.uuid)
				uni.showLoading({title: '登录中...'})
				_self.$H.post('/api/merchant/LoginByMobilephoneCode',{
					Mobilephone:_self.phone,
					MobilephoneCode:_self.phoneCode,
					ID:_self.accountInfo.ID,
					UniPushClientID:_self.clientid,
					MachineID:_self.uuid
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.setStorageSync('m_token', res.data.token)
						//存储用户信息
						_self.login(res.data)
						uni.switchTab({
							url: '/pages/index/index'
						})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:3000})
					}
				})
			},
			sendphoneCode(){
				var _self = this
				if(_self.codeClick){
					if(_self.phone.length != 11){
						uni.showToast({title: '请输入正确的手机号',icon: 'none',duration: 1500});
					}else{
						//发送验证码
						_self.sendCode()
						_self.codeClick = false
						// 倒计时开始
						var daojishi = 60
						_self.codeBut = "重新发送" + daojishi;
						_self.timer = setInterval(function(){
							daojishi--
							_self.codeBut = "重新发送" + daojishi;
							if(daojishi <= 0){
								_self.codeBut = "重新发送"
								_self.codeClick = true
								clearInterval(_self.timer);
							}
						}, 1500)
					}
				}
			},
			sendCode(){
				var _self = this
				_self.$H.post('/api/merchant/SendCode',{
					Mobilephone:_self.phone
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status === 0){
						
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			register(){
				uni.navigateTo({
					url:'../register/register'
				})
			},
			findPassword(){
				uni.navigateTo({
					url:'../set/find-password'
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
