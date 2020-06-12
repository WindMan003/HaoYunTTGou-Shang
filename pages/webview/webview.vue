<template>
	<view>
		<web-view :src="getLink"></web-view>
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
