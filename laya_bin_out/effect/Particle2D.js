//class laya.particle.Particle2D extends laya.display.Sprite
var Particle2D=(function(_super){
	function Particle2D(setting){
		/**@private */
		this._matrix4=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
		/**@private */
		this._particleTemplate=null;
		/**@private */
		this._canvasTemplate=null;
		/**@private */
		this._emitter=null;
		/**是否自动播放*/
		this.autoPlay=true;
		this.tempCmd=null;
		Particle2D.__super.call(this);
		this.customRenderEnable=true;
		if (setting)this.setParticleSetting(setting);
	}

	__class(Particle2D,'laya.particle.Particle2D',_super);
	var __proto=Particle2D.prototype;
	/**
	*加载粒子文件
	*@param url 粒子文件地址
	*/
	__proto.load=function(url){
		Laya.loader.load(url,Handler.create(this,this.setParticleSetting),null,/*laya.net.Loader.JSON*/"json");
	}

	/**
	*设置粒子配置数据
	*@param settings 粒子配置数据
	*/
	__proto.setParticleSetting=function(setting){
		if (!setting)return this.stop();
		ParticleSetting.checkSetting(setting);
		if (Render.isConchApp){
			this._particleTemplate=new ParticleTemplate2D(setting);
			var sBlendMode=BlendMode.NAMES[setting.blendState];
			this.blendMode=sBlendMode;
			this.tempCmd=this.graphics._saveToCmd(null,DrawParticleCmd.create.call(this.graphics,this._particleTemplate));
			this._setGraphicsCallBack();
		}
		else{
			if (Render.isWebGL){
				this.customRenderEnable=true;
				this._particleTemplate=new ParticleTemplate2D(setting);
				this.graphics._saveToCmd(null,DrawParticleCmd.create(this._particleTemplate));
			}
			else {
				this._particleTemplate=this._canvasTemplate=new ParticleTemplateCanvas(setting);
			}
		}
		if (!this._emitter){
			this._emitter=new Emitter2D(this._particleTemplate);
			}else {
			(this._emitter).template=this._particleTemplate;
		}
		if (this.autoPlay){
			this.emitter.start();
			this.play();
		}
	}

	/**
	*播放
	*/
	__proto.play=function(){
		Laya.timer.frameLoop(1,this,this._loop);
	}

	/**
	*停止
	*/
	__proto.stop=function(){
		Laya.timer.clear(this,this._loop);
	}

	/**@private */
	__proto._loop=function(){
		this.advanceTime(1 / 60);
	}

	/**
	*时钟前进
	*@param passedTime 时钟前进时间
	*/
	__proto.advanceTime=function(passedTime){
		(passedTime===void 0)&& (passedTime=1);
		if (this._canvasTemplate){
			this._canvasTemplate.advanceTime(passedTime);
		}
		if (this._emitter){
			this._emitter.advanceTime(passedTime);
		}
	}

	__proto.customRender=function(context,x,y){
		if (Render.isWebGL){
			this._matrix4[0]=context._curMat.a;
			this._matrix4[1]=context._curMat.b;
			this._matrix4[4]=context._curMat.c;
			this._matrix4[5]=context._curMat.d;
			this._matrix4[12]=context._curMat.tx;
			this._matrix4[13]=context._curMat.ty;
			var sv=(this._particleTemplate).sv;
			sv.u_mmat=this._matrix4;
		}
		if (this._canvasTemplate){
			this._canvasTemplate.render(context,x,y);
		}
	}

	__proto.destroy=function(destroyChild){
		(destroyChild===void 0)&& (destroyChild=true);
		if ((this._particleTemplate instanceof laya.particle.ParticleTemplate2D ))
			(this._particleTemplate).dispose();
		_super.prototype.destroy.call(this,destroyChild);
	}

	/**
	*设置 粒子文件地址
	*@param path 粒子文件地址
	*/
	__getset(0,__proto,'url',null,function(url){
		this.load(url);
	});

	/**
	*获取粒子发射器
	*/
	__getset(0,__proto,'emitter',function(){
		return this._emitter;
	});

	return Particle2D;
})(Sprite)


/**
*@private
*/
