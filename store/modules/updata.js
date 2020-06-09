export default {
	state:{
		version:"1.0.0"
	},
	mutations:{
		// 版本号
		initVersion(state, version){
			if(version){
				state.version = version
			}
		}
	},
	actions:{
		
	}
}