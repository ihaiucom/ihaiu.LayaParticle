/**
*<code>Particle2D</code> 类是2D粒子播放类
*
*/
//class laya.particle.Particle2D extends laya.display.Sprite
var Particle2D=(function(_super){
	function Particle2D(setting){
		/**@private */
		this._matrix4=[
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1];
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

		if (Render.isConchApp)
		{
			this._particleTemplate=new ParticleTemplate2D(setting);
			var sBlendMode=BlendMode.NAMES[setting.blendState];
			this.blendMode=sBlendMode;
			this.tempCmd=this.graphics._saveToCmd(null,DrawParticleCmd.create.call(this.graphics,this._particleTemplate));
			this._setGraphicsCallBack();
		}
		else
		{
			if (Render.isWebGL)
			{
				this.customRenderEnable=true;
				this._particleTemplate=new ParticleTemplate2D(setting);
				this.graphics._saveToCmd(null,DrawParticleCmd.create(this._particleTemplate));
			}
			else 
			{
				this._particleTemplate=this._canvasTemplate=new ParticleTemplateCanvas(setting);
			}
		}

		if (!this._emitter)
		{
			this._emitter=new Emitter2D(this._particleTemplate);
			
		}
		else 
		{
			(this._emitter).template=this._particleTemplate;
		}

		if (this.autoPlay)
		{
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
//class laya.particle.shader.ParticleShader extends laya.webgl.shader.Shader
var ParticleShader=(function(_super)
{
	//TODO:coverage
	function ParticleShader()
	{
		ParticleShader.__super.call(
			this,ParticleShader.vs,
			ParticleShader.ps,
			"ParticleShader",
			null,
			['a_CornerTextureCoordinate',0,'a_Position',1,'a_Velocity',2,'a_StartColor',3,
		'a_EndColor',4,'a_SizeRotation',5,'a_Radius',6,'a_Radian',7,'a_AgeAddScale',8,'a_Time',9]);
	}

	__class(ParticleShader,'laya.particle.shader.ParticleShader',_super);
	__static(ParticleShader,
	['vs',function(){return this.vs="attribute vec4 a_CornerTextureCoordinate;\nattribute vec3 a_Position;\nattribute vec3 a_Velocity;\nattribute vec4 a_StartColor;\nattribute vec4 a_EndColor;\nattribute vec3 a_SizeRotation;\nattribute vec2 a_Radius;\nattribute vec4 a_Radian;\nattribute float a_AgeAddScale;\nattribute float a_Time;\n\nvarying vec4 v_Color;\nvarying vec2 v_TextureCoordinate;\n\nuniform float u_CurrentTime;\nuniform float u_Duration;\nuniform float u_EndVelocity;\nuniform vec3 u_Gravity;\n\nuniform vec2 size;\nuniform mat4 u_mmat;\n\nvec4 ComputeParticlePosition(in vec3 position, in vec3 velocity,in float age,in float normalizedAge)\n{\n\n   float startVelocity = length(velocity);//起始标量速度\n   float endVelocity = startVelocity * u_EndVelocity;//结束标量速度\n\n   float velocityIntegral = startVelocity * normalizedAge +(endVelocity - startVelocity) * normalizedAge *normalizedAge/2.0;//计算当前速度的标量（单位空间），vt=v0*t+(1/2)*a*(t^2)\n   \n   vec3 addPosition = normalize(velocity) * velocityIntegral * u_Duration;//计算受自身速度影响的位置，转换标量到矢量    \n   addPosition += u_Gravity * age * normalizedAge;//计算受重力影响的位置\n   \n   float radius=mix(a_Radius.x, a_Radius.y, normalizedAge); //计算粒子受半径和角度影响（无需计算角度和半径时，可用宏定义优化屏蔽此计算）\n   float radianHorizontal =mix(a_Radian.x,a_Radian.z,normalizedAge);\n   float radianVertical =mix(a_Radian.y,a_Radian.w,normalizedAge);\n   \n   float r =cos(radianVertical)* radius;\n   addPosition.y += sin(radianVertical) * radius;\n	\n   addPosition.x += cos(radianHorizontal) *r;\n   addPosition.z += sin(radianHorizontal) *r;\n  \n   addPosition.y=-addPosition.y;//2D粒子位置更新需要取负，2D粒子坐标系Y轴正向朝上\n   position+=addPosition;\n   return  vec4(position,1.0);\n}\n\nfloat ComputeParticleSize(in float startSize,in float endSize, in float normalizedAge)\n{    \n    float size = mix(startSize, endSize, normalizedAge);\n    return size;\n}\n\nmat2 ComputeParticleRotation(in float rot,in float age)\n{    \n    float rotation =rot * age;\n    //计算2x2旋转矩阵.\n    float c = cos(rotation);\n    float s = sin(rotation);\n    return mat2(c, -s, s, c);\n}\n\nvec4 ComputeParticleColor(in vec4 startColor,in vec4 endColor,in float normalizedAge)\n{\n	vec4 color=mix(startColor,endColor,normalizedAge);\n    //硬编码设置，使粒子淡入很快，淡出很慢,6.7的缩放因子把置归一在0到1之间，可以谷歌x*(1-x)*(1-x)*6.7的制图表\n    color.a *= normalizedAge * (1.0-normalizedAge) * (1.0-normalizedAge) * 6.7;\n   \n    return color;\n}\n\nvoid main()\n{\n   float age = u_CurrentTime - a_Time;\n   age *= 1.0 + a_AgeAddScale;\n   float normalizedAge = clamp(age / u_Duration,0.0,1.0);\n   gl_Position = ComputeParticlePosition(a_Position, a_Velocity, age, normalizedAge);//计算粒子位置\n   float pSize = ComputeParticleSize(a_SizeRotation.x,a_SizeRotation.y, normalizedAge);\n   mat2 rotation = ComputeParticleRotation(a_SizeRotation.z, age);\n	\n    mat4 mat=u_mmat;\n    gl_Position=vec4((mat*gl_Position).xy,0.0,1.0);\n    gl_Position.xy += (rotation*a_CornerTextureCoordinate.xy) * pSize*vec2(mat[0][0],mat[1][1]);\n    gl_Position=vec4((gl_Position.x/size.x-0.5)*2.0,(0.5-gl_Position.y/size.y)*2.0,0.0,1.0);\n   \n   v_Color = ComputeParticleColor(a_StartColor,a_EndColor, normalizedAge);\n   v_TextureCoordinate =a_CornerTextureCoordinate.zw;\n}\n\n";},'ps',function(){return this.ps="#ifdef FSHIGHPRECISION\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nvarying vec4 v_Color;\nvarying vec2 v_TextureCoordinate;\nuniform sampler2D u_texture;\n\nvoid main()\n{	\n	gl_FragColor=texture2D(u_texture,v_TextureCoordinate)*v_Color;\n	gl_FragColor.xyz *= v_Color.w;\n}";}
	]);
	return ParticleShader;
})(Shader)


