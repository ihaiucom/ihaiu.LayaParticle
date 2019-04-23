/**
*<code>VelocityOverLifetime</code> 类用于粒子的生命周期速度。
*/
//class laya.d3.core.particleShuriKen.module.VelocityOverLifetime
var VelocityOverLifetime=(function(){
	function VelocityOverLifetime(velocity){
		/**@private */
		this._velocity=null;
		/**是否启用*/
		this.enbale=false;
		/**速度空间,0为local,1为world。*/
		this.space=0;
		this._velocity=velocity;
	}

	__class(VelocityOverLifetime,'laya.d3.core.particleShuriKen.module.VelocityOverLifetime');
	var __proto=VelocityOverLifetime.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destVelocityOverLifetime=destObject;
		this._velocity.cloneTo(destVelocityOverLifetime._velocity);
		destVelocityOverLifetime.enbale=this.enbale;
		destVelocityOverLifetime.space=this.space;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destVelocity;
		switch(this._velocity.type){
			case 0:
				destVelocity=GradientVelocity.createByConstant(this._velocity.constant.clone());
				break ;
			case 1:
				destVelocity=GradientVelocity.createByGradient(this._velocity.gradientX.clone(),this._velocity.gradientY.clone(),this._velocity.gradientZ.clone());
				break ;
			case 2:
				destVelocity=GradientVelocity.createByRandomTwoConstant(this._velocity.constantMin.clone(),this._velocity.constantMax.clone());
				break ;
			case 3:
				destVelocity=GradientVelocity.createByRandomTwoGradient(this._velocity.gradientXMin.clone(),this._velocity.gradientYMin.clone(),this._velocity.gradientZMin.clone(),this._velocity.gradientXMax.clone(),this._velocity.gradientYMax.clone(),this._velocity.gradientZMax.clone());
				break ;
			};
		var destVelocityOverLifetime=/*__JS__ */new this.constructor(destVelocity);
		destVelocityOverLifetime.enbale=this.enbale;
		destVelocityOverLifetime.space=this.space;
		return destVelocityOverLifetime;
	}

	/**
	*获取尺寸。
	*/
	__getset(0,__proto,'velocity',function(){
		return this._velocity;
	});

	return VelocityOverLifetime;
})()


/**

*/