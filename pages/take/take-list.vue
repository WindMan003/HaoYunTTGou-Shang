<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		<view class="d-flex flex-row a-center j-sa border-bottom" style="height: 60rpx;">
			<block v-for="(item, index) in typeList.Status" :key="index">
				<view class="font-26" @click="changeType(index, item)"
				:class="typeIndex == index ? 'font-weight border-bottom-6 border-bottom-orange':''">{{item.Text}}</view>
			</block>
		</view>
		<divider></divider>
		
		<block v-for="(item, index) in takeList" :key="index">
			<view class="border-bottom ml-3 pb-2 pt-2" @click="itemInfo(item)">
				<view class="d-flex flex-row a-center font-28 position-relative">
					<view class="">提现</view>
					<view class="ml-3">({{getTakeType(item.TakeType)}})</view>
					<view class="font-weight position-absolute" style="right: 30rpx;">-{{item.Amount}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-1 position-relative">
					<view class="font-24 text-muted">{{item.CreateTime}}</view>
					<view class="font-24 text-muted position-absolute" style="right: 30rpx;">{{getTakeStatus(item)}}</view>
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
				takeList: [],
				pageSize: 15,
				pageIndex: 1,
				status: -1,
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
				merchantAmount:state=>state.user.merchantAmount,
				takeAccountList:state=>state.user.takeAccountList
			})
		},
		methods: {
			...mapMutations([
				'initTakeAccountList'
			]),
			init(){
				var _self = this
				_self.$H.post('/api/Finance/TakeTypeAndStatusSelect',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.typeList = res.data
						_self.initTakeList()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			getTakeType(typeID){
				if(typeID == 2){
					return '支付宝'
				}
			},
			getTakeStatus(m_item){
				if(m_item.FailReturnMoneyStatus == 0){
					var temp = this.typeList.Status
					for (var i = 0; i < temp.length; i++) {
						if(m_item.Status == temp[i].Value){
							return temp[i].Text
						}
					}
				}else{
					return m_item.FailReturnMoneyStatusText
				}

			},
			itemInfo(item){
				var statusText = this.getTakeStatus(item)
				console.log(statusText)
				uni.navigateTo({
					url:'take-list-info?status='+statusText+'&item='+ encodeURIComponent(JSON.stringify(item))
				})
			},
			changeType(index, item){
				this.typeIndex = index
				this.status = item.Value
				this.pageIndex = 1
				this.initTakeList()
			},
			initTakeList(m_text){
				var _self = this
				_self.$H.post('/api/Finance/TakeRecord',{
					PageIndex: _self.pageIndex,
					Status: _self.status
				},{
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
						if(m_text == 'refresh'){
							uni.showToast({title: '刷新成功', icon:'none', duration:1000})
						}
						
						if(m_text == 'loadmore' && res.data.length > 0){
							for (var i = 0; i < res.data.length; i++) {
								_self.takeList.push(res.data[i])
							}
						}else{
							_self.takeList = res.data
						}
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			onPullDownRefresh(){
				this.pageIndex = 1
				this.initTakeList('refresh')
			},
			getMore(){
				this.loadingTxt = '加载中'
				this.pageIndex = this.pageIndex + 1
				uni.showNavigationBarLoading()
				this.initTakeList('loadmore')
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
