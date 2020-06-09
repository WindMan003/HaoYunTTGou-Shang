<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		<view class="d-flex a-center j-center flex-column" style="height: 650rpx;">		
			<view class="d-flex border a-center font-30 mt-2" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="number" :value="oldPhone" placeholder="输入旧手机号" maxlength="11" @blur="oldPhoneInput"/>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="d-flex border a-center font-30 bg-white" style="width: 300rpx; height: 60rpx;">
					<input class="ml-2" type="number" :value="oldCode" placeholder="验证码" maxlength="6" @blur="oldCodeInput"/>
				</view>
				<view class="ml-2 border btn-blue-white" @click="sendoldCode"
				style="width: 180rpx; height: 60rpx; border-radius: 5rpx;">
					<text class="font-26 d-flex a-center j-center" style="height: 60rpx;">{{codeBut1}}</text>
				</view>
			</view>
			
			<view class="d-flex border a-center font-30 mt-2" style="width: 500rpx; height: 60rpx;">
				<input class="ml-2" type="number" :value="newPhone" placeholder="输入新手机号" maxlength="11" @blur="newPhoneInput"/>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="d-flex border a-center font-30 bg-white" style="width: 300rpx; height: 60rpx;">
					<input class="ml-2" type="number" :value="newCode" placeholder="验证码" maxlength="6" @blur="newCodeInput"/>
				</view>
				<view class="ml-2 border btn-blue-white" @click="sendnewCode"
				style="width: 180rpx; height: 60rpx; border-radius: 5rpx;">
					<text class="font-26 d-flex a-center j-center" style="height: 60rpx;">{{codeBut2}}</text>
				</view>
			</view>
		</view>
		
		<view class="w-100 d-flex a-center j-center">
			<view class="font-38 font-weight btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 200rpx;" @click="changePhone">更换</view>
		</view>
	</view>
	
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		data() {
			return {
				oldPhone:'',
				oldCode:'',
				newPhone:'',
				newCode:'',
				codeBut1:'发送验证码',
				codeBut2:'发送验证码',
				codeClick1:true,
				codeClick2:true
			}
		},
		computed:{
			...mapState({

			})
		},
		methods: {
			...mapMutations([
			]),
			oldPhoneInput(e){
				this.oldPhone = e.detail.value
			},
			oldCodeInput(e){
				this.oldCode = e.detail.value
			},
			newPhoneInput(e){
				this.newPhone = e.detail.value
			},
			newCodeInput(e){
				this.newCode = e.detail.value
			},
			changePhone(){
				var _self = this
				if(_self.oldPhone == ''){
					uni.showToast({title: '输入旧手机号', icon:'none', duration: 1500})
					return
				}
				if(_self.newPhone == ''){
					uni.showToast({title: '输入新手机号', icon:'none', duration: 1500})
					return
				}
				if(_self.oldCode == '' || _self.newCode == ''){
					uni.showToast({title: '输入验证码', icon:'none', duration: 1500})
					return
				}
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/safe/UpdateMobilephone',{
					OldMobilephone:_self.oldPhone,
					OldCode:_self.oldCode,
					NewMobilephone:_self.newPhone,
					NewCode:_self.newCode
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showToast({title:'修改手机号成功', icon:'none', duration: 1500})
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
			sendoldCode(){
				var _self = this
				if(_self.codeClick1 && _self.oldPhone!= ''){
					//发送验证码
					_self.sendCode(_self.oldPhone, 1)
				}
			},
			sendnewCode(){
				var _self = this
				if(_self.codeClick2 && _self.newPhone!= ''){
					//发送验证码
					_self.sendCode(_self.newPhone, 2)
				}
			},
			sendCode(phoneNum, type){
				var _self = this
				var temp = {}
				temp.Mobilephone = phoneNum
				if(type == 2){
					temp.MerchantID = 0
				}
				_self.$H.post('/api/Safe/SendCode',temp,{
					token:true
				}).then(res=>{
					if(res.status == 0){
						if(type == 1){
							_self.startCountdown1()
						}else if(type == 2){
							_self.startCountdown2()
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			startCountdown1(){
				var _self = this
				_self.codeClick1 = false
				// 倒计时开始
				var daojishi = 60
				_self.codeBut1 = "重新发送" + daojishi;
				_self.timer = setInterval(function(){
					daojishi--
					_self.codeBut1 = "重新发送" + daojishi;
					if(daojishi <= 0){
						_self.codeBut1 = "重新发送"
						_self.codeClick1 = true
						clearInterval(_self.timer);
					}
				}, 1000)
			},
			startCountdown2(){
				var _self = this
				_self.codeClick2 = false
				// 倒计时开始
				var daojishi = 60
				_self.codeBut2 = "重新发送" + daojishi;
				_self.timer = setInterval(function(){
					daojishi--
					_self.codeBut2 = "重新发送" + daojishi;
					if(daojishi <= 0){
						_self.codeBut2 = "重新发送"
						_self.codeClick2 = true
						clearInterval(_self.timer);
					}
				}, 1000)
			}
		}
	}
</script>

<style>

</style>
