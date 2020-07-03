<template>
	<uni-popup type="center" ref="popup" @change="change" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex flex-column w-100 bg-white" style="height: 600rpx; border-radius: 3%;">
			<view class="d-flex a-center j-center font-38 font-weight pt-1 mt-2">修改员工账号</view>
			
			<view class="d-flex flex-row a-center" style="height: 80rpx;">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">账号</view>
				</view>
				<view class="ml-2 position-relative" style="width: 65%;">
					<view class="font-30 position-absolute" style="left: 0;">{{item.Account}}</view>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center" style="height: 80rpx;">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">密码</view>
				</view>
				<view class="ml-2 position-relative" style="width: 65%;">
					<input class="border font-30 position-absolute" style="width: 300rpx; left: 0;" type="text" :value="password"
					placeholder="请输入密码" @input="passwordInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center" style="height: 80rpx;">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">员工昵称</view>
				</view>
				<view class="ml-2 position-relative" style="width: 65%;">
					<input class="border font-30 position-absolute" style="width: 300rpx; left: 0;" type="text" :value="nickname"
					placeholder="请输入昵称" @input="nicknameInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center" style="height: 80rpx;">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">是否启用</view>
				</view>
				<view class="ml-2 position-relative" style="width: 65%;">
					<checkbox-group @change="enableStatus">
						<label class="position-absolute" style="left: 0;">
							<checkbox value="cb" :checked="isEnable"/>
						</label>
					</checkbox-group>
				</view>
			</view>

			<view class="d-flex a-center j-center mt-5">
				<view class="font-38 font-weight border p text-center btn-orange-white"
				style="width: 150rpx; border-radius: 20rpx;" @click="uploadInfo">
					提交
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	
	export default{
		components:{
			
		},
		props:{

		},
		data() {
			return {
				password:'******',
				nickname:'',
				item:'',
				enabledValue:1,
				isEnable:true
			}
		},
		computed:{
			...mapState({
				employeeList:state=>state.employee.employeeList
			}),
			...mapGetters([

			]),
			
		},
		methods:{
			...mapMutations([
			]),
			...mapActions([
			]),
			showPopup(item){
				console.log(item)
				//初始化数据
				this.item = item
				this.password = '******'
				this.nickname = item.Name
				if(item.Enabled == 1){
					this.isEnable = true
				}else{
					this.isEnable = false
				}
				this.$refs.popup.open()
			},
			change(e){
				if(!e.show){
					//退出重置数据
				}
			},
			passwordInput(e){
				this.password = e.detail.value
			},
			nicknameInput(e){
				this.nickname = e.detail.value
			},
			enableStatus(e){
				var temp =  e.detail.value
				if(temp.length > 0){
					this.enabledValue = 1
				}else{
					this.enabledValue = 0
				}
			},
			uploadInfo(){
				var _self = this
				var infolist = {
					ID:_self.item.ID,
					Name:_self.nickname,
					Enabled:_self.enabledValue
				}
				if(_self.password != '******'){
					infolist.LoginPwd = _self.password
				}
				//临时同步数据
				_self.item.Name = _self.nickname
				_self.item.Enabled = _self.enabledValue
				
				_self.$H.post('/api/Employee/Update',infolist,{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						var temp = _self.employeeList
						for (var i = 0; i < temp.length; i++) {
							if(temp[i].ID == _self.item.ID){
								temp.splice(i, 1, _self.item)
								break
							}
						}
						uni.showModal({
						    title: '提示',
						    content: '修改成功',
							showCancel: false,
						    success: function (res) {
						        if (res.confirm) {
						            _self.$refs.popup.onTap()
						        } else if (res.cancel) {
						            console.log('用户点击取消');
						        }
						    }
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
