<template>
	<uni-popup type="center" ref="popup" @change="change" className="uni-popup__wrapper-box-goods-spec">
		<view class="d-flex flex-column w-100" style="height: 600rpx; background-color: #FFFFFF; border-radius: 3%;">
			<view class="d-flex a-center j-center font-38 font-weight pt-1 mt-2">新增员工账号</view>
			
			<view class="d-flex flex-row a-center" style="height: 80rpx;">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">账号</view>
				</view>
				<view class="ml-2" style="width: 65%;">
					<input class="border font-30 position-absolute" style="width: 300rpx;" type="text" :value="account"
					placeholder="请输入名称" @input="accountInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center" style="height: 80rpx;">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">密码</view>
				</view>
				<view class="ml-2" style="width: 65%;">
					<input class="border font-30 position-absolute" style="width: 300rpx;" type="text" :value="password"
					placeholder="请输入密码" @input="passwordInput"/>
				</view>
			</view>
			
			<view class="d-flex flex-row a-center" style="height: 80rpx;">
				<view class="position-relative" style="width: 35%;">
					<view class="font-30 font-weight position-absolute" style="right: 0;">员工昵称</view>
				</view>
				<view class="ml-2" style="width: 65%;">
					<input class="border font-30 position-absolute" style="width: 300rpx;" type="text" :value="nickname"
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
				account:'',
				password:'',
				nickname:'',
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
			showPopup(){
				this.account = ''
				this.password = ''
				this.nickname = ''
				this.isEnable = true
				this.$refs.popup.open()
			},
			change(e){
				if(!e.show){
					//退出重置数据
				}
			},
			accountInput(e){
				this.account = e.detail.value
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
				if(_self.account == '' || _self.password == '' || _self.nickname == ''){
					uni.showToast({title:'请输入完整信息', icon:'none', duration:1000})
					return
				}
				_self.$H.post('/api/Employee/Add',{
					Account:_self.account,
					LoginPwd:_self.password,
					Name:_self.nickname,
					Enabled:_self.enabledValue
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.employeeList.unshift(res.data)
						_self.$refs.popup.onTap()
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
