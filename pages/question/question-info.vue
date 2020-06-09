<template>
	<view class="main">
		<scroll-view scroll-y="true" style="background-color: #F5F5F5;" :style="'height:' + scrollH + 'px;'">
			<view class="d-flex flex-row a-center mt-2">
				<view class="ml-3 font-24">
					反馈内容
				</view>
				<view class="ml-3 font-24 text-muted">
					{{item.CreateTime}}
				</view>
			</view>
			
			<view class="bg-white mt-1 p-1 font-28">
				<view class="ml-3" style="width: 92%;">
					{{item.Contents}}
				</view>
			</view>
			<block v-for="(item, index) in replyList" :key="index">
				<view class="d-flex flex-row a-center mt-2">
					<view class="ml-3 font-24">
						{{getFeedBackTitle(item.MerchantID)}}
					</view>
					<view class="ml-3 font-24 text-muted">
						{{item.CreateTime}}
					</view>
				</view>
				<view class="bg-white mt-1 p-1 font-28">
					<view class="ml-3" style="width: 92%;">
						{{item.Contents}}
					</view>
				</view>
			</block>
		</scroll-view>
		
		<divider></divider>
		<view class="ml-3 p-1 font-32 mt-3">
			继续反馈
		</view>
		<view class="bg-white p-1 mt-1 border" style="height: 200rpx;">
			<textarea class="ml-3 font-26" type="text" :value="content" placeholder="反馈内容" @input="contentInput"/>
		</view>
		<view class="w-100 d-flex a-center j-center mt-4">
			<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 90%;" @click="submitQuestion">提交反馈</view>
		</view>
	</view>
</template>

<script>
	import divider from '@/components/common/divider.vue'
	
	export default {
		components:{
			divider
		},
		data() {
			return {
				item:'',
				windowH:0,
				scrollH:0,
				content:'',
				replyList:[]
			}
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.windowH = res.windowHeight
					this.scrollH = res.windowHeight * 0.5
				}
			})
			this.item = JSON.parse(decodeURIComponent(option.item))
			this.__init()
		},
		methods: {
			__init(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Question/ReplayList',{
					QuestionID:_self.item.ID
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						if(res.data.length > 0){
							_self.replyList = res.data
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:2000})
					}
				})
			},
			contentInput(e){
				this.content = e.detail.value
			},
			getFeedBackTitle(m_id){
				if(m_id == this.item.MerchantID){
					return '反馈内容'
				}else{
					return '回复内容'
				}
			},
			submitQuestion(){
				var _self = this
				if(_self.content == ''){
					uni.showToast({title:'请填写需要反馈的内容~', icon:'none', duration:2000})
					return
				}
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Question/AddReplay',{
					QuestionID:_self.item.ID,
					Contents:_self.content
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			}
		},

	}
</script>

<style>

</style>
