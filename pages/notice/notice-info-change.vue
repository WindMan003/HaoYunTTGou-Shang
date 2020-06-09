<template>
	<view class="w-100">
		<view class="d-flex flex-row mt-2 a-center">
			<view class="font-30 font-weight ml-6">排序值：</view>
			<input class="font-30 border" type="number" :value="sortvalueText" style="width: 180rpx;"
			placeholder="排序值" @input="sortValueInput"/>
		</view>
		
		<view class="d-flex flex-column mt-2">
			<view class="d-flex a-center j-center">
				<textarea class="font-32 font-weight p text-center border" style="width: 600rpx; height: 220rpx;" 
				:value="noticeInfo.Name"
				placeholder="请输入公告标题" @input="titleInput"/>
			</view>
		</view>
		
		<view class="d-flex flex-column mt-4">
			<view class="d-flex a-center j-center">
				<textarea class="font-28 p border" style="width: 650rpx; height: 550rpx;" 
				:value="noticeInfo.Contents"
				placeholder="请输入公告内容" @input="contentInput"/>
			</view>
		</view>
		
		<view class="d-flex a-center j-center mt-4">
			<view class="border font-32 p pl-3 pr-3 btn-blue-white rounded-10" @click="changeNotice">
				保存修改
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
		onLoad: function (option) {
			this.isNewAdd = false
			this.id = option.id;
			this.__init();
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
			__init(){
				var _self = this;
				_self.$H.post('/api/Notice/Detail',{
					ID:this.id
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.titleText = res.data.Name
						_self.contentText = res.data.Contents
						_self.sortvalueText = res.data.SortValue
						_self.noticeInfo = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			titleInput(e){
				this.titleText = e.detail.value
			},
			contentInput(e){
				this.contentText = e.detail.value
			},
			sortValueInput(e){
				this.sortvalueText = e.detail.value
			},
			changeNotice(){
				var _self = this;
				if(_self.titleText == _self.noticeInfo.Name && _self.contentText == _self.noticeInfo.Contents
				&& _self.sortvalueText == _self.noticeInfo.SortValue){
					uni.showToast({title:'没有修改任何信息', icon:'none', duration:1000})
					return
				}
				_self.$H.post('/api/Notice/Update',{
					ID:_self.id,
					Name:_self.titleText,
					Contents:_self.contentText,
					SortValue:_self.sortvalueText
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						var temp = _self.noticeList
						for (var i = 0; i < temp.length; i++) {
							if(temp[i].ID == _self.id){
								_self.noticeList.splice(i, 1, res.data)
								_self.updataSortByValue()
								uni.navigateBack({
									delta:1
								})
								return
							}
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
