<template>
	<view class="">
		<view class="ml-2 font-22" style="color: #FF0000;">带*的为必填项</view>
		<view class="ml-2 d-flex flex-column">
			<view class="d-flex flex-column j-center">
				<view class="d-flex flex-row">
					<view class="font-30 font-weight">产品分类</view>
					<view class="font-24 ml-1" style="color: #FF0000;">*</view>
				</view>
				<view class="border" style="width: 200rpx;">
					<uni-combox :value="getTypeName" :candidates="getTypeNameList" placeholder="分类" @input="typeInput"></uni-combox>
				</view>
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="d-flex flex-row">
					<view class="font-30 font-weight">产品名称</view>
					<view class="font-24 ml-1" style="color: #FF0000;">*</view>
				</view>
				<input class="border font-30" style="width: 400rpx; border-radius: 10rpx;" type="text" :value="nameText"
				placeholder="请输入产品名称" maxlength="8" @input="nameInput"/>
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="d-flex flex-row">
					<view class="font-30 font-weight">产品价格</view>
					<view class="font-24 ml-1" style="color: #FF0000;">*</view>
				</view>
				<input class="border font-30" style="width: 400rpx; border-radius: 10rpx;" type="text" :value="priceText"
				placeholder="请输入产品价格" maxlength="8" @input="priceInput"/>
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="d-flex flex-row">
					<view class="font-30 font-weight">产品图片</view>
					<view class="font-24 ml-1" style="color: #FF0000;">*</view>
					<view class="ml-4 border font-28 pl-1 pr-1" @click="upload"
					style="background-color: #007AFF; color: #FFFFFF; border-radius: 10rpx;">上传图片</view>
				</view>
				<view class="border mt" style="width: 400rpx; height: 400rpx; border-radius: 10rpx;">
					<image :src="picUrl" mode="aspectFit" style="width: 400rpx; height: 400rpx;"></image>
				</view>
			</view>
		
			<view class="d-flex mt-2">
				<view class="border font-28 pl-1 pr-1"  @click="addGoodsSpec"
				style="border-radius: 10rpx; background-color: #007AFF; color: #FFFFFF;">{{specTitle}}</view>
			</view>
			<view class="d-flex flex-row flex-wrap a-center" style="width: 500rpx;">
				<view class="d-flex flex-row" v-for="(item1,index1) in SpecificationList" :key="index1">
					<block v-if="item1.Price">
						<view class="font-26">{{item1.Name}}</view>
						<view class="font-26" style="color: #FD6801;">￥{{item1.Price}}</view>
						<view class="font-26" v-if="index1 != SpecificationList.length - 1">,</view>
					</block>
				</view>
			</view>
			
			<view class="d-flex mt-2">
				<view class="border font-28 pl-1 pr-1"  @click="addGoodsTaste"
				style="border-radius: 10rpx; background-color: #007AFF; color: #FFFFFF;">{{tasteTitle}}</view>
			</view>
			<view class="d-flex flex-row flex-wrap a-center mt-1" style="width: 500rpx;">
				<view class="d-flex flex-row" v-for="(item1,index1) in TasteList" :key="index1">
					<view class="border pl-1 pr-1 font-26 ml mt">{{item1.Name}}</view>
				</view>
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="font-30 font-weight">产品编号</view>
				<input class="border font-30" style="width: 400rpx; border-radius: 10rpx;" type="text" :value="numberText"
				placeholder="请输入产品编号" maxlength="8" @input="numberInput"/>
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="font-30 font-weight">产品排序值</view>
				<input class="border font-30" style="width: 400rpx; border-radius: 10rpx;" type="text" :value="sortValueText"
				placeholder="请输入产品排序值" maxlength="8" @input="sortValueInput"/>
			</view>
			<view class="d-flex a-center font-20" style="color: #FF582B;">
				(说明：值越大显示在越前面)
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="font-30 font-weight">是否限购</view>
				<radio-group @change="checkboxIsLimitBuy">
					<label><radio value="shi" style="transform:scale(0.8)"/>是</label>
					<label><radio value="fou" checked="true" style="transform:scale(0.8)"/>否</label>
				</radio-group>
			</view>
			
			<view class="d-flex flex-column j-center mt-2" v-if="isShowStock">
				<view class="d-flex flex-row">
					<view class="font-30 font-weight">库存</view>
					<view class="font-24 ml-1" style="color: #FF0000;">*</view>
				</view>
				<input class="border font-30" style="width: 400rpx; border-radius: 10rpx;" type="text" :value="Stock"
				placeholder="请输入产品库存(大于0)" maxlength="5" @input="stockInput"/>
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="font-30 font-weight">是否展示</view>
				<radio-group @change="checkboxEnabled">
					<label><radio value="shi" checked="true" style="transform:scale(0.8)"/>是</label>
					<label><radio value="fou" style="transform:scale(0.8)"/>否</label>
				</radio-group>
			</view>
			
			<view class="d-flex flex-column j-center mt-2">
				<view class="font-30 font-weight">产品描述</view>
				<view class="border" style="width: 600rpx; border-radius: 10rpx;">
					<textarea class="ml-1 mt font-30" style="width: 580rpx;" type="text" :value="productDesText" 
					placeholder="产品描述"  @input="productDesInput"/>
				</view>
			</view>
			
			<view class="d-flex a-center j-center mt-2">
				<view class="border font-38 pl-1 pr-1"  @click="uploadInfo"
				style="border-radius: 10rpx; background-color: #007AFF; color: #FFFFFF;">{{btnName}}</view>
			</view>
			
			<view class="" style="height: 70rpx;"></view>
		</view>
		
		<specification-popup ref="specPopup"></specification-popup>
		<taste-popup ref="tastePopup"></taste-popup>
	</view>
</template>

<script>
	import specificationPopup from "@/components/popup/goods/specification.vue"
	import tastePopup from "@/components/popup/goods/taste.vue"
	import uniCombox from "@/components/uni-combox/uni-combox.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		components:{
			specificationPopup,
			tastePopup,
			uniCombox
		},
		data() {
			return {
				picUrl:null,
				tempPicList:'',
				productDesText: '',//不是必填
				numberText:null,//不是必填
				SpecificationList:null,//不是必填
				TasteList:null,//不是必填
				sortValueText:0,
				priceText:null,
				nameText:null,
				typeText:null,
				Enabled:1,
				IsLimitBuy:0,
				Stock:0,
				//默认名称
				ID:null,
				tasteTitle:'添加产品口味',
				specTitle:'添加产品规格',
				btnName:'提交新增',
				isChange:false
			}
		},
		onLoad: function (option) {
			if(option.ID){
				this.getItem(option.ID)
				this.ID = option.ID
				this.isChange = true
				//修改
				this.tasteTitle = '修改产品口味'
				this.specTitle = '修改产品规格'
				this.btnName = '确认修改'
			}
		},
		computed:{
			...mapState({
				goodsTypeList:state=>state.goods.goodsTypeList,
				goodsList:state=>state.goods.goodsList,
			}),
			...mapGetters([
			]),
			isShowStock(){
				if(this.IsLimitBuy == 1){
					return true
				}else if(this.IsLimitBuy == 0){
					return false
				}
			},
			getTypeNameList(){
				var tempList = []
				for (var i = 0; i < this.goodsTypeList.length; i++) {
					tempList.push(this.goodsTypeList[i].Name)
				}
				return tempList
			},
			getTypeName(){
				if(this.typeText){
					for (var i = 0; i < this.goodsTypeList.length; i++) {
						if(this.goodsTypeList[i].ID == this.typeText){
							return this.goodsTypeList[i].Name
						}
					}
				}else{
					return ''
				}
			}
		},
		methods: {
			...mapMutations([
				'updateGoodsTypeList',
				'pushUpdateGoodsTypeList',
				'updateGoodsList'
			]),
			...mapActions([
				'updateGoodsListFunc'
			]),
			getItem(id){
				for (var i = 0; i < this.goodsList.length; i++) {
					if(this.goodsList[i].ID == id){
						this.syncItemData(this.goodsList[i])
						return
					}
				}
			},
			syncItemData(item){
				this.picUrl = item.TitleImgUrl,
				this.productDesText = item.Description,
				this.numberText = item.Code,
				this.SpecificationList = item.SpecificationList,
				this.TasteList = item.TasteList,
				this.sortValueText = item.SortValue,
				this.priceText = item.Price,
				this.nameText = item.Name,
				this.typeText = item.ProductTypeID,
				this.Enabled = item.Enabled,
				this.IsLimitBuy = item.IsLimitBuy,
				this.Stock = item.Stock
			},
			upload : function(){
				var _self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						console.log(res)
						uni.uploadFile({
							url: _self.$H.common.baseUrl + '/api/Product/UploadImg',
							filePath: res.tempFilePaths[0],
							name: 'file',
							header:_self.$H.getHeader(),
							success: (uploadFileRes) => {
								var ress = JSON.parse(uploadFileRes.data)
								console.log(ress)
								if(ress.status == 0){
									_self.picUrl = res.tempFilePaths[0]
									_self.tempPicList = ress.data
								}else{
									uni.showToast({title:ress.message, icon: 'none', duration:1000})
								}
								
							}
						})
					},
					error : function(e){
						console.log(e);
					}
				});
			},
			productDesInput(e){
				this.productDesText = e.detail.value
			},
			sortValueInput(e){
				this.sortValueText = e.detail.value
			},
			numberInput(e){
				this.numberText = e.detail.value
			},
			priceInput(e){
				this.priceText = e.detail.value
			},
			nameInput(e){
				this.nameText = e.detail.value
			},
			typeInput(e){
				for (var i = 0; i < this.goodsTypeList.length; i++) {
					let temp = this.goodsTypeList[i]
					if(temp.Name == e){
						this.typeText = temp.ID
						console.log(this.typeText)
						return
					}
				}
				this.typeText = null
			},
			stockInput(e){
				this.Stock = e.detail.value
			},
			syncSpecInput(list){
				this.SpecificationList = list
			},
			syncTasteInput(list){
				this.TasteList = list
			},
			checkboxIsLimitBuy:function(e){
				var	value = e.target.value
				if(value == 'shi'){
					this.IsLimitBuy = 1
				}else{
					this.IsLimitBuy = 0
				}
			},
			checkboxEnabled:function(e){
				var	value = e.target.value
				if(value == 'shi'){
					this.Enabled = 1
				}else{
					this.Enabled = 0
				}
			},
			addGoodsTaste(){
				this.$refs.tastePopup.showPopup(this.TasteList, this.syncTasteInput)
			},
			addGoodsSpec(){
				this.$refs.specPopup.showPopup(this.SpecificationList, this.syncSpecInput)
			},
			uploadInfo(){
				var _self = this;
				var tempStr = ''
				
				if(!_self.typeText){
					tempStr = '请选择产品类别'
				}
				if(!_self.nameText){
					tempStr = '请输入产品名称'
				}
				if(!_self.priceText){
					tempStr = '请输入产品价格'
				}
				if(_self.tempPicList == '' && !this.isChange){
					tempStr = '请上传产品图片'
				}
				if(_self.IsLimitBuy == 1 && _self.Stock <= 0){
					tempStr = '请输入正确的库存'
				}
				if(tempStr){
					uni.showToast({
						title:tempStr, 
						icon: 'none',
						duration:1000
					})
					return
				}
				
				var postObj = {
					ProductTypeID:_self.typeText,
					Name:_self.nameText,
					Price:_self.priceText,
					SortValue:_self.sortValueText,
					Enabled:_self.Enabled,
					Stock:_self.Stock,
					IsLimitBuy:_self.IsLimitBuy
				}
				if(!_self.tempPicList){
					postObj.TitleImgUrl = _self.picUrl
					postObj.TempImgPath = ''
				}else{
					postObj.TempImgPath = _self.tempPicList.TempImgPath
					postObj.TitleImgUrl = _self.tempPicList.TitleImgUrl
					postObj.MinTitleImgUrl = _self.tempPicList.MinTitleImgUrl
				}
				if(_self.productDesText){
					postObj.Description = _self.productDesText
				}
				if(_self.numberText){
					postObj.Code = _self.numberText
				}
				if(_self.SpecificationList){
					postObj.SpecificationList = _self.SpecificationList
				}
				if(_self.TasteList){
					postObj.TasteList = _self.TasteList
				}
				if(_self.ID){
					postObj.ID = _self.ID
				}
				uni.showLoading({title:'上传信息中...'})
				
				var urlStr = '/api/Product/Add'
				if(_self.isChange){
					urlStr = '/api/Product/Update'
				}
				console.log(JSON.stringify(postObj))
				_self.$H.post(urlStr,{
					data:JSON.stringify(postObj)
				},{
					token:true
				}).then(res=>{
					uni.hideLoading()
					if(res.status == 0){
						console.log(res)
						var tempList = _self.goodsList
						if(_self.isChange){
							for (var i = 0; i < tempList.length; i++) {
								if(tempList[i].ID == res.data.ID){
									tempList.splice(i, 1, res.data);
									break;
								}
							}
							uni.showToast({ title:res.message,  icon: 'none', duration:res.messageShowTime})
						}else{
							tempList.unshift(res.data)
							uni.navigateBack({
								delta: 1
							})
						}
					}else{
						uni.showToast({ title:res.message,  icon: 'none', duration:res.messageShowTime})
					}
				})
			}
		}
	}
</script>

<style>

</style>
