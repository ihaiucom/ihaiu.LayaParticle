/**
*@private
*/
//class laya.particle.ParticleTemplate2D extends laya.particle.ParticleTemplateWebGL
var ParticleTemplate2D=(function(_super){
	function ParticleTemplate2D(parSetting){
		this.x=0;
		this.y=0;
		this._blendFn=null;
		this._startTime=0;
		this._key={};
		this.sv=new ParticleShaderValue();
		ParticleTemplate2D.__super.call(this,parSetting);
		var _this=this;
		Laya.loader.load(this.settings.textureName,Handler.create(null,function(texture){
			_this.texture=texture;
		}));
		this.sv.u_Duration=this.settings.duration;
		this.sv.u_Gravity=this.settings.gravity;
		this.sv.u_EndVelocity=this.settings.endVelocity;
		this._blendFn=BlendMode.fns[parSetting.blendState];
		if (Render.isConchApp){
			var nSize=MeshParticle2D.const_stride *this.settings.maxPartices *4 *4;
			this._conchMesh=/*__JS__ */new ParamData(nSize,true);
		}
		else{
			this._mesh=MeshParticle2D.getAMesh(this.settings.maxPartices);
		}
		this.initialize();
	}

	__class(ParticleTemplate2D,'laya.particle.ParticleTemplate2D',_super);
	var __proto=ParticleTemplate2D.prototype;
	Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
	//loadContent();
	__proto.getRenderType=function(){return-111}
	__proto.releaseRender=function(){}
	__proto.addParticleArray=function(position,velocity){
		position[0]+=this.x;
		position[1]+=this.y;
		_super.prototype.addParticleArray.call(this,position,velocity);
	}

	/*
	override protected function loadContent():void{
		var indexes:Uint16Array=new Uint16Array(settings.maxPartices *6);
		for (var i:int=0;i < settings.maxPartices;i++){
			indexes[i *6+0]=(i *4+0);
			indexes[i *6+1]=(i *4+1);
			indexes[i *6+2]=(i *4+2);
			indexes[i *6+3]=(i *4+0);
			indexes[i *6+4]=(i *4+2);
			indexes[i *6+5]=(i *4+3);
		}
		_indexBuffer2D.clear();
		_indexBuffer2D.append(indexes);
		_indexBuffer2D.upload();
	}

	*/
	__proto.addNewParticlesToVertexBuffer=function(){
		var _vertexBuffer2D=this._mesh._vb;
		_vertexBuffer2D.clear();
		_vertexBuffer2D.append(this._vertices);
		var start=0;
		if (this._firstNewElement < this._firstFreeElement){
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
			_vertexBuffer2D.subUpload(start,start,start+(this._firstFreeElement-this._firstNewElement)*4 *this._floatCountPerVertex *4);
			}else {
			start=this._firstNewElement *4 *this._floatCountPerVertex *4;
			_vertexBuffer2D.subUpload(start,start,start+(this.settings.maxPartices-this._firstNewElement)*4 *this._floatCountPerVertex *4);
			if (this._firstFreeElement > 0){
				_vertexBuffer2D.setNeedUpload();
				_vertexBuffer2D.subUpload(0,0,this._firstFreeElement *4 *this._floatCountPerVertex *4);
			}
		}
		this._firstNewElement=this._firstFreeElement;
	}

	__proto.renderSubmit=function(){
		if (this.texture&&this.texture.getIsReady()){
			this.update(Laya.timer._delta);
			this.sv.u_CurrentTime=this._currentTime;
			if (this._firstNewElement !=this._firstFreeElement){
				this.addNewParticlesToVertexBuffer();
			}
			this.blend();
			if (this._firstActiveElement !=this._firstFreeElement){
				var gl=WebGL.mainContext;
				this._mesh.useMesh(gl);
				this.sv.u_texture=this.texture._getSource();
				this.sv.upload();
				if (this._firstActiveElement < this._firstFreeElement){
					WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,(this._firstFreeElement-this._firstActiveElement)*6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._firstActiveElement *6 *2);
				}
				else{
					WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,(this.settings.maxPartices-this._firstActiveElement)*6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._firstActiveElement *6 *2);
					if (this._firstFreeElement > 0)
						WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._firstFreeElement *6,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,0);
				}
				Stat.drawCall++;
			}
			this._drawCounter++;
		}
		return 1;
	}

	__proto.updateParticleForNative=function(){
		if (this.texture&&this.texture.getIsReady()){
			this.update(Laya.timer._delta);
			this.sv.u_CurrentTime=this._currentTime;
			if (this._firstNewElement !=this._firstFreeElement){
				this._firstNewElement=this._firstFreeElement;
			}
		}
	}

	__proto.getMesh=function(){
		return this._mesh;
	}

	__proto.getConchMesh=function(){
		return this._conchMesh;
	}

	__proto.getFirstNewElement=function(){
		return this._firstNewElement;
	}

	__proto.getFirstFreeElement=function(){
		return this._firstFreeElement;
	}

	__proto.getFirstActiveElement=function(){
		return this._firstActiveElement;
	}

	__proto.getFirstRetiredElement=function(){
		return this._firstRetiredElement;
	}

	__proto.setFirstFreeElement=function(_value){
		this._firstFreeElement=_value;
	}

	__proto.setFirstNewElement=function(_value){
		this._firstNewElement=_value;
	}

	__proto.addDrawCounter=function(){
		this._drawCounter++;
	}

	__proto.blend=function(){
		if (BlendMode.activeBlendFunction!==this._blendFn){
			var gl=WebGL.mainContext;
			gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
			this._blendFn(gl);
			BlendMode.activeBlendFunction=this._blendFn;
		}
	}

	__proto.dispose=function(){
		if (!Render.isConchApp){
			this._mesh.releaseMesh();
		}
	}

	ParticleTemplate2D.activeBlendType=-1;
	return ParticleTemplate2D;
})(ParticleTemplateWebGL)