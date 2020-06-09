<template>
	<uni-popup type="center" ref="popup" @change="change" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex flex-column w-100 bg-white" style="height: 500rpx; border-radius: 3%;">
			<block v-if="item">
				<view class="d-flex a-center j-center font-38 font-weight pt-1 pb-1 mt-2">修改产品分类</view>
			</block>
			<block v-else>
				<view class="d-flex a-center j-center font-38 font-weight pt-1 pb-1 mt-2">新增产品分类</view>
			</block>
			<view class="d-flex flex-row a-center position-relative" style="height: 100rpx;">
				<view class="font-30 font-weight position-absolute" style="left: 24%;">名称</view>
				<input class="ml-2 border font-30 position-absolute" style="width: 300rpx; left: 31%;" type="text" :value="name"
				placeholder="请输入名称" maxlength="8" @input="nameInput"/>
			</view>
			<view class="d-flex flex-row a-center position-relative" style="height: 80rpx;">
				<view class="font-30 font-weight position-absolute" style="left: 20%;">排序值</view>
				<input class="ml-2 border font-30 position-absolute" style="width: 300rpx; left: 31%;" type="text" :value="sortValue"
				placeholder="请输入排序值" maxlength="8" @input="sortValueInput"/>
			</view>
			<view class="d-flex a-center j-center font-20" style="color: #FF582B;">
				(说明：值越大显示在越前面)
			</view>
			<block v-if="item">
				<view class="d-flex a-center j-center mt-5">
					<view class="font-38 font-weight border p d-flex a-center j-center btn-orange-white"
					style="width: 150rpx; border-radius: 20rpx;" @click="changeGoodsType('change')">
						修改
					</view>
				</view>
			</block>
			<block v-else>
				<view class="d-flex a-center j-center mt-5">
					<view class="font-38 font-weight border p d-flex a-center j-center btn-orange-white"
					style="width: 150rpx; border-radius: 20rpx;" @click="changeGoodsType">
						新增
					</view>
				</view>
			</block>
		</view>
	</uni-popup>
</template>

<script>

	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default{
		components:{
			
		},
		props:{

		},
		data() {
			return {
				name:'',
				sortValue:'',
				isTouch:true,
				item:null
			}
		},
		computed:{
			...mapState({
				goodsTypeList:state=>state.goods.goodsTypeList
			}),
			...mapGetters([

			]),
			
		},
		methods:{
			...mapMutations([
				'updateGoodsTypeList'
			]),
			...mapActions([
			]),
			
			showPopup(item){
				if(item){
					this.item = item
					this.name = item.Name
					this.sortValue = item.SortValue
				}
				this.$refs.popup.open()
			},
			change(e){
				if(!e.show){
					this.name = ''
					this.sortValue = ''
					this.item = null
				}
			},
			nameInput(e){
				this.name = e.detail.value
			},
			sortValueInput(e){
				this.sortValue = e.detail.value
			},
			changeGoodsType(string){
				var _that = this;
				var title = '新增中...'
				var urlStr = '/api/ProductType/add'
				var list = {
					Name: _that.name,
					SortValue: _that.sortValue
				}
				if(string === 'change'){
					title = '修改中...'
					urlStr = '/api/ProductType/update '
					list = {
						Name:_that.name,
						SortValue:_that.sortValue,
						ID:_that.item.ID
					}
				}
				uni.showLoading({title:title})
				_that.$H.post(urlStr, list, {
					token:true
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						let tempList = _that.goodsTypeList
						if(string == 'change'){
							for (var i = 0; i < tempList.length; i++) {
								if(tempList[i].ID == res.data.ID){
									tempList[i].Name = res.data.Name
									tempList[i].SortValue = res.data.SortValue
									break
								}
							}
							_that.$refs.popup.onTap()
						}else{
							uni.showToast({title: res.message, icon:'none', duration: res.messageShowTime})
							_that.goodsTypeList.unshift(res.data)
							_that.name = ''
							_that.sortValue = ''
							_that.isTouch = true
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			}
		}
	}
</script>

<style>

</style>
