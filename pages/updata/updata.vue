<template>
	<view>
	</view>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		data() {
			return {
				phoneModel:'windows'
			}
		},
		onLoad() {
			var _self = this
			// 获取系统信息
			uni.getSystemInfo({
				success(res) {
					console.log(res) //手机型号
					if(res.platform.indexOf("ios") != -1){
						console.log("ios")
						_self.phoneModel = "ios"
					}else if(res.platform.indexOf("android") != -1){
						console.log("android")
						_self.phoneModel = "android"
					}
				}
			});
			
			_self.init()
		},
		computed:{
			...mapState({
			})
		},
		methods: {
			...mapMutations([
			]),
			init(){
				// #ifdef APP-PLUS
				var _self = this
				_self.$H.post('/api/appConfig/HotUpdateConfig', {}).then(res=>{
					console.log(res)
					_self.checkVersion(res.data)
				})
				return
				// #endif
				this.nextTo()
			},
			checkVersion(data){
				var version = plus.runtime.version
				var nowversion = uni.getStorageSync('hotversion')
				if(nowversion){
					version = nowversion
				}
				var updateVersion = data.AndroidVersion
				var versionUrl = data.AndroidUrl
				if(this.phoneModel == 'ios'){
					updateVersion = data.IOSVersion
					versionUrl = data.IOSUrl
				}
				var currentVersions = version.split('.');
				var hotVersions = data.HotUpdateVersion.split('.');
				var versions = updateVersion.split('.');
				
				if(this.phoneModel == 'windows'){
					this.nextTo()
					return
				}
				
				if(versions[0] > currentVersions[0]){
					// 有大版本更新
					this.versionUpdate(versionUrl)
				}else if(hotVersions[1] > currentVersions[1] || hotVersions[2] > currentVersions[2]){
					// 有热更新
					this.hotUpdate(data.HotUpdateUrl, data.HotUpdateVersion)
				}else{
					this.nextTo()
				}
			},
			//热更新
			hotUpdate(m_url, m_version){
				uni.showLoading({title:'更新中...', mask:true})

				uni.downloadFile({
				    url: m_url,  
				    success: (downloadResult) => {  
						console.log(downloadResult)
						uni.hideLoading()
				        if (downloadResult.statusCode === 200) {  
				            plus.runtime.install(downloadResult.tempFilePath, {  
				                force: true  
				            }, function() {
								console.log('install success...');
								uni.setStorageSync('hotversion', m_version);
				                plus.runtime.restart();  
				            }, function(e) {  
				                console.error('install fail...');  
				            });  
				        }  
				    }  
				});
			},
			//版本更新
			versionUpdate(m_url){
				console.log(m_url)
				uni.showModal({
				    title: '更新提示',
				    content: '有新版本发布',
					showCancel: false,
				    success: function (res) {
				        if (res.confirm) {
				            plus.runtime.openURL(m_url);
				        }
				    }
				});
			},
			nextTo(){
				uni.redirectTo({
					url:"../login/login-choose"
				})
			}
		}
	}
</script>

<style>

</style>
