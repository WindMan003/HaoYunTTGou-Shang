<template>
	<view class="w-100">
		<view class="d-flex flex-column j-center mt-5">
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
				prizeRange:1,
				prizeTypeList:[],
				prizeType:1,
				prizeName:'',
				prizePrice:'',
				prizeNote:''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			
			this.__init()  //默认了prizeRange
		},
		computed:{
			getPrizeTypeName(){
				if(this.prizeTypeList != ''){
					var temp = this.prizeTypeList
					for (var i = 0; i < temp.length; i++) {
						if(temp[i].Value == this.prizeType){
							return temp[i].Text
						}
					}
				}else{
					return '请选择'
				}
			},
			getPrizeTypeNameList(){
				var temp = []
				if(this.prizeTypeList != ''){
					var templist = this.prizeTypeList
					for (var i = 0; i < templist.length; i++) {
						temp.push(templist[i].Text)
					}
				}
				return temp
			},
		},
		methods: {
			__init(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Prize/PrizeType',{
					PrizeRange:_self.prizeRange
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.prizeTypeList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			prizeNameInput(e){
				this.prizeName = e.detail.value
			},
			prizeTypeInput(e){
				var temp = this.prizeTypeList
				for (var i = 0; i < temp.length; i++) {
					let tempName = temp[i].Text
					if(tempName == e && this.serviceType != temp[i].Value){
						this.prizeType = temp[i].Value
						return
					}
				}
			},
			prizePriceInput(e){
				this.prizePrice = e.detail.value
			},
			prizeNoteInput(e){
				this.prizeNote = e.detail.value
			},
			
			createPrize(){
				var _self = this
				if(_self.prizeName == ''){
					uni.showToast({title:'填写奖品名称', icon:'none', duration:1000})
					return
				}
				if(_self.prizePrice == ''){
					uni.showToast({title:'填写奖品价值', icon:'none', duration:1000})
					return
				}
				
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/Prize/Add',{
					PrizeRange:_self.prizeRange,
					Name:_self.prizeName,
					PrizeType:_self.prizeType,
					Amount:_self.prizePrice,
					UseNote:_self.prizeNote,
					Note:_self.prizeNote,
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showModal({
						    title: '添加奖品成功',
						    content: '是否继续添加',
						    success: function (res) {
						        if (res.confirm) {
									_self.prizeName = ''									_self.prizePrice = ''
									_self.prizeNote = ''
						        } else if (res.cancel) {
						            uni.navigateBack({
						            	delta:1
						            })
						        }
						    }
						});
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			}
		}
	}
</script>

<style>

</style>
