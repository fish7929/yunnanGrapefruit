package com.showingcloud.mynotification;
import org.apache.cordova.DroidGap;

import android.os.Bundle;

@SuppressWarnings("deprecation")
public class MyNotificationBeacon extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//setContentView(R.layout.activity_beacons);
		//loading notification GUI
		
		String status = this.getIntent().getStringExtra("status");
		int beacon_id = this.getIntent().getIntExtra("beacon_id", 0);
		if (status == "minor"){
			super.loadUrl("file:///android_asset/www/beacon.html");
		}else{
			super.loadUrl(status);
		}
		
	}
}