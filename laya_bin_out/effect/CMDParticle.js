//class laya.particle.particleUtils.CMDParticle
var CMDParticle=(function(){
	function CMDParticle(){
		/**
		*最大帧
		*/
		this.maxIndex=0;
		/**
		*帧命令数组
		*/
		this.cmds=null;
		/**
		*粒子id
		*/
		this.id=0;
	}

	__class(CMDParticle,'laya.particle.particleUtils.CMDParticle');
	var __proto=CMDParticle.prototype;
	__proto.setCmds=function(cmds){
		this.cmds=cmds;
		this.maxIndex=cmds.length-1;
	}

	return CMDParticle;
})()


/**
*@private
*/
