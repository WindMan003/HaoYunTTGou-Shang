<template>
	<view class="main">
		<view class="w-100 d-flex flex-column ml-4">
			<view class="d-flex flex-column mt-3">
				<view class="font-30 font-weight">
					是否开启在线支付
				</view>
				<radio-group @change="openPayChange">
					<label><radio value="shi" :checked="isOpenPay" style="transform:scale(0.8)"/>是</label>
					<label class="ml-3"><radio value="fou" :checked="!isOpenPay" style="transform:scale(0.8)"/>否</label>
				</radio-group>
			</view>
			
			<view class="d-flex flex-column mt-3" v-if="isShowMustPay">
				<view class="font-30 font-weight">
					是否需要预先支付
				</view>
				<radio-group @change="mustPayChange">
					<label><radio value="shi" :checked="isMustPay" style="transform:scale(0.8)"/>是</label>
					<label class="ml-3"><radio value="fou" :checked="!isMustPay" style="transform:scale(0.8)"/>否</label>
				</radio-group>
			</view>
			
			<view class="d-flex flex-column j-center mt-3">
				<view class="font-30 font-weight">
					是否开启多人共同点餐
				</view>
				<radio-group @change="multiplayerBuyChange">
					<label><radio value="shi" :checked="isMultiplayerBuy" style="transform:scale(0.8)"/>是</label>
					<label class="ml-3"><radio value="fou" :checked="!isMultiplayerBuy" style="transform:scale(0.8)"/>否</label>
				</radio-group>
			</view>
			
			<view class="d-flex flex-column mt-3">
				<view class="font-30 font-weight">
					是否关闭订单提交
				</view>
				<radio-group @change="isCloseOrderFunc">
					<label><radio value="shi" :checked="isCloseOrder" style="transform:scale(0.8)"/>是</label>
					<label class="ml-3"><radio value="fou" :checked="!isCloseOrder" style="transform:scale(0.8)"/>否</label>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isOpenPay:true,
				isMustPay:true,
				isMultiplayerBuy:true,
				isCloseOrder: false,
				message:''
			}
		},
		onLoad() {
			this.__init()
		},
		computed:{
			isShowMustPay(){
				return this.isOpenPay
			}
		},
		methods: {
			__init(){
				var _self = this
				_self.$H.post('/api/Merchant/GetSwitchConfig',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.updateData(res.data)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			updateData(list){
				if(list.OpenPay == 0){
					this.isOpenPay = false
				}
				if(list.IsMustPayFirst == 0){
					this.isMustPay = false
				}
				if(list.OpenMultiplayerBuy == 0){
					this.isMultiplayerBuy = false
				}
			},
			openPayChange(e){
				var	value = e.target.value
				var action = '/api/Merchant/OpenPay'
				var num = 0
				if(this.isMustPay){
					num = 1
				}
				if(value == 'shi'){
					this.message = '在线支付已打开'
					this.request(action, 1, num)
				}else{
					this.message = '在线支付已关闭'
					this.request(action, 0, num)
				}
			},
			mustPayChange(e){
				var	value = e.target.value
				var action = '/api/Merchant/OpenPay'
				if(value == 'shi'){
					this.message = '预先支付已打开'
					this.request(action, 1, 1)
				}else{
					this.message = '预先支付已关闭'
					this.request(action, 1, 0)
				}
			},
			request(action, value1, value2){
				var _self = this
				_self.$H.post(action,{
					val:value1,
					IsMustPayFirst:value2
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(value1 == 1){
							this.isOpenPay = true
						}else{
							this.isOpenPay = false
						}
						if(value2 == 1){
							this.isMustPay = true
						}else{
							this.isMustPay = false
						}
						uni.showToast({title:_self.message, icon:'none', duration:1500})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			multiplayerBuyChange(e){
				var _self = this
				var	value = e.target.value
				var action = '/api/Merchant/OpenMultiplayerBuy'
				var num = 0
				if(value == 'shi'){
					num = 1
				}
				_self.$H.post(action,{
					val:num
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(num == 1){
							_self.message = '多人共同点餐已打开'
							_self.isMultiplayerBuy = true
						}else{
							_self.message = '多人共同点餐已关闭'
							_self.isMultiplayerBuy = false
						}
						uni.showToast({title:_self.message, icon:'none', duration:1500})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1500})
					}
				})
			},
			isCloseOrderFunc(e){
				var _self = this
				var	value = e.target.value
				var action = '/api/Merchant/CloseOrderSubmit'
				var num = 0
				if(value == 'shi'){
					num = 1
				}
				_self.$H.post(action, {
					val:num
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(num == 1){
							_self.isCloseOrder = true
						}else{
							_self.isCloseOrder = false
						}
						uni.showToast({title:res.message, icon:'none', duration:res.messageShowTime})
					}else{
						uni.showToast({title:res.message, icon:'none', duration:res.messageShowTime})
					}
				})
			},
		}
	}
</script>

<style>

</style>
