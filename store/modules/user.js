export default {
	state:{
		userinfo:false,
		token:false,
		loginStatus:false,
		sessionID:false,
		merchantSite:'',
		webSocketUrl: '',
		mobilephone: '',
		clientid:'45dsa-asjda-44add-askda',
		uuid:'45dsa-asjda-332ww-askda',
		takeAccountList:'',
		merchantAmount:0.00,
		signkey:'14daa8b8e2158349222dfe84a377733f',
		merchantInfo: '',
		isIOSshenhe: false,
		
		webview: []
	},
	mutations:{
		// 初始化数据
		initUser(state){
			let userinfo = uni.getStorageSync('userinfo')
			if (userinfo) {
				userinfo = JSON.parse(userinfo)
				
				state.userinfo = userinfo
				state.token = userinfo.token
				state.loginStatus = true
			}
		},
		// 登录
		login(state, userinfo){
			state.userinfo = userinfo
			state.token = userinfo.token
			state.sessionID = userinfo.sessionID
			state.mobilephone = userinfo.mobilephone
			state.loginStatus = true
			uni.setStorageSync('userinfo',JSON.stringify(userinfo))
		},
		// 退出
		logout(state){
			state.token = false
			state.userinfo = false
			state.loginStatus = false
			state.sessionID = false
			uni.removeStorageSync('userinfo')
		},
		
		initMerchantConfig(state, m_item){
			if(m_item){
				state.merchantSite = m_item.MerchantWebSite
				state.webSocketUrl = m_item.WebSocketUrl
			}
		},
		// 获取clientid
		initClientid(state, clientid){
			if(clientid){
				state.clientid = clientid
			}
		},
		// 获取uuid
		initUuid(state, uuid){
			if(uuid){
				state.uuid = uuid
			}
		},
		initTakeAccountList(state, list){
			if(list){
				state.takeAccountList = list
			}
		},
		initMerchantAmount(state, amount){
			if(amount){
				state.merchantAmount = amount
			}
		},
		initMerchantInfo(state, merchantInfo){
			state.merchantInfo = merchantInfo
		},
		initIOSshenhe(state, isIOSshenhe){
			state.isIOSshenhe = isIOSshenhe
		},
		initWebview(state, webview){
			for (let i = 0; i < state.webview.length; i++) {
				if(webview.wvid == state.webview[i].wvid){
					state.webview[i] = webview
					return
				}
			}
			state.webview.push(webview)
		},
	},
	actions:{
		initLogin({commit}, item){
			commit('login', item)
		}
	}
}