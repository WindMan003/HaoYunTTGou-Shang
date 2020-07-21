<template>
	<view class="">
		<view class="border-bottom w-100 d-flex flex-column a-center"  style="height:140rpx;">
			<view class="w-100 d-flex flex-row a-center ml-2 border-bottom" style="height: 80rpx;">
				<!-- <view class="font-30 font-weight">分类</view> -->
				<view class="border" style="width: 150rpx;">
					<uni-combox :height="44" :value="getTypeName" :candidates="getTypeNameList" placeholder="分类" @input="typeInput"></uni-combox>
				</view>
				
				<!-- <view class="ml-1 font-30 font-weight">名称</view> -->
				<input class="ml-1 border font-30" style="width: 150rpx;" type="text" :value="nameString" 
				placeholder="产品名称" maxlength="8" @input="nameInput"/>
				
				<view class="ml-1 border font-30 pl-1 pr-1 btn-orange-white" style="border-radius: 10rpx;" @click="check">
					查询
				</view>
				
				<view class="ml-1 border font-30 pl-1 pr-1 btn-orange-white" style="border-radius: 10rpx;" @click="clearInput">
					清空
				</view>
				
				<view class="ml-1 border font-30 pl-1 pr-1 btn-orange-white" style="border-radius: 10rpx;" @click="newAddGoods">
					新增
				</view>
				
				<view class="ml-1 border font-30 pl-1 pr-1 btn-orange-white" style="border-radius: 10rpx;" @click="refresh">
					刷新
				</view>
			</view>
			<view class="w-100 d-flex flex-row a-center ml-2" style="height: 60rpx;">
				<block v-for="(item, index) in defaultSrot" :key="index">
					<view class="font-26 position-relative" @click="chooseSort(index)"
					:class="index == 0 ? 'ml-2':'ml-7'"
					:style="sortIndex == index ? 'color: #FF4500;':''">
						{{item.ChinaName}}
						<uni-icons class="position-absolute" style="right: -30rpx; top: -10rpx;"
						:color="getColor(index, 'asc')" type="arrowup" size="10"></uni-icons>
						<uni-icons class="position-absolute" style="right: -30rpx; top: 10rpx;"
						:color="getColor(index, 'desc')" type="arrowdown" size="10"></uni-icons>
					</view>
				</block>
			</view>		
		</view>
		
			
		<scroll-view scroll-y :croll-with-animation="true" :style="'height:'+(totalH - 70)+'px;'">
			<view class="" v-for="(item,index) in goodsList" :key="index">
				<goods-info-item :item="item"></goods-info-item>
			</view>
			<view class="d-flex j-center font-22 p-2" style="color: #007AFF;" v-if="isShowLoadMoreBoole" @click="loadMore">加载更多</view>
			<view class="d-flex j-center font-22 p-2" style="color: #C8C7CC;" v-else>没有更多了~</view>
		</scroll-view>
		
	</view>
</template>

<script>
	import goodsInfoItem from "@/components/item/goods-info-item.vue"
	import uniCombox from "@/components/uni-combox/uni-combox.vue"
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			goodsInfoItem,
			uniCombox,
			uniIcons
		},
		data() {
			return {
				defaultPageIndex:1,
				//默认一次下拉多少条数据
				defaultItemCount:15,
				typeText:'',
				nameString:'',
				isShowLoadMoreBoole:false,
				//默认排序
				sortName:'SortValue',
				sortValue:'desc', //asc升，desc:降
				defaultSrot:[{
					"ChinaName":'排序值',
					"Name":'SortValue',
					"SortValue":'desc'
				},{
					"ChinaName":'名称',
					"Name":'Name',
					"SortValue":'desc'
				},{
					"ChinaName":'价格',
					"Name":'Price',
					"SortValue":'asc'
				},{
					"ChinaName":'库存',
					"Name":'Stock',
					"SortValue":'asc'
				},{
					"ChinaName":'销量',
					"Name":'SellCount',
					"SortValue":'desc'
				}],
				sortIndex:0
			}
		},
		props:{
			totalH:Number
		},
		computed:{
			...mapState({
				goodsTypeList:state=>state.goods.goodsTypeList,
				goodsList:state=>state.goods.goodsList,
			}),
			...mapGetters([
			]),
			getTypeNameList(){
				var tempList = []
				for (var i = 0; i < this.goodsTypeList.length; i++) {
					tempList.push(this.goodsTypeList[i].Name)
				}
				return tempList
			},
			getTypeName(){
				if(this.typeText){
					for (var i = 0; i < this.goodsTypeList.length; i++) {
						if(this.goodsTypeList[i].ID == this.typeText){
							return this.goodsTypeList[i].Name
						}
					}
				}else{
					return ''
				}
			}
		},
		mounted: function () {
		  this.$nextTick(function () {
			this.isShowLoadMore()
		  })
		},
		methods: {
			...mapMutations([
				'updateGoodsList',
				'pushUpdateGoodsList'
			]),
			...mapActions([
			]),
			getColor(index, value) {
				if(index == this.sortIndex && this.sortValue == value){
					return '#FF4500'
				}else{
					return '#CFCFCF'
				}
			},
			typeInput(e){
				console.log(e)
				for (var i = 0; i < this.goodsTypeList.length; i++) {
					let temp = this.goodsTypeList[i]
					if(temp.Name == e){
						this.typeText = temp.ID
						return
					}
				}
				this.typeText = ''
			},
			nameInput(e){
				this.nameString = e.detail.value
			},
			isShowLoadMore(list){
				var tempList = this.goodsList
				if(list){
					tempList = list
				}
				if(tempList.length >= this.defaultItemCount){
					return this.isShowLoadMoreBoole = true
				}
				return this.isShowLoadMoreBoole = false
			},
			loadMore(){
				this.defaultPageIndex = this.defaultPageIndex + 1
				this.requestData('loadMore')
			},
			check(){
				if(this.nameString == '' && this.typeText == ''){
					uni.showToast({
						title:'请输入要查询的内容',
						icon:'none',
						duration:1000
					})
					return
				}
				this.requestData('check')
			},
			refresh(){
				this.defaultPageIndex = 1
				this.requestData('refresh')
			},
			clearInput(){
				this.nameString = ''
				this.typeText = ''
				this.defaultPageIndex = 1
				this.requestData('clear')
			},
			newAddGoods(){
				uni.navigateTo({
					url:'../../pages/newadd-goods/newadd-goods'
				})
			},
			chooseSort(index){
				this.sortIndex = index
				if(this.sortName != this.defaultSrot[index].Name){
					this.sortName = this.defaultSrot[index].Name
					this.sortValue = this.defaultSrot[index].SortValue
				}else if(this.sortName == this.defaultSrot[index].Name){
					if(this.sortValue == 'asc'){
						this.sortValue = 'desc'
					}else{
						this.sortValue = 'asc'
					}
				}
				this.defaultPageIndex = 1
				this.requestData()
			},
			requestData(className){
				var _self = this;
				_self.$H.post('/api/Product/List',{
					Name:_self.nameString,
					ProductTypeID:_self.typeText,
					SortName:_self.sortName,
					SortValue:_self.sortValue,
					PageIndex:_self.defaultPageIndex
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(className == 'refresh'){
							uni.showToast({title:'刷新成功', icon:'none', duration:1000})
						}
						if(className == 'clear'){
							uni.showToast({title:'清空查询成功', icon:'none', duration:1000})
						}
						if(className == 'check'){
							uni.showToast({title:'查询成功', icon:'none', duration:1000})
						}
						
						_self.isShowLoadMore(res.data)
						if(className == 'loadMore'){
							_self.pushUpdateGoodsList(res.data)
						}else{
							_self.updateGoodsList(res.data)
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
