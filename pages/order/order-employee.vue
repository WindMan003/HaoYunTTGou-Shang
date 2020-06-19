<template>
	<view class="w-100 d-flex flex-column position-fixed">
		<view class="mt-1 position-relative" style="height:80rpx;">
			<view class="font-26 border rounded-10 pl-1 pr-1 position-absolute btn-orange-white text-center" 
			style="right: 15rpx;" @click="employeeLoginOut">退出登录</view>
		</view>
		
		<view class="border-bottom w-100 d-flex flex-column a-center"  style="height:240rpx;">
			<view class="w-100 d-flex flex-row a-center ml-2" style="height: 80rpx;">
				<view class="border font-30"  style="width: 200rpx; height: 50rpx;">
					<input class="ml-2" type="number" :value="orderNumber" placeholder="订单号" maxlength="20" @input="orderNum"/>
				</view>
				
				<input class="ml-1 border font-30" style="width: 200rpx; height: 50rpx;" type="text" :value="tableNumber"
				placeholder="桌子号" maxlength="5" @input="tableNum"/>
			</view>
			
			<view class="w-100 d-flex flex-row a-center" style="height: 80rpx;">
				<view class="d-flex flex-row a-center" style="width: 70%;">
					<time-selector showType="date" @btnConfirm="btnConfirmBegin">
						<view class="border font-26 ml-2" style="color: #999999; height: 50rpx; width: 180rpx;">{{beginDate}}</view>
					</time-selector>
					
					<view class="font-26 text-center" style="width: 30rpx; height: 40rpx;">-</view>
					
					<time-selector showType="date" @btnConfirm="btnConfirmEnd">
						<view class="border font-26" style="color: #999999; height: 50rpx; width: 180rpx;">{{endDate}}</view>
					</time-selector>
				</view>

				<view class="d-flex flex-row a-center j-end" style="width: 30%;">
					<view class="mr-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="clearInput">清空</view>
					<view class="mr-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="check">查询</view>
				</view>
			</view>
			
			<view class="w-100 d-flex flex-row j-end a-center ml-2 flex-wrap" style="height: 80rpx;">
				<block v-for="(item, index) in defaultStatus" :key="index">
					<view class="mr-2 mt-1 mb pl-1 pr-1 font-26 border rounded position-relative"
					:style="item.Value == statusID ? 'color: #FD6801; border-color: #FD6801;':''"
					@click="switchStatus(item.Value)">
						{{item.Text}}
						<view class="position-absolute rounded-circle" v-if="item.ViewStatus == 1"
						style="width: 15rpx; height: 15rpx; background-color: red; right: 2rpx; top: 2rpx;"></view>
					</view>
				</block>
				<view class="mr-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="refreshOrder">刷新</view>
			</view>
		</view>

		<page-content widthTab refresher infiniting @onrefresh="refresh" @oninfinite="infiniteScroll" class="page-content" 
		:scrollheight="(totalH - 120)">
			<view class="" v-for="(item,index) in orderList" :key="index">
				<order-item :item="item" :statusList="defaultStatus"></order-item>
			</view>
		</page-content>
	</view>
</template>
	
<script>
	import orderItem from "@/components/order/order-item.vue"
	import timeSelector from "@/components/time-selector/time-selector.vue"
	import pageContent from '@/components/uni-scrollview/uni-scrollview.vue'
	
	import {mapState, mapGetters, mapActions, mapMutations} from "vuex"
	export default {
		components:{
			orderItem,
			timeSelector,
			pageContent
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
				statusID: 99
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
			this.getTimeScope()
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
			refresh({ complete }) {
				setTimeout(() => {
					this.refreshOrder(complete())
				}, 1000);
			},
			infiniteScroll({ setStatus }) {
				setTimeout(() => {
					this.loadMore(setStatus('noMore', this.orderList.length > this.defaultItemCount ? true : false))
				}, 1000);
			},
			getTimeScope(){
				var _self = this
				_self.$H.post('/API/order/OrderQueryDefaultTime', {}, {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(_self.beginDate == '起始时间'){
							_self.beginDate = res.data.StartTime
						}
						if(_self.endDate == '结束时间'){
							_self.endDate = res.data.EndTime
						}
						_self.getOrderStatus()
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
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
							data.ViewStatus = 0
							_self.defaultStatus[i] = data
						}
						_self.defaultPageIndex = 1
						_self.requestData()
					}else{
						_self.$Common.showToast(res)
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
			loadMore(callback){
				this.defaultPageIndex = this.defaultPageIndex + 1
				this.requestData('loadMore', callback)
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
				this.defaultPageIndex = 1
				this.requestData('check')
			},
			refreshOrder(callback){
				this.defaultPageIndex = 1
				this.requestData('refresh', callback)
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
		
			requestData(className, callback){
				var _self = this;
				var uploadList = {PageIndex: _self.defaultPageIndex};
				if(_self.orderNumber != ''){
					uploadList.OrderID = _self.orderNumber
				}
				if(_self.tableNumber != ''){
					uploadList.TableNumber = _self.tableNumber
				}
				if(_self.beginDate != '起始时间'){
					uploadList.StartTime = _self.beginDate
				}
				if(_self.endDate != '结束时间'){
					uploadList.EndTime = _self.endDate
				}
				if(_self.statusID != 99){
					uploadList.Status = _self.statusID
				}
				_self.$H.post('/api/Order/List', uploadList, {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(className == 'refresh'){
							if(callback){
								callback
							}
							uni.showToast({title:'刷新成功', icon:'none', duration:1500})
						}
						if(className == 'clear'){
							uni.showToast({title:'清空查询成功', icon:'none', duration:1500})
						}
						if(className == 'check'){
							uni.showToast({title:'查询成功', icon:'none', duration:1500})
						}
						if(className == 'loadMore'){
							if(callback){
								callback
							}
							_self.pushUpdateOrderList(res.data)
						}else{
							_self.updateOrderList(res.data)
						}
						_self.getStatusList()
					}else{	
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
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
							}else if(this.defaultStatus[j].Value == 10 && (temp[i].Status == 4 || temp[i].Status == 5)){
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
