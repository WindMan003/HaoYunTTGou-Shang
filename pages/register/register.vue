<template>
	<view class="w-100">
		<view class="d-flex flex-column mt-3" style="width: 96%;">
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">店铺所属行业：</view>
				</view>
				<view class="" style="width: 65%;">
					<view class="border" style="width: 400rpx;">
						<view class="ml-1">
							<uni-combox :value="getServiceTypeName" :candidates="getServiceTypeNameList"
							@input="serviceTypeInput"></uni-combox>
						</view>
					</view>
				</view>
			</view>
					
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">店铺类别：</view>
				</view>
				<view class="" style="width: 65%;">
					<view class="border" style="width: 400rpx;">
						<view class="ml-1">
							<uni-combox :value="getMerchantTypeName" :candidates="getMerchantTypeNameList"
							@input="merchantTypeInput"></uni-combox>
						</view>
					</view>
				</view>
			</view>
			 
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">店铺名称：</view>
				</view>
				<view class="border" style="width: 400rpx;">
					<input class="font-30 ml-1"  type="text" :value="nameText" placeholder="店铺名称" maxlength="16" @blur="nameInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">账号：</view>
				</view>
				<view class="d-flex flex-column">
					<view class="border" style="width: 400rpx;">
						<input class="font-30 ml-1" type="text" :value="accountText" placeholder="注册账号" maxlength="16" @blur="accountInput"/>
					</view>
					<view class="font-24" style="height: 40rpx;">
						<text class="" style="color: #4CD964;" v-if="isRepeat == 1">*账号可以注册</text>
						<text class="" style="color: red;" v-else-if="isRepeat == 2">*账号重复</text>
					</view>
					</view>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">密码：</view>
				</view>
				<view class="border" style="width: 400rpx;">
					<input class="font-30 ml-1" type="password" :value="passwordText" placeholder="密码" maxlength="16" @blur="passwordInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">确认密码：</view>
				</view>
				<view class="border" style="width: 400rpx;">
					<input class="font-30 ml-1" type="password" :value="passwordAgnText" placeholder="确认密码" maxlength="16" @blur="passwordAgnInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">手机号：</view>
				</view>
				<view class="d-flex flex-column">
					<view class="border" style="width: 400rpx;">
						<input class="font-30 ml-1" type="number" :value="mobilephoneText" placeholder="手机号" maxlength="11" @blur="mobilephoneInput"/>
					</view>
					<view class="d-flex flex-row a-center mt-1" style="height: 50rpx;">
						<view class="border font-26 pl-1 pr-1 text-center btn-orange-white" @click="sendphoneCode" 
						style="border-radius: 5rpx; width: 160rpx;">
							{{codeBut}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">验证码：</view>
				</view>
				<view class="border" style="width: 400rpx;">
					<input class="font-30 ml-1" type="number" :value="mobilephoneCodeText" placeholder="手机验证码" maxlength="6" @blur="mobilephoneCodeInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row mt-2">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">代理邀请码：</view>
				</view>
				<view class="border" style="width: 400rpx;">
					<input class="font-30 ml-1" type="text" :value="agentIDText" placeholder="没有可以不填" maxlength="16" @blur="agentIDInput"/>
				</view>
			</view>
		</view>
		
		<view class="d-flex a-center j-center mt-5">
			<view class="border d-flex a-center j-center btn-orange-white" style="width: 200rpx; height: 80rpx;"
			@click="saveChange">
				<text class="font-38 font-weight">注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniCombox from "@/components/uni-combox/uni-combox.vue"
	
	import {mapState, mapMutations} from 'vuex'
	export default {
		components:{
			uniCombox
		},
		data() {
			return {
				timer:null,
				codeClick:true,
				codeBut:'发送验证码',
				isRepeat:0,
				serviceType:'',
				servieTypeList:'',
				merchantType:'',
				merchantTypeList:'',
				nameText:'',
				accountText:'',
				passwordText:'',
				passwordAgnText:'',
				mobilephoneText:'',
				mobilephoneCodeText:'',
				agentIDText:'',
			}
		},
		onLoad() {
			this.__init()
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		computed:{
			...mapState({
				clientid:state=>state.user.clientid,
				uuid:state=>state.user.uuid
			}),
			getServiceTypeName(){
				if(this.servieTypeList != ''){
					var temp = this.servieTypeList
					for (var i = 0; i < temp.length; i++) {
						if(temp[i].Value == this.serviceType){
							return temp[i].Text
						}
					}
				}else{
					return '请选择'
				}
			},
			getServiceTypeNameList(){
				var temp = []
				if(this.servieTypeList != ''){
					var templist = this.servieTypeList
					for (var i = 0; i < templist.length; i++) {
						temp.push(templist[i].Text)
					}
				}
				return temp
			},
			getMerchantTypeName(){
				if(this.merchantTypeList != ''){
					var temp = this.merchantTypeList
					for (var i = 0; i < temp.length; i++) {
						if(temp[i].Value == this.merchantType){
							return temp[i].Text
						}
					}
				}else{
					return '请选择'
				}
			},
			getMerchantTypeNameList(){
				var temp = []
				if(this.merchantTypeList != ''){
					var templist = this.merchantTypeList
					for (var i = 0; i < templist.length; i++) {
						temp.push(templist[i].Text)
					}
				}
				return temp
			}
		},
		methods: {
			...mapMutations([
				'login'
			]),
			__init(){
				this.getServieTypeList()
			},
			nameInput(e){
				this.nameText = e.detail.value
			},
			getServieTypeList(){
				var _self = this;
				_self.$H.post('/api/merchant/ServieType',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.servieTypeList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			getMerchantTypeList(ServieType){
				var _self = this;
				var infoList  = {}
				if(ServieType){
					infoList.ServieType = ServieType
				}
				_self.$H.post('/api/merchant/MerchantType',infoList,{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.merchantTypeList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			serviceTypeInput(e){
				var temp = this.servieTypeList
				for (var i = 0; i < temp.length; i++) {
					let tempName = temp[i].Text
					if(tempName == e && this.serviceType != temp[i].Value){
						this.serviceType = temp[i].Value
						this.merchantType = 0
						this.getMerchantTypeList(this.serviceType)
						return
					}
				}
			},
			merchantTypeInput(e){
				var temp = this.merchantTypeList
				for (var i = 0; i < temp.length; i++) {
					let tempName = temp[i].Text
					if(tempName == e){
						this.merchantType = temp[i].Value
						return
					}
				}
			},
			accountInput(e){
				var _self = this;
				if(e.detail.value == ''){
					this.isRepeat = 0
					return
				}
				_self.$H.post('/api/merchant/ValidateAccount',{
					Account:e.detail.value
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.isRepeat = 1
						_self.accountText = e.detail.value
					}else{
						_self.isRepeat = 2
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			passwordInput(e){
				this.passwordText = e.detail.value
			},
			passwordAgnInput(e){
				this.passwordAgnText = e.detail.value
			},
			mobilephoneInput(e){
				this.mobilephoneText = e.detail.value
			},
			mobilephoneCodeInput(e){
				this.mobilephoneCodeText = e.detail.value
			},
			agentIDInput(e){
				this.agentIDText = e.detail.value
			},
			sendphoneCode(){
				var _self = this
				if(_self.codeClick){
					if(_self.mobilephoneText.length != 11){
						uni.showToast({title: '请输入正确的手机号',icon: 'none',duration: 1000});
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
						},1000)
					}
				}
			},
			sendCode(){
				var _self = this
				console.log("Mobilephone:"+_self.mobilephoneText)
				_self.$H.post('/api/merchant/SendCode',{
					Mobilephone:_self.mobilephoneText,
					MerchantID:0
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status === 0){
						
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			saveChange(){
				var _self = this;
				// 判断重复点击
				var bool = _self.checkInformation()
				if(!bool){
					return false
				}
				if(_self.agentIDText == ''){
					_self.agentIDText = 0
				}
				if(!_self.$Common.butClickStart()) return;
				_self.$H.post('/api/Merchant/Register',{
					Name:_self.nameText,
					Account:_self.accountText,
					Password:_self.passwordText,
					PasswordAgn:_self.passwordAgnText,
					Mobilephone:_self.mobilephoneText,
					MobilephoneCode:_self.mobilephoneCodeText,
					ServiceType:_self.serviceType,
					MerchantTypeID:_self.merchantType,
					AgentID:_self.agentIDText,
					UniPushClientID:_self.clientid,
					MachineID:_self.uuid
				},{
					token:true
				}).then(res=>{
					console.log(res)
					_self.$Common.butClickEnd();
					if(res.status == 0){
						uni.setStorageSync('m_token', res.data.token)
						_self.login(res.data)
						uni.switchTab({
							url: '/pages/index/index'
						})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			checkInformation(){
				if(this.serviceType == ''){
					uni.showToast({title:'店铺行业未选', icon:'none', duration:1500})
					return false
				}
				if(this.merchantType == ''){
					uni.showToast({title:'店铺类别未选', icon:'none', duration:1500})
					return false
				}
				if(this.nameText == ''){
					uni.showToast({title:'店铺名字不能为空', icon:'none', duration:1500})
					return false
				}
				if(this.accountText == ''){
					uni.showToast({title:'账号不能为空', icon:'none', duration:1500})
					return false
				}
				if(this.passwordText == ''){
					uni.showToast({title:'密码不能为空', icon:'none', duration:1500})
					return false
				}
				if(this.passwordText != this.passwordAgnText){
					uni.showToast({title:'两次密码不一样', icon:'none', duration:1500})
					return false
				}
				if(this.mobilephoneText == ''){
					uni.showToast({title:'手机号不能为空', icon:'none', duration:1500})
					return false
				}
				if(this.mobilephoneCodeText == ''){
					uni.showToast({title:'验证码不能为空', icon:'none', duration:1000})
					return false
				}
				
				return true
			}
		}
	}
</script>

<style>

</style>
