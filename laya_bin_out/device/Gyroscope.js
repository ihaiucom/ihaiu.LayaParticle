//class laya.device.motion.Gyroscope extends laya.events.EventDispatcher
var Gyroscope=(function(_super){
	function Gyroscope(singleton){
		Gyroscope.__super.call(this);
		/*__JS__ */this.onDeviceOrientationChange=this.onDeviceOrientationChange.bind(this);
	}

	__class(Gyroscope,'laya.device.motion.Gyroscope',_super);
	var __proto=Gyroscope.prototype;
	/**
	*监视陀螺仪运动。
	*@param observer 回调函数接受一个Boolean类型的<code>absolute</code>和<code>GyroscopeInfo</code>类型参数。
	*/
	__proto.on=function(type,caller,listener,args){
		_super.prototype.on.call(this,type,caller,listener,args);
		Browser.window.addEventListener('deviceorientation',this.onDeviceOrientationChange);
		return this;
	}

	/**
	*取消指定处理器对陀螺仪的监视。
	*@param observer
	*/
	__proto.off=function(type,caller,listener,onceOnly){
		(onceOnly===void 0)&& (onceOnly=false);
		if (!this.hasListener(type))
			Browser.window.removeEventListener('deviceorientation',this.onDeviceOrientationChange);
		return _super.prototype.off.call(this,type,caller,listener,onceOnly);
	}

	__proto.onDeviceOrientationChange=function(e){
		Gyroscope.info.alpha=e.alpha;
		Gyroscope.info.beta=e.beta;
		Gyroscope.info.gamma=e.gamma;
		if (e.webkitCompassHeading){
			Gyroscope.info.alpha=e.webkitCompassHeading *-1;
			Gyroscope.info.compassAccuracy=e.webkitCompassAccuracy;
		}
		this.event(/*laya.events.Event.CHANGE*/"change",[e.absolute,Gyroscope.info]);
	}

	__getset(1,Gyroscope,'instance',function(){Gyroscope._instance=Gyroscope._instance|| new Gyroscope(0);
		return Gyroscope._instance;
	},laya.events.EventDispatcher._$SET_instance);

	Gyroscope._instance=null;
	__static(Gyroscope,
	['info',function(){return this.info=new RotationInfo();}
	]);
	return Gyroscope;
})(EventDispatcher)
