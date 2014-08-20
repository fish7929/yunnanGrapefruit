var notiFlag1 = true;
var notiFlag2 = true;
var notiFlag3 = true;
var notiFlag4 = true;
var notiFlag5 = true;
var notiFlag6 = true;
var notiFlag27 = true;
var notiFlag65 = true;
var imei; //获取手机的imei号码


document.addEventListener("deviceready", onDeviceReady, false);
//document.addEventListener("backbutton", onBackKeyDown, false);
function onDeviceReady(){
	//imei = device.imei;
	//inAndOut();
	//开启蓝牙
	bluetoothle.initialize(function(data){
		window.EstimoteBeacons.startRangingBeaconsInRegion(function () {
			setInterval(function(){
				window.EstimoteBeacons.getBeacons(function (beacons) {
					if (beacons.length == 0) {
						return false;	
					}
					updateNavListData(beacons);
					
					for (var i = 0; i < beacons.length; i++){
						//beacons[i].minor为字符串
						//beacons[i].accuracy为浮点数
						setData(beacons[i].minor, beacons[i].accuracy);
						newNotify(beacons[i].minor);
					}
					
				});
			},1000);//1秒取一次值	,
		});
	}, function(){}, {"request":true});
	
	//document.addEventListener("pause", handleNotification , false);
	//document.addEventListener("resume", handleNotification, false);
	//消息点击事件
	window.plugin.notification.local.onclick = function (id, state, json) {
		window.plugin.notification.local.cancel(id);
		var imgUrl = JSON.parse(json).imgUrl
		if( window.location.hash == "#notification"){
			$.ui.updatePanel("#notification", "<div class='showDiv'><img src="+imgUrl+" id='showMinor' /><p id='coupon'></p><div class='showDate'><p id='activeDate'></p></div></div>");
		}else{
			setData("imgUrl", imgUrl);
			$.ui.loadContent("#notification");
		}
	}
	
	//设置本地通知的默认图标和音乐
	window.plugin.notification.local.setDefaults({ 
		icon: 'beacon_gray'
	});
	
	document.addEventListener("backbutton", onBackKeyDown, false);
}
//更新列表
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
//转换距离单位
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
	//alert("back");
	if( window.location.hash == "#main" || window.location.hash==""){
		navigator.notification.confirm("是否退出应用", confirmMsg, "退出程序", "确认,取消"); //退出程序
	}else{
		navigator.app.backHistory();
	}
	//navigator.app.clearHistory();
	//alert("end");
}

function exitApp() {
	navigator.app.exitApp();
}
function confirmMsg(button){  
	if(button == 1){
		exitApp();
	}
}

//开启监听进出蓝牙基站区域
function inAndOut(){
	//alert('in');
	window.EstimoteBeacons.startMonitoringForRegion("MyUID1",23033, 1,function (content) {
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

function newNotify(id){
	var distance = getData(id);
	switch(id){
		case 1:
			if (notiFlag1){
				if (distance <= 1 && distance > 0){
					asyncNotify(1);
					loopNewNotify(1, 1, 1000*120);
					notiFlag1 = false;
				}
			}
			break;
		case 2:
			if (notiFlag2){
				if (distance <= 1 && distance > 0){
					asyncNotify(2);
					loopNewNotify(2, 1, 1000*120);
					notiFlag2 = false;
				}
			}
			break;
		case 3:
			if(notiFlag3){
				if (distance <= 1 && distance > 0){
					asyncNotify(3);
					loopNewNotify(3, 1, 1000*120);
					notiFlag3 = false;
				}
			}
			break;
		case 4:
			if(notiFlag4){
				if (distance <= 0.3 && distance > 0){
					asyncNotify(4);
					loopNewNotify(4, 0.3, 1000*120);
					notiFlag4 = false;
				}
			}
			break;
		case 5:
			if(notiFlag5){
				if (distance <= 3 && distance > 0){
					asyncNotify(5);
					loopNewNotify(5, 3, 1000*120);
					notiFlag5 = false;
				}
			}
			break;
		case 6:
			if(notiFlag6){
				if (distance <= 0.3 && distance > 0){
					asyncNotify(6);
					loopNewNotify(6, 0.3, 1000*120);
					notiFlag6 = false;
				}
			}
			break;
		case 27:
			if(notiFlag27){
				//alert("27");
				if (distance <= 1 && distance > 0){
					asyncNotify(27);
					loopNewNotify(27, 1, 1000*120);
					notiFlag27 = false;
				}
			}
			break;
		case 65:
			if(notiFlag65){
				//alert("65");
				if (distance <= 1 && distance > 0){
					asyncNotify(65);
					loopNewNotify(65, 1, 1000*120);
					notiFlag65 = false;
				}
			}
			break;
	}
}

//参数表示蓝牙基站的minor值
function  asyncNotify(id){
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"http://yujin.scs.im/send_queues.json?beacon_id="+id,
		success:function(data){
			for (var i = 0; i < data.length; i++){
				var url = "http://" + data[i].image_url
				window.plugin.notification.local.add({
					id:         id,
					title:   	data[i].msg_title,
					message:    data[i].msg_summary,
					json:       JSON.stringify({ imgUrl: url })
				});
			}
			setData(id+'_time', Date.now());
		},
		error: function(){
			window.plugin.notification.local.add({
				id:         id,
				title:   	"蓝牙推送",
				message:    '促销活动',
				json:       JSON.stringify({ imgUrl: './img/demo.jpg' })
			});
			setData(id+'_time', Date.now());
		}
	});
}

//设置循环提醒
//参数表示:id-->蓝牙基站的minor值, distance-->表示距离蓝牙基站的间隔, interval-->表示循环推送的间隔时间
function loopNewNotify(id, distance,interval){
	setInterval (function(){
		if (getData(id+'_time') != null &&  Date.now() - getData(id+'_time') >= interval){
			if (getData(id) <= distance && getData(id) > 0){
				asyncNotify(id);
			}
		}
	}, 1000);
}
