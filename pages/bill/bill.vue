<template>
	<view class="">
		<view class="w-100 bg-Gainsboro d-flex flex-row a-center position-fixed" style="height: 100rpx; z-index: 100;">
			<view class="d-flex flex-row a-center span24-16">
				<time-selector :showType="showType" @btnConfirm="startTimeCallBack">
					<view class="ml-2 border rounded-40 pl-1 pr-1 bg-white font-26">{{getStartShowTitle}}</view>
				</time-selector>
				<view class="mr ml">-</view>
				<time-selector :showType="showType" @btnConfirm="endTimeCallBack">
					<view class="border rounded-40 pl-1 pr-1 bg-white font-26">{{getEndShowTitle}}</view>
				</time-selector>
			</view>
			<view class="span24-8 d-flex flex-row a-center j-end mr-2">
				<view class="d-flex flex-column">
					<view class="font-24 text-muted">收入 ￥{{sumAmount.IncomeAmount}}</view>
					<view class="font-24 text-muted">支出 ￥{{sumAmount.Expenditure}}</view>
				</view>
			</view>
		</view>
		<view class="" style="padding-top: 100rpx; z-index: 50;">
			<block v-for="(item, index) in billList" :key="index">
				<view class="border-bottom ml-3 pb-2 pt-2" @click="billInfo(item)">
					<view class="d-flex flex-row a-center font-28 position-relative">
						<view class="">{{item.TradeTypeName}}</view>
						<view class="font-weight position-absolute" style="right: 30rpx;"
						:style="item.Amount > 0 ? 'color: #FF582B':''">{{getShowAmount(item.Amount)}}</view>
					</view>
					<view class="d-flex flex-row a-center mt-1 position-relative">
						<view class="font-24 text-muted">{{item.CreateTime}}</view>
						<view class="font-24 text-muted position-absolute" style="right: 30rpx;">余额：{{item.CurrentAmount.toFixed(4)}}</view>
					</view>
				</view>
			</block>
		</view>
		
		<view class="loading">{{loadingTxt}}</view>
		<view class="" style="height: 30rpx;"></view>
	</view>
</template>

<script>
	import timeSelector from "@/components/time-selector/time-selector.vue"
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	let timer = null
	export default {
		components:{
			timeSelector
		},
		data() {
			return {
				showType: 'date', //yearToMonth, year, month, date
				startTime: '',
				endTime: '',
				windowHeight: 0,
				billList: [],
				sumAmount: {IncomeAmount:0, Expenditure:0},
				pageIndex: 1,
				pageSize: 15,
				tradeTypeList: [], 
				loadingTxt: '上拉加载更多'
			}
		},
		onLoad: function(option){
			uni.getSystemInfo({
				success: (res) => {
					this.windowHeight = res.windowHeight
				}
			})
			this.startTime = new Date().toISOString().slice(0, 10);
			this.endTime = new Date().toISOString().slice(0, 10);
			
			this.initTradeTypes()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.onPullDownRefresh()
		},
		onReachBottom() {
			//阻止重复加载
			if(timer !== null){
				clearTimeout(timer)
			}
			if(this.loadingTxt != '没有更多了'){
				timer=setTimeout(()=>this.getMore(), 500)
			}
		},
		computed:{
			...mapState({
				merchantAmount:state=>state.user.merchantAmount,
			}),
			...mapGetters([
			]),
			
			getStartShowTitle(){
				return this.startTime + ' ▼'
			},
			getEndShowTitle(){
				return this.endTime + ' ▼'
			}
		},
		methods:{
			...mapMutations([
			]),
			...mapActions([
			]),
			startTimeCallBack(e){
				this.pageIndex = 1
				this.startTime = e.key
				this.initSumAmount()
			},
			endTimeCallBack(e){
				this.pageIndex = 1
				this.endTime = e.key
				this.initSumAmount()
			},
			initTradeTypes(){
				var _self = this
				_self.$H.post('/API/Finance/TradeTypes', {}, {
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.tradeTypeList = res.data
						_self.initSumAmount()
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			initSumAmount(){
				var _self = this
				let postData = {
					StartTime: _self.startTime,
					EndTime: _self.endTime,
					AmountType: 0
				}
				console.log(postData)
				_self.$H.post('/API/Finance/SumAmount', postData, {
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.sumAmount = res.data
						_self.initBillList()
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			initBillList(m_text){
				var _self = this
				let postData = {
					PageIndex: _self.pageIndex,
					PageSize: _self.pageSize,
					StartTime: _self.startTime,
					EndTime: _self.endTime
				}
				console.log(postData)
				_self.$H.post('/API/Finance/AmountRecord', postData, {
					token:true
				}).then(res=>{	
					console.log(res)
					uni.stopPullDownRefresh()
					uni.hideNavigationBarLoading()
					if(res.status == 0){
						if(res.data.length < _self.pageSize){
							_self.loadingTxt = '没有更多了'
						}else{
							_self.loadingTxt = '上拉加载更多'
						}
						if(m_text == 'loadmore' && res.data.length > 0){
							for (var i = 0; i < res.data.length; i++) {
								_self.billList.push(res.data[i])
							}
							return
						}
						if(m_text == 'refresh'){
							uni.showToast({title: '刷新成功', icon:'none', duration:1000})
						}
						_self.billList = res.data
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			getShowAmount(m_amount){
				if(Number(m_amount) > 0){
					return '+' + Number(m_amount).toFixed(4)
				}else{
					return m_amount
				}
			},
			onPullDownRefresh(){
				this.pageIndex = 1
				this.initBillList('refresh')
			},
			getMore(){
				this.loadingTxt = '加载中'
				this.pageIndex = this.pageIndex + 1
				uni.showNavigationBarLoading()
				this.initBillList('loadmore')
			},
			billInfo(m_item){
				uni.navigateTo({
					url: 'bill-info?tradeType='+ m_item.TradeType + '&orderID=' + m_item.OrderID
				})
			}
		}
	}
</script>

<style>
	.loading{
		line-height: 2em;
		text-align: center;
		color: #888;
		margin-top: 30rpx;
	}
</style>
