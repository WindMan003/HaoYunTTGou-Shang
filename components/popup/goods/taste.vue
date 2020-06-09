<template>
	<uni-popup type="center" ref="popup" @change="change" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex flex-column w-100" style="height: 550rpx; background-color: #FFFFFF; border-radius: 3%;">
			<view class="d-flex a-center j-center font-38 font-weight pt-1 pb-1 mt-1">产品口味</view>
			<view class="mt-1 d-flex a-center j-center">
				<view class="d-flex flex-row flex-wrap a-start border" style="border-radius: 15rpx; width: 90%; height: 250rpx;">
					<block v-for="(item, index) in tasteList" :key="index">
						<view class="mt-1 ml-2 font-26 position-relative" style="height: 50rpx;">
							<uni-tag :text="item.Name" type="primary" :inverted="true" @click="changeValue"></uni-tag>
							<view class="text-center font-20 position-absolute rounded-circle"
							style="background-color: #ff5722; color: #ffffff; height: 36rpx; width: 36rpx; top: -10rpx; right: -10rpx;"
							:id="index" @click="deleteTaste">
								一
							</view>
						</view>
					</block>
				</view>
			</view>
			
			<view class="mt-2 d-flex flex-row a-center j-center">
				<view class="border font-30" style="width: 200rpx; border-radius: 10rpx;">
					<input class="p" style="width: 180rpx;" type="text" :value="tasteName"
					placeholder="口味名" @input="tasteInput"/>
				</view>
				<view class="border font-30 pl-1 pr-1 ml-2" @click="saveTaste"
				style="background-color: #007AFF; color: #FFFFFF;">保存</view>
			</view>
			
			<view class="d-flex a-end j-center mb-2" style="height: 100%;">
				<view class="border font-38 pl-2 pr-2"  @click="uploadInfo"
				style="border-radius: 10rpx; background-color: #007AFF; color: #FFFFFF;">确定</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default{
		components:{
			uniTag
		},
		props:{

		},
		data() {
			return {
				tasteList:[],
				tasteName:'',
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
					this.tasteList = list
				}
				this.callback = callback
				this.$refs.popup.open()
			},
			change(e){
				if(!e.show){
					this.tasteName = ''
					this.callback(this.tasteList)
				}
			},
			tasteInput(e){
				this.tasteName = e.detail.value
			},
			saveTaste(){
				if(this.tasteName != ''){
					var temp = {'ID':0,'Name':this.tasteName}
					this.tasteList.push(temp)
					this.tasteName = ''
				}else{
					uni.showToast({title:'请填写口味', icon: 'none', duration:1000})
				}
			},
			changeValue(e){
				console.log(e)
			},
			deleteTaste(e){
				var _self = this;
				var id = e.currentTarget.id
				uni.showModal({
				    title: '提示',
				    content: '确定删除'+_self.tasteList[id].Name+'口味',
				    success: function (res) {
				        if (res.confirm) {
							_self.tasteList.splice(id, 1)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			uploadInfo(){
				this.callback(this.tasteList)
				this.$refs.popup.onTap()
			}
		}
	}
</script>

<style>

</style>
