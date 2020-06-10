<template>
	<view class="main">
		<view class="border-bottom w-100 d-flex flex-column a-center"  style="height:200rpx;">
			<view class="w-100 d-flex flex-row a-center ml-2" style="height: 80rpx;">
				<view class="border font-30 d-flex a-center"  style="width: 180rpx; height: 50rpx;">
					<input class="ml-1" type="number" :value="orderNumber" placeholder="订单号" maxlength="20" @input="orderNum"/>
				</view>
				
				<input class="ml-1 border font-30" style="width: 100rpx; height: 50rpx;" type="text" :value="tableNumber"
				placeholder="桌子号" maxlength="5" @input="tableNum"/>
				
				<time-selector showType="date" @btnConfirm="btnConfirmBegin">
					<view class="ml-3 border font-26" style="color: #999999; height: 50rpx; width: 180rpx;">{{beginDate}}</view>
				</time-selector>
				
				<view class="font-26 text-center" style="width: 30rpx; height: 40rpx;">-</view>
				
				<time-selector showType="date" @btnConfirm="btnConfirmEnd">
					<view class="border font-26" style="color: #999999; height: 50rpx; width: 180rpx;">{{endDate}}</view>
				</time-selector>
			</view>
			
			<view class="w-100 d-flex flex-row a-center" style="height: 60rpx;">
				<view class="ml-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="clearInput">清空条件</view>
				<view class="ml-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="check">查询订单</view>
				<view class="ml-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="refresh">刷新列表</view>
			</view>
			
			<view class="w-100 d-flex flex-row a-center ml-2 flex-wrap" style="height: 60rpx;">
				<block v-for="(item, index) in defaultStatus" :key="index">
					<view class="ml-1 mt mb pl pr font-26 border rounded"
					:style="item.Value == statusID ? 'color: #FD6801; border-color: #FD6801;':''"
					@click="switchStatus(item.Value)">
						{{item.Text}}
					</view>
				</block>
			</view>
		</view>
		<scroll-view scroll-y :croll-with-animation="true" :style="'height:'+(totalH - 130)+'px;'" @scroll="Scroll">
			<view class="" v-for="(item,index) in orderList" :key="index">
				<order-item :item="item"></order-item>
			</view>
			<view class="d-flex j-center font-22 p-2" style="color: #007AFF;" v-if="isShowLoadMoreBoole" @click="loadMore">加载更多</view>
			<view class="d-flex j-center font-22 p-2" style="color: #C8C7CC;" v-else>没有更多了~</view>
			<view style="height: 30rpx;"></view>
		</scroll-view>
	</view>
</template>
	
<script>
	import orderItem from "@/components/order/order-item.vue"
	import timeSelector from "@/components/time-selector/time-selector.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			orderItem,
			timeSelector
		},
		data() {
			return {
				isMore:true,
				defaultPageIndex:1,
				defaultItemCount:15,
				isShowLoadMoreBoole:false,
				totalH:0,
				//查询值默认
				defaultStatus: [],
				beginDate:'起始时间',
				endDate:'结束时间',
				orderNumber:'',
				tableNumber:'',
				statusID: 99
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			this.getOrderStatus()
		},
		computed:{
			...mapState({
				orderList:state=>state.order.orderList,
			}),
			...mapGetters([
			]),
			getNowTime(){
				return new Date().toISOString().slice(0, 10)
			}
		},
		methods: {
			...mapMutations([
				'updateOrderList',
				'pushUpdateOrderList'
			]),
			...mapActions([
			]),
			getOrderStatus(){
				var _self = this
				_self.$H.post('/api/order/OrderStatus', {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						let temp = res.data
						for (let i = 0; i < temp.length; i++) {
							let data = {}
							data.Text = temp[i].Text
							data.Value = temp[i].Value
							_self.defaultStatus[i] = data
						}
						_self.requestData()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			btnConfirmBegin(e){
				this.beginDate = e.key
			},
			btnConfirmEnd(e){
				this.endDate = e.key
			},
			orderNum(e){
				this.orderNumber = e.detail.value
			},
			tableNum(e){
				this.tableNumber = e.detail.value
			},
			Scroll(e){
				if(this.isMore){
					this.isMore = false
					this.isShowLoadMore()
				}
			},
			isShowLoadMore(list){
				var tempList = this.orderList
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
				if(this.beginDate == '起始时间' && this.endDate == '结束时间' && this.orderNumber == '' && this.tableNumber == '')
				{
					uni.showToast({
						title:'请输入要查询的内容',
						icon:'none',
						duration:1000
					})
					return
				}
				this.requestData()
			},
			refresh(){
				this.defaultPageIndex = 1
				this.requestData('refresh')
			},
			switchStatus(index){
				if(this.statusID == index){
					this.statusID = 99
				}else{
					this.statusID = index
				}
				this.requestData()
			},
			clearInput(){
				this.beginDate = '起始时间'
				this.endDate = '结束时间'
				this.orderNumber = ''
				this.tableNumber = ''
				this.statusID = 99
				// this.defaultPageIndex = 1
				// this.requestData('clear')
			},
		
			requestData(className){
				var _self = this;
				var uploadList = {PageIndex:_self.defaultPageIndex};
				if(this.orderNumber != ''){
					uploadList.OrderID = this.orderNumber
				}
				if(this.tableNumber != ''){
					uploadList.TableNumber = this.tableNumber
				}
				if(this.beginDate != '起始时间'){
					uploadList.StartTime = this.beginDate
				}
				if(this.endDate != '结束时间'){
					uploadList.EndTime = this.endDate
				}
				if(this.statusID != 99){
					uploadList.Status = this.statusID
				}
				
				_self.$H.post('/api/Order/List',uploadList,{
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
						_self.isShowLoadMore(res.data)
						if(className == 'loadMore'){
							_self.pushUpdateOrderList(res.data)
						}else{
							_self.updateOrderList(res.data)
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
