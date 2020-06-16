<template>
	<view class="main">
		<scroll-view scroll-y :style="'height:'+totalH+'px;'">
			<view class="w-100 ml-1 mt-2 d-flex flex-column" >
				<view class="w-100 d-flex flex-row a-center ml-1">
					<view class="d-flex flex-row" style="width: 50%;">
						<view class="font-26 font-weight">订单号:</view>
						<view class="font-26 ml-1">{{OrderItem.ID}}</view>
						<view class="font-26 ml-1" style="color: #FF582B;">({{getStatusText(OrderItem.Status)}})</view>
					</view>
					<view class="d-flex flex-row" style="width: 50%;">
						<view class="font-26 font-weight">桌号:</view>
						<view class="font-26 ml-1 d-flex a-center border">
							<input style="width: 100rpx;" type="text" :value="tableNumberText" maxlength="10" @input="tableNumInput"/>
						</view>
						<view class="font-26 border pl-1 pr-1 btn-blue-white" @click="setTableNum">设置桌号</view>
					</view>
				</view>
			
<!-- 				<view class="w-100 d-flex flex-row a-center ml-1 mt-1">
					<view class="d-flex flex-row" style="width: 60%;">
						<view class="font-26 font-weight">用户昵称:</view>
						<view class="font-26 ml-1">{{OrderItem.UserNickName}}</view>
					</view>
				</view> -->
				
				<view class="w-100 d-flex flex-row a-center ml-1 mt-1">
					<view class="font-26 border pl-1 pr-1 btn-blue-white" @click="selectAll">全选</view>
					<view class="font-26 border pl-1 pr-1 ml-3 btn-blue-white" @click="setStatusSubmit">设置已上</view>
				</view>
				
				<view class="w-100 d-flex flex-column ml-1 mt-1">
					<checkbox-group @change="checkboxChange">
						<block v-for="(item1, index1) in ProductList" :key="index1">
							<view class="d-flex flex-row a-center border-bottom" v-if="item1.addRound != 0">
								<view class="font-26 font-weight pt-2">第{{item1.addRound}}轮新加</view>
								<view class="pt-2 ml-4 font-26 font-weight" style="color: #007BFF;" 
								v-if="!getConfirmShow" @click="printOrder(item1.addRound)">打印新加订单</view>
							</view>
							<view class="font-26 font-weight border-bottom pt-2" v-if="item1.addRound == 0">
								首轮点购
							</view>

							<label class="d-flex flex-column border-bottom" v-for="(item2, index2) in item1.list" :key="index2">
								<view class="d-flex flex-row">
									<view class="font-26 ml-1 pt-2 d-flex flex-row" style="width: 40%;">
										<checkbox :value="item2.ID" :checked="select" style="transform:scale(0.9)" 
										v-if="item2.Status == 0"/>
										<view class="ml">{{item2.ProductName}}</view>
										<view class="" v-if="item2.SpecificationName">({{item2.SpecificationName}})</view>
									</view>
									<view class="font-26 pt-2" style="width: 15%;">x{{item2.Count}}</view>
									<view class="font-26 pt-2" style="width: 20%; color: #FF582B;">￥{{item2.TotalAmount}}</view>
									<view class="font-26 pt-2" style="width: 25%;"
									:style="item2.Status == 0 ? 'color: #FF0000;':'color: #00FF00;'">{{getDishesStatus(item2.Status)}}</view>
								</view>
								<view class="d-flex flex-row ml-4" style="color: #FF582B;" v-if="item2.TasteName != ''">
									<view class="font-24 ml-3">口味：</view>
									<view class="font-24">{{item2.TasteName}}</view>
								</view>
							</label>
						</block>
					</checkbox-group>
				</view>
				
				<view class="w-100 d-flex flex-row ml-1 mt-1 border-bottom">
					<view class="" style="width: 60%;"></view>
					<view class="d-flex flex-row" style="width: 40%;">
						<view class="font-26 font-weight pt-2">订单金额：</view>
						<view class="font-26 font-weight pt-2" style="color: #FF582B;">￥{{OrderItem.Amount}}</view>
					</view>
				</view>
				
				<view class="w-100 d-flex flex-column ml-1 mt-1 border-bottom" v-if="OrderItem.UserNote != ''">
					<view class="font-26 font-weight">备注：</view>
					<text class="font-26" style="width: 600rpx;">{{OrderItem.UserNote}}</text>
				</view>
				
				<view class="w-100 d-flex flex-row ml-1 mt-3">
					<view class="d-flex flex-row" style="width: 55%;">
						<block v-if="getShowPrint">
							<view class="d-flex a-center flex-row font-26">
								<view class="border pl-1 pr-1 ml-1 btn-orange-white" @click="printOrder">打印订单</view>
								<view class="ml-3">已打印{{printCount}}次</view>
							</view>
						</block>
					</view>
					<view class="d-flex flex-row" style="width: 45%;">
						<block v-if="(getCancelShow && getConfirmShow)">
							<view class="font-26 border pl-1 pr-1 ml-1 btn-blue-white" @click="cancelOrder">取消订单</view>
							<view class="font-26 border pl-1 pr-1 ml-2 btn-orange-white" @click="confirmOrder">确认订单</view>
						</block>
						<block v-else-if="getCancelShow">
							<view class="font-26 border pl-1 pr-1 ml-1 btn-blue-white" @click="finishOrder">完成订单</view>
							<view class="font-26 border pl-1 pr-1 ml-2 btn-orange-white" @click="cancelOrder">取消订单</view>
						</block>
					</view>
				</view>
			
				<view class="w-100 d-flex flex-row ml-1 mt-3" style="height: 60rpx;"></view>
			</view>
		</scroll-view>
		
		<send-command ref="sendCommand" @printComplete="printComplete"></send-command>
	</view>
</template>
	
<script>
	import sendCommand from "@/components/sendCommand/sendCommand.vue"
	
	import {mapState,mapGetters,mapActions,mapMutations} from "vuex"
	export default {
		components:{
			sendCommand
		},
		data() {
			return {
				totalH:0,
				defaultStatus:["未确认","进行中","支付中","已完成","用户取消","商户取消"],
				statusText: '',
				OrderItem:[],
				ProductList:[],
				tableNumberText:'',
				statusList:[],
				select:false,
				Status: -99,
				printCount: 0
			}
		},
		onLoad: function (option) {
			uni.getSystemInfo({
				success: (res) => {
					this.totalH = res.windowHeight
				}
			})
			
			if(option.ID){
				this.getItem(option.ID)
			}
		},
		computed:{
			...mapState({
				orderList:state=>state.order.orderList,
				BLEInformation:state=>state.bluetooth.BLEInformation
			}),
			...mapGetters([
			]),
			getCancelShow(){
				if(this.OrderItem.Status == 0 || this.OrderItem.Status == 1 || this.OrderItem.Status == 2){
					return true
				}else{
					return false
				}
			},
			getConfirmShow(){
				if(this.OrderItem.AddStatus == 1 || this.OrderItem.Status == 0){
					return true
				}else{
					return false
				}
			},
			getShowPrint(){
				if(this.OrderItem.Status == 1 || this.OrderItem.Status == 3){
					return true
				}else{
					return false
				}
			}
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
				
			]),
			initOrderView(m_id){
				var _self = this;
				_self.$H.post('/api/order/SetStatusViewed',{
					OrderID: m_id
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						// 设置为已读
						_self.initPrintCount()
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			initPrintCount(){
				var _self = this
				let postData = { OrderID:_self.OrderItem.ID }
				_self.$H.post('/api/order/PrintCount', postData, {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.printCount = res.data
					}else{
						_self.$Common.showToast(res)
					}
				})
			},
			getItem(m_id){
				var _self = this;
				_self.$H.post('/api/Order/Detail',{
					OrderID: m_id
				},{
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){
						_self.Status = res.data.Status
						_self.OrderItem = res.data.OrderItem
						_self.tableNumberText = res.data.OrderItem.TableNumber
						_self.tidyProductList(res.data.ProductList)
						_self.initOrderView(m_id)
					}else{
						_self.jumpShowToast(res.message)
					}
				})
			},
			tidyProductList(list){
				var temp = this.OrderItem
				this.ProductList = []
				for (var i = temp.AddRound; i >= 0; i--) {
					let newItem = {addRound: i, list: []}
					for (var j = 0; j < list.length; j++) {
						if(list[j].AddRound == i){
							newItem.list.push(list[j])
						}
					}
					this.ProductList.push(newItem)
				}
				this.ProductList.reverse()
				console.log(this.ProductList)
			},
			getStatusText(index){
				this.statusText = this.defaultStatus[index]
				return this.statusText
			},
			getDishesStatus(index){
				if(index == 0){
					return '未上'
				}else if(index == 1){
					return '已上'
				}
			},
			tableNumInput(e){
				this.tableNumberText = e.detail.value
			},
			setTableNum(){
				var _self = this;
				if(_self.tableNumberText == _self.OrderItem.TableNumber){
					uni.showToast({
						title:'请设置不同的桌号',
						icon:'none',
						duration:1000
					})
					return
				}
				_self.$H.post('/api/Order/SetTableNumber',{
					OrderID:_self.OrderItem.ID,
					TableNumber:_self.tableNumberText
				},{
					token:true
				}).then(res=>{
					console.log(res)
					_self.jumpShowToast(res.message)
					if(res.status === 0){
						var temp = _self.orderList
						for (var i = 0; i < temp.length; i++) {
							if(temp[i].ID == _self.OrderItem.ID){
								temp[i].TableNumber = _self.tableNumberText
							}
						}
					}
				})
			},
			checkboxChange(e){
				console.log(e.detail.value)
				this.statusList = e.detail.value
			},
			selectAll(){
				this.select = !this.select
				if(!this.select){
					this.statusList = []
				}else{
					var temp = this.ProductList;
					for (var i = 0; i < temp.length; i++) {
						for (var j = 0; j < temp[i].list.length; j++) {
							if(temp[i].list[j].Status == 0){
								this.statusList.push(temp[i].list[j].ID)
							}
						}
					}
				}
			},
			setStatusSubmit(){
				var _self = this;
				if(_self.statusList.length <= 0){
					return
				}
				_self.$H.post('/api/Order/SetProductStatus',{
					OrderID:_self.OrderItem.ID,
					IDs:JSON.stringify(_self.statusList)
				},{
					token:true
				}).then(res=>{
					console.log(res)
					_self.jumpShowToast(res.message)
					if(res.status == 0){
						_self.setStatusSubmitSuccess(_self.statusList)
					}
				})
			},
			setStatusSubmitSuccess(list){
				var temp = this.ProductList;
				
				for (var k = 0; k < list.length; k++) {
					for (var i = 0; i < temp.length; i++) {
						for (var j = 0; j < temp[i].list.length; j++) {
							if(list[k] == temp[i].list[j].ID){
								temp[i].list[j].Status = 1
							}
						}
					}
				}
			},
			cancelOrder(){
				var _self = this;
				uni.showModal({
				    title: '提示',
				    content: '取消订单',
				    success: function (res) {
				        if (res.confirm) {
				            _self.$H.post('/api/Order/CancelOrder',{
				            	OrderID:_self.OrderItem.ID
				            },{
				            	token:true
				            }).then(res=>{
				            	console.log(res)
								_self.jumpShowToast(res.message)
				            	if(res.status == 0){
									_self.OrderItem.Status = 5
									var temp = _self.orderList
									for (var i = 0; i < temp.length; i++) {
										if(temp[i].ID == _self.OrderItem.ID){
											temp[i].Status = 5
										}
									}
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			confirmOrder(){
				var _self = this;
				var m_url = '/api/Order/ConfirmOrder'
				if(_self.OrderItem.AddStatus == 1){
					m_url = '/api/Order/ConfirmAddStatus'
				}
				uni.showModal({
				    title: '提示',
				    content: '确认订单',
				    success: function (res) {
				        if (res.confirm) {
				            _self.$H.post(m_url, { OrderID:_self.OrderItem.ID }, {
				            	token:true
				            }).then(res=>{
				            	console.log(res)
				            	if(res.status == 0){
				     //        		_self.OrderItem.Status = 1
									// var temp = _self.orderList
									// for (var i = 0; i < temp.length; i++) {
									// 	if(temp[i].ID == _self.OrderItem.ID){
									// 		temp[i].Status = 1
									// 	}
									// }
									_self.getItem(_self.OrderItem.ID)
				            	}else{
									_self.$Common.showToast(res)
								}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			finishOrder(){
				var _self = this;
				uni.showModal({
				    title: '提示',
				    content: '确认已线下支付完成',
				    success: function (res) {
				        if (res.confirm) {
				            _self.$H.post('/api/Order/OfflinePayOk',{
				            	OrderID:_self.OrderItem.ID
				            },{
				            	token:true
				            }).then(res=>{
				            	console.log(res)
								_self.jumpShowToast(res.message)
				            	if(res.status == 0){
				            		_self.OrderItem.Status = 3
									var temp = _self.orderList
									for (var i = 0; i < temp.length; i++) {
										if(temp[i].ID == _self.OrderItem.ID){
											temp[i].Status = 3
										}
									}
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			printOrder(m_around){
				var _self = this
				if(_self.BLEInformation.writeServiceId == ''){
					uni.showModal({
					    title: '提示',
					    content: '您没有连接打印设备,是否去连接',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
									url:'../bleConnect/bleConnect'
								})
					        }
					    }
					});
				}else{
					_self.gotoPrintOrder(m_around)
				}
			},
			gotoPrintOrder(m_around){
				var _self = this
				var printOrderLit = _self.ProductList
				for (let i = 0; i < _self.ProductList.length; i++) {
					if(_self.ProductList[i].addRound == m_around){
						printOrderLit = _self.ProductList[i]
						break
					}
				}
				if(m_around){
					_self.$refs.sendCommand.receiptAddOrder(_self.OrderItem, printOrderLit, _self.statusText)
					return
				}

				if(_self.printCount > 0){
					uni.showModal({
						title: '提示',
						content: '订单已打印'+_self.printCount+'次,继续打印?',
						success: function (res) {
							if (res.confirm) {
								_self.$refs.sendCommand.receiptOrder(_self.OrderItem, printOrderLit, _self.statusText)
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else{
					_self.$refs.sendCommand.receiptOrder(_self.OrderItem, printOrderLit, _self.statusText)
				}
			},
			printComplete(){
				console.log('打印完成，回调结束')
				var _self = this
				let postData = { OrderID:_self.OrderItem.ID }
				_self.$H.post('/api/order/PrintOk', postData, {
					token:true
				}).then(res=>{
					console.log(res)
					if(res.status == 0){

					}
				})
			},
			jumpShowToast(message){
				uni.showToast({
					title:message,
					icon:'none',
					duration:1500
				})
			}
		}	
	}
</script>

<style>

</style>
