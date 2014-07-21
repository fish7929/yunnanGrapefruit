var notiFlag1 = true;
var notiFlag2 = true;
var notiFlag3 = true;
var notiFlag4 = true;
var notiFlag5 = true;
var notiFlag6 = true;
var notiFlag27 = true;
var imei; //获取手机的imei号码
var beacon_1 = 0;
var beacon_2 = 0;
var beacon_3 = 0;
var beacon_4 = 0;
var beacon_5 = 0;
var beacon_6 = 0;
var beacon_27 = 0;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	imei = device.imei;
	//inAndOut();
	window.EstimoteBeacons.startRangingBeaconsInRegion(function () {
		setInterval(function(){
			window.EstimoteBeacons.getBeacons(function (beacons) {
				if (beacons.length == 0) {
					return false;	
				}
				updateNavListData(beacons);
				
				for (var i = 0; i < beacons.length; i++){
					if(beacons[i].minor == '1'){
						beacon_1 = beacons[i].accuracy;
						if (notiFlag1){
							notify1();
						}
					}else if(beacons[i].minor == '2'){
						beacon_2 = beacons[i].accuracy;
						if (notiFlag2){
							notify2();
						}
					}else if(beacons[i].minor == '3'){
						beacon_3 = beacons[i].accuracy;
						if (notiFlag3){
							notify3();
						}
					}else if(beacons[i].minor == '4'){
						beacon_4 = beacons[i].accuracy;
						if (notiFlag4){
							notify4(); 
						}
					}else if(beacons[i].minor == '5'){
						beacon_5 = beacons[i].accuracy;
						if (notiFlag5){
							notify5();
						}
					}else if(beacons[i].minor == '6'){
						beacon_6 = beacons[i].accuracy;
						if (notiFlag6){
							notify6();
						}
					}else if(beacons[i].minor == '27'){
						beacon_27 = beacons[i].accuracy;
						if (notiFlag27){
							notify27();
						}
					}
				}
				
			});
		},1000);//0.1秒取一次值	,
	});
	//loopNotify();
	//document.addEventListener("pause", handleNotification , false);
	//document.addEventListener("resume", handleNotification, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
}

function showHide(obj, objToHide) {
	var el = $("#" + objToHide)[0];
	if (obj.className == "expanded") {
		obj.className = "collapsed";
	} else {
		obj.className = "expanded";
	}
	$(el).toggle();
}

function updateNavListData(beacons){
	//删除重新更新
	$("#navList li").each(function(n, elem){
		if(n != 0 && n != 1){
			$(elem).remove();
		}
	});
	var element = $('#navList li').eq(1);
	if (beacons.length == 0) {
		return false;	
	}
	
	for (var i = 0; i < beacons.length; i++){
		if (i == 0){
			element.find('p').eq(0).text("Minor: " + beacons[i].minor);
			element.find('p').eq(1).text("Accuracy: " + formatAccuracy(beacons[i].accuracy));
		}else {
			var newRow = element.clone(true);
			newRow.find('p').eq(0).text("Minor: " + beacons[i].minor);
			newRow.find('p').eq(1).text("Accuracy: " + formatAccuracy(beacons[i].accuracy));
			element.parent().append(newRow);
		}
	}
	//$("#available li").listview("refresh");
}
function formatAccuracy(meters) {
    if(meters > 1) {
        return meters.toFixed(3) + ' m';
    } else {
        return (meters * 100).toFixed(3) + ' cm';
    }
}
//处理前台和后台触发的事件
function handleNotification(){
	inAndOut();
}
//处理回退事件
function onBackKeyDown() {
    // Handle the back button
	navigator.app.clearHistory();
}


function inAndOut(){
	//alert('in');
	window.EstimoteBeacons.startMonitoringForRegion("MyUID1",23033, 65,function (content) {
		console.log(content);
		//alert('OK');
		sleep(1000);
    }, null);
}
//模拟阻塞函数
function sleep(n){
	var   start=new Date().getTime();
	while(true) if(new Date().getTime()-start> n)   break;
}


/****以下是测试用****/
function notify1(){
	if (beacon_1 > 0){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=1",
			success:function(data){
				notiFlag1 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor1",'minor1', 1, function(){
						notiFlag1 = false;
						//loopNotify1();
					});
				}
			},
			error: function(){
				notiFlag1 = false;
				/*
				window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor1", 'minor1', 1, function(){
					
				});
				*/
			}
		});
	}
}
function loopNotify1(){
	setInterval (function(){
		if (beacon_1 > 0){
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.scs.im/send_queues.json?beacon_id=1",
				success:function(data){
					for (var i = 0; i < data.length; i++){
						window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor1",'minor1', 1, function(){
							
						});
					}
				},
				error: function(){
					notiFlag1 = false;
					/*
					window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor1", 'minor1', 1, function(){
						
					});
					*/
				}
			});
		}
	}, 1000*120);
}
function notify2(){
	if (beacon_2 <= 1 && beacon_2 > 0){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=2",
			success:function(data){
				notiFlag2 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor2",'minor2', 2, function(){
						notiFlag2 = false;
						loopNotify2();
					});
				}
			},
			error: function(){
				notiFlag2 = false;
				/*
				window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor2", 'minor2', 2, function(){
					
				});
				*/
			}
		});
	}
}
function loopNotify2(){
	setInterval (function(){
		if (beacon_2 <= 1 && beacon_2 > 0){
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.scs.im/send_queues.json?beacon_id=2",
				success:function(data){
					notiFlag2 = false;
					for (var i = 0; i < data.length; i++){
						window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor2",'minor2', 2, function(){
							notiFlag2 = false;
						});
					}
				},
				error: function(){
					notiFlag2 = false;
					/*
					window.EstimoteBeacons.notify("二号基站消息", '二折促销', "com.showingcloud.mynotification.MyNotificationMinor2", 'minor2', 2, function(){
						
					});
					*/
				}
			});
		}
	}, 1000*120);
}
function notify3(){
	if (beacon_3 <= 1 && beacon_3 > 0){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=3",
			success:function(data){
				notiFlag3 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor3",'minor3', 3, function(){
						notiFlag3 = false;
						loopNotify3();
					});
				}
			},
			error: function(){
				notiFlag3 = false;
				/*
				window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor3", 'minor3', 3, function(){
					
				});
				*/
			}
		});
	}
}
function loopNotify3(){
	setInterval (function(){
		if (beacon_3 <= 1 && beacon_3 > 0){
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.scs.im/send_queues.json?beacon_id=3",
				success:function(data){
					notiFlag3 = false;
					for (var i = 0; i < data.length; i++){
						window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor3",'minor3', 3, function(){
							
						});
					}
				},
				error: function(){
					notiFlag3 = false;
					/*
					window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor3", 'minor3', 3, function(){
						
					});
					*/
				}
			});
		}
	}, 1000*120);
}
function notify4(){
	if (beacon_4 <= 0.3 && beacon_4 > 0){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=4",
			success:function(data){
				notiFlag4 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor4",'minor4', 4, function(){
						notiFlag4 = false;
						loopNotify4();
					});
				}
			},
			error: function(){
				notiFlag4 = false;
				/*
				window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor4", 'minor4', 4, function(){
					
				});
				*/
			}
		});
	}
}
function loopNotify4(){
	setInterval (function(){
		if (beacon_4 <= 0.3 && beacon_4 > 0){
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.scs.im/send_queues.json?beacon_id=4",
				success:function(data){
					for (var i = 0; i < data.length; i++){
						window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor4",'minor4', 4, function(){
							
						});
					}
				},
				error: function(){
					notiFlag4 = false;
					/*
					window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor4", 'minor4', 4, function(){
						
					});
					*/
				}
			});
		}
	}, 1000*120);
}
function notify5(){
	if (beacon_5 <= 3 && beacon_5 > 0){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=5",
			success:function(data){
				notiFlag5 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor5",'minor5', 5, function(){
						notiFlag5 = false;
						loopNotify5();
					});
				}
			},
			error: function(){
				notiFlag5 = false;
				/*
				window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor5", 'minor5', 5, function(){
					
				});
				*/
			}
		});
	}
}
function loopNotify5(){
setInterval (function(){
		if (beacon_5 <= 3 && beacon_5 > 0){
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.scs.im/send_queues.json?beacon_id=5",
				success:function(data){
					notiFlag5 = false;
					for (var i = 0; i < data.length; i++){
						window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor5",'minor5', 5, function(){
							notiFlag5 = false;
						});
					}
				},
				error: function(){
					notiFlag5 = false;
					/*
					window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor5", 'minor5', 5, function(){
						
					});
					*/
				}
			});
		}
	}, 1000*120);
}
function notify6(){
	if (beacon_6 <= 10 && beacon_6 > 0){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=6",
			success:function(data){
				notiFlag6 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor6",'minor6', 6, function(){
						notiFlag6 = false;
						loopNotify6();
					});
				}
			},
			error: function(){
				notiFlag6 = false;
				/*
				window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor6", 'minor6', 6, function(){
					
				});
				*/
			}
		});
	}
}
function loopNotify6(){
	setInterval (function(){
		if (beacon_6 <= 10 && beacon_6 > 0){
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.scs.im/send_queues.json?beacon_id=6",
				success:function(data){
					notiFlag6 = false;
					for (var i = 0; i < data.length; i++){
						window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor6",'minor6', 6, function(){
							notiFlag6 = false;
						});
					}
				},
				error: function(){
					notiFlag6 = false;
					/*
					window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor6", 'minor6', 6, function(){
						
					});
					*/
				}
			});
		}
	}, 1000*120);
}


function notify27(){
	if (beacon_27 <= 2 && beacon_27 > 0){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=27",
			success:function(data){
				notiFlag6 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor27",'minor27', 27, function(){
						notiFlag27 = false;
						loopNotify27();
					});
				}
			},
			error: function(){
				notiFlag27 = false;
				/*
				window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor27", 'minor27', 27, function(){
					
				});
				*/
			}
		});
	}
}
function loopNotify27(){
	setInterval (function(){
		if (beacon_27 <= 2 && beacon_27 > 0){
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.scs.im/send_queues.json?beacon_id=27",
				success:function(data){
					notiFlag27 = false;
					for (var i = 0; i < data.length; i++){
						window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationMinor27",'minor27', 27, function(){
							notiFlag27 = false;
						});
					}
				},
				error: function(){
					notiFlag27 = false;
					/*
					window.EstimoteBeacons.notify("一号基站消息", '一折促销', "com.showingcloud.mynotification.MyNotificationMinor27", 'minor27', 27, function(){
						
					});
					*/
				}
			});
		}
	}, 1000*120);
}

