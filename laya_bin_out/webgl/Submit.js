//class laya.webgl.submit.Submit
var Submit=(function(){
	function Submit(renderType){
		this.clipInfoID=-1;
		//用来比较clipinfo
		//this._mesh=null;
		//代替 _vb,_ib
		//this._blendFn=null;
		//this._id=0;
		//protected var _isSelfVb:Boolean=false;
		//this._renderType=0;
		//this._parent=null;
		// 从VB中什么地方开始画，画到哪
		//this._startIdx=0;
		//indexbuffer 的偏移，单位是byte
		this._numEle=0;
		this._ref=1;
		//this.shaderValue=null;
		this._key=new SubmitKey();
		(renderType===void 0)&& (renderType=10000);
		this._renderType=renderType;
		this._id=++Submit.ID;
	}

	__class(Submit,'laya.webgl.submit.Submit');
	var __proto=Submit.prototype;
	Laya.imps(__proto,{"laya.webgl.submit.ISubmit":true})
	//TODO:coverage
	__proto.getID=function(){
		return this._id;
	}

	__proto.releaseRender=function(){
		if (Submit.RENDERBASE==this)
			return;
		if((--this._ref)<1){
			Submit.POOL[Submit._poolSize++]=this;
			this.shaderValue.release();
			this.shaderValue=null;
			this._mesh=null;
			this._parent && (this._parent.releaseRender(),this._parent=null);
		}
	}

	//TODO:coverage
	__proto.getRenderType=function(){
		return this._renderType;
	}

	__proto.renderSubmit=function(){
		if (this._numEle===0 || !this._mesh || this._numEle==0)return 1;
		var _tex=this.shaderValue.textureHost;
		if (_tex){
			var source=_tex._getSource();
			if (!source)
				return 1;
			this.shaderValue.texture=source;
		};
		var gl=WebGL.mainContext;
		this._mesh.useMesh(gl);
		this.shaderValue.upload();
		if (BlendMode.activeBlendFunction!==this._blendFn){
			WebGLContext.setBlend(gl,true);
			this._blendFn(gl);
			BlendMode.activeBlendFunction=this._blendFn;
		}
		gl.drawElements(/*laya.webgl.WebGLContext.TRIANGLES*/0x0004,this._numEle,/*laya.webgl.WebGLContext.UNSIGNED_SHORT*/0x1403,this._startIdx);
		Stat.renderBatch++;
		Stat.trianglesFaces+=this._numEle / 3;
		return 1;
	}

	//TODO:coverage
	__proto._cloneInit=function(o,context,mesh,pos){;
		o._ref=1;
		o._mesh=mesh;
		o._id=this._id;
		o._key.copyFrom(this._key);
		o._parent=this;
		o._blendFn=this._blendFn;
		o._renderType=this._renderType;
		o._startIdx=pos *CONST3D2D.BYTES_PIDX;
		o._numEle=this._numEle;
		o.shaderValue=this.shaderValue;
		this.shaderValue.ref++;
		this._ref++;
	}

	//TODO:coverage
	__proto.clone=function(context,mesh,pos){;
		return null;
	}

	//TODO:coverage
	__proto.reUse=function(context,pos){;
		return 0;
	}

	//TODO:coverage
	__proto.toString=function(){
		return "ibindex:"+this._startIdx+" num:"+this._numEle+" key="+this._key;
	}

	Submit.__init__=function(){
		var s=Submit.RENDERBASE=new Submit(-1);
		s.shaderValue=new Value2D(0,0);
		s.shaderValue.ALPHA=1;
		s._ref=0xFFFFFFFF;
	}

	Submit.create=function(context,mesh,sv){;
		var o=Submit._poolSize ? Submit.POOL[--Submit._poolSize] :new Submit();
		o._ref=1;
		o._mesh=mesh;
		o._key.clear();
		o._startIdx=mesh.indexNum *CONST3D2D.BYTES_PIDX;
		o._numEle=0;
		var blendType=context._nBlendType;
		o._blendFn=context._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
		o.shaderValue=sv;
		o.shaderValue.setValue(context._shader2D);
		var filters=context._shader2D.filters;
		filters && o.shaderValue.setFilters(filters);
		return o;
	}

	Submit.createShape=function(ctx,mesh,numEle,sv){
		var o=Submit._poolSize ? Submit.POOL[--Submit._poolSize]:(new Submit());
		o._mesh=mesh;
		o._numEle=numEle;
		o._startIdx=mesh.indexNum *2;
		o._ref=1;
		o.shaderValue=sv;
		o.shaderValue.setValue(ctx._shader2D);
		var blendType=ctx._nBlendType;
		o._key.blendShader=blendType;
		o._blendFn=ctx._targets ? BlendMode.targetFns[blendType] :BlendMode.fns[blendType];
		return o;
	}

	Submit.TYPE_2D=10000;
	Submit.TYPE_CANVAS=10003;
	Submit.TYPE_CMDSETRT=10004;
	Submit.TYPE_CUSTOM=10005;
	Submit.TYPE_BLURRT=10006;
	Submit.TYPE_CMDDESTORYPRERT=10007;
	Submit.TYPE_DISABLESTENCIL=10008;
	Submit.TYPE_OTHERIBVB=10009;
	Submit.TYPE_PRIMITIVE=10010;
	Submit.TYPE_RT=10011;
	Submit.TYPE_BLUR_RT=10012;
	Submit.TYPE_TARGET=10013;
	Submit.TYPE_CHANGE_VALUE=10014;
	Submit.TYPE_SHAPE=10015;
	Submit.TYPE_TEXTURE=10016;
	Submit.TYPE_FILLTEXTURE=10017;
	Submit.KEY_ONCE=-1;
	Submit.KEY_FILLRECT=1;
	Submit.KEY_DRAWTEXTURE=2;
	Submit.KEY_VG=3;
	Submit.KEY_TRIANGLES=4;
	Submit.RENDERBASE=null;
	Submit.ID=1;
	Submit.preRender=null;
	Submit._poolSize=0;
	Submit.POOL=[];
	return Submit;
})()


