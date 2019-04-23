/**
*<code>GradientVelocity</code> 类用于创建渐变速度。
*/
//class laya.d3.core.particleShuriKen.module.GradientVelocity
var GradientVelocity=(function(){
	function GradientVelocity(){
		/**@private */
		this._type=0;
		/**@private */
		this._constant=null;
		/**@private */
		this._gradientX=null;
		/**@private */
		this._gradientY=null;
		/**@private */
		this._gradientZ=null;
		/**@private */
		this._constantMin=null;
		/**@private */
		this._constantMax=null;
		/**@private */
		this._gradientXMin=null;
		/**@private */
		this._gradientXMax=null;
		/**@private */
		this._gradientYMin=null;
		/**@private */
		this._gradientYMax=null;
		/**@private */
		this._gradientZMin=null;
		/**@private */
		this._gradientZMax=null;
	}

	__class(GradientVelocity,'laya.d3.core.particleShuriKen.module.GradientVelocity');
	var __proto=GradientVelocity.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientVelocity=destObject;
		destGradientVelocity._type=this._type;
		this._constant.cloneTo(destGradientVelocity._constant);
		this._gradientX.cloneTo(destGradientVelocity._gradientX);
		this._gradientY.cloneTo(destGradientVelocity._gradientY);
		this._gradientZ.cloneTo(destGradientVelocity._gradientZ);
		this._constantMin.cloneTo(destGradientVelocity._constantMin);
		this._constantMax.cloneTo(destGradientVelocity._constantMax);
		this._gradientXMin.cloneTo(destGradientVelocity._gradientXMin);
		this._gradientXMax.cloneTo(destGradientVelocity._gradientXMax);
		this._gradientYMin.cloneTo(destGradientVelocity._gradientYMin);
		this._gradientYMax.cloneTo(destGradientVelocity._gradientYMax);
		this._gradientZMin.cloneTo(destGradientVelocity._gradientZMin);
		this._gradientZMax.cloneTo(destGradientVelocity._gradientZMax);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destGradientVelocity=/*__JS__ */new this.constructor();
		this.cloneTo(destGradientVelocity);
		return destGradientVelocity;
	}

	/**
	*渐变速度Z。
	*/
	__getset(0,__proto,'gradientZ',function(){
		return this._gradientZ;
	});

	/**固定速度。*/
	__getset(0,__proto,'constant',function(){
		return this._constant;
	});

	/**
	*生命周期速度类型，0常量模式，1曲线模式，2随机双常量模式，3随机双曲线模式。
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	/**
	*渐变最大速度X。
	*/
	__getset(0,__proto,'gradientXMax',function(){
		return this._gradientXMax;
	});

	/**最小固定速度。*/
	__getset(0,__proto,'constantMin',function(){
		return this._constantMin;
	});

	/**
	*渐变速度X。
	*/
	__getset(0,__proto,'gradientX',function(){
		return this._gradientX;
	});

	/**
	*渐变速度Y。
	*/
	__getset(0,__proto,'gradientY',function(){
		return this._gradientY;
	});

	/**
	*渐变最小速度X。
	*/
	__getset(0,__proto,'gradientXMin',function(){
		return this._gradientXMin;
	});

	/**最大固定速度。*/
	__getset(0,__proto,'constantMax',function(){
		return this._constantMax;
	});

	/**
	*渐变最小速度Y。
	*/
	__getset(0,__proto,'gradientYMin',function(){
		return this._gradientYMin;
	});

	/**
	*渐变最大速度Y。
	*/
	__getset(0,__proto,'gradientYMax',function(){
		return this._gradientYMax;
	});

	/**
	*渐变最小速度Z。
	*/
	__getset(0,__proto,'gradientZMin',function(){
		return this._gradientZMin;
	});

	/**
	*渐变最大速度Z。
	*/
	__getset(0,__proto,'gradientZMax',function(){
		return this._gradientZMax;
	});

	GradientVelocity.createByConstant=function(constant){
		var gradientVelocity=new GradientVelocity();
		gradientVelocity._type=0;
		gradientVelocity._constant=constant;
		return gradientVelocity;
	}

	GradientVelocity.createByGradient=function(gradientX,gradientY,gradientZ){
		var gradientVelocity=new GradientVelocity();
		gradientVelocity._type=1;
		gradientVelocity._gradientX=gradientX;
		gradientVelocity._gradientY=gradientY;
		gradientVelocity._gradientZ=gradientZ;
		return gradientVelocity;
	}

	GradientVelocity.createByRandomTwoConstant=function(constantMin,constantMax){
		var gradientVelocity=new GradientVelocity();
		gradientVelocity._type=2;
		gradientVelocity._constantMin=constantMin;
		gradientVelocity._constantMax=constantMax;
		return gradientVelocity;
	}

	GradientVelocity.createByRandomTwoGradient=function(gradientXMin,gradientXMax,gradientYMin,gradientYMax,gradientZMin,gradientZMax){
		var gradientVelocity=new GradientVelocity();
		gradientVelocity._type=3;
		gradientVelocity._gradientXMin=gradientXMin;
		gradientVelocity._gradientXMax=gradientXMax;
		gradientVelocity._gradientYMin=gradientYMin;
		gradientVelocity._gradientYMax=gradientYMax;
		gradientVelocity._gradientZMin=gradientZMin;
		gradientVelocity._gradientZMax=gradientZMax;
		return gradientVelocity;
	}

	return GradientVelocity;
})()


/**

*/