<template>
	<uni-popup type="center" ref="popup" @change="change" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex flex-column w-100" style="height: 550rpx; background-color: #FFFFFF; border-radius: 3%;">
			<view class="d-flex a-center j-center font-38 font-weight pt-1 pb-1 mt-1">产品规格</view>
			
			<view class="w-100 d-flex a-center j-end mb-1">
				<view class="font-26 border pl-1 pr-1 mr-2" @click="addData"
				style="background-color: #007AFF; color: #FFFFFF;">添加</view>
			</view>
			
			<block v-for="(item, index) in dataList" :key="index">
				<view class="d-flex flex-row a-center ml-2 mt">
					<view class="border font-30" style="width: 200rpx;">
						<input class="ml p" style="width: 180rpx;" type="text" :value="item.Name" placeholder="规格名称"
						:id="index" @input="nameInput"/>
					</view>
					<view class="ml-2 border font-30" style="width: 200rpx;">
						<input class="ml p" style="width: 180rpx;" type="number" :value="item.Price" placeholder="价格"
						:id="index" @input="priceInput"/>
					</view>
					<view class="border font-26 pl-1 pr-1 ml-2" @click="deleteData" :id="index"
					style="background-color: #007AFF; color: #FFFFFF;">删除</view>
				</view> 
			</block>
			
			<view class="d-flex a-end j-center mb-2" style="height: 100%;">
				<view class="border font-38 pl-2 pr-2"  @click="uploadInfo"
				style="border-radius: 10rpx; background-color: #007AFF; color: #FFFFFF;">确定</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default{
		components:{
		},
		props:{
			
		},
		data() {
			return {
				dataList:[{'ID':0,'Name':'','Price':''}],
				callback:null
			}
		},
		computed:{
			...mapState({
			}),
			...mapGetters([

			]),
		},
		methods:{
			...mapMutations([
			]),
			...mapActions([
			]),
			
			showPopup(list, callback){
				if(list){
					this.dataList = list
				}
				this.callback = callback
				this.$refs.popup.open()
			},
			change(e){
				if(!e.show){
					this.dataCount = 1
					this.dataList = [{'ID':0,'Name':'','Price':''}]
				}
			},
			nameInput(e){
				var data = e.detail.value
				var id = e.currentTarget.id
				this.dataList[id].Name = data
			},
			priceInput(e){
				var data = e.detail.value
				var id = e.currentTarget.id
				this.dataList[id].Price = data
			},
			addData(){
				var templist = {'ID':0,'Name':'','Price':''}
				this.dataList.push(templist)
			},
			deleteData(e){
				var id = e.currentTarget.id
				this.dataList.splice(id, 1)
			},
			uploadInfo(){
				var tempList = []
				for (var i = 0; i < this.dataList.length; i++) {
					var temp = this.dataList[i]
					if(temp.Name == '' && temp.Price == ''){
						tempList.push(i)
					}
				}
				for (var i = tempList.length - 1; i >= 0; i--) {
					this.dataList.splice(tempList[i], 1)
				}
				this.callback(this.dataList)
				this.$refs.popup.onTap()
			}
		}
	}
</script>

<style>
</style>