//class laya.webgl.submit.SubmitTexture extends laya.webgl.submit.Submit
var SubmitTexture=(function(_super){
	function SubmitTexture(renderType){
		(renderType===void 0)&& (renderType=10000);
		SubmitTexture.__super.call(this,renderType);
	}

	__class(SubmitTexture,'laya.webgl.submit.SubmitTexture',_super);
	var __proto=SubmitTexture.prototype;
	__proto.clone=function(context,mesh,pos){
		var o=SubmitTexture._poolSize ? SubmitTexture.POOL[--SubmitTexture._poolSize] :new SubmitTexture();
		this._cloneInit(o,context,mesh,pos);
		return o;
	}

	__proto.releaseRender=function(){
		if ((--this._ref)< 1){
			SubmitTexture.POOL[SubmitTexture._poolSize++]=this;
			this.shaderValue.release();
			this._mesh=null;
			this._parent && (this._parent.releaseRender(),this._parent=null);
		}
	}

	__proto.renderSubmit=function(){
		if (this._numEle===0)
			return 1;
		var tex=this.shaderValue.textureHost;
		if(tex){
			var source=tex?tex._getSource():null;
			if (!source)return 1;
		};
		var gl=WebGL.mainContext;
		this._mesh.useMesh(gl);
		var lastSubmit=Submit.preRender;
		var prekey=(Submit.preRender)._key;
		if (this._key.blendShader===0 && (this._key.submitType===prekey.submitType && this._key.blendShader===prekey.blendShader)&& BaseShader.activeShader &&
			(Submit.preRender).clipInfoID==this.clipInfoID &&
		lastSubmit.shaderValue.defines._value===this.shaderValue.defines._value &&
		(this.shaderValue.defines._value & ShaderDefines2D.NOOPTMASK)==0){
			(BaseShader.activeShader).uploadTexture2D(source);
		}
		else{
			if (BlendMode.activeBlendFunction!==this._blendFn){
				WebGLContext.setBlend(gl,true);
				this._blendFn(gl);
				BlendMode.activeBlendFunction=this._blendFn;
			}
			this.shaderValue.texture=source;
			this.shaderValue.upload();
		}
		gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._numEle,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._startIdx);
		Stat.renderBatch++;
		Stat.trianglesFaces+=this._numEle / 3;
		return 1;
	}

	SubmitTexture.create=function(context,mesh,sv){
		var o=SubmitTexture._poolSize ? SubmitTexture.POOL[--SubmitTexture._poolSize] :new SubmitTexture(/*laya.webgl.submit.Submit.TYPE_TEXTURE*/10016);
		o._mesh=mesh;
		o._key.clear();
		o._key.submitType=/*laya.webgl.submit.Submit.KEY_DRAWTEXTURE*/2;
		o._ref=1;
		o._startIdx=mesh.indexNum *CONST3D2D.BYTES_PIDX;
		o._numEle=0;
		var blendType=context._nBlendType;
		o._key.blendShader=blendType;
		o._blendFn=context._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
		o.shaderValue=sv;
		if (context._colorFiler){
			var ft=context._colorFiler;
			sv.defines.add(ft.type);
			(sv).colorMat=ft._mat;
			(sv).colorAlpha=ft._alpha;
		}
		return o;
	}

	SubmitTexture._poolSize=0;
	SubmitTexture.POOL=[];
	return SubmitTexture;
})(Submit)


/**
*...
*@author ...
*/
