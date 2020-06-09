<template>
	<view class="w-100 d-flex flex-row border-bottom p-1">
		<view class="ml-1 d-flex a-center j-center" style="width: 220rpx; height: 220rpx;">
			<image :src="item.MinTitleImgUrl" style="border-radius: 8rpx;" mode="widthFix"></image>
		</view>
		<view class="ml-1 d-flex flex-column" style="width: 70%;">
			<view class="d-flex flex-row a-center ml-1">
				<view class="d-flex flex-row" style="width: 40%;">
					<view class="font-26 font-weight">类别:</view>
					<view class="font-26">{{item.ProductTypeName}}</view>
				</view>
				<view class="d-flex flex-row" style="width: 30%;">
					<block v-if="item.IsLimitBuy == 1">
						<view class="font-26 font-weight">库存:</view>
						<view class="font-26">{{item.Stock}}</view>
					</block>
				</view>
				<view class="d-flex flex-row" style="width: 30%;">
					<view class="font-26 font-weight">已卖出:</view>
					<view class="font-26" style="color: red;">{{item.SellCount}}</view>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center ml-1">
				<view class="d-flex flex-row" style="width: 70%;">
					<view class="font-26 font-weight">名称:</view>
					<view class="font-26">{{item.Name}}</view>
				</view>
				<view class="d-flex flex-row" style="width: 30%;">
					<view class="font-26 font-weight">排序值:</view>
					<view class="font-26">{{item.SortValue}}</view>
				</view>
			</view>
			<view class="d-flex flex-row a-center ml-1">
				<view class="font-26 font-weight">口味:</view>
				<view class="font-26" v-if="!isTasteList">无</view>
				<view class="d-flex flex-row" v-for="(item1,index1) in item.TasteList" :key="index1">
					<view class="font-26">{{item1.Name}}</view>
					<view class="font-26" v-if="index1 != item.TasteList.length - 1">,</view>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center" style="">
				<view class="font-26 font-weight ml-1">价格:</view>
				<view class="font-26" style="color: #FD6801;" v-if="!isSpecificationList">￥{{item.Price}}</view>
				<view class="d-flex flex-row" v-for="(item1,index1) in item.SpecificationList" :key="index1">
					<view class="font-26">{{item1.Name}}</view>
					<view class="font-26" style="color: #FD6801;">￥{{item1.Price}}</view>
					<view class="font-26" v-if="index1 != item.SpecificationList.length - 1">,</view>
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