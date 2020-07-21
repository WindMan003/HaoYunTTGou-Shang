<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		<view class="d-flex a-center j-center flex-column" style="height: 500rpx;">
			<view class="d-flex border a-center font-30 bg-white" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="password" :value="pass" placeholder="密码" maxlength="16" @blur="passInput"/>
			</view>
			
			<view class="d-flex border a-center font-30 bg-white mt-2" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="password" :value="passAgn" placeholder="确认密码" maxlength="16" @blur="passAgnInput"/>
			</view>
			
			<view class="d-flex border a-center font-30 bg-white mt-2" style="width: 500rpx; height: 60rpx;">
				<view class="ml-2">手机号：{{getVaguePhoneNumber}}</view>
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
		</view>
		
		<view class="w-100 d-flex a-center j-center">
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
				code:''
			}
		},
		computed:{
			...mapState({
				mobilephone:state=>state.user.mobilephone
			}),
			getVaguePhoneNumber(){
				var array = this.mobilephone
				var mphone = array.substring(0, 3) + '****' + array.substring(7)

				return mphone
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
				_self.$H.post('/api/Finance/ResetTakePassword',{
					TakePassword:_self.pass,
					TakePasswordAgn:_self.passAgn,
					Code:_self.code
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showToast({title: '找回提现密码成功', icon:'none', duration: 1500})
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
				_self.$H.post('/api/TakeAccount/SendCode',{},{
					token:true
				}).then(res=>{
					if(res.status === 0){
						
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			}
		}
	}
</script>

<style>

</style>
