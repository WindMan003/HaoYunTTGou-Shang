<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		<view class="d-flex flex-column position-relative" style="height: 500rpx;">
			<view class="w-100 text-center font-26 text-muted position-absolute"
			style="top: 150rpx;">账户余额(元)</view>
			
			<view class="w-100 text-center font-60 font-weight position-absolute"
			style="top: 220rpx;">{{merchantAmount}}</view>
		</view>
		
		<block v-if="takeIsClosed">
			<view class="d-flex a-center j-center font-32 font-weight flex-wrap">
				{{message}}
			</view>
		</block>
		<block v-else>
			<view class="w-100 d-flex a-center j-center">
				<view class="font-38 btn-white-orange rounded-10 pt-1 pb-1 border text-center" 
				style="width: 90%;" @click="take">提现</view>
			</view>
			
			<view class="w-100 d-flex a-center j-center mt-3">
				<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
				style="width: 90%;" @click="bindTakeAccount">绑定提现账户</view>
			</view>
		</block>
		<view class="" style="height: 200rpx;"></view>
		<view class="d-flex flex-row a-center" style="color: #007AFF;">
			<view class="position-relative" style="width: 50%;">
				<text class="position-absolute font-24" style="right: 20rpx;" @click="takeList">提现明细</text>
				<view class="text-muted position-absolute font-24" style="right: 0;">|</view>
			</view>
			<view class="position-relative" style="width: 50%;">
				<text class="position-absolute font-24" style="left: 20rpx;" @click="modifyTakePassword">修改提现密码</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		data() {
			return {
				isHaveTakePass:false,
				takeIsClosed:true,
				message:''
			}
		},
		onLoad() {
			this.initTakeIsClosed()
		},
		onShow() {
			this.init()
		},
		computed:{
			...mapState({
				merchantAmount:state=>state.user.merchantAmount,
				takeAccountList:state=>state.user.takeAccountList,
				
			})
		},
		methods: {
			...mapMutations([
				'initTakeAccountList'
			]),
			init(){
				var _self = this
				_self.$H.post('/api/TakeAccount/TakePwdIsNone',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.isHaveTakePass = !res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			initTakeIsClosed(){
				var _self = this
				_self.$H.post('/api/Finance/TakeIsClosed',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.takeIsClosed = false
						_self.initTakeAccount()
					}else{
						_self.takeIsClosed = true
						_self.message = res.message
						// uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			initTakeAccount(){
				var _self = this
				_self.$H.post('/api/TakeAccount/List',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.initTakeAccountList(res.data)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			take(){
				if(this.merchantAmount <= 0){
					uni.showToast({title:'没有可提现金额', icon:'none', duration:1000})
					return
				}
				if(!this.isHaveTakePass){
					//设置提现密码
					this.setTakePassword()
				}else{
					//
					this.isTakeAccount()
				}
			},
			setTakePassword(){
				uni.showModal({
				    title: '提示',
				    content: '请设置提现密码',
				    success: function (res) {
				        if (res.confirm) {
				            uni.navigateTo({
				            	url:'../take/take-setPassword'
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			isTakeAccount(){
				if(this.takeAccountList.length > 0){
					uni.navigateTo({
						url:'../take/take-info'
					})
				}else{
					uni.showModal({
					    title: '没有提现账户',
					    content: '是否去设置',
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					            	url:'../take/take-account'
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}
			},
			modifyTakePassword(){
				uni.navigateTo({
					url:'../take/take-modifyPassword'
				})
			},
			takeList(){
				uni.navigateTo({
					url:'../take/take-list'
				})
			},
			bindTakeAccount(){
				uni.navigateTo({
					url:'../take/take-account'
				})
			}
		}
	}
</script>

<style>

</style>
