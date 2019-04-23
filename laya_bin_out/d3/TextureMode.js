/**
*<code>/**
*<code>/**
*<code>GradientSize</code> 类用于创建渐变尺寸。
*/
//class laya.d3.core.particleShuriKen.module.GradientSize
var GradientSize=(function(){
	function GradientSize(){
		/**@private */
		this._type=0;
		/**@private */
		this._separateAxes=false;
		/**@private */
		this._gradient=null;
		/**@private */
		this._gradientX=null;
		/**@private */
		this._gradientY=null;
		/**@private */
		this._gradientZ=null;
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
	}

	__class(GradientSize,'laya.d3.core.particleShuriKen.module.GradientSize');
	var __proto=GradientSize.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*获取最大尺寸。
	*/
	__proto.getMaxSizeInGradient=function(){
		var i=0,n=0;
		var maxSize=-Number.MAX_VALUE;
		switch (this._type){
			case 0:
				if (this._separateAxes){
					for (i=0,n=this._gradientX.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientX.getValueByIndex(i));
					for (i=0,n=this._gradientY.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientY.getValueByIndex(i));
					}else {
					for (i=0,n=this._gradient.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradient.getValueByIndex(i));
				}
				break ;
			case 1:
				if (this._separateAxes){
					maxSize=Math.max(this._constantMinSeparate.x,this._constantMaxSeparate.x);
					maxSize=Math.max(maxSize,this._constantMinSeparate.y);
					maxSize=Math.max(maxSize,this._constantMaxSeparate.y);
					}else {
					maxSize=Math.max(this._constantMin,this._constantMax);
				}
				break ;
			case 2:
				if (this._separateAxes){
					for (i=0,n=this._gradientXMin.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientXMin.getValueByIndex(i));
					for (i=0,n=this._gradientXMax.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientXMax.getValueByIndex(i));
					for (i=0,n=this._gradientYMin.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientYMin.getValueByIndex(i));
					for (i=0,n=this._gradientZMax.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientZMax.getValueByIndex(i));
					}else {
					for (i=0,n=this._gradientMin.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientMin.getValueByIndex(i));
					for (i=0,n=this._gradientMax.gradientCount;i < n;i++)
					maxSize=Math.max(maxSize,this._gradientMax.getValueByIndex(i));
				}
				break ;
			}
		return maxSize;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destGradientSize=destObject;
		destGradientSize._type=this._type;
		destGradientSize._separateAxes=this._separateAxes;
		this._gradient.cloneTo(destGradientSize._gradient);
		this._gradientX.cloneTo(destGradientSize._gradientX);
		this._gradientY.cloneTo(destGradientSize._gradientY);
		this._gradientZ.cloneTo(destGradientSize._gradientZ);
		destGradientSize._constantMin=this._constantMin;
		destGradientSize._constantMax=this._constantMax;
		this._constantMinSeparate.cloneTo(destGradientSize._constantMinSeparate);
		this._constantMaxSeparate.cloneTo(destGradientSize._constantMaxSeparate);
		this._gradientMin.cloneTo(destGradientSize._gradientMin);
		this._gradientMax.cloneTo(destGradientSize._gradientMax);
		this._gradientXMin.cloneTo(destGradientSize._gradientXMin);
		this._gradientXMax.cloneTo(destGradientSize._gradientXMax);
		this._gradientYMin.cloneTo(destGradientSize._gradientYMin);
		this._gradientYMax.cloneTo(destGradientSize._gradientYMax);
		this._gradientZMin.cloneTo(destGradientSize._gradientZMin);
		this._gradientZMax.cloneTo(destGradientSize._gradientZMax);
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destGradientSize=/*__JS__ */new this.constructor();
		this.cloneTo(destGradientSize);
		return destGradientSize;
	}

	/**
	*渐变尺寸Z。
	*/
	__getset(0,__proto,'gradientZ',function(){
		return this._gradientZ;
	});

	/**
	*渐变尺寸。
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
	*生命周期尺寸类型，0曲线模式，1随机双常量模式，2随机双曲线模式。
	*/
	__getset(0,__proto,'type',function(){
		return this._type;
	});

	/**
	*渐变最小尺寸。
	*/
	__getset(0,__proto,'gradientMin',function(){
		return this._gradientMin;
	});

	/**
	*最小随机双固定尺寸。
	*/
	__getset(0,__proto,'constantMin',function(){
		return this._constantMin;
	});

	/**
	*渐变尺寸X。
	*/
	__getset(0,__proto,'gradientX',function(){
		return this._gradientX;
	});

	/**
	*渐变尺寸Y。
	*/
	__getset(0,__proto,'gradientY',function(){
		return this._gradientY;
	});

	/**
	*渐变最大尺寸。
	*/
	__getset(0,__proto,'gradientMax',function(){
		return this._gradientMax;
	});

	/**
	*最大随机双固定尺寸。
	*/
	__getset(0,__proto,'constantMax',function(){
		return this._constantMax;
	});

	/**
	*最小分轴随机双固定尺寸。
	*/
	__getset(0,__proto,'constantMinSeparate',function(){
		return this._constantMinSeparate;
	});

	/**
	*最小分轴随机双固定尺寸。
	*/
	__getset(0,__proto,'constantMaxSeparate',function(){
		return this._constantMaxSeparate;
	});

	/**
	*渐变最小尺寸X。
	*/
	__getset(0,__proto,'gradientXMin',function(){
		return this._gradientXMin;
	});

	/**
	*渐变最大尺寸X。
	*/
	__getset(0,__proto,'gradientXMax',function(){
		return this._gradientXMax;
	});

	/**
	*渐变最小尺寸Y。
	*/
	__getset(0,__proto,'gradientYMin',function(){
		return this._gradientYMin;
	});

	/**
	*渐变最大尺寸Y。
	*/
	__getset(0,__proto,'gradientYMax',function(){
		return this._gradientYMax;
	});

	/**
	*渐变最小尺寸Z。
	*/
	__getset(0,__proto,'gradientZMin',function(){
		return this._gradientZMin;
	});

	/**
	*渐变最大尺寸Z。
	*/
	__getset(0,__proto,'gradientZMax',function(){
		return this._gradientZMax;
	});

	GradientSize.createByGradient=function(gradient){
		var gradientSize=new GradientSize();
		gradientSize._type=0;
		gradientSize._separateAxes=false;
		gradientSize._gradient=gradient;
		return gradientSize;
	}

	GradientSize.createByGradientSeparate=function(gradientX,gradientY,gradientZ){
		var gradientSize=new GradientSize();
		gradientSize._type=0;
		gradientSize._separateAxes=true;
		gradientSize._gradientX=gradientX;
		gradientSize._gradientY=gradientY;
		gradientSize._gradientZ=gradientZ;
		return gradientSize;
	}

	GradientSize.createByRandomTwoConstant=function(constantMin,constantMax){
		var gradientSize=new GradientSize();
		gradientSize._type=1;
		gradientSize._separateAxes=false;
		gradientSize._constantMin=constantMin;
		gradientSize._constantMax=constantMax;
		return gradientSize;
	}

	GradientSize.createByRandomTwoConstantSeparate=function(constantMinSeparate,constantMaxSeparate){
		var gradientSize=new GradientSize();
		gradientSize._type=1;
		gradientSize._separateAxes=true;
		gradientSize._constantMinSeparate=constantMinSeparate;
		gradientSize._constantMaxSeparate=constantMaxSeparate;
		return gradientSize;
	}

	GradientSize.createByRandomTwoGradient=function(gradientMin,gradientMax){
		var gradientSize=new GradientSize();
		gradientSize._type=2;
		gradientSize._separateAxes=false;
		gradientSize._gradientMin=gradientMin;
		gradientSize._gradientMax=gradientMax;
		return gradientSize;
	}

	GradientSize.createByRandomTwoGradientSeparate=function(gradientXMin,gradientXMax,gradientYMin,gradientYMax,gradientZMin,gradientZMax){
		var gradientSize=new GradientSize();
		gradientSize._type=2;
		gradientSize._separateAxes=true;
		gradientSize._gradientXMin=gradientXMin;
		gradientSize._gradientXMax=gradientXMax;
		gradientSize._gradientYMin=gradientYMin;
		gradientSize._gradientYMax=gradientYMax;
		gradientSize._gradientZMin=gradientZMin;
		gradientSize._gradientZMax=gradientZMax;
		return gradientSize;
	}

	return GradientSize;
})()


/**
*@private
*/
//class laya.d3.shader.ShaderDefines
var ShaderDefines=(function(){
	function ShaderDefines(superDefines){
		/**@private */
		this._counter=0;
		/**@private [只读]*/
		this.defines=null;
		if (superDefines){
			this._counter=superDefines._counter;
			this.defines=superDefines.defines.slice();
			}else {
			this._counter=0;
			this.defines=[];
		}
	}

	__class(ShaderDefines,'laya.d3.shader.ShaderDefines');
	var __proto=ShaderDefines.prototype;
	/**
	*@private
	*/
	__proto.registerDefine=function(name){
		var value=Math.pow(2,this._counter++);
		this.defines[value]=name;
		return value;
	}

	return ShaderDefines;
})()


/**
*...
*@author ...
*/
//class laya.d3.core.TextureMode
var TextureMode=(function(){
	function TextureMode(){}
	__class(TextureMode,'laya.d3.core.TextureMode');
	TextureMode.Stretch=0;
	TextureMode.Tile=1;
	return TextureMode;
})()


/**

*/
*/
*/