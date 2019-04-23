//class laya.particle.ParticleTemplateBase
var ParticleTemplateBase=(function(){
	function ParticleTemplateBase(){
		/**
		*粒子配置数据
		*/
		this.settings=null;
		/**
		*粒子贴图
		*/
		this.texture=null;
	}

	__class(ParticleTemplateBase,'laya.particle.ParticleTemplateBase');
	var __proto=ParticleTemplateBase.prototype;
	/**
	*添加一个粒子
	*@param position 粒子位置
	*@param velocity 粒子速度
	*
	*/
	__proto.addParticleArray=function(position,velocity){}
	return ParticleTemplateBase;
})()


