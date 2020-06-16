<template>
	<view class="content">
		
	</view>
</template>

<script>
	var tsc = require("../../common/bluetooth/ble/tsc.js");
	var esc = require("../../common/bluetooth/ble/esc.js");
	var encode = require("../../common/bluetooth/ble/encoding.js");
	import {
		mapState
	} from 'vuex';
	
	export default {
		data() {
			return {
				sendContent: "",
				looptime: 0,
				currentTime: 1,
				lastData: 0,
				oneTimeData: 30,
				returnResult: "",
				canvasWidth: 180,
				canvasHeight: 180,
				imageSrc: '../../static/img/abc_ic_star_black_16dp.png',
				buffSize: [],
				buffIndex: 0,
				printNum: [],
				printNumIndex: 0,
				printerNum: 1,
				currentPrint: 1,
				isReceiptSend: false,
				isLabelSend: false
			};
		},
		computed:{
			...mapState({
				BLEInformation:state=>state.bluetooth.BLEInformation,
				merchantInfo:state=>state.user.merchantInfo
			})
		},
		onLoad() {
			let that = this;
			// uni.notifyBLECharacteristicValueChange({
			//   deviceId: BLEInformation.deviceId,
			//   serviceId: BLEInformation.notifyServiceId,
			//   characteristicId: BLEInformation.notifyCharaterId,
			//   state: true,
			//   success(res) {
			// 	uni.onBLECharacteristicValueChange(function(r) {
			// 	  console.log(`characteristic ${r.characteristicId} has changed, now is ${r}`)
			// 	})
			//   },
			//   fail: function(e) {
			// 	console.log(e)
			//   },
			//   complete: function(e) {
			// 	console.log(e)
			//   }
			// })
		},
		onReady(){
			let list = []
			let numList = []
			let j = 0
			for (let i = 20; i < 200; i += 10) {
			  list[j] = i;
			  j++
			}
			for (let i = 1; i < 10; i++) {
			  numList[i - 1] = i
			}
			this.buffSize = list;
			this.oneTimeData = list[0];
			this.printNum = numList;
			this.printerNum = numList[0];
		},
		onShow(){
			let that = this;
			let width;
			let height;
			uni.getImageInfo({
			  src: that.imageSrc,
			  success(res) {
				console.log(res.width)
				console.log(res.height)
				width = res.width
				height = res.height
				that.canvasWidth = res.width;
				that.canvasHeight = res.height;
			  }
			})
			const ctx = uni.createCanvasContext("edit_area_canvas", this);
			// if (app.globalData.platform == "android") {
			//   ctx.translate(width, height)
			//   ctx.rotate(180 * Math.PI / 180)
			// }
			ctx.drawImage(this.imageSrc, 0, 0, width, height);
			ctx.draw();
		},
		onUnload() {
			let that = this;
			// uni.closeBLEConnection({
		 //      deviceId: BLEInformation.deviceId,
		 //      success: function(res) {
		 //        console.log("关闭蓝牙成功")
		 //      },
		 //    })	
		},
		methods:{
			//获取输入内容
			inputEvent(e){
				this.sendContent = e.detail.value;
			},
			//输入框点击发送
			sendData(){
				let data = this.sendContent + "\n"
				this.looptime = 0;
				var content = new encode.TextEncoder(
				  'gb18030', {
					NONSTANDARD_allowLegacyEncoding: true
				  }).encode(data);
			
				this.prepareSend(content);
			},
			//标签测试
			labelTest(){
				let that = this;
				let canvasWidth = that.canvasWidth
				let canvasHeight = that.canvasHeight
				let command = tsc.jpPrinter.createNew()
				command.setSize(48, 40)
				command.setGap(0)
				command.setCls()
				command.setText(0, 30, "TSS24.BF2", 1, 1, "图片")
				command.setQR(40, 120, "L", 5, "A", "www.smarnet.cc佳博智汇")
				command.setText(60, 90, "TSS24.BF2", 1, 1, "佳博智汇")
				command.setText(170, 50, "TSS24.BF2", 1, 1, "小程序测试")
				command.setText(170, 90, "TSS24.BF2", 1, 1, "测试数字12345678")
				command.setText(170, 120, "TSS24.BF2", 1, 1, "测试英文abcdefg")
				command.setText(170, 150, "TSS24.BF2", 1, 1, "测试符号/*-+!@#$")
				command.setBarCode(170, 180, "EAN8", 64, 1, 3, 3, "1234567")
				uni.canvasGetImageData({
				  canvasId: 'edit_area_canvas',
				  x: 0,
				  y: 0,
				  width: canvasWidth,
				  height: canvasHeight,
				  success: function(res) {
					command.setBitmap(60, 0, 1, res)
				  },
				  complete: function() {
					command.setPagePrint()
					that.isLabelSend = true;
					that.prepareSend(command.getData())
				  }
				})
			},

			//票据打印
			receiptOrder(m_item, m_list, m_statusText){
				console.log(m_item)
				console.log(m_list)
				var that = this;
				var canvasWidth = that.canvasWidth
				var canvasHeight = that.canvasHeight
				var command = esc.jpPrinter.createNew()
				command.init()
				// 标题
				command.bold(1);//加粗
				command.setFontSize(16);//字体大小
				command.setSelectJustification(1)//居中
				command.rowSpace(100);
				command.setText(that.merchantInfo.Name);
				command.setPrint();
				command.rowSpace(60);
				
				command.bold(1);//加粗
				command.setFontSize(16);//字体大小
				command.setSelectJustification(1)//居中
				command.rowSpace(100);
				command.setText('<- '+m_statusText+' ->');
				command.setPrint();
				command.rowSpace(60);
				// 桌子号
				command.setSelectJustification(1);//居中
				command.setText('桌子号：'+m_item.TableNumber);
				command.setPrint();
				
				command.bold(0);//取消加粗
				command.setFontSize(0);//正常字体
				//时间
				command.setSelectJustification(0);//居左
				command.setText(m_item.CreateTime);
				command.setPrint();
				//编号
				command.setSelectJustification(0);//居左
				command.setText('订单号：'+m_item.ID);
				// command.setPrintAndFeed(80);//打印并走纸feed个单位
				command.setPrint();
				
				command.setSelectJustification(1);//居中
				command.setText('--------------------------------')
				command.setPrint();
				
				//列表
				command.setSelectJustification(0);
				command.rowSpace(80);//间距
				command.bold(5);//加粗
				command.setText("名称");
				command.setAbsolutePrintPosition(140);
				command.setText("单价");
				command.setAbsolutePrintPosition(220);
				command.setText("数量");
				command.setAbsolutePrintPosition(300);
				command.setText("价格");
				command.setPrint()
				
				command.bold(0);
				let total = 0
				for (var i = 0; i < m_list.length; i++) {
					if(m_list.length > 1){
						command.rowSpace(80);//间距
						command.setSelectJustification(1);//居中
						if(m_list[i].addRound == 0){
							command.setText('首轮点购');
						}else{
							command.setText('第'+(m_list[i].addRound)+'轮加菜');
						}
						command.setPrint();
					}
					
					command.setSelectJustification(0);//居中
					for (var j = 0; j < m_list[i].list.length; j++) {
						let temp = m_list[i].list[j]
						total = total + temp.TotalAmount
						command.setText(temp.ProductName);
						command.setAbsolutePrintPosition(140);
						command.setText(temp.Price);
						command.setAbsolutePrintPosition(220);
						command.setText(temp.Count);
						command.setAbsolutePrintPosition(300);
						command.setText('￥'+temp.TotalAmount);
						command.setPrint()
					}
				}
				
				command.setSelectJustification(1);//居中				
				command.setText('--------------------------------')
				command.setPrint();
				
				//总价
				command.rowSpace(80);//间距
				command.bold(2);//加粗
				command.setSelectJustification(2);
				command.setText('总价：￥'+total)
				command.setPrint();
				
				//提示
				command.rowSpace(80);//间距
				command.bold(2);//加粗
				command.setSelectJustification(0);//居中
				if(m_item.UserNote != ''){
					command.setText("备注："+m_item.UserNote);
				}else{
					command.setText("备注：无");
				}
				command.setPrint();
				
				command.setSelectJustification(1);//居中
				command.setText('--------------------------------')
				command.setPrint();
				
				command.rowSpace(80);//间距
				command.bold(2);//加粗
				command.setSelectJustification(0);
				command.setText("应付金额：￥"+total);
				command.setPrint();
				
				command.setSelectJustification(1);//居中
				command.setText('--------------------------------')
				command.setPrint();
				
				command.setPrintAndFeedRow(3);
				
				that.isReceiptSend = true;
				that.prepareSend(command.getData());
			},
			
			//加菜票据打印
			receiptAddOrder(m_item, m_list, m_statusText){
				console.log(m_item)
				console.log(m_list)
				var that = this;
				var canvasWidth = that.canvasWidth
				var canvasHeight = that.canvasHeight
				var command = esc.jpPrinter.createNew()
				command.init()
				// 标题
				command.bold(1);//加粗
				command.setFontSize(16);//字体大小
				command.setSelectJustification(1)//居中
				command.rowSpace(100);
				command.setText(that.merchantInfo.Name);
				command.setPrint();
				command.rowSpace(60);
				
				command.bold(1);//加粗
				command.setFontSize(16);//字体大小
				command.setSelectJustification(1)//居中
				command.rowSpace(100);
				command.setText('<- '+m_statusText+' ->');
				command.setPrint();
				command.rowSpace(60);
				// 桌子号
				command.setSelectJustification(1);//居中
				command.setText('桌子号：'+m_item.TableNumber);
				command.setPrint();
				
				command.bold(0);//取消加粗
				command.setFontSize(0);//正常字体
				//时间
				command.setSelectJustification(0);//居左
				command.setText(m_item.CreateTime);
				command.setPrint();
				//编号
				command.setSelectJustification(0);//居左
				command.setText('订单号：'+m_item.ID);
				// command.setPrintAndFeed(80);//打印并走纸feed个单位
				command.setPrint();
				
				command.setSelectJustification(1);//居中
				command.setText('--------------------------------')
				command.setPrint();
				
				//列表
				command.setSelectJustification(0);
				command.rowSpace(80);//间距
				command.bold(5);//加粗
				command.setText("名称");
				command.setAbsolutePrintPosition(140);
				command.setText("单价");
				command.setAbsolutePrintPosition(220);
				command.setText("数量");
				command.setAbsolutePrintPosition(300);
				command.setText("价格");
				command.setPrint()
				
				command.bold(0);
				command.rowSpace(80);//间距
				command.setSelectJustification(1);//居中
				command.setText('第'+(m_list.addRound)+'轮加菜')
				command.setPrint();
					
				command.setSelectJustification(0);//居中
				for (var j = 0; j < m_list.list.length; j++) {
					let temp = m_list.list[j]
					command.setText(temp.ProductName);
					command.setAbsolutePrintPosition(140);
					command.setText(temp.Price);
					command.setAbsolutePrintPosition(220);
					command.setText(temp.Count);
					command.setAbsolutePrintPosition(300);
					command.setText('￥'+temp.TotalAmount);
					command.setPrint()
				}
				command.setPrintAndFeedRow(3);
				
				that.isReceiptSend = true;
				that.prepareSend(command.getData());
			},
			
			//准备发送，根据每次发送字节数来处理分包数量
			prepareSend(buff){
				console.log(buff);
				let that = this
				let time = that.oneTimeData
				let looptime = parseInt(buff.length / time);
				let lastData = parseInt(buff.length % time);
				console.log(looptime + "---" + lastData)
				this.looptime = looptime + 1;
				this.lastData = lastData;
				this.currentTime = 1;
				that.Send(buff)
			},
			//查询打印机状态
			queryStatus(){
				let command = esc.jpPrinter.Query();
				command.getRealtimeStatusTransmission(1);
			},
			//分包发送
			Send(buff){
				let that = this
				let {currentTime,looptime:loopTime,lastData,oneTimeData:onTimeData,printerNum:printNum,currentPrint}=that;
				let buf;
				let dataView;
				if (currentTime < loopTime) {
					buf = new ArrayBuffer(onTimeData)
					dataView = new DataView(buf)
					for (var i = 0; i < onTimeData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
					}
				} else {
					buf = new ArrayBuffer(lastData)
					dataView = new DataView(buf)
					for (var i = 0; i < lastData; ++i) {
						dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
					}
				}
				console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
				
				uni.writeBLECharacteristicValue({
					deviceId: that.BLEInformation.deviceId,
					serviceId: that.BLEInformation.writeServiceId,
					characteristicId: that.BLEInformation.writeCharaterId,
					value: buf,
					success: function(res) {
						console.log(res)
					},
					fail: function(e) {
						console.log(e)
					},
					complete: function() {
						currentTime++
						if (currentTime <= loopTime) {
							that.currentTime = currentTime;
							that.Send(buff)
						} else {
							console.log('打印完成')
							if (currentPrint == printNum) {
								that.looptime = 0;
								that.lastData = 0;
								that.currentTime = 1;
								that.isReceiptSend = false;
								that.isLabelSend = false;
								that.currentPrint = 1;
							} else {
								currentPrint++;
								that.currentPrint = currentPrint;
								that.currentTime = 1;
								that.Send(buff)
							}
							that.$emit('printComplete')
						}
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.input{  
		text-align: top; 
		 width: 90%;  
		 height: 150px;  
		 margin-left: 4%; 
		 margin-right: 4%;  
		 margin-top: 10px; 
		 margin-bottom: 12px; 
		border: 1px solid slategray;
	}
	.receiver_info_scroll_view{ 
		width: 90%; 
		height: 200px; 
		margin-left: 4%;
		margin-right: 4%; 
		margin-top: 10px;
		margin-bottom: 25px;
		border: 1px solid black;
	}
	.result{ 
		width: 90%;  
		height: 150px; 
		border: 1px solid black; 
		margin-left: 4%;
		margin-bottom: 4%; 
		margin-top: 5%;
	}
    button{ 
	  width: 90%; 
	  margin-left: 5%; 
	  margin-right: 5%;
	}
	.switch{ 
		float: right; 
		margin-right: 20px; 
		margin-bottom: 16px;
	}
    text{ 
	   color: #fff; 
	   display: block;
	}
	input{  
		color: gainsboro;  
		float: left;
	}
	.v_net_ssid{  
		width: 100%; 
		background:  #fff;
	}
	.v_net_passw{ 
		width: 100%; 
		background: antiquewhite;
	}
    .swiper{ 
	   width: 100%; 
	   height: 100%;
	}

</style>
