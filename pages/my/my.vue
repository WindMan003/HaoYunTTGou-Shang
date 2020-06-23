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

			<view class="d-flex flex-column bg-white rounded-10 mt-2" style="">
				<block v-if="!isIOSshenhe">
					<uni-list-item title="账户信息" :rightText="merchantAmount+' 元'" :showRightText="true"
					@click="navigate('take', false)"></uni-list-item>
				</block>
				<!-- <uni-list-item title="提现账户" :rightText="getTakeAccountCount" showRightText="true" @click="takeAccount"></uni-list-item> -->
				<!-- <uni-list-item title="店铺信息" @click="navigate('merchant', false)"></uni-list-item> -->
				<uni-list-item title="问题反馈" @click="navigate('question', false)"></uni-list-item>
				<block v-if="!isIOSshenhe">
					<uni-list-item title="状态控制" @click="navigate('webview', true, 'action=/Merchant/SwitchConfig')"></uni-list-item>
				</block>
				<uni-list-item title="生成桌子二维码" @click="navigate('table-qrcode', false)"></uni-list-item>
				<block v-if="!isIOSshenhe">
					<uni-list-item title="下单时间控制" @click="navigate('webview', true, 'action=/order/submitTimeLimit')"></uni-list-item>
				</block>
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
				windowH:0
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
				merchantInfo:state=>state.user.merchantInfo,
				merchantAmount:state=>state.user.merchantAmount,
				isIOSshenhe:state=>state.user.isIOSshenhe
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
						_self.initMerchantAmount(res.data)
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
					let backurl = '../my/my'
					return uni.navigateTo({
						url: `/pages/${path}/${path}?`+value+'&backurl='+backurl,
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
