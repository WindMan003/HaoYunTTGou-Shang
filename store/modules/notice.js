import $H from '@/common/lib/request.js';
export default {
	state:{
		noticeList:[]
	},
	getters:{
		
	},
	mutations:{
		updateNoticeList(state, value){
			if(value){
				state.noticeList = value
			}
		},
		updataSortByValue(state){
			state.noticeList.sort(function (a,b) {
			    return b.SortValue - a.SortValue
			})
		},
		updataDeleteData(state, id){
			var temp = state.noticeList
			for (var i = 0; i < temp.length; i++) {
				if(temp[i].ID == id){
					temp.splice(i, 1)
					return
				}
			}
		},
		pushUpdateNoticeList(state, value){
			for (var i = 0; i < value.length; i++) {
				for (var j = 0; j < state.noticeList.length; j++) {
					if(value[i].ID == state.noticeList[j].ID){
						break
					}
					if(j == state.noticeList.length - 1){
						state.noticeList.push(value[i])
					}
				}
			}
		},
	},
	actions:{
	},
}