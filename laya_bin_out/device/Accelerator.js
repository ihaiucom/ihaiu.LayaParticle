

/**
*加速度x/y/z的单位均为m/s²。
*在硬件（陀螺仪）不支持的情况下，alpha、beta和gamma值为null。
*
*@author Survivor
*/

//class laya.device.motion.Accelerator extends laya.events.EventDispatcher
var Accelerator=(function(_super){
	function Accelerator(singleton){
		Accelerator.__super.call(this);
		/*__JS__ */this.onDeviceOrientationChange=this.onDeviceOrientationChange.bind(this);
	}

	__class(Accelerator,'laya.device.motion.Accelerator',_super);
	var __proto=Accelerator.prototype;
	/**
	*侦听加速器运动。
	*@param observer 回调函数接受4个参数，见类说明。
	*/
	__proto.on=function(type,caller,listener,args){
		_super.prototype.on.call(this,type,caller,listener,args);
		Browser.window.addEventListener('devicemotion',this.onDeviceOrientationChange);
		return this;
	}

	/**
	*取消侦听加速器。
	*@param handle 侦听加速器所用处理器。
	*/
	__proto.off=function(type,caller,listener,onceOnly){
		(onceOnly===void 0)&& (onceOnly=false);
		if (!this.hasListener(type))
			Browser.window.removeEventListener('devicemotion',this.onDeviceOrientationChange)
		return _super.prototype.off.call(this,type,caller,listener,onceOnly);
	}

	__proto.onDeviceOrientationChange=function(e){
		var interval=e.interval;
		Accelerator.acceleration.x=e.acceleration.x;
		Accelerator.acceleration.y=e.acceleration.y;
		Accelerator.acceleration.z=e.acceleration.z;
		Accelerator.accelerationIncludingGravity.x=e.accelerationIncludingGravity.x;
		Accelerator.accelerationIncludingGravity.y=e.accelerationIncludingGravity.y;
		Accelerator.accelerationIncludingGravity.z=e.accelerationIncludingGravity.z;
		Accelerator.rotationRate.alpha=e.rotationRate.gamma *-1;
		Accelerator.rotationRate.beta=e.rotationRate.alpha *-1;
		Accelerator.rotationRate.gamma=e.rotationRate.beta;
		if (Browser.onAndroid){
			if (Accelerator.onChrome){
				Accelerator.rotationRate.alpha *=180 / Math.PI;
				Accelerator.rotationRate.beta *=180 / Math.PI;
				Accelerator.rotationRate.gamma *=180 / Math.PI;
			}
			Accelerator.acceleration.x *=-1;
			Accelerator.accelerationIncludingGravity.x *=-1;
		}
		else if (Browser.onIOS){
			Accelerator.acceleration.y *=-1;
			Accelerator.acceleration.z *=-1;
			Accelerator.accelerationIncludingGravity.y *=-1;
			Accelerator.accelerationIncludingGravity.z *=-1;
			interval *=1000;
		}
		this.event(/*laya.events.Event.CHANGE*/"change",[Accelerator.acceleration,Accelerator.accelerationIncludingGravity,Accelerator.rotationRate,interval]);
	}

	__getset(1,Accelerator,'instance',function(){Accelerator._instance=Accelerator._instance|| new Accelerator(0)
		return Accelerator._instance;
	},laya.events.EventDispatcher._$SET_instance);

	Accelerator.getTransformedAcceleration=function(acceleration){Accelerator.transformedAcceleration=Accelerator.transformedAcceleration|| new AccelerationInfo();
		Accelerator.transformedAcceleration.z=acceleration.z;
		if (Browser.window.orientation==90){
			Accelerator.transformedAcceleration.x=acceleration.y;
			Accelerator.transformedAcceleration.y=-acceleration.x;
		}
		else if (Browser.window.orientation==-90){
			Accelerator.transformedAcceleration.x=-acceleration.y;
			Accelerator.transformedAcceleration.y=acceleration.x;
		}
		else if (!Browser.window.orientation){
			Accelerator.transformedAcceleration.x=acceleration.x;
			Accelerator.transformedAcceleration.y=acceleration.y;
		}
		else if (Browser.window.orientation==180){
			Accelerator.transformedAcceleration.x=-acceleration.x;
			Accelerator.transformedAcceleration.y=-acceleration.y;
		};
		var tx=NaN;
		if (Laya.stage.canvasDegree==-90){
			tx=Accelerator.transformedAcceleration.x;
			Accelerator.transformedAcceleration.x=-Accelerator.transformedAcceleration.y;
			Accelerator.transformedAcceleration.y=tx;
		}
		else if (Laya.stage.canvasDegree==90){
			tx=Accelerator.transformedAcceleration.x;
			Accelerator.transformedAcceleration.x=Accelerator.transformedAcceleration.y;
			Accelerator.transformedAcceleration.y=-tx;
		}
		return Accelerator.transformedAcceleration;
	}

	Accelerator._instance=null;
	Accelerator.transformedAcceleration=null;
	__static(Accelerator,
	['acceleration',function(){return this.acceleration=new AccelerationInfo();},'accelerationIncludingGravity',function(){return this.accelerationIncludingGravity=new AccelerationInfo();},'rotationRate',function(){return this.rotationRate=new RotationInfo();},'onChrome',function(){return this.onChrome=(Browser.userAgent.indexOf("Chrome")>-1);}
	]);
	return Accelerator;
})(EventDispatcher)

