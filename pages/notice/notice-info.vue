<template>
	<view class="w-100">
		<view class="d-flex flex-row mt-2 a-center">
			<view class="font-30 font-weight ml-6">排序值：</view>
			<input class="font-30 border" type="number" style="width: 180rpx;"
			placeholder="排序值" @input="sortValueInput"/>
		</view>
		
		<view class="d-flex flex-column mt-2">
			<view class="d-flex a-center j-center">
				<textarea class="font-32 font-weight p text-center border" style="width: 600rpx; height: 220rpx;"
				placeholder="请输入公告标题" @input="titleInput"/>
			</view>
		</view>
		
		<view class="d-flex flex-column mt-4">
			<view class="d-flex a-center j-center">
				<textarea class="font-28 p border" style="width: 650rpx; height: 550rpx;"
				placeholder="请输入公告内容" @input="contentInput"/>
			</view>
		</view>
		
		<view class="d-flex a-center j-center mt-4">
			<view class="border font-32 p pl-3 pr-3 btn-blue-white rounded-10" @click="newAddNotice">
				保存新增
			</view>
		</view>
		
		<view class="" style="height: 150rpx;"></view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
		},
		data() {
			return {
				noticeInfo:'',
				titleText:'',
				contentText:'',
				sortvalueText:'',
				id:''
			}
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
				'updataSortByValue'
			]),
			...mapActions([
			]),
			titleInput(e){
				this.titleText = e.detail.value
			},
			contentInput(e){
				this.contentText = e.detail.value
			},
			sortValueInput(e){
				this.sortvalueText = e.detail.value
			},
			newAddNotice(){
				var _self = this;
				if(_self.titleText == '' || _self.contentText == '' || this.sortvalueText == ''){
					uni.showToast({title:'请填写完整信息', icon:'none', duration:1000})
					return
				}
				_self.$H.post('/api/Notice/Add',{
					Name:_self.titleText,
					Contents:_self.contentText,
					SortValue:_self.sortvalueText
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.noticeList.unshift(res.data)
						_self.updataSortByValue()
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
		}
	}
</script>

<style>

</style>
