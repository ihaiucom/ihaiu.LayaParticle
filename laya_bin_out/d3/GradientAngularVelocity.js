/**
*<code>GradientRotation</code> 类用于创建渐变角速度。
*/
//class laya.d3.core.particleShuriKen.module.GradientAngularVelocity
var GradientAngularVelocity=(function(){
	function GradientAngularVelocity(){
		/**@private */
		this._type=0;
		/**@private */
		this._separateAxes=false;
		/**@private */
		this._constant=NaN;
		/**@private */
		this._constantSeparate=null;
		/**@private */
		this._gradient=null;
		/**@private */
		this._gradientX=null;
		/**@private */
		this._gradientY=null;
		/**@private */
		this._gradientZ=null;
		/**@private */
		this._gradientW=null;
		/**@private */
		this._constantMin=NaN;
		/**@private */
		this._constantMax=NaN;
		/**@private */
		this._constantMinSeparate=null;
		/**@private */
		this._constantMaxSeparate=null;
		/**@private */
		this._gradientMin=null;
		/**@private */
		this._gradientMax=null;
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
		/**@private */
		this._gradientWMin=null;
		/**@private */
		this._gradientWMax=null;
	}

	__class(GradientAngularVelocity,'laya.d3.core.particleShuriKen.module.GradientAngularVelocity');
	var __proto=GradientAngularVelocity.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientAngularVelocity=destObject;
		destGradientAngularVelocity._type=this._type;
		destGradientAngularVelocity._separateAxes=this._separateAxes;
		destGradientAngularVelocity._constant=this._constant;
		this._constantSeparate.cloneTo(destGradientAngularVelocity._constantSeparate);
		this._gradient.cloneTo(destGradientAngularVelocity._gradient);
		this._gradientX.cloneTo(destGradientAngularVelocity._gradientX);
		this._gradientY.cloneTo(destGradientAngularVelocity._gradientY);
		this._gradientZ.cloneTo(destGradientAngularVelocity._gradientZ);
		destGradientAngularVelocity._constantMin=this._constantMin;
		destGradientAngularVelocity._constantMax=this._constantMax;
		this._constantMinSeparate.cloneTo(destGradientAngularVelocity._constantMinSeparate);
		this._constantMaxSeparate.cloneTo(destGradientAngularVelocity._constantMaxSeparate);
		this._gradientMin.cloneTo(destGradientAngularVelocity._gradientMin);
		this._gradientMax.cloneTo(destGradientAngularVelocity._gradientMax);
		this._gradientXMin.cloneTo(destGradientAngularVelocity._gradientXMin);
		this._gradientXMax.cloneTo(destGradientAngularVelocity._gradientXMax);
		this._gradientYMin.cloneTo(destGradientAngularVelocity._gradientYMin);
		this._gradientYMax.cloneTo(destGradientAngularVelocity._gradientYMax);
		this._gradientZMin.cloneTo(destGradientAngularVelocity._gradientZMin);
		this._gradientZMax.cloneTo(destGradientAngularVelocity._gradientZMax);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destGradientAngularVelocity=/*__JS__ */new this.constructor();
		this.cloneTo(destGradientAngularVelocity);
		return destGradientAngularVelocity;
	}

	/**
	*渐变角速度Z。
	*/
	__getset(0,__proto,'gradientZ',function(){
		return this._gradientZ;
	});

	/**
	*固定角速度。
	*/
	__getset(0,__proto,'constant',function(){
		return this._constant;
	});

	/**
	*渐变角速度。
	*/
	__getset(0,__proto,'gradient',function(){
		return this._gradient;
	});

	/**
	*是否分轴。
	*/
	__getset(0,__proto,'separateAxes',function(){
		return this._separateAxes;
	});

	/**
	*生命周期角速度类型,0常量模式，1曲线模式，2随机双常量模式，3随机双曲线模式。
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	/**
	*分轴固定角速度。
	*/
	__getset(0,__proto,'constantSeparate',function(){
		return this._constantSeparate;
	});

	/**
	*渐变角角速度X。
	*/
	__getset(0,__proto,'gradientX',function(){
		return this._gradientX;
	});

	/**
	*渐变角速度Y。
	*/
	__getset(0,__proto,'gradientY',function(){
		return this._gradientY;
	});

	/**
	*渐变角速度Z。
	*/
	__getset(0,__proto,'gradientW',function(){
		return this._gradientW;
	});

	/**
	*最小渐变角速度。
	*/
	__getset(0,__proto,'gradientMin',function(){
		return this._gradientMin;
	});

	/**
	*最小随机双固定角速度。
	*/
	__getset(0,__proto,'constantMin',function(){
		return this._constantMin;
	});

	/**
	*最大渐变角速度。
	*/
	__getset(0,__proto,'gradientMax',function(){
		return this._gradientMax;
	});

	/**
	*最大随机双固定角速度。
	*/
	__getset(0,__proto,'constantMax',function(){
		return this._constantMax;
	});

	/**
	*最小渐变角速度Z。
	*/
	__getset(0,__proto,'gradientWMin',function(){
		return this._gradientWMin;
	});

	/**
	*最小分轴随机双固定角速度。
	*/
	__getset(0,__proto,'constantMinSeparate',function(){
		return this._constantMinSeparate;
	});

	/**
	*最大分轴随机双固定角速度。
	*/
	__getset(0,__proto,'constantMaxSeparate',function(){
		return this._constantMaxSeparate;
	});

	/**
	*最小渐变角速度X。
	*/
	__getset(0,__proto,'gradientXMin',function(){
		return this._gradientXMin;
	});

	/**
	*最大渐变角速度X。
	*/
	__getset(0,__proto,'gradientXMax',function(){
		return this._gradientXMax;
	});

	/**
	*最大渐变角速度Z。
	*/
	__getset(0,__proto,'gradientWMax',function(){
		return this._gradientWMax;
	});

	/**
	*最小渐变角速度Y。
	*/
	__getset(0,__proto,'gradientYMin',function(){
		return this._gradientYMin;
	});

	/**
	*最大渐变角速度Y。
	*/
	__getset(0,__proto,'gradientYMax',function(){
		return this._gradientYMax;
	});

	/**
	*最小渐变角速度Z。
	*/
	__getset(0,__proto,'gradientZMin',function(){
		return this._gradientZMin;
	});

	/**
	*最大渐变角速度Z。
	*/
	__getset(0,__proto,'gradientZMax',function(){
		return this._gradientZMax;
	});

	GradientAngularVelocity.createByConstant=function(constant){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=0;
		gradientAngularVelocity._separateAxes=false;
		gradientAngularVelocity._constant=constant;
		return gradientAngularVelocity;
	}

	GradientAngularVelocity.createByConstantSeparate=function(separateConstant){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=0;
		gradientAngularVelocity._separateAxes=true;
		gradientAngularVelocity._constantSeparate=separateConstant;
		return gradientAngularVelocity;
	}

	GradientAngularVelocity.createByGradient=function(gradient){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=1;
		gradientAngularVelocity._separateAxes=false;
		gradientAngularVelocity._gradient=gradient;
		return gradientAngularVelocity;
	}

	GradientAngularVelocity.createByGradientSeparate=function(gradientX,gradientY,gradientZ){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=1;
		gradientAngularVelocity._separateAxes=true;
		gradientAngularVelocity._gradientX=gradientX;
		gradientAngularVelocity._gradientY=gradientY;
		gradientAngularVelocity._gradientZ=gradientZ;
		return gradientAngularVelocity;
	}

	GradientAngularVelocity.createByRandomTwoConstant=function(constantMin,constantMax){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=2;
		gradientAngularVelocity._separateAxes=false;
		gradientAngularVelocity._constantMin=constantMin;
		gradientAngularVelocity._constantMax=constantMax;
		return gradientAngularVelocity;
	}

	GradientAngularVelocity.createByRandomTwoConstantSeparate=function(separateConstantMin,separateConstantMax){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=2;
		gradientAngularVelocity._separateAxes=true;
		gradientAngularVelocity._constantMinSeparate=separateConstantMin;
		gradientAngularVelocity._constantMaxSeparate=separateConstantMax;
		return gradientAngularVelocity;
	}

	GradientAngularVelocity.createByRandomTwoGradient=function(gradientMin,gradientMax){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=3;
		gradientAngularVelocity._separateAxes=false;
		gradientAngularVelocity._gradientMin=gradientMin;
		gradientAngularVelocity._gradientMax=gradientMax;
		return gradientAngularVelocity;
	}

	GradientAngularVelocity.createByRandomTwoGradientSeparate=function(gradientXMin,gradientXMax,gradientYMin,gradientYMax,gradientZMin,gradientZMax,gradientWMin,gradientWMax){
		var gradientAngularVelocity=new GradientAngularVelocity();
		gradientAngularVelocity._type=3;
		gradientAngularVelocity._separateAxes=true;
		gradientAngularVelocity._gradientXMin=gradientXMin;
		gradientAngularVelocity._gradientXMax=gradientXMax;
		gradientAngularVelocity._gradientYMin=gradientYMin;
		gradientAngularVelocity._gradientYMax=gradientYMax;
		gradientAngularVelocity._gradientZMin=gradientZMin;
		gradientAngularVelocity._gradientZMax=gradientZMax;
		gradientAngularVelocity._gradientWMin=gradientWMin;
		gradientAngularVelocity._gradientWMax=gradientWMax;
		return gradientAngularVelocity;
	}

	return GradientAngularVelocity;
})()


/**
*@private

*/