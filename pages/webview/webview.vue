<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="getLink" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from "vuex"
	
	export default {
		data() {
			return {
				agent: '',
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				}
			}
		},
		onLoad:function(option) {
			let action = option.action
			if(action){
				this.agent = action
			}
		},
		computed:{
			...mapState({
				merchantSite:state=>state.user.merchantSite,
				token:state=>state.user.token
			}),
			getLink(){
				var link = this.merchantSite + this.agent + '?token=' + encodeURIComponent(this.token)
				// var link = 'https://mer.tuanmi028.com/download/test/test1.html'
				console.log(link)
			
				return link
			}
		},
		methods: {
			handleMessage(evt) {  
				console.log('接收到的消息：' + JSON.stringify(evt.detail)); 
			}
		}
	}
</script>

<style>

</style>
