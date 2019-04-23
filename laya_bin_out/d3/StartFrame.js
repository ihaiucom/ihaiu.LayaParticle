/**
*<code>StartFrame</code> 类用于创建开始帧。
*/
//class laya.d3.core.particleShuriKen.module.StartFrame
var StartFrame=(function(){
	function StartFrame(){
		/**@private */
		this._type=0;
		/**@private */
		this._constant=NaN;
		/**@private */
		this._constantMin=NaN;
		/**@private */
		this._constantMax=NaN;
	}

	__class(StartFrame,'laya.d3.core.particleShuriKen.module.StartFrame');
	var __proto=StartFrame.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destStartFrame=destObject;
		destStartFrame._type=this._type;
		destStartFrame._constant=this._constant;
		destStartFrame._constantMin=this._constantMin;
		destStartFrame._constantMax=this._constantMax;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destStartFrame=/*__JS__ */new this.constructor();
		this.cloneTo(destStartFrame);
		return destStartFrame;
	}

	/**
	*固定帧。
	*/
	__getset(0,__proto,'constant',function(){
		return this._constant;
	});

	/**
	*开始帧类型,0常量模式，1随机双常量模式。
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	/**
	*最小固定帧。
	*/
	__getset(0,__proto,'constantMin',function(){
		return this._constantMin;
	});

	/**
	*最大固定帧。
	*/
	__getset(0,__proto,'constantMax',function(){
		return this._constantMax;
	});

	StartFrame.createByConstant=function(constant){
		var rotationOverLifetime=new StartFrame();
		rotationOverLifetime._type=0;
		rotationOverLifetime._constant=constant;
		return rotationOverLifetime;
	}

	StartFrame.createByRandomTwoConstant=function(constantMin,constantMax){
		var rotationOverLifetime=new StartFrame();
		rotationOverLifetime._type=1;
		rotationOverLifetime._constantMin=constantMin;
		rotationOverLifetime._constantMax=constantMax;
		return rotationOverLifetime;
	}

	return StartFrame;
})()


/**
*@private

*/