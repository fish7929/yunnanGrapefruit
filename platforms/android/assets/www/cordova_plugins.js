cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.antxman.estimotebeacons/www/EstimoteBeacons.js",
        "id": "com.antxman.estimotebeacons.EstimoteBeacons",
        "clobbers": [
            "EstimoteBeacons"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.antxman.estimotebeacons": "0.9",
    "org.apache.cordova.device": "0.2.9"
}
// BOTTOM OF METADATA
});