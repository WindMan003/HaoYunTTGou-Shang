<template>
	<view class="main">
		<scroll-view scroll-y :style="'height:'+(totalH)+'px;'">
			<view class="ml-2 d-flex flex-column w-100">
				<view class="d-flex flex-row mt-2">
					<view class="font-30 font-weight">店铺所属行业：</view>
					<view class="border" style="width: 400rpx;">
						<uni-combox :value="getServiceTypeName" :candidates="getServiceTypeNameList"
						@input="serviceTypeInput"></uni-combox>
					</view>
				</view>
				
				<view class="d-flex flex-row mt-2">
					<view class="font-30 font-weight">店铺类别：</view>
					<view class="border" style="width: 400rpx;">
						<uni-combox :value="getMerchantTypeName" :candidates="getMerchantTypeNameList"
						@input="merchantTypeInput"></uni-combox>
					</view>
				</view>
				
				<view class="d-flex flex-row mt-2">
					<view class="font-30 font-weight">店铺名称：</view>
					<view class="">
						<input class="font-30 border rounded-10" style="width: 400rpx;" type="text" :value="infoList.Name"
						placeholder="请输入店铺名称" maxlength="20" @input="nameInput"/>
					</view>
				</view>
				
				<view class="d-flex flex-column mt-2">
					<view class="font-30 font-weight">联系方式：</view>
					<view class="border rounded-10" style="width: 550rpx; height: 240rpx;">
						<textarea class="font-30 p" style="width: 540rpx;" :value="infoList.Contact" 
						placeholder="请输入联系方式" @blur="contactInput"/>
					</view>
				</view>
				
				<view class="d-flex flex-column mt-2">
					<view class="font-30 font-weight">店铺地址：</view>
					<view class="border rounded-10" style="width: 550rpx; height: 160rpx;">
						<textarea class="font-30 p" style="width: 540rpx;" :value="infoList.Address" 
						placeholder="请输入店铺地址" @blur="addressInput"/>
					</view>
				</view>
				
				<view class="d-flex flex-column mt-2">
					<view class="font-30 font-weight">店铺介绍：</view>
					<view class="border rounded-10" style="width: 550rpx; height: 400rpx;">
						<textarea class="font-30 p" style="width: 540rpx; height: 400rpx;" :value="infoList.Description" 
						placeholder="请输入店铺介绍" @blur="descriptionInput"/>
					</view>
				</view>
				
				<!-- <view class="d-flex flex-column mt-2">
					<view class="font-30 font-weight mt-2">我的店铺二维码：</view>
					<view class="mt rounded-10" style="width: 400rpx; height: 400rpx;">
						<image :src="codeUrl" mode="widthFix" style="width: 400rpx;"></image>
					</view>
				</view> -->
				
				<view class="d-flex flex-row mt-2">
					<view class="font-30 font-weight">门面图片:</view>
					<view class="ml-4 border font-28 pl-1 pr-1 btn-blue-white" @click="uploadFaceImg" style="border-radius: 10rpx;">上传门面图片</view>
				</view>
				<view class="mt-1" style="width: 94%;">
					<image class="rounded-10" :src="uploadPicUrl" mode="widthFix"></image>
				</view>
				
				<view class="d-flex flex-row mt-2">
					<view class="font-30 font-weight">更多图片:</view>
					<view class="ml-4 border font-28 pl-1 pr-1 btn-blue-white rounded-10" @click="uploadMoreImg">上传更多图片</view>
				</view>
				<view class="mt-1" style="width: 94%;">
					<view class="position-relative" v-for="(item, index) in moreImgList" :key="index">
						<image class="mt-1 rounded-10" :src="item" mode="widthFix"/>
						<view class="font-24 position-absolute text-center pl-1 pr-1 rounded-10 btn-red-white" @click="deleteMoreImg(index)"
						style="right: 0rpx; top: 0rpx;">
							删除
						</view>
					</view>
				</view>
				
				<view class="d-flex a-center j-center mt-4">
					<view class="border d-flex a-center ml-3 j-center btn-orange-white" style="width: 200rpx; height: 80rpx;"
					@click="saveChange">
						<text class="font-38 font-weight">保存修改</text>
					</view>
				</view>
				
				<view class="" style="height: 100rpx;"></view>
			</view>
		</scroll-view>
	</view>
</template>
	
<script>
	import uniCombox from "@/components/uni-combox/uni-combox.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			uniCombox
		},
		data() {
			return {
				totalH:0,
				infoList:'',
				codeUrl:'',
				uploadPicUrl:'',
				nameText:'',
				serviceType:'',
				servieTypeList:'',
				merchantType:'',
				merchantTypeList:'',
				contactText:'',
				addressText:'',
				descriptionText:'',
				moreImgList:''
			}
		},
		onLoad(){
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			
			this.init()
		},
		computed:{
			...mapState({
			}),
			...mapGetters([
			]),
			getServiceTypeName(){
				if(this.servieTypeList != ''){
					var temp = this.servieTypeList
					for (var i = 0; i < temp.length; i++) {
						if(temp[i].Value == this.serviceType){
							return temp[i].Text
						}
					}
				}else{
					return '请选择'
				}
			},
			getServiceTypeNameList(){
				var temp = []
				if(this.servieTypeList != ''){
					var templist = this.servieTypeList
					for (var i = 0; i < templist.length; i++) {
						temp.push(templist[i].Text)
					}
				}
				return temp
			},
			getMerchantTypeName(){
				if(this.merchantTypeList != ''){
					var temp = this.merchantTypeList
					for (var i = 0; i < temp.length; i++) {
						if(temp[i].Value == this.merchantType){
							return temp[i].Text
						}
					}
				}else{
					return '请选择'
				}
			},
			getMerchantTypeNameList(){
				var temp = []
				if(this.merchantTypeList != ''){
					var templist = this.merchantTypeList
					for (var i = 0; i < templist.length; i++) {
						temp.push(templist[i].Text)
					}
				}
				return temp
			}
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
			]),
			init(){
				var _self = this;
				_self.$H.post('/api/merchant/QRCode',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.codeUrl = res.data
						_self.getMerchantInfo()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			getMerchantInfo(){
				var _self = this;
				_self.$H.post('/api/merchant/Intro',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.syncMerchantInfo(res.data)
						_self.getServieTypeList()
						_self.getMerchantTypeList(_self.serviceType)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			syncMerchantInfo(data){
				this.infoList = data
				this.uploadPicUrl = data.FaceUrl
				this.moreImgList = data.ImgList
				this.nameText = data.Name
				this.serviceType = data.ServiceType
				this.merchantType = data.MerchantTypeID
				this.descriptionText = data.Description
				this.contactText = data.Contact
				this.addressText = data.Address
			},
			getServieTypeList(){
				var _self = this;
				_self.$H.post('/api/merchant/ServieType',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.servieTypeList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			getMerchantTypeList(ServieType){
				var _self = this;
				var infoList  = {}
				if(ServieType){
					infoList.ServieType = ServieType
				}
				_self.$H.post('/api/merchant/MerchantType',infoList,{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.merchantTypeList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			nameInput(e){
				this.nameText = e.detail.value
			},
			serviceTypeInput(e){
				var temp = this.servieTypeList
				for (var i = 0; i < temp.length; i++) {
					let tempName = temp[i].Text
					if(tempName == e && this.serviceType != temp[i].Value){
						this.serviceType = temp[i].Value
						console.log(this.serviceType)
						this.merchantType = 0
						this.getMerchantTypeList(this.serviceType)
						return
					}
				}
			},
			merchantTypeInput(e){
				var temp = this.merchantTypeList
				for (var i = 0; i < temp.length; i++) {
					let tempName = temp[i].Text
					if(tempName == e){
						this.merchantType = temp[i].Value
						console.log(this.merchantType)
						return
					}
				}
			},
			contactInput(e){
				this.contactText = e.detail.value
			},
			addressInput(e){
				this.addressText = e.detail.value
			},
			descriptionInput(e){
				this.descriptionText = e.detail.value
			},
			
			uploadFaceImg : function(){
				var _self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						console.log(res)
						uni.uploadFile({
							url: _self.$H.common.baseUrl + '/api/merchant/UploadFaceImg',
							filePath: res.tempFilePaths[0],
							name: 'file',
							header:_self.$H.getHeader(),
							success: (uploadFileRes) => {
								var ress = JSON.parse(uploadFileRes.data)
								console.log(ress)
								if(ress.status == 0){
									_self.uploadPicUrl = ress.data
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
			uploadMoreImg : function(){
				var _self = this;
				uni.chooseImage({
					// count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: function (res) {
						console.log(res)
						for (var i = 0; i < res.tempFilePaths.length; i++) {
							uni.uploadFile({
								url: _self.$H.common.baseUrl + '/api/merchant/UploadMoreImg',
								filePath: res.tempFilePaths[i],
								name: 'file',
								header:_self.$H.getHeader(),
								success: (uploadFileRes) => {
									var ress = JSON.parse(uploadFileRes.data)
									console.log(ress)
									if(ress.status == 0){
										var temp = ress.data
										for (var i = 0; i < temp.length; i++) {
											_self.moreImgList.push(temp[i])
										}
									}else{
										uni.showToast({title:ress.message, icon: 'none', duration:1000})
									}
									
								}
							})
						}
					},
					error : function(e){
						console.log(e);
					}
				});
			},
			// uploadPic(base64, value){
			// 	var _self = this;
			// 	uni.showLoading({title:'上传图片中...'})
			// 	var uploadUrl = ''
			// 	if(value == 'face'){
			// 		uploadUrl = '/api/merchant/UploadFaceImg'
			// 	}else if(value == 'more'){
			// 		uploadUrl = '/api/merchant/UploadMoreImg'
			// 	}
			// 	_self.$H.post(uploadUrl,{
			// 		base64:base64
			// 	},{
			// 		token:true
			// 	}).then(res=>{
			// 		console.log(res)
			// 		uni.hideLoading()
			// 		if(res.status == 0){
			// 			if(value == 'face'){
			// 				_self.uploadPicUrl = base64
			// 			}else if(value == 'more'){
			// 				_self.moreImgList.push(res.data)
			// 			}
			// 		}else{
			// 			uni.showToast({title:res.message, icon: 'none', duration:1000})
			// 		}
			// 	})
			// },
			// urlTobase64(url, callback, value){
			// 	uni.request({
			// 		url: url,
			// 		method:'GET',
			// 		responseType: 'arraybuffer',
			// 		success: ress => {
			// 			let base64 = wx.arrayBufferToBase64(ress.data); //把arraybuffer转成base64 
			// 			base64 = 'data:image/jpeg;base64,' + base64 //不加上这串字符，在页面无法显示的哦
			// 			callback(base64, value)
			// 		}
			// 	})
			// },
			deleteMoreImg(id){
				var _that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除图片',
				    success: function (res) {
				        if (res.confirm) {
				            _that.deleteMoreImgSure(id)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			deleteMoreImgSure(id){
				var _self = this;
				var deleteUrl = _self.moreImgList[id]
				console.log(deleteUrl)
				_self.$H.post('/api/merchant/DelImg',{
					imgPath:deleteUrl
				},{
					token:true
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.moreImgList.splice(id, 1)
					}else{
						uni.showToast({title:res.message, icon: 'none', duration:1000})
					}
				})
			},
			saveChange(){
				var _self = this;
				_self.$H.post('/api/merchant/SaveIntro',{
					ServiceType:_self.serviceType,
					MerchantTypeID:_self.merchantType,
					Name:_self.nameText,
					Contact:_self.contactText,
					Address:_self.addressText,
					Description:_self.descriptionText
				},{
					token:true
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.showToast({title:'保存店铺信息成功', icon: 'none', duration:1500})
					}else{
						uni.showToast({title:res.message, icon: 'none', duration:1000})
					}
				})
			}
		}
	}
</script>

<style>

</style>
