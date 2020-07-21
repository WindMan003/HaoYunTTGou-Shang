<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		<view class="d-flex a-center j-center flex-column" style="height: 700rpx;">
			<view class="d-flex border a-center font-30 mt-2" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="number" :value="phone" placeholder="输入手机号" maxlength="11" @blur="phoneInput"/>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="d-flex border a-center font-30 bg-white" style="width: 300rpx; height: 60rpx;">
					<input class="ml-2" type="number" :value="code" placeholder="验证码" maxlength="6" @blur="phoneCodeInput"/>
				</view>
				<view class="ml-2 border btn-orange-white" @click="sendphoneCode"
				style="width: 180rpx; height: 60rpx; border-radius: 5rpx;">
					<text class="font-26 d-flex a-center j-center" style="height: 60rpx;">{{codeBut}}</text>
				</view>
			</view>
			
			<view class="border mt-2 font-30" style="width: 500rpx;" v-if="isShowAccountInfo && infoList.length > 1">
				<view class="ml-2">
					<uni-combox placeholder="选择需要修改密码的店铺" :value="getAccountName" :candidates="getAccountNameList" 
					@input="accountNameInput"></uni-combox>
				</view>
			</view>
			
			<view class="mt-2 border d-flex flex-column font-30" style="width: 500rpx;" v-if="isShowAccountInfo && accountInfo !=''">
				<view class="d-flex flex-row a-center">
					<view class="ml-3 font-weight">店名：</view>
					<view class="">{{accountInfo.Name}}</view>
				</view>
				<view class="d-flex flex-row a-center">
					<view class="ml-3 font-weight">账号：</view>
					<view class="">{{accountInfo.Account}}</view>
				</view>
			</view>
			
			<view class="d-flex border a-center font-30 bg-white mt-2" style="width: 500rpx; height: 60rpx;" v-if="accountInfo !=''">
				<input class="ml-2" type="password" :value="pass" placeholder="密码" maxlength="16" @blur="passInput"/>
			</view>
			
			<view class="d-flex border a-center font-30 bg-white mt-2" style="width: 500rpx; height: 60rpx;" v-if="accountInfo !=''">
				<input class="ml-2" type="password" :value="passAgn" placeholder="确认密码" maxlength="16" @blur="passAgnInput"/>
			</view>
		</view>
		
		<view class="w-100 d-flex a-center j-center" v-if="accountInfo !=''">
			<view class="font-38 font-weight btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 200rpx;" @click="findPassword">确定</view>
		</view>
	</view>
	
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		data() {
			return {
				pass:'',
				passAgn:'',
				codeBut:'发送验证码',
				codeClick:true,
				code:'',
				phone:'',
				infoList:'',
				accountInfo:''
			}
		},
		computed:{
			...mapState({
				mobilephone:state=>state.user.mobilephone
			}),
			isShowAccountInfo(){
				var length = this.infoList.length
				return true  //显示账号
				// if(length > 1){
				// 	return true
				// }else{
				// 	return false
				// }
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
			passInput(e){
				this.pass = e.detail.value
			},
			passAgnInput(e){
				this.passAgn = e.detail.value
			},
			phoneCodeInput(e){
				this.code = e.detail.value
				this.getInfoByPhone()
			},
			phoneInput(e){
				this.phone = e.detail.value
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
			findPassword(){
				var _self = this
				if(_self.pass == ''){
					uni.showToast({title: '请输入密码', icon:'none', duration: 1500})
					return
				}
				if(_self.pass != _self.passAgn){
					uni.showToast({title: '两次输入密码不一样', icon:'none', duration: 1500})
					return
				}
				if(_self.code == ''){
					uni.showToast({title: '请输入验证码', icon:'none', duration: 1500})
					return
				}
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/safe/FindbackPwd',{
					Mobilephone:_self.phone,
					MerchantID:_self.accountInfo.ID,
					Code:_self.code,
					Password:_self.pass,
					PasswordAgn:_self.passAgn
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showToast({title: '找回密码成功', icon:'none', duration: 1500})
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},1500)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			sendphoneCode(){
				var _self = this
				if(_self.phone == ''){
					uni.showToast({title:'请输入手机号', icon:'none', duration:1500})
					return
				}
				if(_self.codeClick){
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
					}, 1000)
				}
			},
			sendCode(){
				var _self = this
				_self.$H.post('/api/merchant/SendCode',{
					Mobilephone:_self.phone
				},{
					token:true
				}).then(res=>{
					if(res.status === 0){
						
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			// 通过手机号获取商家信息
			getInfoByPhone(){
				var _self = this
				console.log("Mobilephone:"+_self.phone)
				_self.$H.post('/api/merchant/GetAccountsByMobilephone',{
					Mobilephone:_self.phone,
					Code:_self.code
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.infoList = res.data
						if(_self.infoList.length == 1){
							_self.accountInfo = _self.infoList[0]
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
		}
	}
</script>

<style>

</style>
