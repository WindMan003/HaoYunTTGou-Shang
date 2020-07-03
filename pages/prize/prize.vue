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
		<web-view :webview-styles="webviewStyles" :src="link" @message="handleMessage"></web-view>
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
			
			this.link = this.merchantSite + '/Activity/index' + '?token=' + encodeURIComponent(this.token)
			console.log(this.link)
			
			// #ifdef APP-PLUS
			var _self = this
			var currentWebview = this.$scope.$getAppWebview()
			//此对象相当于html5plus里的plus.webview.currentWebview()。
			//在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
			setTimeout(function() {
				let wv = currentWebview.children()[0]
				let data = {}
				data.wvid = 'ActivityIndex'
				data.webview = wv
				_self.initWebview(data)
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		},
		
		computed:{
			...mapState({
				merchantSite:state=>state.user.merchantSite,
				token:state=>state.user.token,
				webview:state=>state.user.webview
			}),
		},
		methods: {
			...mapMutations([
				'initWebview'
			]),
			getLink(){
				// let date = new Date().getTime();
				// this.link = this.merchantSite + '/Activity/index' + '?token=' + encodeURIComponent(this.token)+'&t='+date
				this.link = this.merchantSite + '/Activity/index' + '?token=' + encodeURIComponent(this.token)
				// this.link = 'https://update.tuanmi028.com/test111.html'
				console.log(this.link)
			},
			prizeInfo(){
				let value = 'action=/Activity/index'
				uni.navigateTo({
					url: '../webview/webview?'+value
				})
			},
			handleMessage(evt) {
				console.log('接收到的消息：' + JSON.stringify(evt.detail)); 
				let data = evt.detail.data[0]
				if(data.action == 'js'){
					let m_webview = this.getWebview(data.wvid)
					if(m_webview){
						m_webview.evalJS(data.data)
					}
				}
			},
			getWebview(wvid){
				for (let i = 0; i < this.webview.length; i++) {
					if(this.webview[i].wvid == wvid){
						return this.webview[i].webview
					}
				}
				return null
			}
		}
	}
</script>

<style>

</style>
