/**
*<code>EmitterBase</code> 类是粒子发射器类
*/
//class laya.particle.emitter.EmitterBase
var EmitterBase=(function(){
	function EmitterBase(){
		/**
		*积累的帧时间
		*/
		this._frameTime=0;
		/**
		*粒子发射速率
		*/
		this._emissionRate=60;
		/**
		*当前剩余发射时间
		*/
		this._emissionTime=0;
		/**
		*发射粒子最小时间间隔
		*/
		this.minEmissionTime=1 / 60;
		/**@private */
		this._particleTemplate=null;
	}

	__class(EmitterBase,'laya.particle.emitter.EmitterBase');
	var __proto=EmitterBase.prototype;
	/**
	*开始发射粒子
	*@param duration 发射持续的时间(秒)
	*/
	__proto.start=function(duration){
		(duration===void 0)&& (duration=Number.MAX_VALUE);
		if (this._emissionRate !=0)
			this._emissionTime=duration;
	}

	/**
	*停止发射粒子
	*@param clearParticles 是否清理当前的粒子
	*/
	__proto.stop=function(){
		this._emissionTime=0;
	}

	/**
	*清理当前的活跃粒子
	*@param clearTexture 是否清理贴图数据,若清除贴图数据将无法再播放
	*/
	__proto.clear=function(){
		this._emissionTime=0;
	}

	/**
	*发射一个粒子
	*
	*/
	__proto.emit=function(){}
	/**
	*时钟前进
	*@param passedTime 前进时间
	*
	*/
	__proto.advanceTime=function(passedTime){
		(passedTime===void 0)&& (passedTime=1);
		this._emissionTime-=passedTime;
		if (this._emissionTime < 0)return;
		this._frameTime+=passedTime;
		if (this._frameTime < this.minEmissionTime)return;
		while (this._frameTime > this.minEmissionTime){
			this._frameTime-=this.minEmissionTime;
			this.emit();
		}
	}

	/**
	*设置粒子粒子模板
	*@param particleTemplate 粒子模板
	*
	*/
	__getset(0,__proto,'particleTemplate',null,function(particleTemplate){
		this._particleTemplate=particleTemplate;
	});

	/**
	*设置粒子发射速率
	*@param emissionRate 粒子发射速率 (个/秒)
	*/
	/**
	*获取粒子发射速率
	*@return 发射速率 粒子发射速率 (个/秒)
	*/
	__getset(0,__proto,'emissionRate',function(){
		return this._emissionRate;
		},function(_emissionRate){
		if (_emissionRate <=0)return;
		this._emissionRate=_emissionRate;
		(_emissionRate > 0)&& (this.minEmissionTime=1 / _emissionRate);
	});

	return EmitterBase;
})()
