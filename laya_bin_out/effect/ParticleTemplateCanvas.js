//class laya.particle.ParticleTemplateCanvas extends laya.particle.ParticleTemplateBase
var ParticleTemplateCanvas=(function(_super){
	function ParticleTemplateCanvas(particleSetting){
		/**
		*是否处于可播放状态
		*/
		this._ready=false;
		/**
		*贴图列表
		*/
		this.textureList=[];
		/**
		*粒子列表
		*/
		this.particleList=[];
		/**
		*贴图中心偏移x
		*/
		this.pX=0;
		/**
		*贴图中心偏移y
		*/
		this.pY=0;
		/**
		*当前活跃的粒子
		*/
		this.activeParticles=[];
		/**
		*粒子pool
		*/
		this.deadParticles=[];
		/**
		*粒子播放进度列表
		*/
		this.iList=[];
		/**
		*粒子系统使用的最大粒子数
		*/
		this._maxNumParticles=0;
		/**
		*纹理的宽度
		*/
		this.textureWidth=NaN;
		/**
		*宽度倒数
		*/
		this.dTextureWidth=NaN;
		/**
		*是否支持颜色变化
		*/
		this.colorChange=true;
		/**
		*采样步长
		*/
		this.step=1/60;
		this.canvasShader=new CanvasShader();
		ParticleTemplateCanvas.__super.call(this);
		this.settings=particleSetting;
		this._maxNumParticles=particleSetting.maxPartices;
		this.texture=new Texture();
		this.texture.on(/*laya.events.Event.READY*/"ready",this,this._textureLoaded);
		this.texture.load(particleSetting.textureName);
	}

	__class(ParticleTemplateCanvas,'laya.particle.ParticleTemplateCanvas',_super);
	var __proto=ParticleTemplateCanvas.prototype;
	__proto._textureLoaded=function(e){
		this.setTexture(this.texture);
		this._ready=true;
	}

	__proto.clear=function(clearTexture){
		(clearTexture===void 0)&& (clearTexture=true);
		this.deadParticles.length=0;
		this.activeParticles.length=0;
		this.textureList.length=0;
	}

	/**
	*设置纹理
	*@param texture
	*
	*/
	__proto.setTexture=function(texture){
		this.texture=texture;
		this.textureWidth=texture.width;
		this.dTextureWidth=1/this.textureWidth;
		this.pX=-texture.width*0.5;
		this.pY=-texture.height*0.5;
		this.textureList=ParticleTemplateCanvas.changeTexture(texture,this.textureList);
		this.particleList.length=0;
		this.deadParticles.length=0;
		this.activeParticles.length=0;
	}

	/**
	*创建一个粒子数据
	*@return
	*
	*/
	__proto._createAParticleData=function(position,velocity){
		this.canvasShader.u_EndVelocity=this.settings.endVelocity;
		this.canvasShader.u_Gravity=this.settings.gravity;
		this.canvasShader.u_Duration=this.settings.duration;
		var particle;
		particle=ParticleData.Create(this.settings,position,velocity,0);
		this.canvasShader.a_Position=particle.position;
		this.canvasShader.a_Velocity=particle.velocity;
		this.canvasShader.a_StartColor=particle.startColor;
		this.canvasShader.a_EndColor=particle.endColor;
		this.canvasShader.a_SizeRotation=particle.sizeRotation;
		this.canvasShader.a_Radius=particle.radius;
		this.canvasShader.a_Radian=particle.radian;
		this.canvasShader.a_AgeAddScale=particle.durationAddScale;
		this.canvasShader.oSize=this.textureWidth;
		var rst=new CMDParticle();
		var i=0,len=this.settings.duration/(1+particle.durationAddScale);
		var params=[];
		var mStep=NaN;
		for(i=0;i<len;i+=this.step){
			params.push(this.canvasShader.getData(i));
		}
		rst.id=this.particleList.length;
		this.particleList.push(rst);
		rst.setCmds(params);
		return rst;
	}

	__proto.addParticleArray=function(position,velocity){
		if(!this._ready)return;
		var tParticle;
		if(this.particleList.length<this._maxNumParticles){
			tParticle=this._createAParticleData(position,velocity);
			this.iList[tParticle.id]=0;
			this.activeParticles.push(tParticle);
			}else{
			if(this.deadParticles.length>0){
				tParticle=this.deadParticles.pop();
				this.iList[tParticle.id]=0;
				this.activeParticles.push(tParticle);
			}
		}
	}

	__proto.advanceTime=function(passedTime){
		(passedTime===void 0)&& (passedTime=1);
		if(!this._ready)return;
		var particleList=this.activeParticles;
		var pool=this.deadParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tI=0;
		var iList=this.iList;
		for(i=len-1;i>-1;i--){
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			if(tI>=tcmd.maxIndex){
				tI=0;
				particleList.splice(i,1);
				pool.push(tcmd);
				}else{
				tI+=1;
			}
			iList[tcmd.id]=tI;
		}
	}

	__proto.render=function(context,x,y){
		if(!this._ready)return;
		if(this.activeParticles.length<1)return;
		if (this.textureList.length < 2)return;
		if (this.settings.disableColor){
			this.noColorRender(context,x,y);
			}else{
			this.canvasRender(context,x,y);
		}
	}

	__proto.noColorRender=function(context,x,y){
		var particleList=this.activeParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tParam;
		var tAlpha=NaN;
		var px=this.pX,py=this.pY;
		var pw=-px*2,ph=-py*2;
		var tI=0;
		var textureList=this.textureList;
		var iList=this.iList;
		var preAlpha=NaN;
		context.translate(x,y);
		preAlpha=context.globalAlpha;
		for(i=0;i<len;i++){
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			tParam=tcmd.cmds[tI];
			if (!tParam)continue ;
			if ((tAlpha=tParam[1])<=0.01)continue ;
			context.globalAlpha=preAlpha*tAlpha;
			context.drawTextureWithTransform(this.texture,px,py,pw,ph,tParam[2],0,0,1,null);
		}
		context.globalAlpha=preAlpha;
		context.translate(-x,-y);
	}

	__proto.canvasRender=function(context,x,y){
		var particleList=this.activeParticles;
		var i=0,len=particleList.length;
		var tcmd;
		var tParam;
		var tAlpha=NaN;
		var px=this.pX,py=this.pY;
		var pw=-px*2,ph=-py*2;
		var tI=0;
		var textureList=this.textureList;
		var iList=this.iList;
		var preAlpha=NaN;
		var preB;
		context.translate(x,y);
		preAlpha=context.globalAlpha;
		preB=context.globalCompositeOperation;
		context.globalCompositeOperation="lighter";
		for(i=0;i<len;i++){
			tcmd=particleList[i];
			tI=iList[tcmd.id];
			tParam=tcmd.cmds[tI];
			if (!tParam)continue ;
			if ((tAlpha=tParam[1])<=0.01)continue ;
			context.save();
			context.transformByMatrix(tParam[2],0,0);
			if(tParam[3]>0.01){
				context.globalAlpha=preAlpha *tParam[3];
				context.drawTexture(textureList[0],px,py,pw,ph);
			}
			if(tParam[4]>0.01){
				context.globalAlpha=preAlpha *tParam[4];
				context.drawTexture(textureList[1],px,py,pw,ph);
			}
			if(tParam[5]>0.01){
				context.globalAlpha=preAlpha *tParam[5];
				context.drawTexture(textureList[2],px,py,pw,ph);
			}
			context.restore();
		}
		context.globalAlpha=preAlpha;
		context.translate(-x,-y);
		context.globalCompositeOperation=preB;
	}

	ParticleTemplateCanvas.changeTexture=function(texture,rst,settings){
		if(!rst)rst=[];
		rst.length=0;
		if (settings&&settings.disableColor){
			rst.push(texture,texture,texture);
			}else{
			Utils.copyArray(rst,PicTool.getRGBPic(texture));
		}
		return rst;
	}

	return ParticleTemplateCanvas;
})(ParticleTemplateBase)


/**
*@private
*/
