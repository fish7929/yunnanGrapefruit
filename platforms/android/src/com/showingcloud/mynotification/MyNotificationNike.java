package com.showingcloud.mynotification;
import org.apache.cordova.DroidGap;

import android.os.Bundle;

@SuppressWarnings("deprecation")
public class MyNotificationNike extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//setContentView(R.layout.activity_beacons);
		//loading notification GUI
		String status = this.getIntent().getStringExtra("status");
		super.loadUrl("file:///android_asset/www/nike.html");
	}
}