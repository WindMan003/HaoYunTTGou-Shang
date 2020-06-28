<template>
	<view class="main">
		<view class="w-100 border-bottom position-relative" style="height: 80rpx;">
			<view class="d-flex flex-row">
				<view class="d-flex flex-row a-center j-center font-32"
				style="width: 120rpx; height: 80rpx;"
				v-for="(item,index) in categoryList" :key="index" @click="changeTab(index)">
					<text :class="tabIndex === index ? 'border-bottom-6 border-bottom-orange font-weight':'text-Grey'">
						{{item.name}}
					</text>
				</view>
			</view>
		</view>
		<swiper :duration="150" :current="tabIndex" :style="'height:'+swiperH+'px;'" @change="onChangeTab">
			<swiper-item>
				<category-info :totalH="swiperH"></category-info>
			</swiper-item>
			<swiper-item>
				<product-info :totalH="swiperH"></product-info>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import categoryInfo from "@/components/index/category-info.vue"
	import productInfo from "@/components/index/product-info.vue"
	
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default {
		components:{
			categoryInfo,
			productInfo
		},
		data() {
			return {
				osplatform: '',
				swiperH: 0,
				tabIndex: 0,
				categoryList: [
					{name:'类别'},
					{name:'产品'}
				]
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.swiperH = res.windowHeight - uni.upx2px(82)
					this.osplatform = res.platform
				}
			})
			//加载数据
			this.init()
		},
		computed:{
			...mapState({
				goodsTypeList:state=>state.goods.goodsTypeList,
				goodsList:state=>state.goods.goodsList,
				signkey:state=>state.user.signkey
			}),
			...mapGetters([
			]),
		},
		methods: {
			...mapMutations([
				'updateGoodsTypeList',
				'updateGoodsList',
				'initMerchantConfig',
				'initMerchantInfo',
				'initIOSshenhe'
			]),
			...mapActions([
			]),
			init(){
				var _self = this;
				_self.$H.post('/api/ProductType/list',{
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.updateGoodsTypeList(res.data)
						_self.initGoodsInfo()
					}
				})
			},
			initGoodsInfo(){
				var _self = this;
				_self.$H.post('/api/Product/list',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.updateGoodsList(res.data)
						_self.getMerchantInfo()
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
						_self.initMerchantInfo(res.data)
						_self.getConfigData()
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			//获取配置信息
			getConfigData(){
				var _self = this
				var m_math = Math.ceil(Math.random()*10);
				var keyObj = {'hotupdata':m_math}
				var keyData = this.$Common.sort_ascii(keyObj, this.signkey)
				_self.$H.post('/api/config/GetAppConfig',{
					hotupdata:m_math,
					sign:keyData
				},{
					token:true,
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.initMerchantConfig(res.data)
						// #ifdef APP-PLUS 
						let version = plus.runtime.version
						console.log(version)
						if(res.data.iosShenhe == version && _self.osplatform == 'ios'){
							_self.initIOSshenhe(true)
						}else{
							_self.initIOSshenhe(false)
						}
						// #endif
					}
				})
			},
			changeTab(index){
				this.tabIndex = index
			},
			onChangeTab(e){
				this.changeTab(e.detail.current)
			},
			connectWebsocket(){
				console.log(this.merchantID)
				console.log(this.cartId)
				console.log(this.token)
				//socket连接
				websocket.initWebSocket(this.syncCartList, 
				JSON.stringify({action:'startOrder', merchantID:this.merchantID, cartID:this.cartId, token:this.token}),
				this.appConfig.WebSocketUrl)
			},
			
		}
	}
</script>

<style>

</style>
