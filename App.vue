<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS  
			const _self = this;  
			const _handlePush = function(message) {  
				// TODO
				let status = this.$store.state.user.loginStatus
				if(status){
					uni.switchTab({
					    url: '/pages/index/index'
					})
				}else{
					uni.navigateTo({
					    url: '/pages/login/login-choose'
					})
				}

			}
			plus.push.addEventListener('click', _handlePush);  
			plus.push.addEventListener('receive', _handlePush);  

			const clientInfo = plus.push.getClientInfo()
			console.log(clientInfo)
			console.log(plus.device)
			this.$store.commit('initClientid', clientInfo.clientid)
			this.$store.commit('initUuid', plus.device.uuid)
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 公共样式 */
	@import "/common/common.css";
	/* UI基础库 */
	@import "/common/zcm-main.css";
</style>
