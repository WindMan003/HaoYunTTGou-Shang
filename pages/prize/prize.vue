<template>
	<!-- <view class="w-100" style="background-color: #EEEEEE;" :style="'min-height:' + totalH + 'px'">
		<view class="border-top"></view>
		<view class="d-flex a-center position-relative" style="height: 70rpx;">
			<view class="font-28 btn-orange-white pl-1 pr-1 rounded text-center position-absolute"
			style="right: 20rpx; top: 10rpx;" @click="prizeInfo">奖品信息</view>
		</view>
		
		<view class="d-flex flex-column mt-3 ml-3">
			<view class="d-flex flex-row a-center">
				<view class="font-26 text-muted" style="width: 24%;">奖品</view>
				<view class="font-26">100元代金券</view>
			</view>
			<view class="d-flex flex-row a-center">
				<view class="font-26 text-muted" style="width: 24%;">中奖概率</view>
				<view class="font-26">100%中奖</view>
			</view>
			<view class="d-flex flex-row a-center">
				<view class="font-26 text-muted" style="width: 24%;">参与条件</view>
				<view class="font-26">60元</view>
			</view>
		</view>
		
	</view> -->
	<view>
		<web-view :webview-styles="webviewStyles" :src="link"></web-view>
	</view>
</template>
	
<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{

		},
		data() {
			return {
				totalH: 0,
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				link: ''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			
		},
		onShow() {
			this.getLink()
		},
		computed:{
			...mapState({
				merchantSite:state=>state.user.merchantSite,
				token:state=>state.user.token
			}),
			
		},
		methods: {
			getLink(){
				let date = new Date().getTime();
				this.link = this.merchantSite + '/Activity/index' + '?token=' + encodeURIComponent(this.token)+'&t='+date
				console.log(this.link)
			},
			prizeInfo(){
				// uni.navigateTo({
				// 	url:"./prize-info"
				// })
				let backurl = '../prize/prize'
				let value = 'action=/Activity/index'
				uni.navigateTo({
					url: '../webview/webview?'+value+'&backurl='+backurl,
				})
			}
		}
	}
</script>

<style>

</style>
