//class laya.webgl.submit.SubmitTarget
var SubmitTarget=(function(){
	function SubmitTarget(){
		this._mesh=null;
		//代替 _vb,_ib
		this._startIdx=0;
		this._numEle=0;
		this.shaderValue=null;
		this.blendType=0;
		this._ref=1;
		//public var scope:SubmitCMDScope;
		this.srcRT=null;
		this._key=new SubmitKey();
	}

	__class(SubmitTarget,'laya.webgl.submit.SubmitTarget');
	var __proto=SubmitTarget.prototype;
	Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
	__proto.renderSubmit=function(){
		var gl=WebGL.mainContext;
		this._mesh.useMesh(gl);
		var target=this.srcRT;
		if (target){
			this.shaderValue.texture=target._getSource();
			this.shaderValue.upload();
			this.blend();
			Stat.renderBatch++;
			Stat.trianglesFaces+=this._numEle/3;
			WebGL.mainContext.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._numEle,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._startIdx);
		}
		return 1;
	}

	__proto.blend=function(){
		if (BlendMode.activeBlendFunction!==BlendMode.fns[this.blendType]){
			var gl=WebGL.mainContext;
			gl.enable(/*laya.webgl.WebGLContext.BLEND*/0x0BE2);
			BlendMode.fns[this.blendType](gl);
			BlendMode.activeBlendFunction=BlendMode.fns[this.blendType];
		}
	}

	//TODO:coverage
	__proto.getRenderType=function(){
		return 0;
	}

	__proto.releaseRender=function(){
		if ((--this._ref)< 1){
			var pool=SubmitTarget.POOL;
			pool[pool._length++]=this;
		}
	}

	//TODO:coverage
	__proto.reUse=function(context,pos){
		this._startIdx=pos;
		this._ref++;
		return pos;
	}

	SubmitTarget.create=function(context,mesh,sv,rt){
		var o=SubmitTarget.POOL._length?SubmitTarget.POOL[--SubmitTarget.POOL._length]:new SubmitTarget();
		o._mesh=mesh;
		o.srcRT=rt;
		o._startIdx=mesh.indexNum *CONST3D2D.BYTES_PIDX;
		o._ref=1;
		o._key.clear();
		o._numEle=0;
		o.blendType=context._nBlendType;
		o._key.blendShader=o.blendType;
		o.shaderValue=sv;
		o.shaderValue.setValue(context._shader2D);
		if (context._colorFiler){
			var ft=context._colorFiler;
			sv.defines.add(ft.type);
			(sv).colorMat=ft._mat;
			(sv).colorAlpha=ft._alpha;
		}
		return o;
	}

	SubmitTarget.POOL=(SubmitTarget.POOL=[],SubmitTarget.POOL._length=0,SubmitTarget.POOL);
	return SubmitTarget;
})()


