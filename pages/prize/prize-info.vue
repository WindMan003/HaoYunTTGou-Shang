<template>
	<view class="w-100">
		<!-- <view class="d-flex flex-column j-center mt-5">
			<view class="d-flex flex-row a-center">
				<view class="" style="width: 15%;"></view>
				<view class="font-26" style="width: 20%;">奖品名称</view>
				<view class="border d-flex a-center" style="width: 400rpx;">
					<input class="ml-1 font-26" type="text" v-model="prizeName" placeholder="名称" :maxlength="16" @input="prizeNameInput"/>
				</view>
			</view>
			<view class="d-flex flex-row a-center mt-3">
				<view class="" style="width: 15%;"></view>
				<view class="font-26" style="width: 20%;">奖品数量</view>
				<view class="border pl-1" style="width: 400rpx;">
					<uni-combox :value="getPrizeTypeName" :candidates="getPrizeTypeNameList" @input="prizeTypeInput"></uni-combox>
				</view>
			</view>
			<view class="d-flex flex-row a-center mt-3">
				<view class="" style="width: 15%;"></view>
				<view class="font-26" style="width: 20%;">奖品价值</view>
				<view class="border d-flex a-center" style="width: 400rpx;">
					<input class="ml-1 font-26" type="number" v-model="prizePrice" placeholder="例如: 99元" :maxlength="9" @input="prizePriceInput"/>
				</view>
			</view>
			<view class="d-flex flex-row a-center mt-3">
				<view class="" style="width: 15%;"></view>
				<view class="font-26" style="width: 20%;">备注</view>
				<view class="border d-flex a-center" style="width: 400rpx;">
					<input class="ml-1 font-26" type="text" v-model="prizeNote" placeholder="可不填" :maxlength="16" @input="prizeNoteInput"/>
				</view>
			</view>
			
			<view class="w-100 d-flex a-center j-center">
				<view class="font-38 btn-orange-white p-1 pl-4 pr-4 text-center rounded mt-5" @click="createPrize">生成奖品</view>
			</view>
		</view> -->
		<block v-if="getListLength" v-for="(item, index) in prizeList" :key="index">
			<view class="d-flex a-center j-center">
				<view class="mt-2 d-flex flex-column j-center rounded-10" style="width: 92%; background-color: #EEEEEE;">
					<view class="d-flex flex-row a-center ml-4 mt-2">
						<view class="font-26">{{item.Name}}</view>
						<view class="font-26 ml-1">({{getRangeName(item.PrizeRange)}})</view>
					</view>
					<view class="d-flex flex-row a-center ml-4 mt-1">
						<view class="font-24">价值</view>
						<view class="font-24 ml-3 text-muted">{{item.Amount}}</view>
					</view>
					<view class="d-flex flex-row a-center ml-4 mt-1 mb-2">
						<view class="font-24">备注</view>
						<view class="font-24 ml-3 text-muted">{{item.UseNote}}</view>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="d-flex flex-column a-center j-center mt-4 font-24 text-muted">没有设置奖品</view>
		</block>
		<view class="w-100 d-flex a-center j-center mt-5">
			<view class="font-38 btn-white-orange rounded-10 pt-1 pb-1 border text-center" style="width: 90%;" @click="addPrize">添加奖品</view>
		</view>
	</view>
</template>
	
<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{

		},
		data() {
			return {
				totalH:0,
				prizeList:[],
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
			this.__init()
		},
		computed:{
			getListLength(){
				if(this.prizeList.length > 0){
					return true
				}else{
					return false
				}
			}
			
		},
		methods: {
			__init(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Prize/List',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.prizeList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			getRangeName(m_type){
				if(m_type == 1){
					return '本店奖品'
				}else{
					return '他店奖品'
				}
			},
			addPrize(){
				uni.navigateTo({
					url:"./prize-add"
				})
			}
		}
	}
</script>

<style>

</style>
