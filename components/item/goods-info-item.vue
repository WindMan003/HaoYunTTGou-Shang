<template>
	<view class="w-100 d-flex flex-row border-bottom p-1">
		<view class="ml-1 d-flex flex-row mt-1" style="width: 30%;">
			<image class="rounded-10" style="width: 220rpx; height: 220rpx;" :src="item.MinTitleImgUrl" mode="aspectFill"></image>
		</view>
		<view class="ml-1 d-flex flex-column" style="width: 70%;">
			<view class="d-flex flex-row a-center ml-1">
				<view class="">名称：{{item.Name}}</view>
			</view>
			
			<view class="d-flex flex-row a-center j-sb ml-1 mr-3">
				<view class="">类别：{{item.ProductTypeName}}</view>
				<view class="d-flex flex-row">
					<view class="">已卖出：</view>
					<view class="" style="color: red;">{{item.SellCount}}</view>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center j-sb ml-1 mr-3">
				<view class="">排序值：{{item.SortValue}}</view>
				<view class="" v-if="item.IsLimitBuy == 0">库存：{{item.Stock}}</view>
			</view>
			
			<view class="d-flex flex-row a-center ml-1">
				<view class="">口味：</view>
				<view class="" v-if="!isTasteList">无</view>
				<view class="d-flex flex-row" v-for="(item1,index1) in item.TasteList" :key="index1">
					<view class="">{{item1.Name}}</view>
					<view class="" v-if="index1 != item.TasteList.length - 1">,</view>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center ml-1">			
				<view class="">价格：</view>
				<view class="text-price" v-if="!isSpecificationList">￥{{item.Price}}</view>
				<view class="d-flex flex-row" v-for="(item1,index1) in item.SpecificationList" :key="index1">
					<view class="">{{item1.Name}}</view>
					<view class="text-price">￥{{item1.Price}}</view>
					<view class="" v-if="index1 != item.SpecificationList.length - 1">,</view>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center j-end">
				<view class="font-28 border pl-1 pr-1" style="background-color: #007AFF; color: #FFFFFF;"
				@click="changeType">详情</view>
				<view class="ml-1 font-28 border pl-1 pr-1" style="background-color: #007AFF; color: #FFFFFF;"
				@click="changeType">修改</view>
				<view class="ml-1 font-28 border pl-1 pr-1 mr-3" style="background-color: #007AFF; color: #FFFFFF;"
				@click="deleteGoods">删除</view>
			</view>
		</view>
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
				sortValue:this.item.SortValue
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
				goodsList:state=>state.goods.goodsList
			}),
			...mapGetters([
		
			]),
			isTasteList(){
				if(this.item.TasteList.length > 0){
					return true
				}else{
					return false
				}
			},
			isSpecificationList(){
				if(this.item.SpecificationList.length > 0){
					return true
				}else{
					return false
				}
			},
			isLimitBuy(){
				if(this.item.IsLimitBuy == 1){
					return '是'
				}else{
					return '否'
				}
			}
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
				'updateGoodsListFunc'
			]),
			changeType(){
				uni.navigateTo({
					url:'../../pages/newadd-goods/change-goods?ID='+this.item.ID,
				})
			},
			deleteGoods(){
				var _that = this;
				uni.showModal({
				    title: '提示',
				    content: '删除 '+_that.item.Name+' 商品',
				    success: function (res) {
				        if (res.confirm) {
				            _that.deleteGoodsCallBack()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			deleteGoodsCallBack(){
				var _that = this;
				_that.$H.post('/api/Product/DelProduct',{
					ID:_that.item.ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status === 0){
						var tempList = this.goodsList
						for (var i = 0; i < tempList.length; i++) {
							if(tempList[i].ID == _that.item.ID){
								tempList.splice(i, 1)
								return
							}
						}
					}else{
						uni.showToast({
							title:res.message,
							icon:'none',
							duration:1500
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>