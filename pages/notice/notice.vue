<template>
	<view class="w-100">
		<view class="d-flex flex-row a-center border-bottom position-relative" style="height: 80rpx;">
			<view class="border font-26 ml pl-2 pr-2 btn-orange-white position-absolute" @click="jumpNoticeInfo"
			style="right: 40rpx;">新增公告</view>
		</view>
		
		<view class="ml-2 d-flex flex-row a-center font-26" style="80rpx">
			<view class="text-center" style="width: 50%;">标题</view>
			<view class="text-center" style="width: 15%;">排序值</view>
			<view class="text-center" style="width: 20%;">时间</view>
			<view class="text-center" style="width: 10%;">操作</view>
		</view>
		
		<scroll-view scroll-y :style="'height:'+(totalH - 80)+'px;'">
			<view class="d-flex flex-column mt-1">
				<block v-for="(item, index) in noticeList" :key="index">
					<notice-item :item="item" :index="index"></notice-item>
				</block>
				
				<view class="d-flex j-center font-22 p-2" style="color: #007AFF;" v-if="isShowLoadMoreBoole" @click="loadMore">加载更多</view>
				<view class="d-flex j-center font-22 p-2" style="color: #C8C7CC;" v-else>没有更多了~</view>
				<view style="height: 30rpx;"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import noticeItem from "@/components/notice/notice-item.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			noticeItem
		},
		data() {
			return {
				totalH:0,
				sortvalueText:'',
				isShowLoadMoreBoole:false,
				defaultPageIndex:1,
				defaultItemCount:15,
				isMore:true,
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			this.__init()
		},
		computed:{
			...mapState({
				noticeList:state=>state.notice.noticeList
			}),
			...mapGetters([
			]),
		},
		methods: {
			...mapMutations([
				'updateNoticeList',
				'pushUpdateNoticeList'
			]),
			...mapActions([
			]),
			__init(){
				this.requestData()
			},
			jumpNoticeInfo(){
				uni.navigateTo({
					url:'../notice/notice-info?id='+''
				})
			},
			isShowLoadMore(list){
				var tempList = this.noticeList
				if(list){
					tempList = list
				}
				if(tempList.length >= this.defaultItemCount){
					return this.isShowLoadMoreBoole = true
				}
				return this.isShowLoadMoreBoole = false
			},
			loadMore(){
				this.defaultPageIndex = this.defaultPageIndex + 1
				this.requestData('loadMore')
			},
			requestData(className){
				var _self = this
				_self.$H.post('/api/Notice/List',{
					PageIndex:_self.defaultPageIndex
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.isShowLoadMore(res.data)
						if(className == 'loadMore'){
							_self.pushUpdateNoticeList(res.data)
						}else{
							_self.updateNoticeList(res.data)
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			}
		}
	}
</script>

<style>

</style>
