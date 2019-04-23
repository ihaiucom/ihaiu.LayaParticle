

/**
*Shake只能在支持此操作的设备上有效。
*
*@author Survivor
*/

//class laya.device.Shake extends laya.events.EventDispatcher
var Shake=(function(_super){
	function Shake(){
		this.throushold=0;
		this.shakeInterval=0;
		this.callback=null;
		this.lastX=NaN;
		this.lastY=NaN;
		this.lastZ=NaN;
		this.lastMillSecond=NaN;
		Shake.__super.call(this);
	}

	__class(Shake,'laya.device.Shake',_super);
	var __proto=Shake.prototype;
	/**
	*开始响应设备摇晃。
	*@param throushold 响应的瞬时速度阈值，轻度摇晃的值约在5~10间。
	*@param timeout 设备摇晃的响应间隔时间。
	*@param callback 在设备摇晃触发时调用的处理器。
	*/
	__proto.start=function(throushold,interval){
		this.throushold=throushold;
		this.shakeInterval=interval;
		this.lastX=this.lastY=this.lastZ=NaN;
		Accelerator.instance.on(/*laya.events.Event.CHANGE*/"change",this,this.onShake);
	}

	/**
	*停止响应设备摇晃。
	*/
	__proto.stop=function(){
		Accelerator.instance.off(/*laya.events.Event.CHANGE*/"change",this,this.onShake);
	}

	__proto.onShake=function(acceleration,accelerationIncludingGravity,rotationRate,interval){
		if(isNaN(this.lastX)){
			this.lastX=accelerationIncludingGravity.x;
			this.lastY=accelerationIncludingGravity.y;
			this.lastZ=accelerationIncludingGravity.z;
			this.lastMillSecond=Browser.now();
			return;
		};
		var deltaX=Math.abs(this.lastX-accelerationIncludingGravity.x);
		var deltaY=Math.abs(this.lastY-accelerationIncludingGravity.y);
		var deltaZ=Math.abs(this.lastZ-accelerationIncludingGravity.z);
		if(this.isShaked(deltaX,deltaY,deltaZ)){
			var deltaMillSecond=Browser.now()-this.lastMillSecond;
			if (deltaMillSecond > this.shakeInterval){
				this.event(/*laya.events.Event.CHANGE*/"change");
				this.lastMillSecond=Browser.now();
			}
		}
		this.lastX=accelerationIncludingGravity.x;
		this.lastY=accelerationIncludingGravity.y;
		this.lastZ=accelerationIncludingGravity.z;
	}

	// 通过任意两个分量判断是否满足摇晃设定。
	__proto.isShaked=function(deltaX,deltaY,deltaZ){
		return (deltaX > this.throushold && deltaY > this.throushold)||
		(deltaX > this.throushold && deltaZ > this.throushold)||
		(deltaY > this.throushold && deltaZ > this.throushold)
	}

	__getset(1,Shake,'instance',function(){Shake._instance=Shake._instance|| new Shake();
		return Shake._instance;
	},laya.events.EventDispatcher._$SET_instance);

	Shake._instance=null;
	return Shake;
})(EventDispatcher)


/**
*@private
*/
