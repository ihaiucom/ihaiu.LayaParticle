/**
*<code>Burst</code> 类用于粒子的爆裂描述。
*/
//class laya.d3.core.particleShuriKen.module.Burst
var Burst=(function(){
	function Burst(time,minCount,maxCount){
		/**@private 爆裂时间,单位为秒。*/
		this._time=NaN;
		/**@private 爆裂的最小数量。*/
		this._minCount=0;
		/**@private 爆裂的最大数量。*/
		this._maxCount=0;
		this._time=time;
		this._minCount=minCount;
		this._maxCount=maxCount;
	}

	__class(Burst,'laya.d3.core.particleShuriKen.module.Burst');
	var __proto=Burst.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true})
	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destBurst=destObject;
		destBurst._time=this._time
		destBurst._minCount=this._minCount;
		destBurst._maxCount=this._maxCount;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destBurst=/*__JS__ */new this.constructor();
		this.cloneTo(destBurst);
		return destBurst;
	}

	/**
	*获取爆裂时间,单位为秒。
	*@return 爆裂时间,单位为秒。
	*/
	__getset(0,__proto,'time',function(){
		return this._time;
	});

	/**
	*获取爆裂的最小数量。
	*@return 爆裂的最小数量。
	*/
	__getset(0,__proto,'minCount',function(){
		return this._minCount;
	});

	/**
	*获取爆裂的最大数量。
	*@return 爆裂的最大数量。
	*/
	__getset(0,__proto,'maxCount',function(){
		return this._maxCount;
	});

	return Burst;
})()


/**

*/