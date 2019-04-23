/**
*<code>Emission</code> 类用于粒子发射器。
*/
//class laya.d3.core.particleShuriKen.module.Emission
var Emission=(function(){
	function Emission(){
		/**@private */
		this._destroyed=false;
		/**@private 粒子发射速率,每秒发射的个数。*/
		this._emissionRate=0;
		/**@private 粒子的爆裂,不允许修改。*/
		this._bursts=null;
		/**是否启用。*/
		this.enbale=false;
		this._destroyed=false;
		this.emissionRate=10;
		this._bursts=[];
	}

	__class(Emission,'laya.d3.core.particleShuriKen.module.Emission');
	var __proto=Emission.prototype;
	Laya.imps(__proto,{"laya.d3.core.IClone":true,"laya.resource.IDestroy":true})
	/**
	*@private
	*/
	__proto.destroy=function(){
		this._bursts=null;
		this._destroyed=true;
	}

	/**
	*获取粒子爆裂个数。
	*@return 粒子爆裂个数。
	*/
	__proto.getBurstsCount=function(){
		return this._bursts.length;
	}

	/**
	*通过索引获取粒子爆裂。
	*@param index 爆裂索引。
	*@return 粒子爆裂。
	*/
	__proto.getBurstByIndex=function(index){
		return this._bursts[index];
	}

	/**
	*增加粒子爆裂。
	*@param burst 爆裂。
	*/
	__proto.addBurst=function(burst){
		var burstsCount=this._bursts.length;
		if (burstsCount > 0)
			for (var i=0;i < burstsCount;i++){
			if (this._bursts[i].time > burst.time)
				this._bursts.splice(i,0,burst);
		}
		this._bursts.push(burst);
	}

	/**
	*移除粒子爆裂。
	*@param burst 爆裂。
	*/
	__proto.removeBurst=function(burst){
		var index=this._bursts.indexOf(burst);
		if (index!==-1){
			this._bursts.splice(index,1);
		}
	}

	/**
	*通过索引移除粒子爆裂。
	*@param index 爆裂索引。
	*/
	__proto.removeBurstByIndex=function(index){
		this._bursts.splice(index,1);
	}

	/**
	*清空粒子爆裂。
	*/
	__proto.clearBurst=function(){
		this._bursts.length=0;
	}

	/**
	*克隆。
	*@param destObject 克隆源。
	*/
	__proto.cloneTo=function(destObject){
		var destEmission=destObject;
		var destBursts=destEmission._bursts;
		destBursts.length=this._bursts.length;
		for (var i=0,n=this._bursts.length;i < n;i++){
			var destBurst=destBursts[i];
			if (destBurst)
				this._bursts[i].cloneTo(destBurst);
			else
			destBursts[i]=this._bursts[i].clone();
		}
		destEmission._emissionRate=this._emissionRate;
		destEmission.enbale=this.enbale;
	}

	/**
	*克隆。
	*@return 克隆副本。
	*/
	__proto.clone=function(){
		var destEmission=/*__JS__ */new this.constructor();
		this.cloneTo(destEmission);
		return destEmission;
	}

	/**
	*获取是否已销毁。
	*@return 是否已销毁。
	*/
	__getset(0,__proto,'destroyed',function(){
		return this._destroyed;
	});

	/**
	*设置粒子发射速率。
	*@param emissionRate 粒子发射速率 (个/秒)。
	*/
	/**
	*获取粒子发射速率。
	*@return 粒子发射速率 (个/秒)。
	*/
	__getset(0,__proto,'emissionRate',function(){
		return this._emissionRate;
		},function(value){
		if (value < 0)
			throw new Error("ParticleBaseShape:emissionRate value must large or equal than 0.");
		this._emissionRate=value;
	});

	return Emission;
})()


/**

*/