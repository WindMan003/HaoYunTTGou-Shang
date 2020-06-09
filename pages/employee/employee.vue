<template>
	<view class="w-100">
		<view class="d-flex flex-row a-center mt-2" style="height: 80rpx;">
			<view class="ml-2">
				<input class="font-30 border" style="width: 200rpx;" type="text" :value="nickName" 
				placeholder="员工昵称" @input="nickNameInput"/>
			</view>
			<view class="border font-30 ml-1 pl-1 pr-1 btn-blue-white" @click="check">查询</view>
			<view class="border font-30 ml-1 pl-1 pr-1 btn-blue-white" @click="clear">清空</view>
			<view class="border font-30 ml-1 pl-1 pr-1 btn-blue-white" @click="refresh">刷新</view>
			<view class="border font-30 ml-2 pl-2 pr-2 btn-blue-white" @click="newadd">新增账号</view>
		</view>
		
		<view class="d-flex flex-row a-center border-bottom font-30" style="height: 80rpx;">
			<view class="text-center" style="width: 30%;">账号</view>
			<view class="text-center" style="width: 30%;">昵称</view>
			<view class="text-center" style="width: 40%;">操作</view>
		</view>
		
		<scroll-view scroll-y :style="'height:'+(totalH - 82)+'px;'">
			<view class="d-flex flex-column">
				<block v-for="(item,index) in employeeList" :key="index">
					<view class="d-flex flex-row a-center mt-1">
						<view class="ml-2 text-center" style="width: 30%;">{{item.Account}}</view>
						<view class="text-center" style="width: 30%;">{{item.Name}}</view>
						<view class="d-flex flex-row a-center j-center" style="width: 40%;">
							<view class="border font-26 pl-2 pr-2 btn-blue-white" @click="change(index)">修改</view>
							<view class="border font-26 ml-1 pl-2 pr-2 btn-blue-white" @click="deleteItem(index)">删除</view>
						</view>
					</view>
				</block>
			</view>
		</scroll-view>
		
		<newadd-popup ref="newaddPopup"></newadd-popup>
		<change-popup ref="changePopup"></change-popup>
	</view>
</template>

<script>
	import newaddPopup from "@/components/employee/newadd-popup.vue"
	import changePopup from "@/components/employee/change-popup.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			newaddPopup,
			changePopup
		},
		data() {
			return {
				totalH:0,
				nickName:''
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			this.__init()
		},
		computed:{
			...mapState({
				employeeList:state=>state.employee.employeeList
			}),
			...mapGetters([
			]),
		},
		methods: {
			...mapMutations([
				'updateEmployeeList'
			]),
			...mapActions([
			]),
			__init(className){
				var _self = this;
				_self.$H.post('/api/Employee/List',{},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						if(className == 'refresh'){
							uni.showToast({title:'刷新成功', icon:'none', duration:1000})
						}
						this.updateEmployeeList(res.data)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			nickNameInput(e){
				this.nickName = e.target.value
			},
			clear(){
				this.nickName = ''
			},
			refresh(){
				this.__init('refresh')
			},
			newadd(){
				this.$refs.newaddPopup.showPopup()
			},
			change(index){
				this.$refs.changePopup.showPopup(this.employeeList[index])
			},
			check(){
				var _self = this
				if(_self.nickName == ''){
					uni.showToast({title:'输入需要查询的内容', icon:'none', duration:1000})
					return
				}
				_self.$H.post('/api/Employee/List',{
					Name:_self.nickName
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						this.updateEmployeeList(res.data)
					}else{
						uni.showToast({title:res.message, icon:'none', duration:1000})
					}
				})
			},
			deleteItem(index){
				var _self = this
				uni.showModal({
				    title: '提示',
				    content: '确定删除这个员工账号',
				    success: function (res) {
				        if (res.confirm) {
				            _self.deleteItemSure(index)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				})
			},
			deleteItemSure(index){
				var _self = this
				var id = _self.employeeList[index].ID
				_self.$H.post('/api/Employee/Del',{
					ID:id
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.employeeList.splice(index, 1)
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
