<template>
	<view class="main">
		<view class="position-relative" style="height: 520upx; padding: 60upx 30upx 0;">
			<image class="position-absolute left-0 top-0 w-100 h-100" style="filter: blur(1px); opacity: .7;"
			src="@/static/user/user-bg.jpg"></image>
			
			<view class="position-relative d-flex a-center" style="height: 180upx; z-index: 1;">
				<view class="">
					<image class="rounded-50p" style="width: 130rpx; height: 130rpx; border:5upx solid #FFFFFF;"
					src="/static/user/missing-face.png"></image>
				</view>
				<view class="ml-2">
					<text class="font-36 text-dark font-weight">{{merchantInfo.Name}}</text>
				</view>
			</view>
			<!-- <view class="d-flex flex-column bg-style-bottom-arc position-relative" 
			style="height: 240upx; overflow: hidden; border-radius: 16upx 16upx 0 0; padding: 20upx 24upx;">
			</view> -->
		</view>
		
		<view class="position-relative pb-2" style="margin-top: -280upx; padding: 0 30upx; background: #F5F5F5;" :style="'height:'+windowH+'px;'">
			<image class="position-absolute left-0 w-100" style="top: -34upx; height: 36upx;" src="/static/user/arc.png"></image>
			
			<!-- <view class="d-flex flex-row bg-white rounded-10" style="height: 120rpx;">
				<view class="span24-8 d-flex flex-column j-center a-center" @click="gotoTake">
					<text class="font-32">{{amount}}</text>
					<text class="font-24 text-dark">余额</text>
				</view>
				<view class="span24-8 d-flex flex-column j-center a-center">
					<text class="font-32">0</text>
					<text class="font-24 text-dark">优惠券</text>
				</view>
				<view class="span24-8 d-flex flex-column j-center a-center">
					<text class="font-32">20</text>
					<text class="font-24 text-dark">积分</text>
				</view>
			</view> -->
			
			<view class="d-flex flex-column bg-white rounded-10 mt-2" style="">
				<uni-list-item title="账户信息" :rightText="amount+' 元'" :showRightText="true"
				@click="navigate('take', false)"></uni-list-item>
				<!-- <uni-list-item title="提现账户" :rightText="getTakeAccountCount" showRightText="true" @click="takeAccount"></uni-list-item> -->
				<!-- <uni-list-item title="店铺信息" @click="navigate('merchant', false)"></uni-list-item> -->
				<uni-list-item title="问题反馈" @click="navigate('question', false)"></uni-list-item>
				<uni-list-item title="状态控制" @click="navigate('status-configuration', false)"></uni-list-item>
				<uni-list-item title="生成桌子二维码" @click="navigate('table-qrcode', false)"></uni-list-item>
				<uni-list-item title="下单时间控制" @click="navigate('webview', true, 'status=2')"></uni-list-item>
				<divider></divider>
				
				<uni-list-item showExtraIcon leftIconStyle="color:#808C98;" leftIcon="icon-icon_set_up" title="更多设置"
				@click="navigate('set', false)"></uni-list-item>
			</view>
			
			<view class="" style="height: 100rpx;"></view>
		</view>
	</view>
</template>

<script>
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	
	import {mapState,mapMutations} from "vuex"
	export default {
		components: {
			uniListItem
		},
		data() {
			return {
				windowH:0,
				amount:0.00
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					console.log(res)
					this.windowH = res.windowHeight - uni.upx2px(220)
				}
			})
		},
		onShow() {
			//更新余额
			this.initAmout()
		},
		computed:{
			...mapState({
				takeAccountList:state=>state.user.takeAccountList,
				merchantInfo:state=>state.user.merchantInfo
			}),
			getTakeAccountCount(){
				var temp = this.takeAccountList
				if(temp.length > 0){
					return temp.length + ' 个'
				}else{
					return ''
				}
			}
		},
		methods: {
			...mapMutations([
				'initMerchantAmount',
				'initTakeAccountList'
			]),
			initAmout(){
				var _self = this
				_self.$H.post('/api/Finance/MerchantAmount',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.amount = parseFloat(res.data).toFixed(2)
						_self.initMerchantAmount(_self.amount)
						// _self.initTakeAccount()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
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
			navigate(path, m_bool, value){
				if (!path) return;
				if(m_bool){
					return uni.navigateTo({
						url: `/pages/${path}/${path}?`+value
					});
				}
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				});
			},
			takeAccount(){
				uni.navigateTo({
					url:'../take/take-account'
				})
			}
		}
	}
</script>

<style>

</style>
