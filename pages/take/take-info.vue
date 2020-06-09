<template>
	<view class="main" style="background-color: #F5F5F5;" :style="'height:'+windowH+'px;'">
		<view class="w-100 border-bottom"></view>
		
		<view class="mt-3 d-flex flex-column border-bottom border-top bg-white">
			<view class="d-flex flex-row pt-2 pb-2 a-center position-relative" @click="changeAccount">
				<view class="d-flex a-center j-center" style="width: 15%;">
					<image :src="getIconUrl(accountItem)" mode="widthFix" style="width: 60rpx; height: 60rpx;"></image>
				</view>
				<view class="d-flex flex-column" style="width: 60%;">
					<view class="font-30">{{accountItem.Name}}</view>
					<view class="font-30 mt" style="color: #007AFF;">{{accountItem.Account}}</view>
				</view>
				<view class="font-30 position-absolute" style="right: 20rpx; color: #007BFF;">切换提现账号></view>
			</view>
			<view class="d-flex flex-row pt-2 pb-2 a-center border-top">
				<text class="font-30 ml-4" style="width: 15%;">提现金额</text>
				<view class="ml-5 d-flex a-center">
					<input class="ml-2" type="text" v-model="amount" placeholder="金额" :maxlength="12" @input="amountInput"/>
				</view>
			</view>
			<view class="d-flex flex-row pt-2 pb-2 a-center border-top">
				<text class="font-30 ml-4" style="width: 15%;">提现密码</text>
				<view class="ml-5 d-flex a-center">
					<input class="ml-2" type="password" v-model="takePassword" placeholder="密码" maxlength="16" @blur="takePasswordInput"/>
				</view>
			</view>
		</view>
		
		<view class="mt-2">
			<view class="ml-4 font-26 text-light-muted">可提现金额{{merchantAmount}}元</view>
		</view>
		
		<view class="w-100 d-flex a-center j-center mt-5">
			<view class="font-38 rounded-10 pt-1 pb-1 border text-center btn-orange-white" 
			style="width: 90%;" @click="take">下一步</view>
		</view>
		
		<switch-account ref="switchaccount" @complete="complete"></switch-account>
	</view>
</template>

<script>
	import switchAccount from '@/components/popup/take/switch-account.vue';
	
	import {mapState, mapMutations} from 'vuex'
	export default {
		components:{
			switchAccount,
		},
		data() {
			return {
				windowH:0,
				selectIndex:0,
				accountList:[],
				accountItem:'',
				amount:'',
				takePassword:'',
				balance:'',
				moneyMaxLeng:8
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					console.log(res)
					this.windowH = res.windowHeight
				}
			})
			
			this.__init()
		},
		computed:{
			...mapState({
				takeAccountList:state=>state.user.takeAccountList,
				merchantAmount:state=>state.user.merchantAmount
			})
		},
		methods: {
			...mapMutations([
				'initMerchantAmount'
			]),
			__init(){
				var _self = this
				_self.accountList = _self.takeAccountList
				_self.accountItem = _self.takeAccountList[_self.selectIndex]
			},
			getIconUrl(item){
				if(item.TypeName == '支付宝'){
					return '../../static/take/alipay.png'
				}
			},
			getName(name){
				if(name){
					var mname = name.substring(0, 1)
					for (var i = 0; i < name.length; i++) {
						if(i > 0){
							mname = mname + '*'
						}
					}
					return mname
				}
			},
			amountInput(e){
				this.$nextTick(() => {
					let val = e.target.value.toString();
					val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
					val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
					val = val.replace(/^0+\./g, '0.');
					val = val.match(/^0+[1-9]+/) ? val = val.replace(/^0+/g, '') : val
					val = (val.match(/^\d*(\.?\d{0,2})/g)[0]) || ''
		
					if (val.includes(".")) {
						let numDian = val.toString().split(".")[1].length;
						if (numDian === 2) {
							this.moneyMaxLeng = val.length;
						}
					} else {
						this.moneyMaxLeng = 8;
					}
					this.amount = val;
				
					if(this.amount - this.merchantAmount > 0){
						this.amount = this.merchantAmount
					}
				});
			},
			takePasswordInput(e){
				this.takePassword = e.detail.value
			},
			changeAccount(){
				this.$refs.switchaccount.showPopup(this.accountItem.ID)
			},
			complete(index){
				var _self = this
				_self.selectIndex = index
				_self.accountItem = _self.takeAccountList[_self.selectIndex]
			},
			take(){
				var _self = this
				if(_self.amount == ''){
					uni.showToast({title: '请输入提现金额', icon:'none', duration: 1500})
					return
				}
				if(_self.takePassword == ''){
					uni.showToast({title: '请输入提现密码', icon:'none', duration: 1500})
					return
				}
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Finance/SubmitTakeMoney',{
					TakePassword:_self.$md5(_self.takePassword),
					TakeAccountID:_self.accountItem.ID,
					TakeAmount:_self.amount
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showToast({title:'提现成功', icon:'none', duration:1000})
						var nowAmount = _self.merchantAmount - _self.amount
						_self.initMerchantAmount(nowAmount)
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						}, 1000)
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
