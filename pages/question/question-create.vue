<template>
	<view class="main">
		<view class="" style="background-color: #F5F5F5;" :style="'height:' + windowH + 'px;'">
			<view class="ml-3 p-1 font-24 mt-1">
				反馈标题
			</view>
			<view class="bg-white p-1 mt-1">
				<input class="ml-3 font-26" type="text" :value="title" placeholder="不要太长哦~" maxlength="20" @input="titleInput"/>
			</view>
			<view class="ml-3 p-1 font-24 mt-3">
				反馈内容
			</view>
			<view class="bg-white p-1 mt-1" style="height: 300rpx;">
				<textarea class="ml-3 font-26" type="text" :value="content" placeholder="不少于10个字哦~" @input="contentInput"/>
			</view>
			
			<view class="w-100 d-flex a-center j-center mt-4">
				<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
				style="width: 90%;" @click="submitQuestion">提交</view>
			</view>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowH:0,
				title:'',
				content:''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowH = res.windowHeight
				}
			})
			
			// this.__init()
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
						
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			titleInput(e){
				this.title = e.detail.value
			},
			contentInput(e){
				this.content = e.detail.value
			},
			submitQuestion(){
				var _self = this
				if(_self.title == '' || _self.content == ''){
					uni.showToast({title:'请填写完整信息', icon:'none', duration:1000})
					return
				}
				if(_self.content.length < 10){
					uni.showToast({title:'请再多写一点', icon:'none', duration:1000})
					return
				}
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Question/AddQuestion',{
					Name:_self.title,
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
