<template>
	<view class="ml-2 d-flex flex-row a-center">
		<view class="mt-1 font-30" style="width: 50%; color: #007BFF;" @click="jumpNoticeInfo">
			{{getTitleHead(item.Name)}}
		</view>
		<view class="mt-1 font-30 d-flex j-center" style="width: 15%;">
			<input class="border text-center" type="number" :value="item.SortValue" style="width: 80rpx;"
			placeholder="排序值" @blur="sortValueInput"/>
		</view>
		<view class="mt-1 font-30 d-flex j-center" style="width: 20%;">
			{{getDate(item.CreateTime)}}
		</view>
		<view class="mt-1 d-flex j-center" style="width: 10%;" @click="deleteNotice">
			<image src="@/static/delete/delete-sub.png" mode="widthFix" style="width: 40rpx;"></image>
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
				sortvalueText:''
			}
		},
		props:{
			item:{
				type:Object,
				default:null
			},
			index:{
				type:Number,
				default:null
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
				'updataSortByValue',
				'updataDeleteData'
			]),
			...mapActions([
			]),
			getDate(dTime) {
				return this.$Time.dateFormat(new Date(dTime), 'MM/dd');
			},
			getTitleHead(value) {
				if(value.length > 12){
					return value.substring(0, 12)+'...'
				}else{
					return value
				}
			},
			jumpNoticeInfo(){
				console.log(this.index)
				var id = this.noticeList[this.index].ID
				uni.navigateTo({
					url:'../notice/notice-info-change?id='+id
				})
			},
			sortValueInput(e){
				let i = e.target.value
				var reg = new RegExp("^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$")
				if(!reg.test(i)) {
					uni.showToast({title:'请输入数字', icon:'none', duration:1000})
					return
				}

				var _self = this
				_self.sortvalueText = e.target.value
				_self.$H.post('/api/Notice/UpdateSortValue',{
					ID:_self.item.ID,
					SortValue:_self.sortvalueText
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.noticeList[this.index].SortValue = _self.sortvalueText
						_self.updataSortByValue()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			deleteNotice(){
				var _that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除这条公告',
				    success: function (res) {
				        if (res.confirm) {
				            _that.deleteNoticeSure()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			deleteNoticeSure(){
				var _self = this;
				_self.$H.post('/api/Notice/Del',{
					ID:_self.item.ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.updataDeleteData(_self.item.ID)
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
