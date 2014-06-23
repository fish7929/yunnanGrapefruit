var notiFlag2 = true;
var notiFlag3 = true;
var imei; //获取手机的imei号码
var beacon_2 = 0;
var beacon_3 = 0;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	imei = device.imei;
	inAndOut();
	window.EstimoteBeacons.startRangingBeaconsInRegion(function () {
		setInterval(function(){
			window.EstimoteBeacons.getBeacons(function (beacons) {
				if (beacons.length == 0) {
					return false;	
				}
				updateNavListData(beacons);
				
				for (var i = 0; i < beacons.length; i++){
					if(beacons[i].minor == '2'){
						beacon_2 = beacons[i].accuracy;
						if (notiFlag2){
							notify();
						}
					}else if(beacons[i].minor == '3'){
						beacon_3 = beacons[i].accuracy;
						if (notiFlag3){
							notify();
						}
					}
				}
				
			});
		},1000);//0.1秒取一次值	,
	});
	loopNotify();
	//notify();
	//document.addEventListener("pause", handleNotification , false);
	//document.addEventListener("resume", handleNotification, false);
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

function notify(){
	if (beacon_2 <= 0.5){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=2",
			success:function(data){
				//alert("222___success");
				notiFlag2 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationAdidas",'adidas', 222, function(){
						
					});
				}
				
			},
			error: function(){
				notiFlag2 = false;
				window.EstimoteBeacons.notify("二号基站消息", '2折促销', "com.showingcloud.mynotification.MyNotificationAdidas",'adidas', 222, function(){
					
				});
			}
		});
	}
	if (beacon_3 <= 0.5){
		$.ajax({
			type:"GET",
			dataType:'json',
			url:"http://yujin.scs.im/send_queues.json?beacon_id=3",
			success:function(data){
				notiFlag3 = false;
				for (var i = 0; i < data.length; i++){
					window.EstimoteBeacons.notify(data[i].msg_title, data[i].msg_summary, "com.showingcloud.mynotification.MyNotificationNike",'nike', 333, function(){
						
					});
				}
			},
			error: function(){
				notiFlag3 = false;
				window.EstimoteBeacons.notify("三号基站消息", '3折促销', "com.showingcloud.mynotification.MyNotificationNike", 'nike', 333, function(){
					
				});
			}
		});
	}
}

//重复发送
function loopNotify(){
	setInterval (function(){
		notify();
	}, 1000*120);
}






