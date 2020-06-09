
export default {
	state: {
		//蓝牙信息
		BLEInformation: {
			deviceId: "",
			writeCharaterId: "",
			writeServiceId: "",
			notifyCharaterId: "",
			notifyServiceId: "",
			readCharaterId: "",
			readServiceId: "",
		}
	},
	mutations:{
		BLEInformationSet(state, info){
			state.BLEInformation = info;
		}
	}
}
