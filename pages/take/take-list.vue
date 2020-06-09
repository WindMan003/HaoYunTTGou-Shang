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
					<view class="font-weight position-absolute" style="right: 30rpx;">-{{item.Amount.toFixed(2)}}</view>
				</view>
				<view class="d-flex flex-row a-center mt-1 position-relative">
					<view class="font-24 text-muted">{{item.CreateTime}}</view>
					<view class="font-24 text-muted position-absolute" style="right: 30rpx;">{{getTakeStatus(item.Status)}}</view>
				</view>
			</view>
		</block>
		
		<view class="d-flex j-center font-22 p-1" style="color: #007AFF;" v-if="isShowLoadMoreBoole" @click="loadMore">加载更多</view>
		<view class="d-flex j-center font-22 p-1" style="color: #C8C7CC;" v-else>没有更多了~</view>
	</view>
	
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		data() {
			return {
				typeIndex:0,
				typeList:[],
				takeList:[],
				isShowLoadMoreBoole:false,
				defaultItemCount:15,
				defaultPageIndex:0,
				status:-1
			}
		},
		onLoad() {
			this.__init()
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
			isShowLoadMore(list){
				var tempList = this.takeList
				if(list){
					tempList = list
				}
				if(tempList.length >= this.defaultItemCount){
					return this.isShowLoadMoreBoole = true
				}
				return this.isShowLoadMoreBoole = false
			},
			loadMore(){
				this.changeType(this.typeIndex)
			},
			__init(){
				var _self = this
				_self.$H.post('/api/Finance/TakeTypeAndStatusSelect',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.typeList = res.data
						
						_self.__initTakeList()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			__initTakeList(){
				this.changeType(this.typeIndex)
			},
			getTakeType(typeID){
				if(typeID == 2){
					return '支付宝'
				}
			},
			getTakeStatus(statusID){
				var temp = this.typeList.Status
				for (var i = 0; i < temp.length; i++) {
					if(statusID == temp[i].Value){
						return temp[i].Text
					}
				}
			},
			itemInfo(item){
				var statusText = this.getTakeStatus(item.Status)
				console.log(statusText)
				uni.navigateTo({
					url:'take-list-info?status='+statusText+'&item='+ encodeURIComponent(JSON.stringify(item))
				})
			},
			changeType(index, item){
				var _self = this
				_self.typeIndex = index
				_self.defaultPageIndex = _self.defaultPageIndex + 1
				if(item){
					_self.defaultPageIndex = 1
					_self.status = item.Value
				}
				_self.$H.post('/api/Finance/TakeRecord',{
					PageIndex:_self.defaultPageIndex,
					Status:_self.status
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					if(res.status == 0){
						_self.isShowLoadMore(res.data)
						if(_self.defaultPageIndex > 1 && res.data.length > 0){
							_self.takeList.push(res.data)
						}else if(_self.defaultPageIndex == 1){
							_self.takeList = res.data
						}
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			// onReachBottom() { //上拉加载  
			//     // let listData = this.data.listData;  
			//     // listData.push(...Api.getNews());//新增数据  
			//     // this.setData({  
			//     //     listData  
			//     // }) //全量数据，发送数据到视图层  
			// 	console.log('上拉加载')
			// 	this.changeType(this.typeIndex)
			// }
		}
	}
</script>

<style>

</style>
