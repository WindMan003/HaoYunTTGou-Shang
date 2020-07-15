<template>
	<view class="d-flex flex-column a-center" style="background-color: #F5F5F5;" :style="'height:'+ windowHeight + 'px'">
		<view class="d-flex flex-column bg-white rounded-10 mt-3" style="width: 94%;" v-if="!isIOSshenhe">
			<block v-for="(item, index) in menuList" :key="index">
				<uni-list-item :title="item.Name" @click="jumpPageView(item)"></uni-list-item>
			</block>
		</view>
		<view class="d-flex flex-column a-center j-center text-muted" :style="'height:'+ windowHeight +'px;'" v-else>
			暂无开启活动哦~
		</view>
	</view>
</template>
	
<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		components:{

		},
		data() {
			return {
				windowHeight: 0,
				menuList: [],
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
				}
			})
			this.initMenu()
		},
		computed:{
			...mapState({
				isIOSshenhe:state=>state.user.isIOSshenhe,
				merchantSite:state=>state.user.merchantSite,
				token:state=>state.user.token
			}),
		},
		methods: {
			...mapMutations([
			]),
			initMenu(){
				var _self = this;
				_self.$H.post('/api/merchant/ActivityMenu',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.menuList = res.data
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			jumpPageView(m_item){
				var nextList = this.getNextMenu(m_item.ID)
				if(nextList.length > 0){
					uni.navigateTo({
						url: './prize-next?list=' + encodeURIComponent(JSON.stringify(nextList))
					})
				}else{
					if(m_item.IsWebView == 1){
						var link = this.merchantSite + m_item.PagePath
						uni.navigateTo({
							url: '../webview/webview-jump?jumpurl=' + link + '&wvid=' + m_item.WVID
						})
					}else{
						
					}
				}
			},
			getNextMenu(m_id){
				var temp = this.menuList
				var nextList = []
				for (let i = 0; i < temp.length; i++) {
					if(temp[i].ParentID != 0 && m_id == temp[i].ParentID){
						nextList.push(temp[i])
					}
				}
				return nextList
			}
		}
	}
</script>

<style>

</style>
