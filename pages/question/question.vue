<template>
	<view class="main">
		<view class="border-bottom position-relative" style="background-color: #F5F5F5; height: 70rpx;">
			<view class="border font-26 pl-2 pr-2 btn-orange-white position-absolute" @click="createQuestion"
			style="right: 20rpx; top: 10rpx;">
				新建
			</view>
		</view>
		
		<scroll-view scroll-y :style="'height:' + scrollH + 'px;'">
			<view class="d-flex flex-column j-center">
				<block v-for="(item, index) in questionList" :key="index">
					<view class="d-flex a-center p-1 font-28 border-bottom position-relative" @click="questionInfo(item)">
						<view class="ml-3">{{getQuestionTitle(item.Name)}}</view>
						<view class="position-absolute" style="right: 20rpx;">{{getStatusContent(item.Status)}}</view>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollH:0,
				questionList:[]
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.scrollH = res.windowHeight - uni.upx2px(70)
				}
			})
		},
		onShow() {
			this.__init()
		},
		methods: {
			__init(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Question/List',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.questionList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			getQuestionTitle(m_title){
				if(m_title.length > 16){
					return m_title.substring(0, 16) + '...'
				}
				
				return m_title
			},
			getStatusContent(m_status){
				if(m_status == 0){
					return '未回复'
				}else{
					return '已回复'
				}
			},
			createQuestion(){
				uni.navigateTo({
					url:'./question-create'
				})
			},
			questionInfo(item){
				uni.navigateTo({
					url:'./question-info?item=' + encodeURIComponent(JSON.stringify(item))
				})
			}
		},

	}
</script>

<style>

</style>
