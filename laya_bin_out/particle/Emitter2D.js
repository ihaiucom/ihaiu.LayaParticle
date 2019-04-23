/**
*
*@private
*/
//class laya.particle.emitter.Emitter2D extends laya.particle.emitter.EmitterBase
var Emitter2D=(function(_super){
	function Emitter2D(_template){
		this.setting=null;
		this._posRange=null;
		this._canvasTemplate=null;
		this._emitFun=null;
		Emitter2D.__super.call(this);
		this.template=_template;
	}

	__class(Emitter2D,'laya.particle.emitter.Emitter2D',_super);
	var __proto=Emitter2D.prototype;
	__proto.emit=function(){
		_super.prototype.emit.call(this);
		if(this._emitFun!=null)
			this._emitFun();
	}

	__proto.getRandom=function(value){
		return (Math.random()*2-1)*value;
	}

	__proto.webGLEmit=function(){
		var pos=new Float32Array(3);
		pos[0]=this.getRandom(this._posRange[0]);
		pos[1]=this.getRandom(this._posRange[1]);
		pos[2]=this.getRandom(this._posRange[2]);
		var v=new Float32Array(3);
		v[0]=0;
		v[1]=0;
		v[2]=0;
		this._particleTemplate.addParticleArray(pos,v);
	}

	__proto.canvasEmit=function(){
		var pos=new Float32Array(3);
		pos[0]=this.getRandom(this._posRange[0]);
		pos[1]=this.getRandom(this._posRange[1]);
		pos[2]=this.getRandom(this._posRange[2]);
		var v=new Float32Array(3);
		v[0]=0;
		v[1]=0;
		v[2]=0;
		this._particleTemplate.addParticleArray(pos,v);
	}

	__getset(0,__proto,'template',function(){
		return this._particleTemplate;
		},function(template){
		this._particleTemplate=template;
		if (!template){
			this._emitFun=null;
			this.setting=null;
			this._posRange=null;
		};
		this.setting=template.settings;
		this._posRange=this.setting.positionVariance;
		if((this._particleTemplate instanceof laya.particle.ParticleTemplate2D )){
			this._emitFun=this.webGLEmit;
		}else
		if((this._particleTemplate instanceof laya.particle.ParticleTemplateCanvas )){
			this._canvasTemplate=template;
			this._emitFun=this.canvasEmit;
		}
	});

	return Emitter2D;
})(EmitterBase)

