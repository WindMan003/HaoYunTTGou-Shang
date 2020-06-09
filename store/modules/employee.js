import $H from '@/common/lib/request.js';
export default {
	state:{
		employeeList:[]
	},
	getters:{
		
	},
	mutations:{
		updateEmployeeList(state, value){
			if(value){
				state.employeeList = value
			}
		}
	},
	actions:{
	},
}