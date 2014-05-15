var carousel;
var notiFlag2 = false;
var notiFlag3 = false;
var imei; //获取手机的imei号码
function init_carousel() {
	carousel=$("#carousel").carousel({
		pagingDiv: "carousel_dots",
		pagingCssName: "carousel_paging2",
		pagingCssNameSelected: "carousel_paging2_selected",
		preventDefaults:false,
		wrap:true //Set to false to disable the wrap around
	});
}
//window.addEventListener("load", init_carousel, false);

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	//init_carousel();
	imei = device.imei;
	/*
	$.ajax({
		type:"GET",
		dataType:'json',
		url:"http://yujin.wgq.me/coupons/checkcoupon.json?coupon=testcoupon0001&sku=0001",
		success:function(data){
			alert('coupon: ' + data.coupon + "\n\n" + 
			'discount: ' + data.discount + "\n\n" + 
			'uuid: ' + data.uuid + "\n\n"
			);
		}
	});
	*/
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
						if (beacons[i].accuracy <= 0.5){
							//推送消息
							//window.EstimoteBeacons.notify("Minor 2", '5 discount', "com.showingcloud.mynotification.MyNotificationAdidas",'adidas', 222, function(){});
							notiFlag2 = true;
						}else{
							notiFlag2 = false;
						}
					}else if(beacons[i].minor == '3'){
						if (beacons[i].accuracy <= 0.5){
							//推送消息
							//window.EstimoteBeacons.notify("Minor 3", '2 discount', "com.showingcloud.mynotification.MyNotificationNike", 'nike', 333, function(){});
							notiFlag3 = true;
						}else{
							notiFlag3 = false;
						}
					}
				}
				
			});
			
		},1000);//0.1秒取一次值	,
	});
	notify();
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
		//alert($(elem).text());
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
	//alert(meters + "type: " +typeof(meters));
    if(meters > 1) {
    	//alert(meters + "type: " +typeof(meters));
        return meters.toFixed(3) + ' m';
    } else {
    	//alert(meters + "type: "+ typeof(meters));
        return (meters * 100).toFixed(3) + ' cm';
    }
}

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
	setInterval (function(){
		if (notiFlag2){
		/*
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.wgq.me/coupons/checkcoupon.json?coupon=testcoupon0001&sku=0001",
				success:function(data){
					window.EstimoteBeacons.notify(data.uuid, '5 discount', "com.showingcloud.mynotification.MyNotificationAdidas",'adidas', 222, function(){
						notiFlag2 = false;
					});
				}
			});
			*/
			window.EstimoteBeacons.notify("adidas", '5 discount', "com.showingcloud.mynotification.MyNotificationAdidas",'adidas', 222, function(){
				notiFlag2 = false;
			});
		}
		if (notiFlag3){
			/*
			$.ajax({
				type:"GET",
				dataType:'json',
				url:"http://yujin.wgq.me/coupons/checkcoupon.json?coupon=testcoupon0001&sku=0001",
				success:function(data){
					window.EstimoteBeacons.notify(data.uuid, '2 discount', "com.showingcloud.mynotification.MyNotificationNike", 'nike', 333, function(){
						notiFlag3 = false;
					});
				}
			});
			*/
			window.EstimoteBeacons.notify("nike", '2 discount', "com.showingcloud.mynotification.MyNotificationNike", 'nike', 333, function(){
				notiFlag3 = false;
			});
		}
	}, 5000);
}

