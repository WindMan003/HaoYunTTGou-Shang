<template>
	<view class="ml-3">
		<view class="border-bottom w-100 d-flex flex-row a-center" style="height: 90rpx;">
			<input class="border font-30" style="width: 150rpx;" type="text" :value="nameString" 
			placeholder="输入名称" maxlength="8" @input="nameInput"/>
			<view class="ml-1 border font-30 pl-1 pr-1 btn-blue-white rounded-10" @click="check">查询</view>
			<view class="ml-1 border font-30 pl-1 pr-1 btn-blue-white rounded-10" @click="clearInput">清空</view>
			<view class="ml-1 border font-30 pl-1 pr-1 btn-blue-white rounded-10" @click="newAddGoodsType">新增</view>
			<view class="ml-1 border font-30 pl-1 pr-1 btn-blue-white rounded-10" @click="refresh">刷新</view>
		</view>
		<view class="border-bottom w-100 d-flex flex-row a-center font-28" style="height: 60rpx;">
			<view class="text-center" style="width: 35%;">操作</view>

			<block v-for="(item, index) in defaultSrot" :key="index">
				<view class="font-26 d-flex a-center j-center" :style="index == 0 ? 'width: 26%;':'width: 26%;'">
					<view class="position-relative text-center" @click="chooseSort(index)"
					:style="sortIndex == index ? 'color: #FF4500;':''">
						{{item.ChinaName}}
						<uni-icons class="position-absolute" style="right: -30rpx; top: -10rpx;"
						:color="getColor(index, 'asc')" type="arrowup" size="10"></uni-icons>
						<uni-icons class="position-absolute" style="right: -30rpx; top: 10rpx;"
						:color="getColor(index, 'desc')" type="arrowdown" size="10"></uni-icons>
					</view>
				</view>
			</block>
		</view>
		<scroll-view scroll-y :croll-with-animation="true" :style="'height:'+(totalH - 76)+'px;'">
			<view class="" style="height: 70rpx;" v-for="(item,index) in goodsTypeList" :key="index">
				<category-info-item :item="item"></category-info-item>
			</view>
			<view class="d-flex j-center font-22 p-1" style="color: #007AFF;" v-if="isShowLoadMoreBoole" @click="loadMore">加载更多</view>
			<view class="d-flex j-center font-22 p-1" style="color: #C8C7CC;" v-else>没有更多了~</view>
		</scroll-view>

		<newadd-popup ref="addPopup"></newadd-popup>
	</view>
</template>

<script>
	import newaddPopup from "@/components/popup/goods/newadd.vue"
	import categoryInfoItem from "@/components/item/category-info-item.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			newaddPopup,
			categoryInfoItem
		},
		data() {
			return {
				defaultPageIndex:1,
				//默认一次下拉多少条数据
				defaultItemCount:15,
				isShowLoadMoreBoole:false,
				nameString:"",
				//默认排序
				sortName:'SortValue',
				sortValue:'desc', //asc升，desc:降
				defaultSrot:[{
					"ChinaName":'名称',
					"Name":'Name',
					"SortValue":'desc'
				},{
					"ChinaName":'排序值',
					"Name":'SortValue',
					"SortValue":'desc'
				}],
				sortIndex:1
			}
		},
		props:{
			totalH:Number
		},
		computed:{
			...mapState({
				goodsTypeList:state=>state.goods.goodsTypeList
			}),
			...mapGetters([
			]),
		},
		mounted: function () {
		  this.$nextTick(function () {
			this.isShowLoadMore()
		  })
		},
		methods: {
			...mapMutations([
				'updateGoodsTypeList',
				'pushUpdateGoodsTypeList'
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
			nameInput(e){
				this.nameString = e.detail.value
			},
			isShowLoadMore(list){
				var tempList = this.goodsTypeList
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
				if(this.nameString == ''){
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
				this.defaultPageIndex = 1
				this.requestData('clear')
			},
			newAddGoodsType(){
				this.$refs.addPopup.showPopup()
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
				if(className != 'loadMore'){
					_self.defaultPageIndex = 1
				}
				_self.$H.post('/api/ProductType/List',{
					Name:_self.nameString,
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
							_self.pushUpdateGoodsTypeList(res.data)
						}else{
							_self.updateGoodsTypeList(res.data)
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
