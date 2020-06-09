<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		
		<view class="d-flex flex-column a-center j-center">
			<block v-for="(item, index) in takeAccountList" :key="index">
				<view class="border rounded-10 mt-2 d-flex flex-column position-relative" style="width: 94%; height: 150rpx;"
				@click="accountInfo(index)">
					<view class="font-24 text-white d-flex flex-row a-center rounded-top pt pb"
					:style="item.TypeName == '支付宝' ? 'background-color: #007AFF;':''">
						<text class="ml-2">{{item.TypeName}}</text>
					</view>
					<view class="font-32 d-flex flex-row a-center pt-2 pb-2">
						<text class="ml-2">{{item.Account}}</text>
					</view>
				</view>
			</block>
		</view>
		<view class="w-100 d-flex a-center j-center mt-5">
			<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 90%;" @click="bindTakeAccount">新增提现账号</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		data() {
			return {
				takeAccountList:[],
				show:false,
				isHaveTakePass:false
			}
		},
		onShow() {
			this.__init()
		},
		methods: {
			...mapMutations([
				'initTakeAccountList'
			]),
			__init(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/TakeAccount/List',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.takeAccountList = res.data
						_self.initTakeAccountList(res.data)
						_self._isTakePassword()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			_isTakePassword(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/TakeAccount/TakePwdIsNone',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.isHaveTakePass = !res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			bindTakeAccount(){
				if(!this.isHaveTakePass){
					//设置提现密码
					this.setTakePassword()
				}else{
					uni.navigateTo({
						url:'../take/take-bindAccount'
					})
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
			accountInfo(index){
				uni.navigateTo({
					url:'../take/take-account-info?index='+index
				})
			}
		}
	}
</script>

<style>

</style>
