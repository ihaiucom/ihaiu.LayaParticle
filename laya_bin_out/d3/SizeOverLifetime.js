/**
*<code>SizeOverLifetime</code> 类用于粒子的生命周期尺寸。
*/
//class laya.d3.core.particleShuriKen.module.SizeOverLifetime
var SizeOverLifetime=(function(){
	function SizeOverLifetime(size){
		/**@private */
		this._size=null;
		/**是否启用*/
		this.enbale=false;
		this._size=size;
	}

	__class(SizeOverLifetime,'laya.d3.core.particleShuriKen.module.SizeOverLifetime');
	var __proto=SizeOverLifetime.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destSizeOverLifetime=destObject;
		this._size.cloneTo(destSizeOverLifetime._size);
		destSizeOverLifetime.enbale=this.enbale;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destSize;
		switch (this._size.type){
			case 0:
				if (this._size.separateAxes)
					destSize=GradientSize.createByGradientSeparate(this._size.gradientX.clone(),this._size.gradientY.clone(),this._size.gradientZ.clone());
				else
				destSize=GradientSize.createByGradient(this._size.gradient.clone());
				break ;
			case 1:
				if (this._size.separateAxes)
					destSize=GradientSize.createByRandomTwoConstantSeparate(this._size.constantMinSeparate.clone(),this._size.constantMaxSeparate.clone());
				else
				destSize=GradientSize.createByRandomTwoConstant(this._size.constantMin,this._size.constantMax);
				break ;
			case 2:
				if (this._size.separateAxes)
					destSize=GradientSize.createByRandomTwoGradientSeparate(this._size.gradientXMin.clone(),this._size.gradientYMin.clone(),this._size.gradientZMin.clone(),this._size.gradientXMax.clone(),this._size.gradientYMax.clone(),this._size.gradientZMax.clone());
				else
				destSize=GradientSize.createByRandomTwoGradient(this._size.gradientMin.clone(),this._size.gradientMax.clone());
				break ;
			};
		var destSizeOverLifetime=/*__JS__ */new this.constructor(destSize);
		destSizeOverLifetime.enbale=this.enbale;
		return destSizeOverLifetime;
	}

	/**
	*获取尺寸。
	*/
	__getset(0,__proto,'size',function(){
		return this._size;
	});

	return SizeOverLifetime;
})()


/**

*/