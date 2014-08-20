package com.antxman.estimotebeacons;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.RemoteException;
import android.util.Log;

import com.estimote.sdk.Beacon;
import com.estimote.sdk.BeaconManager;
import com.estimote.sdk.Region;
import com.estimote.sdk.Utils;
import com.estimote.sdk.BeaconManager.MonitoringListener;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.json.JSONTokener;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import android.os.AsyncTask;
import android.os.RemoteException;
import android.telephony.TelephonyManager;

/**
 * Author: antxman
 * Class description
 */
public class EstimoteBeacons extends CordovaPlugin {

    public static final String START_ESTIMOTE_BEACONS_DISCOVERY_FOR_REGION = "startEstimoteBeaconsDiscoveryForRegion";
    public static final String STOP_ESTIMOTE_BEACON_DISCOVERY_FOR_REGION = "stopEstimoteBeaconsDiscoveryForRegion";

    public static final String START_RANGING_BEACONS_IN_REGION = "startRangingBeaconsInRegion";
    public static final String STOP_RANGING_BEACON_IN_REGION = "stopRangingBeaconsInRegion";
    
    public static final String START_MONITORING_FOR_REGION = "startMonitoringForRegion";
    public static final String STOP_MONITORING_FOR_REGION = "stopMonitoringForRegion";

    public static final String GET_BEACONS = "getBeacons";
    public static final String START_NOTIFY = "notify";
	//private static final int NOTIFICATION_ID = 147258;
    private BeaconManager iBeaconManager;

    private Region currentRegion;
    private Region myRegion;
    private List<Beacon> beacons = new ArrayList<Beacon>();
    private NotificationManager mNotificationManager; 
	
	private String imei = null;
	private TelephonyManager telephonyManager = null;
	private JSONObject obj = null;
	private JSONArray beaconsArray = null;

	private HttpResponse httpResponse = null;
	private HttpEntity httpEntity = null;
	private String content = null;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        Log.i("debug0....", "inner");
        iBeaconManager = new BeaconManager(this.cordova.getActivity().getApplicationContext());

        currentRegion = new Region("rid", null, null, null);
        
        mNotificationManager = (NotificationManager) (this.cordova.getActivity()).getSystemService(Context.NOTIFICATION_SERVICE); 
        // Default values: scanPeriod=1s, waitTime=0s
        // In order for this demo to be more responsive and immediate we lower down those values.
        //iBeaconManager.setForegroundScanPeriod(100, 0);
		iBeaconManager.setRangingListener(new BeaconManager.RangingListener() {
            @Override
            public void onBeaconsDiscovered(Region region, List<Beacon> beacons) {
				
                if (beacons == null || beacons.size() < 1) {

                } else {
                    EstimoteBeacons.this.beacons = beacons;
                }
            }
        });
		
		
		// Default values are 5s of scanning and 25s of waiting time to save CPU cycles.
        // In order for this demo to be more responsive and immediate we lower down those values.
        iBeaconManager.setBackgroundScanPeriod(TimeUnit.SECONDS.toMillis(1), 0);

        iBeaconManager.setMonitoringListener(new MonitoringListener() {
          @Override
          public void onEnteredRegion(Region region, List<Beacon> beacons) {
				try {
					beaconsArray = listToJSONArray(beacons);
				} catch (JSONException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				//requestServer();
				
				try {
					postNotification("Welcome", "Welcome here!", "com.showingcloud.mynotification.MyNotification", "entry", 111);
				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
          }

          @Override
          public void onExitedRegion(Region region) {
        	  Log.i("debug5....","Exited region");
			  /*
			try {
				postNotification("Exit", "Exited!", "com.showingcloud.mynotification.MyNotification", "exit", 111);
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			*/
		}
        });
		
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    	try {
            if (action.equalsIgnoreCase(START_ESTIMOTE_BEACONS_DISCOVERY_FOR_REGION)) {
                startEstimoteBeaconsDiscoveryForRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(STOP_ESTIMOTE_BEACON_DISCOVERY_FOR_REGION)) {
                stopEstimoteBeaconsDiscoveryForRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(START_RANGING_BEACONS_IN_REGION)) {
                startRangingBeaconsInRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(STOP_RANGING_BEACON_IN_REGION)) {
                stopRangingBeaconsInRegion();
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }
            
            if (action.equalsIgnoreCase(START_MONITORING_FOR_REGION)) {
				int minor = args.getInt(2);
				int major = args.getInt(1);
				String uid = args.getString(0);
				myRegion = new Region(uid, null, null, minor);
            	startMonitoringForRegion(minor, callbackContext);
                //callbackContext.success(callbackContext.getCallbackId());
                //callbackContext.success(content);
                return true;
            }

            if (action.equalsIgnoreCase(STOP_MONITORING_FOR_REGION)) {
            	stopMonitoringForRegion();
                callbackContext.success(callbackContext.getCallbackId());
                //callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

            if (action.equalsIgnoreCase(GET_BEACONS)) {
                Log.d(EstimoteBeacons.class.toString(), "beacons - >" + beacons);
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, listToJSONArray(beacons)));
                return true;
            }
			
			if (action.equalsIgnoreCase(START_NOTIFY)) {
				String title = args.getString(0);
				String body = args.getString(1);
				String className = args.getString(2);
				String status = args.getString(3);
				int id = args.getInt(4);
                postNotification(title, body, className, status, id);
                callbackContext.success(callbackContext.getCallbackId());
                return true;
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            callbackContext.error(e.getMessage());
            Log.d(EstimoteBeacons.class.toString(), e.getMessage());
            return false;
        }
        return false;
    }

    private void startEstimoteBeaconsDiscoveryForRegion() throws RemoteException {
        // TODO: stub
    }

    private void stopEstimoteBeaconsDiscoveryForRegion() throws RemoteException {
        // TODO: stub
    }
    
    private void startRangingBeaconsInRegion() throws RemoteException{
    	Log.i("debug1....", "inner");
        iBeaconManager.connect(new BeaconManager.ServiceReadyCallback(){
            @Override
            public void onServiceReady() {
                try {
                    iBeaconManager.startRanging(currentRegion);
                } catch (RemoteException re) {
                    Log.d(EstimoteBeacons.class.toString(), re.getMessage());
                }

            }
        });

    }
    

    private void stopRangingBeaconsInRegion() throws RemoteException{
        iBeaconManager.stopRanging(currentRegion);
    }
    
    private void startMonitoringForRegion(final int minor, CallbackContext callbackContext) throws RemoteException{
		
		Log.i("debug2....startMonitoring", "inner Monitoring");
		//mNotificationManager.cancel(NOTIFICATION_ID);
        iBeaconManager.connect(new BeaconManager.ServiceReadyCallback(){
            @Override
            public void onServiceReady() {
                try {
                    iBeaconManager.startMonitoring(myRegion);
                } catch (RemoteException re) {
                    Log.d(EstimoteBeacons.class.toString(), re.getMessage());
                }

            }
        });
		
		callbackContext.success(content);
    }

    private void stopMonitoringForRegion() throws RemoteException{
        iBeaconManager.stopMonitoring(myRegion);
    }



    /**
     * Convert list of beacons(@com.estimote.sdk.Beacon) to @JSONArray
     * @param beacons - list of beacons (@com.estimote.sdk.Beacon)
     * @return JSONArray
     * @throws JSONException
     */
    private JSONArray listToJSONArray(List<Beacon> beacons) throws JSONException{
        JSONArray jArray = new JSONArray();
        for (Beacon beacon : beacons) {
            jArray.put(beaconToJSONObject(beacon));
        }
        return jArray;
    }

    /**
     * Convert beacon (@com.estimote.sdk.Beacon) to @JSONObject
     * @param beacon - beacon(@com.estimote.sdk.Beacon)
     * @return JSONObject
     * @throws JSONException
     */
    private JSONObject beaconToJSONObject(Beacon beacon) throws JSONException{
        JSONObject object = new JSONObject();
        object.put("proximityUUID", beacon.getProximityUUID());
        object.put("major", beacon.getMajor());
        object.put("minor", beacon.getMinor());
        object.put("rssi", beacon.getRssi());
        object.put("accuracy", Utils.computeAccuracy(beacon)); 
        object.put("macAddress", beacon.getMacAddress());
        object.put("measuredPower", beacon.getMeasuredPower());
        return object;
    }
	
	/**
     *  Displays status bar notification
     * 
     *  @param contentText  Notification text
     * @throws ClassNotFoundException 
     * */ 
    private void postNotification(String title,String msg, String className, String status, int notifyId) throws ClassNotFoundException {
        //Intent notifyIntent = new Intent((Context) (this.cordova.getActivity()), this.cordova.getActivity().getClass());
        Intent notifyIntent = new Intent((Context) (this.cordova.getActivity()), Class.forName(className));
        notifyIntent.putExtra("status", status);
        notifyIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivities(
        	(Context) (this.cordova.getActivity()),
            0,
            new Intent[]{notifyIntent},
            PendingIntent.FLAG_UPDATE_CURRENT);
        int id = this.cordova.getActivity().getResources().getIdentifier("beacon_gray", "drawable", this.cordova.getActivity().getPackageName()); 
        Notification notification = new Notification.Builder((Context) (this.cordova.getActivity()))
            //.setSmallIcon(R.drawable.beacon_gray)
            .setSmallIcon(id)
            .setContentTitle(title)
            .setContentText(msg)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build();
        notification.defaults |= Notification.DEFAULT_SOUND;
        notification.defaults |= Notification.DEFAULT_LIGHTS;
        mNotificationManager.notify(notifyId, notification);
    }
	//
	private void requestServer(){
    	new AsyncTask<Void, Void, String>() {

			@Override
			protected String doInBackground(Void... params) {
				// TODO Auto-generated method stub
				
				//create HttpGet object
				HttpGet get = new HttpGet("http://yujin.wgq.me/coupons/checkcoupon.json?coupon=testcoupon0001&sku=0001");
				//create Http client object
				HttpClient httpClient = new DefaultHttpClient();
				//use httpClient send get request
				try {
					httpResponse = httpClient.execute(get);
					//server call back data
					httpEntity = httpResponse.getEntity();
					content = EntityUtils.toString(httpEntity);
				}catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				return content;
			}
			
			protected void onPostExecute(String result) {
				if(null != result){
					try {
						JSONTokener tokener = new JSONTokener(result);
						JSONObject obj = (JSONObject) tokener.nextValue();
						String uuid = obj.getString("uuid");
						try {
							postNotification("Entry 1", uuid, "com.showingcloud.mynotification.MyNotification", "entry", 111);
						} catch (ClassNotFoundException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}
			}
			
		}.execute();
    }
}
