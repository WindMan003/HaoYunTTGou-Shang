<template>
	<view class="main">
		<view class="d-flex flex-row pb-1 mt-5 j-sa border-bottom">
			<block v-for="(item, index) in takeTypeList" :key="index">
				<view class="font-32 text-center" @click="changeTakeType(index)"
				:class="takeType == index ? 'font-weight text-OrangeRed':''">
					{{item.Text}}
				</view>
			</block>
		</view>
		
		<view class="d-flex a-center j-center mt-3">
			<view class="d-flex j-center flex-column" style="width: 500rpx;">
				<view class="mt-2 font-30">{{takeTypeList[takeType].Text}}账号</view>
				<view class="d-flex border a-center font-30 bg-white mt" style="width: 500rpx; height: 60rpx;">
					<input class="ml-2" type="text" :value="account" placeholder="账号" maxlength="19" @blur="accountInput"/>
				</view>
				
				<view class="mt-2 font-30">姓名</view>
				<view class="d-flex border a-center font-30 bg-white mt" style="width: 500rpx; height: 60rpx;">
					<input class="ml-2" type="text" :value="name" placeholder="姓名" maxlength="6" @blur="nameInput"/>
				</view>
				
				<view class="mt-2 font-30">验证提现密码</view>
				<view class="d-flex border a-center font-30 bg-white mt" style="width: 500rpx; height: 60rpx;">
					<input class="ml-2" type="password" :value="takePassword" placeholder="提现密码" maxlength="16" @blur="passwordInput"/>
				</view>
				
				<view class="mt-2 font-30">手机号</view>
				<view class="d-flex border a-center font-30 bg-white mt" style="width: 500rpx; height: 60rpx;">
					<view class="ml-2">{{getVaguePhoneNumber}}</view>
				</view>
				<view class="d-flex flex-row mt-2">
					<view class="d-flex border a-center font-30 bg-white" style="width: 300rpx; height: 60rpx;">
						<input class="ml-2" type="number" :value="code" placeholder="验证码" maxlength="6" @blur="phoneCodeInput"/>
					</view>
					<view class="ml-2 border btn-blue-white" @click="sendphoneCode"
					style="width: 180rpx; height: 60rpx; border-radius: 5rpx;">
						<text class="font-26 d-flex a-center j-center" style="height: 60rpx;">{{codeBut}}</text>
					</view>
				</view>

			</view>
		</view>
		
		
		<view class="w-100 d-flex a-center j-center mt-5">
			<view class="font-38 font-weight btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 200rpx;" @click="bindAccount">绑定</view>
		</view>
	</view>
	
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		data() {
			return {
				account:'',
				name:'',
				takePassword:'',
				codeBut:'发送验证码',
				codeClick:true,
				code:'',
				takeType:0,
				takeTypeList:[]
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
		onLoad() {
			this.__init()
		},
		methods: {
			...mapMutations([
				'initTakeAccountList'
			]),
			__init(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/TakeAccount/TakeTypeList',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						var temp = res.data
						for (var i = 0; i < temp.length; i++) {
							var list = {}
							list.Text = temp[i].Text
							list.Value = temp[i].Value
							_self.takeTypeList.push(list)
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			accountInput(e){
				this.account = e.detail.value
			},
			nameInput(e){
				this.name = e.detail.value
			},
			passwordInput(e){
				this.takePassword = e.detail.value
			},
			phoneCodeInput(e){
				this.code = e.detail.value
			},
			changeTakeType(index){
				this.takeType = index
			},
			bindAccount(){
				var _self = this
				if(_self.account == ''){
					uni.showToast({title: '请输入账号', icon:'none', duration: 1500})
					return
				}
				if(_self.name == ''){
					uni.showToast({title: '请输入姓名', icon:'none', duration: 1500})
					return
				}
				if(_self.takePassword == ''){
					uni.showToast({title: '请输入提现密码', icon:'none', duration: 1500})
					return
				}
				if(_self.code == ''){
					uni.showToast({title: '请输入验证码', icon:'none', duration: 1500})
					return
				}
				uni.showModal({
				    title: '确认绑定账号',
				    content: _self.account,
				    success: function (res) {
				        if (res.confirm) {
				            _self.sureBind()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			sureBind(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				var typeValue = _self.takeTypeList[_self.takeType].Value
				_self.$H.post('/api/TakeAccount/Add',{
					Type:typeValue,
					Account:_self.account,
					Name:_self.name,
					TakePassword:_self.takePassword,
					MobilephoneCode:_self.code
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showToast({title: '绑定成功', icon:'none', duration: 1500})
						_self.updateAccountList()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			updateAccountList(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/TakeAccount/List',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.initTakeAccountList(res.data)
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						}, 1000)
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
