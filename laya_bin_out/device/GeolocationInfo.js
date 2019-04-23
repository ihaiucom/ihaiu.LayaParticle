//class laya.device.geolocation.GeolocationInfo
var GeolocationInfo=(function(){
	function GeolocationInfo(){
		this.pos=null;
		this.coords=null;
	}

	__class(GeolocationInfo,'laya.device.geolocation.GeolocationInfo');
	var __proto=GeolocationInfo.prototype;
	__proto.setPosition=function(pos){
		this.pos=pos;
		this.coords=pos.coords;
	}

	__getset(0,__proto,'heading',function(){
		return this.coords.heading;
	});

	__getset(0,__proto,'latitude',function(){
		return this.coords.latitude;
	});

	__getset(0,__proto,'altitudeAccuracy',function(){
		return this.coords.altitudeAccuracy;
	});

	__getset(0,__proto,'longitude',function(){
		return this.coords.longitude;
	});

	__getset(0,__proto,'altitude',function(){
		return this.coords.altitude;
	});

	__getset(0,__proto,'accuracy',function(){
		return this.coords.accuracy;
	});

	__getset(0,__proto,'speed',function(){
		return this.coords.speed;
	});

	__getset(0,__proto,'timestamp',function(){
		return this.pos.timestamp;
	});

	return GeolocationInfo;
})()
