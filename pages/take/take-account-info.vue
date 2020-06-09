<template>
	<view class="main">
		<view class="w-100 border-top"></view>
		
		<view class="d-flex flex-column a-center j-center mt-3">
			<view class="d-flex flex-row a-center j-center font-32 ml-4 font-weight">
				<text>{{item.TypeName}}</text>
			</view>
			<view class="w-100 d-flex flex-row font-32 mt-3">
				<view class="" style="width: 20%;"></view>
				<text class="ml-3">账号</text>
				<view class="ml-4">{{item.Account}}</view>
			</view>
			<view class="w-100 d-flex flex-row font-32 mt-3">
				<view class="" style="width: 20%;"></view>
				<text class="ml-3">姓名</text>
				<view class="ml-4">{{item.Name}}</view>
			</view>
		</view>
		
		<view class="w-100 d-flex a-center j-center mt-5">
			<view class="font-38 btn-orange-white rounded-10 pt-1 pb-1 border text-center" 
			style="width: 90%;" @click="unbindTakeAccount">解绑此账号</view>
		</view>
		
		<password-popup ref="passwordPopup" @complete="complete"></password-popup>
	</view>
</template>

<script>
	import passwordPopup from '@/components/popup/take/password.vue';
	
	import {mapState, mapMutations} from 'vuex'
	export default {
		components:{
			passwordPopup
		},
		data() {
			return {
				item:[]
			}
		},
		computed:{
			...mapState({
				takeAccountList:state=>state.user.takeAccountList
			}),
			getName(){
				if(this.item.Name){
					var name = this.item.Name
					var mname = name.substring(0, 1)
					for (var i = 0; i < name.length; i++) {
						if(i > 0){
							mname = mname + '*'
						}
					}
					return mname
				}
			}
		},
		onLoad(options) {
			this.item = this.takeAccountList[options.index]
		},
		methods: {
			unbindTakeAccount(){
				var _self = this
				uni.showModal({
				    title: '确定解绑账号',
				    content: _self.item.Account,
				    success: function (res) {
				        if (res.confirm) {
				            _self.takePasswordInput()
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			takePasswordInput(){
				this.$refs.passwordPopup.showPopup()
			},
			complete(password){
				var _self = this
				console.log(_self.item.ID)
				console.log(password)
				uni.showLoading({title:'', mask:true})
				_self.$H.post('/api/TakeAccount/Del',{
					ID:_self.item.ID,
					TakePassword:_self.$md5(password)
				},{
					token:true
				}).then(res=>{	
					console.log(res)
					uni.hideLoading()
					if(res.status == 0){
						uni.navigateBack({
							delta:1
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
