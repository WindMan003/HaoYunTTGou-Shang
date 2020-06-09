<template>
	<view class="w-100">
		<view class="d-flex flex-row a-center" style="height: 80rpx;">
			<view class="font-30 font-weight ml-3">桌子号：</view>
			<input class="font-30 border ml" style="width: 200rpx;" type="text" :value="tableIDText"
			placeholder="请输入桌子号" maxlength="20" @blur="tableIDInput"/>
			<view class="border font-26 ml pl-2 pr-2 btn-blue-white" @click="createQRCode">生成</view>
		</view>
		
		<view class="d-flex flex-row a-center border-bottom position-relative" style="height: 80rpx;">
			<view class="font-30 font-weight ml-3">已选:{{getSelectQRCodeCount}}</view>
			<view class="border font-26 ml-4 pl-2 pr-2 btn-blue-white" @click="saveToPhotoAlbum">批量保存到相册</view>
			<view class="border font-26 pl-2 pr-2 btn-blue-white position-absolute" @click="selectAll" style="right: 40rpx;">全选</view>
		</view>
		
		<scroll-view scroll-y :style="'height:'+(totalH - 80)+'px;'">
			<view class="mt-3 ml-2">
				<checkbox-group @change="checkboxChange">
					<view class="d-flex flex-row flex-wrap">
						<view class="d-flex flex-column mt-2 ml-2" v-for="(item, index) in qrCodeList" :key="index">
							<view class="d-flex flex-row a-center" style="width: 320rpx;">
								<view class="d-flex j-center" style="width: 100rpx;">
									<checkbox :value="item.BgQRCodePath" :checked="selected" style="transform:scale(0.9)"/>
								</view>
								<view class="border text-center d-flex j-center" style="width: 120rpx;">
									<input class="font-30" type="text" :id="item.ID" :value="item.TableNumber" maxlength="20" @blur="tableIDChangeInput"/>
								</view>
								<view class="d-flex j-center" style="width: 100rpx;">
									<view class="font-24 text-center pl-1 pr-1 btn-red-white rounded-10" @click="deleteQRImg(index)">删除</view>
								</view>
							</view>
							<image class="p-0" show-menu-by-longpress="true" :src="item.BgQRCodePath" mode="aspectFit" lazy-load="true"
							style="width: 320rpx; height: 300rpx;" @click="previewImage(index)"></image>
						</view>
					</view>
				</checkbox-group>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		components:{
		
		},
		data() {
			return {
				totalH:0,
				qrCodeList:'',
				tableIDText:'',
				selectQRCodeList:[],
				selected:false,
				saving: false
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			
			this.__init()
		},
		computed:{
			getFilePaths(){
				var temp = this.qrCodeList
				var tempFilePaths = []
				for (var i = 0; i < temp.length; i++) {
					tempFilePaths.push(temp[i].BgQRCodePath)
				}
				return tempFilePaths
			},
			getSelectQRCodeCount(){
				return this.selectQRCodeList.length
			}
		},
		methods: {
			__init(){
				var _self = this;
				_self.$H.post('/api/TableQRCode/List',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.qrCodeList = res.data
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			tableIDInput(e){
				this.tableIDText = e.detail.value
			},
			createQRCode(){
				var _self = this;
				_self.$H.post('/api/TableQRCode/Add',{
					TableNumber:_self.tableIDText
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.qrCodeList.push(res.data)
						this.tableIDText = ''
						uni.showToast({title: '生成二维码成功', icon:'none', duration:1500})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			deleteQRImg(index){
				var _that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定删除图片',
				    success: function (res) {
				        if (res.confirm) {
				            _that.deleteQRImgSure(index)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			deleteQRImgSure(index){
				var _self = this;
				_self.$H.post('/api/TableQRCode/Del',{
					ID:_self.qrCodeList[index].ID
				},{
					token:true
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.qrCodeList.splice(index, 1)
					}else{
						uni.showToast({title:res.message, icon: 'none', duration:1000})
					}
				})
			},
			previewImage(index){
				var tempFilePaths = this.getFilePaths
				uni.previewImage({
					current:index,
					urls:tempFilePaths
				})
			},
			tableIDChangeInput(e){
				var temp =  this.qrCodeList
				var index = ''
				for (var i = 0; i < temp.length; i++) {
					if(e.target.id == temp[i].ID && e.detail.value == temp[i].TableNumber){
						return
					}else if(e.target.id == temp[i].ID && e.detail.value != temp[i].TableNumber){
						index = i
					}
				}
				var _that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定把桌号改为'+e.detail.value,
				    success: function (res) {
				        if (res.confirm) {
				            _that.changeTableID(e.detail.value, e.target.id, index)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			changeTableID(value, id, index){
				var _self = this;
				_self.$H.post('/api/TableQRCode/Update',{
					TableNumber:value,
					ID:id
				},{
					token:true
				}).then(res=>{
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						_self.qrCodeList.splice(index, 1, res.data)
					}else{
						uni.showToast({title:res.message, icon: 'none', duration:1000})
					}
				})
			},
			checkboxChange(e){
				this.selectQRCodeList = e.detail.value
			},
			saveToPhotoAlbum(){
				var _self = this
				var temp = _self.selectQRCodeList
				var tempCount = 0
				if(!_self.saving && temp.length > 0){
					_self.saving = true
					uni.showLoading({
						title: '保存中...'
					})
					console.log(_self.selectQRCodeList)
					for (var i = 0; i < temp.length; i++) {
						uni.downloadFile({
							url: temp[i],
							success: (res) =>{
								if (res.statusCode == 200){
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: function() {
											console.log('save success');
											tempCount = tempCount + 1
											if(tempCount == temp.length){
												_self.saving = false
												uni.hideLoading()
												uni.showModal({
													title: '提示',
													content: '图片已经全部保存成功'
												});
											}
										},
										fail: function() {
											_self.saving = false
											uni.hideLoading()
											uni.showToast({
												title: "保存失败，请稍后重试",
												icon: "none"
											});
										}
									});
								}
							},
							fail: function() {
								_self.saving = false
								uni.hideLoading()
							}
						})
					}
				}
			},
			selectAll(){
				this.selected = !this.selected
				if(this.selected){
					for (var i = 0; i < this.qrCodeList.length; i++) {
						this.selectQRCodeList.push(this.qrCodeList[i].BgQRCodePath)
					}
				}else{
					this.selectQRCodeList = []
				}
			}
		}
	}
</script>

<style>

</style>
