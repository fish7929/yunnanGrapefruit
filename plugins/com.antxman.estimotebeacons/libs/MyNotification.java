package com.showingcloud.mynotification;
import org.apache.cordova.DroidGap;

import android.os.Bundle;

@SuppressWarnings("deprecation")
public class MyNotification extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//setContentView(R.layout.activity_beacons);
		//loading notification GUI
		
		String status = this.getIntent().getStringExtra("status");
		if (("entry").equalsIgnoreCase(status)){
			super.loadUrl("file:///android_asset/www/entry.html");
		}else if(("exit").equalsIgnoreCase(status)){
			super.loadUrl("file:///android_asset/www/exit.html");
		}
		
		//super.loadUrl("file:///android_asset/www/in.html");
	}
}