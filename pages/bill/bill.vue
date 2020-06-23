<template>
	<view class="main">
		<view class="w-100 border-top"></view>
<!-- 		<view class="d-flex flex-row a-center j-sa border-bottom" style="height: 60rpx;">
			<block v-for="(item, index) in typeList" :key="index">
				<view class="font-26" @click="changeType(index, item)"
				:class="typeIndex == index ? 'font-weight border-bottom-6 border-bottom-orange':''">{{item.Text}}</view>
			</block>
		</view>
		<divider></divider> -->
		
		<block v-for="(item, index) in billList" :key="index">
			<view class="border-bottom ml-3 pb-2 pt-2">
				<view class="d-flex flex-row a-center font-28 position-relative">
					<view class="">{{item.TradeTypeName}}</view>
					<view class="font-weight position-absolute" style="right: 30rpx;"
					:style="item.Amount > 0 ? 'color: #FF582B':''">{{item.Amount}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-1 position-relative">
					<view class="font-24 text-muted">{{item.CreateTime}}</view>
					<view class="font-24 text-muted position-absolute" style="right: 30rpx;">余额：{{item.CurrentAmount}}</view>
				</view>
			</view>
		</block>
		
		<view class="loading">{{loadingTxt}}</view>
		<view class="" style="height: 30rpx;"></view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	
	let timer = null
	export default {
		data() {
			return {
				typeIndex: 0,
				typeList: [],
				billList: [],
				pageIndex: 1,
				pageSize: 15,
				loadingTxt: '上拉加载更多'
			}
		},
		onLoad() {
			this.init()
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

			})
		},
		methods: {
			...mapMutations([
				
			]),
			init(){
				var _self = this
				_self.$H.post('/API/Finance/TradeTypes', {}, {
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.typeList = res.data
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
					PageSize: _self.pageSize
				}
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
			onPullDownRefresh(){
				this.pageIndex = 1
				this.initBillList('refresh')
			},
			getMore(){
				this.loadingTxt = '加载中'
				this.pageIndex = this.pageIndex + 1
				uni.showNavigationBarLoading()
				this.initBillList('loadmore')
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
