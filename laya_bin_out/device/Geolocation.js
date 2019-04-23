
/**
*使用Gyroscope.instance获取唯一的Gyroscope引用，请勿调用构造函数。
*
*<p>
*listen()的回调处理器接受两个参数：
*<code>function onOrientationChange(absolute:Boolean,info:RotationInfo):void</code>
*<ol>
*<li><b>absolute</b>:指示设备是否可以提供绝对方位数据（指向地球坐标系），或者设备决定的任意坐标系。关于坐标系参见<i>https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained</i>。</li>
*<li><b>info</b>:<code>RotationInfo</code>类型参数，保存设备的旋转值。</li>
*</ol>
*</p>
*
*<p>
*浏览器兼容性参见：<i>http://caniuse.com/#search=deviceorientation</i>
*</p>
*/

//class laya.device.geolocation.Geolocation
var Geolocation=(function(){
	function Geolocation(){}
	__class(Geolocation,'laya.device.geolocation.Geolocation');
	Geolocation.getCurrentPosition=function(onSuccess,onError){
		Geolocation.navigator.geolocation.getCurrentPosition(function(pos){
			Geolocation.position.setPosition(pos);
			onSuccess.runWith(Geolocation.position);
		},
		function(error){
			onError.runWith(error);
			},{
			enableHighAccuracy :laya.device.geolocation.Geolocation.enableHighAccuracy,
			timeout :laya.device.geolocation.Geolocation.timeout,
			maximumAge :laya.device.geolocation.Geolocation.maximumAge
		});
	}

	Geolocation.watchPosition=function(onSuccess,onError){
		return Geolocation.navigator.geolocation.watchPosition(function(pos){
			Geolocation.position.setPosition(pos);
			onSuccess.runWith(Geolocation.position);
		},
		function(error){
			onError.runWith(error);
			},{
			enableHighAccuracy :Geolocation.enableHighAccuracy,
			timeout :Geolocation.timeout,
			maximumAge :Geolocation.maximumAge
		});
	}

	Geolocation.clearWatch=function(id){
		Geolocation.navigator.geolocation.clearWatch(id);
	}

	Geolocation.PERMISSION_DENIED=1;
	Geolocation.POSITION_UNAVAILABLE=2;
	Geolocation.TIMEOUT=3;
	Geolocation.enableHighAccuracy=false;
	Geolocation.maximumAge=0;
	__static(Geolocation,
	['navigator',function(){return this.navigator=Browser.window.navigator;},'position',function(){return this.position=new GeolocationInfo();},'supported',function(){return this.supported=!!Geolocation.navigator.geolocation;},'timeout',function(){return this.timeout=1E10;}
	]);
	return Geolocation;
})()
