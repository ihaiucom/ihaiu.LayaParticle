/**
*<code>GradientColor</code> 类用于创建渐变颜色。
*/
//class laya.d3.core.particleShuriKen.module.GradientColor
var GradientColor=(function(){
	function GradientColor(){
		/**@private */
		this._type=0;
		/**@private */
		this._constant=null;
		/**@private */
		this._constantMin=null;
		/**@private */
		this._constantMax=null;
		/**@private */
		this._gradient=null;
		/**@private */
		this._gradientMin=null;
		/**@private */
		this._gradientMax=null;
	}

	__class(GradientColor,'laya.d3.core.particleShuriKen.module.GradientColor');
	var __proto=GradientColor.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientColor=destObject;
		destGradientColor._type=this._type;
		this._constant.cloneTo(destGradientColor._constant);
		this._constantMin.cloneTo(destGradientColor._constantMin);
		this._constantMax.cloneTo(destGradientColor._constantMax);
		this._gradient.cloneTo(destGradientColor._gradient);
		this._gradientMin.cloneTo(destGradientColor._gradientMin);
		this._gradientMax.cloneTo(destGradientColor._gradientMax);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destGradientColor=/*__JS__ */new this.constructor();
		this.cloneTo(destGradientColor);
		return destGradientColor;
	}

	/**
	*渐变颜色。
	*/
	__getset(0,__proto,'gradient',function(){
		return this._gradient;
	});

	/**
	*固定颜色。
	*/
	__getset(0,__proto,'constant',function(){
		return this._constant;
	});

	/**
	*生命周期颜色类型,0为固定颜色模式,1渐变模式,2为随机双固定颜色模式,3随机双渐变模式。
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	/**
	*最小渐变颜色。
	*/
	__getset(0,__proto,'gradientMin',function(){
		return this._gradientMin;
	});

	/**
	*最小固定颜色。
	*/
	__getset(0,__proto,'constantMin',function(){
		return this._constantMin;
	});

	/**
	*最大渐变颜色。
	*/
	__getset(0,__proto,'gradientMax',function(){
		return this._gradientMax;
	});

	/**
	*最大固定颜色。
	*/
	__getset(0,__proto,'constantMax',function(){
		return this._constantMax;
	});

	GradientColor.createByConstant=function(constant){
		var gradientColor=new GradientColor();
		gradientColor._type=0;
		gradientColor._constant=constant;
		return gradientColor;
	}

	GradientColor.createByGradient=function(gradient){
		var gradientColor=new GradientColor();
		gradientColor._type=1;
		gradientColor._gradient=gradient;
		return gradientColor;
	}

	GradientColor.createByRandomTwoConstant=function(minConstant,maxConstant){
		var gradientColor=new GradientColor();
		gradientColor._type=2;
		gradientColor._constantMin=minConstant;
		gradientColor._constantMax=maxConstant;
		return gradientColor;
	}

	GradientColor.createByRandomTwoGradient=function(minGradient,maxGradient){
		var gradientColor=new GradientColor();
		gradientColor._type=3;
		gradientColor._gradientMin=minGradient;
		gradientColor._gradientMax=maxGradient;
		return gradientColor;
	}

	return GradientColor;
})()


/**

*/