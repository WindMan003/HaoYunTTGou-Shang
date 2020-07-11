<template>
	<view class="w-100 d-flex flex-column position-fixed">
<!-- 		<view class="mt-1 position-relative" style="height:80rpx;">
			<view class="font-26 border rounded-10 pl-1 pr-1 position-absolute btn-orange-white text-center" 
			style="right: 15rpx;" @click="employeeLoginOut">退出登录</view>
		</view> -->
		
		<view class="w-100 d-flex flex-row a-center" style="height: 80rpx;">
			<input class="border font-30 ml-2" type="number" style="width: 200rpx; height: 50rpx;" :value="orderNumber"
			placeholder="订单号" maxlength="20" @input="orderNumInput"/>
			
			<input class="ml-1 border font-30" style="width: 100rpx; height: 50rpx;" type="text" :value="tableNumber"
			placeholder="桌子号" maxlength="10" @input="tableNumInput"/>
			
			<view class="d-flex flex-row a-center j-end" style="width: 55%;">
				<view class="mr-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="clearInput">清空</view>
				<view class="mr-2 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="check">查询</view>
				<view class="mr-3 border font-28 pl-1 pr-1 btn-orange-white rounded-10" @click="refreshOrder">刷新</view>
			</view>
		</view>
			
<!-- 			<view class="w-100 d-flex flex-row a-center" style="height: 80rpx;">
				<view class="d-flex flex-row a-center" style="width: 70%;">
					<time-selector showType="date" @btnConfirm="btnConfirmBegin">
						<view class="border font-26 ml-2" style="color: #999999; height: 50rpx; width: 180rpx;">{{beginDate}}</view>
					</time-selector>
					
					<view class="font-26 text-center" style="width: 30rpx; height: 40rpx;">-</view>
					
					<time-selector showType="date" @btnConfirm="btnConfirmEnd">
						<view class="border font-26" style="color: #999999; height: 50rpx; width: 180rpx;">{{endDate}}</view>
					</time-selector>
				</view>
			</view> -->
			

			
<!-- 			<view class="w-100 d-flex flex-row j-end a-center ml-2 flex-wrap" style="height: 80rpx;">
				<block v-for="(item, index) in defaultStatus" :key="index">
					<view class="mr-2 mt-1 mb pl-1 pr-1 font-26 border rounded position-relative"
					:style="item.Value == statusID ? 'color: #FD6801; border-color: #FD6801;':''"
					@click="switchStatus(item.Value)">
						{{item.Text}}
						<view class="position-absolute rounded-circle" v-if="item.ViewStatus == 1"
						style="width: 15rpx; height: 15rpx; background-color: red; right: 2rpx; top: 2rpx;"></view>
					</view>
				</block>
			</view> -->
		<!-- </view> -->
		
		<view class="w-100 d-flex flex-row j-sa a-center border-bottom" style="height: 80rpx;">
			<block v-for="(item, index) in defaultStatus" :key="index">
				<view class="pl-1 pr-1 font-26 position-relative"
				:class="item.Value == statusID ? 'border-bottom':''"
				:style="item.Value == statusID ? 'border-color: #FD6801':''"
				@click="switchStatus(item.Value)">
					{{item.Text}}
				</view>
			</block>
		</view>
		
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :height="totalH+'px'"
		style="background-color: #EEEEEE;">
			<view class="" v-for="(item,index) in orderList" :key="index">
				<view class="mt-2">
					<order-item :item="item" :statusList="defaultStatus"></order-item>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>
	
<script>
	import orderItem from "@/components/order/order-item.vue"
	import timeSelector from "@/components/time-selector/time-selector.vue"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import refresh from '@/components/common/refresh.vue';
	
	import {mapState, mapGetters, mapActions, mapMutations} from "vuex"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{
			orderItem,
			timeSelector,
			refresh
		},
		data() {
			return {
				totalH:0,
				//查询值默认
				uploadList: {},
				defaultStatus: [],
				beginDate:'起始时间',
				endDate:'结束时间',
				orderNumber:'',
				tableNumber:'',
				statusID: 99,
				mescroll: null,
				className: ''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					console.log(res)
					this.totalH = res.windowHeight - uni.upx2px(160)
					if(res.platform == 'android'){
						this.totalH = this.totalH - 50
					}
				}
			})
			this.getOrderStatus()
		},
		onShow() {
			// this.getTimeScope()
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
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
				
				this.mescroll.optUp.textNoMore = '没有更多了'
			},
			/*下拉刷新的回调*/
			downCallback(m_mescroll){
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			upCallback(page) {
				var _self = this;
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				_self.initUpdateList(pageNum, pageSize)
				_self.$H.post('/api/Order/List', _self.uploadList, {
					token:true
				}).then(res=>{
					console.log(res)
					setTimeout(()=>{
						_self.uploadList = {}
						if(res.status == 0){
							if(page.num == 1) _self.updateOrderList([]); //如果是第一页需手动置空列表
							let curPageData = res.data; 
							let curPageLen = curPageData.length; 
							_self.pushUpdateOrderList(curPageData)
							_self.mescroll.endSuccess(curPageLen, curPageLen < pageSize ? 'false':'true');
							_self.showMeToast()
						}else{	
							uni.showToast({title:res.message, icon:'none', duration:1500})
							_self.mescroll.endErr()
						}
					}, 500)
				})
			},
			initUpdateList(m_pageNum, m_pageSize){
				var _self = this;
				_self.uploadList = {PageIndex: m_pageNum, PageSize: m_pageSize};
				if(_self.orderNumber != ''){
					_self.uploadList.OrderID = _self.orderNumber
				}
				if(_self.tableNumber != ''){
					_self.uploadList.TableNumber = _self.tableNumber
				}
				if(_self.beginDate != '起始时间'){
					_self.uploadList.StartTime = _self.beginDate
				}
				if(_self.endDate != '结束时间'){
					_self.uploadList.EndTime = _self.endDate
				}
				if(_self.statusID != 99){
					_self.uploadList.Status = _self.statusID
				}
			},
			showMeToast(){
				if(this.className == 'refresh'){
					uni.showToast({title:'刷新成功', icon:'none', duration:1500})
				}
				if(this.className == 'clear'){
					uni.showToast({title:'清空查询成功', icon:'none', duration:1500})
				}
				if(this.className == 'check'){
					uni.showToast({title:'查询成功', icon:'none', duration:1500})
				}
				this.className = ''
			},
			btnConfirmBegin(e){
				this.beginDate = e.key
			},
			btnConfirmEnd(e){
				this.endDate = e.key
			},
			orderNumInput(e){
				this.orderNumber = e.detail.value
			},
			tableNumInput(e){
				this.tableNumber = e.detail.value
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
				this.className = 'check'
				this.downCallback()
			},
			refreshOrder(){
				this.className = 'refresh'
				this.downCallback()
			},
			switchStatus(index){
				if(this.statusID == index){
					// this.statusID = 99
					return
				}else{
					this.statusID = index
				}

				this.downCallback()
			},
			clearInput(){
				this.beginDate = '起始时间'
				this.endDate = '结束时间'
				this.orderNumber = ''
				this.tableNumber = ''
				this.statusID = 99
				this.className = 'clear'
				this.downCallback()
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
