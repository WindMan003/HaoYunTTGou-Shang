<template>
	<view class="border-bottom w-100 d-flex flex-row a-center font-28" style="height: 60rpx;">
		<view class="d-flex flex-row a-center j-center" style="width: 35%;">
			<view class="font-28 border pl-1 pr-1 btn-orange-white" @click="changeType">修改</view>
			<view class="ml font-28 border pl-1 pr-1 btn-orange-white" @click="deleteType">删除</view>
		</view>
		<view class="text-center" style="width: 28%;">{{item.Name}}</view>
		<view class="d-flex a-center j-center position-relative" style="width: 28%;">
			<input class="border text-center" style="width: 100rpx;" type="number" :value="item.SortValue" @blur="sortValueInput"/>
		</view>
		<block v-if="showChange">
			<view class="font-24 border pl-1 pr-1 btn-orange-white position-absolute" style="right: 10rpx;"
			@click="changeSortValue">修改</view>
		</block>
		<newadd-popup ref="addPopup"></newadd-popup>
	</view>
</template>

<script>
	import newaddPopup from "@/components/popup/goods/newadd.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			newaddPopup
		},
		data() {
			return {
				sortValue: this.item.SortValue,
				showChange: false
			}
		},
		watch:{
			item:function(item, oldItem){
				if(item.SortValue != oldItem.SortValue){
					this.sortValue = item.SortValue
				}
			}
		},
		props:{
			item:{
				type:Object,
				default:null
			}
		},
		computed:{
			...mapState({
				goodsTypeList:state=>state.goods.goodsTypeList
			}),
			...mapGetters([
		
			]),
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
			]),
			changeType(){
				this.$refs.addPopup.showPopup(this.item)
			},
			deleteType(){
				var _that = this;
				uni.showModal({
				    title: '提示',
				    content: '删除 '+_that.item.Name+' 类别',
				    success: function (res) {
				        if (res.confirm) {
				            _that.deleteTypeCallBack()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			sortValueInput(e){
				this.sortValue = e.detail.value
				this.isShowChange()
			},
			isShowChange(){
				if(this.sortValue != this.item.SortValue){
					this.showChange = true
				}else{
					this.showChange = false
				}
			},
			deleteTypeCallBack(){
				var _that = this;
				_that.$H.post('/api/ProductType/DelProductType',{
					ID:_that.item.ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status === 0){
						let tempList = this.goodsTypeList
						for (var i = 0; i < tempList.length; i++) {
							if(tempList[i].ID === res.data){
								tempList.splice(i, 1)
								break
							}
						}
						uni.showToast({title: '删除成功', icon:'none', duration:1500})
					}else{
						uni.showToast({title: res.message, icon:'none', duration:1500})
					}
				})
			},
			changeSortValue(){
				var _self = this
				_self.$H.post('/api/ProductType/UpdateSortValue',{
					ID: _self.item.ID,
					SortValue: _self.sortValue
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						let tempList = _self.goodsTypeList
						for (var i = 0; i < tempList.length; i++) {
							if(tempList[i].ID == _self.item.ID){
								tempList[i].SortValue = _self.sortValue
								break
							}
						}
						_self.showChange = false
						uni.showToast({title: '修改成功', icon:'none', duration:1500})
					}else{
						uni.showToast({title: res.message, icon:'none', duration:1500})
					}
				})
			}
		}
	}
</script>

<style>

</style>
