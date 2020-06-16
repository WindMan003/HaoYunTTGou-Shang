<template>
	<view class="main">
		<refresh ref="refresh" @isRefresh="refreshList">
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
					<view class="font-26 border rounded-10 pl-1 pr-1 position-absolute btn-orange-white text-center" 
					style="right: 15rpx;" @click="employeeLoginOut">退出登录</view>
				</view>
				
				<view class="w-100 d-flex flex-row a-center ml-2 flex-wrap" style="height: 60rpx;">
					<block v-for="(item, index) in defaultStatus" :key="index">
						<view class="ml-1 mt mb pl pr font-26 border rounded position-relative"
						:style="item.Value == statusID ? 'color: #FD6801; border-color: #FD6801;':''"
						@click="switchStatus(item.Value)">
							{{item.Text}}
							<view class="position-absolute rounded-circle" v-if="item.ViewStatus == 1"
							style="width: 15rpx; height: 15rpx; background-color: red; right: 2rpx; top: 2rpx;"></view>
						</view>
					</block>
				</view>
			</view>
			
			<scroll-view scroll-y :croll-with-animation="true" :style="'height:'+(totalH - 100)+'px;'" v-if="orderList.length > 0" @scrolltolower="loadMore">
				<view class="" v-for="(item,index) in orderList" :key="index">
					<order-item :item="item" :statusList="defaultStatus"></order-item>
				</view>
				<view class="d-flex a-center j-center text-light-muted font-md py-3">{{ loadText }}</view>
			</scroll-view>
			<!-- 空数据 -->
			<view v-else class="d-flex j-center a-center pt-5">
				<text class="font-md text-light-muted">暂无数据</text>
			</view>
		</refresh>
	</view>
</template>
	
<script>
	import orderItem from "@/components/order/order-item.vue"
	import timeSelector from "@/components/time-selector/time-selector.vue"
	import refresh from '@/components/common/refresh.vue'
	
	import {mapState, mapGetters, mapActions, mapMutations} from "vuex"
	export default {
		components:{
			orderItem,
			timeSelector,
			refresh
		},
		data() {
			return {
				isMore:true,
				defaultPageIndex:1,
				defaultItemCount:15,
				totalH:0,
				//查询值默认
				defaultStatus: [],
				beginDate:'起始时间',
				endDate:'结束时间',
				orderNumber:'',
				tableNumber:'',
				statusID: 99,
				loadText: '上拉加载更多'
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
		},
		onShow() {
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
				'pushUpdateOrderList',
				'logout'
			]),
			...mapActions([
			]),
			getOrderStatus(){
				var _self = this
				_self.$H.post('/api/order/OrderStatus', {}, {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						let temp = res.data
						for (let i = 0; i < temp.length; i++) {
							let data = {}
							data.Text = temp[i].Text
							data.Value = temp[i].Value
							data.ViewStatus = 0
							_self.defaultStatus[i] = data
						}
						_self.defaultPageIndex = 1
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
				this.defaultPageIndex = 1
				this.requestData()
			},
			clearInput(){
				this.beginDate = '起始时间'
				this.endDate = '结束时间'
				this.orderNumber = ''
				this.tableNumber = ''
				this.statusID = 99
				this.defaultPageIndex = 1
				this.requestData('clear')
			},
		
			requestData(className){
				var _self = this;
				var uploadList = {PageIndex: _self.defaultPageIndex};
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
				_self.$H.post('/api/Order/List', uploadList, {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(className == 'refresh'){
							uni.showToast({title:'刷新成功', icon:'none', duration:1500})
						}
						if(className == 'clear'){
							uni.showToast({title:'清空查询成功', icon:'none', duration:1500})
						}
						if(className == 'loadMore'){
							_self.pushUpdateOrderList(res.data)
						}else{
							_self.updateOrderList(res.data)
						}
						_self.isHaveMore()
						_self.getStatusList()
					}else{	
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			isHaveMore(){
				let m_index = this.orderList.length
				if(m_index < this.defaultPageIndex * this.defaultItemCount){
					this.loadText = '没有更多了'
				}else{
					this.loadText = '上拉加载更多'
				}
			},
			refreshList() {
				this.refresh()
				this.$refs.refresh.endAfter()	
			},
			// 获取是否有订单未查看
			getStatusList(){
				let temp = this.orderList
				for (let i = 0; i < temp.length; i++) {
					if(temp[i].ViewStatus == 0){
						for (let j = 0; j < this.defaultStatus.length; j++) {
							if(this.defaultStatus[j].Value == temp[i].Status){
								this.defaultStatus[j].ViewStatus = 1
								break
							}
						}
					}
				}
			},
			employeeLoginOut(){
				uni.setStorageSync('em_token', '')
				this.logout()
				uni.reLaunch({
					url:'../login/login-employee'
				})
			}
		}
	}
</script>

<style>

</style>
