<template>
	<view class="main">
		<view class="" style="background: #F5F5F5;" :style="'height:'+windowH+'px;'">
			<view class="w-100 border-top"></view>
			<view class="d-flex flex-column bg-white rounded-10 mt-2" style="">
				<uni-list-item title="修改店铺信息" @click="changeMerchant"></uni-list-item>
				<uni-list-item title="公告信息" @click="navigate('notice', false)"></uni-list-item>
				<uni-list-item title="员工管理" @click="navigate('employee', false)"></uni-list-item>
				<uni-list-item title="联系代理" @click="navigate('webview', true, 'status=1')"></uni-list-item>
				<!-- <uni-list-item title="设备连接" @click="navigate('bleConnect', false)"></uni-list-item> -->
				<divider></divider>
				<!-- <uni-list-item title="关于我们" @click="navigate('merchant', true, 'isChange=0')"></uni-list-item> -->
				<uni-list-item title="修改密码" @click="modifyPaaword"></uni-list-item>
				<uni-list-item title="更换手机号" @click="changeMobilephone"></uni-list-item>
				<!-- <uni-list-item title="版本号" @click="navigate('table-qrcode', false)"></uni-list-item> -->
			</view>
			
			<view class="d-flex a-center j-center mt-5">
				<view class="rounded-10 border btn-orange-white d-flex a-center j-center" style="height: 90rpx; width: 250rpx;"
				@click="loginOut">
					<text class="font-36 text-center font-weight">退出登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		data() {
			return {
				windowH:0
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.windowH = res.windowHeight
				}
			})
		},
		methods: {
			...mapMutations([
				'logout'
			]),
			navigate(path, m_bool, value){
				if (!path) return;
				if(m_bool){
					return uni.navigateTo({
						url: `/pages/${path}/${path}?`+value
					});
				}
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				});
			},
			changeMerchant(){
				uni.navigateTo({
					url:'../merchant/merchant-change'
				})
			},
			modifyPaaword(){
				uni.navigateTo({
					url:'./modify-password'
				})
			},
			changeMobilephone(){
				uni.navigateTo({
					url:'./change-mobilephone'
				})
			},
			loginOut(){
				var _self = this
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/safe/Logout',{},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.setStorageSync('m_token', '')
						uni.setStorageSync('em_token', '')
						_self.logout()
						uni.reLaunch({
							url:'../login/login'
						})
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
