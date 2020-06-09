<template>
	<uni-popup type="bottom" ref="popup" @change="change" className="uni-popup__wrapper-box">
		<view class="d-flex flex-column w-100 bg-white" style="height: 600rpx;">
			<view class="d-flex flex-row a-center" style="background-color: #F5F5F5; height: 60rpx;">
				<view class="d-flex a-center j-center" style="width: 10%;" @tap="close">
					<image src="@/static/take/close.png" mode="widthFix" style="width: 40rpx; height: 40rpx;"></image>
				</view>
				<view class="d-flex a-center j-center" style="width: 80%;">
					<view class="font-32" style="color: #333333;">请选择</view>
				</view>
			</view>
			
			<scroll-view scroll-y style="height: 540rpx;">
				<block v-for="(item, index) in takeAccountList" :key="index">
					<view class="border-bottom d-flex flex-row a-center pt-1 pb-1" @click="switchAccount(index)">
						<view class="d-flex a-center j-center" style="width: 15%;">
							<image :src="getIconUrl(item)" mode="widthFix" style="width: 50rpx; height: 50rpx;"></image>
						</view>
						<view class="d-flex flex-column" style="width: 70%;">
							<view class="font-30">{{item.Name}}</view>
							<view class="font-28">{{item.Account}}</view>
						</view>
						<view class="d-flex a-center j-center" style="width: 15%;" v-if="item.ID == accountID">
							<image src="../../../static/take/selected.png" mode="widthFix" style="width: 50rpx; height: 50rpx;"></image>
						</view>
					</view>
				</block>
				<view class="border-bottom d-flex flex-row a-center" style="height: 100rpx;" @click="newaddAccount">
					<view class="d-flex a-center j-center" style="width: 15%;">
						<image src="@/static/take/add.png" mode="widthFix" style="width: 50rpx; height: 50rpx;"></image>
					</view>
					<view class="d-flex a-center font-36" style="width: 85%;">
						添加提现账户
					</view>
				</view>
				<view style="height: 300rpx;"></view>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	
	export default{
		data() {
			return {
				accountID:''
			}
		},
		computed:{
			...mapState({
				takeAccountList:state=>state.user.takeAccountList
			})
		},
		onLoad() {
		},
		methods:{
			showPopup(id){
				this.accountID = id
				this.$refs.popup.open()
			},
			change(e){
				if(!e.show){
					
				}
			},
			close(){
				this.$refs.popup.onTap()
			},
			getIconUrl(item){
				if(item.TypeName == '支付宝'){
					return '../../../static/take/alipay.png'
				}
			},
			getName(name){
				if(name){
					var mname = name.substring(0, 1)
					for (var i = 0; i < name.length; i++) {
						if(i > 0){
							mname = mname + '*'
						}
					}
					return mname
				}
			},
			passwordInput(e){
				this.password = e.detail.value
			},
			switchAccount(index){
				this.$emit('complete', index)
				this.$refs.popup.onTap()
			},
			newaddAccount(){
				uni.navigateTo({
					url:'../take/take-bindAccount'
				})
			}
		}
	}
</script>

<style>

</style>
