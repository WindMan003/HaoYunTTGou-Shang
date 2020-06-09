<template>
	<view>
		<web-view :src="getLink"></web-view>
		<!-- <view class="border d-flex a-center j-center font-30 p-2 btn-orange-white" @click="openURL">测试</view> -->
	</view>
</template>

<script>
	import {mapState, mapMutations} from "vuex"
	export default {
		data() {
			return {
				agent: ''
			}
		},
		onLoad:function(option) {
			let status = option.status
			if(status == 1){
				this.agent = "/Agent/MyAgent"
			}else if(status == 2){
				this.agent = "/order/submitTimeLimit"
			}
		},
		computed:{
			...mapState({
				merchantSite:state=>state.user.merchantSite,
				token:state=>state.user.token
			}),
			getLink(){
				var link = this.merchantSite + this.agent + '?token=' + encodeURIComponent(this.token)
				console.log(link)
			
				return link
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
