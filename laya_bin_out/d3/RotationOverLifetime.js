/**
*<code>RotationOverLifetime</code> 类用于粒子的生命周期旋转。
*/
//class laya.d3.core.particleShuriKen.module.RotationOverLifetime
var RotationOverLifetime=(function(){
	function RotationOverLifetime(angularVelocity){
		/**@private */
		this._angularVelocity=null;
		/**是否启用*/
		this.enbale=false;
		this._angularVelocity=angularVelocity;
	}

	__class(RotationOverLifetime,'laya.d3.core.particleShuriKen.module.RotationOverLifetime');
	var __proto=RotationOverLifetime.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destRotationOverLifetime=destObject;
		this._angularVelocity.cloneTo(destRotationOverLifetime._angularVelocity);
		destRotationOverLifetime.enbale=this.enbale;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destAngularVelocity;
		switch (this._angularVelocity.type){
			case 0:
				if (this._angularVelocity.separateAxes)
					destAngularVelocity=GradientAngularVelocity.createByConstantSeparate(this._angularVelocity.constantSeparate.clone());
				else
				destAngularVelocity=GradientAngularVelocity.createByConstant(this._angularVelocity.constant);
				break ;
			case 1:
				if (this._angularVelocity.separateAxes)
					destAngularVelocity=GradientAngularVelocity.createByGradientSeparate(this._angularVelocity.gradientX.clone(),this._angularVelocity.gradientY.clone(),this._angularVelocity.gradientZ.clone());
				else
				destAngularVelocity=GradientAngularVelocity.createByGradient(this._angularVelocity.gradient.clone());
				break ;
			case 2:
				if (this._angularVelocity.separateAxes)
					destAngularVelocity=GradientAngularVelocity.createByRandomTwoConstantSeparate(this._angularVelocity.constantMinSeparate.clone(),this._angularVelocity.constantMaxSeparate.clone());
				else
				destAngularVelocity=GradientAngularVelocity.createByRandomTwoConstant(this._angularVelocity.constantMin,this._angularVelocity.constantMax);
				break ;
			case 3:
				if (this._angularVelocity.separateAxes)
					destAngularVelocity=GradientAngularVelocity.createByRandomTwoGradientSeparate(this._angularVelocity.gradientXMin.clone(),this._angularVelocity.gradientYMin.clone(),this._angularVelocity.gradientZMin.clone(),this._angularVelocity.gradientWMin.clone(),this._angularVelocity.gradientXMax.clone(),this._angularVelocity.gradientYMax.clone(),this._angularVelocity.gradientZMax.clone(),this._angularVelocity.gradientWMax.clone());
				else
				destAngularVelocity=GradientAngularVelocity.createByRandomTwoGradient(this._angularVelocity.gradientMin.clone(),this._angularVelocity.gradientMax.clone());
				break ;
			};
		var destRotationOverLifetime=/*__JS__ */new this.constructor(destAngularVelocity);
		destRotationOverLifetime.enbale=this.enbale;
		return destRotationOverLifetime;
	}

	/**
	*获取角速度。
	*/
	__getset(0,__proto,'angularVelocity',function(){
		return this._angularVelocity;
	});

	return RotationOverLifetime;
})()


/**

*/